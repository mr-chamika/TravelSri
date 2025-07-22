import React, { useState } from 'react';

import { View, Text, Image, FlatList, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import BackButton from '../../../components/ui/backButton';

import Topbar from '../../../components/Topbar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Define reaction types
type ReactionType = 'like' | 'haha' | 'heart' | 'care';

interface Reactions {
  like: number;
  haha: number;
  heart: number;
  care: number;
}

interface UserReaction {
  [postId: number]: ReactionType | null;
}

// Define a type for a single post object
interface Post {
  id: number;
  name: string;
  timestamp: string;
  content: string;
  imageUrl: string;
  profileUrl: string;
  reactions: Reactions;
}

// Realistic travel feed data with actual travel content
const initialPosts: Post[] = [
  {
    id: 1,
    name: 'Senali Perera',
    timestamp: '2 hours ago',
    content: 'Just witnessed the most incredible sunrise over Santorini! The blue domes and white buildings create such a magical contrast against the golden sky. Already planning my next Greek island adventure! 🌅',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop&crop=center',
    profileUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    reactions: { like: 24, haha: 3, heart: 18, care: 2 },
  },
  {
    id: 2,
    name: 'Mark Dais',
    timestamp: '5 hours ago',
    content: 'Hiking through the Amazon rainforest has been absolutely mind-blowing! The biodiversity here is incredible - spotted three different species of monkeys and countless exotic birds today. Nature never fails to amaze me! 🌿🐒',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop&crop=center',
    profileUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    reactions: { like: 31, haha: 5, heart: 12, care: 8 },
  },
  {
    id: 3,
    name: 'Nilu Adhikari',
    timestamp: '1 day ago',
    content: 'Street food tour through Bangkok was absolutely incredible! From pad thai to mango sticky rice, every bite was a flavor explosion. The vendors here are true artists! Already missing the bustling energy of these markets 🍜✨',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center',
    profileUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    reactions: { like: 45, haha: 12, heart: 6, care: 1 },
  },
  {
    id: 4,
    name: 'Kapila Senewirathna',
    timestamp: '2 days ago',
    content: 'Finally made it to the Northern Lights in Iceland! After three cloudy nights, the aurora borealis decided to put on the most spectacular show. Dancing green curtains across the entire sky - absolutely magical! 💚',
    imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop&crop=center',
    profileUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    reactions: { like: 67, haha: 2, heart: 23, care: 4 },
  },
  {
    id: 5,
    name: 'Priya Senadheera',
    timestamp: '3 days ago',
    content: 'Exploring the ancient temples of Angkor Wat at sunrise was a spiritual experience like no other. The intricate carvings and massive stone structures are testament to incredible craftsmanship. Cambodia has truly stolen my heart! 🏛️',
    imageUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&h=400&fit=crop&crop=center',
    profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    reactions: { like: 38, haha: 1, heart: 29, care: 7 },
  },
  
];

// Helper function to get total reactions
const getTotalReactions = (reactions: Reactions): number => {
  return reactions.like + reactions.haha + reactions.heart + reactions.care;
};

// Helper function to get reaction emoji
const getReactionEmoji = (type: ReactionType): string => {
  const emojis = {
    like: '👍',
    haha: '😂',
    heart: '❤️',
    care: '🤗'
  };
  return emojis[type];
};

// Post Item Component
const PostItem = ({ item, userReaction, onReaction }: { 
  item: Post; 
  userReaction: ReactionType | null; 
  onReaction: (postId: number, reactionType: ReactionType) => void;
}) => {
  const totalReactions = getTotalReactions(item.reactions);
  
  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image
          source={{ uri: item.profileUrl }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.postImage}
      />
      
      {/* Reaction Summary */}
      {totalReactions > 0 && (
        <View style={styles.reactionSummary}>
          <View style={styles.reactionEmojis}>
            {item.reactions.like > 0 && <Text style={styles.reactionEmoji}>👍</Text>}
            {item.reactions.heart > 0 && <Text style={styles.reactionEmoji}>❤️</Text>}
            {item.reactions.haha > 0 && <Text style={styles.reactionEmoji}>😂</Text>}
            {item.reactions.care > 0 && <Text style={styles.reactionEmoji}>🤗</Text>}
          </View>
          <Text style={styles.reactionCount}>{totalReactions}</Text>
        </View>
      )}
      
      {/* Reaction Buttons */}
      <View style={styles.reactionButtons}>
        <TouchableOpacity 
          style={[styles.reactionButton, userReaction === 'like' && styles.reactionButtonActive]}
          onPress={() => onReaction(item.id, 'like')}
        >
          <Text style={[styles.reactionButtonText, userReaction === 'like' && styles.reactionButtonTextActive]}>
            👍 Like {item.reactions.like > 0 && `(${item.reactions.like})`}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.reactionButton, userReaction === 'haha' && styles.reactionButtonActive]}
          onPress={() => onReaction(item.id, 'haha')}
        >
          <Text style={[styles.reactionButtonText, userReaction === 'haha' && styles.reactionButtonTextActive]}>
            😂 Haha {item.reactions.haha > 0 && `(${item.reactions.haha})`}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.reactionButton, userReaction === 'heart' && styles.reactionButtonActive]}
          onPress={() => onReaction(item.id, 'heart')}
        >
          <Text style={[styles.reactionButtonText, userReaction === 'heart' && styles.reactionButtonTextActive]}>
            ❤️ Love {item.reactions.heart > 0 && `(${item.reactions.heart})`}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.reactionButton, userReaction === 'care' && styles.reactionButtonActive]}
          onPress={() => onReaction(item.id, 'care')}
        >
          <Text style={[styles.reactionButtonText, userReaction === 'care' && styles.reactionButtonTextActive]}>
            🤗 Care {item.reactions.care > 0 && `(${item.reactions.care})`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main Screen Component
export default function TravelFeedScreen() {
  // All hooks must be inside the component
  const [show, setShow] = useState(false);
  const [notify, setNotify] = useState(false);
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState(initialPosts);
  const [userReactions, setUserReactions] = useState<UserReaction>({});
  const translateX = useSharedValue(-1000);
  const opacity = useSharedValue(0);

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const toggleMenu = () => {
    setShow(!show);
    if (!show) {
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(1, { duration: 400 });
    } else {
      translateX.value = withTiming(-1000, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(0, { duration: 300 });
    }
  };

  const toggling = () => {
    setNotify(!notify);
  };

  const handleImageUpload = () => {
    // Simulate image upload - in a real app, you'd use image picker
    Alert.alert(
      "Photo Upload",
      "Choose an option",
      [
        { text: "Camera", onPress: () => console.log("Camera selected") },
        { text: "Gallery", onPress: () => console.log("Gallery selected") },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handlePost = () => {
    if (postText.trim()) {
      const newPost: Post = {
        id: Date.now(),
        name: 'You', // In a real app, this would be the current user's name
        timestamp: 'Just now',
        content: postText.trim(),
        imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop&crop=center', // Default travel image
        profileUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face', // Default user avatar
        reactions: { like: 0, haha: 0, heart: 0, care: 0 },
      };
      
      setPosts([newPost, ...posts]);
      setPostText('');
    }
  };

  const handleReaction = (postId: number, reactionType: ReactionType) => {
    const currentUserReaction = userReactions[postId];
    
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newReactions = { ...post.reactions };
          
          // If user already reacted with this type, remove it
          if (currentUserReaction === reactionType) {
            newReactions[reactionType] = Math.max(0, newReactions[reactionType] - 1);
            setUserReactions(prev => ({ ...prev, [postId]: null }));
          } else {
            // If user had a different reaction, decrease that count
            if (currentUserReaction) {
              newReactions[currentUserReaction] = Math.max(0, newReactions[currentUserReaction] - 1);
            }
            // Add new reaction
            newReactions[reactionType] += 1;
            setUserReactions(prev => ({ ...prev, [postId]: reactionType }));
          }
          
          return { ...post, reactions: newReactions };
        }
        return post;
      })
    );
  };

  const getReactionEmoji = (type: ReactionType): string => {
    const emojis = {
      like: '👍',
      haha: '😂',
      heart: '❤️',
      care: '🤗'
    };
    return emojis[type];
  };

  const getTotalReactions = (reactions: Reactions): number => {
    return reactions.like + reactions.haha + reactions.heart + reactions.care;
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <Topbar pressing={toggleMenu} notifying={toggling} on={notify} /> */}
      
      <View style={styles.container}>
        <BackButton />
        
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostItem 
              item={item} 
              userReaction={userReactions[item.id] || null}
              onReaction={handleReaction}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          ListHeaderComponent={
            <>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Where did you travel?</Text>
                <View style={styles.headerIcons}>
                  <Image
                    source={require('../../../assets/images/share.png')} // Make sure this path is correct
                    style={styles.icon}
                  />
                  <Image
                    source={require('../../../assets/images/more.png')} // Make sure this path is correct
                    style={styles.icon}
                  />
                </View>
              </View>

              {/* Post Creation Section */}
              <View style={styles.postCreator}>
                <View style={styles.postCreatorHeader}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face' }}
                    style={styles.userProfileImage}
                  />
                  <TextInput
                    style={styles.postInput}
                    placeholder="Share your travel adventures..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    value={postText}
                    onChangeText={setPostText}
                  />
                </View>
                
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.actionButton} onPress={handleImageUpload}>
                    <Text style={styles.actionText}>📷 Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>📍 Location</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>😊 Feeling</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.postButton, !postText.trim() && styles.postButtonDisabled]} 
                    onPress={handlePost}
                    disabled={!postText.trim()}
                  >
                    <Text style={[styles.postButtonText, !postText.trim() && styles.postButtonTextDisabled]}>
                      Post
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 40
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  postContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  timestamp: {
    fontSize: 14,
    color: '#6b7280',
  },
  postContent: {
    marginTop: 8,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  postImage: {
    marginTop: 16,
    width: '100%',
    height: 192,
    borderRadius: 8,
  },
  postCreator: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  postCreatorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    minHeight: 60,
    textAlignVertical: 'top',
    paddingVertical: 8,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f9fafb',
  },
  actionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  postButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  postButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  postButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  postButtonTextDisabled: {
    color: '#9ca3af',
  },
  reactionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  reactionEmojis: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  reactionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
  },
  reactionButtonActive: {
    backgroundColor: '#dbeafe',
  },
  reactionButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  reactionButtonTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});