// Replace with your Auto.dev API key
const API_KEY = 'ZrQEPSkKZGVhbkBkZWFud2FyZS5jb20=';
const BASE_URL = 'https://auto.dev/api';

// Types for Tesla vehicle data
export interface TeslaVehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  price: number;
  mileage: number;
  images: string[];
  exteriorColor: string;
  interiorColor: string;
  vin: string;
  description: string;
  location: {
    city: string;
    state: string;
    zip: string;
  };
  sellerType: 'private' | 'dealer';
  contactInfo: {
    name: string;
    phone?: string;
    email: string;
  };
  listedDate: string;
  features: string[];
}

// Function to fetch Tesla vehicles from auto.dev API
export const fetchTeslaVehicles = async (params: {
  zip?: string;
  radius?: number;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  page?: number;
  limit?: number;
}): Promise<{ vehicles: TeslaVehicle[]; totalCount: number }> => {
  try {
    // In a real app, this would make an API request to auto.dev
    // For now, we'll return mock data

    // Mock response for development
    const mockVehicles: TeslaVehicle[] = [
      {
        id: '1',
        year: 2022,
        make: 'Tesla',
        model: 'Model 3',
        trim: 'Long Range',
        price: 45000,
        mileage: 15000,
        images: ['https://example.com/tesla1.jpg'],
        exteriorColor: 'Red',
        interiorColor: 'Black',
        vin: 'ABC123XYZ456789',
        description: 'Excellent condition Tesla Model 3 with Full Self-Driving package.',
        location: {
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
        },
        sellerType: 'private',
        contactInfo: {
          name: 'John Doe',
          phone: '555-123-4567',
          email: 'john@example.com',
        },
        listedDate: '2023-03-15',
        features: ['Autopilot', 'Premium Sound', 'Heated Seats'],
      },
      {
        id: '2',
        year: 2021,
        make: 'Tesla',
        model: 'Model Y',
        trim: 'Performance',
        price: 58000,
        mileage: 22000,
        images: ['https://example.com/tesla2.jpg'],
        exteriorColor: 'White',
        interiorColor: 'White',
        vin: 'DEF456UVW789012',
        description: 'Performance Model Y with all options included.',
        location: {
          city: 'Los Angeles',
          state: 'CA',
          zip: '90001',
        },
        sellerType: 'private',
        contactInfo: {
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
        listedDate: '2023-03-10',
        features: ['Performance Boost', 'Tow Hitch', 'White Interior'],
      },
    ];

    return { vehicles: mockVehicles, totalCount: 2 };
  } catch (error) {
    console.error('Error fetching Tesla vehicles:', error);
    throw error;
  }
};

// In a real app, you would implement an API call to your Supabase Edge Function
// that would then call the auto.dev API with your API key
export const fetchVehicleDetails = async (id: string): Promise<TeslaVehicle> => {
  // Mock implementation for development
  const mockVehicles = (await fetchTeslaVehicles({})).vehicles;
  const vehicle = mockVehicles.find(v => v.id === id);

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  return vehicle;
};
