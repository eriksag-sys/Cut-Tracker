// ============================================================
// CUT PLAN CONFIGURATION
// Centralized constants — adjust these when plan changes
// ============================================================

export const CUT_PLAN_CONFIG = {
    startDate: "2026-04-01",
    maxWeeks: 16,
    startWeight: 197,
    goalWeight: 178,
    proteinFloor: 195, // minimum daily protein target (grams)
    maintenanceCalories: 2650,
};

export const DAILY_TARGETS = {
    0: { label: "Refeed", calories: 2980, protein: 220, carbs: 249, fat: 117, activity: "Rest + Bocce" },
    1: { label: "Bocce Day", calories: 2330, protein: 230, carbs: 165, fat: 76, activity: "Upper Push + Bocce" },
    2: { label: "Standard Cut", calories: 2100, protein: 244, carbs: 175, fat: 57, activity: "Lower Body + HIIT" },
    3: { label: "Bocce Day", calories: 2225, protein: 243, carbs: 168, fat: 56, activity: "AM Cardio + Bocce" },
    4: { label: "Bocce Day", calories: 2360, protein: 248, carbs: 185, fat: 81, activity: "Upper Pull + Bocce" },
    5: { label: "Standard Cut", calories: 2240, protein: 253, carbs: 173, fat: 61, activity: "Lower Body + HIIT" },
    6: { label: "Flexible", calories: 2750, protein: 139, carbs: 138, fat: 65, activity: "HIIT + Date Night" },
};

export const RATING_CATEGORIES = [
    { id: "energy", label: "Energy", emoji: "⚡" },
    { id: "sleep", label: "Sleep", emoji: "😴" },
    { id: "hunger", label: "Hunger", emoji: "🍽️" },
    { id: "workout", label: "Workout", emoji: "💪" },
];

export const BOCCE_DAYS = [0, 1, 3, 4]; // Sun, Mon, Wed, Thu

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
