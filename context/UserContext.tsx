import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import api from "@/services/axios";
import {
  UserData,
  UserLogin,
  UserRegister,
} from "@/interfaces/user-interfaces";
import { PatientCreate } from "@/interfaces/patient-interfaces";
import { ProfessionalCreate } from "@/interfaces/professional-interface";

interface UserContextType {
  currentUser: UserData | null;
  registerUser: (data: UserRegister) => Promise<PatientCreate | undefined>;
  registerPatient: (data: PatientCreate) => Promise<PatientCreate | undefined>;
  registerProfessional: (
    data: ProfessionalCreate
  ) => Promise<ProfessionalCreate | undefined>;
  loginUser: (data: UserLogin) => Promise<any>;
  logoutUser: () => void;
  getUser: () => Promise<UserData | undefined>;
  findByEmail: (email: string) => Promise<UserData | null>;
  findByCpf: (cpf: string) => Promise<UserData | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync("token");
      setToken(storedToken);
    };

    loadToken();
  }, []);

  const defaultHeaders = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // 🔹 Registro de Usuário
  const registerUser = async (
    data: UserRegister
  ): Promise<PatientCreate | undefined> => {
    try {
      const response = await api.post("users/register", data, defaultHeaders);
      if (response.status === 201) return response.data;
    } catch (error) {
      console.log("Erro ao registrar usuário:", error);
    }
  };

  // 🔹 Registro de Paciente
  const registerPatient = async (
    data: PatientCreate
  ): Promise<PatientCreate | undefined> => {
    try {
      const response = await api.post("patients", data, defaultHeaders);
      if (response.status === 201) return response.data;
    } catch (error) {
      console.log("Erro ao registrar paciente:", error);
    }
  };

  // 🔹 Registro de Profissional
  const registerProfessional = async (
    data: ProfessionalCreate
  ): Promise<ProfessionalCreate | undefined> => {
    try {
      const response = await api.post("medicals", data, defaultHeaders);
      if (response.status === 201) return response.data;
    } catch (error) {
      console.log("Erro ao registrar profissional:", error);
    }
  };

  // 🔹 Login
  const loginUser = async (data: UserLogin): Promise<any> => {
    try {
      const response = await api.post("users/login", data, defaultHeaders);
      if (response.status === 201) return response.data;
    } catch (error) {
      console.log("Erro ao fazer login:", error);
      return null;
    }
  };

  // 🔹 Logout
  const logoutUser = () => {
    setCurrentUser(null);
    setToken(null);
    SecureStore.deleteItemAsync("token");
  };

  // 🔹 Buscar usuário autenticado
  const getUser = async (): Promise<UserData | undefined> => {
    try {
      const response = await api.get("users/me", defaultHeaders);
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log("Erro ao buscar usuário:", error);
    }
  };

  // 🔹 Buscar por e-mail
  const findByEmail = async (email: string): Promise<UserData | null> => {
    try {
      const response = await api.get(`users/email/${email}`, defaultHeaders);
      if (response.status === 200) return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      console.log("Erro ao buscar e-mail:", error);
    }
    return null;
  };

  // 🔹 Buscar por CPF
  const findByCpf = async (cpf: string): Promise<UserData | null> => {
    try {
      const response = await api.get(`users/cpf/${cpf}`, defaultHeaders);
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log("Erro ao buscar CPF:", error);
    }
    return null;
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        registerUser,
        registerPatient,
        registerProfessional,
        loginUser,
        logoutUser,
        getUser,
        findByEmail,
        findByCpf,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
