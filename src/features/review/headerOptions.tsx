import { Text } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export function reviewHeaderOptions(
  title: string,
): NativeStackNavigationOptions {
  return {
    headerTitle: () => <Text variant="titleMedium">{title}</Text>,
    headerStyle: { backgroundColor: '#FEFCE8' },
    headerTitleStyle: {
      color: colors.shelfBrown,
      fontSize: 20,
      fontFamily: 'GowunDodum_400Regular',
    },
    headerTintColor: colors.shelfBrown,
  };
}
