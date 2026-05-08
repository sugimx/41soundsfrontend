// Admin related types

export interface AdminUser {
  _id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Ticket {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  mobileNumber?: string;
  ticketTier: 'Rocker' | 'Gold' | 'Platinum' | 'VIP';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'completed' | 'refunded' | 'cancelled';
  paymentId: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  mobile?: string;
  gender?: string;
  dateOfBirth?: string;
  isActive: boolean;
  role?: 'user' | 'admin' | 'super_admin';
  totalTicketsPurchased: number;
  totalAmountSpent: number;
  createdAt: string;
  lastPurchaseDate?: string;
}

export interface Payment {
  _id: string;
  userId: string;
  userEmail: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  description: string;
  orderId: string;
  paymentSessionId?: string;
  refundId?: string;
  refundAmount?: number;
  refundReason?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
  responses: SupportResponse[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface SupportResponse {
  _id?: string;
  adminId: string;
  adminEmail: string;
  message: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalTicketsSold: number;
  totalRevenue: number;
  pendingPayments: number;
  totalRefunds: number;
  openSupportTickets: number;
  ticketsByTier: {
    Rocker: number;
    Gold: number;
    Platinum: number;
    VIP: number;
  };
  revenueByTier: {
    Rocker: number;
    Gold: number;
    Platinum: number;
    VIP: number;
  };
  paymentStats: {
    completed: number;
    pending: number;
    failed: number;
    refunded: number;
  };
}

export interface ChartData {
  date: string;
  revenue: number;
  ticketsSold: number;
}
