import { StyleSheet, View, Pressable } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';
import type { ReviewResponseDto } from '@/api/generated/models';

const MAX_LINES = 3;

interface Props {
  review: ReviewResponseDto;
  onEdit: () => void;
  onDelete: () => void;
}

function formatDateDisplay(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

export function ReviewCard({ review, onEdit, onDelete }: Props) {
  return (
    <Pressable onPress={onEdit} style={styles.card}>
      <View style={styles.accentLine} />
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={styles.date}>{formatDateDisplay(review.endDate)}</Text>
          <View style={styles.headerRight}>
            <View style={styles.pagesBadge}>
              <Text style={styles.pagesBadgeText}>
                p.{review.startPage}–{review.endPage}
              </Text>
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
        </View>
        <Text
          testID="review-content"
          numberOfLines={MAX_LINES}
          style={styles.content}
        >
          "{review.content}"
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  accentLine: {
    width: 4,
    backgroundColor: colors.accentGreen,
  },
  body: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  date: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  pagesBadge: {
    backgroundColor: colors.accentGreen,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pagesBadgeText: {
    fontSize: 11,
    color: '#fff',
    letterSpacing: 0.3,
  },
  deleteButton: {
    margin: 0,
  },
  content: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
  },
});
