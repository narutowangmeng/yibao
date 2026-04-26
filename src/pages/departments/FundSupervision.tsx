import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Eye, Zap, AlertTriangle, FileSearch, UserCheck,
  ChevronRight, TrendingUp, Activity, CheckCircle, AlertCircle,
  BarChart3, PieChart, LineChart, ArrowLeft, Brain, Settings, Target, Database,
  Sliders, Gauge, ScanLine, BookOpen, Plus, Edit, Trash2, Play, Pause
} from 'lucide-react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, LineChart as ReLineChart, Line } from 'recharts';
import FundMonitoring from './fund/FundMonitoring';
import FlightInspection from './fund/FlightInspection';
import SmartSupervision from './fund/SmartSupervision';
import ViolationHandling from './fund/ViolationHandling';
import CreditManagement from './fund/CreditManagement';
import ComplaintManagement from './fund/ComplaintManagement';
import DataModelManagement from './fund/DataModelManagement';
import ValueSetManagement from './fund/ValueSetManagement';
import RuleConclusionManagement from './fund/RuleConclusionManagement';
import RuleEngine from '../admin/RuleEngine';
import type { UserRole } from '../../types/roles';
import { canDoManagementAction, getAgencyLevel } from '../../config/managementPermissions';

const modules = [
  {
    id: 'monitor',
    name: '基金监管',
    icon: Shield,
    description: '基金收支监控、风险预警',
    stats: { alert: 23, processing: 8, resolved: 156 },
    features: ['收支监控', '风险预警', '异常监测', '趋势分析', '预警处置']
  },
  {
    id: 'inspection',
    name: '飞行检查',
    icon: Eye,
    description: '现场检查、专项检查',
    stats: { planned: 12, ongoing: 3, completed: 45 },
    features: ['检查计划', '现场检查', '专项检查', '检查结果', '整改跟踪']
  },
  {
    id: 'ai',
    name: '智能监管',
    icon: Zap,
    description: '大数据监控、规则库管理',
    stats: { rules: 156, triggered: 2341, accuracy: 94.5 },
    features: ['规则库', '智能审核', '大数据监控', '模型管理', '规则配置']
  },
  {
    id: 'rule-engine',
    name: '规则引擎',
    icon: Settings,
    description: '药品规则、诊疗项目规则、条件和结论库',
    stats: { rules: 17, conditions: 67, conclusions: 17 },
    features: ['规则定义', '规则条件', '规则结论', '规则来源', '规则检索']
  },
  {
    id: 'violation',
    name: '违规查处',
    icon: AlertTriangle,
    description: '欺诈骗保查处、违规处理',
    stats: { cases: 89, amount: 1256, punished: 67 },
    features: ['案件管理', '违规认定', '处罚执行', '案件跟踪', '统计分析']
  },
  {
    id: 'credit',
    name: '信用管理',
    icon: UserCheck,
    description: '定点机构信用评价、黑名单管理',
    stats: { rated: 1256, blacklist: 23, good: 1189 },
    features: ['信用评价', '黑名单', '红名单', '信用修复', '信用查询']
  },
  {
    id: 'complaint',
    name: '举报投诉',
    icon: FileSearch,
    description: '举报受理、奖励发放',
    stats: { received: 234, processing: 18, rewarded: 89 },
    features: ['举报受理', '线索核查', '奖励发放', '举报统计', '线索管理']
  },
  {
    id: 'datamodel',
    name: '数据模型',
    icon: BarChart3,
    description: '数据元素管理、deId配置',
    stats: { total: 32, active: 32, types: 3 },
    features: ['数据元素', 'deId管理', '数据类型', '标准引用', '模型配置']
  },
  {
    id: 'valueset',
    name: '值集字典',
    icon: PieChart,
    description: '值集管理、valueSetId配置',
    stats: { total: 7, active: 7, items: 542 },
    features: ['值集管理', 'valueSetId', '术语管理', '来源配置', '字典维护']
  },
  {
    id: 'ruleconclusion',
    name: '规则结论',
    icon: CheckCircle,
    description: '规则结果配置、提示管理',
    stats: { total: 8, active: 8, types: 3 },
    features: ['结果配置', '提示管理', '规则绑定', '结果类型', '提示内容']
  },
  {
    id: 'fraudmodel',
    name: '欺诈检测模型',
    icon: Brain,
    description: 'AI模型配置、风险评分规则',
    stats: { models: 5, accuracy: 96.8, cases: 234 },
    features: ['模型参数', '风险评分', '异常识别', '案例库', '模型训练']
  }
];

