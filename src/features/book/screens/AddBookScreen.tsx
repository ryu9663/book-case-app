import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useBookControllerCreate, getBookControllerFindAllQueryKey } from '@/api/generated/books/books';
import { colors } from '@/lib/theme/colors';

function isValidISBN(isbn: string): boolean {
  const cleaned = isbn.replace(/[-\s]/g, '');
  return cleaned.length === 10 || cleaned.length === 13;
}

export function AddBookScreen() {
  const queryClient = useQueryClient();
  const createBook = useBookControllerCreate();
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
      await createBook.mutateAsync({
        data: { isbn: isbn.replace(/[-\s]/g, '') },
      });
      await queryClient.invalidateQueries({ queryKey: getBookControllerFindAllQueryKey() });
      setSnackbar('책이 추가되었습니다!');
      setTimeout(() => router.back(), 500);
    } catch (error: any) {
      const message = error?.response?.data?.message;

      console.error(message);

      setError('책 추가에 실패했습니다. ISBN을 확인해주세요.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.title}>새 책 등록</Text>
        <Text style={styles.subtitle}>
          ISBN 코드를 입력하여 책을 추가합니다.
        </Text>

        <TextInput
          label="ISBN"
          value={isbn}
          onChangeText={setIsbn}
          mode="flat"
          underlineColor={colors.shelfHighlight}
          activeUnderlineColor={colors.shelfBrown}
          keyboardType="number-pad"
          placeholder="978-..."
          style={styles.input}
          theme={{ colors: { background: 'transparent' } }}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={createBook.isPending}
          disabled={createBook.isPending || !isbn.trim()}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          책장에 꽂기
        </Button>
      </View>

      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar('')}
        duration={1500}
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
    backgroundColor: colors.shelfBrown, // Desk
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.paper, // Note card
    padding: 32,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#D7CCC8',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 32,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'Courier New',
      android: 'monospace',
      default: 'monospace',
    }), // Monospace for ISBN
    color: colors.textPrimary,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.shelfDark,
    borderRadius: 8,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.warmWhite,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
  },
});
