import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';
import type { Book } from '@/types/models';

interface Props {
  book: Book;
}

export function BookInfoCard({ book }: Props) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.label}>제목</Text>
        <Text style={styles.value}>{book.title}</Text>

        <Text style={styles.label}>저자</Text>
        <Text style={styles.value}>{book.author}</Text>

        <Text style={styles.label}>ISBN</Text>
        <Text style={styles.value}>{book.isbn}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    backgroundColor: colors.warmWhite,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
    marginTop: 2,
  },
});
