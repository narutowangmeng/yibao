import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, CreditCard, FileText, Search, Plus, CheckCircle,
  Clock, Building2, User, Eye, Edit2, Upload,
  Printer, Shield, AlertTriangle, Briefcase, ArrowRight, FilePlus,
  Receipt, Calculator, RotateCcw, FileX, PauseCircle, Ban,
  Baby, GraduationCap, Globe, ShieldCheck, Wallet, Bell,
  Phone, MapPin, Calendar, Stethoscope, Pill, FileCheck,
  FileSearch, Send, Coins, ArrowLeftRight, UserPlus,
  Building, Home, Plane, Activity, Scan,
  HeartPulse, RefreshCcw, ScrollText, PlaneLanding,
  LayoutGrid, ChevronRight, TrendingUp, TrendingDown,
  ArrowLeft, Scale, BookOpen, TrendingUp as TrendingUpIcon
} from 'lucide-react';

// 导入子模块
import NewEnrollment from './modules/NewEnrollment';
import RenewalEnrollment from './modules/RenewalEnrollment';
import BatchImport from './modules/BatchImport';
import EnrollmentQuery from './modules/EnrollmentQuery';
import PaymentCalc from './modules/PaymentCalc';
import AnnualPayment from './modules/AnnualPayment';
import SupplementPayment from './modules/SupplementPayment';
import LumpSumPayment from './modules/LumpSumPayment';
import RefundProcess from './modules/RefundProcess';
import DeferApplication from './modules/DeferApplication';
import ExemptionApply from './modules/ExemptionApply';
import PaymentNotice from './modules/PaymentNotice';
import ReminderManage from './modules/ReminderManage';
import ArrivalConfirm from './modules/ArrivalConfirm';
import OutpatientReimbursement from './modules/OutpatientReimbursement';
import SpecialOutpatient from './modules/SpecialOutpatient';
import InpatientReimbursement from './modules/InpatientReimbursement';
import MaternityReimbursement from './modules/MaternityReimbursement';
import EmergencyReimbursement from './modules/EmergencyReimbursement';
import RemoteLocalReimbursement from './modules/RemoteLocalReimbursement';
import RemoteTransferReimbursement from './modules/RemoteTransferReimbursement';
import SpecialDrugReimbursement from './modules/SpecialDrugReimbursement';
import MajorIllnessReimbursement from './modules/MajorIllnessReimbursement';
import InfoChange from './modules/InfoChange';
import NameChange from './modules/NameChange';
import IdCardChange from './modules/IdCardChange';
import TypeChange from './modules/TypeChange';
import StatusChange from './modules/StatusChange';
import TransferApply from './modules/TransferApply';
import LocalTransfer from './modules/LocalTransfer';
import CrossRegionTransfer from './modules/CrossRegionTransfer';
import BusinessQuery from './modules/BusinessQuery';
import EnterpriseManagement from './modules/EnterpriseManagement';
import FinanceReconcile from './modules/FinanceReconcile';
import FinanceLedger from './modules/FinanceLedger';
import FinanceReport from './modules/FinanceReport';

