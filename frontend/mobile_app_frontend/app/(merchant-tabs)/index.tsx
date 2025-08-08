import React, { useState, useCallback } from 'react';
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
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

// Define the correct ListingItem type to match your MongoDB backend
type ListingItem = {
  _id: string;
  shopId: string;
  name: string;
  price: number;
  image: string;
  count: number;
  description?: string;
};

// More flexible JWT payload type that handles various token structures
type JWTPayload = {
  id?: string;
};

const ListingCard: React.FC<{
  item: ListingItem;
  onMorePress: () => void;
}> = ({ item, onMorePress }) => (
  <View style={styles.card}>
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${item.image}` }}
        style={styles.cardImage}
        onError={() => console.log('Failed to load image for item:', item.name)}
      />
      <View style={styles.quantityBadge}>
        <Text style={styles.quantityText}>{item.count}</Text>
      </View>
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardPrice}>Rs. {item.price.toLocaleString()}</Text>
        <TouchableOpacity onPress={onMorePress} style={styles.moreButton}>
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
  const [shopId, setShopId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:8080';

  // More robust function to extract shop ID from JWT token
  const extractShopIdFromToken = useCallback(async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found');
        return null;
      }
      const decodedToken = jwtDecode<JWTPayload>(token);
      console.log('🔍 Full decoded token:', decodedToken);
      const foundShopId = decodedToken.id;
      if (foundShopId) {
        console.log('✅ Shop ID found:', foundShopId);
        return foundShopId;
      } else {
        console.error('❌ No valid shop ID found in token');
        console.log('Available token fields:', Object.keys(decodedToken));
        return null;
      }
    } catch (error) {
      console.error('❌ Error decoding JWT token:', error);
      return null;
    }
  }, []);

  const fetchShopListings = useCallback(async (shopId: string, showLoader = true) => {
    if (!shopId || shopId.trim() === '') {
      console.error('❌ Cannot fetch listings: Invalid shop ID');
      setError('Invalid shop ID');
      return;
    }
    if (showLoader) setIsLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token available.');
      }

      console.log('🔍 Shop ID:', shopId);
      console.log('🔍 Shop ID type:', typeof shopId);
      console.log('🔍 Full URL:', `${API_BASE_URL}/shopitems/by-shop?shopid=${shopId}`);

      const response = await fetch(`${API_BASE_URL}/shopitems/by-shop?shopid=${shopId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('🔍 Fetching listings for response:', response);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      const data: ListingItem[] = await response.json();
      console.log(`✅ Successfully fetched ${data.length} items`);
      setListings(data);
      setFilteredListings(data);
    } catch (error) {
      console.error('❌ Error fetching listings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, []);

  const initializeApp = useCallback(async () => {
    setIsLoading(true);
    const shopId = await extractShopIdFromToken();
    if (shopId) {
      setShopId(shopId);
      console.log('🔍 Initializing app with shop ID:', shopId);
      await fetchShopListings(shopId, false);
    } else {
      setError('Authentication required');
      Alert.alert(
        'Authentication Required',
        'Please log in to view your shop listings.',
        [
          { text: 'OK', onPress: () => console.log('User acknowledged auth error') }
        ]
      );
    }
    setIsLoading(false);
  }, [extractShopIdFromToken, fetchShopListings]);

  const onRefresh = useCallback(async () => {
    if (!shopId) return;
    setRefreshing(true);
    await fetchShopListings(shopId, false);
    setRefreshing(false);
  }, [shopId, fetchShopListings]);

  useFocusEffect(
    useCallback(() => {
      initializeApp();
    }, [initializeApp])
  );

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredListings(listings);
      return;
    }
    const filtered = listings.filter((item) =>
      item.name?.toLowerCase().includes(text.toLowerCase()) ||
      item.description?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredListings(filtered);
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token available.');
      }
      const response = await fetch(`${API_BASE_URL}/shopitems/delete?id=${selectedItem._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.status}`);
      }
      Alert.alert('Success', 'Item deleted successfully.', [
        {
          text: 'OK',
          onPress: () => {
            if (shopId) {
              fetchShopListings(shopId);
            }
            setModalVisible(false);
            setSelectedItem(null);
          },
        },
      ]);
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item. Please try again.');
    }
  };

  const handleChangeItem = () => {
    setModalVisible(false);
    if (selectedItem) {
      router.push({
        pathname: '/(merchant-tabs)/ChangeItem',
        params: { id: selectedItem._id },
      });
    }
  };

  const handleAddItem = () => {
    router.push('/(merchant-tabs)/AddItem');
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading your listings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.listingsHeader}>
        <Text style={styles.listingsTitle}>My Listings</Text>
        <TouchableOpacity onPress={handleAddItem} style={styles.addButton}>
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
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <MaterialIcons name="clear" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="tune" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.listingsContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FFD700']}
          />
        }
      >
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={48} color="#ff4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={initializeApp} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredListings.length > 0 ? (
          <>
            {searchText.length > 0 && (
              <Text style={styles.searchResults}>
                {filteredListings.length} result(s) for "{searchText}"
              </Text>
            )}
            {filteredListings.map((item) => (
              <ListingCard
                key={item._id}
                item={item}
                onMorePress={() => {
                  setSelectedItem(item);
                  setModalVisible(true);
                }}
              />
            ))}
          </>
        ) : (
          <View style={styles.noItemsContainer}>
            <MaterialIcons name="inventory-2" size={64} color="#ccc" />
            <Text style={styles.noItemsTitle}>
              {searchText ? 'No matching items found' : 'No items yet'}
            </Text>
            <Text style={styles.noItemsText}>
              {searchText
                ? 'Try a different search term'
                : 'Add your first item to get started!'
              }
            </Text>
            {!searchText && (
              <TouchableOpacity onPress={handleAddItem} style={styles.addFirstItemButton}>
                <Text style={styles.addFirstItemText}>Add Item</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
            <Text style={styles.modalSubtitle}>What would you like to do?</Text>

            <TouchableOpacity
              style={[styles.modalButton, styles.editButton]}
              onPress={handleChangeItem}
            >
              <MaterialIcons name="edit" size={20} color="#fff" />
              <Text style={styles.modalButtonText}>Edit Item</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={handleDeleteItem}
            >
              <MaterialIcons name="delete" size={20} color="#fff" />
              <Text style={styles.modalButtonText}>Delete Item</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setModalVisible(false);
                setSelectedItem(null);
              }}
            >
              <Text style={[styles.modalButtonText, { color: '#666' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Listings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  listingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000'
  },
  addButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFD700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000'
  },
  filterButton: {
    padding: 10,
  },
  searchResults: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  listingsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 150,
    position: 'relative'
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  quantityBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  cardContent: {
    padding: 15
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#000'  // Changed from '#FFD700' to black
  },
  moreButton: {
    padding: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  noItemsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 300,
  },
  noItemsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noItemsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  addFirstItemButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  addFirstItemText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginVertical: 6,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginTop: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});