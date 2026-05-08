'use client';

import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/adminApi';
import { Payment } from '@/types/admin';
import { useState, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { Search, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

const PAYMENT_STATUSES = ['completed', 'pending', 'failed', 'refunded'];

export default function PaymentsPage() {
  const { token } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // Modal
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);

  const filteredPayments = useMemo(() => {
    if (!payments || !Array.isArray(payments)) {
      return [];
    }
    return payments.filter(payment => {
      const matchesSearch = 
        (payment.userEmail && payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (payment.orderId && payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = !filterStatus || payment.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, filterStatus]);

  useEffect(() => {
    if (!token) return;

    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const data = await adminApi.getPayments(token, page, limit, {
          status: filterStatus || undefined,
        });
        setPayments(data?.payments || []);
        setTotal(data?.total || 0);
      } catch (err) {
        console.error('Failed to fetch payments:', err);
        setError('Failed to load payments');
        setPayments([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [token, page, limit, filterStatus]);

  const handleRefund = async () => {
    if (!selectedPayment || !token) return;

    try {
      setIsRefunding(true);
      await adminApi.refundPayment(token, selectedPayment._id, refundReason);
      
      // Refresh payments list
      const data = await adminApi.getPayments(token, page, limit);
      setPayments(data.payments);
      
      setIsModalOpen(false);
      setRefundReason('');
      setSelectedPayment(null);
    } catch (err) {
      console.error('Failed to refund payment:', err);
      setError('Failed to process refund');
    } finally {
      setIsRefunding(false);
    }
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600/20 text-green-400';
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400';
      case 'failed':
        return 'bg-red-600/20 text-red-400';
      case 'refunded':
        return 'bg-gray-600/20 text-gray-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">Payments Management</h1>
        <p className="text-gray-400">View and manage payment transactions</p>
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
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by email or order ID..."
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
          {PAYMENT_STATUSES.map(status => (
            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
          ))}
        </select>

        {/* Reset */}
        <button
          onClick={() => {
            setSearchTerm('');
            setFilterStatus('');
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
            { key: 'orderId', label: 'Order ID' },
            { key: 'userEmail', label: 'Customer Email' },
            {
              key: 'amount',
              label: 'Amount',
              render: (value) => `₹${value?.toLocaleString() || 0}`,
            },
            { key: 'paymentMethod', label: 'Method' },
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
          data={filteredPayments}
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
                setSelectedPayment(row);
                setIsModalOpen(true);
              },
              variant: 'danger',
            },
          ]}
        />
      </motion.div>

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen && !!selectedPayment && !refundReason}
        title="Payment Details"
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayment(null);
          setRefundReason('');
        }}
        size="md"
      >
        {selectedPayment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Order ID</p>
                <p className="text-white font-medium">{selectedPayment.orderId}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Customer Email</p>
                <p className="text-white font-medium text-sm">{selectedPayment.userEmail}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Amount</p>
                <p className="text-white font-medium">₹{selectedPayment.amount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Method</p>
                <p className="text-white font-medium">{selectedPayment.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className={`text-white font-medium ${getStatusColor(selectedPayment.status)}`}>
                  {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Date</p>
                <p className="text-white font-medium">
                  {new Date(selectedPayment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {selectedPayment.status === 'completed' && (
              <button
                onClick={() => setRefundReason('show-form')}
                className="w-full mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <DollarSign size={18} />
                Process Refund
              </button>
            )}
          </div>
        )}
      </Modal>

      {/* Refund Modal */}
      <Modal
        isOpen={isModalOpen && !!selectedPayment && refundReason === 'show-form'}
        title="Process Refund"
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayment(null);
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
    </div>
  );
}
