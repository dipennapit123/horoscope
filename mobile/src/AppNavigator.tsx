import React, { useEffect, useRef } from "react";
import { AppState, AppStateStatus, InteractionManager } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SplashScreen } from "./screens/SplashScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { ZodiacSelectionScreen } from "./screens/ZodiacSelectionScreen";
import { HoroscopeScreen } from "./screens/HoroscopeScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { useSessionStore } from "./store/useSessionStore";
import { recordActivity } from "./services/activity";

const APP_OPEN_THROTTLE_MS = 60_000; // At most one APP_OPEN per minute for accurate DAU without spam

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Onboarding: undefined;
  Main: { screen: "Horoscope" } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const clerkUserId = useSessionStore((s) => s.clerkUserId);
  const lastAppOpenAt = useRef<number>(0);

  useEffect(() => {
    if (!clerkUserId) return;

    const handleAppState = (state: AppStateStatus) => {
      if (state !== "active") return;
      const now = Date.now();
      if (now - lastAppOpenAt.current < APP_OPEN_THROTTLE_MS) return;
      lastAppOpenAt.current = now;
      InteractionManager.runAfterInteractions(() => {
        recordActivity(clerkUserId, "APP_OPEN");
      });
    };

    const sub = AppState.addEventListener("change", handleAppState);
    handleAppState(AppState.currentState);
    return () => sub.remove();
  }, [clerkUserId]);

  return (
    <Tab.Navigator
      initialRouteName="Horoscope"
      screenOptions={{
        lazy: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#050316",
          borderTopColor: "rgba(148, 163, 184, 0.3)",
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: "#F9FAFB",
        tabBarInactiveTintColor: "#6B7280",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {/* Home tab → Zodiac selection grid */}
      <Tab.Screen
        name="Home"
        component={ZodiacSelectionScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size + 2} />
          ),
        }}
      />

      {/* Horoscope tab → main daily horoscope screen */}
      <Tab.Screen
        name="Horoscope"
        component={HoroscopeScreen}
        options={{
          title: "Horoscope",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" color={color} size={size + 4} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size + 2} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const token = useSessionStore((s) => s.token);
  const zodiacSign = useSessionStore((s) => s.zodiacSign);

  const initialRoute: keyof RootStackParamList = "Splash";

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Auth" component={LoginScreen} />
        <Stack.Screen name="Onboarding" component={ZodiacSelectionScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

