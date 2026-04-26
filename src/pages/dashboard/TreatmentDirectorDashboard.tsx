import React from 'react';
import { motion } from 'framer-motion';
import {
  HeartPulse, Wallet, Users, FileText, TrendingUp, Activity,
  Calendar, CheckCircle, AlertCircle, PieChart as PieChartIcon
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const stats = [
  { icon: Wallet, label: '筹资总额', value: '2.8万亿', change: '+8.5%', color: '#0891B2' },
  { icon: Users, label: '参保人数', value: '13.6亿', change: '+2.3%', color: '#22C55E' },
  { icon: FileText, label: '待遇支出', value: '1.9万亿', change: '+6.2%', color: '#F59E0B' },
  { icon: CheckCircle, label: '待遇兑现率', value: '98.5%', change: '+0.3%', color: '#8B5CF6' },
];

const fundingTrend = [
  { month: '1月', urbanEmployee: 1200, flexible: 300, urbanRural: 800 },
  { month: '2月', urbanEmployee: 1350, flexible: 320, urbanRural: 850 },
  { month: '3月', urbanEmployee: 1500, flexible: 350, urbanRural: 900 },
  { month: '4月', urbanEmployee: 1450, flexible: 340, urbanRural: 880 },
  { month: '5月', urbanEmployee: 1600, flexible: 380, urbanRural: 950 },
  { month: '6月', urbanEmployee: 1750, flexible: 400, urbanRural: 1000 },
];

const benefitData = [
  { name: '住院报销', value: 45, amount: 8500 },
  { name: '门诊报销', value: 30, amount: 4200 },
  { name: '门诊慢特病', value: 15, amount: 2100 },
  { name: '生育报销', value: 6, amount: 850 },
  { name: '其他', value: 4, amount: 450 },
];

const policyProgress = [
  { name: '门诊共济改革', progress: 85, status: '进行中' },
  { name: '长期护理保险试点', progress: 60, status: '进行中' },
  { name: '异地就医结算', progress: 95, status: '即将完成' },
  { name: 'DRG/DIP支付改革', progress: 45, status: '进行中' },
];

const colors = ['#0891B2', '#22C55E', '#F59E0B', '#8B5CF6', '#EC4899'];

export default function TreatmentDirectorDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#134E4A]">待遇保障分析</h1>
          <p className="text-sm text-gray-500 mt-1">筹资政策 · 待遇标准 · 险种配置</p>
        </div>
        <span className="text-sm text-gray-500">数据更新时间: 2024-06-30</span>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
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
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 筹资趋势 + 待遇支出 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={18} className="text-[#0891B2]" />
            <h3 className="font-semibold text-[#134E4A]">分险种筹资趋势</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={fundingTrend}>
              <defs>
                <linearGradient id="colorUrban" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891B2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0891B2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFlexible" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="urbanEmployee" stroke="#0891B2" fillOpacity={1} fill="url(#colorUrban)" name="城镇职工" />
              <Area type="monotone" dataKey="flexible" stroke="#22C55E" fillOpacity={1} fill="url(#colorFlexible)" name="灵活就业" />
              <Area type="monotone" dataKey="urbanRural" stroke="#F59E0B" fillOpacity={1} fill="#F59E0B20" name="城乡居民" />
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
            <PieChartIcon size={18} className="text-[#22C55E]" />
            <h3 className="font-semibold text-[#134E4A]">待遇支出构成</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={benefitData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {benefitData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {benefitData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 政策进度 + 险种对比 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-[#F59E0B]" />
            <h3 className="font-semibold text-[#134E4A]">政策实施进度</h3>
          </div>
          <div className="space-y-4">
            {policyProgress.map((policy) => (
              <div key={policy.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{policy.name}</span>
                  <span className="text-xs text-gray-500">{policy.status}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all" style={{ width: `${policy.progress}%` }} />
                </div>
                <div className="text-right text-xs text-gray-500">{policy.progress}%</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-[#8B5CF6]" />
            <h3 className="font-semibold text-[#134E4A]">险种参保对比</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { name: '城镇职工', enrollment: 3.2, revenue: 18000 },
              { name: '城乡居民', enrollment: 9.8, revenue: 8500 },
              { name: '灵活就业', enrollment: 0.6, revenue: 3200 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="enrollment" fill="#0891B2" radius={[4, 4, 0, 0]} name="参保人数(亿)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
