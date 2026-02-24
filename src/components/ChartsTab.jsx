import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, ReferenceLine } from "recharts";
import { PRIORITY_LIFTS, WORKOUT_TEMPLATES } from "../data.js";
import { CUT_PLAN_CONFIG } from "../config.js";
import { dateKey, calcVolume, getSessionVolume } from "../helpers.js";

export default function ChartsTab({ weighIns, workouts }) {
    // ---- Weight Chart Data ----
    const weightData = useMemo(() => {
        if (!weighIns || weighIns.length === 0) return [];
        const sorted = [...weighIns].sort((a, b) => new Date(a.date) - new Date(b.date));
        return sorted.map((w, i) => {
            // 3-point rolling average
            const window = sorted.slice(Math.max(0, i - 2), i + 1);
            const avg = window.reduce((s, x) => s + x.weight, 0) / window.length;
            return {
                date: new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                weight: w.weight,
                avg: Math.round(avg * 10) / 10,
                waist: w.waist || null,
            };
        });
    }, [weighIns]);

    // ---- PR Tracking ----
    const allTimePRs = useMemo(() => {
        const prs = {};
        PRIORITY_LIFTS.forEach(lift => { prs[lift.id] = { name: lift.name, weight: 0, date: null }; });
        Object.entries(workouts).forEach(([date, w]) => {
            if (!w?.lifts) return;
            PRIORITY_LIFTS.forEach(lift => {
                const sets = w.lifts[lift.name];
                if (!sets) return;
                sets.forEach(s => {
                    const wt = Number(s.weight);
                    if (wt > prs[lift.id].weight) {
                        prs[lift.id] = { name: lift.name, weight: wt, date };
                    }
                });
            });
        });
        return prs;
    }, [workouts]);

    // ---- Volume Trend Data ----
    const volumeData = useMemo(() => {
        const entries = Object.entries(workouts)
            .filter(([, w]) => w?.lifts)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .slice(-20);
        return entries.map(([date, w]) => ({
            date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            volume: getSessionVolume(w),
            dow: new Date(date).getDay(),
        }));
    }, [workouts]);

    // ---- Per-Lift Volume Trends ----
    const liftVolumeTrends = useMemo(() => {
        const trends = {};
        PRIORITY_LIFTS.forEach(lift => {
            const data = [];
            Object.entries(workouts)
                .filter(([, w]) => w?.lifts?.[lift.name])
                .sort(([a], [b]) => new Date(a) - new Date(b))
                .slice(-10)
                .forEach(([date, w]) => {
                    data.push({
                        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                        volume: calcVolume(w.lifts[lift.name]),
                        maxWeight: Math.max(...w.lifts[lift.name].map(s => Number(s.weight) || 0)),
                    });
                });
            if (data.length > 0) trends[lift.id] = { name: lift.name, data };
        });
        return trends;
    }, [workouts]);

    const tooltipStyle = { backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" };

    return (
        <div className="space-y-4">
            {/* Weight Trend */}
            <div className="bg-white/5 rounded-xl p-3">
                <h3 className="text-sm font-bold mb-3">⚖️ Weight Trend</h3>
                {weightData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <ComposedChart data={weightData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} />
                            <YAxis domain={["dataMin - 2", "dataMax + 2"]} tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <ReferenceLine y={CUT_PLAN_CONFIG.goalWeight} stroke="#22c55e" strokeDasharray="5 5" label={{ value: "Goal", fill: "#22c55e", fontSize: 10 }} />
                            <Line type="monotone" dataKey="weight" stroke="#60a5fa" strokeWidth={1} dot={{ r: 3 }} name="Weight" />
                            <Line type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={2} dot={false} name="3-pt Avg" />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center py-8 text-white/30 text-sm">No weigh-ins yet</div>
                )}
            </div>

            {/* All-Time PRs */}
            <div className="bg-white/5 rounded-xl p-3">
                <h3 className="text-sm font-bold mb-2">🏆 All-Time PRs</h3>
                <div className="grid grid-cols-2 gap-2">
                    {PRIORITY_LIFTS.map(lift => {
                        const pr = allTimePRs[lift.id];
                        return (
                            <div key={lift.id} className="bg-white/5 rounded-lg p-2">
                                <div className="text-[10px] text-white/50 truncate">{lift.name}</div>
                                <div className="text-lg font-bold text-yellow-400">{pr?.weight || "—"}<span className="text-xs text-white/30"> lbs</span></div>
                                {pr?.date && <div className="text-[9px] text-white/30">{new Date(pr.date).toLocaleDateString()}</div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Session Volume Trend */}
            <div className="bg-white/5 rounded-xl p-3">
                <h3 className="text-sm font-bold mb-3">📊 Training Volume Trend</h3>
                {volumeData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={volumeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} />
                            <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} />
                            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v.toLocaleString()} lbs`, "Volume"]} />
                            <Line type="monotone" dataKey="volume" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center py-8 text-white/30 text-sm">No workout data yet</div>
                )}
            </div>

            {/* Per-Lift Volume */}
            {Object.keys(liftVolumeTrends).length > 0 && (
                <div className="bg-white/5 rounded-xl p-3">
                    <h3 className="text-sm font-bold mb-3">💪 Lift Volume Breakdown</h3>
                    {Object.entries(liftVolumeTrends).map(([liftId, { name, data }]) => (
                        <div key={liftId} className="mb-3 last:mb-0">
                            <div className="text-xs text-white/60 mb-1">{name}</div>
                            <ResponsiveContainer width="100%" height={120}>
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} />
                                    <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Line type="monotone" dataKey="volume" stroke="#22c55e" strokeWidth={2} dot={{ r: 2 }} name="Volume" />
                                    <Line type="monotone" dataKey="maxWeight" stroke="#f59e0b" strokeWidth={1} dot={{ r: 2 }} name="Max lbs" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
