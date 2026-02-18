import { Stack } from 'expo-router';
import { ReviewFormScreen } from '@/features/review/screens/ReviewFormScreen';

export default function ReviewEditPage() {
  return (
    <>
      <Stack.Screen options={{ title: '독후감 수정' }} />
      <ReviewFormScreen />
    </>
  );
}
