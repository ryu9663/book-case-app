import { Stack } from 'expo-router';
import { ReviewFormScreen } from '@/features/review/screens/ReviewFormScreen';
import { reviewHeaderOptions } from '@/features/review/headerOptions';

export default function ReviewEditPage() {
  return (
    <>
      <Stack.Screen
        options={{
          ...reviewHeaderOptions('독후감 수정'),
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <ReviewFormScreen />
    </>
  );
}
