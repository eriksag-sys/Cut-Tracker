import { getStreak, getProteinHitRate, getWorkoutCompletionRate } from '../helpers.js';
import { CUT_PLAN_CONFIG } from '../config.js';
import { WORKOUT_TEMPLATES } from '../data.js';

function Badge({ value, label, emoji, thresholds = [80, 60] }) {
    const color = value >= thresholds[0] ? "bg-emerald-500/20 text-emerald-400" :
        value >= thresholds[1] ? "bg-yellow-500/20 text-yellow-400" :
            "bg-red-500/20 text-red-400";
    return (
        <div className={`${color} rounded-xl px-3 py-2 text-center flex-1 min-w-0`}>
            <div className="text-lg font-bold">{emoji} {typeof value === "number" && value <= 999 ? value : value}{typeof value === "number" && label !== "Streak" ? "%" : ""}</div>
            <div className="text-[10px] opacity-70 truncate">{label}</div>
        </div>
    );
}

export default function ComplianceDashboard({ meals, workouts, currentDate }) {
    const streak = getStreak(meals);
    const proteinRate = getProteinHitRate(meals, CUT_PLAN_CONFIG.proteinFloor);
    const workoutRate = getWorkoutCompletionRate(workouts, currentDate, WORKOUT_TEMPLATES);

    return (
        <div className="flex gap-2 mb-3">
            <Badge value={streak} label="Streak" emoji="🔥" thresholds={[7, 3]} />
            <Badge value={proteinRate} label="Protein" emoji="🎯" />
            <Badge value={workoutRate} label="Workouts" emoji="💪" />
        </div>
    );
}
