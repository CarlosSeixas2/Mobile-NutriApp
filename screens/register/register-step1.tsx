"use client";

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
("");
import { useFormContext } from "@/context/FormContext";
import { maskCPF, validateCPF } from "@/utils/operations-cpf";
import { useUserContext } from "@/context/UserContext";

export default function RegisterStep1Screen() {
  const { formData, updateFormData, nextStep } = useFormContext();
  const { findByCpf } = useUserContext();

  const [name, setName] = useState(formData.name);
  const [cpf, setCpf] = useState(formData.cpf);
  const [selectedGender, setSelectedGender] = useState<string>(formData.gender);
  const [customGender, setCustomGender] = useState<string>(
    formData.customGender
  );
  const [selectedUserType, setSelectedUserType] = useState<string>(
    formData.userType
  );

  const [cpfError, setCpfError] = useState("");

  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [userTypeModalVisible, setUserTypeModalVisible] = useState(false);

  const [errors, setErrors] = useState({
    name: false,
    cpf: false,
    gender: false,
    userType: false,
  });

  const genderOptions = ["Masculino", "Feminino", "Outro"];
  const userTypeOptions = ["Profissional", "Paciente"];

  const scrollViewRef = useRef<ScrollView>(null);
  const nameInputRef = useRef<TextInput>(null);
  const cpfInputRef = useRef<TextInput>(null);

  const handleCPFChange = async (text: string) => {
    const onlyNumbers = text.replace(/\D/g, "");

    setCpf(onlyNumbers);

    if (errors.cpf && onlyNumbers.trim() !== "") {
      setErrors((prev) => ({ ...prev, cpf: false }));
      setCpfError("");
    }

    if (onlyNumbers.length === 11) {
      if (!validateCPF(onlyNumbers)) {
        setErrors((prev) => ({ ...prev, cpf: true }));

        setCpfError("Este CPF é inválido");
      } else {
        const existingCpf = await findByCpf(onlyNumbers);

        if (existingCpf && existingCpf.status !== 404) {
          setErrors((prev) => ({ ...prev, cpf: true }));

          setCpfError("Este CPF já está sendo utilizado");
        } else if (existingCpf && existingCpf.status === 404) {
          setErrors((prev) => ({ ...prev, cpf: false }));
        } else {
          setErrors((prev) => ({ ...prev, cpf: false }));
          setCpfError("");
        }
      }
    }
  };

  const selectGender = (gender: string) => {
    setSelectedGender(gender);

    if (errors.gender) {
      setErrors((prev) => ({ ...prev, gender: false }));
    }

    if (gender !== "Outro") {
      setCustomGender("");
    }
  };

  const selectUserType = (userType: string) => {
    setSelectedUserType(userType);

    if (errors.userType) {
      setErrors((prev) => ({ ...prev, userType: false }));
    }
  };

  const getGenderDisplayText = () => {
    if (selectedGender === "Outro" && customGender) {
      return customGender;
    }

    return selectedGender || "";
  };

  const validateForm = () => {
    const cleanCPF = cpf.replace(/\D/g, "");

    const newErrors = {
      name: name.trim() === "",
      cpf: cleanCPF.length !== 11 || !validateCPF(cpf) || cpfError !== "",
      gender: !selectedGender,
      userType: !selectedUserType,
    };

    setErrors(newErrors);

    if (newErrors.cpf && !cpfError) {
      setCpfError(cleanCPF.length === 0 ? "CPF é obrigatório" : "CPF inválido");
    }

    return !Object.values(newErrors).some((error) => error);
  };

  const scrollToFirstError = () => {
    if (errors.name && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if (errors.cpf && cpfInputRef.current) {
      cpfInputRef.current.focus();
    }
  };

  const handleContinue = () => {
    if (validateForm()) {
      if (cpfError) {
        Alert.alert("Erro de CPF", cpfError, [{ text: "OK" }]);

        if (cpfInputRef.current) {
          cpfInputRef.current.focus();
        }
        return;
      }

      updateFormData({
        name,
        cpf,
        gender: selectedGender as any,
        customGender,
        userType: selectedUserType as any,
      });

      nextStep();
    } else {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha todos os campos corretamente antes de continuar."
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

            <Text style={styles.inputLabel}>CPF</Text>
            <View
              style={[styles.inputContainer, errors.cpf && styles.inputError]}
            >
              <Icon
                name="card-outline"
                size={20}
                color={errors.cpf ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                ref={cpfInputRef}
                placeholder="000.000.000-00"
                placeholderTextColor="#597492"
                style={styles.textInput}
                keyboardType="numeric"
                value={maskCPF(cpf)}
                onChangeText={handleCPFChange}
                maxLength={14}
              />
            </View>
            {errors.cpf && (
              <Text style={styles.errorText}>
                {cpfError || "CPF é obrigatório"}
              </Text>
            )}

            <Text style={styles.inputLabel}>Tipo de Usuário</Text>
            <TouchableOpacity
              style={[
                styles.inputContainer,
                errors.userType && styles.inputError,
              ]}
              onPress={() => setUserTypeModalVisible(true)}
            >
              <Icon
                name="person-outline"
                size={20}
                color={errors.userType ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.textInput,
                  !selectedUserType && { color: "#597492" },
                ]}
              >
                {selectedUserType || "Selecione o tipo de usuário"}
              </Text>
              <Icon
                name="chevron-down-outline"
                size={20}
                color="#597492"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
            {errors.userType && (
              <Text style={styles.errorText}>
                Tipo de usuário é obrigatório
              </Text>
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
              onPress={() => {
                setGenderModalVisible(false);
              }}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={userTypeModalVisible}
        onRequestClose={() => setUserTypeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione o tipo de usuário</Text>
              <TouchableOpacity onPress={() => setUserTypeModalVisible(false)}>
                <Icon name="close-outline" size={24} color="#0D1B34" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              {userTypeOptions.map((userType, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.genderOption}
                  onPress={() => selectUserType(userType)}
                >
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedUserType === userType &&
                          styles.radioOuterSelected,
                      ]}
                    >
                      {selectedUserType === userType && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.genderText}>{userType}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                setUserTypeModalVisible(false);
              }}
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
