import React, { useState } from 'react';

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock user data
  const adminUser = {
    name: 'Theekshana Thathsara',
    email: 'thathsara@example.com',
    role: 'Hotel Managing System Administrator',
    phone: '+94 77 123 4567',
    joinDate: '2022-05-10',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
  };
  
  // Mock security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    emailAlerts: true,
    loginNotifications: true
  });
  
  // Mock form data for profile edit
  const [formData, setFormData] = useState({
    name: adminUser.name,
    email: adminUser.email,
    phone: adminUser.phone
  });
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle security setting toggle
  const handleToggleSetting = (setting) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Handle save profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    // In a real app, this would send data to the server
    console.log('Profile data saved:', formData);
    // Update the admin user data with form data
    // This is just a mock, in a real app you'd make an API call
    alert('Profile updated successfully!');
  };
  
  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    // In a real app, this would send password change request
    console.log('Password change requested');
    alert('Password changed successfully!');
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="bg-yellow-50 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
            <img 
              src={adminUser.avatar} 
              alt="Admin" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/200?text=Admin";
              }}
            />
          </div>
          
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold">{adminUser.name}</h2>
            <p className="text-gray-500">{adminUser.role}</p>
            <p className="text-gray-500 mt-1">{adminUser.email}</p>
            <p className="text-gray-500">Member since {new Date(adminUser.joinDate).toLocaleDateString()}</p>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'profile' 
                  ? 'border-b-2 border-yellow-400 text-yellow-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'security' 
                  ? 'border-b-2 border-yellow-400 text-yellow-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === 'notifications' 
                  ? 'border-b-2 border-yellow-400 text-yellow-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
              
              <div className="mt-6">
                <button 
                  type="submit" 
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'security' && (
            <div>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="font-medium mb-4">Account Security</h3>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={securitySettings.twoFactorAuth}
                      onChange={() => handleToggleSetting('twoFactorAuth')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-yellow-400"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {securitySettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-medium">Email Security Alerts</p>
                    <p className="text-sm text-gray-500">Receive alerts for suspicious activities</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={securitySettings.emailAlerts}
                      onChange={() => handleToggleSetting('emailAlerts')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-yellow-400"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {securitySettings.emailAlerts ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Login Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications for new logins</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={securitySettings.loginNotifications}
                      onChange={() => handleToggleSetting('loginNotifications')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-yellow-400"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {securitySettings.loginNotifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Change Password</h3>
                
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input 
                      type="password" 
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input 
                      type="password" 
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input 
                      type="password" 
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="mt-6">
                    <button 
                      type="submit" 
                      className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-md"
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div>
              <h3 className="font-medium mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive system notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={true}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-yellow-400"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">New Registration Alerts</p>
                    <p className="text-sm text-gray-500">Get notified when new properties register</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={true}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-yellow-400"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Revenue Reports</p>
                    <p className="text-sm text-gray-500">Receive weekly revenue reports</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={true}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-yellow-400"></div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">System Updates</p>
                    <p className="text-sm text-gray-500">Get notified about system updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={false}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-yellow-400"></div>
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-md"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
