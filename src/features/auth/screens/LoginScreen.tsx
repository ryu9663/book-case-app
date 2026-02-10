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
          <View style={styles.bookIcon} />
          <View style={[styles.bookIcon, styles.bookIcon2]} />
          <View style={[styles.bookIcon, styles.bookIcon3]} />
        </View>
      </View>

      <AuthForm
        mode="login"
        onSubmit={handleLogin}
        isLoading={isLoading}
        error={error}
      />

      <View style={styles.footer}>
        <Button
          mode="text"
          onPress={() => router.push('/(auth)/register')}
          textColor={colors.shelfBrown}
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
    backgroundColor: colors.cream,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  bookIcon: {
    width: 20,
    height: 60,
    backgroundColor: colors.spineColors[0],
    borderRadius: 2,
  },
  bookIcon2: {
    height: 55,
    backgroundColor: colors.spineColors[1],
  },
  bookIcon3: {
    height: 65,
    backgroundColor: colors.spineColors[3],
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
});
