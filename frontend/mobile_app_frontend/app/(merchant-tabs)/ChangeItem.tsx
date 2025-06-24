import React, { useState } from 'react';
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

type ListingItem = {
  id: number;
  title: string;
  price: string;
  image: string;
  quantity: number;
  isNew?: boolean;
  description?: string;
};

interface ChangeItemProps {
  item: ListingItem;
  onSave: (updatedItem: ListingItem) => void;
  onBack: () => void;
}

const ChangeItem: React.FC<ChangeItemProps> = ({ item, onSave, onBack }) => {
  const [itemName, setItemName] = useState(item.title);
  const [price, setPrice] = useState(item.price.replace(' LKR', ''));
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [description, setDescription] = useState(item.description || 'This is Description');
  const [imageUri, setImageUri] = useState(item.image);

  const handleSave = () => {
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

    const updatedItem: ListingItem = {
      ...item,
      title: itemName.trim(),
      price: `${price.trim()} LKR`,
      quantity: Number(quantity),
      description: description.trim(),
      image: imageUri,
    };

    onSave(updatedItem);
    Alert.alert('Success', 'Item updated successfully!');
  };

  const handleImageChange = () => {
    // In a real app, you would implement image picker here
    Alert.alert('Image Picker', 'Image picker functionality would be implemented here');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>🏝️</Text>
          </View>
          <Text style={styles.logoTitle}>TravelSri</Text>
        </View>

        <TouchableOpacity>
          <Feather name="bell" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Page Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>Change Item</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Image</Text>
          <TouchableOpacity style={styles.imageContainer} onPress={handleImageChange}>
            <Image source={{ uri: imageUri }} style={styles.itemImage} />
            <View style={styles.imageOverlay}>
              <AntDesign name="plus" size={32} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Item Name */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Item Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={itemName}
              onChangeText={setItemName}
              placeholder="Enter item name"
              placeholderTextColor="#999"
            />
            <View style={styles.requiredDot} />
          </View>
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Price</Text>
          <TextInput
            style={styles.textInput}
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
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
            placeholder="Enter quantity"
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
            placeholder="Enter description"
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

export default ChangeItem;

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
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
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
  inputContainer: {
    position: 'relative',
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