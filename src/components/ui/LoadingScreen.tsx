import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';

interface Props {
  message?: string;
}

export function LoadingScreen({ message = '로딩 중...' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.shelfBrown} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
  },
  text: {
    marginTop: 16,
    color: colors.textSecondary,
  },
});
