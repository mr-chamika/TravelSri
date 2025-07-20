import React from 'react';
import { View, Text, StyleSheet, StatusBar, StyleProp, ViewStyle, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderProps {
  userName: string;
  welcomeMessage?: string;
  gradientColors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  style?: StyleProp<ViewStyle>;
}

const Header: React.FC<HeaderProps> = ({
  userName,
  welcomeMessage,
  gradientColors = ['#8B5CF6', '#A855F7'],
  style,
}) => {
  const defaultWelcomeMessage = `Ready to guide travelers today?`;

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.container, style]}
    >
      <StatusBar barStyle='dark-content' backgroundColor={gradientColors[0]} />
      <View style={styles.content}>
        <Text style={styles.title}>
          Welcome, {userName}!
        </Text>
        <Text style={styles.subtitle}>
          {welcomeMessage || defaultWelcomeMessage}
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.9)',
    textAlign: 'center',
  },
});

export default Header;
