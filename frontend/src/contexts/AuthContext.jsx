import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, handleLogout, loginUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await getCurrentUser();
  
      const data = await response.json();

      setUser(data);
      
    } catch (error) {
      console.error("Error", error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      await loginUser(credentials);
      const response = await getCurrentUser();
      const data = await response.json();
      setUser(data);
      return data;
    } catch (error) {
      console.error("Login error", error.message);
      throw error; 
    }
  }

  const logout = async () => {
    try {
      await handleLogout();
      await fetchUser();
    } catch (error) {
      console.error("Error when trying to logout", error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
