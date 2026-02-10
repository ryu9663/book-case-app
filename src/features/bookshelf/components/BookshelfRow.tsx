import { View, StyleSheet } from 'react-native';
import { BookSpine } from './BookSpine';
import { colors } from '@/lib/theme/colors';
import type { Book } from '@/types/models';

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
    marginBottom: 8,
  },
  booksArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    minHeight: 140,
  },
  shelfBoard: {
    height: 16,
    backgroundColor: colors.shelfBrown,
    marginHorizontal: 8,
    borderRadius: 2,
    position: 'relative',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  shelfHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.shelfHighlight,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    opacity: 0.6,
  },
  shelfLip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.shelfDark,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
});
