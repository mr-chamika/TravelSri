import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import BackButton from '../../../components/ui/backButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Post interface and API response interface
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

interface ApiResponse {
  content: Post[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface MyToken {
  sub: string;
  roles: string[];
  username: string;
  email: string;
  id: string;
}

// API service functions
const API_BASE_URL = 'http://localhost:8080/api';

// Get JWT token and decode it
const getDecodedToken = async (): Promise<MyToken | null> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ No JWT token found in AsyncStorage');
      return null;
    }
    const decoded = jwtDecode<MyToken>(token);
    console.log('🔐 JWT Token decoded successfully, userId:', decoded.id);
    return decoded;
  } catch (error) {
    console.error('❌ Error decoding JWT token:', error);
    return null;
  }
};

const fetchPosts = async (page = 0, size = 10, categoryFilter: string | null = null, userToken: MyToken | null = null): Promise<ApiResponse> => {
  try {
    // Use userId from JWT to fetch user-specific posts
    const userId = userToken?.id || 'user123';
    let url = `${API_BASE_URL}/posts/getPosts/${userId}?page=${page}&size=${size}`;
    
    if (categoryFilter) {
      url += `&category=${encodeURIComponent(categoryFilter)}`;
    }
    
    console.log('📡 Fetching posts from:', url);
    console.log('🔐 Using userId from JWT:', userId);
    
    const headers: any = {
      'Content-Type': 'application/json',
    };
    
    // Add userId header from JWT if available
    if (userToken?.id) {
      headers['X-User-Id'] = userToken.id;
      console.log('✅ Added X-User-Id header with value:', userToken.id);
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log('📦 Received posts:', data.content.length);
    return data;
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    throw error;
  }
};

// Enhanced deletePost API function with extensive debugging
const deletePost = async (postId: string, userToken: MyToken | null = null): Promise<boolean> => {
  console.log('🌐 ===== API DELETE CALL STARTED =====');
  console.log('📄 Post ID:', postId);
  console.log('🔗 URL:', `${API_BASE_URL}/posts/delete/${postId}`);
  console.log('⏰ Timestamp:', new Date().toISOString());
  
  try {
    const headers: any = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Add userId from JWT if available
    if (userToken?.id) {
      headers['X-User-Id'] = userToken.id;
      console.log('🔐 Added X-User-Id header with value:', userToken.id);
    }
    
    const response = await fetch(`${API_BASE_URL}/posts/delete/${postId}`, {
      method: 'DELETE',
      headers: headers,
    });
    
    console.log('📡 Response received:');
    console.log('  - Status:', response.status);
    console.log('  - Status Text:', response.statusText);
    console.log('  - OK:', response.ok);
    console.log('  - Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP Error Response Body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('📦 Response JSON parsed successfully:');
    console.log('  - Full response:', JSON.stringify(result, null, 2));
    console.log('  - Success field:', result.success);
    console.log('  - Message field:', result.message);
    
    return result.success;
  } catch (error: unknown) {
    console.error('❌ API Delete Error Details:');
    console.error('  - Error type:', typeof error);
    if (error instanceof Error) {
      console.error('  - Error name:', error.name);
      console.error('  - Error message:', error.message);
    } else {
      try {
        console.error('  - Error details:', JSON.stringify(error));
      } catch {
        console.error('  - Error details:', String(error));
      }
    }
    console.error('  - Full error:', error);
    throw error;
  } finally {
    console.log('🌐 ===== API DELETE CALL FINISHED =====');
  }
};

// CategoryBadge component
const CategoryBadge = ({ category, onPress }: { category: string; onPress?: (category: string) => void }) => {
  const categoryEmojis: { [key: string]: string } = {
    adventure: '🏔️',
    beach: '🏖️',
    culture: '🏛️',
    food: '🍜',
    nature: '🌲',
    city: '🏙️',
  };
  const categoryColors: { [key: string]: string } = {
    adventure: '#EAB308',
    beach: '#06B6D4',
    culture: '#8B5CF6',
    food: '#F59E0B',
    nature: '#10B981',
    city: '#6B7280',
  };

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={[styles.categoryBadge, { backgroundColor: categoryColors[category.toLowerCase()] || '#E5E7EB' }]}
      onPress={onPress ? () => onPress(category) : undefined}
      activeOpacity={0.7}
    >
      <Text style={styles.categoryEmoji}>{categoryEmojis[category.toLowerCase()] || '✈️'}</Text>
      <Text style={styles.categoryText}>{category}</Text>
    </Component>
  );
};

// CategoriesFilterBar component
const CategoriesFilterBar = ({
  allPosts,
  selectedCategory,
  onSelectCategory,
}: {
  allPosts: Post[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}) => {
  const categoriesSet = new Set<string>();
  allPosts.forEach(post => post.categories?.forEach(cat => categoriesSet.add(cat)));
  const uniqueCategories = Array.from(categoriesSet).sort();

  return (
    <View style={styles.categoriesFilterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
        <TouchableOpacity
          style={[styles.filterCategoryBadge, !selectedCategory && styles.filterCategoryBadgeSelected]}
          onPress={() => onSelectCategory(null)}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterCategoryText, !selectedCategory && styles.filterCategoryTextSelected]}>🌍 All</Text>
        </TouchableOpacity>
        {uniqueCategories.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.filterCategoryBadge, selectedCategory === category && styles.filterCategoryBadgeSelected]}
            onPress={() => onSelectCategory(selectedCategory === category ? null : category)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterCategoryText, selectedCategory === category && styles.filterCategoryTextSelected]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Collage component for images
const Collage = ({ mediaFiles }: { mediaFiles: string[] }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const maxShow = 3;
  const extraCount = mediaFiles.length - maxShow;

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  if (mediaFiles.length === 1) {
    return (
      <>
        <TouchableOpacity activeOpacity={0.8} onPress={() => openModal(0)} style={{ marginBottom: 12 }}>
          <Image 
            source={{ uri: mediaFiles[0] }} 
            style={styles.singleImage} 
            resizeMode="cover"
            onError={(error) => console.log('❌ Single image load error:', error)}
            onLoad={() => console.log('✅ Single image loaded successfully')}
          />
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <FlatList
              horizontal
              pagingEnabled
              data={mediaFiles}
              initialScrollIndex={selectedIndex}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <View style={styles.modalImageWrapper}>
                  <Image source={{ uri: item }} style={styles.modalImage} resizeMode="contain" />
                </View>
              )}
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </>
    );
  }

  return (
    <>
      <View style={styles.collageContainer}>
        {mediaFiles.slice(0, maxShow).map((uri, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => openModal(index)}
            style={[styles.imageWrapper, index === 2 && extraCount > 0 ? styles.lastImageWrapper : null]}
          >
            <Image 
              source={{ uri }} 
              style={styles.collageImage} 
              resizeMode="cover"
              onError={(error) => console.log(`❌ Collage image ${index} load error:`, error)}
              onLoad={() => console.log(`✅ Collage image ${index} loaded successfully`)}
            />
            {index === 2 && extraCount > 0 && (
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>+{extraCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <FlatList
            horizontal
            pagingEnabled
            data={mediaFiles}
            initialScrollIndex={selectedIndex}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.modalImageWrapper}>
                <Image source={{ uri: item }} style={styles.modalImage} resizeMode="contain" />
              </View>
            )}
          />
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

// PostItem component with enhanced debugging
const PostItem = ({
  item,
  currentUserId,
  onCategoryPress,
  onEdit,
  onDelete,
}: {
  item: Post;
  currentUserId: string;
  onCategoryPress: (category: string) => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
}) => {
  const isOwner = item.userId === currentUserId;

  console.log(`📝 Rendering PostItem for post ${item.id}:`);
  console.log(`  - Owner: ${item.userId}`);
  console.log(`  - Current User: ${currentUserId}`);
  console.log(`  - Is Owner: ${isOwner}`);

  const canEdit = () => {
    try {
      const createdAt = new Date(item.createdAt);
      const now = new Date();
      const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
      const diffInHours = diffInMinutes / 60;
      
      console.log(`🔍 Edit Time Check for post ${item.id}:`);
      console.log(`  - Created At: ${item.createdAt}`);
      console.log(`  - Parsed Date: ${createdAt.toISOString()}`);
      console.log(`  - Now: ${now.toISOString()}`);
      console.log(`  - Diff in minutes: ${diffInMinutes}`);
      console.log(`  - Diff in hours: ${diffInHours}`);
      console.log(`  - Is owner: ${isOwner}`);
      console.log(`  - Can edit: ${isOwner && diffInHours <= 1}`);
      
      return isOwner && diffInHours <= 1;
    } catch (error) {
      console.error('❌ Error in canEdit:', error);
      return false;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    } catch {
      return 'Recently';
    }
  };

  const handleEdit = () => {
    if (canEdit()) {
      onEdit(item);
    } else {
      Alert.alert('Edit Not Available', 'Posts can only be edited within 1 hour of creation.', [{ text: 'OK' }]);
    }
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.userAvatar || 'https://via.placeholder.com/50x50/cccccc/ffffff?text=U' }} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.timestamp}>{formatTime(item.createdAt)}</Text>
        </View>
        {isOwner && (
          <View style={styles.postActions}>
            {canEdit() && (
              <TouchableOpacity style={styles.actionIcon} onPress={handleEdit} activeOpacity={0.7}>
                <Ionicons name="create-outline" size={20} color="#000000ff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.actionIcon} 
              onPress={() => {
                console.log('🖱️ ===== DELETE BUTTON PRESSED =====');
                console.log('📄 Post ID:', item.id);
                console.log('👤 Current user ID:', currentUserId);
                console.log('👤 Post owner ID:', item.userId);
                console.log('🔒 Is owner:', isOwner);
                console.log('🎯 Calling onDelete function...');
                onDelete(item.id);
              }} 
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {isOwner && canEdit() && (() => {
        const remainingMinutes = Math.max(
          0,
          Math.floor(60 - (new Date().getTime() - new Date(item.createdAt).getTime()) / (1000 * 60))
        );
        return (
          <View style={styles.editIndicator}>
            <Ionicons name="time-outline" size={12} color="#ffd900ff" />
            <Text style={styles.editIndicatorText}>
              Can edit for {remainingMinutes} more minute{remainingMinutes !== 1 ? 's' : ''}
            </Text>
          </View>
        );
      })()}

      {item.title && <Text style={styles.postTitle}>{item.title}</Text>}

      <Text style={styles.postContent}>{item.content}</Text>

      {item.categories && item.categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          {item.categories.map((category, index) => (
            <CategoryBadge key={index} category={category} onPress={onCategoryPress} />
          ))}
        </View>
      )}

      {(item.address || item.city || item.country) && (
        <TouchableOpacity style={styles.locationContainer}>
          <Ionicons name="location" size={16} color="#0369a1" />
          <Text style={styles.locationText} numberOfLines={2}>
            {[item.address, item.city, item.country].filter(Boolean).join(', ')}
          </Text>
        </TouchableOpacity>
      )}

      {item.mediaFiles?.length > 0 && <Collage mediaFiles={item.mediaFiles} />}
    </View>
  );
};

export default function TravelFeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // JWT token state
  const [userToken, setUserToken] = useState<MyToken | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('user123');
  
  const navigation = useNavigation() as any;

  // Load JWT token on component mount
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await getDecodedToken();
        if (token) {
          setUserToken(token);
          setCurrentUserId(token.id);
          console.log('✅ JWT token loaded successfully, userId:', token.id);
        } else {
          console.warn('⚠️ Failed to load JWT token');
          setCurrentUserId('user123'); // Fallback
        }
      } catch (error) {
        console.error('❌ Error loading JWT token:', error);
        setCurrentUserId('user123'); // Fallback
      }
    };
    
    loadToken();
  }, []);

  const loadPosts = async (isRefresh = false) => {
    console.log('📊 ===== LOAD POSTS STARTED =====');
    console.log('🔄 Is refresh:', isRefresh);
    console.log('📄 Current page:', page);
    console.log('🏷️ Selected category:', selectedCategory);
    console.log('🔐 Using userToken:', userToken?.id || 'Not loaded');

    if (loading && !isRefresh) return;
    if (!isRefresh && !hasMoreData) return;

    if (isRefresh) {
      setRefreshing(true);
      setPage(0);
      setHasMoreData(true);
      setError(null);
    } else {
      setLoading(true);
    }

    try {
      const currentPage = isRefresh ? 0 : page;
      const response = await fetchPosts(currentPage, 10, selectedCategory, userToken);

      console.log('📊 Posts received from API:', response.content.length);
      console.log('📋 Post IDs received:', response.content.map(p => `${p.id} (${p.userName})`));

      if (isRefresh) {
        setPosts(response.content);
        if (!selectedCategory) setAllPosts(response.content);
        console.log('🔄 Posts state refreshed');
      } else {
        setPosts(prev => {
          const newPosts = [...prev, ...response.content];
          console.log('➕ Posts appended, new total:', newPosts.length);
          return newPosts;
        });
        if (!selectedCategory) setAllPosts(prev => [...prev, ...response.content]);
      }

      const isLastPage = currentPage >= response.totalPages - 1;
      const hasLessData = response.content.length < 10;
      setHasMoreData(!isLastPage && !hasLessData);
      setPage(currentPage + 1);
      setError(null);
    } catch (error: any) {
      console.error('❌ Error loading posts:', error);
      setHasMoreData(false);
      const errorMessage = error.message || 'Failed to load posts';
      setError(errorMessage);
      if (isRefresh || page === 0) {
        Alert.alert('Connection Error', `${errorMessage}\n\nPlease check your internet connection and server status.`);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      console.log('📊 ===== LOAD POSTS FINISHED =====');
    }
  };

  const handleCategoryFilter = (category: string | null) => {
    console.log('🏷️ Category filter changed to:', category);
    setSelectedCategory(category);
    setPage(0);
    setHasMoreData(true);
    setPosts([]);
    loadPosts(true);
  };

  const handleCategoryPress = (category: string) => {
    handleCategoryFilter(category);
  };

  const handleEdit = (post: Post) => {
    try {
      router.push({
        pathname: '/views/travelFeed/editPost/[id]',
        params: { id: post.id }
      });
    } catch {
      Alert.alert('Navigation Error', 'Unable to navigate to edit screen.');
    }
  };

  // Updated handleDelete with custom modal
  const handleDelete = (postId: string) => {
    console.log('🗑️ ===== HANDLE DELETE STARTED =====');
    console.log('📄 Post ID to delete:', postId);
    console.log('📊 Current posts count:', posts.length);
    console.log('📊 Current allPosts count:', allPosts.length);
    console.log('📋 Current post IDs:', posts.map(p => p.id));
    
    console.log('🚨 Setting up custom confirmation dialog...');
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    
    console.log('✅ ===== USER CONFIRMED DELETE =====');
    console.log('🔄 Starting delete API call...');
    
    setShowDeleteModal(false);
    
    try {
      console.log('📊 State before API call:');
      console.log('  - Posts count:', posts.length);
      console.log('  - AllPosts count:', allPosts.length);
      console.log('  - Target post ID:', postToDelete);
      
      console.log('🌐 Calling deletePost API...');
      const success = await deletePost(postToDelete, userToken);
      console.log('📋 Delete API completed with result:', success);
      
      if (success) {
        console.log('✅ Delete successful, updating UI state...');
        
        const postsBeforeFilter = posts.length;
        const allPostsBeforeFilter = allPosts.length;
        
        console.log('🔍 Filtering posts array...');
        const newPosts = posts.filter(post => {
          const keep = post.id !== postToDelete;
          if (!keep) {
            console.log('🗑️ Removing post from posts array:', post.id);
          }
          return keep;
        });
        
        console.log('🔍 Filtering allPosts array...');
        const newAllPosts = allPosts.filter(post => {
          const keep = post.id !== postToDelete;
          if (!keep) {
            console.log('🗑️ Removing post from allPosts array:', post.id);
          }
          return keep;
        });
        
        console.log('📊 Arrays filtered successfully:');
        console.log('  - Posts: before =', postsBeforeFilter, ', after =', newPosts.length);
        console.log('  - AllPosts: before =', allPostsBeforeFilter, ', after =', newAllPosts.length);
        console.log('  - Remaining post IDs:', newPosts.map(p => p.id));
        
        console.log('🔄 Updating state with setPosts...');
        setPosts(newPosts);
        
        console.log('🔄 Updating state with setAllPosts...');
        setAllPosts(newAllPosts);
        
        console.log('🎉 UI state updated successfully');
        Alert.alert('Success', 'Post deleted successfully.');
      } else {
        console.log('❌ Delete API returned false');
        Alert.alert('Error', 'Failed to delete post. Server returned false.');
      }
    } catch (error: any) {
      console.error('❌ Delete operation failed:');
      console.error('  - Error type:', typeof error);
      console.error('  - Error name:', error?.name);
      console.error('  - Error message:', error?.message);
      console.error('  - Full error:', error);
      
      Alert.alert('Error', `Failed to delete post: ${error?.message || 'Unknown error'}`);
    } finally {
      setPostToDelete(null);
      console.log('🗑️ ===== HANDLE DELETE FINISHED =====');
    }
  };

  const cancelDelete = () => {
    console.log('🚫 User cancelled delete operation');
    setShowDeleteModal(false);
    setPostToDelete(null);
    console.log('🗑️ ===== HANDLE DELETE CANCELLED =====');
  };

  const handleLoadMore = () => {
    if (hasMoreData && !loading && !refreshing && !error) {
      console.log('📄 Loading more posts...');
      loadPosts();
    }
  };

  const navigateToCreatePost = () => {
    try {
      router.push({
        pathname: '/views/travelFeed/createPost/[id]',
        params: { id: currentUserId }
      });
    } catch {
      Alert.alert('Navigation Error', 'Unable to navigate to Create Post screen.');
    }
  };

  const retryLoading = () => {
    setError(null);
    setHasMoreData(true);
    loadPosts(true);
  };

  useEffect(() => {
    console.log('🚀 TravelFeedScreen mounted, loading initial posts...');
    loadPosts(true);
  }, []);

  const renderFooter = () => {
    if (error && posts.length === 0) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retryLoading}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (loading) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color="#ffd900ff" />
          <Text style={styles.loadingText}>Loading more posts...</Text>
        </View>
      );
    }
    if (!hasMoreData && posts.length > 0) {
      return (
        <View style={styles.endContainer}>
          <Text style={styles.endText}>
            🎉 {selectedCategory ? `You've seen all ${selectedCategory} stories!` : `You've seen all travel stories!`}
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="airplane-outline" size={64} color="#9ca3af" />
      <Text style={styles.emptyTitle}>
        {selectedCategory ? `No ${selectedCategory} stories yet` : 'No travel stories yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {selectedCategory ? `Be the first to share your ${selectedCategory} experience!` : 'Be the first to share your amazing journey!'}
      </Text>
      <TouchableOpacity style={styles.createFirstButton} onPress={navigateToCreatePost}>
        <Text style={styles.createFirstButtonText}>Share Your Story</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <BackButton />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Travel Stories {selectedCategory && `• ${selectedCategory}`}
          </Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => Alert.alert('Search', 'Search functionality')}>
              <Ionicons name="search-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => loadPosts(true)}>
              <Ionicons name="refresh-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <CategoriesFilterBar allPosts={allPosts} selectedCategory={selectedCategory} onSelectCategory={handleCategoryFilter} />

        <FlatList
          data={posts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <PostItem item={item} currentUserId={currentUserId} onCategoryPress={handleCategoryPress} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => loadPosts(true)} colors={['#ffd900ff']} tintColor="#ffd900ff" title="Pull to refresh" />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!loading && !refreshing && posts.length === 0 ? renderEmpty : null}
          ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
        />

        {/* Custom Delete Confirmation Modal */}
        <Modal
          visible={showDeleteModal}
          transparent
          animationType="fade"
          onRequestClose={cancelDelete}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.deleteModalContainer}>
              <Text style={styles.deleteModalTitle}>Delete Post</Text>
              <Text style={styles.deleteModalMessage}>
                Are you sure you want to delete this post? This action cannot be undone.
              </Text>
              <View style={styles.deleteModalButtons}>
                <TouchableOpacity
                  style={[styles.deleteModalButton, styles.cancelButton]}
                  onPress={cancelDelete}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.deleteModalButton, styles.deleteButton]}
                  onPress={confirmDelete}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <TouchableOpacity style={styles.fab} onPress={navigateToCreatePost} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 40,
    flex: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 40,
  },
  categoriesFilterContainer: {
    marginBottom: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 4,
  },
  filterCategoryBadge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterCategoryBadgeSelected: {
    backgroundColor: '#ffd900ff',
    borderColor: '#ffd900ff',
  },
  filterCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  filterCategoryTextSelected: {
    color: '#000000ff',
  },
  postContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    padding: 8,
    marginLeft: 4,
  },
  editIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  editIndicatorText: {
    fontSize: 12,
    color: '#a78e00ff',
    marginLeft: 4,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  postContent: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  categoryEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: '#0369a1',
    flex: 1,
    marginLeft: 6,
  },
  singleImage: {
    width: width - 32,
    height: 250,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  collageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  lastImageWrapper: {
    position: 'relative',
  },
  collageImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  imageWrapper: {
    width: (width - 64) / 3,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageWrapper: {
    width,
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: '#00000080',
    borderRadius: 20,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 8,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
  },
  createFirstButton: {
    backgroundColor: '#ffd900ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  createFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  retryButton: {
    backgroundColor: '#ffd900ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  endContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#ffd900ff',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 99,
  },
  
  // Custom Delete Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: width - 64,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  deleteModalMessage: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  deleteModalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
