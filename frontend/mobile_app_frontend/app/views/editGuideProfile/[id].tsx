import { Text, TouchableOpacity, View, StyleSheet, SafeAreaView, ScrollView, TextInput } from 'react-native'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import BackButton from '../../../components/ui/backButton'
import Topbar from '../../../components/ui/guideTopbar'
import Ionicons from '@expo/vector-icons/Ionicons'

interface GuideProfile {
  languages: string[];
  location: string;
  images: string[];
  guideType: string;
  experience: string;
  specialization: string;
  dailyRate: number;
  bio: string;
  responseTime: string;
  responseRate: number;
  education: string[];
  certifications: string[];
  whyChooseMe: string[];
  tourStyles: string[];
  awards: string[];
}

interface MyToken {
  sub: string;
  roles: string[];
  username: string;
  email: string;
  id: string;
}

export default function EditProfile() {
  const [notify, setNotify] = useState(false)
  const [show, setShow] = useState(false)
  const [userToken, setUserToken] = useState<MyToken | null>(null)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<GuideProfile>({
    languages: [],
    location: '',
    images: [],
    guideType: '',
    experience: '',
    specialization: '',
    dailyRate: 0,
    bio: '',
    responseTime: '',
    responseRate: 0,
    education: [],
    certifications: [],
    whyChooseMe: [],
    tourStyles: [],
    awards: [],
  })

  useEffect(() => {
    const loadUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token')
        if (token) {
          const decoded = jwtDecode<MyToken>(token)
          setUserToken(decoded)
        }
      } catch (error) {
        console.error('Error loading token:', error)
      }
    }
    loadUserToken()
  }, [])

  const handleInputChange = (field: keyof GuideProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: keyof GuideProfile, index: number, value: string) => {
    setProfile(prev => {
      const array = Array.isArray(prev[field]) ? [...(prev[field] as string[])] : []
      array[index] = value
      return {
        ...prev,
        [field]: array
      }
    })
  }

  const addArrayItem = (field: keyof GuideProfile) => {
    setProfile(prev => {
      const array = Array.isArray(prev[field]) ? [...(prev[field] as string[])] : []
      array.push('')
      return {
        ...prev,
        [field]: array
      }
    })
  }

  const removeArrayItem = (field: keyof GuideProfile, index: number) => {
    setProfile(prev => {
      const array = Array.isArray(prev[field]) ? [...(prev[field] as string[])] : []
      array.splice(index, 1)
      return {
        ...prev,
        [field]: array
      }
    })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        return
      }

      const response = await fetch(
        `http://localhost:8080/api/guides/${userToken?.id}/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        }
      )

      if (response.ok) {
        console.log('Profile updated successfully')
        // Navigate back or show success message
      } else {
        console.error('Failed to update profile:', response.status)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleMenu = () => {
    setShow(!show)
  }

  const toggling = () => {
    setNotify(!notify)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Topbar pressing={toggleMenu} notifying={toggling} on={notify} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Edit Profile</Text>
            <BackButton />
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your location"
            placeholderTextColor="#999"
            value={profile.location}
            onChangeText={(value) => handleInputChange('location', value)}
          />
        </View>

        {/* Guide Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guide Type</Text>
          <View style={styles.radioGroup}>
            {['Travel with me', 'Visit'].map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.radioOption}
                onPress={() => handleInputChange('guideType', type)}
              >
                <View style={[styles.radio, profile.guideType === type && styles.radioSelected]}>
                  {profile.guideType === type && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Languages */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <TouchableOpacity onPress={() => addArrayItem('languages')}>
              <Ionicons name="add-circle" size={24} color="#FEFA17" />
            </TouchableOpacity>
          </View>
          {profile.languages.map((lang, index) => (
            <View key={index} style={styles.arrayItemContainer}>
              <TextInput
                style={styles.arrayInput}
                placeholder="Enter language"
                placeholderTextColor="#999"
                value={lang}
                onChangeText={(value) => handleArrayChange('languages', index, value)}
              />
              <TouchableOpacity onPress={() => removeArrayItem('languages', index)}>
                <Ionicons name="close-circle" size={24} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5 years"
            placeholderTextColor="#999"
            value={profile.experience}
            onChangeText={(value) => handleInputChange('experience', value)}
          />
        </View>

        {/* Specialization */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialization</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Adventure Tours"
            placeholderTextColor="#999"
            value={profile.specialization}
            onChangeText={(value) => handleInputChange('specialization', value)}
          />
        </View>

        {/* Daily Rate */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Rate (USD)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter daily rate"
            placeholderTextColor="#999"
            value={profile.dailyRate.toString()}
            onChangeText={(value) => handleInputChange('dailyRate', parseInt(value) || 0)}
            keyboardType="numeric"
          />
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio (About Me)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about yourself"
            placeholderTextColor="#999"
            value={profile.bio}
            onChangeText={(value) => handleInputChange('bio', value)}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Response Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Response Time</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 1 hour"
            placeholderTextColor="#999"
            value={profile.responseTime}
            onChangeText={(value) => handleInputChange('responseTime', value)}
          />
        </View>

        {/* Response Rate */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Response Rate (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 95"
            placeholderTextColor="#999"
            value={profile.responseRate.toString()}
            onChangeText={(value) => handleInputChange('responseRate', parseInt(value) || 0)}
            keyboardType="numeric"
          />
        </View>

        {/* Education */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Education</Text>
            <TouchableOpacity onPress={() => addArrayItem('education')}>
              <Ionicons name="add-circle" size={24} color="#FEFA17" />
            </TouchableOpacity>
          </View>
          {profile.education.map((edu, index) => (
            <View key={index} style={styles.arrayItemContainer}>
              <TextInput
                style={styles.arrayInput}
                placeholder="Enter education"
                placeholderTextColor="#999"
                value={edu}
                onChangeText={(value) => handleArrayChange('education', index, value)}
              />
              <TouchableOpacity onPress={() => removeArrayItem('education', index)}>
                <Ionicons name="close-circle" size={24} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Certifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <TouchableOpacity onPress={() => addArrayItem('certifications')}>
              <Ionicons name="add-circle" size={24} color="#FEFA17" />
            </TouchableOpacity>
          </View>
          {profile.certifications.map((cert, index) => (
            <View key={index} style={styles.arrayItemContainer}>
              <TextInput
                style={styles.arrayInput}
                placeholder="Enter certification"
                placeholderTextColor="#999"
                value={cert}
                onChangeText={(value) => handleArrayChange('certifications', index, value)}
              />
              <TouchableOpacity onPress={() => removeArrayItem('certifications', index)}>
                <Ionicons name="close-circle" size={24} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Why Choose Me */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Why Choose Me</Text>
            <TouchableOpacity onPress={() => addArrayItem('whyChooseMe')}>
              <Ionicons name="add-circle" size={24} color="#FEFA17" />
            </TouchableOpacity>
          </View>
          {profile.whyChooseMe.map((reason, index) => (
            <View key={index} style={styles.arrayItemContainer}>
              <TextInput
                style={styles.arrayInput}
                placeholder="Enter reason"
                placeholderTextColor="#999"
                value={reason}
                onChangeText={(value) => handleArrayChange('whyChooseMe', index, value)}
              />
              <TouchableOpacity onPress={() => removeArrayItem('whyChooseMe', index)}>
                <Ionicons name="close-circle" size={24} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Tour Styles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tour Styles</Text>
            <TouchableOpacity onPress={() => addArrayItem('tourStyles')}>
              <Ionicons name="add-circle" size={24} color="#FEFA17" />
            </TouchableOpacity>
          </View>
          {profile.tourStyles.map((style, index) => (
            <View key={index} style={styles.arrayItemContainer}>
              <TextInput
                style={styles.arrayInput}
                placeholder="Enter tour style"
                placeholderTextColor="#999"
                value={style}
                onChangeText={(value) => handleArrayChange('tourStyles', index, value)}
              />
              <TouchableOpacity onPress={() => removeArrayItem('tourStyles', index)}>
                <Ionicons name="close-circle" size={24} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Awards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Awards</Text>
            <TouchableOpacity onPress={() => addArrayItem('awards')}>
              <Ionicons name="add-circle" size={24} color="#FEFA17" />
            </TouchableOpacity>
          </View>
          {profile.awards.map((award, index) => (
            <View key={index} style={styles.arrayItemContainer}>
              <TextInput
                style={styles.arrayInput}
                placeholder="Enter award"
                placeholderTextColor="#999"
                value={award}
                onChangeText={(value) => handleArrayChange('awards', index, value)}
              />
              <TouchableOpacity onPress={() => removeArrayItem('awards', index)}>
                <Ionicons name="close-circle" size={24} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F5FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F5FA',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#FEFA17',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FEFA17',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  arrayItemContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  arrayInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#FEFA17',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
})
