import Svg, { Circle, Path } from 'react-native-svg';

interface SparkleIconProps {
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
}

const ICON_COLOR = '#E2A308';

export function SparkleIcon({
  size = 80,
  backgroundColor = 'transparent',
  borderColor = 'transparent',
}: SparkleIconProps) {
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
      {/* Large 4-pointed star */}
      <Path
        d="M 35 26 Q 35 42, 51 42 Q 35 42, 35 58 Q 35 42, 19 42 Q 35 42, 35 26 Z"
        fill={ICON_COLOR}
      />
      {/* Small 4-pointed star */}
      <Path
        d="M 52 22 Q 52 28, 58 28 Q 52 28, 52 34 Q 52 28, 46 28 Q 52 28, 52 22 Z"
        fill={ICON_COLOR}
      />
    </Svg>
  );
}
