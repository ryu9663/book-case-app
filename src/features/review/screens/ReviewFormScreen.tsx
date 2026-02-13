import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useReviewControllerFindOne, useReviewControllerCreate, useReviewControllerUpdate, getReviewControllerFindAllQueryKey, getReviewControllerFindOneQueryKey } from '@/api/generated/reviews/reviews';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { colors } from '@/lib/theme/colors';

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
  const [snackbar, setSnackbar] = useState('');

  useEffect(() => {
    if (isEdit && existingReview) {
      setTitle(existingReview.title);
      setContent(existingReview.content);
    }
  }, [existingReview, isEdit]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setSnackbar('제목과 내용을 입력해주세요.');
      return;
    }
    try {
      if (isEdit && reviewId) {
        await updateReview.mutateAsync({
          bookId,
          id: reviewId,
          data: { title, content },
        });
        setSnackbar('수정되었습니다.');
      } else {
        await createReview.mutateAsync({
          bookId,
          data: { title, content },
        });
        setSnackbar('독후감이 작성되었습니다!');
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getReviewControllerFindAllQueryKey(bookId) }),
        ...(isEdit && reviewId
          ? [queryClient.invalidateQueries({ queryKey: getReviewControllerFindOneQueryKey(bookId, reviewId) })]
          : []),
      ]);
      setTimeout(() => router.back(), 500);
    } catch {
      setSnackbar(isEdit ? '수정에 실패했습니다.' : '작성에 실패했습니다.');
    }
  };

  const isPending = createReview.isPending || updateReview.isPending;

  if (isEdit && isLoading) return <LoadingScreen />;

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
            label="책 제목"
            value={title}
            onChangeText={setTitle}
            mode="flat"
            underlineColor={colors.shelfHighlight}
            activeUnderlineColor={colors.shelfBrown}
            style={styles.input}
            theme={{ colors: { background: 'transparent' } }}
          />

          <TextInput
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
          disabled={isPending || !title.trim() || !content.trim()}
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
    backgroundColor: colors.shelfBrown, // Desk background
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  paperSheet: {
    backgroundColor: colors.paper, // Paper color
    borderRadius: 2,
    padding: 24,
    marginBottom: 24,
    minHeight: 400,
    // Paper shadow
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
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    borderBottomWidth: 1,
    borderBottomColor: colors.shelfHighlight, // decorative line
    paddingBottom: 16,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'transparent',
    fontSize: 16,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    color: colors.textPrimary,
  },
  contentInput: {
    minHeight: 300,
    lineHeight: 24,
    textAlignVertical: 'top',
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
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  },
});
