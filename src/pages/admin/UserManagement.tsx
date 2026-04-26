import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  User,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  level: 'national' | 'provincial' | 'municipal';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

const mockUsers: UserData[] = [
  { id: '1', name: '沈志远', username: 'jsyb_admin_001', email: 'shenzy@jsyb.gov.cn', phone: '13805150011', role: '系统管理员', department: '省医保局信息中心', level: 'provincial', status: 'active', lastLogin: '2025-04-26 08:42', createdAt: '2023-05-18' },
  { id: '2', name: '顾明珠', username: 'jsyb_policy_002', email: 'gumz@jsyb.gov.cn', phone: '13805150012', role: '待遇保障专员', department: '待遇保障处', level: 'provincial', status: 'active', lastLogin: '2025-04-25 17:31', createdAt: '2023-07-08' },
  { id: '3', name: '周柏成', username: 'jsyb_fund_003', email: 'zhoubc@jsyb.gov.cn', phone: '13805150013', role: '基金监管专员', department: '基金监管处', level: 'provincial', status: 'active', lastLogin: '2025-04-25 15:09', createdAt: '2023-08-12' },
  { id: '4', name: '钱雨菲', username: 'nanjing_center_004', email: 'qianyf@njyb.gov.cn', phone: '13805150014', role: '经办审核岗', department: '南京市医保中心', level: 'municipal', status: 'active', lastLogin: '2025-04-26 09:13', createdAt: '2023-10-16' },
  { id: '5', name: '邵天宇', username: 'wuxi_audit_005', email: 'shaoty@wxyb.gov.cn', phone: '13805150015', role: '基金监管专员', department: '无锡市医保局', level: 'municipal', status: 'active', lastLogin: '2025-04-26 07:56', createdAt: '2024-01-10' },
  { id: '6', name: '许梦瑶', username: 'xuzhou_drug_006', email: 'xumy@xzyb.gov.cn', phone: '13805150016', role: '医药服务专员', department: '徐州市医保局', level: 'municipal', status: 'inactive', lastLogin: '2025-04-20 18:24', createdAt: '2024-02-06' },
  { id: '7', name: '韩文韬', username: 'changzhou_rule_007', email: 'hanwt@czyb.gov.cn', phone: '13805150017', role: '规则引擎管理员', department: '常州市医保中心', level: 'municipal', status: 'active', lastLogin: '2025-04-25 14:08', createdAt: '2024-02-21' },
  { id: '8', name: '汪静姝', username: 'suzhou_claims_008', email: 'wangjs@szyb.gov.cn', phone: '13805150018', role: '经办审核岗', department: '苏州市医保中心', level: 'municipal', status: 'active', lastLogin: '2025-04-26 08:58', createdAt: '2024-03-14' },
  { id: '9', name: '蒋承业', username: 'nantong_portal_009', email: 'jiangcy@ntyb.gov.cn', phone: '13805150019', role: '门户运维岗', department: '南通市医保局', level: 'municipal', status: 'active', lastLogin: '2025-04-24 19:40', createdAt: '2024-03-28' },
  { id: '10', name: '陆思齐', username: 'lyg_settle_010', email: 'lusiqi@lygyb.gov.cn', phone: '13805150020', role: '结算管理岗', department: '连云港市医保中心', level: 'municipal', status: 'active', lastLogin: '2025-04-25 11:22', createdAt: '2024-04-02' },
  { id: '11', name: '潘雨辰', username: 'huaian_remote_011', email: 'panyc@hayb.gov.cn', phone: '13805150021', role: '异地就医专员', department: '淮安市医保中心', level: 'municipal', status: 'active', lastLogin: '2025-04-26 08:17', createdAt: '2024-04-08' },
  { id: '12', name: '戴清妍', username: 'yancheng_ltc_012', email: 'daiqy@ycyb.gov.cn', phone: '13805150022', role: '长期护理专员', department: '盐城市医保局', level: 'municipal', status: 'inactive', lastLogin: '2025-04-18 16:55', createdAt: '2024-04-11' },
  { id: '13', name: '唐一鸣', username: 'yangzhou_dict_013', email: 'tangym@yzyb.gov.cn', phone: '13805150023', role: '数据字典管理员', department: '扬州市医保中心', level: 'municipal', status: 'active', lastLogin: '2025-04-24 10:36', createdAt: '2024-04-15' },
  { id: '14', name: '宋安澜', username: 'zhenjiang_eval_014', email: 'songanl@zjyb.gov.cn', phone: '13805150024', role: '信用评价专员', department: '镇江市医保局', level: 'municipal', status: 'active', lastLogin: '2025-04-25 13:52', createdAt: '2024-04-18' },
  { id: '15', name: '罗辰皓', username: 'taizhou_proc_015', email: 'luoch@tzyb.gov.cn', phone: '13805150025', role: '医药服务专员', department: '泰州市医保局', level: 'municipal', status: 'active', lastLogin: '2025-04-25 09:44', createdAt: '2024-04-20' },
  { id: '16', name: '高若溪', username: 'suqian_flight_016', email: 'gaorx@sqyb.gov.cn', phone: '13805150026', role: '飞行检查岗', department: '宿迁市医保中心', level: 'municipal', status: 'active', lastLogin: '2025-04-24 15:03', createdAt: '2024-04-22' },
  { id: '17', name: '陶子诚', username: 'jsyb_report_017', email: 'taozc@jsyb.gov.cn', phone: '13805150027', role: '统计报表专员', department: '省医保局办公室', level: 'provincial', status: 'active', lastLogin: '2025-04-26 08:05', createdAt: '2024-04-23' },
  { id: '18', name: '彭若楠', username: 'jsyb_rule_018', email: 'pengrn@jsyb.gov.cn', phone: '13805150028', role: '规则引擎管理员', department: '省医保局信息中心', level: 'provincial', status: 'active', lastLogin: '2025-04-25 20:11', createdAt: '2024-04-24' },
  { id: '19', name: '魏嘉禾', username: 'suzhou_credit_019', email: 'weijh@szyb.gov.cn', phone: '13805150029', role: '信用评价专员', department: '苏州市医保局', level: 'municipal', status: 'inactive', lastLogin: '2025-04-19 09:37', createdAt: '2024-04-24' },
  { id: '20', name: '龚书宁', username: 'nanjing_supervise_020', email: 'gongsn@njyb.gov.cn', phone: '13805150030', role: '基金监管专员', department: '南京市医保局', level: 'municipal', status: 'active', lastLogin: '2025-04-26 09:28', createdAt: '2024-04-25' },
];

