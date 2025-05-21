"use client";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useState, useRef } from "react";
import PhoneInput, {
  type ICountry,
} from "react-native-international-phone-number";
import { useFormContext } from "@/context/FormContext";
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
} from "@/utils/validations";
import { useUserContext } from "@/context/UserContext";

export default function RegisterStep2Screen() {
  const { formData, updateFormData, nextStep } = useFormContext();
  const { findByEmail } = useUserContext();

  const [email, setEmail] = useState(formData.email);
  const [password, setPassword] = useState(formData.password);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  const [inputValue, setInputValue] = useState<string>(formData.phone);

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    phone: false,
    emailExists: false,
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const checkEmailExists = async (email: string) => {
    if (isValidEmail(email)) {
      try {
        const user = await findByEmail(email);
        if (user) {
          setErrors((prev) => ({ ...prev, emailExists: true }));
          return true;
        } else {
          setErrors((prev) => ({ ...prev, emailExists: false }));
          return false;
        }
      } catch (error) {
        console.error("Error checking email:", error);
        return false;
      }
    }
    return false;
  };

  function handleInputValue(phoneNumber: string) {
    setInputValue(phoneNumber);
    if (errors.phone && phoneNumber.length > 0) {
      setErrors((prev) => ({ ...prev, phone: false }));
    }
  }

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  const validateForm = async () => {
    const emailExists = await checkEmailExists(email);

    const newErrors = {
      email: !email.trim() || !isValidEmail(email),
      password: !password.trim() || !isValidPassword(password),
      phone: !inputValue.trim() || !isValidPhone(inputValue),
      emailExists: emailExists,
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const scrollToFirstError = () => {
    if (errors.email && emailInputRef.current) {
      emailInputRef.current.focus();
    } else if (errors.password && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  };

  const handleContinue = async () => {
    if (await validateForm()) {
      updateFormData({
        email,
        password,
        phone: inputValue,
      });

      nextStep();
    } else {
      Alert.alert(
        "Campos obrigatórios",
        errors.emailExists
          ? "Este email já está em uso. Por favor, use outro email."
          : "Por favor, preencha todos os campos corretamente antes de continuar."
      );

      setTimeout(scrollToFirstError, 100);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <View style={styles.innerContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../assets/images/image-login.jpg")}
            style={styles.imageTop}
            resizeMode="cover"
          />

          <View style={styles.formContainer}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Comece a aprender criando sua conta
            </Text>

            <Text style={styles.inputLabel}>Email</Text>
            <View
              style={[styles.inputContainer, errors.email && styles.inputError]}
            >
              <Icon
                name="mail-outline"
                size={20}
                color={errors.email ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                ref={emailInputRef}
                placeholder="johndoe@gmail.com"
                placeholderTextColor="#597492"
                style={styles.textInput}
                keyboardType="email-address"
                value={email}
                onChangeText={async (text) => {
                  setEmail(text);
                  if (errors.email && isValidEmail(text)) {
                    setErrors((prev) => ({ ...prev, email: false }));
                  }
                  if (text.length > 5 && isValidEmail(text)) {
                    await checkEmailExists(text);
                  }
                }}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>Email válido é obrigatório</Text>
            )}
            {errors.emailExists && (
              <Text style={styles.errorText}>Este email já está em uso</Text>
            )}

            <Text style={styles.inputLabel}>Senha</Text>
            <View
              style={[
                styles.inputContainer,
                errors.password && styles.inputError,
              ]}
            >
              <Icon
                name="lock-closed-outline"
                size={20}
                color={errors.password ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                ref={passwordInputRef}
                placeholder="********"
                placeholderTextColor="#597492"
                style={styles.textInput}
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password && isValidPassword(text)) {
                    setErrors((prev) => ({ ...prev, password: false }));
                  }
                }}
              />
              <TouchableOpacity
                style={styles.eyeIconContainer}
                onPress={togglePasswordVisibility}
              >
                <Icon
                  name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#597492"
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>
                Senha deve ter pelo menos 6 caracteres, letras maiúsculas e
                caracteres especiais
              </Text>
            )}

            <Text style={styles.inputLabel}>Telefone</Text>
            <View
              style={[styles.phoneContainer, errors.phone && styles.inputError]}
            >
              <PhoneInput
                value={inputValue}
                onChangePhoneNumber={handleInputValue}
                selectedCountry={selectedCountry}
                onChangeSelectedCountry={handleSelectedCountry}
                phoneInputStyles={{
                  container: {
                    backgroundColor: "transparent",
                    borderWidth: 0,
                    width: "100%",
                    height: "100%",
                  },
                  flagContainer: {
                    justifyContent: "center",
                    backgroundColor: "transparent",
                  },
                  input: {
                    fontSize: 14,
                    color: "#0D1B34",
                    flex: 1,
                    paddingHorizontal: -15,
                  },
                  callingCode: {
                    fontSize: 14,
                    color: "#0D1B34",
                    marginRight: 4,
                  },
                  divider: {
                    backgroundColor: "#0D1B34",
                  },
                  caret: {
                    display: "none",
                  },
                  flag: {
                    fontSize: 22,
                  },
                }}
                modalStyles={{
                  modal: {
                    backgroundColor: "#333333",
                    borderWidth: 1,
                  },
                  searchInput: {
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#F3F3F3",
                    color: "#F3F3F3",
                    backgroundColor: "#333333",
                    paddingHorizontal: 12,
                    height: 46,
                  },
                  countryButton: {
                    borderWidth: 1,
                    borderColor: "#F3F3F3",
                    backgroundColor: "#666666",
                    marginVertical: 4,
                    paddingVertical: 0,
                  },
                  flag: {
                    color: "#FFFFFF",
                    fontSize: 20,
                  },
                  callingCode: {
                    color: "#F3F3F3",
                  },
                  countryName: {
                    color: "#F3F3F3",
                  },
                  sectionTitle: {
                    marginVertical: 10,
                    color: "#F3F3F3",
                  },
                }}
                modalSearchInputPlaceholder="Selecione o país"
                placeholder="(86) 99485-7885"
              />
            </View>
            {errors.phone && (
              <Text style={styles.errorText}>
                Telefone válido é obrigatório
              </Text>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  imageTop: {
    width: "100%",
    height: 230,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D1B34",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E9CB3",
    marginBottom: 16,
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
    marginBottom: 16,
    height: 48,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: "#FF3B30",
    borderWidth: 1,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
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
  textInput: {
    flex: 1,
    color: "#0D1B34",
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 25,
  },
  continueButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 24,
  },
  phoneContainer: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D1B34",
  },
  modalScrollView: {
    marginBottom: 16,
  },
  genderOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4285F4",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: "#4285F4",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4285F4",
  },
  genderText: {
    fontSize: 16,
    color: "#0D1B34",
  },
  customGenderContainer: {
    marginTop: 8,
    paddingLeft: 36,
    paddingBottom: 12,
  },
  customGenderInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#0D1B34",
  },
  confirmButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
