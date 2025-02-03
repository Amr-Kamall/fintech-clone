import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, router, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function SignUp() {
  const [countryCode, setCountryCode] = useState("+20");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();

  async function handleSignup() {
    if (!isLoaded || !signUp) {
      console.error("Sign-up is not loaded yet.");
      return;
    }

    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    console.log(fullPhoneNumber);
    try {
      setIsLoading(true);
      await signUp.create({
        phoneNumber: fullPhoneNumber,
      });
      await signUp.preparePhoneNumberVerification();

      setIsLoading(false);
      router.push({
        pathname: "/verify/[phone]",
        params: { phone: phoneNumber },
      });
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      Alert.alert("error", error.message || JSON.stringify(error), [
        {
          text: "OKay",
          // style: "destructive",
        },
      ]);
    }
  }
  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>Let's get started!</Text>
      <Text style={defaultStyles.descriptionText}>
        Enter your phone number, we will send you a confirmation code there
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="code"
          style={styles.inputCode}
          keyboardType="numeric"
          value={countryCode}
          onChangeText={(valueNum) => setCountryCode(valueNum)}
        />
        <TextInput
          placeholder="mobile number"
          style={styles.inputMobileNumber}
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={(valueNum) => setPhoneNumber(valueNum)}
        />
      </View>
      <Link href="/login" asChild>
        <TouchableOpacity>
          <Text style={defaultStyles.textLink}>
            already have an account? login
          </Text>
        </TouchableOpacity>
      </Link>
      {/* make a view takes available space */}
      <View style={{ flex: 1 }} />

      {/* sign up button */}
      <TouchableOpacity
        disabled={!isLoaded || phoneNumber === ""}
        onPress={handleSignup}
        style={[
          defaultStyles.pillButton,
          {
            backgroundColor:
              phoneNumber == "" ? Colors.primaryMuted : Colors.primary,
          },
        ]}
      >
        <Text style={styles.buttonText}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            "Sign up"
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    marginVertical: 30,
    gap: 10,
  },
  inputCode: {
    backgroundColor: Colors.lightGray,
    padding: 10,
    height: 50,
    borderRadius: 10,
    fontWeight: "bold",
    fontSize: 17,
  },
  inputMobileNumber: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: 10,
    fontSize: 17,
  },
  buttonText: {
    color: "white",
  },
});

export default SignUp;
