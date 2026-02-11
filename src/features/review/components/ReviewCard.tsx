import { StyleSheet, Platform } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';
import type { Review } from '@/api/generated/models';

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
    marginBottom: 16,
    backgroundColor: colors.warmWhite,
    borderWidth: 1,
    borderColor: '#E6DCC8',
    borderRadius: 0, // Sharp corners or very slight
    borderBottomRightRadius: 16, // Fold effect
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
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  },
  content: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
  },
});
