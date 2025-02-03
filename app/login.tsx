import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useSignIn } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function Login() {
  const [countryCode, setCountryCode] = useState("+49");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { isLoaded, signIn, setActive } = useSignIn();

  const router = useRouter();

  async function handleSignIn() {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    try {
      // Start the sign-in process using the phone number method
      const { supportedFirstFactors } = await signIn.create({
        identifier: fullPhoneNumber,
      });
      // Filter the returned array to find the 'phone_code' entry
      const isPhoneCodeFactor = (
        factor: SignInFirstFactor
      ): factor is PhoneCodeFactor => {
        return factor.strategy === "phone_code";
      };
      const phoneCodeFactor = supportedFirstFactors?.find(isPhoneCodeFactor);

      if (phoneCodeFactor) {
        // Grab the phoneNumberId
        const { phoneNumberId } = phoneCodeFactor;

        // Send the OTP code to the user
        await signIn.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId,
        });
        router.push({
          pathname: "/verify/[phone]",
          params: { phone: fullPhoneNumber, signin: true },
        });
      }
    } catch (error) {
      Alert.alert("error happend when", error);
    }
  }
  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>Welcome back!</Text>
      <Text style={defaultStyles.descriptionText}>
        Enter your phone number associated with your account
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

      {/* sign up button */}
      <TouchableOpacity
        onPress={handleSignIn}
        disabled={!isLoaded || phoneNumber === ""}
        style={[
          defaultStyles.pillButton,
          {
            backgroundColor:
              phoneNumber == "" ? Colors.primaryMuted : Colors.primary,
          },
        ]}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      {/* login with socials */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
          marginTop: 20,
        }}
      >
        <View
          style={{ backgroundColor: Colors.lightGray, flex: 1, height: 1 }}
        />
        <Text style={{ fontSize: 18, color: "gray" }}>or</Text>
        <View
          style={{ backgroundColor: Colors.lightGray, flex: 1, height: 1 }}
        />
      </View>
      <View style={{ marginVertical: 20, flexDirection: "column", gap: 15 }}>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: "white",
            },
          ]}
        >
          <Ionicons name="mail" size={22} color={"#000"} />
          <Text style={{ fontSize: 17, fontWeight: "500" }}>
            continue with email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: "white",
            },
          ]}
        >
          <Ionicons name="logo-google" size={22} color={"#000"} />
          <Text style={{ fontSize: 17, fontWeight: "500" }}>
            continue with google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: "white",
            },
          ]}
        >
          <Ionicons name="logo-apple" size={22} color={"#000"} />
          <Text style={{ fontSize: 17, fontWeight: "500" }}>
            continue with apple
          </Text>
        </TouchableOpacity>
      </View>
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

export default Login;
