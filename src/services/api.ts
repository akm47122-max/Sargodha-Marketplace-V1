/**
 * SARGODHAMART - Centralized Firebase + Hybrid API Client
 * Powered by Firebase Authentication, Cloud Firestore, and Cloud Storage
 */

import { UserProfile, City } from '../types';
import { firebaseService } from './firebaseService';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  user?: UserProfile | null;
  [key: string]: any;
}

export const api = {
  auth: {
    async getCurrentUser(): Promise<ApiResponse<{ user: UserProfile | null; authenticated: boolean }>> {
      try {
        const profile = await firebaseService.auth.getCurrentUserProfile();
        if (profile) {
          return {
            success: true,
            authenticated: true,
            user: profile,
          };
        }
        return {
          success: true,
          authenticated: false,
          user: null,
        };
      } catch (err: any) {
        return {
          success: false,
          authenticated: false,
          user: null,
          error: err.message,
        };
      }
    },

    async login(identifier: string, password: string): Promise<ApiResponse<{ user: UserProfile }>> {
      const res = await firebaseService.auth.login(identifier, password);
      return res;
    },

    async signInWithGoogle(): Promise<ApiResponse<{ user: UserProfile }>> {
      const res = await firebaseService.auth.signInWithGoogle();
      return res;
    },

    async register(data: {
      name: string;
      mobile: string;
      email: string;
      password: string;
      city: City;
      area: string;
    }): Promise<ApiResponse<{ user: UserProfile }>> {
      const res = await firebaseService.auth.register(data);
      return res;
    },

    async adminLogin(identifier: string, password: string): Promise<ApiResponse<{ user: UserProfile }>> {
      const res = await firebaseService.auth.adminLogin(identifier, password);
      return res;
    },

    async logout(): Promise<ApiResponse> {
      const res = await firebaseService.auth.logout();
      return res;
    },
  },

  listings: {
    async getListings(params: {
      city?: string;
      category?: string;
      q?: string;
      featured?: boolean;
      user_id?: number;
      page?: number;
      limit?: number;
    } = {}): Promise<ApiResponse<{ listings: any[]; total: number }>> {
      try {
        const listings = await firebaseService.listings.getListings({
          city: params.city,
          q: params.q,
        });
        return {
          success: true,
          listings,
          total: listings.length,
        };
      } catch (err: any) {
        return {
          success: false,
          listings: [],
          total: 0,
          error: err.message,
        };
      }
    },

    async createListing(data: any): Promise<ApiResponse<{ listing_id: string }>> {
      try {
        const res = await firebaseService.listings.createListing(data);
        return {
          success: true,
          listing_id: res.id || '',
        };
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
        };
      }
    },

    async deleteListing(id: number | string): Promise<ApiResponse> {
      try {
        const res = await firebaseService.listings.deleteListing(id);
        return res;
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
        };
      }
    },
  },

  jobs: {
    async getJobs(): Promise<ApiResponse<{ jobs: any[] }>> {
      try {
        const jobs = await firebaseService.jobs.getJobs();
        return {
          success: true,
          jobs,
        };
      } catch (err: any) {
        return {
          success: false,
          jobs: [],
          error: err.message,
        };
      }
    },

    async createJob(data: any): Promise<ApiResponse<{ job_id: string }>> {
      try {
        const res = await firebaseService.jobs.createJob(data);
        return {
          success: true,
          job_id: res.id || '',
        };
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
        };
      }
    },
  },

  activation: {
    async submitProof(data: {
      user_id?: number | string;
      payment_method: string;
      sender_number: string;
      transaction_id: string;
      payment_screenshot?: string;
      whatsapp_screenshot?: string;
    }): Promise<ApiResponse> {
      try {
        const res = await firebaseService.activation.submitProof({
          userId: data.user_id,
          paymentMethod: data.payment_method,
          senderNumber: data.sender_number,
          transactionId: data.transaction_id,
          paymentScreenshot: data.payment_screenshot || '',
          whatsappScreenshot: data.whatsapp_screenshot || '',
        });
        return res;
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
        };
      }
    },

    async approve(paymentId: string, userId: string): Promise<ApiResponse> {
      try {
        const res = await firebaseService.activation.approvePayment(paymentId, userId);
        return res;
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
        };
      }
    },
  },

  colleges: {
    async getColleges(): Promise<ApiResponse> {
      try {
        const ads = await firebaseService.colleges.getColleges();
        return {
          success: true,
          ads,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
        };
      }
    },

    async createCollegeAd(data: any): Promise<ApiResponse> {
      try {
        const res = await firebaseService.colleges.createCollegeAd(data);
        return res;
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
        };
      }
    },
  },

  notifications: {
    async getNotifications(userId?: string): Promise<ApiResponse> {
      try {
        const notifications = await firebaseService.notifications.getNotifications(userId);
        return {
          success: true,
          notifications,
        };
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
        };
      }
    },
  },

  storage: {
    async uploadImage(file: File, folder?: string): Promise<{ success: boolean; url?: string; error?: string }> {
      try {
        const url = await firebaseService.storage.uploadImage(file, folder);
        return { success: true, url };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
  },
};
