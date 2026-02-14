import { Pressable, View, StyleSheet, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { getSpineColor } from '@/lib/theme/colors';
import type { BookResponseDto } from '@/api/generated/models';

interface Props {
  book: BookResponseDto;
  onPress: () => void;
  onLongPress?: () => void;
}

export function BookCover({ book, onPress, onLongPress }: Props) {
  const bgColor = getSpineColor(book.title);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.container,
        {
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <View />

      {/* Book Face */}
      <View style={[styles.face, { backgroundColor: bgColor }]}>
        {/* Inner Border (Gold Foil Detail) */}
        <View style={styles.innerBorder} />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={4}>
            {book.title}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 2 / 3.2,
    position: 'relative',
    // Book shadow
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },

  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
    overflow: 'hidden',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.1)',
  },
  innerBorder: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    bottom: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '30%',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    fontFamily: serifFont,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    lineHeight: 15,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  divider: {
    width: 24,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 8,
  },
  author: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: serifFont,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
