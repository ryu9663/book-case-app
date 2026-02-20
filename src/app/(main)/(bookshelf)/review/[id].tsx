import { Stack } from 'expo-router';
import { ReviewFormScreen } from '@/features/review/screens/ReviewFormScreen';
import { Text } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';

export default function ReviewEditPage() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => <Text variant="titleMedium">독후감 수정</Text>,
          headerStyle: { backgroundColor: '#FEFCE8' },
          headerTitleStyle: {
            color: colors.shelfBrown,
            fontSize: 20,
            fontFamily: 'GowunDodum_400Regular',
          },
          headerTintColor: colors.shelfBrown,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <ReviewFormScreen />
    </>
  );
}
