import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { AuthForm } from '../components/AuthForm';
import { useAuth } from '../auth-context';
import { createUser, loginUser } from '../api';
import { colors } from '@/lib/theme/colors';

export function RegisterScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (email: string, password: string) => {
    setError(null);
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    try {
      await createUser({ email, password });
      const tokens = await loginUser({ email, password });
      await login(tokens);
    } catch {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AuthForm
        mode="register"
        onSubmit={handleRegister}
        isLoading={isLoading}
        error={error}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    justifyContent: 'center',
  },
});
