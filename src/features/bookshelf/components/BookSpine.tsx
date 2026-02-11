import { Pressable, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { getSpineColor } from '@/lib/theme/colors';
import type { Book } from '@/api/generated/models';

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
        { backgroundColor: bgColor, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      {/* Texture: Spine highlight (lighting) */}
      <View style={styles.lighting} />
      
      {/* Decorative Bands (Gold lines) */}
      <View style={[styles.band, { top: 12 }]} />
      <View style={[styles.band, { top: 16 }]} />
      <View style={[styles.band, { bottom: 16 }]} />
      <View style={[styles.band, { bottom: 12 }]} />

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  spine: {
    width: 38, // Slightly thinner for elegance
    height: 140,
    borderRadius: 3,
    marginHorizontal: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    // Realistic shadow
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 4,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.1)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.2)',
  },
  lighting: {
    position: 'absolute',
    top: 0, 
    left: 2, 
    bottom: 0,
    width: 4,
    backgroundColor: 'rgba(255,255,255,0.1)', // Subtle gloss
    zIndex: 1,
  },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,236,179, 0.6)', // Gold-ish
    zIndex: 1,
  },
  contentContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    paddingVertical: 20,
  },
  title: {
    color: '#FFF8E1', // Old Paper white
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    width: 120,
    transform: [{ rotate: '-90deg' }], 
    marginBottom: 4,
    // Try to force serif if system allows, otherwise sans is fine
    // fontFamily: 'System', 
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  author: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 8,
    textAlign: 'center',
    width: 100,
    transform: [{ rotate: '-90deg' }],
    marginTop: 2,
  },
});
