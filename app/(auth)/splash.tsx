import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Radius, Fonts, Spacing } from '../../constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(textAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(btnAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(waveAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const waveTranslate = waveAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });

  return (
    <LinearGradient
      colors={[Colors.navyDark, Colors.navyMid, '#1A6B8A']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <Animated.View style={[styles.waveContainer, { transform: [{ translateY: waveTranslate }] }]}>
        <View style={styles.wave} />
        <View style={[styles.wave, styles.wave2]} />
      </Animated.View>

      <Animated.View
        style={[styles.logoSection, {
          opacity: logoAnim,
          transform: [{ translateY: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
        }]}
      >
        <View style={styles.logoBox}>
          <Feather name="map-pin" size={36} color={Colors.textWhite} />
        </View>
        <Text style={styles.appName}>FloodSense</Text>
        <Text style={styles.tagline}>Early Warning System for{'\n'}Flood-Prone Communities</Text>
      </Animated.View>

      <Animated.View style={[styles.features, { opacity: textAnim }]}>
        <FeatureItem icon="radio" text="Real-time flood monitoring" />
        <FeatureItem icon="bell" text="Instant SMS alerts" />
        <FeatureItem icon="map" text="Safe evacuation routes" />
      </Animated.View>

      <Animated.View style={[styles.buttons, { opacity: btnAnim }]}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/(auth)/register')} activeOpacity={0.85}>
          <Text style={styles.btnPrimaryText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={() => router.push('/(auth)/login')} activeOpacity={0.85}>
          <Text style={styles.btnSecondaryText}>
            Already have an account?{' '}
            <Text style={{ color: Colors.teal, fontWeight: '800' }}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.footer}>Powered by Barangay LGU · NDRRMC</Text>
    </LinearGradient>
  );
}

function FeatureItem({ icon, text }: { icon: React.ComponentProps<typeof Feather>['name']; text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Feather name={icon} size={16} color={Colors.teal} />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  circle1: { position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(46,196,182,0.08)' },
  circle2: { position: 'absolute', bottom: 60, left: -100, width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(46,196,182,0.06)' },
  waveContainer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  wave: { height: 80, backgroundColor: 'rgba(46,196,182,0.08)', borderTopLeftRadius: 100, borderTopRightRadius: 100 },
  wave2: { height: 60, backgroundColor: 'rgba(46,196,182,0.05)', marginTop: -40 },
  logoSection: { alignItems: 'center', marginBottom: Spacing.xxl },
  logoBox: { width: 88, height: 88, borderRadius: 24, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.base, shadowColor: Colors.teal, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
  appName: { fontSize: 38, fontWeight: '900', color: Colors.textWhite, letterSpacing: 0.5, marginBottom: Spacing.sm },
  tagline: { fontSize: Fonts.sizes.base, color: Colors.textLight, textAlign: 'center', lineHeight: 22, fontWeight: '500' },
  features: { width: '100%', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: Radius.xl, padding: Spacing.base, gap: Spacing.sm, marginBottom: Spacing.xxl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  featureIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(46,196,182,0.15)', alignItems: 'center', justifyContent: 'center' },
  featureText: { fontSize: Fonts.sizes.base, color: Colors.textWhite, fontWeight: '500' },
  buttons: { width: '100%', gap: Spacing.md },
  btnPrimary: { backgroundColor: Colors.teal, borderRadius: Radius.full, paddingVertical: 16, alignItems: 'center', shadowColor: Colors.teal, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  btnPrimaryText: { fontSize: Fonts.sizes.base, fontWeight: '800', color: Colors.textWhite, letterSpacing: 0.5 },
  btnSecondary: { alignItems: 'center', paddingVertical: 10 },
  btnSecondaryText: { fontSize: Fonts.sizes.sm, color: Colors.textLight, fontWeight: '500' },
  footer: { position: 'absolute', bottom: 32, fontSize: Fonts.sizes.xs, color: Colors.textMuted, fontWeight: '500', letterSpacing: 0.5 },
});