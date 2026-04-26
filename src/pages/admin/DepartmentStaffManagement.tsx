import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Search, Edit2, Trash2, Shield, Building2,
  CheckCircle, XCircle, MapPin, Eye, Filter, UserPlus,
  ChevronDown, ChevronRight, Lock, Globe, Database
} from 'lucide-react';
import type { UserRole } from '../../types/roles';

// 部门配置 - 各业务司的职能权限
const DEPARTMENT_CONFIGS: Record<string, {
  name: string;
  code: string;
  allowedRoles: UserRole[];
  functions: { id: string; label: string; desc: string }[];
}> = {
  treatment_director: {
    name: '待遇保障司',
    code: 'DYBZS',
    allowedRoles: ['operator', 'auditor'],
    functions: [
      { id: 'enrollment_manage', label: '参保管理', desc: '参保登记、信息变更、关系转移' },
      { id: 'payment_manage', label: '缴费管理', desc: '缴费核定、催缴管理、到账确认' },
      { id: 'benefit_policy', label: '待遇政策', desc: '待遇标准制定、待遇调整' },
      { id: 'insurance_directory', label: '医保目录', desc: '药品目录、诊疗项目、医用耗材' },
      { id: 'long_term_care', label: '长期护理保险', desc: '失能评估、护理服务管理' },
      { id: 'remote_medical', label: '异地就医', desc: '异地备案、结算管理' }
    ]
  },
  fund_supervisor: {
    name: '基金监管司',
    code: 'JJJGS',
    allowedRoles: ['operator', 'auditor'],
    functions: [
      { id: 'fund_monitoring', label: '基金监管', desc: '基金收支监控、风险预警' },
      { id: 'flight_inspection', label: '飞行检查', desc: '现场检查、专项检查' },
      { id: 'smart_supervision', label: '智能监管', desc: '大数据监控、规则库管理' },
      { id: 'violation_handling', label: '违规查处', desc: '欺诈骗保查处、违规处理' },
      { id: 'credit_management', label: '信用管理', desc: '定点机构信用评价、黑名单' },
      { id: 'complaint_management', label: '举报投诉', desc: '举报受理、奖励发放' }
    ]
  },
  medical_service_director: {
    name: '医药服务管理司',
    code: 'YYFWGLS',
    allowedRoles: ['operator', 'auditor'],
    functions: [
      { id: 'institution_manage', label: '医疗机构管理', desc: '定点机构准入、协议管理' },
      { id: 'drug_management', label: '药品管理', desc: '药品目录调整、集采管理' },
      { id: 'price_management', label: '医疗服务价格', desc: '价格项目制定、价格调整' },
      { id: 'procurement_manage', label: '招标采购', desc: '药品耗材招标、采购监管' },
      { id: 'payment_reform', label: '支付方式改革', desc: 'DRG/DIP付费、按病种付费' },
      { id: 'service_supervision', label: '医疗服务行为监管', desc: '诊疗规范、合理用药' }
    ]
  }
};

// 角色显示名称
const ROLE_LABELS: Record<string, string> = {
  operator: '操作员',
  auditor: '审核员'
};

// 数据访问范围选项
const DATA_SCOPE_OPTIONS = [
  { value: 'department_only', label: '仅本部门数据', desc: '只能查看和操作本部门业务数据' },
  { value: 'department_children', label: '本部门及下属', desc: '可查看本部门及下属机构数据' },
  { value: 'cross_department_read', label: '跨部门只读', desc: '可查看其他部门数据，仅操作本部门' },
  { value: 'full_read', label: '全局只读', desc: '可查看全局数据，仅操作本部门' }
];


interface StaffMember {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: 'operator' | 'auditor';
  status: 'active' | 'inactive';
  dataScope: string;
  permissions: string[];
  region: string;
  createdAt: string;
  lastLogin: string;
}

