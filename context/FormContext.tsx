import React, { createContext, useContext, useState, ReactNode } from "react";

type UserType = "Profissional" | "Paciente";
type Gender = "Masculino" | "Feminino" | "Outro";

interface FormData {
  name: string;
  cpf: string;
  userType: UserType | "";
  gender: Gender | "";
  customGender: string;
  email: string;
  password: string;
  phone: string;

  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  complement: string;

  weight: string;
  height: string;
  allergies?: string;
  birthDate: string;

  professionalId?: string;
  specialty?: string;
  experience?: number;
}

interface FormContextType {
  formData: FormData;
  currentStep: number;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
}

const initialFormData: FormData = {
  name: "",
  cpf: "",
  userType: "",
  gender: "",
  customGender: "",
  email: "",
  password: "",
  phone: "",

  cep: "",
  street: "",
  neighborhood: "",
  city: "",
  complement: "",

  weight: "",
  height: "",
  allergies: "",
  birthDate: "",

  professionalId: "",
  specialty: "",
  experience: 0,
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        currentStep,
        updateFormData,
        nextStep,
        prevStep,
        goToStep,
        resetForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
