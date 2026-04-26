import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Building2,
  FileSignature,
  FileText,
  MapPin,
  Megaphone,
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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  cityFundDistribution,
  crossDeptApprovals,
  fundTrend,
  leaderFocusList,
  managementDataUpdatedAt,
  managementOverview,
  policyEffectData,
  policyPublications
} from '../../data/managementData';

const tabs = [
  { id: 'dashboard', label: '领导总览', icon: BarChart3 },
  { id: 'approval', label: '协同审批', icon: FileSignature },
  { id: 'policy', label: '政策发布', icon: Megaphone }
];

const stats = [
  { icon: Users, label: '参保人数', value: managementOverview.insuredPopulation, change: '居民医保参保率 95%+', color: '#0891b2' },
  { icon: Wallet, label: '基金收入', value: managementOverview.fundIncome, change: `结余 ${managementOverview.fundBalance}`, color: '#22c55e' },
  { icon: FileText, label: '年度结算', value: managementOverview.annualSettlements, change: `报销率 ${managementOverview.reimbursementRate}`, color: '#f59e0b' },
  { icon: Building2, label: '定点机构', value: managementOverview.designatedInstitutions, change: '三级医院、基层机构、药店全覆盖', color: '#8b5cf6' }
];

export default function BureauLeaderDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderDashboard = () => (
    <div className="space-y-6">
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
                <p className="mt-2 text-xs" style={{ color: stat.color }}>
                  {stat.change}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: `${stat.color}16` }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-600" />
            <h3 className="font-semibold text-[#134E4A]">基金年度收支趋势</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={fundTrend}>
              <defs>
                <linearGradient id="leaderIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="leaderExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="亿" />
              <Tooltip formatter={(value: number) => [`${value} 亿元`, '']} />
              <Area type="monotone" dataKey="income" stroke="#0891b2" fill="url(#leaderIncome)" name="基金收入" />
              <Area type="monotone" dataKey="expense" stroke="#f97316" fill="url(#leaderExpense)" name="基金支出" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <h3 className="font-semibold text-[#134E4A]">领导关注要点</h3>
          </div>
          <div className="space-y-3">
            {leaderFocusList.map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-100 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-cyan-700">{item.tag}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-violet-600" />
            <h3 className="font-semibold text-[#134E4A]">重点地市基金分布</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cityFundDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="city" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="亿" />
              <Tooltip formatter={(value: number) => [`${value} 亿元`, '']} />
              <Bar dataKey="income" fill="#0891b2" radius={[6, 6, 0, 0]} name="基金收入" />
              <Bar dataKey="expense" fill="#f97316" radius={[6, 6, 0, 0]} name="基金支出" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-600" />
            <h3 className="font-semibold text-[#134E4A]">重点政策效果评估</h3>
          </div>
          <div className="space-y-3">
            {policyEffectData.map((item) => (
              <div key={item.policy} className="rounded-2xl border border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-gray-900">{item.policy}</p>
                  <span className="text-sm text-cyan-700">{item.coverage}</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">覆盖对象：{item.beneficiaries}</p>
                <p className="mt-1 text-sm text-emerald-700">{item.effect}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderApproval = () => (
    <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h3 className="font-semibold text-[#134E4A]">跨部门协同审批事项</h3>
      </div>
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">事项名称</th>
            <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">参与部门</th>
            <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">进度</th>
            <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">状态</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {crossDeptApprovals.map((item) => (
            <tr key={item.id}>
              <td className="px-5 py-4">
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="mt-1 text-xs text-gray-400">{item.id}</p>
              </td>
              <td className="px-5 py-4 text-sm text-gray-600">{item.departments.join('、')}</td>
              <td className="px-5 py-4">
                <div className="h-2 w-28 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-cyan-600" style={{ width: `${item.progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-gray-500">{item.progress}%</p>
              </td>
              <td className="px-5 py-4">
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs text-cyan-700">{item.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPolicy = () => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="rounded-2xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white">发布政策</button>
      </div>
      <div className="rounded-3xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">政策标题</th>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">类型</th>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">发布日期</th>
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">阅读量</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {policyPublications.map((item) => (
              <tr key={item.id}>
                <td className="px-5 py-4 font-medium text-gray-900">{item.title}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">{item.type}</span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{item.date}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{item.views.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#134E4A]">领导驾驶舱</h1>
          <p className="mt-1 text-sm text-gray-500">围绕基金运行、参保结构、政策执行和风险态势提供综合决策支持。</p>
        </div>
        <span className="text-sm text-gray-500">数据口径：{managementDataUpdatedAt}</span>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
              activeTab === tab.id ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'approval' && renderApproval()}
          {activeTab === 'policy' && renderPolicy()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
