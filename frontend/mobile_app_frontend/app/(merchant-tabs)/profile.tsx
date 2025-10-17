import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Image,
    Switch,
    ScrollView,
    Alert,      // Added for native alerts
    Platform,   // Added to check OS
    Modal       // Added for web confirmation
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Added for storage access
import { useRouter } from 'expo-router'; // Added for navigation

const ShopProfileScreen: React.FC = () => {
    const router = useRouter(); // Initialize router for navigation

    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [visibility, setVisibility] = useState<boolean>(false);
    const [askCredential, setAskCredential] = useState<boolean>(true);
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false); // State for modal visibility

    // --- LOGOUT FUNCTIONS (Copied from previous code) ---

    // Function to clear all data from AsyncStorage except for 'hasViewedOnboarding'
    const clear = async () => {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            const keysToRemove = allKeys.filter(
                (key) => key !== 'hasViewedOnboarding'
            );

            if (keysToRemove.length > 0) {
                await AsyncStorage.multiRemove(keysToRemove);
            }
        } catch (e) {
            // Use Alert to show error to the user
            Alert.alert(`Error`, `Failed to clear storage: ${e}`);
        }
    };

    // Main logout handler: uses Alert for mobile and Modal for web
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
                            await clear();
                            router.replace('/(auth)'); // Navigate to login/auth screen
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

    const handleEditPress = () => {
        console.log('Edit profile pressed');
    };

    const ProfileDetailRow = ({ label, value }: { label: string; value: string }) => (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );

    const SettingRow = ({
        label,
        value,
        onValueChange
    }: {
        label: string;
        value: boolean;
        onValueChange: (value: boolean) => void;
    }) => (
        <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: '#E0E0E0', true: '#FFD700' }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor="#E0E0E0"
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* --- LOGOUT MODAL for Web --- */}
            <Modal
                transparent={true}
                visible={isLogoutModalVisible}
                animationType="fade"
                onRequestClose={() => setIsLogoutModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirm Logout</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                onPress={() => setIsLogoutModalVisible(false)}
                                style={styles.modalButton}
                            >
                                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={async () => {
                                    setIsLogoutModalVisible(false);
                                    await clear();
                                    router.replace('/(auth)');
                                }}
                                style={styles.modalButton}
                            >
                                <Text style={styles.modalButtonTextConfirm}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{
                                uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
                            }}
                            style={styles.profileImage}
                        />
                    </View>
                    <Text style={styles.profileName}>Shop</Text>
                </View>

                {/* Personal Details */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Personal Details</Text>
                        <TouchableOpacity onPress={handleEditPress}>
                            <Ionicons name="pencil" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.detailsContainer}>
                        <ProfileDetailRow label="Email" value="shop@gmail.com" />
                        <ProfileDetailRow label="Phone" value="0123456789" />
                        <ProfileDetailRow label="Shopname" value="Shop" />
                        <ProfileDetailRow label="Address" value="Hikkaduwa,Galle" />
                    </View>
                </View>

                {/* Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    <View style={styles.settingsContainer}>
                        
                        {/* --- LOGOUT BUTTON --- */}
                        <TouchableOpacity onPress={loggingout} style={styles.settingRow}>
                            <Text style={styles.settingLabel}>Logout</Text>
                            <Ionicons name="log-out-outline" size={24} color="#E53935" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// --- STYLES (Added Modal Styles) ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    content: {
        flex: 1,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#FFFFFF',
        marginBottom: 20,
    },
    profileImageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    section: {
        backgroundColor: '#FFFFFF',
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    detailsContainer: {
        gap: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        flex: 1,
    },
    detailValue: {
        fontSize: 16,
        color: '#666',
        flex: 1,
        textAlign: 'right',
    },
    settingsContainer: {
        gap: 10,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        flex: 1,
    },
    // Styles for the Web Logout Modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 24,
        width: 320,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    modalMessage: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 15,
    },
    modalButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    modalButtonTextCancel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E53935',
    },
    modalButtonTextConfirm: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007BFF',
    },
});

export default ShopProfileScreen;