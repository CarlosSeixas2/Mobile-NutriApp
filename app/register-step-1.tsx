import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useState, useRef } from "react";
import PhoneInput, {
  type ICountry,
} from "react-native-international-phone-number";
import { router } from "expo-router";

export default function RegisterStep1Screen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [customGender, setCustomGender] = useState<string>("");

  const [errors, setErrors] = useState({
    name: false,
    gender: false,
    email: false,
    password: false,
    phone: false,
  });

  const genderOptions = ["Masculino", "Feminino", "Outro"];

  const scrollViewRef = useRef<ScrollView>(null);
  const nameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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

  const selectGender = (gender: string) => {
    setSelectedGender(gender);
    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: false }));
    }

    if (gender !== "Outro") {
      setCustomGender("");
    }
  };

  const confirmGenderSelection = () => {
    setGenderModalVisible(false);
  };

  const getGenderDisplayText = () => {
    if (selectedGender === "Outro" && customGender) {
      return customGender;
    }
    return selectedGender || "";
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const isValidPhone = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length >= 10;
  };

  const validateForm = () => {
    const newErrors = {
      name: name.trim() === "",
      gender: !selectedGender,
      email: !email.trim() || !isValidEmail(email),
      password: !password.trim() || !isValidPassword(password),
      phone: !inputValue.trim() || !isValidPhone(inputValue),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const scrollToFirstError = () => {
    if (errors.name && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if (errors.email && emailInputRef.current) {
      emailInputRef.current.focus();
    } else if (errors.password && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  };

  const handleContinue = () => {
    if (validateForm()) {
      router.push("/register-step-2");
    } else {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha todos os campos corretamente antes de continuar."
      );

      setTimeout(scrollToFirstError, 100);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../assets/images/image-login.jpg")}
            style={styles.imageTop}
            resizeMode="cover"
          />

          <View style={styles.formContainer}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Comece a aprender criando sua conta
            </Text>

            <Text style={styles.inputLabel}>Nome</Text>
            <View
              style={[styles.inputContainer, errors.name && styles.inputError]}
            >
              <Icon
                name="person-outline"
                size={20}
                color={errors.name ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                ref={nameInputRef}
                placeholder="John Doe"
                placeholderTextColor="#597492"
                style={styles.textInput}
                keyboardType="default"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name && text.trim() !== "") {
                    setErrors((prev) => ({ ...prev, name: false }));
                  }
                }}
              />
            </View>
            {errors.name && (
              <Text style={styles.errorText}>Nome é obrigatório</Text>
            )}

            <Text style={styles.inputLabel}>Gênero</Text>
            <TouchableOpacity
              style={[
                styles.inputContainer,
                errors.gender && styles.inputError,
              ]}
              onPress={() => setGenderModalVisible(true)}
            >
              <Icon
                name="people-outline"
                size={20}
                color={errors.gender ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.textInput,
                  !selectedGender && { color: "#597492" },
                ]}
              >
                {getGenderDisplayText() || "Selecione seu gênero"}
              </Text>
              <Icon
                name="chevron-down-outline"
                size={20}
                color="#597492"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
            {errors.gender && (
              <Text style={styles.errorText}>Gênero é obrigatório</Text>
            )}

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
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email && isValidEmail(text)) {
                    setErrors((prev) => ({ ...prev, email: false }));
                  }
                }}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>Email válido é obrigatório</Text>
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
                Senha deve ter pelo menos 6 caracteres
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={genderModalVisible}
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione seu gênero</Text>
              <TouchableOpacity onPress={() => setGenderModalVisible(false)}>
                <Icon name="close-outline" size={24} color="#0D1B34" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              {genderOptions.map((gender, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.genderOption}
                  onPress={() => selectGender(gender)}
                >
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedGender === gender && styles.radioOuterSelected,
                      ]}
                    >
                      {selectedGender === gender && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.genderText}>{gender}</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {selectedGender === "Outro" && (
                <View style={styles.customGenderContainer}>
                  <TextInput
                    style={styles.customGenderInput}
                    placeholder="Informe seu gênero"
                    placeholderTextColor="#597492"
                    value={customGender}
                    onChangeText={setCustomGender}
                  />
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={confirmGenderSelection}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    height: 240,
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
    marginBottom: 8,
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
