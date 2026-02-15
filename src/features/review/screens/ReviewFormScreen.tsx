import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { DatePickerModal } from 'react-native-paper-dates';
import {
  useReviewControllerFindOne,
  useReviewControllerCreate,
  useReviewControllerUpdate,
  getReviewControllerFindAllQueryKey,
  getReviewControllerFindOneQueryKey,
} from '@/api/generated/reviews/reviews';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/lib/theme/colors';

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateDisplay(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

export function ReviewFormScreen() {
  const { id, bookId: bookIdParam } = useLocalSearchParams<{
    id?: string;
    bookId: string;
  }>();
  const bookId = Number(bookIdParam);
  const reviewId = id ? Number(id) : null;
  const isEdit = !!reviewId;

  const queryClient = useQueryClient();
  const { data: existingReview, isLoading } = useReviewControllerFindOne(
    bookId,
    reviewId ?? 0,
  );
  const createReview = useReviewControllerCreate();
  const updateReview = useReviewControllerUpdate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    if (isEdit && existingReview) {
      setTitle(existingReview.title);
      setContent(existingReview.content);
      setStartDate(new Date(existingReview.startDate + 'T00:00:00'));
      setEndDate(new Date(existingReview.endDate + 'T00:00:00'));
      setStartPage(String(existingReview.startPage));
      setEndPage(String(existingReview.endPage));
    }
  }, [existingReview, isEdit]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setSnackbar('제목과 내용을 입력해주세요.');
      return;
    }
    if (!startDate || !endDate) {
      setSnackbar('독서 기간을 선택해주세요.');
      return;
    }
    const numberedStartPage = Number(startPage);
    const numberedEndPage = Number(endPage);
    if (
      !startPage ||
      !endPage ||
      numberedStartPage < 1 ||
      numberedEndPage < 1
    ) {
      setSnackbar('페이지를 입력해주세요.');
      return;
    }
    if (numberedStartPage > numberedEndPage) {
      setSnackbar('시작 페이지가 끝 페이지보다 클 수 없습니다.');
      return;
    }

    try {
      if (isEdit && reviewId) {
        await updateReview.mutateAsync({
          bookId,
          id: reviewId,
          data: {
            title,
            content,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            startPage: numberedStartPage,
            endPage: numberedEndPage,
          },
        });
        setSnackbar('수정되었습니다.');
      } else {
        await createReview.mutateAsync({
          bookId,
          data: {
            title,
            content,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
            startPage: numberedStartPage,
            endPage: numberedEndPage,
          },
        });
        setSnackbar('독후감이 작성되었습니다!');
      }
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getReviewControllerFindAllQueryKey(bookId),
        }),
        ...(isEdit && reviewId
          ? [
              queryClient.invalidateQueries({
                queryKey: getReviewControllerFindOneQueryKey(bookId, reviewId),
              }),
            ]
          : []),
      ]);
      setTimeout(() => router.back(), 500);
    } catch {
      setSnackbar(isEdit ? '수정에 실패했습니다.' : '작성에 실패했습니다.');
    }
  };

  const isPending = createReview.isPending || updateReview.isPending;

  if (isEdit && isLoading) return <LoadingScreen />;

  const dateLabel =
    startDate && endDate
      ? `${formatDateDisplay(startDate)} ~ ${formatDateDisplay(endDate)}`
      : '날짜를 선택해주세요';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.paperSheet}>
          <Text style={styles.heading}>
            {isEdit ? '기록 수정' : '독후감 기록'}
          </Text>

          <TextInput
            testID="title-input"
            label="책 제목"
            value={title}
            onChangeText={setTitle}
            mode="flat"
            underlineColor={colors.shelfHighlight}
            activeUnderlineColor={colors.shelfBrown}
            style={styles.input}
            theme={{ colors: { background: 'transparent' } }}
          />

          <Text style={styles.sectionLabel}>독서 기간</Text>
          <TouchableOpacity
            testID="date-range-button"
            style={styles.dateButton}
            onPress={() => setDatePickerOpen(true)}
          >
            <Text style={styles.dateButtonText}>{dateLabel}</Text>
          </TouchableOpacity>
          <DatePickerModal
            locale="ko"
            mode="range"
            visible={datePickerOpen}
            onDismiss={() => setDatePickerOpen(false)}
            startDate={startDate}
            endDate={endDate}
            onConfirm={({ startDate: s, endDate: e }) => {
              setDatePickerOpen(false);
              if (s) setStartDate(s);
              if (e) setEndDate(e);
            }}
          />

          <Text style={styles.sectionLabel}>읽은 페이지</Text>
          <View style={styles.pageRow}>
            <TextInput
              testID="start-page-input"
              label="시작"
              value={startPage}
              onChangeText={(text) => setStartPage(text.replace(/[^0-9]/g, ''))}
              mode="flat"
              keyboardType="number-pad"
              underlineColor={colors.shelfHighlight}
              activeUnderlineColor={colors.shelfBrown}
              style={[styles.input, styles.pageInput]}
              theme={{ colors: { background: 'transparent' } }}
            />
            <Text style={styles.pageSeparator}>~</Text>
            <TextInput
              testID="end-page-input"
              label="끝"
              value={endPage}
              onChangeText={(text) => setEndPage(text.replace(/[^0-9]/g, ''))}
              mode="flat"
              keyboardType="number-pad"
              underlineColor={colors.shelfHighlight}
              activeUnderlineColor={colors.shelfBrown}
              style={[styles.input, styles.pageInput]}
              theme={{ colors: { background: 'transparent' } }}
            />
          </View>

          <TextInput
            testID="content-input"
            label="내용을 작성하세요..."
            value={content}
            onChangeText={setContent}
            mode="flat"
            multiline
            numberOfLines={15}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            style={[styles.input, styles.contentInput]}
            theme={{ colors: { background: 'transparent' } }}
            placeholderTextColor={colors.shelfHighlight}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isPending}
          disabled={isPending}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          {isEdit ? '수정 완료' : '기록하기'}
        </Button>
      </ScrollView>

      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar('')}
        duration={2000}
        style={{ backgroundColor: colors.shelfDark }}
      >
        <Text style={{ color: colors.paper }}>{snackbar}</Text>
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.shelfBrown,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  paperSheet: {
    backgroundColor: colors.paper,
    borderRadius: 2,
    padding: 24,
    marginBottom: 24,
    minHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    borderBottomWidth: 1,
    borderBottomColor: colors.shelfHighlight,
    paddingBottom: 16,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'transparent',
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    color: colors.textPrimary,
  },
  contentInput: {
    minHeight: 200,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
  dateButton: {
    borderBottomWidth: 1,
    borderBottomColor: colors.shelfHighlight,
    paddingVertical: 12,
    marginBottom: 8,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
  pageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pageInput: {
    flex: 1,
    marginBottom: 0,
  },
  pageSeparator: {
    fontSize: 16,
    color: colors.textMuted,
    marginHorizontal: 12,
  },
  button: {
    backgroundColor: colors.shelfDark,
    borderRadius: 8,
    paddingVertical: 6,
    elevation: 4,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.warmWhite,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
});
