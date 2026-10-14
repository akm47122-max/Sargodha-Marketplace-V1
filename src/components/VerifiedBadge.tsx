import React from 'react';

interface VerifiedBadgeProps {
  showText?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  tooltip?: string;
}

/**
 * Official Blue Verified Badge with white checkmark (✓)
 * Used across product listings, seller profiles, shops, and freight transporters.
 * Only shown for Admin-approved verified accounts.
 */
export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  showText = true,
  size = 'sm',
  className = '',
  tooltip = 'Verified by SargodhaMart Administrators (تصدیق شدہ)',
}) => {
  const sizeClasses = {
    xs: 'text-[9px] px-1 py-0.2 gap-0.5',
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-0.5 gap-1',
    lg: 'text-sm px-2.5 py-1 gap-1.5',
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center font-black rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors shrink-0 select-none ${sizeClasses[size]} ${className}`}
      title={tooltip}
    >
      {/* Blue badge with crisp white checkmark SVG */}
      <svg
        className={`${iconSizes[size]} text-white shrink-0 fill-current`}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
      {showText && <span className="font-extrabold uppercase tracking-wider">Verified</span>}
    </span>
  );
};