// 功能模块配置
const functionModules = [
  {
    id: 'enrollment',
    title: '参保登记',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    description: '各类人员参保业务办理',
    stats: { today: 156, total: 2340 },
    features: [
      { id: 'new_enrollment', label: '新参保登记', icon: UserPlus, desc: '首次参加医保登记', component: 'NewEnrollment' },
      { id: 'renewal', label: '续保登记', icon: RefreshCcw, desc: '断缴后重新参保', component: 'RenewalEnrollment' },
      { id: 'urban_rural', label: '城乡居民参保', icon: Home, desc: '城镇居民/农村居民参保', component: 'NewEnrollment' },
      { id: 'employee', label: '城镇职工参保', icon: Building2, desc: '企业职工/机关事业单位参保', component: 'NewEnrollment' },
      { id: 'flexible', label: '灵活就业参保', icon: Briefcase, desc: '个体户/自由职业者参保', component: 'NewEnrollment' },
      { id: 'newborn', label: '新生儿参保', icon: Baby, desc: '出生医学证明参保', component: 'NewEnrollment' },
      { id: 'veteran', label: '退役军人参保', icon: ShieldCheck, desc: '退役安置人员参保', component: 'NewEnrollment' },
      { id: 'student', label: '学生参保', icon: GraduationCap, desc: '大中小学生参保', component: 'NewEnrollment' },
      { id: 'batch', label: '批量参保导入', icon: Upload, desc: '企业批量导入参保', component: 'BatchImport' },
      { id: 'enrollment_query', label: '参保信息查询', icon: Search, desc: '查询参保状态信息', component: 'EnrollmentQuery' },
    ]
  },
  {
    id: 'payment',
    title: '缴费核定',
    icon: CreditCard,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-600',
    description: '缴费计算、催缴、到账管理',
    stats: { today: 89, total: 15600 },
    features: [
      { id: 'payment_calc', label: '缴费基数核定', icon: Calculator, desc: '核定缴费基数和比例', component: 'PaymentCalc' },
      { id: 'annual_payment', label: '年度正常缴费', icon: Calendar, desc: '正常年度缴费核定', component: 'AnnualPayment' },
      { id: 'supplement', label: '补缴核定', icon: Plus, desc: '断缴期间补缴计算', component: 'SupplementPayment' },
      { id: 'lump_sum', label: '趸缴核定', icon: Coins, desc: '一次性缴清剩余年限', component: 'LumpSumPayment' },
      { id: 'refund', label: '退费处理', icon: Receipt, desc: '多缴错缴退费', component: 'RefundProcess' },
      { id: 'defer', label: '缓缴申请', icon: PauseCircle, desc: '困难企业缓缴申请', component: 'DeferApplication' },
      { id: 'exemption', label: '免缴认定', icon: Ban, desc: '低保特困免缴认定', component: 'ExemptionApply' },
      { id: 'notice', label: '缴费通知单', icon: ScrollText, desc: '生成缴费通知单', component: 'PaymentNotice' },
      { id: 'reminder', label: '催缴管理', icon: Bell, desc: '短信电话上门催缴', component: 'ReminderManage' },
      { id: 'arrival', label: '到账确认', icon: CheckCircle, desc: '银行税务到账确认', component: 'ArrivalConfirm' },
    ]
  },
  {
    id: 'reimbursement',
    title: '费用报销',
    icon: FileText,
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-600',
    description: '各类医疗费用报销受理',
    stats: { today: 45, total: 8900 },
    features: [
      { id: 'outpatient', label: '门诊报销', icon: Stethoscope, desc: '普通门诊费用报销', component: 'OutpatientReimbursement' },
      { id: 'outpatient_special', label: '门诊慢特病', icon: HeartPulse, desc: '门诊慢性病特殊病报销', component: 'SpecialOutpatient' },
      { id: 'inpatient', label: '住院报销', icon: Building2, desc: '住院费用报销', component: 'InpatientReimbursement' },
      { id: 'maternity', label: '生育报销', icon: Baby, desc: '生育住院费用报销', component: 'MaternityReimbursement' },
      { id: 'emergency', label: '急诊报销', icon: AlertTriangle, desc: '急诊抢救费用报销', component: 'EmergencyReimbursement' },
      { id: 'remote_local', label: '异地安置报销', icon: Home, desc: '异地安置人员报销', component: 'RemoteLocalReimbursement' },
      { id: 'remote_transfer', label: '异地转诊报销', icon: ArrowLeftRight, desc: '转诊转院费用报销', component: 'RemoteTransferReimbursement' },
      { id: 'special_drug', label: '特殊药品报销', icon: Pill, desc: '特药定点药店报销', component: 'SpecialDrugReimbursement' },
      { id: 'major_illness', label: '大病保险报销', icon: Shield, desc: '大病保险二次报销', component: 'MajorIllnessReimbursement' },
    ]
  },
  {
    id: 'change',
    title: '信息变更',
    icon: Edit2,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-600',
    description: '参保信息变更维护',
    stats: { today: 23, total: 5600 },
    features: [
      { id: 'name_change', label: '姓名变更', icon: User, desc: '姓名信息更正', component: 'NameChange' },
      { id: 'idcard_change', label: '身份证变更', icon: Scan, desc: '身份证号更正', component: 'IdCardChange' },
      { id: 'phone_change', label: '电话变更', icon: Phone, desc: '联系电话变更', component: 'InfoChange' },
      { id: 'address_change', label: '地址变更', icon: MapPin, desc: '居住地址变更', component: 'InfoChange' },
      { id: 'bank_change', label: '银行卡变更', icon: CreditCard, desc: '代扣银行卡变更', component: 'InfoChange' },
      { id: 'type_change', label: '参保类型变更', icon: ArrowRight, desc: '居民转职工等', component: 'TypeChange' },
      { id: 'unit_change', label: '工作单位变更', icon: Building2, desc: '单位转移接续', component: 'InfoChange' },
      { id: 'status_change', label: '参保状态变更', icon: Activity, desc: '正常暂停终止', component: 'StatusChange' },
    ]
  },
  {
    id: 'transfer',
    title: '关系转移',
    icon: ArrowLeftRight,
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-600',
    description: '医保关系转移接续',
    stats: { today: 12, total: 3400 },
    features: [
      { id: 'local_transfer', label: '本地转移', icon: ArrowRight, desc: '市内医保转移', component: 'LocalTransfer' },
      { id: 'cross_region', label: '跨省转移', icon: Plane, desc: '跨省医保转移接续', component: 'CrossRegionTransfer' },
      { id: 'transfer_in', label: '转入申请', icon: ArrowLeftRight, desc: '医保关系转入', component: 'TransferApply' },
      { id: 'transfer_out', label: '转出申请', icon: ArrowLeftRight, desc: '医保关系转出', component: 'TransferApply' },
      { id: 'account_transfer', label: '账户转移', icon: Wallet, desc: '个人账户资金转移' },
    ]
  },
  {
    id: 'query',
    title: '业务查询',
    icon: Search,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-600',
    description: '综合业务信息查询',
    stats: { today: 234, total: 45600 },
    features: [
      { id: 'enrollment_info', label: '参保信息查询', icon: Users, desc: '参保状态信息', component: 'BusinessQuery' },
      { id: 'payment_history', label: '缴费历史查询', icon: Clock, desc: '历年缴费记录', component: 'BusinessQuery' },
      { id: 'reimburse_history', label: '报销历史查询', icon: FileText, desc: '历年报销记录', component: 'BusinessQuery' },
      { id: 'account_balance', label: '账户余额查询', icon: Wallet, desc: '个人账户余额', component: 'BusinessQuery' },
      { id: 'directory_query', label: '目录查询', icon: Search, desc: '药品诊疗目录' },
      { id: 'policy_query', label: '政策查询', icon: FileText, desc: '医保政策文件' },
    ]
  },
  {
    id: 'enterprise',
    title: '企业管理',
    icon: Building,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-600',
    description: '企业信息维护、参保管理',
    stats: { today: 12, total: 5680 },
    features: [
      { id: 'enterprise_management', label: '企业管理', icon: Building, desc: '企业信息维护、参保管理', component: 'EnterpriseManagement' }
    ]
  },
  {
    id: 'finance',
    title: '财务管理',
    icon: Wallet,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-600',
    description: '自动对账、总账管理',
    stats: { today: 8, total: 2450 },
    features: [
      { id: 'reconcile', label: '自动对账', icon: Scale, desc: '对账规则配置与执行', component: 'FinanceReconcile' },
      { id: 'ledger', label: '总账管理', icon: BookOpen, desc: '科目管理与明细查询', component: 'FinanceLedger' },
      { id: 'fund_report', label: '基金报表', icon: TrendingUpIcon, desc: '财务报表生成与分析', component: 'FinanceReport' }
    ]
  }
];

