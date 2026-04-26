import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  CheckCircle,
  FileText,
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
  Wallet
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  benefitStructureData,
  insuranceTypeComparison,
  managementDataUpdatedAt,
  managementOverview,
  policyProgressData,
  treatmentFundingTrend
} from '../../data/managementData';

const colors = ['#0891b2', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'];

const stats = [
  { icon: Wallet, label: '筹资总额', value: managementOverview.fundIncome, change: '职工和居民筹资口径统一汇聚', color: '#0891b2' },
  { icon: Users, label: '参保人数', value: managementOverview.insuredPopulation, change: '职工、居民、灵活就业全口径覆盖', color: '#22c55e' },
  { icon: FileText, label: '待遇支出', value: managementOverview.fundExpense, change: `年度结算 ${managementOverview.annualSettlements}`, color: '#f59e0b' },
  { icon: CheckCircle, label: '待遇政策兑现率', value: '98.7%', change: '重点事项按月监测闭环', color: '#8b5cf6' }
];

export default function TreatmentDirectorDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#134E4A]">待遇保障驾驶舱</h1>
          <p className="mt-1 text-sm text-gray-500">展示筹资运行、待遇支出结构、政策进度和险种参保对比。</p>
        </div>
        <span className="text-sm text-gray-500">数据口径：{managementDataUpdatedAt}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-[#134E4A]">{stat.value}</p>
                <p className="mt-2 text-xs" style={{ color: stat.color }}>{stat.change}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${stat.color}16` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-cyan-600" />
            <h3 className="font-semibold text-[#134E4A]">险种筹资趋势</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={treatmentFundingTrend}>
              <defs>
                <linearGradient id="treatEmployee" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="treatResident" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="亿" />
              <Tooltip formatter={(value: number) => [`${value} 亿元`, '']} />
              <Area type="monotone" dataKey="employee" stroke="#0891b2" fill="url(#treatEmployee)" name="职工医保" />
              <Area type="monotone" dataKey="resident" stroke="#22c55e" fill="url(#treatResident)" name="居民医保" />
              <Area type="monotone" dataKey="flexible" stroke="#f59e0b" fill="#f59e0b22" name="灵活就业" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-emerald-600" />
            <h3 className="font-semibold text-[#134E4A]">待遇支出结构</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={benefitStructureData} cx="50%" cy="50%" innerRadius={62} outerRadius={95} paddingAngle={3} dataKey="value">
                {benefitStructureData.map((item, index) => (
                  <Cell key={item.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, '占比']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {benefitStructureData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1 text-xs text-gray-600">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                {item.name} {item.value}%
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-600" />
            <h3 className="font-semibold text-[#134E4A]">重点政策推进进度</h3>
          </div>
          <div className="space-y-4">
            {policyProgressData.map((item) => (
              <div key={item.name} className="rounded-2xl border border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <span className="text-xs text-gray-500">{item.status}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${item.progress}%` }} />
                </div>
                <p className="mt-2 text-right text-xs text-gray-500">{item.progress}%</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-violet-600" />
            <h3 className="font-semibold text-[#134E4A]">险种参保结构对比</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={insuranceTypeComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="万" />
              <Tooltip formatter={(value: number) => [`${value} 万人`, '参保人数']} />
              <Bar dataKey="enrollment" fill="#0891b2" radius={[6, 6, 0, 0]} name="参保人数" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {insuranceTypeComparison.map((item) => (
              <div key={item.name} className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
                <p className="text-lg font-semibold text-gray-900">{item.enrollment}</p>
                <p className="mt-1 text-xs text-gray-500">{item.name}</p>
                <p className="mt-1 text-xs text-cyan-700">筹资 {item.revenue}亿元</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
