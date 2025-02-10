import Colors from "@/constants/Colors";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [edit, setEdit] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [pickedImage, setPickedImage] = useState<string | undefined>();

  const onSaveUser = async () => {
    console.log("pressed");
    try {
      setIsEditing(true);
      await user?.update({ firstName: firstName!, lastName: lastName! });
      setEdit(false);
    } catch (error) {
      console.error(error);
    } finally {
      setEdit(false);
      setIsEditing(false);
    }
  };

  const onCaptureImage = async () => {
    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!image.canceled && image.assets && image.assets.length > 0) {
      const uri = image.assets[0].uri;
      setPickedImage(image.assets[0].uri);
      await AsyncStorage.setItem("profileImage", uri); // Save image URI
    }
  };

  useEffect(() => {
    const loadImage = async () => {
      const savedImage = await AsyncStorage.getItem("profileImage");
      if (savedImage) {
        setPickedImage(savedImage);
      }
    };
    loadImage();
  }, []);

  return (
    <BlurView
      //   experimentalBlurMethod="dimezisBlurView"
      tint="dark"
      intensity={80}
      style={{
        flex: 1,
        paddingTop: 100,
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity onPress={onCaptureImage} style={styles.captureBtn}>
          {pickedImage ? (
            <Image source={{ uri: pickedImage }} style={styles.avatar} />
          ) : (
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
              }}
              style={styles.avatar}
            />
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: "row", gap: 6 }}>
          {isEditing && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
          {!edit && (
            <View style={styles.editRow}>
              <Text style={{ fontSize: 26, color: "#fff" }}>
                {firstName} {lastName}
              </Text>
              <TouchableOpacity onPress={() => setEdit(true)}>
                <Ionicons name="ellipsis-horizontal" size={24} color={"#fff"} />
              </TouchableOpacity>
            </View>
          )}
          {edit && !isEditing && (
            <View style={styles.editRow}>
              <TextInput
                placeholder="First Name"
                value={firstName || ""}
                onChangeText={setFirstName}
                style={[styles.inputField]}
              />
              <TextInput
                placeholder="Last Name"
                value={lastName || ""}
                onChangeText={setLastName}
                style={[styles.inputField]}
              />
              <TouchableOpacity onPress={onSaveUser}>
                <Ionicons name="checkmark-outline" size={24} color={"#fff"} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => signOut()}>
          <Ionicons name="log-out" size={24} color={"#fff"} />
          <Text style={{ color: "#fff", fontSize: 18 }}>Log out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="person" size={24} color={"#fff"} />
          <Text style={{ color: "#fff", fontSize: 18 }}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="bulb" size={24} color={"#fff"} />
          <Text style={{ color: "#fff", fontSize: 18 }}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="megaphone" size={24} color={"#fff"} />
          <Text style={{ color: "#fff", fontSize: 18, flex: 1 }}>Inbox</Text>
          <View
            style={{
              backgroundColor: Colors.primary,
              paddingHorizontal: 10,
              borderRadius: 10,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12 }}>14</Text>
          </View>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
}
const styles = StyleSheet.create({
  captureBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray,
  },
  editRow: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputField: {
    width: 140,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray,
  },
  actions: {
    backgroundColor: "rgba(256, 256, 256, 0.1)",
    borderRadius: 16,
    gap: 0,
    margin: 20,
  },
  btn: {
    padding: 14,
    flexDirection: "row",
    gap: 20,
  },
});
export default Page;
