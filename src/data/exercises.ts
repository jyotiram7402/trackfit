import type {
  CardioActivity,
  Equipment,
  Exercise,
  ExerciseDifficulty,
  MuscleGroup,
} from "@/types/workout";

/**
 * YouTube search-results URL for "<name> proper form". YouTube discontinued
 * search-playlist embeds, so demo buttons open this in a new tab (the
 * YouTube app on phones) — always shows current, working videos.
 */
export function demoVideoUrl(name: string): string {
  const query = `${name} proper form how to`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function ex(
  id: string,
  name: string,
  muscleGroup: MuscleGroup,
  defaultSets: number,
  defaultReps: string,
  difficulty: ExerciseDifficulty,
  equipment: Equipment,
  startingWeight: string
): Exercise {
  return {
    id,
    name,
    muscleGroup,
    defaultSets,
    defaultReps,
    videoUrl: demoVideoUrl(name),
    difficulty,
    equipment,
    startingWeight,
  };
}

/**
 * Exercise pools, 10 per muscle group. Every group has at least 4
 * beginner-difficulty options (machines / bodyweight / cables), so a
 * beginner plan (2 per muscle × 2 sessions) never needs a complex lift.
 */
export const EXERCISES: Record<MuscleGroup, Exercise[]> = {
  chest: [
    ex("chest-barbell-bench-press", "Barbell Bench Press", "chest", 4, "6-10", "intermediate", "barbell", "Start with the empty bar (20 kg) and focus on a smooth path"),
    ex("chest-incline-dumbbell-press", "Incline Dumbbell Press", "chest", 4, "8-12", "intermediate", "dumbbell", "Start with 5–7.5 kg dumbbells"),
    ex("chest-dumbbell-flyes", "Dumbbell Flyes", "chest", 3, "10-15", "beginner", "dumbbell", "Start with 2.5–5 kg dumbbells, slow and controlled"),
    ex("chest-machine-chest-press", "Machine Chest Press", "chest", 3, "10-12", "beginner", "machine", "Start with the lightest stack that feels controlled"),
    ex("chest-incline-barbell-press", "Incline Barbell Press", "chest", 4, "6-10", "advanced", "barbell", "Start with the empty bar"),
    ex("chest-cable-crossover", "Cable Crossover", "chest", 3, "12-15", "beginner", "cable", "Start with 5–10 kg per side"),
    ex("chest-decline-bench-press", "Decline Bench Press", "chest", 3, "8-12", "advanced", "barbell", "Start with the empty bar"),
    ex("chest-push-ups", "Push-ups", "chest", 3, "15-20", "beginner", "bodyweight", "Start on your knees if a full push-up is too hard"),
    ex("chest-dips", "Chest Dips", "chest", 3, "8-12", "advanced", "bodyweight", "Use the assisted dip machine until bodyweight feels easy"),
    ex("chest-pec-deck-machine", "Pec Deck Machine", "chest", 3, "12-15", "beginner", "machine", "Start with a light stack and a full stretch"),
  ],
  triceps: [
    ex("triceps-rope-pushdown", "Tricep Rope Pushdown", "triceps", 3, "12-15", "beginner", "cable", "Start with 10–15 kg on the stack"),
    ex("triceps-overhead-dumbbell-extension", "Overhead Dumbbell Extension", "triceps", 3, "10-12", "beginner", "dumbbell", "Start with a single 5 kg dumbbell"),
    ex("triceps-skull-crushers", "Skull Crushers", "triceps", 3, "8-12", "intermediate", "barbell", "Start with an empty EZ bar or 10 kg"),
    ex("triceps-close-grip-bench-press", "Close-grip Bench Press", "triceps", 4, "6-10", "intermediate", "barbell", "Start with the empty bar"),
    ex("triceps-cable-pushdown-bar", "Cable Pushdown (bar)", "triceps", 3, "12-15", "beginner", "cable", "Start with 10–15 kg on the stack"),
    ex("triceps-dips", "Tricep Dips", "triceps", 3, "8-12", "advanced", "bodyweight", "Use the assisted dip machine until bodyweight feels easy"),
    ex("triceps-dumbbell-kickbacks", "Dumbbell Kickbacks", "triceps", 3, "12-15", "beginner", "dumbbell", "Start with 2.5–5 kg dumbbells"),
    ex("triceps-diamond-push-ups", "Diamond Push-ups", "triceps", 3, "12-20", "intermediate", "bodyweight", "Drop to your knees to make them easier"),
    ex("triceps-single-arm-overhead-extension", "Single-arm Overhead Extension", "triceps", 3, "10-12", "beginner", "dumbbell", "Start with 2.5–5 kg"),
    ex("triceps-bench-dips", "Bench Dips", "triceps", 3, "12-15", "beginner", "bodyweight", "Keep knees bent and feet close to make it easier"),
  ],
  back: [
    ex("back-deadlift", "Deadlift", "back", 4, "5-8", "advanced", "barbell", "Learn the hip hinge with a light bar or kettlebell first"),
    ex("back-lat-pulldown", "Lat Pulldown", "back", 3, "10-12", "beginner", "machine", "Start with 20–25 kg on the stack"),
    ex("back-seated-cable-row", "Seated Cable Row", "back", 3, "10-12", "beginner", "cable", "Start with 20–25 kg on the stack"),
    ex("back-pull-ups", "Pull-ups", "back", 4, "6-10", "advanced", "bodyweight", "Use the assisted pull-up machine or a band"),
    ex("back-bent-over-barbell-row", "Bent-over Barbell Row", "back", 4, "8-10", "intermediate", "barbell", "Start with the empty bar and a flat back"),
    ex("back-single-arm-dumbbell-row", "Single-arm Dumbbell Row", "back", 3, "10-12", "beginner", "dumbbell", "Start with 7.5–10 kg"),
    ex("back-t-bar-row", "T-bar Row", "back", 4, "8-10", "intermediate", "barbell", "Start with one small plate"),
    ex("back-face-pulls", "Face Pulls", "back", 3, "12-15", "beginner", "cable", "Start with 5–10 kg — light and strict"),
    ex("back-straight-arm-pulldown", "Straight-arm Pulldown", "back", 3, "12-15", "beginner", "cable", "Start with 10–15 kg on the stack"),
    ex("back-wide-grip-lat-pulldown", "Wide-grip Lat Pulldown", "back", 3, "10-12", "intermediate", "machine", "Start with 20–25 kg on the stack"),
  ],
  biceps: [
    ex("biceps-barbell-curl", "Barbell Curl", "biceps", 3, "8-12", "intermediate", "barbell", "Start with an empty EZ bar or 10 kg"),
    ex("biceps-dumbbell-curl", "Dumbbell Curl", "biceps", 3, "10-12", "beginner", "dumbbell", "Start with 4–6 kg dumbbells"),
    ex("biceps-hammer-curl", "Hammer Curl", "biceps", 3, "10-12", "beginner", "dumbbell", "Start with 4–6 kg dumbbells"),
    ex("biceps-preacher-curl", "Preacher Curl", "biceps", 3, "10-12", "beginner", "machine", "Start with the lightest preacher machine setting or a 10 kg EZ bar"),
    ex("biceps-cable-curl", "Cable Curl", "biceps", 3, "12-15", "beginner", "cable", "Start with 10 kg on the stack"),
    ex("biceps-incline-dumbbell-curl", "Incline Dumbbell Curl", "biceps", 3, "10-12", "intermediate", "dumbbell", "Start with 4–6 kg dumbbells"),
    ex("biceps-concentration-curl", "Concentration Curl", "biceps", 3, "12-15", "beginner", "dumbbell", "Start with 4–6 kg"),
    ex("biceps-zottman-curl", "Zottman Curl", "biceps", 3, "10-12", "intermediate", "dumbbell", "Start with 4–6 kg dumbbells"),
    ex("biceps-ez-bar-curl", "EZ-bar Curl", "biceps", 3, "8-12", "intermediate", "barbell", "Start with the empty EZ bar"),
    ex("biceps-spider-curl", "Spider Curl", "biceps", 3, "10-12", "advanced", "dumbbell", "Start with 4–6 kg dumbbells"),
  ],
  legs: [
    ex("legs-barbell-squat", "Barbell Squat", "legs", 4, "6-10", "advanced", "barbell", "Start with the empty bar — master depth first"),
    ex("legs-romanian-deadlift", "Romanian Deadlift", "legs", 4, "8-10", "intermediate", "barbell", "Start with an empty bar or light dumbbells"),
    ex("legs-leg-extension", "Leg Extension", "legs", 3, "12-15", "beginner", "machine", "Start with a light stack setting"),
    ex("legs-leg-press", "Leg Press", "legs", 4, "10-12", "beginner", "machine", "Start with a light sled — depth before weight"),
    ex("legs-leg-curl", "Leg Curl", "legs", 3, "12-15", "beginner", "machine", "Start with a light stack setting"),
    ex("legs-walking-lunges", "Walking Lunges", "legs", 3, "12 per leg", "intermediate", "bodyweight", "Bodyweight only until your balance is solid"),
    ex("legs-bulgarian-split-squat", "Bulgarian Split Squat", "legs", 3, "10 per leg", "advanced", "dumbbell", "Bodyweight first, then add light dumbbells"),
    ex("legs-standing-calf-raises", "Standing Calf Raises", "legs", 4, "15-20", "beginner", "machine", "Start light with a full stretch at the bottom"),
    ex("legs-goblet-squat", "Goblet Squat", "legs", 3, "10-12", "beginner", "dumbbell", "Hold a 6–10 kg dumbbell at your chest"),
    ex("legs-hack-squat", "Hack Squat", "legs", 4, "8-12", "intermediate", "machine", "Start with the empty sled"),
  ],
  shoulders: [
    ex("shoulders-overhead-barbell-press", "Overhead Barbell Press", "shoulders", 4, "6-10", "advanced", "barbell", "Start with the empty bar"),
    ex("shoulders-lateral-raises", "Lateral Raises", "shoulders", 3, "12-15", "beginner", "dumbbell", "Start with 2.5–5 kg — lighter than you think"),
    ex("shoulders-rear-delt-flyes", "Rear Delt Flyes", "shoulders", 3, "12-15", "beginner", "dumbbell", "Start with 2.5–5 kg dumbbells"),
    ex("shoulders-dumbbell-shoulder-press", "Dumbbell Shoulder Press", "shoulders", 4, "8-12", "intermediate", "dumbbell", "Start with 5–7.5 kg dumbbells"),
    ex("shoulders-arnold-press", "Arnold Press", "shoulders", 3, "10-12", "advanced", "dumbbell", "Start with 5 kg dumbbells"),
    ex("shoulders-cable-lateral-raise", "Cable Lateral Raise", "shoulders", 3, "12-15", "beginner", "cable", "Start with the lightest stack setting"),
    ex("shoulders-front-raises", "Front Raises", "shoulders", 3, "12-15", "beginner", "dumbbell", "Start with 2.5–5 kg dumbbells"),
    ex("shoulders-upright-row", "Upright Row", "shoulders", 3, "10-12", "intermediate", "barbell", "Start with an empty EZ bar"),
    ex("shoulders-barbell-shrugs", "Barbell Shrugs", "shoulders", 4, "12-15", "intermediate", "barbell", "Start with the empty bar or light dumbbells"),
    ex("shoulders-machine-shoulder-press", "Machine Shoulder Press", "shoulders", 3, "10-12", "beginner", "machine", "Start with the lightest stack that feels controlled"),
  ],
  abs: [
    ex("abs-plank", "Plank", "abs", 3, "45-60 sec", "beginner", "bodyweight", "Hold 20–30 sec at first — quality over time"),
    ex("abs-crunches", "Crunches", "abs", 3, "15-20", "beginner", "bodyweight", "Bodyweight — slow and controlled"),
    ex("abs-lying-leg-raises", "Lying Leg Raises", "abs", 3, "12-15", "beginner", "bodyweight", "Bend your knees to make it easier"),
    ex("abs-russian-twists", "Russian Twists", "abs", 3, "20 total", "beginner", "bodyweight", "Bodyweight first, add a light plate later"),
    ex("abs-bicycle-crunches", "Bicycle Crunches", "abs", 3, "20 total", "beginner", "bodyweight", "Bodyweight — steady rhythm"),
    ex("abs-mountain-climbers", "Mountain Climbers", "abs", 3, "30 sec", "intermediate", "bodyweight", "Go slower to make it easier"),
    ex("abs-hanging-leg-raises", "Hanging Leg Raises", "abs", 3, "10-15", "advanced", "bodyweight", "Start with knee raises instead of straight legs"),
    ex("abs-cable-crunches", "Cable Crunches", "abs", 3, "12-15", "intermediate", "cable", "Start with 10–15 kg on the stack"),
    ex("abs-dead-bug", "Dead Bug", "abs", 3, "10 per side", "beginner", "bodyweight", "Bodyweight — keep your lower back pressed down"),
    ex("abs-ab-wheel-rollout", "Ab Wheel Rollout", "abs", 3, "8-12", "advanced", "bodyweight", "Roll out only as far as you can control"),
  ],
};

function cardio(id: string, name: string, intense = false): CardioActivity {
  return { id, name, durationMinutes: 30, videoUrl: demoVideoUrl(name), intense };
}

/** Weight-loss-focused cardio options (~30 min each). */
export const CARDIO_ACTIVITIES: CardioActivity[] = [
  cardio("cardio-treadmill-incline-walk", "Treadmill Incline Walk"),
  cardio("cardio-steady-jog", "Steady Jog"),
  cardio("cardio-cycling", "Cycling"),
  cardio("cardio-jump-rope", "Jump Rope", true),
  cardio("cardio-hiit-circuit", "HIIT Circuit", true),
  cardio("cardio-rowing-machine", "Rowing Machine"),
  cardio("cardio-stair-climber", "Stair Climber"),
  cardio("cardio-elliptical", "Elliptical"),
];

/** Flat list of every strength/abs exercise. */
export const ALL_EXERCISES: Exercise[] = Object.values(EXERCISES).flat();

/** Lookup maps by id. */
export const EXERCISES_BY_ID: ReadonlyMap<string, Exercise> = new Map(
  ALL_EXERCISES.map((e) => [e.id, e])
);

export const CARDIO_BY_ID: ReadonlyMap<string, CardioActivity> = new Map(
  CARDIO_ACTIVITIES.map((c) => [c.id, c])
);
