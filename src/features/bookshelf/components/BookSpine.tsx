import { Pressable, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { getSpineColor } from '@/lib/theme/colors';
import type { Book } from '@/types/models';

interface Props {
  book: Book;
  onPress: () => void;
  onLongPress?: () => void;
}

export function BookSpine({ book, onPress, onLongPress }: Props) {
  const bgColor = getSpineColor(book.title);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.spine,
        { backgroundColor: bgColor, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <View style={styles.topEdge} />
      <Text style={styles.title} numberOfLines={2}>
        {book.title}
      </Text>
      <Text style={styles.author} numberOfLines={1}>
        {book.author}
      </Text>
      <View style={styles.bottomEdge} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  spine: {
    width: 45,
    height: 140,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 3,
    marginHorizontal: 2,
    // Subtle 3D effect
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.2)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.2)',
  },
  topEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  bottomEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    transform: [{ rotate: '-90deg' }],
    width: 120,
  },
  author: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 7,
    textAlign: 'center',
    transform: [{ rotate: '-90deg' }],
    width: 100,
    marginTop: 4,
  },
});
