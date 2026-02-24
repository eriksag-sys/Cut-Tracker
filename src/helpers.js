import { CUT_PLAN_CONFIG } from './config.js';

// ============================================================
// DATE HELPERS — uses local time (fixes the UTC bug)
// ============================================================
export const dateKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const today = () => new Date();

export const getWeekNumber = () => {
    const now = new Date();
    const cutStart = new Date(CUT_PLAN_CONFIG.startDate);
    if (now < cutStart) return 0;
    const diff = Math.floor((now - cutStart) / (7 * 24 * 60 * 60 * 1000));
    return Math.min(CUT_PLAN_CONFIG.maxWeeks, diff + 1);
};

// ============================================================
// MACRO HELPERS
// ============================================================
export const sumMacros = (meals) => {
    const r = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    Object.values(meals).forEach(m => {
        if (m && m.logged) {
            r.calories += m.calories || 0;
            r.protein += m.protein || 0;
            r.carbs += m.carbs || 0;
            r.fat += m.fat || 0;
        }
    });
    return r;
};

export const formatMacros = (obj, style = "full") => {
    if (style === "short") return `${obj.calories}c · ${obj.protein}p`;
    return `${obj.calories} cal · ${obj.protein}g P · ${obj.carbs}g C · ${obj.fat}g F`;
};

// ============================================================
// DEBOUNCE
// ============================================================
export const debounce = (fn, ms) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
};

// ============================================================
// COMPLIANCE / ANALYTICS
// ============================================================

export const getStreak = (meals) => {
    let streak = 0;
    const d = new Date();
    while (true) {
        const key = dateKey(d);
        const dayMeals = meals[key];
        const hasLogged = dayMeals && Object.values(dayMeals).some(m => m?.logged);
        if (!hasLogged) break;
        streak++;
        d.setDate(d.getDate() - 1);
    }
    return streak;
};

export const getProteinHitRate = (meals, proteinFloor) => {
    let daysLogged = 0;
    let daysHit = 0;
    Object.entries(meals).forEach(([, dayMeals]) => {
        const totals = sumMacros(dayMeals);
        if (totals.calories > 0) {
            daysLogged++;
            if (totals.protein >= proteinFloor) daysHit++;
        }
    });
    return daysLogged > 0 ? Math.round((daysHit / daysLogged) * 100) : 0;
};

export const getWorkoutCompletionRate = (workouts, currentDate, workoutTemplates) => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    let scheduled = 0;
    let completed = 0;
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const key = dateKey(d);
        if (d > new Date()) break;
        const tmpl = workoutTemplates[d.getDay()];
        if (tmpl) {
            scheduled++;
            if (workouts[key]?.completed) completed++;
        }
    }
    return scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;
};

// ============================================================
// TRAINING VOLUME
// ============================================================

export const calcVolume = (sets) => {
    if (!sets || !Array.isArray(sets)) return 0;
    return sets
        .filter(s => s?.weight && s?.reps)
        .reduce((sum, s) => sum + Number(s.weight) * Number(s.reps), 0);
};

export const getSessionVolume = (workout) => {
    if (!workout?.lifts) return 0;
    return Object.values(workout.lifts).reduce((sum, sets) => sum + calcVolume(sets), 0);
};
