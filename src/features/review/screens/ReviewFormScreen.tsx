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
import { useReview, useCreateReview, useUpdateReview } from '../api';
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

  const { data: existingReview, isLoading } = useReview(
    bookId,
    reviewId ?? 0,
  );
  const createReview = useCreateReview(bookId);
  const updateReview = useUpdateReview(bookId);

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
          reviewId,
          dto: { title, content },
        });
        setSnackbar('수정되었습니다.');
      } else {
        await createReview.mutateAsync({
          title,
          content,
        });
        setSnackbar('독후감이 작성되었습니다!');
      }
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
        <Text style={styles.heading}>
          {isEdit ? '독후감 수정' : '독후감 작성'}
        </Text>

        <TextInput
          label="제목"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="내용"
          value={content}
          onChangeText={setContent}
          mode="outlined"
          multiline
          numberOfLines={10}
          style={[styles.input, styles.contentInput]}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isPending}
          disabled={isPending || !title.trim() || !content.trim()}
          style={styles.button}
        >
          {isEdit ? '수정하기' : '작성하기'}
        </Button>
      </ScrollView>

      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar('')}
        duration={2000}
      >
        {snackbar}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scrollContent: {
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.warmWhite,
  },
  contentInput: {
    minHeight: 200,
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.shelfBrown,
  },
});
