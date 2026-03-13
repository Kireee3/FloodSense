import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '../../components/AppHeader';
import { Colors, Spacing, Radius, Fonts } from '../../constants/theme';
import { emergencyContacts } from '../../constants/data';

type IconName = React.ComponentProps<typeof Feather>['name'];

function dialNumber(number: string) {
  const cleaned = number.replace(/\D/g, '');
  Linking.openURL(`tel:${cleaned}`).catch(() =>
    Alert.alert('Cannot place call', 'Please dial ' + number + ' manually.')
  );
}

const iconMap: Record<string, IconName> = {
  shield: 'shield',
  home: 'home',
  radio: 'radio',
  'alert-circle': 'alert-circle',
};

const contactIconColors: string[] = [
  Colors.red,
  Colors.navyLight,
  Colors.red,
  Colors.teal,
  Colors.orange,
];

export default function EmergencyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppHeader />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sub header */}
        <View style={styles.subHeader}>
          <Text style={styles.subLabel}>QUICK DIAL</Text>
          <Text style={styles.pageTitle}>Emergency Contacts</Text>
        </View>

        <View style={styles.body}>
          {/* SOS Banner */}
          <TouchableOpacity
            onPress={() => dialNumber('911')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.redLight, Colors.red, Colors.redDark]}
              style={styles.sosBanner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.sosIconBox}>
                <Feather name="alert-circle" size={26} color={Colors.red} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sosLabel}>EMERGENCY</Text>
                <Text style={styles.sosNumber}>SOS · 911</Text>
              </View>
              <View style={styles.sosArrow}>
                <Feather name="chevron-right" size={22} color={Colors.textWhite} />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Contact list */}
          {emergencyContacts.map((contact, idx) => (
            <View key={contact.id} style={styles.contactCard}>
              <View
                style={[
                  styles.contactIconBox,
                  { backgroundColor: `${contactIconColors[idx]}22` },
                ]}
              >
                <Feather
                  name={iconMap[contact.icon] ?? 'phone'}
                  size={20}
                  color={contactIconColors[idx]}
                />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactSub}>{contact.subtitle}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </View>
              <TouchableOpacity
                style={styles.callBtn}
                onPress={() => dialNumber(contact.number)}
              >
                <Feather name="phone" size={18} color={Colors.textWhite} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Feather name="info" size={14} color={Colors.textGray} />
            <Text style={styles.disclaimerText}>
              In case of life-threatening emergency, always call 911 first.
              These numbers are for non-critical assistance.
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgLight },
  scroll: { flex: 1 },
  scrollContent: {},

  subHeader: {
    backgroundColor: Colors.bgWhite,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  subLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textGray,
    fontWeight: '700',
    letterSpacing: 1,
  },
  pageTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: '800',
    color: Colors.textDark,
    marginTop: 2,
  },

  body: {
    padding: Spacing.base,
    gap: Spacing.sm,
  },

  // SOS Banner
  sosBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sosIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosLabel: {
    fontSize: Fonts.sizes.xs,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  sosNumber: {
    fontSize: Fonts.sizes.xxl,
    fontWeight: '900',
    color: Colors.textWhite,
    letterSpacing: 0.5,
  },
  sosArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Contact card
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.navyMid,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  contactIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: Fonts.sizes.base,
    fontWeight: '800',
    color: Colors.textWhite,
  },
  contactSub: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textLight,
    marginTop: 1,
  },
  contactNumber: {
    fontSize: Fonts.sizes.sm,
    color: Colors.teal,
    fontWeight: '700',
    marginTop: 3,
  },
  callBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.full,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Disclaimer
  disclaimer: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: Colors.bgWhite,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  disclaimerText: {
    flex: 1,
    fontSize: Fonts.sizes.xs,
    color: Colors.textGray,
    lineHeight: 18,
  },
});
