import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import useAuthStore from '../stores/authStore';
import api from '../services/api';

const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [pickupInput, setPickupInput] = useState('');
  const [dropInput, setDropInput] = useState('');
  const [mapTarget, setMapTarget] = useState('drop');
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addressTarget, setAddressTarget] = useState('pickup');
  const [addressDraft, setAddressDraft] = useState('');
  const [routeCoords, setRouteCoords] = useState([]);
  const [rideTypes, setRideTypes] = useState([]);
  const [selectedRideTypeId, setSelectedRideTypeId] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    loadRideTypes();
    initLocation();
  }, []);

  useEffect(() => {
    const loadRoute = async () => {
      if (!pickupLocation || !dropLocation) {
        setRouteCoords([]);
        return;
      }
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${pickupLocation.longitude},${pickupLocation.latitude};${dropLocation.longitude},${dropLocation.latitude}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();
        const coords = data?.routes?.[0]?.geometry?.coordinates?.map((c) => ({ latitude: c[1], longitude: c[0] }));
        if (coords?.length > 1) {
          setRouteCoords(coords);
          return;
        }
      } catch (error) {}
      setRouteCoords([pickupLocation, dropLocation]);
    };
    loadRoute();
  }, [pickupLocation, dropLocation]);

  const initLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location access is needed to set your pickup point.');
      return;
    }
    useCurrentLocationAsPickup();
  };

  const useCurrentLocationAsPickup = async () => {
    setLoading(true);
    try {
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const loc = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      setCurrentLocation(loc);
      setPickupLocation(loc);

      const addr = await reverseGeocode(loc);
      if (addr) setPickupInput(addr);
    } catch (error) {
      Alert.alert('Error', 'Could not get your current location.');
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (loc) => {
    try {
      const results = await Location.reverseGeocodeAsync(loc);
      if (results.length > 0) {
        const a = results[0];
        return `${a.name || ''} ${a.street || ''}, ${a.district || a.city || ''}`.trim();
      }
    } catch (e) {}
    return null;
  };

  const resolveAddressToLocation = async (query) => {
    try {
      const results = await Location.geocodeAsync(query.trim());
      if (!results?.length) return null;
      return { latitude: results[0].latitude, longitude: results[0].longitude };
    } catch (error) { return null; }
  };

  const loadRideTypes = async () => {
    try {
      const response = await api.get('/providers/ride-types');
      setRideTypes(response.data);
      if (response.data.length > 0) setSelectedRideTypeId(response.data[0].id);
    } catch (error) {}
  };

  const compareFares = async () => {
    if (!pickupLocation || !dropLocation) {
      Alert.alert('Missing Location', 'Please set both pickup and drop locations.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/fares/compare-fares', {
        pickup_lat: pickupLocation.latitude,
        pickup_lng: pickupLocation.longitude,
        drop_lat: dropLocation.latitude,
        drop_lng: dropLocation.longitude,
        ride_type_id: selectedRideTypeId,
      });
      navigation.navigate('Results', { fares: response.data.fares, pickup: pickupLocation, drop: dropLocation });
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  const openAddressModal = (target) => {
    setAddressTarget(target);
    setAddressDraft(target === 'pickup' ? pickupInput : dropInput);
    setAddressModalVisible(true);
  };

  const applyAddressFromModal = async () => {
    if (!addressDraft.trim()) return;
    setLoading(true);
    const resolved = await resolveAddressToLocation(addressDraft);
    setLoading(false);
    if (!resolved) {
      Alert.alert('Location Not Found', 'Could not find that address. Please be more specific.');
      return;
    }
    if (addressTarget === 'pickup') {
      setPickupInput(addressDraft);
      setPickupLocation(resolved);
    } else {
      setDropInput(addressDraft);
      setDropLocation(resolved);
    }
    setAddressModalVisible(false);
  };

  // Safe to import MapView here since it won't be used on web anyway
  const MapView = require('react-native-maps').default;
  const Marker = require('react-native-maps').Marker;
  const Polyline = require('react-native-maps').Polyline;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 12.9716, longitude: 77.5946, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
        onPress={(e) => {
          const coord = e.nativeEvent.coordinate;
          if (mapTarget === 'pickup') {
            setPickupLocation(coord);
            reverseGeocode(coord).then(addr => addr && setPickupInput(addr));
          } else {
            setDropLocation(coord);
            reverseGeocode(coord).then(addr => addr && setDropInput(addr));
          }
        }}
      >
        {pickupLocation && <Marker coordinate={pickupLocation} title="Pickup" pinColor="green" />}
        {dropLocation && <Marker coordinate={dropLocation} title="Drop" pinColor="red" />}
        {routeCoords.length > 1 && <Polyline coordinates={routeCoords} strokeColor="#7C4DFF" strokeWidth={4} />}
      </MapView>

      <View style={styles.topControls}>
        <TouchableOpacity style={styles.locationCard} onPress={() => openAddressModal('pickup')}>
           <Icon name="my-location" size={20} color="#06B77D" />
           <Text style={styles.locationCardText} numberOfLines={1}>
             {pickupInput || 'Setting pickup...'}
           </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.locationCard} onPress={() => openAddressModal('drop')}>
           <Icon name="place" size={20} color="#FF3B30" />
           <Text style={styles.locationCardText} numberOfLines={1}>
             {dropInput || 'Where to?'}
           </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.dragHandle} />
        <Text style={styles.sheetTitle}>Choose Ride Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rideTypesRow}>
          {rideTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[styles.typeBtn, selectedRideTypeId === type.id && styles.typeBtnActive]}
              onPress={() => setSelectedRideTypeId(type.id)}
            >
              <Icon name={type.icon || 'directions-car'} size={20} color={selectedRideTypeId === type.id ? '#fff' : '#9FB0D1'} style={{ marginRight: 8 }} />
              <Text style={[styles.typeBtnText, selectedRideTypeId === type.id && styles.typeBtnTextActive]}>{type.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={[styles.mainBtn, (!pickupLocation || !dropLocation) && styles.mainBtnDisabled]} onPress={compareFares} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <><Text style={styles.mainBtnText}>Compare Fares</Text><Icon name="chevron-right" size={24} color="#fff" /></>}
        </TouchableOpacity>
        <View style={styles.mapToolRow}>
           <TouchableOpacity style={[styles.toolBtn, mapTarget === 'pickup' && styles.toolBtnActive]} onPress={() => setMapTarget('pickup')}>
              <Icon name="add-location" size={18} color={mapTarget === 'pickup' ? '#fff' : '#9FB0D1'} />
              <Text style={[styles.toolBtnText, mapTarget === 'pickup' && styles.toolBtnTextActive]}>Pick Map</Text>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.toolBtn, mapTarget === 'drop' && styles.toolBtnActive]} onPress={() => setMapTarget('drop')}>
              <Icon name="edit-location" size={18} color={mapTarget === 'drop' ? '#fff' : '#9FB0D1'} />
              <Text style={[styles.toolBtnText, mapTarget === 'drop' && styles.toolBtnTextActive]}>Drop Map</Text>
           </TouchableOpacity>
        </View>
      </View>

      <Modal visible={addressModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContent}>
             <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>{addressTarget === 'pickup' ? 'Enter Pickup' : 'Enter Destination'}</Text>
               <TouchableOpacity onPress={() => setAddressModalVisible(false)}><Icon name="close" size={24} color="#EAF1FF" /></TouchableOpacity>
             </View>
             <TextInput style={styles.addressInput} placeholder="Type address or landmark..." placeholderTextColor="#5C6E91" value={addressDraft} onChangeText={setAddressDraft} autoFocus />
             {addressTarget === 'pickup' && (
               <TouchableOpacity style={styles.currentLocBtn} onPress={() => { useCurrentLocationAsPickup(); setAddressModalVisible(false); }}>
                  <Icon name="gps-fixed" size={18} color="#7C4DFF" />
                  <Text style={styles.currentLocText}>Use My Current Location</Text>
               </TouchableOpacity>
             )}
             <TouchableOpacity style={styles.applyBtn} onPress={applyAddressFromModal}><Text style={styles.applyBtnText}>Set Location</Text></TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090F1D' },
  map: { flex: 1 },
  topControls: { position: 'absolute', top: 50, left: 16, right: 16, backgroundColor: 'rgba(16, 26, 46, 0.95)', borderRadius: 20, padding: 12, borderWidth: 1, borderColor: '#1F2D49', gap: 8 },
  locationCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0B1427', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#26395E' },
  locationCardText: { color: '#EAF1FF', marginLeft: 10, fontSize: 15, flex: 1 },
  bottomSheet: { backgroundColor: '#101A2E', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingTop: 12, borderTopWidth: 1, borderColor: '#1F2D49' },
  dragHandle: { width: 40, height: 4, backgroundColor: '#1F2D49', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { color: '#EAF1FF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  rideTypesRow: { marginBottom: 20 },
  typeBtn: { flexDirection: 'row', backgroundColor: '#0B1427', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#26395E', alignItems: 'center' },
  typeBtnActive: { backgroundColor: '#7C4DFF', borderColor: '#7C4DFF' },
  typeBtnText: { color: '#9FB0D1', fontWeight: 'bold' },
  typeBtnTextActive: { color: '#fff' },
  mainBtn: { backgroundColor: '#06B77D', flexDirection: 'row', padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 10 },
  mainBtnDisabled: { backgroundColor: '#1F2D49', opacity: 0.6 },
  mainBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  mapToolRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 12 },
  toolBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', padding: 8, borderRadius: 8, gap: 6 },
  toolBtnActive: { backgroundColor: '#1F2D49' },
  toolBtnText: { color: '#9FB0D1', fontSize: 12, fontWeight: '600' },
  toolBtnTextActive: { color: '#fff' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#101A2E', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#1F2D49' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#EAF1FF', fontSize: 20, fontWeight: 'bold' },
  addressInput: { backgroundColor: '#0B1427', borderWidth: 1, borderColor: '#26395E', color: '#EAF1FF', borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 16 },
  currentLocBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, padding: 10 },
  currentLocText: { color: '#7C4DFF', marginLeft: 10, fontWeight: 'bold', fontSize: 15 },
  applyBtn: { backgroundColor: '#7C4DFF', padding: 16, borderRadius: 12, alignItems: 'center' },
  applyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default HomeScreen;
