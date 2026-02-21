import { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Snackbar,
  Icon,
  FAB,
} from 'react-native-paper';
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
import type { CreateReviewDtoSticker } from '@/api/generated/models';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/lib/theme/colors';
import { StickerSelector } from '../components/StickerSelector';
import { styles } from './ReviewFormScreen.style';

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

  // refs로 텍스트 값 추적 (한글 IME 조합 깨짐 방지)
  const titleRef = useRef('');
  const contentRef = useRef('');
  const startPageRef = useRef('');
  const endPageRef = useRef('');

  const [sticker, setSticker] = useState<CreateReviewDtoSticker | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState('');
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (isEdit && existingReview) {
      titleRef.current = existingReview.title;
      contentRef.current = existingReview.content;
      startPageRef.current = String(existingReview.startPage);
      endPageRef.current = String(existingReview.endPage);
      const reviewSticker = (
        existingReview as typeof existingReview & {
          sticker?: CreateReviewDtoSticker;
        }
      ).sticker;
      if (reviewSticker) {
        setSticker(reviewSticker);
      }
      setStartDate(new Date(existingReview.startDate + 'T00:00:00'));
      setEndDate(new Date(existingReview.endDate + 'T00:00:00'));
      setFormKey((prev) => prev + 1);
    }
  }, [existingReview, isEdit]);

  const handleSubmit = async () => {
    const title = titleRef.current;
    const content = contentRef.current;
    const startPage = startPageRef.current;
    const endPage = endPageRef.current;

    if (!title.trim() || !content.trim()) {
      setSnackbar('제목과 내용을 입력해주세요.');
      return;
    }
    if (!sticker) {
      setSnackbar('무드 스티커를 선택해주세요.');
      return;
    }
    if (!startDate || !endDate) {
      setSnackbar('독서 기간을 선택해주세요.');
      return;
    }
    if (startDate > endDate) {
      setSnackbar('시작 날짜가 끝 날짜보다 클 수 없습니다.');
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
            sticker,
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
            sticker,
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
        <View key={formKey} style={styles.paperSheet}>
          <Text style={styles.heading}>독후감 기록</Text>

          <TextInput
            testID="title-input"
            label="독후감 제목"
            defaultValue={titleRef.current}
            onChangeText={(text) => {
              titleRef.current = text;
            }}
            mode="flat"
            underlineColor={colors.shelfHighlight}
            activeUnderlineColor={colors.shelfBrown}
            style={styles.input}
            theme={{ colors: { background: 'transparent' } }}
          />

          <Text style={styles.sectionLabel}>무드 스티커</Text>
          <StickerSelector selected={sticker} onSelect={setSticker} />

          <Text style={styles.sectionLabel}>독서 기간</Text>
          <TouchableOpacity
            testID="date-range-button"
            style={styles.dateButton}
            onPress={() => setDatePickerOpen(true)}
          >
            <Icon
              source="calendar-range"
              size={20}
              color={colors.shelfHighlight}
            />
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
              defaultValue={startPageRef.current}
              onChangeText={(text) => {
                startPageRef.current = text.replace(/[^0-9]/g, '');
              }}
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
              defaultValue={endPageRef.current}
              onChangeText={(text) => {
                endPageRef.current = text.replace(/[^0-9]/g, '');
              }}
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
            defaultValue={contentRef.current}
            onChangeText={(text) => {
              contentRef.current = text;
            }}
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

        <FAB
          icon={isEdit ? 'pencil' : 'plus'}
          style={styles.fab}
          color="#fff"
          onPress={handleSubmit}
          accessibilityLabel={isEdit ? '독후감 수정' : '독후감 작성'}
        />
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
