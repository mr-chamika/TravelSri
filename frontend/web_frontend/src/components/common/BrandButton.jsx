import React from 'react';
import { brandColors } from '../../utils/colorUtils';

/**
 * Branded button component using our color system
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, accent)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Button component
 */
const BrandButton = ({ 
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  className = '',
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses = 'font-medium rounded-md transition-all flex items-center justify-center';
  
  // Variant specific classes
  const variantClasses = {
    primary: `bg-[${brandColors.primary.main}] hover:bg-[${brandColors.primary.hover}] text-black`,
    secondary: `bg-[${brandColors.secondary.main}] hover:bg-[${brandColors.secondary.dark}] text-white`,
    outline: `bg-transparent border border-[${brandColors.primary.main}] text-black hover:bg-[${brandColors.primary.background}]`,
    text: `bg-transparent text-[${brandColors.primary.main}] hover:text-[${brandColors.primary.hover}] hover:bg-[${brandColors.primary.background}]`
  };
  
  // Size specific classes
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  // Combine all classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button 
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default BrandButton;