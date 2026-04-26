import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Wallet, Receipt, Building2 } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  icon: 'users' | 'wallet' | 'receipt' | 'building';
  color: 'cyan' | 'emerald' | 'blue' | 'violet';
}

const iconMap = {
  users: Users,
  wallet: Wallet,
  receipt: Receipt,
  building: Building2,
};

const colorMap = {
  cyan: 'from-cyan-500 to-cyan-600',
  emerald: 'from-emerald-500 to-emerald-600',
  blue: 'from-blue-500 to-blue-600',
  violet: 'from-violet-500 to-violet-600',
};

const bgColorMap = {
  cyan: 'bg-cyan-50',
  emerald: 'bg-emerald-50',
  blue: 'bg-blue-50',
  violet: 'bg-violet-50',
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  trend,
  trendLabel,
  icon,
  color,
}) => {
  const Icon = iconMap[icon];
  const isPositive = trend >= 0;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl ${bgColorMap[color]} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 bg-gradient-to-br ${colorMap[color]} bg-clip-text text-transparent`} style={{ color: color === 'cyan' ? '#0891B2' : color === 'emerald' ? '#22C55E' : color === 'blue' ? '#3B82F6' : '#8B5CF6' }} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{isPositive ? '+' : ''}{trend}%</span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-2">{trendLabel}</p>
      </div>
    </motion.div>
  );
};
