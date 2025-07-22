import { View, Modal, TouchableOpacity, Text, ScrollView, Image } from 'react-native';

interface NotifyModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function NotifyModal({ isVisible, onClose }: NotifyModalProps) {
    // Realistic travel-related notifications mock data
    const notifications = [
        {
            id: 1,
            type: 'guide_request',
            title: 'Priya Senadheera is looking for a guide in Ella',
            subtitle: 'Ella Hill Country - 3 Days - Dec 15-17, 2024',
            action: 'Apply Now',
            timestamp: 'Today at 2:15 PM',
            avatar: require('../../../assets/images/top bar/notify1.png'),
            priority: 'high',
        },
        {
            id: 2,
            type: 'reaction',
            title: 'Senali Perera loved your travel post',
            subtitle: 'Your post "Sunset at Sigiriya Rock" got 24 new reactions',
            timestamp: '2 hours ago',
            avatar: require('../../../assets/images/top bar/notify1.png'),
            priority: 'normal',
        },
        {
            id: 3,
            type: 'review',
            title: 'Kapila Senewirathna left you a 5-star review',
            content: '"Amazing guide! Made our Kandy trip unforgettable. Very knowledgeable about local culture and history. Highly recommended!"',
            timestamp: '5 hours ago',
            avatar: require('../../../assets/images/top bar/notify1.png'),
            priority: 'high',
        },
        {
            id: 4,
            type: 'booking',
            title: 'New booking request from Nilu Adhikari',
            subtitle: 'Galle Fort Tour - 2 Days - Jan 8-9, 2025',
            details: '4 travelers • Budget: $300/day',
            action: 'View Details',
            timestamp: '1 day ago',
            avatar: require('../../../assets/images/top bar/notify1.png'),
            priority: 'high',
        },
        {
            id: 5,
            type: 'comment',
            title: 'Mark Dais commented on your Yala Safari experience',
            content: '"Wow! Those elephant photos are incredible. Did you use a telephoto lens? Planning my own safari trip soon!"',
            action: 'Reply',
            timestamp: '2 days ago',
            avatar: require('../../../assets/images/top bar/notify1.png'),
            priority: 'normal',
        },
        {
            id: 6,
            type: 'follow',
            title: 'Sarah Chen started following you',
            subtitle: 'Travel blogger with 2.5k followers',
            timestamp: '3 days ago',
            avatar: require('../../../assets/images/top bar/notify1.png'),
            priority: 'normal',
        },
        {
            id: 7,
            type: 'trip_update',
            title: 'Weather alert for your upcoming Horton Plains trip',
            subtitle: 'Heavy rain expected Dec 20-21. Consider rescheduling.',
            action: 'Check Weather',
            timestamp: '4 days ago',
            avatar: require('../../../assets/images/top bar/notify1.png'),
            priority: 'medium',
        },
        {
            id: 8,
            type: 'payment',
            title: 'Payment received from Alessandro Rossi',
            subtitle: 'Colombo City Tour - $150 • Dec 10, 2024',
            timestamp: '1 week ago',
            avatar: require('../../../assets/images/top bar/notify1.png'),
            priority: 'low',
        },
        {
            id: 9,
            type: 'achievement',
            title: 'Congratulations! You earned "Top Guide" badge',
            subtitle: '50+ five-star reviews this month',
            timestamp: '1 week ago',
            avatar: require('../../../assets/images/top bar/notify1.png'),
            priority: 'medium',
        },
        {
            id: 10,
            type: 'message',
            title: 'Jake Mitchell sent you a message',
            content: '"Hi! I\'m planning a 7-day Sri Lanka trip in February. Could you help me plan an itinerary covering cultural sites and beaches?"',
            action: 'Reply',
            timestamp: '1 week ago',
            avatar: require('../../../assets/images/top bar/notify1.png'),
            priority: 'normal',
        },
    ];

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-l-red-500 bg-red-50';
            case 'medium': return 'border-l-yellow-500 bg-yellow-50';
            case 'low': return 'border-l-green-500 bg-green-50';
            default: return 'border-l-blue-500 bg-blue-50';
        }
    };

    const getActionButtonStyle = (type: string) => {
        switch (type) {
            case 'guide_request':
            case 'booking':
                return 'bg-green-500 border-green-500 text-white';
            case 'review':
                return 'bg-blue-500 border-blue-500 text-white';
            case 'trip_update':
                return 'bg-orange-500 border-orange-500 text-white';
            default:
                return 'bg-white border-yellow-400 text-yellow-600';
        }
    };

    return (
        <View>
            {isVisible && (
                <View className="bg-[#F2F5FA] h-full">
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isVisible}
                        onRequestClose={onClose}
                    >
                        <View className="h-full w-full justify-center items-center bg-black/60">
                            <View className="w-[95%] h-[95%] bg-white my-4 rounded-2xl overflow-hidden">
                                {/* Header */}
                                <View className="flex-row justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                                    <Text className="text-black text-xl font-bold">Notifications</Text>
                                    <TouchableOpacity onPress={onClose}>
                                        <Text className="text-blue-600 text-lg font-semibold">Done</Text>
                                    </TouchableOpacity>
                                </View>
                                
                                <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                                    <View className="gap-3">
                                        {notifications.map((notification) => (
                                            <View 
                                                key={notification.id} 
                                                className={`flex-row items-start rounded-xl p-4 border-l-4 ${getPriorityColor(notification.priority)} shadow-sm`}
                                            >
                                                {/* Profile Icon */}
                                                <View className="mr-3">
                                                    <Image
                                                        source={notification.avatar}
                                                        className="w-2 h-2 rounded-full"
                                                        resizeMode="cover"
                                                    />
                                                    {notification.priority === 'high' && (
                                                        <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                                                    )}
                                                </View>

                                                {/* Notification Content */}
                                                <View className="flex-1">
                                                    {/* Title */}
                                                    <Text className="text-base font-bold text-gray-900 mb-1 leading-5">
                                                        {notification.title}
                                                    </Text>
                                                    
                                                    {/* Subtitle */}
                                                    {notification.subtitle && (
                                                        <Text className="text-sm font-medium text-gray-600 mb-2">
                                                            {notification.subtitle}
                                                        </Text>
                                                    )}

                                                    {/* Content */}
                                                    {notification.content && (
                                                        <View className="bg-white rounded-lg p-3 mb-2 border border-gray-200">
                                                            <Text className="text-gray-700 text-sm leading-5 italic">
                                                                {notification.content}
                                                            </Text>
                                                        </View>
                                                    )}
                                                    
                                                    {/* Additional Details */}
                                                    {notification.details && (
                                                        <Text className="text-gray-600 text-sm mb-2 font-medium">
                                                            {notification.details}
                                                        </Text>
                                                    )}

                                                    {/* Action Button */}
                                                    {notification.action && (
                                                        <TouchableOpacity 
                                                            className={`rounded-lg px-4 py-2 self-start mb-2 ${getActionButtonStyle(notification.type)}`}
                                                        >
                                                            <Text className={`text-sm font-bold ${
                                                                getActionButtonStyle(notification.type).includes('text-white') 
                                                                    ? 'text-white' 
                                                                    : 'text-yellow-600'
                                                            }`}>
                                                                {notification.action}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}

                                                    {/* Timestamp */}
                                                    <Text className="text-gray-500 text-xs">
                                                        {notification.timestamp}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                    
                                    {/* Load More Button */}
                                    <TouchableOpacity className="bg-gray-100 rounded-lg p-4 mt-4 items-center">
                                        <Text className="text-gray-600 font-semibold">Load More Notifications</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
        </View>
    );
}