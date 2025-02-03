import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RoundBtnProps = {
  text?: string;
  name: typeof Ionicons.defaultProps;
  onPress?: () => void;
  type?: string;
};
function RoundButton({ name, text, onPress, type }: RoundBtnProps) {
  if (type === "smallBtn") {
    return (
      <View style={[styles.circle, { width: 40, height: 40 }]}>
        <Ionicons name={name} size={20} />
      </View>
    );
  }
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.circle}>
        <Ionicons name={name} size={30} />
      </View>
      <Text style={styles.btnText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 10,
  },
  circle: {
    width: 55,
    height: 55,
    borderRadius: 35,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 15,
    fontWeight: "500",
  },
});

export default RoundButton;
