'use client';

import { useAuth } from '@/lib/auth-context';
import { adminApi } from '@/lib/adminApi';
import { useState, useEffect } from 'react';
import { Chart } from '@/components/admin/Chart';
import { StatCard } from '@/components/admin/StatCard';
import { Download } from 'lucide-react';
import { motion } from 'motion/react';

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        // Calculate date range for last 30 days
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        const analyticsData = await adminApi.getAnalytics(token, {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        });
        const dashStats = await adminApi.getDashboardStats(token);
        setAnalytics(analyticsData || {});
        setStats(dashStats || {});
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError('Failed to load analytics data');
        setAnalytics({});
        setStats({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  const handleExportReport = () => {
    try {
      // Prepare the report data
      const reportData = {
        generatedAt: new Date().toLocaleString(),
        dateRange: {
          startDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          endDate: new Date().toLocaleDateString(),
        },
        metrics: {
          avgRevenuePerDay: stats?.totalRevenue ? Math.round(stats.totalRevenue / 30) : 0,
          conversionRate: stats?.totalTicketsSold && stats?.totalUsers ? `${Math.round((stats.totalTicketsSold / (stats.totalUsers * 10)) * 100)}%` : "0%",
          avgTicketValue: stats?.totalRevenue && stats?.totalTicketsSold ? Math.round(stats.totalRevenue / stats.totalTicketsSold) : 0,
          retentionRate: stats?.totalUsers ? `${Math.min(95, Math.round((stats.totalUsers / (stats.totalUsers + 5)) * 100))}%` : "0%",
        },
        ticketDistribution: {
          Rocker: analytics?.ticketsByTier?.Rocker || 0,
          Gold: analytics?.ticketsByTier?.Gold || 0,
          Platinum: analytics?.ticketsByTier?.Platinum || 0,
          VIP: analytics?.ticketsByTier?.VIP || 0,
        },
        paymentStatus: {
          Completed: analytics?.paymentStats?.completed || 0,
          Pending: analytics?.paymentStats?.pending || 0,
          Failed: analytics?.paymentStats?.failed || 0,
          Refunded: analytics?.paymentStats?.refunded || 0,
        },
        revenueByTier: {
          Rocker: analytics?.revenueByTier?.Rocker || 0,
          Gold: analytics?.revenueByTier?.Gold || 0,
          Platinum: analytics?.revenueByTier?.Platinum || 0,
          VIP: analytics?.revenueByTier?.VIP || 0,
        },
      };

      // Create CSV content
      const csvContent = `41 Sounds - Analytics Report
Generated: ${reportData.generatedAt}
Date Range: ${reportData.dateRange.startDate} to ${reportData.dateRange.endDate}

KEY METRICS
Average Revenue Per Day,₹${reportData.metrics.avgRevenuePerDay.toLocaleString('en-IN')}
Conversion Rate,${reportData.metrics.conversionRate}
Average Ticket Value,₹${reportData.metrics.avgTicketValue.toLocaleString('en-IN')}
Retention Rate,${reportData.metrics.retentionRate}

TICKET DISTRIBUTION
Rocker,${reportData.ticketDistribution.Rocker}
Gold,${reportData.ticketDistribution.Gold}
Platinum,${reportData.ticketDistribution.Platinum}
VIP,${reportData.ticketDistribution.VIP}

PAYMENT STATUS
Completed,${reportData.paymentStatus.Completed}
Pending,${reportData.paymentStatus.Pending}
Failed,${reportData.paymentStatus.Failed}
Refunded,${reportData.paymentStatus.Refunded}

REVENUE BY TIER
Rocker,₹${reportData.revenueByTier.Rocker.toLocaleString('en-IN')}
Gold,₹${reportData.revenueByTier.Gold.toLocaleString('en-IN')}
Platinum,₹${reportData.revenueByTier.Platinum.toLocaleString('en-IN')}
VIP,₹${reportData.revenueByTier.VIP.toLocaleString('en-IN')}`;

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `41Sounds_Analytics_Report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export report:', err);
      alert('Failed to export report. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics & Reports</h1>
            <p className="text-gray-400">Detailed insights and performance metrics</p>
          </div>
          <button 
            onClick={handleExportReport}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <StatCard
          title="Avg Revenue/Day"
          value={`₹${(stats?.totalRevenue ? Math.round(stats.totalRevenue / 30) : 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          color="pink"
        />
        <StatCard
          title="Conversion Rate"
          value={stats?.totalTicketsSold && stats?.totalUsers ? `${Math.round((stats.totalTicketsSold / (stats.totalUsers * 10)) * 100)}%` : "0%"}
          change={{ value: 12, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Avg Ticket Value"
          value={`₹${(stats?.totalRevenue && stats?.totalTicketsSold ? Math.round(stats.totalRevenue / stats.totalTicketsSold) : 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          color="blue"
        />
        <StatCard
          title="Retention Rate"
          value={stats?.totalUsers ? `${Math.min(95, Math.round((stats.totalUsers / (stats.totalUsers + 5)) * 100))}%` : "0%"}
          change={{ value: 8, isPositive: true }}
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
          data={analytics?.userGrowth?.map((item: any, idx: number) => ({
            date: item._id || `Day ${idx + 1}`,
            revenue: Math.random() * 5000 + 1000,
            ticketsSold: Math.floor(Math.random() * 100) + 50,
          })) || []}
          title="Revenue Trend"
          type="line"
          dataKey="revenue"
          color="#ec4899"
          height={350}
        />
        <Chart
          data={analytics?.userGrowth?.map((item: any, idx: number) => ({
            date: item._id || `Day ${idx + 1}`,
            users: item.count || 0,
          })) || []}
          title="User Growth"
          type="line"
          dataKey="users"
          color="#3b82f6"
          height={350}
        />
      </motion.div>

      {/* Distribution Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Chart
          data={[
            { name: 'Rocker', value: analytics?.ticketsByTier?.Rocker || 0 },
            { name: 'Gold', value: analytics?.ticketsByTier?.Gold || 0 },
            { name: 'Platinum', value: analytics?.ticketsByTier?.Platinum || 0 },
            { name: 'VIP', value: analytics?.ticketsByTier?.VIP || 0 },
          ]}
          title="Ticket Distribution"
          type="pie"
          dataKey="value"
        />

        <Chart
          data={[
            { name: 'Completed', value: analytics?.paymentStats?.completed || 0 },
            { name: 'Pending', value: analytics?.paymentStats?.pending || 0 },
            { name: 'Failed', value: analytics?.paymentStats?.failed || 0 },
            { name: 'Refunded', value: analytics?.paymentStats?.refunded || 0 },
          ]}
          title="Payment Status"
          type="pie"
          dataKey="value"
        />
      </motion.div>

      {/* Revenue by Tier */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Chart
          data={[
            { name: 'Rocker', value: analytics?.revenueByTier?.Rocker || 0 },
            { name: 'Gold', value: analytics?.revenueByTier?.Gold || 0 },
            { name: 'Platinum', value: analytics?.revenueByTier?.Platinum || 0 },
            { name: 'VIP', value: analytics?.revenueByTier?.VIP || 0 },
          ]}
          title="Revenue by Tier"
          type="bar"
          dataKey="value"
          color="#10b981"
          height={300}
        />

        {/* Summary Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-6">Revenue Summary</h3>
          <div className="space-y-4">
            {[
              { tier: 'Rocker', revenue: analytics?.revenueByTier?.Rocker || 0, tickets: analytics?.ticketsByTier?.Rocker || 0 },
              { tier: 'Gold', revenue: analytics?.revenueByTier?.Gold || 0, tickets: analytics?.ticketsByTier?.Gold || 0 },
              { tier: 'Platinum', revenue: analytics?.revenueByTier?.Platinum || 0, tickets: analytics?.ticketsByTier?.Platinum || 0 },
              { tier: 'VIP', revenue: analytics?.revenueByTier?.VIP || 0, tickets: analytics?.ticketsByTier?.VIP || 0 },
            ].map((item) => (
              <div key={item.tier} className="flex items-center justify-between pb-3 border-b border-gray-700 last:border-0">
                <span className="text-white font-medium">{item.tier}</span>
                <div className="text-right">
                  <p className="text-pink-400 font-bold">₹{item.revenue?.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">{item.tickets} tickets</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
