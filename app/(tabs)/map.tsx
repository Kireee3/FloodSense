import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import { Colors, Spacing, Radius, Fonts } from '../../constants/theme';
import { useTheme } from '../../constants/ThemeContext';

export default function MapScreen() {
  const { darkMode, fontSize, unitSystem } = useTheme();

  const bg = darkMode ? '#0a1628' : Colors.bgLight;
  const cardBg = darkMode ? '#0d1f33' : Colors.bgWhite;
  const textPrimary = darkMode ? '#ffffff' : Colors.textDark;
  const textSecondary = darkMode ? '#aaaaaa' : Colors.textGray;
  const borderColor = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const fs = fontSize === 'small' ? 0.85 : fontSize === 'large' ? 1.2 : 1;

  const distance = unitSystem === 'imperial' ? '0.9 mi' : '1.5 km';
  const eta = unitSystem === 'imperial' ? 'Est. 12 mins walk' : 'Est. 12 mins walk';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
      <AppHeader />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={[styles.subHeader, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
          <Text style={[styles.subLabel, { color: textSecondary, fontSize: Fonts.sizes.xs * fs }]}>NAVIGATION</Text>
          <Text style={[styles.pageTitle, { color: textPrimary, fontSize: Fonts.sizes.xl * fs }]}>Evacuation Routes</Text>
        </View>

        <View style={styles.body}>
          <Text style={[styles.sectionTitle, { color: textPrimary, fontSize: Fonts.sizes.base * fs }]}>Evacuation Map</Text>

          <View style={styles.mapContainer}>
            <LinearGradient colors={['#0D2137', '#081525']} style={StyleSheet.absoluteFill} />
            {[...Array(6)].map((_, i) => (
              <View key={`h${i}`} style={[styles.gridLine, styles.gridH, { top: `${(i + 1) * 14}%` }]} />
            ))}
            {[...Array(6)].map((_, i) => (
              <View key={`v${i}`} style={[styles.gridLine, styles.gridV, { left: `${(i + 1) * 14}%` }]} />
            ))}
            <View style={[styles.mapBlock, { top: 16, left: 16 }]} />
            <View style={[styles.mapBlock, { top: 16, left: 110 }]} />
            <View style={[styles.mapBlock, { top: 80, left: 16 }]} />
            <View style={[styles.mapBlock, { bottom: 40, right: 20 }]} />
            <View style={[styles.mapBlock, { bottom: 40, left: 90 }]} />
            <View style={[styles.mapBlock, { bottom: 100, left: 20 }]} />
            <View style={styles.routeLine} />
            <View style={styles.locationGlow} />

            <View style={styles.distanceCard}>
              <Text style={styles.distanceLabel}>DISTANCE</Text>
              <Text style={styles.distanceValue}>{distance}</Text>
              <Text style={styles.distanceSub}>{eta}</Text>
            </View>

            <View style={styles.yourLocationPin}>
              <View style={styles.pinCircleTeal}><Feather name="map-pin" size={16} color={Colors.textWhite} /></View>
              <View style={styles.pinLabel}><Text style={styles.pinLabelText}>YOUR LOCATION</Text></View>
            </View>
            <View style={styles.floodZonePin}>
              <View style={styles.pinCircleRed}><Feather name="map-pin" size={14} color={Colors.textWhite} /></View>
              <View style={[styles.pinLabel, { backgroundColor: Colors.redDark }]}><Text style={styles.pinLabelText}>FLOOD ZONE</Text></View>
            </View>
            <View style={styles.safeZonePin}>
              <View style={styles.pinCircleGreen}><Feather name="check" size={14} color={Colors.textWhite} /></View>
              <View style={[styles.pinLabel, { backgroundColor: Colors.greenDark }]}><Text style={styles.pinLabelText}>SAFE ZONE</Text></View>
            </View>
            <View style={styles.mapLabel}><Text style={styles.mapLabelText}>Brgy 659 - Manila</Text></View>
          </View>

          <LinearGradient colors={[Colors.navyMid, Colors.teal]} style={styles.navigateBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <TouchableOpacity style={styles.navigateBtnInner}>
              <Feather name="navigation" size={18} color={Colors.textWhite} />
              <Text style={[styles.navigateBtnText, { fontSize: Fonts.sizes.base * fs }]}>Navigate to Safe Zone</Text>
            </TouchableOpacity>
          </LinearGradient>

          <View style={[styles.legend, { backgroundColor: cardBg }]}>
            <Text style={[styles.legendTitle, { color: textPrimary, fontSize: Fonts.sizes.sm * fs }]}>Map Legend</Text>
            <View style={styles.legendItems}>
              <LegendItem color={Colors.teal} label="Your Location" textColor={textSecondary} fs={fs} />
              <LegendItem color={Colors.red} label="Flood Zone" textColor={textSecondary} fs={fs} />
              <LegendItem color={Colors.green} label="Safe Zone" textColor={textSecondary} fs={fs} />
            </View>
          </View>

          <View style={styles.routeInfo}>
            <RouteInfoCard icon="clock" title="Estimated Time" value="12 mins" sub="Walking pace" cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} fs={fs} />
            <RouteInfoCard icon="map-pin" title="Distance" value={distance} sub="Direct route" cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} fs={fs} />
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function LegendItem({ color, label, textColor, fs }: { color: string; label: string; textColor: string; fs: number }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendLabel, { color: textColor, fontSize: Fonts.sizes.sm * fs }]}>{label}</Text>
    </View>
  );
}