// 快捷操作数据
const quickActions = [
  { id: 'new_enrollment', label: '新参保登记', icon: UserPlus, color: 'bg-blue-500', moduleId: 'enrollment', featureId: 'new_enrollment' },
  { id: 'payment_calc', label: '缴费核定', icon: Calculator, color: 'bg-emerald-500', moduleId: 'payment', featureId: 'payment_calc' },
  { id: 'outpatient', label: '门诊报销', icon: Stethoscope, color: 'bg-violet-500', moduleId: 'reimbursement', featureId: 'outpatient' },
  { id: 'enrollment_info', label: '信息查询', icon: Search, color: 'bg-cyan-500', moduleId: 'query', featureId: 'enrollment_info' },
];

// 待办事项数据
const todoItems = [
  { id: 1, title: '待审核参保登记', count: 23, type: 'enrollment', color: 'bg-blue-100 text-blue-700' },
  { id: 2, title: '待核定缴费', count: 89, type: 'payment', color: 'bg-emerald-100 text-emerald-700' },
  { id: 3, title: '待受理报销', count: 45, type: 'reimbursement', color: 'bg-violet-100 text-violet-700' },
  { id: 4, title: '待处理变更', count: 12, type: 'change', color: 'bg-amber-100 text-amber-700' },
];

