import { demoVideoUrl } from "@/data/exercises";

export interface WarmupMove {
  id: string;
  name: string;
  detail: string;
  duration: string;
  videoUrl: string;
}

/** General warm-up movements — do a few before every session. */
export const WARMUP_MOVES: WarmupMove[] = [
  {
    id: "warmup-light-cardio",
    name: "Light Cardio",
    detail: "Easy walk, bike, or row to raise your heart rate and warm the muscles.",
    duration: "3-5 min",
  },
  {
    id: "warmup-arm-circles",
    name: "Arm Circles",
    detail: "Big slow circles forward and backward to open the shoulders.",
    duration: "10 each way",
  },
  {
    id: "warmup-leg-swings",
    name: "Leg Swings",
    detail: "Swing each leg front-to-back holding something for balance — loosens the hips.",
    duration: "10 per leg",
  },
  {
    id: "warmup-bodyweight-squats",
    name: "Bodyweight Squats",
    detail: "Slow, full-depth squats to wake up your legs and groove the pattern.",
    duration: "10 reps",
  },
  {
    id: "warmup-cat-cow",
    name: "Cat-Cow",
    detail: "On all fours, arch and round your back slowly to mobilize the spine.",
    duration: "8 reps",
  },
  {
    id: "warmup-shoulder-rolls",
    name: "Shoulder Rolls",
    detail: "Roll shoulders back in big circles to release upper-back tension.",
    duration: "10 each way",
  },
  {
    id: "warmup-hip-circles",
    name: "Hip Circles",
    detail: "Hands on hips, make big circles to loosen the lower back and hips.",
    duration: "8 each way",
  },
  {
    id: "warmup-jumping-jacks",
    name: "Jumping Jacks",
    detail: "A classic full-body warm-up to get the blood moving.",
    duration: "30 sec",
  },
].map((m) => ({ ...m, videoUrl: demoVideoUrl(m.name) }));
