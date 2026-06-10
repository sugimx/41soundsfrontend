'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  onRowClick?: (row: any) => void;
  actions?: {
    label: string | ((row: any) => string);
    onClick: (row: any) => void;
    variant?: 'danger' | 'default' | 'warning' | ((row: any) => 'danger' | 'default' | 'warning');
  }[];
}

export function DataTable({
  columns,
  data,
  isLoading,
  pagination,
  onRowClick,
  actions,
}: TableProps) {
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 1;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${
                    column.width ? `w-${column.width}` : ''
                  }`}
                >
                  {column.label}
                </th>
              ))}
              {actions && <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-4 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-4 text-center text-gray-400">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  className="hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '-')}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {actions.map((action, idx) => {
                          const actionLabel = typeof action.label === 'function' ? action.label(row) : action.label;
                          const actionVariant = typeof action.variant === 'function' ? action.variant(row) : action.variant;
                          return (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                actionVariant === 'danger'
                                  ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                                  : actionVariant === 'warning'
                                    ? 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {actionLabel}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing page {pagination.page} of {totalPages} ({pagination.total} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => pagination.onPageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1}
              className="p-2 rounded bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => pagination.onPageChange(pageNum)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      pageNum === pagination.page
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => pagination.onPageChange(Math.min(totalPages, pagination.page + 1))}
              disabled={pagination.page === totalPages}
              className="p-2 rounded bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
