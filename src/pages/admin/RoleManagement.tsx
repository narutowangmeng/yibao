import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Shield, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  userCount: number;
  permissions: string[];
  level: 'national' | 'provincial' | 'municipal';
  status: 'active' | 'inactive';
}

const mockRoles: Role[] = [
  { id: '1', name: '系统管理员', code: 'SYS_ADMIN', description: '系统超级管理员，拥有所有权限', userCount: 3, permissions: ['all'], level: 'national', status: 'active' },
  { id: '2', name: '国家医保局领导', code: 'NATIONAL_LEADER', description: '国家医保局领导，查看全国数据', userCount: 12, permissions: ['dashboard', 'reports', 'supervision'], level: 'national', status: 'active' },
  { id: '3', name: '省级管理员', code: 'PROVINCE_ADMIN', description: '省级医保平台管理员', userCount: 31, permissions: ['dashboard', 'insured', 'payment', 'reports'], level: 'provincial', status: 'active' },
  { id: '4', name: '市级经办人员', code: 'CITY_OPERATOR', description: '市级医保经办机构业务人员', userCount: 156, permissions: ['insured', 'reimbursement', 'payment'], level: 'municipal', status: 'active' },
  { id: '5', name: '审核人员', code: 'AUDITOR', description: '报销审核专员', userCount: 89, permissions: ['reimbursement', 'audit'], level: 'municipal', status: 'active' },
  { id: '6', name: '监管人员', code: 'SUPERVISOR', description: '基金监管专员', userCount: 45, permissions: ['supervision', 'institutions'], level: 'municipal', status: 'active' },
];

const permissionGroups = [
  { key: 'dashboard', label: '数据概览' },
  { key: 'insured', label: '参保管理' },
  { key: 'reimbursement', label: '报销管理' },
  { key: 'payment', label: '缴费管理' },
  { key: 'institutions', label: '医疗机构' },
  { key: 'supervision', label: '基金监管' },
  { key: 'audit', label: '审核中心' },
  { key: 'reports', label: '统计报表' },
  { key: 'settings', label: '系统设置' },
];

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    code: '',
    description: '',
    level: 'municipal',
    status: 'active',
    permissions: [],
  });

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData(role);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
  };

  const handleSave = () => {
    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...r, ...formData } as Role : r));
    } else {
      const newRole: Role = {
        id: String(roles.length + 1),
        ...formData as Role,
        userCount: 0,
      };
      setRoles([...roles, newRole]);
    }
    setShowModal(false);
    setEditingRole(null);
    setFormData({ name: '', code: '', description: '', level: 'municipal', status: 'active', permissions: [] });
  };

  const togglePermission = (key: string) => {
    const perms = formData.permissions || [];
    if (perms.includes(key)) {
      setFormData({ ...formData, permissions: perms.filter(p => p !== key) });
    } else {
      setFormData({ ...formData, permissions: [...perms, key] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">角色管理</h2>
          <p className="text-gray-500 mt-1">管理系统角色和权限配置</p>
        </div>
        <button
          onClick={() => { setEditingRole(null); setFormData({ name: '', code: '', description: '', level: 'municipal', status: 'active', permissions: [] }); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#0891B2] text-white rounded-lg hover:bg-[#0e7490] transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增角色
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">角色名称</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">角色编码</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">层级</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">用户数</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0891B2]/10 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-[#0891B2]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{role.name}</p>
                        <p className="text-sm text-gray-500">{role.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{role.code}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      role.level === 'national' ? 'bg-purple-100 text-purple-700' :
                      role.level === 'provincial' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {role.level === 'national' ? '国家级' : role.level === 'provincial' ? '省级' : '市级'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {role.userCount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      role.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {role.status === 'active' ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(role)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button onClick={() => handleDelete(role.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">{editingRole ? '编辑角色' : '新增角色'}</h3>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">角色名称</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">角色编码</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2] focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">层级</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as Role['level'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2] focus:border-transparent"
                    >
                      <option value="national">国家级</option>
                      <option value="provincial">省级</option>
                      <option value="municipal">市级</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Role['status'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0891B2] focus:border-transparent"
                    >
                      <option value="active">启用</option>
                      <option value="inactive">禁用</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">权限配置</label>
                  <div className="grid grid-cols-3 gap-2">
                    {permissionGroups.map((perm) => (
                      <button
                        key={perm.key}
                        onClick={() => togglePermission(perm.key)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          formData.permissions?.includes(perm.key)
                            ? 'bg-[#0891B2] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {perm.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#0891B2] text-white rounded-lg hover:bg-[#0e7490] transition-colors"
                >
                  保存
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
