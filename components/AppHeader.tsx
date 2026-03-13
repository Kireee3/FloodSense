import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Fonts } from '../constants/theme';

type AppHeaderProps = {
  showBadge?: boolean;
};

export default function AppHeader({ showBadge = true }: AppHeaderProps) {
  return (
    <LinearGradient
      colors={[Colors.navyDark, Colors.navyMid]}
      style={styles.header}
    >
      {/* Logo + Title */}
      <View style={styles.logoRow}>
        <View style={styles.logoBox}>
          <Feather name="map-pin" size={20} color={Colors.textWhite} />
        </View>
        <View>
          <Text style={styles.appName}>FloodSense</Text>
          <Text style={styles.appSub}>
            {Colors.teal && (
              <Text style={{ color: Colors.teal }}>BARANGAY 659</Text>
            )}{' '}
            · LIVE
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn}>
          <Feather name="bell" size={18} color={Colors.textWhite} />
          {showBadge && <View style={styles.badge} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Feather name="settings" size={18} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: 52,
    paddingBottom: Spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '800',
    color: Colors.textWhite,
    letterSpacing: 0.3,
  },
  appSub: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textLight,
    fontWeight: '600',
    letterSpacing: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.overlayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.orange,
    borderWidth: 1.5,
    borderColor: Colors.navyMid,
  },
});
