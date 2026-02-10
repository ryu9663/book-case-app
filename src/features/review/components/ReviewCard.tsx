import { StyleSheet } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';
import type { Review } from '@/types/models';

interface Props {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
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
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: colors.warmWhite,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  content: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
  },
});
