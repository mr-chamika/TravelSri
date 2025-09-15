import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';

// Simple icon component using emojis
const Icon: React.FC<{ name: string; size: number; color: string }> = ({ name, size, color }) => {
  const iconMap: Record<string, string> = {
    'arrow-left': '←',
    'calendar': '📅',
    'users': '👥',
    'child': '👶',
    'adult': '👨',
    'plus': '+',
    'minus': '−',
    'edit': '✏️',
    'close': '✕',
    'check': '✓',
    'chevron-right': '›',
    'chevron-down': '⌄',
  };

  return (
    <Text style={{ fontSize: size, color }}>
      {iconMap[name] || '•'}
    </Text>
  );
};

interface TripSettings {
  startDate: Date;
  numberOfDays: number;
  adults: number;
  children: number;
}

interface DayPlan {
  dayNumber: number;
  date: string;
  hasPlans: boolean;
  planSummary?: {
    items: string[];
    totalCost: number;
  };
}

const TravelersPickerModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  tripSettings: TripSettings;
  setTripSettings: React.Dispatch<React.SetStateAction<TripSettings>>;
}> = ({ visible, onClose, tripSettings, setTripSettings }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onClose}
  >
    <View className="flex-1 justify-end bg-black/50">
      <View className="bg-white rounded-t-2xl pb-4 ios:pb-8">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Text className="text-lg font-semibold text-gray-800">Select Travelers</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
        <View className="p-4">
          {/* Adults */}
          <View className="flex-row justify-between items-center py-4 border-b border-gray-100">
            <View className="flex-row items-center flex-1">
              <Icon name="adult" size={24} color="#a16207" />
              <View className="ml-3">
                <Text className="text-base font-semibold text-gray-800">Adults</Text>
                <Text className="text-sm text-gray-500">Age 18+</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                className={`w-9 h-9 rounded-full bg-yellow-50 border border-yellow-300 items-center justify-center ${tripSettings.adults <= 1 ? 'bg-gray-100 border-gray-200' : ''}`}
                onPress={() => {
                  if (tripSettings.adults > 1) {
                    setTripSettings(prev => ({ ...prev, adults: prev.adults - 1 }));
                  }
                }}
                disabled={tripSettings.adults <= 1}
              >
                <Icon name="minus" size={20} color={tripSettings.adults <= 1 ? '#9ca3af' : '#a16207'} />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-gray-800 min-w-[30px] text-center">{tripSettings.adults}</Text>
              <TouchableOpacity
                className="w-9 h-9 rounded-full bg-yellow-50 border border-yellow-300 items-center justify-center"
                onPress={() => setTripSettings(prev => ({ ...prev, adults: prev.adults + 1 }))}
              >
                <Icon name="plus" size={20} color="#a16207" />
              </TouchableOpacity>
            </View>
          </View>
          {/* Children */}
          <View className="flex-row justify-between items-center py-4">
            <View className="flex-row items-center flex-1">
              <Icon name="child" size={24} color="#a16207" />
              <View className="ml-3">
                <Text className="text-base font-semibold text-gray-800">Children</Text>
                <Text className="text-sm text-gray-500">Age 2-17</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                className={`w-9 h-9 rounded-full bg-yellow-50 border border-yellow-300 items-center justify-center ${tripSettings.children <= 0 ? 'bg-gray-100 border-gray-200' : ''}`}
                onPress={() => {
                  if (tripSettings.children > 0) {
                    setTripSettings(prev => ({ ...prev, children: prev.children - 1 }));
                  }
                }}
                disabled={tripSettings.children <= 0}
              >
                <Icon name="minus" size={20} color={tripSettings.children <= 0 ? '#9ca3af' : '#a16207'} />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-gray-800 min-w-[30px] text-center">{tripSettings.children}</Text>
              <TouchableOpacity
                className="w-9 h-9 rounded-full bg-yellow-50 border border-yellow-300 items-center justify-center"
                onPress={() => setTripSettings(prev => ({ ...prev, children: prev.children + 1 }))}
              >
                <Icon name="plus" size={20} color="#a16207" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          className="bg-yellow-300 m-4 py-3.5 rounded-lg items-center"
          onPress={onClose}
        >
          <Text className="text-base font-semibold text-yellow-800">Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const TripPlannerScreen: React.FC = () => {
  const router = useRouter();

  const [tripSettings, setTripSettings] = useState<TripSettings>({
    startDate: new Date(),
    numberOfDays: 1,
    adults: 2,
    children: 0,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTravelersPicker, setShowTravelersPicker] = useState(false);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  // Generate day plans when trip settings change
  useEffect(() => {
    const plans: DayPlan[] = [];
    for (let i = 0; i < tripSettings.numberOfDays; i++) {
      const date = new Date(tripSettings.startDate);
      date.setDate(date.getDate() + i);

      plans.push({
        dayNumber: i + 1,
        date: date.toDateString(),
        hasPlans: false,
      });
    }
    setDayPlans(plans);
  }, [tripSettings.startDate, tripSettings.numberOfDays]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getNumberOfNights = () => {
    return Math.max(0, tripSettings.numberOfDays - 1);
  };

  const handleAddPlan = (dayNumber: number) => {
    router.push({
      pathname: '/create',
      params: {
        dayNumber: dayNumber.toString(),
        date: dayPlans[dayNumber - 1]?.date || '',
        adults: tripSettings.adults.toString(),
        children: tripSettings.children.toString(),
      }
    });
  };

  const handleEditPlan = (dayNumber: number) => {
    router.push({
      pathname: './dayPlaning',
      params: {
        dayNumber: dayNumber.toString(),
        date: dayPlans[dayNumber - 1]?.date || '',
        adults: tripSettings.adults.toString(),
        children: tripSettings.children.toString(),
        editMode: 'true',
      }
    });
  };

  const DatePickerModal: React.FC = () => (
    <Modal
      visible={showDatePicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowDatePicker(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-2xl pb-4 ios:pb-8">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-800">Select Start Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
              <Icon name="close" size={24} color="#1f2937" />
            </TouchableOpacity>
          </View>

          <View className="p-4 items-center">
            <Text className="text-2xl font-semibold text-gray-800 mb-2">{formatDate(tripSettings.startDate)}</Text>
            <Text className="text-sm text-gray-500 mb-6">Select your trip start date</Text>

            <View className="flex-row gap-4">
              <TouchableOpacity
                className="bg-yellow-300 px-4 py-2 rounded-md"
                onPress={() => {
                  const newDate = new Date(tripSettings.startDate);
                  newDate.setDate(newDate.getDate() - 1);
                  setTripSettings(prev => ({ ...prev, startDate: newDate }));
                }}
              >
                <Text className="text-sm font-semibold text-yellow-800">Previous Day</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-yellow-300 px-4 py-2 rounded-md"
                onPress={() => {
                  const newDate = new Date(tripSettings.startDate);
                  newDate.setDate(newDate.getDate() + 1);
                  setTripSettings(prev => ({ ...prev, startDate: newDate }));
                }}
              >
                <Text className="text-sm font-semibold text-yellow-800">Next Day</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className="bg-yellow-300 m-4 py-3.5 rounded-lg items-center"
            onPress={() => setShowDatePicker(false)}
          >
            <Text className="text-base font-semibold text-yellow-800">Confirm Date</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const DayPlanCard: React.FC<{ dayPlan: DayPlan }> = ({ dayPlan }) => (
    <View className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-semibold text-gray-800">Day {dayPlan.dayNumber}</Text>
        <Text className="text-sm text-gray-500 flex-1 ml-2">{new Date(dayPlan.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</Text>
        {dayPlan.hasPlans && (
          <TouchableOpacity
            className="flex-row items-center bg-blue-100 px-2 py-1 rounded-md gap-1"
            onPress={() => handleEditPlan(dayPlan.dayNumber)}
          >
            <Icon name="edit" size={16} color="#2563eb" />
            <Text className="text-xs font-medium text-blue-600">Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {dayPlan.hasPlans && dayPlan.planSummary ? (
        <View className="mb-3">
          <Text className="text-sm font-semibold text-gray-800 mb-2">Plan Summary:</Text>
          {dayPlan.planSummary.items.map((item, index) => (
            <Text key={index} className="text-sm text-gray-600 mb-1">• {item}</Text>
          ))}
          <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-200">
            <Text className="text-sm font-medium text-gray-600">Day Cost:</Text>
            <Text className="text-base font-semibold text-red-600">
              LKR {dayPlan.planSummary.totalCost.toLocaleString()}
            </Text>
          </View>
        </View>
      ) : (
        <View className="items-center py-4">
          <Text className="text-sm text-gray-400 italic">No plans added yet</Text>
        </View>
      )}

      <TouchableOpacity
        className={`flex-row items-center justify-center py-2.5 rounded-md gap-1.5 ${dayPlan.hasPlans ? 'bg-blue-100 border border-blue-600' : 'bg-yellow-300'}`}
        onPress={() => handleAddPlan(dayPlan.dayNumber)}
      >
        <Icon name="plus" size={16} color={dayPlan.hasPlans ? '#2563eb' : '#a16207'} />
        <Text className={`text-sm font-semibold ${dayPlan.hasPlans ? 'text-blue-700' : 'text-yellow-800'}`}>
          {dayPlan.hasPlans ? 'Modify Plan' : 'Add Plan'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      <StatusBar backgroundColor="#fde047" barStyle="dark-content" />

      {/* Header */}
      <View className="bg-yellow-300 flex-row items-center px-4 py-3 android:pt-5">

        <Text className="text-gray-800 text-lg font-semibold flex-1 text-center">Customize Trip</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Trip Settings Section */}
        <View className="bg-white m-4 rounded-xl p-4 shadow">
          <Text className="text-xl font-semibold text-gray-800 mb-1">Plan Your Trip</Text>

          {/* Start Date */}
          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => setShowDatePicker(true)}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-yellow-50 items-center justify-center mr-3">
                <Icon name="calendar" size={20} color="#a16207" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-0.5">Start Date</Text>
                <Text className="text-base font-semibold text-gray-800">{formatDate(tripSettings.startDate)}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {/* Duration */}
          <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-yellow-50 items-center justify-center mr-3">
                <Icon name="calendar" size={20} color="#a16207" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-0.5">Duration</Text>
                <Text className="text-base font-semibold text-gray-800">
                  {tripSettings.numberOfDays} days, {getNumberOfNights()} nights
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                className={`w-8 h-8 rounded-full bg-yellow-50 border border-yellow-300 items-center justify-center ${tripSettings.numberOfDays <= 1 ? 'bg-gray-100 border-gray-200' : ''}`}
                onPress={() => {
                  if (tripSettings.numberOfDays > 1) {
                    setTripSettings(prev => ({ ...prev, numberOfDays: prev.numberOfDays - 1 }));
                  }
                }}
                disabled={tripSettings.numberOfDays <= 1}
              >
                <Icon name="minus" size={16} color={tripSettings.numberOfDays <= 1 ? '#9ca3af' : '#a16207'} />
              </TouchableOpacity>

              <Text className="text-lg font-semibold text-gray-800 min-w-[30px] text-center">{tripSettings.numberOfDays}</Text>

              <TouchableOpacity
                className="w-8 h-8 rounded-full bg-yellow-50 border border-yellow-300 items-center justify-center"
                onPress={() => setTripSettings(prev => ({ ...prev, numberOfDays: prev.numberOfDays + 1 }))}
              >
                <Icon name="plus" size={16} color="#a16207" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Travelers */}
          <TouchableOpacity
            className="flex-row items-center justify-between py-4"
            onPress={() => setShowTravelersPicker(true)}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-yellow-50 items-center justify-center mr-3">
                <Icon name="users" size={20} color="#a16207" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-0.5">Travelers</Text>
                <Text className="text-base font-semibold text-gray-800">
                  {tripSettings.adults} Adult{tripSettings.adults > 1 ? 's' : ''}
                  {tripSettings.children > 0 && `, ${tripSettings.children} Child${tripSettings.children > 1 ? 'ren' : ''}`}
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Day Plans Section */}
        <View className="bg-white m-4 mt-0 rounded-xl p-4 shadow">
          <Text className="text-xl font-semibold text-gray-800 mb-1">Day by Day Plans</Text>
          <Text className="text-sm text-gray-500 mb-4">Plan each day of your trip</Text>

          {dayPlans.map((dayPlan) => (
            <DayPlanCard key={dayPlan.dayNumber} dayPlan={dayPlan} />
          ))}
        </View>

        {/* Cost Summary */}
        {totalCost > 0 && (
          <View className="m-4 mt-0">
            <View className="bg-white rounded-xl p-5 items-center shadow">
              <Text className="text-base text-gray-500 mb-2">Total Cost So Far</Text>
              <Text className="text-2xl font-bold text-red-600">LKR {totalCost.toLocaleString()}</Text>
            </View>
          </View>
        )}

        <View className="h-5" />
      </ScrollView>

      {/* Modals */}
      <DatePickerModal />
      <TravelersPickerModal
        visible={showTravelersPicker}
        onClose={() => setShowTravelersPicker(false)}
        tripSettings={tripSettings}
        setTripSettings={setTripSettings}
      />
    </SafeAreaView>
  );
};

export default TripPlannerScreen;
