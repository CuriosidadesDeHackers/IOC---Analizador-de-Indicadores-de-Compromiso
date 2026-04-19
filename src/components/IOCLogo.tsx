import React from 'react';

interface IOCLogoProps {
  type: string;
  className?: string;
  severityColor?: string;
}

const IOCLogo: React.FC<IOCLogoProps> = ({ type, className = "w-8 h-8", severityColor = "from-blue-500 to-blue-600" }) => {
  const renderLogo = () => {
    switch (type) {
      case 'domain':
        return (
          <svg viewBox="0 0 100 100" className={className}>
            <defs>
              <linearGradient id="domainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className="stop-color-current" />
                <stop offset="100%" stopColor="white" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="animate-spin-slow" />
            <path d="M50 20 L80 50 L50 80 L20 50 Z" fill={`url(#domainGrad)`} className="opacity-80" />
            <circle cx="50" cy="50" r="10" fill="currentColor" />
            <path d="M30 50 H70 M50 30 V70" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'hash':
        return (
          <svg viewBox="0 0 100 100" className={className}>
            <rect x="25" y="25" width="50" height="50" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
            <path d="M40 40 L60 60 M60 40 L40 60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <rect x="15" y="15" width="20" height="20" rx="2" fill="currentColor" className="opacity-40" />
            <rect x="65" y="65" width="20" height="20" rx="2" fill="currentColor" className="opacity-40" />
          </svg>
        );
      case 'ip':
        return (
          <svg viewBox="0 0 100 100" className={className}>
            <path d="M20 50 Q50 10 80 50 Q50 90 20 50" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="50" cy="50" r="15" fill="currentColor" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 6" className="animate-spin-slow" />
          </svg>
        );
      case 'email':
        return (
          <svg viewBox="0 0 100 100" className={className}>
            <path d="M15 30 L85 30 L85 70 L15 70 Z" fill="none" stroke="currentColor" strokeWidth="4" />
            <path d="M15 30 L50 55 L85 30" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="80" cy="25" r="8" fill="currentColor" className="animate-pulse" />
          </svg>
        );
      case 'url':
        return (
          <svg viewBox="0 0 100 100" className={className}>
            <path d="M30 40 H70 M30 60 H70 M40 30 V70 M60 30 V70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <rect x="20" y="20" width="60" height="60" rx="8" fill="none" stroke="currentColor" strokeWidth="4" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 100 100" className={className}>
            <path d="M50 15 L85 30 V60 L50 85 L15 60 V30 Z" fill="none" stroke="currentColor" strokeWidth="4" />
            <path d="M50 35 V65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <circle cx="50" cy="25" r="4" fill="currentColor" />
          </svg>
        );
    }
  };

  return (
    <div className="relative">
      <div className={`absolute -inset-2 rounded-full blur-md opacity-20 bg-gradient-to-br ${severityColor}`}></div>
      <div className="relative">
        {renderLogo()}
      </div>
    </div>
  );
};

export default IOCLogo;
