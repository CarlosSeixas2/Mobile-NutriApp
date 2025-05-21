"use client";

import { useFormContext } from "@/context/FormContext";
// import { useUserContext } from "@/context/UserContext";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

export default function PatientSpecificOldScreen() {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();
  // const { registerUser, registerPatient } = useUserContext();

  const [healthInsurance, setHealthInsurance] = useState(
    formData.healthInsurance || ""
  );
  const [insuranceNumber, setInsuranceNumber] = useState(
    formData.insuranceNumber || ""
  );
  const [validateplan, setValidatePlan] = useState(formData.validateplan || "");
  const [cardholderName, setCardholderName] = useState(
    formData.cardholderName || ""
  );
  const [errors, setErrors] = useState({
    healthInsurance: false,
    insuranceNumber: false,
    validateplan: false,
    cardholderName: false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableDays, setAvailableDays] = useState<number[]>([]);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() + i
  );

  useEffect(() => {
    updateFormData({
      healthInsurance,
      insuranceNumber,
      validateplan,
      cardholderName,
    });
  }, [healthInsurance, insuranceNumber, validateplan, cardholderName]);

  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const getDaysInMonth = (month: number, year: number): number => {
    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      return 31;
    } else if ([4, 6, 9, 11].includes(month)) {
      return 30;
    } else {
      return isLeapYear(year) ? 29 : 28;
    }
  };

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
      healthInsurance: healthInsurance.trim() === "",
      insuranceNumber: insuranceNumber.trim() === "",
      validateplan: validateplan.trim() === "",
      cardholderName: cardholderName.trim() === "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleFinish = async () => {
    console.log("Dados do formulário:", formData);

    if (validateForm()) {
      // await registerPatient({
      //   altura: formData.healthInsurance,
      //   peso:,
      //   dataNascimento:,

      // });

      nextStep();
    } else {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha todos os campos obrigatórios."
      );
    }
  };

  const handleBack = () => {
    // No need to call updateFormData here as it's already being updated in the useEffect
    prevStep();
  };

  // Função para formatar a data (DD/MM/AAAA)
  type FormatDate = (day: number, month: number, year: number) => string;

  const formatDate: FormatDate = (day, month, year) => {
    return `${String(day).padStart(2, "0")}/${String(month).padStart(
      2,
      "0"
    )}/${year}`;
  };

  // Função para confirmar a data selecionada
  const confirmDate = () => {
    const formattedDate = formatDate(selectedDay, selectedMonth, selectedYear);
    setValidatePlan(formattedDate);
    setShowDatePicker(false);

    if (errors.validateplan) {
      setErrors((prev) => ({ ...prev, validateplan: false }));
    }
  };

  // Função para abrir o seletor de data
  const openDatePicker = () => {
    // Se já tiver uma data selecionada, use-a para inicializar os seletores
    if (validateplan) {
      const [day, month, year] = validateplan
        .split("/")
        .map((num) => Number.parseInt(num, 10));
      setSelectedMonth(month);
      setSelectedYear(year);

      // Verificar se o dia é válido para o mês/ano
      const daysInMonth = getDaysInMonth(month, year);
      setSelectedDay(day <= daysInMonth ? day : daysInMonth);
    } else {
      // Inicializar com os dias disponíveis para o mês/ano atual
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

            <Text style={styles.inputLabel}>Plano de Saúde</Text>
            <View
              style={[
                styles.inputContainer,
                errors.healthInsurance && styles.inputError,
              ]}
            >
              <Icon
                name="medical-outline"
                size={20}
                color={errors.healthInsurance ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                placeholder="Nome do plano de saúde"
                placeholderTextColor="#597492"
                style={styles.textInput}
                value={healthInsurance}
                onChangeText={(text) => {
                  setHealthInsurance(text);
                  if (errors.healthInsurance && text.trim() !== "") {
                    setErrors((prev) => ({ ...prev, healthInsurance: false }));
                  }
                }}
              />
            </View>
            {errors.healthInsurance && (
              <Text style={styles.errorText}>Plano de saúde é obrigatório</Text>
            )}

            <Text style={styles.inputLabel}>Titular</Text>
            <View
              style={[
                styles.inputContainer,
                errors.cardholderName && styles.inputError,
              ]}
            >
              <Icon
                name="person-outline"
                size={20}
                color={errors.cardholderName ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                placeholder="Nome completo do titular do plano"
                placeholderTextColor="#597492"
                style={styles.textInput}
                value={cardholderName}
                onChangeText={(text) => {
                  setCardholderName(text);
                  if (errors.cardholderName && text.trim() !== "") {
                    setErrors((prev) => ({ ...prev, cardholderName: false }));
                  }
                }}
              />
            </View>
            {errors.cardholderName && (
              <Text style={styles.errorText}>
                Nome do titular é obrigatório
              </Text>
            )}

            <Text style={styles.inputLabel}>Número da Carteirinha</Text>
            <View
              style={[
                styles.inputContainer,
                errors.insuranceNumber && styles.inputError,
              ]}
            >
              <Icon
                name="card-outline"
                size={20}
                color={errors.insuranceNumber ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                placeholder="Número da carteirinha do plano"
                placeholderTextColor="#597492"
                style={styles.textInput}
                value={insuranceNumber}
                onChangeText={(text) => {
                  setInsuranceNumber(text);
                  if (errors.insuranceNumber && text.trim() !== "") {
                    setErrors((prev) => ({ ...prev, insuranceNumber: false }));
                  }
                }}
              />
            </View>
            {errors.insuranceNumber && (
              <Text style={styles.errorText}>
                Número da carteirinha é obrigatório
              </Text>
            )}

            <Text style={styles.inputLabel}>Validade do Plano</Text>
            <TouchableOpacity
              onPress={openDatePicker}
              style={[
                styles.inputContainer,
                errors.validateplan && styles.inputError,
              ]}
            >
              <Icon
                name="calendar-outline"
                size={20}
                color={errors.validateplan ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.textInput,
                  !validateplan && { color: "#597492" },
                ]}
              >
                {validateplan || "Selecione a data de validade"}
              </Text>
              <Icon
                name="chevron-down-outline"
                size={20}
                color="#597492"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
            {errors.validateplan && (
              <Text style={styles.errorText}>
                Validade do plano é obrigatória
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
                      Validade do Plano
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
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleFinish}
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
});