const stats = [
  { label: '基金总收入', value: '8,256亿', change: '+12.5%', trend: 'up' },
  { label: '基金总支出', value: '6,842亿', change: '+8.3%', trend: 'up' },
  { label: '风险预警', value: '23条', change: '-15%', trend: 'down' },
  { label: '挽回损失', value: '856亿', change: '+28.6%', trend: 'up' }
];

const riskTypeData = [
  { name: '欺诈骗保', value: 35, color: '#EF4444' },
  { name: '过度医疗', value: 28, color: '#F97316' },
  { name: '资源浪费', value: 22, color: '#EAB308' },
  { name: '违规操作', value: 15, color: '#3B82F6' }
];

const monthlyData = [
  { month: '1月', detected: 45, resolved: 38 },
  { month: '2月', detected: 52, resolved: 48 },
  { month: '3月', detected: 38, resolved: 35 },
  { month: '4月', detected: 65, resolved: 58 },
  { month: '5月', detected: 48, resolved: 45 },
  { month: '6月', detected: 72, resolved: 68 }
];

const fraudModels = [
  { id: 'M001', name: '异常报销检测模型', algorithm: '随机森林', threshold: 0.75, status: 'active', accuracy: 94.2 },
  { id: 'M002', name: '虚假住院识别模型', algorithm: 'XGBoost', threshold: 0.82, status: 'active', accuracy: 96.8 },
  { id: 'M003', name: '药品滥用监测模型', algorithm: '神经网络', threshold: 0.68, status: 'paused', accuracy: 91.5 },
];

const riskRules = [
  { id: 'R001', name: '高频就诊规则', dimension: '就诊频率', weight: 25, level: '高', threshold: '月均>8次' },
  { id: 'R002', name: '大额费用规则', dimension: '费用金额', weight: 30, level: '高', threshold: '单次>5000元' },
  { id: 'R003', name: '跨院就诊规则', dimension: '就诊行为', weight: 20, level: '中', threshold: '同日多院' },
  { id: 'R004', name: '药品异常规则', dimension: '用药行为', weight: 25, level: '中', threshold: '超量开药' },
];

const fraudCases = [
  { id: 'C001', type: '虚假住院', amount: 125000, features: '短期多次住院', status: 'confirmed', date: '2024-01-15' },
  { id: 'C002', type: '冒名就医', amount: 68000, features: '身份信息异常', status: 'confirmed', date: '2024-01-12' },
  { id: 'C003', type: '过度医疗', amount: 45000, features: '检查项目过多', status: 'suspected', date: '2024-01-10' },
];

const behaviorPatterns = [
  { id: 'P001', name: '频繁就医模式', description: '短期内多次就诊不同医院', frequency: '高', risk: 'high' },
  { id: 'P002', name: '大额消费模式', description: '单次或累计消费金额异常', frequency: '中', risk: 'high' },
  { id: 'P003', name: '药品套购模式', description: '特定药品多次大量购买', frequency: '中', risk: 'medium' },
];

interface FundSupervisionProps {
  userRole: UserRole;
  userAgency: string;
}

