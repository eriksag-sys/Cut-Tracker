import { useState, useRef } from "react";
import { isFirebaseConnected } from "../storage.js";

export default function BackupModal({ meals, weighIns, workouts, ratings, onImport, onClose }) {
    const [importText, setImportText] = useState("");
    const [status, setStatus] = useState("");
    const fileRef = useRef(null);

    const handleExport = () => {
        const data = { meals, weighIns, workouts, ratings, exportDate: new Date().toISOString(), version: 2 };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cut-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setStatus("Backup downloaded!");
    };

    const handleCopyExport = () => {
        const data = { meals, weighIns, workouts, ratings, exportDate: new Date().toISOString(), version: 2 };
        navigator.clipboard.writeText(JSON.stringify(data));
        setStatus("Copied to clipboard!");
    };

    const handleImport = () => {
        try {
            const data = JSON.parse(importText);
            if (!data.meals && !data.weighIns && !data.workouts && !data.ratings) {
                setStatus("Error: Invalid backup file");
                return;
            }
            onImport(data);
            setStatus("Import successful! Data restored.");
            setImportText("");
        } catch {
            setStatus("Error: Invalid JSON");
        }
    };

    const handleFileImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setImportText(ev.target.result);
        };
        reader.readAsText(file);
    };

    const firebaseOn = isFirebaseConnected();

    return (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-[#1a1a2e] w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Backup & Restore</h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white text-xl">&times;</button>
                </div>

                {/* Sync status */}
                <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg text-xs ${firebaseOn ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                    <span className={`w-2 h-2 rounded-full ${firebaseOn ? "bg-emerald-400" : "bg-yellow-400"}`} />
                    {firebaseOn ? "Firebase sync active — data syncs automatically" : "Offline mode — using local storage only"}
                </div>

                {/* Export */}
                <div className="space-y-2 mb-4">
                    <div className="text-sm font-medium">Export</div>
                    <button onClick={handleExport}
                        className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors">
                        Download JSON File
                    </button>
                    <button onClick={handleCopyExport}
                        className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm transition-colors">
                        Copy JSON to Clipboard
                    </button>
                </div>

                {/* Import */}
                <div className="space-y-2">
                    <div className="text-sm font-medium">Import</div>
                    <input type="file" accept=".json" ref={fileRef} onChange={handleFileImport}
                        className="w-full text-xs text-white/50 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-white/10 file:text-white file:text-xs file:cursor-pointer" />
                    <div className="text-[10px] text-white/30 text-center">or paste JSON below</div>
                    <textarea placeholder='Paste backup JSON here...' value={importText}
                        onChange={e => setImportText(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white resize-none h-24 focus:outline-none focus:border-blue-500" />
                    <button onClick={handleImport} disabled={!importText}
                        className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-sm font-medium transition-colors">
                        Import & Restore
                    </button>
                </div>

                {status && <div className="mt-3 text-xs text-center text-emerald-400">{status}</div>}

                <button onClick={onClose}
                    className="w-full mt-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm transition-colors">
                    Close
                </button>
            </div>
        </div>
    );
}
