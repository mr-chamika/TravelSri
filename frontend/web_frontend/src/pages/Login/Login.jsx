import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
// Flash Message Component
const FlashMessage = ({ type, message, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' :
    'bg-red-100 border-red-400 text-red-700';

  const iconName = type === 'success' ? 'check_circle' : 'error';

  // Auto-close flash message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`border ${bgColor} px-4 py-3 rounded-md relative mb-4 animate-in slide-in-from-right duration-300 shadow-lg`}
      role="alert"
    >
      <div className="flex items-center pr-6">
        <span className="material-icons mr-2">{iconName}</span>
        <span className="block text-sm font-medium">{message}</span>
      </div>
      <button
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
        onClick={onClose}
      >
        <span className="material-icons text-sm cursor-pointer hover:text-gray-700">close</span>
      </button>
    </div>
  );
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [flashMessage, setFlashMessage] = useState({ show: false, type: '', message: '' });

  const navigate = useNavigate();


  // Check for remembered username when component mounts
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      setLoginData(prev => ({ ...prev, username: rememberedUser }));
      setRememberMe(true);
    }
  }, []);

  // Function to show a flash message
  const showFlash = (type, message) => {
    setFlashMessage({ show: true, type, message });
  };

  // Function to hide the flash message
  const hideFlash = () => {
    setFlashMessage({ show: false, type: '', message: '' });
  };

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'rememberMe') {
      setRememberMe(checked);
    } else {
      setLoginData({
        ...loginData,
        [name]: value
      });
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', loginData);

    // Clear any previous error messages
    hideFlash();

    // Set loading state
    setIsLoading(true);

    // Here we would typically make an API call to validate credentials
    // Adding a small delay to simulate API call
    setTimeout(() => {
      validateCredentials(loginData.username, loginData.password);
    }, 800);
  };

  // Function to validate credentials
  const validateCredentials = (username, password) => {
    // In a real application, this would be an API call
    // For testing purposes, we'll use some hardcoded valid credentials
    const validCredentials = [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'hotel', password: 'hotel123', role: 'hotel' },
      { username: 'user', password: 'user123', role: 'user' }
    ];

    // Check if credentials match any valid user
    const user = validCredentials.find(
      cred => cred.username === username && cred.password === password
    );

    if (user) {
      // Success! Show success message and navigate to dashboard
      showFlash('success', 'Login successful! Welcome back!');

      // Create the base user session data
      const userData = {
        username: user.username,
        role: user.role,
        isLoggedIn: true
      };

      // If rememberMe is checked, also store the credentials securely
      if (rememberMe) {
        userData.rememberMe = true;
        // In a real app, we'd implement secure credential storage
        // This is just for demonstration
        localStorage.setItem('rememberedUser', username);
      } else {
        // If not remembering the user, ensure we don't have any saved credentials
        localStorage.removeItem('rememberedUser');
      }

      // Store the user session
      localStorage.setItem('user', JSON.stringify(userData));

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        // Navigate based on user role
        switch (user.role) {
          case 'admin':
            window.location.href = '/admin/dashboard';
            break;
          case 'hotel':
            window.location.href = '/hotel/dashboard';
            break;
          default:
            window.location.href = '/dashboard';
        }
      }, 1500);
    } else {
      // Failed login - show error message
      showFlash('error', 'Invalid username or password. Please try again.');
    }

    // Reset loading state
    setIsLoading(false);
  };

  // Function to handle redirect to signup page
  const handleSignupRedirect = (e) => {
    e.preventDefault();
    // Navigate to the signup page
    navigate('/signup')
    // window.location.href = '/signup';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-100 via-white to-yellow-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo and title */}
        <div className="mb-6 text-center">
          <img src="/logo.png" alt="TravelSri Logo" className="w-12 h-12 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Welcome to TravelSri</h1>
          <p className="text-sm text-gray-500">Sign in with your username</p>
        </div>

        {/* Flash Message */}
        {flashMessage.show && (
          <FlashMessage
            type={flashMessage.type}
            message={flashMessage.message}
            onClose={hideFlash}
          />
        )}

        {/* Login form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 
                  ${flashMessage.type === 'error' ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  focus:ring-yellow-400`}
                placeholder="Enter your username"
                autoComplete={rememberMe ? "username" : "new-password"}
                required
              />
              <span className="absolute left-3 top-2.5 text-gray-400 material-icons">person</span>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={loginData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 pl-10 pr-10 border rounded-md focus:outline-none focus:ring-2 
                  ${flashMessage.type === 'error' ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  focus:ring-yellow-400`}
                placeholder="Password"
                autoComplete={rememberMe ? "current-password" : "new-password"}
                required
              />
              <span className="absolute left-3 top-2.5 text-gray-400 material-icons">lock</span>
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-yellow-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-icons text-sm">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                />
                Remember me
              </label>
              <a href="#" className="text-yellow-500 hover:underline">Forgot password?</a>
            </div>

            {!rememberMe && (
              <p className="text-xs text-gray-500 italic">
                <span className="material-icons text-gray-400 text-xs align-middle mr-1">info</span>
                Your login details won't be saved for next time!
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 mt-2 font-semibold rounded-md transition flex items-center justify-center
              ${isLoading
                ? 'bg-yellow-300 cursor-not-allowed'
                : 'bg-yellow-400 hover:bg-yellow-500'} text-black`}
          >
            {isLoading ? (
              <>
                <span className="material-icons animate-spin mr-2 text-sm">refresh</span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <button
            onClick={handleSignupRedirect}
            className="text-yellow-500 hover:underline font-medium bg-transparent border-none p-0"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
