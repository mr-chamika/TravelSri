import { View, Modal, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Bell, CreditCard, Users, Clock, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { Client } from '@stomp/stompjs';

interface NotifyModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface MyToken {
  sub: string;
  roles: string[];
  username: string;
  email: string;
  id: string
}

interface Notification {
  _id: string;
  recipientId: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: string;//"public" || "private"
  link: string;

}

export default function NotifyModal({ isVisible, onClose }: NotifyModalProps) {

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      _id: '1',
      recipientId: '68a4ec4065c9df5a144ada34',
      type: "public",//"public" || "private"
      link: 'link1',
      message: 'You have received a new booking request for your photography service.',
      createdAt: '2025-08-19T21:27:28.450+00:00',
      isRead: false,

    }

    /*,
    {
      _id: '2',


      message: 'Your payment of $150 has been successfully processed.',
      timestamp: '1 hour ago',
      isRead: false,

    },
    {
      _id: '3',


      message: 'A group tour has been requested for next weekend.',
      timestamp: '3 hours ago',
      isRead: true,

    },
    {
      _id: '4',


      message: 'You have received a new booking request for your photography service.',
      timestamp: '2 mins ago',
      isRead: false,

    },
    {
      _id: '5',


      message: 'Your payment of $150 has been successfully processed.',
      timestamp: '1 hour ago',
      isRead: false,

    },
    {
      _id: '6',


      message: 'A group tour has been requested for next weekend.',
      timestamp: '3 hours ago',
      isRead: true,

    },
    // ... other notifications*/
  ]);

  const getNotifi = async () => {

    try {

      const keys = await AsyncStorage.getItem("token")

      if (keys) {

        const token: MyToken = jwtDecode(keys)

        const res = await fetch(`http://localhost:8080/notification/get?id=${token.id}&role=${token.roles[0]}`)

        if (res) {

          const data = await res.json()
          //console.log(data)

          if (data.length > 0) {

            setNotifications(data)

          } else {

            setNotifications([])

          }


        } else {

          console.log("Check your connections...")

        }

      }


    } catch (err) {

      console.log('Error from notifications getting : ', err);
      setNotifications([])

    }

  }

  useEffect(() => {

    const client = new Client({

      brokerURL: 'ws://localhost:8080/ws/websocket',
      reconnectDelay: 5000,
      onConnect: () => {

        console.log('Connected to public STOMP server');
        client.subscribe('/topic/messages', (message) => {

          const handle = async () => {

            const messageData = JSON.parse(message.body);

            const keys = await AsyncStorage.getItem("token")

            if (keys) {

              const x: MyToken = jwtDecode(keys)
              //console.log(x.id)

              if (x.id != messageData.to) {
                getNotifi();
              }
            }
          }
          handle();

        })
      }

    })

    client.activate();

    return () => {

      client.deactivate();
    };

  }, [])


  useEffect(() => {

    const client = new Client({

      brokerURL: 'ws://localhost:8080/ws/websocket',
      reconnectDelay: 5000,
      onConnect: () => {

        console.log('Connected to merchant STOMP server');

        client.subscribe('/topicShops/messages', (message) => {
          const handle = async () => {
            const keys = await AsyncStorage.getItem("token")

            if (keys) {

              const x: MyToken = jwtDecode(keys)
              //console.log(x.roles[0])
              if (x.roles[0] == "merchant") {

                getNotifi()

              }
            }
          }
          handle();
        })
      }

    })

    client.activate();

    return () => {

      client.deactivate();
    };

  }, [])


  useEffect(() => {

    const client = new Client({

      brokerURL: 'ws://localhost:8080/ws/websocket',
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to private STOMP server');

        client.subscribe(`/user/queue/notifications`, () => {
          getNotifi();
        });
      },
      onStompError: (frame) => {

        console.error('Additional details: ' + frame.body)

      }

    })

    const connectAndSubscribePrivate = async () => {
      const keys = await AsyncStorage.getItem("token");
      if (keys) {

        client.connectHeaders = {
          Authorization: `Bearer ${keys}`,
        };

        client.activate();

        console.log("Client is attempting to connect with these headers:", client.connectHeaders);

      }

    };
    connectAndSubscribePrivate();

    // Cleanup function
    return () => {
      // This part is fine and will handle cleanup when the component unmounts
      if (client) {

        client.deactivate();
        console.log("Private STOMP client disconnected.");

      }

    };
  }, []);


  useEffect(() => {

    getNotifi();

  }, [isVisible])

  function formatTimestampPlainJS(isoString: string) {
    const date = new Date(isoString);
    const today = new Date();

    // Manually check if the year, month, and day are the same
    const isSameDay = date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    if (isSameDay) {
      // If it's today, format as time
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }); // Example: "3:45 PM"
    } else {
      // Otherwise, format as date
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }); // Example: "Aug 19"
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[93%] h-[97%] bg-white p-6 rounded-2xl">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-black">Cancel</Text>
          </TouchableOpacity>

          <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <Text className="text-gray-500 text-center mt-5">
                No notifications yet
              </Text>
            ) : (
              notifications.map((notification) => (
                <TouchableOpacity
                  key={notification._id}
                  className={`
                    my-1.5 mx-2 rounded-xl border-l-4 shadow-md bg-gray-50
                  `}
                  activeOpacity={0.7}
                >
                  <View className="relative p-4">
                    <View className="flex-row justify-between items-center mb-2">
                      <View className="w-8 h-8 rounded-full bg-white justify-center items-center shadow">
                        <Bell size={20} color="#757575" />
                      </View>
                      <View className="flex-row items-center h-5">
                        <Clock size={12} color="#9E9E9E" />
                        <Text className="text-xs text-gray-500 font-medium ml-1">
                          {formatTimestampPlainJS(notification.createdAt)}
                        </Text>
                      </View>
                    </View>

                    <View>
                      {/* <Text className={`
                        text-base font-semibold text-gray-800 mb-1 leading-5
                        ${!notification.isRead && 'font-bold text-black'}
                      `}>
                        {notification.title}
                      </Text> */}
                      <Text className="text-sm text-gray-600 leading-5">
                        {notification.message}
                      </Text>
                    </View>

                    {!notification.isRead && (
                      <View className="absolute top-3 right-3 w-2 h-2 rounded-full bg-orange-500" />
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
