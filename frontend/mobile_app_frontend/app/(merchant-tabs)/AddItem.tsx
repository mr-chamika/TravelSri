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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router'; // Import useRouter
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

// Corrected type definition to match the backend
type ListingItem = {
  id: string; // Corrected to match the backend model
  name: string;
  price: number;
  imageUrl: string;
  availableNumber: number;
  isNew?: boolean;
  description?: string;
};

// Removed the props interface as navigation will be handled internally
const AddItem: React.FC = () => {
  const router = useRouter(); // Use the router hook

  const [name, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [count, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImageUri] = useState('');

  const API_BASE_URL = 'http://localhost:8080';
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  };

  const handleSave = async () => {

    console.log('Publish button clicked');
    if (!name.trim()) {
      Alert.alert('Error', 'Item name is required');
      return;
    }
    if (!price.trim() || isNaN(Number(price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }
    if (!count.trim() || isNaN(Number(count)) || Number(count) < 0) {
      Alert.alert('Error', 'Please enter a valid count');
      return;
    }
    if (!image) {
      Alert.alert('Error', 'Please add an image for the item');
      return;
    }

    // 🆕 Retrieve and decode the token to get the shopId
    const token = await AsyncStorage.getItem("token");
    if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please log in again.');
        return;
    }

    let decodedToken: any;
    try {
        decodedToken = jwtDecode(token);
    } catch (err) {
        console.error('Error decoding token:', err);
        Alert.alert('Error', 'Invalid authentication token. Please log in again.');
        return;
    }

    const shopId = decodedToken.id;
    if (!shopId) {
        Alert.alert('Error', 'Shop ID not found in token.');
        return;
    }

    const shopItem = {
      name: name.trim(),
      price: Number(price),
      count: Number(count),
      description: description.trim() || 'This is Description',
      image: image,
      shopId: shopId, 
    };
    console.log('Sending to backend:', shopItem);

    try {
      const response = await fetch(`${API_BASE_URL}/shopitems/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopItem),
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Backend error:', errorText);
        throw new Error(errorText || 'Failed to add item');
      }

      Alert.alert('Success', 'Item added to database!', [
        {
          text: 'OK',
          onPress: () => {
            router.back(); // Use router.back() to navigate back
          },
        },
      ]);
    } catch (err: any) {
      console.log('Catch error:', err);
      Alert.alert('Error', `Failed to add item: ${err.message || 'Unknown error'}`);
    }
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
      base64: true
    });

    if (!result.canceled && result.assets[0].base64) {
      setImageUri(result.assets[0].base64);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="bell" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>Add Item</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Image</Text>
          <TouchableOpacity style={styles.imageContainer} onPress={handleImageChange}>
            {image ? (
              <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.itemImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <AntDesign name="plus" size={32} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Item Name</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setItemName}
            placeholder="Item Name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Price</Text>
          <TextInput
            style={styles.textInput}
            value={price}
            onChangeText={setPrice}
            placeholder="Price"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quantity</Text>
          <TextInput
            style={styles.textInput}
            value={count}
            onChangeText={setQuantity}
            placeholder="Quantity"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.descriptionInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="This is Description"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.publishButton} onPress={handleSave}>
          <Text style={styles.publishButtonText}>Publish</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#FFD700',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 16,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  titleContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  imageContainer: {
    height: 150,
    backgroundColor: '#f1f3f4',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
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
  descriptionInput: {
    height: 100,
    paddingTop: 12,
  },
  publishButton: {
    backgroundColor: '#FFD700',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    padding: 5,
  },
});