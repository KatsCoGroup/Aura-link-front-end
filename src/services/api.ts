// API Service Layer for Backend Integration
// This module handles all communication with the backend API

const getBaseURL = (): string => {
  // Check for environment variable first
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // Fallback to production URL if no env var is set
  return 'http://localhost:3000';
};

const BASE_URL = getBaseURL();

// Types based on backend API responses
export interface PaymentInfo {
  amount: string;
  currency: string;
  description: string;
  type: string;
  gigId?: string;
  facilitator: {
    name: string;
    endpoint: string;
    chainId: string;
  };
}

export interface PaymentRequiredResponse {
  success: false;
  code: 'PAYMENT_REQUIRED';
  message: string;
  payment: PaymentInfo;
}

export class PaymentRequiredError extends Error {
  status = 402;
  payment: PaymentInfo;

  constructor(payload: PaymentRequiredResponse) {
    super(payload.message);
    this.payment = payload.payment;
  }
}

export interface User {
  _id?: string;
  address: string;
  username?: string;
  displayName: string;
  bio: string;
  profileImage: string;
  skills?: string[];
  skillRequests?: SkillRequest[];
  projects?: UserProject[];
  createdAt?: string;
  lastActive?: string;
  rating?: number;
  ratingCount?: number;
}

export interface SkillRequest {
  _id?: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  source?: "self" | "admin";
  requestedAt?: string;
  reviewedAt?: string;
  reviewerNote?: string;
}

