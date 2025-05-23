import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
  Bell,
  User,
  Settings,
  ChevronRight,
  LogOut,
} from "lucide-react-native";
import { useUserContext } from "@/context/UserContext";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { logoutUser } = useUserContext();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity>
          <Bell color="#000" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <Image
          source={require("../../assets/images/image-login.jpg")}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Carlos Seixas</Text>
          <View style={styles.statusBarContent}>
            <Text style={styles.profileEmail}>carlosseixasof@gmail.com</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                logoutUser();
                router.replace("/login");
              }}
            >
              <LogOut color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Geral</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
              <User color="#4485FD" size={20} />
            </View>
            <View>
              <Text style={styles.menuItemTitle}>Informações da Conta</Text>
              <Text style={styles.menuItemSubtitle}>
                Altere aqui as informações da conta
              </Text>
            </View>
          </View>
          <ChevronRight color="#8696BB" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
              <Settings color="#4485FD" size={20} />
            </View>
            <View>
              <Text style={styles.menuItemTitle}>Configurações</Text>
              <Text style={styles.menuItemSubtitle}>
                Gerenciar configurações
              </Text>
            </View>
          </View>
          <ChevronRight color="#8696BB" size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  statusBarContent: {
    height: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D1B34",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4485FD",
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 17,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileEmail: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8696BB",
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0D1B34",
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: "#8696BB",
    marginTop: 2,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeNavItem: {
    alignItems: "center",
  },
  activeNavText: {
    fontSize: 12,
    color: "#4485FD",
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
});
