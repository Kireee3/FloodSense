import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { Colors, Radius, Fonts, Spacing } from '../../constants/theme';

const BARANGAYS = [
  'Barangay 655', 'Barangay 656', 'Barangay 657', 'Barangay 658',
  'Barangay 659', 'Barangay 660', 'Barangay 661', 'Barangay 662',
];

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState('');
  const [showBarangayPicker, setShowBarangayPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword || !selectedBarangay) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    try {
      setLoading(true);
      await register({ name, email: email.trim(), phone, barangay: selectedBarangay, password });
    } catch (error: any) {
      let msg = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
      if (error.code === 'auth/invalid-email') msg = 'Invalid email address.';
      if (error.code === 'auth/weak-password') msg = 'Password is too weak.';
      Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={[Colors.navyDark, Colors.navyMid]} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={Colors.textWhite} />
        </TouchableOpacity>
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Feather name="map-pin" size={18} color={Colors.textWhite} />
          </View>
          <Text style={styles.appName}>FloodSense</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.titleSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Register to receive flood alerts and evacuation updates for your barangay.</Text>
          </View>

          <View style={styles.form}>
            {/* Full Name */}
            <View>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={18} color={Colors.textGray} />
                <TextInput style={styles.input} placeholder="Juan Dela Cruz" placeholderTextColor={Colors.textGray} value={name} onChangeText={setName} />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={18} color={Colors.textGray} />
                <TextInput style={styles.input} placeholder="juan@email.com" placeholderTextColor={Colors.textGray} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              </View>
            </View>

            {/* Phone */}
            <View>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Feather name="phone" size={18} color={Colors.textGray} />
                <TextInput style={styles.input} placeholder="+63 912 345 6789" placeholderTextColor={Colors.textGray} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              </View>
            </View>

            {/* Barangay */}
            <View>
              <Text style={styles.inputLabel}>Barangay</Text>
              <TouchableOpacity style={styles.inputWrapper} onPress={() => setShowBarangayPicker(!showBarangayPicker)} activeOpacity={0.8}>
                <Feather name="map-pin" size={18} color={Colors.textGray} />
                <Text style={[styles.input, { flex: 1, color: selectedBarangay ? Colors.textDark : Colors.textGray }]}>
                  {selectedBarangay || 'Select your barangay'}
                </Text>
                <Feather name={showBarangayPicker ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textGray} />
              </TouchableOpacity>
              {showBarangayPicker && (
                <View style={styles.picker}>
                  {BARANGAYS.map((brgy) => (
                    <TouchableOpacity key={brgy} style={[styles.pickerItem, selectedBarangay === brgy && styles.pickerItemActive]} onPress={() => { setSelectedBarangay(brgy); setShowBarangayPicker(false); }}>
                      <Text style={[styles.pickerItemText, selectedBarangay === brgy && styles.pickerItemTextActive]}>{brgy}</Text>
                      {selectedBarangay === brgy && <Feather name="check" size={16} color={Colors.teal} />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Password */}
            <View>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={18} color={Colors.textGray} />
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="Min. 6 characters" placeholderTextColor={Colors.textGray} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoCapitalize="none" />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color={Colors.textGray} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={[styles.inputWrapper, (confirmPassword && password !== confirmPassword) ? styles.inputError : null]}>
                <Feather name="lock" size={18} color={Colors.textGray} />
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="Re-enter password" placeholderTextColor={Colors.textGray} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirm} autoCapitalize="none" />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Feather name={showConfirm ? 'eye-off' : 'eye'} size={18} color={Colors.textGray} />
                </TouchableOpacity>
              </View>
              {confirmPassword && password !== confirmPassword && (
                <Text style={styles.errorText}>Passwords do not match</Text>
              )}
            </View>

            {/* SMS notice */}
            <View style={styles.smsNotice}>
              <Feather name="message-square" size={16} color={Colors.teal} />
              <Text style={styles.smsNoticeText}>Your phone number will be used to send flood alerts via SMS, even without internet.</Text>
            </View>

            {/* Submit */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
              <LinearGradient colors={[Colors.teal, Colors.tealDark]} style={styles.submitGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {loading ? <ActivityIndicator color={Colors.textWhite} /> : (
                  <>
                    <Feather name="user-plus" size={18} color={Colors.textWhite} />
                    <Text style={styles.submitText}>Create Account</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgLight },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingTop: 12, paddingBottom: Spacing.md, gap: Spacing.md },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.overlayLight, alignItems: 'center', justifyContent: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  logoBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: Fonts.sizes.lg, fontWeight: '800', color: Colors.textWhite },
  scrollContent: { padding: Spacing.base, paddingTop: Spacing.xl },
  titleSection: { marginBottom: Spacing.xl },
  title: { fontSize: Fonts.sizes.xxl, fontWeight: '900', color: Colors.textDark, marginBottom: Spacing.sm },
  subtitle: { fontSize: Fonts.sizes.base, color: Colors.textGray, lineHeight: 22 },
  form: { gap: Spacing.base, marginBottom: Spacing.xl },
  inputLabel: { fontSize: Fonts.sizes.sm, fontWeight: '700', color: Colors.textDark, marginBottom: 6 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.bgWhite, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: 14, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.08)', gap: Spacing.sm },
  inputError: { borderColor: Colors.red },
  input: { flex: 1, fontSize: Fonts.sizes.base, color: Colors.textDark },
  errorText: { fontSize: Fonts.sizes.xs, color: Colors.red, marginTop: 4, marginLeft: 4 },
  picker: { backgroundColor: Colors.bgWhite, borderRadius: Radius.lg, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.08)', marginTop: 4, overflow: 'hidden' },
  pickerItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  pickerItemActive: { backgroundColor: 'rgba(46,196,182,0.08)' },
  pickerItemText: { fontSize: Fonts.sizes.base, color: Colors.textDark },
  pickerItemTextActive: { color: Colors.teal, fontWeight: '700' },
  smsNotice: { flexDirection: 'row', gap: Spacing.sm, backgroundColor: 'rgba(46,196,182,0.08)', borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: 'rgba(46,196,182,0.2)', alignItems: 'flex-start' },
  smsNoticeText: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.textGray, lineHeight: 18 },
  submitBtn: { borderRadius: Radius.full, overflow: 'hidden', marginTop: Spacing.sm },
  submitGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  submitText: { fontSize: Fonts.sizes.base, fontWeight: '800', color: Colors.textWhite, letterSpacing: 0.3 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { fontSize: Fonts.sizes.sm, color: Colors.textGray },
  loginLink: { fontSize: Fonts.sizes.sm, color: Colors.teal, fontWeight: '800' },
});