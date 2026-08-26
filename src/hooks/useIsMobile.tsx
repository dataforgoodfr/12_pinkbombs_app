import { useState, useEffect } from 'react';

export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to update state based on window width
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // Check on initial mount
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};