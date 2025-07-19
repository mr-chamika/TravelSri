import React from 'react';
import { MdStar, MdStarHalf, MdStarOutline } from 'react-icons/md';

const Rating = ({ value, total = 5 }) => {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 !== 0;
  const emptyStars = total - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <MdStar key={`full-${i}`} className="text-yellow-500 text-xl" />
      ))}
      {hasHalfStar && <MdStarHalf className="text-yellow-500 text-xl" />}
      {[...Array(emptyStars)].map((_, i) => (
        <MdStarOutline key={`empty-${i}`} className="text-yellow-500 text-xl" />
      ))}
    </div>
  );
};

export default Rating;
