import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Building, FileText, Calendar, Download, Search, Filter, ChevronDown, AlertCircle, Plus, Eye, Edit, Trash2, X, CheckCircle, RefreshCw, BookOpen, Scale, Settings, AlertTriangle, CheckSquare, FileSearch } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Account { id: number; name: string; type: string; balance: string; status: '正常' | '冻结' | '注销'; description?: string; }
interface Report { id: number; name: string; type: string; date: string; status: string; size?: string; }
interface ReconcileRule { id: string; name: string; source: string; target: string; frequency: string; matchFields: string[]; tolerance: number; status: 'active' | 'inactive'; }
interface ReconcileTask { id: string; date: string; ruleName: string; status: 'pending' | 'processing' | 'completed' | 'failed'; diffAmount: number; diffCount: number; }
interface DiffRecord { id: string; taskId: string; type: string; amount: number; reason: string; status: 'pending' | 'adjusted' | 'writtenOff'; }
interface LedgerAccount { id: string; code: string; name: string; category: string; balance: number; status: 'active' | 'inactive'; parentCode?: string; }
interface LedgerDetail { id: string; accountId: string; date: string; voucherNo: string; summary: string; debit: number; credit: number; balance: number; }

const fundStats = [
  { label: '基金总收入', value: '¥8,256.8万', change: '+12.5%', trend: 'up' },
  { label: '基金总支出', value: '¥6,842.3万', change: '+8.3%', trend: 'up' },
  { label: '基金结余', value: '¥1,414.5万', change: '+28.6%', trend: 'up' },
  { label: '账户数量', value: '156个', change: '+5个', trend: 'up' },
];

const monthlyData = [
  { month: '1月', income: 680, expense: 520 },
  { month: '2月', income: 720, expense: 580 },
  { month: '3月', income: 780, expense: 620 },
  { month: '4月', income: 750, expense: 600 },
  { month: '5月', income: 820, expense: 650 },
  { month: '6月', income: 850, expense: 680 },
];

const accountData = [
  { name: '统筹基金', value: 45, color: '#0891B2' },
  { name: '个人账户', value: 35, color: '#10B981' },
  { name: '大病保险', value: 15, color: '#F59E0B' },
  { name: '其他账户', value: 5, color: '#6B7280' },
];

const mockReconcileRules: ReconcileRule[] = [
  { id: 'R001', name: '银行流水对账', source: '医保系统', target: '银行系统', frequency: '每日', matchFields: ['交易日期', '交易金额', '流水号'], tolerance: 0.01, status: 'active' },
  { id: 'R002', name: '税务数据对账', source: '医保系统', target: '税务系统', frequency: '每月', matchFields: ['纳税人识别号', '缴费金额', '所属期'], tolerance: 0, status: 'active' },
];

const mockReconcileTasks: ReconcileTask[] = [
  { id: 'T001', date: '2024-01-20', ruleName: '银行流水对账', status: 'completed', diffAmount: 1250, diffCount: 3 },
  { id: 'T002', date: '2024-01-19', ruleName: '银行流水对账', status: 'completed', diffAmount: 0, diffCount: 0 },
  { id: 'T003', date: '2024-01-18', ruleName: '税务数据对账', status: 'processing', diffAmount: 0, diffCount: 0 },
];

const mockDiffRecords: DiffRecord[] = [
  { id: 'D001', taskId: 'T001', type: '金额差异', amount: 500, reason: '银行手续费未同步', status: 'adjusted' },
  { id: 'D002', taskId: 'T001', type: '记录缺失', amount: 750, reason: '待核实', status: 'pending' },
];

const mockLedgerAccounts: LedgerAccount[] = [
  { id: 'L001', code: '1001', name: '库存现金', category: '资产类', balance: 1250000, status: 'active' },
  { id: 'L002', code: '1002', name: '银行存款', category: '资产类', balance: 82560000, status: 'active' },
  { id: 'L003', code: '2001', name: '应付账款', category: '负债类', balance: 3200000, status: 'active' },
  { id: 'L004', code: '4001', name: '实收资本', category: '权益类', balance: 50000000, status: 'active' },
];

const mockLedgerDetails: LedgerDetail[] = [
  { id: 'LD001', accountId: 'L002', date: '2024-01-20', voucherNo: 'PZ-20240120-001', summary: '医保基金收入', debit: 500000, credit: 0, balance: 82560000 },
  { id: 'LD002', accountId: 'L002', date: '2024-01-19', voucherNo: 'PZ-20240119-002', summary: '医疗费用支出', debit: 0, credit: 200000, balance: 82060000 },
];

export default function FundManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 1, name: '城镇职工统筹基金', type: '统筹基金', balance: '¥4,256.8万', status: '正常', description: '城镇职工基本医疗保险统筹基金' },
    { id: 2, name: '城乡居民统筹基金', type: '统筹基金', balance: '¥2,156.3万', status: '正常', description: '城乡居民基本医疗保险统筹基金' },
    { id: 3, name: '个人账户基金', type: '个人账户', balance: '¥1,842.5万', status: '正常', description: '职工医保个人账户基金' },
    { id: 4, name: '大病保险基金', type: '大病保险', balance: '¥685.2万', status: '正常', description: '大病保险专项基金' },
  ]);
  const [reports, setReports] = useState<Report[]>([
    { id: 1, name: '2024年6月基金收支月报', type: '月报', date: '2024-07-05', status: '已生成', size: '2.3MB' },
    { id: 2, name: '2024年第二季度基金分析报告', type: '季报', date: '2024-07-01', status: '已生成', size: '5.1MB' },
  ]);
  const [reconcileRules, setReconcileRules] = useState<ReconcileRule[]>(mockReconcileRules);
  const [reconcileTasks, setReconcileTasks] = useState<ReconcileTask[]>(mockReconcileTasks);
  const [diffRecords, setDiffRecords] = useState<DiffRecord[]>(mockDiffRecords);
  const [ledgerAccounts, setLedgerAccounts] = useState<LedgerAccount[]>(mockLedgerAccounts);
  const [ledgerDetails, setLedgerDetails] = useState<LedgerDetail[]>(mockLedgerDetails);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view' | 'generate' | 'reconcile' | 'ledger' | 'diff' | 'ledgerDetail'>('add');
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', type: '统筹基金', description: '', reportType: '月报', reportPeriod: '', tolerance: 0.01, matchFields: [] as string[] });
  const [selectedDiff, setSelectedDiff] = useState<DiffRecord | null>(null);
  const [diffReason, setDiffReason] = useState('');

  const tabs = [
    { id: 'overview', label: '基金概览' },
    { id: 'accounts', label: '账户管理' },
    { id: 'reconcile', label: '自动对账' },
    { id: 'ledger', label: '总账管理' },
    { id: 'reports', label: '财务报表' },
  ];

  const handleAddAccount = () => { setModalType('add'); setCurrentItem(null); setFormData({ name: '', type: '统筹基金', description: '', reportType: '月报', reportPeriod: '', tolerance: 0.01, matchFields: [] }); setShowModal(true); };
  const handleEditAccount = (account: Account) => { setModalType('edit'); setCurrentItem(account); setFormData({ ...formData, name: account.name, type: account.type, description: account.description || '' }); setShowModal(true); };
  const handleViewAccount = (account: Account) => { setModalType('view'); setCurrentItem(account); setShowModal(true); };
  const handleDeleteAccount = (id: number) => { setAccounts(accounts.filter(a => a.id !== id)); };
  const handleToggleStatus = (id: number) => { setAccounts(accounts.map(a => { if (a.id === id) { const statuses: ('正常' | '冻结' | '注销')[] = ['正常', '冻结', '注销']; const currentIndex = statuses.indexOf(a.status); return { ...a, status: statuses[(currentIndex + 1) % statuses.length] }; } return a; })); };
  const handleGenerateReport = () => { setModalType('generate'); setFormData({ ...formData, reportType: '月报', reportPeriod: new Date().toISOString().split('T')[0].slice(0, 7) }); setShowModal(true); };
  const handleDownloadReport = (report: Report) => { alert(`正在下载: ${report.name}`); };
  const handleDeleteReport = (id: number) => { setReports(reports.filter(r => r.id !== id)); };

  const handleRunReconcile = () => {
    const newTask: ReconcileTask = { id: `T${String(reconcileTasks.length + 1).padStart(3, '0')}`, date: new Date().toISOString().split('T')[0], ruleName: '银行流水对账', status: 'processing', diffAmount: 0, diffCount: 0 };
    setReconcileTasks([newTask, ...reconcileTasks]);
    setTimeout(() => { setReconcileTasks(prev => prev.map(t => t.id === newTask.id ? { ...t, status: 'completed', diffAmount: Math.floor(Math.random() * 1000), diffCount: Math.floor(Math.random() * 5) } : t)); }, 2000);
  };

  const handleViewDiff = (task: ReconcileTask) => {
    setCurrentItem(task);
    setModalType('diff');
    setShowModal(true);
  };

  const handleAdjustDiff = (diff: DiffRecord) => {
    setSelectedDiff(diff);
    setDiffReason(diff.reason);
  };

  const handleSaveDiffReason = () => {
    if (selectedDiff) {
      setDiffRecords(diffRecords.map(d => d.id === selectedDiff.id ? { ...d, reason: diffReason, status: 'adjusted' } : d));
      setSelectedDiff(null);
      setDiffReason('');
    }
  };

  const handleWriteOffDiff = (diffId: string) => {
    setDiffRecords(diffRecords.map(d => d.id === diffId ? { ...d, status: 'writtenOff' } : d));
  };

  const handleViewLedgerDetail = (account: LedgerAccount) => {
    setCurrentItem(account);
    setModalType('ledgerDetail');
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (modalType === 'add') { const newAccount: Account = { id: accounts.length + 1, name: formData.name, type: formData.type, balance: '¥0.00', status: '正常', description: formData.description }; setAccounts([...accounts, newAccount]); }
    else if (modalType === 'edit') { setAccounts(accounts.map(a => a.id === currentItem.id ? { ...a, name: formData.name, type: formData.type, description: formData.description } : a)); }
    else if (modalType === 'generate') { const newReport: Report = { id: reports.length + 1, name: `${formData.reportPeriod} ${formData.reportType === '月报' ? '月度' : formData.reportType === '季报' ? '季度' : '半年'}基金报表`, type: formData.reportType, date: new Date().toISOString().split('T')[0], status: '已生成', size: '1.5MB' }; setReports([newReport, ...reports]); }
    setShowModal(false);
  };

  const filteredAccounts = accounts.filter(a => a.name.includes(searchQuery) || a.type.includes(searchQuery));
  const filteredDiffs = diffRecords.filter(d => d.taskId === currentItem?.id);
  const filteredLedgerDetails = ledgerDetails.filter(d => d.accountId === currentItem?.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">基金管理</h1><p className="text-sm text-gray-500 mt-1">医保基金收支管理与财务分析</p></div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"><Calendar className="w-4 h-4" />选择期间<ChevronDown className="w-4 h-4" /></button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0891B2] text-white rounded-lg text-sm font-medium hover:bg-[#0e7490]"><Download className="w-4 h-4" />导出报表</button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-[#0891B2] text-[#0891B2]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab.label}</button>))}
      </div>

      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {fundStats.map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white p-6 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">{stat.trend === 'up' ? (<TrendingUp className="w-4 h-4 text-green-500" />) : (<TrendingDown className="w-4 h-4 text-red-500" />)}<span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</span><span className="text-sm text-gray-400">较上月</span></div>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200"><h3 className="text-lg font-semibold text-gray-900 mb-4">收支趋势</h3><ResponsiveContainer width="100%" height={250}><AreaChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" stroke="#9ca3af" fontSize={12} /><YAxis stroke="#9ca3af" fontSize={12} /><Tooltip /><Area type="monotone" dataKey="income" stackId="1" stroke="#0891B2" fill="#0891B2" fillOpacity={0.6} name="收入" /><Area type="monotone" dataKey="expense" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="支出" /></AreaChart></ResponsiveContainer></div>
            <div className="bg-white p-6 rounded-xl border border-gray-200"><h3 className="text-lg font-semibold text-gray-900 mb-4">账户分布</h3><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={accountData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{accountData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="flex justify-center gap-4 mt-4">{accountData.map((item) => (<div key={item.name} className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-sm text-gray-600">{item.name}</span></div>))}</div></div>
          </div>
        </motion.div>
      )}

      {activeTab === 'accounts' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="搜索账户名称..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891B2]" /></div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"><Filter className="w-4 h-4" />筛选</button>
            </div>
            <button onClick={handleAddAccount} className="flex items-center gap-2 px-4 py-2 bg-[#0891B2] text-white rounded-lg text-sm hover:bg-[#0e7490]"><Plus className="w-4 h-4" />新增账户</button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">账户名称</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">账户类型</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">账户余额</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th></tr></thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><Wallet className="w-5 h-5 text-[#0891B2]" /><span className="text-sm font-medium text-gray-900">{account.name}</span></div></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{account.type}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{account.balance}</td>
                  <td className="px-4 py-3"><button onClick={() => handleToggleStatus(account.id)} className={`px-2 py-1 text-xs rounded-full transition-colors ${account.status === '正常' ? 'bg-green-100 text-green-700' : account.status === '冻结' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{account.status}</button></td>
                  <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => handleViewAccount(account)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button><button onClick={() => handleEditAccount(account)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"><Edit className="w-4 h-4" /></button><button onClick={() => handleDeleteAccount(account.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {activeTab === 'reconcile' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold flex items-center gap-2"><Scale className="w-5 h-5 text-cyan-600" />对账规则配置</h3><button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm"><Plus className="w-4 h-4" />新增规则</button></div>
            <table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">规则名称</th><th className="px-4 py-3 text-left text-sm">数据源</th><th className="px-4 py-3 text-left text-sm">对账目标</th><th className="px-4 py-3 text-left text-sm">匹配字段</th><th className="px-4 py-3 text-left text-sm">容忍度</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-right text-sm">操作</th></tr></thead><tbody className="divide-y">{reconcileRules.map(rule => (<tr key={rule.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium">{rule.name}</td><td className="px-4 py-3">{rule.source}</td><td className="px-4 py-3">{rule.target}</td><td className="px-4 py-3">{rule.matchFields.join(', ')}</td><td className="px-4 py-3">{rule.tolerance > 0 ? `±${rule.tolerance}` : '严格匹配'}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{rule.status === 'active' ? '启用' : '停用'}</span></td><td className="px-4 py-3 text-right"><button className="p-1.5 text-gray-400 hover:text-cyan-600"><Edit className="w-4 h-4" /></button></td></tr>))}</tbody></table>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold flex items-center gap-2"><RefreshCw className="w-5 h-5 text-cyan-600" />对账执行记录</h3><button onClick={handleRunReconcile} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm"><RefreshCw className="w-4 h-4" />执行对账</button></div>
            <table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">任务编号</th><th className="px-4 py-3 text-left text-sm">执行日期</th><th className="px-4 py-3 text-left text-sm">对账规则</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-left text-sm">差异金额</th><th className="px-4 py-3 text-left text-sm">差异笔数</th><th className="px-4 py-3 text-right text-sm">操作</th></tr></thead><tbody className="divide-y">{reconcileTasks.map(task => (<tr key={task.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium">{task.id}</td><td className="px-4 py-3">{task.date}</td><td className="px-4 py-3">{task.ruleName}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${task.status === 'completed' ? 'bg-green-100 text-green-700' : task.status === 'processing' ? 'bg-blue-100 text-blue-700' : task.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{task.status === 'completed' ? '已完成' : task.status === 'processing' ? '进行中' : task.status === 'failed' ? '失败' : '待处理'}</span></td><td className="px-4 py-3">{task.diffAmount > 0 ? <span className="text-red-600">¥{task.diffAmount.toLocaleString()}</span> : <span className="text-green-600">无差异</span>}</td><td className="px-4 py-3">{task.diffCount}</td><td className="px-4 py-3 text-right"><button onClick={() => handleViewDiff(task)} className="p-1.5 text-gray-400 hover:text-cyan-600"><Eye className="w-4 h-4" /></button></td></tr>))}</tbody></table>
          </div>
        </motion.div>
      )}

      {activeTab === 'ledger' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold flex items-center gap-2"><BookOpen className="w-5 h-5 text-cyan-600" />总账科目管理</h3><button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm"><Plus className="w-4 h-4" />新增科目</button></div>
          <table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">科目编码</th><th className="px-4 py-3 text-left text-sm">科目名称</th><th className="px-4 py-3 text-left text-sm">科目类别</th><th className="px-4 py-3 text-left text-sm">当前余额</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-right text-sm">操作</th></tr></thead><tbody className="divide-y">{ledgerAccounts.map(account => (<tr key={account.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium text-cyan-600">{account.code}</td><td className="px-4 py-3 font-medium">{account.name}</td><td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{account.category}</span></td><td className="px-4 py-3 font-medium">¥{account.balance.toLocaleString()}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${account.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{account.status === 'active' ? '启用' : '停用'}</span></td><td className="px-4 py-3 text-right"><div className="flex gap-2 justify-end"><button onClick={() => handleViewLedgerDetail(account)} className="p-1.5 text-gray-400 hover:text-cyan-600"><FileSearch className="w-4 h-4" /></button><button className="p-1.5 text-gray-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button></div></td></tr>))}</tbody></table>
        </motion.div>
      )}

      {activeTab === 'reports' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between"><h3 className="text-lg font-semibold text-gray-900">财务报表</h3><button onClick={handleGenerateReport} className="flex items-center gap-2 px-4 py-2 bg-[#0891B2] text-white rounded-lg text-sm font-medium hover:bg-[#0e7490]"><FileText className="w-4 h-4" />生成报表</button></div>
          <div className="divide-y divide-gray-200">{reports.map((report) => (<div key={report.id} className="p-4 flex items-center justify-between hover:bg-gray-50"><div className="flex items-center gap-4"><FileText className="w-10 h-10 text-[#0891B2]" /><div><p className="text-sm font-medium text-gray-900">{report.name}</p><p className="text-xs text-gray-500 mt-1">{report.type} · {report.date} · {report.size}</p></div></div><div className="flex items-center gap-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{report.status}</span><button onClick={() => handleDownloadReport(report)} className="p-2 text-gray-400 hover:text-[#0891B2]"><Download className="w-4 h-4" /></button><button onClick={() => handleDeleteReport(report.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></div></div>))}</div>
        </motion.div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{modalType === 'add' ? '新增账户' : modalType === 'edit' ? '编辑账户' : modalType === 'generate' ? '生成报表' : modalType === 'diff' ? '差异处理' : modalType === 'ledgerDetail' ? '科目明细' : '账户详情'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            
            {modalType === 'view' && (<div className="space-y-4"><div><label className="text-sm text-gray-500">账户名称</label><p className="font-medium">{currentItem?.name}</p></div><div><label className="text-sm text-gray-500">账户类型</label><p>{currentItem?.type}</p></div><div><label className="text-sm text-gray-500">账户余额</label><p className="font-medium text-lg">{currentItem?.balance}</p></div><div><label className="text-sm text-gray-500">状态</label><span className={`px-2 py-1 rounded text-xs ${currentItem?.status === '正常' ? 'bg-green-100 text-green-700' : currentItem?.status === '冻结' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{currentItem?.status}</span></div>{currentItem?.description && <div><label className="text-sm text-gray-500">描述</label><p className="text-sm text-gray-600">{currentItem.description}</p></div>}</div>)}
            
            {modalType === 'generate' && (<div className="space-y-4"><div><label className="block text-sm font-medium mb-1">报表类型</label><select value={formData.reportType} onChange={(e) => setFormData({ ...formData, reportType: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="月报">月报</option><option value="季报">季报</option><option value="半年报">半年报</option><option value="年报">年报</option></select></div><div><label className="block text-sm font-medium mb-1">报表期间</label><input type="month" value={formData.reportPeriod} onChange={(e) => setFormData({ ...formData, reportPeriod: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div></div>)}
            
            {modalType === 'diff' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-sm"><span className="font-medium">任务编号:</span> {currentItem?.id}</p><p className="text-sm"><span className="font-medium">对账规则:</span> {currentItem?.ruleName}</p><p className="text-sm"><span className="font-medium">差异金额:</span> <span className="text-red-600">¥{currentItem?.diffAmount?.toLocaleString()}</span></p></div>
                <h4 className="font-medium">差异明细</h4>
                {filteredDiffs.length > 0 ? (
                  <div className="space-y-2">
                    {filteredDiffs.map(diff => (
                      <div key={diff.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div><p className="font-medium text-sm">{diff.type}</p><p className="text-sm text-gray-500">金额: ¥{diff.amount}</p></div>
                          <span className={`px-2 py-1 rounded text-xs ${diff.status === 'adjusted' ? 'bg-blue-100 text-blue-700' : diff.status === 'writtenOff' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{diff.status === 'adjusted' ? '已调整' : diff.status === 'writtenOff' ? '已核销' : '待处理'}</span>
                        </div>
                        {selectedDiff?.id === diff.id ? (
                          <div className="mt-2 space-y-2">
                            <textarea value={diffReason} onChange={(e) => setDiffReason(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} placeholder="请输入差异原因" />
                            <div className="flex gap-2">
                              <button onClick={handleSaveDiffReason} className="px-3 py-1 bg-cyan-600 text-white rounded text-sm">保存</button>
                              <button onClick={() => setSelectedDiff(null)} className="px-3 py-1 border rounded text-sm">取消</button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 flex justify-between items-center">
                            <p className="text-sm text-gray-600">原因: {diff.reason}</p>
                            {diff.status === 'pending' && (
                              <div className="flex gap-2">
                                <button onClick={() => handleAdjustDiff(diff)} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">标注原因</button>
                                <button onClick={() => handleWriteOffDiff(diff.id)} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">核销</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500 text-center py-4">暂无差异记录</p>}
              </div>
            )}
            
            {modalType === 'ledgerDetail' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg"><p className="text-sm"><span className="font-medium">科目编码:</span> {currentItem?.code}</p><p className="text-sm"><span className="font-medium">科目名称:</span> {currentItem?.name}</p><p className="text-sm"><span className="font-medium">当前余额:</span> ¥{currentItem?.balance?.toLocaleString()}</p></div>
                <h4 className="font-medium">明细记录</h4>
                {filteredLedgerDetails.length > 0 ? (
                  <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="px-2 py-2 text-left">日期</th><th className="px-2 py-2 text-left">凭证号</th><th className="px-2 py-2 text-left">摘要</th><th className="px-2 py-2 text-right">借方</th><th className="px-2 py-2 text-right">贷方</th></tr></thead><tbody className="divide-y">{filteredLedgerDetails.map(detail => (<tr key={detail.id}><td className="px-2 py-2">{detail.date}</td><td className="px-2 py-2 text-cyan-600">{detail.voucherNo}</td><td className="px-2 py-2">{detail.summary}</td><td className="px-2 py-2 text-right">{detail.debit > 0 ? `¥${detail.debit.toLocaleString()}` : '-'}</td><td className="px-2 py-2 text-right">{detail.credit > 0 ? `¥${detail.credit.toLocaleString()}` : '-'}</td></tr>))}</tbody></table>
                ) : <p className="text-gray-500 text-center py-4">暂无明细记录</p>}
              </div>
            )}
            
            {(modalType === 'add' || modalType === 'edit') && (<div className="space-y-4"><div><label className="block text-sm font-medium mb-1">账户名称</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">账户类型</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option value="统筹基金">统筹基金</option><option value="个人账户">个人账户</option><option value="大病保险">大病保险</option><option value="其他">其他</option></select></div><div><label className="block text-sm font-medium mb-1">描述</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg" /></div></div>)}
            
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">关闭</button>
              {(modalType === 'add' || modalType === 'edit' || modalType === 'generate') && (<button onClick={handleSubmit} className="px-4 py-2 bg-[#0891B2] text-white rounded-lg hover:bg-[#0e7490]">{modalType === 'generate' ? '生成' : '保存'}</button>)}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
