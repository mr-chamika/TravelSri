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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, AntDesign } from '@expo/vector-icons';

type ListingItem = {
  id: number;
  title: string;
  price: string;
  image: string;
  quantity: number;
  isNew?: boolean;
  description?: string;
};

interface AddItemProps {
  onSave: (newItem: Omit<ListingItem, 'id'>) => void;
  onBack: () => void;
}

const AddItem: React.FC<AddItemProps> = ({ onSave, onBack }) => {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  // Image functionality temporarily removed

  const API_BASE_URL = 'http://localhost:8080'; // Change if needed
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  };

  const handleSave = async () => {
    console.log('Publish button clicked');
    if (!itemName.trim()) {
      Alert.alert('Error', 'Item name is required');
      return;
    }
    if (!price.trim() || isNaN(Number(price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }
    if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) < 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    // Prepare backend ShopItem object
    const shopItem = {
      itemName: itemName.trim(),
      price: Number(price),
      availableNumber: Number(quantity),
      description: description.trim() || 'This is Description',
      // imageUrl removed temporarily
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
            onBack();
          },
        },
      ]);
    } catch (err: any) {
      console.log('Catch error:', err);
      Alert.alert('Error', `Failed to add item: ${err.message || 'Unknown error'}`);
    }
  };

  const handleImageChange = () => {
    // Image picker functionality temporarily removed
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>


        <TouchableOpacity>
          <Feather name="bell" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Page Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>Add Item</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Image Section temporarily removed */}

        {/* Item Name */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Item Name</Text>
          <TextInput
            style={styles.textInput}
            value={itemName}
            onChangeText={setItemName}
            placeholder="Item Name"
            placeholderTextColor="#999"
          />
        </View>

        {/* Price */}
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

        {/* Quantity */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quantity</Text>
          <TextInput
            style={styles.textInput}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Quantity"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        {/* Description */}
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

        {/* Publish Button */}
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