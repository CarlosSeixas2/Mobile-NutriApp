"use client";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useState } from "react";
import { Link, router } from "expo-router";
import { useUserContext } from "@/context/UserContext";
import * as SecureStore from "expo-secure-store";
import { validateEmail, validatePassword } from "@/utils/validations";

export default function LoginScreen() {
  const { loginUser } = useUserContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    mensage: "",
  });

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
      mensage: "",
    });

    return !emailError && !passwordError;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);

    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);

    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const OnSubmitAccount = async () => {
    if (!validateForm()) {
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    setErrors((prev) => ({ ...prev, mensage: "" }));

    try {
      const result = await loginUser({
        email,
        senha: password,
      });

      const { token } = result;

      await SecureStore.setItemAsync("token", token);

      router.replace("/app");
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 401) {
          setErrors((prev) => ({
            ...prev,
            mensage: errorData.mensage || "Credenciais inválidas",
          }));
        } else if (status === 404) {
          setErrors((prev) => ({
            ...prev,
            mensage: "Usuário não encontrado",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            mensage:
              errorData.mensage ||
              "Erro ao fazer login. Tente novamente mais tarde.",
          }));
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          mensage: "Erro de conexão. Verifique sua internet e tente novamente.",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    if (!email.trim()) {
      Alert.alert(
        "Email necessário",
        "Por favor, insira seu email para redefinir sua senha",
        [{ text: "OK" }]
      );
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      return;
    }

    // Here you would call your password reset API
    Alert.alert(
      "Redefinição de senha",
      `Um email de redefinição de senha será enviado para ${email}`,
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../assets/images/image-login.jpg")}
        style={styles.imageTop}
        resizeMode="cover"
      />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          Acesse seu perfil com o login fornecido pela nutricionista
        </Text>

        {errors.mensage ? (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle-outline" size={20} color="#FF3B30" />
            <Text style={styles.errorText}>{errors.mensage}</Text>
          </View>
        ) : null}

        <Text style={styles.inputLabel}>Email</Text>
        <View
          style={[
            styles.inputContainer,
            errors.email ? styles.inputError : null,
          ]}
        >
          <Icon
            name="mail-outline"
            size={20}
            color={errors.email ? "#FF3B30" : "#4285F4"}
            style={styles.icon}
          />
          <TextInput
            placeholder="roberto@dimo.com"
            placeholderTextColor="#597492"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
          />
        </View>

        {errors.email ? (
          <Text style={styles.fieldErrorText}>{errors.email}</Text>
        ) : null}

        <Text style={styles.inputLabel}>Senha</Text>
        <View
          style={[
            styles.inputContainer,
            errors.password ? styles.inputError : null,
          ]}
        >
          <Icon
            name="lock-closed-outline"
            size={20}
            color={errors.password ? "#FF3B30" : "#4285F4"}
            style={styles.icon}
          />
          <TextInput
            placeholder="********"
            placeholderTextColor="#597492"
            style={styles.input}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={handlePasswordChange}
          />
          <TouchableOpacity
            style={styles.eyeIconContainer}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Icon
              name={passwordVisible ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#597492"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {errors.password ? (
          <Text style={styles.fieldErrorText}>{errors.password}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.loginButton,
            isLoading ? styles.loginButtonDisabled : null,
          ]}
          onPress={OnSubmitAccount}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.orText}>Ou faça login com</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="google" size={20} />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={20} color="#3b5998" />
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.registerText}>
          Não tem uma conta?{" "}
          <Link href={"/multiStepForm"} style={styles.registerLink}>
            Cadastre-se
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  imageTop: {
    width: "100%",
    height: 240,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 41,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D1B34",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#597492",
    marginBottom: 24,
    lineHeight: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#0D1B34",
    marginBottom: 6,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 8,
    height: 48,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: "#FF3B30",
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  },
  eyeIconContainer: {
    padding: 4,
  },
  eyeIcon: {
    marginLeft: "auto",
  },
  input: {
    flex: 1,
    color: "#0D1B34",
    fontSize: 14,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPassword: {
    color: "#597492",
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 16,
    height: 50,
    justifyContent: "center",
  },
  loginButtonDisabled: {
    backgroundColor: "#A4C2F4",
  },
  loginButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    color: "#597492",
    fontSize: 14,
    marginVertical: 16,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: "48%",
    gap: 8,
  },
  socialText: {
    fontSize: 14,
    color: "#0D1B34",
  },
  registerText: {
    textAlign: "left",
    fontSize: 14,
    color: "#888888",
    marginTop: 8,
  },
  registerLink: {
    color: "#4894FE",
    fontWeight: "bold",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEEEE",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#FF3B30",
    marginLeft: 8,
    flex: 1,
  },
  fieldErrorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
});
