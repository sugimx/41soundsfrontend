// API configuration and utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  token?: string;
}

export interface LoginResponse {
  _id: string;
  email: string;
  fullName: string;
  mobile?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface UserProfile {
  id?: string;
  _id?: string;
  email: string;
  name?: string;
  fullName?: string;
  phone?: string;
  mobile?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface PaymentCreateResponse {
  orderId: string;
  paymentLink?: string;
  paymentSessionId?: string;
  payment_session_id?: string;
  status: string;
}

// Auth API calls
export const authApi = {
  register: async (email: string, fullName: string, password: string, mobile: string, gender: string, dateOfBirth: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, fullName, mobile, gender, dateOfBirth }),
    });

    const data = (await response.json()) as ApiResponse<LoginResponse> & { token?: string };
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return {
      token: data.token || '',
      user: data.data || {},
    };
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = (await response.json()) as ApiResponse<LoginResponse> & { token?: string };
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return {
      token: data.token || '',
      user: data.data || {},
    };
  },

  logout: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  },

  getProfile: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await response.json()) as ApiResponse<UserProfile>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }
    return data.data;
  },

  updateProfile: async (token: string, updates: Partial<UserProfile>) => {
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = (await response.json()) as ApiResponse<UserProfile>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    return data.data;
  },

  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = (await response.json()) as ApiResponse<{ token?: string }>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to process forgot password request');
    }
    return data;
  },

  resetPassword: async (resetToken: string, newPassword: string, confirmPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resetToken, newPassword, confirmPassword }),
    });

    const data = (await response.json()) as ApiResponse<{ message: string }>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset password');
    }
    return data;
  },
};

// Payment API calls
export const paymentApi = {
  createOrder: async (
    token: string,
    amount: number,
    description: string,
    metadata: { email: string; phone: string },
    orderDetails?: {
      items: Array<{ name: string; quantity: number; unitPrice: number; totalPrice: number }>;
    }
  ) => {
    const response = await fetch(`${API_BASE_URL}/api/payments/initiate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        description,
        metadata,
        ...(orderDetails && { orderDetails }),
      }),
    });

    const data = (await response.json()) as ApiResponse<PaymentCreateResponse>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to initiate payment');
    }
    return data.data;
  },

  getPaymentDetails: async (token: string, paymentId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch payment details');
    }
    return data.data;
  },

  verifyPayment: async (token: string, paymentId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/payments/${paymentId}/verify`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify payment');
    }
    return data.data;
  },

  getPaymentHistory: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/payments/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch payment history');
    }
    // Backend returns { total, payments } directly
    return data.payments || [];
  },
};

// Token management
export const tokenStorage = {
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  },

  setToken: (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('authToken', token);
  },

  removeToken: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
  },

  isTokenValid: () => {
    const token = tokenStorage.getToken();
    return !!token;
  },
};
