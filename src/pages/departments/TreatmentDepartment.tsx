import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  CreditCard,
  FileText,
  HeartPulse,
  Globe,
  ChevronRight,
  TrendingUp,
  Activity,
  CheckCircle,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import PaymentManagement from './treatment/PaymentManagement';
import BenefitPolicy from './treatment/BenefitPolicy';
import InsuranceTypeManagement from './treatment/InsuranceTypeManagement';
import LongTermCare from './treatment/LongTermCare';
import RemoteMedical from './treatment/RemoteMedical';
import DataDictionary from '../admin/DataDictionary';
import type { UserRole } from '../../types/roles';
import { getAgencyLevel } from '../../config/managementPermissions';

const modules = [
  {
    id: 'insurance-type',
    name: '险种管理',
    icon: Shield,
    description: '医保险种配置、缴费标准、待遇参数管理',
    stats: { total: 6, active: 5, inactive: 1 },
    features: ['险种配置', '缴费标准设置', '待遇参数配置', '险种启用/停用', '险种查询'],
  },
  {
    id: 'benefit',
    name: '待遇政策',
    icon: BookOpen,
    description: '医保待遇标准制定、待遇调整与政策解读发布',
    stats: { total: 45, active: 39, draft: 6 },
    features: ['待遇标准制定', '政策文件管理', '待遇调整', '政策解读发布', '待遇测算工具'],
  },
  {
    id: 'funding',
    name: '筹资政策',
    icon: CreditCard,
    description: '医保筹资政策制定、缴费基数与费率管理',
    stats: { total: 12, active: 8, draft: 4 },
    features: ['缴费基数标准', '费率政策', '筹资方案', '补贴政策', '筹资统计'],
  },
  {
    id: 'longterm',
    name: '长期护理保险',
    icon: HeartPulse,
    description: '长护险政策制定、失能评估标准管理',
    stats: { total: 8, active: 6, draft: 2 },
    features: ['长护险政策', '失能评估标准', '护理服务标准', '待遇支付标准', '政策查询'],
  },
  {
    id: 'remote',
    name: '异地就医',
    icon: Globe,
    description: '异地就医政策制定、结算规则管理',
    stats: { total: 15, active: 12, draft: 3 },
    features: ['异地备案政策', '结算规则', '转诊政策', '政策发布', '政策查询'],
  },
  {
    id: 'dictionary',
    name: '数据字典',
    icon: FileText,
    description: '险种类型、缴费标准、医疗机构等级等基础数据维护',
    stats: { total: 156, active: 142, draft: 14 },
    features: ['险种类型管理', '缴费标准维护', '医疗机构等级', '药品分类', '诊疗项目分类'],
  },
];

const stats = [
  { label: '待遇政策文件', value: '45项', change: '+3项', trend: 'up' },
  { label: '筹资参数标准', value: '12项', change: '+1项', trend: 'up' },
  { label: '长护险服务机构', value: '286家', change: '+12家', trend: 'up' },
  { label: '异地直接结算率', value: '97.8%', change: '+0.6%', trend: 'up' },
];

const activities = [
  { time: '10:20', title: '江苏省门诊慢特病待遇衔接口径完成年度校准', type: '待遇' },
  { time: '09:15', title: '苏州、无锡两地职工医保缴费基数区间同步更新', type: '筹资' },
  { time: '昨天', title: '南京市长期护理保险失能等级复评标准纳入政策库', type: '长护险' },
  { time: '昨天', title: '省内异地就医备案免材料事项扩展至 13 个设区市', type: '异地' },
];

interface TreatmentDepartmentProps {
  userRole: UserRole;
  userAgency: string;
}

export default function TreatmentDepartment({ userAgency }: TreatmentDepartmentProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const isProvince = getAgencyLevel(userAgency) === 'province';
  const visibleModules = isProvince ? modules : modules.filter((module) => module.id !== 'dictionary');
  const scopedStats = isProvince
    ? stats
    : [
        { label: '本市待遇政策文件', value: '12项', change: '+1项', trend: 'up' },
        { label: '本市筹资参数标准', value: '4项', change: '+0项', trend: 'up' },
        { label: '本市长护险服务机构', value: '68家', change: '+3家', trend: 'up' },
        { label: '本市异地直接结算率', value: '98.1%', change: '+0.3%', trend: 'up' },
      ];
  const scopedActivities = isProvince ? activities : activities.slice(1, 4);

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'insurance-type':
        return <InsuranceTypeManagement userAgency={userAgency} />;
      case 'funding':
        return <PaymentManagement />;
      case 'benefit':
        return <BenefitPolicy />;
      case 'longterm':
        return <LongTermCare />;
      case 'remote':
        return <RemoteMedical />;
      case 'dictionary':
        return <DataDictionary />;
      default:
        return null;
    }
  };

  if (activeModule) {
    const moduleName = visibleModules.find((m) => m.id === activeModule)?.name || '';
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
          <h1 className="text-2xl font-bold text-gray-800">待遇保障司</h1>
          <p className="text-gray-500 mt-1">
            负责江苏省医疗保障待遇政策、筹资政策、长期护理保险和异地就医等业务管理
          </p>
          <p className="mt-2 text-sm text-cyan-700">
            {isProvince ? '当前为省局视角，可维护全省主政策、主参数和基础字典。' : '当前为地市视角，重点查看本市执行情况，不维护全省主字典。'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full">{isProvince ? '省局视角' : '地市视角'}</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{isProvince ? '45人' : '18人'}</span>
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
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">{stat.change}</span>
              <span className="text-sm text-gray-400">较上月</span>
            </div>
          </motion.div>
        ))}
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
              onClick={() => setActiveModule(module.id)}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-cyan-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-800 mt-4">{module.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{module.description}</p>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                {module.id === 'insurance-type' ? (
                  <>
                    <div>
                      <p className="text-xs text-gray-400">险种总数</p>
                      <p className="text-lg font-semibold text-gray-800">{module.stats.total}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">启用</p>
                      <p className="text-lg font-semibold text-green-600">{module.stats.active}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">停用</p>
                      <p className="text-lg font-semibold text-gray-500">{module.stats.inactive}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-xs text-gray-400">政策总数</p>
                      <p className="text-lg font-semibold text-gray-800">{module.stats.total}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">已生效</p>
                      <p className="text-lg font-semibold text-green-600">{module.stats.active}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">草稿</p>
                      <p className="text-lg font-semibold text-orange-500">{module.stats.draft}</p>
                    </div>
                  </>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <p className="text-sm font-medium text-gray-700 mb-2">功能列表</p>
                <div className="space-y-2">
                  {module.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-cyan-500" />
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-sm text-cyan-600 font-medium flex items-center gap-1">
                    点击进入 <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-600" />
          近期动态
        </h3>
        <div className="space-y-3">
          {scopedActivities.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500 w-12">{item.time}</span>
              <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">{item.type}</span>
              <span className="text-sm text-gray-800">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
