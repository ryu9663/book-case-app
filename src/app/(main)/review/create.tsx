import { Stack } from 'expo-router';
import { ReviewFormScreen } from '@/features/review/screens/ReviewFormScreen';

export default function ReviewCreatePage() {
  return (
    <>
      <Stack.Screen options={{ title: '독후감 작성' }} />
      <ReviewFormScreen />
    </>
  );
}
