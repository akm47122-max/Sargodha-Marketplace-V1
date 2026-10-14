/**
 * SARGODHAMART - Firebase Service Layer
 * Authentication (Firebase Auth), Persistent Data (Cloud Firestore), Media (Cloud Storage)
 */

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, Listing, JobPost, CollegeAd, UserNotification, ActivationPayment } from '../types';

export const ADMIN_EMAILS = ['akm47122@gmail.com', 'admin@sargodhamart.com'];

export const firebaseService = {
  // ========================================================
  // 1. AUTHENTICATION & USER PROFILES
  // ========================================================
  auth: {
    onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
      return onAuthStateChanged(auth, callback);
    },

    async getCurrentUserProfile(): Promise<UserProfile | null> {
      const fbUser = auth.currentUser;
      if (!fbUser) return null;

      const userPath = `users/${fbUser.uid}`;
      try {
        const snap = await getDoc(doc(db, 'users', fbUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          const isAdmin = ADMIN_EMAILS.includes(fbUser.email?.toLowerCase() || '') || data.role === 'super_admin' || data.role === 'admin';
          return {
            id: typeof data.numericId === 'number' ? data.numericId : Date.now(),
            uid: fbUser.uid,
            name: data.name || fbUser.displayName || 'Marketplace User',
            email: data.email || fbUser.email || '',
            mobile: data.mobile || '',
            city: data.city || 'Sargodha',
            area: data.area || '',
            role: isAdmin ? (data.role === 'super_admin' ? 'super_admin' : 'admin') : 'user',
            activationStatus: data.activationStatus || 'pending',
            joinedDate: data.joinedDate || 'Recently',
            isVerified: data.isVerified || false,
            telegramNumber: data.telegramNumber,
            telegramStatus: data.telegramStatus,
            contactPrivacy: data.contactPrivacy,
          } as UserProfile;
        }

        // Auto-bootstrap profile if new auth user
        const isAdmin = ADMIN_EMAILS.includes(fbUser.email?.toLowerCase() || '');
        const newProfile: UserProfile = {
          id: Date.now(),
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Marketplace User',
          email: fbUser.email || '',
          mobile: '',
          city: 'Sargodha',
          area: '',
          role: isAdmin ? 'super_admin' : 'user',
          activationStatus: 'pending',
          joinedDate: 'Just now',
          isVerified: false,
        };

        await setDoc(doc(db, 'users', fbUser.uid), {
          ...newProfile,
          createdAt: new Date().toISOString(),
          serverCreatedAt: serverTimestamp(),
        });

        if (isAdmin) {
          await setDoc(doc(db, 'admins', fbUser.uid), {
            email: fbUser.email,
            role: 'super_admin',
            grantedAt: new Date().toISOString(),
          });
        }

        return newProfile;
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, userPath);
      }
    },

    async signInWithGoogle(): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
      try {
        const res = await signInWithPopup(auth, googleProvider);
        const fbUser = res.user;
        const profile = await firebaseService.auth.getCurrentUserProfile();
        return { success: true, user: profile || undefined };
      } catch (err: any) {
        return { success: false, error: err.message || 'Google Sign-In failed' };
      }
    },

    async login(emailOrMobile: string, password: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
      const email = emailOrMobile.includes('@')
        ? emailOrMobile.trim().toLowerCase()
        : `${emailOrMobile.trim().replace(/[^0-9]/g, '')}@sargodhamart.com`;

      try {
        await signInWithEmailAndPassword(auth, email, password);
        const profile = await firebaseService.auth.getCurrentUserProfile();
        return { success: true, user: profile || undefined };
      } catch (err: any) {
        let msg = 'Failed to login with provided credentials.';
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          msg = 'Invalid email/phone or password. Please try again.';
        }
        return { success: false, error: msg };
      }
    },

    async register(data: {
      name: string;
      email?: string;
      mobile: string;
      password: string;
      city?: string;
      area?: string;
    }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
      const email = (data.email && data.email.includes('@'))
        ? data.email.trim().toLowerCase()
        : `${data.mobile.trim().replace(/[^0-9]/g, '')}@sargodhamart.com`;

      try {
        const cred = await createUserWithEmailAndPassword(auth, email, data.password);
        await updateProfile(cred.user, { displayName: data.name });

        const isAdmin = ADMIN_EMAILS.includes(email);
        const profile: UserProfile = {
          id: Date.now(),
          uid: cred.user.uid,
          name: data.name.trim(),
          email,
          mobile: data.mobile.trim(),
          city: (data.city as any) || 'Sargodha',
          area: data.area?.trim() || '',
          role: isAdmin ? 'super_admin' : 'user',
          activationStatus: 'pending',
          joinedDate: 'Just now',
          isVerified: false,
        };

        const userPath = `users/${cred.user.uid}`;
        try {
          await setDoc(doc(db, 'users', cred.user.uid), {
            ...profile,
            createdAt: new Date().toISOString(),
          });

          if (isAdmin) {
            await setDoc(doc(db, 'admins', cred.user.uid), {
              email,
              role: 'super_admin',
              grantedAt: new Date().toISOString(),
            });
          }
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.WRITE, userPath);
        }

        return { success: true, user: profile };
      } catch (err: any) {
        let msg = err.message || 'Registration failed.';
        if (err.code === 'auth/email-already-in-use') {
          msg = 'This phone number or email is already registered. Please log in.';
        } else if (err.code === 'auth/weak-password') {
          msg = 'Password should be at least 6 characters.';
        }
        return { success: false, error: msg };
      }
    },

    async adminLogin(email: string, password: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
      const cleanEmail = email.trim().toLowerCase();
      try {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
        const profile = await firebaseService.auth.getCurrentUserProfile();
        if (profile?.role === 'admin' || profile?.role === 'super_admin' || ADMIN_EMAILS.includes(cleanEmail)) {
          return { success: true, user: profile || undefined };
        }
        return { success: false, error: 'Access denied: account lacks administrator privileges.' };
      } catch (err: any) {
        return { success: false, error: 'Administrator authentication failed. Verify credentials.' };
      }
    },

    async logout(): Promise<{ success: boolean }> {
      try {
        await signOut(auth);
        return { success: true };
      } catch {
        return { success: false };
      }
    },
  },

  // ========================================================
  // 2. LISTINGS (CLOUD FIRESTORE)
  // ========================================================
  listings: {
    async getListings(filters: { categoryId?: number; city?: string; q?: string } = {}): Promise<Listing[]> {
      const path = 'listings';
      try {
        const qRef = collection(db, path);
        const snap = await getDocs(qRef);
        let results: Listing[] = [];

        snap.forEach((d) => {
          const data = d.data();
          results.push({
            id: typeof data.numericId === 'number' ? data.numericId : (parseInt(d.id, 10) || Date.now()),
            firestoreId: d.id,
            title: data.title || '',
            price: Number(data.price) || 0,
            categoryId: Number(data.categoryId) || 1,
            categoryName: data.categoryName || 'General',
            description: data.description || '',
            images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600'],
            city: data.city || 'Sargodha',
            area: data.area || '',
            condition: data.condition || 'Used',
            createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' }) : 'Recently',
            views: Number(data.views) || 1,
            isFeatured: Boolean(data.isFeatured),
            userId: data.userId || 1,
            sellerName: data.sellerName || 'Marketplace Seller',
            sellerPhone: data.sellerPhone || '',
            sellerVerified: Boolean(data.sellerVerified),
            isCallAllowed: true,
            isChatAllowed: true,
            isWhatsAppAllowed: true,
            contactPreference: 'Both',
            phone: data.sellerPhone || '',
            whatsapp: data.sellerPhone || '',
            exactLocation: data.area || '',
            sellerCity: data.city || 'Sargodha',
            sellerArea: data.area || '',
            status: data.status || 'published',
          } as unknown as Listing);
        });

        if (filters.city && filters.city !== 'All') {
          results = results.filter((l) => l.city.toLowerCase() === filters.city!.toLowerCase());
        }
        if (filters.categoryId) {
          results = results.filter((l) => l.categoryId === filters.categoryId);
        }
        if (filters.q) {
          const lowerQ = filters.q.toLowerCase();
          results = results.filter((l) => l.title.toLowerCase().includes(lowerQ) || l.description.toLowerCase().includes(lowerQ));
        }

        return results;
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, path);
      }
    },

    async createListing(listingData: any): Promise<{ success: boolean; id?: string }> {
      const path = 'listings';
      const currentUser = auth.currentUser;
      try {
        const docRef = await addDoc(collection(db, path), {
          ...listingData,
          userId: currentUser?.uid || 'guest-user',
          views: 1,
          createdAt: new Date().toISOString(),
          serverCreatedAt: serverTimestamp(),
          status: 'published',
        });
        return { success: true, id: docRef.id };
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    },

    async deleteListing(listingId: string | number): Promise<{ success: boolean }> {
      const path = `listings/${listingId}`;
      try {
        await deleteDoc(doc(db, 'listings', String(listingId)));
        return { success: true };
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
    },
  },

  // ========================================================
  // 3. JOBS (CLOUD FIRESTORE)
  // ========================================================
  jobs: {
    async getJobs(): Promise<JobPost[]> {
      const path = 'jobs';
      try {
        const snap = await getDocs(collection(db, path));
        const list: JobPost[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            id: typeof data.numericId === 'number' ? data.numericId : (parseInt(d.id, 10) || Date.now()),
            firestoreId: d.id,
            title: data.title || '',
            postType: data.postType || 'need_job',
            category: data.category || 'General',
            skills: data.skills || '',
            salaryOrPayment: data.salaryOrPayment || '',
            city: data.city || 'Sargodha',
            area: data.area || '',
            description: data.description || '',
            phone: data.phone || '',
            whatsapp: data.whatsapp || '',
            userId: data.userId || 1,
            views: Number(data.views) || 1,
            status: data.status || 'published',
            posterName: data.posterName || 'Employer',
            createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' }) : 'Recently',
          } as unknown as JobPost);
        });
        return list;
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, path);
      }
    },

    async createJob(jobData: any): Promise<{ success: boolean; id?: string }> {
      const path = 'jobs';
      const currentUser = auth.currentUser;
      try {
        const docRef = await addDoc(collection(db, path), {
          ...jobData,
          userId: currentUser?.uid || 'guest-user',
          views: 1,
          createdAt: new Date().toISOString(),
          status: 'published',
        });
        return { success: true, id: docRef.id };
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    },
  },

  // ========================================================
  // 4. SELLER ACTIVATION PAYMENTS (RS. 1,000 LIFETIME)
  // ========================================================
  activation: {
    async submitProof(data: {
      userId?: string | number;
      paymentMethod: string;
      senderNumber: string;
      transactionId: string;
      paymentScreenshot: string;
      whatsappScreenshot: string;
    }): Promise<{ success: boolean; id?: string }> {
      const path = 'activation_payments';
      const currentUser = auth.currentUser;
      const uid = currentUser?.uid || String(data.userId);

      try {
        const docRef = await addDoc(collection(db, path), {
          userId: uid,
          amount: 1000,
          method: data.paymentMethod,
          senderNumber: data.senderNumber,
          transactionId: data.transactionId,
          paymentScreenshot: data.paymentScreenshot,
          whatsappScreenshot: data.whatsappScreenshot,
          status: 'pending',
          createdAt: new Date().toISOString(),
          serverCreatedAt: serverTimestamp(),
        });

        // Set user status to pending
        if (currentUser) {
          await updateDoc(doc(db, 'users', currentUser.uid), {
            activationStatus: 'pending',
          });
        }

        return { success: true, id: docRef.id };
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    },

    async approvePayment(paymentId: string, userId: string): Promise<{ success: boolean }> {
      const path = `activation_payments/${paymentId}`;
      try {
        await updateDoc(doc(db, 'activation_payments', paymentId), {
          status: 'approved',
          approvedAt: new Date().toISOString(),
        });
        await updateDoc(doc(db, 'users', userId), {
          activationStatus: 'active',
          isVerified: true,
        });
        return { success: true };
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, path);
      }
    },
  },

  // ========================================================
  // 5. COLLEGES & ADMISSIONS ADS
  // ========================================================
  colleges: {
    async getColleges(): Promise<CollegeAd[]> {
      const path = 'colleges';
      try {
        const snap = await getDocs(collection(db, path));
        const ads: CollegeAd[] = [];
        snap.forEach((d) => {
          const data = d.data();
          ads.push({
            id: typeof data.numericId === 'number' ? data.numericId : (parseInt(d.id, 10) || Date.now()),
            firestoreId: d.id,
            institute_name: data.institute_name || '',
            institute_type: data.institute_type || 'Private',
            tagline: data.tagline || '',
            location: data.location || '',
            city: data.city || 'Sargodha',
            phone: data.phone || '',
            whatsapp: data.whatsapp || '',
            courses_offered: Array.isArray(data.courses_offered) ? data.courses_offered : [],
            status: data.status || 'APPROVED',
            views: Number(data.views) || 0,
            submitted_at: data.submitted_at || 'Recently',
          } as unknown as CollegeAd);
        });
        return ads;
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, path);
      }
    },

    async createCollegeAd(adData: any): Promise<{ success: boolean; id?: string }> {
      const path = 'colleges';
      try {
        const docRef = await addDoc(collection(db, path), {
          ...adData,
          status: 'APPROVED',
          views: 1,
          submitted_at: new Date().toISOString(),
        });
        return { success: true, id: docRef.id };
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    },
  },

  // ========================================================
  // 6. CLOUD STORAGE (IMAGE UPLOADS)
  // ========================================================
  storage: {
    async uploadImage(file: File, folder: string = 'listings'): Promise<string> {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      await uploadBytes(storageRef, file, { contentType: file.type });
      return await getDownloadURL(storageRef);
    },
  },

  // ========================================================
  // 7. USER NOTIFICATIONS
  // ========================================================
  notifications: {
    async getNotifications(userId?: string): Promise<UserNotification[]> {
      const uid = userId || auth.currentUser?.uid;
      if (!uid) return [];
      const path = 'notifications';
      try {
        const qRef = query(collection(db, path), where('userId', '==', uid));
        const snap = await getDocs(qRef);
        const list: UserNotification[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            id: typeof data.numericId === 'number' ? data.numericId : (parseInt(d.id, 10) || Date.now()),
            userId: uid as any,
            title: data.title || '',
            message: data.message || '',
            isRead: Boolean(data.isRead),
            type: data.type || 'SYSTEM',
            link: data.link || '',
            createdAt: data.createdAt || 'Recently',
          });
        });
        return list;
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, path);
      }
    },
  },
};
