import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface MediaItem {
  uri: string;
  type: 'image' | 'video';
  name?: string;
  mimeType?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

interface SearchedPlace {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const TRAVEL_CATEGORIES = [
  { id: 'adventure', label: '🏔️ Adventure', color: '#EAB308' },
  { id: 'beach', label: '🏖️ Beach', color: '#FACC15' },
  { id: 'culture', label: '🏛️ Culture', color: '#FDE047' },
  { id: 'food', label: '🍜 Food', color: '#FEF08A' },
  { id: 'nature', label: '🌲 Nature', color: '#FCD34D' },
  { id: 'city', label: '🏙️ City', color: '#FBBF24' },
];

// Replace with your Google Places API key
const GOOGLE_PLACES_API_KEY = 'AIzaSyApf662eX5O6bPf0iiXkMidkcytrIgOSzM';

export default function CreatePostScreen() {
  const navigation = useNavigation();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  
  // Location search states
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchedPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showLocationOptions, setShowLocationOptions] = useState(false);

  const currentUser = {
    id: 'user123',
    name: 'Sarah Thompson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b287?w=100&h=100&fit=crop&crop=face'
  };

  useEffect(() => {
    (async () => {
      // Request permissions on app load
      try {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        
        console.log('✅ Permissions:', { cameraStatus, libraryStatus, locationStatus });
      } catch (error) {
        console.log('❌ Permission error:', error);
      }
    })();
  }, []);

  console.log('🔄 Component rendered, API key present:', !!GOOGLE_PLACES_API_KEY);

  // Search for places using Google Places API
  const searchPlaces = async (query: string) => {
    console.log('🔍 searchPlaces called with query:', query);
    
    if (!query.trim() || query.length < 3) {
      console.log('⏭️ Query too short, clearing results');
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    console.log('🌐 Making Places API request...');
    
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query
      )}&key=${GOOGLE_PLACES_API_KEY}&types=establishment|geocode`;
      
      console.log('📡 API URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('📨 Places API response status:', data.status);
      console.log('📨 Places API response data:', JSON.stringify(data, null, 2));
      
      if (data.status === 'OK') {
        console.log('✅ Search successful, results count:', data.predictions?.length || 0);
        setSearchResults(data.predictions || []);
      } else {
        console.log('❌ Places API error:', data.status, data.error_message);
        setSearchResults([]);
      }
    } catch (error) {
      console.log('❌ Search error:', error);
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  // Get place details from place_id
  const getPlaceDetails = async (placeId: string) => {
    console.log('🔍 getPlaceDetails called with placeId:', placeId);
    
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address,address_components&key=${GOOGLE_PLACES_API_KEY}`;
      console.log('📡 Place details API URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('📨 Place details response status:', data.status);
      console.log('📨 Place details response data:', JSON.stringify(data, null, 2));
      
      if (data.status === 'OK' && data.result) {
        const place = data.result;
        const { lat, lng } = place.geometry.location;
        
        console.log('📍 Coordinates found:', { lat, lng });
        
        // Extract city and country from address components
        let city = '';
        let country = '';
        
        if (place.address_components) {
          place.address_components.forEach((component: any) => {
            if (component.types.includes('locality')) {
              city = component.long_name;
            } else if (component.types.includes('administrative_area_level_1') && !city) {
              city = component.long_name;
            } else if (component.types.includes('country')) {
              country = component.long_name;
            }
          });
        }

        const locationData: LocationData = {
          latitude: lat,
          longitude: lng,
          address: place.formatted_address,
          city: city,
          country: country
        };

        console.log('✅ Setting location data:', locationData);
        setLocation(locationData);
        setShowLocationSearch(false);
        setSearchQuery('');
        setSearchResults([]);
        setShowLocationOptions(false);
      } else {
        console.log('❌ Place details API error:', data.status, data.error_message);
      }
    } catch (error) {
      console.log('❌ Place details error:', error);
      Alert.alert('Error', 'Failed to get place details');
    }
  };

  // Debounced search effect
  useEffect(() => {
    console.log('🔄 Search query changed:', searchQuery);
    
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        console.log('⏰ Timeout triggered, calling searchPlaces');
        searchPlaces(searchQuery);
      } else {
        console.log('⏰ Empty query, clearing results');
        setSearchResults([]);
      }
    }, 500);

    return () => {
      console.log('🧹 Clearing timeout');
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const selectMedia = () => {
    console.log('📸 selectMedia called');
    Alert.alert('Add Media', 'Choose your travel memories', [
      { text: 'Camera', onPress: pickMediaFromCamera },
      { text: 'Gallery', onPress: pickMediaFromGallery },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const pickMediaFromCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow camera access to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      handleMediaResult(result);
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const pickMediaFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow photo library access');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      handleMediaResult(result);
    } catch (error) {
      console.log('Gallery error:', error);
      Alert.alert('Error', 'Failed to open photo library');
    }
  };

  const handleMediaResult = (result: any) => {
    console.log('ImagePicker result:', result);
    
    if (!result.canceled && result.assets) {
      const newMedia = result.assets.map((asset: any) => ({
        uri: asset.uri,
        type: asset.type === 'video' ? 'video' : 'image',
        name: asset.fileName || `media_${Date.now()}.${asset.type === 'video' ? 'mp4' : 'jpg'}`,
        mimeType: asset.mimeType || (asset.type === 'video' ? 'video/mp4' : 'image/jpeg')
      }));
      
      setMedia((prev) => [...prev, ...newMedia]);
      console.log('Added media:', newMedia);
    }
  };

  const removeMedia = (idx: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== idx));
  };

  const getCurrentLocation = async () => {
    console.log('📍 getCurrentLocation called');
    setIsLocationLoading(true);
    
    try {
      console.log('🔐 Requesting location permissions...');
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log('🔐 Location permission status:', status);
      
      if (status !== 'granted') {
        console.log('❌ Location permission denied');
        Alert.alert('Permission Denied', 'Location permission is required to tag your location.');
        setIsLocationLoading(false);
        return;
      }

      console.log('📡 Getting current position...');
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      console.log('📍 Location result:', locationResult);

      console.log('🔄 Reverse geocoding...');
      const geocodeResult = await Location.reverseGeocodeAsync({
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude
      });
      
      console.log('🌍 Geocode result:', JSON.stringify(geocodeResult, null, 2));

      if (geocodeResult && geocodeResult.length > 0) {
        const result = geocodeResult[0];
        
        let address = 'Current Location';
        let city = '';
        let country = '';

        const addressParts = [];
        
        if (result.name) {
          addressParts.push(result.name);
        } else if (result.street) {
          addressParts.push(result.street);
        } else if (result.streetNumber && result.street) {
          addressParts.push(`${result.streetNumber} ${result.street}`);
        } else if (result.formattedAddress) {
          addressParts.push(result.formattedAddress);
        }

        if (result.district) {
          addressParts.push(result.district);
        } else if (result.subregion) {
          addressParts.push(result.subregion);
        }

        address = addressParts.length > 0 ? addressParts.join(', ') : 'Current Location';

        city = result.city || 
               result.subregion || 
               result.region || 
               '';

        country = result.country || 
                  result.isoCountryCode || 
                  '';

        const locationData = {
          latitude: locationResult.coords.latitude,
          longitude: locationResult.coords.longitude,
          address: address,
          city: city,
          country: country
        };

        console.log('✅ Final location set:', locationData);
        setLocation(locationData);
        setShowLocationOptions(false);
        
      } else {
        console.log('⚠️ Using fallback location');
        const fallbackLocation = {
          latitude: locationResult.coords.latitude,
          longitude: locationResult.coords.longitude,
          address: `${locationResult.coords.latitude.toFixed(6)}, ${locationResult.coords.longitude.toFixed(6)}`,
          city: 'Location',
          country: 'Found'
        };
        
        setLocation(fallbackLocation);
        setShowLocationOptions(false);
        console.log('📍 Using fallback location:', fallbackLocation);
      }
      
    } catch (error) {
      console.log('❌ Location error:', error);
      Alert.alert('Location Error', 'Could not get your current location. Please try again.');
    }
    setIsLocationLoading(false);
  };

  // Debug the location button press
  const handleLocationButtonPress = () => {
    console.log('🔥 LOCATION BUTTON PRESSED! 🔥');
    console.log('State check - isLocationLoading:', isLocationLoading);
    
    if (isLocationLoading) {
      console.log('⏸️ Button is disabled due to loading state');
      return;
    }
    
    console.log('▶️ Setting showLocationOptions to true...');
    setShowLocationOptions(true);
  };

  const createPost = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Share Your Story', 'Please add a title or description for your travel experience.');
      return;
    }
    
    setIsPosting(true);
    try {
      console.log('Creating post...');
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('categories', JSON.stringify(selectedCategories));
      formData.append('userId', currentUser.id);
      formData.append('userName', currentUser.name);
      formData.append('userAvatar', currentUser.avatar);

      if (location) {
        formData.append('latitude', location.latitude.toString());
        formData.append('longitude', location.longitude.toString());
        if (location.address) formData.append('address', location.address);
        if (location.city) formData.append('city', location.city);
        if (location.country) formData.append('country', location.country);
      }

      media.forEach((item, idx) => {
        const fileExtension = item.type === 'video' ? 'mp4' : 'jpg';
        const mimeType = item.mimeType || (item.type === 'video' ? 'video/mp4' : 'image/jpeg');
        
        formData.append('files', {
          uri: item.uri,
          type: mimeType,
          name: item.name || `travel_${idx}.${fileExtension}`
        } as any);
      });

      console.log('FormData prepared, making request...');

      const response = await fetch('http://localhost:8080/api/posts/create', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('Success response:', responseData);
      
      Alert.alert('Travel Story Shared!', 'Your adventure has been posted successfully.', [
        { text: 'View Post', onPress: () => navigation.goBack() }
      ]);
      
    } catch (err: any) {
      console.log('Post creation error:', err);
      Alert.alert('Upload Failed', err.message || 'Could not share your travel story');
    }
    setIsPosting(false);
  };

  const renderSearchItem = ({ item }: { item: SearchedPlace }) => (
    <TouchableOpacity 
      style={styles.searchResultItem}
      onPress={() => {
        console.log('🎯 Search item pressed:', item.description);
        getPlaceDetails(item.place_id);
      }}
    >
      <View style={styles.searchResultContent}>
        <Ionicons name="location-outline" size={20} color="#EAB308" />
        <View style={styles.searchResultText}>
          <Text style={styles.searchResultMain}>{item.structured_formatting.main_text}</Text>
          <Text style={styles.searchResultSecondary}>{item.structured_formatting.secondary_text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  console.log('🔄 Render - showLocationSearch:', showLocationSearch);
  console.log('🔄 Render - showLocationOptions:', showLocationOptions);
  console.log('🔄 Render - searchResults count:', searchResults.length);

  return (
    <SafeAreaView style={styles.root}>
      {/* Yellow Gradient Header */}
      <LinearGradient
        colors={['#FDE047', '#EAB308']}
        style={styles.gradientHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Share Your Journey</Text>
          <TouchableOpacity
            style={[
              styles.postButton, 
              (isPosting || (!title && !content)) && styles.postButtonDisabled
            ]}
            onPress={createPost}
            disabled={isPosting || (!title && !content)}
          >
            {isPosting ? (
              <ActivityIndicator color="#fff" size="small" /> 
            ) : (
              <Text style={styles.postButtonText}>Share</Text>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Travel Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Travel Categories {selectedCategories.length > 0 && `(${selectedCategories.length} selected)`}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {TRAVEL_CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    { borderColor: category.color },
                    isSelected && { backgroundColor: category.color }
                  ]}
                  onPress={() => toggleCategory(category.id)}
                >
                  <Text style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected
                  ]}>
                    {category.label}
                  </Text>
                  {isSelected && (
                    <Ionicons 
                      name="checkmark-circle" 
                      size={16} 
                      color="#fff" 
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {selectedCategories.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSelectedCategories([])}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Title Input */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.inputTitle}
            placeholder="What's the highlight of your trip?"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>
        </View>

        {/* Content Input */}
        <View style={styles.inputCard}>
          <TextInput
            style={[styles.inputContent, showFullContent && { height: 120 }]}
            placeholder="Tell us about your adventure... What made it special?"
            placeholderTextColor="#999"
            value={content}
            onChangeText={setContent}
            maxLength={800}
            multiline
            textAlignVertical="top"
            onFocus={() => setShowFullContent(true)}
          />
          <Text style={styles.charCount}>{content.length}/800</Text>
        </View>

        {/* Media Gallery */}
        {media.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Memories ({media.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaGallery}>
              {media.map((item, idx) => (
                <View key={idx} style={styles.mediaContainer}>
                  {item.type === 'image' ? (
                    <Image source={{ uri: item.uri }} style={styles.mediaThumb} />
                  ) : (
                    <View style={styles.videoContainer}>
                      <Video
                        style={styles.mediaThumb}
                        source={{ uri: item.uri }}
                        useNativeControls
                        resizeMode={ResizeMode.COVER}
                      />
                      <View style={styles.videoOverlay}>
                        <Ionicons name="play-circle" size={24} color="#fff" />
                      </View>
                    </View>
                  )}
                  <TouchableOpacity 
                    style={styles.removeMediaBtn} 
                    onPress={() => removeMedia(idx)}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Location */}
        {location && (
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Ionicons name="location" size={20} color="#EAB308" />
              <Text style={styles.locationTitle}>Travel Destination</Text>
              <TouchableOpacity onPress={() => setLocation(null)}>
                <Ionicons name="close" size={18} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.locationText}>{location.address}</Text>
            <Text style={styles.locationSubtext}>
              {location.city}{location.country ? `, ${location.country}` : ''}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionGrid}>
          <Pressable 
            style={[styles.actionCard, styles.mediaAction]} 
            onPress={selectMedia}
          >
            <LinearGradient
              colors={['#FDE047', '#EAB308']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.actionText}>Add Photos</Text>
            </LinearGradient>
          </Pressable>
          
          {/* Fixed Location Button */}
          <Pressable 
            style={[
              styles.actionCard, 
              styles.locationAction,
              isLocationLoading && { opacity: 0.5 }
            ]} 
            onPress={handleLocationButtonPress}
            disabled={isLocationLoading}
          >
            <LinearGradient
              colors={['#FACC15', '#EAB308']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {isLocationLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="location" size={24} color="#fff" />
              )}
              <Text style={styles.actionText}>
                {isLocationLoading ? 'Finding...' : 'Add Location'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Location Options Modal */}
      <Modal
        visible={showLocationOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLocationOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.optionsModal}>
            <Text style={styles.optionsTitle}>Add Location</Text>
            <Text style={styles.optionsSubtitle}>How would you like to add your location?</Text>
            
            <Pressable 
              style={styles.optionButton}
              onPress={() => {
                console.log('🔍 Search Location pressed');
                setShowLocationOptions(false);
                setShowLocationSearch(true);
              }}
            >
              <Ionicons name="search" size={24} color="#EAB308" />
              <Text style={styles.optionButtonText}>Search Location</Text>
            </Pressable>
            
            <Pressable 
              style={styles.optionButton}
              onPress={() => {
                console.log('📍 Current Location pressed');
                setShowLocationOptions(false);
                getCurrentLocation();
              }}
            >
              <Ionicons name="location" size={24} color="#EAB308" />
              <Text style={styles.optionButtonText}>Use Current Location</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.optionButton, styles.cancelButton]}
              onPress={() => {
                console.log('❌ Cancel pressed');
                setShowLocationOptions(false);
              }}
            >
              <Text style={[styles.optionButtonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Location Search Modal */}
      <Modal
        visible={showLocationSearch}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLocationSearch(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.searchHeader}>
            <TouchableOpacity onPress={() => {
              console.log('❌ Closing location search modal');
              setShowLocationSearch(false);
            }}>
              <Ionicons name="close" size={24} color="#92400e" />
            </TouchableOpacity>
            <Text style={styles.searchTitle}>Search Location</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#CA8A04" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a place..."
              placeholderTextColor="#CA8A04"
              value={searchQuery}
              onChangeText={(text) => {
                console.log('✏️ Search query changed to:', text);
                setSearchQuery(text);
              }}
              autoFocus
            />
            {isSearching && (
              <ActivityIndicator color="#EAB308" size="small" />
            )}
          </View>

          <FlatList
            data={searchResults}
            renderItem={renderSearchItem}
            keyExtractor={(item) => item.place_id}
            style={styles.searchResults}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#CA8A04', fontSize: 16 }}>
                  {isSearching ? 'Searching...' : searchQuery.length > 0 ? 'No results found' : 'Start typing to search for places'}
                </Text>
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#fffbeb' 
  },
  gradientHeader: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  postButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 8, 
    paddingHorizontal: 20, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  postButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  postButtonText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 16 
  },
  scrollContent: { 
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 12,
  },
  categoriesScroll: {
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 12,
    backgroundColor: '#fff',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92400e',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: 6,
  },
  clearButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500',
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#FDE047',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  inputTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#92400e',
    paddingBottom: 8,
  },
  inputContent: { 
    fontSize: 16, 
    color: '#78350f',
    minHeight: 80,
    paddingBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#CA8A04',
    textAlign: 'right',
  },
  mediaGallery: {
    marginBottom: 4,
  },
  mediaContainer: { 
    position: 'relative', 
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  mediaThumb: { 
    width: 140, 
    height: 140, 
    borderRadius: 10,
  },
  videoContainer: {
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  removeMediaBtn: { 
    position: 'absolute', 
    top: 8, 
    right: 8, 
    backgroundColor: 'rgba(234, 179, 8, 0.8)', 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  locationCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EAB308',
    shadowColor: '#FDE047',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    flex: 1,
    marginLeft: 8,
  },
  locationText: { 
    fontSize: 15,
    fontWeight: '500',
    color: '#78350f',
    marginBottom: 4,
  },
  locationSubtext: { 
    color: '#CA8A04', 
    fontSize: 14 
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FDE047',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 1,
  },
  mediaAction: {},
  locationAction: {},
  actionGradient: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    marginTop: 8,
  },
  bottomSpacing: {
    height: 40,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 40,
    width: '80%',
    maxWidth: 320,
  },
  optionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#92400e',
    textAlign: 'center',
    marginBottom: 8,
  },
  optionsSubtitle: {
    fontSize: 14,
    color: '#CA8A04',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 12,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    textAlign: 'center',
    marginLeft: 0,
  },
  // Search modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fffbeb',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FEF3C7',
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400e',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#78350f',
  },
  searchResults: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchResultItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  searchResultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  searchResultText: {
    flex: 1,
    marginLeft: 12,
  },
  searchResultMain: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  searchResultSecondary: {
    fontSize: 14,
    color: '#CA8A04',
  },
});
