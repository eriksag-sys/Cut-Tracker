import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { WORKOUT_TEMPLATES, PRIORITY_LIFTS } from "../data.js";
import { RATING_CATEGORIES } from "../config.js";
import { dateKey, calcVolume, getSessionVolume, debounce } from "../helpers.js";

export default function TrainTab({ currentDate, workouts, ratings, onSaveWorkout, onSaveRatings }) {
    const dow = currentDate.getDay();
    const dk = dateKey(currentDate);
    const template = WORKOUT_TEMPLATES[dow];
    const workout = workouts[dk] || {};
    const dayRatings = ratings[dk] || {};
    const [expanded, setExpanded] = useState(null);
    const [notes, setNotes] = useState(workout.notes || "");

    // Debounced notes save
    const debouncedSaveNotes = useRef(
        debounce((newNotes) => {
            onSaveWorkout(dk, { ...workouts[dk], notes: newNotes });
        }, 500)
    ).current;

    useEffect(() => {
        setNotes(workout.notes || "");
    }, [dk]);

    const handleNotesChange = (val) => {
        setNotes(val);
        debouncedSaveNotes(val);
    };

    // Get last session data for an exercise
    const getLastSession = useCallback((exerciseName) => {
        const searchDays = 60;
        const d = new Date(currentDate);
        for (let i = 1; i <= searchDays; i++) {
            d.setDate(d.getDate() - 1);
            const k = dateKey(d);
            const w = workouts[k];
            if (w?.lifts?.[exerciseName]) {
                return w.lifts[exerciseName];
            }
        }
        return null;
    }, [currentDate, workouts]);

    const handleSetUpdate = (exName, setIdx, field, value) => {
        const current = { ...workout };
        if (!current.lifts) current.lifts = {};
        if (!current.lifts[exName]) {
            const tmplEx = template?.exercises?.find(e => e.name === exName);
            const numSets = tmplEx?.sets || 3;
            current.lifts[exName] = Array.from({ length: numSets }, () => ({ weight: "", reps: "" }));
        }
        const sets = [...current.lifts[exName]];
        sets[setIdx] = { ...sets[setIdx], [field]: value };
        current.lifts = { ...current.lifts, [exName]: sets };
        onSaveWorkout(dk, current);
    };

    const handleAutoFill = (exName) => {
        const last = getLastSession(exName);
        if (!last) return;
        const current = { ...workout };
        if (!current.lifts) current.lifts = {};
        current.lifts = { ...current.lifts, [exName]: last.map(s => ({ ...s })) };
        onSaveWorkout(dk, current);
    };

    const toggleCompleted = () => {
        onSaveWorkout(dk, { ...workout, completed: !workout.completed });
    };

    const handleRating = (category, value) => {
        const updated = { ...dayRatings, [category]: value };
        onSaveRatings(dk, updated);
    };

    // Session volume
    const sessionVolume = useMemo(() => getSessionVolume(workout), [workout]);

    // Find previous session volume for comparison
    const prevVolume = useMemo(() => {
        const d = new Date(currentDate);
        for (let i = 1; i <= 60; i++) {
            d.setDate(d.getDate() - 1);
            if (d.getDay() === dow) {
                const k = dateKey(d);
                const w = workouts[k];
                if (w) return getSessionVolume(w);
            }
        }
        return null;
    }, [currentDate, workouts, dow]);

    if (!template) {
        return (
            <div className="text-center py-12 text-white/40">
                <div className="text-4xl mb-3">🧘</div>
                <div className="text-sm">Rest day — no workout scheduled</div>
            </div>
        );
    }

    return (
        <div>
            {/* Workout header */}
            <div className="bg-white/5 rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-bold text-sm">{template.name}</div>
                        <div className="text-xs text-white/50">{template.time} · {template.duration}</div>
                    </div>
                    <button onClick={toggleCompleted}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${workout.completed ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/50 hover:bg-white/15"}`}>
                        {workout.completed ? "✅ Done" : "Mark Done"}
                    </button>
                </div>

                {/* Session volume */}
                {sessionVolume > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 text-xs">
                        <span className="text-white/50">Session Volume:</span>
                        <span className="font-bold text-blue-400">{sessionVolume.toLocaleString()} lbs</span>
                        {prevVolume !== null && (
                            <span className={sessionVolume >= prevVolume ? "text-emerald-400" : "text-red-400"}>
                                {sessionVolume >= prevVolume ? "↑" : "↓"} {Math.abs(sessionVolume - prevVolume).toLocaleString()}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Exercises */}
            <div className="space-y-1.5">
                {template.exercises.map((ex) => {
                    const isExpanded = expanded === ex.name;
                    const sets = workout.lifts?.[ex.name] || [];
                    const exVolume = calcVolume(sets);
                    const lastSession = getLastSession(ex.name);
                    return (
                        <div key={ex.name} className={`rounded-xl overflow-hidden ${ex.priority ? "border border-blue-500/30 bg-blue-500/5" : "bg-white/5"}`}>
                            <button onClick={() => setExpanded(isExpanded ? null : ex.name)}
                                className="w-full p-3 text-left flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    {ex.priority && <span className="text-yellow-400 text-xs">⭐</span>}
                                    <span className="text-sm font-medium truncate">{ex.name}</span>
                                    <span className="text-[10px] text-white/40">{ex.sets}×{ex.reps}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {exVolume > 0 && <span className="text-[10px] text-blue-400">{exVolume.toLocaleString()} lbs</span>}
                                    <span className="text-white/30 text-xs">{isExpanded ? "▲" : "▼"}</span>
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="px-3 pb-3">
                                    {lastSession && (
                                        <button onClick={() => handleAutoFill(ex.name)}
                                            className="w-full mb-2 py-1.5 rounded-lg bg-white/5 text-[10px] text-white/50 hover:bg-white/10">
                                            Auto-fill from last session
                                        </button>
                                    )}
                                    <div className="space-y-1.5">
                                        {Array.from({ length: ex.sets }).map((_, si) => {
                                            const setData = sets[si] || {};
                                            return (
                                                <div key={si} className="flex items-center gap-2">
                                                    <span className="text-[10px] text-white/30 w-4">#{si + 1}</span>
                                                    <input type="number" placeholder="lbs" value={setData.weight || ""}
                                                        onChange={e => handleSetUpdate(ex.name, si, "weight", e.target.value)}
                                                        className="flex-1 p-1.5 rounded bg-white/5 border border-white/10 text-xs text-white text-center focus:outline-none focus:border-blue-500" />
                                                    <span className="text-[10px] text-white/30">×</span>
                                                    <input type="number" placeholder="reps" value={setData.reps || ""}
                                                        onChange={e => handleSetUpdate(ex.name, si, "reps", e.target.value)}
                                                        className="w-16 p-1.5 rounded bg-white/5 border border-white/10 text-xs text-white text-center focus:outline-none focus:border-blue-500" />
                                                    {lastSession?.[si] && (
                                                        <span className="text-[10px] text-white/20 whitespace-nowrap">
                                                            prev: {lastSession[si].weight}×{lastSession[si].reps}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Finisher */}
            {template.finisher && (
                <div className="mt-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300">
                    🏃 {template.finisher}
                </div>
            )}

            {/* Notes */}
            <div className="mt-3">
                <textarea placeholder="Workout notes..." value={notes}
                    onChange={e => handleNotesChange(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white resize-none h-20 focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Ratings */}
            <div className="mt-3 bg-white/5 rounded-xl p-3">
                <div className="text-sm font-medium mb-2">Daily Ratings</div>
                <div className="grid grid-cols-2 gap-2">
                    {RATING_CATEGORIES.map(cat => (
                        <div key={cat.id} className="bg-white/5 rounded-lg p-2">
                            <div className="text-[10px] text-white/50 mb-1">{cat.emoji} {cat.label}</div>
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                    <button key={n} onClick={() => handleRating(cat.id, n)}
                                        className={`flex-1 py-0.5 rounded text-[9px] font-bold transition-colors ${dayRatings[cat.id] === n ? "bg-blue-600 text-white" : dayRatings[cat.id] >= n ? "bg-blue-600/30 text-blue-300" : "bg-white/5 text-white/20 hover:bg-white/10"}`}>
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
