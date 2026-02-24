// ============================================================
// FOOD DATA: All pre-loaded food options from Erik's plan
// ============================================================

export const FIXED_MEALS = {
    standard_breakfast: { name: "Ham, Eggs & Cheese Scramble + Toast", calories: 661, protein: 68, carbs: 28, fat: 29 },
    saturday_brunch: { name: "Post-Workout Brunch + Berries", calories: 746, protein: 68, carbs: 49, fat: 29 },
    sunday_breakfast: { name: "Pre-Practice Breakfast", calories: 590, protein: 34, carbs: 51, fat: 27 },
    pre_workout_shake: { name: "Protein Shake + Banana + AB", calories: 470, protein: 53, carbs: 31, fat: 8 },
    wednesday_shake: { name: "Protein Shake + Apple", calories: 335, protein: 50, carbs: 29, fat: 0 },
    saturday_snack: { name: "Yogurt + Apple + Almond Butter", calories: 395, protein: 21, carbs: 39, fat: 16 },
};

export const LUNCH_OPTIONS = [
    { id: "chicken_sp", name: "Chicken & Sweet Potato", calories: 595, protein: 59, carbs: 53, fat: 12 },
    { id: "chicken_rice", name: "Chicken & Rice (1 cup)", calories: 560, protein: 60, carbs: 52, fat: 8 },
    { id: "chicken_rice_lg", name: "Chicken & Rice (1.25 cups)", calories: 611, protein: 61, carbs: 63, fat: 8 },
    { id: "tuna_bowl", name: "Tuna Salad Bowl + Sweet Potato", calories: 443, protein: 43, carbs: 49, fat: 11 },
    { id: "tuna_sandwich", name: "Tuna Sandwich + Apple", calories: 475, protein: 51, carbs: 53, fat: 11 },
    { id: "tuna_rice", name: "Tuna Rice Bowl TO-GO", calories: 430, protein: 47, carbs: 45, fat: 11 },
];

export const DINNER_PROTEINS = [
    { id: "chicken_6", name: "Chicken Breast 6oz", calories: 320, protein: 53, carbs: 0, fat: 8 },
    { id: "chicken_7", name: "Chicken Breast 7oz", calories: 367, protein: 61, carbs: 0, fat: 9 },
    { id: "beef_6", name: "Ground Beef 93/7 6oz", calories: 320, protein: 45, carbs: 0, fat: 14 },
    { id: "salmon_5", name: "Salmon 5oz", calories: 300, protein: 38, carbs: 0, fat: 15 },
    { id: "salmon_6", name: "Salmon 6oz", calories: 360, protein: 45, carbs: 0, fat: 18 },
    { id: "salmon_7", name: "Salmon 7oz", calories: 420, protein: 53, carbs: 0, fat: 21 },
    { id: "pork_6", name: "Pork Tenderloin 6oz", calories: 320, protein: 50, carbs: 0, fat: 12 },
    { id: "turkey_6", name: "Turkey Breast 6oz", calories: 300, protein: 55, carbs: 0, fat: 6 },
    { id: "fish_7", name: "White Fish 7oz", calories: 280, protein: 50, carbs: 0, fat: 6 },
    { id: "shrimp_8", name: "Shrimp 8oz", calories: 280, protein: 50, carbs: 0, fat: 6 },
    { id: "sirloin_6", name: "Sirloin Steak 6oz", calories: 370, protein: 54, carbs: 0, fat: 15 },
];

export const DINNER_CARBS = [
    { id: "wpotato_6", name: "White Potato 6oz", calories: 160, protein: 0, carbs: 36, fat: 0 },
    { id: "spotato_6", name: "Sweet Potato 6oz", calories: 160, protein: 0, carbs: 37, fat: 0 },
    { id: "spotato_8", name: "Sweet Potato 8oz", calories: 213, protein: 0, carbs: 49, fat: 0 },
    { id: "spotato_10", name: "Sweet Potato 10oz", calories: 265, protein: 0, carbs: 61, fat: 0 },
    { id: "wrice_1", name: "White Rice 1 cup", calories: 205, protein: 4, carbs: 45, fat: 0 },
    { id: "wrice_125", name: "White Rice 1.25 cups", calories: 256, protein: 5, carbs: 56, fat: 0 },
    { id: "brice_1", name: "Brown Rice 1 cup", calories: 215, protein: 4, carbs: 45, fat: 0 },
    { id: "quinoa_1", name: "Quinoa 1 cup", calories: 220, protein: 8, carbs: 40, fat: 0 },
    { id: "pasta_1", name: "Pasta 1 cup", calories: 200, protein: 7, carbs: 40, fat: 0 },
    { id: "none", name: "No starch", calories: 0, protein: 0, carbs: 0, fat: 0 },
];

