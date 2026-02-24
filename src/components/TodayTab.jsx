import { useMemo } from "react";
import { DAILY_TARGETS } from "../config.js";
import { getMealSlots, FIXED_MEALS } from "../data.js";
import { sumMacros, dateKey } from "../helpers.js";
import MacroBar from "./MacroBar.jsx";
import ComplianceDashboard from "./ComplianceDashboard.jsx";

export default function TodayTab({ currentDate, meals, allMeals, workouts, onOpenMeal, onOpenWeighIn }) {
    const dow = currentDate.getDay();
    const dk = dateKey(currentDate);
    const dayTarget = DAILY_TARGETS[dow];
    const slots = useMemo(() => getMealSlots(dow), [dow]);
    const dayMeals = meals[dk] || {};
    const totals = useMemo(() => sumMacros(dayMeals), [dayMeals]);

    const remaining = {
        calories: dayTarget.calories - totals.calories,
        protein: dayTarget.protein - totals.protein,
        carbs: dayTarget.carbs - totals.carbs,
        fat: dayTarget.fat - totals.fat,
    };

    return (
        <div>
            <ComplianceDashboard meals={allMeals} workouts={workouts} currentDate={currentDate} />

            {/* Daily target summary */}
            <div className="bg-white/5 rounded-xl p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{dayTarget.label}</span>
                    <span className="text-xs text-white/50">{dayTarget.activity}</span>
                </div>
                <MacroBar label="Calories" current={totals.calories} target={dayTarget.calories} unit="" color="#3b82f6" />
                <MacroBar label="Protein" current={totals.protein} target={dayTarget.protein} color="#22c55e" />
                <MacroBar label="Carbs" current={totals.carbs} target={dayTarget.carbs} color="#f59e0b" />
                <MacroBar label="Fat" current={totals.fat} target={dayTarget.fat} color="#ef4444" />
            </div>

            {/* Remaining macros */}
            {totals.calories > 0 && (
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-3 mb-3 text-xs">
                    <div className="font-medium mb-1">Remaining Today</div>
                    <div className="flex gap-3 text-white/70">
                        <span className={remaining.calories < 0 ? "text-red-400" : ""}>{remaining.calories} cal</span>
                        <span className={remaining.protein < 0 ? "text-red-400" : ""}>{remaining.protein}g P</span>
                        <span className={remaining.carbs < 0 ? "text-red-400" : ""}>{remaining.carbs}g C</span>
                        <span className={remaining.fat < 0 ? "text-red-400" : ""}>{remaining.fat}g F</span>
                    </div>
                </div>
            )}

            {/* Meal slots */}
            <div className="space-y-2">
                {slots.map(slot => {
                    const meal = dayMeals[slot.id];
                    const logged = meal?.logged;
                    const fixedMeal = slot.type === "fixed" ? FIXED_MEALS[slot.fixedKey] : null;
                    return (
                        <button key={slot.id} onClick={() => onOpenMeal(slot, meal)}
                            className={`w-full text-left p-3 rounded-xl transition-colors ${logged ? "bg-emerald-500/15 border border-emerald-500/30" : "bg-white/5 border border-white/10 hover:bg-white/10"}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium truncate">{slot.name}</span>
                                        <span className="text-[10px] text-white/40">{slot.time}</span>
                                    </div>
                                    {logged && (
                                        <div className="text-xs text-white/60 truncate mt-0.5">
                                            {meal.name} - {meal.calories}cal, {meal.protein}g P
                                        </div>
                                    )}
                                    {!logged && fixedMeal && (
                                        <div className="text-xs text-white/30 truncate mt-0.5">
                                            {fixedMeal.name} ({fixedMeal.calories} cal)
                                        </div>
                                    )}
                                </div>
                                <div className="text-lg ml-2">{logged ? "✅" : "○"}</div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Weigh-in button */}
            <button onClick={onOpenWeighIn}
                className="w-full mt-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm transition-colors">
                ⚖️ Log Weigh-In
            </button>
        </div>
    );
}
