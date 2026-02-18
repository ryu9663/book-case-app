import { Stack } from 'expo-router';
import { BookDetailScreen } from '@/features/book/screens/BookDetailScreen';

export default function BookDetailPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <BookDetailScreen />
    </>
  );
}
