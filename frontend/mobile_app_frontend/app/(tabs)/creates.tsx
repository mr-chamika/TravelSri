import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { cssInterop } from 'nativewind'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

cssInterop(Image, { className: "style" });

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
    'hotel': '🏨',
    'guide': '🧭',
    'vehicle': '🚗',
    'delete': '🗑️'
  };

  return (
    <Text style={{ fontSize: size, color }}>
      {iconMap[name] || '•'}
    </Text>
  );
};

interface MyToken {
  sub: string;
  roles: string[];
  username: string;
  email: string;
  id: string
}

interface Trip {

  _id: string;
  creatorId: string;
  serviceId: string;
  type: string;
  dayNumber: string;
  status: string;//"confirmed","pending","cancel:string"
  date: string;//vehicle booked dat:stringe

  bookingData: any;

}

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
  planSummary?: Trip[];
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

  const { id } = useLocalSearchParams();

  const router = useRouter();

  const [selectedId, setSelectedId] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTravelersPicker, setShowTravelersPicker] = useState(false);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [dataSet, setDataSet] = useState<Trip[]>([])
  const [tripSettings, setTripSettings] = useState<TripSettings>({
    startDate: new Date(),
    numberOfDays: 1,
    adults: 2,
    children: 0,
  });

  const getData = async () => {
    try {
      const res = await fetch(`http://192.168.1.150:8080/traveler/trip-one?id=${id}`)

      if (res) {
        let data = await res.json();
        setDataSet(data);
        // Group trips by day number
        const groupedByDay: Record<number, Trip[]> = {};
        data.forEach((trip: Trip) => {
          const dayNum = parseInt(trip.dayNumber);
          if (!groupedByDay[dayNum]) {
            groupedByDay[dayNum] = [];
          }
          groupedByDay[dayNum].push(trip);
        });

        // Find the maximum day number
        const maxDay = Math.max(...Object.keys(groupedByDay).map(Number));

        setTripSettings(prev => ({
          ...prev,
          numberOfDays: maxDay,
        }));

        // Create day plans with grouped trips
        const plans: DayPlan[] = [];
        for (let i = 1; i <= maxDay; i++) {
          const tripsForDay = groupedByDay[i] || [];
          const firstTrip = tripsForDay[0];

          plans.push({
            dayNumber: i,
            date: firstTrip ? new Date(firstTrip.date).toDateString() : "",
            hasPlans: tripsForDay.length > 0,
            planSummary: tripsForDay, // Array of trips for this day
          });
        }

        setDayPlans(plans);
      }
    } catch (err) {
      console.log(`Error from trip data getting : ${err}`)
    }
  }

  useFocusEffect(
    useCallback(() => {

      if (id) {

        getData();

      } else {
        setDataSet([]);
        setDayPlans([]);
        setTripSettings({
          startDate: new Date(),
          numberOfDays: 1,
          adults: 2,
          children: 0,
        });

      }
    }, [id, isModalVisible])
  );

  const bookNow = async (id: string, type: string, serviceId: string, bookingData: any, date: string) => {

    const keys = await AsyncStorage.getItem("token");

    if (keys) {

      const token: MyToken = jwtDecode(keys)

      const book = {
        _id: id,
        userId: token.id,
        serviceId: serviceId,
        type: type + 's',
        thumbnail: '',
        title: '',
        subtitle: type == 'vehicle' ? [`${bookingData.startLocation} to ${bookingData.endLocation}`] : [],
        location: bookingData.location,
        bookingDates: [date],
        ratings: 0,
        paymentStatus: true,
        facilities: [],
        price: 0,
        status: 'active',
        mobileNumber: '',
        stars: 0,
        singleRooms: bookingData.singleRooms || 0,
        doubleRooms: bookingData.doubleRooms || 0,
        guests: bookingData.guests || 0
      }

      console.log(book)

      await fetch(`http://192.168.1.150:8080/traveler/create-booking`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)

      })
        .then(res => res.text())
        .then(data => { console.log(data); router.replace('/(tabs)/bookings') })
        .catch(err => console.log("Error from booking create " + err))

    }

  }

  // Generate day plans when trip settings change
  useEffect(() => {
    setDayPlans(prev => {

      const plans: DayPlan[] = [];
      for (let i = 0; i < tripSettings.numberOfDays; i++) {
        const date = new Date(tripSettings.startDate);

        date.setDate(date.getDate() + i);

        // Try to keep existing planSummary and hasPlans if present
        const existing = prev.find(p => p.dayNumber === i + 1);

        plans.push({
          dayNumber: i + 1,
          date: date.toDateString(),
          hasPlans: existing?.hasPlans ?? false,
          planSummary: existing?.planSummary,
        });
      }
      return plans;
    });
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
        createdId: id || "",
        dayNumber: dayNumber.toString(),
        date: dayPlans[dayNumber - 1].date || '',
        adults: tripSettings.adults.toString(),
        children: tripSettings.children.toString(),
      }
    });
  };

  const handleEditPlan = (tripId: string) => {
    const trip = dataSet.find(t => t._id === tripId);

    if (trip) {
      const route = trip.type === 'vehicle'
        ? `/views/car/profile/${trip.serviceId}`
        : `/views/${trip.type}/group/${trip.serviceId}`;
      const params = new URLSearchParams({
        createdId: id?.toString() || "",
        tripId: trip._id,
        dayNumber: trip.dayNumber,
        date: trip.date,
        adults: tripSettings.adults.toString(),
        children: tripSettings.children.toString(),
        bookingDatas: JSON.stringify(trip.bookingData),
        editMode: 'true',
      });

      router.push(`${route}?${params.toString()}` as any);

    }
  };
  const handleDeletePlan = async (tripId: string) => {

    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to remove booking?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes",
            onPress: async () => {

              const res = await fetch(`http://192.168.1.150:8080/traveler/trip?id=${tripId}`, {

                method: 'DELETE'

              });

              if (res.ok) {

                const data = await res.text();
                console.log(data);

              } else {

                console.log('Delete failed');


              }

            },
            style: "destructive"
          }
        ]
      );
    } else {

      setIsModalVisible(true);
      setSelectedId(tripId);

    }

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
        <Text className="text-sm text-gray-500 flex-1 ml-2">
          {new Date(dayPlan.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </Text>
        {dayPlan.hasPlans && dayPlan.planSummary && (
          <Text className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            {dayPlan.planSummary.length} plan{dayPlan.planSummary.length !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {dayPlan.hasPlans && dayPlan.planSummary && dayPlan.planSummary.length > 0 ? (
        <View className="mb-3">
          <ScrollView
            className="w-full max-h-80"
            showsVerticalScrollIndicator={false}
          >
            {dayPlan.planSummary.map((trip, index) => (
              <TouchableOpacity key={trip._id} className="mb-4 p-3 bg-white rounded-lg border border-gray-200"
                onPress={() => {
                  const route = trip.type === 'vehicle'
                    ? `/views/car/profile/${trip.serviceId}`
                    : `/views/${trip.type}/group/${trip.serviceId}`;

                  router.push({

                    pathname: route as any,
                    params: {

                      viewMode: 'true',
                      tripId: trip._id,
                      dayNumber: trip.dayNumber,
                      date: trip.date,
                      adults: tripSettings.adults.toString(),
                      children: tripSettings.children.toString(),
                      bookingDatas: JSON.stringify(trip.bookingData),
                      singleRooms: trip.bookingData.singleRooms,
                      doubleRooms: trip.bookingData.doubleRooms

                    }

                  });
                }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className='flex-row items-center gap-2'>
                    <Icon name={trip.type} size={16} color='yellow' />
                    <Text className="text-lg font-semibold text-gray-800">{trip.type}</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    {trip.status != 'active' || trip.type == 'hotel' && <TouchableOpacity
                      className="flex-row items-center bg-blue-100 px-2 py-1 rounded-md gap-1"
                      onPress={() => handleEditPlan(trip._id)}
                    >
                      <Icon name="edit" size={16} color="#2563eb" />
                      {/* <Text className="mt-0.5 text-xs font-medium text-blue-600">Edit</Text> */}
                    </TouchableOpacity>}
                    <TouchableOpacity
                      className="flex-row items-center bg-blue-100 px-2 py-1 rounded-md gap-1"
                      onPress={() => handleDeletePlan(trip._id)}
                    >
                      <Icon name="delete" size={16} color="#2563eb" />
                      {/* <Text className="mt-0.5 text-xs font-medium text-blue-600">Delete</Text> */}
                    </TouchableOpacity>
                    <Text className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {trip.status}
                    </Text>
                  </View>
                </View>

                <View className="space-y-2">
                  <Text className="text-sm text-gray-600">Type: {trip.type}</Text>
                  <Text className="text-sm text-gray-600">Service ID: {trip.serviceId}</Text>
                  <Text className="text-sm text-gray-600">Date: {trip.date}</Text>

                  {/* Add more trip details here as needed */}
                  {/* {trip.hotel && (
                  <View className="mt-2 p-2 bg-gray-50 rounded">
                    <Text className="text-sm font-medium text-gray-700">Hotel: {trip.hotel}</Text>
                    <Text className="text-xs text-gray-500">Location: {trip.hlocation}</Text>
                  </View>
                )} */}
                  {trip.status == "pending" && <TouchableOpacity className='bg-green-400 items-center pb-2 pt-1 rounded-lg' onPress={() => bookNow(trip._id, trip.type, trip.serviceId, trip.bookingData, trip.date)}>
                    <View><Text>Book Now</Text></View>
                  </TouchableOpacity>}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View className="items-center py-4">
          <Text className="text-sm text-gray-400 italic">No plans added yet</Text>
        </View>
      )}

      <TouchableOpacity
        className="flex-row items-center justify-center py-2.5 mt-5 rounded-md gap-1.5 bg-yellow-300"
        onPress={() => handleAddPlan(dayPlan.dayNumber)}
      >
        <Icon name="plus" size={16} color="#a16207" />
        <Text className="text-sm font-semibold text-yellow-800">
          {dayPlan.hasPlans ? 'Add Another Plan' : 'Add Plan'}
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

          {/* Start Date/ */}
          <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-gray-100"
            onPress={() => setShowDatePicker(true)}
            disabled={typeof id === "string" && id.trim() !== ""}

          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-yellow-50 items-center justify-center mr-3">
                <Icon name="calendar" size={20} color="#a16207" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500 mb-0.5">Start Date</Text>
                <Text className="text-base font-semibold text-gray-800">{formatDate((typeof id === "string" && id.trim() !== "") ? new Date(dataSet[0]?.date) : tripSettings.startDate)}</Text>
              </View>
            </View>
            {!(typeof id === "string" && id.trim() !== "") && <Icon name="chevron-right" size={20} color="#9ca3af" />}
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
            disabled={typeof id === "string" && id.trim() !== ""}

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
            {!(typeof id === "string" && id.trim() !== "") && <Icon name="chevron-right" size={20} color="#9ca3af" />}
          </TouchableOpacity>
        </View>

        {/* Day Plans Section */}
        <View className="bg-white m-4 mt-0 rounded-xl p-4 shadow">

          <View className='mb-2 w-full flex-row items-center justify-between'>
            <Text className="text-xl font-semibold text-gray-800 mb-1">Day by Day Plans</Text>
            {dataSet.length > 0 && id &&
              <TouchableOpacity
                className='flex-row items-center justify-center py-2 px-4 rounded-md gap-1.5 bg-blue-100 border border-blue-600'
                onPress={() => router.replace('/(tabs)/creates')}
              >

                <Text className='text-xl font-semibold text-black'>
                  + New Trip
                </Text>
              </TouchableOpacity>
            }
          </View>
          {/* <Text className="text-sm text-gray-500 mb-4">Plan each day of your trip</Text> */}

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

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <Text className="text-lg font-bold text-gray-800">Confirm Delete</Text>
            <Text className="text-base text-gray-600 my-4">Are you sure you want to delete booking ?</Text>
            <View className="flex-row justify-center gap-3">

              <TouchableOpacity
                onPress={async () => {

                  const res = await fetch(`http://192.168.1.150:8080/traveler/trip?id=${selectedId}`, {

                    method: 'DELETE'

                  });

                  if (res.ok) {

                    const data = await res.text();
                    console.log(data);
                    setIsModalVisible(false);

                  } else {

                    console.log('Delete failed');
                    setIsModalVisible(false);

                  }


                }}
                className=" px-4 py-2"
              >
                <Text className="font-semibold text-blue-500">Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="px-4 py-2 rounded"
              >
                <Text className="font-semibold text-red-500">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default TripPlannerScreen;
