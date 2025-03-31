import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { fetchVehicleDetails, TeslaVehicle } from '../services/autoApi';
import { Ionicons } from '@expo/vector-icons';

type VehicleDetailsRouteProp = RouteProp<RootStackParamList, 'VehicleDetails'>;
type VehicleDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'VehicleDetails'>;

const { width } = Dimensions.get('window');

const VehicleDetailsScreen = () => {
  const route = useRoute<VehicleDetailsRouteProp>();
  const navigation = useNavigation<VehicleDetailsNavigationProp>();
  const { id } = route.params;
  const [vehicle, setVehicle] = useState<TeslaVehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadVehicleDetails();
  }, [id]);

  const loadVehicleDetails = async () => {
    try {
      setLoading(true);
      const vehicleDetails = await fetchVehicleDetails(id);
      setVehicle(vehicleDetails);
    } catch (error) {
      console.error('Error loading vehicle details:', error);
      Alert.alert('Error', 'Failed to load vehicle details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = () => {
    if (!vehicle) return;

    // Open email app if email is available
    if (vehicle.contactInfo.email) {
      const subject = `Inquiry about ${vehicle.year} Tesla ${vehicle.model} ${vehicle.trim}`;
      const body = `Hi ${vehicle.contactInfo.name},\n\nI'm interested in your Tesla ${vehicle.model} listed for $${vehicle.price}. Could you provide more information?\n\nThanks!`;
      Linking.openURL(`mailto:${vehicle.contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
    
    // Open phone app if phone is available
    else if (vehicle.contactInfo.phone) {
      Linking.openURL(`tel:${vehicle.contactInfo.phone}`);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E82127" />
        <Text style={styles.loadingText}>Loading vehicle details...</Text>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#E82127" />
        <Text style={styles.errorText}>Vehicle not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButtonOverlay}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Image gallery */}
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(newIndex);
          }}
        >
          {vehicle.images.length > 0 ? (
            vehicle.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.vehicleImage}
                resizeMode="cover"
              />
            ))
          ) : (
            <Image
              source={{ uri: 'https://via.placeholder.com/800x500?text=No+Images+Available' }}
              style={styles.vehicleImage}
              resizeMode="cover"
            />
          )}
        </ScrollView>

        {/* Image indicator dots */}
        {vehicle.images.length > 1 && (
          <View style={styles.imageDots}>
            {vehicle.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.imageDot,
                  index === currentImageIndex && styles.imageDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.detailsContainer}>
        {/* Basic info */}
        <Text style={styles.vehicleTitle}>
          {vehicle.year} Tesla {vehicle.model} {vehicle.trim}
        </Text>
        <Text style={styles.vehiclePrice}>{formatPrice(vehicle.price)}</Text>

        {/* Specs */}
        <View style={styles.specsContainer}>
          <View style={styles.specItem}>
            <Ionicons name="speedometer-outline" size={24} color="#666" />
            <Text style={styles.specText}>{vehicle.mileage.toLocaleString()} miles</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="color-palette-outline" size={24} color="#666" />
            <Text style={styles.specText}>{vehicle.exteriorColor}</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="car-outline" size={24} color="#666" />
            <Text style={styles.specText}>{vehicle.interiorColor} interior</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{vehicle.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.locationText}>
            {vehicle.location.city}, {vehicle.location.state} {vehicle.location.zip}
          </Text>
        </View>

        {/* Features */}
        {vehicle.features && vehicle.features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              {vehicle.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#E82127" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Seller info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller Information</Text>
          <View style={styles.sellerInfo}>
            <View style={styles.sellerDetail}>
              <Text style={styles.sellerLabel}>Name:</Text>
              <Text style={styles.sellerValue}>{vehicle.contactInfo.name}</Text>
            </View>
            <View style={styles.sellerDetail}>
              <Text style={styles.sellerLabel}>Type:</Text>
              <Text style={styles.sellerValue}>
                {vehicle.sellerType === 'private' ? 'Private Seller' : 'Dealer'}
              </Text>
            </View>
            <View style={styles.sellerDetail}>
              <Text style={styles.sellerLabel}>Listed on:</Text>
              <Text style={styles.sellerValue}>
                {new Date(vehicle.listedDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact button */}
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactSeller}
        >
          <Text style={styles.contactButtonText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#E82127',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButtonOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 300,
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  vehicleImage: {
    width,
    height: 300,
  },
  imageDots: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  imageDotActive: {
    backgroundColor: '#fff',
  },
  detailsContainer: {
    padding: 20,
  },
  vehicleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  vehiclePrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E82127',
    marginBottom: 16,
  },
  specsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  specItem: {
    alignItems: 'center',
  },
  specText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  locationText: {
    fontSize: 16,
    color: '#666',
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  sellerInfo: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  sellerDetail: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sellerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: 80,
  },
  sellerValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  contactButton: {
    backgroundColor: '#E82127',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default VehicleDetailsScreen;