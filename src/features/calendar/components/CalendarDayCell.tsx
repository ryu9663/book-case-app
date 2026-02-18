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

const MAX_THUMBNAILS = 7;

function getColumns(bookCount: number): number {
  if (bookCount <= 1) return 1;
  if (bookCount <= 4) return 2;
  return 3;
}

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

  const cols = getColumns(visibleBooks.length);
  const rows: (typeof visibleBooks)[] = [];
  for (let i = 0; i < visibleBooks.length; i += cols) {
    rows.push(visibleBooks.slice(i, i + cols));
  }

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
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.thumbnailRow}>
              {row.map((book) => (
                <CalendarThumbnail
                  key={book.bookId}
                  title={book.title}
                  thumbnail={book.thumbnail}
                />
              ))}
            </View>
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
    height: 72,
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 8,
  },
  todayContainer: {
    backgroundColor: 'rgba(93, 64, 55, 0.1)',
  },
  selectedContainer: {
    borderColor: colors.shelfBrown,
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
    flex: 1,
    width: '100%',
    gap: 1,
  },
  thumbnailRow: {
    flexDirection: 'row',
    flex: 1,
    gap: 1,
  },
  overflowText: {
    fontSize: 8,
    color: colors.textMuted,
    lineHeight: 12,
    textAlign: 'center',
  },
});
