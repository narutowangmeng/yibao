import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Building2,
  CheckCircle,
  FileText,
  Pill,
  Stethoscope
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
  institutionGrowthTrend,
  managementDataUpdatedAt,
  paymentMethodData,
  procurementDropData,
  procurementExecutionData
} from '../../data/managementData';

const stats = [
  { icon: Building2, label: '定点机构', value: '24,368家', change: '医院 2,506 家，基层机构 9,093 家', color: '#0891b2' },
  { icon: Pill, label: '医保目录药品', value: '3,128个', change: '含谈判药 486 个、集采品种 428 个', color: '#22c55e' },
  { icon: Stethoscope, label: '诊疗与服务项目', value: '18,420项', change: '重点监测项目 1,286 项', color: '#f59e0b' },
  { icon: CheckCircle, label: '协议履约达标率', value: '96.4%', change: '三级机构履约率连续3季度提升', color: '#8b5cf6' }
];

export default function MedicalServiceDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#134E4A]">医药服务驾驶舱</h1>
          <p className="mt-1 text-sm text-gray-500">围绕机构管理、药耗目录、集采执行和支付方式改革进行监测。</p>
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
            <Building2 className="h-4 w-4 text-cyan-600" />
            <h3 className="font-semibold text-[#134E4A]">定点机构增长趋势</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={institutionGrowthTrend}>
              <defs>
                <linearGradient id="medHospital" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="medClinic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="hospital" stroke="#0891b2" fill="url(#medHospital)" name="医院" />
              <Area type="monotone" dataKey="clinic" stroke="#22c55e" fill="url(#medClinic)" name="基层机构" />
              <Area type="monotone" dataKey="pharmacy" stroke="#f59e0b" fill="#f59e0b22" name="零售药店" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600" />
            <h3 className="font-semibold text-[#134E4A]">重点药耗降价幅度</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={procurementDropData} cx="50%" cy="50%" innerRadius={62} outerRadius={95} paddingAngle={3} dataKey="value">
                {procurementDropData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, '平均降幅']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {procurementDropData.map((item) => (
              <div key={item.name} className="flex items-center gap-1 text-xs text-gray-600">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name} {item.value}%
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-600" />
            <h3 className="font-semibold text-[#134E4A]">集采执行规模</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={procurementExecutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value: number) => [`${value} 个`, '执行品种']} />
              <Bar dataKey="count" fill="#0891b2" radius={[6, 6, 0, 0]} name="执行品种" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {procurementExecutionData.map((item) => (
              <div key={item.name} className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
                <p className="text-lg font-semibold text-gray-900">{item.count}</p>
                <p className="mt-1 text-xs text-gray-500">{item.name}</p>
                <p className="mt-1 text-xs text-emerald-600">年采购额 {item.amount}亿元</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-violet-600" />
            <h3 className="font-semibold text-[#134E4A]">支付方式改革覆盖结构</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={paymentMethodData} cx="50%" cy="50%" innerRadius={62} outerRadius={95} paddingAngle={3} dataKey="value">
                {paymentMethodData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, '覆盖占比']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {paymentMethodData.map((item) => (
              <div key={item.name} className="flex items-center gap-1 text-xs text-gray-600">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name} {item.value}%
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
