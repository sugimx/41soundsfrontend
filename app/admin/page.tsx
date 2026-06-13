'use client';

import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/adminApi';
import { DashboardStats } from '@/types/admin';
import { AccessDenied } from '@/components/admin/AccessDenied';
import { useState, useEffect } from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { Chart } from '@/components/admin/Chart';
import {
  Users,
  Ticket,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user has admin role
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    if (!token || !isAdmin) {
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await adminApi.getDashboardStats(token);
        setStats(data);
        
        // Fetch analytics data for charts (last 7 days)
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        const analyticsData = await adminApi.getAnalytics(token, {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        });
        console.log('Analytics Data:', analyticsData);
        // Prefer explicit revenueTrend data for charts. Fall back to userGrowth only for users (not tickets).
        if (analyticsData?.revenueTrend && analyticsData.revenueTrend.length) {
          setChartData(
            analyticsData.revenueTrend.map((item: any, idx: number) => ({
              name: item._id || `Day ${idx + 1}`,
              revenue: item.revenue ?? item.totalRevenue ?? item.amount ?? 0,
              tickets: item.ticketsSold ?? item.tickets ?? 0,
            }))
          );
        } else if (analyticsData?.userGrowth) {
          // userGrowth contains counts of users — don't treat those as ticket sales.
          setChartData(
            analyticsData.userGrowth.map((item: any, idx: number) => ({
              name: item._id || `Day ${idx + 1}`,
              revenue: item.revenue ?? 0,
              tickets: 0,
            }))
          );
        } else {
          setChartData([]);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token, isAdmin]);

  // Check if user has admin role
  if (!isLoading && !isAdmin) {
    return <AccessDenied />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-600/10 border border-red-600/20 rounded-lg">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
      </motion.div>

      {/* Key Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<Users size={32} />}
          color="blue"
        />
        <StatCard
          title="Tickets Sold"
          value={stats?.totalTicketsSold || 0}
          icon={<Ticket size={32} />}
          color="green"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`}
          icon={<CreditCard size={32} />}
          color="pink"
        />
        <StatCard
          title="Total Refunds"
          value={stats?.paymentStats?.refunded || 0}
          icon={<AlertCircle size={32} />}
          color="yellow"
        />
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Chart
          data={chartData}
          title="Revenue & Sales Trend"
          type="line"
          dataKey="revenue"
          color="#ec4899"
          height={300}
        />
        <Chart
          data={chartData}
          title="Tickets Sold This Week"
          type="bar"
          dataKey="tickets"
          color="#3b82f6"
          height={300}
        />
      </motion.div>

      {/* Tickets by Tier */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Chart
          data={[
            { name: 'Gold', value: stats?.ticketsByTier?.Gold || 0 },
            { name: 'Platinum', value: stats?.ticketsByTier?.Platinum || 0 },
            { name: 'VIP', value: stats?.ticketsByTier?.VIP || 0 },
            { name: 'MVIP', value: stats?.ticketsByTier?.MVIP || 0 },
          ]}
          title="Tickets by Tier"
          type="pie"
          dataKey="value"
        />

        {/* Payment Status Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-6">Payment Status Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Completed</span>
              <span className="text-xl font-bold text-green-400">{stats?.paymentStats?.completed || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Pending</span>
              <span className="text-xl font-bold text-yellow-400">{stats?.paymentStats?.pending || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Failed</span>
              <span className="text-xl font-bold text-red-400">{stats?.paymentStats?.failed || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Refunded</span>
              <span className="text-xl font-bold text-gray-400">{stats?.paymentStats?.refunded || 0}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
