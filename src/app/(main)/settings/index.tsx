import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/features/auth/auth-context';
import { colors } from '@/lib/theme/colors';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>설정</Text>

      <View style={styles.section}>
        <Text style={styles.label}>계정</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
      </View>

      <Button
        mode="outlined"
        icon="logout"
        onPress={logout}
        textColor={colors.error}
        style={styles.logoutButton}
      >
        로그아웃
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  logoutButton: {
    borderColor: colors.error,
  },
});
