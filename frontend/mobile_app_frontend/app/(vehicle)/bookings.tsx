import { router } from 'expo-router'
import { Text, View, TouchableOpacity, ScrollView } from 'react-native'

export default function App() {
    const FilterTab = ({ title, isActive }: { title: string, isActive: boolean }) => (
        <TouchableOpacity 
            className={`px-4 py-2 rounded-full ${isActive ? 'bg-[#FEFA17]' : 'bg-gray-200'}`}
        >
            <Text className={`text-sm font-medium ${isActive ? 'text-black' : 'text-gray-600'}`}>
                {title}
            </Text>
        </TouchableOpacity>
    )

    const StatusBadge = ({ status }: { status: string }) => {
        let bgColor = 'bg-gray-200'
        let textColor = 'text-gray-600'
        
        if (status === 'pending') {
            bgColor = 'bg-orange-200'
            textColor = 'text-orange-800'
        } else if (status === 'confirmed') {
            bgColor = 'bg-green-200'
            textColor = 'text-green-800'
        } else if (status === 'completed') {
            bgColor = 'bg-blue-200'
            textColor = 'text-blue-800'
        }

        return (
            <View className={`px-3 py-1 rounded-full ${bgColor}`}>
                <Text className={`text-xs font-medium ${textColor}`}>
                    {status}
                </Text>
            </View>
        )
    }

    const BookingCard = ({
        id, 
        title, 
        subtitle, 
        dateRange, 
        location, 
        status, 
        buttonText, 
        buttonColor 
    }: { 
        id:string,
        title: string, 
        subtitle: string, 
        dateRange: string, 
        location: string, 
        status: string, 
        buttonText: string, 
        buttonColor: string 
    }) => (
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800 mb-1">{title}{id}</Text>
                    <Text className="text-sm text-gray-600">{subtitle}</Text>
                </View>
                <StatusBadge status={status} />
            </View>

            <View className="mb-4">
                <View className="flex-row items-center mb-2">
                    <Text className="text-gray-500 text-sm">📅</Text>
                    <Text className="text-sm text-gray-600 ml-2">{dateRange}</Text>
                </View>
                <View className="flex-row items-center">
                    <Text className="text-gray-500 text-sm">📍</Text>
                    <Text className="text-sm text-gray-600 ml-2">{location}</Text>
                </View>
            </View>

            <TouchableOpacity 
                className={`py-3 rounded-lg ${buttonColor}`}
                onPress={()=>router.push(title!="Group Tour - 7 people"?`/views/bookings/soloTrips/${id}`:`/views/bookings/groupTrips/${id}`)}
            >
                <Text className="text-center text-black font-medium">
                    {buttonText}
                </Text>
            </TouchableOpacity>
        </View>
    )

    const bookings = 

        {
            id:'1',
            title:"Nimal Gamage",
                    subtitle:"Toyota Prius",
                    dateRange:"2023-06-10 - 2023-06-12",
                    location:"Colombo Airport",
                    status:"pending",
                    buttonText:"View Details",
                    buttonColor:"bg-white border border-gray-300"
                }

    

    return (
        <ScrollView className="flex-1 bg-[#F2F0EF]">
            <View className="px-4 pt-4 pb-24">
                {/* Filter Tabs */}
                <View className="flex-row space-x-3 mb-6">
                    <FilterTab title="All" isActive={true} />
                    <FilterTab title="Pending" isActive={false} />
                    <FilterTab title="Confirmed" isActive={false} />
                    <FilterTab title="Completed" isActive={false} />
                </View>

                {/* Booking Cards */}
                <BookingCard
                id={bookings.id}
                    title={bookings.title}
                    subtitle={bookings.subtitle}
                    dateRange={bookings.dateRange}
                    location={bookings.location}
                    status={bookings.status}
                    buttonText={bookings.buttonText}
                    buttonColor={bookings.buttonColor}
                />

                 <BookingCard
                 id='1'
                    title="Group Tour - 7 people"
                    subtitle="Sigiriya"
                    dateRange="2023-06-15 - 2023-06-16"
                    location="Nagarjuna Hotel"
                    status="pending"
                    buttonText="View Details"
                    buttonColor="bg-white border border-gray-300"
                />

                {/*<BookingCard
                    title="Group Tour - 5 people"
                    subtitle="Tangalle Island"
                    dateRange="2023-07-01 - 2023-07-03"
                    location="Nuwara Eliya"
                    status="completed"
                    buttonText="View Details"
                    buttonColor="bg-white border border-gray-300"
                /> */}
            </View>
        </ScrollView>
    )
}