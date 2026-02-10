import { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useCreateBook } from '@/features/bookshelf/api';
import { colors } from '@/lib/theme/colors';

function isValidISBN(isbn: string): boolean {
  const cleaned = isbn.replace(/[-\s]/g, '');
  return cleaned.length === 10 || cleaned.length === 13;
}

export function AddBookScreen() {
  const createBook = useCreateBook();
  const [isbn, setIsbn] = useState('');
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!isValidISBN(isbn)) {
      setError('ISBN은 10자리 또는 13자리여야 합니다.');
      return;
    }
    try {
      await createBook.mutateAsync({ isbn: isbn.replace(/[-\s]/g, '') });
      setSnackbar('책이 추가되었습니다!');
      setTimeout(() => router.back(), 500);
    } catch {
      setError('책 추가에 실패했습니다. ISBN을 확인해주세요.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>책 추가</Text>
        <Text style={styles.subtitle}>ISBN 번호를 입력하세요</Text>

        <TextInput
          label="ISBN"
          value={isbn}
          onChangeText={setIsbn}
          mode="outlined"
          keyboardType="number-pad"
          placeholder="978-0-000-00000-0"
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={createBook.isPending}
          disabled={createBook.isPending || !isbn.trim()}
          style={styles.button}
        >
          추가하기
        </Button>
      </View>

      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar('')}
        duration={1500}
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.warmWhite,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.shelfBrown,
  },
});
