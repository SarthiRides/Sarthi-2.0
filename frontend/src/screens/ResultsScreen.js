import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Platform, Image, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { getProviderLogo } from '../services/imageAssetManager';

const ResultsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { fares, pickup, drop } = route.params || {};

  const [selectedFare, setSelectedFare] = useState(null);

  const bookRide = async (item) => {
    if (!item) return;

    // For Uber and Ola, we try passing coordinates via deep links
    if (item.provider_name === 'Uber') {
      const uberLink = `uber://?action=setPickup&pickup[latitude]=${pickup?.latitude}&pickup[longitude]=${pickup?.longitude}&dropoff[latitude]=${drop?.latitude}&dropoff[longitude]=${drop?.longitude}&product_id=uber_go`;
      const canUber = await Linking.canOpenURL('uber://').catch(() => false);
      if (canUber) {
        await Linking.openURL(uberLink);
        return;
      }
    }

    if (item.provider_name === 'Ola') {
      const olaLink = `olacabs://app/launch?pickup_lat=${pickup?.latitude}&pickup_lng=${pickup?.longitude}&drop_lat=${drop?.latitude}&drop_lng=${drop?.longitude}&category=mini`;
      const canOla = await Linking.canOpenURL('olacabs://').catch(() => false);
      if (canOla) {
        await Linking.openURL(olaLink);
        return;
      }
    }

    // For Namma Yatri and Rapido, the most reliable way on Android
    // is to launch the Play Store URL. Android "App Links" will
    // automatically open the installed app instead of the Store.
    if (Platform.OS === 'android') {
      await Linking.openURL(item.play_store_url);
    } else {
      // iOS Fallback
      const canApp = await Linking.canOpenURL(item.app_scheme).catch(() => false);
      if (canApp) {
        await Linking.openURL(item.app_scheme);
      } else {
        await Linking.openURL(item.play_store_url);
      }
    }
  };

  const safeFormat = (val) => {
    const num = Number(val);
    return isNaN(num) ? "0.0" : num.toFixed(1);
  };

  const renderFare = ({ item }) => {
    const providerColors = {
      'Ola': '#000000',
      'Uber': '#000000',
      'Rapido': '#f6c915',
      'Namma Yatri': '#ffdd00'
    };
    const fallbackColor = providerColors[item.provider_name] || '#7C4DFF';

    return (
      <TouchableOpacity
        style={styles.fareItem}
        onPress={() => setSelectedFare(item)}
        activeOpacity={0.85}
      >
        <View style={styles.leftSection}>
          <View style={styles.logoContainer}>
            {getProviderLogo(item.provider_logo) ? (
              <Image
                source={getProviderLogo(item.provider_logo)}
                style={styles.logo}
                resizeMode="contain"
              />
            ) : (
              <View style={[styles.fallbackLogo, { backgroundColor: fallbackColor }]}>
                <Text style={styles.fallbackText}>{item.provider_name[0]}</Text>
              </View>
            )}
          </View>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{item.provider_name}</Text>
            <Text style={styles.rideInfo}>{item.vehicle_name}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.priceContainer}>
            {item.surge_applied && (
              <View style={styles.surgeBadge}>
                <Icon name="bolt" size={10} color="#FF9500" />
                <Text style={styles.surgeText}>{safeFormat(item.surge_multiple)}x</Text>
              </View>
            )}
            <Text style={styles.price}>₹{item.estimated_fare || 0}</Text>
            <Text style={styles.eta}>{item.estimated_time_min || 0} min</Text>
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={() => bookRide(item)}>
             <Text style={styles.bookBtnText}>Book</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.routeBox}>
           <Icon name="radio-button-checked" size={14} color="#06B77D" />
           <Text style={styles.summaryText} numberOfLines={1}>Pickup Set</Text>
           <Icon name="more-vert" size={14} color="#1F2D49" style={{ marginVertical: -4 }} />
           <Icon name="location-on" size={14} color="#FF3B30" />
           <Text style={styles.summaryText} numberOfLines={1}>Destination Set</Text>
        </View>
        <View style={styles.distanceBadge}>
           <Text style={styles.distanceText}>{safeFormat(fares?.[0]?.distance_km)} km</Text>
        </View>
      </View>

      <FlatList
        data={fares || []}
        renderItem={renderFare}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.header}>Available Rides</Text>}
      />

      <Modal visible={!!selectedFare} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>Fare Estimate</Text>
               <TouchableOpacity onPress={() => setSelectedFare(null)}>
                 <Icon name="close" size={24} color="#EAF1FF" />
               </TouchableOpacity>
            </View>

            {selectedFare && selectedFare.breakdown && (
              <View style={styles.breakdownList}>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Base Fare (first 2km)</Text>
                  <Text style={styles.breakdownValue}>₹{selectedFare.breakdown.base || 0}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Distance ({safeFormat(selectedFare.distance_km)} km)</Text>
                  <Text style={styles.breakdownValue}>₹{selectedFare.breakdown.distance_fare || 0}</Text>
                </View>
                {selectedFare.surge_applied && (
                  <View style={styles.breakdownRow}>
                    <Text style={[styles.breakdownLabel, { color: '#FF9500' }]}>Surge Pricing Applied</Text>
                    <Text style={[styles.breakdownValue, { color: '#FF9500' }]}>+₹{selectedFare.breakdown.surge_charge || 0}</Text>
                  </View>
                )}
                <View style={[styles.breakdownRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total (incl. GST)</Text>
                  <Text style={styles.totalValue}>₹{selectedFare.estimated_fare || 0}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.confirmBook} onPress={() => { bookRide(selectedFare); setSelectedFare(null); }}>
               <Text style={styles.confirmBookText}>Confirm & Open {selectedFare?.provider_name}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090F1D' },
  summaryCard: {
    backgroundColor: '#101A2E',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1F2D49',
  },
  routeBox: { flex: 1, gap: 2 },
  summaryText: { color: '#9FB0D1', fontSize: 12, marginLeft: 6 },
  distanceBadge: { backgroundColor: '#1F2D49', padding: 8, borderRadius: 10 },
  distanceText: { color: '#7C4DFF', fontWeight: 'bold' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#EAF1FF', marginHorizontal: 16, marginBottom: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  fareItem: {
    backgroundColor: '#101A2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1F2D49',
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  logoContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#EAF1FF',
    overflow: 'hidden'
  },
  logo: { width: '100%', height: '100%' },
  fallbackLogo: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  fallbackText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  providerInfo: { flex: 1 },
  providerName: { color: '#EAF1FF', fontSize: 18, fontWeight: 'bold' },
  rideInfo: { color: '#9FB0D1', fontSize: 13 },
  rightSection: { alignItems: 'flex-end', gap: 8 },
  priceContainer: { alignItems: 'flex-end' },
  price: { color: '#06B77D', fontSize: 22, fontWeight: 'bold' },
  eta: { color: '#9FB0D1', fontSize: 12 },
  surgeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 149, 0, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  surgeText: { color: '#FF9500', fontSize: 10, fontWeight: 'bold' },
  bookBtn: { backgroundColor: '#7C4DFF', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  bookBtnText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#101A2E', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#EAF1FF', fontSize: 20, fontWeight: 'bold' },
  breakdownList: { gap: 12, marginBottom: 24 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  breakdownLabel: { color: '#9FB0D1', fontSize: 15 },
  breakdownValue: { color: '#EAF1FF', fontSize: 15, fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#1F2D49', paddingTop: 12, marginTop: 4 },
  totalLabel: { color: '#EAF1FF', fontSize: 17, fontWeight: 'bold' },
  totalValue: { color: '#06B77D', fontSize: 20, fontWeight: 'bold' },
  confirmBook: { backgroundColor: '#06B77D', padding: 16, borderRadius: 12, alignItems: 'center' },
  confirmBookText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ResultsScreen;
