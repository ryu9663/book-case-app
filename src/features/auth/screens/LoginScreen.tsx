import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { useState } from 'react';
import { router } from 'expo-router';
import { AuthForm } from '../components/AuthForm';
import { useAuth } from '../auth-context';
import { loginUser } from '../api';
import { colors } from '@/lib/theme/colors';

export function LoginScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const tokens = await loginUser({ email, password });
      await login(tokens);
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {/* Books sitting on the desk */}
          <View style={styles.bookIcon} />
          <View style={[styles.bookIcon, styles.bookIcon2]} />
          <View style={[styles.bookIcon, styles.bookIcon3]} />
        </View>
      </View>

      <View style={styles.card}>
        <AuthForm
          mode="login"
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
        />
      </View>

      <View style={styles.footer}>
        <Button
          mode="text"
          onPress={() => router.push('/(auth)/register')}
          textColor={colors.warmWhite}
          labelStyle={{ fontSize: 16 }}
        >
          계정이 없으신가요? 회원가입
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.shelfBrown, // Desk
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.paper,
    borderRadius: 2, // Card/Paper
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#D7CCC8',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'flex-end',
  },
  bookIcon: {
    width: 24,
    height: 70,
    backgroundColor: colors.spineColors[0],
    borderRadius: 2,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  bookIcon2: {
    height: 60,
    backgroundColor: colors.spineColors[4],
  },
  bookIcon3: {
    height: 75,
    backgroundColor: colors.spineColors[7],
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
});