const roles = ['系统管理员', '待遇保障专员', '基金监管专员', '经办审核岗', '医药服务专员', '规则引擎管理员', '门户运维岗', '结算管理岗', '异地就医专员', '长期护理专员', '数据字典管理员', '信用评价专员', '飞行检查岗', '统计报表专员'];
const departments = ['省医保局信息中心', '待遇保障处', '基金监管处', '医药服务管理处', '省医保局办公室', '南京市医保局', '南京市医保中心', '无锡市医保局', '徐州市医保局', '常州市医保中心', '苏州市医保局', '苏州市医保中心', '南通市医保局', '连云港市医保中心', '淮安市医保中心', '盐城市医保局', '扬州市医保中心', '镇江市医保局', '泰州市医保局', '宿迁市医保中心'];
const levels = [
  { value: 'national', label: '国家级' },
  { value: 'provincial', label: '省级' },
  { value: 'municipal', label: '市级' }
];

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [filterRole, setFilterRole] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.includes(searchTerm) ||
      user.username.includes(searchTerm) ||
      user.email.includes(searchTerm);
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesLevel = !filterLevel || user.level === filterLevel;
    return matchesSearch && matchesRole && matchesLevel;
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: UserData) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId));
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map((u) =>
      u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      national: 'bg-red-100 text-red-700',
      provincial: 'bg-blue-100 text-blue-700',
      municipal: 'bg-green-100 text-green-700'
    };
    const labels = { national: '国家级', provincial: '省级', municipal: '市级' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level as keyof typeof colors]}`}>
        {labels[level as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">用户管理</h2>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加用户
        </button>
      </div>

      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索用户姓名、用户名、邮箱..."
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
          {roles.map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">全部层级</option>
          {levels.map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">用户信息</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">角色部门</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">层级</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">最后登录</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm text-gray-800">{user.role}</p>
                    <p className="text-sm text-gray-500">{user.department}</p>
                  </div>
                </td>
                <td className="px-4 py-3">{getLevelBadge(user.level)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {user.status === 'active' ? (
                      <><CheckCircle className="w-3 h-3" /> 启用</>
                    ) : (
                      <><XCircle className="w-3 h-3" /> 停用</>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.lastLogin}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
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
      </div>

      <AnimatePresence>
        {showModal && (
          <UserModal
            user={editingUser}
            onClose={() => setShowModal(false)}
            onSave={(userData) => {
              if (editingUser) {
                setUsers(users.map((u) => u.id === editingUser.id ? { ...u, ...userData } : u));
              } else {
                setUsers([
                  ...users,
                  {
                    ...userData,
                    id: String(users.length + 1),
                    lastLogin: '-',
                    createdAt: new Date().toISOString().split('T')[0]
                  } as UserData
                ]);
              }
              setShowModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface UserModalProps {
  user: UserData | null;
  onClose: () => void;
  onSave: (data: Partial<UserData>) => void;
}

function UserModal({ user, onClose, onSave }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || roles[0],
    department: user?.department || departments[0],
    level: user?.level || 'municipal',
    status: user?.status || 'active'
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
            {user ? '编辑用户' : '添加用户'}
          </h3>
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
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {roles.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">部门</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">层级</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as 'national' | 'provincial' | 'municipal' })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {levels.map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}
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
                <option value="inactive">停用</option>
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
