import { supabase } from './supabase';
import { TeslaVehicle } from './autoApi';

// Interface for user listings
export interface Listing extends TeslaVehicle {
  id: string;
  user_id: string;
  created_at: string;
  payment_status: 'pending' | 'completed';
}

// Function to create a new listing
export const createListing = async (
  listing: Omit<TeslaVehicle, 'id' | 'listedDate'>,
  userId: string
): Promise<Listing> => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .insert([
        {
          ...listing,
          user_id: userId,
          payment_status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Listing;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

// Function to update a listing's payment status
export const updateListingPaymentStatus = async (
  listingId: string,
  paymentStatus: 'pending' | 'completed'
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('listings')
      .update({ payment_status: paymentStatus })
      .eq('id', listingId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating listing payment status:', error);
    throw error;
  }
};

// Function to get all user listings
export const getUserListings = async (userId: string): Promise<Listing[]> => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Listing[];
  } catch (error) {
    console.error('Error fetching user listings:', error);
    throw error;
  }
};

// Function to get all listings
export const getAllListings = async (): Promise<Listing[]> => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('payment_status', 'completed')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Listing[];
  } catch (error) {
    console.error('Error fetching all listings:', error);
    throw error;
  }
};

// Function to get a single listing
export const getListing = async (listingId: string): Promise<Listing> => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (error) throw error;
    return data as Listing;
  } catch (error) {
    console.error('Error fetching listing:', error);
    throw error;
  }
};