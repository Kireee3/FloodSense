import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import MapView, {
  Marker,
  Polyline,
  Circle,
  UrlTile,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import { Colors, Spacing, Radius, Fonts } from '../../constants/theme';
import { useTheme } from '../../constants/ThemeContext';

// ---------------------------------------------------------------------------
// Types & layer config
// ---------------------------------------------------------------------------
type LayerKey = 'street' | 'satellite' | 'terrain' | 'cycle' | 'transport';

interface MapLayer {
  key: LayerKey;
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  description: string;
  tileUrl: string;
  baseUrl?: string;
  nativeSatellite?: boolean;
}

const MAP_LAYERS: MapLayer[] = [
  {
    key: 'street',
    label: 'Street',
    icon: 'map',
    description: 'Standard street map',
    tileUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
  },
  {
    key: 'satellite',
    label: 'Satellite',
    icon: 'globe',
    description: 'Aerial/satellite imagery',
    tileUrl: '',
    nativeSatellite: true,
  },
  {
    key: 'terrain',
    label: 'Terrain',
    icon: 'triangle',
    description: 'Elevation & contours',
    tileUrl: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png',
  },
  {
    key: 'cycle',
    label: 'Cycle',
    icon: 'wind',
    description: 'Cycling routes',
    baseUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    tileUrl: 'https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png',
  },
  {
    key: 'transport',
    label: 'Transport',
    icon: 'truck',
    description: 'Transit & transport network',
    tileUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
  },
];

// ---------------------------------------------------------------------------
// Coordinates — Brgy 659, Manila
// ---------------------------------------------------------------------------
const YOUR_LOCATION  = { latitude: 14.5995, longitude: 120.9842 };
const FLOOD_LOCATION = { latitude: 14.5965, longitude: 120.9820 };
const SAFE_LOCATION  = { latitude: 14.6025, longitude: 120.9875 };

const ROUTE_COORDS = [
  YOUR_LOCATION,
  { latitude: 14.6005, longitude: 120.9855 },
  SAFE_LOCATION,
];

const INITIAL_REGION = {
  latitude: 14.5995,
  longitude: 120.9850,
  latitudeDelta: 0.012,
  longitudeDelta: 0.010,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function MapScreen() {
  const { darkMode, fontSize, unitSystem } = useTheme();

  const bg            = darkMode ? '#0a1628' : Colors.bgLight;
  const cardBg        = darkMode ? '#0d1f33' : Colors.bgWhite;
  const textPrimary   = darkMode ? '#ffffff' : Colors.textDark;
  const textSecondary = darkMode ? '#aaaaaa' : Colors.textGray;
  const borderColor   = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const fs = fontSize === 'small' ? 0.85 : fontSize === 'large' ? 1.2 : 1;

  const distance = unitSystem === 'imperial' ? '0.9 mi' : '1.5 km';

  const [activeLayer, setActiveLayer] = useState<LayerKey>('street');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [mapRegion, setMapRegion] = useState(INITIAL_REGION);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const currentLayer = MAP_LAYERS.find(l => l.key === activeLayer)!;

  const openPicker = () => {
    setPickerVisible(true);
    Animated.spring(fadeAnim, {
      toValue: 1, useNativeDriver: true,
      tension: 65, friction: 11,
    }).start();
  };

  const closePicker = () => {
    Animated.timing(fadeAnim, {
      toValue: 0, duration: 180, useNativeDriver: true,
    }).start(() => setPickerVisible(false));
  };

  const selectLayer = (key: LayerKey) => {
    setActiveLayer(key);
    closePicker();
  };

  const renderInteractiveMap = (fullscreen = false) => (
    <>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_DEFAULT}
        initialRegion={mapRegion}
        onRegionChangeComplete={(region) => setMapRegion(region)}
        mapType={currentLayer.nativeSatellite ? 'satellite' : 'standard'}
        onPress={!fullscreen ? () => setIsMapFullscreen(true) : undefined}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        rotateEnabled
        scrollEnabled
        zoomEnabled
        zoomControlEnabled
        zoomTapEnabled
        pitchEnabled={false}
      >
        {/* Base OSM tile for cycle layer */}
        {!currentLayer.nativeSatellite && currentLayer.baseUrl && (
          <UrlTile
            urlTemplate={currentLayer.baseUrl}
            maximumZ={19}
            flipY={false}
            tileSize={256}
            zIndex={0}
          />
        )}

        {/* Primary tile layer */}
        {!currentLayer.nativeSatellite && currentLayer.tileUrl !== '' && (
          <UrlTile
            urlTemplate={currentLayer.tileUrl}
            maximumZ={19}
            flipY={false}
            tileSize={256}
            zIndex={currentLayer.baseUrl ? 1 : 0}
            opacity={currentLayer.baseUrl ? 0.8 : 1}
          />
        )}

        {/* Flood zone radius */}
        <Circle
          center={FLOOD_LOCATION}
          radius={130}
          strokeColor="rgba(231,76,60,0.8)"
          fillColor="rgba(231,76,60,0.18)"
          strokeWidth={2}
        />

        {/* Evacuation route */}
        <Polyline
          coordinates={ROUTE_COORDS}
          strokeColor={Colors.teal}
          strokeWidth={4}
          lineDashPattern={[10, 6]}
        />

        {/* Your Location */}
        <Marker coordinate={YOUR_LOCATION} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
          <View style={styles.markerWrap}>
            <View style={styles.markerTeal}>
              <Feather name="map-pin" size={16} color="#fff" />
            </View>
            <View style={[styles.markerLabel, { backgroundColor: '#0d8b80' }]}>
              <Text style={styles.markerLabelText}>YOU</Text>
            </View>
          </View>
        </Marker>

        {/* Flood Zone */}
        <Marker coordinate={FLOOD_LOCATION} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
          <View style={styles.markerWrap}>
            <View style={styles.markerRed}>
              <Feather name="alert-triangle" size={13} color="#fff" />
            </View>
            <View style={[styles.markerLabel, { backgroundColor: Colors.redDark }]}>
              <Text style={styles.markerLabelText}>FLOOD ZONE</Text>
            </View>
          </View>
        </Marker>

        {/* Safe Zone */}
        <Marker coordinate={SAFE_LOCATION} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
          <View style={styles.markerWrap}>
            <View style={styles.markerGreen}>
              <Feather name="check" size={14} color="#fff" />
            </View>
            <View style={[styles.markerLabel, { backgroundColor: Colors.greenDark }]}>
              <Text style={styles.markerLabelText}>SAFE ZONE</Text>
            </View>
          </View>
        </Marker>
      </MapView>

      {/* Distance overlay */}
      <View style={styles.distanceCard}>
        <Text style={styles.distanceLabel}>DISTANCE</Text>
        <Text style={styles.distanceValue}>{distance}</Text>
        <Text style={styles.distanceSub}>Est. 12 mins walk</Text>
      </View>

      {/* Brgy label */}
      <View style={styles.mapLabel}>
        <Text style={styles.mapLabelText}>Brgy 659 - Manila</Text>
      </View>

      {!fullscreen && (
        <View style={styles.fullscreenHint} pointerEvents="none">
          <Feather name="maximize-2" size={14} color={Colors.textWhite} />
          <Text style={styles.fullscreenHintText}>Tap map to expand</Text>
        </View>
      )}

      {fullscreen && (
        <TouchableOpacity
          style={styles.exitFullscreenBtn}
          onPress={() => setIsMapFullscreen(false)}
          activeOpacity={0.85}
        >
          <Feather name="minimize-2" size={15} color={Colors.textWhite} />
          <Text style={styles.exitFullscreenText}>Back to Card</Text>
        </TouchableOpacity>
      )}
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
      <AppHeader />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {/* Sub-header */}
        <View style={[styles.subHeader, { backgroundColor: cardBg, borderBottomColor: borderColor }]}>
          <Text style={[styles.subLabel, { color: textSecondary, fontSize: Fonts.sizes.xs * fs }]}>
            NAVIGATION
          </Text>
          <Text style={[styles.pageTitle, { color: textPrimary, fontSize: Fonts.sizes.xl * fs }]}>
            Evacuation Routes
          </Text>
        </View>

        <View style={styles.body}>

          {/* Section row */}
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: textPrimary, fontSize: Fonts.sizes.base * fs }]}>
              Evacuation Map
            </Text>
            <TouchableOpacity
              style={[styles.layerBtn, { backgroundColor: cardBg, borderColor }]}
              onPress={openPicker}
              activeOpacity={0.8}
            >
              <Feather name={currentLayer.icon} size={13} color={Colors.teal} />
              <Text style={[styles.layerBtnText, { color: textPrimary, fontSize: Fonts.sizes.xs * fs }]}>
                {currentLayer.label}
              </Text>
              <Feather name="chevron-down" size={12} color={textSecondary} />
            </TouchableOpacity>
          </View>

          {/* MAP */}
          <View style={styles.mapContainer}>
            {!isMapFullscreen && renderInteractiveMap(false)}
          </View>

          {/* Navigate button */}
          <LinearGradient
            colors={[Colors.navyMid, Colors.teal]}
            style={styles.navigateBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity style={styles.navigateBtnInner} activeOpacity={0.85}>
              <Feather name="navigation" size={18} color={Colors.textWhite} />
              <Text style={[styles.navigateBtnText, { fontSize: Fonts.sizes.base * fs }]}>
                Navigate to Safe Zone
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Legend */}
          <View style={[styles.legend, { backgroundColor: cardBg }]}>
            <Text style={[styles.legendTitle, { color: textPrimary, fontSize: Fonts.sizes.sm * fs }]}>
              Map Legend
            </Text>
            <View style={styles.legendItems}>
              <LegendItem color={Colors.teal}  label="Your Location" textColor={textSecondary} fs={fs} />
              <LegendItem color={Colors.red}   label="Flood Zone"    textColor={textSecondary} fs={fs} />
              <LegendItem color={Colors.green} label="Safe Zone"     textColor={textSecondary} fs={fs} />
            </View>
          </View>

          {/* Route info */}
          <View style={styles.routeInfo}>
            <RouteInfoCard
              icon="clock" title="Estimated Time" value="12 mins" sub="Walking pace"
              cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} fs={fs}
            />
            <RouteInfoCard
              icon="map-pin" title="Distance" value={distance} sub="Direct route"
              cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} fs={fs}
            />
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Layer Picker Modal */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="none"
        onRequestClose={closePicker}
      >
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={closePicker}>
          <Animated.View
            style={[
              styles.layerPicker,
              { backgroundColor: cardBg },
              {
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={styles.pickerHandle} />
            <Text style={[styles.pickerTitle, { color: textPrimary }]}>Map Style</Text>

            {MAP_LAYERS.map((layer, i) => {
              const isActive = activeLayer === layer.key;
              return (
                <TouchableOpacity
                  key={layer.key}
                  style={[
                    styles.pickerItem,
                    { borderBottomColor: borderColor },
                    i === MAP_LAYERS.length - 1 && { borderBottomWidth: 0 },
                  ]}
                  onPress={() => selectLayer(layer.key)}
                  activeOpacity={0.75}
                >
                  <View style={[
                    styles.pickerIconWrap,
                    { backgroundColor: isActive ? Colors.teal : 'rgba(46,196,182,0.12)' },
                  ]}>
                    <Feather name={layer.icon} size={16} color={isActive ? '#fff' : Colors.teal} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.pickerLabel, { color: isActive ? Colors.teal : textPrimary }]}>
                      {layer.label}
                    </Text>
                    <Text style={[styles.pickerDesc, { color: textSecondary }]}>
                      {layer.description}
                    </Text>
                  </View>
                  {isActive && (
                    <View style={styles.pickerCheck}>
                      <Feather name="check" size={13} color={Colors.teal} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={isMapFullscreen}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setIsMapFullscreen(false)}
      >
        <View style={[styles.fullscreenMapContainer, { backgroundColor: bg }]}>
          {renderInteractiveMap(true)}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function LegendItem({ color, label, textColor, fs }: {
  color: string; label: string; textColor: string; fs: number;
}) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendLabel, { color: textColor, fontSize: Fonts.sizes.sm * fs }]}>
        {label}
      </Text>
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
      <Text style={[styles.routeCardTitle, { color: textSecondary, fontSize: Fonts.sizes.xs * fs }]}>
        {title}
      </Text>
      <Text style={[styles.routeCardValue, { color: textPrimary, fontSize: Fonts.sizes.xl * fs }]}>
        {value}
      </Text>
      <Text style={[styles.routeCardSub, { color: textSecondary, fontSize: Fonts.sizes.xs * fs }]}>
        {sub}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container:    { flex: 1 },
  scroll:       { flex: 1 },
  subHeader:    { paddingHorizontal: Spacing.base, paddingVertical: Spacing.md, borderBottomWidth: 1 },
  subLabel:     { fontWeight: '700', letterSpacing: 1 },
  pageTitle:    { fontWeight: '800', marginTop: 2 },
  body:         { padding: Spacing.base },

  sectionRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  sectionTitle: { fontWeight: '700' },

  layerBtn:     { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 6 },
  layerBtnText: { fontWeight: '600' },

  mapContainer: { height: 340, borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.md, position: 'relative' },
  fullscreenMapContainer: { flex: 1 },
  fullscreenHint: {
    position: 'absolute', left: 10, top: 10,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 6,
  },
  fullscreenHintText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  exitFullscreenBtn: {
    position: 'absolute', top: 56, left: 12,
    backgroundColor: 'rgba(13,59,94,0.92)',
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(46,196,182,0.4)',
  },
  exitFullscreenText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  distanceCard: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(13,59,94,0.92)', borderRadius: Radius.md, padding: 10, borderWidth: 1, borderColor: 'rgba(46,196,182,0.3)' },
  distanceLabel:{ fontSize: 8, color: Colors.textLight, fontWeight: '700', letterSpacing: 1 },
  distanceValue:{ fontSize: Fonts.sizes.xl, fontWeight: '900', color: Colors.teal },
  distanceSub:  { fontSize: 9, color: Colors.textLight, fontWeight: '600' },

  mapLabel:     { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(13,59,94,0.85)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  mapLabelText: { fontSize: 10, color: Colors.textWhite, fontWeight: '600' },

  markerWrap:   { alignItems: 'center' },
  markerTeal:   { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.teal,  alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.6)' },
  markerRed:    { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.red,   alignItems: 'center', justifyContent: 'center', borderWidth: 2,   borderColor: 'rgba(255,255,255,0.5)' },
  markerGreen:  { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center', borderWidth: 2,   borderColor: 'rgba(255,255,255,0.5)' },
  markerLabel:  { marginTop: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  markerLabelText: { fontSize: 8, color: '#fff', fontWeight: '800', letterSpacing: 0.5 },

  navigateBtn:      { borderRadius: Radius.full, overflow: 'hidden', marginBottom: Spacing.base },
  navigateBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  navigateBtnText:  { fontWeight: '800', color: Colors.textWhite, letterSpacing: 0.3 },

  legend:       { borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md },
  legendTitle:  { fontWeight: '700', marginBottom: 8 },
  legendItems:  { flexDirection: 'row', gap: Spacing.base },
  legendItem:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:    { width: 10, height: 10, borderRadius: 5 },
  legendLabel:  { fontWeight: '500' },

  routeInfo:      { flexDirection: 'row', gap: Spacing.sm },
  routeCard:      { flex: 1, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center' },
  routeCardIcon:  { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(46,196,182,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  routeCardTitle: { fontWeight: '600', letterSpacing: 0.5 },
  routeCardValue: { fontWeight: '900', marginTop: 2 },
  routeCardSub:   {},

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  layerPicker:   { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.base, paddingBottom: 36 },
  pickerHandle:  { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(150,150,150,0.4)', alignSelf: 'center', marginBottom: 14 },
  pickerTitle:   { fontSize: Fonts.sizes.lg, fontWeight: '800', marginBottom: Spacing.md },
  pickerItem:    { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1 },
  pickerIconWrap:{ width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  pickerLabel:   { fontWeight: '700', fontSize: Fonts.sizes.base },
  pickerDesc:    { fontSize: Fonts.sizes.xs, marginTop: 1 },
  pickerCheck:   { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(46,196,182,0.15)', alignItems: 'center', justifyContent: 'center' },
});