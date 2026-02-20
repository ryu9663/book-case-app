import { Stack } from 'expo-router';
import { ReviewFormScreen } from '@/features/review/screens/ReviewFormScreen';
import { colors } from '@/lib/theme/colors';
import { Text } from 'react-native-paper';

export default function ReviewCreatePage() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => <Text variant="titleMedium">독후감 작성</Text>,
          headerStyle: { backgroundColor: '#FEFCE8' },
          headerTitleStyle: {
            color: colors.shelfBrown,
            fontSize: 20,
            fontFamily: 'GowunDodum_400Regular',
          },
          headerTintColor: colors.shelfBrown,
        }}
      />
      <ReviewFormScreen />
    </>
  );
}
