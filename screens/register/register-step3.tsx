import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useState, useRef } from "react";
import { fetchAddressFromCep } from "@/services/fetch-cep-adress";
import { useFormContext } from "@/context/FormContext";

export default function RegisterStep3Screen() {
  const { formData, updateFormData, nextStep, prevStep } = useFormContext();

  const [cep, setCep] = useState(formData.cep);
  const [street, setStreet] = useState(formData.street);
  const [neighborhood, setNeighborhood] = useState(formData.neighborhood);
  const [city, setCity] = useState(formData.city);
  const [complement, setComplement] = useState(formData.complement);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    cep: false,
    street: false,
    neighborhood: false,
    city: false,
  });

  const streetRef = useRef<TextInput>(null);
  const neighborhoodRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const complementRef = useRef<TextInput>(null);

  const handleFetchAddress = async (cepValue: string) => {
    try {
      setIsLoading(true);

      const addressData = await fetchAddressFromCep(cepValue);

      if (!addressData) {
        Alert.alert(
          "CEP não encontrado",
          "O CEP informado não foi encontrado."
        );
        return;
      }

      setStreet(addressData.logradouro || "");
      setNeighborhood(addressData.bairro || "");
      setCity(addressData.localidade || "");

      if (
        addressData.logradouro &&
        addressData.bairro &&
        addressData.localidade
      ) {
        complementRef.current?.focus();
      } else if (!addressData.logradouro) {
        streetRef.current?.focus();
      } else if (!addressData.bairro) {
        neighborhoodRef.current?.focus();
      } else if (!addressData.localidade) {
        cityRef.current?.focus();
      }
    } catch (error) {
      Alert.alert(
        "Erro ao buscar endereço",
        "Ocorreu um erro ao buscar o endereço. Por favor, preencha manualmente."
      );
      console.error("Error in handleFetchAddress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCepChange = (text: string) => {
    const formattedCep = text
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 9);

    setCep(formattedCep);

    if (formattedCep.replace(/\D/g, "").length === 8) {
      handleFetchAddress(formattedCep);
    }
  };

  const validateForm = () => {
    const newErrors = {
      cep: cep.replace(/\D/g, "").length !== 8,
      street: street.trim() === "",
      neighborhood: neighborhood.trim() === "",
      city: city.trim() === "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleContinue = () => {
    if (validateForm()) {
      updateFormData({
        cep,
        street,
        neighborhood,
        city,
        complement,
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
      cep,
      street,
      neighborhood,
      city,
      complement,
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
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/images/image-login.jpg")}
              style={styles.imageTop}
              resizeMode="cover"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Endereço</Text>
            <Text style={styles.subtitle}>
              Informe seu endereço para continuar
            </Text>

            <Text style={styles.inputLabel}>CEP</Text>
            <View
              style={[styles.inputContainer, errors.cep && styles.inputError]}
            >
              <Icon
                name="location-outline"
                size={20}
                color={errors.cep ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                placeholder="12345-678"
                placeholderTextColor="#597492"
                style={styles.textInput}
                keyboardType="numeric"
                value={cep}
                onChangeText={handleCepChange}
                maxLength={9}
                returnKeyType="next"
                onSubmitEditing={() => streetRef.current?.focus()}
              />
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color="#4285F4"
                  style={styles.loader}
                />
              )}
            </View>
            {errors.cep && (
              <Text style={styles.errorText}>CEP válido é obrigatório</Text>
            )}

            <Text style={styles.inputLabel}>Rua</Text>
            <View
              style={[
                styles.inputContainer,
                errors.street && styles.inputError,
              ]}
            >
              <Icon
                name="map-outline"
                size={20}
                color={errors.street ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                ref={streetRef}
                placeholder="Nome da rua"
                placeholderTextColor="#597492"
                style={styles.textInput}
                keyboardType="default"
                value={street}
                onChangeText={(text) => {
                  setStreet(text);
                  if (errors.street && text.trim() !== "") {
                    setErrors((prev) => ({ ...prev, street: false }));
                  }
                }}
                returnKeyType="next"
                onSubmitEditing={() => neighborhoodRef.current?.focus()}
              />
            </View>
            {errors.street && (
              <Text style={styles.errorText}>Rua é obrigatória</Text>
            )}

            <Text style={styles.inputLabel}>Bairro</Text>
            <View
              style={[
                styles.inputContainer,
                errors.neighborhood && styles.inputError,
              ]}
            >
              <Icon
                name="home-outline"
                size={20}
                color={errors.neighborhood ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                ref={neighborhoodRef}
                placeholder="Nome do bairro"
                placeholderTextColor="#597492"
                style={styles.textInput}
                keyboardType="default"
                value={neighborhood}
                onChangeText={(text) => {
                  setNeighborhood(text);
                  if (errors.neighborhood && text.trim() !== "") {
                    setErrors((prev) => ({ ...prev, neighborhood: false }));
                  }
                }}
                returnKeyType="next"
                onSubmitEditing={() => cityRef.current?.focus()}
              />
            </View>
            {errors.neighborhood && (
              <Text style={styles.errorText}>Bairro é obrigatório</Text>
            )}

            <Text style={styles.inputLabel}>Cidade</Text>
            <View
              style={[styles.inputContainer, errors.city && styles.inputError]}
            >
              <Icon
                name="business-outline"
                size={20}
                color={errors.city ? "#FF3B30" : "#4285F4"}
                style={styles.icon}
              />
              <TextInput
                ref={cityRef}
                placeholder="Nome da cidade"
                placeholderTextColor="#597492"
                style={styles.textInput}
                keyboardType="default"
                value={city}
                onChangeText={(text) => {
                  setCity(text);
                  if (errors.city && text.trim() !== "") {
                    setErrors((prev) => ({ ...prev, city: false }));
                  }
                }}
                returnKeyType="next"
                onSubmitEditing={() => complementRef.current?.focus()}
              />
            </View>
            {errors.city && (
              <Text style={styles.errorText}>Cidade é obrigatória</Text>
            )}

            <Text style={styles.inputLabel}>Complemento</Text>
            <View style={styles.inputContainer}>
              <Icon
                name="information-circle-outline"
                size={20}
                color="#4285F4"
                style={styles.icon}
              />
              <TextInput
                ref={complementRef}
                placeholder="Apto, bloco, referência, etc."
                placeholderTextColor="#597492"
                style={styles.textInput}
                keyboardType="default"
                value={complement}
                onChangeText={setComplement}
                returnKeyType="done"
              />
            </View>
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
            <Text style={styles.continueButtonText}>Continuar</Text>
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
  header: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  imageContainer: {
    width: "100%",
    overflow: "hidden",
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
  textInput: {
    flex: 1,
    color: "#0D1B34",
    fontSize: 14,
  },
  loader: {
    marginLeft: 8,
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
