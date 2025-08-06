import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, StyleSheet, Modal } from 'react-native';
import { Image } from 'expo-image';
import NotifyModal from '../../app/views/notifications/[id]';
import Sidebar from '../guideSideBar'; // Import your Sidebar component
import { useState } from 'react';

const Menu = require('../../assets/images/top bar/menu.png');
const Notify = require('../../assets/images/top bar/notify1.png');
const logo = require('../../assets/images/top bar/logo.png');

interface TopbarProps {
  pressing: () => void;
  notifying: () => void;
  on: boolean;
}

const Topbar = ({ pressing, notifying, on }: TopbarProps) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleMenuPress = () => {
    setSidebarVisible(true);
    pressing(); // Keep the original functionality if needed
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FEFA17" barStyle="dark-content" />

      <View style={styles.container}>
        {/* Menu Button */}
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={handleMenuPress}>
            <View style={styles.menuButton}>
              <Image style={styles.menuIcon} source={Menu} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Center Logo + Text */}
        <View style={styles.centerContainer}>
          <Image style={styles.logo} source={logo} />
          <Text style={styles.appName}>TravelSri</Text>
        </View>

        {/* Notification Icon */}
        <TouchableOpacity onPress={notifying}>
          <View style={styles.notificationContainer}>
            <Image style={styles.notificationIcon} source={Notify} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Notification Modal */}
      <NotifyModal
        isVisible={on}
        onClose={notifying}
      />

      {/* Sidebar Modal - FIXED: Removed animationType and simplified overlay */}
      <Modal
        transparent={true}
        visible={sidebarVisible}
        onRequestClose={closeSidebar}
      >
        <View style={styles.modalOverlay}>
          <Sidebar close={closeSidebar} />
          <TouchableOpacity 
            style={styles.modalBackground} 
            onPress={closeSidebar}
            activeOpacity={1}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  container: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  menuContainer: {
    width: 40,
  },
  menuButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FEFA17',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#538EBB66',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 60,
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  notificationContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#538EBB66',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationIcon: {
    width: 40,
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackground: {
    flex: 1,
  },
});

export default Topbar;