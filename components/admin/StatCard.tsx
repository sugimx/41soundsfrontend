'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: 'pink' | 'blue' | 'green' | 'yellow';
}

const colorClasses = {
  pink: 'bg-pink-600/10 text-pink-400 border-pink-600/20',
  blue: 'bg-blue-600/10 text-blue-400 border-blue-600/20',
  green: 'bg-green-600/10 text-green-400 border-green-600/20',
  yellow: 'bg-yellow-600/10 text-yellow-400 border-yellow-600/20',
};

export function StatCard({ title, value, change, icon, color = 'pink' }: StatCardProps) {
  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]} bg-gray-900 border-gray-800`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {change && (
            <p className={`text-xs mt-2 ${change.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}% from last period
            </p>
          )}
        </div>
        {icon && <div className="text-2xl opacity-50">{icon}</div>}
      </div>
    </div>
  );
}
