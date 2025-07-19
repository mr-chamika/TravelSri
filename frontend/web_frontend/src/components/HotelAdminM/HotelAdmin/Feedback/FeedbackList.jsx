import React, { useState } from 'react';
import FeedbackCard from './FeedbackCard';

const FeedbackList = ({ feedbacks, filters, onSendReply }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  
  // Apply filters
  const filteredFeedbacks = feedbacks.filter(feedback => {
    // Filter by status (replied/unreplied)
    if (filters.status === 'replied' && !feedback.reply) return false;
    if (filters.status === 'unreplied' && feedback.reply) return false;
    
    // Filter by rating
    if (filters.rating && filters.rating !== 'all') {
      const ratingValue = parseInt(filters.rating, 10);
      if (Math.floor(feedback.rating) !== ratingValue) return false;
    }
    
    // Filter by service type
    if (filters.serviceType && filters.serviceType !== 'all' && 
        feedback.serviceType !== filters.serviceType) return false;
    
    // Filter by search term
    if (filters.search && !feedback.comment.toLowerCase().includes(filters.search.toLowerCase()) && 
        !feedback.guest.toLowerCase().includes(filters.search.toLowerCase())) return false;
    
    return true;
  });
  
  // Paginate
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (page - 1) * itemsPerPage, 
    page * itemsPerPage
  );
  
  if (filteredFeedbacks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-10 text-center">
        <p className="text-gray-500">No feedback found matching your filters.</p>
      </div>
    );
  }
  
  return (
    <div>
      {paginatedFeedbacks.map((feedback, index) => (
        <FeedbackCard 
          key={index} 
          feedback={{...feedback, id: index}} 
          onSendReply={onSendReply} 
        />
      ))}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-1">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1 
                    ? 'bg-yellow-400 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded ${
                page === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
