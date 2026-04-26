import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Pill, DollarSign, Calculator, Stethoscope,
  ChevronRight, TrendingUp, Activity, CheckCircle, AlertCircle,
  BarChart3, PieChart, ArrowLeft, FileText
} from 'lucide-react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InstitutionManagement from './medical/InstitutionManagement';
import InsuranceDirectory from './treatment/InsuranceDirectory';
import DrugManagement from './medical/DrugManagement';
import PriceManagement from './medical/PriceManagement';
import PaymentReform from './medical/PaymentReform';
import ServiceSupervision from './medical/ServiceSupervision';
import DrugDirectoryQuery from './medical/DrugDirectoryQuery';
import ServiceDirectoryQuery from './medical/ServiceDirectoryQuery';
import MaterialDirectoryQuery from './medical/MaterialDirectoryQuery';
import SurgeryDirectoryQuery from './medical/SurgeryDirectoryQuery';
import DaySurgeryDirectory from './medical/DaySurgeryDirectory';
import DiseaseDiagnosisQuery from './medical/DiseaseDiagnosisQuery';
import type { UserRole } from '../../types/roles';
import { getAgencyLevel } from '../../config/managementPermissions';

const modules = [
  {
    id: 'institution',
    name: '医疗机构管理',
    icon: Building2,
    description: '定点机构准入、协议管理、退出管理',
    stats: { total: 1256, active: 1189, suspended: 67 },
    features: ['机构准入', '协议管理', '退出管理', '机构查询', '机构评级']
  },
  {
    id: 'directory',
    name: '医保目录管理',
    icon: FileText,
    description: '药品目录、诊疗项目、医用耗材管理',
    stats: { total: 2856, drug: 1568, service: 856, material: 432 },
    features: ['药品目录', '诊疗项目', '医用耗材', '目录调整', '目录查询']
  },
  {
    id: 'drug',
    name: '药品管理',
    icon: Pill,
    description: '药品集采管理、价格监测、供应保障',
    stats: { total: 2963, national: 156, provincial: 456 },
    features: ['集采管理', '价格监测', '供应保障', '药品查询', '使用监管']
  },
  {
    id: 'price',
    name: '医疗服务价格',
    icon: DollarSign,
    description: '价格项目制定、价格调整、成本监审',
    stats: { items: 4567, adjusted: 156, pending: 23 },
    features: ['价格项目', '价格调整', '成本监审', '价格公示', '异常监测']
  },
  {
    id: 'payment',
    name: '支付方式改革',
    icon: Calculator,
    description: 'DRG/DIP付费、按病种付费',
    stats: { drg: 856, dip: 1256, disease: 2341 },
    features: ['DRG付费', 'DIP付费', '病种付费', '支付标准', '效果评估']
  },
  {
    id: 'behavior',
    name: '医疗服务行为监管',
    icon: Stethoscope,
    description: '诊疗规范、合理用药、医疗质量监管',
    stats: { checked: 456, abnormal: 23, rectified: 18 },
    features: ['诊疗规范', '合理用药', '检查监管', '处方审核', '医疗质量']
  },
  {
    id: 'drug_directory',
    name: '药品目录查询',
    icon: Pill,
    description: '医保药品目录查询、分类检索',
    stats: { total: 2963, typeA: 1568, typeB: 1395 },
    features: ['药品查询', '分类检索', '价格查询', '医保类型']
  },
  {
    id: 'service_directory',
    name: '诊疗目录查询',
    icon: Stethoscope,
    description: '诊疗项目目录查询、价格查询',
    stats: { total: 856, check: 234, image: 156 },
    features: ['项目查询', '价格查询', '分类检索', '状态查询']
  },
  {
    id: 'material_directory',
    name: '耗材目录查询',
    icon: FileText,
    description: '医用耗材目录查询、规格查询',
    stats: { total: 432, basic: 234, surgery: 198 },
    features: ['耗材查询', '规格查询', '价格查询', '分类检索']
  },
  {
    id: 'surgery_directory',
    name: '手术操作目录',
    icon: Building2,
    description: '手术操作目录查询、分级管理',
    stats: { total: 567, level1: 89, level2: 234, level3: 156, level4: 88 },
    features: ['手术查询', '分级管理', '价格查询', '分类检索']
  },
  {
    id: 'day_surgery',
    name: '日间手术治疗',
    icon: FileText,
    description: '日间手术目录、准入标准',
    stats: { total: 123, active: 98, suspended: 25 },
    features: ['手术查询', '准入标准', '时长管理', '恢复管理']
  },
  {
    id: 'disease_diagnosis',
    name: '疾病与诊断',
    icon: FileText,
    description: '疾病分类、诊断编码查询',
    stats: { total: 2341, icd10: 1890, icd9: 451 },
    features: ['疾病查询', '编码查询', '分类检索', '诊断管理']
  }
];

