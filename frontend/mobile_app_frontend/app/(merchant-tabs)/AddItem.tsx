import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const AddItem: React.FC = () => {
  const router = useRouter();

  const [name, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [count, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImageUri] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = 'http://localhost:8080';

  const validateField = (field: string, value: string) => {
    let error = '';
    if (!value.trim()) {
      error = 'This field is required.';
    } else if (field === 'name' && value.trim().length < 3) {
      error = 'Item name must be at least 3 characters long.';
    } else if (field === 'price' && (isNaN(Number(value)) || Number(value) <= 0)) {
      error = 'Please enter a valid positive price.';
    } else if (field === 'count' && (isNaN(Number(value)) || Number(value) <= 0)) {
      error = 'Please enter a valid positive quantity.';
    } else if (field === 'description' && value.trim().length < 10) {
      error = 'Description must be at least 10 characters long.';
    } else if (field === 'image' && !value) {
      error = 'Please add an image for the item.';
    }
    return error;
  };

  const handleChange = (field: string, value: string) => {
    let processedValue = value;
    if (field === 'price' || field === 'count') {
      processedValue = value.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal points
    }

    if (field === 'name') setItemName(processedValue);
    if (field === 'price') setPrice(processedValue);
    if (field === 'count') setQuantity(processedValue);
    if (field === 'description') setDescription(processedValue);

    const error = validateField(field, processedValue);
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const handleImageChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageUri(result.assets[0].base64);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors['image'];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const formErrors: { [key: string]: string } = {};
    formErrors.name = validateField('name', name);
    formErrors.price = validateField('price', price);
    formErrors.count = validateField('count', count);
    formErrors.description = validateField('description', description);
    formErrors.image = validateField('image', image);

    const validErrors = Object.entries(formErrors)
      .filter(([_, value]) => value)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    setErrors(validErrors);
    return Object.keys(validErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      let decodedToken: any;
      try {
        decodedToken = jwtDecode(token);
      } catch (err) {
        throw new Error('Invalid authentication token. Please log in again.');
      }

      const shopId = decodedToken.id;
      if (!shopId) {
        throw new Error('Shop ID not found in token.');
      }

      const shopItem = {
        name: name.trim(),
        price: Number(price),
        count: Number(count),
        description: description.trim(),
        image: image,
        shopId: shopId,
      };

      const response = await fetch(`${API_BASE_URL}/shopitems/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(shopItem),
      });
      
      // --- FIX STARTS HERE ---
      if (response.ok) {
        setIsSubmitting(false); // Stop loading indicator
        Alert.alert('Success', 'Item added successfully!', [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        // Only process the body for error messages
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to add item');
      }
      // --- FIX ENDS HERE ---

    } catch (err: any) {
      setIsSubmitting(false); // Ensure loading stops on error
      console.log('Catch error:', err);
      Alert.alert('Error', `Failed to add item: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Item</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Image</Text>
          <TouchableOpacity style={styles.imageContainer} onPress={handleImageChange}>
            {image ? (
              <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.itemImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <AntDesign name="plus" size={32} color="#888" />
              </View>
            )}
          </TouchableOpacity>
          {errors.image ? <Text style={styles.errorText}>{errors.image}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Item Name</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={(text) => handleChange('name', text)}
            placeholder="e.g., Hand-woven Basket"
            placeholderTextColor="#999"
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Price</Text>
          <TextInput
            style={styles.textInput}
            value={price}
            onChangeText={(text) => handleChange('price', text)}
            placeholder="e.g., 25.99"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quantity</Text>
          <TextInput
            style={styles.textInput}
            value={count}
            onChangeText={(text) => handleChange('count', text)}
            placeholder="e.g., 10"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          {errors.count ? <Text style={styles.errorText}>{errors.count}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.descriptionInput]}
            value={description}
            onChangeText={(text) => handleChange('description', text)}
            placeholder="Describe your item..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
        </View>

        <TouchableOpacity style={styles.publishButton} onPress={handleSave} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.publishButtonText}>Publish</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    padding: 8,
    zIndex: 1, // Ensure back button is tappable
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  descriptionInput: {
    minHeight: 96,
    paddingTop: 12,
  },
  publishButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    height: 50, // Give button a fixed height
    justifyContent: 'center',
  },
  publishButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#d9534f',
    fontSize: 13,
    marginTop: 6,
  },
});

