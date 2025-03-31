import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import AppNavigator from './src/navigation/AppNavigator';

// Replace with your Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'YOUR_STRIPE_PUBLISHABLE_KEY';

export default function App() {
  return (
    <SafeAreaProvider>
      <StripeProvider
        publishableKey={STRIPE_PUBLISHABLE_KEY}
        merchantIdentifier="merchant.com.tesla.marketplace" // Required for Apple Pay
      >
        <AppNavigator />
      </StripeProvider>
    </SafeAreaProvider>
  );
}