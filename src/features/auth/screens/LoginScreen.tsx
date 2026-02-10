import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Button } from "react-native-paper";
import { useState } from "react";
import { router } from "expo-router";
import { AuthForm } from "../components/AuthForm";
import { useAuth } from "../auth-context";
import { findUserByEmail } from "../api";
import { colors } from "@/lib/theme/colors";

export function LoginScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const user = await findUserByEmail(email);
      if (user) {
        await login(user);
      } else {
        setError("계정이 없습니다. 회원가입하시겠습니까?");
      }
    } catch (error) {
      console.log(error);
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
          onPress={() => router.push("/(auth)/register")}
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
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: "row",
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
    alignItems: "center",
    paddingBottom: 32,
  },
});
