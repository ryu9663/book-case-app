import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
}

const MAX_THUMBNAILS = 4;

export function CalendarDayCell({
  date,
  state,
  dateToBookMap,
}: CalendarDayCellProps) {
  const dayData = dateToBookMap[date.dateString];
  const books = dayData?.books ?? [];
  const visibleBooks = books.slice(0, MAX_THUMBNAILS);
  const overflow = books.length - MAX_THUMBNAILS;
  const isToday = state === 'today';
  const isDisabled = state === 'disabled';

  return (
    <View
      testID={isToday ? 'calendar-day-cell-today' : undefined}
      style={[styles.container, isToday && styles.todayContainer]}
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
    </View>
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
