import { StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';
import type { BookResponseDto } from '@/api/generated/models';

interface Props {
  book: BookResponseDto;
}

export function BookInfoCard({ book }: Props) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.label}>제목</Text>
        <Text style={styles.value}>{book.title}</Text>

        <Text style={styles.label}>저자</Text>
        <Text style={styles.value}>{book.author}</Text>

        {book.publisher ? (
          <>
            <Text style={styles.label}>출판사</Text>
            <Text style={styles.value}>{book.publisher}</Text>
          </>
        ) : null}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 24,
    // backgroundColor: colors.paper, // Vintage paper
    // borderWidth: 1,
    // borderColor: '#D7CCC8',
    // Paper shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // elevation: 2,
    borderRadius: 2, // Less rounded, more like card
    backgroundColor: 'rgba(255, 253, 245, 0.8)',
  },
  label: {
    fontSize: 12,
    color: colors.textMuted, // Faded ink
    marginTop: 12,

    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontSize: 18,
    color: colors.textPrimary, // Dark ink
    fontWeight: '500',
    marginTop: 4,

  },
});
