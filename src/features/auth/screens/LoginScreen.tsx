import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../auth-context';
import { useAuthControllerLogin } from '@/api/generated/auth/auth';
import { colors } from '@/lib/theme/colors';
import axios from 'axios';

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutateAsync, isPending } = useAuthControllerLogin();

  const inputProps = {
    mode: 'flat' as const,
    underlineColor: 'transparent',
    activeUnderlineColor: 'transparent',
    style: styles.input,
    contentStyle: styles.inputContent,
    textColor: colors.textPrimary,
    theme: { colors: { onSurfaceVariant: colors.textMuted } },
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) return;

    try {
      const tokens = await mutateAsync({ data: { email, password } });
      await login(tokens);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        Alert.alert('로그인 실패', '이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        Alert.alert(
          '네트워크 오류',
          '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../../assets/login/background.webp')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.whiteOverlay} />

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>나의 작은 서재</Text>
              <Text style={styles.subtitle}>
                오직 당신만을 위한 평온한 기록의 공간
              </Text>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                {...inputProps}
                label="이메일"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                {...inputProps}
                label="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={isPending}
                disabled={isPending}
                style={styles.loginButton}
                labelStyle={styles.loginButtonLabel}
                contentStyle={styles.loginButtonContent}
              >
                서재 들어가기
              </Button>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/(auth)/register')}
              style={styles.footer}
              accessibilityRole="link"
            >
              <Text style={styles.footerText}>
                새로운 이야기를 시작할까요?{' '}
                <Text style={styles.signupText}>회원가입</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBE5D9',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 253, 245, 0.68)',
  },

  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    opacity: 0.8,
  },
  formContainer: {
    width: '100%',
    gap: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 64,
    overflow: 'hidden',
  },
  inputContent: {
    height: 64,
    justifyContent: 'center',
  },
  loginButton: {
    marginTop: 16,
    backgroundColor: colors.shelfDark,
    borderRadius: 16,
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonContent: {
    height: 56,
  },
  loginButtonLabel: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#F5F5DC',
  },
  footer: {
    marginTop: 40,
    padding: 12,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
  },
  signupText: {
    textDecorationLine: 'underline',
    fontWeight: '600',
    color: colors.shelfBrown,
  },
});
