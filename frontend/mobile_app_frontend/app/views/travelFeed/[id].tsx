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
} from 'react-native';
import BackButton from '../../../components/ui/backButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Updated interface to match your Post model
interface Post {
  id: string;
  title: string;
  content: string;
  categories: string[];
  
  // User info
  userId: string;
  userName: string;
  userAvatar?: string;
  
  // Media files
  mediaFiles: string[];
  
  // Location
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  country?: string;
  
  // Engagement
  likes: string[];
  likeCount: number;
  
  // Timestamps
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

// API service functions
const API_BASE_URL = 'http://localhost:8080/api';

// Updated fetchPosts to support category filtering
const fetchPosts = async (page = 0, size = 10, categoryFilter: string | null = null): Promise<ApiResponse> => {
  try {
    let url = `${API_BASE_URL}/posts/getPosts?page=${page}&size=${size}`;
    if (categoryFilter) {
      url += `&category=${encodeURIComponent(categoryFilter)}`;
    }
    
    console.log(`📡 Fetching posts: page=${page}, size=${size}, category=${categoryFilter || 'all'}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched ${data.content?.length || 0} posts`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    throw error;
  }
};

const toggleLikePost = async (postId: string, userId: string): Promise<{ isLiked: boolean }> => {
  try {
    console.log(`👍 Toggling like for post ${postId} by user ${userId}`);
    const response = await fetch(`${API_BASE_URL}/posts/like/${postId}?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`✅ Like toggled: ${result.isLiked ? 'liked' : 'unliked'}`);
    return result;
  } catch (error) {
    console.error('❌ Error toggling like:', error);
    throw error;
  }
};

// Category Badge Component (Now clickable in posts)
const CategoryBadge = ({ 
  category, 
  onPress 
}: { 
  category: string; 
  onPress?: (category: string) => void;
}) => {
  const getCategoryEmoji = (cat: string) => {
    const categoryEmojis: { [key: string]: string } = {
      adventure: '🏔️',
      beach: '🏖️',
      culture: '🏛️',
      food: '🍜',
      nature: '🌲',
      city: '🏙️',
    };
    return categoryEmojis[cat.toLowerCase()] || '✈️';
  };

  const getCategoryColor = (cat: string) => {
    const categoryColors: { [key: string]: string } = {
      adventure: '#EAB308',
      beach: '#FACC15',
      culture: '#FDE047',
      food: '#FEF08A',
      nature: '#FCD34D',
      city: '#FBBF24',
    };
    return categoryColors[cat.toLowerCase()] || '#E5E7EB';
  };

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component 
      style={[styles.categoryBadge, { backgroundColor: getCategoryColor(category) }]}
      onPress={onPress ? () => onPress(category) : undefined}
      activeOpacity={0.7}
    >
      <Text style={styles.categoryEmoji}>{getCategoryEmoji(category)}</Text>
      <Text style={styles.categoryText}>{category}</Text>
    </Component>
  );
};

// Categories Filter Bar Component
const CategoriesFilterBar = ({
  allPosts,
  selectedCategory,
  onSelectCategory,
}: {
  allPosts: Post[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}) => {
  // Extract unique categories from all posts
  const categoriesSet = new Set<string>();
  allPosts.forEach(post => {
    post.categories?.forEach(cat => categoriesSet.add(cat));
  });
  const uniqueCategories = Array.from(categoriesSet).sort();

  const getCategoryEmoji = (cat: string) => {
    const categoryEmojis: { [key: string]: string } = {
      adventure: '🏔️',
      beach: '🏖️',
      culture: '🏛️',
      food: '🍜',
      nature: '🌲',
      city: '🏙️',
    };
    return categoryEmojis[cat.toLowerCase()] || '✈️';
  };

  return (
    <View style={styles.categoriesFilterContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {/* All Categories Button */}
        <TouchableOpacity
          style={[
            styles.filterCategoryBadge,
            !selectedCategory && styles.filterCategoryBadgeSelected
          ]}
          onPress={() => onSelectCategory(null)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.filterCategoryText,
            !selectedCategory && styles.filterCategoryTextSelected
          ]}>
            🌍 All
          </Text>
        </TouchableOpacity>

        {/* Individual Category Buttons */}
        {uniqueCategories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterCategoryBadge,
              selectedCategory === category && styles.filterCategoryBadgeSelected
            ]}
            onPress={() => onSelectCategory(selectedCategory === category ? null : category)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.filterCategoryText,
              selectedCategory === category && styles.filterCategoryTextSelected
            ]}>
              {getCategoryEmoji(category)} {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Post Item Component (Updated with clickable categories)
const PostItem = ({
  item,
  currentUserId,
  onLike,
  onCategoryPress,
}: {
  item: Post;
  currentUserId: string;
  onLike: (postId: string) => void;
  onCategoryPress: (category: string) => void;
}) => {
  const isLiked = item.likes?.includes(currentUserId) || false;

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
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    } catch (error) {
      return 'Recently';
    }
  };

  const getMediaUrl = (filename: string) => {
    return `${API_BASE_URL.replace('/api', '')}/uploads/posts/${filename}`;
  };

  const isVideoFile = (filename: string) => {
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
    return videoExtensions.some(ext => filename.toLowerCase().includes(ext));
  };

  return (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image
          source={{
            uri: item.userAvatar || 'https://via.placeholder.com/50x50/cccccc/ffffff?text=U',
          }}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.timestamp}>{formatTime(item.createdAt)}</Text>
        </View>
      </View>

      {/* Post Title */}
      {item.title && <Text style={styles.postTitle}>{item.title}</Text>}
      
      {/* Post Content */}
      <Text style={styles.postContent}>{item.content}</Text>

      {/* Categories (Now clickable) */}
      {item.categories && item.categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          {item.categories.map((category, index) => (
            <CategoryBadge 
              key={index} 
              category={category} 
              onPress={onCategoryPress}
            />
          ))}
        </View>
      )}

      {/* Location */}
      {(item.address || item.city || item.country) && (
        <TouchableOpacity style={styles.locationContainer}>
          <Ionicons name="location" size={16} color="#0369a1" />
          <Text style={styles.locationText} numberOfLines={2}>
            {[item.address, item.city, item.country].filter(Boolean).join(', ')}
          </Text>
        </TouchableOpacity>
      )}

      {/* Media Files */}
      {item.mediaFiles && item.mediaFiles.length > 0 && (
        <View style={styles.mediaContainer}>
          <FlatList
            horizontal
            data={item.mediaFiles}
            keyExtractor={(filename, index) => `${item.id}_media_${index}`}
            renderItem={({ item: filename }) => {
              const mediaUrl = getMediaUrl(filename);
              
              if (isVideoFile(filename)) {
                return (
                  <View style={styles.mediaWrapper}>
                    <Video
                      source={{ uri: mediaUrl }}
                      style={styles.postMedia}
                      useNativeControls
                      resizeMode={ResizeMode.COVER}
                      shouldPlay={false}
                    />
                    <View style={styles.videoOverlay}>
                      <Ionicons name="play-circle" size={32} color="#fff" />
                    </View>
                  </View>
                );
              } else {
                return (
                  <Image
                    source={{ uri: mediaUrl }}
                    style={styles.postMedia}
                    onError={(error) => console.log('Failed to load image:', mediaUrl, error)}
                  />
                );
              }
            }}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          />
        </View>
      )}

      {/* Action Container - Only Like Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onLike(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={isLiked ? "#ef4444" : "#6b7280"} 
          />
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {item.likeCount || 0} {item.likeCount === 1 ? 'like' : 'likes'}
          </Text>
        </TouchableOpacity>

        {/* Bookmark option */}
        <TouchableOpacity style={[styles.actionButton, { marginLeft: 'auto' }]} activeOpacity={0.7}>
          <Ionicons name="bookmark-outline" size={22} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main Screen Component (Updated with category filtering)
export default function TravelFeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]); // Store all posts for category extraction
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const currentUserId = 'user123';
  const navigation = useNavigation() as any;

  const loadPosts = async (isRefresh = false) => {
    if (loading && !isRefresh) return;
    if (!isRefresh && !hasMoreData) return;

    console.log(`📊 Loading posts: refresh=${isRefresh}, page=${isRefresh ? 0 : page}, category=${selectedCategory || 'all'}`);

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
      const response = await fetchPosts(currentPage, 10, selectedCategory);

      if (isRefresh) {
        setPosts(response.content);
        // Store all posts separately for category filtering (only on first load)
        if (!selectedCategory) {
          setAllPosts(response.content);
        }
      } else {
        setPosts(prev => [...prev, ...response.content]);
        // Update allPosts with new posts (only if no category filter)
        if (!selectedCategory) {
          setAllPosts(prev => [...prev, ...response.content]);
        }
      }

      const isLastPage = currentPage >= response.totalPages - 1;
      const hasLessData = response.content.length < 10;
      setHasMoreData(!isLastPage && !hasLessData);
      setPage(currentPage + 1);
      setError(null);

      console.log(`✅ Posts loaded: ${response.content.length}, hasMore: ${!isLastPage && !hasLessData}`);

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
    }
  };

  const handleCategoryFilter = (category: string | null) => {
    console.log(`🏷️ Category filter selected: ${category || 'all'}`);
    setSelectedCategory(category);
    setPage(0);
    setHasMoreData(true);
    setPosts([]);
    loadPosts(true);
  };

  const handleCategoryPress = (category: string) => {
    console.log(`🏷️ Category badge clicked: ${category}`);
    handleCategoryFilter(category);
  };

  const handleLike = async (postId: string) => {
    console.log(`🎯 Like button pressed for post: ${postId}`);
    
    try {
      const response = await toggleLikePost(postId, currentUserId);

      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                likes: response.isLiked
                  ? [...(post.likes || []), currentUserId]
                  : (post.likes || []).filter(id => id !== currentUserId),
                likeCount: response.isLiked
                  ? (post.likeCount || 0) + 1
                  : Math.max((post.likeCount || 0) - 1, 0),
              }
            : post
        )
      );
    } catch (error) {
      console.error('❌ Error toggling like:', error);
      Alert.alert('Error', 'Failed to update like. Please try again.');
    }
  };

  const handleLoadMore = () => {
    if (hasMoreData && !loading && !refreshing && !error) {
      console.log('📄 Loading more posts...');
      loadPosts();
    }
  };

  const navigateToCreatePost = () => {
    console.log('➕ Create Post button pressed');
    
    try {
      if (navigation.isFocused()) {
        router.push('/views/travelFeed/createPost');
      } else {
        Alert.alert('Navigation Error', 'Screen is not focused. Please try again.');
      }
    } catch (error) {
      console.error('❌ Navigation error:', error);
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
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Loading more posts...</Text>
        </View>
      );
    }

    if (!hasMoreData && posts.length > 0) {
      return (
        <View style={styles.endContainer}>
          <Text style={styles.endText}>
            🎉 {selectedCategory 
              ? `You've seen all ${selectedCategory} stories!` 
              : `You've seen all travel stories!`
            }
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
        {selectedCategory 
          ? `No ${selectedCategory} stories yet` 
          : 'No travel stories yet'
        }
      </Text>
      <Text style={styles.emptySubtitle}>
        {selectedCategory 
          ? `Be the first to share your ${selectedCategory} experience!`
          : 'Be the first to share your amazing journey!'
        }
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
            <TouchableOpacity onPress={() => Alert.alert('Notifications', 'Notifications')}>
              <Ionicons name="notifications-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Filter Bar */}
        <CategoriesFilterBar
          allPosts={allPosts}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryFilter}
        />

        <FlatList
          data={posts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <PostItem
              item={item}
              currentUserId={currentUserId}
              onLike={handleLike}
              onCategoryPress={handleCategoryPress}
            />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadPosts(true)}
              colors={['#007AFF']}
              tintColor="#007AFF"
              title="Pull to refresh"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!loading && !refreshing && posts.length === 0 ? renderEmpty : null}
          ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
        />
      </View>

      {/* Enhanced Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={navigateToCreatePost}
        activeOpacity={0.85}
      >
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
  // Categories Filter Bar Styles
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
    backgroundColor: '#007AFF',
    borderColor: '#0056b3',
  },
  filterCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  filterCategoryTextSelected: {
    color: '#ffffff',
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
    color: '#92400e',
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
  mediaContainer: {
    marginBottom: 12,
  },
  mediaWrapper: {
    position: 'relative',
  },
  postMedia: {
    width: width - 80,
    height: 200,
    borderRadius: 8,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  likedText: {
    color: '#ef4444',
    fontWeight: '500',
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
    backgroundColor: '#007AFF',
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
    backgroundColor: '#007AFF',
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
    backgroundColor: '#007AFF',
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
});
