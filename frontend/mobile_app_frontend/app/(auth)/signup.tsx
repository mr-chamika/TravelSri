import React, { useState, useEffect } from 'react';
import isValidPhoneNumber, { type CountryCode } from 'libphonenumber-js/min';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'
import emailjs from '@emailjs/browser'

// Make sure this path is correct in your project
const plusIcon = require('../../assets/images/plus (1).png');
const otpIcon = require('../../assets/images/otp.png');


const steps = [
    { id: 1, title: 'Personal Details' },
    { id: 2, title: 'Business Info' },
    { id: 3, title: 'Availability & Documents' },
    { id: 4, title: 'Confirmation' },
    { id: 5, title: 'Authentication' },
];

interface FormData {
    // Step 1
    firstName: string;
    lastName: string;
    mobileNumber: string;
    whatsappNumber: string;
    email: string;
    username: string;
    address: string;
    nicPassport: string;
    dob: string;
    gender: string;
    country: string;
    password: string;
    confirmPassword: string;
    role: string;
    pp: ImagePickerAsset | null; // Profile Picture

    // Step 2
    businessName: string;
    registrationNumber: string;
    businessType: string;
    description: string;
    businessAddress: string;
    bp: ImagePickerAsset | null; // Business Photo

    // Step 3
    daysPerWeek: string[];
    startTime: string;
    endTime: string;
    businessRegPic1: ImagePickerAsset | null;
    businessRegPic2: ImagePickerAsset | null;

    // Language Selection
    languages: string[];

    // Step 3 - Bank Details (for guide and vehicle providers only)
    bankName: string;
    accountHolderName: string;
    accountNumber: string;

    // Step 4 & Others
    identitypic1: ImagePickerAsset | null;
    identitypic2: ImagePickerAsset | null;
    location: string; // Location name from API search
    agreeTerms: boolean;
    confirmCondition: boolean;
    status: string;
    verified: string;
    identified: string;
}

