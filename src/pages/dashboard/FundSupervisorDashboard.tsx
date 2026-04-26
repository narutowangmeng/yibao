import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Eye,
  FileSearch,
  Shield,
  TrendingDown
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
  inspectionSummary,
  managementDataUpdatedAt,
  managementOverview,
  realtimeAlerts,
  riskTrend,
  violationTypeData
} from '../../data/managementData';

const stats = [
  { icon: Shield, label: '基金结余', value: managementOverview.fundBalance, change: '全年收支保持正结余', color: '#0891b2' },
  { icon: AlertTriangle, label: '风险预警', value: `${managementOverview.riskAlerts}件`, change: '高风险占比持续下降', color: '#ef4444' },
  { icon: Eye, label: '智能审核覆盖', value: managementOverview.smartReviewCoverage, change: '门诊、住院、药店全场景覆盖', color: '#22c55e' },
  { icon: FileSearch, label: '飞检案件', value: `${managementOverview.inspectionCases}件`, change: '追回违规基金 2.36亿元', color: '#f59e0b' }
];

export default function FundSupervisorDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#134E4A]">基金监管驾驶舱</h1>
          <p className="mt-1 text-sm text-gray-500">展示预警态势、违规类型、飞检处置和实时监测信息。</p>
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
            <Activity className="h-4 w-4 text-red-500" />
            <h3 className="font-semibold text-[#134E4A]">风险预警月度趋势</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={riskTrend}>
              <defs>
                <linearGradient id="fundHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fundMid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.26} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="high" stroke="#ef4444" fill="url(#fundHigh)" name="高风险" />
              <Area type="monotone" dataKey="medium" stroke="#f59e0b" fill="url(#fundMid)" name="中风险" />
              <Area type="monotone" dataKey="low" stroke="#0891b2" fill="#0891b220" name="低风险" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="font-semibold text-[#134E4A]">违规类型分布</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={violationTypeData} cx="50%" cy="50%" innerRadius={62} outerRadius={95} paddingAngle={3} dataKey="value">
                {violationTypeData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value} 件`, '疑点数量']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {violationTypeData.map((item) => (
              <div key={item.name} className="flex items-center gap-1 text-xs text-gray-600">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name} {item.value}件
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FileSearch className="h-4 w-4 text-cyan-600" />
            <h3 className="font-semibold text-[#134E4A]">飞检处置统计</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={inspectionSummary}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value: number) => [`${value} 件`, '案件数量']} />
              <Bar dataKey="count" fill="#0891b2" radius={[6, 6, 0, 0]} name="案件数量" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {inspectionSummary.map((item) => (
              <div key={item.name} className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
                <p className="text-lg font-semibold text-gray-900">{item.count}</p>
                <p className="mt-1 text-xs text-gray-500">{item.name}</p>
                <p className="mt-1 text-xs text-red-600">涉及金额 {item.amount}{item.unit}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-emerald-600" />
            <h3 className="font-semibold text-[#134E4A]">实时风险预警</h3>
          </div>
          <div className="space-y-3">
            {realtimeAlerts.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border px-4 py-3 ${
                  item.level === 'high'
                    ? 'border-red-100 bg-red-50'
                    : item.level === 'medium'
                      ? 'border-amber-100 bg-amber-50'
                      : 'border-blue-100 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{item.desc}</p>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
