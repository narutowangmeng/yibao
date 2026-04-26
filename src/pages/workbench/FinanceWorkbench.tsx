import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, Scale, BookOpen, FileText, Settings, RefreshCw, Eye, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const monthlyData = [
  { month: '1月', income: 680, expense: 520 },
  { month: '2月', income: 720, expense: 580 },
  { month: '3月', income: 780, expense: 620 },
  { month: '4月', income: 750, expense: 600 },
  { month: '5月', income: 820, expense: 650 },
  { month: '6月', income: 850, expense: 680 },
];

const accountData = [
  { name: '统筹基金', value: 45, color: '#f59e0b' },
  { name: '个人账户', value: 35, color: '#10b981' },
  { name: '大病保险', value: 15, color: '#3b82f6' },
  { name: '其他账户', value: 5, color: '#6b7280' },
];

const mockRules = [
  { id: 'R001', name: '银行流水对账', source: '医保系统', target: '银行系统', status: 'active' },
  { id: 'R002', name: '税务数据对账', source: '医保系统', target: '税务系统', status: 'active' },
];

const mockLedger = [
  { id: 'L001', code: '1001', name: '库存现金', category: '资产类', balance: 1250000 },
  { id: 'L002', code: '1002', name: '银行存款', category: '资产类', balance: 82560000 },
];

const mockReports = [
  { id: 1, name: '2024年6月基金收支月报', type: '月报', date: '2024-07-05', status: '已生成' },
];

export default function FinanceWorkbench() {
  const [activeTab, setActiveTab] = useState('overview');
  const [reconcileStep, setReconcileStep] = useState<'upload' | 'processing' | 'result'>('upload');

  const tabs = [
    { id: 'overview', label: '基金概览', icon: Wallet },
    { id: 'reconcile', label: '自动对账', icon: Scale },
    { id: 'ledger', label: '总账管理', icon: BookOpen },
    { id: 'reports', label: '财务报表', icon: FileText },
  ];

  const handleReconcile = () => {
    setReconcileStep('processing');
    setTimeout(() => setReconcileStep('result'), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">财务管理工作台</h2>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: '基金总收入', value: '¥8,256.8万', change: '+12.5%', trend: 'up' },
            { label: '基金总支出', value: '¥6,842.3万', change: '+8.3%', trend: 'up' },
            { label: '基金结余', value: '¥1,414.5万', change: '+28.6%', trend: 'up' },
            { label: '账户数量', value: '156个', change: '+5个', trend: 'up' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-5 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3 text-green-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                <span className="text-xs text-green-500">{stat.change}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2 border-b border-gray-200 mb-6">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-4">收支趋势</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="income" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="收入" />
                  <Area type="monotone" dataKey="expense" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="支出" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-semibold mb-4">账户分布</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={accountData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                    {accountData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {activeTab === 'reconcile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2"><Settings className="w-5 h-5 text-amber-600" />对账规则</h3>
                <button className="px-3 py-1.5 bg-amber-500 text-white rounded text-sm">新增规则</button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-sm">规则名称</th><th className="px-4 py-2 text-left text-sm">数据源</th><th className="px-4 py-2 text-left text-sm">对账目标</th><th className="px-4 py-2 text-left text-sm">状态</th></tr></thead>
                <tbody className="divide-y">{mockRules.map(r => (<tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-2 font-medium">{r.name}</td><td className="px-4 py-2">{r.source}</td><td className="px-4 py-2">{r.target}</td><td className="px-4 py-2"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">启用</span></td></tr>))}</tbody>
              </table>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><RefreshCw className="w-5 h-5 text-amber-600" />对账执行</h3>
              {reconcileStep === 'upload' && (
                <div className="border-2 border-dashed border-amber-300 rounded-xl p-8 text-center cursor-pointer hover:border-amber-500 bg-amber-50" onClick={handleReconcile}>
                  <RefreshCw className="w-10 h-10 mx-auto text-amber-500 mb-2" />
                  <p className="text-sm text-gray-600">点击开始自动对账</p>
                </div>
              )}
              {reconcileStep === 'processing' && (
                <div className="text-center py-8"><RefreshCw className="w-10 h-10 mx-auto text-amber-500 animate-spin mb-2" /><p className="text-sm">对账中...</p></div>
              )}
              {reconcileStep === 'result' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-green-600">2</p><p className="text-xs text-gray-600">匹配成功</p></div>
                    <div className="bg-red-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-red-600">1</p><p className="text-xs text-gray-600">存在差异</p></div>
                    <div className="bg-amber-50 rounded-lg p-3 text-center"><p className="text-xl font-bold text-amber-600">3</p><p className="text-xs text-gray-600">总笔数</p></div>
                  </div>
                  <button onClick={() => setReconcileStep('upload')} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm">重新对账</button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'ledger' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-amber-600" />总账科目</h3>
            <table className="w-full">
              <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-sm">科目编码</th><th className="px-4 py-2 text-left text-sm">科目名称</th><th className="px-4 py-2 text-left text-sm">类别</th><th className="px-4 py-2 text-right text-sm">余额</th><th className="px-4 py-2 text-right text-sm">操作</th></tr></thead>
              <tbody className="divide-y">{mockLedger.map(a => (<tr key={a.id} className="hover:bg-gray-50"><td className="px-4 py-2 font-medium text-amber-600">{a.code}</td><td className="px-4 py-2 font-medium">{a.name}</td><td className="px-4 py-2"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{a.category}</span></td><td className="px-4 py-2 text-right">¥{a.balance.toLocaleString()}</td><td className="px-4 py-2 text-right"><button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Eye className="w-4 h-4" /></button></td></tr>))}</tbody>
            </table>
          </motion.div>
        )}

        {activeTab === 'reports' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-amber-600" />财务报表</h3>
              <button className="px-3 py-1.5 bg-amber-500 text-white rounded text-sm">生成报表</button>
            </div>
            <div className="divide-y">{mockReports.map(r => (<div key={r.id} className="py-3 flex items-center justify-between hover:bg-gray-50"><div className="flex items-center gap-3"><FileText className="w-8 h-8 text-amber-600" /><div><p className="font-medium">{r.name}</p><p className="text-xs text-gray-500">{r.type} · {r.date}</p></div></div><div className="flex items-center gap-2"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded flex items-center gap-1"><CheckCircle className="w-3 h-3" />{r.status}</span><button className="p-1.5 text-gray-400 hover:text-amber-600"><Download className="w-4 h-4" /></button></div></div>))}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
