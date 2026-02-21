import { View, TouchableOpacity } from 'react-native';
import type { CreateReviewDtoSticker } from '@/api/generated/models';
import { StickerIcon } from './stickers';
import { styles } from './StickerSelector.style';

const STICKER_TYPES: CreateReviewDtoSticker[] = [
  'sparkle',
  'plant',
  'coffee',
  'moon',
];

const STICKER_COLORS: Record<
  CreateReviewDtoSticker,
  { bg: string; border: string; selectedBg: string }
> = {
  sparkle: { bg: '#FEF9C3', border: '#E2A308', selectedBg: '#FDE047' },
  plant: { bg: '#ECFCCB', border: '#5BA847', selectedBg: '#BEF264' },
  coffee: { bg: '#FFEDD5', border: '#E0793A', selectedBg: '#FDBA74' },
  moon: { bg: '#F5F3FF', border: '#7B6DC2', selectedBg: '#DDD6FE' },
};

interface StickerSelectorProps {
  selected: CreateReviewDtoSticker | null;
  onSelect: (sticker: CreateReviewDtoSticker) => void;
  size?: number;
}

export function StickerSelector({
  selected,
  onSelect,
  size = 72,
}: StickerSelectorProps) {
  return (
    <View style={styles.container}>
      {STICKER_TYPES.map((type) => {
        const isSelected = selected === type;
        const colors = STICKER_COLORS[type];

        return (
          <TouchableOpacity
            key={type}
            testID={`sticker-${type}`}
            accessibilityLabel={`스티커 ${type}`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(type)}
            style={styles.stickerButton}
            activeOpacity={0.7}
          >
            <StickerIcon
              type={type}
              size={size}
              backgroundColor={isSelected ? colors.selectedBg : colors.bg}
              borderColor={colors.border}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
