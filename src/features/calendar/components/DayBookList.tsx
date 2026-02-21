import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { getSpineColor } from '@/lib/theme/colors';
import type { CreateReviewDtoSticker } from '@/api/generated/models';
import { StickerIcon } from '@/features/review/components/stickers';
import { CalendarBookInfo } from '../types';
import { formatKoreanDate } from '../utils';
import { styles } from './DayBookList.style';

const MOOD_THEME: Record<
  CreateReviewDtoSticker,
  { accent: string; cardBg: string; stickerBg: string }
> = {
  sparkle: { accent: '#E2A308', cardBg: '#FFFDF5', stickerBg: '#FEF9C3' },
  plant: { accent: '#5BA847', cardBg: '#F8FDF5', stickerBg: '#ECFCCB' },
  coffee: { accent: '#E0793A', cardBg: '#FFF9F5', stickerBg: '#FFEDD5' },
  moon: { accent: '#7B6DC2', cardBg: '#F9F8FF', stickerBg: '#F5F3FF' },
};

const DEFAULT_THEME = {
  accent: 'transparent',
  cardBg: '#fff',
  stickerBg: 'transparent',
};

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
        books.map((book) => {
          const mood = book.sticker
            ? MOOD_THEME[book.sticker]
            : DEFAULT_THEME;

          return (
            <Pressable
              key={book.reviewId}
              style={[styles.bookItem, { backgroundColor: mood.cardBg }]}
              onPress={() =>
                router.push(
                  `/(main)/(bookshelf)/review/${book.reviewId}?bookId=${book.bookId}`,
                )
              }
            >
              <View
                style={[styles.accentLine, { backgroundColor: mood.accent }]}
              />
              {book.thumbnail ? (
                <Image
                  testID={`book-thumbnail-${book.reviewId}`}
                  source={{ uri: book.thumbnail }}
                  style={styles.thumbnail}
                />
              ) : (
                <View
                  testID={`book-spine-${book.reviewId}`}
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
                <Text style={styles.reviewTitle} numberOfLines={1}>
                  {book.reviewTitle}
                </Text>
                <Text style={styles.pageRange}>
                  p.{book.startPage} - p.{book.endPage}
                </Text>
                {book.reviewContent.length > 0 && (
                  <Text style={styles.reviewContent} numberOfLines={2}>
                    {book.reviewContent}
                  </Text>
                )}
              </View>
              {book.sticker && (
                <View
                  style={[
                    styles.stickerCircle,
                    { backgroundColor: mood.stickerBg },
                  ]}
                >
                  <StickerIcon type={book.sticker} size={28} />
                </View>
              )}
            </Pressable>
          );
        })
      )}
    </View>
  );
}
