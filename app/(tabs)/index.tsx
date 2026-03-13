import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import { Colors, Spacing, Radius, Fonts } from '../../constants/theme';
import { floodData, alerts } from '../../constants/data';

function WaterLevelWidget() {
  return (
    <View style={styles.waterCard}>
      <Text style={styles.waterLabel}>WATER LEVEL</Text>
      {/* Water animation bg */}
      <View style={styles.waterVisual}>
        <LinearGradient
          colors={['#2EC4B6', '#1A8FA6']}
          style={styles.waterFill}
        />
        <Text style={styles.waterValue}>{floodData.waterLevel}</Text>
        <Text style={styles.waterUnit}>meters</Text>
      </View>
      <TouchableOpacity style={styles.trendBadge}>
        <Feather name="trending-up" size={12} color={Colors.textWhite} />
        <Text style={styles.trendText}> Rising</Text>
      </TouchableOpacity>
    </View>
  );
}

function WeatherStat({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Feather name={icon} size={14} color={Colors.textLight} />
        <Text style={styles.statLabel}>{label}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}

function AlertItem({
  alert,
}: {
  alert: (typeof alerts)[0];
}) {
  const colorMap = {
    warning: Colors.orange,
    info: Colors.teal,
    safe: Colors.green,
    notice: Colors.navyLight,
  };
  const iconMap: Record<string, React.ComponentProps<typeof Feather>['name']> = {
    warning: 'alert-triangle',
    info: 'info',
    safe: 'check-circle',
    notice: 'info',
  };
  const color = colorMap[alert.type];
  const icon = iconMap[alert.type];

  return (
    <View style={[styles.alertCard, { borderLeftColor: color }]}>
      <View style={[styles.alertIcon, { backgroundColor: color }]}>
        <Feather name={icon} size={16} color={Colors.textWhite} />
      </View>
      <View style={styles.alertBody}>
        <Text style={[styles.alertTitle, { color }]}>{alert.title}</Text>
        <Text style={styles.alertMsg}>{alert.message}</Text>
        <View style={styles.alertTime}>
          <Feather name="clock" size={10} color={Colors.textGray} />
          <Text style={styles.alertTimeText}> {alert.time}</Text>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greetRow}>
          <View>
            <Text style={styles.greetSub}>GOOD MORNING</Text>
            <Text style={styles.greetTitle}>Stay safe, Resident 👋</Text>
          </View>
          <View style={styles.warnBadge}>
            <Feather name="alert-triangle" size={13} color={Colors.warning} />
            <Text style={styles.warnText}> WARNING</Text>
          </View>
        </View>

        {/* Main flood card */}
        <LinearGradient
          colors={[Colors.orangeLight, Colors.orange, Colors.orangeDark]}
          style={styles.floodCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Header row */}
          <View style={styles.floodCardHeader}>
            <View style={styles.floodAlertIcon}>
              <Feather name="alert-triangle" size={20} color={Colors.orange} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={styles.floodWarningLabel}>FLOOD WARNING</Text>
              <Text style={styles.floodWarningDesc}>
                Moderate flood risk — Stay alert
              </Text>
            </View>
            <View style={styles.riskBadge}>
              <Text style={styles.riskText}>MODERATE RISK</Text>
            </View>
          </View>

          {/* Stats grid */}
          <View style={styles.statsRow}>
            <WaterLevelWidget />
            <View style={styles.statsCol}>
              <WeatherStat
                icon="cloud-rain"
                label="RAINFALL"
                value={floodData.rainfall}
                sub={floodData.rainfallSub}
              />
              <WeatherStat
                icon="thermometer"
                label="TEMP"
                value={`${floodData.temperature}°C`}
                sub={`feels like ${floodData.feelsLike}°`}
              />
              <WeatherStat
                icon="wind"
                label="WIND"
                value={`${floodData.windSpeed} km/h`}
                sub={floodData.windDirection}
              />
            </View>
          </View>

          {/* Live footer */}
          <View style={styles.liveFooter}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live monitoring active</Text>
            <Text style={styles.liveTime}>{floodData.lastUpdated}</Text>
          </View>
        </LinearGradient>

        {/* Evacuation map section */}
        <View style={styles.mapSection}>
          <View style={styles.mapSectionHeader}>
            <Text style={styles.sectionTitle}>Evacuation Map</Text>
            <TouchableOpacity style={styles.fullMapBtn}>
              <Feather name="layers" size={12} color={Colors.teal} />
              <Text style={styles.fullMapText}> Full Map</Text>
            </TouchableOpacity>
          </View>

          {/* Mock map */}
          <View style={styles.mockMap}>
            <LinearGradient
              colors={['#0D2137', '#0A1929']}
              style={StyleSheet.absoluteFill}
            />
            {/* Grid lines */}
            {[...Array(5)].map((_, i) => (
              <View
                key={`h${i}`}
                style={[styles.gridLine, styles.gridH, { top: `${(i + 1) * 16}%` }]}
              />
            ))}
            {[...Array(5)].map((_, i) => (
              <View
                key={`v${i}`}
                style={[styles.gridLine, styles.gridV, { left: `${(i + 1) * 16}%` }]}
              />
            ))}
            {/* Blocks */}
            <View style={[styles.mapBlock, { top: 18, left: 20 }]} />
            <View style={[styles.mapBlock, { top: 18, left: 100 }]} />
            <View style={[styles.mapBlock, { top: 80, left: 20 }]} />
            <View style={[styles.mapBlock, { bottom: 30, right: 20 }]} />
            <View style={[styles.mapBlock, { bottom: 30, left: 80 }]} />

            {/* Glow */}
            <View style={styles.locationGlow} />

            {/* Your location pin */}
            <View style={styles.yourLocationPin}>
              <View style={styles.pinCircleTeal}>
                <Feather name="map-pin" size={14} color={Colors.textWhite} />
              </View>
              <View style={styles.pinLabel}>
                <Text style={styles.pinLabelText}>YOUR LOCATION</Text>
              </View>
            </View>

            {/* Flood zone pin */}
            <View style={styles.floodZonePin}>
              <View style={styles.pinCircleRed}>
                <Feather name="map-pin" size={14} color={Colors.textWhite} />
              </View>
              <View style={[styles.pinLabel, { backgroundColor: Colors.redDark }]}>
                <Text style={styles.pinLabelText}>FLOOD ZONE</Text>
              </View>
            </View>

            {/* Safe zone pin */}
            <View style={styles.safeZonePin}>
              <View style={styles.pinCircleGreen}>
                <Feather name="map-pin" size={14} color={Colors.textWhite} />
              </View>
              <View style={[styles.pinLabel, { backgroundColor: Colors.greenDark }]}>
                <Text style={styles.pinLabelText}>SAFE ZONE</Text>
              </View>
            </View>

            {/* Location label */}
            <View style={styles.locationLabel}>
              <Text style={styles.locationLabelText}>Brgy 659 - Manila</Text>
            </View>
          </View>

          {/* Navigate button */}
          <LinearGradient
            colors={[Colors.navyMid, Colors.teal]}
            style={styles.navigateBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity style={styles.navigateBtnInner}>
              <Feather name="navigation" size={18} color={Colors.textWhite} />
              <Text style={styles.navigateBtnText}>Navigate to Safe Zone</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Recent Alerts */}
        <View style={styles.alertsSection}>
          <View style={styles.alertsSectionHeader}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            <View style={styles.alertBadgeBtn}>
              <Feather name="bell" size={16} color={Colors.textWhite} />
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>3</Text>
              </View>
            </View>
          </View>
          {alerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgLight },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // Greeting
  greetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.bgWhite,
  },
  greetSub: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textGray,
    fontWeight: '600',
    letterSpacing: 1,
  },
  greetTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '800',
    color: Colors.textDark,
    marginTop: 2,
  },
  warnBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.warning,
    backgroundColor: 'rgba(243,156,18,0.08)',
  },
  warnText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: '700',
    color: Colors.warning,
    letterSpacing: 0.5,
  },

  // Flood main card
  floodCard: {
    margin: Spacing.base,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.md,
  },
  floodCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floodAlertIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floodWarningLabel: {
    fontSize: Fonts.sizes.xs,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '700',
    letterSpacing: 1,
  },
  floodWarningDesc: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textWhite,
    fontWeight: '600',
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  riskText: {
    fontSize: 10,
    color: Colors.textWhite,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statsCol: {
    flex: 1,
    gap: Spacing.sm,
  },
  waterCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
    overflow: 'hidden',
  },
  waterLabel: {
    fontSize: 9,
    color: Colors.textWhite,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  waterVisual: {
    width: '100%',
    flex: 1,
    minHeight: 100,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  waterFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    opacity: 0.9,
  },
  waterValue: {
    fontSize: 34,
    fontWeight: '900',
    color: Colors.textWhite,
    zIndex: 1,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  waterUnit: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    zIndex: 1,
    marginBottom: 6,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  trendText: {
    fontSize: 11,
    color: Colors.textWhite,
    fontWeight: '700',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.md,
    padding: 10,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9,
    color: Colors.textLight,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  statSub: {
    fontSize: 10,
    color: Colors.textLight,
  },

  // Live footer
  liveFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.tealLight,
  },
  liveText: {
    flex: 1,
    fontSize: Fonts.sizes.xs,
    color: Colors.textWhite,
    fontWeight: '600',
  },
  liveTime: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textLight,
    fontWeight: '600',
  },

  // Map section
  mapSection: {
    backgroundColor: Colors.bgWhite,
    marginHorizontal: Spacing.base,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  mapSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: '800',
    color: Colors.textDark,
  },
  fullMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullMapText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.teal,
    fontWeight: '700',
  },

  // Mock map
  mockMap: {
    height: 200,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(46,196,182,0.1)',
  },
  gridH: {
    left: 0,
    right: 0,
    height: 1,
  },
  gridV: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  mapBlock: {
    position: 'absolute',
    width: 48,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  locationGlow: {
    position: 'absolute',
    top: '35%',
    left: '40%',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(192,57,43,0.25)',
    transform: [{ translateX: -40 }, { translateY: -40 }],
  },
  yourLocationPin: {
    position: 'absolute',
    top: '30%',
    left: '45%',
    alignItems: 'center',
    transform: [{ translateX: -20 }],
  },
  floodZonePin: {
    position: 'absolute',
    bottom: '25%',
    left: '20%',
    alignItems: 'center',
    transform: [{ translateX: -20 }],
  },
  safeZonePin: {
    position: 'absolute',
    top: '10%',
    right: '12%',
    alignItems: 'center',
  },
  pinCircleTeal: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  pinCircleRed: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinCircleGreen: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinLabel: {
    marginTop: 3,
    backgroundColor: Colors.tealDark,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pinLabelText: {
    fontSize: 8,
    color: Colors.textWhite,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  locationLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(13,59,94,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  locationLabelText: {
    fontSize: 10,
    color: Colors.textWhite,
    fontWeight: '600',
  },

  // Navigate button
  navigateBtn: {
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  navigateBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  navigateBtnText: {
    fontSize: Fonts.sizes.base,
    fontWeight: '800',
    color: Colors.textWhite,
    letterSpacing: 0.3,
  },

  // Recent alerts
  alertsSection: {
    paddingHorizontal: Spacing.base,
  },
  alertsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  alertBadgeBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.navyMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBadgeText: {
    fontSize: 8,
    color: Colors.textWhite,
    fontWeight: '800',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.bgWhite,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderLeftWidth: 4,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBody: { flex: 1 },
  alertTitle: {
    fontSize: Fonts.sizes.sm,
    fontWeight: '800',
    marginBottom: 2,
  },
  alertMsg: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textGray,
    marginBottom: 4,
  },
  alertTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTimeText: {
    fontSize: 10,
    color: Colors.textGray,
  },
});