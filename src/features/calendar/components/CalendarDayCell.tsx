import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@/lib/theme/colors';
import { CalendarThumbnail } from './CalendarThumbnail';
import { DateToBookMap } from '../types';

interface DateData {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

interface CalendarDayCellProps {
  date: DateData;
  state: string;
  dateToBookMap: DateToBookMap;
  onPress?: (dateString: string) => void;
  isSelected?: boolean;
}

const MAX_THUMBNAILS = 4;

export function CalendarDayCell({
  date,
  state,
  dateToBookMap,
  onPress,
  isSelected,
}: CalendarDayCellProps) {
  const dayData = dateToBookMap[date.dateString];
  const allBooks = dayData?.books ?? [];
  const uniqueBooks = allBooks.filter(
    (book, index, self) =>
      self.findIndex((b) => b.bookId === book.bookId) === index,
  );
  const visibleBooks = uniqueBooks.slice(0, MAX_THUMBNAILS);
  const overflow = uniqueBooks.length - MAX_THUMBNAILS;
  const isToday = state === 'today';
  const isDisabled = state === 'disabled';

  const testID = isSelected
    ? 'calendar-day-cell-selected'
    : isToday
      ? 'calendar-day-cell-today'
      : undefined;

  return (
    <Pressable
      testID={testID}
      style={[
        styles.container,
        isToday && styles.todayContainer,
        isSelected && styles.selectedContainer,
      ]}
      onPress={() => onPress?.(date.dateString)}
    >
      <Text
        style={[
          styles.dayText,
          isToday && styles.todayText,
          isDisabled && styles.disabledText,
        ]}
      >
        {date.day}
      </Text>
      {visibleBooks.length > 0 && (
        <View style={styles.thumbnailGrid}>
          {visibleBooks.map((book) => (
            <CalendarThumbnail
              key={book.bookId}
              title={book.title}
              thumbnail={book.thumbnail}
            />
          ))}
          {overflow > 0 && (
            <Text style={styles.overflowText}>+{overflow}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 48,
    minHeight: 56,
    paddingVertical: 2,
  },
  todayContainer: {
    backgroundColor: 'rgba(93, 64, 55, 0.1)',
    borderRadius: 8,
  },
  selectedContainer: {
    borderColor: colors.shelfBrown,
    borderWidth: 1.5,
    borderRadius: 8,
    backgroundColor: 'rgba(93, 64, 55, 0.06)',
  },
  dayText: {
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  todayText: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  disabledText: {
    color: colors.textMuted,
  },
  thumbnailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 1,
    maxWidth: 36,
  },
  overflowText: {
    fontSize: 8,
    color: colors.textMuted,
    lineHeight: 12,
  },
});
