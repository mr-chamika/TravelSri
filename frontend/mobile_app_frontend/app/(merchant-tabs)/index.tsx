import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

// Define the correct ListingItem type to match your MongoDB backend
type ListingItem = {
  id: string; // Corrected from _id to id
  itemName: string;
  price: number;
  imageUrl: string;
  availableNumber: number;
  isNew?: boolean;
  description?: string;
};

const ListingCard: React.FC<{
  item: ListingItem;
  onMorePress: () => void;
}> = ({ item, onMorePress }) => (
  <View style={styles.card}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.quantityBadge}>
        <Text style={styles.quantityText}>{item.availableNumber}</Text>
      </View>
      {item.isNew && <View style={styles.newBadge} />}
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.itemName}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardPrice}>{item.price} LKR</Text>
        <TouchableOpacity onPress={onMorePress}>
          <MaterialIcons name="more-horiz" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const Listings: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [filteredListings, setFilteredListings] = useState<ListingItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ListingItem | null>(null);

  const API_BASE_URL = 'http://localhost:8080';

  const fetchListings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/shopitems/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data: ListingItem[] = await response.json();
      setListings(data);
      setFilteredListings(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Replace the old useEffect with useFocusEffect
  useFocusEffect(
    useCallback(() => {
      fetchListings();
      // This will run when the screen is focused and when it is re-focused
    }, [])
  );

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = listings.filter((item) =>
      item.itemName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredListings(filtered);
  };

  const handleDeleteItem = async () => {
    if (selectedItem) {
      try {
        const response = await fetch(`${API_BASE_URL}/shopitems/delete?id=${selectedItem.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete item');
        }
        fetchListings(); // This will now correctly re-fetch the list
        setModalVisible(false);
        setSelectedItem(null);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleChangeItem = () => {
    setModalVisible(false);
    if (selectedItem) {
      router.push({
        pathname: '/(merchant-tabs)/ChangeItem',
        params: { id: selectedItem.id },
      });
    }
  };

  const handleAddItem = () => {
    router.push('/(merchant-tabs)/AddItem');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.listingsHeader}>
        <Text style={styles.listingsTitle}>Listings</Text>
        <TouchableOpacity onPress={handleAddItem}>
          <AntDesign name="plus" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search listings..."
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity>
          <MaterialIcons name="tune" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listingsContainer} showsVerticalScrollIndicator={false}>
        {filteredListings.map((item) => (
          <ListingCard
            key={item.id}
            item={item}
            onMorePress={() => {
              setSelectedItem(item);
              setModalVisible(true);
            }}
          />
        ))}
      </ScrollView>

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedItem?.itemName}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleDeleteItem}
            >
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleChangeItem}
            >
              <Text style={styles.modalButtonText}>Change</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#ccc' }]}
              onPress={() => {
                setModalVisible(false);
                setSelectedItem(null);
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Listings;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
  },
  menuIcon: {
    width: 24,
    justifyContent: 'space-between',
    height: 18,
  },
  menuLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#000',
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#FFD700',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: { fontSize: 16 },
  logoTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  listingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  listingsTitle: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f1f3f4',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#000' },
  listingsContainer: { flex: 1, paddingHorizontal: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  imageContainer: { height: 150, position: 'relative' },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  quantityBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  newBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 12,
    height: 12,
    backgroundColor: '#ff4444',
    borderRadius: 6,
  },
  cardContent: { padding: 15 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: 10,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});