function RouteInfoCard({ icon, title, value, sub, cardBg, textPrimary, textSecondary, fs }: {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string; value: string; sub: string;
  cardBg: string; textPrimary: string; textSecondary: string; fs: number;
}) {
  return (
    <View style={[styles.routeCard, { backgroundColor: cardBg }]}>
      <View style={styles.routeCardIcon}>
        <Feather name={icon} size={18} color={Colors.teal} />
      </View>
      <Text style={[styles.routeCardTitle, { color: textSecondary, fontSize: Fonts.sizes.xs * fs }]}>{title}</Text>
      <Text style={[styles.routeCardValue, { color: textPrimary, fontSize: Fonts.sizes.xl * fs }]}>{value}</Text>
      <Text style={[styles.routeCardSub, { color: textSecondary, fontSize: Fonts.sizes.xs * fs }]}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  subHeader: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1 },
  subLabel: { fontWeight: '700', letterSpacing: 1 },
  pageTitle: { fontWeight: '800', marginTop: 2 },
  body: { padding: Spacing.base },
  sectionTitle: { fontWeight: '700', marginBottom: Spacing.sm },
  mapContainer: { height: 320, borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.md, position: 'relative' },
  gridLine: { position: 'absolute', backgroundColor: 'rgba(46,196,182,0.12)' },
  gridH: { left: 0, right: 0, height: 1 },
  gridV: { top: 0, bottom: 0, width: 1 },
  mapBlock: { position: 'absolute', width: 52, height: 36, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  routeLine: { position: 'absolute', top: '40%', left: '40%', right: '20%', height: 2, backgroundColor: Colors.teal, opacity: 0.6 },
  locationGlow: { position: 'absolute', top: '42%', left: '42%', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(192,57,43,0.2)', transform: [{ translateX: -50 }, { translateY: -50 }] },
  distanceCard: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(13,59,94,0.92)', borderRadius: Radius.md, padding: 10, borderWidth: 1, borderColor: 'rgba(46,196,182,0.3)' },
  distanceLabel: { fontSize: 8, color: Colors.textLight, fontWeight: '700', letterSpacing: 1 },
  distanceValue: { fontSize: Fonts.sizes.xl, fontWeight: '900', color: Colors.teal },
  distanceSub: { fontSize: 9, color: Colors.textLight, fontWeight: '600' },
  yourLocationPin: { position: 'absolute', top: '42%', left: '42%', alignItems: 'center', transform: [{ translateX: -16 }] },
  floodZonePin: { position: 'absolute', bottom: '20%', left: '18%', alignItems: 'center' },
  safeZonePin: { position: 'absolute', top: '18%', right: '15%', alignItems: 'center' },
  pinCircleTeal: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.teal, alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.5)' },
  pinCircleRed: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.red, alignItems: 'center', justifyContent: 'center' },
  pinCircleGreen: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center' },
  pinLabel: { marginTop: 4, backgroundColor: Colors.tealDark, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  pinLabelText: { fontSize: 8, color: Colors.textWhite, fontWeight: '800', letterSpacing: 0.5 },
  mapLabel: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(13,59,94,0.85)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  mapLabelText: { fontSize: 10, color: Colors.textWhite, fontWeight: '600' },
  navigateBtn: { borderRadius: Radius.full, overflow: 'hidden', marginBottom: Spacing.base },
  navigateBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  navigateBtnText: { fontWeight: '800', color: Colors.textWhite, letterSpacing: 0.3 },
  legend: { borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md },
  legendTitle: { fontWeight: '700', marginBottom: 8 },
  legendItems: { flexDirection: 'row', gap: Spacing.base },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontWeight: '500' },
  routeInfo: { flexDirection: 'row', gap: Spacing.sm },
  routeCard: { flex: 1, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center' },
  routeCardIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(46,196,182,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  routeCardTitle: { fontWeight: '600', letterSpacing: 0.5 },
  routeCardValue: { fontWeight: '900', marginTop: 2 },
  routeCardSub: {},
});