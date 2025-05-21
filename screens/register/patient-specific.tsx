"use client";

import { useFormContext } from "@/context/FormContext";
import { useUserContext } from "@/context/UserContext";
import { FormatDate } from "@/interfaces/others-interface";
import { formatHeight, getDaysInMonth } from "@/utils/validations";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

export default function PatientSpecificScreen() {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();
  const { registerUser, registerPatient } = useUserContext();

  const [weight, setWeight] = useState(formData.weight || "");
  const [height, setHeight] = useState(formData.height || "");
  const [allergies, setAllergies] = useState(formData.allergies || "");
  const [birthDate, setBirthDate] = useState(formData.birthDate || "");

  const [errors, setErrors] = useState({
    weight: false,
    height: false,
    birthDate: false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableDays, setAvailableDays] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  useEffect(() => {
    updateFormData({
      weight,
      height,
      allergies,
      birthDate,
    });
  }, [weight, height, allergies, birthDate]);

  useEffect(() => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    setAvailableDays(days);

    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedMonth, selectedYear]);

  const validateForm = () => {
    const newErrors = {
      weight: weight.trim() === "",
      height: height.trim() === "",
      birthDate: birthDate.trim() === "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleFinish = async () => {
    if (validateForm()) {
      try {
        const [day, month, year] = birthDate.split("/").map(Number);

        const dataPatient = {
          altura: Number.parseFloat(height),
          peso: Number.parseFloat(weight),
          dataNascimento: `${year}-${month.toString().padStart(2, "0")}-${day
            .toString()
            .padStart(2, "0")}`,
          alergias: allergies || "Nenhuma",
        };

        console.log("Dados do paciente:", dataPatient);

        setIsLoading(true);

        const patient = await registerPatient(dataPatient);

        if (patient) {
          const dataUser = {
            nome: formData.name,
            email: formData.email,
            senha: formData.password,
            cpf: formData.cpf.replace(/\D/g, ""),
            genero: formData.gender,
            telefone: formData.phone.replace(/\D/g, ""),
            pacienteId: patient.id,
            avatar: undefined,
            profissionalId: undefined,
          };

          await registerUser(dataUser);
          nextStep();
        }
      } catch (error) {
        console.error("Error during registration:", error);
        Alert.alert(
          "Erro no cadastro",
          "Ocorreu um erro ao finalizar seu cadastro. Por favor, tente novamente."
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha todos os campos obrigatórios."
      );
    }
  };

  const formatDate: FormatDate = (day, month, year) => {
    return `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
  };

  const confirmDate = () => {
    const formattedDate = formatDate(selectedDay, selectedMonth, selectedYear);
    setBirthDate(formattedDate);
    setShowDatePicker(false);

    if (errors.birthDate) {
      setErrors((prev) => ({ ...prev, birthDate: false }));
    }
  };

  const openDatePicker = () => {
    if (birthDate) {
      const [day, month, year] = birthDate
        .split("/")
        .map((num) => Number.parseInt(num, 10));
      setSelectedMonth(month);
      setSelectedYear(year);

      const daysInMonth = getDaysInMonth(month, year);
      setSelectedDay(day <= daysInMonth ? day : daysInMonth);
    } else {
      const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      setAvailableDays(days);
    }
    setShowDatePicker(true);
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
            <Text style={styles.title}>Informações do Paciente</Text>
            <Text style={styles.subtitle}>Informe seus dados de saúde</Text>

            <Text style={styles.inputLabel}>Peso (kg)</Text>
            <View
              style={[
                styles.inputContainer,
                errors.weight && styles.inputError,
              ]}
            >
              <Icon
                name="fitness-outline"
                size={20}
                color={errors.weight ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                placeholder="Seu peso em kg"
                placeholderTextColor="#597492"
                style={styles.textInput}
                value={weight}
                keyboardType="numeric"
                onChangeText={(text) => {
                  setWeight(text);
                  if (errors.weight && text.trim() !== "") {
                    setErrors((prev) => ({ ...prev, weight: false }));
                  }
                }}
              />
            </View>
            {errors.weight && (
              <Text style={styles.errorText}>Peso é obrigatório</Text>
            )}

            <Text style={styles.inputLabel}>Altura (cm)</Text>
            <View
              style={[
                styles.inputContainer,
                errors.height && styles.inputError,
              ]}
            >
              <Icon
                name="resize-outline"
                size={20}
                color={errors.height ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                placeholder="Sua altura em metros (ex: 1.75)"
                placeholderTextColor="#597492"
                style={styles.textInput}
                value={height}
                keyboardType="numeric"
                maxLength={4}
                onChangeText={(text) => {
                  const formattedHeight = formatHeight(text);
                  setHeight(formattedHeight);
                  if (errors.height && formattedHeight.trim() !== "") {
                    setErrors((prev) => ({ ...prev, height: false }));
                  }
                }}
              />
              {height ? <Text style={styles.unitText}>m</Text> : null}
            </View>
            {errors.height && (
              <Text style={styles.errorText}>Altura é obrigatória</Text>
            )}

            <Text style={styles.inputLabel}>Alergias (se possuir)</Text>
            <View style={styles.inputContainer}>
              <Icon
                name="alert-circle-outline"
                size={20}
                color="#4285F4"
                style={styles.icon}
              />
              <TextInput
                placeholder="Informe suas alergias (opcional)"
                placeholderTextColor="#597492"
                style={styles.textInput}
                value={allergies}
                onChangeText={(text) => setAllergies(text)}
                multiline={true}
              />
            </View>

            <Text style={styles.inputLabel}>Data de Nascimento</Text>
            <TouchableOpacity
              onPress={openDatePicker}
              style={[
                styles.inputContainer,
                errors.birthDate && styles.inputError,
              ]}
            >
              <Icon
                name="calendar-outline"
                size={20}
                color={errors.birthDate ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <Text
                style={[styles.textInput, !birthDate && { color: "#597492" }]}
              >
                {birthDate || "Selecione sua data de nascimento"}
              </Text>
              <Icon
                name="chevron-down-outline"
                size={20}
                color="#597492"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
            {errors.birthDate && (
              <Text style={styles.errorText}>
                Data de nascimento é obrigatória
              </Text>
            )}

            <Modal
              transparent={true}
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(false)}
                      style={styles.datePickerButton}
                    >
                      <Text style={styles.datePickerButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <Text style={styles.datePickerTitle}>
                      Data de Nascimento
                    </Text>
                    <TouchableOpacity
                      onPress={confirmDate}
                      style={styles.datePickerButton}
                    >
                      <Text
                        style={[
                          styles.datePickerButtonText,
                          { color: "#4285F4" },
                        ]}
                      >
                        Confirmar
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.datePickerContainer}>
                    {/* Seletor de Dia */}
                    <View style={styles.pickerColumn}>
                      <Text style={styles.pickerLabel}>Dia</Text>
                      <ScrollView
                        style={styles.picker}
                        showsVerticalScrollIndicator={false}
                      >
                        {availableDays.map((day) => (
                          <TouchableOpacity
                            key={`day-${day}`}
                            style={[
                              styles.pickerItem,
                              selectedDay === day && styles.pickerItemSelected,
                            ]}
                            onPress={() => setSelectedDay(day)}
                          >
                            <Text
                              style={[
                                styles.pickerItemText,
                                selectedDay === day &&
                                  styles.pickerItemTextSelected,
                              ]}
                            >
                              {String(day).padStart(2, "0")}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    <View style={styles.pickerColumn}>
                      <Text style={styles.pickerLabel}>Mês</Text>
                      <ScrollView
                        style={styles.picker}
                        showsVerticalScrollIndicator={false}
                      >
                        {months.map((month) => (
                          <TouchableOpacity
                            key={`month-${month}`}
                            style={[
                              styles.pickerItem,
                              selectedMonth === month &&
                                styles.pickerItemSelected,
                            ]}
                            onPress={() => setSelectedMonth(month)}
                          >
                            <Text
                              style={[
                                styles.pickerItemText,
                                selectedMonth === month &&
                                  styles.pickerItemTextSelected,
                              ]}
                            >
                              {String(month).padStart(2, "0")}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    <View style={styles.pickerColumn}>
                      <Text style={styles.pickerLabel}>Ano</Text>
                      <ScrollView
                        style={styles.picker}
                        showsVerticalScrollIndicator={true}
                      >
                        {years.map((year) => (
                          <TouchableOpacity
                            key={`year-${year}`}
                            style={[
                              styles.pickerItem,
                              selectedYear === year &&
                                styles.pickerItemSelected,
                            ]}
                            onPress={() => setSelectedYear(year)}
                          >
                            <Text
                              style={[
                                styles.pickerItemText,
                                selectedYear === year &&
                                  styles.pickerItemTextSelected,
                              ]}
                            >
                              {year}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              prevStep();
            }}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.continueButton, isLoading && styles.disabledButton]}
            onPress={handleFinish}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.continueButtonText}>Finalizar</Text>
            )}
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
    marginBottom: 8,
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
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D1B34",
  },
  datePickerButton: {
    paddingHorizontal: 8,
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8E9CB3",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    height: 250,
  },
  pickerColumn: {
    flex: 1,
    alignItems: "center",
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0D1B34",
    marginBottom: 8,
  },
  picker: {
    height: 200,
    width: "100%",
  },
  pickerItem: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
    borderRadius: 8,
  },
  pickerItemSelected: {
    backgroundColor: "#E8F1FF",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#0D1B34",
  },
  pickerItemTextSelected: {
    color: "#4285F4",
    fontWeight: "600",
  },
  unitText: {
    fontSize: 14,
    color: "#597492",
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: "#A0C0F0",
  },
});
