import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isInitialized = false;
    this.authCallbacks = [];
    
    // Set persistence to local
    setPersistence(auth, browserLocalPersistence).catch(console.error);
    
    // Initialize auth state listener
    this.initAuthListener();
  }

  initAuthListener() {
    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      this.isInitialized = true;
      
      if (user) {
        // Create or update user document in Firestore
        await this.createUserDocument(user);
      }
      
      // Notify all callbacks
      this.authCallbacks.forEach(callback => callback(user));
    });
  }

  async createUserDocument(user) {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userRef);
      
      if (!userSnapshot.exists()) {
        // Create new user document
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          settings: {
            theme: 'light',
            autoSave: true,
            emailNotifications: true
          }
        });
      } else {
        // Update last login time
        await setDoc(userRef, {
          lastLoginAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error creating/updating user document:', error);
    }
  }

  async signInWithGoogle() {
    try {
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, googleProvider);
      return {
        success: true,
        user: result.user,
        message: 'Successfully signed in with Google'
      };
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      let errorMessage = 'Failed to sign in with Google';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in popup was closed. Please try again.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked by your browser. Please allow popups and try again.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection and try again.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          errorMessage = error.message;
      }
      
      return {
        success: false,
        error: error.code,
        message: errorMessage
      };
    }
  }

  async signOut() {
    try {
      await signOut(auth);
      return {
        success: true,
        message: 'Successfully signed out'
      };
    } catch (error) {
      console.error('Sign-out error:', error);
      return {
        success: false,
        error: error.code,
        message: 'Failed to sign out'
      };
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  waitForAuthInitialization() {
    return new Promise((resolve) => {
      if (this.isInitialized) {
        resolve(this.currentUser);
      } else {
        const unsubscribe = this.onAuthStateChanged((user) => {
          unsubscribe();
          resolve(user);
        });
      }
    });
  }

  onAuthStateChanged(callback) {
    this.authCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authCallbacks.indexOf(callback);
      if (index > -1) {
        this.authCallbacks.splice(index, 1);
      }
    };
  }

  async getUserProfile() {
    if (!this.currentUser) return null;
    
    try {
      const userRef = doc(db, 'users', this.currentUser.uid);
      const userSnapshot = await getDoc(userRef);
      
      if (userSnapshot.exists()) {
        return userSnapshot.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async updateUserProfile(updates) {
    if (!this.currentUser) return { success: false, message: 'No user signed in' };
    
    try {
      const userRef = doc(db, 'users', this.currentUser.uid);
      await setDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, message: 'Failed to update profile' };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;