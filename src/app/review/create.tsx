import { Stack } from 'expo-router';
import { ReviewFormScreen } from '@/features/review/screens/ReviewFormScreen';
import { reviewHeaderOptions } from '@/features/review/headerOptions';

export default function ReviewCreatePage() {
  return (
    <>
      <Stack.Screen
        options={{ ...reviewHeaderOptions('독후감 작성'), headerShown: true }}
      />
      <ReviewFormScreen />
    </>
  );
}
