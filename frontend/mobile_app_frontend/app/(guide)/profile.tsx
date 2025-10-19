import { Text, TouchableOpacity, View, StyleSheet, SafeAreaView } from 'react-native'
import { Image } from 'expo-image'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
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
    const [notify, setNotify] = useState(false);
    const [settings, setSettings] = useState([{ dark: true }, { dark: true }, { dark: true }])
    const [show, setShow] = useState(false);
    const [userInfo, setUserInfo] = useState({
        username: 'User',
        email: 'user@example.com',
        phone: '0123456789',
    });

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

    return (
        <SafeAreaView style={styles.safeArea}>
            <Topbar pressing={toggleMenu} notifying={toggling} on={notify} />
            

            <View style={styles.container}>
                <BackButton />
                {/* --- Profile and Personal Details Sections --- */}
                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        <Image style={styles.profileImage} source={profile} />
                        <Text style={styles.profileName}>{userInfo.username}</Text>
                    </View>
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Personal Details</Text>
                            <TouchableOpacity onPress={() => alert('editing....')}>
                                <Image style={styles.editIcon} source={edit} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.sectionContent}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Email</Text>
                                <Text style={styles.detailValue}>{userInfo.email}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Phone</Text>
                                <Text style={styles.detailValue}>{userInfo.phone}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Username</Text>
                                <Text style={styles.detailValue}>{userInfo.username}</Text>
                            </View>
                        </View>
                    </View>

                    {/* --- Settings Section (With Inline Animations) --- */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Settings</Text>
                        </View>
                        <View style={styles.sectionContent}>
                            {/* --- Dark Mode Toggle --- */}
                            <View style={styles.settingRow}>
                                <Text style={styles.settingLabel}>Dark Mode</Text>
                                <Animated.View style={animatedStyle}>
                                    <TouchableOpacity
                                        activeOpacity={1} // Disable default opacity feedback
                                        onPressIn={onPressIn}
                                        onPressOut={onPressOut}
                                        onPress={() => handleToggling(0)}
                                    >
                                        <Image style={styles.toggleIcon} source={settings[0].dark ? on : off} />
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>

                            {/* --- Visibility Toggle --- */}
                            <View style={styles.settingRow}>
                                <Text style={styles.settingLabel}>Visibility</Text>
                                <Animated.View style={animatedStyle}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPressIn={onPressIn}
                                        onPressOut={onPressOut}
                                        onPress={() => handleToggling(1)}
                                    >
                                        <Image style={styles.toggleIcon} source={settings[1].dark ? on : off} />
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>

                            {/* --- Credential Toggle --- */}
                            <View style={styles.settingRow}>
                                <Text style={styles.settingLabel}>Ask credential when login</Text>
                                <Animated.View style={animatedStyle}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPressIn={onPressIn}
                                        onPressOut={onPressOut}
                                        onPress={() => handleToggling(2)}
                                    >
                                        <Image style={styles.toggleIcon} source={settings[2].dark ? on : off} />
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>
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
});