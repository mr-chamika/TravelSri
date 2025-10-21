import { Text, TouchableOpacity, View, StyleSheet, SafeAreaView, Platform, Alert, Modal } from 'react-native'
import { Image } from 'expo-image'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'expo-router'
import BackButton from '../../components/ui/backButton';

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from 'react-native-reanimated';

import Topbar from '../../components/ui/guideTopbar';

const profile = require('../../assets/images/profile/image.png')
const edit = require('../../assets/images/profile/edit.png')
const off = require('../../assets/images/profile/off.png')
const on = require('../../assets/images/profile/on.png')
const logout = require('../../assets/images/profile/logout.png')

interface MyToken {
  sub: string;
  roles: string[];
  username: string;
  email: string;
  id: string;
  avatar?: string;
  name?: string;
}

export default function Profile() {
    const router = useRouter();
    const [notify, setNotify] = useState(false);
    const [settings, setSettings] = useState([{ dark: true }, { dark: true }, { dark: true }])
    const [show, setShow] = useState(false);
    const [userToken, setUserToken] = useState<MyToken | null>(null);
    const [userInfo, setUserInfo] = useState({
        username: 'User',
        email: 'user@example.com',
        phone: '0123456789',
    });

    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // Create one animated value for the press interaction using react-native-reanimated
    const scaleAnim = useSharedValue(1);

    // Load JWT user info on component mount
    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                console.log('📋 Token from storage:', token ? 'Found' : 'Not found');
                
                if (token) {
                    try {
                        const decoded = jwtDecode<MyToken>(token);
                        console.log('🔐 Full decoded token:', JSON.stringify(decoded, null, 2));
                        console.log('🔐 Token fields:', Object.keys(decoded));
                        
                        // Try multiple fields for username with detailed logging
                        const username = decoded.username || decoded.name || decoded.sub || 'User';
                        const email = decoded.email || 'user@example.com';
                        
                        setUserToken(decoded);
                        
                        console.log('👤 Extracted username:', username);
                        console.log('   - decoded.username:', decoded.username);
                        console.log('   - decoded.name:', decoded.name);
                        console.log('   - decoded.sub:', decoded.sub);
                        console.log('   - decoded.email:', decoded.email);
                        
                        setUserInfo({
                            username: username,
                            email: email,
                            phone: '0123456789',
                        });
                        
                        // Fetch full profile from API
                        console.log('🌐 Fetching full profile from API...');
                        const profileRes = await fetch(`http://192.168.1.150:8080/user/profile?email=${email}`);
                        
                        if (profileRes.ok) {
                            const profileData = await profileRes.json();
                            console.log('✅ Profile data fetched:', profileData);
                            
                            if (profileData.user) {
                                const user = profileData.user;
                                setFirstName(user.firstName || '');
                                setLastName(user.lastName || '');
                                
                                if (user.pp) {
                                    console.log('📸 Profile picture found, setting base64 image');
                                    setProfilePicture(`data:image/jpeg;base64,${user.pp}`);
                                } else {
                                    console.warn('⚠️ No profile picture in user data');
                                }
                            }
                        } else {
                            console.warn('⚠️ Failed to fetch profile:', profileRes.status);
                        }
                        
                        console.log('👤 User info loaded:', { username, email });
                    } catch (decodeError) {
                        console.error('❌ Error decoding token:', decodeError);
                    }
                } else {
                    console.warn('⚠️ No JWT token found in AsyncStorage');
                }
            } catch (error) {
                console.error('❌ Error loading user info:', error);
            }
        };
        
        loadUserInfo();
    }, []);

    // Animation for when the user presses down using react-native-reanimated
    const onPressIn = () => {
        scaleAnim.value = withTiming(0.8, {
            duration: 150,
            easing: Easing.inOut(Easing.ease),
        });
    };

    // Animation for when the user releases the press using react-native-reanimated
    const onPressOut = () => {
        scaleAnim.value = withTiming(1, {
            duration: 150,
            easing: Easing.inOut(Easing.ease),
        });
    };

    const handleToggling = (index: number) => {
        const newSettings = settings.map((setting, i) => {
            if (i === index) {
                return { ...setting, dark: !setting.dark }
            }
            return setting;
        })
        setSettings(newSettings)
    }

    // Define the animated style using react-native-reanimated
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scaleAnim.value }],
    }));

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

    const clear = async () => {

        try {
            console.log('🧹 Starting AsyncStorage cleanup...');

            const allKeys = await AsyncStorage.getAllKeys();
            console.log('📋 All stored keys:', allKeys);

            const keysToRemove = allKeys.filter(
                (key) => key !== 'hasViewedOnboarding'
            );

            console.log('🗑️ Keys to remove:', keysToRemove);

            if (keysToRemove.length > 0) {
                await AsyncStorage.multiRemove(keysToRemove);
                console.log('✅ AsyncStorage cleared successfully');
            } else {
                console.log('ℹ️ No keys to clear.');
            }

        } catch (e) {
            console.error('❌ Error clearing AsyncStorage:', e);
            alert(`Error clearing AsyncStorage: ${e}`);
        }
    }
    const loggingout = async () => {

        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            Alert.alert(
                "Confirm Logout",
                "Are you sure you want to log out?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Logout",
                        onPress: async () => {
                            try {
                                console.log('🔐 Logout process starting...');
                                
                                await clear();
                                console.log('✅ AsyncStorage cleared');
                                
                                await AsyncStorage.removeItem('token');
                                console.log('✅ Token removed');
                                
                                setUserToken(null);
                                console.log('✅ User token state cleared');
                                
                                console.log('🔄 Navigating to auth screen...');
                                router.replace('/(auth)');
                                console.log('✅ Navigation triggered');
                            } catch (error) {
                                console.error('❌ Logout error:', error);
                                alert('Error during logout: ' + error);
                            }
                        },
                        style: "destructive"
                    }
                ]
            );
        } else {
            // For web, show the custom modal
            setIsLogoutModalVisible(true);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Topbar pressing={toggleMenu} notifying={toggling} on={notify} />
            
             <Modal
                transparent={true}
                visible={isLogoutModalVisible}
                animationType="fade"
                onRequestClose={() => setIsLogoutModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white rounded-lg p-6 w-80 shadow-lg">
                        <Text className="text-lg font-bold text-gray-800">Confirm Logout</Text>
                        <Text className="text-base text-gray-600 my-4">Are you sure you want to log out?</Text>
                        <View className="flex-row justify-center gap-3">
                            <TouchableOpacity
                                onPress={() => setIsLogoutModalVisible(false)}
                                className="px-4 py-2 rounded"
                            >
                                <Text className="font-semibold text-red-500">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={async () => {
                                    try {
                                        console.log('🔐 Web logout process starting...');
                                        
                                        setIsLogoutModalVisible(false);
                                        console.log('✅ Modal closed');
                                        
                                        await clear();
                                        console.log('✅ AsyncStorage cleared');
                                        
                                        await AsyncStorage.removeItem('token');
                                        console.log('✅ Token removed');
                                        
                                        setUserToken(null);
                                        console.log('✅ User token state cleared');
                                        
                                        console.log('🔄 Navigating to auth screen...');
                                        router.replace('/(auth)');
                                        console.log('✅ Navigation triggered');
                                    } catch (error) {
                                        console.error('❌ Web logout error:', error);
                                        alert('Error during logout: ' + error);
                                    }
                                }}
                                className=" px-4 py-2"
                            >
                                <Text className="font-semibold text-blue-500">Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <View style={styles.container}>
                <BackButton />
                {/* --- Profile and Personal Details Sections --- */}
                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        <Image 
                            style={styles.profileImage} 
                            source={profilePicture ? { uri: profilePicture } : profile} 
                        />
                        <Text style={styles.profileName}>
                            {firstName && lastName 
                                ? `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`.trim()
                                : userInfo.username
                            }
                        </Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.editProfileButton}
                        onPress={() => router.push(`/views/editGuideProfile/${userToken?.id || '1'}` as any)}
                    >
                        <Image style={styles.editProfileIcon} source={edit} />
                        <Text style={styles.editProfileText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.contentContainer}>
                    {/* --- Settings Section (With Inline Animations) --- */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Settings</Text>
                        </View>
                        <View style={styles.sectionContent}>
                            {/* --- Logout Button --- */}
                            <TouchableOpacity 
                                style={styles.logoutRow}
                                onPress={loggingout}
                            >
                                <Text style={styles.settingLabel}>Logout</Text>
                                <Image style={styles.toggleIcon} source={logout} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F2F5FA',
    },
    container: {
        backgroundColor: '#F2F5FA',
        width: '100%',
        height: '100%',
        flex: 1,
        flexDirection: 'column',
        gap: 40,
    },
    profileSection: {
        alignItems: 'center',
    },
    profileImageContainer: {
        width: 250,
        height: 250,
        marginBottom: 16,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 125,
        borderWidth: 4,
        borderColor: '#d1d5db',
    },
    profileName: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
    editProfileButton: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEFA17',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 8,
    },
    editProfileIcon: {
        width: 18,
        height: 18,
    },
    editProfileText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333333',
    },
    contentContainer: {
        height: '100%',
        gap: 32,
    },
    section: {
        width: '100%',
        alignItems: 'center',
    },
    sectionHeader: {
        width: '85%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 14,
    },
    editIcon: {
        width: 20,
        height: 20,
    },
    sectionContent: {
        width: '85%',
        height: 'auto',
    },
    detailRow: {
        marginTop: 8,
        borderRadius: 10,
        backgroundColor: 'rgba(217,217,217,0.44)',
        height: 48,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    detailLabel: {
        fontWeight: 'bold',
    },
    detailValue: {
        fontWeight: 'normal',
    },
    settingRow: {
        marginTop: 8,
        borderRadius: 10,
        height: 48,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    settingLabel: {
        fontWeight: 'bold',
    },
    toggleIcon: {
        width: 32,
        height: 32,
    },
    logoutRow: {
        marginTop: 8,
        borderRadius: 10,
        height: 48,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        alignItems: 'center',
    },
});