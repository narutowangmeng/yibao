import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Pill, Stethoscope, TrendingUp, Activity,
  CheckCircle, Clock, Users, FileText, BarChart3
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const stats = [
  { icon: Building2, label: '定点机构', value: '98.5万', change: '+3.2%', color: '#0891B2' },
  { icon: Pill, label: '医保目录药品', value: '2,956', change: '+156', color: '#22C55E' },
  { icon: Stethoscope, label: '诊疗项目', value: '4,521', change: '+89', color: '#F59E0B' },
  { icon: CheckCircle, label: '机构评级率', value: '95.8%', change: '+2.1%', color: '#8B5CF6' },
];

const institutionTrend = [
  { month: '1月', hospital: 3.2, clinic: 45.8, pharmacy: 38.5 },
  { month: '2月', hospital: 3.3, clinic: 46.2, pharmacy: 39.1 },
  { month: '3月', hospital: 3.4, clinic: 46.8, pharmacy: 39.8 },
  { month: '4月', hospital: 3.5, clinic: 47.2, pharmacy: 40.2 },
  { month: '5月', hospital: 3.6, clinic: 47.8, pharmacy: 40.8 },
  { month: '6月', hospital: 3.8, clinic: 48.5, pharmacy: 41.2 },
];

const priceData = [
  { name: '药品价格降幅', value: 53, color: '#0891B2' },
  { name: '耗材价格降幅', value: 68, color: '#22C55E' },
  { name: '检查费用降幅', value: 25, color: '#F59E0B' },
];

const procurementData = [
  { name: '国家集采', count: 234, amount: 1250 },
  { name: '省级集采', count: 456, amount: 850 },
  { name: '市级集采', count: 312, amount: 420 },
];

const drgData = [
  { name: 'DRG付费', value: 65, color: '#0891B2' },
  { name: 'DIP付费', value: 25, color: '#22C55E' },
  { name: '按项目付费', value: 10, color: '#F59E0B' },
];

export default function MedicalServiceDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#134E4A]">医药服务管理</h1>
          <p className="text-sm text-gray-500 mt-1">机构管理 · 目录管理 · 价格管理 · 支付方式</p>
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

      {/* 机构增长趋势 + 价格降幅 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={18} className="text-[#0891B2]" />
            <h3 className="font-semibold text-[#134E4A]">定点机构增长</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={institutionTrend}>
              <defs>
                <linearGradient id="colorHospital" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891B2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0891B2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorClinic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="hospital" stroke="#0891B2" fillOpacity={1} fill="url(#colorHospital)" name="医院(万)" />
              <Area type="monotone" dataKey="clinic" stroke="#22C55E" fillOpacity={1} fill="url(#colorClinic)" name="诊所(万)" />
              <Area type="monotone" dataKey="pharmacy" stroke="#F59E0B" fillOpacity={1} fill="#F59E0B20" name="药店(万)" />
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
            <Activity size={18} className="text-[#22C55E]" />
            <h3 className="font-semibold text-[#134E4A]">集采价格降幅</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={priceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {priceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {priceData.map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600">{item.name} {item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 招标采购 + 支付方式 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-[#F59E0B]" />
            <h3 className="font-semibold text-[#134E4A]">招标采购统计</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={procurementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#0891B2" radius={[4, 4, 0, 0]} name="品种数" />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {procurementData.map((item) => (
              <div key={item.name} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-800">{item.count}</p>
                <p className="text-xs text-gray-500">{item.name}</p>
                <p className="text-xs text-emerald-600 mt-1">¥{item.amount}亿</p>
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
            <BarChart3 size={18} className="text-[#8B5CF6]" />
            <h3 className="font-semibold text-[#134E4A]">支付方式改革</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={drgData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                {drgData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {drgData.map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600">{item.name} {item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