export interface UserProject {
  _id?: string;
  title: string;
  stack?: string;
  skills?: string[];
  status?: "pending" | "approved" | "rejected";
  reviewerNote?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Gig {
  _id?: string;
  blockchainGigId?: number;
  employer: string;
  worker?: string;
  title: string;
  description: string;
  imageUrl?: string;
  paymentAmount: string;
  requiredBadge?: string;
  deadline: number;
  status: 'OPEN' | 'ASSIGNED' | 'SUBMITTED' | 'COMPLETED' | 'CANCELLED';
  featured?: boolean;
  featuredUntil?: string | Date;
  urgent?: boolean;
  txHash?: string;
  createdAt?: string | Date;
  completedAt?: string | Date;
  applications?: Array<{
    workerId?: string;
    coverLetter?: string;
    estimatedTime?: number;
    appliedAt?: string | Date;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface GigsResponse {
  success: boolean;
  gigs: Gig[];
  total: number;
  limit: number;
  skip: number;
}

export interface UserResponse {
  success: boolean;
  user: User;
}

export interface Badge {
  tokenId?: number;
  skillName: string;
  iconURI?: string;
  level?: string;
  issuedAt?: string;
}

export interface BadgeVerification {
  _id?: string;
  userAddress: string;
  skillName: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  txHash?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt?: string;
  reviewedAt?: string;
  adminNotes?: string;
  badgeTokenId?: number;
}

export interface SubscriptionStatus {
  type: 'none' | 'monthly' | 'community_nft';
  expiresAt?: string | null;
  autoRenew?: boolean;
}

export interface CommunityNFT {
  owns: boolean;
  tokenId?: number;
  mintedAt?: string;
}

export interface PricingPlan {
  name: string;
  price: number;
  currency: string;
  duration: string;
  benefits: string[];
}

export interface SubscriptionPricing {
  success: boolean;
  pricing: {
    monthly: PricingPlan;
    community_nft: PricingPlan;
  };
}

export interface SubscriptionResponse {
  success: boolean;
  subscription: SubscriptionStatus;
  communityNFT?: CommunityNFT;
}

export interface StatsOverview {
  success: boolean;
  stats: Record<string, unknown>;
  timestamp?: string;
}

export interface GigStatsResponse {
  success: boolean;
  gigStats: Record<string, unknown>;
}

export interface RevenueStatsResponse {
  success: boolean;
  period: string;
  totalRevenue: number;
  byType: Array<{ _id: string; amount: number; count: number }>;
  timestamp?: string;
}

export interface UserStatsResponse {
  success: boolean;
  userStats: Record<string, unknown>;
}

export interface AdminDashboardResponse {
  success: boolean;
  dashboard: Record<string, unknown>;
}

export interface AdminVerificationResponse {
  success: boolean;
  verification?: BadgeVerification;
  pending?: BadgeVerification[];
  count?: number;
  verifications?: BadgeVerification[];
  total?: number;
  limit?: number;
  skip?: number;
}

// Helper function to handle fetch errors
const handleResponse = async <T>(response: Response): Promise<T> => {
  const body = await response
    .json()
    .catch(() => ({ message: `HTTP ${response.status}: ${response.statusText}` }));

  if (response.status === 402) {
    throw new PaymentRequiredError(body as PaymentRequiredResponse);
  }

  if (!response.ok) {
    throw new Error((body as { message?: string }).message || 'An error occurred');
  }

  return body as T;
};

// User API calls
export const userAPI = {
  // Get user profile by address
  getProfile: async (address: string): Promise<UserResponse> => {
    const response = await fetch(`${BASE_URL}/api/users/${address}`);
    return handleResponse<UserResponse>(response);
  },

  // Create or update user profile
  createOrUpdateProfile: async (data: {
    address: string;
    username?: string;
    displayName: string;
    bio: string;
    profileImage: string;
    skills?: string[];
  }): Promise<UserResponse> => {
    const response = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<UserResponse>(response);
  },

  // Request verification for a skill
  requestSkillVerification: async (data: { address: string; skill: string }): Promise<UserResponse> => {
    const response = await fetch(`${BASE_URL}/api/users/skills/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<UserResponse>(response);
  },

  // Create or update user skills list (existing behavior)
  updateSkills: async (data: { address: string; skills: string[] }): Promise<UserResponse> => {
    const response = await fetch(`${BASE_URL}/api/users/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<UserResponse>(response);
  },

  // Create a project (pending by default)
  createProject: async (data: { address: string; title: string; stack?: string; skills?: string[] }): Promise<UserResponse> => {
    const response = await fetch(`${BASE_URL}/api/users/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<UserResponse>(response);
  },

  // Rate a user (1-5)
  rateUser: async (data: { address: string; score: number }): Promise<UserResponse> => {
    const response = await fetch(`${BASE_URL}/api/users/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<UserResponse>(response);
  },

  // Get user's applied gigs
  getAppliedGigs: async (address: string): Promise<{ success: boolean; appliedGigs: Gig[]; count: number }> => {
    const response = await fetch(`${BASE_URL}/api/users/${address}/applied`);
    return handleResponse(response);
  },

  // Get user's posted gigs
  getPostedGigs: async (address: string): Promise<{ success: boolean; postedGigs: Gig[]; count: number }> => {
    const response = await fetch(`${BASE_URL}/api/users/${address}/gigs`);
    return handleResponse(response);
  },

  // Get user's completed gigs
  getCompletedGigs: async (
    address: string
  ): Promise<{ success: boolean; completedGigs: Gig[]; count: number }> => {
    const response = await fetch(`${BASE_URL}/api/users/${address}/completed`);
    return handleResponse(response);
  },
};

// Gig API calls
export const gigAPI = {
  // Get all gigs with optional filters
  getGigs: async (params?: {
    status?: string;
    requiredBadge?: string;
    featured?: boolean;
    limit?: number;
    skip?: number;
  }): Promise<GigsResponse> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const url = `${BASE_URL}/api/gigs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    return handleResponse<GigsResponse>(response);
  },

  // Get single gig by ID
  getGig: async (gigId: string): Promise<{ success: boolean; gig: Gig }> => {
    const response = await fetch(`${BASE_URL}/api/gigs/${gigId}`);
    return handleResponse(response);
  },

  // Create a new gig
  createGig: async (data: {
    employer: string;
    title: string;
    description: string;
    imageUrl?: string;
    paymentAmount: string | number;
    requiredBadge?: string;
    deadline?: number;
  }): Promise<{ success: boolean; gig: Gig; txHash?: string }> => {
    const response = await fetch(`${BASE_URL}/api/gigs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Update existing gig (employer only)
  updateGig: async (
    gigId: string,
    data: {
      employer: string;
      title?: string;
      description?: string;
      imageUrl?: string;
      paymentAmount?: string | number;
      requiredBadge?: string;
      deadline?: number;
    }
  ): Promise<{ success: boolean; gig: Gig }> => {
    const response = await fetch(`${BASE_URL}/api/gigs/${gigId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Apply to a gig
  applyToGig: async (
    gigId: string,
    data: {
      workerId: string;
      coverLetter: string;
      estimatedTime?: number;
      paymentTxHash?: string;
    }
  ): Promise<{ success: boolean; gig: Gig; message?: string }> => {
    const response = await fetch(`${BASE_URL}/api/gigs/${gigId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Assign worker to a gig
  assignWorker: async (
    gigId: string,
    data: {
      employer: string;
      workerId: string;
    }
  ): Promise<{ success: boolean; gig: Gig; txHash?: string }> => {
    const response = await fetch(`${BASE_URL}/api/gigs/${gigId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Submit work for a gig
  submitWork: async (
    gigId: string,
    data: {
      workerId: string;
    }
  ): Promise<{ success: boolean; gig: Gig; txHash?: string }> => {
    const response = await fetch(`${BASE_URL}/api/gigs/${gigId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Approve and pay for completed gig
  approveGig: async (
    gigId: string,
    data: {
      employer: string;
    }
  ): Promise<{ success: boolean; gig: Gig; txHash?: string }> => {
    const response = await fetch(`${BASE_URL}/api/gigs/${gigId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Cancel a gig
  cancelGig: async (
    gigId: string,
    data: {
      employer: string;
    }
  ): Promise<{ success: boolean; gig: Gig; txHash?: string }> => {
    const response = await fetch(`${BASE_URL}/api/gigs/${gigId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Feature a gig (may require payment)
  featureGig: async (
    gigId: string,
    data: { paymentTxHash?: string }
  ): Promise<{ success: boolean; gig: Gig; featuredUntil?: string | Date; message?: string }> => {
    const response = await fetch(`${BASE_URL}/api/gigs/${gigId}/feature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Mark gig as urgent (may require payment)
  markUrgent: async (
    gigId: string,
    data: { paymentTxHash?: string }
  ): Promise<{ success: boolean; gig: Gig; message?: string }> => {
    const response = await fetch(`${BASE_URL}/api/gigs/${gigId}/urgent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Update gig status (SUBMITTED, COMPLETED, CANCELLED, etc.)
  updateStatus: async (
    gigId: string,
    data: { status: 'OPEN' | 'ASSIGNED' | 'SUBMITTED' | 'COMPLETED' | 'CANCELLED' }
  ): Promise<{ success: boolean; gig: Gig; message?: string }> => {
    const response = await fetch(`${BASE_URL}/api/gigs/${gigId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

// Badge API calls
export const badgeAPI = {
  // Get all supported badge types
  getBadgeTypes: async (): Promise<{ success: boolean; badgeTypes: string[] }> => {
    const response = await fetch(`${BASE_URL}/api/badges/types`);
    return handleResponse(response);
  },

  // Get user's badges
  getUserBadges: async (
    address: string
  ): Promise<{ success: boolean; badges: Badge[] }> => {
    const response = await fetch(`${BASE_URL}/api/badges/${address}`);
    return handleResponse(response);
  },

  // Verify badge ownership
  verifyBadge: async (data: {
    userAddress: string;
    skillName: string;
    portfolioUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    paymentTxHash?: string;
  }): Promise<{ success: boolean; verificationId?: string; status?: string; estimatedTime?: string }> => {
    const response = await fetch(`${BASE_URL}/api/badges/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Get verification status
  getVerificationStatus: async (
    verificationId: string
  ): Promise<{ success: boolean; verification: BadgeVerification }> => {
    const response = await fetch(`${BASE_URL}/api/badges/verification/${verificationId}`);
    return handleResponse(response);
  },

  // Get user's pending verifications
  getPendingVerifications: async (
    address: string
  ): Promise<{ success: boolean; pending: BadgeVerification[]; count: number }> => {
    const response = await fetch(`${BASE_URL}/api/badges/${address}/pending`);
    return handleResponse(response);
  },
};

// Stats API calls
export const statsAPI = {
  // Platform overview
  getPlatformStats: async (): Promise<StatsOverview> => {
    const response = await fetch(`${BASE_URL}/api/stats`);
    return handleResponse(response);
  },

  // Gig-focused stats
  getGigStats: async (): Promise<GigStatsResponse> => {
    const response = await fetch(`${BASE_URL}/api/stats/gigs`);
    return handleResponse(response);
  },

  // Revenue stats
  getRevenueStats: async (days = 30): Promise<RevenueStatsResponse> => {
    const response = await fetch(`${BASE_URL}/api/stats/revenue?days=${days}`);
    return handleResponse(response);
  },

  // User aggregate stats
  getUserStats: async (): Promise<UserStatsResponse> => {
    const response = await fetch(`${BASE_URL}/api/stats/users`);
    return handleResponse(response);
  },
};

// Subscription API calls
export const subscriptionAPI = {
  // Pricing info
  getPricing: async (): Promise<SubscriptionPricing> => {
    const response = await fetch(`${BASE_URL}/api/subscriptions/pricing`);
    return handleResponse(response);
  },

  // User subscription status
  getStatus: async (address: string): Promise<SubscriptionResponse> => {
    const response = await fetch(`${BASE_URL}/api/subscriptions/${address}`);
    return handleResponse(response);
  },

  // Purchase monthly plan (may 402)
  purchaseMonthly: async (
    data: { userAddress: string; paymentTxHash?: string }
  ): Promise<{ success: boolean; message: string; subscription: SubscriptionStatus }> => {
    const response = await fetch(`${BASE_URL}/api/subscriptions/monthly/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Purchase community NFT (may 402)
  purchaseCommunityNFT: async (
    data: { userAddress: string; paymentTxHash?: string }
  ): Promise<{ success: boolean; message: string; nft: CommunityNFT }> => {
    const response = await fetch(`${BASE_URL}/api/subscriptions/community-nft/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

// Admin API calls (requires x-admin-key or whitelisted wallet)
const getAdminHeaders = (adminWallet?: string) => ({
  'Content-Type': 'application/json',
  'x-admin-key': import.meta.env.VITE_ADMIN_KEY || '',
  ...(adminWallet ? { 'x-admin-wallet': adminWallet.toLowerCase() } : {}),
});

export const adminAPI = {
  getPendingVerifications: async (adminWallet?: string): Promise<AdminVerificationResponse> => {
    const response = await fetch(`${BASE_URL}/api/admin/verifications/pending`, {
      headers: getAdminHeaders(adminWallet),
    });
    return handleResponse(response);
  },

  getVerification: async (verificationId: string, adminWallet?: string): Promise<AdminVerificationResponse> => {
    const response = await fetch(`${BASE_URL}/api/admin/verifications/${verificationId}`, {
      headers: getAdminHeaders(adminWallet),
    });
    return handleResponse(response);
  },

  approveVerification: async (
    verificationId: string,
    data: { adminNotes?: string },
    adminWallet?: string
  ): Promise<AdminVerificationResponse> => {
    const response = await fetch(`${BASE_URL}/api/admin/verifications/${verificationId}/approve`, {
      method: 'POST',
      headers: getAdminHeaders(adminWallet),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  rejectVerification: async (
    verificationId: string,
    data: { adminNotes?: string; refundReason?: string },
    adminWallet?: string
  ): Promise<AdminVerificationResponse> => {
    const response = await fetch(`${BASE_URL}/api/admin/verifications/${verificationId}/reject`, {
      method: 'POST',
      headers: getAdminHeaders(adminWallet),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  listVerifications: async (
    params?: {
      status?: string;
      skillName?: string;
      limit?: number;
      skip?: number;
    },
    adminWallet?: string
  ): Promise<AdminVerificationResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) query.append(k, String(v));
      });
    }

    const response = await fetch(
      `${BASE_URL}/api/admin/verifications${query.toString() ? `?${query.toString()}` : ''}`,
      { headers: getAdminHeaders(adminWallet) }
    );
    return handleResponse(response);
  },

  getDashboard: async (adminWallet?: string): Promise<AdminDashboardResponse> => {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: getAdminHeaders(adminWallet),
    });
    return handleResponse(response);
  },
};

// Export the base URL for direct use if needed
export { BASE_URL };