// 模拟数据
const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: '张三',
    username: 'operator001',
    email: 'operator001@nhis.gov.cn',
    phone: '138****0001',
    role: 'operator',
    status: 'active',
    dataScope: 'department_only',
    permissions: ['enrollment_manage', 'payment_manage', 'query_statistics'],
    region: '北京市',
    createdAt: '2024-01-15',
    lastLogin: '2024-01-20 09:30'
  },
  {
    id: '2',
    name: '李四',
    username: 'auditor001',
    email: 'auditor001@nhis.gov.cn',
    phone: '138****0002',
    role: 'auditor',
    status: 'active',
    dataScope: 'department_children',
    permissions: ['enrollment_manage', 'reimbursement_manage', 'audit_approve', 'query_statistics'],
    region: '北京市',
    createdAt: '2024-01-10',
    lastLogin: '2024-01-19 16:45'
  }
];

interface DepartmentStaffManagementProps {
  userRole: 'treatment_director' | 'fund_supervisor' | 'medical_service_director';
}

export default function DepartmentStaffManagement({ userRole }: DepartmentStaffManagementProps) {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showDetail, setShowDetail] = useState<StaffMember | null>(null);

  const deptConfig = DEPARTMENT_CONFIGS[userRole];

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.includes(searchTerm) ||
                         member.username.includes(searchTerm) ||
                         member.email.includes(searchTerm);
    const matchesRole = !filterRole || member.role === filterRole;
    const matchesStatus = !filterStatus || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddStaff = () => {
    setEditingStaff(null);
    setShowModal(true);
  };

  const handleEditStaff = (member: StaffMember) => {
    setEditingStaff(member);
    setShowModal(true);
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setStaff(staff.map(s =>
      s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
    ));
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      operator: 'bg-blue-100 text-blue-700',
      auditor: 'bg-purple-100 text-purple-700'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role as keyof typeof colors]}`}>
        {ROLE_LABELS[role]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle className="w-4 h-4" /> 启用</span>
      : <span className="flex items-center gap-1 text-gray-500 text-sm"><XCircle className="w-4 h-4" /> 禁用</span>;
  };

  const getDataScopeLabel = (scope: string) => {
    return DATA_SCOPE_OPTIONS.find(o => o.value === scope)?.label || scope;
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">本部门人员管理</h2>
          <p className="text-sm text-gray-500 mt-1">{deptConfig.name} - 管理本部门操作员和审核员</p>
        </div>
        <button
          onClick={handleAddStaff}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          添加人员
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">人员总数</span>
          </div>
          <p className="text-2xl font-bold">{staff.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">启用状态</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{staff.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">操作员</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{staff.filter(s => s.role === 'operator').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm">审核员</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{staff.filter(s => s.role === 'auditor').length}</p>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索姓名、用户名、邮箱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">全部角色</option>
          <option value="operator">操作员</option>
          <option value="auditor">审核员</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">全部状态</option>
          <option value="active">启用</option>
          <option value="inactive">禁用</option>
        </select>
      </div>

      {/* 人员列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">人员信息</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">角色</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">数据范围</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">权限数量</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">最后登录</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStaff.map((member) => (
              <motion.tr
                key={member.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.username} · {member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{getRoleBadge(member.role)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Database className="w-4 h-4" />
                    {getDataScopeLabel(member.dataScope)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{member.permissions.length} 项</span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleStatus(member.id)}
                    className="cursor-pointer"
                  >
                    {getStatusBadge(member.status)}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{member.lastLogin}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setShowDetail(member)}
                      className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditStaff(member)}
                      className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(member.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredStaff.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>暂无人员数据</p>
          </div>
        )}
      </div>

      {/* 添加/编辑弹窗 */}
      <AnimatePresence>
        {showModal && (
          <StaffModal
            deptConfig={deptConfig}
            editingStaff={editingStaff}
            onClose={() => setShowModal(false)}
            onSave={(data) => {
              if (editingStaff) {
                setStaff(staff.map(s => s.id === editingStaff.id ? { ...s, ...data } : s));
              } else {
                setStaff([...staff, {
                  ...data,
                  id: String(staff.length + 1),
                  createdAt: new Date().toISOString().split('T')[0],
                  lastLogin: '-'
                }]);
              }
              setShowModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {showDetail && (
          <DetailModal
            staff={showDetail}
            onClose={() => setShowDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// 添加/编辑人员弹窗
interface StaffModalProps {
  deptConfig: { name: string; code: string; allowedRoles: UserRole[] };
  editingStaff: StaffMember | null;
  onClose: () => void;
  onSave: (data: Partial<StaffMember>) => void;
}

function StaffModal({ deptConfig, editingStaff, onClose, onSave }: StaffModalProps) {
  const [formData, setFormData] = useState({
    name: editingStaff?.name || '',
    username: editingStaff?.username || '',
    email: editingStaff?.email || '',
    phone: editingStaff?.phone || '',
    role: editingStaff?.role || 'operator',
    dataScope: editingStaff?.dataScope || 'department_only',
    permissions: editingStaff?.permissions || [],
    region: editingStaff?.region || '',
    status: editingStaff?.status || 'active'
  });

  const [activeTab, setActiveTab] = useState('basic');

  const togglePermission = (permId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {editingStaff ? '编辑人员' : '添加人员'}
          </h3>
          <p className="text-sm text-gray-500">{deptConfig.name}</p>
        </div>

        {/* 标签页 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('basic')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${activeTab === 'basic' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600'}`}
          >
            基本信息
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${activeTab === 'permissions' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600'}`}
          >
            业务权限
          </button>
          <button
            onClick={() => setActiveTab('scope')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${activeTab === 'scope' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600'}`}
          >
            数据范围
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'operator' | 'auditor' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="operator">操作员</option>
                    <option value="auditor">审核员</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="active">启用</option>
                    <option value="inactive">禁用</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">选择该人员可执行的本部门业务职能</p>
              {deptConfig.functions.map((func) => (
                <div
                  key={func.id}
                  onClick={() => togglePermission(func.id)}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                    formData.permissions.includes(func.id)
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 hover:border-cyan-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      formData.permissions.includes(func.id) ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300'
                    }`}>
                      {formData.permissions.includes(func.id) && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{func.label}</p>
                      <p className="text-sm text-gray-500">{func.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'scope' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">设置该人员可访问的数据范围</p>
              {DATA_SCOPE_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  onClick={() => setFormData({ ...formData, dataScope: option.value })}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    formData.dataScope === option.value
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 hover:border-cyan-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      formData.dataScope === option.value ? 'border-cyan-500' : 'border-gray-300'
                    }`}>
                      {formData.dataScope === option.value && <div className="w-2 h-2 rounded-full bg-cyan-500" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{option.label}</p>
                      <p className="text-sm text-gray-500">{option.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">管辖区域</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="如：北京市、上海市等"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// 详情弹窗
interface DetailModalProps {
  staff: StaffMember;
  onClose: () => void;
}

function DetailModal({ staff, onClose }: DetailModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">人员详情</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-cyan-600" />
            </div>
            <div>
              <p className="text-xl font-bold">{staff.name}</p>
              <p className="text-gray-500">{ROLE_LABELS[staff.role]}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">用户名</p>
              <p className="font-medium">{staff.username}</p>
            </div>
            <div>
              <p className="text-gray-500">邮箱</p>
              <p className="font-medium">{staff.email}</p>
            </div>
            <div>
              <p className="text-gray-500">电话</p>
              <p className="font-medium">{staff.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">状态</p>
              <p className="font-medium">{staff.status === 'active' ? '启用' : '禁用'}</p>
            </div>
            <div>
              <p className="text-gray-500">数据范围</p>
              <p className="font-medium">{getDataScopeLabel(staff.dataScope)}</p>
            </div>
            <div>
              <p className="text-gray-500">管辖区域</p>
              <p className="font-medium">{staff.region || '未设置'}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500 mb-2">业务权限</p>
            <div className="flex flex-wrap gap-2">
              {staff.permissions.map(perm => {
                const funcInfo = deptConfig.functions.find(f => f.id === perm);
                return (
                  <span key={perm} className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs">
                    {funcInfo?.label || perm}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            关闭
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
