import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { getUserListings } from '../services/database';
import { useAuth } from '../context/AuthContext';

type MyListingsNavigationProp = StackNavigationProp<RootStackParamList, 'MyListings'>;

const MyListingsScreen = () => {
  const navigation = useNavigation<MyListingsNavigationProp>();
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserListings();
    }
  }, [user]);

  const fetchUserListings = async () => {
    try {
      setLoading(true);
      const userListings = await getUserListings(user!.id);
      setListings(userListings);
    } catch (error) {
      console.error('Error fetching user listings:', error);
      Alert.alert('Error', 'Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    return status === 'completed'
      ? styles.statusComplete
      : styles.statusPending;
  };

  const getStatusText = (status: string) => {
    return status === 'completed' ? 'Active' : 'Payment Pending';
  };

  const renderListingItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => navigation.navigate('VehicleDetails', { id: item.id })}
    >
      <Image
        source={{ uri: item.images[0] || 'https://via.placeholder.com/300x150?text=No+Image' }}
        style={styles.listingImage}
        resizeMode="cover"
      />
      <View style={styles.listingContent}>
        <View style={styles.listingHeader}>
          <Text style={styles.listingTitle} numberOfLines={1}>
            {item.year} Tesla {item.model} {item.trim}
          </Text>
          <View style={[styles.statusBadge, getStatusStyle(item.payment_status)]}>
            <Text style={styles.statusText}>
              {getStatusText(item.payment_status)}
            </Text>
          </View>
        </View>
        <Text style={styles.listingPrice}>${item.price.toLocaleString()}</Text>
        <Text style={styles.listingLocation} numberOfLines={1}>
          {item.location.city}, {item.location.state}
        </Text>
        <View style={styles.listingFooter}>
          <Text style={styles.listingDate}>
            Listed: {new Date(item.created_at).toLocaleDateString()}
          </Text>
          {item.payment_status === 'pending' && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => navigation.navigate('Payment', { listingId: item.id })}
            >
              <Text style={styles.completeButtonText}>Complete Payment</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Listings</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E82127" />
          <Text style={styles.loadingText}>Loading your listings...</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listingsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="car-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>You don't have any listings yet</Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('CreateListing')}
              >
                <Text style={styles.createButtonText}>Create a Listing</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateListing')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
  listingsList: {
    padding: 16,
    paddingBottom: 80, // Extra padding for the floating button
  },
  listingCard: {
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
  listingImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#eee',
  },
  listingContent: {
    padding: 16,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusComplete: {
    backgroundColor: '#e0f7e0',
  },
  statusPending: {
    backgroundColor: '#fff0e0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E82127',
    marginBottom: 4,
  },
  listingLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingDate: {
    fontSize: 12,
    color: '#999',
  },
  completeButton: {
    backgroundColor: '#E82127',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
    marginBottom: 24,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#E82127',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default MyListingsScreen;