import React, { useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Animated, Text, StyleSheet, Easing } from "react-native";

import HomeScreen from "@/screens/tab-navigator/home-screen";
import CalendarScreen from "@/screens/tab-navigator/calendar-screen";
import ChatScreen from "@/screens/tab-navigator/chat-screen";
import ProfileScreen from "@/screens/tab-navigator/profile-screen";

import {
  CalendarIcon,
  HomeIcon,
  MessageIcon,
  ProfileIcon,
} from "@/assets/icons/Icons";

const Tab = createBottomTabNavigator();

const TabBarElements = [
  { name: "Inicio", component: HomeScreen, Icon: HomeIcon },
  { name: "Agenda", component: CalendarScreen, Icon: CalendarIcon },
  { name: "Posts", component: ChatScreen, Icon: MessageIcon },
  { name: "Perfil", component: ProfileScreen, Icon: ProfileIcon },
];

const TabBarIcon = ({
  Icon,
  color,
  focused,
  label,
}: {
  Icon: React.ComponentType<{ color: string; focused: boolean }>;
  color: string;
  focused: boolean;
  label: string;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View
      style={[
        styles.iconWrapper,
        focused && styles.focusedBorder,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Icon color={color} focused={focused} />
      {focused && <Text style={styles.label}>{label}</Text>}
    </Animated.View>
  );
};

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarIconStyle: {
          flex: 1,
          justifyContent: "center",
        },
        tabBarShowLabel: false,
      }}
    >
      {TabBarElements.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.name,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                Icon={tab.Icon}
                color={color}
                focused={focused}
                label={tab.name}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 90,
  },
  focusedBorder: {
    borderWidth: 2,
    borderColor: "#63B4FF1A",
    backgroundColor: "#63B4FF2A",
  },
  label: {
    marginLeft: 8,
    fontSize: 13,
    color: "#63B4FF",
    fontWeight: "700",
  },
  tabBarItemStyle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 8,
  },
  tabBarStyle: {
    position: "absolute",
    height: 60,
    bottom: 15,
    marginHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingHorizontal: 15,
  },
});
