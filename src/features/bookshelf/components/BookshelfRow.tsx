import { View, StyleSheet } from 'react-native';
import { BookSpine } from './BookSpine';
import { colors } from '@/lib/theme/colors';
import type { Book } from '@/api/generated/models';

interface Props {
  books: Book[];
  onBookPress: (book: Book) => void;
  onBookLongPress?: (book: Book) => void;
}

export function BookshelfRow({ books, onBookPress, onBookLongPress }: Props) {
  return (
    <View style={styles.container}>
      {/* Books area */}
      <View style={styles.booksArea}>
        {books.map((book) => (
          <BookSpine
            key={book.id}
            book={book}
            onPress={() => onBookPress(book)}
            onLongPress={() => onBookLongPress?.(book)}
          />
        ))}
      </View>

      {/* Shelf board */}
      <View style={styles.shelfBoard}>
        <View style={styles.shelfHighlight} />
        <View style={styles.shelfLip} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24, // More space between shelves
  },
  booksArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    minHeight: 145,
    zIndex: 10, // Ensure books are above shelf shadow
    marginBottom: -4, // Slight overlap with shelf top to look "grounded"
  },
  shelfBoard: {
    height: 18,
    backgroundColor: colors.shelfBrown,
    marginHorizontal: 12,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    position: 'relative',
    // Strong shadow for depth
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    borderColor: '#3E2723',
    borderWidth: 1,
  },
  shelfHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)', // Subtle top lighting
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  shelfLip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.2)', // Shadow gradient at bottom
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
});