export const DINNER_VEGGIES = [
    { id: "broccoli", name: "Broccoli 2c + butter", calories: 115, protein: 6, carbs: 16, fat: 4 },
    { id: "brussels", name: "Brussels Sprouts 2c", calories: 80, protein: 4, carbs: 14, fat: 0 },
    { id: "gbeans", name: "Green Beans 2c + butter", calories: 105, protein: 4, carbs: 16, fat: 4 },
    { id: "salad", name: "Mixed Salad + dressing", calories: 100, protein: 1, carbs: 4, fat: 8 },
    { id: "zucchini", name: "Roasted Zucchini 2c", calories: 50, protein: 2, carbs: 8, fat: 0 },
    { id: "spinach", name: "Sauteed Spinach 2c", calories: 40, protein: 3, carbs: 4, fat: 0 },
    { id: "asparagus", name: "Roasted Asparagus 2c", calories: 60, protein: 4, carbs: 8, fat: 0 },
    { id: "mixed_veg", name: "Steamed Mixed Veg 2c", calories: 70, protein: 6, carbs: 14, fat: 0 },
];

export const SNACK_OPTIONS = [
    { id: "yogurt", name: "Siggi's Yogurt", calories: 110, protein: 15, carbs: 14, fat: 0 },
    { id: "yogurt_half", name: "Yogurt + 1/2oz Almonds", calories: 192, protein: 18, carbs: 14, fat: 7 },
    { id: "yogurt_full", name: "Yogurt + 1oz Nuts", calories: 275, protein: 21, carbs: 14, fat: 15 },
    { id: "skip", name: "Skipped", calories: 0, protein: 0, carbs: 0, fat: 0 },
];

export const DATE_NIGHT_TEMPLATES = [
    { id: "steakhouse", name: "Steakhouse", calories: 890, protein: 55, carbs: 48, fat: 38 },
    { id: "seafood", name: "Seafood Restaurant", calories: 820, protein: 48, carbs: 36, fat: 32 },
    { id: "italian", name: "Italian", calories: 800, protein: 50, carbs: 40, fat: 28 },
    { id: "sushi", name: "Sushi", calories: 850, protein: 40, carbs: 90, fat: 25 },
    { id: "mexican", name: "Mexican", calories: 900, protein: 50, carbs: 65, fat: 30 },
];

export const SUNDAY_LUNCH_OPTIONS = [
    { id: "sandwich", name: "Turkey Sandwich + Shake + Banana", calories: 880, protein: 78, carbs: 61, fat: 36 },
    { id: "wraps", name: "Turkey Wraps + Bar + Apple", calories: 875, protein: 76, carbs: 85, fat: 30 },
];

export const SUNDAY_MEAL3 = [
    { id: "cubano", name: "Sol Food Cubano", calories: 750, protein: 50, carbs: 65, fat: 35 },
];

// ============================================================
// WORKOUT TEMPLATES & PRIORITY LIFTS
// ============================================================

export const PRIORITY_LIFTS = [
    { id: "ohp", name: "Overhead Press", defaultSets: 4, repRange: "6-8" },
    { id: "deadlift", name: "Deadlift", defaultSets: 4, repRange: "5-6" },
    { id: "goblet_squat", name: "Goblet Squat", defaultSets: 4, repRange: "8-10" },
    { id: "back_squat", name: "Back Squat", defaultSets: 3, repRange: "8-10" },
    { id: "bench", name: "Bench Press", defaultSets: 3, repRange: "8-10" },
];