export default function OperatorWorkbench() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 过滤功能模块
  const filteredModules = functionModules.filter(module =>
    module.title.includes(searchTerm) ||
    module.description.includes(searchTerm) ||
    module.features.some(f => f.label.includes(searchTerm))
  );

  // 处理功能点击
  const handleFeatureClick = (moduleId: string, featureId: string, component?: string) => {
    if (component) {
      setSelectedModule(moduleId);
      setSelectedFeature(featureId);
    } else {
      // 未实现的功能显示提示
      alert('该功能正在开发中...');
    }
  };

  // 处理快捷操作点击
  const handleQuickAction = (action: typeof quickActions[0]) => {
    handleFeatureClick(action.moduleId, action.featureId, 'NewEnrollment');
  };

  // 返回工作台
  const handleBack = () => {
    setSelectedModule(null);
    setSelectedFeature(null);
  };

  // 渲染子模块内容
  const renderFeatureContent = () => {
    if (!selectedModule || !selectedFeature) return null;

    const module = functionModules.find(m => m.id === selectedModule);
    const feature = module?.features.find(f => f.id === selectedFeature);

    if (!feature?.component) return null;

    switch (feature.component) {
      case 'NewEnrollment':
        return <NewEnrollment onBack={handleBack} />;
      case 'RenewalEnrollment':
        return <RenewalEnrollment onBack={handleBack} />;
      case 'BatchImport':
        return <BatchImport onBack={handleBack} />;
      case 'EnrollmentQuery':
        return <EnrollmentQuery onBack={handleBack} />;
      case 'PaymentCalc':
        return <PaymentCalc onBack={handleBack} />;
      case 'AnnualPayment':
        return <AnnualPayment onBack={handleBack} />;
      case 'SupplementPayment':
        return <SupplementPayment onBack={handleBack} />;
      case 'LumpSumPayment':
        return <LumpSumPayment onBack={handleBack} />;
      case 'RefundProcess':
        return <RefundProcess onBack={handleBack} />;
      case 'DeferApplication':
        return <DeferApplication onBack={handleBack} />;
      case 'ExemptionApply':
        return <ExemptionApply onBack={handleBack} />;
      case 'PaymentNotice':
        return <PaymentNotice onBack={handleBack} />;
      case 'ReminderManage':
        return <ReminderManage onBack={handleBack} />;
      case 'ArrivalConfirm':
        return <ArrivalConfirm onBack={handleBack} />;
      case 'OutpatientReimbursement':
        return <OutpatientReimbursement onBack={handleBack} />;
      case 'SpecialOutpatient':
        return <SpecialOutpatient onBack={handleBack} />;
      case 'InpatientReimbursement':
        return <InpatientReimbursement onBack={handleBack} />;
      case 'MaternityReimbursement':
        return <MaternityReimbursement onBack={handleBack} />;
      case 'EmergencyReimbursement':
        return <EmergencyReimbursement onBack={handleBack} />;
      case 'RemoteLocalReimbursement':
        return <RemoteLocalReimbursement onBack={handleBack} />;
      case 'RemoteTransferReimbursement':
        return <RemoteTransferReimbursement onBack={handleBack} />;
      case 'SpecialDrugReimbursement':
        return <SpecialDrugReimbursement onBack={handleBack} />;
      case 'MajorIllnessReimbursement':
        return <MajorIllnessReimbursement onBack={handleBack} />;
      case 'InfoChange':
        return <InfoChange onBack={handleBack} />;
      case 'NameChange':
        return <NameChange onBack={handleBack} />;
      case 'IdCardChange':
        return <IdCardChange onBack={handleBack} />;
      case 'TypeChange':
        return <TypeChange onBack={handleBack} />;
      case 'StatusChange':
        return <StatusChange onBack={handleBack} />;
      case 'TransferApply':
        return <TransferApply onBack={handleBack} />;
      case 'LocalTransfer':
        return <LocalTransfer onBack={handleBack} />;
      case 'CrossRegionTransfer':
        return <CrossRegionTransfer onBack={handleBack} />;
      case 'BusinessQuery':
        return <BusinessQuery onBack={handleBack} />;
      case 'EnterpriseManagement':
        return <EnterpriseManagement onBack={handleBack} />;
      case 'FinanceReconcile':
        return <FinanceReconcile onBack={handleBack} />;
      case 'FinanceLedger':
        return <FinanceLedger onBack={handleBack} />;
      case 'FinanceReport':
        return <FinanceReport onBack={handleBack} />;
      default:
        return null;
    }
  };

  // 渲染模块卡片
  const renderModuleCard = (module: typeof functionModules[0]) => {
    const isLargeCard = ['enrollment', 'payment', 'reimbursement'].includes(module.id);
    return (
      <motion.div
        key={module.id}
        layoutId={module.id}
        onClick={() => setSelectedModule(module.id)}
        className={`group relative overflow-hidden rounded-2xl border-2 ${module.borderColor} ${module.bgColor} cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${isLargeCard ? 'col-span-1 row-span-1' : ''}`}
        whileHover={{ y: -4 }}
      >
        {/* 顶部渐变条 */}
        <div className={`h-3 bg-gradient-to-r ${module.color}`} />

        <div className={`${isLargeCard ? 'p-8' : 'p-6'}`}>
          {/* 图标和标题 */}
          <div className="flex items-start justify-between mb-6">
            <div className={`${isLargeCard ? 'p-4' : 'p-3'} rounded-xl bg-gradient-to-br ${module.color} text-white shadow-lg`}>
              <module.icon className={`${isLargeCard ? 'w-8 h-8' : 'w-6 h-6'}`} />
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>+{module.stats.today}</span>
            </div>
          </div>

          {/* 标题和描述 */}
          <h3 className={`${isLargeCard ? 'text-2xl' : 'text-lg'} font-bold ${module.textColor} mb-3`}>{module.title}</h3>
          <p className={`${isLargeCard ? 'text-base' : 'text-sm'} text-gray-600 mb-6 line-clamp-2`}>{module.description}</p>

          {/* 功能数量 */}
          <div className="flex items-center justify-between">
            <span className={`${isLargeCard ? 'text-sm' : 'text-xs'} text-gray-500`}>{module.features.length} 项功能</span>
            <div className={`${isLargeCard ? 'p-3' : 'p-2'} rounded-full ${module.bgColor} group-hover:bg-white transition-colors`}>
              <ChevronRight className={`${isLargeCard ? 'w-5 h-5' : 'w-4 h-4'} ${module.textColor}`} />
            </div>
          </div>
        </div>

        {/* 悬停时的装饰 */}
        <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-500`} />
      </motion.div>
    );
  };

  // 渲染功能详情面板
  const renderFeaturePanel = () => {
    if (!selectedModule) return null;
    const module = functionModules.find(m => m.id === selectedModule);
    if (!module) return null;

    // 如果已选择具体功能，显示功能内容
    if (selectedFeature) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key="feature-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white"
          >
            {renderFeatureContent()}
          </motion.div>
        </AnimatePresence>
      );
    }

    // 否则显示功能选择面板
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={() => setSelectedModule(null)}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className={`p-6 bg-gradient-to-r ${module.color} text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <module.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{module.title}</h2>
                  <p className="text-white/80">{module.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedModule(null)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <FileX className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* 功能网格 */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {module.features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleFeatureClick(module.id, feature.id, feature.component)}
                  className={`p-5 rounded-xl border-2 ${module.borderColor} ${module.bgColor} hover:bg-white hover:shadow-lg transition-all duration-300 text-left group cursor-pointer`}
                >
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${module.color} text-white mb-3 w-fit group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h4 className={`font-semibold ${module.textColor} mb-1`}>{feature.label}</h4>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部统计栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">经办人员工作台</h1>
            <p className="text-sm text-gray-500 mt-1">欢迎回来，今日待办事项已更新</p>
          </div>
          <div className="flex items-center gap-6">
            {todoItems.map(item => (
              <div key={item.id} className="text-center">
                <div className={`text-2xl font-bold ${item.color.split(' ')[1]}`}>{item.count}</div>
                <div className="text-xs text-gray-500">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* 快捷操作 */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">快捷操作</h2>
          <div className="flex gap-4">
            {quickActions.map(action => (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickAction(action)}
                className={`flex items-center gap-3 px-6 py-4 ${action.color} text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow`}
              >
                <action.icon className="w-5 h-5" />
                <span className="font-medium">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索功能模块..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* 功能模块卡片网格 */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">业务功能</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map(renderModuleCard)}
          </div>
        </div>

        {/* 最近操作记录 */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">最近操作</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">业务内容</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">办理人</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: '参保登记', content: '张三 - 新参保登记', user: '经办员A', time: '10:23', status: '已完成' },
                  { type: '缴费核定', content: '李四 - 2024年度缴费', user: '经办员B', time: '10:15', status: '处理中' },
                  { type: '费用报销', content: '王五 - 门诊报销', user: '经办员A', time: '09:48', status: '已完成' },
                  { type: '信息变更', content: '赵六 - 地址变更', user: '经办员C', time: '09:30', status: '已完成' },
                ].map((item, index) => (
                  <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === '参保登记' ? 'bg-blue-100 text-blue-700' :
                        item.type === '缴费核定' ? 'bg-emerald-100 text-emerald-700' :
                        item.type === '费用报销' ? 'bg-violet-100 text-violet-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{item.content}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.user}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.time}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center gap-1 ${
                        item.status === '已完成' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 功能详情弹窗 */}
      <AnimatePresence>
        {selectedModule && renderFeaturePanel()}
      </AnimatePresence>
    </div>
  );
}
