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
        d="M 43 22 A 18 18 0 1 0 43 58 A 14 14 0 1 1 43 22 Z"
        fill={ICON_COLOR}
      />
    </Svg>
  );
}
