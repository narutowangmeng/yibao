import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, CheckCircle, Eye, FileSearch,
  TrendingUp, Activity, BarChart3, Users, Building2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const stats = [
  { icon: Shield, label: '基金结余', value: '4.2万亿', change: '+12.5%', color: '#0891B2' },
  { icon: AlertTriangle, label: '风险预警', value: '12', change: '-3', color: '#EF4444' },
  { icon: Eye, label: '智能监控', value: '98.5%', change: '+2.1%', color: '#22C55E' },
  { icon: FileSearch, label: '飞行检查', value: '156', change: '+28', color: '#F59E0B' },
];

const riskTrend = [
  { month: '1月', high: 15, medium: 25, low: 40 },
  { month: '2月', high: 12, medium: 22, low: 38 },
  { month: '3月', high: 18, medium: 28, low: 42 },
  { month: '4月', high: 10, medium: 20, low: 35 },
  { month: '5月', high: 8, medium: 18, low: 32 },
  { month: '6月', high: 12, medium: 22, low: 38 },
];

const violationData = [
  { name: '虚假住院', value: 35, color: '#EF4444' },
  { name: '过度医疗', value: 28, color: '#F59E0B' },
  { name: '串换药品', value: 20, color: '#0891B2' },
  { name: '冒名就医', value: 12, color: '#8B5CF6' },
  { name: '其他', value: 5, color: '#22C55E' },
];

const inspectionData = [
  { name: '医疗机构', count: 85, amount: 1250 },
  { name: '零售药店', count: 45, amount: 380 },
  { name: '参保个人', count: 26, amount: 156 },
];

const alerts = [
  { id: 1, level: 'high', title: '某医院住院费用异常增长', desc: '月度住院费用环比增长45%', time: '10分钟前' },
  { id: 2, level: 'medium', title: '某药店刷卡频次异常', desc: '单日刷卡次数超过50次', time: '1小时前' },
  { id: 3, level: 'low', title: '异地就医结算延迟', desc: '部分跨省结算存在延迟', time: '3小时前' },
];

export default function FundSupervisorDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#134E4A]">基金监管风控</h1>
          <p className="text-sm text-gray-500 mt-1">智能监控 · 风险预警 · 违规查处</p>
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

      {/* 风险趋势 + 违规类型 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-[#EF4444]" />
            <h3 className="font-semibold text-[#134E4A]">风险预警趋势</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={riskTrend}>
              <defs>
                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="high" stroke="#EF4444" fillOpacity={1} fill="url(#colorHigh)" name="高风险" />
              <Area type="monotone" dataKey="medium" stroke="#F59E0B" fillOpacity={1} fill="url(#colorMedium)" name="中风险" />
              <Area type="monotone" dataKey="low" stroke="#0891B2" fillOpacity={1} fill="#0891B220" name="低风险" />
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
            <AlertTriangle size={18} className="text-[#F59E0B]" />
            <h3 className="font-semibold text-[#134E4A]">违规类型分布</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={violationData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {violationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {violationData.map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 飞行检查统计 + 实时预警 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileSearch size={18} className="text-[#0891B2]" />
            <h3 className="font-semibold text-[#134E4A]">飞行检查统计</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={inspectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#0891B2" radius={[4, 4, 0, 0]} name="检查次数" />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {inspectionData.map((item) => (
              <div key={item.name} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-800">{item.count}</p>
                <p className="text-xs text-gray-500">{item.name}</p>
                <p className="text-xs text-red-600 mt-1">¥{item.amount}万</p>
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
            <AlertTriangle size={18} className="text-[#EF4444]" />
            <h3 className="font-semibold text-[#134E4A]">实时风险预警</h3>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg ${
                alert.level === 'high' ? 'bg-red-50 border border-red-100' :
                alert.level === 'medium' ? 'bg-yellow-50 border border-yellow-100' :
                'bg-blue-50 border border-blue-100'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  alert.level === 'high' ? 'bg-red-100' :
                  alert.level === 'medium' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  <AlertTriangle size={16} className={
                    alert.level === 'high' ? 'text-red-600' :
                    alert.level === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  } />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{alert.title}</p>
                  <p className="text-sm text-gray-500">{alert.desc}</p>
                </div>
                <span className="text-xs text-gray-400">{alert.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
