import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Shield, TrendingDown, Eye, Search, Filter,
  ChevronDown, Download, FileText, CheckCircle, XCircle, Clock,
  Building2, User, AlertOctagon, Activity, BarChart3, PieChart,
  Zap, Lock, Unlock, RefreshCw, Printer, ArrowRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  Legend
} from 'recharts';

// 风险预警类型
interface RiskAlert {
  id: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  type: 'fraud' | 'abuse' | 'waste' | 'violation' | 'anomaly';
  title: string;
  description: string;
  institution?: string;
  patient?: string;
  amount: number;
  status: 'new' | 'processing' | 'resolved' | 'ignored';
  createdAt: string;
  assignedTo?: string;
  evidence?: string[];
}

// 智能审核规则
interface AuditRule {
  id: string;
  name: string;
  category: 'drug' | 'treatment' | 'diagnosis' | 'fee' | 'behavior';
  description: string;
  status: 'active' | 'disabled';
  triggerCount: number;
  accuracy: number;
  lastUpdated: string;
}

// 飞行检查记录
interface InspectionRecord {
  id: string;
  institution: string;
  type: 'routine' | 'special' | 'flight' | 'followup';
  date: string;
  inspectors: string[];
  findings: number;
  amountInvolved: number;
  status: 'ongoing' | 'completed' | 'closed';
  result?: 'pass' | 'fail' | 'rectify';
}

// 风险类型标签
const riskTypeLabels: Record<string, { label: string; color: string; icon: any }> = {
  fraud: { label: '欺诈骗保', color: 'bg-red-100 text-red-700', icon: AlertOctagon },
  abuse: { label: '过度医疗', color: 'bg-orange-100 text-orange-700', icon: Activity },
  waste: { label: '资源浪费', color: 'bg-yellow-100 text-yellow-700', icon: TrendingDown },
  violation: { label: '违规操作', color: 'bg-blue-100 text-blue-700', icon: AlertTriangle },
  anomaly: { label: '异常行为', color: 'bg-purple-100 text-purple-700', icon: Eye },
};

const levelLabels: Record<string, { label: string; color: string; value: number }> = {
  critical: { label: '紧急', color: 'bg-red-500', value: 4 },
  high: { label: '高危', color: 'bg-orange-500', value: 3 },
  medium: { label: '中危', value: 2, color: 'bg-yellow-500' },
  low: { label: '低危', color: 'bg-blue-500', value: 1 },
};

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  new: { label: '待处理', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  processing: { label: '处理中', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  resolved: { label: '已解决', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  ignored: { label: '已忽略', color: 'bg-gray-100 text-gray-700', icon: XCircle },
};

// 模拟数据 - 风险预警
const mockAlerts: RiskAlert[] = [
  { 
    id: 'ALT001', 
    level: 'critical', 
    type: 'fraud', 
    title: '某医院报销异常增长', 
    description: '本月报销金额较上月增长320%，存在虚假住院嫌疑',
    institution: '北京协和医院',
    amount: 1250000,
    status: 'new',
    createdAt: '2024-12-21 14:30',
    evidence: ['住院记录异常', '费用明细异常', '药品使用异常']
  },
  { 
    id: 'ALT002', 
    level: 'high', 
    type: 'abuse', 
    title: '个人账户频繁大额消费', 
    description: '检测到3个账户存在异常消费模式，疑似套现行为',
    patient: '参保人A',
    amount: 85000,
    status: 'processing',
    createdAt: '2024-12-21 10:15',
    assignedTo: '审核员A',
    evidence: ['消费频次异常', '消费金额异常']
  },
  { 
    id: 'ALT003', 
    level: 'medium', 
    type: 'violation', 
    title: '定点医疗机构资质即将到期', 
    description: '12家机构资质将在30天内到期，需及时提醒续签',
    amount: 0,
    status: 'new',
    createdAt: '2024-12-20 16:00',
  },
  { 
    id: 'ALT004', 
    level: 'high', 
    type: 'fraud', 
    title: '疑似挂床住院', 
    description: '某医院夜间住院率低于30%，存在挂床住院嫌疑',
    institution: '北京大学人民医院',
    amount: 560000,
    status: 'processing',
    createdAt: '2024-12-20 09:30',
    assignedTo: '审核员B',
    evidence: ['夜间查房记录', '住院人员签到记录']
  },
  { 
    id: 'ALT005', 
    level: 'low', 
    type: 'anomaly', 
    title: '药品使用异常', 
    description: '某医生抗生素使用频率高于科室平均水平200%',
    institution: '北京朝阳医院',
    amount: 12000,
    status: 'resolved',
    createdAt: '2024-12-19 11:20',
    assignedTo: '审核员A',
  },
];

// 模拟数据 - 审核规则
const mockRules: AuditRule[] = [
  { id: 'R001', name: '药品限二线使用', category: 'drug', description: '限制二线药品的使用条件', status: 'active', triggerCount: 1256, accuracy: 94.5, lastUpdated: '2024-12-01' },
  { id: 'R002', name: '重复收费检查', category: 'fee', description: '检测同一项目重复收费', status: 'active', triggerCount: 3421, accuracy: 98.2, lastUpdated: '2024-12-01' },
  { id: 'R003', name: '超标准收费', category: 'fee', description: '检测超过标准价格的收费项目', status: 'active', triggerCount: 892, accuracy: 91.3, lastUpdated: '2024-11-28' },
  { id: 'R004', name: '过度诊疗', category: 'treatment', description: '检测不必要的检查和治疗', status: 'active', triggerCount: 2156, accuracy: 87.6, lastUpdated: '2024-12-05' },
  { id: 'R005', name: '虚假住院', category: 'behavior', description: '检测挂床住院等违规行为', status: 'active', triggerCount: 567, accuracy: 92.1, lastUpdated: '2024-12-10' },
];

// 模拟数据 - 飞行检查
const mockInspections: InspectionRecord[] = [
  { id: 'INS001', institution: '北京协和医院', type: 'flight', date: '2024-12-20', inspectors: ['张检查员', '李检查员'], findings: 3, amountInvolved: 125000, status: 'completed', result: 'rectify' },
  { id: 'INS002', institution: '北京大学人民医院', type: 'special', date: '2024-12-18', inspectors: ['王检查员', '赵检查员'], findings: 1, amountInvolved: 45000, status: 'completed', result: 'pass' },
  { id: 'INS003', institution: '北京朝阳医院', type: 'routine', date: '2024-12-15', inspectors: ['张检查员'], findings: 5, amountInvolved: 280000, status: 'ongoing' },
  { id: 'INS004', institution: '北京天坛医院', type: 'followup', date: '2024-12-10', inspectors: ['李检查员', '王检查员'], findings: 0, amountInvolved: 0, status: 'closed', result: 'pass' },
];

// 图表数据
const riskDistributionData = [
  { name: '欺诈骗保', value: 35, color: '#EF4444' },
  { name: '过度医疗', value: 28, color: '#F97316' },
  { name: '资源浪费', value: 22, color: '#EAB308' },
  { name: '违规操作', value: 15, color: '#3B82F6' },
];

const monthlyTrendData = [
  { month: '1月', detected: 45, resolved: 38, amount: 280 },
  { month: '2月', detected: 52, resolved: 48, amount: 320 },
  { month: '3月', detected: 38, resolved: 35, amount: 210 },
  { month: '4月', detected: 65, resolved: 58, amount: 450 },
  { month: '5月', detected: 48, resolved: 45, amount: 380 },
  { month: '6月', detected: 72, resolved: 68, amount: 520 },
];

const institutionRiskData = [
  { name: '协和医院', risk: 85 },
  { name: '人民医院', risk: 65 },
  { name: '朝阳医院', risk: 45 },
  { name: '天坛医院', risk: 35 },
  { name: '安贞医院', risk: 25 },
];

export default function Supervision() {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'audit' | 'inspection'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAlertDetail, setShowAlertDetail] = useState<RiskAlert | null>(null);
  const [showNewInspection, setShowNewInspection] = useState(false);

  // 统计数据
  const stats = {
    totalAlerts: mockAlerts.length,
    critical: mockAlerts.filter(a => a.level === 'critical').length,
    high: mockAlerts.filter(a => a.level === 'high').length,
    pending: mockAlerts.filter(a => a.status === 'new').length,
    processing: mockAlerts.filter(a => a.status === 'processing').length,
    resolved: mockAlerts.filter(a => a.status === 'resolved').length,
    totalAmount: mockAlerts.reduce((sum, a) => sum + a.amount, 0),
    interceptedAmount: 8560000,
  };

  // 筛选预警
  const filteredAlerts = mockAlerts.filter(alert => {
    const matchSearch = alert.title.includes(searchTerm) || 
                       (alert.institution && alert.institution.includes(searchTerm));
    const matchLevel = filterLevel === 'all' || alert.level === filterLevel;
    const matchStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchSearch && matchLevel && matchStatus;
  });

  const handleAlertAction = (alert: RiskAlert, action: 'process' | 'resolve' | 'ignore') => {
    setShowAlertDetail(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#134E4A]">基金监管</h2>
          <p className="text-sm text-gray-500 mt-1">智能风控、风险预警、飞行检查一体化监管平台</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} />
            导出报告
          </button>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'overview', label: '监管概览', icon: Shield },
          { id: 'alerts', label: '风险预警', icon: AlertTriangle },
          { id: 'audit', label: '智能审核', icon: Zap },
          { id: 'inspection', label: '飞行检查', icon: Eye },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id ? 'text-[#0891B2]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={18} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="supervisionTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0891B2]" />
              )}
            </button>
          );
        })}
      </div>

      {/* 监管概览 */}
      {activeTab === 'overview' && (
        <>
          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="text-red-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">风险预警</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAlerts}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2 text-xs">
                <span className="text-red-600">紧急 {stats.critical}</span>
                <span className="text-orange-600">高危 {stats.high}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <TrendingDown className="text-amber-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">风险金额</p>
                  <p className="text-2xl font-bold text-gray-900">¥{(stats.totalAmount/10000).toFixed(0)}万</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">本月累计</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Shield className="text-emerald-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">已拦截</p>
                  <p className="text-2xl font-bold text-gray-900">¥{(stats.interceptedAmount/10000).toFixed(0)}万</p>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-3">挽回损失</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Zap className="text-blue-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">智能审核</p>
                  <p className="text-2xl font-bold text-gray-900">{mockRules.length}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">规则运行中</p>
            </motion.div>
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <h3 className="font-semibold text-[#134E4A] mb-4 flex items-center gap-2">
                <PieChart size={18} className="text-[#0891B2]" />
                风险类型分布
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <RePieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <h3 className="font-semibold text-[#134E4A] mb-4 flex items-center gap-2">
                <Activity size={18} className="text-[#0891B2]" />
                风险趋势
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={monthlyTrendData}>
                  <defs>
                    <linearGradient id="colorDetected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0891B2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0891B2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="detected" stroke="#0891B2" fillOpacity={1} fill="url(#colorDetected)" name="发现风险" />
                  <Area type="monotone" dataKey="resolved" stroke="#22C55E" fillOpacity={0} name="已处理" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* 机构风险排名 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <h3 className="font-semibold text-[#134E4A] mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-[#0891B2]" />
              医疗机构风险指数
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={institutionRiskData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="risk" fill="#0891B2" radius={[0, 4, 4, 0]} name="风险指数" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      )}

      {/* 风险预警 */}
      {activeTab === 'alerts' && (
        <>
          {/* 筛选栏 */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="搜索预警标题或机构"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:border-[#0891B2] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20"
              />
            </div>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="rounded-lg border border-gray-200 py-2 pl-9 pr-8 focus:border-[#0891B2] focus:outline-none appearance-none bg-white min-w-[120px]"
              >
                <option value="all">全部等级</option>
                <option value="critical">紧急</option>
                <option value="high">高危</option>
                <option value="medium">中危</option>
                <option value="low">低危</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-lg border border-gray-200 py-2 pl-9 pr-8 focus:border-[#0891B2] focus:outline-none appearance-none bg-white min-w-[120px]"
              >
                <option value="all">全部状态</option>
                <option value="new">待处理</option>
                <option value="processing">处理中</option>
                <option value="resolved">已解决</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>

          {/* 预警列表 */}
          <div className="space-y-3">
            {filteredAlerts.map((alert, index) => {
              const TypeIcon = riskTypeLabels[alert.type].icon;
              const StatusIcon = statusLabels[alert.status].icon;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border-l-4 bg-white shadow-sm ${
                    alert.level === 'critical' ? 'border-red-500' :
                    alert.level === 'high' ? 'border-orange-500' :
                    alert.level === 'medium' ? 'border-yellow-500' : 'border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${riskTypeLabels[alert.type].color}`}>
                          <TypeIcon size={12} />
                          {riskTypeLabels[alert.type].label}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusLabels[alert.status].color}`}>
                          <StatusIcon size={12} />
                          {statusLabels[alert.status].label}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full text-white ${levelLabels[alert.level].color}`}>
                          {levelLabels[alert.level].label}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        {alert.institution && <span>机构: {alert.institution}</span>}
                        {alert.patient && <span>参保人: {alert.patient}</span>}
                        {alert.amount > 0 && <span className="text-red-600">涉及金额: ¥{alert.amount.toLocaleString()}</span>}
                        <span>时间: {alert.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setShowAlertDetail(alert)}
                        className="p-2 rounded-lg text-gray-500 hover:text-[#0891B2] hover:bg-[#0891B2]/10 transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                      {alert.status === 'new' && (
                        <button 
                          onClick={() => handleAlertAction(alert, 'process')}
                          className="px-3 py-1.5 rounded-lg bg-[#0891B2] text-white text-sm hover:bg-[#0891B2]/90 transition-colors"
                        >
                          处理
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* 智能审核 */}
      {activeTab === 'audit' && (
        <>
          <div className="bg-gradient-to-r from-[#0891B2]/10 to-[#22D3EE]/10 rounded-xl p-6 border border-[#0891B2]/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#134E4A] flex items-center gap-2">
                  <Zap size={20} className="text-[#0891B2]" />
                  智能审核系统
                </h3>
                <p className="text-sm text-gray-600 mt-1">基于AI大模型的医保基金智能审核，实现事前预防、事中拦截、事后追溯</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0891B2] text-white rounded-lg hover:bg-[#0891B2]/90 transition-colors">
                  <RefreshCw size={16} />
                  更新规则库
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {mockRules.map((rule, index) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    rule.status === 'active' ? 'bg-green-50' : 'bg-gray-50'
                  }`}>
                    {rule.status === 'active' ? (
                      <Lock size={20} className="text-green-600" />
                    ) : (
                      <Unlock size={20} className="text-gray-400" />
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {rule.status === 'active' ? '运行中' : '已停用'}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{rule.name}</h4>
                <p className="text-sm text-gray-500 mb-3">{rule.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>触发: {rule.triggerCount}次</span>
                  <span className="text-green-600">准确率: {rule.accuracy}%</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">更新: {rule.lastUpdated}</span>
                  <button className="text-xs text-[#0891B2] hover:underline">配置</button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* 飞行检查 */}
      {activeTab === 'inspection' && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button 
                onClick={() => setShowNewInspection(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0891B2] text-white rounded-lg hover:bg-[#0891B2]/90 transition-colors"
              >
                <Eye size={16} />
                发起检查
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">检查单号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">医疗机构</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">检查类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">检查日期</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">发现问题</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">涉及金额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">结果</th>
                </tr>
              </thead>
              <tbody>
                {mockInspections.map((inspection, index) => (
                  <motion.tr
                    key={inspection.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{inspection.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{inspection.institution}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        inspection.type === 'flight' ? 'bg-purple-100 text-purple-700' :
                        inspection.type === 'special' ? 'bg-blue-100 text-blue-700' :
                        inspection.type === 'routine' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {inspection.type === 'flight' ? '飞行检查' :
                         inspection.type === 'special' ? '专项检查' :
                         inspection.type === 'routine' ? '日常检查' : '复查'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{inspection.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{inspection.findings} 项</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {inspection.amountInvolved > 0 ? `¥${inspection.amountInvolved.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        inspection.status === 'ongoing' ? 'bg-yellow-100 text-yellow-700' :
                        inspection.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {inspection.status === 'ongoing' ? '进行中' :
                         inspection.status === 'completed' ? '已完成' : '已结案'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {inspection.result && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                          inspection.result === 'pass' ? 'bg-green-100 text-green-700' :
                          inspection.result === 'fail' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {inspection.result === 'pass' ? '通过' :
                           inspection.result === 'fail' ? '未通过' : '需整改'}
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 预警详情弹窗 */}
      <AnimatePresence>
        {showAlertDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${levelLabels[showAlertDetail.level].color}`}>
                      {levelLabels[showAlertDetail.level].label}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${riskTypeLabels[showAlertDetail.type].color}`}>
                      {riskTypeLabels[showAlertDetail.type].label}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#134E4A]">{showAlertDetail.title}</h3>
                </div>
                <button
                  onClick={() => setShowAlertDetail(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <XCircle size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">风险描述</h4>
                  <p className="text-sm text-gray-600">{showAlertDetail.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">基本信息</h4>
                    <div className="space-y-2 text-sm">
                      {showAlertDetail.institution && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">涉及机构</span>
                          <span>{showAlertDetail.institution}</span>
                        </div>
                      )}
                      {showAlertDetail.patient && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">涉及人员</span>
                          <span>{showAlertDetail.patient}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">涉及金额</span>
                        <span className="font-bold text-red-600">¥{showAlertDetail.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">发现时间</span>
                        <span>{showAlertDetail.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">处理信息</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">当前状态</span>
                        <span className={statusLabels[showAlertDetail.status].color}>
                          {statusLabels[showAlertDetail.status].label}
                        </span>
                      </div>
                      {showAlertDetail.assignedTo && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">处理人</span>
                          <span>{showAlertDetail.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {showAlertDetail.evidence && showAlertDetail.evidence.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">证据材料</h4>
                    <div className="space-y-2">
                      {showAlertDetail.evidence.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <FileText size={16} className="text-[#0891B2]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowAlertDetail(null)}
                  className="rounded-lg px-4 py-2 text-gray-600 transition hover:bg-gray-100"
                >
                  关闭
                </button>
                {showAlertDetail.status === 'new' && (
                  <>
                    <button
                      onClick={() => handleAlertAction(showAlertDetail, 'ignore')}
                      className="rounded-lg px-4 py-2 text-gray-600 border border-gray-200 transition hover:bg-gray-50"
                    >
                      忽略
                    </button>
                    <button
                      onClick={() => handleAlertAction(showAlertDetail, 'process')}
                      className="rounded-lg bg-[#0891B2] px-4 py-2 text-white transition hover:bg-[#0891B2]/90"
                    >
                      开始处理
                    </button>
                  </>
                )}
                {showAlertDetail.status === 'processing' && (
                  <button
                    onClick={() => handleAlertAction(showAlertDetail, 'resolve')}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                  >
                    标记已解决
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 发起检查弹窗 */}
      <AnimatePresence>
        {showNewInspection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
            >
              <h3 className="text-lg font-semibold text-[#134E4A] mb-4">发起飞行检查</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">检查机构 *</label>
                  <select className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#0891B2] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20">
                    <option>北京协和医院</option>
                    <option>北京大学人民医院</option>
                    <option>北京朝阳医院</option>
                    <option>北京天坛医院</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">检查类型 *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'flight', label: '飞行检查', desc: '突击检查' },
                      { id: 'special', label: '专项检查', desc: '针对特定问题' },
                      { id: 'routine', label: '日常检查', desc: '定期检查' },
                      { id: 'followup', label: '复查', desc: '整改复查' },
                    ].map((type) => (
                      <label key={type.id} className="cursor-pointer">
                        <input type="radio" name="inspectionType" value={type.id} className="sr-only" defaultChecked={type.id === 'flight'} />
                        <div className="border-2 border-gray-200 rounded-lg p-3 hover:border-[#0891B2] transition-colors has-[:checked]:border-[#0891B2] has-[:checked]:bg-[#0891B2]/5">
                          <p className="font-medium text-gray-900">{type.label}</p>
                          <p className="text-xs text-gray-500">{type.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">检查人员</label>
                  <select className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#0891B2] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20">
                    <option>张检查员、李检查员</option>
                    <option>王检查员、赵检查员</option>
                    <option>张检查员</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">检查重点</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#0891B2] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20 resize-none"
                    placeholder="请输入检查重点..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowNewInspection(false)}
                  className="rounded-lg px-4 py-2 text-gray-600 transition hover:bg-gray-100"
                >
                  取消
                </button>
                <button
                  onClick={() => setShowNewInspection(false)}
                  className="rounded-lg bg-[#0891B2] px-4 py-2 text-white transition hover:bg-[#0891B2]/90"
                >
                  发起检查
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
