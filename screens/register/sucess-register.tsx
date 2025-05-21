// RegistrationComplete.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import { useFormContext } from "@/context/FormContext";

export default function RegistrationComplete() {
  const { formData, resetForm } = useFormContext();

  const handleGoToLogin = () => {
    router.replace("/login");
  };

  const handleStartOver = () => {
    resetForm();
    router.push("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.successContainer}>
            <Icon name="checkmark-circle" size={100} color="#34C759" />
            <Text style={styles.title}>Cadastro Concluído!</Text>
            <Text style={styles.subtitle}>
              Seu cadastro foi realizado com sucesso. Agora você pode fazer
              login e começar a usar o aplicativo.
            </Text>

            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Resumo do Cadastro</Text>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Nome:</Text>
                <Text style={styles.summaryValue}>{formData.name}</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Email:</Text>
                <Text style={styles.summaryValue}>{formData.email}</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Tipo de Usuário:</Text>
                <Text style={styles.summaryValue}>{formData.userType}</Text>
              </View>

              {formData.userType === "Paciente" && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Plano de Saúde:</Text>
                  <Text style={styles.summaryValue}>
                    {formData.healthInsurance}
                  </Text>
                </View>
              )}

              {formData.userType === "Profissional" && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Especialidade:</Text>
                  <Text style={styles.summaryValue}>{formData.specialty}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleGoToLogin}
          >
            <Text style={styles.loginButtonText}>Ir para Login</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D1B34",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#8E9CB3",
    marginBottom: 30,
    textAlign: "center",
  },
  summaryContainer: {
    width: "100%",
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0D1B34",
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0D1B34",
    width: "40%",
  },
  summaryValue: {
    fontSize: 14,
    color: "#597492",
    flex: 1,
  },
  buttonContainer: {
    marginHorizontal: 24,
    marginBottom: 25,
  },
  loginButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 12,
  },
  loginButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  startOverButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4285F4",
  },
  startOverButtonText: {
    color: "#4285F4",
    fontWeight: "bold",
    fontSize: 16,
  },
});
