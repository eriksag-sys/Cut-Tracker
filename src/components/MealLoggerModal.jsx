import { useState, useEffect, useRef, useCallback } from "react";
import { FIXED_MEALS, DINNER_PROTEINS, DINNER_CARBS, DINNER_VEGGIES } from "../data.js";

export default function MealLoggerModal({ slot, meal, onSave, onClose }) {
    const [mode, setMode] = useState(slot.type === "dinner_builder" ? "builder" : (slot.type === "fixed" || slot.type === "fixed_or_offscript") ? "fixed" : "dropdown");
    const [selectedId, setSelectedId] = useState("");
    const [offScript, setOffScript] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" });

    // Dinner builder
    const [proteinId, setProteinId] = useState("");
    const [carbId, setCarbId] = useState("");
    const [vegId, setVegId] = useState("");

    // AI estimation
    const [aiLoading, setAiLoading] = useState(false);
    const apiKeyRef = useRef("");

    useEffect(() => {
        if (meal?.logged) {
            if (meal.dinnerBuild) {
                setMode("builder");
                setProteinId(meal.dinnerBuild.protein || "");
                setCarbId(meal.dinnerBuild.carb || "");
                setVegId(meal.dinnerBuild.veg || "");
            } else if (meal.offScript) {
                setMode("offscript");
                setOffScript({ name: meal.name || "", calories: meal.calories || "", protein: meal.protein || "", carbs: meal.carbs || "", fat: meal.fat || "" });
            } else if (meal.selectedId) {
                setMode("dropdown");
                setSelectedId(meal.selectedId);
            }
        }
    }, [meal]);

    const handleFixedSave = () => {
        const fm = FIXED_MEALS[slot.fixedKey];
        onSave(slot.id, { ...fm, logged: true, type: "fixed" });
        onClose();
    };

    const handleDropdownSave = () => {
        const item = slot.options?.find(o => o.id === selectedId);
        if (!item) return;
        onSave(slot.id, { ...item, logged: true, selectedId, type: "dropdown" });
        onClose();
    };

    const handleBuilderSave = () => {
        const p = DINNER_PROTEINS.find(x => x.id === proteinId);
        const c = DINNER_CARBS.find(x => x.id === carbId);
        const v = DINNER_VEGGIES.find(x => x.id === vegId);
        if (!p) return;
        const carb = c || { calories: 0, protein: 0, carbs: 0, fat: 0 };
        const veg = v || { calories: 0, protein: 0, carbs: 0, fat: 0 };
        const total = {
            name: [p.name, c?.name, v?.name].filter(Boolean).join(" + "),
            calories: p.calories + carb.calories + veg.calories,
            protein: p.protein + carb.protein + veg.protein,
            carbs: p.carbs + carb.carbs + veg.carbs,
            fat: p.fat + carb.fat + veg.fat,
            logged: true,
            type: "builder",
            dinnerBuild: { protein: proteinId, carb: carbId, veg: vegId },
        };
        onSave(slot.id, total);
        onClose();
    };

    const handleOffScriptSave = () => {
        if (!offScript.name || !offScript.calories) return;
        onSave(slot.id, {
            name: offScript.name,
            calories: Number(offScript.calories),
            protein: Number(offScript.protein) || 0,
            carbs: Number(offScript.carbs) || 0,
            fat: Number(offScript.fat) || 0,
            logged: true,
            offScript: true,
            type: "offscript",
        });
        onClose();
    };

    const handleAiEstimate = async () => {
        if (!offScript.name || !apiKeyRef.current) return;
        setAiLoading(true);
        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKeyRef.current}` },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are a nutrition expert. Respond ONLY with a JSON object: {\"calories\": number, \"protein\": number, \"carbs\": number, \"fat\": number}. Estimate for a typical restaurant portion if not specified." },
                        { role: "user", content: `Estimate macros for: ${offScript.name}` },
                    ],
                    temperature: 0.3,
                }),
            });
            const data = await res.json();
            const text = data.choices?.[0]?.message?.content || "";
            const match = text.match(/\{[\s\S]*\}/);
            if (match) {
                const parsed = JSON.parse(match[0]);
                setOffScript(prev => ({ ...prev, ...parsed }));
            }
        } catch (err) {
            console.error("AI estimation failed:", err);
        }
        setAiLoading(false);
    };

    const handleClear = () => {
        onSave(slot.id, { logged: false });
        onClose();
    };

    const selectClass = "w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 appearance-none";
    const inputClass = "w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500";
    const btnPrimary = "w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 font-semibold transition-colors";
    const btnSecondary = "w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm transition-colors";
    const btnDanger = "w-full py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm transition-colors";

    return (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-[#1a1a2e] w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">{slot.name}</h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white text-xl">&times;</button>
                </div>
                <div className="text-xs text-white/40 mb-3">{slot.time}</div>

                {/* Mode tabs for dropdown_or_offscript, dinner_builder, and fixed_or_offscript */}
                {(slot.type === "dropdown_or_offscript" || slot.type === "dinner_builder" || slot.type === "fixed_or_offscript") && (
                    <div className="flex gap-1 mb-4 bg-white/5 rounded-lg p-1">
                        {slot.type === "dinner_builder" && (
                            <button onClick={() => setMode("builder")} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "builder" ? "bg-blue-600" : "hover:bg-white/10"}`}>Builder</button>
                        )}
                        {(slot.type === "dropdown_or_offscript" && slot.options) && (
                            <button onClick={() => setMode("dropdown")} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "dropdown" ? "bg-blue-600" : "hover:bg-white/10"}`}>Menu</button>
                        )}
                        {slot.type === "fixed_or_offscript" && (
                            <button onClick={() => setMode("fixed")} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "fixed" ? "bg-blue-600" : "hover:bg-white/10"}`}>Standard</button>
                        )}
                        <button onClick={() => setMode("offscript")} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "offscript" ? "bg-blue-600" : "hover:bg-white/10"}`}>Off-Script</button>
                    </div>
                )}

                {/* Dropdown for dropdown options or snacks */}
                {(slot.type === "dropdown" || slot.type === "snack") && mode !== "offscript" && (
                    <div className="flex gap-1 mb-4 bg-white/5 rounded-lg p-1">
                        <button onClick={() => setMode("dropdown")} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "dropdown" ? "bg-blue-600" : "hover:bg-white/10"}`}>Menu</button>
                        <button onClick={() => setMode("offscript")} className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${mode === "offscript" ? "bg-blue-600" : "hover:bg-white/10"}`}>Off-Script</button>
                    </div>
                )}

                {/* Fixed meal auto-log */}
                {mode === "fixed" && (
                    <div>
                        <div className="bg-white/5 rounded-xl p-3 mb-3">
                            <div className="font-medium mb-1">{FIXED_MEALS[slot.fixedKey]?.name}</div>
                            <div className="text-xs text-white/60">
                                {FIXED_MEALS[slot.fixedKey]?.calories} cal | {FIXED_MEALS[slot.fixedKey]?.protein}g P | {FIXED_MEALS[slot.fixedKey]?.carbs}g C | {FIXED_MEALS[slot.fixedKey]?.fat}g F
                            </div>
                        </div>
                        <button onClick={handleFixedSave} className={btnPrimary}>{meal?.logged ? "Re-log" : "Log Meal"}</button>
                    </div>
                )}

                {/* Dropdown selector */}
                {mode === "dropdown" && (
                    <div>
                        <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className={selectClass}>
                            <option value="">Choose...</option>
                            {(slot.options || []).map(opt => (
                                <option key={opt.id} value={opt.id}>{opt.name} ({opt.calories} cal, {opt.protein}g P)</option>
                            ))}
                        </select>
                        {selectedId && (
                            <div className="bg-white/5 rounded-xl p-3 mt-2 mb-3 text-xs text-white/60">
                                {(() => { const it = slot.options?.find(o => o.id === selectedId); return it ? `${it.calories} cal | ${it.protein}g P | ${it.carbs}g C | ${it.fat}g F` : ""; })()}
                            </div>
                        )}
                        <button onClick={handleDropdownSave} className={btnPrimary} disabled={!selectedId}>Log Meal</button>
                    </div>
                )}

                {/* Dinner Builder */}
                {mode === "builder" && (
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-white/50 mb-1 block">Protein *</label>
                            <select value={proteinId} onChange={e => setProteinId(e.target.value)} className={selectClass}>
                                <option value="">Choose protein...</option>
                                {DINNER_PROTEINS.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.calories}cal, {p.protein}g P)</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-white/50 mb-1 block">Carb (optional)</label>
                            <select value={carbId} onChange={e => setCarbId(e.target.value)} className={selectClass}>
                                <option value="">No starch</option>
                                {DINNER_CARBS.filter(c => c.id !== "none").map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.calories}cal, {c.carbs}g C)</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-white/50 mb-1 block">Veggies (optional)</label>
                            <select value={vegId} onChange={e => setVegId(e.target.value)} className={selectClass}>
                                <option value="">No veggies</option>
                                {DINNER_VEGGIES.map(v => (
                                    <option key={v.id} value={v.id}>{v.name} ({v.calories}cal)</option>
                                ))}
                            </select>
                        </div>
                        {proteinId && (
                            <div className="bg-white/5 rounded-xl p-3 text-xs text-white/60">
                                {(() => {
                                    const p = DINNER_PROTEINS.find(x => x.id === proteinId) || { calories: 0, protein: 0, carbs: 0, fat: 0 };
                                    const c = DINNER_CARBS.find(x => x.id === carbId) || { calories: 0, protein: 0, carbs: 0, fat: 0 };
                                    const v = DINNER_VEGGIES.find(x => x.id === vegId) || { calories: 0, protein: 0, carbs: 0, fat: 0 };
                                    return `Total: ${p.calories + c.calories + v.calories} cal | ${p.protein + c.protein + v.protein}g P | ${p.carbs + c.carbs + v.carbs}g C | ${p.fat + c.fat + v.fat}g F`;
                                })()}
                            </div>
                        )}
                        <button onClick={handleBuilderSave} className={btnPrimary} disabled={!proteinId}>Log Dinner</button>
                    </div>
                )}

                {/* Off-Script */}
                {mode === "offscript" && (
                    <div className="space-y-3">
                        <input placeholder="Meal description..." value={offScript.name}
                            onChange={e => setOffScript(p => ({ ...p, name: e.target.value }))} className={inputClass} />
                        <div className="grid grid-cols-2 gap-2">
                            <input placeholder="Calories *" type="number" value={offScript.calories}
                                onChange={e => setOffScript(p => ({ ...p, calories: e.target.value }))} className={inputClass} />
                            <input placeholder="Protein g" type="number" value={offScript.protein}
                                onChange={e => setOffScript(p => ({ ...p, protein: e.target.value }))} className={inputClass} />
                            <input placeholder="Carbs g" type="number" value={offScript.carbs}
                                onChange={e => setOffScript(p => ({ ...p, carbs: e.target.value }))} className={inputClass} />
                            <input placeholder="Fat g" type="number" value={offScript.fat}
                                onChange={e => setOffScript(p => ({ ...p, fat: e.target.value }))} className={inputClass} />
                        </div>
                        <div className="flex gap-2">
                            <input placeholder="OpenAI API key (optional)" type="password"
                                onChange={e => { apiKeyRef.current = e.target.value; }} className={inputClass + " flex-1"} />
                            <button onClick={handleAiEstimate} disabled={aiLoading || !offScript.name}
                                className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-medium whitespace-nowrap">
                                {aiLoading ? "..." : "AI Est."}
                            </button>
                        </div>
                        <button onClick={handleOffScriptSave} className={btnPrimary}
                            disabled={!offScript.name || !offScript.calories}>Log Off-Script</button>
                    </div>
                )}

                {/* Clear / Cancel */}
                <div className="mt-3 space-y-2">
                    {meal?.logged && <button onClick={handleClear} className={btnDanger}>Clear Meal</button>}
                    <button onClick={onClose} className={btnSecondary}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
