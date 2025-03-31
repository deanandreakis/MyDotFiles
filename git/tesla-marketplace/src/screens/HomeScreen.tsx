import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  RefreshControl,
  TextInput,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { fetchTeslaVehicles, TeslaVehicle } from '../services/autoApi';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { initializeStripe } from '../services/stripe';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState<TeslaVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVehicles, setFilteredVehicles] = useState<TeslaVehicle[]>([]);

  useEffect(() => {
    // Initialize Stripe when the app loads
    initializeStripe().catch(error => {
      console.error('Failed to initialize Stripe:', error);
    });

    // Load vehicles
    loadVehicles();
  }, []);

  useEffect(() => {
    // Filter vehicles based on search query
    if (searchQuery.trim() === '') {
      setFilteredVehicles(vehicles);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = vehicles.filter(
        vehicle =>
          vehicle.model.toLowerCase().includes(query) ||
          vehicle.year.toString().includes(query) ||
          vehicle.trim.toLowerCase().includes(query) ||
          vehicle.location.city.toLowerCase().includes(query) ||
          vehicle.location.state.toLowerCase().includes(query)
      );
      setFilteredVehicles(filtered);
    }
  }, [searchQuery, vehicles]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const result = await fetchTeslaVehicles({});
      setVehicles(result.vehicles);
      setFilteredVehicles(result.vehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadVehicles();
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  const renderVehicleItem = ({ item }: { item: TeslaVehicle }) => (
    <TouchableOpacity
      style={styles.vehicleCard}
      onPress={() => navigation.navigate('VehicleDetails', { id: item.id })}
    >
      <Image
        source={{ uri: item.images[0] || 'https://via.placeholder.com/300x200?text=No+Image' }}
        style={styles.vehicleImage}
        resizeMode="cover"
      />
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleTitle}>{item.year} Tesla {item.model} {item.trim}</Text>
        <Text style={styles.vehiclePrice}>{formatPrice(item.price)}</Text>
        <Text style={styles.vehicleMileage}>{item.mileage.toLocaleString()} miles</Text>
        <Text style={styles.vehicleLocation}>
          {item.location.city}, {item.location.state}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tesla Marketplace</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => navigation.navigate('MyListings')} style={styles.iconButton}>
            <Ionicons name="list" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconButton}>
            <Ionicons name="person" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for Tesla models..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E82127" />
          <Text style={styles.loadingText}>Loading Tesla vehicles...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredVehicles}
            renderItem={renderVehicleItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.vehicleList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#E82127']} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="car-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>No Tesla vehicles found</Text>
                <Text style={styles.emptySubtext}>
                  {searchQuery ? 'Try a different search' : 'Pull down to refresh'}
                </Text>
              </View>
            }
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateListing')}
          >
            <Ionicons name="add" size={30} color="#fff" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  vehicleList: {
    padding: 16,
    paddingBottom: 80, // Extra padding for the floating button
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vehicleImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
  },
  vehicleInfo: {
    padding: 16,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  vehiclePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E82127',
    marginBottom: 8,
  },
  vehicleMileage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  vehicleLocation: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E82127',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default HomeScreen;