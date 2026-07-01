'use client';

import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/adminApi';
import { Ticket } from '@/types/admin';
import { useState, useEffect, useMemo } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/admin/Modal';
import { Search, Send } from 'lucide-react';
import { motion } from 'motion/react';
import toast from "react-hot-toast";


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

    // Modal - Details/Refund
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredTickets = useMemo(() => {
        if (!tickets || !Array.isArray(tickets)) {
            return [];
        }
        return tickets.filter(ticket =>
            (ticket.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (ticket.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
        );
    }, [tickets, searchTerm]);

    useEffect(() => {
        if (!token) return;

        const fetchTickets = async () => {
            try {
                setIsLoading(true);
                const data = await adminApi.getTickets(token, page, limit);
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
    }, [token, page, limit]);

    const handleViewDetails = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const sendEmail = async (ticket: Ticket) => {
        try {
            toast.loading("Sending email...", { id: ticket._id });

            await adminApi.sendEmail(token!, ticket._id);

            toast.success("Email sent successfully!", {
                id: ticket._id,
            });
        } catch {
            toast.error("Failed to send email", {
                id: ticket._id,
            });
        }
    };

    const sendWhatsApp = async (ticket: Ticket) => {
        try {
            toast.loading("Sending WhatsApp...", { id: ticket._id });

            await adminApi.sendWhatsApp(token!, ticket._id);

            toast.success("WhatsApp sent successfully!", {
                id: ticket._id,
            });
        } catch {
            toast.error("Failed to send WhatsApp", {
                id: ticket._id,
            });
        }
    };

    const sendBoth = async (ticket: Ticket) => {
        try {
            toast.loading("Sending email & WhatsApp...", { id: ticket._id });

            await adminApi.sendBoth(token!, ticket._id);

            toast.success("Email & WhatsApp sent successfully!", {
                id: ticket._id,
            });
        } catch {
            toast.error("Failed to send messages", {
                id: ticket._id,
            });
        }
    };

    const sendBulkTickets = async () => {
    const toastId = toast.loading("Delivering all tickets...");

    try {
        await adminApi.sendBulk(token!);

        toast.success("All tickets delivered successfully!", {
            id: toastId,
        });

    } catch (err: any) {
        toast.error(
            err?.response?.data?.message || "Failed to deliver tickets",
            {
                id: toastId,
            }
        );
    }
};

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Tickets Delivery</h1>
                        <p className="text-gray-400">Manage your ticket deliveries</p>
                    </div>
                    <button
                        onClick={() => {
                            const confirmed = window.confirm(
                                "Are you sure you want to send tickets to all users?"
                            );

                            if (confirmed) {
                                sendBulkTickets();
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
                    >
                        <Send size={20} />
                        Deliver Tickets
                    </button>
                </div>
            </motion.div>

            {error && (
                <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-lg text-red-400">
                    {error}
                </div>
            )}

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative"
            >
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-600"
                />
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
                        { key: 'userMobile', label: 'Mobile' },
                        {
                            key: 'emailSent',
                            label: 'Email',
                            render: value => value ? 'Sent' : 'Pending'
                        },
                        {
                            key: 'whatsappSent',
                            label: 'WhatsApp',
                            render: value => value ? 'Sent' : 'Pending'
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
                            label: 'Email',
                            onClick: row => sendEmail(row),
                        },
                        {
                            label: 'WhatsApp',
                            onClick: row => sendWhatsApp(row),
                        },
                        {
                            label: 'Both',
                            onClick: row => sendBoth(row),
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
                                <p className="text-gray-400 text-sm">Date</p>
                                <p className="text-white font-medium">
                                    {new Date(selectedTicket.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    );
}
