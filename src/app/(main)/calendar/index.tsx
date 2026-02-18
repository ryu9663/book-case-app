import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>준비 중입니다</Text>
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
    fontSize: 18,
    color: colors.textMuted,
  },
});
