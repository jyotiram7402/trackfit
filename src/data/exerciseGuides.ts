import type { ExerciseGuide } from "@/types/workout";

/**
 * Beginner-friendly how-to content for every exercise in the catalog,
 * keyed by exercise id. Written for someone who has never touched a weight:
 * simple words, safety first, encouraging tone.
 */
export const EXERCISE_GUIDES: Record<string, ExerciseGuide> = {
  // ============================================================ CHEST
  "chest-barbell-bench-press": {
    steps: [
      "Lie on the bench with your eyes under the bar, feet flat on the floor.",
      "Grip the bar slightly wider than shoulder-width; squeeze your shoulder blades together.",
      "Unrack the bar and hold it straight over your chest with arms extended.",
      "Lower the bar slowly to your mid-chest, elbows at about 45° from your body.",
      "Press the bar back up until your arms are straight, then repeat.",
    ],
    breathing: "Breathe in as you lower the bar; breathe out as you press it up.",
    mistakes: [
      { mistake: "Bouncing the bar off your chest", fix: "Lower under control for 2 seconds and touch the chest gently." },
      { mistake: "Flaring elbows straight out to the sides", fix: "Keep elbows at roughly 45° to protect your shoulders." },
      { mistake: "Lifting your feet or hips off the bench", fix: "Plant feet flat and keep your glutes on the bench the whole set." },
      { mistake: "Going too heavy too soon", fix: "Master the empty bar first — form beats weight every time." },
    ],
    tips: ["Keep your wrists straight and stacked over your elbows.", "Squeeze the bar hard — it stabilizes your whole arm.", "Keep a slight arch in your lower back, chest proud."],
    safety: "Use a spotter or safety bars when going heavy — never bench alone at your limit.",
  },
  "chest-incline-dumbbell-press": {
    steps: [
      "Set the bench to a 30–45° incline and sit back with a dumbbell on each thigh.",
      "Kick the dumbbells up one at a time as you lie back, holding them at shoulder level.",
      "Press both dumbbells up and slightly together until your arms are straight.",
      "Lower them slowly back to shoulder level with elbows at about 45°.",
    ],
    breathing: "Breathe in on the way down; breathe out as you press up.",
    mistakes: [
      { mistake: "Setting the incline too steep", fix: "Stay at 30–45° — steeper turns it into a shoulder press." },
      { mistake: "Clanging the dumbbells together at the top", fix: "Stop just short of touching; keep tension on the chest." },
      { mistake: "Letting the dumbbells drift toward your face", fix: "Press in a straight line over your upper chest." },
    ],
    tips: ["Keep your feet planted and back against the bench.", "Lower until you feel a comfortable stretch — no deeper.", "Move both arms at the same speed."],
  },
  "chest-dumbbell-flyes": {
    steps: [
      "Lie flat on a bench holding light dumbbells straight above your chest, palms facing each other.",
      "Keep a slight, fixed bend in your elbows — like hugging a barrel.",
      "Open your arms wide in a slow arc until you feel a gentle chest stretch.",
      "Bring the dumbbells back together above your chest in the same arc.",
    ],
    breathing: "Breathe in as your arms open; breathe out as you squeeze them back together.",
    mistakes: [
      { mistake: "Bending and straightening the elbows (turning it into a press)", fix: "Lock a slight elbow bend and keep it the whole set." },
      { mistake: "Going too deep and straining the shoulders", fix: "Stop when you feel a light stretch — never pain." },
      { mistake: "Using heavy dumbbells", fix: "Flyes are a stretch-and-squeeze move; go light and slow." },
    ],
    tips: ["Imagine hugging a big tree on the way up.", "Keep your lower back gently on the bench.", "Slow is strong — 3 seconds down, 2 up."],
  },
  "chest-machine-chest-press": {
    steps: [
      "Adjust the seat so the handles line up with your mid-chest.",
      "Sit tall with your back against the pad, feet flat on the floor.",
      "Grip the handles and press them forward until your arms are almost straight.",
      "Slowly let the handles come back until your hands are near your chest.",
    ],
    breathing: "Breathe out as you press forward; breathe in as you return.",
    mistakes: [
      { mistake: "Seat set too high or low", fix: "Handles should be level with your mid-chest — adjust before you start." },
      { mistake: "Letting the weight slam back down", fix: "Return slowly and stop before the stack touches down." },
      { mistake: "Shrugging your shoulders while pressing", fix: "Keep shoulders down and back against the pad." },
    ],
    tips: ["Perfect first chest exercise — the machine controls the path for you.", "Don't fully lock your elbows at the end.", "Keep your head against the pad."],
  },
  "chest-incline-barbell-press": {
    steps: [
      "Lie on a 30–45° incline bench with your eyes under the bar.",
      "Grip slightly wider than shoulder-width and pull your shoulder blades together.",
      "Unrack and hold the bar above your upper chest.",
      "Lower it slowly to just below your collarbone, then press back up.",
    ],
    breathing: "Breathe in lowering the bar; breathe out pressing up.",
    mistakes: [
      { mistake: "Bouncing the bar off the upper chest", fix: "Touch gently and pause a beat before pressing." },
      { mistake: "Elbows flared to 90°", fix: "Tuck them to about 45° to spare your shoulders." },
      { mistake: "Hips leaving the bench", fix: "Drive through your feet but keep glutes down." },
    ],
    tips: ["The bar path is slightly diagonal — toward your collarbone.", "Start with the empty bar to learn the groove.", "Squeeze your shoulder blades into the bench."],
    safety: "Use safety bars or a spotter — an incline press pins you if you fail.",
  },
  "chest-cable-crossover": {
    steps: [
      "Set both pulleys above shoulder height and stand in the middle, one foot forward.",
      "Hold a handle in each hand with a slight elbow bend, leaning forward a little.",
      "Pull both handles down and together in a wide arc until your hands meet in front of you.",
      "Squeeze your chest for a second, then let your arms open back up slowly.",
    ],
    breathing: "Breathe out as your hands come together; breathe in as they open.",
    mistakes: [
      { mistake: "Bending the elbows more as you pull", fix: "Keep the same soft elbow bend the whole time." },
      { mistake: "Using your shoulders and rocking your body", fix: "Lighten the stack and let only your arms move." },
      { mistake: "Rushing the return", fix: "Resist the cables on the way back — that half counts too." },
    ],
    tips: ["Cross your hands slightly at the end for an extra squeeze.", "Stagger your stance for balance.", "Think 'hug', not 'press'."],
  },
  "chest-decline-bench-press": {
    steps: [
      "Lie on the decline bench and hook your feet under the pads.",
      "Grip the bar slightly wider than shoulder-width and unrack it.",
      "Lower the bar slowly to your lower chest.",
      "Press straight back up until your arms are extended.",
    ],
    breathing: "Breathe in on the way down; breathe out as you press.",
    mistakes: [
      { mistake: "Losing control because the angle feels unfamiliar", fix: "Start with the empty bar to learn the path." },
      { mistake: "Bouncing off the chest", fix: "Slow 2-second descent, gentle touch, press." },
      { mistake: "Very wide grip", fix: "Keep forearms vertical at the bottom of the rep." },
    ],
    tips: ["The decline path feels shorter — that's normal.", "Keep your head on the bench.", "Secure your feet firmly before unracking."],
    safety: "Always have a spotter hand you the bar out and back in on decline.",
  },
  "chest-push-ups": {
    steps: [
      "Place your hands on the floor slightly wider than your shoulders.",
      "Step your feet back so your body forms a straight line from head to heels.",
      "Lower your chest toward the floor, elbows at about 45° from your body.",
      "Push the floor away until your arms are straight again.",
    ],
    breathing: "Breathe in going down; breathe out pushing up.",
    mistakes: [
      { mistake: "Hips sagging toward the floor", fix: "Squeeze your glutes and abs — plank position throughout." },
      { mistake: "Only going halfway down", fix: "Chest close to the floor each rep; do knee push-ups if needed." },
      { mistake: "Hands too far forward", fix: "Hands under your shoulders, fingers pointing forward." },
    ],
    tips: ["Too hard? Do them on your knees or hands on a bench.", "Look at the floor slightly ahead of you.", "Your body is one stiff plank — no worming."],
  },
  "chest-dips": {
    steps: [
      "Grip the parallel bars and press yourself up to straight arms.",
      "Lean your torso slightly forward and bend your knees.",
      "Lower yourself slowly until your upper arms are about parallel to the floor.",
      "Press back up to straight arms without locking out hard.",
    ],
    breathing: "Breathe in as you lower; breathe out as you press up.",
    mistakes: [
      { mistake: "Dropping too deep", fix: "Stop at parallel — deeper strains the shoulders." },
      { mistake: "Staying bolt upright", fix: "A slight forward lean shifts the work to your chest." },
      { mistake: "Shrugging shoulders up to your ears", fix: "Push your shoulders down away from your ears." },
    ],
    tips: ["Use the assisted dip machine until full bodyweight feels smooth.", "Control beats depth.", "Keep your neck relaxed."],
    safety: "Skip these if you feel any sharp shoulder pain — use the machine chest press instead.",
  },
  "chest-pec-deck-machine": {
    steps: [
      "Adjust the seat so the handles are level with your mid-chest.",
      "Sit with your back flat against the pad and grab the handles with a slight elbow bend.",
      "Bring the handles together in front of your chest in a smooth arc.",
      "Squeeze for a second, then open your arms back slowly.",
    ],
    breathing: "Breathe out as the handles come together; breathe in as they open.",
    mistakes: [
      { mistake: "Starting with arms stretched too far back", fix: "Set the range so you feel a light stretch, not a pull." },
      { mistake: "Letting the weight yank your arms open", fix: "Resist on the way back — slow and smooth." },
      { mistake: "Hunching forward off the pad", fix: "Keep your back and head against the pad." },
    ],
    tips: ["Great machine to feel your chest working for the first time.", "Pause and squeeze in the middle.", "Elbows slightly below shoulder height feels best."],
  },

  // ============================================================ TRICEPS
  "triceps-rope-pushdown": {
    steps: [
      "Attach the rope to a high pulley and grab an end in each hand.",
      "Stand tall, elbows tucked to your sides, forearms up.",
      "Push the rope down until your arms are straight, spreading the ends apart at the bottom.",
      "Let your forearms rise back up slowly, keeping elbows pinned.",
    ],
    breathing: "Breathe out as you push down; breathe in on the way up.",
    mistakes: [
      { mistake: "Elbows drifting forward or flaring out", fix: "Imagine your elbows are glued to your ribs." },
      { mistake: "Leaning over the weight and pushing with your body", fix: "Stand tall and lighten the stack." },
      { mistake: "Half reps at the bottom", fix: "Fully straighten your arms and squeeze the back of them." },
    ],
    tips: ["Split the rope apart at the bottom for a stronger squeeze.", "Only your forearms should move.", "Soft knees, tall chest."],
  },
  "triceps-overhead-dumbbell-extension": {
    steps: [
      "Sit or stand tall holding one dumbbell with both hands under the top plate.",
      "Press it overhead until your arms are straight.",
      "Bend only your elbows to lower the dumbbell slowly behind your head.",
      "Straighten your arms to raise it back overhead.",
    ],
    breathing: "Breathe in as it lowers behind your head; breathe out as you press up.",
    mistakes: [
      { mistake: "Flaring elbows wide", fix: "Keep elbows close to your ears, pointing forward." },
      { mistake: "Arching the lower back", fix: "Brace your abs; ribs down." },
      { mistake: "Lowering too fast behind the head", fix: "Slow, controlled descent — your elbows will thank you." },
    ],
    tips: ["Start light — this stretch is stronger than it looks.", "Keep your upper arms still like pillars.", "Seated with back support is easiest at first."],
  },
  "triceps-skull-crushers": {
    steps: [
      "Lie on a bench holding an EZ bar with a narrow grip, arms straight above your chest.",
      "Keeping upper arms vertical and still, bend your elbows to lower the bar toward your forehead.",
      "Stop just above your forehead (or lower it slightly behind your head).",
      "Straighten your arms back to the start without moving your shoulders.",
    ],
    breathing: "Breathe in lowering the bar; breathe out extending back up.",
    mistakes: [
      { mistake: "Moving the upper arms back and forth", fix: "Elbows stay pointed at the ceiling; only forearms move." },
      { mistake: "Going too heavy and losing control near your face", fix: "Stay conservative — this lift punishes ego." },
      { mistake: "Flaring elbows out", fix: "Keep them shoulder-width and tucked." },
    ],
    tips: ["An empty EZ bar is a perfect start.", "Lowering slightly behind the head is gentler on the elbows.", "Keep wrists neutral, not bent back."],
    safety: "The name is a warning: control the bar at all times and never train this to total failure without a spotter.",
  },
  "triceps-close-grip-bench-press": {
    steps: [
      "Lie on a bench and grip the bar at about shoulder-width (not narrower).",
      "Unrack and hold the bar over your lower chest.",
      "Lower it slowly, keeping elbows tucked close to your sides.",
      "Press back up, focusing on pushing with the back of your arms.",
    ],
    breathing: "Breathe in on the way down; breathe out as you press.",
    mistakes: [
      { mistake: "Gripping too narrow and hurting the wrists", fix: "Hands about shoulder-width — 'close' doesn't mean touching." },
      { mistake: "Elbows flaring wide", fix: "Brush your ribs with your elbows on every rep." },
      { mistake: "Bouncing off the chest", fix: "Touch softly, then drive up." },
    ],
    tips: ["Elbow position is what makes this a triceps lift.", "Wrists stacked straight over elbows.", "Great strength builder once rope pushdowns feel easy."],
    safety: "Use safety bars or a spotter, same as any bench press.",
  },
  "triceps-cable-pushdown-bar": {
    steps: [
      "Attach a straight or V bar to the high pulley and grip it palms-down.",
      "Stand tall with elbows tucked at your sides.",
      "Push the bar down until your arms are fully straight.",
      "Control it back up until your forearms are just above parallel.",
    ],
    breathing: "Breathe out pushing down; breathe in coming up.",
    mistakes: [
      { mistake: "Shoulders rounding forward over the bar", fix: "Chest up; think 'push down', not 'lean on'." },
      { mistake: "Elbows leaving your sides", fix: "Pin them and let the forearms do the work." },
      { mistake: "Letting the stack pull your arms up fast", fix: "Two seconds down, two seconds up." },
    ],
    tips: ["The bar version lets you go slightly heavier than the rope.", "Squeeze hard for one second at the bottom.", "Stand close to the pulley."],
  },
  "triceps-dips": {
    steps: [
      "Grip parallel bars and press up to straight arms, body upright.",
      "Keep your torso vertical (more upright than chest dips).",
      "Bend your elbows to lower until upper arms are near parallel.",
      "Press straight back up until your arms are fully extended.",
    ],
    breathing: "Breathe in lowering; breathe out pressing up.",
    mistakes: [
      { mistake: "Sinking too deep", fix: "Parallel is plenty — protect your shoulders." },
      { mistake: "Kipping or swinging legs for momentum", fix: "Cross your ankles and stay still; use assistance if needed." },
      { mistake: "Elbows flaring wide", fix: "Point them backward, not out." },
    ],
    tips: ["The assisted dip machine is the smart way to build up.", "Staying upright targets triceps; leaning forward shifts to chest.", "Lock out fully to finish each rep."],
    safety: "Sharp shoulder pain means stop — swap for pushdowns.",
  },
  "triceps-dumbbell-kickbacks": {
    steps: [
      "Hold a light dumbbell and place your other hand and knee on a bench.",
      "Keep your back flat and raise your upper arm so it's parallel to the floor.",
      "Straighten your arm behind you until it's fully extended.",
      "Bend the elbow to return, keeping the upper arm frozen in place.",
    ],
    breathing: "Breathe out as you kick back; breathe in as you return.",
    mistakes: [
      { mistake: "Swinging the whole arm from the shoulder", fix: "Upper arm stays parallel to the floor; only the elbow moves." },
      { mistake: "Using a heavy dumbbell", fix: "This move only works light — feel the squeeze." },
      { mistake: "Rounding your back", fix: "Flat back, eyes down, neck neutral." },
    ],
    tips: ["Pause for a second at full extension.", "Think of your elbow as a door hinge.", "Do all reps on one side, then switch."],
  },
  "triceps-diamond-push-ups": {
    steps: [
      "Get into a push-up position and place your hands close together, thumbs and index fingers forming a diamond.",
      "Keep your body in a straight line from head to heels.",
      "Lower your chest toward your hands, elbows staying close to your sides.",
      "Push back up until your arms are straight.",
    ],
    breathing: "Breathe in going down; breathe out pushing up.",
    mistakes: [
      { mistake: "Elbows flaring out wide", fix: "Brush your ribs with your elbows." },
      { mistake: "Hips sagging", fix: "Squeeze glutes and abs the whole set." },
      { mistake: "Wrist discomfort from the narrow position", fix: "Widen the diamond slightly or drop to your knees." },
    ],
    tips: ["Harder than normal push-ups — knees down is a great start.", "Hands under your chest, not your face.", "Quality reps over rep count."],
  },
  "triceps-single-arm-overhead-extension": {
    steps: [
      "Sit or stand holding a light dumbbell in one hand straight overhead.",
      "Keep your upper arm close to your ear.",
      "Bend the elbow to lower the dumbbell behind your head.",
      "Straighten your arm back up without moving the shoulder.",
    ],
    breathing: "Breathe in as it lowers; breathe out as you extend.",
    mistakes: [
      { mistake: "Elbow drifting out to the side", fix: "Point it at the ceiling; use your free hand to check it." },
      { mistake: "Leaning to one side", fix: "Brace your abs and stay tall." },
      { mistake: "Too much weight", fix: "2.5–5 kg is genuinely enough here." },
    ],
    tips: ["Support your working arm's elbow with your free hand at first.", "Full stretch, full lockout.", "Even reps both arms."],
  },
  "triceps-bench-dips": {
    steps: [
      "Sit on the edge of a bench with hands gripping it beside your hips.",
      "Slide your hips off the bench, legs bent (easier) or straight (harder).",
      "Bend your elbows to lower your hips toward the floor.",
      "Press back up until your arms are straight.",
    ],
    breathing: "Breathe in as you lower; breathe out as you press.",
    mistakes: [
      { mistake: "Dipping too deep and pinching the shoulders", fix: "Lower until upper arms are parallel, no further." },
      { mistake: "Hips drifting far from the bench", fix: "Keep your back sliding close to the bench edge." },
      { mistake: "Shoulders shrugging up", fix: "Press the bench away and keep your neck long." },
    ],
    tips: ["Bend your knees to make it easier — straighten them to progress.", "Fingers point forward, gripping the edge.", "Perfect no-equipment triceps finisher."],
  },

  // ============================================================ BACK
  "back-deadlift": {
    steps: [
      "Stand with feet hip-width, the bar over the middle of your feet.",
      "Hinge at your hips and bend your knees to grip the bar just outside your legs.",
      "Flatten your back, lift your chest, and pull the slack out of the bar.",
      "Push the floor away and stand up tall, keeping the bar against your legs.",
      "Hinge your hips back and bend your knees to lower the bar the same way.",
    ],
    breathing: "Big breath in and brace before you lift; breathe out at the top or after the rep is done.",
    mistakes: [
      { mistake: "Rounding the lower back", fix: "Chest up, back flat like a table — film yourself or ask for a form check." },
      { mistake: "Bar drifting away from the body", fix: "Drag the bar up your shins and thighs the whole way." },
      { mistake: "Yanking the bar with straight legs", fix: "Push through the floor with your legs; it's a leg drive, not a back yank." },
      { mistake: "Overarching and leaning back at the top", fix: "Finish standing tall — squeezed glutes, ribs down." },
    ],
    tips: ["Learn the hip hinge with a light kettlebell before loading a bar.", "Every rep starts from a dead stop — reset your back each time.", "Keep your neck neutral, eyes on the floor a few meters ahead."],
    safety: "The most technical lift in the plan. Start very light, and if your lower back (not your legs) is what feels worked, pause and get your form checked.",
  },
  "back-lat-pulldown": {
    steps: [
      "Sit at the machine and tuck your thighs under the pads.",
      "Grip the bar slightly wider than your shoulders, palms facing away.",
      "Lean back a few degrees, chest up.",
      "Pull the bar down to your upper chest by driving your elbows down.",
      "Let the bar rise slowly until your arms are fully stretched.",
    ],
    breathing: "Breathe out as you pull down; breathe in as the bar rises.",
    mistakes: [
      { mistake: "Pulling the bar behind your neck", fix: "Always pull to the front of your chest." },
      { mistake: "Leaning way back and heaving", fix: "Slight lean only; if you must swing, drop the weight." },
      { mistake: "Pulling with your biceps only", fix: "Think 'elbows down into my back pockets'." },
    ],
    tips: ["Imagine squeezing an orange in each armpit at the bottom.", "Full stretch at the top makes the rep count.", "The best first back exercise there is."],
  },
  "back-seated-cable-row": {
    steps: [
      "Sit at the cable row with feet on the platform, knees slightly bent.",
      "Grab the handle and sit tall with a straight back.",
      "Pull the handle to your belly button, driving your elbows back.",
      "Squeeze your shoulder blades together, then let the handle return slowly.",
    ],
    breathing: "Breathe out as you row; breathe in as you return.",
    mistakes: [
      { mistake: "Rocking your whole torso back and forth", fix: "Torso stays tall and still; only your arms move." },
      { mistake: "Shrugging shoulders toward your ears", fix: "Pull your shoulders down and back first, then row." },
      { mistake: "Rounding your back when reaching forward", fix: "Keep your chest up even in the stretch." },
    ],
    tips: ["Lead with your elbows, not your hands.", "Pause a second with the handle at your stomach.", "Legs stay soft — they're just supports."],
  },
  "back-pull-ups": {
    steps: [
      "Grip the bar slightly wider than your shoulders, palms facing away.",
      "Hang with straight arms and pull your shoulders down away from your ears.",
      "Pull your chin over the bar by driving your elbows down.",
      "Lower yourself slowly until your arms are straight again.",
    ],
    breathing: "Breathe out as you pull up; breathe in as you lower.",
    mistakes: [
      { mistake: "Kicking and swinging", fix: "Slow and strict, even if that means fewer reps or assistance." },
      { mistake: "Half reps at the top or bottom", fix: "Chin over bar, full hang — that's one rep." },
      { mistake: "Starting from a dead shrug", fix: "Set your shoulders down before you pull." },
    ],
    tips: ["Assisted machine or bands make these achievable from day one.", "Think 'pull the bar to my chest', not 'pull my chin up'.", "Even one strict rep beats five swinging ones."],
  },
  "back-bent-over-barbell-row": {
    steps: [
      "Hold the bar at hip height, feet hip-width apart.",
      "Hinge forward at the hips until your torso is about 45° or lower, knees soft.",
      "Let the bar hang under your shoulders with straight arms.",
      "Row the bar to your lower ribs, elbows driving back.",
      "Lower it under control and repeat without standing up.",
    ],
    breathing: "Breathe out as you row up; breathe in as you lower.",
    mistakes: [
      { mistake: "Rounding the lower back", fix: "Flat back and braced abs the whole set — this is rule one." },
      { mistake: "Standing up and heaving with momentum", fix: "Stay hinged; if you can't, the bar is too heavy." },
      { mistake: "Pulling to your chest with flared elbows", fix: "Pull to your lower ribs, elbows close to your body." },
    ],
    tips: ["Master the hinge with an empty bar first.", "Squeeze your shoulder blades at the top of each rep.", "Keep your neck in line with your spine."],
    safety: "Your lower back works hard just holding the position — keep the weight modest and the back flat.",
  },
  "back-single-arm-dumbbell-row": {
    steps: [
      "Place your left hand and left knee on a bench, right foot on the floor.",
      "Hold a dumbbell in your right hand, arm hanging straight down.",
      "Keep your back flat and pull the dumbbell up to your hip.",
      "Lower it slowly until your arm is fully stretched. Do all reps, then switch sides.",
    ],
    breathing: "Breathe out as you row up; breathe in as you lower.",
    mistakes: [
      { mistake: "Twisting your torso to lift the weight", fix: "Shoulders stay square to the floor; lighten the dumbbell." },
      { mistake: "Pulling the weight to your shoulder", fix: "Row toward your hip, elbow brushing your side." },
      { mistake: "Letting your shoulder droop in the stretch", fix: "Reach long, but keep the shoulder 'plugged in'." },
    ],
    tips: ["One of the safest rows — the bench supports your back.", "Imagine starting a lawnmower, slowly.", "Full stretch at the bottom, full squeeze at the top."],
  },
  "back-t-bar-row": {
    steps: [
      "Straddle the bar and hinge forward with a flat back, chest nearly over the handles.",
      "Grip the handles with both hands and let the weight hang.",
      "Row the weight up toward your chest, driving elbows back.",
      "Lower slowly until your arms are straight.",
    ],
    breathing: "Breathe out rowing up; breathe in lowering.",
    mistakes: [
      { mistake: "Standing more upright as you fatigue", fix: "Lock your hinge angle; end the set when it breaks." },
      { mistake: "Jerking the weight with your hips", fix: "Smooth pulls only — momentum robs your back of the work." },
      { mistake: "Rounding the spine", fix: "Chest proud, abs braced, film a set to check." },
    ],
    tips: ["Use the chest-supported version if your gym has it — even beginner-friendlier.", "Small plates let you get a deeper stretch.", "Squeeze your blades together at the top."],
  },
  "back-face-pulls": {
    steps: [
      "Set a rope attachment at upper-chest height on the cable machine.",
      "Grab the rope ends with palms facing each other and step back until the cable is taut.",
      "Pull the rope toward your face, spreading the ends apart beside your ears.",
      "Finish with elbows high and hands beside your head, then return slowly.",
    ],
    breathing: "Breathe out as you pull; breathe in as you return.",
    mistakes: [
      { mistake: "Pulling down to the chest like a row", fix: "Pull high — toward your nose and ears." },
      { mistake: "Using heavy weight and leaning back", fix: "This is a light, posture-building move. Stay strict." },
      { mistake: "Elbows dropping low", fix: "Keep elbows at shoulder height or higher." },
    ],
    tips: ["Fantastic for posture and healthy shoulders.", "Finish like you're flexing in a double-biceps pose.", "Slow reps, full control."],
  },
  "back-straight-arm-pulldown": {
    steps: [
      "Stand facing a high pulley with a straight bar, arms extended at shoulder height.",
      "Hinge slightly forward, chest up, slight bend in the elbows.",
      "Keeping arms straight, pull the bar down in an arc to your thighs.",
      "Let it rise back up slowly until you feel a stretch in your lats.",
    ],
    breathing: "Breathe out pulling down; breathe in on the way up.",
    mistakes: [
      { mistake: "Bending the elbows into a pushdown", fix: "Lock a slight bend and move only at the shoulders." },
      { mistake: "Rounding your back as the bar lowers", fix: "Proud chest the whole rep." },
      { mistake: "Standing bolt upright", fix: "A slight forward hinge lets your lats stretch fully." },
    ],
    tips: ["Great for learning to 'feel' your lats before rows and pulldowns.", "Imagine pushing the bar through a big arc, not down a line.", "Light weight, smooth tempo."],
  },
  "back-wide-grip-lat-pulldown": {
    steps: [
      "Sit at the pulldown with thighs secured and grip the bar wide — well outside your shoulders.",
      "Lean back slightly with your chest lifted.",
      "Pull the bar to your upper chest, elbows driving down and out.",
      "Return slowly to a full stretch overhead.",
    ],
    breathing: "Breathe out on the pull; breathe in on the return.",
    mistakes: [
      { mistake: "Grip so wide it pinches the shoulders", fix: "A few inches outside shoulder-width is wide enough." },
      { mistake: "Cutting the range short", fix: "Full stretch at the top, bar to upper chest at the bottom." },
      { mistake: "Swinging your torso", fix: "Sit tall; drop a plate if you need to cheat." },
    ],
    tips: ["Widest part of your back does the work here — think 'wide wings'.", "Elbows aim at the floor, slightly out.", "Squeeze at the bottom for a full second."],
  },

  // ============================================================ BICEPS
  "biceps-barbell-curl": {
    steps: [
      "Stand tall holding the bar at hip height, hands shoulder-width, palms up.",
      "Pin your elbows to your sides.",
      "Curl the bar up toward your shoulders without moving your elbows.",
      "Lower it all the way back down slowly until your arms are straight.",
    ],
    breathing: "Breathe out as you curl up; breathe in as you lower.",
    mistakes: [
      { mistake: "Swinging your hips and leaning back", fix: "Glue your upper arms to your sides; try back against a wall." },
      { mistake: "Stopping halfway down", fix: "Full straight arms at the bottom — half reps build half a muscle." },
      { mistake: "Wrists curling backward under the bar", fix: "Keep wrists straight; use an EZ bar if they ache." },
    ],
    tips: ["The slow lower is where the growth is — take 2–3 seconds.", "Squeeze at the top like flexing for a photo.", "An empty EZ bar is the ideal starting weight."],
  },
  "biceps-dumbbell-curl": {
    steps: [
      "Stand or sit tall with a dumbbell in each hand, palms facing forward.",
      "Keep elbows pinned at your sides.",
      "Curl both dumbbells (or alternate arms) up to shoulder height.",
      "Lower slowly until your arms hang fully straight.",
    ],
    breathing: "Breathe out curling up; breathe in lowering.",
    mistakes: [
      { mistake: "Swinging the dumbbells with body momentum", fix: "Slow down and go lighter — strict beats heavy." },
      { mistake: "Elbows drifting forward", fix: "Keep them locked at your sides like hinges." },
      { mistake: "Not straightening arms at the bottom", fix: "Full stretch every rep." },
    ],
    tips: ["Alternating arms lets you focus on each side.", "Turn your palm up as you curl for a fuller squeeze.", "4–6 kg is a genuinely good start."],
  },
  "biceps-hammer-curl": {
    steps: [
      "Hold dumbbells at your sides with palms facing your body (thumbs up).",
      "Keep your elbows pinned to your sides.",
      "Curl the weights up, keeping palms facing inward the whole way.",
      "Lower slowly to full extension.",
    ],
    breathing: "Breathe out on the curl; breathe in on the lower.",
    mistakes: [
      { mistake: "Rotating the wrists during the curl", fix: "Palms face each other from start to finish — that's the 'hammer'." },
      { mistake: "Elbows swinging forward", fix: "Only the forearm moves." },
      { mistake: "Rushing both directions", fix: "Two seconds up, two down." },
    ],
    tips: ["Builds the forearm side of the arm too.", "Slightly stronger grip position — you may manage a bit more weight than curls.", "Great second biceps exercise of the day."],
  },
  "biceps-preacher-curl": {
    steps: [
      "Adjust the preacher seat so your armpits sit snugly over the top of the pad.",
      "Rest the backs of your upper arms flat on the pad, holding the bar or handles.",
      "Curl the weight up until your forearms are vertical.",
      "Lower slowly until your arms are almost straight — stop just short of locked.",
    ],
    breathing: "Breathe out curling; breathe in lowering.",
    mistakes: [
      { mistake: "Lifting elbows off the pad", fix: "Keep the whole upper arm glued down." },
      { mistake: "Dropping the weight into a hard elbow lockout", fix: "Stop just before straight — the stretch position is vulnerable here." },
      { mistake: "Half reps at the top only", fix: "Work the long, low range; that's what the pad is for." },
    ],
    tips: ["The pad removes all cheating — expect to use less weight, and that's fine.", "Set the seat height first, every time.", "Machine version is perfect for beginners."],
  },
  "biceps-cable-curl": {
    steps: [
      "Attach a straight bar to the low pulley and grab it palms-up.",
      "Stand tall a small step back so the cable is taut.",
      "Curl the bar to shoulder height with elbows pinned at your sides.",
      "Lower slowly to full extension against the cable's pull.",
    ],
    breathing: "Breathe out curling up; breathe in lowering.",
    mistakes: [
      { mistake: "Leaning back to finish reps", fix: "Stay tall; the cable will try to pull you forward — resist it." },
      { mistake: "Elbows floating forward at the top", fix: "Squeeze the biceps instead of lifting the elbows." },
      { mistake: "Letting the stack drop", fix: "The cable gives constant tension — use every centimeter of it." },
    ],
    tips: ["Tension never disappears on cables — great pump for beginners.", "Try one steady 3-second lower on your last rep.", "Keep wrists straight."],
  },
  "biceps-incline-dumbbell-curl": {
    steps: [
      "Set a bench to about 45–60° and sit back with a dumbbell in each hand.",
      "Let your arms hang straight down behind your body line — you'll feel a stretch.",
      "Curl both dumbbells up without letting your elbows swing forward.",
      "Lower slowly back to the full hang.",
    ],
    breathing: "Breathe out curling; breathe in lowering.",
    mistakes: [
      { mistake: "Shoulders rolling forward off the bench", fix: "Keep your back and shoulders pinned to the pad." },
      { mistake: "Using your dumbbell-curl weight", fix: "The stretch makes this harder — go lighter." },
      { mistake: "Elbows drifting up as you curl", fix: "Elbows point at the floor throughout." },
    ],
    tips: ["The deep stretch is the point — savor it.", "Head stays against the bench.", "Expect a strong soreness the first week — normal."],
  },
  "biceps-concentration-curl": {
    steps: [
      "Sit on a bench, legs wide, holding a light dumbbell in one hand.",
      "Brace the back of that upper arm against the inside of your thigh.",
      "Curl the dumbbell up toward your shoulder.",
      "Lower slowly until the arm is fully straight. Finish the set, then switch arms.",
    ],
    breathing: "Breathe out curling up; breathe in lowering.",
    mistakes: [
      { mistake: "Lifting the elbow off the thigh", fix: "The thigh contact is the whole exercise — keep it." },
      { mistake: "Leaning back to help the weight up", fix: "Torso stays still; go lighter." },
      { mistake: "Fast sloppy reps", fix: "This is a slow, focused squeeze move." },
    ],
    tips: ["Watch your biceps work — focus genuinely improves the contraction.", "Light weight, perfect reps.", "Great final exercise of arm day."],
  },
  "biceps-zottman-curl": {
    steps: [
      "Hold dumbbells at your sides, palms facing forward.",
      "Curl up normally to shoulder height.",
      "At the top, rotate your palms to face down.",
      "Lower slowly with palms down, then rotate back at the bottom.",
    ],
    breathing: "Breathe out on the curl; breathe in on the slow lower.",
    mistakes: [
      { mistake: "Rushing the palms-down lowering", fix: "The slow 3-second descent is the entire point." },
      { mistake: "Sloppy wrist rotation mid-rep", fix: "Rotate crisply at the very top and very bottom only." },
      { mistake: "Going heavy", fix: "Your palms-down strength is lower — pick the weight for the lowering half." },
    ],
    tips: ["Two exercises in one: biceps up, forearms down.", "Keep elbows pinned as always.", "Start with your usual curl weight minus a step."],
  },
  "biceps-ez-bar-curl": {
    steps: [
      "Grip the EZ bar on the angled sections, palms tilted slightly inward.",
      "Stand tall, elbows at your sides.",
      "Curl the bar to shoulder height.",
      "Lower under control to straight arms.",
    ],
    breathing: "Breathe out curling; breathe in lowering.",
    mistakes: [
      { mistake: "Swinging hips to start the rep", fix: "Brace your abs; strict reps only." },
      { mistake: "Cutting the bottom range", fix: "All the way down, every rep." },
      { mistake: "Death-gripping with bent wrists", fix: "Wrists straight; the angled grip should feel natural." },
    ],
    tips: ["Easier on the wrists than a straight bar — ideal for most people.", "The empty EZ bar is a perfect first weight.", "Squeeze hard at the top."],
  },
  "biceps-spider-curl": {
    steps: [
      "Lie chest-down on an incline bench, arms hanging straight toward the floor.",
      "Hold dumbbells with palms facing forward.",
      "Curl the weights up as high as you can without moving your upper arms.",
      "Lower slowly to a full hang.",
    ],
    breathing: "Breathe out curling; breathe in lowering.",
    mistakes: [
      { mistake: "Swinging the arms like pendulums", fix: "Dead-stop each rep at the bottom." },
      { mistake: "Upper arms drifting backward", fix: "Arms hang straight down like ropes; only elbows bend." },
      { mistake: "Too heavy to control", fix: "This strict angle demands your lightest curling weight." },
    ],
    tips: ["Zero momentum possible — the strictest curl there is.", "Chest stays glued to the pad.", "Perfect burnout finisher."],
  },

  // ============================================================ LEGS
  "legs-barbell-squat": {
    steps: [
      "Set the bar on your upper back (not your neck) and grip it firmly.",
      "Step back with feet shoulder-width, toes turned slightly out.",
      "Take a breath, brace your abs, and sit down and back like sitting into a chair.",
      "Go as deep as you can keep your heels down and back flat — thighs near parallel.",
      "Drive through your whole foot to stand back up tall.",
    ],
    breathing: "Big breath and brace at the top; hold it on the way down; breathe out as you drive up.",
    mistakes: [
      { mistake: "Knees caving inward", fix: "Push your knees out in line with your toes the entire rep." },
      { mistake: "Heels lifting off the floor", fix: "Sit back more; try a slightly wider stance or heel wedges." },
      { mistake: "Chest collapsing forward", fix: "Elbows down, chest proud — 'show your shirt logo'." },
      { mistake: "Half squats with too much weight", fix: "Lighten the bar and earn your depth first." },
    ],
    tips: ["Squat to a box or bench at first to learn depth safely.", "The empty bar for two full weeks is a smart investment.", "Look forward and slightly down, not up."],
    safety: "Always squat inside a rack with safety bars set just below your bottom position — never trust a max rep without them.",
  },
  "legs-romanian-deadlift": {
    steps: [
      "Hold the bar (or dumbbells) at hip height, feet hip-width.",
      "Soften your knees and push your hips straight back.",
      "Lower the bar down the front of your legs, back flat, until you feel a strong hamstring stretch.",
      "Drive your hips forward to stand tall, squeezing your glutes.",
    ],
    breathing: "Breathe in as you hinge down; breathe out as your hips drive forward.",
    mistakes: [
      { mistake: "Rounding the back to go lower", fix: "Depth is set by your hamstring stretch, not the floor." },
      { mistake: "Bending the knees into a squat", fix: "Knees stay softly bent and still — hips do the moving." },
      { mistake: "Bar drifting away from the legs", fix: "Slide it down your thighs and shins like a track." },
    ],
    tips: ["Think 'close a car door behind you with your hips'.", "You should feel the backs of your legs, not your lower back.", "Light dumbbells are a great way to learn this."],
    safety: "Keep the back flat at all times — if your lower back aches, stop and lighten the load.",
  },
  "legs-leg-extension": {
    steps: [
      "Adjust the seat so your knees line up with the machine's pivot point.",
      "Hook your shins behind the pad, hands on the handles.",
      "Straighten your legs until they're fully extended.",
      "Lower slowly until your knees are back at about 90°.",
    ],
    breathing: "Breathe out extending up; breathe in lowering.",
    mistakes: [
      { mistake: "Kicking the weight up with momentum", fix: "Two seconds up, squeeze, two seconds down." },
      { mistake: "Hips lifting off the seat", fix: "Sit back fully and hold the handles." },
      { mistake: "Wrong seat position", fix: "Knee joint lines up with the machine's rotating hinge." },
    ],
    tips: ["Squeeze your thigh hard for a second at the top.", "Painless knees only — reduce range if anything pinches.", "Simple, safe way to wake up your quads."],
  },
  "legs-leg-press": {
    steps: [
      "Sit in the machine with your feet shoulder-width on the middle of the platform.",
      "Release the safety handles and grip the side handles.",
      "Lower the platform slowly until your knees reach about 90°.",
      "Press through your whole foot back to the start without slamming your knees straight.",
    ],
    breathing: "Breathe in as the platform lowers; breathe out as you press.",
    mistakes: [
      { mistake: "Going so deep your lower back rolls off the pad", fix: "Stop when your hips start to tuck — 90° is plenty." },
      { mistake: "Locking the knees hard at the top", fix: "Stop just short of straight legs." },
      { mistake: "Knees caving toward each other", fix: "Track your knees over your toes." },
    ],
    tips: ["The friendliest heavy leg exercise for beginners.", "Feet higher on the platform = more glutes and hamstrings.", "Never move the safety handles mid-set."],
  },
  "legs-leg-curl": {
    steps: [
      "Set up on the machine (lying or seated) with the pad against your lower calves.",
      "Align your knees with the machine's pivot.",
      "Curl your heels toward your glutes as far as you can.",
      "Return slowly until your legs are almost straight.",
    ],
    breathing: "Breathe out curling in; breathe in returning.",
    mistakes: [
      { mistake: "Hips lifting or arching off the pad", fix: "Press your hips down; go lighter if they keep popping up." },
      { mistake: "Fast half reps", fix: "Full curl, slow return — hamstrings love slow." },
      { mistake: "Pad on the wrong spot", fix: "It sits just above your heels, not mid-calf." },
    ],
    tips: ["Hamstrings balance out all your pressing leg work — don't skip them.", "Point your toes for a harder hamstring hit.", "Squeeze at full curl for one second."],
  },
  "legs-walking-lunges": {
    steps: [
      "Stand tall, hands on hips or holding light dumbbells.",
      "Take a big step forward and lower until both knees are at about 90°.",
      "Your back knee hovers just above the floor.",
      "Push through your front foot to stand and step straight into the next lunge.",
    ],
    breathing: "Breathe in as you lower; breathe out as you push up and forward.",
    mistakes: [
      { mistake: "Front knee shooting past the toes with heel lifting", fix: "Take a longer step; keep the front heel planted." },
      { mistake: "Wobbling side to side", fix: "Take a slightly wider 'railroad track' stance, not a tightrope." },
      { mistake: "Leaning far forward", fix: "Torso tall, eyes ahead." },
    ],
    tips: ["Bodyweight only until your balance is rock solid.", "Small controlled steps beat big sloppy ones.", "It's normal for the back leg's hip to feel the stretch."],
  },
  "legs-bulgarian-split-squat": {
    steps: [
      "Stand a big step in front of a bench and place the top of your back foot on it.",
      "Keep most of your weight on the front foot.",
      "Lower straight down until your front thigh is near parallel.",
      "Drive through the front foot to stand back up. Finish the set, then switch legs.",
    ],
    breathing: "Breathe in lowering; breathe out driving up.",
    mistakes: [
      { mistake: "Standing too close to the bench", fix: "Take a generous step out — you should lower straight down." },
      { mistake: "Pushing off the back foot", fix: "The back foot is a kickstand; the front leg does the work." },
      { mistake: "Front knee collapsing inward", fix: "Track the knee over the middle toes." },
    ],
    tips: ["Hardest single-leg move in the plan — bodyweight first, always.", "Hold something for balance the first few sessions.", "Expect the front leg to shake a little; that's honest work."],
  },
  "legs-standing-calf-raises": {
    steps: [
      "Stand on the machine's platform with the balls of your feet on the edge, shoulders under the pads.",
      "Let your heels drop below the platform for a full stretch.",
      "Rise up onto your tiptoes as high as you can.",
      "Lower slowly back to the stretch.",
    ],
    breathing: "Breathe out rising up; breathe in lowering.",
    mistakes: [
      { mistake: "Bouncing out of the bottom", fix: "Pause one second in the stretch — no springs." },
      { mistake: "Tiny top-half reps", fix: "Full stretch to full tiptoe, every rep." },
      { mistake: "Bent knees turning it into a leg press", fix: "Legs straight but not locked." },
    ],
    tips: ["Calves respond to full range and patience.", "Count 'one-two' up, 'one-two-three' down.", "No machine? A step and a dumbbell work fine."],
  },
  "legs-goblet-squat": {
    steps: [
      "Hold one dumbbell vertically against your chest with both hands, like a goblet.",
      "Stand with feet shoulder-width, toes slightly out.",
      "Squat down between your knees, keeping your chest tall and heels down.",
      "Go as deep as comfortable, then drive back up to standing.",
    ],
    breathing: "Breathe in on the way down; breathe out driving up.",
    mistakes: [
      { mistake: "Knees caving in", fix: "Elbows gently push the knees out at the bottom — use that cue." },
      { mistake: "Chest dropping forward", fix: "The goblet at your chest keeps you honest — hug it tight and stay tall." },
      { mistake: "Heels popping up", fix: "Sit back more and slow down." },
    ],
    tips: ["The single best way to learn squatting — the weight balances you.", "6–10 kg is plenty to start.", "Graduate to barbell squats once 12 easy reps feel clean."],
  },
  "legs-hack-squat": {
    steps: [
      "Step into the machine, back flat against the pad, shoulders under the shoulder pads.",
      "Place feet shoulder-width on the platform, slightly forward.",
      "Release the safeties and lower until your thighs are near parallel.",
      "Press through your whole foot back to the top without locking your knees hard.",
    ],
    breathing: "Breathe in lowering; breathe out pressing up.",
    mistakes: [
      { mistake: "Feet too low on the platform (knees shoot forward)", fix: "Set feet a touch higher and press through mid-foot." },
      { mistake: "Cutting depth as weight increases", fix: "Keep the same depth — add weight only when depth survives." },
      { mistake: "Slamming into lockout", fix: "Smooth stop just before straight." },
    ],
    tips: ["Like a squat with training wheels — the machine holds your balance.", "Start with the empty sled.", "Keep your whole back against the pad."],
  },

  // ============================================================ SHOULDERS
  "shoulders-overhead-barbell-press": {
    steps: [
      "Hold the bar at your collarbones, hands just outside shoulder-width, elbows slightly forward.",
      "Brace your abs and squeeze your glutes.",
      "Press the bar straight up, moving your head back slightly to clear the path.",
      "Lock out overhead with the bar over the middle of your head, then lower to your collarbones.",
    ],
    breathing: "Breathe in at the bottom, brace; breathe out as you press through the sticking point.",
    mistakes: [
      { mistake: "Arching the lower back into a lean-back press", fix: "Squeeze glutes and abs like a plank — if you must lean, it's too heavy." },
      { mistake: "Pressing the bar out in front", fix: "Press up, not forward; finish with the bar over your ears." },
      { mistake: "Half lockouts", fix: "Full straight arms overhead, shrug the shoulders slightly at the top." },
    ],
    tips: ["The empty bar is the correct starting weight for nearly everyone.", "Grip just outside the shoulders, wrists stacked.", "Feet hip-width, whole body tight."],
    safety: "Your lower back is the weak link — brace hard and never lean back to grind a rep.",
  },
  "shoulders-lateral-raises": {
    steps: [
      "Stand tall with light dumbbells at your sides, slight bend in the elbows.",
      "Raise both arms out to the sides until they reach shoulder height.",
      "Lead with your elbows, pinkies slightly higher than thumbs.",
      "Lower slowly back to your sides.",
    ],
    breathing: "Breathe out raising; breathe in lowering.",
    mistakes: [
      { mistake: "Swinging the weights up with your legs", fix: "If you need a bounce, the dumbbells are too heavy — go lighter." },
      { mistake: "Raising above shoulder height", fix: "Shoulder height is the finish line." },
      { mistake: "Shrugging your traps", fix: "Keep shoulders pressed down; think 'long neck'." },
    ],
    tips: ["Everyone uses lighter weight here than they expect — 2.5–5 kg is real.", "Tilt like pouring two jugs of water.", "Slow lowering doubles the value."],
  },
  "shoulders-rear-delt-flyes": {
    steps: [
      "Hinge forward at the hips with a flat back, light dumbbells hanging below your chest.",
      "With a slight elbow bend, raise both arms out to the sides.",
      "Squeeze your shoulder blades slightly at the top.",
      "Lower slowly back down.",
    ],
    breathing: "Breathe out raising; breathe in lowering.",
    mistakes: [
      { mistake: "Standing up as you lift", fix: "Hold the hinge — brace your abs." },
      { mistake: "Swinging the dumbbells", fix: "These are strict and light, always." },
      { mistake: "Turning it into a row with bent elbows", fix: "Arms stay nearly straight, moving in a wide arc." },
    ],
    tips: ["The forgotten muscle — key for posture and balanced shoulders.", "Chest-supported on an incline bench removes all cheating.", "Think 'wingspan', not 'lift'."],
  },
  "shoulders-dumbbell-shoulder-press": {
    steps: [
      "Sit on a bench with back support, dumbbells at shoulder height, palms forward.",
      "Brace your abs against the backrest.",
      "Press both dumbbells up until your arms are straight overhead.",
      "Lower slowly back to shoulder height.",
    ],
    breathing: "Breathe out pressing up; breathe in lowering.",
    mistakes: [
      { mistake: "Arching off the backrest", fix: "Keep your whole back against the pad, ribs down." },
      { mistake: "Clanging dumbbells overhead", fix: "Stop just short of touching; keep tension." },
      { mistake: "Lowering only halfway", fix: "Down to shoulder height every rep." },
    ],
    tips: ["The seated back support makes this much friendlier than barbell pressing.", "5–7.5 kg dumbbells are a solid start.", "Wrists stay stacked over elbows."],
  },
  "shoulders-arnold-press": {
    steps: [
      "Sit with dumbbells at shoulder height, palms facing you, elbows in front.",
      "As you press up, rotate your palms to face forward.",
      "Finish locked out overhead, palms forward.",
      "Reverse the rotation on the way back down.",
    ],
    breathing: "Breathe out pressing and rotating up; breathe in returning.",
    mistakes: [
      { mistake: "Rotating too fast and losing the path", fix: "Smooth, gradual turn synced with the press." },
      { mistake: "Arching the back", fix: "Use a bench with back support and brace." },
      { mistake: "Too heavy to control the rotation", fix: "Use less than your normal press weight." },
    ],
    tips: ["Hits more of the shoulder through the rotation.", "Learn the plain dumbbell press first.", "Slow reps feel dramatically better here."],
  },
  "shoulders-cable-lateral-raise": {
    steps: [
      "Set the pulley to the lowest position and stand side-on to the machine.",
      "Grab the handle with the hand farther from the machine, cable running across your body.",
      "Raise your arm out to the side to shoulder height.",
      "Lower slowly. Finish the set, then face the other way for the other arm.",
    ],
    breathing: "Breathe out raising; breathe in lowering.",
    mistakes: [
      { mistake: "Leaning away from the machine", fix: "Stand tall; hold the frame lightly with your free hand." },
      { mistake: "Yanking the stack", fix: "Cables reward smooth — go light and feel the side delt." },
      { mistake: "Raising past shoulder height", fix: "Stop level with your shoulder." },
    ],
    tips: ["Constant cable tension makes light weight feel amazing.", "Slight forward lean targets the side delt best.", "One arm at a time = full focus."],
  },
  "shoulders-front-raises": {
    steps: [
      "Stand tall with light dumbbells resting on the front of your thighs.",
      "With nearly straight arms, raise one or both dumbbells forward to shoulder height.",
      "Pause briefly at the top.",
      "Lower slowly back to your thighs.",
    ],
    breathing: "Breathe out raising; breathe in lowering.",
    mistakes: [
      { mistake: "Rocking your torso to swing the weight", fix: "Brace your abs; try standing with your back to a wall." },
      { mistake: "Lifting above shoulder height", fix: "Shoulder level is the target." },
      { mistake: "Death-gripping heavy dumbbells", fix: "Front delts get work from pressing too — keep this light." },
    ],
    tips: ["Alternating arms helps you stay strict.", "Thumbs slightly up feels smoother for most people.", "2.5–5 kg is the right neighborhood."],
  },
  "shoulders-upright-row": {
    steps: [
      "Hold a bar or EZ bar at hip height with hands about shoulder-width.",
      "Pull the bar straight up your body to about chest height, elbows leading.",
      "Keep the bar close to you the whole way.",
      "Lower slowly back to your hips.",
    ],
    breathing: "Breathe out pulling up; breathe in lowering.",
    mistakes: [
      { mistake: "Pulling to chin height with a narrow grip", fix: "Chest height and shoulder-width grip protect your shoulders." },
      { mistake: "Swinging with the hips", fix: "Strict pull; lighten the bar." },
      { mistake: "Wrists bending upward", fix: "Elbows go high; wrists stay relaxed below them." },
    ],
    tips: ["If it ever pinches your shoulders, swap for lateral raises — no loss.", "Elbows lead the movement like puppet strings.", "The wider grip version is the safer version."],
  },
  "shoulders-barbell-shrugs": {
    steps: [
      "Hold the bar in front of your thighs with straight arms, shoulder-width grip.",
      "Stand tall with a proud chest.",
      "Shrug your shoulders straight up toward your ears as high as possible.",
      "Squeeze for a second, then lower slowly.",
    ],
    breathing: "Breathe out shrugging up; breathe in lowering.",
    mistakes: [
      { mistake: "Rolling the shoulders in circles", fix: "Straight up, straight down — rolling adds risk, not muscle." },
      { mistake: "Bending the elbows", fix: "Arms are ropes; traps do all the lifting." },
      { mistake: "Bouncy half shrugs with too much weight", fix: "Full squeeze at the top or drop weight." },
    ],
    tips: ["Pause at the top — the squeeze is the rep.", "Dumbbells at your sides work equally well.", "Keep your neck relaxed, look straight ahead."],
  },
  "shoulders-machine-shoulder-press": {
    steps: [
      "Adjust the seat so the handles sit at about shoulder height.",
      "Sit with your back fully against the pad, feet flat.",
      "Press the handles up until your arms are straight.",
      "Lower slowly back to shoulder height.",
    ],
    breathing: "Breathe out pressing; breathe in lowering.",
    mistakes: [
      { mistake: "Seat too low (handles start at your ears)", fix: "Raise the seat so handles begin at shoulder level." },
      { mistake: "Arching away from the pad", fix: "Ribs down, back flat against the seat." },
      { mistake: "Banging the stack at the bottom", fix: "Stop the stack just above touching between reps." },
    ],
    tips: ["The safest way to learn overhead pressing — the machine fixes the path.", "Perfect first shoulder exercise.", "Light stack, full range, smooth reps."],
  },

  // ============================================================ ABS
  "abs-plank": {
    steps: [
      "Place your forearms on the floor, elbows under your shoulders.",
      "Step your feet back so your body forms one straight line.",
      "Squeeze your glutes and abs, and press the floor away with your forearms.",
      "Hold the position while breathing steadily.",
    ],
    breathing: "Don't hold your breath — breathe slowly and steadily the whole hold.",
    mistakes: [
      { mistake: "Hips sagging toward the floor", fix: "Squeeze your glutes and tuck your tailbone slightly." },
      { mistake: "Hips piked up like a tent", fix: "Lower them until shoulders, hips, and heels line up." },
      { mistake: "Holding your breath", fix: "Steady breathing is part of the exercise." },
    ],
    tips: ["20–30 seconds done perfectly beats 2 shaky minutes.", "Look at the floor to keep your neck neutral.", "Shaking means it's working."],
  },
  "abs-crunches": {
    steps: [
      "Lie on your back, knees bent, feet flat on the floor.",
      "Place your fingertips lightly behind your ears (not clasped).",
      "Curl your shoulder blades off the floor, ribs toward hips.",
      "Lower slowly until your shoulders touch down again.",
    ],
    breathing: "Breathe out as you crunch up; breathe in lowering.",
    mistakes: [
      { mistake: "Yanking your neck with your hands", fix: "Fingertips touch, never pull — imagine an apple under your chin." },
      { mistake: "Sitting all the way up", fix: "A crunch is small — shoulder blades up is the full range." },
      { mistake: "Fast bouncing reps", fix: "Slow curl up, slow lower — feel your abs fold." },
    ],
    tips: ["Exhale hard at the top to feel the squeeze.", "Lower back stays on the floor at all times.", "Quality range beats rep count."],
  },
  "abs-lying-leg-raises": {
    steps: [
      "Lie flat with legs straight, hands under your hips for support.",
      "Press your lower back gently into the floor.",
      "Raise your legs together until they point at the ceiling.",
      "Lower them slowly, stopping before your lower back arches off the floor.",
    ],
    breathing: "Breathe out raising the legs; breathe in lowering.",
    mistakes: [
      { mistake: "Lower back arching off the floor", fix: "Don't lower the legs as far — range grows with strength." },
      { mistake: "Bending and straightening the knees mid-rep", fix: "Pick one knee angle (bent is easier) and keep it." },
      { mistake: "Swinging the legs with momentum", fix: "Slow both directions, especially down." },
    ],
    tips: ["Bend your knees to make it easier — totally allowed.", "Hands under hips protect the lower back.", "The slow lowering is the money half."],
  },
  "abs-russian-twists": {
    steps: [
      "Sit on the floor, knees bent, heels lightly touching the ground.",
      "Lean back slightly with a straight back until your abs switch on.",
      "Clasp your hands (or hold a light plate) and rotate your torso to one side.",
      "Rotate to the other side — left plus right counts as two.",
    ],
    breathing: "Breathe out on each twist; breathe in through the center.",
    mistakes: [
      { mistake: "Rounding the back into a slump", fix: "Chest proud, spine long — lean back from the hips." },
      { mistake: "Only swinging the arms side to side", fix: "Turn your shoulders and ribs; the hands just follow." },
      { mistake: "Racing through reps", fix: "Controlled turns; feel your waist do the work." },
    ],
    tips: ["Feet down is easier; feet lifted is the progression.", "Bodyweight first, plate later.", "Turn your head with your torso."],
  },
  "abs-bicycle-crunches": {
    steps: [
      "Lie on your back, fingertips behind your ears, legs lifted with knees at 90°.",
      "Bring one knee in while extending the other leg out.",
      "Rotate your opposite elbow toward the bent knee.",
      "Switch sides in a smooth pedaling rhythm.",
    ],
    breathing: "Breathe out as elbow meets knee; breathe in switching sides.",
    mistakes: [
      { mistake: "Flapping the elbows toward the knee", fix: "Rotate your whole shoulder, not just the arm." },
      { mistake: "Pedaling too fast to feel anything", fix: "Slow motion bicycles are brutally effective." },
      { mistake: "Pulling on the neck", fix: "Fingertips touch lightly; chin stays off your chest." },
    ],
    tips: ["Think 'shoulder to knee', not 'elbow to knee'.", "The extended leg hovers — don't rest it on the floor.", "Steady rhythm like slow pedaling."],
  },
  "abs-mountain-climbers": {
    steps: [
      "Start in a push-up position, hands under shoulders.",
      "Drive one knee toward your chest.",
      "Switch legs in one quick motion, like running in place horizontally.",
      "Keep your hips level and your back flat throughout.",
    ],
    breathing: "Breathe rhythmically with the leg switches — never hold your breath.",
    mistakes: [
      { mistake: "Hips bouncing up into the air", fix: "Keep your body in the plank line; slow down if needed." },
      { mistake: "Shoulders drifting behind the hands", fix: "Shoulders stay stacked over wrists." },
      { mistake: "Tiny foot taps instead of knee drives", fix: "Drive each knee genuinely toward your chest." },
    ],
    tips: ["Slower with full range beats fast and sloppy.", "It's cardio and abs at once — expect your heart rate to jump.", "Screw your hands into the floor for stable shoulders."],
  },
  "abs-hanging-leg-raises": {
    steps: [
      "Hang from a pull-up bar with straight arms and shoulders pulled down.",
      "Brace your abs to stop any swinging.",
      "Raise your knees (easier) or straight legs (harder) to hip height or above.",
      "Lower slowly to a dead hang.",
    ],
    breathing: "Breathe out raising the legs; breathe in lowering.",
    mistakes: [
      { mistake: "Swinging and using momentum", fix: "Pause at the bottom of every rep until you're still." },
      { mistake: "Just lifting the thighs with a loose core", fix: "Tilt your pelvis up — think 'curl the hips', not 'lift the feet'." },
      { mistake: "Dropping the legs fast", fix: "The slow lower builds the strength." },
    ],
    tips: ["Start with bent-knee raises — straight legs come later.", "Grip the bar hard; it steadies everything.", "Fewer strict reps beat many swinging ones."],
  },
  "abs-cable-crunches": {
    steps: [
      "Kneel facing a high pulley holding the rope beside your head.",
      "Keep your hips still and high.",
      "Crunch your ribs down toward your pelvis, elbows aiming at your knees.",
      "Return slowly until your abs are fully stretched.",
    ],
    breathing: "Breathe out crunching down; breathe in on the stretch.",
    mistakes: [
      { mistake: "Sitting back onto your heels each rep", fix: "Hips stay frozen; only the spine curls." },
      { mistake: "Pulling with the arms", fix: "Hands just hold the rope by your head — abs move the weight." },
      { mistake: "Too heavy, too jerky", fix: "Moderate weight, smooth fold-and-unfold." },
    ],
    tips: ["The only ab move here you can progressively load — great for strength.", "Think 'fold like a book'.", "Keep the rope pinned beside your ears."],
  },
  "abs-dead-bug": {
    steps: [
      "Lie on your back, arms pointing at the ceiling, knees bent at 90° over your hips.",
      "Press your lower back into the floor — keep it there.",
      "Slowly lower your right arm and left leg toward the floor.",
      "Return and repeat with the opposite arm and leg.",
    ],
    breathing: "Breathe out slowly as your limbs lower; breathe in returning.",
    mistakes: [
      { mistake: "Lower back popping off the floor", fix: "Shorten the range — that's your honest limit for now." },
      { mistake: "Rushing the limbs down", fix: "Slow motion is the entire exercise." },
      { mistake: "Same-side arm and leg", fix: "Always opposite arm and leg together." },
    ],
    tips: ["Looks easy, humbles everyone — do it slowly.", "Great lower-back-friendly ab move.", "Exhale fully as the limbs lower; it locks your core in."],
  },
  "abs-ab-wheel-rollout": {
    steps: [
      "Kneel with the wheel under your shoulders, arms straight.",
      "Brace your abs and tuck your tailbone slightly.",
      "Roll the wheel forward only as far as you can keep your back flat.",
      "Pull the wheel back to your knees using your abs, not your arms.",
    ],
    breathing: "Breathe in rolling out; breathe out hard as you pull back in.",
    mistakes: [
      { mistake: "Hips sagging and back arching at full stretch", fix: "Roll out shorter — the arch means your abs lost the fight." },
      { mistake: "Bending the elbows to help", fix: "Arms stay straight like ski poles." },
      { mistake: "Starting with standing rollouts", fix: "From the knees for months first — standing is elite-level." },
    ],
    tips: ["The hardest ab exercise in the plan — short rollouts are victory.", "Do it on a mat; your knees will thank you.", "Stop the set the moment your lower back talks."],
    safety: "If you feel this in your lower back instead of your abs, shorten the range or swap it for dead bugs.",
  },
};

/** Look up the guide for an exercise id (undefined for cardio ids). */
export function getExerciseGuide(exerciseId: string): ExerciseGuide | undefined {
  return EXERCISE_GUIDES[exerciseId];
}
