import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/lib/theme/colors';
import { getSpineColor } from '@/lib/theme/colors';
import { CalendarBookInfo } from '../types';
import { formatKoreanDate } from '../utils';

interface DayBookListProps {
  selectedDate: string | null;
  books: CalendarBookInfo[];
}

export function DayBookList({ selectedDate, books }: DayBookListProps) {
  if (selectedDate === null) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.dateHeader}>{formatKoreanDate(selectedDate)}</Text>
      {books.length === 0 ? (
        <Text style={styles.emptyText}>이 날 읽은 책이 없습니다</Text>
      ) : (
        books.map((book) => (
          <Pressable
            key={book.bookId}
            style={styles.bookItem}
            onPress={() =>
              router.push(`/(main)/(bookshelf)/book/${book.bookId}`)
            }
          >
            {book.thumbnail ? (
              <Image
                testID={`book-thumbnail-${book.bookId}`}
                source={{ uri: book.thumbnail }}
                style={styles.thumbnail}
              />
            ) : (
              <View
                testID={`book-spine-${book.bookId}`}
                style={[
                  styles.thumbnail,
                  { backgroundColor: getSpineColor(book.title) },
                ]}
              />
            )}
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle} numberOfLines={1}>
                {book.title}
              </Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>
                {book.author}
              </Text>
            </View>
          </Pressable>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateHeader: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 16,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.warmWhite,
    borderRadius: 8,
    marginBottom: 8,
  },
  thumbnail: {
    width: 40,
    height: 56,
    borderRadius: 4,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  bookAuthor: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
