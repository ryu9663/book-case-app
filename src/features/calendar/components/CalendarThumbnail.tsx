import React from 'react';
import { Image, View } from 'react-native';
import { getSpineColor } from '@/lib/theme/colors';

interface CalendarThumbnailProps {
  title: string;
  thumbnail: string | null | undefined;
}

export function CalendarThumbnail({ title, thumbnail }: CalendarThumbnailProps) {
  if (thumbnail) {
    return (
      <Image
        testID="calendar-thumbnail-image"
        source={{ uri: thumbnail }}
        style={styles.thumbnail}
        resizeMode="cover"
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

const styles = {
  thumbnail: {
    flex: 1,
    borderRadius: 2,
  },
} as const;
