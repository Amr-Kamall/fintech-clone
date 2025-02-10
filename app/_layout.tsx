import { Link, Stack, useRouter, useSegments } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@/clerk/cash";
import { useEffect, useRef, useState } from "react";
import { FintechProvider } from "@/store/FintechContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

function RootLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const segments = useSegments() as string[];
  const [isMounted, setIsMounted] = useState(false);

  // for remove strict mode from react native
  useEffect(() => {
    setIsMounted(true);
    configureReanimatedLogger({
      level: ReanimatedLogLevel.warn,
      strict: false, // Reanimated runs in strict mode by default
    });
  }, []);

  // to go to the authenticated or not authenticated stack
  useEffect(() => {
    if (!isMounted || !isLoaded) return;

    console.log("is signed in", isSignedIn);

    const inAuthGroup = segments.includes("(authenticated)");

    if (isSignedIn && !inAuthGroup) {
      router.replace("/(authenticated)/(tabs)/home");
    } else if (!isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn, isMounted, isLoaded]);

  // for make a loading spinner if the app didn't mounted
  if (!isLoaded || !isMounted) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShadowVisible: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Link href="/help">
              <Ionicons name="help-circle-outline" size={30} color="black" />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShadowVisible: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Link href="/help">
              <Ionicons name="help-circle-outline" size={30} color="black" />
            </Link>
          ),
        }}
      />
      <Stack.Screen name="help" options={{ presentation: "modal" }} />
      <Stack.Screen
        name="verify/[phone]"
        options={{
          headerShadowVisible: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="(authenticated)/(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(authenticated)/crypto/[cryptoId]"
        options={{
          title: "",
          headerLeft: () => (
            <TouchableOpacity onPress={router.back}>
              <Ionicons name="arrow-back" size={34} color={Colors.dark} />
            </TouchableOpacity>
          ),
          headerTransparent: true,
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity>
                <Ionicons
                  name="notifications-outline"
                  color={Colors.dark}
                  size={30}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="star-outline" color={Colors.dark} size={30} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="(authenticated)/(modals)/lock"
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="(authenticated)/(modals)/account"
        options={{
          animation: "fade",
          presentation: "transparentModal",
          title: "",
          headerTransparent: true,
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={router.back}>
                <Ionicons name="close-outline" size={34} color="#fff" />
              </TouchableOpacity>
            );
          },
        }}
      />
    </Stack>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <FintechProvider>
          <RootLayout />
        </FintechProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
