import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, Plus, Search, Edit2, Trash2, CheckCircle, XCircle,
  Eye, UserPlus, Briefcase, Shield, Phone, Mail
} from 'lucide-react';

// 角色显示
const ROLE_LABELS: Record<string, string> = {
  operator: '经办人员',
  auditor: '审核人员'
};

interface Agency {
  id: string;
  name: string;
  code: string;
}

interface StaffMember {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: 'operator' | 'auditor';
  agencyId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

// 初始机构数据
const initialAgencies: Agency[] = [
  { id: 'nanjing', name: '南京', code: 'NJ' },
  { id: 'suzhou', name: '苏州', code: 'SZ' },
  { id: 'wuxi', name: '无锡', code: 'WX' },
  { id: 'changzhou', name: '常州', code: 'CZ' },
  { id: 'xuzhou', name: '徐州', code: 'XZ' },
  { id: 'nantong', name: '南通', code: 'NT' },
  { id: 'yangzhou', name: '扬州', code: 'YZ' },
  { id: 'yancheng', name: '盐城', code: 'YC' },
  { id: 'huaian', name: '淮安', code: 'HA' },
  { id: 'lianyungang', name: '连云港', code: 'LYG' },
  { id: 'taizhou', name: '泰州', code: 'TZ' },
  { id: 'suqian', name: '宿迁', code: 'SQ' },
  { id: 'zhenjiang', name: '镇江', code: 'ZJ' }
];

// 初始人员数据 - 为每个机构生成人员
const generateMockStaff = (): StaffMember[] => {
  const staff: StaffMember[] = [];
  let id = 1;

  const agencies = [
    { id: 'nanjing', name: '南京' },
    { id: 'suzhou', name: '苏州' },
    { id: 'wuxi', name: '无锡' },
    { id: 'changzhou', name: '常州' },
    { id: 'xuzhou', name: '徐州' },
    { id: 'nantong', name: '南通' },
    { id: 'yangzhou', name: '扬州' },
    { id: 'yancheng', name: '盐城' },
    { id: 'huaian', name: '淮安' },
    { id: 'lianyungang', name: '连云港' },
    { id: 'taizhou', name: '泰州' },
    { id: 'suqian', name: '宿迁' },
    { id: 'zhenjiang', name: '镇江' }
  ];

  const operatorNames = ['张伟', '王芳', '李娜', '刘洋', '陈静', '杨帆', '赵敏', '周杰', '吴倩', '孙鹏', '郑丽', '钱明', '朱红'];
  const auditorNames = ['李强', '王磊', '张敏', '刘芳', '陈杰', '杨洋', '赵伟', '周丽', '吴刚', '孙静', '郑强', '钱芳', '朱明'];

  agencies.forEach((agency, index) => {
    // 每个机构2-4个经办人员
    const operatorCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < operatorCount; i++) {
      const name = operatorNames[(index + i) % operatorNames.length];
      staff.push({
        id: String(id++),
        name,
        username: `${agency.id}_operator${String(i + 1).padStart(3, '0')}`,
        email: `${agency.id}_op${i + 1}@nhis.gov.cn`,
        phone: `138****${String(1000 + id).slice(1)}`,
        role: 'operator',
        agencyId: agency.id,
        status: Math.random() > 0.2 ? 'active' : 'inactive',
        createdAt: `2024-0${1 + Math.floor(Math.random() * 6)}-${10 + Math.floor(Math.random() * 20)}`,
        lastLogin: `2024-01-${10 + Math.floor(Math.random() * 20)} ${8 + Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      });
    }

    // 每个机构1-3个审核人员
    const auditorCount = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < auditorCount; i++) {
      const name = auditorNames[(index + i) % auditorNames.length];
      staff.push({
        id: String(id++),
        name,
        username: `${agency.id}_auditor${String(i + 1).padStart(3, '0')}`,
        email: `${agency.id}_au${i + 1}@nhis.gov.cn`,
        phone: `139****${String(1000 + id).slice(1)}`,
        role: 'auditor',
        agencyId: agency.id,
        status: Math.random() > 0.15 ? 'active' : 'inactive',
        createdAt: `2024-0${1 + Math.floor(Math.random() * 6)}-${10 + Math.floor(Math.random() * 20)}`,
        lastLogin: `2024-01-${10 + Math.floor(Math.random() * 20)} ${8 + Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
      });
    }
  });

  return staff;
};

const initialStaff = generateMockStaff();

export default function AgencyManagement() {
  const [agencies, setAgencies] = useState<Agency[]>(initialAgencies);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [selectedAgency, setSelectedAgency] = useState<string>('nanjing');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [showDetail, setShowDetail] = useState<StaffMember | null>(null);

  const currentAgency = agencies.find(a => a.id === selectedAgency);

  const filteredStaff = staff.filter(member => {
    const matchesAgency = member.agencyId === selectedAgency;
    const matchesSearch = member.name.includes(searchTerm) ||
                         member.username.includes(searchTerm);
    const matchesRole = !filterRole || member.role === filterRole;
    return matchesAgency && matchesSearch && matchesRole;
  });

  // 机构管理
  const handleAddAgency = () => {
    setEditingAgency(null);
    setShowAgencyModal(true);
  };

  const handleEditAgency = (agency: Agency) => {
    setEditingAgency(agency);
    setShowAgencyModal(true);
  };

  const handleDeleteAgency = (id: string) => {
    setAgencies(agencies.filter(a => a.id !== id));
    if (selectedAgency === id) {
      setSelectedAgency(agencies[0]?.id || '');
    }
  };

  const handleSaveAgency = (data: { name: string; code: string }) => {
    if (editingAgency) {
      setAgencies(agencies.map(a => a.id === editingAgency.id ? { ...a, ...data } : a));
    } else {
      setAgencies([...agencies, { ...data, id: Date.now().toString() }]);
    }
    setShowAgencyModal(false);
  };

  // 人员管理
  const handleAddStaff = () => {
    setEditingStaff(null);
    setShowStaffModal(true);
  };

  const handleEditStaff = (member: StaffMember) => {
    setEditingStaff(member);
    setShowStaffModal(true);
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setStaff(staff.map(s =>
      s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
    ));
  };

  const handleSaveStaff = (data: Partial<StaffMember>) => {
    if (editingStaff) {
      setStaff(staff.map(s => s.id === editingStaff.id ? { ...s, ...data } : s));
    } else {
      setStaff([...staff, {
        ...data,
        id: String(staff.length + 1),
        agencyId: selectedAgency,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: '-'
      } as StaffMember]);
    }
    setShowStaffModal(false);
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

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">机构管理</h2>
          <p className="text-sm text-gray-500 mt-1">管理各机构经办人员和审核人员</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* 左侧机构列表 */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Building2 className="w-5 h-5" />
                <span className="font-medium">机构列表</span>
              </div>
              <button
                onClick={handleAddAgency}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="w-4 h-4 text-cyan-600" />
              </button>
            </div>
            <div className="p-2 max-h-[600px] overflow-y-auto">
              {agencies.map((agency) => (
                <motion.div
                  key={agency.id}
                  className={`group flex items-center p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                    selectedAgency === agency.id
                      ? 'bg-cyan-50 border border-cyan-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div
                    onClick={() => setSelectedAgency(agency.id)}
                    className="flex items-center flex-1"
                  >
                    <Building2 className="w-4 h-4 text-cyan-600 mr-3" />
                    <div className="flex-1">
                      <span className="font-medium">{agency.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({agency.code})</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {staff.filter(s => s.agencyId === agency.id).length}人
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditAgency(agency); }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Edit2 className="w-3 h-3 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteAgency(agency.id); }}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧人员管理 */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* 头部 */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{currentAgency?.name}</h3>
                    <p className="text-sm text-gray-500">机构编码: {currentAgency?.code}</p>
                  </div>
                </div>
                <button
                  onClick={handleAddStaff}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  添加人员
                </button>
              </div>

              {/* 统计 */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">人员总数</span>
                  </div>
                  <p className="text-2xl font-bold">{filteredStaff.length}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">经办人员</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredStaff.filter(s => s.role === 'operator').length}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">审核人员</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {filteredStaff.filter(s => s.role === 'auditor').length}
                  </p>
                </div>
              </div>
            </div>

            {/* 筛选栏 */}
            <div className="p-4 border-b">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索姓名、用户名..."
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
                  <option value="operator">经办人员</option>
                  <option value="auditor">审核人员</option>
                </select>
              </div>
            </div>

            {/* 人员列表 */}
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">人员信息</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">角色</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">联系方式</th>
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
                            <p className="text-sm text-gray-500">{member.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getRoleBadge(member.role)}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {member.phone}
                          </div>
                        </div>
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
                  <p>该机构暂无人员</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 机构添加/编辑弹窗 */}
      <AnimatePresence>
        {showAgencyModal && (
          <AgencyModal
            editingAgency={editingAgency}
            onClose={() => setShowAgencyModal(false)}
            onSave={handleSaveAgency}
          />
        )}
      </AnimatePresence>

      {/* 人员添加/编辑弹窗 */}
      <AnimatePresence>
        {showStaffModal && (
          <StaffModal
            agency={currentAgency!}
            editingStaff={editingStaff}
            onClose={() => setShowStaffModal(false)}
            onSave={handleSaveStaff}
          />
        )}
      </AnimatePresence>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {showDetail && (
          <DetailModal
            staff={showDetail}
            agencyName={currentAgency?.name || ''}
            onClose={() => setShowDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// 机构添加/编辑弹窗
interface AgencyModalProps {
  editingAgency: Agency | null;
  onClose: () => void;
  onSave: (data: { name: string; code: string }) => void;
}

function AgencyModal({ editingAgency, onClose, onSave }: AgencyModalProps) {
  const [formData, setFormData] = useState({
    name: editingAgency?.name || '',
    code: editingAgency?.code || ''
  });

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
        className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {editingAgency ? '编辑机构' : '添加机构'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">机构名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">机构编码</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
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

// 人员添加/编辑弹窗
interface StaffModalProps {
  agency: Agency;
  editingStaff: StaffMember | null;
  onClose: () => void;
  onSave: (data: Partial<StaffMember>) => void;
}

function StaffModal({ agency, editingStaff, onClose, onSave }: StaffModalProps) {
  const [formData, setFormData] = useState({
    name: editingStaff?.name || '',
    username: editingStaff?.username || '',
    email: editingStaff?.email || '',
    phone: editingStaff?.phone || '',
    role: editingStaff?.role || 'operator',
    status: editingStaff?.status || 'active'
  });

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
        className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {editingStaff ? '编辑人员' : '添加人员'}
          </h3>
          <p className="text-sm text-gray-500">{agency.name} ({agency.code})</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                <option value="operator">经办人员</option>
                <option value="auditor">审核人员</option>
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
          <div className="flex justify-end gap-3 pt-4">
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
  agencyName: string;
  onClose: () => void;
}

function DetailModal({ staff, agencyName, onClose }: DetailModalProps) {
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
        className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4"
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
              <p className="text-gray-500">所属机构</p>
              <p className="font-medium">{agencyName}</p>
            </div>
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
              <p className="text-gray-500">创建时间</p>
              <p className="font-medium">{staff.createdAt}</p>
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