export default function FundSupervision({ userRole, userAgency }: FundSupervisionProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [fraudTab, setFraudTab] = useState('model');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const isProvince = getAgencyLevel(userAgency) === 'province';
  const canEditFundConfig = canDoManagementAction(userRole, userAgency, 'fund-supervision', 'edit');
  const visibleModules = isProvince
    ? modules
    : modules.filter((module) => !['rule-engine', 'datamodel', 'valueset', 'ruleconclusion', 'fraudmodel'].includes(module.id));
  const scopedStats = isProvince
    ? stats
    : [
        { label: '本市基金收入', value: '628亿', change: '+7.2%', trend: 'up' },
        { label: '本市基金支出', value: '511亿', change: '+5.4%', trend: 'up' },
        { label: '本市风险预警', value: '6条', change: '-12%', trend: 'down' },
        { label: '本市追回金额', value: '0.86亿', change: '+9.3%', trend: 'up' },
      ];
  const scopedRiskTypeData = isProvince ? riskTypeData : riskTypeData.slice(0, 3);
  const scopedMonthlyData = isProvince ? monthlyData : monthlyData.slice(-4);

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'monitor':
        return <FundMonitoring />;
      case 'inspection':
        return <FlightInspection />;
      case 'ai':
        return <SmartSupervision />;
      case 'violation':
        return <ViolationHandling />;
      case 'credit':
        return <CreditManagement />;
      case 'complaint':
        return <ComplaintManagement />;
      case 'datamodel':
        return <DataModelManagement />;
      case 'valueset':
        return <ValueSetManagement />;
      case 'ruleconclusion':
        return <RuleConclusionManagement />;
      case 'rule-engine':
        return <RuleEngine />;
      case 'fraudmodel':
        return renderFraudModelContent();
      default:
        return null;
    }
  };

  const renderFraudModelContent = () => (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'model', label: '模型参数', icon: Sliders },
          { id: 'score', label: '风险评分', icon: Gauge },
          { id: 'behavior', label: '异常行为', icon: ScanLine },
          { id: 'cases', label: '案例库', icon: BookOpen },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFraudTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              fraudTab === tab.id ? 'border-cyan-600 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {fraudTab === 'model' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-600" />
                模型配置
              </h3>
              {canEditFundConfig && (
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm">
                  <Plus className="w-4 h-4" />新增模型
                </button>
              )}
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">模型名称</th>
                  <th className="px-4 py-3 text-left text-sm">算法类型</th>
                  <th className="px-4 py-3 text-left text-sm">阈值</th>
                  <th className="px-4 py-3 text-left text-sm">准确率</th>
                  <th className="px-4 py-3 text-left text-sm">状态</th>
                  <th className="px-4 py-3 text-right text-sm">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {fraudModels.map(model => (
                  <tr key={model.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{model.name}</td>
                    <td className="px-4 py-3">{model.algorithm}</td>
                    <td className="px-4 py-3">{model.threshold}</td>
                    <td className="px-4 py-3">{model.accuracy}%</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${model.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {model.status === 'active' ? '运行中' : '已暂停'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        {canEditFundConfig && (
                          <>
                            <button className="p-1.5 text-gray-400 hover:text-cyan-600"><Edit className="w-4 h-4" /></button>
                            {model.status === 'active' ? (
                              <button className="p-1.5 text-gray-400 hover:text-yellow-600"><Pause className="w-4 h-4" /></button>
                            ) : (
                              <button className="p-1.5 text-gray-400 hover:text-green-600"><Play className="w-4 h-4" /></button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">模型性能趋势</h3>
              <ResponsiveContainer width="100%" height={200}>
                <ReLineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="detected" stroke="#0891B2" name="检测数" />
                  <Line type="monotone" dataKey="resolved" stroke="#22C55E" name="确认数" />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">模型参数设置</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">置信度阈值</label>
                  <input type="range" min="0.5" max="0.95" step="0.05" defaultValue="0.75" className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0.5</span>
                    <span>0.75</span>
                    <span>0.95</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">采样频率</label>
                  <select className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option>实时</option>
                    <option>每小时</option>
                    <option>每日</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">训练周期</label>
                  <select className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option>每周</option>
                    <option>每月</option>
                    <option>每季度</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {fraudTab === 'score' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-600" />
                风险评分规则
              </h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm">
                <Plus className="w-4 h-4" />新增规则
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">规则名称</th>
                  <th className="px-4 py-3 text-left text-sm">评分维度</th>
                  <th className="px-4 py-3 text-left text-sm">权重</th>
                  <th className="px-4 py-3 text-left text-sm">风险等级</th>
                  <th className="px-4 py-3 text-left text-sm">触发条件</th>
                  <th className="px-4 py-3 text-right text-sm">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {riskRules.map(rule => (
                  <tr key={rule.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{rule.name}</td>
                    <td className="px-4 py-3">{rule.dimension}</td>
                    <td className="px-4 py-3">{rule.weight}%</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${rule.level === '高' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {rule.level}
                      </span>
                    </td>
                    <td className="px-4 py-3">{rule.threshold}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1.5 text-gray-400 hover:text-cyan-600"><Edit className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
              <p className="text-sm text-red-600">高风险阈值</p>
              <p className="text-3xl font-bold text-red-700 mt-2">≥80分</p>
              <p className="text-xs text-red-500 mt-1">自动触发预警</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
              <p className="text-sm text-yellow-600">中风险阈值</p>
              <p className="text-3xl font-bold text-yellow-700 mt-2">50-79分</p>
              <p className="text-xs text-yellow-500 mt-1">人工复核</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <p className="text-sm text-green-600">低风险阈值</p>
              <p className="text-3xl font-bold text-green-700 mt-2">&lt;50分</p>
              <p className="text-xs text-green-500 mt-1">正常通过</p>
            </div>
          </div>
        </motion.div>
      )}

      {fraudTab === 'behavior' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-cyan-600" />
                异常行为模式库
              </h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm">
                <Plus className="w-4 h-4" />新增模式
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {behaviorPatterns.map(pattern => (
                <div key={pattern.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">{pattern.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{pattern.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${pattern.frequency === '高' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        频率: {pattern.frequency}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${pattern.risk === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        风险: {pattern.risk === 'high' ? '高' : '中'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">实时监测配置</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">就诊行为监测</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">费用异常监测</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">药品使用监测</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">身份冒用监测</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {fraudTab === 'cases' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-600" />
                欺诈案例库
              </h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm">
                <Plus className="w-4 h-4" />录入案例
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">案例编号</th>
                  <th className="px-4 py-3 text-left text-sm">欺诈类型</th>
                  <th className="px-4 py-3 text-left text-sm">涉及金额</th>
                  <th className="px-4 py-3 text-left text-sm">特征标签</th>
                  <th className="px-4 py-3 text-left text-sm">状态</th>
                  <th className="px-4 py-3 text-left text-sm">录入日期</th>
                  <th className="px-4 py-3 text-right text-sm">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {fraudCases.map(caseItem => (
                  <tr key={caseItem.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{caseItem.id}</td>
                    <td className="px-4 py-3">{caseItem.type}</td>
                    <td className="px-4 py-3 text-red-600">¥{caseItem.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">{caseItem.features}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${caseItem.status === 'confirmed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {caseItem.status === 'confirmed' ? '已确认' : '疑似'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{caseItem.date}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1.5 text-gray-400 hover:text-cyan-600"><Edit className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">模型训练</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span>训练进度</span>
                  <span className="text-cyan-600">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-cyan-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm">开始训练</button>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">训练样本</p>
                <p className="text-xl font-bold text-gray-800">12,456</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">验证集</p>
                <p className="text-xl font-bold text-gray-800">2,491</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">江苏省医保监管规则样本</p>
                <p className="text-xl font-bold text-gray-800">1,245</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  if (activeModule) {
    const moduleName = visibleModules.find(m => m.id === activeModule)?.name || '';
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveModule(null)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-medium">{moduleName}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderModuleContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">基金监管司</h1>
          <p className="text-gray-500 mt-1">负责医保基金监管、飞行检查、智能监管、违规查处等工作</p>
          <p className="mt-2 text-sm text-cyan-700">
            {isProvince ? '当前为省局视角，可配置全省规则引擎、数据模型和值集字典。' : '当前为地市视角，重点处置本市预警、案件和投诉，不维护全省主规则。'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">{isProvince ? '省局视角' : '地市视角'}</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{isProvince ? '38人' : '14人'}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {scopedStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</span>
              <span className="text-sm text-gray-400">较上月</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-red-600" />
            风险类型分布
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie
                data={scopedRiskTypeData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
              >
                {scopedRiskTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-600" />
            风险趋势
          </h3>
          <ResponsiveContainer width="100%" height={200}>
                <ReBarChart data={scopedMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="detected" fill="#EF4444" name="发现" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" fill="#22C55E" name="处理" radius={[4, 4, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {visibleModules.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-800 mt-4">{module.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{module.description}</p>
              
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                {module.id === 'monitor' && (
                  <>
                    <div><p className="text-xs text-gray-400">预警</p><p className="text-lg font-semibold text-red-600">{module.stats.alert}</p></div>
                    <div><p className="text-xs text-gray-400">处理中</p><p className="text-lg font-semibold text-orange-500">{module.stats.processing}</p></div>
                    <div><p className="text-xs text-gray-400">已处理</p><p className="text-lg font-semibold text-green-600">{module.stats.resolved}</p></div>
                  </>
                )}
                {module.id === 'inspection' && (
                  <>
                    <div><p className="text-xs text-gray-400">计划</p><p className="text-lg font-semibold text-gray-800">{module.stats.planned}</p></div>
                    <div><p className="text-xs text-gray-400">进行中</p><p className="text-lg font-semibold text-cyan-600">{module.stats.ongoing}</p></div>
                    <div><p className="text-xs text-gray-400">已完成</p><p className="text-lg font-semibold text-green-600">{module.stats.completed}</p></div>
                  </>
                )}
                {module.id === 'ai' && (
                  <>
                    <div><p className="text-xs text-gray-400">规则数</p><p className="text-lg font-semibold text-gray-800">{module.stats.rules}</p></div>
                    <div><p className="text-xs text-gray-400">触发</p><p className="text-lg font-semibold text-cyan-600">{module.stats.triggered}</p></div>
                    <div><p className="text-xs text-gray-400">准确率</p><p className="text-lg font-semibold text-green-600">{module.stats.accuracy}%</p></div>
                  </>
                )}
                {module.id === 'rule-engine' && (
                  <>
                    <div><p className="text-xs text-gray-400">规则数</p><p className="text-lg font-semibold text-gray-800">{module.stats.rules}</p></div>
                    <div><p className="text-xs text-gray-400">条件数</p><p className="text-lg font-semibold text-cyan-600">{module.stats.conditions}</p></div>
                    <div><p className="text-xs text-gray-400">结论数</p><p className="text-lg font-semibold text-green-600">{module.stats.conclusions}</p></div>
                  </>
                )}
                {module.id === 'violation' && (
                  <>
                    <div><p className="text-xs text-gray-400">案件</p><p className="text-lg font-semibold text-gray-800">{module.stats.cases}</p></div>
                    <div><p className="text-xs text-gray-400">金额</p><p className="text-lg font-semibold text-red-600">{module.stats.amount}万</p></div>
                    <div><p className="text-xs text-gray-400">处罚</p><p className="text-lg font-semibold text-orange-500">{module.stats.punished}</p></div>
                  </>
                )}
                {module.id === 'credit' && (
                  <>
                    <div><p className="text-xs text-gray-400">已评价</p><p className="text-lg font-semibold text-gray-800">{module.stats.rated}</p></div>
                    <div><p className="text-xs text-gray-400">黑名单</p><p className="text-lg font-semibold text-red-600">{module.stats.blacklist}</p></div>
                    <div><p className="text-xs text-gray-400">信用好</p><p className="text-lg font-semibold text-green-600">{module.stats.good}</p></div>
                  </>
                )}
                {module.id === 'complaint' && (
                  <>
                    <div><p className="text-xs text-gray-400">收到</p><p className="text-lg font-semibold text-gray-800">{module.stats.received}</p></div>
                    <div><p className="text-xs text-gray-400">处理中</p><p className="text-lg font-semibold text-orange-500">{module.stats.processing}</p></div>
                    <div><p className="text-xs text-gray-400">已奖励</p><p className="text-lg font-semibold text-green-600">{module.stats.rewarded}</p></div>
                  </>
                )}
                {module.id === 'fraudmodel' && (
                  <>
                    <div><p className="text-xs text-gray-400">模型数</p><p className="text-lg font-semibold text-gray-800">{module.stats.models}</p></div>
                    <div><p className="text-xs text-gray-400">准确率</p><p className="text-lg font-semibold text-green-600">{module.stats.accuracy}%</p></div>
                    <div><p className="text-xs text-gray-400">案例</p><p className="text-lg font-semibold text-cyan-600">{module.stats.cases}</p></div>
                  </>
                )}
              </div>

              {activeModule === module.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-100"
                >
                  <p className="text-sm font-medium text-gray-700 mb-2">功能列表</p>
                  <div className="space-y-2">
                    {module.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-red-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-600" />
          风险预警
        </h3>
        <div className="space-y-3">
          {[
                    { level: 'critical', title: '苏州某三级医院报销异常增长320%', desc: '本月报销金额较上月增长320%，存在虚假住院和分解结算嫌疑', amount: '125万' },
            { level: 'high', title: '个人账户频繁大额消费', desc: '检测到3个账户存在异常消费模式，疑似套现行为', amount: '8.5万' },
            { level: 'medium', title: '药品使用异常', desc: '某医生抗生素使用频率高于科室平均水平200%', amount: '1.2万' }
          ].map((item, idx) => (
            <div key={idx} className={`flex items-center gap-4 p-3 rounded-lg ${
              item.level === 'critical' ? 'bg-red-50 border-l-4 border-red-500' :
              item.level === 'high' ? 'bg-orange-50 border-l-4 border-orange-500' :
              'bg-yellow-50 border-l-4 border-yellow-500'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${
                item.level === 'critical' ? 'text-red-600' :
                item.level === 'high' ? 'text-orange-600' :
                'text-yellow-600'
              }`} />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <span className="text-sm font-semibold text-red-600">¥{item.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
