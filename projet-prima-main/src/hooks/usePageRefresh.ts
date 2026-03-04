import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const LOADING_DELAY = 500;

export const usePageRefresh = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), LOADING_DELAY);
    return () => clearTimeout(timer);
  }, [location.key]);

  return { isLoading };
}; 