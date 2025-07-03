import { View, Modal, TouchableOpacity, Text } from 'react-native';

interface NotifyModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function NotifyModal({ isVisible, onClose }: NotifyModalProps) {
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
                                <TouchableOpacity onPress={onClose}>
                                    <Text className="text-black">Cancel</Text>
                                </TouchableOpacity>
                                <View className="h-full w-full justify-center items-center">
                                    <Text className="text-gray-300">No notification yet</Text>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
        </View>
    );
}
