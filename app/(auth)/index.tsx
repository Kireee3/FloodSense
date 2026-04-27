import { useState, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert, Image,
} from "react-native";
import { router } from "expo-router";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import {
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../../constants/firebase";

export default function PhoneLoginScreen() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);
  const verificationIdRef = useRef<string>("");

  async function sendOtp() {
    if (!phone.trim()) return;

    setLoading(true);

    try {
      let cleanedPhone = phone.replace(/[\s\-\(\)]/g, "");

      if (cleanedPhone.startsWith("0")) {
        cleanedPhone = "+63" + cleanedPhone.substring(1);
      } else if (!cleanedPhone.startsWith("+")) {
        cleanedPhone = "+63" + cleanedPhone;
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        cleanedPhone,
        recaptchaRef.current!
      );

      verificationIdRef.current = confirmation.verificationId;
      setStep("otp");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (otp.length < 6) return;

    setLoading(true);

    try {
      const credential = PhoneAuthProvider.credential(
        verificationIdRef.current,
        otp
      );

      await signInWithCredential(auth, credential);
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Invalid OTP", "Please check the code and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaRef}
        firebaseConfig={auth.app.options}
        attemptInvisibleVerification
      />

      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>FloodSense</Text>

      <Text style={styles.subtitle}>
        {step === "phone" ? "Enter your phone number" : "Enter the OTP"}
      </Text>

      {step === "phone" ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="+63 --- --- ---"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={sendOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="6-digit code"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={verifyOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Verify & Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setStep("phone")}>
            <Text style={styles.back}>← Change number</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.captchaWrapper}>
        <FirebaseRecaptchaBanner />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0D3B5E",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#F5F5F5",
    color: "#0D3B5E",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#2EC4B6",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  back: {
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  captchaWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
});