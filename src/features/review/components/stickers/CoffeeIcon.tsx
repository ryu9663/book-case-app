import Svg, { Circle, Path } from 'react-native-svg';

interface CoffeeIconProps {
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
}

const ICON_COLOR = '#E0793A';

export function CoffeeIcon({
  size = 80,
  backgroundColor = 'transparent',
  borderColor = 'transparent',
}: CoffeeIconProps) {
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
      {/* Cup body */}
      <Path
        d="M 23 34 L 26 50 Q 26.5 53, 29 53 L 45 53 Q 47.5 53, 48 50 L 51 34 Z"
        fill={ICON_COLOR}
      />
      {/* Handle */}
      <Path
        d="M 51 37 C 56 37, 58 41, 58 44 C 58 47, 56 51, 51 51"
        stroke={ICON_COLOR}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Saucer */}
      <Path
        d="M 20 55 Q 37 60, 54 55"
        stroke={ICON_COLOR}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
