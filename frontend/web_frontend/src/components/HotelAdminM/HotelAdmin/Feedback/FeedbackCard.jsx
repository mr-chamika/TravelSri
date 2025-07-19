import React, { useState } from 'react';
import Rating from './Rating';

const FeedbackCard = ({ feedback, onSendReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const { 
    guest, 
    avatar, 
    rating, 
    date, 
    comment, 
    reply, 
    serviceType,
    roomType,
    id
  } = feedback;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3">
            {avatar ? (
              <img src={avatar} alt={guest} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-yellow-100 text-yellow-800 font-bold text-xl">
                {guest.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium">{guest}</h4>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <span>{date}</span>
              <span className="mx-2">•</span>
              <span>{roomType}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center justify-end">
            <Rating value={rating} />
            <span className="ml-2 font-bold">{rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-500">{serviceType}</span>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-gray-800">{comment}</p>
      </div>
      
      {reply && (
        <div className="bg-gray-50 p-3 rounded-md mt-3 border-l-4 border-yellow-400">
          <p className="text-sm font-medium mb-1">Hotel Response:</p>
          <p className="text-sm text-gray-700">{reply}</p>
        </div>
      )}
      
      {!reply && !isReplying && (
        <div className="flex justify-end mt-3">
          <button 
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md text-sm"
            onClick={() => setIsReplying(true)}
          >
            Reply
          </button>
        </div>
      )}
      
      {!reply && isReplying && (
        <div className="mt-3 border-t pt-3">
          <div className="mb-2">
            <textarea
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-200"
              rows="3"
              placeholder="Type your response here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={isSending}
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <button 
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm"
              onClick={() => {
                setIsReplying(false);
                setReplyText('');
              }}
              disabled={isSending}
            >
              Cancel
            </button>
            <button 
              className={`${isSending ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-3 py-1 rounded-md text-sm flex items-center`}
              onClick={async () => {
                if (!replyText.trim()) return;
                
                setIsSending(true);
                try {
                  // If onSendReply is provided, call it with the feedback ID and reply text
                  if (onSendReply) {
                    await onSendReply(id, replyText);
                  }
                  
                  // Reset the form (in a real app you'd update the feedback with the new reply)
                  setIsReplying(false);
                  setReplyText('');
                } catch (error) {
                  console.error("Failed to send reply:", error);
                } finally {
                  setIsSending(false);
                }
              }}
              disabled={isSending || !replyText.trim()}
            >
              {isSending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : "Send Message"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;
