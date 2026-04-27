import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  FileText,
  Settings,
  DollarSign,
} from 'lucide-react';
import { getAgencyLevel } from '../../../config/managementPermissions';

interface InsuranceType {
  id: string;
  code: string;
  name: string;
  category: 'employee' | 'resident' | 'flexible' | 'major' | 'assistance' | 'retired';
  description: string;
  status: 'active' | 'inactive';
  annualFee: number;
  reimbursementRate: number;
  coverageLimit: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface InsuranceTypeManagementProps {
  userAgency: string;
}

const mockInsuranceTypes: InsuranceType[] = [
  {
    id: '1',
    code: 'JS-EMP-001',
    name: '江苏省城镇职工基本医疗保险',
    category: 'employee',
    description: '适用于机关事业单位、企业在职职工及退休前连续缴费人员，执行住院、普通门诊统筹和个人账户保障政策。',
    status: 'active',
    annualFee: 4680,
    reimbursementRate: 85,
    coverageLimit: 450000,
    createdAt: '2021-01-01',
    updatedAt: '2026-03-12',
    createdBy: '省待遇保障处 王敏',
  },
  {
    id: '2',
    code: 'JS-EMP-002',
    name: '江苏省公务员医疗补助',
    category: 'employee',
    description: '面向机关及参公单位人员，在职工医保基础上叠加门诊和住院补助待遇，重点保障高额合规费用。',
    status: 'active',
    annualFee: 1260,
    reimbursementRate: 92,
    coverageLimit: 600000,
    createdAt: '2021-01-01',
    updatedAt: '2026-02-18',
    createdBy: '省待遇保障处 周岚',
  },
  {
    id: '3',
    code: 'JS-EMP-003',
    name: '江苏省生育保险',
    category: 'employee',
    description: '适用于参加职工医保的女职工及符合条件男职工配偶，覆盖生育医疗费用和生育津贴待遇。',
    status: 'active',
    annualFee: 820,
    reimbursementRate: 88,
    coverageLimit: 120000,
    createdAt: '2022-01-01',
    updatedAt: '2026-01-22',
    createdBy: '省待遇保障处 林悦',
  },
  {
    id: '4',
    code: 'JS-RES-001',
    name: '江苏省城乡居民基本医疗保险',
    category: 'resident',
    description: '覆盖全省城乡居民参保群体，保障住院、普通门诊、门诊慢特病及符合规定的异地就医待遇。',
    status: 'active',
    annualFee: 460,
    reimbursementRate: 68,
    coverageLimit: 320000,
    createdAt: '2021-01-01',
    updatedAt: '2026-02-26',
    createdBy: '省待遇保障处 陈颖',
  },
  {
    id: '5',
    code: 'JS-RES-002',
    name: '江苏省新生儿居民医保',
    category: 'resident',
    description: '面向出生后按规定办理参保登记的新生儿，衔接出生医学证明、父母信息及落户状态核验。',
    status: 'active',
    annualFee: 460,
    reimbursementRate: 70,
    coverageLimit: 320000,
    createdAt: '2023-01-01',
    updatedAt: '2026-04-10',
    createdBy: '苏州市医保中心 顾宁',
  },
  {
    id: '6',
    code: 'JS-RES-003',
    name: '江苏省学生居民医保',
    category: 'resident',
    description: '面向各级各类全日制在校学生，按学籍信息核验参保，重点保障住院和门诊统筹待遇。',
    status: 'active',
    annualFee: 380,
    reimbursementRate: 66,
    coverageLimit: 280000,
    createdAt: '2022-08-15',
    updatedAt: '2026-03-01',
    createdBy: '南京市医保中心 朱晨',
  },
  {
    id: '7',
    code: 'JS-FLX-001',
    name: '江苏省灵活就业人员职工医保',
    category: 'flexible',
    description: '适用于个体经营、平台就业和自由职业参保人员，按灵活就业口径缴费并享受住院统筹待遇。',
    status: 'active',
    annualFee: 6120,
    reimbursementRate: 78,
    coverageLimit: 360000,
    createdAt: '2022-05-01',
    updatedAt: '2026-01-18',
    createdBy: '南京市医保中心 赵静',
  },
  {
    id: '8',
    code: 'JS-FLX-002',
    name: '江苏省灵活就业人员门诊统筹险种',
    category: 'flexible',
    description: '面向已按规定参加灵活就业职工医保的人员，补充普通门诊统筹和门诊慢特病支付待遇。',
    status: 'active',
    annualFee: 980,
    reimbursementRate: 74,
    coverageLimit: 120000,
    createdAt: '2023-06-01',
    updatedAt: '2026-02-14',
    createdBy: '无锡市医保中心 沈宁',
  },
  {
    id: '9',
    code: 'JS-MAJ-001',
    name: '江苏省城乡居民大病保险',
    category: 'major',
    description: '衔接城乡居民基本医保，对高额合规医疗费用实行分段补偿，减轻大病患者医疗负担。',
    status: 'active',
    annualFee: 0,
    reimbursementRate: 70,
    coverageLimit: 400000,
    createdAt: '2021-01-01',
    updatedAt: '2026-03-08',
    createdBy: '省待遇保障处 张蕾',
  },
  {
    id: '10',
    code: 'JS-MAJ-002',
    name: '江苏省职工大额医疗费用补助',
    category: 'major',
    description: '面向职工医保高额医疗费用保障，主要承接基本医保封顶线以上合规费用补助支付。',
    status: 'active',
    annualFee: 240,
    reimbursementRate: 80,
    coverageLimit: 500000,
    createdAt: '2021-01-01',
    updatedAt: '2026-03-20',
    createdBy: '省待遇保障处 韩松',
  },
  {
    id: '11',
    code: 'JS-LTC-001',
    name: '江苏省长期护理保险',
    category: 'major',
    description: '面向重度失能参保人员，保障机构护理、居家护理及上门护理服务相关支付待遇。',
    status: 'active',
    annualFee: 180,
    reimbursementRate: 75,
    coverageLimit: 180000,
    createdAt: '2022-07-01',
    updatedAt: '2026-04-06',
    createdBy: '省长护险专班 谢雨桐',
  },
  {
    id: '12',
    code: 'JS-AID-001',
    name: '江苏省医疗救助待遇保障',
    category: 'assistance',
    description: '面向特困人员、低保对象及因病致贫重病患者，按救助身份类别实施分类资助和二次救助。',
    status: 'active',
    annualFee: 0,
    reimbursementRate: 75,
    coverageLimit: 300000,
    createdAt: '2022-01-01',
    updatedAt: '2026-02-18',
    createdBy: '省待遇保障处 马会',
  },
  {
    id: '13',
    code: 'JS-AID-002',
    name: '江苏省退役军人医疗补助',
    category: 'assistance',
    description: '面向重点优抚对象、伤残军人等退役军人群体，衔接优抚身份认定和医疗补助待遇支付。',
    status: 'active',
    annualFee: 0,
    reimbursementRate: 82,
    coverageLimit: 260000,
    createdAt: '2023-03-01',
    updatedAt: '2026-03-28',
    createdBy: '南通市医保中心 孟川',
  },
  {
    id: '14',
    code: 'JS-RET-001',
    name: '江苏省退休人员补充医疗保险',
    category: 'retired',
    description: '适用于退休参保人员的补充保障，衔接职工医保待遇，对高额住院费用给予分段补偿。',
    status: 'inactive',
    annualFee: 920,
    reimbursementRate: 72,
    coverageLimit: 180000,
    createdAt: '2020-09-01',
    updatedAt: '2025-12-31',
    createdBy: '省待遇保障处 刘楠',
  },
  {
    id: '15',
    code: 'JS-RET-002',
    name: '江苏省退休人员门诊补助险种',
    category: 'retired',
    description: '面向退休人员门诊用药和慢病复诊场景的补助险种，按年度限额开展门诊补助保障。',
    status: 'inactive',
    annualFee: 360,
    reimbursementRate: 65,
    coverageLimit: 50000,
    createdAt: '2021-06-01',
    updatedAt: '2025-11-20',
    createdBy: '镇江市医保局 唐悦',
  },
];

const categoryLabels: Record<InsuranceType['category'], { label: string; color: string }> = {
  employee: { label: '职工医保', color: 'bg-blue-100 text-blue-700' },
  resident: { label: '居民医保', color: 'bg-green-100 text-green-700' },
  flexible: { label: '灵活就业', color: 'bg-purple-100 text-purple-700' },
  major: { label: '大病/长护', color: 'bg-rose-100 text-rose-700' },
  assistance: { label: '医疗救助', color: 'bg-amber-100 text-amber-700' },
  retired: { label: '退休补充', color: 'bg-orange-100 text-orange-700' },
};

const statusLabels: Record<InsuranceType['status'], { label: string; color: string; icon: React.ElementType }> = {
  active: { label: '启用', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  inactive: { label: '停用', color: 'bg-gray-100 text-gray-700', icon: XCircle },
};

export default function InsuranceTypeManagement({ userAgency }: InsuranceTypeManagementProps) {
  const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>(mockInsuranceTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState<InsuranceType | null>(null);
  const [showDetail, setShowDetail] = useState<InsuranceType | null>(null);
  const isProvince = getAgencyLevel(userAgency) === 'province';

  const filteredData = insuranceTypes.filter((item) => {
    const matchSearch =
      item.name.includes(searchTerm)
      || item.code.includes(searchTerm)
      || item.description.includes(searchTerm);
    const matchCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const stats = {
    total: insuranceTypes.length,
    active: insuranceTypes.filter((i) => i.status === 'active').length,
    inactive: insuranceTypes.filter((i) => i.status === 'inactive').length,
    avgFee: Math.round(insuranceTypes.reduce((sum, i) => sum + i.annualFee, 0) / insuranceTypes.length),
  };

  const handleAdd = () => {
    setEditingType(null);
    setShowModal(true);
  };

  const handleEdit = (type: InsuranceType) => {
    setEditingType(type);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setInsuranceTypes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setInsuranceTypes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">险种管理</h2>
          <p className="mt-1 text-sm text-gray-500">配置和维护全省医保险种、缴费标准及待遇参数</p>
        </div>
        {isProvince ? (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white transition-colors hover:bg-cyan-700"
          >
            <Plus className="h-4 w-4" />
            新增险种
          </button>
        ) : (
          <div className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700">
            地市账号仅可查看，不可新增、修改、启停或删除
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">险种总数</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="mt-1 text-xs text-gray-400">含职工、居民、大病、长护等</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">启用险种</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="mt-1 text-xs text-green-500">正常参保适用</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">停用险种</p>
          <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
          <p className="mt-1 text-xs text-gray-400">暂停新增参保</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">平均年缴费</p>
          <p className="text-2xl font-bold text-cyan-600">￥{stats.avgFee}</p>
          <p className="mt-1 text-xs text-gray-400">按险种口径测算</p>
        </motion.div>
      </div>

      <div className="flex gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索险种名称、编码或说明"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-2 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">全部分类</option>
          <option value="employee">职工医保</option>
          <option value="resident">居民医保</option>
          <option value="flexible">灵活就业</option>
          <option value="major">大病/长护</option>
          <option value="assistance">医疗救助</option>
          <option value="retired">退休补充</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-2 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">全部状态</option>
          <option value="active">启用</option>
          <option value="inactive">停用</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">险种编码</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">险种名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">分类</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">年缴费</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">报销比例</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">年度限额</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => {
              const StatusIcon = statusLabels[item.status].icon;
              const categoryInfo = categoryLabels[item.category];
              return (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{item.code}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-cyan-600" />
                      <span className="text-sm font-medium text-gray-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-1 text-xs ${categoryInfo.color}`}>{categoryInfo.label}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-cyan-600">￥{item.annualFee}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.reimbursementRate}%</td>
                  <td className="px-4 py-3 text-sm text-gray-600">￥{item.coverageLimit.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${statusLabels[item.status].color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {statusLabels[item.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setShowDetail(item)}
                        className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-cyan-50 hover:text-cyan-600"
                        title="查看详情"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      {isProvince && (
                        <>
                          <button
                            onClick={() => handleEdit(item)}
                            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-cyan-50 hover:text-cyan-600"
                            title="编辑"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(item.id)}
                            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-orange-50 hover:text-orange-600"
                            title={item.status === 'active' ? '停用' : '启用'}
                          >
                            <Settings className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="删除"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <Shield className="mx-auto mb-3 h-12 w-12 opacity-30" />
            <p>暂无险种数据</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-800">{editingType ? '编辑险种' : '新增险种'}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">险种编码</label>
                    <input type="text" defaultValue={editingType?.code || ''} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:outline-none" placeholder="如 JS-EMP-001" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">险种名称</label>
                    <input type="text" defaultValue={editingType?.name || ''} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:outline-none" placeholder="请输入险种名称" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">险种分类</label>
                  <select defaultValue={editingType?.category || 'employee'} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:outline-none">
                    <option value="employee">职工医保</option>
                    <option value="resident">居民医保</option>
                    <option value="flexible">灵活就业</option>
                    <option value="major">大病/长护</option>
                    <option value="assistance">医疗救助</option>
                    <option value="retired">退休补充</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">险种描述</label>
                  <textarea defaultValue={editingType?.description || ''} className="h-20 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:outline-none" placeholder="请输入险种描述" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">年缴费(元)</label>
                    <input type="number" defaultValue={editingType?.annualFee || ''} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">报销比例(%)</label>
                    <input type="number" defaultValue={editingType?.reimbursementRate || ''} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">年度限额(元)</label>
                    <input type="number" defaultValue={editingType?.coverageLimit || ''} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:outline-none" />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">取消</button>
                <button onClick={() => setShowModal(false)} className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">保存</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-100">
                    <Shield className="h-7 w-7 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{showDetail.name}</h3>
                    <p className="text-sm text-gray-500">{showDetail.code}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetail(null)} className="rounded-lg p-2 hover:bg-gray-100">
                  <XCircle className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 font-medium text-gray-900">
                    <Settings className="h-4 w-4 text-cyan-600" />
                    基本信息
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">险种分类</span>
                      <span className={`${categoryLabels[showDetail.category].color} rounded px-2 py-0.5 text-xs`}>
                        {categoryLabels[showDetail.category].label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">当前状态</span>
                      <span className={`${statusLabels[showDetail.status].color} rounded px-2 py-0.5 text-xs`}>
                        {statusLabels[showDetail.status].label}
                      </span>
                    </div>
                    <div className="flex justify-between"><span className="text-gray-500">创建时间</span><span>{showDetail.createdAt}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">最后更新</span><span>{showDetail.updatedAt}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">创建人</span><span>{showDetail.createdBy}</span></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2 font-medium text-gray-900">
                    <DollarSign className="h-4 w-4 text-cyan-600" />
                    待遇参数
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">年缴费金额</span><span className="font-bold text-cyan-600">￥{showDetail.annualFee}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">报销比例</span><span className="font-bold text-green-600">{showDetail.reimbursementRate}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">年度限额</span><span className="font-bold text-gray-800">￥{showDetail.coverageLimit.toLocaleString()}</span></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-6">
                <h4 className="mb-3 font-medium text-gray-900">险种描述</h4>
                <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{showDetail.description}</p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowDetail(null)} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">关闭</button>
                {isProvince && (
                  <button
                    onClick={() => {
                      setShowDetail(null);
                      handleEdit(showDetail);
                    }}
                    className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"
                  >
                    编辑
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
