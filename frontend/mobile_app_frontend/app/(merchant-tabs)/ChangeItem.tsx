import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

type ListingItem = {
  _id: string;
  name: string;
  price: number;
  image: string;
  count: number;
  description?: string;
};

const ChangeItem: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [item, setItem] = useState<ListingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Track validation errors

  const API_BASE_URL = 'http://192.168.43.208:8080';

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/shopitems/view?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch item details');
        }
        const data: ListingItem = await response.json();
        setItem(data);
        setItemName(data.name);
        setPrice(data.price.toString());
        setQuantity(data.count.toString());
        setDescription(data.description || '');
        setImageUri(data.image);
      } catch (error) {
        console.error('Error fetching item:', error);
        Alert.alert('Error', 'Failed to load item details.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  // Validation for individual fields
  const validateField = (field: string, value: string) => {
    let error = '';
    if (!value.trim()) {
      error = 'This field is required.';
    } else if (field === 'name' && value.trim().length < 3) {
      error = 'Item name must be at least 3 characters long.';
    } else if (field === 'price' && (isNaN(Number(value)) || Number(value) <= 0)) {
      error = 'Please enter a valid positive price.';
    } else if (field === 'quantity' && (isNaN(Number(value)) || Number(value) <= 0)) {
      error = 'Please enter a valid positive quantity.';
    } else if (field === 'description' && value.trim().length < 10) {
      error = 'Description must be at least 10 characters long.';
    } else if (field === 'imageUri' && !value) {
      error = 'Please add an image for the item.';
    }
    return error;
  };

  // Validate all fields before submission
  const validateForm = () => {
    const formErrors: { [key: string]: string } = {};
    formErrors.name = validateField('name', name);
    formErrors.price = validateField('price', price);
    formErrors.quantity = validateField('quantity', quantity);
    formErrors.description = validateField('description', description);
    formErrors.imageUri = validateField('imageUri', imageUri);

    setErrors(formErrors);
    return Object.keys(formErrors).every((key) => !formErrors[key]);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting.');
      return;
    }

    if (!item) return;

    const updatePayload = {
      _id: item._id,
      name: name.trim(),
      price: Number(price),
      count: Number(quantity),
      description: description.trim(),
      image: imageUri,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/shopitems/update?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update item');
      }

      Alert.alert('Success', 'Item updated successfully!');
      router.back();
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item.');
    }
  };

  const handleImageChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
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
        delete newErrors['imageUri'];
        return newErrors;
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text>Item not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Change Item</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Image</Text>
          <TouchableOpacity style={styles.imageContainer} onPress={handleImageChange}>
            {imageUri ? (
              <Image source={{ uri: `data:image/jpeg;base64,${imageUri}` }} style={styles.itemImage} />
            ) : (
              <View style={styles.imageOverlay}>
                <AntDesign name="plus" size={32} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          {errors.imageUri ? <Text style={styles.errorText}>{errors.imageUri}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Item Name</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={(text) => {
              setItemName(text);
              setErrors((prev) => ({ ...prev, name: validateField('name', text) }));
            }}
            placeholder="Enter item name"
            placeholderTextColor="#999"
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Price</Text>
          <TextInput
            style={styles.textInput}
            value={price}
            onChangeText={(text) => {
              setPrice(text);
              setErrors((prev) => ({ ...prev, price: validateField('price', text) }));
            }}
            placeholder="Enter price"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quantity</Text>
          <TextInput
            style={styles.textInput}
            value={quantity}
            onChangeText={(text) => {
              setQuantity(text);
              setErrors((prev) => ({ ...prev, quantity: validateField('quantity', text) }));
            }}
            placeholder="Enter quantity"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          {errors.quantity ? <Text style={styles.errorText}>{errors.quantity}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.descriptionInput]}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setErrors((prev) => ({ ...prev, description: validateField('description', text) }));
            }}
            placeholder="Enter description"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
        </View>

        <TouchableOpacity style={styles.publishButton} onPress={handleSave}>
          <Text style={styles.publishButtonText}>Publish</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangeItem;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { padding: 5 },
  titleContainer: { padding: 20, backgroundColor: '#fff' },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  content: { flex: 1, paddingHorizontal: 20 },
  section: { marginTop: 20 },
  sectionLabel: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 },
  imageContainer: {
    height: 150,
    backgroundColor: '#f1f3f4',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  itemImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: { position: 'relative' },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  descriptionInput: { height: 100, paddingTop: 12 },
  requiredDot: {
    position: 'absolute',
    right: 15,
    top: '50%',
    width: 8,
    height: 8,
    backgroundColor: '#ff4444',
    borderRadius: 4,
    transform: [{ translateY: -4 }],
  },
  publishButton: {
    backgroundColor: '#FFD700',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  publishButtonText: { fontSize: 16, fontWeight: '600', color: '#000' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});