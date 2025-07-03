import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';


const CreditCardPayment: React.FC = () => {
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [cvvCode, setCvvCode] = useState<string>('');
  const [name, setName] = useState<string>('');

  // Transfer form states
  const [bankName, setBankName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [slipUploaded, setSlipUploaded] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'credit card' | 'transfer'>('credit card');

  const handleCardNumberChange = (text: string) => {
    // Format card number with spaces
    const formatted = text.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpirationChange = (text: string) => {
    // Format expiration date MM/YY
    const formatted = text.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    if (formatted.length <= 5) {
      setExpirationDate(formatted);
    }
  };

  const handleCvvChange = (text: string) => {
    // Only allow numbers, max 3 digits
    const formatted = text.replace(/\D/g, '');
    if (formatted.length <= 3) {
      setCvvCode(formatted);
    }
  };

  const handleAccountNumberChange = (text: string) => {
    // Format account number with dashes
    const formatted = text.replace(/\D/g, '').replace(/(.{4})/g, '$1-').replace(/-$/, '');
    if (formatted.length <= 19) {
      setAccountNumber(formatted);
    }
  };

  const handleSlipUpload = () => {
    // Simulate file upload
    setSlipUploaded(true);
    Alert.alert('Success', 'Slip uploaded successfully!');
  };

  const handlePay = () => {
    if (activeTab === 'credit card') {
      if (!cardNumber || !expirationDate || !cvvCode || !name) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
    } else {
      if (!bankName || !accountNumber || !slipUploaded) {
        Alert.alert('Error', 'Please fill in all fields and upload payment slip');
        return;
      }
    }
    Alert.alert('Success', 'Payment processed successfully!');
  };

  const handleCancel = () => {
    Alert.alert('Cancel', 'Payment cancelled');
  };

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleNavPress = (navItem: string) => {
    console.log('Navigation pressed:', navItem);
  };

  const renderCreditCardForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Card Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 0000-0000-0000-0000"
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Expiration Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 12/27"
            value={expirationDate}
            onChangeText={handleExpirationChange}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>CVV Code *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 123"
            value={cvvCode}
            onChangeText={handleCvvChange}
            keyboardType="numeric"
            maxLength={3}
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Ellen Smith"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>
    </View>
  );

  const renderTransferForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bank Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Sampath Bank"
          value={bankName}
          onChangeText={setBankName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Account Number</Text>
        <TextInput
          style={styles.input}
          placeholder="0000-0000-0000-0000"
          value={accountNumber}
          onChangeText={handleAccountNumberChange}
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Slip Upload</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleSlipUpload}
        >
          <View style={styles.uploadContent}>
            <Ionicons
              name={slipUploaded ? "checkmark-circle" : "add"}
              size={40}
              color={slipUploaded ? "#4CAF50" : "#666"}
            />
            <Text style={[styles.uploadText, slipUploaded && styles.uploadedText]}>
              {slipUploaded ? "Slip Uploaded" : "Upload Payment Slip"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

return (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

    {/* Scrollable content below header */}
    <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Page Title */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Payment</Text>
      </View>

      {/* Payment Method Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'credit card' && styles.activeTab]}
          onPress={() => setActiveTab('credit card')}
        >
          <Text style={[styles.tabText, activeTab === 'credit card' && styles.activeTabText]}>
            credit card
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'transfer' && styles.activeTab]}
          onPress={() => setActiveTab('transfer')}
        >
          <Text style={[styles.tabText, activeTab === 'transfer' && styles.activeTabText]}>
            transfer
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payment Amount */}
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>4500 LKR</Text>
      </View>

      {/* Payment Form */}
      {activeTab === 'credit card' ? renderCreditCardForm() : renderTransferForm()}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>
            {activeTab === 'transfer' ? 'Publish' : 'Pay'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

  </SafeAreaView>
);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#000',
  },
  notificationButton: {
    padding: 5,
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 25,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  amountContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  amount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#FAFAFA',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 30,
    paddingHorizontal: 15,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  uploadedText: {
    color: '#4CAF50',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  payButton: {
    flex: 1,
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginRight: 10,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginLeft: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    padding: 10,
  },
  activeNavItem: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
  },
});

export default CreditCardPayment;