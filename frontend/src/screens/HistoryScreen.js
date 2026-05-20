import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Image } from 'react-native';
import useAuthStore from '../stores/authStore';
import api from '../services/api';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { getProviderLogo } from '../services/imageAssetManager';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await api.get('/fares/search-history?limit=20');
      setHistory(response.data);
    } catch (error) {
      console.error('History load error', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshHistory = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const renderHistoryItem = ({ item }) => {
    const date = new Date(item.created_at);
    const formattedDate = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

    return (
      <View style={styles.item}>
        <View style={styles.leftSection}>
           {getProviderLogo(item.cheapest_provider_logo) ? (
             <Image source={getProviderLogo(item.cheapest_provider_logo)} style={styles.historyLogo} resizeMode="contain" />
           ) : (
             <View style={styles.iconCircle}><Icon name="history" size={20} color="#7C4DFF" /></View>
           )}
           <View style={styles.info}>
             <Text style={styles.date}>{formattedDate} • {item.ride_type}</Text>
             <Text style={styles.distance}>{item.distance_km?.toFixed(1) || 0} km • {item.duration_min || 0} min</Text>
           </View>
        </View>
        <View style={styles.rightSection}>
           <Text style={styles.price}>₹{item.cheapest_fare}</Text>
           <Text style={styles.options}>{item.options_count} apps</Text>
        </View>
      </View>
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color="#7C4DFF" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Savings</Text>
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshHistory} tintColor="#7C4DFF" />}
        ListEmptyComponent={<Text style={styles.empty}>No searches yet. Find a ride!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090F1D' },
  title: { color: '#EAF1FF', fontSize: 28, fontWeight: 'bold', margin: 20 },
  list: { paddingHorizontal: 16 },
  item: {
    backgroundColor: '#101A2E',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1F2D49'
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  historyLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#1F2D49'
  },
  iconCircle: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1F2D49', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  info: { gap: 2 },
  date: { color: '#EAF1FF', fontWeight: 'bold', fontSize: 15 },
  distance: { color: '#9FB0D1', fontSize: 12 },
  rightSection: { alignItems: 'flex-end' },
  price: { color: '#06B77D', fontSize: 18, fontWeight: 'bold' },
  options: { color: '#5C6E91', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#090F1D' },
  empty: { color: '#9FB0D1', textAlign: 'center', marginTop: 40 }
});

export default HistoryScreen;
