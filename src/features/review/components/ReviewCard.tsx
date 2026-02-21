import { StyleSheet, View, Pressable } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';
import type {
  ReviewResponseDto,
  CreateReviewDtoSticker,
} from '@/api/generated/models';
import { StickerIcon } from './stickers';

const MAX_LINES = 3;

type ReviewWithSticker = ReviewResponseDto & {
  sticker?: CreateReviewDtoSticker;
};

interface Props {
  review: ReviewWithSticker;
  onEdit: () => void;
  onDelete: () => void;
}

const MOOD_THEME: Record<
  CreateReviewDtoSticker,
  { accent: string; cardBg: string; badgeBg: string; stickerBg: string }
> = {
  sparkle: {
    accent: '#E2A308',
    cardBg: '#FFFDF5',
    badgeBg: '#F6E7A0',
    stickerBg: '#FEF9C3',
  },
  plant: {
    accent: '#5BA847',
    cardBg: '#F8FDF5',
    badgeBg: '#C6E8A8',
    stickerBg: '#ECFCCB',
  },
  coffee: {
    accent: '#E0793A',
    cardBg: '#FFF9F5',
    badgeBg: '#F5C9A0',
    stickerBg: '#FFEDD5',
  },
  moon: {
    accent: '#7B6DC2',
    cardBg: '#F9F8FF',
    badgeBg: '#C9C3E8',
    stickerBg: '#F5F3FF',
  },
};

const DEFAULT_THEME = {
  accent: colors.accentGreen,
  cardBg: '#fff',
  badgeBg: colors.accentGreen,
  stickerBg: 'transparent',
};

function formatDateDisplay(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

export function ReviewCard({ review, onEdit, onDelete }: Props) {
  const mood = review.sticker ? MOOD_THEME[review.sticker] : DEFAULT_THEME;

  return (
    <Pressable
      onPress={onEdit}
      style={[styles.card, { backgroundColor: mood.cardBg }]}
    >
      <View style={[styles.accentLine, { backgroundColor: mood.accent }]} />
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            {review.sticker && (
              <View
                style={[styles.stickerCircle, { backgroundColor: mood.stickerBg }]}
              >
                <StickerIcon type={review.sticker} size={36} />
              </View>
            )}
            <View>
              <Text style={styles.date}>
                {formatDateDisplay(review.endDate)}
              </Text>
              <View style={[styles.pagesBadge, { backgroundColor: mood.badgeBg }]}>
                <Text style={[styles.pagesBadgeText, { color: mood.accent }]}>
                  p.{review.startPage}–{review.endPage}
                </Text>
              </View>
            </View>
          </View>
          <IconButton
            icon="delete-outline"
            size={16}
            iconColor={colors.textMuted}
            onPress={onDelete}
            accessibilityLabel="독후감 삭제"
            style={styles.deleteButton}
          />
        </View>
        <Text
          testID="review-content"
          numberOfLines={MAX_LINES}
          style={styles.content}
        >
          <Text style={[styles.quote, { color: mood.accent }]}>" </Text>
          {review.content}
          <Text style={[styles.quote, { color: mood.accent }]}> "</Text>
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  accentLine: {
    width: 5,
  },
  body: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stickerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 3,
  },
  pagesBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pagesBadgeText: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  deleteButton: {
    margin: 0,
  },
  content: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  quote: {
    fontSize: 16,
  },
});
