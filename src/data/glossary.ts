export interface GlossaryTerm {
  term: string;
  definition: string;
}

/** Plain-English gym dictionary, alphabetical. Short and beginner-friendly. */
export const GLOSSARY: GlossaryTerm[] = [
  { term: "AMRAP", definition: "\"As Many Reps As Possible\" — do the exercise until you can't do another clean rep." },
  { term: "Barbell", definition: "The long straight bar you load weight plates onto. An Olympic barbell weighs 20 kg on its own." },
  { term: "BMI", definition: "Body Mass Index — a quick weight-for-height number. Useful as a rough guide, but it can't tell muscle from fat." },
  { term: "Bodyweight exercise", definition: "An exercise using only your own body as the weight — push-ups, planks, lunges. No equipment needed." },
  { term: "Cable machine", definition: "A machine with adjustable pulleys and a weight stack. Smooth resistance through the whole movement — very beginner-friendly." },
  { term: "Calorie deficit", definition: "Eating a bit less energy than your body burns. This is how weight loss actually happens — training helps, food decides." },
  { term: "Calorie surplus", definition: "Eating a bit more than your body burns, so it has material to build muscle with. Needed for gaining." },
  { term: "Cardio", definition: "Any exercise that raises your heart rate for a while — walking, cycling, rowing. Great for heart health and burning calories." },
  { term: "Compound exercise", definition: "An exercise that works several muscles at once, like squats or rows. Big bang for your buck, but takes more practice." },
  { term: "Cool-down", definition: "A few easy minutes after training — light movement and stretching — to bring your body back to normal and reduce soreness." },
  { term: "DOMS", definition: "Delayed Onset Muscle Soreness — the ache 1–2 days after training, especially when you're new. Normal, and it fades as your body adapts." },
  { term: "Dumbbell", definition: "A short handheld weight. Dumbbells let each arm work independently, which keeps both sides equally strong." },
  { term: "EZ bar", definition: "The short zigzag-shaped bar. The angled grip is gentler on your wrists for curls and triceps work." },
  { term: "Failure", definition: "The point where you can't complete another rep with good form. Beginners should stop 1–2 reps before this, not at it." },
  { term: "Form", definition: "How correctly you perform an exercise. Good form works the right muscles and keeps you safe — it always beats heavier weight." },
  { term: "Free weights", definition: "Weights not attached to a machine — dumbbells, barbells, kettlebells. More muscles involved, more skill required." },
  { term: "Hip hinge", definition: "Bending by pushing your hips back (like closing a car door with your bum) instead of bending your spine. The key to deadlifts and RDLs." },
  { term: "Isolation exercise", definition: "An exercise focusing on one muscle, like a biceps curl. Simple to learn and great for beginners." },
  { term: "Lockout", definition: "Fully straightening a joint at the top of a lift. \"Don't lock out hard\" means stop just short of slamming the joint straight." },
  { term: "Machine", definition: "Equipment that guides the movement path for you. The safest way to learn — you can't drift off course." },
  { term: "Plate", definition: "A flat weight disc you slide onto a barbell or machine. Common sizes: 1.25, 2.5, 5, 10, 15, 20 kg." },
  { term: "Progressive overload", definition: "Gradually doing a little more over time — more weight, more reps, or more sets. This is THE rule of getting stronger." },
  { term: "Range of motion", definition: "How far a joint travels during an exercise. Full range (all the way down, all the way up) builds the most muscle." },
  { term: "Rep", definition: "One complete movement of an exercise — one push-up, one curl. \"12 reps\" means do it 12 times in a row." },
  { term: "Rest", definition: "The pause between sets so your muscles can recharge. Beginners: 60–90 seconds is a good default." },
  { term: "RPE", definition: "Rate of Perceived Exertion — how hard something feels from 1–10. An RPE of 7–8 means \"hard, but I had 2–3 reps left\"." },
  { term: "Set", definition: "A group of reps done back-to-back. \"3 sets of 12\" = 12 reps, rest, 12 reps, rest, 12 reps." },
  { term: "Spotter", definition: "Someone who stands by to help if you get stuck under a weight, usually on bench press or squats. Always use one for heavy attempts." },
  { term: "Stack", definition: "The tower of weight plates on a machine — move the pin to choose how much you're lifting." },
  { term: "Superset", definition: "Doing two exercises back-to-back with no rest between them, then resting. Saves time and adds intensity." },
  { term: "Tempo", definition: "The speed of a rep. Slower (especially on the lowering half) is harder and often better for learning and muscle growth." },
  { term: "Warm-up", definition: "5 minutes of easy movement before training to raise your temperature and prep your joints. Never skip it." },
];
