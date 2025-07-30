import React, { useState } from 'react';

import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import BackButton from '../../../components/ui/backButton';



import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Define a type for a single post object
interface Post {
  id: number;
  name: string;
  timestamp: string;
  content: string;
  imageUrl: string;
}

// Sample data for posts with the Post type
const posts: Post[] = [
  {
    id: 1,
    name: 'Kriston Watshon',
    timestamp: '08:39 am',
    content:
      'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Fringilla Natoque Id Aenean.',
    imageUrl: 'https://source.unsplash.com/random/300x200/?nature',
  },
  {
    id: 2,
    name: 'Kriston Watshon',
    timestamp: '08:39 am',
    content:
      'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Fringilla Natoque Id Aenean.',
    imageUrl: 'https://source.unsplash.com/random/300x200/?bridge',
  },
];



const [show, setShow] = useState(false);
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

// Post Item Component
const PostItem = ({ item }: { item: Post }) => {
  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image
          source={{ uri: 'https://source.unsplash.com/random/50x50/?profile' }}
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
    </View>
  );
};

const [notify, setNotify] = useState(false);

const toggling = () => {
  setNotify(!notify);
};

// Main Screen Component
export default function TravelFeedScreen() {

  return (
    <SafeAreaView>
      {/* <Topbar pressing={toggleMenu} notifying={toggling} on={notify} /> */}

      <View style={styles.container}>
        <BackButton />
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

        {/* Posts List */}
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PostItem item={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
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
});