import CustomeHeader from "@/components/CustomeHeader";
import Colors from "@/constants/Colors";
import { useAuth } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { Stack, Tabs, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

function Layout() {
  const { isSignedIn } = useAuth();

  const router = useRouter();
  // for make a lock screen when app is not active
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      console.log("Removing AppState listener");
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === "background") {
      console.log("App is in background, recording start time...");
      await recordStartTime();
    } else if (nextAppState === "active" && appState.current === "background") {
      console.log("App is coming to foreground, checking elapsed time...");
      try {
        const storedTime = await AsyncStorage.getItem("startTime");
        console.log("Stored Time:", storedTime);
        const elapsed =
          Date.now() - (storedTime ? parseInt(storedTime, 10) : 0);
        console.log("Elapsed Time:", elapsed);
        if (elapsed > 10000 && isSignedIn) {
          console.log(
            "Elapsed time is greater than 3000ms, navigating to lock screen..."
          );
          router.replace("/(authenticated)/(modals)/lock");
        }
      } catch (error) {
        console.error("Error retrieving startTime:", error);
      }
    }
    appState.current = nextAppState;
  };

  const recordStartTime = async () => {
    try {
      await AsyncStorage.setItem("startTime", Date.now().toString());
    } catch (error) {
      console.error("Error storing startTime:", error);
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          bottom: 0,
          left: 0,
          right: 0,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.05)",
            }}
            // experimentalBlurMethod="dimezisBlurView"
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "home",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="registered" size={size} color={color} />
          ),
          header: () => <CustomeHeader />,
          headerTransparent: true,
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          title: "invest",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="line-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transfers"
        options={{
          title: "transfers",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="exchange" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="crypto"
        options={{
          title: "crypto",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="bitcoin" size={size} color={color} />
          ),
          header: () => <CustomeHeader />,
          headerTransparent: true,
        }}
      />
      <Tabs.Screen
        name="lifestyle"
        options={{
          title: "lifestyle",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="th" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default Layout;