export const WORKOUT_TEMPLATES = {
    0: null,
    1: {
        name: "Upper Push + HIIT", time: "4:30 PM", duration: "65 min",
        priorityLifts: ["ohp", "bench"],
        exercises: [
            { name: "Overhead Press", priority: true, sets: 4, reps: "6-8" },
            { name: "Bench Press", priority: true, sets: 3, reps: "8-10" },
            { name: "Incline DB Press", sets: 3, reps: "10-12" },
            { name: "Close-Grip Bench", sets: 3, reps: "8-10" },
            { name: "Overhead Tricep Ext", sets: 3, reps: "10-12" },
            { name: "Pallof Press", sets: 3, reps: "12/side" },
        ],
        finisher: "HIIT: Burpees / Mt. Climbers / Jump Squats x 3-4 rds",
    },
    2: {
        name: "Lower Body + Core + Zone 2", time: "4:30 PM", duration: "75 min",
        priorityLifts: ["goblet_squat"],
        exercises: [
            { name: "Goblet Squat", priority: true, sets: 4, reps: "8-10" },
            { name: "Romanian Deadlift", sets: 4, reps: "8-10" },
            { name: "Walking Lunges", sets: 3, reps: "12/leg" },
            { name: "Bulgarian Split Squats", sets: 3, reps: "10/leg" },
            { name: "Farmer's Carries", sets: 3, reps: "40 yds" },
            { name: "Russian Twists", sets: 3, reps: "20 total" },
        ],
        finisher: "Zone 2 Cardio: 20 min",
    },
    3: {
        name: "AM Zone 2 Cardio", time: "9:00 AM", duration: "30 min",
        priorityLifts: [],
        exercises: [{ name: "Zone 2 Cardio (fasted)", sets: 1, reps: "30 min" }],
        finisher: null,
    },
    4: {
        name: "Upper Pull + HIIT", time: "4:30 PM", duration: "65 min",
        priorityLifts: ["deadlift"],
        exercises: [
            { name: "Deadlift", priority: true, sets: 4, reps: "5-6" },
            { name: "Pull-Ups / Chin-Ups", sets: 4, reps: "8-10" },
            { name: "Bent-Over Rows", sets: 3, reps: "8-10" },
            { name: "Lat Pulldowns", sets: 3, reps: "10-12" },
            { name: "Barbell Curls", sets: 3, reps: "10-12" },
            { name: "Hammer Curls", sets: 3, reps: "10-12" },
            { name: "Face Pulls", sets: 3, reps: "15-20" },
        ],
        finisher: "HIIT: Rowing / Battle Ropes / KB Swings x 3-4 rds",
    },
    5: {
        name: "Lower Body + Posterior + Zone 2", time: "4:30 PM", duration: "75 min",
        priorityLifts: ["back_squat"],
        exercises: [
            { name: "Back Squat", priority: true, sets: 3, reps: "8-10" },
            { name: "Stiff-Leg Deadlift", sets: 3, reps: "8-10" },
            { name: "Leg Press", sets: 3, reps: "12-15" },
            { name: "Single-Leg Glute Bridge", sets: 3, reps: "12/leg" },
            { name: "Leg Curls", sets: 3, reps: "12-15" },
            { name: "Suitcase Carries", sets: 3, reps: "30 yds/side" },
        ],
        finisher: "Zone 2 Cardio: 20 min",
    },
    6: {
        name: "HIIT + Mobility", time: "10:00 AM", duration: "50 min",
        priorityLifts: [],
        exercises: [
            { name: "Sprint Intervals", sets: 4, reps: "40s/20s" },
            { name: "Box Jumps", sets: 4, reps: "40s/20s" },
            { name: "KB Swings", sets: 4, reps: "40s/20s" },
            { name: "Plank Hold", sets: 4, reps: "40s" },
        ],
        finisher: "Mobility & Stretching: 15-20 min",
    },
};

