'use client';

import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/adminApi';
import { SupportTicket } from '@/types/admin';
import { useState, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { Search, Send } from 'lucide-react';
import { motion } from 'motion/react';

const TICKET_STATUSES = ['open', 'in-progress', 'resolved', 'closed'];
const TICKET_PRIORITIES = ['low', 'medium', 'high'];

export default function SupportPage() {
  const { token, user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');

  // Modal
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  const filteredTickets = useMemo(() => {
    if (!tickets || !Array.isArray(tickets)) return [];
    return tickets.filter(ticket => {
      const matchesSearch = 
        ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || ticket.status === filterStatus;
      const matchesPriority = !filterPriority || ticket.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchTerm, filterStatus, filterPriority]);

  useEffect(() => {
    if (!token) return;

    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const data = await adminApi.getSupportTickets(token, page, limit, {
          status: filterStatus || undefined,
          priority: filterPriority || undefined,
        });
        setTickets(data?.tickets || []);
        setTotal(data?.total || 0);
      } catch (err) {
        console.error('Failed to fetch support tickets:', err);
        setError('Failed to load support tickets');
        setTickets([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [token, page, limit, filterStatus, filterPriority]);

  const handleSendResponse = async () => {
    if (!selectedTicket || !token || !response.trim()) return;

    try {
      setIsSending(true);
      
      // Send response
      await adminApi.respondToTicket(token, selectedTicket._id, response);

      // Update status if changed
      if (newStatus && newStatus !== selectedTicket.status) {
        await adminApi.updateTicketStatus(token, selectedTicket._id, newStatus as any);
      }

      // Refresh tickets list
      const data = await adminApi.getSupportTickets(token, page, limit);
      setTickets(data.tickets);

      setIsModalOpen(false);
      setResponse('');
      setNewStatus('');
      setSelectedTicket(null);
    } catch (err) {
      console.error('Failed to send response:', err);
      setError('Failed to send response');
    } finally {
      setIsSending(false);
    }
  };

  const handleViewDetails = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setIsModalOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-600/20 text-red-400';
      case 'medium':
        return 'bg-yellow-600/20 text-yellow-400';
      case 'low':
        return 'bg-green-600/20 text-green-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-600/20 text-blue-400';
      case 'in-progress':
        return 'bg-yellow-600/20 text-yellow-400';
      case 'resolved':
        return 'bg-green-600/20 text-green-400';
      case 'closed':
        return 'bg-gray-600/20 text-gray-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">Support Tickets</h1>
        <p className="text-gray-400">Manage customer support requests</p>
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
            placeholder="Search tickets..."
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

        {/* Priority Filter */}
        <select
          value={filterPriority}
          onChange={(e) => {
            setFilterPriority(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-600"
        >
          <option value="">All Priorities</option>
          {TICKET_PRIORITIES.map(priority => (
            <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
          ))}
        </select>

        {/* Reset */}
        <button
          onClick={() => {
            setSearchTerm('');
            setFilterStatus('');
            setFilterPriority('');
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
            { key: 'subject', label: 'Subject' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            {
              key: 'priority',
              label: 'Priority',
              render: (value) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(value)}`}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </span>
              ),
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
          ]}
        />
      </motion.div>

      {/* Details Modal */}
      <Modal
        isOpen={isModalOpen && !!selectedTicket}
        title="Ticket Details"
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
          setResponse('');
          setNewStatus('');
        }}
        size="lg"
      >
        {selectedTicket && (
          <div className="space-y-6">
            {/* Ticket Info */}
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Subject</p>
                <p className="text-white font-medium">{selectedTicket.subject}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Name</p>
                  <p className="text-white font-medium">{selectedTicket.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <p className="text-white font-medium text-sm">{selectedTicket.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Priority</p>
                  <p className={`font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Message</p>
                <p className="text-white bg-gray-800 p-3 rounded text-sm">{selectedTicket.message}</p>
              </div>
            </div>

            {/* Responses */}
            {selectedTicket.responses.length > 0 && (
              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-400 text-sm mb-3 font-medium">Previous Responses</p>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedTicket.responses.map((resp, idx) => (
                    <div key={idx} className="bg-gray-800 p-3 rounded text-sm">
                      <p className="text-gray-400 text-xs mb-1">{resp.adminEmail} - {new Date(resp.createdAt).toLocaleString()}</p>
                      <p className="text-white">{resp.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Response Form */}
            <div className="border-t border-gray-700 pt-4 space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Response</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Type your response..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-600"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-600"
                >
                  {TICKET_STATUSES.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSendResponse}
                disabled={isSending || !response.trim()}
                className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {isSending ? 'Sending...' : 'Send Response'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
