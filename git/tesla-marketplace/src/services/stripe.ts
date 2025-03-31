import { initStripe } from '@stripe/stripe-react-native';

// Replace with your Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51R8qWxRECoKNDSva7rpJSYKFuGylizCOVYpDsjWAeXmOi9xkXiOxNuSKRMl0o96hDcLL3VFyPpXZaItFKD6Srjm5007nLV7M5J';

export const initializeStripe = async () => {
  return await initStripe({
    publishableKey: STRIPE_PUBLISHABLE_KEY,
    merchantIdentifier: 'merchant.com.tesla.marketplace', // Only needed for Apple Pay
  });
};

// Function to create a payment sheet for a one-time listing fee
export const createPaymentSheet = async (amount: number = 10000) => {
  try {
    // This would normally call your backend to create a payment intent
    // For now, we'll mock the response
    const paymentIntent = {
      clientSecret: 'mock_client_secret',
      // In a real app, you would get this from your backend
    };

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment sheet:', error);
    throw error;
  }
};

// In a real app, you would implement these functions to call your backend
export const createPaymentIntent = async (amount: number) => {
  // This would call your Supabase Edge Function to create a payment intent
  // For now, we'll return a mock response
  return {
    clientSecret: 'mock_client_secret',
  };
};
