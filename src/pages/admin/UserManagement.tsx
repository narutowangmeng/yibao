import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  User,
  Shield,
  Building,
  CheckCircle,
  XCircle,
  Filter
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
  {
    id: '1',
    name: '管理员A',
    username: 'admin001',
    email: 'admin@nhis.gov.cn',
    phone: '138****0001',
    role: '系统管理员',
    department: '信息中心',
    level: 'national',
    status: 'active',
    lastLogin: '2024-01-15 09:30',
    createdAt: '2023-06-01'
  },
  {
    id: '2',
    name: '经办员A',
    username: 'operator001',
    email: 'operator@nhis.gov.cn',
    phone: '138****0002',
    role: '业务经办',
    department: '参保管理科',
    level: 'provincial',
    status: 'active',
    lastLogin: '2024-01-14 16:45',
    createdAt: '2023-08-15'
  },
  {
    id: '3',
    name: '审核员A',
    username: 'auditor001',
    email: 'auditor@nhis.gov.cn',
    phone: '138****0003',
    role: '审核人员',
    department: '审核科',
    level: 'municipal',
    status: 'inactive',
    lastLogin: '2024-01-10 11:20',
    createdAt: '2023-09-20'
  }
];

const roles = ['系统管理员', '业务经办', '审核人员', '监管人员', '财务人员', '领导'];
const departments = ['信息中心', '参保管理科', '审核科', '监管科', '财务科', '办公室'];
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.includes(searchTerm) || 
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
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u => 
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
          {roles.map(role => <option key={role} value={role}>{role}</option>)}
        </select>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">全部层级</option>
          {levels.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
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
                      <><XCircle className="w-3 h-3" /> 禁用</>
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
                setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
              } else {
                setUsers([...users, { ...userData, id: String(users.length + 1), lastLogin: '-', createdAt: new Date().toISOString().split('T')[0] }]);
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
                {roles.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">部门</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
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
                {levels.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
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
