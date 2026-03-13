import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from '../../components/AppHeader';
import { Colors, Spacing, Radius, Fonts } from '../../constants/theme';
import { safetyGuidelines } from '../../constants/data';

type IconName = React.ComponentProps<typeof Feather>['name'];

const phaseColors: Record<string, [string, string]> = {
  before: ['#1B4F72', '#0D3B5E'],
  during: ['#1B4F72', '#0D3B5E'],
  after: ['#1A5276', '#0D3B5E'],
};

const phaseIconBg: Record<string, string> = {
  before: Colors.orange,
  during: Colors.orange,
  after: Colors.green,
};

const phaseTextColor: Record<string, string> = {
  before: Colors.orange,
  during: Colors.orange,
  after: Colors.green,
};

const iconMap: Record<string, IconName> = {
  briefcase: 'briefcase',
  'alert-triangle': 'alert-triangle',
  'check-circle': 'check-circle',
  package: 'package',
  map: 'map',
  folder: 'folder',
  'trending-up': 'trending-up',
  droplet: 'droplet',
  radio: 'radio',
  bell: 'bell',
  camera: 'camera',
  home: 'home',
};

export default function GuideScreen() {
  const [expanded, setExpanded] = useState<string | null>('before');

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
          <Text style={styles.subLabel}>FLOOD PREPAREDNESS</Text>
          <Text style={styles.pageTitle}>Safety Guidelines</Text>
        </View>

        <View style={styles.body}>
          {safetyGuidelines.map((section) => {
            const isExpanded = expanded === section.id;
            const gradColors = phaseColors[section.id] as [string, string];
            const iconBg = phaseIconBg[section.id];
            const phaseColor = phaseTextColor[section.id];

            return (
              <View key={section.id} style={styles.sectionCard}>
                <LinearGradient
                  colors={gradColors}
                  style={styles.sectionGradient}
                >
                  {/* Section header */}
                  <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() =>
                      setExpanded(isExpanded ? null : section.id)
                    }
                    activeOpacity={0.8}
                  >
                    <View
                      style={[styles.sectionIcon, { backgroundColor: iconBg }]}
                    >
                      <Feather
                        name={iconMap[section.icon] ?? 'info'}
                        size={22}
                        color={Colors.textWhite}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.phaseLabel, { color: phaseColor }]}>
                        {section.phase}
                      </Text>
                      <Text style={styles.sectionTitle}>{section.title}</Text>
                    </View>
                    <Feather
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={Colors.textLight}
                    />
                  </TouchableOpacity>

                  {/* Tips */}
                  {isExpanded && (
                    <View style={styles.tipsList}>
                      {section.tips.map((tip, idx) => (
                        <View key={idx} style={styles.tipRow}>
                          <View style={styles.tipIcon}>
                            <Feather
                              name={iconMap[tip.icon] ?? 'chevron-right'}
                              size={16}
                              color={Colors.teal}
                            />
                          </View>
                          <Text style={styles.tipText}>{tip.text}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </LinearGradient>
              </View>
            );
          })}

          {/* Quick tips card */}
          <View style={styles.quickTipsCard}>
            <View style={styles.quickTipsHeader}>
              <Feather name="zap" size={18} color={Colors.orange} />
              <Text style={styles.quickTipsTitle}>Quick Tips</Text>
            </View>
            <Text style={styles.quickTipText}>
              • Always keep your phone charged during flood warnings
            </Text>
            <Text style={styles.quickTipText}>
              • Store 3 days of emergency supplies for your family
            </Text>
            <Text style={styles.quickTipText}>
              • Never drive through flooded roads — turn around, don't drown
            </Text>
            <Text style={styles.quickTipText}>
              • Keep emergency contacts saved offline
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
    gap: Spacing.md,
  },

  sectionCard: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionGradient: {
    padding: Spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  sectionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseLabel: {
    fontSize: Fonts.sizes.xs,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '800',
    color: Colors.textWhite,
    marginTop: 2,
  },

  tipsList: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(46,196,182,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: Fonts.sizes.base,
    color: Colors.textWhite,
    fontWeight: '500',
  },

  quickTipsCard: {
    backgroundColor: Colors.bgWhite,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: 8,
  },
  quickTipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  quickTipsTitle: {
    fontSize: Fonts.sizes.base,
    fontWeight: '800',
    color: Colors.textDark,
  },
  quickTipText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textGray,
    lineHeight: 20,
  },
});
