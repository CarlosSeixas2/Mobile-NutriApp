// ProfessionalSpecificScreen.tsx
import { useFormContext } from "@/context/FormContext";
import React, { useState } from "react";
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

export default function ProfessionalSpecificScreen() {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  const [professionalId, setProfessionalId] = useState(
    formData.professionalId || ""
  );
  const [specialty, setSpecialty] = useState(formData.specialty || "");
  const [experience, setExperience] = useState(
    formData.experience?.toString() || ""
  );

  const [errors, setErrors] = useState({
    professionalId: false,
    specialty: false,
    experience: false,
  });

  const validateForm = () => {
    const newErrors = {
      professionalId: professionalId.trim() === "",
      specialty: specialty.trim() === "",
      experience: experience.trim() === "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleContinue = () => {
    if (validateForm()) {
      updateFormData({
        professionalId,
        specialty,
        experience: parseInt(experience) || 0,
      });

      nextStep();
    } else {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha todos os campos obrigatórios."
      );
    }
  };

  const handleBack = () => {
    updateFormData({
      professionalId,
      specialty,
      experience: parseInt(experience) || 0,
    });

    prevStep();
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left"]}>
      <View style={styles.innerContainer}>
        <ScrollView
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
            <Text style={styles.title}>Informações Profissionais</Text>
            <Text style={styles.subtitle}>
              Informe seus dados profissionais
            </Text>

            <Text style={styles.inputLabel}>Número de Registro</Text>
            <View
              style={[
                styles.inputContainer,
                errors.professionalId && styles.inputError,
              ]}
            >
              <Icon
                name="id-card-outline"
                size={20}
                color={errors.professionalId ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                placeholder="CRM, CRO, CREFITO, etc."
                placeholderTextColor="#597492"
                style={styles.textInput}
                value={professionalId}
                onChangeText={(text) => {
                  setProfessionalId(text);
                  if (errors.professionalId && text.trim() !== "") {
                    setErrors((prev) => ({ ...prev, professionalId: false }));
                  }
                }}
              />
            </View>
            {errors.professionalId && (
              <Text style={styles.errorText}>
                Número de registro é obrigatório
              </Text>
            )}

            <Text style={styles.inputLabel}>Especialidade</Text>
            <View
              style={[
                styles.inputContainer,
                errors.specialty && styles.inputError,
              ]}
            >
              <Icon
                name="medkit-outline"
                size={20}
                color={errors.specialty ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                placeholder="Sua especialidade"
                placeholderTextColor="#597492"
                style={styles.textInput}
                value={specialty}
                onChangeText={(text) => {
                  setSpecialty(text);
                  if (errors.specialty && text.trim() !== "") {
                    setErrors((prev) => ({ ...prev, specialty: false }));
                  }
                }}
              />
            </View>
            {errors.specialty && (
              <Text style={styles.errorText}>Especialidade é obrigatória</Text>
            )}

            <Text style={styles.inputLabel}>Anos de Experiência</Text>
            <View
              style={[
                styles.inputContainer,
                errors.experience && styles.inputError,
              ]}
            >
              <Icon
                name="time-outline"
                size={20}
                color={errors.experience ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                placeholder="Anos de experiência"
                placeholderTextColor="#597492"
                style={styles.textInput}
                keyboardType="numeric"
                value={experience}
                onChangeText={(text) => {
                  // Aceitar apenas números
                  const numericText = text.replace(/[^0-9]/g, "");
                  setExperience(numericText);
                  if (errors.experience && numericText.trim() !== "") {
                    setErrors((prev) => ({ ...prev, experience: false }));
                  }
                }}
              />
            </View>
            {errors.experience && (
              <Text style={styles.errorText}>
                Anos de experiência é obrigatório
              </Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
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
    height: 170,
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
  textInput: {
    flex: 1,
    color: "#0D1B34",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 24,
    marginBottom: 25,
  },
  backButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4285F4",
    flex: 1,
    marginRight: 8,
  },
  backButtonText: {
    color: "#4285F4",
    fontWeight: "bold",
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
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
});
