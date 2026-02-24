export default function MacroBar({ label, current, target, unit = "g", color = "#22c55e" }) {
    const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    const over = current > target;
    const barColor = over ? "#ef4444" : color;

    return (
        <div className="mb-2">
            <div className="flex justify-between text-xs mb-0.5">
                <span className="opacity-70">{label}</span>
                <span className={over ? "text-red-400 font-bold" : ""}>
                    {Math.round(current)} / {target}{unit ? ` ${unit}` : ""}
                </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
            </div>
        </div>
    );
}
