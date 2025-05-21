import { useFormContext } from "@/context/FormContext";
import PatientSpecificScreen from "@/screens/register/patient-specific";
import ProfessionalSpecificScreen from "@/screens/register/professional-specific";
import RegisterStep1Screen from "@/screens/register/register-step1";
import RegisterStep2Screen from "@/screens/register/register-step2";
import RegisterStep3Screen from "@/screens/register/register-step3";
import RegistrationComplete from "@/screens/register/sucess-register";
import React from "react";
import { View, StyleSheet } from "react-native";

const StepRenderer = () => {
  const { currentStep, formData } = useFormContext();

  switch (currentStep) {
    case 1:
      return <RegisterStep1Screen />;
    case 2:
      return <RegisterStep2Screen />;
    case 3:
      return <RegisterStep3Screen />;
    case 4:
      return formData.userType === "Paciente" ? (
        <PatientSpecificScreen />
      ) : (
        <ProfessionalSpecificScreen />
      );
    case 5:
      return <RegistrationComplete />;
    default:
      return <RegisterStep1Screen />;
  }
};

const MultiStepForm = () => {
  return (
    <View style={styles.container}>
      <StepRenderer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});

export default MultiStepForm;
