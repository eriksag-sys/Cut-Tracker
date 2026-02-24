import { useState, useMemo } from "react";

export default function DateNav({ currentDate, setCurrentDate, weekNumber }) {
    const goDay = (n) => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + n);
        setCurrentDate(d);
    };

    const label = useMemo(() => {
        return currentDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    }, [currentDate]);

    return (
        <div className="flex items-center justify-between mb-3 px-1">
            <button onClick={() => goDay(-1)} className="text-2xl px-3 py-1 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors">‹</button>
            <div className="text-center">
                <div className="text-lg font-bold">{label}</div>
                {weekNumber > 0 && <div className="text-xs opacity-60">Week {weekNumber} of 16</div>}
            </div>
            <button onClick={() => goDay(1)} className="text-2xl px-3 py-1 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors">›</button>
        </div>
    );
}
