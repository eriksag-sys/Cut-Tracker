import { useMemo } from "react";
import { DAILY_TARGETS, DAY_NAMES, RATING_CATEGORIES } from "../config.js";
import { getMealSlots, WORKOUT_TEMPLATES } from "../data.js";
import { dateKey, sumMacros } from "../helpers.js";

export default function ExportModal({ currentDate, meals, workouts, weighIns, ratings, onClose }) {
    const report = useMemo(() => {
        const weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        const weekLabel = `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

        let lines = [`WEEKLY SUMMARY: ${weekLabel}`, "=".repeat(40), ""];

        for (let i = 0; i < 7; i++) {
            const d = new Date(weekStart);
            d.setDate(d.getDate() + i);
            const dk = dateKey(d);
            const dow = d.getDay();
            const target = DAILY_TARGETS[dow];
            const dayMeals = meals[dk] || {};
            const totals = sumMacros(dayMeals);
            const slots = getMealSlots(dow);
            const dayRatings = ratings[dk] || {};
            const workout = workouts[dk];

            lines.push(`--- ${DAY_NAMES[dow]} (${dk}) ---`);
            lines.push(`Target: ${target.calories} cal | ${target.protein}g P | ${target.carbs}g C | ${target.fat}g F`);
            lines.push(`Actual: ${totals.calories} cal | ${totals.protein}g P | ${totals.carbs}g C | ${totals.fat}g F`);
            const diff = totals.calories - target.calories;
            lines.push(`Delta:  ${diff >= 0 ? "+" : ""}${diff} cal`);
            lines.push("");

            slots.forEach(slot => {
                const m = dayMeals[slot.id];
                if (m?.logged) {
                    lines.push(`  ${slot.name}: ${m.name} (${m.calories}cal, ${m.protein}g P)`);
                } else {
                    lines.push(`  ${slot.name}: not logged`);
                }
            });

            if (workout?.completed) {
                const tmpl = WORKOUT_TEMPLATES[dow];
                lines.push(`  Workout: ${tmpl?.name || "Completed"} ✓`);
            }

            const ratingStr = RATING_CATEGORIES
                .filter(c => dayRatings[c.id])
                .map(c => `${c.label}:${dayRatings[c.id]}`)
                .join(", ");
            if (ratingStr) lines.push(`  Ratings: ${ratingStr}`);
            lines.push("");
        }

        // Weigh-ins for the week
        const weekWeighIns = (weighIns || []).filter(w => {
            const d = new Date(w.date);
            return d >= weekStart && d <= weekEnd;
        });
        if (weekWeighIns.length > 0) {
            lines.push("--- Weigh-Ins ---");
            weekWeighIns.forEach(w => {
                lines.push(`  ${w.date}: ${w.weight} lbs${w.waist ? ` / ${w.waist}" waist` : ""}`);
            });
        }

        return lines.join("\n");
    }, [currentDate, meals, workouts, weighIns, ratings]);

    const handleCopy = () => {
        navigator.clipboard.writeText(report);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-[#1a1a2e] w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-5 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Weekly Summary</h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white text-xl">&times;</button>
                </div>
                <pre className="text-[10px] text-white/70 bg-black/30 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap max-h-[60vh]">
                    {report}
                </pre>
                <div className="flex gap-2 mt-3">
                    <button onClick={handleCopy}
                        className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-sm transition-colors">
                        Copy to Clipboard
                    </button>
                    <button onClick={onClose}
                        className="flex-1 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-sm transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
