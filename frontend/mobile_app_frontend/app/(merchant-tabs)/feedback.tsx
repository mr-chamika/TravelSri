import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';

type ListingItem = {
  id: number;
  title: string;
  price: string;
  image: string;
  quantity: number;
  isNew?: boolean;
};

const listings: ListingItem[] = [
  {
    id: 1,
    title: 'Wood',
    price: '500.0 LKR',
    image: 'https://images.unsplash.com/photo-1419640303358-44f0d27f48e7?w=300&h=200&fit=crop',
    quantity: 20,
  },
  {
    id: 2,
    title: 'RainCoat',
    price: '1500.0 LKR',
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=300&h=200&fit=crop',
    quantity: 20,
    isNew: true,
  },
  {
    id: 3,
    title: 'Shoes',
    price: '3000.0 LKR',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop',
    quantity: 20,
  },
  {
    id: 4,
    title: 'Camera',
    price: '25000.0 LKR',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop',
    quantity: 5,
  },
  {
    id: 5,
    title: 'Backpack',
    price: '2500.0 LKR',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop',
    quantity: 15,
    isNew: true,
  },
  {
    id: 6,
    title: 'Sunglasses',
    price: '1200.0 LKR',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=200&fit=crop',
    quantity: 30,
  },
  {
    id: 7,
    title: 'Travel Mug',
    price: '800.0 LKR',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=200&fit=crop',
    quantity: 25,
  },
  {
    id: 8,
    title: 'Hat',
    price: '750.0 LKR',
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=300&h=200&fit=crop',
    quantity: 12,
    isNew: true,
  },
];

const ListingCard: React.FC<{
  item: ListingItem;
  onMorePress: () => void;
}> = ({ item, onMorePress }) => (
  <View style={styles.card}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.quantityBadge}>
        <Text style={styles.quantityText}>{item.quantity}</Text>
      </View>
      {item.isNew && <View style={styles.newBadge} />}
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardPrice}>{item.price}</Text>
        <TouchableOpacity onPress={onMorePress}>
          <MaterialIcons name="more-horiz" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const Listings: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredListings, setFilteredListings] = useState(listings);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ListingItem | null>(null);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = listings.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredListings(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.menuIcon}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </View>

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

      {/* Listings Header */}
      <View style={styles.listingsHeader}>
        <Text style={styles.listingsTitle}>Listings</Text>
        <TouchableOpacity>
          <AntDesign name="plus" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search */}
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

      {/* Listings */}
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

      {/* Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedItem?.title}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                console.log('Delete:', selectedItem);
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                console.log('Change:', selectedItem);
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Change</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#ccc' }]}
              onPress={() => setModalVisible(false)}
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
