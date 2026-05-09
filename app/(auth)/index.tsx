import React, { useState, useRef } from "react";
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
import { signInWithPhoneNumber, PhoneAuthProvider,
        signInWithCredential } from "firebase/auth";
import { auth } from "../../constants/firebase";
import apiClient from "../../services/api";

export default function PhoneLoginScreen() {
  const [phone, setPhone]     = useState("");
  const [otp, setOtp]         = useState("");
  const [step, setStep]       = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const recaptchaRef          = useRef(null);
  const verificationIdRef     = useRef<string>("");
  const cleanedPhoneRef       = useRef<string>("");

  async function sendOtp() {
    if (!phone.trim()) return;
    setLoading(true);
    try {
      // Clean the phone number (remove spaces, dashes, parentheses)
      let cleanedPhone = phone.replace(/[\s\-\(\)]/g, "");
      // Convert leading 0 to +63 for Philippine numbers
      if (cleanedPhone.startsWith("0")) {
        cleanedPhone = "+63" + cleanedPhone.substring(1);
      } else if (!cleanedPhone.startsWith("+")) {
        // If it doesn't start with 0 or +, assume it needs +63
        cleanedPhone = "+63" + cleanedPhone;
      }
      
      // Store cleaned phone for later verification
      cleanedPhoneRef.current = cleanedPhone;
      
      // Call backend to send OTP
      const result = await apiClient.sendOtp(cleanedPhone);
      
      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        // OTP created successfully (whether SMS sent or not)
        // Automatically advance to OTP verification screen
        setStep("otp");
        
        // Show brief notification about SMS status
        if (result.sms_status === "failed") {
          console.log(`OTP created but SMS failed. Test code: ${result.code}`);
          // You can also manually enter the code from console for testing
        }
      }
    } catch (e: any) {
      Alert.alert("Error", "Failed to send OTP. Please check your connection and try again.");
      console.error("Send OTP error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      // Call backend to verify OTP
      const result = await apiClient.verifyOtp(cleanedPhoneRef.current, otp);
      
      if (result.error) {
        Alert.alert("Error", result.error);
      } else if (result.message === "Verified") {
        router.replace("/(tabs)"); // go to your main app
      } else {
        Alert.alert("Invalid OTP", "Please check the code and try again.");
      }
    } catch (e: any) {
      Alert.alert("Error", "Failed to verify OTP. Please check your connection and try again.");
      console.error("Verify OTP error:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Required for Firebase phone auth on native */}
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
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Send OTP</Text>}
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
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Verify & Sign In</Text>}
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