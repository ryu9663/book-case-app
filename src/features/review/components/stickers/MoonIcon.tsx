import Svg, { Circle, Path } from 'react-native-svg';

interface MoonIconProps {
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
}

const ICON_COLOR = '#7B6DC2';

export function MoonIcon({
  size = 80,
  backgroundColor = 'transparent',
  borderColor = 'transparent',
}: MoonIconProps) {
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
      {/* Crescent moon */}
      <Path
        d="M 35 24 C 49 22, 58 31, 57 41 C 56 51, 47 59, 35 57 C 42 52, 46 47, 46 41 C 46 35, 42 29, 35 24 Z"
        fill={ICON_COLOR}
      />
    </Svg>
  );
}
