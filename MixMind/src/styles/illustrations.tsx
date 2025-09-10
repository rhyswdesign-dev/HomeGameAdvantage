import Svg, { Circle, Path, Rect, Ellipse, Line } from 'react-native-svg';

const ILLUSTRATION_SIZE = 120;

export function WelcomeIllustration() {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 120 120">
      {/* Martini Glass */}
      <Path
        d="M20 30 L60 70 L100 30 L90 20 L30 20 Z"
        fill="#f59e0b"
        fillOpacity={0.8}
      />
      <Rect
        x="58"
        y="70"
        width="4"
        height="30"
        fill="#d97706"
      />
      <Rect
        x="45"
        y="98"
        width="30"
        height="4"
        rx="2"
        fill="#d97706"
      />
      {/* Olive */}
      <Circle
        cx="60"
        cy="45"
        r="3"
        fill="#22c55e"
      />
    </Svg>
  );
}

export function FeaturesIllustration() {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 120 120">
      {/* Trophy */}
      <Path
        d="M35 40 L35 60 Q35 75 50 75 L70 75 Q85 75 85 60 L85 40 Z"
        fill="#f59e0b"
        fillOpacity={0.8}
      />
      {/* Trophy Base */}
      <Rect
        x="40"
        y="75"
        width="40"
        height="8"
        rx="4"
        fill="#d97706"
      />
      <Rect
        x="45"
        y="83"
        width="30"
        height="12"
        rx="6"
        fill="#b45309"
      />
      {/* Handles */}
      <Path
        d="M35 45 Q25 45 25 55 Q25 65 35 65"
        stroke="#f59e0b"
        strokeWidth="3"
        fill="none"
      />
      <Path
        d="M85 45 Q95 45 95 55 Q95 65 85 65"
        stroke="#f59e0b"
        strokeWidth="3"
        fill="none"
      />
      {/* Star */}
      <Path
        d="M60 50 L62 56 L68 56 L63 60 L65 66 L60 62 L55 66 L57 60 L52 56 L58 56 Z"
        fill="#fbbf24"
      />
    </Svg>
  );
}

export function CommunityIllustration() {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 120 120">
      {/* People circles */}
      <Circle cx="45" cy="35" r="12" fill="#f59e0b" fillOpacity={0.8} />
      <Circle cx="75" cy="35" r="12" fill="#f59e0b" fillOpacity={0.6} />
      <Circle cx="60" cy="60" r="12" fill="#f59e0b" fillOpacity={0.9} />
      
      {/* Connection lines */}
      <Line x1="45" y1="47" x2="60" y2="48" stroke="#f59e0b" strokeWidth="2" opacity={0.6} />
      <Line x1="75" y1="47" x2="60" y2="48" stroke="#f59e0b" strokeWidth="2" opacity={0.6} />
      
      {/* Chat bubbles */}
      <Circle cx="30" cy="55" r="8" fill="#fbbf24" fillOpacity={0.7} />
      <Circle cx="90" cy="55" r="6" fill="#fbbf24" fillOpacity={0.5} />
      <Circle cx="60" cy="85" r="7" fill="#fbbf24" fillOpacity={0.6} />
    </Svg>
  );
}

export function CommerceIllustration() {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 120 120">
      {/* Shopping cart */}
      <Path
        d="M25 25 L35 25 L45 70 L85 70"
        stroke="#f59e0b"
        strokeWidth="3"
        fill="none"
      />
      <Rect
        x="40"
        y="35"
        width="35"
        height="25"
        rx="3"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2"
      />
      {/* Wheels */}
      <Circle cx="50" cy="80" r="5" fill="#f59e0b" />
      <Circle cx="75" cy="80" r="5" fill="#f59e0b" />
      
      {/* Bottle in cart */}
      <Rect
        x="52"
        y="40"
        width="6"
        height="20"
        rx="3"
        fill="#fbbf24"
        fillOpacity={0.8}
      />
      <Circle cx="55" cy="38" r="2" fill="#d97706" />
      
      {/* Price tag */}
      <Rect
        x="80"
        y="30"
        width="15"
        height="8"
        rx="2"
        fill="#22c55e"
        fillOpacity={0.7}
      />
    </Svg>
  );
}

export function PermissionsIllustration() {
  return (
    <Svg width={ILLUSTRATION_SIZE} height={ILLUSTRATION_SIZE} viewBox="0 0 120 120">
      {/* Phone outline */}
      <Rect
        x="40"
        y="20"
        width="40"
        height="70"
        rx="8"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="3"
      />
      
      {/* Screen */}
      <Rect
        x="45"
        y="28"
        width="30"
        height="45"
        rx="2"
        fill="#1f2937"
      />
      
      {/* Permission icons */}
      <Circle cx="55" cy="40" r="4" fill="#22c55e" fillOpacity={0.8} />
      <Circle cx="65" cy="40" r="4" fill="#f59e0b" fillOpacity={0.8} />
      <Circle cx="55" cy="55" r="4" fill="#3b82f6" fillOpacity={0.8} />
      <Circle cx="65" cy="55" r="4" fill="#ef4444" fillOpacity={0.8} />
      
      {/* Home button */}
      <Circle cx="60" cy="85" r="3" fill="#6b7280" />
      
      {/* Floating permission symbols */}
      <Circle cx="25" cy="45" r="6" fill="#22c55e" fillOpacity={0.3} />
      <Circle cx="95" cy="45" r="6" fill="#f59e0b" fillOpacity={0.3} />
      <Circle cx="30" cy="75" r="5" fill="#3b82f6" fillOpacity={0.3} />
      <Circle cx="90" cy="75" r="5" fill="#ef4444" fillOpacity={0.3} />
    </Svg>
  );
}