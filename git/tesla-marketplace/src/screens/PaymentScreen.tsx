import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { getListing, updateListingPaymentStatus } from '../services/database';
import { createPaymentIntent } from '../services/stripe';
import { useStripe } from '@stripe/stripe-react-native';

type PaymentScreenRouteProp = RouteProp<RootStackParamList, 'Payment'>;
type PaymentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Payment'>;

const PaymentScreen = () => {
  const route = useRoute<PaymentScreenRouteProp>();
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const { listingId } = route.params;
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [listingDetails, setListingDetails] = useState<any>(null);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    fetchListingDetails();
  }, [listingId]);

  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      const listing = await getListing(listingId);
      setListingDetails(listing);
    } catch (error) {
      console.error('Error fetching listing details:', error);
      Alert.alert('Error', 'Could not fetch listing details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);

      // In a real app, you would call your backend to create a payment intent
      // For now, we'll use our mock function
      const { clientSecret } = await createPaymentIntent(10000); // $100.00

      // Initialize the payment sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Tesla Marketplace',
      });

      if (initError) {
        console.error('Error initializing payment sheet:', initError);
        Alert.alert('Error', 'Could not initialize payment. Please try again.');
        setProcessing(false);
        return;
      }

      // Present the payment sheet to the user
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        console.error('Error presenting payment sheet:', presentError);
        
        if (presentError.code === 'Canceled') {
          // User canceled the payment - no alert needed
          setProcessing(false);
          return;
        }
        
        Alert.alert('Error', presentError.message || 'Payment failed. Please try again.');
        setProcessing(false);
        return;
      }

      // If we reached here, the payment was successful
      // Update the listing payment status
      await updateListingPaymentStatus(listingId, 'completed');
      
      // Show success message and navigate back to home
      Alert.alert(
        'Payment Successful',
        'Your listing has been created successfully!',
        [
          {
            text: 'View My Listings',
            onPress: () => navigation.navigate('MyListings'),
          },
          {
            text: 'Return to Home',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Error', 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E82127" />
        <Text style={styles.loadingText}>Loading payment details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Listing Fee</Text>
          <View style={styles.divider} />

          {listingDetails && (
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleTitle}>
                {listingDetails.year} Tesla {listingDetails.model} {listingDetails.trim}
              </Text>
              <Text style={styles.vehiclePrice}>${listingDetails.price.toLocaleString()}</Text>
            </View>
          )}

          <View style={styles.feeSection}>
            <Text style={styles.feeTitle}>One-time listing fee</Text>
            <Text style={styles.feeAmount}>$100.00</Text>
          </View>

          <View style={styles.totalSection}>
            <Text style={styles.totalTitle}>Total</Text>
            <Text style={styles.totalAmount}>$100.00</Text>
          </View>
        </View>

        <View style={styles.paymentInfo}>
          <Ionicons name="lock-closed" size={24} color="#666" style={styles.securityIcon} />
          <Text style={styles.securityText}>
            Secure payment processed by Stripe. Your payment information is never stored.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay $100.00</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={processing}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  content: {
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 16,
  },
  vehicleInfo: {
    marginBottom: 20,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  vehiclePrice: {
    fontSize: 16,
    color: '#666',
  },
  feeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feeTitle: {
    fontSize: 16,
    color: '#333',
  },
  feeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E82127',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#e8f4f8',
    padding: 16,
    borderRadius: 8,
  },
  securityIcon: {
    marginRight: 12,
  },
  securityText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  payButton: {
    backgroundColor: '#E82127',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default PaymentScreen;