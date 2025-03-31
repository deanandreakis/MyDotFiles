# Tesla Marketplace

A mobile app for buying and selling Tesla vehicles.

## Features

- Browse Tesla vehicles listed for sale
- Create your own listings for a one-time fee ($100)
- Secure payment processing with Stripe
- User authentication with Supabase
- Direct contact with sellers
- Filter and search for specific Tesla models

## Tech Stack

- React Native / Expo
- TypeScript
- Supabase (Authentication & Database)
- Stripe (Payment Processing)
- Auto.dev API Integration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tesla-marketplace.git
cd tesla-marketplace
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Replace the API keys in the service files:
     - src/services/supabase.ts
     - src/services/stripe.ts
     - src/services/autoApi.ts

4. Start the development server:
```bash
npx expo start
```

## Running the App

In the output, you'll find options to open the app in a:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Project Structure

```
/src
  /components  - Reusable UI components
  /screens     - Screen components
  /navigation  - Navigation configuration
  /services    - API and third-party services
  /context     - Context providers
  /hooks       - Custom hooks
  /utils       - Utility functions
  /types       - TypeScript type definitions
/assets        - Images and other static assets
```

## Deployment

Instructions for deploying to app stores:

1. Configure app.json with your app details
2. Build for iOS:
```bash
eas build --platform ios
```

3. Build for Android:
```bash
eas build --platform android
```

## Supabase Setup

To set up the database in Supabase:

1. Create a new Supabase project
2. Set up the following table:

```sql
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL,
  year INTEGER NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT NOT NULL,
  price INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  images TEXT[] NOT NULL,
  exterior_color TEXT NOT NULL,
  interior_color TEXT NOT NULL,
  vin TEXT NOT NULL,
  description TEXT NOT NULL,
  location JSONB NOT NULL,
  seller_type TEXT NOT NULL,
  contact_info JSONB NOT NULL,
  features TEXT[],
  payment_status TEXT NOT NULL DEFAULT 'pending'
);

-- Create a Row Level Security policy
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read all completed listings
CREATE POLICY "Public listings are viewable by everyone" 
ON listings FOR SELECT 
USING (payment_status = 'completed');

-- Create policy to allow users to view their own listings
CREATE POLICY "Users can view their own listings" 
ON listings FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own listings
CREATE POLICY "Users can create their own listings" 
ON listings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own listings
CREATE POLICY "Users can update their own listings" 
ON listings FOR UPDATE 
USING (auth.uid() = user_id);
```

## Edge Functions

Create an edge function for handling Stripe payment intents:

```ts
// stripe-payment-intent.ts
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'
import Stripe from 'https://esm.sh/stripe@10.13.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-08-01',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount } = await req.json()
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Supabase Documentation](https://supabase.io/docs)
- [Stripe React Native](https://github.com/stripe/stripe-react-native)

## License

Distributed under the MIT License.
