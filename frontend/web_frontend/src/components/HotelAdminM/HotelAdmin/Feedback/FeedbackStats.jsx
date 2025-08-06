import React from 'react';
import {
  MdSentimentVerySatisfied,
  MdSentimentSatisfied,
  MdSentimentDissatisfied,
  MdStarRate,
  MdMessage
} from 'react-icons/md';

const FeedbackStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-xs font-medium tracking-wider">AVERAGE RATING</h3>
            <p className="text-2xl font-bold mt-1">{stats.averageRating.toFixed(2)} / 5.0</p>
            <div className="flex text-yellow-500 mt-1">
              {[...Array(5)].map((_, i) => (
                <MdStarRate 
                  key={i} 
                  className={i < Math.floor(stats.averageRating) ? "text-yellow-500" : "text-gray-300"} 
                />
              ))}
            </div>
          </div>
          <div className="p-2 rounded-full bg-white bg-opacity-80 shadow-sm">
            <MdStarRate className="text-3xl text-yellow-500" />
          </div>
        </div>
        <div className="h-1 w-full bg-yellow-400 mt-3"></div>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-xs font-medium tracking-wider">SENTIMENT</h3>
            <p className="text-2xl font-bold mt-1">{stats.positivePercentage}% Positive</p>
            <div className="flex text-sm mt-1">
              <span className="text-green-600 mr-2">
                Positive: {stats.positiveCount}
              </span>
              <span className="text-gray-600 mr-2">
                Neutral: {stats.neutralCount}
              </span>
              <span className="text-red-600">
                Negative: {stats.negativeCount}
              </span>
            </div>
          </div>
          <div className="p-2 rounded-full bg-white bg-opacity-80 shadow-sm">
            <MdSentimentVerySatisfied className="text-3xl text-yellow-500" />
          </div>
        </div>
        <div className="h-1 w-full bg-yellow-400 mt-3"></div>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-500 text-xs font-medium tracking-wider">TOTAL REVIEWS</h3>
            <p className="text-2xl font-bold mt-1">{stats.totalReviews}</p>
            <p className="text-sm text-gray-600 mt-1">{stats.pendingReplies} awaiting response</p>
          </div>
          <div className="p-2 rounded-full bg-white bg-opacity-80 shadow-sm">
            <MdMessage className="text-3xl text-yellow-500" />
          </div>
        </div>
        <div className="h-1 w-full bg-yellow-400 mt-3"></div>
      </div>
    </div>
  );
};

export default FeedbackStats;
