"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Calendar, Clock } from "lucide-react-native";

export default function CalendarScreen() {
  const [activeTab, setActiveTab] = useState("Marcados");

  const appointments = [
    {
      id: 1,
      doctor: "Dr. Joseph Brostito",
      specialty: "Dentista",
      date: "Sexta, 15 Abril",
      time: "11:00 - 12:00 AM",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      doctor: "Dr. Bessie Coleman",
      specialty: "Fisioterapeuta",
      date: "Sexta, 12 Março",
      time: "11:00 - 12:00 AM",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      doctor: "Dr. Babe Didrikson",
      specialty: "Dentista",
      date: "Sexta, 02 Janeiro",
      time: "11:00 - 12:00 AM",
      image: "/placeholder.svg?height=40&width=40",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Pendentes" && styles.activeTab]}
          onPress={() => setActiveTab("Pendentes")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Pendentes" && styles.activeTabText,
            ]}
          >
            Pendentes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Marcados" && styles.activeTab]}
          onPress={() => setActiveTab("Marcados")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Marcados" && styles.activeTabText,
            ]}
          >
            Marcados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "Concluídos" && styles.activeTab]}
          onPress={() => setActiveTab("Concluídos")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Concluídos" && styles.activeTabText,
            ]}
          >
            Concluídos
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.appointmentList}>
        {appointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <Image
                source={require("../../assets/images/image-home.png")}
                style={styles.doctorImage}
              />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{appointment.doctor}</Text>
                <Text style={styles.doctorSpecialty}>
                  {appointment.specialty}
                </Text>
              </View>
            </View>

            <View style={styles.horizontalDivider} />

            <View style={styles.appointmentDetails}>
              <View style={styles.appointmentDetail}>
                <Calendar color="#8696BB" size={16} />
                <Text style={styles.appointmentText}>{appointment.date}</Text>
              </View>
              <View style={styles.appointmentDetail}>
                <Clock color="#8696BB" size={16} />
                <Text style={styles.appointmentText}>{appointment.time}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.detailButton}>
              <Text style={styles.detailButtonText}>Detalhes</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginBottom: 18,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0D1B34",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 5,
    justifyContent: "space-between",
    alignItems: "center",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  activeTab: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 50,
    backgroundColor: "rgba(99, 180, 255, 0.1)",
  },
  tabText: {
    fontSize: 13,
    color: "#8696BB",
    textAlign: "center",
  },
  activeTabText: {
    color: "#4894FE",
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
  },
  appointmentList: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  appointmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  doctorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
  },
  doctorInfo: {
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D1B34",
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#8696BB",
  },
  appointmentDetails: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 16,
  },
  appointmentDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  appointmentText: {
    marginLeft: 8,
    color: "#8696BB",
    fontSize: 14,
  },
  detailButton: {
    backgroundColor: "rgba(99, 180, 255, 0.1)",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  detailButtonText: {
    color: "#4894FE",
    fontSize: 14,
    fontWeight: "500",
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
  activeNavText: {
    fontSize: 12,
    color: "#4485FD",
    marginTop: 4,
  },
});