const stats = [
  { label: '定点机构', value: '1,256家', change: '+45家', trend: 'up' },
  { label: '药品目录', value: '2,963种', change: '+156种', trend: 'up' },
  { label: '集采金额', value: '856亿', change: '+23.5%', trend: 'up' },
  { label: '节约费用', value: '234亿', change: '+18.2%', trend: 'up' }
];

const priceData = [
  { name: '检查检验', value: 1256 },
  { name: '手术治疗', value: 2341 },
  { name: '药品费用', value: 3456 },
  { name: '护理费用', value: 567 },
  { name: '其他', value: 890 }
];

interface MedicalServiceProps {
  userRole: UserRole;
  userAgency: string;
}

export default function MedicalService({ userAgency }: MedicalServiceProps) {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const isProvince = getAgencyLevel(userAgency) === 'province';
  const visibleModules = isProvince
    ? modules
    : modules.filter((module) => !['directory', 'drug', 'price', 'payment'].includes(module.id));
  const scopedStats = isProvince
    ? stats
    : [
        { label: '本市定点机构', value: '186家', change: '+6家', trend: 'up' },
        { label: '本市目录执行项', value: '1,128项', change: '+34项', trend: 'up' },
        { label: '本市集采金额', value: '62亿', change: '+8.5%', trend: 'up' },
        { label: '本市行为预警', value: '19条', change: '-2条', trend: 'up' },
      ];
  const scopedPriceData = isProvince ? priceData : priceData.slice(0, 4);

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'institution':
        return <InstitutionManagement />;
      case 'directory':
        return <InsuranceDirectory />;
      case 'drug':
        return <DrugManagement />;
      case 'price':
        return <PriceManagement />;
      case 'payment':
        return <PaymentReform />;
      case 'behavior':
        return <ServiceSupervision />;
      case 'drug_directory':
        return <DrugDirectoryQuery />;
      case 'service_directory':
        return <ServiceDirectoryQuery />;
      case 'material_directory':
        return <MaterialDirectoryQuery onBack={() => setActiveModule(null)} />;
      case 'surgery_directory':
        return <SurgeryDirectoryQuery />;
      case 'day_surgery':
        return <DaySurgeryDirectory />;
      case 'disease_diagnosis':
        return <DiseaseDiagnosisQuery onBack={() => setActiveModule(null)} />;
      default:
        return null;
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-800">医药服务管理司</h1>
          <p className="text-gray-500 mt-1">负责医疗机构管理、药品目录、价格管理、招标采购、支付方式改革等工作</p>
          <p className="mt-2 text-sm text-cyan-700">
            {isProvince ? '当前为省局视角，可维护主目录、价格基准和支付改革规则。' : '当前为地市视角，重点查看本市执行情况和机构落地数据。'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">{isProvince ? '省局视角' : '地市视角'}</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{isProvince ? '44人' : '17人'}</span>
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

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-600" />
            医疗费用构成
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <ReBarChart data={scopedPriceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-600" />
            集采成效
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">集采药品品种</span>
              <span className="text-lg font-semibold text-blue-600">456种</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
              <span className="text-sm text-gray-700">平均降价幅度</span>
              <span className="text-lg font-semibold text-cyan-600">53%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-700">节约医疗费用</span>
              <span className="text-lg font-semibold text-green-600">234亿</span>
            </div>
          </div>
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
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-800 mt-4">{module.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{module.description}</p>
              
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                {module.id === 'institution' && (
                  <>
                    <div><p className="text-xs text-gray-400">总数</p><p className="text-lg font-semibold text-gray-800">{module.stats.total}</p></div>
                    <div><p className="text-xs text-gray-400">正常</p><p className="text-lg font-semibold text-green-600">{module.stats.active}</p></div>
                    <div><p className="text-xs text-gray-400">暂停</p><p className="text-lg font-semibold text-red-600">{module.stats.suspended}</p></div>
                  </>
                )}
                {module.id === 'directory' && (
                  <>
                    <div><p className="text-xs text-gray-400">总数</p><p className="text-lg font-semibold text-gray-800">{module.stats.total}</p></div>
                    <div><p className="text-xs text-gray-400">药品</p><p className="text-lg font-semibold text-cyan-600">{module.stats.drug}</p></div>
                    <div><p className="text-xs text-gray-400">项目</p><p className="text-lg font-semibold text-blue-600">{module.stats.service}</p></div>
                  </>
                )}
                {module.id === 'drug' && (
                  <>
                    <div><p className="text-xs text-gray-400">总数</p><p className="text-lg font-semibold text-gray-800">{module.stats.total}</p></div>
                    <div><p className="text-xs text-gray-400">国家集采</p><p className="text-lg font-semibold text-cyan-600">{module.stats.national}</p></div>
                    <div><p className="text-xs text-gray-400">省级集采</p><p className="text-lg font-semibold text-blue-600">{module.stats.provincial}</p></div>
                  </>
                )}
                {module.id === 'price' && (
                  <>
                    <div><p className="text-xs text-gray-400">项目数</p><p className="text-lg font-semibold text-gray-800">{module.stats.items}</p></div>
                    <div><p className="text-xs text-gray-400">已调整</p><p className="text-lg font-semibold text-green-600">{module.stats.adjusted}</p></div>
                    <div><p className="text-xs text-gray-400">待调整</p><p className="text-lg font-semibold text-orange-500">{module.stats.pending}</p></div>
                  </>
                )}
                {module.id === 'payment' && (
                  <>
                    <div><p className="text-xs text-gray-400">DRG</p><p className="text-lg font-semibold text-gray-800">{module.stats.drg}</p></div>
                    <div><p className="text-xs text-gray-400">DIP</p><p className="text-lg font-semibold text-cyan-600">{module.stats.dip}</p></div>
                    <div><p className="text-xs text-gray-400">病种</p><p className="text-lg font-semibold text-blue-600">{module.stats.disease}</p></div>
                  </>
                )}
                {module.id === 'behavior' && (
                  <>
                    <div><p className="text-xs text-gray-400">检查</p><p className="text-lg font-semibold text-gray-800">{module.stats.checked}</p></div>
                    <div><p className="text-xs text-gray-400">异常</p><p className="text-lg font-semibold text-red-600">{module.stats.abnormal}</p></div>
                    <div><p className="text-xs text-gray-400">整改</p><p className="text-lg font-semibold text-green-600">{module.stats.rectified}</p></div>
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
                        <CheckCircle className="w-4 h-4 text-blue-500" />
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
          <Activity className="w-5 h-5 text-blue-600" />
          近期工作动态
        </h3>
        <div className="space-y-3">
          {[
            { time: '今天', title: '第九批国家集采药品落地实施', type: '集采' },
            { time: '昨天', title: '新增56个医疗服务价格项目', type: '价格' },
            { time: '昨天', title: '完成125家医疗机构年度考核', type: '机构' },
            { time: '3天前', title: 'DRG付费覆盖范围扩大至全国', type: '支付' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500 w-12">{item.time}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{item.type}</span>
              <span className="text-sm text-gray-800">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
