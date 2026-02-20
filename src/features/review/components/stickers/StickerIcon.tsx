import type { CreateReviewDtoSticker } from '@/api/generated/models';

import { CoffeeIcon } from './CoffeeIcon';
import { MoonIcon } from './MoonIcon';
import { PlantIcon } from './PlantIcon';
import { SparkleIcon } from './SparkleIcon';

interface StickerIconProps {
  type: CreateReviewDtoSticker;
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
}

const STICKER_MAP = {
  sparkle: SparkleIcon,
  plant: PlantIcon,
  coffee: CoffeeIcon,
  moon: MoonIcon,
} as const;

export function StickerIcon({
  type,
  size,
  backgroundColor,
  borderColor,
}: StickerIconProps) {
  const Icon = STICKER_MAP[type];

  return (
    <Icon
      size={size}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
    />
  );
}
