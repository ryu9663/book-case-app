import { StyleSheet, Platform, View } from 'react-native';
import { Card, Text, IconButton, Divider } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';
import type { ReviewResponseDto } from '@/api/generated/models';

interface Props {
  review: ReviewResponseDto;
  onEdit: () => void;
  onDelete: () => void;
}

function formatDateDisplay(dateStr: string): string {
  return dateStr.replace(/-/g, '.');
}

export function ReviewCard({ review, onEdit, onDelete }: Props) {
  return (
    <Card style={styles.card}>
      <Card.Title
        title={review.title}
        titleStyle={styles.title}
        right={() => (
          <>
            <IconButton icon="pencil" size={18} onPress={onEdit} />
            <IconButton icon="delete" size={18} onPress={onDelete} />
          </>
        )}
        rightStyle={styles.actions}
      />
      <Card.Content>
        <Text numberOfLines={3} style={styles.content}>
          {review.content}
        </Text>
        <Divider style={styles.divider} />
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {formatDateDisplay(review.startDate)} ~{' '}
            {formatDateDisplay(review.endDate)}
          </Text>
          <Text style={styles.metaText}>
            p.{review.startPage} - p.{review.endPage}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: colors.warmWhite,
    borderWidth: 1,
    borderColor: '#E6DCC8',
    borderRadius: 0,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: serifFont,
  },
  content: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    fontFamily: serifFont,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  divider: {
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#E6DCC8',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: serifFont,
  },
});
