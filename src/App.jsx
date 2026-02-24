import { useState, useEffect, useRef, useCallback } from "react";
import { saveData, loadData, onDataChange, isFirebaseConnected } from "./storage.js";
import { dateKey, getWeekNumber } from "./helpers.js";
import { getMealSlots } from "./data.js";
import DateNav from "./components/DateNav.jsx";
import TodayTab from "./components/TodayTab.jsx";
import WeekTab from "./components/WeekTab.jsx";
import TrainTab from "./components/TrainTab.jsx";
import ChartsTab from "./components/ChartsTab.jsx";
import MealLoggerModal from "./components/MealLoggerModal.jsx";
import WeighInModal from "./components/WeighInModal.jsx";
import ExportModal from "./components/ExportModal.jsx";
import BackupModal from "./components/BackupModal.jsx";

const TABS = [
  { id: "today", label: "Today", icon: "🍽️" },
  { id: "train", label: "Train", icon: "🏋️" },
  { id: "week", label: "Week", icon: "📅" },
  { id: "progress", label: "Progress", icon: "📈" },
];

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tab, setTab] = useState("today");
  const [loaded, setLoaded] = useState(false);

  // Core data state
  const [meals, setMeals] = useState({});
  const [weighIns, setWeighIns] = useState([]);
  const [workouts, setWorkouts] = useState({});
  const [ratings, setRatings] = useState({});

  // Modals
  const [mealModal, setMealModal] = useState(null); // {slot, meal}
  const [showWeighIn, setShowWeighIn] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showBackup, setShowBackup] = useState(false);

  // Track which data keys we've loaded to avoid overwriting with empty data
  const loadedKeys = useRef(new Set());

  // ---- LOAD DATA ----
  useEffect(() => {
    (async () => {
      const [m, w, wk, r] = await Promise.all([
        loadData("meals"),
        loadData("weighins"),
        loadData("workouts"),
        loadData("ratings"),
      ]);
      if (m) { setMeals(m); loadedKeys.current.add("meals"); }
      if (w) { setWeighIns(w); loadedKeys.current.add("weighins"); }
      if (wk) { setWorkouts(wk); loadedKeys.current.add("workouts"); }
      if (r) { setRatings(r); loadedKeys.current.add("ratings"); }
      setLoaded(true);
    })();
  }, []);

  // ---- FIREBASE REAL-TIME LISTENERS ----
  useEffect(() => {
    if (!isFirebaseConnected()) return;

    const unsubs = [
      onDataChange("meals", (data) => { if (data) setMeals(data); }),
      onDataChange("weighins", (data) => { if (data) setWeighIns(data); }),
      onDataChange("workouts", (data) => { if (data) setWorkouts(data); }),
      onDataChange("ratings", (data) => { if (data) setRatings(data); }),
    ];
    return () => unsubs.forEach(fn => fn());
  }, []);

  // ---- SAVE HELPERS ----
  const persistMeals = useCallback((newMeals) => {
    setMeals(newMeals);
    loadedKeys.current.add("meals");
    saveData("meals", newMeals);
  }, []);

  const persistWeighIns = useCallback((newWeighIns) => {
    setWeighIns(newWeighIns);
    loadedKeys.current.add("weighins");
    saveData("weighins", newWeighIns);
  }, []);

  const persistWorkouts = useCallback((newWorkouts) => {
    setWorkouts(newWorkouts);
    loadedKeys.current.add("workouts");
    saveData("workouts", newWorkouts);
  }, []);

  const persistRatings = useCallback((newRatings) => {
    setRatings(newRatings);
    loadedKeys.current.add("ratings");
    saveData("ratings", newRatings);
  }, []);

  // ---- MEAL ACTIONS ----
  const handleSaveMeal = useCallback((slotId, mealData) => {
    const dk = dateKey(currentDate);
    const updated = { ...meals, [dk]: { ...meals[dk], [slotId]: mealData } };
    persistMeals(updated);
  }, [currentDate, meals, persistMeals]);

  const handleOpenMeal = useCallback((slot, meal) => {
    setMealModal({ slot, meal });
  }, []);

  // ---- WEIGH-IN ----
  const handleSaveWeighIn = useCallback((data) => {
    const dk = dateKey(currentDate);
    const existing = weighIns.findIndex(w => w.date === dk);
    let updated;
    if (existing >= 0) {
      updated = [...weighIns];
      updated[existing] = { ...data, date: dk };
    } else {
      updated = [...weighIns, { ...data, date: dk }];
    }
    persistWeighIns(updated);
  }, [currentDate, weighIns, persistWeighIns]);

  // ---- WORKOUT ----
  const handleSaveWorkout = useCallback((dk, data) => {
    const updated = { ...workouts, [dk]: data };
    persistWorkouts(updated);
  }, [workouts, persistWorkouts]);

  // ---- RATINGS ----
  const handleSaveRatings = useCallback((dk, data) => {
    const updated = { ...ratings, [dk]: data };
    persistRatings(updated);
  }, [ratings, persistRatings]);

  // ---- IMPORT ----
  const handleImport = useCallback((data) => {
    if (data.meals) persistMeals(data.meals);
    if (data.weighIns) persistWeighIns(data.weighIns);
    if (data.workouts) persistWorkouts(data.workouts);
    if (data.ratings) persistRatings(data.ratings);
  }, [persistMeals, persistWeighIns, persistWorkouts, persistRatings]);

  const weekNumber = getWeekNumber();

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#0f0f1e] flex items-center justify-center">
        <div className="text-white/50 text-sm animate-pulse">Loading tracker...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1e] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0f0f1e]/95 backdrop-blur-sm border-b border-white/5 px-4 pt-3 pb-2">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Cut Phase Tracker
            </h1>
            <div className="flex items-center gap-1">
              {/* Firebase indicator */}
              <span className={`w-2 h-2 rounded-full ${isFirebaseConnected() ? "bg-emerald-400" : "bg-yellow-400"}`}
                title={isFirebaseConnected() ? "Firebase connected" : "Offline mode"} />
              <button onClick={() => setShowExport(true)} className="p-1.5 rounded-lg hover:bg-white/10 text-xs" title="Weekly Summary">
                📋
              </button>
              <button onClick={() => setShowBackup(true)} className="p-1.5 rounded-lg hover:bg-white/10 text-xs" title="Backup & Restore">
                💾
              </button>
            </div>
          </div>
          <DateNav currentDate={currentDate} setCurrentDate={setCurrentDate} weekNumber={weekNumber} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-3">
        {tab === "today" && (
          <TodayTab currentDate={currentDate} meals={meals} allMeals={meals} workouts={workouts}
            onOpenMeal={handleOpenMeal} onOpenWeighIn={() => setShowWeighIn(true)} />
        )}
        {tab === "train" && (
          <TrainTab currentDate={currentDate} workouts={workouts} ratings={ratings}
            onSaveWorkout={handleSaveWorkout} onSaveRatings={handleSaveRatings} />
        )}
        {tab === "week" && (
          <WeekTab currentDate={currentDate} meals={meals} />
        )}
        {tab === "progress" && (
          <ChartsTab weighIns={weighIns} workouts={workouts} />
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f0f1e]/95 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-lg mx-auto flex">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-center transition-colors ${tab === t.id ? "text-blue-400" : "text-white/40 hover:text-white/60"}`}>
              <div className="text-lg">{t.icon}</div>
              <div className="text-[10px] font-medium">{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      {mealModal && (
        <MealLoggerModal
          slot={mealModal.slot}
          meal={mealModal.meal}
          onSave={handleSaveMeal}
          onClose={() => setMealModal(null)}
        />
      )}
      {showWeighIn && (
        <WeighInModal
          existing={weighIns.find(w => w.date === dateKey(currentDate))}
          onSave={handleSaveWeighIn}
          onClose={() => setShowWeighIn(false)}
        />
      )}
      {showExport && (
        <ExportModal
          currentDate={currentDate}
          meals={meals}
          workouts={workouts}
          weighIns={weighIns}
          ratings={ratings}
          onClose={() => setShowExport(false)}
        />
      )}
      {showBackup && (
        <BackupModal
          meals={meals}
          weighIns={weighIns}
          workouts={workouts}
          ratings={ratings}
          onImport={handleImport}
          onClose={() => setShowBackup(false)}
        />
      )}
    </div>
  );
}
