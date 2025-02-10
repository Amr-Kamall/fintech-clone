import Colors from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fragment, useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

function Lock() {
  const { user } = useUser();
  const [code, setCode] = useState<number[]>([]);
  const codeLEngth = Array(6).fill(0); //a dummy array with 6 elements
  const numbers = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  const router = useRouter();

  // for animation when erro occur
  const offset = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const OFFSET = 20;
  const TIME = 80;

  //for save code number
  const onNumberPress = (num: number) => {
    setCode((lastNums) => [...lastNums, num]);
  };

  // for removing the last number
  const numberBackSpace = () => {
    setCode((lastNums) => lastNums.slice(0, -1));
  };

  // to check authenticated lock screen
  const onBiometricAuthPress = async () => {
    const { success } = await LocalAuthentication.authenticateAsync();
    if (success) {
      router.push("/(authenticated)/(tabs)/home");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setCode([]);
    }
  };

  useEffect(() => {
    if (code.length >= 6) {
      console.log("code is", code);
      if (code.join("") == "111111") {
        router.push("/(authenticated)/(tabs)/home");
      } else {
        offset.value = withSequence(
          withTiming(-OFFSET, { duration: TIME / 2 }),
          withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
          withTiming(0, { duration: TIME / 2 })
        );
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setCode([]);
      }
    }
  }, [code]);

  return (
    <SafeAreaView>
      <Text style={styles.greeting}>welcome back, {user?.firstName}</Text>
      <Animated.View style={[styles.codeView, style]}>
        {codeLEngth.map((emptyCode, index) => {
          return (
            <View
              key={index}
              style={[
                styles.codeEmpty,
                {
                  backgroundColor:
                    index < code.length ? Colors.primary : Colors.lightGray,
                },
              ]}
            />
          );
        })}
      </Animated.View>
      <View style={styles.numbersView}>
        {numbers.map((nestedNumbers, index) => (
          <Fragment key={index}>
            <View style={styles.nestedNumbers}>
              {nestedNumbers.map((num) => (
                <TouchableOpacity key={num} onPress={() => onNumberPress(num)}>
                  <Text style={styles.number}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Fragment>
        ))}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <TouchableOpacity onPress={onBiometricAuthPress}>
            <MaterialCommunityIcons
              name="face-recognition"
              size={26}
              color={"black"}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onNumberPress(0)}>
            <Text style={styles.number}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={numberBackSpace}>
            <MaterialCommunityIcons
              name="backspace-outline"
              size={26}
              color={"black"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 80,
    textAlign: "center",
  },
  codeView: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 80,
  },
  codeEmpty: {
    backgroundColor: Colors.lightGray,
    width: 20,
    height: 20,
    borderRadius: 15,
  },
  numbersView: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginHorizontal: 60,
    marginVertical: 80,
    height: 350,
  },
  number: {
    fontSize: 30,
    padding: 10,
  },
  nestedNumbers: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    width: "100%",
  },
});

export default Lock;
