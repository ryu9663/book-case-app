import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useState } from 'react';
import { colors } from '@/lib/theme/colors';

interface Props {
  mode: 'login' | 'register';
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export function AuthForm({ mode, onSubmit, isLoading, error }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = () => {
    onSubmit(email.trim(), password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? '로그인' : '회원가입'}</Text>
      <Text style={styles.subtitle}>
        {isLogin ? '이메일로 로그인하세요' : '새 계정을 만드세요'}
      </Text>

      <TextInput
        label="이메일"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      {!isLogin && (
        <TextInput
          label="비밀번호"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading || !email.trim() || (!isLogin && !password)}
        style={styles.button}
      >
        {isLogin ? '로그인' : '가입하기'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
    backgroundColor: colors.warmWhite,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.shelfBrown,
  },
});
