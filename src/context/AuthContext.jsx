import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users data
const mockUsers = [
  {
    id: 1,
    email: 'admin@realestate.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phone: '+1-555-0100',
    isVerified: true
  },
  {
    id: 2,
    email: 'john@example.com',
    password: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    phone: '+1-555-0101',
    isVerified: true
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(mockUsers);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        const userToStore = { ...user };
        delete userToStore.password; // Don't store password
        setCurrentUser(userToStore);
        localStorage.setItem('currentUser', JSON.stringify(userToStore));
        return { success: true, user: userToStore };
      }
      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Check if user already exists
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        return { success: false, error: 'User already exists with this email' };
      }

      const newUser = {
        id: users.length + 1,
        ...userData,
        role: 'user',
        isVerified: false
      };

      setUsers(prev => [...prev, newUser]);
      
      // Simulate sending welcome email
      console.log(`Welcome email sent to ${userData.email}!`);
      alert(`Welcome! A confirmation email has been sent to ${userData.email}`);

      return { success: true, message: 'Registration successful! Please check your email for verification.' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update in users array
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...updatedUser, password: u.password } : u));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const isAdmin = () => {
    return currentUser && currentUser.role === 'admin';
  };

  const isLoggedIn = () => {
    return !!currentUser;
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
    isLoggedIn,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};