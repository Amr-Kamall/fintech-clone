import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RoundButton from "./RoundButton";

function CustomeHeader() {
  const { top } = useSafeAreaInsets();

  return (
    <BlurView
      intensity={50}
      tint="extraLight"
      style={{ paddingTop: top }}
      // experimentalBlurMethod="dimezisBlurView"
    >
      <View style={styles.container}>
        {/* Left icon */}
        <TouchableOpacity style={styles.accountCircleContainer}>
          <Text style={styles.accountCircleText}>SG</Text>
        </TouchableOpacity>

        {/* Input search */}
        <View style={styles.inputContainer}>
          <TextInput placeholder="Search" style={styles.searchInput} />
          <Ionicons
            name="search"
            size={22}
            color="black"
            style={styles.searchIcon}
          />
        </View>

        {/* More icons */}
        <RoundButton type="smallBtn" name={"stats-chart"} />
        <RoundButton type="smallBtn" name={"card"} />
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "transparent",
  },
  accountCircleContainer: {
    width: 50,
    height: 50,
    backgroundColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  accountCircleText: {
    color: "white",
  },
  inputContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 50,
  },
  searchIcon: {
    position: "absolute",
    left: 15,
  },
});

export default CustomeHeader;
