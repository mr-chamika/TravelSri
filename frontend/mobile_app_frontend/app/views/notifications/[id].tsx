import { View, Modal, TouchableOpacity, Text, ScrollView, Image } from 'react-native';

interface NotifyModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function NotifyModal({ isVisible, onClose }: NotifyModalProps) {
    // Mock data for notifications
    const notifications = [
        {
            id: 1,
            type: 'guide',
            title: 'Looking for guide to group tour in Kandy',
            action: 'See Details',
            timestamp: 'Today at 9:42 AM',
            avatar: 'https://via.placeholder.com/50?text=User+1',
        },
        {
            id: 2,
            type: 'reaction',
            title: 'Dennis Nedry reacted to your blog post',
            timestamp: 'Last Wednesday at 9:42 AM',
            avatar: 'https://via.placeholder.com/50?text=User+2',
        },
        {
            id: 3,
            type: 'review',
            title: 'Dennis Nedry put a review about you',
            content: '"Wonderful person. She became our family member for all time"',
            timestamp: 'Last Wednesday at 9:42 AM',
            avatar: 'https://via.placeholder.com/50?text=User+3',
        },
        {
            id: 4,
            type: 'request',
            title: 'Dennis Nedry request for hiring',
            details: 'Kandy - 2 Days - 12/05 to 12/06',
            timestamp: '2mb',
            avatar: 'https://via.placeholder.com/50?text=User+4',
        },
        {
            id: 5,
            type: 'comment',
            title: 'Dennis Nedry commented on Isla Nublar SOC2 compliance report',
            content: '"Oh, I finished de-bugging the phones, but the system\'s compiling for eighteen minutes, or twenty..."',
            action: 'Add to favorites',
            timestamp: 'Last Wednesday at 9:42 AM',
            avatar: 'https://via.placeholder.com/50?text=User+5',
        },
        {
            id: 6,
            type: 'new_account',
            title: 'New Account created',
            timestamp: 'Last Wednesday at 9:42 AM',
            avatar: 'https://via.placeholder.com/50?text=User+6',
        },
    ];

    return (
        <View>
            {isVisible && (
                <View className="bg-[#F2F5FA] h-full">
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={isVisible}
                        onRequestClose={onClose}
                    >
                        <View className="h-full w-full justify-center items-center bg-black/50">
                            <View className="w-[93%] h-[97%] bg-white my-4 p-6 rounded-2xl">
                                <TouchableOpacity onPress={onClose} className="mb-4">
                                    <Text className="text-black text-lg font-semibold">Cancel</Text>
                                </TouchableOpacity>
                                
                                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                                    <View className="gap-3">
                                        {notifications.map((notification) => (
                                            <View key={notification.id} className="flex-row items-start bg-gray-50 rounded-lg p-4">
                                                {/* Profile Icon */}
                                                <Image
                                                    source={{ uri: notification.avatar }}
                                                    className="w-8 h-8 rounded-full mr-3"
                                                />

                                                {/* Notification Content */}
                                                <View className="flex-1">
                                                    {/* Title and Action */}
                                                    <Text className="text-base font-bold text-gray-800 mb-1">
                                                        {notification.title}
                                                    </Text>
                                                    
                                                    {notification.action && (
                                                        <TouchableOpacity className="bg-white border border-yellow-400 rounded px-3 py-1 self-start mt-1">
                                                            <Text className="text-yellow-600 text-sm font-bold">
                                                                {notification.action}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}

                                                    {/* Additional Details */}
                                                    {notification.content && (
                                                        <Text className="text-gray-700 text-sm leading-5 mt-1">
                                                            {notification.content}
                                                        </Text>
                                                    )}
                                                    
                                                    {notification.details && (
                                                        <Text className="text-gray-500 text-xs mt-1">
                                                            {notification.details}
                                                        </Text>
                                                    )}

                                                    {/* Timestamp */}
                                                    <Text className="text-gray-500 text-xs mt-1">
                                                        {notification.timestamp}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
        </View>
    );
}