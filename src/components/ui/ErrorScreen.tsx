import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function ErrorScreen({
  message = '문제가 발생했습니다.',
  onRetry,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>😥</Text>
      <Text style={styles.text}>{message}</Text>
      {onRetry && (
        <Button mode="contained" onPress={onRetry} style={styles.button}>
          다시 시도
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cream,
    padding: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.shelfBrown,
  },
});
