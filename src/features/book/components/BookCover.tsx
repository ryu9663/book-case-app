import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { getSpineColor } from '@/lib/theme/colors';

interface Props {
  title: string;
  author: string;
  thumbnail?: string | null;
}

export function BookCover({ title, author, thumbnail }: Props) {
  const bgColor = getSpineColor(title);

  if (thumbnail) {
    return (
      <View style={styles.cover}>
        <Image source={{ uri: thumbnail }} style={styles.thumbnailImage} />
        <View style={styles.pagesRight} />
      </View>
    );
  }

  return (
    <View style={[styles.cover, { backgroundColor: bgColor }]}>
      {/* Spine lighting effect */}
      <View style={styles.spineHighlight} />

      {/* Decorative Frame */}
      <View style={styles.frame}>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={3}>
            {title}
          </Text>
          <View style={styles.ornament} />
          <Text style={styles.author} numberOfLines={2}>
            {author}
          </Text>
        </View>
      </View>

      {/* Book thickness effect (pages on right) */}
      <View style={styles.pagesRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: 160,
    height: 230,
    borderRadius: 4, // Slight rounding
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
  },
  spineHighlight: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.2)',
  },
  frame: {
    borderWidth: 2,
    borderColor: 'rgba(255,236,179, 0.5)', // Gold foil
    padding: 4,
    width: '85%',
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    color: '#FFF8E1', // Old Paper
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 26,

    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 16,
  },
  ornament: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,236,179, 0.6)',
    marginVertical: 12,
  },
  author: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,

    textAlign: 'center',
    fontStyle: 'italic',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  pagesRight: {
    position: 'absolute',
    right: 2,
    top: 6,
    bottom: 6,
    width: 4,
    backgroundColor: '#F5F5DC', // Pages color
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.1)',
    zIndex: -1, 
  },
});
