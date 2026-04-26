import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Wallet, FileText, Building2, TrendingUp, Activity, AlertTriangle, CheckCircle, MapPin, Shield, HeartPulse, FileSignature, Megaphone, BarChart3, Users2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const stats = [
  { icon: Users, label: '参保人数', value: '13.6亿', change: '+2.3%', color: '#0891B2' },
  { icon: Wallet, label: '基金收入', value: '2.8万亿', change: '+8.5%', color: '#22C55E' },
  { icon: FileText, label: '报销人次', value: '45.2亿', change: '+5.1%', color: '#F59E0B' },
  { icon: Building2, label: '定点机构', value: '98.5万', change: '+3.2%', color: '#8B5CF6' },
];

const trendData = [
  { month: '1月', income: 1800, expense: 1200, balance: 600 },
  { month: '2月', income: 2200, expense: 1500, balance: 700 },
  { month: '3月', income: 2800, expense: 1900, balance: 900 },
  { month: '4月', income: 2600, expense: 2100, balance: 500 },
  { month: '5月', income: 3200, expense: 2400, balance: 800 },
  { month: '6月', income: 3500, expense: 2800, balance: 700 },
];

const regionData = [
  { name: '东部', enrollment: 4200, revenue: 8500, expense: 6200 },
  { name: '中部', enrollment: 3100, revenue: 5800, expense: 4200 },
  { name: '西部', enrollment: 2800, revenue: 4200, expense: 3800 },
  { name: '东北', enrollment: 1900, revenue: 2800, expense: 2600 },
];

const policyEffects = [
  { policy: '门诊共济', coverage: '85%', satisfaction: '92%', costControl: '-12%' },
  { policy: '集采降价', coverage: '95%', satisfaction: '88%', costControl: '-53%' },
  { policy: 'DRG付费', coverage: '78%', satisfaction: '85%', costControl: '-8%' },
];

const approvals = [
  { id: 'APP-001', title: '2024年医保目录调整', depts: ['待遇保障司', '医药服务司', '基金监管司'], status: '会签中', progress: 67 },
  { id: 'APP-002', title: '新增医疗服务价格项目', depts: ['医药服务司', '待遇保障司'], status: '待审批', progress: 33 },
];

const policies = [
  { id: 1, title: '关于完善门诊共济保障机制的通知', date: '2024-03-15', views: 12560, type: '政策文件' },
  { id: 2, title: '2024年国家医保药品目录调整方案解读', date: '2024-03-10', views: 8920, type: '政策解读' },
];

const tabs = [
  { id: 'dashboard', label: '宏观驾驶舱', icon: BarChart3 },
  { id: 'approval', label: '协同审批', icon: FileSignature },
  { id: 'policy', label: '政策发布', icon: Megaphone },
];

export default function BureauLeaderDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-[#134E4A]">{stat.value}</p>
                <p className="text-xs mt-2 flex items-center gap-1" style={{ color: stat.color }}><TrendingUp size={12} />{stat.change} 较上月</p>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4"><Activity size={18} className="text-[#0891B2]" /><h3 className="font-semibold text-[#134E4A]">基金收支趋势</h3></div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs><linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0891B2" stopOpacity={0.3} /><stop offset="95%" stopColor="#0891B2" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="income" stroke="#0891B2" fill="url(#colorIncome)" name="收入" />
              <Area type="monotone" dataKey="expense" stroke="#EF4444" fill="#EF444420" name="支出" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4"><MapPin size={18} className="text-[#8B5CF6]" /><h3 className="font-semibold text-[#134E4A]">区域对比</h3></div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="revenue" fill="#0891B2" radius={[4, 4, 0, 0]} name="收入(亿)" />
              <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} name="支出(亿)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4"><TrendingUp size={18} className="text-[#22C55E]" /><h3 className="font-semibold text-[#134E4A]">政策效果评估</h3></div>
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">政策名称</th><th className="px-4 py-3 text-left text-sm">覆盖率</th><th className="px-4 py-3 text-left text-sm">满意度</th><th className="px-4 py-3 text-left text-sm">控费效果</th></tr></thead>
          <tbody>{policyEffects.map((item, i) => (<tr key={i} className="border-t"><td className="px-4 py-3 text-sm font-medium">{item.policy}</td><td className="px-4 py-3 text-sm text-blue-600">{item.coverage}</td><td className="px-4 py-3 text-sm text-green-600">{item.satisfaction}</td><td className="px-4 py-3 text-sm text-green-600">{item.costControl}</td></tr>))}</tbody>
        </table>
      </motion.div>
    </div>
  );

  const renderApproval = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b"><h3 className="font-medium">跨部门协同审批</h3></div>
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">审批事项</th><th className="px-4 py-3 text-left text-sm">参与司局</th><th className="px-4 py-3 text-left text-sm">进度</th><th className="px-4 py-3 text-left text-sm">状态</th></tr></thead>
          <tbody>{approvals.map(item => (<tr key={item.id} className="border-t"><td className="px-4 py-3 text-sm font-medium">{item.title}</td><td className="px-4 py-3 text-sm">{item.depts.join(', ')}</td><td className="px-4 py-3"><div className="w-24 h-2 bg-gray-200 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.progress}%` }} /></div></td><td className="px-4 py-3"><span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">{item.status}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );

  const renderPolicy = () => (
    <div className="space-y-4">
      <div className="flex gap-2"><button className="px-4 py-2 bg-cyan-600 text-white rounded-lg flex items-center gap-2"><Megaphone className="w-4 h-4" />发布政策</button></div>
      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">政策标题</th><th className="px-4 py-3 text-left text-sm">类型</th><th className="px-4 py-3 text-left text-sm">发布日期</th><th className="px-4 py-3 text-left text-sm">浏览量</th></tr></thead>
          <tbody>{policies.map(item => (<tr key={item.id} className="border-t"><td className="px-4 py-3 text-sm font-medium">{item.title}</td><td className="px-4 py-3"><span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">{item.type}</span></td><td className="px-4 py-3 text-sm">{item.date}</td><td className="px-4 py-3 text-sm">{item.views}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-semibold text-[#134E4A]">领导驾驶舱</h1><p className="text-sm text-gray-500 mt-1">全局数据概览 · 决策支持</p></div>
        <span className="text-sm text-gray-500">数据更新时间: 2024-06-30</span>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
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
