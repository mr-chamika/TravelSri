import React, { useState } from 'react';
import FeedbackStats from '../../../components/HotelAdminM/HotelAdmin/Feedback/FeedbackStats';
import FeedbackFilters from '../../../components/HotelAdminM/HotelAdmin/Feedback/FeedbackFilters';
import FeedbackList from '../../../components/HotelAdminM/HotelAdmin/Feedback/FeedbackList';

const FeedbackPage = () => {
  // Sample feedback data - in a real app, this would come from API/backend
  const [feedbacks, setFeedbacks] = useState([
    {
      guest: 'John Smith',
      avatar: null,
      rating: 4.5,
      date: 'July 10, 2025',
      comment: 'Excellent stay overall! The room was clean and spacious, and the staff was very friendly and helpful. Would definitely recommend to friends. The only small issue was that the breakfast buffet could have more variety.',
      reply: "Thank you for your kind words, Mr. Smith! We're delighted you enjoyed your stay and appreciate your feedback about our breakfast offerings. We're working on expanding our menu options and hope to welcome you back soon!",
      serviceType: 'Room Service',
      roomType: 'Deluxe Room'
    },
    {
      guest: 'Emily Johnson',
      avatar: null,
      rating: 5,
      date: 'July 8, 2025',
      comment: 'Amazing experience! The spa services were top-notch and the room had a breathtaking view. Everything was perfect from check-in to check-out. Special thanks to the concierge for arranging our tour.',
      reply: null,
      serviceType: 'Spa',
      roomType: 'Ocean View Suite'
    },
    {
      guest: 'Michael Brown',
      avatar: null,
      rating: 3,
      date: 'July 5, 2025',
      comment: 'The location is good and staff were friendly, but the room felt outdated and in need of renovation. The bathroom fixtures were worn and the AC was quite noisy during the night.',
      reply: "Thank you for your honest feedback, Mr. Brown. We apologize that your room didn't meet expectations. We're actually beginning renovations next month and would love to welcome you back to experience our upgraded accommodations. Please contact me directly for your next booking.",
      serviceType: 'Housekeeping',
      roomType: 'Standard Room'
    },
    {
      guest: 'Sarah Wilson',
      avatar: null,
      rating: 4,
      date: 'July 2, 2025',
      comment: 'Very good stay! The restaurant food was exceptional, especially the local cuisine options. Room was comfortable and clean. Just wish the pool was open longer hours.',
      reply: null,
      serviceType: 'Restaurant',
      roomType: 'Garden View Room'
    },
    {
      guest: 'David Miller',
      avatar: null,
      rating: 2,
      date: 'June 28, 2025',
      comment: "Disappointing experience. Long wait at check-in, room wasn't ready until 2 hours after stated check-in time. When we finally got to the room, it hadn't been properly cleaned.",
      reply: "Mr. Miller, please accept our sincere apologies for the issues you experienced. This falls well below our usual standards. We've addressed these concerns with our team, and I would appreciate the opportunity to discuss this further and make things right. Please contact me directly at manager@hotel.com.",
      serviceType: 'Front Desk',
      roomType: 'Deluxe Suite'
    },
    {
      guest: 'Jennifer Taylor',
      avatar: null,
      rating: 5,
      date: 'June 25, 2025',
      comment: 'Perfect anniversary getaway! The staff went above and beyond to make our stay special - champagne in the room and rose petals on the bed were a lovely surprise. The amenities and service were world-class.',
      reply: null,
      serviceType: 'Amenities',
      roomType: 'Honeymoon Suite'
    },
    {
      guest: 'Robert Anderson',
      avatar: null,
      rating: 3.5,
      date: 'June 20, 2025',
      comment: 'Mixed experience. The location and views were fantastic, and the room was nice. However, service was slow at the restaurant and we had issues with our room keys not working twice.',
      reply: null,
      serviceType: 'Restaurant',
      roomType: 'Mountain View Room'
    },
  ]);
  
  // Calculate stats - this will be recalculated on every render when feedbacks state changes
  const feedbackStats = {
    averageRating: parseFloat((feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(2)),
    positiveCount: feedbacks.filter(f => f.rating >= 4).length,
    neutralCount: feedbacks.filter(f => f.rating >= 3 && f.rating < 4).length,
    negativeCount: feedbacks.filter(f => f.rating < 3).length,
    totalReviews: feedbacks.length,
    pendingReplies: feedbacks.filter(f => !f.reply).length
  };
  
  feedbackStats.positivePercentage = Math.round((feedbackStats.positiveCount / feedbackStats.totalReviews) * 100);
  
  // Filters state
  const [filters, setFilters] = useState({
    status: 'all', // all, replied, unreplied
    rating: 'all', // all, 5, 4, 3, 2, 1
    serviceType: 'all',
    search: ''
  });
  
  // Toast notification state
  const [notification, setNotification] = useState(null);
  
  // Handle sending replies to feedback
  const handleSendReply = async (id, replyText) => {
    // In a real app, this would be an API call
    // For this demo, we'll update the state directly
    return new Promise((resolve, reject) => {
      try {
        // Simulate API delay
        setTimeout(() => {
          setFeedbacks(prevFeedbacks => {
            const updatedFeedbacks = [...prevFeedbacks];
            // Find and update the feedback with the given ID
            const index = parseInt(id, 10);
            if (updatedFeedbacks[index]) {
              updatedFeedbacks[index] = {
                ...updatedFeedbacks[index],
                reply: replyText
              };
            }
            return updatedFeedbacks;
          });
          
          // Show success notification
          setNotification({
            type: 'success',
            message: 'Reply sent successfully!'
          });
          
          // Hide notification after 3 seconds
          setTimeout(() => {
            setNotification(null);
          }, 3000);
          
          resolve();
        }, 800); // Simulate network delay
      } catch (error) {
        // Show error notification
        setNotification({
          type: 'error',
          message: 'Failed to send reply. Please try again.'
        });
        
        // Hide notification after 3 seconds
        setTimeout(() => {
          setNotification(null);
        }, 3000);
        
        reject(error);
      }
    });
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Customer Feedback</h2>
      
      {/* Notification Toast */}
      {notification && (
        <div 
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg flex items-center ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          <span>{notification.message}</span>
        </div>
      )}
      
      {/* Stats Overview */}
      <FeedbackStats stats={feedbackStats} />
      
      {/* Filters */}
      <FeedbackFilters filters={filters} setFilters={setFilters} />
      
      {/* Feedback List */}
      <FeedbackList 
        feedbacks={feedbacks} 
        filters={filters} 
        onSendReply={handleSendReply}
      />
    </div>
  );
};

export default FeedbackPage;
