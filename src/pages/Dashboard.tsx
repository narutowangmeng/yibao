import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Wallet,
  FileText,
  TrendingUp,
  Activity,
  Building2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const stats = [
  { icon: Users, label: '参保人数', value: '13.6亿', change: '+2.3%', color: '#0891B2' },
  { icon: Wallet, label: '基金收入', value: '2.8万亿', change: '+8.5%', color: '#22C55E' },
  { icon: FileText, label: '报销人次', value: '45.2亿', change: '+5.1%', color: '#F59E0B' },
  { icon: Building2, label: '定点机构', value: '98.5万', change: '+3.2%', color: '#8B5CF6' },
];

const trendData = [
  { month: '1月', income: 1800, expense: 1200 },
  { month: '2月', income: 2200, expense: 1500 },
  { month: '3月', income: 2800, expense: 1900 },
  { month: '4月', income: 2600, expense: 2100 },
  { month: '5月', income: 3200, expense: 2400 },
  { month: '6月', income: 3500, expense: 2800 },
];

const categoryData = [
  { name: '住院费用', value: 45, color: '#0891B2' },
  { name: '门诊费用', value: 30, color: '#22C55E' },
  { name: '药品费用', value: 15, color: '#F59E0B' },
  { name: '其他', value: 10, color: '#8B5CF6' },
];

const regionData = [
  { name: '东部', value: 4200 },
  { name: '中部', value: 3100 },
  { name: '西部', value: 2800 },
  { name: '东北', value: 1900 },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#134E4A]">数据概览</h1>
        <span className="text-sm text-gray-500">数据更新时间: 2024-06-30</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-[#134E4A]">{stat.value}</p>
                <p className="text-xs mt-2 flex items-center gap-1" style={{ color: stat.color }}>
                  <TrendingUp size={12} />
                  {stat.change} 较上月
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-[#0891B2]" />
            <h3 className="font-semibold text-[#134E4A]">收支趋势</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891B2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0891B2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="income" stroke="#0891B2" fillOpacity={1} fill="url(#colorIncome)" name="收入" />
              <Area type="monotone" dataKey="expense" stroke="#22C55E" fillOpacity={1} fill="url(#colorExpense)" name="支出" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={18} className="text-[#22C55E]" />
            <h3 className="font-semibold text-[#134E4A]">费用构成</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={18} className="text-[#8B5CF6]" />
          <h3 className="font-semibold text-[#134E4A]">区域分布</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={regionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="value" fill="#0891B2" radius={[4, 4, 0, 0]} name="参保人数(万)" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
