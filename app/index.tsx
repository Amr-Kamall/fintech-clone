import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { ResizeMode, Video } from "expo-av";
import { Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

function Page() {
  return (
    <View style={styles.container}>
      <Video
        resizeMode={ResizeMode.COVER}
        isMuted
        isLooping
        shouldPlay
        source={{
          uri: "https://videos.pexels.com/video-files/7579667/7579667-uhd_1440_2732_25fps.mp4",
        }}
        style={styles.video}
      />

      <View style={{ marginTop: 80, padding: 20 }}>
        <Text style={styles.header}>Ready to change the way you money?</Text>
      </View>

      <View style={styles.buttons}>
        <Link
          asChild
          href="/login"
          style={[
            defaultStyles.pillButton,
            {
              flex: 1,
              backgroundColor: Colors.dark,
              textAlign: "center",
            },
          ]}
        >
          <TouchableOpacity>
            <Text style={{ color: "white", fontSize: 22, fontWeight: "500" }}>
              Log in
            </Text>
          </TouchableOpacity>
        </Link>
        <Link
          asChild
          href="/signup"
          style={[
            defaultStyles.pillButton,
            {
              flex: 1,
              backgroundColor: "#fff",
              textAlign: "center",
            },
          ]}
        >
          <TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: "500" }}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  header: {
    fontSize: 36,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "white",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 60,
    paddingHorizontal: 20,
  },
});
export default Page;