// ============================================================
// MEAL SLOT DEFINITIONS per day of week
// ============================================================
export const getMealSlots = (dow) => {
    const base = {
        0: [
            { id: "m1", name: "Breakfast", time: "8:00 AM", type: "fixed", fixedKey: "sunday_breakfast" },
            { id: "m2", name: "Portable Lunch", time: "11:30 AM", type: "dropdown", options: SUNDAY_LUNCH_OPTIONS },
            { id: "m3", name: "Sol Food / Restaurant", time: "2:30 PM", type: "dropdown_or_offscript", options: SUNDAY_MEAL3 },
            { id: "m4", name: "Refeed Dinner", time: "5:30 PM", type: "dinner_builder" },
            { id: "m5", name: "Optional Snack", time: "8:00 PM", type: "snack", options: SNACK_OPTIONS },
        ],
        1: [
            { id: "m1", name: "Breakfast", time: "8:00 AM", type: "fixed", fixedKey: "standard_breakfast" },
            { id: "m2", name: "Lunch", time: "12:00 PM", type: "dropdown", options: LUNCH_OPTIONS, defaultId: "chicken_sp" },
            { id: "m3", name: "Pre-Workout Shake", time: "3:00 PM", type: "fixed", fixedKey: "pre_workout_shake" },
            { id: "m4", name: "Dinner", time: "6:30 PM", type: "dinner_builder" },
            { id: "m5", name: "Optional Snack", time: "7:30 PM", type: "snack", options: SNACK_OPTIONS },
        ],
        2: [
            { id: "m1", name: "Breakfast", time: "8:00 AM", type: "fixed", fixedKey: "standard_breakfast" },
            { id: "m2", name: "Lunch", time: "12:00 PM", type: "dropdown", options: LUNCH_OPTIONS, defaultId: "tuna_bowl" },
            { id: "m3", name: "Pre-Workout Shake", time: "3:00 PM", type: "fixed", fixedKey: "pre_workout_shake" },
            { id: "m4", name: "Dinner", time: "6:30 PM", type: "dinner_builder" },
            { id: "m5", name: "Optional Snack", time: "7:45 PM", type: "snack", options: SNACK_OPTIONS },
        ],
        3: [
            { id: "m1", name: "Post-Cardio Breakfast", time: "9:30 AM", type: "fixed", fixedKey: "standard_breakfast" },
            { id: "m2", name: "Lunch", time: "12:30 PM", type: "dropdown", options: LUNCH_OPTIONS, defaultId: "chicken_rice" },
            { id: "m3", name: "Afternoon Snack", time: "3:30 PM", type: "fixed", fixedKey: "wednesday_shake" },
            { id: "m4", name: "Pre-Bocce TO-GO", time: "6:15 PM", type: "dropdown", options: LUNCH_OPTIONS, defaultId: "tuna_rice" },
            { id: "m5", name: "Post-Bocce Snack", time: "8:30 PM", type: "snack", options: SNACK_OPTIONS },
        ],
        4: [
            { id: "m1", name: "Breakfast", time: "8:00 AM", type: "fixed", fixedKey: "standard_breakfast" },
            { id: "m2", name: "Lunch", time: "12:00 PM", type: "dropdown", options: LUNCH_OPTIONS, defaultId: "chicken_rice_lg" },
            { id: "m3", name: "Pre-Workout Shake", time: "3:00 PM", type: "fixed", fixedKey: "pre_workout_shake" },
            { id: "m4", name: "Pre-Bocce Dinner", time: "6:15 PM", type: "dinner_builder" },
            { id: "m5", name: "Post-Bocce Snack", time: "8:30 PM", type: "snack", options: SNACK_OPTIONS },
        ],
        5: [
            { id: "m1", name: "Breakfast", time: "8:00 AM", type: "fixed", fixedKey: "standard_breakfast" },
            { id: "m2", name: "Lunch", time: "12:00 PM", type: "dropdown", options: LUNCH_OPTIONS, defaultId: "tuna_sandwich" },
            { id: "m3", name: "Pre-Workout Shake", time: "3:00 PM", type: "fixed", fixedKey: "pre_workout_shake" },
            { id: "m4", name: "Dinner", time: "6:30 PM", type: "dinner_builder" },
            { id: "m5", name: "Optional Snack", time: "7:45 PM", type: "snack", options: SNACK_OPTIONS },
        ],
        6: [
            { id: "m1", name: "Post-Workout Brunch", time: "11:30 AM", type: "fixed", fixedKey: "saturday_brunch" },
            { id: "m2", name: "Afternoon Snack", time: "3:00 PM", type: "fixed", fixedKey: "saturday_snack" },
            { id: "m3", name: "Date Night Dinner", time: "6:30 PM", type: "dropdown_or_offscript", options: DATE_NIGHT_TEMPLATES },
        ],
    };
    return base[dow] || base[1];
};
