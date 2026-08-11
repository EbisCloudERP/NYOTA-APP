import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "../services/AuthContext";

const NYOTA_IMAGE = require("../../assets/images/NYOTA.jpg");

export default function SplashScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(
      () => {
        if (isAuthenticated) {
          router.replace("/home");
        } else {
          router.replace("/login");
        }
      },
      isAuthenticated ? 500 : 2500
    );

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading]);

  return (
    <View style={styles.container}>
      <Image source={NYOTA_IMAGE} style={styles.logo} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 220,
    height: 220,
  },
});
