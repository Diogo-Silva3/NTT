// src/contexts/AuthContext.jsx
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

const fetchUserData = async (uid) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return docSnap.data();
  return null;
};

const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  const userData = await fetchUserData(firebaseUser.uid);
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: userData?.name || '',
    role: userData?.role || 'user',
  };
};


import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from '@/firebaseConfig'; // Import from your firebaseConfig.js

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDocSnap.data() });
        } else {
          // This case might happen if a user is created in Firebase Auth but not in Firestore
          // Or if it's the very first admin user being set up.
          // For now, we'll just set the basic Firebase user. Role needs to be handled.
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'technician' }); // Default role
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = { uid: firebaseUser.uid, email: firebaseUser.email, ...userDocSnap.data() };
        setUser(userData);
        setLoading(false);
        return userData; 
      } else {
        // This shouldn't happen if users are properly created in Firestore upon signup
        setLoading(false);
        throw new Error("User data not found in database.");
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (email, password, name, role = 'technician') => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: name,
        role: role,
        status: 'active', // Default status
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", firebaseUser.uid), userData);
      
      // If it's the first user, make them admin (example logic)
      // This logic might need to be more robust, e.g. checking if any admin exists.
      // For now, if an "admin" role is passed, it will be set.
      // The "Admin" user should typically be created once.
      
      setUser(userData); // Set user in context
      setLoading(false);
      return userData;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  
  // Example function to create the first admin user if none exists.
  // This is a simplified example. In a real app, you might run this once or have a setup script.
  const createFirstAdmin = async (email, password, name) => {
    if (isCreatingAdmin) return; // Prevent multiple calls
    setIsCreatingAdmin(true);
    setLoading(true);
    try {
      // Ideally, check if an admin already exists in Firestore before creating a new one.
      // For simplicity, this example directly calls signup with admin role.
      const adminUser = await signup(email, password, name, 'admin');
      console.log("Admin user created:", adminUser);
      setIsCreatingAdmin(false);
      setLoading(false);
      return adminUser;
    } catch (error) {
      console.error("Error creating admin user:", error);
      setIsCreatingAdmin(false);
      setLoading(false);
      throw error;
    }
  };


  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error signing out: ", error);
      throw error;
    }
  };
  
  const value = { user, login, logout, signup, loading, isAuthenticated: !!user, createFirstAdmin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