export default function SignupForm() {
    const [step, setStep] = useState(1);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState({ code: '', timestamp: 0 });
    const [formData, setFormData] = useState<FormData>({
        // Step 1
        firstName: '',
        lastName: '',
        mobileNumber: '',
        whatsappNumber: '',
        email: '',
        username: '',
        address: '',
        nicPassport: '',
        dob: '',
        gender: '',
        country: '',
        password: '',
        confirmPassword: '',
        role: '',
        pp: null, // Profile Picture

        // Step 2
        businessName: '',
        registrationNumber: '',
        businessType: '',
        description: '',
        businessAddress: '',
        bp: null, // Business Photo

        // Step 3
        daysPerWeek: [],
        startTime: '',
        endTime: '',
        businessRegPic1: null,
        businessRegPic2: null,

        // Step 3 - Bank Details (for guide and vehicle providers only)
        bankName: '',
        accountHolderName: '',
        accountNumber: '',

        // Language Selection
        languages: [],

        // Step 4 & Others
        identitypic1: null,
        identitypic2: null,
        location: '',
        agreeTerms: false,
        confirmCondition: false,
        status: '',
        verified: "pending",
        identified: "pending"
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [emailCheckStatus, setEmailCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [selectedImage, setSelectedImage] = useState(null)

    const [isCalendarVisible, setIsCalendarVisible] = useState(false)
    
    // Time picker states
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [startHour, setStartHour] = useState('09');
    const [startMinute, setStartMinute] = useState('00');
    const [endHour, setEndHour] = useState('17');
    const [endMinute, setEndMinute] = useState('00');

    // Location search states
    const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

    // Country search states
    const [countries, setCountries] = useState<any[]>([]);
    const [countrySearch, setCountrySearch] = useState('');
    const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
    const [countrySuggestions, setCountrySuggestions] = useState<any[]>([]);
    const [isCountrySelected, setIsCountrySelected] = useState(false);

    // Available languages for selection
    const availableLanguages = [
        'English',
        'Sinhala',
        'Tamil',
        'French',
        'German',
        'Spanish',
        'Italian',
        'Japanese',
        'Chinese',
        'Hindi',
        'Dutch',
        'Portuguese',
        'Russian',
        'Korean',
        'Arabic'
    ];

    // Fallback countries list in case API fails
    const FALLBACK_COUNTRIES = [
        { label: 'Afghanistan', value: 'AF', phoneCode: '+93' },
        { label: 'Albania', value: 'AL', phoneCode: '+355' },
        { label: 'Algeria', value: 'DZ', phoneCode: '+213' },
        { label: 'Andorra', value: 'AD', phoneCode: '+376' },
        { label: 'Angola', value: 'AO', phoneCode: '+244' },
        { label: 'Argentina', value: 'AR', phoneCode: '+54' },
        { label: 'Armenia', value: 'AM', phoneCode: '+374' },
        { label: 'Australia', value: 'AU', phoneCode: '+61' },
        { label: 'Austria', value: 'AT', phoneCode: '+43' },
        { label: 'Azerbaijan', value: 'AZ', phoneCode: '+994' },
        { label: 'Bahamas', value: 'BS', phoneCode: '+1-242' },
        { label: 'Bahrain', value: 'BH', phoneCode: '+973' },
        { label: 'Bangladesh', value: 'BD', phoneCode: '+880' },
        { label: 'Barbados', value: 'BB', phoneCode: '+1-246' },
        { label: 'Belarus', value: 'BY', phoneCode: '+375' },
        { label: 'Belgium', value: 'BE', phoneCode: '+32' },
        { label: 'Belize', value: 'BZ', phoneCode: '+501' },
        { label: 'Benin', value: 'BJ', phoneCode: '+229' },
        { label: 'Bhutan', value: 'BT', phoneCode: '+975' },
        { label: 'Bolivia', value: 'BO', phoneCode: '+591' },
        { label: 'Bosnia and Herzegovina', value: 'BA', phoneCode: '+387' },
        { label: 'Botswana', value: 'BW', phoneCode: '+267' },
        { label: 'Brazil', value: 'BR', phoneCode: '+55' },
        { label: 'Brunei', value: 'BN', phoneCode: '+673' },
        { label: 'Bulgaria', value: 'BG', phoneCode: '+359' },
        { label: 'Burkina Faso', value: 'BF', phoneCode: '+226' },
        { label: 'Burundi', value: 'BI', phoneCode: '+257' },
        { label: 'Cambodia', value: 'KH', phoneCode: '+855' },
        { label: 'Cameroon', value: 'CM', phoneCode: '+237' },
        { label: 'Canada', value: 'CA', phoneCode: '+1' },
        { label: 'Cape Verde', value: 'CV', phoneCode: '+238' },
        { label: 'Central African Republic', value: 'CF', phoneCode: '+236' },
        { label: 'Chad', value: 'TD', phoneCode: '+235' },
        { label: 'Chile', value: 'CL', phoneCode: '+56' },
        { label: 'China', value: 'CN', phoneCode: '+86' },
        { label: 'Colombia', value: 'CO', phoneCode: '+57' },
        { label: 'Comoros', value: 'KM', phoneCode: '+269' },
        { label: 'Congo', value: 'CG', phoneCode: '+242' },
        { label: 'Costa Rica', value: 'CR', phoneCode: '+506' },
        { label: 'Croatia', value: 'HR', phoneCode: '+385' },
        { label: 'Cuba', value: 'CU', phoneCode: '+53' },
        { label: 'Cyprus', value: 'CY', phoneCode: '+357' },
        { label: 'Czech Republic', value: 'CZ', phoneCode: '+420' },
        { label: 'Denmark', value: 'DK', phoneCode: '+45' },
        { label: 'Djibouti', value: 'DJ', phoneCode: '+253' },
        { label: 'Dominica', value: 'DM', phoneCode: '+1-767' },
        { label: 'Dominican Republic', value: 'DO', phoneCode: '+1-809' },
        { label: 'Ecuador', value: 'EC', phoneCode: '+593' },
        { label: 'Egypt', value: 'EG', phoneCode: '+20' },
        { label: 'El Salvador', value: 'SV', phoneCode: '+503' },
        { label: 'Equatorial Guinea', value: 'GQ', phoneCode: '+240' },
        { label: 'Eritrea', value: 'ER', phoneCode: '+291' },
        { label: 'Estonia', value: 'EE', phoneCode: '+372' },
        { label: 'Eswatini', value: 'SZ', phoneCode: '+268' },
        { label: 'Ethiopia', value: 'ET', phoneCode: '+251' },
        { label: 'Fiji', value: 'FJ', phoneCode: '+679' },
        { label: 'Finland', value: 'FI', phoneCode: '+358' },
        { label: 'France', value: 'FR', phoneCode: '+33' },
        { label: 'Gabon', value: 'GA', phoneCode: '+241' },
        { label: 'Gambia', value: 'GM', phoneCode: '+220' },
        { label: 'Georgia', value: 'GE', phoneCode: '+995' },
        { label: 'Germany', value: 'DE', phoneCode: '+49' },
        { label: 'Ghana', value: 'GH', phoneCode: '+233' },
        { label: 'Greece', value: 'GR', phoneCode: '+30' },
        { label: 'Grenada', value: 'GD', phoneCode: '+1-473' },
        { label: 'Guatemala', value: 'GT', phoneCode: '+502' },
        { label: 'Guinea', value: 'GN', phoneCode: '+224' },
        { label: 'Guinea-Bissau', value: 'GW', phoneCode: '+245' },
        { label: 'Guyana', value: 'GY', phoneCode: '+592' },
        { label: 'Haiti', value: 'HT', phoneCode: '+509' },
        { label: 'Honduras', value: 'HN', phoneCode: '+504' },
        { label: 'Hong Kong', value: 'HK', phoneCode: '+852' },
        { label: 'Hungary', value: 'HU', phoneCode: '+36' },
        { label: 'Iceland', value: 'IS', phoneCode: '+354' },
        { label: 'India', value: 'IN', phoneCode: '+91' },
        { label: 'Indonesia', value: 'ID', phoneCode: '+62' },
        { label: 'Iran', value: 'IR', phoneCode: '+98' },
        { label: 'Iraq', value: 'IQ', phoneCode: '+964' },
        { label: 'Ireland', value: 'IE', phoneCode: '+353' },
        { label: 'Israel', value: 'IL', phoneCode: '+972' },
        { label: 'Italy', value: 'IT', phoneCode: '+39' },
        { label: 'Jamaica', value: 'JM', phoneCode: '+1-876' },
        { label: 'Japan', value: 'JP', phoneCode: '+81' },
        { label: 'Jordan', value: 'JO', phoneCode: '+962' },
        { label: 'Kazakhstan', value: 'KZ', phoneCode: '+7' },
        { label: 'Kenya', value: 'KE', phoneCode: '+254' },
        { label: 'Kiribati', value: 'KI', phoneCode: '+686' },
        { label: 'Kosovo', value: 'XK', phoneCode: '+383' },
        { label: 'Kuwait', value: 'KW', phoneCode: '+965' },
        { label: 'Kyrgyzstan', value: 'KG', phoneCode: '+996' },
        { label: 'Laos', value: 'LA', phoneCode: '+856' },
        { label: 'Latvia', value: 'LV', phoneCode: '+371' },
        { label: 'Lebanon', value: 'LB', phoneCode: '+961' },
        { label: 'Lesotho', value: 'LS', phoneCode: '+266' },
        { label: 'Liberia', value: 'LR', phoneCode: '+231' },
        { label: 'Libya', value: 'LY', phoneCode: '+218' },
        { label: 'Liechtenstein', value: 'LI', phoneCode: '+423' },
        { label: 'Lithuania', value: 'LT', phoneCode: '+370' },
        { label: 'Luxembourg', value: 'LU', phoneCode: '+352' },
        { label: 'Macao', value: 'MO', phoneCode: '+853' },
        { label: 'Madagascar', value: 'MG', phoneCode: '+261' },
        { label: 'Malawi', value: 'MW', phoneCode: '+265' },
        { label: 'Malaysia', value: 'MY', phoneCode: '+60' },
        { label: 'Maldives', value: 'MV', phoneCode: '+960' },
        { label: 'Mali', value: 'ML', phoneCode: '+223' },
        { label: 'Malta', value: 'MT', phoneCode: '+356' },
        { label: 'Marshall Islands', value: 'MH', phoneCode: '+692' },
        { label: 'Mauritania', value: 'MR', phoneCode: '+222' },
        { label: 'Mauritius', value: 'MU', phoneCode: '+230' },
        { label: 'Mexico', value: 'MX', phoneCode: '+52' },
        { label: 'Micronesia', value: 'FM', phoneCode: '+691' },
        { label: 'Moldova', value: 'MD', phoneCode: '+373' },
        { label: 'Monaco', value: 'MC', phoneCode: '+377' },
        { label: 'Mongolia', value: 'MN', phoneCode: '+976' },
        { label: 'Montenegro', value: 'ME', phoneCode: '+382' },
        { label: 'Morocco', value: 'MA', phoneCode: '+212' },
        { label: 'Mozambique', value: 'MZ', phoneCode: '+258' },
        { label: 'Myanmar', value: 'MM', phoneCode: '+95' },
        { label: 'Namibia', value: 'NA', phoneCode: '+264' },
        { label: 'Nauru', value: 'NR', phoneCode: '+674' },
        { label: 'Nepal', value: 'NP', phoneCode: '+977' },
        { label: 'Netherlands', value: 'NL', phoneCode: '+31' },
        { label: 'New Zealand', value: 'NZ', phoneCode: '+64' },
        { label: 'Nicaragua', value: 'NI', phoneCode: '+505' },
        { label: 'Niger', value: 'NE', phoneCode: '+227' },
        { label: 'Nigeria', value: 'NG', phoneCode: '+234' },
        { label: 'North Korea', value: 'KP', phoneCode: '+850' },
        { label: 'North Macedonia', value: 'MK', phoneCode: '+389' },
        { label: 'Norway', value: 'NO', phoneCode: '+47' },
        { label: 'Oman', value: 'OM', phoneCode: '+968' },
        { label: 'Pakistan', value: 'PK', phoneCode: '+92' },
        { label: 'Palau', value: 'PW', phoneCode: '+680' },
        { label: 'Palestine', value: 'PS', phoneCode: '+970' },
        { label: 'Panama', value: 'PA', phoneCode: '+507' },
        { label: 'Papua New Guinea', value: 'PG', phoneCode: '+675' },
        { label: 'Paraguay', value: 'PY', phoneCode: '+595' },
        { label: 'Peru', value: 'PE', phoneCode: '+51' },
        { label: 'Philippines', value: 'PH', phoneCode: '+63' },
        { label: 'Poland', value: 'PL', phoneCode: '+48' },
        { label: 'Portugal', value: 'PT', phoneCode: '+351' },
        { label: 'Qatar', value: 'QA', phoneCode: '+974' },
        { label: 'Romania', value: 'RO', phoneCode: '+40' },
        { label: 'Russia', value: 'RU', phoneCode: '+7' },
        { label: 'Rwanda', value: 'RW', phoneCode: '+250' },
        { label: 'Saint Kitts and Nevis', value: 'KN', phoneCode: '+1-869' },
        { label: 'Saint Lucia', value: 'LC', phoneCode: '+1-758' },
        { label: 'Saint Vincent and the Grenadines', value: 'VC', phoneCode: '+1-784' },
        { label: 'Samoa', value: 'WS', phoneCode: '+685' },
        { label: 'San Marino', value: 'SM', phoneCode: '+378' },
        { label: 'Sao Tome and Principe', value: 'ST', phoneCode: '+239' },
        { label: 'Saudi Arabia', value: 'SA', phoneCode: '+966' },
        { label: 'Senegal', value: 'SN', phoneCode: '+221' },
        { label: 'Serbia', value: 'RS', phoneCode: '+381' },
        { label: 'Seychelles', value: 'SC', phoneCode: '+248' },
        { label: 'Sierra Leone', value: 'SL', phoneCode: '+232' },
        { label: 'Singapore', value: 'SG', phoneCode: '+65' },
        { label: 'Slovakia', value: 'SK', phoneCode: '+421' },
        { label: 'Slovenia', value: 'SI', phoneCode: '+386' },
        { label: 'Solomon Islands', value: 'SB', phoneCode: '+677' },
        { label: 'Somalia', value: 'SO', phoneCode: '+252' },
        { label: 'South Africa', value: 'ZA', phoneCode: '+27' },
        { label: 'South Korea', value: 'KR', phoneCode: '+82' },
        { label: 'South Sudan', value: 'SS', phoneCode: '+211' },
        { label: 'Spain', value: 'ES', phoneCode: '+34' },
        { label: 'Sri Lanka', value: 'LK', phoneCode: '+94' },
        { label: 'Sudan', value: 'SD', phoneCode: '+249' },
        { label: 'Suriname', value: 'SR', phoneCode: '+597' },
        { label: 'Sweden', value: 'SE', phoneCode: '+46' },
        { label: 'Switzerland', value: 'CH', phoneCode: '+41' },
        { label: 'Syria', value: 'SY', phoneCode: '+963' },
        { label: 'Taiwan', value: 'TW', phoneCode: '+886' },
        { label: 'Tajikistan', value: 'TJ', phoneCode: '+992' },
        { label: 'Tanzania', value: 'TZ', phoneCode: '+255' },
        { label: 'Thailand', value: 'TH', phoneCode: '+66' },
        { label: 'Timor-Leste', value: 'TL', phoneCode: '+670' },
        { label: 'Togo', value: 'TG', phoneCode: '+228' },
        { label: 'Tonga', value: 'TO', phoneCode: '+676' },
        { label: 'Trinidad and Tobago', value: 'TT', phoneCode: '+1-868' },
        { label: 'Tunisia', value: 'TN', phoneCode: '+216' },
        { label: 'Turkey', value: 'TR', phoneCode: '+90' },
        { label: 'Turkmenistan', value: 'TM', phoneCode: '+993' },
        { label: 'Tuvalu', value: 'TV', phoneCode: '+688' },
        { label: 'Uganda', value: 'UG', phoneCode: '+256' },
        { label: 'Ukraine', value: 'UA', phoneCode: '+380' },
        { label: 'United Arab Emirates', value: 'AE', phoneCode: '+971' },
        { label: 'United Kingdom', value: 'GB', phoneCode: '+44' },
        { label: 'United States', value: 'US', phoneCode: '+1' },
        { label: 'Uruguay', value: 'UY', phoneCode: '+598' },
        { label: 'Uzbekistan', value: 'UZ', phoneCode: '+998' },
        { label: 'Vanuatu', value: 'VU', phoneCode: '+678' },
        { label: 'Vatican City', value: 'VA', phoneCode: '+379' },
        { label: 'Venezuela', value: 'VE', phoneCode: '+58' },
        { label: 'Vietnam', value: 'VN', phoneCode: '+84' },
        { label: 'Yemen', value: 'YE', phoneCode: '+967' },
        { label: 'Zambia', value: 'ZM', phoneCode: '+260' },
        { label: 'Zimbabwe', value: 'ZW', phoneCode: '+263' },
    ];

    // Load countries from external API on component mount
    useEffect(() => {
        const loadCountries = async () => {
            try {
                console.log('Loading countries from API...');
                const response = await fetch('https://restcountries.com/v3.1/all');
                const data = await response.json();
                
                console.log('Countries loaded:', data.length);
                
                // Sort countries by name
                const sortedCountries = data
                    .map((country: any) => ({
                        label: country.name.common,
                        value: country.cca2,
                        phoneCode: country.idd?.root ? country.idd.root + (country.idd.suffixes?.[0] || '') : '',
                    }))
                    .sort((a: any, b: any) => a.label.localeCompare(b.label));
                
                console.log('Countries sorted and set:', sortedCountries.slice(0, 5));
                setCountries(sortedCountries);
            } catch (error) {
                console.error('Error loading countries from API:', error);
                console.log('Using fallback countries list');
                // Use fallback list
                setCountries(FALLBACK_COUNTRIES);
            }
        };

        loadCountries();
    }, []);

    // Helper function to get days in a month considering leap years
    const getDaysInMonth = (year: string, month: string): number => {
        if (!year || !month) return 31;
        
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
        
        if (monthNum === 2) {
            // February - check for leap year
            const isLeapYear = (yearNum % 4 === 0 && yearNum % 100 !== 0) || (yearNum % 400 === 0);
            return isLeapYear ? 29 : 28;
        }
        
        // Months with 30 days: April (4), June (6), September (9), November (11)
        if ([4, 6, 9, 11].includes(monthNum)) {
            return 30;
        }
        
        // All other months have 31 days
        return 31;
    };

    // Location search function using backend API
    const searchLocations = async (query: string) => {
        if (!query || query.length < 2) {
            setLocationSuggestions([]);
            setShowLocationSuggestions(false);
            return;
        }

        try {
            const BACKEND_BASE_URL = 'http://192.168.1.150:8080';
            
            // For business users (guide, merchant, vehicle owner), restrict to Sri Lanka
            const isSriLankanOnly = formData.role !== 'user' && formData.role !== 'vehicle';
            
            let searchQuery = query;
            // If business user and not already mentioning Sri Lanka, add it to search
            if (isSriLankanOnly && !query.toLowerCase().includes('sri lanka')) {
                searchQuery = `${query}, Sri Lanka`;
            }
            
            const response = await fetch(
                `${BACKEND_BASE_URL}/api/places/autocomplete?input=${encodeURIComponent(searchQuery)}&types=geocode`
            );
            const data = await response.json();
            
            if (data.predictions) {
                // For business users, filter to only Sri Lankan locations
                let filteredPredictions = data.predictions;
                if (isSriLankanOnly) {
                    filteredPredictions = data.predictions.filter((place: any) => {
                        const description = place.description || '';
                        return description.toLowerCase().includes('sri lanka');
                    });
                }
                
                setLocationSuggestions(filteredPredictions);
                setShowLocationSuggestions(filteredPredictions.length > 0);
            } else {
                setLocationSuggestions([]);
                setShowLocationSuggestions(false);
            }
        } catch (error) {
            console.error('Location search error:', error);
            setLocationSuggestions([]);
            setShowLocationSuggestions(false);
        }
    };

    // Handle location selection
    const handleLocationSelect = (place: any, fieldName: 'address' | 'location' = 'location') => {
        const locationName = place.description || place.main_text || '';
        console.log('Location selected:', locationName, 'for field:', fieldName);
        handleChange(fieldName as keyof FormData, locationName);
        setShowLocationSuggestions(false);
        setLocationSuggestions([]);
    };

    // Country search function using location API
    const handleCountrySearch = async (text: string) => {
        console.log('handleCountrySearch called with text:', text);
        console.log('countries.length:', countries.length);
        setCountrySearch(text);
        
        // If nothing typed and countries are loaded, show all countries
        if (!text || text.length < 1) {
            console.log('Empty search, countries available:', countries.length > 0);
            if (countries.length > 0) {
                console.log('Showing all countries (first 15)');
                setCountrySuggestions(countries.slice(0, 15));
                setShowCountrySuggestions(true);
            } else {
                console.log('No countries loaded yet');
                setCountrySuggestions([]);
                setShowCountrySuggestions(false);
            }
            return;
        }

        try {
            // Wait a bit for countries to load if not loaded yet
            let countriesToSearch = countries;
            if (countriesToSearch.length === 0) {
                // Give it a moment for countries to load
                console.log('Waiting for countries to load...');
                await new Promise(resolve => setTimeout(resolve, 100));
                countriesToSearch = countries;
            }

            console.log('Filtering from', countriesToSearch.length, 'countries');
            
            // Filter from the loaded countries
            const localFiltered = countriesToSearch.filter((c: any) => 
                c.label.toLowerCase().includes(text.toLowerCase()) ||
                c.value.toLowerCase().includes(text.toLowerCase())
            );
            
            console.log('Local search results:', localFiltered.length);
            
            if (localFiltered.length > 0) {
                // Use local results - they already have proper country codes
                console.log('Setting suggestions to filtered results');
                setCountrySuggestions(localFiltered.slice(0, 15));
                setShowCountrySuggestions(true);
            } else {
                // No matches found
                console.log('No matches found');
                setCountrySuggestions([]);
                setShowCountrySuggestions(false);
            }
        } catch (error) {
            console.error('Country search error:', error);
            // Fallback to local search if any error
            const filtered = countries.filter((c: any) => 
                c.label.toLowerCase().includes(text.toLowerCase()) ||
                c.value.toLowerCase().includes(text.toLowerCase())
            );
            console.log('Fallback local search results:', filtered.length);
            setCountrySuggestions(filtered.slice(0, 15));
            setShowCountrySuggestions(filtered.length > 0);
        }
    };

    // Handle country selection
    const handleCountrySelect = (country: any) => {
        console.log('handleCountrySelect called with:', country);
        if (country && country.label) {
            console.log('Country value before setting:', country.value);
            console.log('Country label:', country.label);
            console.log('Setting country display to:', country.label);
            
            // Update form data with country code
            // If country.value is empty, try to find it from the countries array
            let countryCode = country.value;
            if (!countryCode) {
                const foundCountry = countries.find((c: any) => 
                    c.label.toLowerCase() === country.label.toLowerCase()
                );
                countryCode = foundCountry?.value || country.value || '';
                console.log('Country code resolved to:', countryCode);
            }
            
            handleChange('country', countryCode);
            
            // Show the country name in the input field using ONLY countrySearch
            setCountrySearch(country.label);
            
            // Close the dropdown
            setShowCountrySuggestions(false);
            setCountrySuggestions([]);
            setIsCountrySelected(true);
            
            // Log formData after update
            setTimeout(() => {
                console.log('FormData after update - country:', country);
                console.log('CountrySearch state:', countrySearch);
            }, 100);
        } else {
            console.log('Invalid country object:', country);
        }
    };

    // Reset country selection
    const resetCountrySelection = () => {
        handleChange('country', '');
        setCountrySearch('');
        setShowCountrySuggestions(false);
        setCountrySuggestions([]);
        setIsCountrySelected(false);
    };

    const handleChoosePhoto = async (field: keyof FormData) => {
        // 1. Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        // 2. Launch the image library
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true, // Optional: for simple cropping
                quality: 1,
                base64: true, // Ask for the Base64 string directly
            });

            if (!result.canceled) {
                // The 'Asset' from expo-image-picker is compatible
                const selectedAsset = result.assets[0];

                setFormData(prevState => ({
                    ...prevState,
                    [field]: selectedAsset,
                }));

                if (errors[field]) {
                    setErrors(prevErrors => {
                        const newErrors = { ...prevErrors };
                        delete newErrors[field];
                        return newErrors;
                    });
                }
            }
        } catch (error) {
            console.error("Image picker error:", error);
            Alert.alert("Error", "An error occurred while picking the image.");
        }
    };

    const handleUploadPhoto = async () => {
        if (!selectedImage) {
            alert('No Image Selected Please select an image to upload.');
            return;
        }
    }

    // ✅ Replace your old function with this corrected version
    // In your SignupForm component...

    const sanitizeNicInput = (text: string): string => {
        // Rule 1: The first 9 characters can ONLY be digits.
        // We take the first 9 characters of the input and strip all non-digits.
        const first9 = text.substring(0, 9).replace(/[^0-9]/g, '');

        // Rule 2: The 10th character can be a digit OR 'V'.
        // We take the 10th character and strip anything that isn't a digit or 'V'.
        const char10 = text.substring(9, 10).replace(/[^0-9Vv]/g, '');

        // Rule 3: Any characters after the 10th can ONLY be digits.
        // We take the rest of the string and strip all non-digits.
        const rest = text.substring(10).replace(/[^0-9]/g, '');

        // Combine the sanitized parts and limit the total length to 12.
        const finalSanitized = first9 + char10 + rest;
        return finalSanitized.substring(0, 12);
    };
    const validateField = (field: string, value: string | boolean, currentFormData: FormData) => {
        let error = '';
        const countryCode = currentFormData.country;
        const isSriLankan = countryCode === 'LK';

        // Special handling for country field - check formData.country instead of value
        if (field === 'country') {
            if (!currentFormData.country || !currentFormData.country.trim()) {
                error = 'This field is required.';
            }
            return error;
        }

        if (typeof value === 'string' && !value.trim()) {
            error = 'This field is required.';
        } else if (field === 'agreeTerms' && !value) {
            error = 'You must agree to the terms and conditions.';
        } else if (field === 'confirmCondition' && !value) {
            error = 'You must confirm the item condition.';
        }
        else if (field === 'dob') {
            const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dobRegex.test(value as string)) {
                error = 'Please use YYYY-MM-DD format.';
            } else {
                const birthDate = new Date(value as string);
                const today = new Date();
                if (isNaN(birthDate.getTime())) {
                    error = 'Please enter a valid date.';
                } else if (birthDate > today) {
                    error = 'Date of birth cannot be in the future.';
                } else {
                    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                    if (birthDate > eighteenYearsAgo) {
                        error = 'You must be at least 18 years old.';
                    }
                }
            }

        } else if (field === 'nicPassport' && typeof value === 'string') {
            // ONLY validate NIC/Passport for Sri Lankans
            if (!isSriLankan) {
                // Non-Sri Lankans don't need to provide NIC/Passport
                error = '';
            } else {
                // Sri Lankan validation
                const nicValue = value.trim().toUpperCase();

                if (!countryCode) {
                    error = 'Please select a country first.';
                } else if (countryCode === 'LK') {
                    const oldNicRegex = /^\d{9}V$/; // 9 digits ending in 'V'
                    const newNicRegex = /^\d{12}$/; // 12 digits

                    if (oldNicRegex.test(nicValue)) {
                        // Valid old format, no error
                    } else if (newNicRegex.test(nicValue)) {
                        // New format is structurally valid, now check the year
                        const year = parseInt(nicValue.substring(0, 4), 10);
                        if (year <= 1900) {
                            error = 'Invalid NIC';
                        }
                    } else {
                        // Does not match either valid format
                        error = 'Invalid NIC. Use 999999999V or a valid 12-digit format.';
                    }
                }
            }

        }
        else if (field === 'email' && typeof value === 'string' && !/\S+@\S+\.\S+/.test(value)) {
            error = 'Please enter a valid email address.';
        }

        else if (field === 'password' && typeof value === 'string') {
            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
            if (!strongPasswordRegex.test(value)) {
                error = 'Need 8+ characters (1 uppercase,1 number,1 symbol)';
            }
        } else if (field === 'confirmPassword' && value !== formData.password) {
            error = 'Passwords do not match.';
        }

        // ✅ NEW VALIDATION RULE FOR GUIDE REGISTRATION NUMBER
        else if (field === 'registrationNumber' && currentFormData.role === 'guide') {
            const guideRegRegex = /^N-\d{4}$/;
            if (typeof value === 'string' && !guideRegRegex.test(value)) {
                error = 'Format must be N-XXXX (e.g., N-0464).';
            }


        }

        else if (field === 'registrationNumber' && currentFormData.role === 'merchant') {
            // This regex accepts formats like: PV 12345, W12345, BR123456, or 123456789
            const storeRegRegex = /\b([A-Z]{1,2}\s?\d{5,}|\d{9,})\b/g;
            if (typeof value === 'string' && !storeRegRegex.test(value)) {
                error = 'Invalid Reg. No. Use formats like PV12345, W12345, or a 9-digit Tax ID.';
            }
        }

        else if (field === 'daysPerWeek') {
            const numDays = parseInt(value as string, 10);
            if (isNaN(numDays) || numDays <= 0) {
                error = 'Please enter a valid number of days.';
            } else if (numDays > 7) {
                error = 'Days cannot exceed 7.';
            }
        }

        else if ((field === 'mobileNumber' || field === 'whatsappNumber') && typeof value === 'string' && value.length > 0) {
            // ONLY validate phone numbers for Sri Lankans
            if (!isSriLankan) {
                // Non-Sri Lankans don't need strict phone validation
                error = '';
            } else {
                // Sri Lankan phone validation
                const countryCodeForPhone = (formData.country || 'LK') as CountryCode;

                if (countryCodeForPhone === 'LK' && value.length !== 9) {
                    error = 'Sri Lankan numbers should (e.g., 771234567).';
                }
                // 2. If length is plausible, then check the actual format.
                else if (!isValidPhoneNumber(value, countryCodeForPhone)) {
                    const countryName = countries.find(c => c.value === countryCodeForPhone)?.label || '';
                    error = `The format is not valid for a ${countryName} phone number.`;
                }
            }
        }
        
        // Validate location for business users (guide, merchant, vehicle owner)
        else if (field === 'location' && typeof value === 'string' && currentFormData.role !== 'user' && currentFormData.role !== 'vehicle') {
            // For guides, merchants, vehicle owners - location must be in Sri Lanka
            if (value && !value.toLowerCase().includes('sri lanka')) {
                error = 'Location must be within Sri Lanka.';
            }
        }

        // Bank Details Validation (for guide and vehicle providers only)
        if (field === 'bankName' && typeof value === 'string') {
            if (!value || !value.trim()) {
                error = 'Please select a bank.';
            }
        }

        else if (field === 'accountHolderName' && typeof value === 'string') {
            if (!value || !value.trim()) {
                error = 'Account holder name is required.';
            } else if (value.trim().length < 3) {
                error = 'Account holder name must be at least 3 characters.';
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                error = 'Account holder name can only contain letters and spaces.';
            }
        }

        else if (field === 'accountNumber' && typeof value === 'string') {
            if (!value || !value.trim()) {
                error = 'Account number is required.';
            } else if (!/^\d{10,16}$/.test(value.replace(/\s/g, ''))) {
                error = 'Account number must be 10-16 digits.';
            }
        }
        
        return error;
    };

    const checkEmailAvailability = async (email: string) => {
        if (!email) {
            setEmailCheckStatus('idle');
            return;
        }

        setEmailCheckStatus('checking');
        try {
            // Replace with your actual backend endpoint for email validation
            const response = await fetch(`http://192.168.1.150:8080/user/check-email?email=${email}`);
            //const response = await fetch(`https://travelsri-backend.onrender.com/user/check-email?email=${email}`);
            const data = await response.text();
            console.log(data)
            if (data === "Exists") {
                setEmailCheckStatus('taken');
                setErrors(prev => ({ ...prev, email: 'This email is already registered.' }));
            } else {
                setEmailCheckStatus('available');
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.email;
                    return newErrors;
                });
            }
        } catch (error) {
            console.error('Error checking email availability:', error);
            setEmailCheckStatus('idle'); // Or 'error'
            setErrors(prev => ({ ...prev, email: 'Could not check email. Please try again.' }));
        }
    };

    const handleChange = (field: keyof typeof formData, value: string | boolean) => {
        let processedValue = value;

        // 1. Filter input to ONLY allow numbers for phone fields
        if ((field === 'mobileNumber' || field === 'whatsappNumber') && typeof value === 'string') {
            processedValue = value.replace(/\D/g, ''); // This removes any non-digit character
            if (processedValue.startsWith('0')) {
                processedValue = processedValue.substring(1);
            }
        } else if ((field === 'registrationNumber') && typeof value === 'string') {
            processedValue = value.toUpperCase();
        } else if ((field === 'accountNumber') && typeof value === 'string') {
            processedValue = value.replace(/\D/g, ''); // Only allow digits for account number
        }
        const newState = { ...formData, [field]: processedValue };
        //setFormData(prev => ({ ...prev, [field]: value }));
        setFormData(newState);

        const error = validateField(field, processedValue, newState);
        setErrors(prev => {
            const newErrors = { ...prev };
            if (error) {
                newErrors[field] = error;
            } else {
                delete newErrors[field];
            }
            return newErrors;
        });

        if (field === 'email') {
            if (typeof value === 'string' && /\S+@\S+\.\S+/.test(value)) {
                checkEmailAvailability(value);
            } else {
                setEmailCheckStatus('idle');
            }
        }
    };

    const validateStep1 = () => {
        const step1Errors: { [key: string]: string } = {};
        const fieldsToValidate: (keyof typeof formData)[] = [
            'pp', 'lastName', 'firstName', 'dob', 'gender', 'country', 'mobileNumber', 'whatsappNumber',
            'email', 'username', 'address', 'nicPassport', 'password', 'confirmPassword', 'role'
        ];
        fieldsToValidate.forEach(field => {

            const value = formData[field as keyof FormData];
            if (typeof value === 'string' || typeof value === 'boolean') {
                const error = validateField(field, value, formData);
                if (error) {
                    step1Errors[field as keyof typeof step1Errors] = error;
                }
            }
        });

        if (!formData.pp) {
            step1Errors.pp = 'Owner photo is required.';
        }

        // Validate languages - at least one language required
        if (formData.languages.length === 0) {
            step1Errors.languages = 'Please select at least one language.';
        }

        // Add email availability check to validation
        if (emailCheckStatus === 'taken') {
            step1Errors.email = 'This email is already registered.';
        }

        // Non-Sri Lankans can only register as traveler (user role)
        if (formData.country !== 'LK' && formData.role !== 'user') {
            step1Errors.role = 'Only Sri Lankans can register as business providers. Non-Sri Lankans can only register as travelers.';
        }

        setErrors(step1Errors);
        return Object.keys(step1Errors).length === 0;
    };

    const validateStep2 = () => {
        const step2Errors: { [key: string]: string } = {};
        const fieldsToValidate: (keyof typeof formData)[] = [
            'registrationNumber', 'description'
        ];

        if (formData.role !== 'guide') {
            fieldsToValidate.push('businessAddress');
            fieldsToValidate.push('businessName');

            if (!formData.bp) {
                step2Errors.bp = 'Business photo is required.';
            }
        }

        fieldsToValidate.forEach(field => {

            const value = formData[field as keyof FormData];
            if (typeof value === 'string' || typeof value === 'boolean') {
                const error = validateField(field, value, formData);
                if (error) {
                    step2Errors[field as keyof typeof step2Errors] = error;
                }
            }
        });

        // if (!formData.bp) {
        //     step2Errors.bp = 'Business photo is required.';
        // }    
        // console.log("Validation Errors for Step 2:", step2Errors);

        setErrors(step2Errors);
        return Object.keys(step2Errors).length === 0;
    };

    const validateStep3 = () => {
        const step3Errors: { [key: string]: string } = {};
        const fieldsToValidate: (keyof typeof formData)[] = [
            'startTime', 'endTime', 'businessRegPic1', 'businessRegPic2'
        ];
        
        // Add bank details validation ONLY for guides and vehicle providers
        if (formData.role === 'guide' || formData.role === 'vehicle') {
            fieldsToValidate.push('bankName', 'accountHolderName', 'accountNumber');
        }
        
        fieldsToValidate.forEach(field => {

            const value = formData[field as keyof FormData];
            if (typeof value === 'string' || typeof value === 'boolean') {
                const error = validateField(field, value, formData);
                if (error) {
                    step3Errors[field as keyof typeof step3Errors] = error;
                }
            }
        });

        // Validate time format and comparison (HH:MM format)
        if (formData.startTime && formData.endTime) {
            const isStartValid = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.startTime);
            const isEndValid = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.endTime);
            
            if (!isStartValid) {
                step3Errors['startTime'] = 'Use HH:MM format (e.g., 09:00)';
            }
            if (!isEndValid) {
                step3Errors['endTime'] = 'Use HH:MM format (e.g., 17:00)';
            }
            
            if (isStartValid && isEndValid && formData.endTime <= formData.startTime) {
                step3Errors['endTime'] = 'End time must be after start time.';
            }
        }
        
        if (formData.daysPerWeek.length === 0) {
            step3Errors.daysPerWeek = 'Please select at least one available day.';
        }

        // Business registration photos required only for merchant and vehicle providers
        if (formData.role === 'merchant' || formData.role === 'vehicle') {
            if (!formData.businessRegPic1) {
                step3Errors.businessRegPic1 = 'This photo is required.';
            }
            if (!formData.businessRegPic2) {
                step3Errors.businessRegPic2 = 'This photo is required.';
            }
        }

        setErrors(step3Errors);
        return Object.keys(step3Errors).length === 0;
    };

    const validateStep4 = () => {
        const step4Errors: { [key: string]: string } = {};
        // Location is only required for business roles (not for travelers)
        const fieldsToValidate: (keyof typeof formData)[] = ['identitypic1', 'agreeTerms'];
        if (formData.role !== 'user' && formData.role !== 'vehicle') {
            fieldsToValidate.push('location');
        }
        if (formData.role == 'merchant') {
            fieldsToValidate.push('confirmCondition');
        }
        fieldsToValidate.forEach(field => {

            const value = formData[field as keyof FormData];
            if (typeof value === 'string' || typeof value === 'boolean') {
                const error = validateField(field, value, formData);
                if (error) {
                    step4Errors[field as keyof typeof step4Errors] = error;
                }
            }
        });

        if (!formData.identitypic1) {
            step4Errors.identitypic1 = 'NIC photo is required.';
        }
        if (formData.role !== 'user' && formData.role !== 'vehicle') {
            if (!formData.location) {
                step4Errors.location = 'Location is required.';
            }
        }

        setErrors(step4Errors);
        return Object.keys(step4Errors).length === 0;
    };

    const nextStep = () => {
        let isStepValid = false;
        switch (step) {
            case 1: isStepValid = validateStep1(); break;
            case 2: isStepValid = (formData.role !== 'user' && formData.role !== 'vehicle') ? validateStep2() : true; break;
            case 3: isStepValid = (formData.role !== 'user' && formData.role !== 'vehicle') ? validateStep3() : true; break;
            case 4: isStepValid = validateStep4(); break;
            default: isStepValid = true; break;
        }

        // Prevent moving to the next step if email is taken
        if (step === 1 && emailCheckStatus === 'taken') {
            Alert.alert("Validation Error", "Please fix the email error before proceeding.");
            return;
        }

        if (!isStepValid) return;

        if (step === 1 && (formData.role === 'user' || formData.role === 'vehicle')) {
            setStep(4);
        } else if (step === 4 && (formData.role === 'user' || formData.role === 'vehicle')) {
            setStep(step + 1);
        } else if (step < steps.length) {
            setStep(step + 1);
            //console.log(formData)
        }

    };

    const prevStep = () => {
        if (step === 4 && (formData.role === 'user' || formData.role === 'vehicle')) {
            setStep(1);
        } else if (step > 1) {
            setStep(step - 1);
        }
    };

    // Handle start time picker
    const handleStartTimeUpdate = () => {
        const timeString = `${startHour}:${startMinute}`;
        handleChange('startTime', timeString);
        setShowStartTimePicker(false);
    };

    // Handle end time picker
    const handleEndTimeUpdate = () => {
        const timeString = `${endHour}:${endMinute}`;
        handleChange('endTime', timeString);
        setShowEndTimePicker(false);
    };

    const handleSendOtp = async () => {
        // First, validate the current step to ensure all data is present
        if (!validateStep4()) return;

        // 1. Generate a 4-digit OTP
        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp({ code: newOtp, timestamp: Date.now() });
        // 2. Prepare the template parameters
        const templateParams = {
            to_name: formData.firstName,
            email: formData.email, // Make sure you collect the email
            otp_code: newOtp,
        };

        // 3. Send the email using EmailJS
        try {
            await emailjs.send(
                'service_h0e38l2',      // 👈 Replace with your Service ID
                'template_crl1nc9',     // 👈 Replace with your Template ID
                templateParams,
                {

                    publicKey: 'Xav8YamG7K9e8q0nD'       // 👈 Replace with your Public Key
                }       // 👈 Replace with your Public Key
            );
            alert(`A verification code has been sent to ${formData.email}.`);
            setStep(5); // Move to the OTP verification screen
        } catch (error) {
            console.error('EmailJS Error:', error);
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        }
    };

    useEffect(() => {

        if (step === 5) {
            handleSendOtp();
        }
    }, [step]);

    const handleSubmit = async () => {

        const dur = 5 * 60 * 1000;
        const timeElapsed = Date.now() - generatedOtp.timestamp;

        if (timeElapsed > dur) {

            alert('OTP has expired')
            return;

        }

        if (otp !== generatedOtp.code) {

            alert('otp is wrong')
            return;

        }

        const isStep1Valid = validateStep1();
        const isStep2Valid = (formData.role !== 'user' && formData.role !== 'vehicle') ? validateStep2() : true;
        const isStep3Valid = (formData.role !== 'user' && formData.role !== 'vehicle') ? validateStep3() : true;
        const isStep4Valid = validateStep4();

        const formDatax = { ...formData };

        // 1. Convert empty strings to null
        for (const key in formDatax) {
            if (Object.prototype.hasOwnProperty.call(formDatax, key)) {
                const value = formDatax[key as keyof FormData];
                if (value === '') {
                    (formDatax as any)[key] = null;
                }
            }
        }

        if (formDatax.daysPerWeek && formDatax.daysPerWeek.length === 0) {
            (formDatax as any).daysPerWeek = null;
        }


        //console.log(submit)
        if (formDatax.role == 'user' && isStep1Valid && isStep4Valid) {

            try {
                //to mobile
                /* var submit = {}
                const {
                    confirmCondition,
                    bp,
                    businessAddress,
                    businessName,
                    businessRegPic,
                    businessType,
                    businessRegPic2,
                    confirmPassword,
                    daysPerWeek,
                    description,
                    endTime,
                    registrationNumber,
                    startTime,
                    ...payload
                } = formData;
                if (formData.pp && formData.pp.uri) { 
                    //console.log(formData.pp)

                     const pps = await FileSystem.readAsStringAsync(formData.pp.uri, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    submit = { ...payload, status: 'active', pp: pps }
                }*/

                const dataToSend: any = { ...formDatax, status: 'active' };
                const imageFields: (keyof FormData)[] = ['pp'/* , 'bp', 'businessRegPic', 'businessRegPic2'*/, 'identitypic1', 'identitypic2'];

                for (const field of imageFields) {
                    const imageAsset = formDatax[field] as ImagePickerAsset | null;

                    // USE THIS LOGIC
                    // The 'base64' property is provided by the picker on all platforms
                    if (imageAsset && imageAsset.base64) {
                        dataToSend[field] = imageAsset.base64;
                    } else {
                        // Handle case where image might be in state but base64 is missing
                        dataToSend[field] = null;
                    }
                }

                const {
                    confirmCondition,
                    bp,
                    businessAddress,
                    businessName,
                    businessType,
                    confirmPassword,
                    daysPerWeek,
                    description,
                    endTime,
                    registrationNumber,
                    startTime,
                    verified,
                    identified,
                    location,
                    ...payload
                } = dataToSend;

                //console.log(payload)

                await fetch('http://192.168.1.150:8080/user/signup', {
                    //await fetch('https://travelsri-backend.onrender.com/user/signup', {

                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: { 'Content-Type': 'application/json' }

                })
                    .then(res => res.text())
                    .then(data => { if (data == "Success") { router.replace('/(auth)'); } else { alert('An error occurs, Try again later..') } })
                    .catch(err => alert(`${err}`))


            }/* else {
                alert("Validation Error Please fill all required fields correctly.");
            } */

            catch (err) {
                console.log(err)
            }
        }
        if (formData.role != 'user' && isStep1Valid && isStep2Valid && isStep3Valid && isStep4Valid) {

            try {


                const dataToSend: any = { ...formDatax, status: 'pending', role: formDatax.role, reviewCount: 0, stars: 0, responseRate: 0 };
                const imageFields: (keyof FormData)[] = ['pp', 'bp', 'businessRegPic1', 'businessRegPic2', 'identitypic1', 'identitypic2'];

                for (const field of imageFields) {
                    const imageAsset = formDatax[field] as ImagePickerAsset | null;

                    // USE THIS LOGIC
                    // The 'base64' property is provided by the picker on all platforms
                    if (imageAsset && imageAsset.base64) {
                        dataToSend[field] = imageAsset.base64;
                    } else {
                        // Handle case where image might be in state but base64 is missing
                        dataToSend[field] = null;
                    }
                }

                const { businessType, confirmPassword, ...payload } = dataToSend

                await fetch('http://192.168.1.150:8080/user/signup', {
                    //await fetch('https://travelsri-backend.onrender.com/user/signup', {

                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: { 'Content-Type': 'application/json' }

                })
                    .then(res => res.text())
                    .then(data => { if (data == "Success") { router.replace('/(auth)'); } else { alert('An error occurs, Try again later..') } })
                    .catch(err => alert(`${err}`))


            }/* else {
                alert("Validation Error Please fill all required fields correctly.");
            } */

            catch (err) {
                console.log(err)
            }
        }
    };

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const handleDayToggle = (day: string) => {
        const currentSelectedDays = formData.daysPerWeek;
        let newSelectedDays: string[];

        // If the day is already selected, remove it. Otherwise, add it.
        if (currentSelectedDays.includes(day)) {
            newSelectedDays = currentSelectedDays.filter(d => d !== day);
        } else {
            newSelectedDays = [...currentSelectedDays, day];
        }

        setFormData(prevState => ({
            ...prevState,
            daysPerWeek: newSelectedDays,
        }));

        // Clear any previous errors for this field when the user interacts with it
        if (errors.daysPerWeek) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.daysPerWeek;
                return newErrors;
            });
        }
    };

    const handleLanguageToggle = (language: string) => {
        const currentLanguages = formData.languages;
        let newLanguages: string[];

        // If the language is already selected, remove it. Otherwise, add it.
        if (currentLanguages.includes(language)) {
            newLanguages = currentLanguages.filter(lang => lang !== language);
        } else {
            newLanguages = [...currentLanguages, language];
        }

        setFormData(prevState => ({
            ...prevState,
            languages: newLanguages,
        }));

        // Clear any previous errors for this field when the user interacts with it
        if (errors.languages) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.languages;
                return newErrors;
            });
        }
    };

    const renderStepContent = () => {
        const selectedCountry = countries.find(c => c.value === formData.country);
        return (
            <View>
                {step === 1 && (
                    <View>
                        <View className="items-center w-full my-10">
                            {/* <TextInput placeholder="URL for owner photo" className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.pp} onChangeText={v => handleChange('pp', v)} /> */}
                            <TouchableOpacity
                                onPress={() => { handleChoosePhoto('pp') }}
                                className={`w-56 h-56 rounded-full bg-gray-100 justify-center items-center ${formData.pp == null ? 'border-2 border-dashed border-gray-300' : ''}`}
                            >
                                {formData.pp ? (
                                    <Image
                                        source={{ uri: formData.pp.uri }}
                                        className="w-full h-full rounded-full border-2 border-gray-100"
                                        resizeMode="cover"

                                    />
                                ) : (
                                    <Image
                                        source={plusIcon}
                                        className="w-16 h-16 opacity-50"
                                        resizeMode="contain"
                                    />
                                )}
                            </TouchableOpacity>
                            <Text className="text-base text-gray-600 mt-2">Add Owner's Photo</Text>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.pp ? 'opacity-100' : 'opacity-0'}`}>{errors.pp || ' '}</Text>
                        </View>
                        <View className="mb-5">
                            <Text className="mb-2 font-bold text-base text-gray-800">First Name</Text>
                            <TextInput 
                                className="w-full text-black border-2 border-gray-200 rounded-xl p-4 bg-gray-50 text-base" 
                                placeholder="First name"
                                placeholderTextColor="#999"
                                value={formData.firstName} 
                                onChangeText={v => handleChange('firstName', v)} 
                            />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.firstName ? 'opacity-100' : 'opacity-0'}`}>{errors.firstName || ' '}</Text>
                        </View>
                        <View className="mb-5">
                            <Text className="mb-2 font-bold text-base text-gray-800">Last Name</Text>
                            <TextInput 
                                className="w-full text-black border-2 border-gray-200 rounded-xl p-4 bg-gray-50 text-base" 
                                placeholder="Last name"
                                placeholderTextColor="#999"
                                value={formData.lastName} 
                                onChangeText={v => handleChange('lastName', v)} 
                            />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.lastName ? 'opacity-100' : 'opacity-0'}`}>{errors.lastName || ' '}</Text>
                        </View>
                        <View className="mb-5">
                            <Text className="mb-2 font-bold text-base text-gray-800">Date of Birth</Text>
                            <View className="flex-row gap-3">
                                {/* Year Picker */}
                                <View style={{ flex: 1 }}>
                                    <View 
                                        style={{
                                            borderWidth: 2,
                                            borderColor: '#FDE047',
                                            borderRadius: 12,
                                            backgroundColor: '#FFFBEB',
                                            overflow: 'hidden',
                                            height: 56,
                                            justifyContent: 'center',
                                            shadowColor: '#EAB308',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.15,
                                            shadowRadius: 4,
                                            elevation: 2,
                                        }}
                                    >
                                        <Picker 
                                            selectedValue={formData.dob.split('-')[0] || ''} 
                                            onValueChange={(year) => {
                                                const [_, month, day] = formData.dob.split('-');
                                                const newDob = `${year}-${month || '01'}-${day || '01'}`;
                                                handleChange('dob', newDob);
                                            }}
                                            style={{ color: '#1a1a1a', fontSize: 14, fontWeight: '500' }}
                                        >
                                            <Picker.Item label="Year" value="" color="#999" />
                                            {Array.from({ length: 100 }, (_, i) => {
                                                const year = new Date().getFullYear() - i;
                                                return <Picker.Item key={year} label={year.toString()} value={year.toString()} color="#1a1a1a" />;
                                            })}
                                        </Picker>
                                    </View>
                                </View>

                                {/* Month Picker */}
                                <View style={{ flex: 1 }}>
                                    <View 
                                        style={{
                                            borderWidth: 2,
                                            borderColor: '#FDE047',
                                            borderRadius: 12,
                                            backgroundColor: '#FFFBEB',
                                            overflow: 'hidden',
                                            height: 56,
                                            justifyContent: 'center',
                                            shadowColor: '#EAB308',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.15,
                                            shadowRadius: 4,
                                            elevation: 2,
                                        }}
                                    >
                                        <Picker 
                                            selectedValue={formData.dob.split('-')[1] || ''} 
                                            onValueChange={(month) => {
                                                const [year] = formData.dob.split('-');
                                                const day = formData.dob.split('-')[2];
                                                const newDob = `${year || new Date().getFullYear()}-${month}-${day || '01'}`;
                                                handleChange('dob', newDob);
                                            }}
                                            style={{ color: '#1a1a1a', fontSize: 14, fontWeight: '500' }}
                                        >
                                            <Picker.Item label="Month" value="" color="#999" />
                                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, idx) => (
                                                <Picker.Item key={idx} label={month} value={String(idx + 1).padStart(2, '0')} color="#1a1a1a" />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>

                                {/* Day Picker */}
                                <View style={{ flex: 1 }}>
                                    <View 
                                        style={{
                                            borderWidth: 2,
                                            borderColor: '#FDE047',
                                            borderRadius: 12,
                                            backgroundColor: '#FFFBEB',
                                            overflow: 'hidden',
                                            height: 56,
                                            justifyContent: 'center',
                                            shadowColor: '#EAB308',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.15,
                                            shadowRadius: 4,
                                            elevation: 2,
                                        }}
                                    >
                                        <Picker 
                                            selectedValue={formData.dob.split('-')[2] || ''} 
                                            onValueChange={(day) => {
                                                const [year, month] = formData.dob.split('-');
                                                const newDob = `${year || new Date().getFullYear()}-${month || '01'}-${day}`;
                                                handleChange('dob', newDob);
                                            }}
                                            style={{ color: '#1a1a1a', fontSize: 14, fontWeight: '500' }}
                                        >
                                            <Picker.Item label="Day" value="" color="#999" />
                                            {Array.from({ length: getDaysInMonth(formData.dob.split('-')[0], formData.dob.split('-')[1]) }, (_, i) => (
                                                <Picker.Item key={i + 1} label={String(i + 1).padStart(2, '0')} value={String(i + 1).padStart(2, '0')} color="#1a1a1a" />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                            <Text className={`text-red-500 text-sm mt-2 ${errors.dob ? 'opacity-100' : 'opacity-0'}`}>{errors.dob || ' '}</Text>
                        </View>
                        <View className="mb-5">
                            <Text className="mb-2 font-bold text-base text-gray-800">Gender</Text>
                            <View 
                                style={{
                                    borderWidth: 2,
                                    borderColor: '#FDE047',
                                    borderRadius: 12,
                                    backgroundColor: '#FFFBEB',
                                    overflow: 'hidden',
                                    height: 56,
                                    justifyContent: 'center',
                                    shadowColor: '#EAB308',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 4,
                                    elevation: 2,
                                }}
                            >
                                <Picker 
                                    selectedValue={formData.gender} 
                                    onValueChange={v => handleChange('gender', v as string)}
                                    style={{ color: '#1a1a1a', fontSize: 16, fontWeight: '500' }}
                                >
                                    <Picker.Item label="Select Gender..." value="" color="#999" />
                                    <Picker.Item label="Male" value="male" color="#1a1a1a" />
                                    <Picker.Item label="Female" value="female" color="#1a1a1a" />
                                </Picker>
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.gender ? 'opacity-100' : 'opacity-0'}`}>{errors.gender || ' '}</Text>
                        </View>
                        <View className="mb-5">
                            <Text className="mb-2 font-bold text-base text-gray-800">Country</Text>
                            <View>
                                <View style={{ 
                                    position: 'relative',
                                    borderWidth: 2,
                                    borderColor: countrySearch ? '#FDE047' : '#E5E7EB',
                                    borderRadius: 12,
                                    backgroundColor: '#FFFBEB',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingRight: 12,
                                    zIndex: 10
                                }}>
                                    <TextInput 
                                        className="flex-1 text-black text-base p-4" 
                                        placeholder="Select country..."
                                        placeholderTextColor="#999"
                                        value={countrySearch} 
                                        onChangeText={(text) => {
                                            setIsCountrySelected(false);
                                            handleCountrySearch(text);
                                        }}
                                        onFocus={() => {
                                            console.log('Country field focused');
                                            console.log('countrySearch:', countrySearch);
                                            console.log('countries.length:', countries.length);
                                            // When focused, show all countries if dropdown is empty
                                            if (countrySearch === '' && countries.length > 0) {
                                                console.log('Showing all countries on focus');
                                                setCountrySuggestions(countries.slice(0, 15));
                                                setShowCountrySuggestions(true);
                                            } else if (countrySuggestions.length > 0) {
                                                console.log('Showing existing suggestions');
                                                setShowCountrySuggestions(true);
                                            } else {
                                                console.log('No suggestions available');
                                            }
                                        }}
                                    />
                                    {countrySearch ? (
                                        <TouchableOpacity
                                            onPress={resetCountrySelection}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name="close-circle" size={24} color="#EAB308" />
                                        </TouchableOpacity>
                                    ) : (
                                        <Ionicons name="chevron-down" size={24} color="#999" />
                                    )}
                                </View>
                                
                                {showCountrySuggestions && countrySuggestions.length > 0 && (
                                    <View style={{ 
                                        backgroundColor: 'white', 
                                        borderRadius: 8, 
                                        borderWidth: 1, 
                                        borderColor: '#FDE047',
                                        maxHeight: 300,
                                        marginTop: 8,
                                        overflow: 'visible',
                                        elevation: 10,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.15,
                                        shadowRadius: 6,
                                        zIndex: 20,
                                        pointerEvents: 'auto'
                                    }}>
                                        <ScrollView 
                                            scrollEnabled={countrySuggestions.length > 5}
                                            nestedScrollEnabled={true}
                                            keyboardShouldPersistTaps="always"
                                            pointerEvents="auto"
                                        >
                                            {countrySuggestions.map((country, index) => (
                                                <TouchableOpacity
                                                    key={`country-${index}-${country.value}`}
                                                    activeOpacity={0.6}
                                                    onPress={() => {
                                                        console.log('Pressed country:', country);
                                                        handleCountrySelect(country);
                                                    }}
                                                    style={{ 
                                                        padding: 16, 
                                                        borderBottomWidth: index < countrySuggestions.length - 1 ? 1 : 0, 
                                                        borderBottomColor: '#E5E7EB',
                                                        backgroundColor: '#FFFBEB'
                                                    }}
                                                >
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <View style={{ flex: 1 }}>
                                                            <Text style={{ color: '#1a1a1a', fontSize: 15, fontWeight: '600' }}>
                                                                {country.label}
                                                            </Text>
                                                            <Text style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
                                                                Code: {country.value || 'N/A'}
                                                            </Text>
                                                        </View>
                                                        {country.phoneCode && (
                                                            <Text style={{ color: '#EAB308', fontSize: 14, fontWeight: '600', marginLeft: 8 }}>
                                                                {country.phoneCode}
                                                            </Text>
                                                        )}
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>
                            {errors.country && (
                                <Text className="text-red-500 text-sm mt-1">{errors.country}</Text>
                            )}
                        </View>
                        <View className="mb-5">
                            <Text className="mb-2 font-bold text-base text-gray-800">Mobile Number</Text>
                            <View className="flex-row items-center border-2 border-gray-200 rounded-xl px-4 bg-gray-50">
                                <Text className="text-base text-gray-700 font-semibold mr-3">{selectedCountry?.phoneCode || '+'}</Text>
                                <View className="w-px h-6 bg-gray-300 mr-3" />
                                <TextInput 
                                    className="flex-1 text-base text-black py-4" 
                                    placeholder="771234567" 
                                    placeholderTextColor="#999"
                                    value={formData.mobileNumber} 
                                    onChangeText={v => handleChange('mobileNumber', v)} 
                                    keyboardType="number-pad" 
                                />
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.mobileNumber ? 'opacity-100' : 'opacity-0'}`}>{errors.mobileNumber || ' '}</Text>
                        </View>
                        <View className="mb-5">
                            <Text className="mb-2 font-bold text-base text-gray-800">WhatsApp Number</Text>
                            <TextInput 
                                className="w-full text-black border-2 border-gray-200 rounded-xl p-4 bg-gray-50 text-base" 
                                placeholder="WhatsApp number"
                                placeholderTextColor="#999"
                                value={formData.whatsappNumber} 
                                onChangeText={v => handleChange('whatsappNumber', v)} 
                                keyboardType="number-pad" 
                            />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.whatsappNumber ? 'opacity-100' : 'opacity-0'}`}>{errors.whatsappNumber || ' '}</Text>
                        </View>
                        <View className="mb-5">
                            <Text className="mb-2 font-bold text-base text-gray-800">Email</Text>
                            <TextInput
                                className="w-full text-black border-2 border-gray-200 rounded-xl p-4 bg-gray-50 text-base"
                                placeholder="Email address"
                                placeholderTextColor="#999"
                                value={formData.email}
                                onChangeText={v => handleChange('email', v)}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onBlur={() => {
                                    if (emailCheckStatus === 'idle' || emailCheckStatus === 'available') {
                                        checkEmailAvailability(formData.email);
                                    }
                                }}
                            />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.email ? 'opacity-100' : 'opacity-0'}`}>
                                {errors.email || (emailCheckStatus === 'checking' ? 'Checking email availability...' : '')}
                                {emailCheckStatus === 'available' && !errors.email ? 'Email is available.' : ''}
                                {emailCheckStatus === 'taken' && !errors.email ? 'This email is already registered.' : ''}
                                {' '}
                            </Text>
                        </View>
                        <View className="mb-5">
                            <Text className="mb-2 font-bold text-base text-gray-800">Username</Text>
                            <TextInput 
                                className="w-full text-black border-2 border-gray-200 rounded-xl p-4 bg-gray-50 text-base" 
                                placeholder="Username"
                                placeholderTextColor="#999"
                                value={formData.username} 
                                onChangeText={text => handleChange('username', text.replace(/\s/g, ''))} 
                                autoCapitalize="none" 
                            />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.username ? 'opacity-100' : 'opacity-0'}`}>{errors.username || ' '}</Text>
                        </View>
                        <View className="mb-5">
                            <Text className="mb-2 font-bold text-base text-gray-800">Current Address</Text>
                            <View>
                                <TextInput 
                                    className="w-full text-black border-2 border-gray-200 rounded-xl p-4 bg-gray-50 text-base" 
                                    placeholder="Address"
                                    placeholderTextColor="#999"
                                    value={formData.address} 
                                    onChangeText={(text) => {
                                        handleChange('address', text);
                                    }}
                                />
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.address ? 'opacity-100' : 'opacity-0'}`}>{errors.address || ' '}</Text>
                        </View>
                        <View className="mb-5">
                            <Text className="mb-2 font-bold text-base text-gray-800">NIC / Passport Number</Text>
                            <TextInput 
                                className="w-full text-black border-2 border-gray-200 rounded-xl p-4 bg-gray-50 text-base" 
                                placeholder="NIC or Passport number"
                                placeholderTextColor="#999"
                                value={formData.nicPassport} 
                                onChangeText={text => handleChange('nicPassport', sanitizeNicInput(text))} 
                            />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.nicPassport ? 'opacity-100' : 'opacity-0'}`}>{errors.nicPassport || ' '}</Text>
                        </View>
                        <View className="mb-5">
                            <Text className="mb-2 font-bold text-base text-gray-800">Password</Text>
                            <View className="flex-row items-center border-2 border-gray-200 rounded-xl bg-gray-50 px-4">
                                <TextInput 
                                    className="px-0 flex-1 text-base py-4 text-black" 
                                    placeholder="Min 8 chars, 1 uppercase, 1 number, 1 symbol"
                                    placeholderTextColor="#999"
                                    value={formData.password} 
                                    onChangeText={v => handleChange('password', v)} 
                                    secureTextEntry={!isPasswordVisible} 
                                />
                                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className='px-3'>
                                    <Text className="font-bold text-yellow-600">{isPasswordVisible ? 'Hide' : 'Show'}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.password ? 'opacity-100' : 'opacity-0'}`}>{errors.password || ' '}</Text>
                        </View>
                        <View className="mb-5">
                            <Text className="mb-2 font-bold text-base text-gray-800">Confirm Password</Text>
                            <View className="flex-row items-center border-2 border-gray-200 rounded-xl bg-gray-50 px-4">
                                <TextInput 
                                    className="px-0 flex-1 text-base py-4 text-black" 
                                    placeholder="Re-enter your password"
                                    placeholderTextColor="#999"
                                    value={formData.confirmPassword} 
                                    onChangeText={v => handleChange('confirmPassword', v)} 
                                    secureTextEntry={!isConfirmPasswordVisible} 
                                />
                                <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} className='px-3'>
                                    <Text className="font-bold text-yellow-600">{isConfirmPasswordVisible ? 'Hide' : 'Show'}</Text>
                                </TouchableOpacity>
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.confirmPassword ? 'opacity-100' : 'opacity-0'}`}>{errors.confirmPassword || ' '}</Text>
                        </View>
                        <View className="mb-6">
                            <Text className="mb-2 font-bold text-base text-gray-800">Register As</Text>
                            <View 
                                style={{
                                    borderWidth: 2,
                                    borderColor: '#FDE047',
                                    borderRadius: 12,
                                    backgroundColor: '#FFFBEB',
                                    overflow: 'hidden',
                                    height: 56,
                                    justifyContent: 'center',
                                    shadowColor: '#EAB308',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 4,
                                    elevation: 2,
                                }}
                            >
                                <Picker 
                                    selectedValue={formData.role} 
                                    onValueChange={v => handleChange('role', v as string)}
                                    style={{
                                        color: '#1a1a1a',
                                        fontSize: 16,
                                        fontWeight: '500',
                                    }}
                                >
                                    <Picker.Item label="Select Role..." value="" color="#999" />
                                    <Picker.Item label="Traveler" value="user" color="#1a1a1a" />
                                    {formData.country === 'LK' && (
                                        <>
                                            <Picker.Item label="Vehicle Renter" value="vehicle" color="#1a1a1a" />
                                            <Picker.Item label="Guide" value="guide" color="#1a1a1a" />
                                            <Picker.Item label="Equipment Renter" value="merchant" color="#1a1a1a" />
                                        </>
                                    )}
                                </Picker>
                            </View>
                            {formData.country !== 'LK' && formData.country && (
                                <Text className="text-yellow-600 text-sm mt-2">Only Sri Lankans can register as business providers</Text>
                            )}
                            <Text className={`text-red-500 text-sm mt-1 ${errors.role ? 'opacity-100' : 'opacity-0'}`}>{errors.role || ' '}</Text>
                        </View>

                        {/* Language Selection - For all users */}
                        <View className="mb-8">
                            <Text className="mb-3 font-bold text-base text-gray-800">🌐 Languages You Speak</Text>
                            <Text className="text-sm text-gray-600 mb-3">Select at least one language</Text>
                            <View className="flex-row flex-wrap justify-start gap-2">
                                {availableLanguages.map(language => {
                                    const isSelected = formData.languages.includes(language);
                                    return (
                                        <TouchableOpacity
                                            key={language}
                                            onPress={() => handleLanguageToggle(language)}
                                            className={`py-2 px-4 rounded-full border-2 ${isSelected ? 'bg-yellow-500 border-yellow-600' : 'bg-gray-100 border-gray-300'}`}
                                        >
                                            <Text className={`${isSelected ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>{language}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            <Text className={`text-red-500 text-sm mt-2 ${errors.languages ? 'opacity-100' : 'opacity-0'}`}>{errors.languages || ' '}</Text>
                        </View>
                    </View>
                )}

                {step === 2 && (
                    <View>
                        <View className="items-center w-full my-7">
                            {/* Business Photo */}
                            <TouchableOpacity
                                onPress={() => { handleChoosePhoto('bp') }}
                                className={`w-[98%] h-44 rounded-lg bg-gray-100 justify-center items-center ${formData.bp == null ? 'border-2 border-dashed border-gray-300' : ''}`}
                            >
                                {formData.bp ? (
                                    <Image
                                        source={{ uri: formData.bp.uri }}
                                        className="w-full h-full rounded-lg border-2 border-gray-100"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Image
                                        source={plusIcon}
                                        className="w-16 h-16 opacity-50"
                                        resizeMode="contain"
                                    />
                                )}
                            </TouchableOpacity>
                            {formData.role === 'guide' && (
                                <View className="flex-row items-center justify-center mt-2 gap-1">
                                    <Ionicons name="information-circle" size={16} color="#9CA3AF" />
                                    <Text className="font-normal text-gray-500 text-center text-sm">Not compulsory if you don't have</Text>
                                </View>
                            )}
                            <Text className={`text-red-500 text-sm mt-1 ${errors.bp ? 'opacity-100' : 'opacity-0'}`}>{errors.bp || ' '}</Text>
                            <Text className="text-base text-gray-600 mt-2">Business Photo</Text>
                        </View>

                        <View className="mb-4">
                            <View className="flex-row justify-between items-center">
                                <Text className="mb-1 font-semibold text-base">Business Name</Text>
                                {formData.role === 'guide' && (
                                    <View className="flex-row items-center gap-1">
                                        <Ionicons name="information-circle" size={14} color="#9CA3AF" />
                                        <Text className="font-normal text-gray-500 text-xs">Not compulsory</Text>
                                    </View>
                                )}
                            </View>
                            <TextInput className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.businessName} onChangeText={v => handleChange('businessName', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.businessName ? 'opacity-100' : 'opacity-0'}`}>{errors.businessName || ' '}</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Registration Number</Text>
                            <TextInput className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.registrationNumber} onChangeText={v => handleChange('registrationNumber', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.registrationNumber ? 'opacity-100' : 'opacity-0'}`}>{errors.registrationNumber || ' '}</Text>
                        </View>

                        <View className="mb-4">
                            <Text className="mb-1 font-semibold text-base">Description</Text>
                            <TextInput className="w-full text-black border border-gray-300 rounded-lg p-3 h-24" multiline value={formData.description} onChangeText={v => handleChange('description', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.description ? 'opacity-100' : 'opacity-0'}`}>{errors.description || ' '}</Text>
                        </View>

                        <View className="mb-8">
                            <Text className="mb-1 font-semibold text-base">Business Address</Text>
                            <TextInput className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.businessAddress} onChangeText={v => handleChange('businessAddress', v)} />
                            <Text className={`text-red-500 text-sm mt-1 ${errors.businessAddress ? 'opacity-100' : 'opacity-0'}`}>{errors.businessAddress || ' '}</Text>
                        </View>

                        <View className="my-10">
                            <View className='flex-row items-center mb-5'>
                                <TouchableOpacity onPress={() => handleChange('agreeTerms', !formData.agreeTerms)}>
                                    <View className={`w-6 h-6 border-2 rounded mr-3 justify-center items-center ${formData.agreeTerms ? 'bg-[#FEFA17]' : 'border-gray-400'}`}>
                                        {formData.agreeTerms && <Text className="text-black font-extrabold text-center">✓</Text>}
                                    </View>
                                </TouchableOpacity>
                                <Text className="text-base text-gray-700 flex-1 font-bold">I agree to the terms and conditions</Text>
                            </View>
                            {formData.role == 'merchant' && (
                                <View className='flex-row items-center mb-4'>
                                    <TouchableOpacity onPress={() => handleChange('confirmCondition', !formData.confirmCondition)}>
                                        <View className={`w-6 h-6 border-2 rounded mr-3 justify-center items-center ${formData.confirmCondition ? 'bg-[#FEFA17]' : 'border-gray-400'}`}>
                                            {formData.confirmCondition && <Text className="text-black font-extrabold text-center">✓</Text>}
                                        </View>
                                    </TouchableOpacity>
                                    <Text className="text-base text-gray-700">I confirm the item condition</Text>
                                </View>
                            )}

                            {formData.role === 'guide' && (
                                <View className="flex-row items-center gap-1">
                                    <Ionicons name="information-circle" size={14} color="#9CA3AF" />
                                    <Text className="font-normal text-gray-500 text-xs">Not compulsory</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {step === 3 && (
                    <View>
                        <View className="mb-4 pt-10">
                            <Text className="mb-2 font-semibold text-base">🗓️ Select Available Days</Text>
                            <View className="flex-row flex-wrap justify-center">
                                {weekDays.map(day => {
                                    const isSelected = formData.daysPerWeek.includes(day);
                                    return (
                                        <TouchableOpacity
                                            key={day}
                                            onPress={() => handleDayToggle(day)}
                                            className={`py-2 m-1 w-10 items-center rounded-full border-2 ${isSelected ? 'bg-yellow-500 border-yellow-600' : 'bg-gray-100 border-gray-300'}`}
                                        >
                                            <Text className={`${isSelected ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>{day.substring(0, 3)}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.daysPerWeek ? 'opacity-100' : 'opacity-0'}`}>{errors.daysPerWeek || ' '}</Text>
                        </View>

                        <View className="mb-6">
                            <Text className="mb-3 font-bold text-base text-gray-800">⏰ Available Time Slot</Text>
                            <View className="flex-row justify-between gap-4">
                                <View className="flex-1">
                                    <Text className="text-sm font-semibold text-gray-700 mb-2">Start Time</Text>
                                    <TouchableOpacity 
                                        onPress={() => setShowStartTimePicker(true)}
                                        style={{
                                            borderWidth: 2,
                                            borderColor: '#FDE047',
                                            borderRadius: 12,
                                            backgroundColor: '#FFFBEB',
                                            paddingVertical: 12,
                                            paddingHorizontal: 12,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            gap: 8,
                                            shadowColor: '#EAB308',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.15,
                                            shadowRadius: 4,
                                            elevation: 2,
                                        }}
                                    >
                                        <Ionicons name="time" size={20} color="#1a1a1a" />
                                        <Text style={{ color: formData.startTime ? '#1a1a1a' : '#999', fontSize: 16, fontWeight: '500' }}>
                                            {formData.startTime || 'Select Time'}
                                        </Text>
                                    </TouchableOpacity>
                                    <Text className={`text-red-500 text-sm mt-1 ${errors.startTime ? 'opacity-100' : 'opacity-0'}`}>{errors.startTime || ' '}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm font-semibold text-gray-700 mb-2">End Time</Text>
                                    <TouchableOpacity 
                                        onPress={() => setShowEndTimePicker(true)}
                                        style={{
                                            borderWidth: 2,
                                            borderColor: '#FDE047',
                                            borderRadius: 12,
                                            backgroundColor: '#FFFBEB',
                                            paddingVertical: 12,
                                            paddingHorizontal: 12,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            gap: 8,
                                            shadowColor: '#EAB308',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.15,
                                            shadowRadius: 4,
                                            elevation: 2,
                                        }}
                                    >
                                        <Ionicons name="time" size={20} color="#1a1a1a" />
                                        <Text style={{ color: formData.endTime ? '#1a1a1a' : '#999', fontSize: 16, fontWeight: '500' }}>
                                            {formData.endTime || 'Select Time'}
                                        </Text>
                                    </TouchableOpacity>
                                    <Text className={`text-red-500 text-sm mt-1 ${errors.endTime ? 'opacity-100' : 'opacity-0'}`}>{errors.endTime || ' '}</Text>
                                </View>
                            </View>

                            {/* Start Time Picker Modal */}
                            <Modal
                                visible={showStartTimePicker}
                                transparent
                                animationType="slide"
                                onRequestClose={() => setShowStartTimePicker(false)}
                            >
                                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                    <View style={{ backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                                        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 15, textAlign: 'center', color: '#1a1a1a' }}>Select Start Time</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 15, marginBottom: 20 }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ textAlign: 'center', fontWeight: '600', marginBottom: 10, color: '#1a1a1a' }}>Hour</Text>
                                                <View style={{ borderWidth: 2, borderColor: '#FDE047', borderRadius: 12, backgroundColor: '#FFFBEB', height: 200, overflow: 'hidden' }}>
                                                    <Picker selectedValue={startHour} onValueChange={setStartHour} style={{ color: '#1a1a1a' }}>
                                                        {Array.from({ length: 24 }, (_, i) => (
                                                            <Picker.Item key={i} label={String(i).padStart(2, '0')} value={String(i).padStart(2, '0')} color="#1a1a1a" />
                                                        ))}
                                                    </Picker>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ textAlign: 'center', fontWeight: '600', marginBottom: 10, color: '#1a1a1a' }}>Minute</Text>
                                                <View style={{ borderWidth: 2, borderColor: '#FDE047', borderRadius: 12, backgroundColor: '#FFFBEB', height: 200, overflow: 'hidden' }}>
                                                    <Picker selectedValue={startMinute} onValueChange={setStartMinute} style={{ color: '#1a1a1a' }}>
                                                        {Array.from({ length: 60 }, (_, i) => (
                                                            <Picker.Item key={i} label={String(i).padStart(2, '0')} value={String(i).padStart(2, '0')} color="#1a1a1a" />
                                                        ))}
                                                    </Picker>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                            <TouchableOpacity 
                                                onPress={() => setShowStartTimePicker(false)}
                                                style={{ flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 12, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
                                            >
                                                <Text style={{ fontWeight: '600', color: '#1a1a1a', fontSize: 16 }}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                onPress={handleStartTimeUpdate}
                                                style={{ flex: 1, backgroundColor: '#FDE047', paddingVertical: 12, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
                                            >
                                                <Text style={{ fontWeight: '600', color: '#1a1a1a', fontSize: 16 }}>Confirm</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>

                            {/* End Time Picker Modal */}
                            <Modal
                                visible={showEndTimePicker}
                                transparent
                                animationType="slide"
                                onRequestClose={() => setShowEndTimePicker(false)}
                            >
                                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                    <View style={{ backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                                        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 15, textAlign: 'center', color: '#1a1a1a' }}>Select End Time</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 15, marginBottom: 20 }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ textAlign: 'center', fontWeight: '600', marginBottom: 10, color: '#1a1a1a' }}>Hour</Text>
                                                <View style={{ borderWidth: 2, borderColor: '#FDE047', borderRadius: 12, backgroundColor: '#FFFBEB', height: 200, overflow: 'hidden' }}>
                                                    <Picker selectedValue={endHour} onValueChange={setEndHour} style={{ color: '#1a1a1a' }}>
                                                        {Array.from({ length: 24 }, (_, i) => (
                                                            <Picker.Item key={i} label={String(i).padStart(2, '0')} value={String(i).padStart(2, '0')} color="#1a1a1a" />
                                                        ))}
                                                    </Picker>
                                                </View>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ textAlign: 'center', fontWeight: '600', marginBottom: 10, color: '#1a1a1a' }}>Minute</Text>
                                                <View style={{ borderWidth: 2, borderColor: '#FDE047', borderRadius: 12, backgroundColor: '#FFFBEB', height: 200, overflow: 'hidden' }}>
                                                    <Picker selectedValue={endMinute} onValueChange={setEndMinute} style={{ color: '#1a1a1a' }}>
                                                        {Array.from({ length: 60 }, (_, i) => (
                                                            <Picker.Item key={i} label={String(i).padStart(2, '0')} value={String(i).padStart(2, '0')} color="#1a1a1a" />
                                                        ))}
                                                    </Picker>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                            <TouchableOpacity 
                                                onPress={() => setShowEndTimePicker(false)}
                                                style={{ flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 12, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
                                            >
                                                <Text style={{ fontWeight: '600', color: '#1a1a1a', fontSize: 16 }}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                onPress={handleEndTimeUpdate}
                                                style={{ flex: 1, backgroundColor: '#FDE047', paddingVertical: 12, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
                                            >
                                                <Text style={{ fontWeight: '600', color: '#1a1a1a', fontSize: 16 }}>Confirm</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                        
                        {/* Business Registration Certificates - Only for Merchant and Vehicle Providers */}
                        {(formData.role === 'merchant' || formData.role === 'vehicle') && (
                            <>
                                <View className="items-center w-full my-8">
                                    <Text className="w-full mb-1 font-semibold text-base">Business Registration Certificate(side 1)</Text>
                                    {/* <TextInput placeholder="URL for registration certificate" className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.businessRegPic} onChangeText={v => handleChange('businessRegPic', v)} /> */}
                                    <TouchableOpacity
                                        onPress={() => { handleChoosePhoto('businessRegPic1') }}
                                        className={`w-[98%] h-44 rounded-lg bg-gray-100 justify-center items-center ${formData.businessRegPic1 == null ? 'border-2 border-dashed border-gray-300' : ''}`}
                                    >
                                        {formData.businessRegPic1 ? (
                                            <Image
                                                source={{ uri: formData.businessRegPic1.uri }}
                                                className="w-full h-full rounded-lg border-2 border-gray-100"
                                                resizeMode="cover"

                                            />
                                        ) : (
                                            <Image
                                                source={plusIcon}
                                                className="w-16 h-16 opacity-50"
                                                resizeMode="contain"
                                            />
                                        )}
                                    </TouchableOpacity>
                                    <Text className={`text-red-500 text-sm mt-1 w-full ${errors.businessRegPic1 ? 'opacity-100' : 'opacity-0'}`}>{errors.businessRegPic1 || ' '}</Text>
                                </View>
                                <View className="items-center w-full my-8">
                                    <Text className="w-full mb-1 font-semibold text-base">Business Registration Certificate(side 2)</Text>
                                    {/* <TextInput placeholder="URL for cancellation policy" className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.businessRegPic2} onChangeText={v => handleChange('businessRegPic2', v)} /> */}
                                    <TouchableOpacity
                                        onPress={() => { handleChoosePhoto('businessRegPic2') }}
                                        className={`w-[98%] h-44 rounded-lg bg-gray-100 justify-center items-center ${formData.businessRegPic2 == null ? 'border-2 border-dashed border-gray-300' : ''}`}
                                    >
                                        {formData.businessRegPic2 ? (
                                            <Image
                                                source={{ uri: formData.businessRegPic2.uri }}
                                                className="w-full h-full rounded-lg border-2 border-gray-100"
                                                resizeMode="cover"

                                            />
                                        ) : (
                                            <Image
                                                source={plusIcon}
                                                className="w-16 h-16 opacity-50"
                                                resizeMode="contain"
                                            />
                                        )}
                                    </TouchableOpacity>
                                    <Text className={`text-red-500 text-sm mt-1 w-full ${errors.businessRegPic2 ? 'opacity-100' : 'opacity-0'}`}>{errors.businessRegPic2 || ' '}</Text>
                                </View>
                            </>
                        )}

                        {/* Bank Details Section - Only for Guide and Vehicle Providers */}
                        {(formData.role === 'guide' || formData.role === 'vehicle') && (
                            <View className="mt-10 mb-8">
                                <Text className="mb-4 font-bold text-lg text-gray-800">💳 Bank Details</Text>

                                {/* Bank Name Dropdown */}
                                <View className="mb-5">
                                    <Text className="mb-2 font-bold text-base text-gray-800">Bank Name</Text>
                                    <View 
                                        style={{
                                            borderWidth: 2,
                                            borderColor: '#FDE047',
                                            borderRadius: 12,
                                            backgroundColor: '#FFFBEB',
                                            overflow: 'hidden',
                                            height: 56,
                                            justifyContent: 'center',
                                            shadowColor: '#EAB308',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.15,
                                            shadowRadius: 4,
                                            elevation: 2,
                                        }}
                                    >
                                        <Picker 
                                            selectedValue={formData.bankName} 
                                            onValueChange={v => handleChange('bankName', v as string)}
                                            style={{ color: '#1a1a1a', fontSize: 16, fontWeight: '500' }}
                                        >
                                            <Picker.Item label="Select a bank..." value="" color="#999" />
                                            <Picker.Item label="Sampath Bank PLC" value="Sampath Bank PLC" color="#1a1a1a" />
                                            <Picker.Item label="Commercial Bank of Ceylon PLC" value="Commercial Bank of Ceylon PLC" color="#1a1a1a" />
                                            <Picker.Item label="Bank of Ceylon" value="Bank of Ceylon" color="#1a1a1a" />
                                            <Picker.Item label="DFCC Bank PLC" value="DFCC Bank PLC" color="#1a1a1a" />
                                            <Picker.Item label="Nations Trust Bank PLC" value="Nations Trust Bank PLC" color="#1a1a1a" />
                                            <Picker.Item label="Seylan Bank PLC" value="Seylan Bank PLC" color="#1a1a1a" />
                                            <Picker.Item label="People's Bank" value="People's Bank" color="#1a1a1a" />
                                            <Picker.Item label="Pan Asia Banking Corporation PLC" value="Pan Asia Banking Corporation PLC" color="#1a1a1a" />
                                            <Picker.Item label="Union Bank of Colombo PLC" value="Union Bank of Colombo PLC" color="#1a1a1a" />
                                            <Picker.Item label="ICICI Bank Sri Lanka" value="ICICI Bank Sri Lanka" color="#1a1a1a" />
                                            <Picker.Item label="Standard Chartered Bank Sri Lanka" value="Standard Chartered Bank Sri Lanka" color="#1a1a1a" />
                                            <Picker.Item label="Citi Bank Sri Lanka" value="Citi Bank Sri Lanka" color="#1a1a1a" />
                                        </Picker>
                                    </View>
                                    <Text className={`text-red-500 text-sm mt-1 ${errors.bankName ? 'opacity-100' : 'opacity-0'}`}>{errors.bankName || ' '}</Text>
                                </View>

                                {/* Account Holder Name */}
                                <View className="mb-5">
                                    <Text className="mb-2 font-bold text-base text-gray-800">Account Holder Name</Text>
                                    <TextInput 
                                        className="w-full text-black border-2 border-gray-200 rounded-xl p-4 bg-gray-50 text-base" 
                                        placeholder="Account holder name"
                                        placeholderTextColor="#999"
                                        value={formData.accountHolderName} 
                                        onChangeText={v => handleChange('accountHolderName', v)} 
                                    />
                                    <Text className={`text-red-500 text-sm mt-1 ${errors.accountHolderName ? 'opacity-100' : 'opacity-0'}`}>{errors.accountHolderName || ' '}</Text>
                                </View>

                                {/* Account Number */}
                                <View className="mb-6">
                                    <Text className="mb-2 font-bold text-base text-gray-800">Account Number</Text>
                                    <TextInput 
                                        className="w-full text-black border-2 border-gray-200 rounded-xl p-4 bg-gray-50 text-base" 
                                        placeholder="Account number"
                                        placeholderTextColor="#999"
                                        value={formData.accountNumber} 
                                        onChangeText={v => handleChange('accountNumber', v.replace(/\D/g, ''))} 
                                        keyboardType="number-pad" 
                                    />
                                    <Text className={`text-red-500 text-sm mt-1 ${errors.accountNumber ? 'opacity-100' : 'opacity-0'}`}>{errors.accountNumber || ' '}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {step === 4 && (
                    <View>
                        <View className="items-center w-full my-10">
                            {/* <TextInput placeholder="URL for National ID" className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.identitypic1} onChangeText={v => handleChange('identitypic1', v)} /> */}
                            <TouchableOpacity
                                onPress={() => { handleChoosePhoto('identitypic1') }}
                                className={`w-[98%] h-44 bg-gray-100 justify-center items-center ${formData.identitypic1 == null ? 'border-2 border-dashed border-gray-300' : ''}`}
                            >
                                {formData.identitypic1 ? (
                                    <Image
                                        source={{ uri: formData.identitypic1.uri }}
                                        className="w-full h-full border-2 border-gray-100"
                                        resizeMode="cover"

                                    />
                                ) : (
                                    <Image
                                        source={plusIcon}
                                        className="w-16 h-16 opacity-50"
                                        resizeMode="contain"
                                    />
                                )}
                            </TouchableOpacity>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.identitypic1 ? 'opacity-100' : 'opacity-0'}`}>{errors.identitypic1 || ' '}</Text>
                            <Text className="text-base text-gray-600 mt-2">National Identity Card / Passport (side 1)</Text>
                        </View>
                        <View className="items-center w-full my-10">
                            {/* <TextInput placeholder="URL for National ID" className="w-full text-black border border-gray-300 rounded-lg p-3" value={formData.identitypic1} onChangeText={v => handleChange('identitypic1', v)} /> */}
                            <TouchableOpacity
                                onPress={() => { handleChoosePhoto('identitypic2') }}
                                className={`w-[98%] h-44 bg-gray-100 justify-center items-center ${formData.identitypic2 == null ? 'border-2 border-dashed border-gray-300' : ''}`}
                            >
                                {formData.identitypic2 ? (
                                    <Image
                                        source={{ uri: formData.identitypic2.uri }}
                                        className="w-full h-full border-2 border-gray-100"
                                        resizeMode="cover"

                                    />
                                ) : (
                                    <Image
                                        source={plusIcon}
                                        className="w-16 h-16 opacity-50"
                                        resizeMode="contain"
                                    />
                                )}
                            </TouchableOpacity>
                            <Text className={`text-red-500 text-sm mt-1 ${errors.identitypic2 ? 'opacity-100' : 'opacity-0'}`}>{errors.identitypic12 || ' '}</Text>
                            <Text className="text-base text-gray-600 mt-2">National Identity Card / Passport (side 2)</Text>
                        </View>
                        {formData.role !== 'user' && formData.role !== 'vehicle' && (
                            <View className="my-8">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="font-bold text-base text-gray-800">Enter Location you expert</Text>
                                    <Text className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Sri Lanka Only</Text>
                                </View>
                                <View>
                                    {showLocationSuggestions && locationSuggestions.length > 0 && (
                                        <View style={{ 
                                            backgroundColor: 'white', 
                                            borderRadius: 8, 
                                            borderWidth: 1, 
                                            borderColor: '#FDE047',
                                            maxHeight: 200,
                                            marginBottom: 8,
                                            overflow: 'hidden'
                                        }}>
                                            <ScrollView 
                                                scrollEnabled={true}
                                                nestedScrollEnabled={true}
                                                scrollEventThrottle={16}
                                                keyboardShouldPersistTaps="always"
                                            >
                                                {locationSuggestions.map((place, index) => (
                                                    <TouchableOpacity
                                                        key={`location-${index}`}
                                                        activeOpacity={0.7}
                                                        onPress={() => {
                                                            console.log('Selected location:', place);
                                                            handleLocationSelect(place);
                                                        }}
                                                        style={{ 
                                                            padding: 12, 
                                                            borderBottomWidth: 1, 
                                                            borderBottomColor: '#E5E7EB',
                                                            backgroundColor: '#FFFBEB'
                                                        }}
                                                    >
                                                        <Text style={{ color: '#1a1a1a', fontSize: 14, fontWeight: '500' }}>
                                                            {place.description || place.main_text}
                                                        </Text>
                                                        <Text style={{ color: '#999', fontSize: 12, marginTop: 4 }}>
                                                            {place.secondary_text}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    )}
                                    <TextInput 
                                        className="w-full text-black border-2 border-gray-200 rounded-xl p-4 bg-gray-50 text-base" 
                                        placeholder="Search location..."
                                        placeholderTextColor="#999"
                                        value={formData.location} 
                                        onChangeText={(text) => {
                                            handleChange('location', text);
                                            searchLocations(text);
                                        }}
                                    />
                                </View>
                                <Text className={`text-red-500 text-sm mt-1 ${errors.location ? 'opacity-100' : 'opacity-0'}`}>{errors.location || ' '}</Text>
                            </View>
                        )}
                        <View className="my-10">
                            <View className='flex-row items-center mb-5'>
                                <TouchableOpacity onPress={() => handleChange('agreeTerms', !formData.agreeTerms)}>
                                    <View className={`w-6 h-6 border-2 rounded mr-3 justify-center items-center ${formData.agreeTerms ? 'bg-[#FEFA17]' : 'border-gray-400'}`}>
                                        {formData.agreeTerms && <Text className="text-black font-extrabold text-center">✓</Text>}
                                    </View>
                                </TouchableOpacity>
                                <Text className="text-base text-gray-700 flex-1 font-bold">I agree to the terms and conditions</Text>
                            </View>
                            {formData.role == 'merchant' && (
                                <>
                                    <View className='flex-row items-center mb-4'>
                                        <TouchableOpacity onPress={() => handleChange('confirmCondition', !formData.confirmCondition)}>
                                            <View className={`w-6 h-6 border-2 rounded mr-3 justify-center items-center ${formData.confirmCondition ? 'bg-[#FEFA17]' : 'border-gray-400'}`}>
                                                {formData.confirmCondition && <Text className="text-black font-extrabold text-center">✓</Text>}
                                            </View>
                                        </TouchableOpacity>
                                        <Text className="text-base text-gray-700 flex-1 font-bold">I confirm all items are in safe condition</Text>
                                    </View>
                                </>
                            )}
                        </View>
                        <Text className={`text-red-500 text-sm -mt-4 mb-4 ${errors.agreeTerms ? 'opacity-100' : 'opacity-0'}`}>{errors.agreeTerms || ' '}</Text>
                        <Text className={`text-red-500 text-sm -mt-4 mb-4 ${errors.confirmCondition && formData.role != 'user' ? 'opacity-100' : 'opacity-0'}`}>{errors.confirmCondition || ' '}</Text>
                    </View>
                )}
                {step === 5 && (
                    <View className='flex-1'>
                        <View className="flex-1 justify-between items-center my-10 w-full">
                            <View className="items-center mb-20">
                                <View className="w-48 h-48 rounded-full my-5 bg-gray-100 justify-center items-center border-2 border-gray-200">
                                    <Image
                                        source={otpIcon}
                                        className="w-24 h-24"
                                        resizeMode="contain"
                                        tintColor="#333"
                                    />
                                </View>
                                <Text className="text-3xl font-bold mt-4 text-gray-800">Enter OTP</Text>
                                <Text className="text-base text-gray-500 mt-2 text-center px-4">
                                    A 4-digit code was sent to {'\n'}
                                    <Text className="font-bold text-gray-700">{formData.email}</Text>
                                </Text>
                            </View>
                            <View className="w-full my-10">
                                <Text className="mb-1 font-semibold text-base text-gray-700">Verification Code</Text>
                                <TextInput
                                    className="text-black border border-gray-300 rounded-lg p-4 text-2xl text-center tracking-widest"
                                    value={otp}
                                    onChangeText={setOtp}
                                    keyboardType="numeric"
                                    maxLength={4}
                                />
                                <TouchableOpacity
                                    className="bg-[#FEFA17] py-4 px-6 rounded-lg mt-6 items-center"
                                    onPress={handleSubmit}
                                >
                                    <Text className="font-bold text-lg text-gray-800">Verify Code</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="mt-14 flex-row justify-center items-center">
                                <Text className="text-base text-gray-500">Didn't receive the code?</Text>
                                <TouchableOpacity onPress={handleSendOtp} className="py-2 ml-1">
                                    <Text className="font-semibold text-yellow-600 text-base">Resend</Text>
                                </TouchableOpacity>
                            </View>
                            {/* <TouchableOpacity onPress={() => setStep(1)} className="py-2 mt-2">
                                <Text className="text-center font-semibold text-gray-500 text-base">
                                    ← Back to enter email
                                </Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header with Back Button */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity
                    onPress={() => {
                        if (step > 1) {
                            prevStep();
                        } else {
                            router.back();
                        }
                    }}
                    style={{
                        backgroundColor: '#FDE047',
                        borderRadius: 8,
                        padding: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#EAB308',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 4,
                    }}
                >
                    <Ionicons name="arrow-back" size={20} color="#1a1a1a" />
                </TouchableOpacity>
                
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#1a1a1a', flex: 1, textAlign: 'center', marginLeft: 12 }}>
                    {steps[step - 1].title}
                </Text>

                <View style={{ width: 36 }} />
            </View>

            {/* Step Indicator */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                {steps.map((s, index) => (
                    <React.Fragment key={s.id}>
                        <View
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: step > s.id ? '#EAB308' : step === s.id ? '#FDE047' : '#E5E7EB',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: step === s.id ? 2 : 0,
                                borderColor: '#EAB308',
                                shadowColor: step >= s.id ? '#EAB308' : 'transparent',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: step >= s.id ? 0.2 : 0,
                                shadowRadius: 3,
                                elevation: step >= s.id ? 2 : 0,
                            }}
                        >
                            {step > s.id ? (
                                <Ionicons name="checkmark" size={18} color="#1a1a1a" />
                            ) : (
                                <Text style={{ color: step === s.id ? '#1a1a1a' : '#999', fontWeight: '700', fontSize: 14 }}>
                                    {s.id}
                                </Text>
                            )}
                        </View>
                        {index < steps.length - 1 && (
                            <View
                                style={{
                                    flex: 1,
                                    height: 2,
                                    backgroundColor: step > s.id ? '#EAB308' : '#E5E7EB',
                                    maxWidth: 40,
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </View>

            <ScrollView
                className="flex-1 pr-2"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={{ paddingHorizontal: 20, paddingTop: 8 }}
            >
                {renderStepContent()}
                {step != 5 && <View className="flex-row justify-between mt-8 mb-6">
                    {step > 1 ? (
                        <TouchableOpacity 
                            className="bg-gray-300 py-3 px-8 rounded-lg flex-row items-center gap-2" 
                            onPress={prevStep}
                        >
                            <Ionicons name="arrow-back" size={18} color="#1a1a1a" />
                            <Text className="font-semibold text-gray-800">Previous</Text>
                        </TouchableOpacity>
                    ) : <View />}

                    {step < steps.length - 1 ? (
                        <TouchableOpacity 
                            className="bg-[#FEFA17] py-3 px-8 rounded-lg flex-row items-center gap-2" 
                            onPress={nextStep}
                        >
                            <Text className="font-semibold text-gray-800">Next</Text>
                            <Ionicons name="arrow-forward" size={18} color="#1a1a1a" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            className="bg-yellow-500 py-3 px-8 rounded-lg flex-row items-center gap-2" 
                            onPress={nextStep}
                        >
                            <Text className="font-semibold text-gray-900">Submit</Text>
                            <Ionicons name="checkmark" size={18} color="#1a1a1a" />
                        </TouchableOpacity>
                    )}
                </View>}
            </ScrollView>
        </SafeAreaView>
    );
}