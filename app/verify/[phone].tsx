import { defaultStyles } from "@/constants/Styles";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

const CELL_COUNT = 6;

function Page() {
  const { phone, signin } = useLocalSearchParams<{
    phone: string;
    signin: string;
  }>();
  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();
  const [code, setCode] = useState("");
  const router = useRouter();

  //   for field of numbers
  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    if (code.length === 6) {
      console.log("code", code);
      if (signin === "true") {
        // if we logged in
        verifySignIn();
      } else {
        // if we signed up
        verifySignUp();
      }
    }
  }, [code]);

  //   for sign in verification
  const verifySignIn = async () => {
    if (!signIn) {
      console.error("signUp is not available yet.");
      return;
    }
    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "phone_code",
        code,
      });

      await setActive!({ session: signInAttempt.createdSessionId });
    } catch (error) {
      console.error("there is an error while verification", error);
    }
  };

  //   for signUp verification
  const verifySignUp = async () => {
    if (!signUp) {
      console.error("signUp is not available yet.");
      return;
    }
    try {
      // Use the code provided by the user and attempt verification
      const signUpAttempt = await signUp.attemptPhoneNumberVerification({
        code,
      });
      await setActive({ session: signUpAttempt.createdSessionId });
    } catch (error) {
      console.log("there is an error while verification", error);
    }
  };
  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>6-digit code</Text>
      <Text style={defaultStyles.descriptionText}>
        code sent to {phone} unless you already have an account
      </Text>
      {/* field numbers */}

      <CodeField
        ref={ref}
        {...props}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={Platform.select({
          android: "sms-otp",
          default: "one-time-code",
        })}
        testID="my-code-input"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />

      <Link href="/login" asChild replace>
        <TouchableOpacity>
          <Text style={defaultStyles.textLink}>
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#000",
  },
});

export default Page;
