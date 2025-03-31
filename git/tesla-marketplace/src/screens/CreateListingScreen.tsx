import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { createListing } from '../services/database';
import { useAuth } from '../context/AuthContext';

type CreateListingNavigationProp = StackNavigationProp<RootStackParamList, 'CreateListing'>;

// Validation schema
const ListingSchema = Yup.object().shape({
  model: Yup.string()
    .required('Model is required')
    .oneOf(['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck'], 'Please select a valid Tesla model'),
  year: Yup.number()
    .required('Year is required')
    .min(2000, 'Year must be 2000 or later')
    .max(new Date().getFullYear() + 1, `Year cannot be later than ${new Date().getFullYear() + 1}`),
  trim: Yup.string().required('Trim is required'),
  price: Yup.number().required('Price is required').min(1, 'Price must be greater than 0'),
  mileage: Yup.number().required('Mileage is required').min(0, 'Mileage must be positive'),
  exteriorColor: Yup.string().required('Exterior color is required'),
  interiorColor: Yup.string().required('Interior color is required'),
  description: Yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zip: Yup.string().required('ZIP code is required').matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  features: Yup.string(),
});

const CreateListingScreen = () => {
  const navigation = useNavigation<CreateListingNavigationProp>();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateListing = async (values: any) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a listing');
      return;
    }

    try {
      setIsSubmitting(true);

      // Format features as an array from comma-separated string
      const featuresArray = values.features
        ? values.features.split(',').map((feature: string) => feature.trim())
        : [];

      // Create listing object
      const listingData = {
        make: 'Tesla',
        model: values.model,
        year: parseInt(values.year),
        trim: values.trim,
        price: parseInt(values.price),
        mileage: parseInt(values.mileage),
        exteriorColor: values.exteriorColor,
        interiorColor: values.interiorColor,
        description: values.description,
        location: {
          city: values.city,
          state: values.state,
          zip: values.zip,
        },
        features: featuresArray,
        images: ['https://via.placeholder.com/800x500?text=No+Image+Uploaded'], // Placeholder image
        vin: 'pending', // In a real app, this would be validated
        sellerType: 'private',
        contactInfo: {
          name: user.email?.split('@')[0] || 'Tesla Owner', // Use part of email as name
          email: user.email || '',
        },
      };

      const listing = await createListing(listingData, user.id);
      
      // Navigate to payment screen with the listing ID
      navigation.navigate('Payment', { listingId: listing.id });
    } catch (error) {
      console.error('Error creating listing:', error);
      Alert.alert('Error', 'Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create a Listing</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.subtitle}>
          List your Tesla for a one-time fee of $100
        </Text>

        <Formik
          initialValues={{
            model: '',
            year: '',
            trim: '',
            price: '',
            mileage: '',
            exteriorColor: '',
            interiorColor: '',
            description: '',
            city: '',
            state: '',
            zip: '',
            features: '',
          }}
          validationSchema={ListingSchema}
          onSubmit={handleCreateListing}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Vehicle Information</Text>

              {/* Model */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Tesla Model*</Text>
                <View style={styles.pickerContainer}>
                  {['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck'].map((model) => (
                    <TouchableOpacity
                      key={model}
                      style={[
                        styles.modelOption,
                        values.model === model && styles.modelOptionSelected,
                      ]}
                      onPress={() => setFieldValue('model', model)}
                    >
                      <Text
                        style={[
                          styles.modelOptionText,
                          values.model === model && styles.modelOptionTextSelected,
                        ]}
                      >
                        {model}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {touched.model && errors.model && (
                  <Text style={styles.errorText}>{errors.model}</Text>
                )}
              </View>

              {/* Year */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Year*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 2022"
                  value={values.year}
                  onChangeText={handleChange('year')}
                  onBlur={handleBlur('year')}
                  keyboardType="number-pad"
                />
                {touched.year && errors.year && (
                  <Text style={styles.errorText}>{errors.year}</Text>
                )}
              </View>

              {/* Trim */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Trim*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Long Range, Performance"
                  value={values.trim}
                  onChangeText={handleChange('trim')}
                  onBlur={handleBlur('trim')}
                />
                {touched.trim && errors.trim && (
                  <Text style={styles.errorText}>{errors.trim}</Text>
                )}
              </View>

              {/* Price */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Price (USD)*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 45000"
                  value={values.price}
                  onChangeText={handleChange('price')}
                  onBlur={handleBlur('price')}
                  keyboardType="number-pad"
                />
                {touched.price && errors.price && (
                  <Text style={styles.errorText}>{errors.price}</Text>
                )}
              </View>

              {/* Mileage */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mileage*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 15000"
                  value={values.mileage}
                  onChangeText={handleChange('mileage')}
                  onBlur={handleBlur('mileage')}
                  keyboardType="number-pad"
                />
                {touched.mileage && errors.mileage && (
                  <Text style={styles.errorText}>{errors.mileage}</Text>
                )}
              </View>

              {/* Colors */}
              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Exterior Color*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Red"
                    value={values.exteriorColor}
                    onChangeText={handleChange('exteriorColor')}
                    onBlur={handleBlur('exteriorColor')}
                  />
                  {touched.exteriorColor && errors.exteriorColor && (
                    <Text style={styles.errorText}>{errors.exteriorColor}</Text>
                  )}
                </View>

                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Interior Color*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Black"
                    value={values.interiorColor}
                    onChangeText={handleChange('interiorColor')}
                    onBlur={handleBlur('interiorColor')}
                  />
                  {touched.interiorColor && errors.interiorColor && (
                    <Text style={styles.errorText}>{errors.interiorColor}</Text>
                  )}
                </View>
              </View>

              {/* Description */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Description*</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your vehicle, including condition and any notable features"
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
                {touched.description && errors.description && (
                  <Text style={styles.errorText}>{errors.description}</Text>
                )}
              </View>

              <Text style={styles.sectionTitle}>Location</Text>

              {/* City */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>City*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. San Francisco"
                  value={values.city}
                  onChangeText={handleChange('city')}
                  onBlur={handleBlur('city')}
                />
                {touched.city && errors.city && (
                  <Text style={styles.errorText}>{errors.city}</Text>
                )}
              </View>

              {/* State and ZIP */}
              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>State*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. CA"
                    value={values.state}
                    onChangeText={handleChange('state')}
                    onBlur={handleBlur('state')}
                  />
                  {touched.state && errors.state && (
                    <Text style={styles.errorText}>{errors.state}</Text>
                  )}
                </View>

                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>ZIP Code*</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 94105"
                    value={values.zip}
                    onChangeText={handleChange('zip')}
                    onBlur={handleBlur('zip')}
                    keyboardType="number-pad"
                  />
                  {touched.zip && errors.zip && (
                    <Text style={styles.errorText}>{errors.zip}</Text>
                  )}
                </View>
              </View>

              {/* Features */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Features (comma-separated)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Autopilot, Premium Sound, Heated Seats"
                  value={values.features}
                  onChangeText={handleChange('features')}
                  onBlur={handleBlur('features')}
                />
                {touched.features && errors.features && (
                  <Text style={styles.errorText}>{errors.features}</Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Continue to Payment</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 100,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  modelOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    margin: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  modelOptionSelected: {
    borderColor: '#E82127',
    backgroundColor: 'rgba(232, 33, 39, 0.1)',
  },
  modelOptionText: {
    color: '#666',
  },
  modelOptionTextSelected: {
    color: '#E82127',
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#E82127',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateListingScreen;