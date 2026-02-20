import Svg, { Circle, Path, Rect } from 'react-native-svg';

interface PlantIconProps {
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
}

const ICON_COLOR = '#5BA847';

export function PlantIcon({
  size = 80,
  backgroundColor = 'transparent',
  borderColor = 'transparent',
}: PlantIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <Circle cx="40" cy="40" r="36" fill={backgroundColor} />
      <Circle
        cx="40"
        cy="40"
        r="36"
        stroke={borderColor}
        strokeWidth="1.8"
        strokeDasharray="5 4"
        fill="none"
      />
      {/* Pot rim */}
      <Rect x="29" y="44" width="22" height="4" rx="1.5" fill={ICON_COLOR} />
      {/* Pot body */}
      <Path
        d="M 31 48 L 33 57 Q 33.5 58.5, 35 58.5 L 45 58.5 Q 46.5 58.5, 47 57 L 49 48 Z"
        fill={ICON_COLOR}
      />
      {/* Stem */}
      <Path
        d="M 40 44 L 40 33"
        stroke={ICON_COLOR}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Left leaf */}
      <Path
        d="M 40 36 C 36 34, 30 30, 32 25 C 34 27, 38 32, 40 36 Z"
        fill={ICON_COLOR}
      />
      {/* Right leaf */}
      <Path
        d="M 40 32 C 44 30, 50 26, 48 21 C 46 23, 42 28, 40 32 Z"
        fill={ICON_COLOR}
      />
    </Svg>
  );
}
