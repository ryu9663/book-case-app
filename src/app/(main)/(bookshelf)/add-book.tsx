import { Stack } from 'expo-router';
import { AddBookScreen } from '@/features/book/screens/AddBookScreen';

export default function AddBookPage() {
  return (
    <>
      <Stack.Screen options={{ title: '책 추가' }} />
      <AddBookScreen />
    </>
  );
}
