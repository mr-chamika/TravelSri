import { StackScreenProps } from '@react-navigation/stack';

// Define the screens and their parameters in your (auth) stack
export type AuthStackParamList = {
    index: { reason?: 'SESSION_EXPIRED' }; // Your login screen
    signup: undefined;
    forgotpassword: undefined;
};

// Create a reusable props type for screens in this stack
export type AuthScreenProps<T extends keyof AuthStackParamList> =
    StackScreenProps<AuthStackParamList, T>;