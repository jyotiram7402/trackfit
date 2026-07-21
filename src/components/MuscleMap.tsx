import type { MuscleGroup } from "@/types/workout";

/**
 * A simple front + back body diagram that highlights the muscles an exercise
 * works — primary in strong teal, secondary in light teal. Pure SVG, so it
 * loads instantly and looks consistent (not photographs).
 */
export default function MuscleMap({
  primary,
  secondary = [],
}: {
  primary: MuscleGroup;
  secondary?: MuscleGroup[];
}) {
  const tone = (g: MuscleGroup) =>
    g === primary ? "#26a8a3" : secondary.includes(g) ? "#7cddd5" : "#ccd7dc";

  const BASE = "#e8eef1";

  return (
    <div>
      <svg viewBox="0 0 240 175" className="h-auto w-full" role="img" aria-label="Muscles worked diagram">
        {/* ---------- FRONT ---------- */}
        <g>
          {/* silhouette */}
          <circle cx="60" cy="20" r="13" fill={BASE} />
          <rect x="44" y="38" width="32" height="50" rx="9" fill={BASE} />
          <rect x="30" y="40" width="11" height="42" rx="5" fill={BASE} />
          <rect x="79" y="40" width="11" height="42" rx="5" fill={BASE} />
          <rect x="46" y="88" width="13" height="56" rx="6" fill={BASE} />
          <rect x="61" y="88" width="13" height="56" rx="6" fill={BASE} />
          {/* muscles */}
          <ellipse cx="45" cy="43" rx="7" ry="6" fill={tone("shoulders")} />
          <ellipse cx="75" cy="43" rx="7" ry="6" fill={tone("shoulders")} />
          <rect x="46" y="43" width="13" height="13" rx="3" fill={tone("chest")} />
          <rect x="61" y="43" width="13" height="13" rx="3" fill={tone("chest")} />
          <rect x="54" y="59" width="12" height="22" rx="3" fill={tone("abs")} />
          <rect x="31" y="47" width="9" height="18" rx="4" fill={tone("biceps")} />
          <rect x="80" y="47" width="9" height="18" rx="4" fill={tone("biceps")} />
          <rect x="47" y="90" width="11" height="30" rx="5" fill={tone("legs")} />
          <rect x="62" y="90" width="11" height="30" rx="5" fill={tone("legs")} />
          <text x="60" y="162" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(22,50,79,0.5)">
            Front
          </text>
        </g>

        {/* ---------- BACK ---------- */}
        <g>
          <circle cx="180" cy="20" r="13" fill={BASE} />
          <rect x="164" y="38" width="32" height="50" rx="9" fill={BASE} />
          <rect x="150" y="40" width="11" height="42" rx="5" fill={BASE} />
          <rect x="199" y="40" width="11" height="42" rx="5" fill={BASE} />
          <rect x="166" y="88" width="13" height="56" rx="6" fill={BASE} />
          <rect x="181" y="88" width="13" height="56" rx="6" fill={BASE} />
          {/* muscles */}
          <ellipse cx="165" cy="43" rx="7" ry="6" fill={tone("shoulders")} />
          <ellipse cx="195" cy="43" rx="7" ry="6" fill={tone("shoulders")} />
          <rect x="166" y="45" width="28" height="27" rx="4" fill={tone("back")} />
          <rect x="151" y="47" width="9" height="18" rx="4" fill={tone("triceps")} />
          <rect x="200" y="47" width="9" height="18" rx="4" fill={tone("triceps")} />
          <rect x="167" y="90" width="11" height="28" rx="5" fill={tone("legs")} />
          <rect x="182" y="90" width="11" height="28" rx="5" fill={tone("legs")} />
          <rect x="167" y="120" width="11" height="22" rx="5" fill={tone("legs")} />
          <rect x="182" y="120" width="11" height="22" rx="5" fill={tone("legs")} />
          <text x="180" y="162" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(22,50,79,0.5)">
            Back
          </text>
        </g>
      </svg>

      <div className="mt-2 flex justify-center gap-4 text-xs text-navy-700/70">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ background: "#26a8a3" }} />
          Primary
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ background: "#7cddd5" }} />
          Secondary
        </span>
      </div>
    </div>
  );
}
