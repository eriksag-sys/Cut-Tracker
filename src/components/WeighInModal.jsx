import { useState } from "react";

export default function WeighInModal({ onSave, onClose, existing }) {
    const [weight, setWeight] = useState(existing?.weight || "");
    const [waist, setWaist] = useState(existing?.waist || "");
    const [notes, setNotes] = useState(existing?.notes || "");

    const handleSave = () => {
        if (!weight) return;
        onSave({
            weight: Number(weight),
            waist: waist ? Number(waist) : null,
            notes,
        });
        onClose();
    };

    const inputClass = "w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500";

    return (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-[#1a1a2e] w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Weigh In</h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white text-xl">&times;</button>
                </div>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-white/50 mb-1 block">Weight (lbs) *</label>
                        <input type="number" step="0.1" value={weight}
                            onChange={e => setWeight(e.target.value)} className={inputClass} placeholder="e.g. 195.5" />
                    </div>
                    <div>
                        <label className="text-xs text-white/50 mb-1 block">Waist (in) — optional</label>
                        <input type="number" step="0.1" value={waist}
                            onChange={e => setWaist(e.target.value)} className={inputClass} placeholder="e.g. 36.0" />
                    </div>
                    <div>
                        <label className="text-xs text-white/50 mb-1 block">Notes — optional</label>
                        <input value={notes} onChange={e => setNotes(e.target.value)}
                            className={inputClass} placeholder="e.g. fasted, post-workout" />
                    </div>
                    <button onClick={handleSave}
                        className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 font-semibold transition-colors"
                        disabled={!weight}>Save Weigh-In</button>
                    <button onClick={onClose}
                        className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm transition-colors">Cancel</button>
                </div>
            </div>
        </div>
    );
}
