import { useMemo } from "react";
import { DAILY_TARGETS, DAY_SHORT } from "../config.js";
import { sumMacros, dateKey } from "../helpers.js";

export default function WeekTab({ currentDate, meals }) {
    const weekData = useMemo(() => {
        const weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const days = [];
        let totalCal = 0, totalPro = 0, budgetTotal = 0;
        const now = new Date();

        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart);
            d.setDate(d.getDate() + i);
            const dk = dateKey(d);
            const dayMeals = meals[dk] || {};
            const totals = sumMacros(dayMeals);
            const target = DAILY_TARGETS[d.getDay()];
            const isPast = d <= now;
            days.push({ date: d, dk, dow: d.getDay(), totals, target, isPast, hasData: totals.calories > 0 });
            if (isPast || totals.calories > 0) {
                totalCal += totals.calories;
                totalPro += totals.protein;
            }
            budgetTotal += target.calories;
        }

        // Weekly budget calculations
        const daysConsumed = days.filter(d => d.isPast || d.hasData).length;
        const daysRemaining = 7 - daysConsumed;
        const calRemaining = budgetTotal - totalCal;
        const avgRemaining = daysRemaining > 0 ? Math.round(calRemaining / daysRemaining) : 0;

        return { days, totalCal, totalPro, budgetTotal, calRemaining, daysRemaining, avgRemaining };
    }, [currentDate, meals]);

    const budgetPct = weekData.budgetTotal > 0 ? Math.min((weekData.totalCal / weekData.budgetTotal) * 100, 100) : 0;
    const budgetOver = weekData.totalCal > weekData.budgetTotal;

    return (
        <div>
            {/* Weekly Calorie Budget */}
            <div className="bg-gradient-to-r from-blue-600/15 to-indigo-600/15 rounded-xl p-4 mb-3 border border-blue-500/20">
                <div className="text-sm font-bold mb-2">📊 Weekly Calorie Budget</div>
                <div className="flex justify-between text-xs mb-1.5">
                    <span>Consumed: <span className="font-bold text-white">{weekData.totalCal.toLocaleString()}</span></span>
                    <span>Budget: <span className="font-bold text-white">{weekData.budgetTotal.toLocaleString()}</span></span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${budgetPct}%`, backgroundColor: budgetOver ? "#ef4444" : "#3b82f6" }} />
                </div>
                <div className="flex justify-between text-xs text-white/60">
                    <span>Remaining: <span className={`font-bold ${weekData.calRemaining < 0 ? "text-red-400" : "text-emerald-400"}`}>
                        {weekData.calRemaining.toLocaleString()} cal
                    </span></span>
                    {weekData.daysRemaining > 0 && (
                        <span>Avg/day: <span className="font-bold text-blue-400">{weekData.avgRemaining}</span> cal</span>
                    )}
                </div>
            </div>

            {/* Day-by-day breakdown */}
            <div className="space-y-1.5">
                {weekData.days.map((day) => {
                    const calPct = day.target.calories > 0 ? (day.totals.calories / day.target.calories * 100) : 0;
                    const isToday = dateKey(new Date()) === day.dk;
                    return (
                        <div key={day.dk}
                            className={`p-3 rounded-xl ${isToday ? "bg-blue-500/15 border border-blue-500/30" : "bg-white/5"} ${!day.isPast && !day.hasData ? "opacity-40" : ""}`}>
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold w-8">{DAY_SHORT[day.dow]}</span>
                                    <span className="text-[10px] text-white/40">{day.target.label}</span>
                                </div>
                                <div className="text-xs">
                                    <span className={calPct > 105 ? "text-red-400 font-bold" : calPct > 0 ? "text-white" : "text-white/30"}>
                                        {day.totals.calories || "—"}
                                    </span>
                                    <span className="text-white/30"> / {day.target.calories}</span>
                                </div>
                            </div>
                            {day.hasData && (
                                <div className="flex gap-3 text-[10px] text-white/50">
                                    <span>{day.totals.protein}g P{day.totals.protein >= 195 ? " ✅" : ""}</span>
                                    <span>{day.totals.carbs}g C</span>
                                    <span>{day.totals.fat}g F</span>
                                </div>
                            )}
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                                <div className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${Math.min(calPct, 100)}%`,
                                        backgroundColor: calPct > 105 ? "#ef4444" : calPct > 0 ? "#3b82f6" : "transparent"
                                    }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Weekly totals */}
            <div className="mt-3 bg-white/5 rounded-xl p-3 text-xs text-white/70">
                <div className="flex justify-between">
                    <span>Weekly Protein Avg:</span>
                    <span className="font-bold text-white">
                        {weekData.days.filter(d => d.hasData).length > 0
                            ? Math.round(weekData.totalPro / weekData.days.filter(d => d.hasData).length)
                            : "—"}g / day
                    </span>
                </div>
            </div>
        </div>
    );
}
