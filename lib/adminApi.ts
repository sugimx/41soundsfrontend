// Admin API calls
import { ApiResponse } from './api';
import {
  Ticket,
  User,
  Payment,
  SupportTicket,
  SupportResponse,
  DashboardStats,
} from '@/types/admin';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Admin Dashboard API
export const adminApi = {
  // Dashboard Stats
  getDashboardStats: async (token: string): Promise<DashboardStats> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await response.json()) as ApiResponse<DashboardStats>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch dashboard stats');
    }
    return (data.data || {}) as DashboardStats;
  },

  // Tickets Management
  getTickets: async (token: string, page = 1, limit = 10, filters?: { status?: string; tier?: string }): Promise<{ tickets: Ticket[]; total: number }> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.tier && { tier: filters.tier }),
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/tickets?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = (await response.json()) as any;
      console.log('Tickets API Response:', { status: response.status, data });
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch tickets (Status: ${response.status})`);
      }
      
      // Handle response: { success, data: [...], pagination: {...} }
      const tickets = Array.isArray(data.data) ? data.data : [];
      const total = data.pagination?.total || 0;
      
      return { tickets, total };
    } catch (err) {
      console.error('Error fetching tickets:', err);
      throw err;
    }
  },

  getTicketById: async (token: string, id: string): Promise<Ticket> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/tickets/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await response.json()) as ApiResponse<Ticket>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch ticket');
    }
    return (data.data || {}) as Ticket;
  },

  updateTicketStatus: async (token: string, id: string, status: string): Promise<Ticket> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/tickets/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const data = (await response.json()) as ApiResponse<Ticket>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update ticket status');
    }
    return (data.data || {}) as Ticket;
  },

  refundTicket: async (token: string, id: string, reason: string): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/tickets/${id}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    const data = (await response.json()) as ApiResponse<{ success: boolean; message: string }>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to refund ticket');
    }
    return data.data || { success: false, message: 'Unknown error' };
  },

  createTicket: async (token: string, ticketData: {
    userEmail: string;
    userName: string;
    mobileNumber?: string;
    ticketTier: string;
    quantity: number;
  }): Promise<Ticket> => {
    console.log('Creating ticket:', ticketData);
    const response = await fetch(`${API_BASE_URL}/api/admin/tickets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });

    const data = (await response.json()) as ApiResponse<Ticket>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create ticket');
    }
    return (data.data || {}) as Ticket;
  },

  // Users Management
  getUsers: async (token: string, page = 1, limit = 10, search?: string): Promise<{ users: User[]; total: number }> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search && { search }),
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = (await response.json()) as any;
      console.log('Users API Response:', { status: response.status, data });
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch users (Status: ${response.status})`);
      }
      
      // Handle response: { success, data: [...], pagination: {...} }
      const users = Array.isArray(data.data) ? data.data : [];
      const total = data.pagination?.total || 0;
      
      return { users, total };
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err;
    }
  },

  getUserById: async (token: string, id: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await response.json()) as ApiResponse<User>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user');
    }
    return (data.data || {}) as User;
  },

  updateUserStatus: async (token: string, id: string, isActive: boolean): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    });

    const data = (await response.json()) as ApiResponse<User>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user status');
    }
    return (data.data || {}) as User;
  },

  promoteUserToAdmin: async (token: string, id: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}/promote`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await response.json()) as ApiResponse<User>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to promote user to admin');
    }
    return (data.data || {}) as User;
  },

  // Payments Management
  getPayments: async (token: string, page = 1, limit = 10, filters?: { status?: string }): Promise<{ payments: Payment[]; total: number }> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(filters?.status && { status: filters.status }),
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/payments?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = (await response.json()) as any;
      console.log('Payments API Response:', { status: response.status, data });
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch payments (Status: ${response.status})`);
      }
      
      // Handle response: { success, data: [...], pagination: {...} }
      const payments = Array.isArray(data.data) ? data.data : [];
      const total = data.pagination?.total || 0;
      
      return { payments, total };
    } catch (err) {
      console.error('Error fetching payments:', err);
      throw err;
    }
  },

  getPaymentById: async (token: string, id: string): Promise<Payment> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/payments/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await response.json()) as ApiResponse<Payment>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch payment');
    }
    return (data.data || {}) as Payment;
  },

  refundPayment: async (token: string, id: string, reason: string): Promise<{ success: boolean; refundId: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/payments/${id}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    const data = (await response.json()) as ApiResponse<{ success: boolean; refundId: string }>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to process refund');
    }
    return data.data || { success: false, refundId: '' };
  },

  // Support Tickets Management
  getSupportTickets: async (
    token: string,
    page = 1,
    limit = 10,
    filters?: { status?: string; priority?: string }
  ): Promise<{ tickets: SupportTicket[]; total: number }> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.priority && { priority: filters.priority }),
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/support?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await response.json()) as ApiResponse<{ tickets: SupportTicket[]; total: number }>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch support tickets');
    }
    return data.data || { tickets: [], total: 0 };
  },

  getSupportTicketById: async (token: string, id: string): Promise<SupportTicket> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/support/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await response.json()) as ApiResponse<SupportTicket>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch support ticket');
    }
    return (data.data || {}) as SupportTicket;
  },

  respondToTicket: async (token: string, id: string, message: string): Promise<SupportResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/support/${id}/respond`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = (await response.json()) as ApiResponse<SupportResponse>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send response');
    }
    return (data.data || {}) as SupportResponse;
  },

  updateSupportTicketStatus: async (token: string, id: string, status: 'open' | 'in-progress' | 'resolved' | 'closed'): Promise<SupportTicket> => {
    const response = await fetch(`${API_BASE_URL}/api/admin/support/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const data = (await response.json()) as ApiResponse<SupportTicket>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update ticket status');
    }
    return (data.data || {}) as SupportTicket;
  },

  // Analytics
  getAnalytics: async (token: string, dateRange?: { startDate: string; endDate: string }): Promise<any> => {
    const params = new URLSearchParams({
      ...(dateRange?.startDate && { startDate: dateRange.startDate }),
      ...(dateRange?.endDate && { endDate: dateRange.endDate }),
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/analytics?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await response.json()) as ApiResponse<any>;
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch analytics');
    }
    return data.data || {};
  },
};

// Admin verification utility
export const isAdminRole = (role?: string): boolean => {
  return role === 'super_admin' || role === 'admin';
};
