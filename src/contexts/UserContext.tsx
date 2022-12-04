import { createContext, ReactNode, useEffect, useState } from 'react';
import { getCurrentUser, isLoggedIn } from '../services/AuthService';

interface con {
  isUserLoggedIn: boolean;
  setIsUserLoggedIn: any;
  user: string | null;
  setUser: any;
  loading: boolean;
  setLoading: any;
}

export const UserContext = createContext({} as con);

export const UserContextProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const isLogged = isLoggedIn();
    setIsUserLoggedIn(isLogged);
    if(isLogged) {
      setUser(getCurrentUser());
    }
    else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const value = {user, setUser, isUserLoggedIn, setIsUserLoggedIn, loading, setLoading} as con;
  
  return <UserContext.Provider value={value}>{!loading && children}</UserContext.Provider>;
};
