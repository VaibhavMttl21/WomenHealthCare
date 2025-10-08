import { useEffect, useState } from 'react';
import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { setCredentials, clearCredentials } from '../store/slices/authSlice';

/**
 * Hook to restore auth state from localStorage on app load
 */
export const useAuthRestore = () => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!storedToken) {
          setIsRestoring(false);
          return;
        }

        // If we have both token and user in localStorage, restore them
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            dispatch(setCredentials({ user: userData, token: storedToken }));
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            // Clear invalid data
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            dispatch(clearCredentials());
          }
        }

        setIsRestoring(false);
      } catch (error) {
        console.error('Error restoring auth:', error);
        dispatch(clearCredentials());
        setIsRestoring(false);
      }
    };

    // Only restore if we don't already have user data
    if (!user && token) {
      restoreAuth();
    } else {
      setIsRestoring(false);
    }
  }, [dispatch, token, user]);

  return { isRestoring };
};
