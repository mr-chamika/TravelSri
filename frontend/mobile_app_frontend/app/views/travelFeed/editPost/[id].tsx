import React, { useState, useEffect, useCallback } from 'react';
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
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface MyToken {
  sub: string;
  roles: string[];
  username: string;
  email: string;
  id: string;
  avatar?: string;
  name?: string;
}

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

interface Post {
  id: string;
  title?: string;
  content: string;
  categories: string[];
  userId: string;
  userName: string;
  userAvatar?: string;
  mediaFiles: string[];
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  country?: string;
  likes: string[];
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

const TRAVEL_CATEGORIES = [
  { id: 'adventure', label: '🏔️ Adventure', color: '#EAB308' },
  { id: 'beach', label: '🏖️ Beach', color: '#FACC15' },
  { id: 'culture', label: '🏛️ Culture', color: '#FDE047' },
  { id: 'food', label: '🍜 Food', color: '#FEF08A' },
  { id: 'nature', label: '🌲 Nature', color: '#FCD34D' },
  { id: 'city', label: '🏙️ City', color: '#FBBF24' },
];

const BACKEND_BASE_URL = 'http://localhost:8080';

export default function EditPostScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const postId = id; // Use 'id' from route params (passed from travel feed)

  // States
  const [postText, setPostText] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  
  // Location search states
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchedPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showLocationOptions, setShowLocationOptions] = useState(false);

  // Original post data for comparison
  const [originalPost, setOriginalPost] = useState<Post | null>(null);

  // JWT token state
  const [userToken, setUserToken] = useState<MyToken | null>(null);
  const [currentUser, setCurrentUser] = useState({
    id: '',
    name: '',
    avatar: ''
  });

  // Load JWT token on component mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('📋 Token from storage:', token ? 'Found' : 'Not found');
        
        if (token) {
          try {
            const decoded = jwtDecode<MyToken>(token);
            console.log('🔐 Full decoded token:', JSON.stringify(decoded, null, 2));
            
            setUserToken(decoded);
            
            // Update current user with JWT token info
            // Priority: decoded.username > decoded.name > decoded.sub > fallback "User"
            const username = decoded.username || decoded.name || decoded.sub || 'User';
            
            const newUser = {
              id: decoded.id || decoded.sub || '',
              name: username,
              avatar: decoded.avatar || ''
            };
            
            console.log('👤 Setting currentUser to:', newUser);
            setCurrentUser(newUser);
            
            console.log('✅ JWT token loaded successfully');
            console.log('   ✓ userId:', newUser.id);
            console.log('   ✓ username:', newUser.name);
            console.log('   ✓ avatar:', newUser.avatar || 'Not provided');
          } catch (decodeError) {
            console.error('❌ Error decoding token:', decodeError);
            setCurrentUser({
              id: '',
              name: 'User',
              avatar: ''
            });
          }
        } else {
          console.warn('⚠️ No JWT token found in AsyncStorage');
          console.log('   Showing default "User" text');
          setCurrentUser({
            id: '',
            name: 'User',
            avatar: ''
          });
        }
      } catch (error) {
        console.error('❌ Error loading JWT token:', error);
        setCurrentUser({
          id: '',
          name: 'User',
          avatar: ''
        });
      }
    };
    
    loadToken();
  }, []);

  // Load post data on component mount
  useEffect(() => {
    loadPostData();
  }, [postId]);

  const loadPostData = async () => {
    console.log('📄 Loading post data for ID:', postId);
    console.log('📄 Current user ID:', currentUser.id);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/posts/post/${postId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load post: ${response.status}`);
      }
      
      const postData: Post = await response.json();
      console.log('✅ Post data loaded:', postData);
      console.log('   - Post User ID:', postData.userId);
      console.log('   - Post Created At:', postData.createdAt);
      console.log('   - Current Time:', new Date().toISOString());
      
      // Set original post data
      setOriginalPost(postData);
      
      // Populate form fields
      setPostText(postData.content || '');
      setSelectedCategories(postData.categories || []);
      
      // Set location if available
      if (postData.latitude && postData.longitude) {
        setLocation({
          latitude: postData.latitude,
          longitude: postData.longitude,
          address: postData.address,
          city: postData.city,
          country: postData.country,
        });
      }
      
      // Convert media files to MediaItem format
      if (postData.mediaFiles && postData.mediaFiles.length > 0) {
        const mediaItems: MediaItem[] = postData.mediaFiles.map((uri, index) => ({
          uri: uri,
          type: uri.startsWith('data:video/') ? 'video' : 'image',
          name: `existing_media_${index}`,
          mimeType: uri.startsWith('data:video/') ? 'video/mp4' : 'image/jpeg'
        }));
        setMedia(mediaItems);
      }
      
    } catch (error: any) {
      console.error('❌ Error loading post data:', error);
      Alert.alert('Error', 'Failed to load post data. Please try again.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const canEdit = () => {
    if (!originalPost) {
      console.log('❌ canEdit: No original post data');
      return false;
    }
    
    try {
      const createdAt = new Date(originalPost.createdAt);
      const now = new Date();
      const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
      const diffInHours = diffInMinutes / 60;
      
      const isOwner = originalPost.userId === currentUser.id;
      const canEditTime = diffInHours <= 1;
      
      console.log(`🔍 Edit Permission Check:`);
      console.log(`  - Original Post User ID: ${originalPost.userId}`);
      console.log(`  - Current User ID: ${currentUser.id}`);
      console.log(`  - Is Owner: ${isOwner}`);
      console.log(`  - Created At: ${originalPost.createdAt}`);
      console.log(`  - Diff in minutes: ${diffInMinutes}`);
      console.log(`  - Diff in hours: ${diffInHours}`);
      console.log(`  - Can Edit Time (≤ 1 hour): ${canEditTime}`);
      console.log(`  - Final result: ${isOwner && canEditTime}`);
      
      return isOwner && canEditTime;
    } catch (error) {
      console.error('❌ Error in canEdit:', error);
      return false;
    }
  };

  // Image compression for web
  const compressImage = (uri: string, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      if (Platform.OS !== 'web') {
        resolve(uri);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new (window as any).Image();
      
      img.onload = () => {
        let { width, height } = img;
        const maxWidth = 1920;
        const maxHeight = 1080;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => resolve(uri);
      img.src = uri;
    });
  };

  // Search places function (same as create post)
  const searchPlacesViaBackend = useCallback(async (query: string): Promise<void> => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const url = `${BACKEND_BASE_URL}/api/places/autocomplete?input=${encodeURIComponent(query)}&types=geocode`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      if (!response.ok) {
        setSearchResults([]);
        return;
      }
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.predictions && Array.isArray(data.predictions)) {
        setSearchResults(data.predictions);
      } else {
        setSearchResults([]);
      }
      
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Get place details (same as create post)
  const getPlaceDetails = async (placeId: string): Promise<void> => {
    try {
      const url = `${BACKEND_BASE_URL}/api/places/details?placeId=${placeId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      if (!response.ok) {
        Alert.alert('Error', 'Could not get location details. Please try another location.');
        return;
      }
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.result) {
        const place = data.result;
        const { lat, lng } = place.geometry.location;
        
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
          address: place.formatted_address || place.name,
          city: city,
          country: country
        };

        setLocation(locationData);
        setShowLocationSearch(false);
        setSearchQuery('');
        setSearchResults([]);
        setShowLocationOptions(false);
        
      } else {
        Alert.alert('Error', 'Could not get location details. Please try another location.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not get location details. Please try another location.');
    }
  };

  // Debounced search
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchPlacesViaBackend(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchPlacesViaBackend]);

  // Get current location (simplified version)
  const getCurrentLocation = async (): Promise<void> => {
    setIsLocationLoading(true);
    
    try {
      if (Platform.OS === 'web') {
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by this browser');
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000
          });
        });

        const { latitude, longitude } = position.coords;
        
        setLocation({
          latitude,
          longitude,
          address: 'Current Location',
          city: 'Current Location',
          country: ''
        });
        
        setShowLocationOptions(false);
        Alert.alert('📍 Location Found!', 'Successfully tagged your current location');
      } else {
        // Mobile location logic (same as create post)
        const locationResult = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });

        const { latitude, longitude } = locationResult.coords;
        
        setLocation({
          latitude,
          longitude,
          address: 'Current Location',
          city: 'Current Location', 
          country: ''
        });
        
        setShowLocationOptions(false);
        Alert.alert('📍 Location Found!', 'Successfully tagged your current location');
      }
    } catch (error: any) {
      Alert.alert('Location Error', 'Could not get your current location. Please try again.');
    } finally {
      setIsLocationLoading(false);
    }
  };

  // Toggle category selection
  const toggleCategory = (categoryId: string): void => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Media selection functions (same as create post)
  const selectMedia = (): void => {
    if (Platform.OS === 'web') {
      selectMediaWeb();
      return;
    }
    
    Alert.alert('Add Media', 'Choose your travel memories', [
      { text: 'Camera', onPress: pickMediaFromCamera },
      { text: 'Gallery', onPress: pickMediaFromGallery },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const selectMediaWeb = (): void => {
    if (Platform.OS !== 'web') return;

    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,video/*';
    
    input.addEventListener('change', async (event) => {
      const files = (event.target as HTMLInputElement).files;
      
      if (files && files.length > 0) {
        const mediaItems: MediaItem[] = [];
        const fileArray = Array.from(files);
        
        for (let i = 0; i < fileArray.length; i++) {
          const file = fileArray[i];
          
          try {
            const uri = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(file);
            });
            
            let finalUri = uri;
            if (file.type.startsWith('image/') && file.size > 2 * 1024 * 1024) {
              finalUri = await compressImage(uri, 0.8);
            }
            
            const mediaItem: MediaItem = {
              uri: finalUri,
              type: file.type.startsWith('video/') ? 'video' : 'image',
              name: file.name,
              mimeType: file.type
            };
            
            mediaItems.push(mediaItem);
          } catch (error) {
            console.log(`❌ Error processing file ${file.name}:`, error);
          }
        }
        
        if (mediaItems.length > 0) {
          setMedia(prev => [...prev, ...mediaItems]);
        }
      }
    });
    
    input.click();
  };

  const pickMediaFromCamera = async (): Promise<void> => {
    try {
      const { status: currentStatus } = await ImagePicker.getCameraPermissionsAsync();
      
      if (currentStatus !== 'granted') {
        const { status: newStatus } = await ImagePicker.requestCameraPermissionsAsync();
        
        if (newStatus !== 'granted') {
          Alert.alert('Permission Required', 'Camera access is needed to take photos for your travel posts');
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      handleMediaResult(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const pickMediaFromGallery = async (): Promise<void> => {
    try {
      const { status: currentStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
      
      if (currentStatus !== 'granted') {
        const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (newStatus !== 'granted') {
          Alert.alert('Permission Required', 'Photo library access is needed to select images for your travel posts');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
      });

      handleMediaResult(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to open photo library');
    }
  };

  const handleMediaResult = (result: any): void => {
    if (!result.canceled && result.assets) {
      const newMedia = result.assets.map((asset: any, index: number) => {
        const mediaType = asset.type === 'video' ? 'video' : 'image';
        const fileExtension = mediaType === 'video' ? 'mp4' : 'jpg';
        const mimeType = asset.mimeType || (mediaType === 'video' ? 'video/mp4' : 'image/jpeg');
        
        return {
          uri: asset.uri,
          type: mediaType,
          name: asset.fileName || `travel_${Date.now()}_${index}.${fileExtension}`,
          mimeType: mimeType
        };
      });
      
      setMedia((prev) => [...prev, ...newMedia]);
    }
  };

  const removeMedia = (idx: number): void => {
    setMedia((prev) => prev.filter((_, i) => i !== idx));
  };

  // UPDATE POST FUNCTION
  const updatePost = async () => {
    console.log('🔄 ===== UPDATE POST STARTED =====');
    console.log('📄 Post ID:', postId);
    console.log('👤 User ID:', currentUser.id);
    
    if (!canEdit()) {
      Alert.alert('Edit Not Available', 'Posts can only be edited within 1 hour of creation.');
      return;
    }

    const trimmedText = postText.trim();
    if (!trimmedText) {
      Alert.alert('Validation Error', 'Post content cannot be empty.');
      return;
    }

    setIsUpdating(true);

    try {
      // File size validation
      if (media.length > 0) {
        const totalSizeMB = media.reduce((total, item) => {
          return total + (item.uri.length * 0.75) / (1024 * 1024);
        }, 0);
        
        if (totalSizeMB > 150) {
          Alert.alert('Files Too Large', `Your files are ${totalSizeMB.toFixed(1)}MB which exceeds the upload limit.`);
          setIsUpdating(false);
          return;
        }
        
        if (media.length > 10) {
          Alert.alert('Too Many Files', 'Please select no more than 10 files.');
          setIsUpdating(false);
          return;
        }
      }

      const formData = new FormData();
      
      // Add form fields
      formData.append('content', trimmedText);
      formData.append('userId', currentUser.id);
      formData.append('keepExistingMedia', 'false'); // Replace existing media
      
      if (selectedCategories.length > 0) {
        formData.append('tags', JSON.stringify(selectedCategories));
      }
      
      if (location) {
        formData.append('latitude', location.latitude.toString());
        formData.append('longitude', location.longitude.toString());
        if (location.address) formData.append('address', location.address);
        if (location.city) formData.append('city', location.city);
        if (location.country) formData.append('country', location.country);
      }

      // Add media files
      media.forEach((item, idx) => {
        if (Platform.OS === 'web') {
          const blob = dataURItoBlob(item.uri);
          formData.append('files', blob, item.name || `travel_${idx}.${item.type === 'video' ? 'mp4' : 'jpg'}`);
        } else {
          const ext = item.type === 'video' ? 'mp4' : 'jpg';
          const mimeType = item.mimeType || (item.type === 'video' ? 'video/mp4' : 'image/jpeg');
          formData.append('files', {
            uri: item.uri,
            type: mimeType,
            name: item.name || `travel_${Date.now()}_${idx}.${ext}`
          } as any);
        }
      });

      console.log('🌐 Calling edit API...');
      const response = await fetch(`${BACKEND_BASE_URL}/api/posts/edit/${postId}`, {
        method: 'PUT',
        body: formData,
      });



      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 413) {
          Alert.alert('File Size Exceeded', 'Your files exceed the server upload limit.');
          return;
        }
        const text = await response.text();
        throw new Error(`Failed to update: ${response.status} - ${text}`);
      }

      const result = await response.json();
      console.log('✅ Post updated successfully:', result);

      // Navigate back to travel feed immediately
      console.log('🚀 Navigating back to travel feed');
      setTimeout(() => {
        router.push('/views/travelFeed/[id]');
      }, 500);
      
      // Show success message after navigation is triggered
      Alert.alert('Success', 'Your travel story has been updated!');

    } catch (err: any) {
      console.error('❌ Update error:', err);
      Alert.alert('Error', err.message || 'Failed to update your post.');
    } finally {
      setIsUpdating(false);
      console.log('🔄 ===== UPDATE POST FINISHED =====');
    }
  };

  // Helper function to convert data URI to Blob for web
  const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  // Render search item
  const renderSearchItem = ({ item }: { item: SearchedPlace }) => {
    return (
      <TouchableOpacity 
        style={[styles.searchResultItem, { pointerEvents: 'auto' }]}
        onPress={() => getPlaceDetails(item.place_id)}
      >
        <View style={styles.searchResultContent}>
          <Ionicons name="location-outline" size={20} color="#EAB308" />
          <View style={styles.searchResultText}>
            <Text style={styles.searchResultMain}>
              {item.structured_formatting?.main_text || item.description}
            </Text>
            <Text style={styles.searchResultSecondary}>
              {item.structured_formatting?.secondary_text || 'No details'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EAB308" />
          <Text style={styles.loadingText}>Loading post data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!canEdit()) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.errorContainer}>
          <Ionicons name="time-outline" size={64} color="#EAB308" />
          <Text style={styles.errorTitle}>Edit Time Expired</Text>
          <Text style={styles.errorMessage}>Posts can only be edited within 1 hour of creation.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/views/travelFeed/[id]')}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <LinearGradient
        colors={['#FDE047', '#EAB308']}
        style={styles.gradientHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.push('/views/travelFeed/[id]')}
            style={[styles.headerButton, { pointerEvents: 'auto' }]}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Your Journey</Text>
          <TouchableOpacity
            style={[
              styles.postButton, 
              (isUpdating || !postText.trim()) && styles.postButtonDisabled,
              { pointerEvents: (isUpdating || !postText.trim()) ? 'none' : 'auto' }
            ]}
            onPress={updatePost}
            disabled={isUpdating || !postText.trim()}
          >
            {isUpdating ? (
              <ActivityIndicator color="#fff" size="small" /> 
            ) : (
              <Text style={styles.postButtonText}>Update</Text>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Edit time indicator */}
        {originalPost && (
          <View style={styles.editTimeCard}>
            <Ionicons name="time-outline" size={16} color="#EAB308" />
            <Text style={styles.editTimeText}>
              You can edit this post for {Math.max(0, Math.floor(60 - (new Date().getTime() - new Date(originalPost.createdAt).getTime()) / (1000 * 60)))} more minutes
            </Text>
          </View>
        )}
        
        {/* Post Input */}
        <View style={styles.postInputCard}>
          <View style={styles.userHeader}>
            {currentUser.avatar ? (
              <Image source={{ uri: currentUser.avatar }} style={styles.userAvatar} />
            ) : (
              <View style={[styles.userAvatar, styles.defaultAvatar]}>
                <Ionicons name="person" size={24} color="#fff" />
              </View>
            )}
            <Text style={styles.userName}>{currentUser.name || 'User'}</Text>
          </View>
          
          <TextInput
            style={styles.postInput}
            placeholder="What's on your mind? Share your travel story..."
            placeholderTextColor="#999"
            value={postText}
            onChangeText={setPostText}
            multiline
            textAlignVertical="top"
            maxLength={2000}
          />
          
          <Text style={styles.charCount}>{postText.length}/2000</Text>
        </View>

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
                    { borderColor: category.color, pointerEvents: 'auto' },
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
              style={[styles.clearButton, { pointerEvents: 'auto' }]}
              onPress={() => setSelectedCategories([])}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
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
                    style={[styles.removeMediaBtn, { pointerEvents: 'auto' }]} 
                    onPress={() => removeMedia(idx)}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Location Display */}
        {location && (
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <View style={styles.locationIconContainer}>
                <Ionicons name="location" size={20} color="#EAB308" />
              </View>
              <Text style={styles.locationTitle}>📍 Travel Location</Text>
              <TouchableOpacity 
                style={[styles.removeLocationBtn, { pointerEvents: 'auto' }]}
                onPress={() => setLocation(null)}
              >
                <Ionicons name="close" size={16} color="#666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.locationText}>{location.address}</Text>
            
            {location.city && (
              <Text style={styles.locationSubtext}>
                {location.city}{location.country ? `, ${location.country}` : ''}
              </Text>
            )}
            
            <View style={styles.coordinatesContainer}>
              <Text style={styles.coordinatesText}>
                📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Text>
              <TouchableOpacity 
                style={[styles.viewMapBtn, { pointerEvents: 'auto' }]}
                onPress={() => {
                  const url = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
                  Linking.openURL(url);
                }}
              >
                <Ionicons name="map" size={12} color="#EAB308" />
                <Text style={styles.viewMapText}>View on Map</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionGrid}>
          <Pressable 
            style={[styles.actionCard, styles.mediaAction, { pointerEvents: 'auto' }]} 
            onPress={selectMedia}
          >
            <LinearGradient
              colors={['#FDE047', '#EAB308']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.actionText}>Update Photos</Text>
            </LinearGradient>
          </Pressable>
          
          <Pressable 
            style={[
              styles.actionCard, 
              styles.locationAction,
              isLocationLoading && { opacity: 0.5 },
              { pointerEvents: isLocationLoading ? 'none' : 'auto' }
            ]} 
            onPress={() => setShowLocationOptions(true)}
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
                {isLocationLoading ? 'Finding...' : 'Update Location'}
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
        <View style={[styles.modalOverlay, { pointerEvents: 'auto' }]}>
          <View style={styles.optionsModal}>
            <Text style={styles.optionsTitle}>📍 Update Location</Text>
            <Text style={styles.optionsSubtitle}>Choose how to update your travel location</Text>
            
            <Pressable 
              style={[styles.optionButton, styles.gpsOption, { pointerEvents: isLocationLoading ? 'none' : 'auto' }]}
              onPress={() => {
                setShowLocationOptions(false);
                getCurrentLocation();
              }}
              disabled={isLocationLoading}
            >
              <View style={styles.optionIconContainer}>
                {isLocationLoading ? (
                  <ActivityIndicator color="#EAB308" size="small" />
                ) : (
                  <Ionicons name="navigate" size={24} color="#EAB308" />
                )}
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionButtonTitle}>
                  {isLocationLoading ? 'Finding Location...' : 'Use Current Location'}
                </Text>
                <Text style={styles.optionButtonSubtitle}>
                  Get your exact GPS coordinates
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CA8A04" />
            </Pressable>
            
            <Pressable 
              style={[styles.optionButton, styles.searchOption, { pointerEvents: 'auto' }]}
              onPress={() => {
                setShowLocationOptions(false);
                setShowLocationSearch(true);
              }}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="search" size={24} color="#EAB308" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionButtonTitle}>Search Google Places</Text>
                <Text style={styles.optionButtonSubtitle}>
                  Find any location worldwide
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CA8A04" />
            </Pressable>
            
            <Pressable 
              style={[styles.optionButton, styles.cancelButton, { pointerEvents: 'auto' }]}
              onPress={() => setShowLocationOptions(false)}
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
            <TouchableOpacity 
              onPress={() => setShowLocationSearch(false)}
              style={{ pointerEvents: 'auto' }}
            >
              <Ionicons name="close" size={24} color="#92400e" />
            </TouchableOpacity>
            <Text style={styles.searchTitle}>Search Google Places</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#CA8A04" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search places worldwide..."
              placeholderTextColor="#CA8A04"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {isSearching && <ActivityIndicator color="#EAB308" size="small" />}
          </View>

          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <FlatList
              data={searchResults}
              renderItem={renderSearchItem}
              keyExtractor={(item, index) => `${item.place_id}-${index}`}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View style={{ padding: 20, alignItems: 'center', backgroundColor: '#fef3c7', borderRadius: 8 }}>
                  <Text style={{ color: '#92400e', fontSize: 16, textAlign: 'center', marginBottom: 5 }}>
                    {isSearching ? '🔍 Searching...' : searchQuery.length > 0 ? '❌ No places found' : '🌍 Search millions of places worldwide\n\nPowered by Google Places API\n\nTry: "Eiffel Tower", "Times Square", "Colombo Fort"'}
                  </Text>
                </View>
              )}
            />
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#92400e',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#92400e',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#CA8A04',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#EAB308',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
  headerButton: {
    padding: 4,
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
  editTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  editTimeText: {
    fontSize: 14,
    color: '#92400e',
    marginLeft: 8,
    flex: 1,
  },
  postInputCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#FDE047',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  defaultAvatar: {
    backgroundColor: '#EAB308',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
  },
  postInput: {
    fontSize: 16,
    color: '#78350f',
    minHeight: 100,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#CA8A04',
    textAlign: 'right',
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
  mediaGallery: {
    marginBottom: 4,
  },
  mediaContainer: { 
    position: 'relative', 
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FEF3C7',
    shadowColor: '#FDE047',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  mediaThumb: { 
    width: width * 0.75,
    height: width * 0.75, 
    borderRadius: 14,
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
    borderRadius: 14,
  },
  removeMediaBtn: { 
    position: 'absolute', 
    top: 12, 
    right: 12, 
    backgroundColor: 'rgba(234, 179, 8, 0.9)', 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
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
  locationIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    flex: 1,
  },
  removeLocationBtn: {
    width: 24, 
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: { 
    fontSize: 15,
    fontWeight: '500',
    color: '#78350f',
    marginBottom: 4,
  },
  locationSubtext: { 
    color: '#CA8A04', 
    fontSize: 14,
    marginBottom: 4,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FEF3C7',
  },
  coordinatesText: {
    fontSize: 11,
    color: '#A3A3A3',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    flex: 1,
  },
  viewMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  viewMapText: {
    fontSize: 10,
    color: '#EAB308',
    fontWeight: '500',
    marginLeft: 4,
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
    maxWidth: 350,
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
  gpsOption: {
    backgroundColor: '#FEF3C7',
    borderColor: '#EAB308',
    borderWidth: 2,
  },
  searchOption: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FACC15',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 2,
  },
  optionButtonSubtitle: {
    fontSize: 12,
    color: '#CA8A04',
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
  searchResultItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    shadowColor: '#FDE047',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
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
