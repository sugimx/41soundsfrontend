'use client';

import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/adminApi';
import { Ticket } from '@/types/admin';
import { pricingData } from '@/data/pricing';
import { useState, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { Search, Filter, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

const TICKET_TIERS = ['Rocker', 'Gold', 'Platinum', 'VIP'];
const TICKET_STATUSES = ['pending', 'completed', 'refunded', 'cancelled'];

// Map pricing data to tier prices
const TIER_PRICES: Record<string, number> = {
  Rocker: 500,
  Gold: 800,
  Platinum: 1200,
  VIP: 2000,
};

export default function TicketsPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterTier, setFilterTier] = useState<string>('');

  // Modal - Details/Refund
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);

  // Modal - Add Ticket
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    userEmail: '',
    userName: '',
    mobileNumber: '',
  });
  const [cart, setCart] = useState<Array<{
    id: string;
    tier: string;
    quantity: number;
  }>>([]);
  const [currentTier, setCurrentTier] = useState('Rocker');
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredTickets = useMemo(() => {
    if (!tickets || !Array.isArray(tickets)) {
      return [];
    }
    return tickets.filter(ticket => {
      const matchesSearch = 
        (ticket.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (ticket.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      const matchesStatus = !filterStatus || ticket.status === filterStatus;
      const matchesTier = !filterTier || ticket.ticketTier === filterTier;
      
      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [tickets, searchTerm, filterStatus, filterTier]);

  useEffect(() => {
    if (!token) return;

    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const data = await adminApi.getTickets(token, page, limit, {
          status: filterStatus || undefined,
          tier: filterTier || undefined,
        });
        setTickets(data?.tickets || []);
        setTotal(data?.total || 0);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
        setError('Failed to load tickets');
        setTickets([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [token, page, limit, filterStatus, filterTier]);

  const handleRefund = async () => {
    if (!selectedTicket || !token) return;

    try {
      setIsRefunding(true);
      await adminApi.refundTicket(token, selectedTicket._id, refundReason);
      
      // Refresh tickets list
      const data = await adminApi.getTickets(token, page, limit);
      setTickets(data.tickets);
      
      setIsModalOpen(false);
      setRefundReason('');
      setSelectedTicket(null);
    } catch (err) {
      console.error('Failed to refund ticket:', err);
      setError('Failed to process refund');
    } finally {
      setIsRefunding(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // Validation
    if (!formData.userEmail || !formData.userName || !formData.mobileNumber) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (cart.length === 0) {
      setFormError('Please add at least one ticket tier');
      return;
    }

    // Validate mobile number format (basic validation for 10 digits)
    if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setIsCreating(true);
      setFormError(null);
      
      // Create tickets for each item in cart
      for (const item of cart) {
        await adminApi.createTicket(token, {
          userEmail: formData.userEmail,
          userName: formData.userName,
          mobileNumber: formData.mobileNumber,
          ticketTier: item.tier,
          quantity: item.quantity,
        });
      }
      
      // Refresh tickets list
      const data = await adminApi.getTickets(token, 1, limit);
      setTickets(data.tickets);
      setTotal(data.total);
      setPage(1);
      
      // Reset form and close modal
      setIsAddModalOpen(false);
      setFormData({
        userEmail: '',
        userName: '',
        mobileNumber: '',
      });
      setCart([]);
      setCurrentTier('Rocker');
      setCurrentQuantity(1);
    } catch (err) {
      console.error('Failed to create ticket:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to create ticket');
    } finally {
      setIsCreating(false);
    }
  };

  const addToCart = () => {
    if (currentQuantity <= 0) {
      setFormError('Quantity must be greater than 0');
      return;
    }

    setCart(prevCart => {
      // Check if tier already exists in cart
      const existingItem = prevCart.find(item => item.tier === currentTier);
      
      if (existingItem) {
        // Merge with existing item - update quantity
        return prevCart.map(item =>
          item.tier === currentTier
            ? { ...item, quantity: item.quantity + currentQuantity }
            : item
        );
      } else {
        // Add new item
        return [...prevCart, {
          id: Math.random().toString(36).substr(2, 9),
          tier: currentTier,
          quantity: currentQuantity,
        }];
      }
    });

    setCurrentTier('Rocker');
    setCurrentQuantity(1);
    setFormError(null);
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      return total + (item.quantity * TIER_PRICES[item.tier]);
    }, 0);
  };

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600/20 text-green-400';
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400';
      case 'refunded':
        return 'bg-gray-600/20 text-gray-400';
      case 'cancelled':
        return 'bg-red-600/20 text-red-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Tickets Management</h1>
            <p className="text-gray-400">View and manage all ticket sales</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
          >
            <Plus size={20} />
            Add Ticket
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-600"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-600"
        >
          <option value="">All Statuses</option>
          {TICKET_STATUSES.map(status => (
            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
          ))}
        </select>

        {/* Tier Filter */}
        <select
          value={filterTier}
          onChange={(e) => {
            setFilterTier(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-600"
        >
          <option value="">All Tiers</option>
          {TICKET_TIERS.map(tier => (
            <option key={tier} value={tier}>{tier}</option>
          ))}
        </select>

        {/* Reset */}
        <button
          onClick={() => {
            setSearchTerm('');
            setFilterStatus('');
            setFilterTier('');
            setPage(1);
          }}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-700 transition-colors"
        >
          Reset Filters
        </button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DataTable
          columns={[
            { key: 'userEmail', label: 'Email' },
            { key: 'userName', label: 'Customer Name' },
            { key: 'ticketTier', label: 'Tier' },
            { key: 'quantity', label: 'Qty' },
            {
              key: 'totalPrice',
              label: 'Price',
              render: (value) => `₹${value?.toLocaleString() || 0}`,
            },
            {
              key: 'status',
              label: 'Status',
              render: (value) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(value)}`}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              ),
            },
            {
              key: 'createdAt',
              label: 'Date',
              render: (value) => new Date(value).toLocaleDateString(),
            },
          ]}
          data={filteredTickets}
          isLoading={isLoading}
          pagination={{
            page,
            limit,
            total,
            onPageChange: setPage,
          }}
          onRowClick={handleViewDetails}
          actions={[
            {
              label: 'View',
              onClick: (row) => handleViewDetails(row),
            },
            {
              label: 'Refund',
              onClick: (row) => {
                setSelectedTicket(row);
                setIsModalOpen(true);
              },
              variant: 'danger',
            },
          ]}
        />
      </motion.div>

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen && !!selectedTicket && !refundReason}
        title="Ticket Details"
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
          setRefundReason('');
        }}
        size="md"
      >
        {selectedTicket && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Customer</p>
                <p className="text-white font-medium">{selectedTicket.userName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white font-medium">{selectedTicket.userEmail}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Tier</p>
                <p className="text-white font-medium">{selectedTicket.ticketTier}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Quantity</p>
                <p className="text-white font-medium">{selectedTicket.quantity}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Unit Price</p>
                <p className="text-white font-medium">₹{selectedTicket.unitPrice?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-white font-medium">₹{selectedTicket.totalPrice?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className={`text-white font-medium ${getStatusColor(selectedTicket.status)}`}>
                  {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Date</p>
                <p className="text-white font-medium">
                  {new Date(selectedTicket.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {selectedTicket.status !== 'refunded' && (
              <button
                onClick={() => setRefundReason('show-form')}
                className="w-full mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Process Refund
              </button>
            )}
          </div>
        )}
      </Modal>

      {/* Refund Modal */}
      <Modal
        isOpen={isModalOpen && !!selectedTicket && refundReason === 'show-form'}
        title="Process Refund"
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
          setRefundReason('');
        }}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Refund Reason</label>
            <textarea
              value={refundReason === 'show-form' ? '' : refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Enter reason for refund..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-600"
              rows={4}
            />
          </div>

          <button
            onClick={handleRefund}
            disabled={isRefunding || refundReason === 'show-form'}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
          >
            {isRefunding ? 'Processing...' : 'Confirm Refund'}
          </button>
        </div>
      </Modal>

      {/* Add Ticket Modal */}
      <Modal
        isOpen={isAddModalOpen}
        title="Add New Ticket(s)"
        onClose={() => {
          setIsAddModalOpen(false);
          setFormError(null);
          setFormData({
            userEmail: '',
            userName: '',
            mobileNumber: '',
          });
          setCart([]);
          setCurrentTier('Rocker');
          setCurrentQuantity(1);
        }}
        size="lg"
      >
        <form onSubmit={handleCreateTicket} className="space-y-6">
          {formError && (
            <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-lg text-red-400 text-sm">
              {formError}
            </div>
          )}

          {/* Customer Information */}
          <div className="space-y-4 pb-6 border-b border-gray-700">
            <h3 className="text-white font-semibold">Customer Information</h3>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email *</label>
              <input
                type="email"
                value={formData.userEmail}
                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                placeholder="customer@example.com"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-600"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Customer Name *</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-600"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Mobile Number *</label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                placeholder="9876543210"
                maxLength={10}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-600"
                required
              />
            </div>
          </div>

          {/* Add Tickets Section */}
          <div className="space-y-4 pb-6 border-b border-gray-700">
            <h3 className="text-white font-semibold">Add Tickets</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Ticket Tier *</label>
                <select
                  value={currentTier}
                  onChange={(e) => setCurrentTier(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-600"
                >
                  {TICKET_TIERS.map(tier => (
                    <option key={tier} value={tier}>
                      {tier} - ₹{TIER_PRICES[tier]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  value={currentQuantity}
                  onChange={(e) => setCurrentQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-600"
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addToCart}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Cart Items ({cart.length})</h3>
            
            {cart.length === 0 ? (
              <p className="text-gray-400 text-sm py-4 text-center">No items added yet</p>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {item.tier} × {item.quantity}
                      </p>
                      <p className="text-gray-400 text-sm">
                        ₹{(TIER_PRICES[item.tier] * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="px-3 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Total Items:</span>
                  <span className="text-white font-semibold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total Price:</span>
                  <span className="text-pink-400 font-bold text-lg">
                    ₹{getTotalPrice().toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isCreating || cart.length === 0}
            className="w-full px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 transition-colors font-medium"
          >
            {isCreating ? 'Creating Tickets...' : `Create ${cart.length} Ticket(s)`}
          </button>
        </form>
      </Modal>
    </div>
  );
}
