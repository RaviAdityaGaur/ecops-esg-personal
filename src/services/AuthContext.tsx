// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from "../Screens/common";

interface UserGroups {
  id: number;
  groups_name: string[];
  roles: string[];
  added_at: string;
  user: number;
  groups: number[];
}

interface AuthContextType {
  userGroups: string[];
  userRoles: string[];
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    try {
      const response = await api.get('users/get-user-groups').json();
      console.log('Raw API Response:', response);
      
      if (response && response.groups && response.groups.length > 0) {
        const groups = response.groups[0].groups_name || [];
        const roles = response.groups[0].roles || [];
        console.log('Extracted groups:', groups);
        console.log('Extracted roles:', roles);
        setUserGroups(groups);
        setUserRoles(roles);
      } else {
        console.error('No groups found in response:', response);
        setUserGroups([]);
        setUserRoles([]);
      }
    } catch (error) {
      console.error('Error fetching user groups:', error);
      setUserGroups([]);
      setUserRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    // Debug logs
    console.log('Checking permission:', permission);
    console.log('User groups:', userGroups);
    console.log('User roles:', userRoles);
    
    // For 'SEND_EMAIL', check if either the role exists or if user has SUSTAINBILITY_MANAGER_ADMIN group
    if (permission === 'SEND_EMAIL') {
      const hasSendEmailRole = userRoles.includes(permission);
      const isAdmin = userGroups.includes('SUSTAINBILITY_MANAGER_ADMIN');
      console.log('Has SEND_EMAIL role:', hasSendEmailRole);
      console.log('Is SUSTAINBILITY_MANAGER_ADMIN:', isAdmin);
      return hasSendEmailRole || isAdmin;
    }
    
    return userGroups.includes(permission) || userRoles.includes(permission);
  };

  const logout = async () => {
    try {
      // Simply remove auth token from localStorage
      localStorage.removeItem('auth');
      localStorage.removeItem('token');
      window.location.href = '/login'; // Force a page refresh and redirect
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ userGroups, userRoles, hasPermission, isLoading, logout }}>

      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};