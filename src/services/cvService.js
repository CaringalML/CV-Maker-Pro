import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import authService from './authService';

class CVService {
  constructor() {
    this.userCVsRef = null;
    this.unsubscribes = new Map();
  }

  // Initialize user-specific collections
  initUserCollections(userId) {
    this.userCVsRef = collection(db, 'users', userId, 'cvs');
  }

  // Create default CV structure
createDefaultCV() {
  return {
    id: Date.now().toString(),
    name: 'My CV_v1', // Default name, will be overridden
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: ''
      },
      experience: [],
      education: [],
      skills: [],
      languages: []
    }
  };
}

  // Save CV to Firestore
  async saveCV(cvData) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      this.initUserCollections(user.uid);
      
      const cvRef = doc(this.userCVsRef, cvData.id);
      const cvToSave = {
        ...cvData,
        updatedAt: serverTimestamp(),
        userId: user.uid
      };

      await setDoc(cvRef, cvToSave, { merge: true });
      
      return { 
        success: true, 
        message: 'CV saved successfully',
        cvId: cvData.id 
      };
    } catch (error) {
      console.error('Error saving CV:', error);
      throw new Error(`Failed to save CV: ${error.message}`);
    }
  }

  // Load all CVs for current user
  async loadUserCVs() {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      this.initUserCollections(user.uid);
      
      const q = query(
        this.userCVsRef, 
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const cvs = [];
      
      querySnapshot.forEach((doc) => {
        const cvData = doc.data();
        // Convert Firestore timestamps to ISO strings
        cvs.push({
          ...cvData,
          createdAt: cvData.createdAt?.toDate?.()?.toISOString() || cvData.createdAt,
          updatedAt: cvData.updatedAt?.toDate?.()?.toISOString() || cvData.updatedAt
        });
      });

      // If no CVs exist, create a default one
      if (cvs.length === 0) {
        const defaultCV = this.createDefaultCV();
        await this.saveCV(defaultCV);
        return [defaultCV];
      }

      return cvs;
    } catch (error) {
      console.error('Error loading CVs:', error);
      throw new Error(`Failed to load CVs: ${error.message}`);
    }
  }

  // Load specific CV by ID
  async loadCV(cvId) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      this.initUserCollections(user.uid);
      
      const cvRef = doc(this.userCVsRef, cvId);
      const cvSnapshot = await getDoc(cvRef);
      
      if (cvSnapshot.exists()) {
        const cvData = cvSnapshot.data();
        return {
          ...cvData,
          createdAt: cvData.createdAt?.toDate?.()?.toISOString() || cvData.createdAt,
          updatedAt: cvData.updatedAt?.toDate?.()?.toISOString() || cvData.updatedAt
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error loading CV:', error);
      throw new Error(`Failed to load CV: ${error.message}`);
    }
  }

  // Delete CV
  async deleteCV(cvId) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      this.initUserCollections(user.uid);
      
      const cvRef = doc(this.userCVsRef, cvId);
      await deleteDoc(cvRef);
      
      return { 
        success: true, 
        message: 'CV deleted successfully' 
      };
    } catch (error) {
      console.error('Error deleting CV:', error);
      throw new Error(`Failed to delete CV: ${error.message}`);
    }
  }

  // Duplicate CV
  async duplicateCV(originalCvId, newName) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const originalCV = await this.loadCV(originalCvId);
      if (!originalCV) {
        throw new Error('Original CV not found');
      }

      const duplicatedCV = {
        ...originalCV,
        id: Date.now().toString(),
        name: newName || `${originalCV.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefault: false
      };

      await this.saveCV(duplicatedCV);
      return duplicatedCV;
    } catch (error) {
      console.error('Error duplicating CV:', error);
      throw new Error(`Failed to duplicate CV: ${error.message}`);
    }
  }

  // Real-time listener for CVs
  subscribeToCVs(callback) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    this.initUserCollections(user.uid);
    
    const q = query(
      this.userCVsRef, 
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cvs = [];
      querySnapshot.forEach((doc) => {
        const cvData = doc.data();
        cvs.push({
          ...cvData,
          createdAt: cvData.createdAt?.toDate?.()?.toISOString() || cvData.createdAt,
          updatedAt: cvData.updatedAt?.toDate?.()?.toISOString() || cvData.updatedAt
        });
      });
      callback(cvs);
    }, (error) => {
      console.error('Error in CV subscription:', error);
      callback([]);
    });

    return unsubscribe;
  }

  // Batch operations for better performance
  async batchSaveCVs(cvs) {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      this.initUserCollections(user.uid);
      
      const batch = writeBatch(db);
      
      cvs.forEach(cv => {
        const cvRef = doc(this.userCVsRef, cv.id);
        batch.set(cvRef, {
          ...cv,
          updatedAt: serverTimestamp(),
          userId: user.uid
        }, { merge: true });
      });

      await batch.commit();
      
      return { 
        success: true, 
        message: `${cvs.length} CVs saved successfully` 
      };
    } catch (error) {
      console.error('Error batch saving CVs:', error);
      throw new Error(`Failed to batch save CVs: ${error.message}`);
    }
  }

  // Auto-save functionality
  setupAutoSave(cvData, intervalMs = 30000) { // Auto-save every 30 seconds
    const autoSaveKey = `autosave-${cvData.id}`;
    
    // Clear existing auto-save for this CV
    if (this.unsubscribes.has(autoSaveKey)) {
      clearInterval(this.unsubscribes.get(autoSaveKey));
    }

    const intervalId = setInterval(async () => {
      try {
        await this.saveCV(cvData);
        console.log(`Auto-saved CV: ${cvData.name}`);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, intervalMs);

    this.unsubscribes.set(autoSaveKey, intervalId);
    
    return () => {
      clearInterval(intervalId);
      this.unsubscribes.delete(autoSaveKey);
    };
  }

  // Cleanup all subscriptions
  cleanup() {
    this.unsubscribes.forEach((unsubscribe, key) => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      } else {
        clearInterval(unsubscribe); // For auto-save intervals
      }
    });
    this.unsubscribes.clear();
  }

  // Get user statistics
  async getUserStats() {
    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const cvs = await this.loadUserCVs();
      
      return {
        totalCVs: cvs.length,
        lastUpdated: cvs.length > 0 ? cvs[0].updatedAt : null,
        oldestCV: cvs.length > 0 ? cvs[cvs.length - 1].createdAt : null
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalCVs: 0,
        lastUpdated: null,
        oldestCV: null
      };
    }
  }
}

// Export singleton instance
export const cvService = new CVService();
export default cvService;