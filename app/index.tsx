import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>NutriApp</Text>
        <Text style={styles.subtitle}>
          Conecte-se com sua saúde a qualquer hora.
        </Text>
      </View>

      <View style={styles.content}>
        <Image
          source={require("../assets/images/image-home.png")}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => {
            router.push("/login");
          }}
        >
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DAE2EB",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4D9FFF",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 8,
    color: "#000000",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 30,
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  button: {
    backgroundColor: "#4894FE",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
