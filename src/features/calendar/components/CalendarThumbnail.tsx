import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { getSpineColor } from '@/lib/theme/colors';

interface CalendarThumbnailProps {
  title: string;
  thumbnail: string | null | undefined;
}

const THUMB_WIDTH = 14;
const THUMB_HEIGHT = 20;

export function CalendarThumbnail({ title, thumbnail }: CalendarThumbnailProps) {
  if (thumbnail) {
    return (
      <Image
        testID="calendar-thumbnail-image"
        source={{ uri: thumbnail }}
        style={styles.thumbnail}
      />
    );
  }

  return (
    <View
      testID="calendar-thumbnail-color"
      style={[styles.thumbnail, { backgroundColor: getSpineColor(title) }]}
    />
  );
}

const styles = StyleSheet.create({
  thumbnail: {
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    borderRadius: 2,
  },
});
