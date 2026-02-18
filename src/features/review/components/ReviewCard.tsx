import { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  LayoutAnimation,
} from 'react-native';
import { Card, Text, IconButton, Divider } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';
import type { ReviewResponseDto } from '@/api/generated/models';
import type { TextLayoutEvent } from 'react-native';

const MAX_LINES = 5;

interface Props {
  review: ReviewResponseDto;
  onEdit: () => void;
  onDelete: () => void;
}

function formatDateDisplay(dateStr: string): string {
  return dateStr.replace(/-/g, '.');
}

export function ReviewCard({ review, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isTruncatable, setIsTruncatable] = useState(false);

  const handleTextLayout = useCallback(
    (e: TextLayoutEvent) => {
      if (!isTruncatable && e.nativeEvent.lines.length >= MAX_LINES) {
        setIsTruncatable(true);
      }
    },
    [isTruncatable],
  );

  return (
    <Card style={styles.card}>
      <Card.Title
        title={review.title}
        titleStyle={styles.title}
        right={() => (
          <>
            <IconButton
              icon="pencil"
              size={18}
              onPress={onEdit}
              accessibilityLabel="독후감 수정"
            />
            <IconButton
              icon="delete"
              size={18}
              onPress={onDelete}
              accessibilityLabel="독후감 삭제"
            />
          </>
        )}
        rightStyle={styles.actions}
      />
      <Card.Content>
        <Text
          testID="review-content"
          numberOfLines={expanded ? undefined : MAX_LINES}
          onTextLayout={handleTextLayout}
          style={styles.content}
        >
          <Text style={styles.firstLetter}>{review.content.charAt(0)}</Text>
          {review.content.slice(1)}
        </Text>
        {isTruncatable && (
          <Pressable
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setExpanded(!expanded);
            }}
            accessibilityRole="button"
            accessibilityLabel={
              expanded ? '독후감 내용 접기' : '독후감 내용 더보기'
            }
            style={styles.toggleButton}
          >
            <Text style={styles.toggleText}>
              {expanded ? '접기' : '더보기'}
            </Text>
          </Pressable>
        )}
        <Divider style={styles.divider} />
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {formatDateDisplay(review.startDate)} ~{' '}
            {formatDateDisplay(review.endDate)}
          </Text>
          <Text style={styles.metaText}>
            p.{review.startPage} - p.{review.endPage}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    backgroundColor: colors.warmWhite,
    borderWidth: 1,
    borderColor: '#E6DCC8',
    borderRadius: 0,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,

  },
  content: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,

    marginTop: 4,
  },
  firstLetter: {
    fontSize: 28,
    lineHeight: 34,

    color: colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
  },
  divider: {
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#E6DCC8',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,

  },
  toggleButton: {
    alignSelf: 'flex-end' as const,
    marginTop: 6,
    padding: 15,
  },
  toggleText: {
    fontSize: 13,
    color: colors.textMuted,

    textDecorationLine: 'underline' as const,
  },
});
