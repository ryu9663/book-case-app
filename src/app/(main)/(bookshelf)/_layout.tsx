import { Stack } from 'expo-router';
import { colors } from '@/lib/theme/colors';

export default function BookshelfLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.shelfBrown },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: colors.cream },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="book/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
