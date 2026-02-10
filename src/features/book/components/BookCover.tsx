import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { getSpineColor } from '@/lib/theme/colors';

interface Props {
  title: string;
  author: string;
}

export function BookCover({ title, author }: Props) {
  const bgColor = getSpineColor(title);

  return (
    <View style={[styles.cover, { backgroundColor: bgColor }]}>
      <View style={styles.spine} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={3}>
          {title}
        </Text>
        <View style={styles.divider} />
        <Text style={styles.author} numberOfLines={2}>
          {author}
        </Text>
      </View>
      <View style={styles.cornerTopLeft} />
      <View style={styles.cornerBottomRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    width: 160,
    height: 220,
    borderRadius: 4,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // Book shadow
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  spine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 22,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginVertical: 12,
  },
  author: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 8,
    left: 16,
    width: 20,
    height: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
});
