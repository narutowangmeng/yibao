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

interface InsuranceType {
  id: string;
  code: string;
  name: string;
  category: 'employee' | 'resident' | 'flexible' | 'retired';
  description: string;
  status: 'active' | 'inactive';
  annualFee: number;
  reimbursementRate: number;
  coverageLimit: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const mockInsuranceTypes: InsuranceType[] = [
  {
    id: '1',
    code: 'JS-YB-ZG-001',
    name: '江苏省职工基本医疗保险',
    category: 'employee',
    description: '适用于全省机关事业单位、企业职工及参保在职人员，执行住院、门诊统筹和个人账户保障政策。',
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
    code: 'JS-YB-CX-002',
    name: '江苏省城乡居民基本医疗保险',
    category: 'resident',
    description: '适用于城乡居民参保群体，覆盖住院、普通门诊、门诊慢特病及大病保险待遇。',
    status: 'active',
    annualFee: 460,
    reimbursementRate: 68,
    coverageLimit: 320000,
    createdAt: '2021-01-01',
    updatedAt: '2026-02-26',
    createdBy: '省待遇保障处 陈磊',
  },
  {
    id: '3',
    code: 'JS-YB-LH-003',
    name: '江苏省灵活就业人员医疗保险',
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
    id: '4',
    code: 'JS-YB-LX-004',
    name: '江苏省退休人员补充医疗保障',
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
];

const categoryLabels: Record<string, { label: string; color: string }> = {
  employee: { label: '职工医保', color: 'bg-blue-100 text-blue-700' },
  resident: { label: '居民医保', color: 'bg-green-100 text-green-700' },
  flexible: { label: '灵活就业', color: 'bg-purple-100 text-purple-700' },
  retired: { label: '退休补充', color: 'bg-orange-100 text-orange-700' },
};

const statusLabels: Record<string, { label: string; color: string; icon: any }> = {
  active: { label: '启用', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  inactive: { label: '停用', color: 'bg-gray-100 text-gray-700', icon: XCircle },
};

export default function InsuranceTypeManagement() {
  const [insuranceTypes, setInsuranceTypes] = useState<InsuranceType[]>(mockInsuranceTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState<InsuranceType | null>(null);
  const [showDetail, setShowDetail] = useState<InsuranceType | null>(null);

  const filteredData = insuranceTypes.filter((item) => {
    const matchSearch = item.name.includes(searchTerm) || item.code.includes(searchTerm);
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
          <p className="text-sm text-gray-500 mt-1">配置和维护全省医保险种、缴费标准及待遇参数</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增险种
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">险种总数</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-400 mt-1">系统配置</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">启用险种</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-xs text-green-500 mt-1">正常参保</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">停用险种</p>
          <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
          <p className="text-xs text-gray-400 mt-1">暂停新增参保</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">平均年缴费</p>
          <p className="text-2xl font-bold text-cyan-600">¥{stats.avgFee}</p>
          <p className="text-xs text-gray-400 mt-1">按险种口径</p>
        </motion.div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="搜索险种名称或编码"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-gray-200 py-2 px-4 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">全部分类</option>
          <option value="employee">职工医保</option>
          <option value="resident">居民医保</option>
          <option value="flexible">灵活就业</option>
          <option value="retired">退休补充</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border border-gray-200 py-2 px-4 focus:border-cyan-500 focus:outline-none"
        >
          <option value="all">全部状态</option>
          <option value="active">启用</option>
          <option value="inactive">停用</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{item.code}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-600" />
                      <span className="text-sm font-medium text-gray-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${categoryInfo.color}`}>{categoryInfo.label}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-cyan-600 font-medium">¥{item.annualFee}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.reimbursementRate}%</td>
                  <td className="px-4 py-3 text-sm text-gray-600">¥{item.coverageLimit.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded ${statusLabels[item.status].color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusLabels[item.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setShowDetail(item)} className="p-1.5 rounded-md text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors" title="查看详情">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(item)} className="p-1.5 rounded-md text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors" title="编辑">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                        title={item.status === 'active' ? '停用' : '启用'}
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="删除">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>暂无险种数据</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">{editingType ? '编辑险种' : '新增险种'}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">险种编码</label>
                    <input type="text" defaultValue={editingType?.code || ''} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:outline-none" placeholder="如 JS-YB-ZG-001" />
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
                    <option value="retired">退休补充</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">险种描述</label>
                  <textarea defaultValue={editingType?.description || ''} className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:outline-none h-20" placeholder="请输入险种描述" />
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
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center">
                    <Shield className="w-7 h-7 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{showDetail.name}</h3>
                    <p className="text-sm text-gray-500">{showDetail.code}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetail(null)} className="p-2 rounded-lg hover:bg-gray-100">
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-cyan-600" />
                    基本信息
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">险种分类</span>
                      <span className={categoryLabels[showDetail.category].color + ' px-2 py-0.5 rounded text-xs'}>{categoryLabels[showDetail.category].label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">当前状态</span>
                      <span className={statusLabels[showDetail.status].color + ' px-2 py-0.5 rounded text-xs'}>{statusLabels[showDetail.status].label}</span>
                    </div>
                    <div className="flex justify-between"><span className="text-gray-500">创建时间</span><span>{showDetail.createdAt}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">最后更新</span><span>{showDetail.updatedAt}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">创建人</span><span>{showDetail.createdBy}</span></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-cyan-600" />
                    待遇参数
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">年缴费金额</span><span className="font-bold text-cyan-600">¥{showDetail.annualFee}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">报销比例</span><span className="font-bold text-green-600">{showDetail.reimbursementRate}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">年度限额</span><span className="font-bold text-gray-800">¥{showDetail.coverageLimit.toLocaleString()}</span></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-3">险种描述</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{showDetail.description}</p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowDetail(null)} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">关闭</button>
                <button onClick={() => { setShowDetail(null); handleEdit(showDetail); }} className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">编辑</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
