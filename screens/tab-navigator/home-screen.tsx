import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  Calendar,
  Clock,
  ChevronRight,
  Star,
  CheckCircle,
  Home,
  Calendar as CalendarIcon,
  MessageSquare,
  User,
} from "lucide-react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá</Text>
            <Text style={styles.userName}>Carlos Seixas</Text>
          </View>

          <Image
            source={require("../../assets/images/image-login.jpg")}
            style={styles.profileImage}
          />
        </View>

        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <Image
              source={require("../../assets/images/image-login.jpg")}
              style={styles.doctorImage}
            />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>Dr. Imran Syahir</Text>
              <Text style={styles.doctorSpecialty}>Nutricionista</Text>
            </View>
            <ChevronRight color="#FFFFFF" size={24} />
          </View>

          <View style={styles.horizontalDivider} />

          <View style={styles.appointmentDetails}>
            <View style={styles.appointmentDetail}>
              <Calendar color="#FFFFFF" size={16} />
              <Text style={styles.appointmentText}>Sexta, 12 Junho</Text>
            </View>
            <View style={styles.appointmentDetail}>
              <Clock color="#FFFFFF" size={16} />
              <Text style={styles.appointmentText}>11:00 - 12:00 AM</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search color="#8696BB" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquise"
            placeholderTextColor="#8696BB"
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Serviços</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesContainer}
          >
            <View style={styles.serviceItem}>
              <View
                style={[styles.serviceIcon, { backgroundColor: "#E8F5FE" }]}
              >
                <Text style={{ color: "#4485FD", fontSize: 20 }}>⚕</Text>
              </View>
              <Text style={styles.serviceText}>Dentista</Text>
            </View>

            <View style={styles.serviceItem}>
              <View
                style={[styles.serviceIcon, { backgroundColor: "#E8F5FE" }]}
              >
                <Text style={{ color: "#4485FD", fontSize: 20 }}>👤</Text>
              </View>
              <Text style={styles.serviceText}>Nutricionista</Text>
            </View>

            <View style={styles.serviceItem}>
              <View
                style={[styles.serviceIcon, { backgroundColor: "#E8F5FE" }]}
              >
                <Text style={{ color: "#4485FD", fontSize: 20 }}>🔗</Text>
              </View>
              <Text style={styles.serviceText}>Educação</Text>
            </View>

            <View style={styles.serviceItem}>
              <View
                style={[styles.serviceIcon, { backgroundColor: "#E8F5FE" }]}
              >
                <Text style={{ color: "#4485FD", fontSize: 20 }}>📚</Text>
              </View>
              <Text style={styles.serviceText}>Esportes</Text>
            </View>

            <View style={styles.serviceItem}>
              <View
                style={[styles.serviceIcon, { backgroundColor: "#FEF5E8" }]}
              >
                <Text style={{ color: "#FDA544", fontSize: 20 }}>💊</Text>
              </View>
              <Text style={styles.serviceText}>Farmácia</Text>
            </View>

            <View style={styles.serviceItem}>
              <View
                style={[styles.serviceIcon, { backgroundColor: "#F5E8FE" }]}
              >
                <Text style={{ color: "#A544FD", fontSize: 20 }}>🏥</Text>
              </View>
              <Text style={styles.serviceText}>Hospital</Text>
            </View>

            <View style={styles.serviceItem}>
              <View
                style={[styles.serviceIcon, { backgroundColor: "#E8FEF5" }]}
              >
                <Text style={{ color: "#44FDA5", fontSize: 20 }}>🧠</Text>
              </View>
              <Text style={styles.serviceText}>Psicologia</Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recentes</Text>
          <View style={styles.recentCard}>
            <View style={styles.recentHeader}>
              <Image
                source={require("../../assets/images/image-login.jpg")}
                style={styles.recentDoctorImage}
              />
              <View style={styles.recentDoctorInfo}>
                <Text style={styles.recentDoctorName}>Dr. Joseph Brostito</Text>
                <Text style={styles.recentDoctorSpecialty}>Dentista</Text>
              </View>
              <View style={styles.distanceContainer}>
                <Text style={styles.distanceText}>1.2 KM</Text>
              </View>
            </View>

            <View style={styles.recentFooter}>
              <View style={styles.ratingContainer}>
                <Star color="#FFB800" fill="#FFB800" size={16} />
                <Text style={styles.ratingText}>4.8 avaliações</Text>
              </View>
              <View style={styles.statusContainer}>
                <CheckCircle color="#4485FD" size={16} />
                <Text style={styles.statusText}>Finalizado 17:00H</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollView: {
    flex: 1,
    marginLeft: 11,
    marginRight: 11,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8696BB",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D1B34",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  appointmentCard: {
    backgroundColor: "#4894FE",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 18,
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  appointmentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  appointmentDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  appointmentText: {
    marginLeft: 8,
    color: "#FFFFFF",
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#0D1B34",
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D1B34",
    marginBottom: 16,
  },
  servicesContainer: {
    // backgroundColor: "red",
    paddingRight: 0,
  },
  servicesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serviceItem: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  serviceIcon: {
    width: 65,
    height: 65,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 12,
    color: "#0D1B34",
  },
  recentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  recentDoctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F0F0F0",
  },
  recentDoctorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recentDoctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D1B34",
  },
  recentDoctorSpecialty: {
    fontSize: 14,
    color: "#8696BB",
  },
  distanceContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  distanceText: {
    fontSize: 12,
    color: "#8696BB",
  },
  recentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#FFB800",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#4485FD",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#8696BB",
    marginTop: 4,
  },
  activeNavText: {
    color: "#4485FD",
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 18,
    marginHorizontal: 16,
    borderRadius: 5,
  },
});
