import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, Plus, Search, Edit2, Trash2, CheckCircle, XCircle,
  Eye, UserPlus, Briefcase, Shield, Phone, Mail, FolderTree, UserCheck,
  ChevronRight, Settings, Lock, Key
} from 'lucide-react';
import type { UserRole } from '../../types/roles';
import { canDoManagementAction, getAgencyLevel } from '../../config/managementPermissions';

// 角色定义 - 系统管理员与经办人员同级，各业务科室有自己的审核岗
const ROLES = [
  { code: 'operation_admin', name: '系统管理员', desc: '管理机构人员、权限配置', color: 'bg-red-100 text-red-700' },
  { code: 'operator', name: '经办人员', desc: '业务办理、资料录入', color: 'bg-blue-100 text-blue-700' },
  { code: 'auditor', name: '审核岗', desc: '业务审核、异常处理', color: 'bg-purple-100 text-purple-700' },
];

// 科室定义
interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  staffCount: number;
}

interface StaffMember {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  departmentId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

// 模拟数据 - 7个业务科室
const initialDepartments: Department[] = [
  { id: 'd1', name: '参保登记', code: 'CBDJ', description: '负责参保登记、信息变更、关系转移等业务', staffCount: 5 },
  { id: 'd2', name: '缴费核定', code: 'JSHD', description: '负责缴费基数核定、费用计算、催缴管理', staffCount: 4 },
  { id: 'd3', name: '费用报销', code: 'FYBX', description: '负责医疗费用报销申请受理、材料初审', staffCount: 6 },
  { id: 'd4', name: '费用审核', code: 'FYSH', description: '负责医疗费用审核、合规性检查、异常处理', staffCount: 5 },
  { id: 'd5', name: '基金结算', code: 'JJJS', description: '负责基金结算、拨付管理、对账处理', staffCount: 3 },
  { id: 'd6', name: '稽核检查', code: 'JHJC', description: '负责稽核检查、违规查处、飞行检查', staffCount: 2 },
  { id: 'd7', name: '系统管理', code: 'XTGL', description: '负责系统配置、人员管理、权限分配', staffCount: 2 },
];

const initialStaff: StaffMember[] = [
  { id: '1', name: '张伟', username: 'zhangwei', email: 'zhangwei@nhis.gov.cn', phone: '138****1234', role: 'operator', departmentId: 'd1', status: 'active', createdAt: '2024-01-15', lastLogin: '2024-01-20 09:30' },
  { id: '2', name: '李娜', username: 'lina', email: 'lina@nhis.gov.cn', phone: '139****5678', role: 'auditor', departmentId: 'd1', status: 'active', createdAt: '2024-01-16', lastLogin: '2024-01-19 14:20' },
  { id: '3', name: '王强', username: 'wangqiang', email: 'wangqiang@nhis.gov.cn', phone: '137****9012', role: 'operator', departmentId: 'd2', status: 'active', createdAt: '2024-01-10', lastLogin: '2024-01-20 08:45' },
  { id: '4', name: '刘芳', username: 'liufang', email: 'liufang@nhis.gov.cn', phone: '136****3456', role: 'auditor', departmentId: 'd2', status: 'active', createdAt: '2024-01-12', lastLogin: '2024-01-18 16:30' },
  { id: '5', name: '陈明', username: 'chenming', email: 'chenming@nhis.gov.cn', phone: '135****7890', role: 'operator', departmentId: 'd3', status: 'active', createdAt: '2024-01-08', lastLogin: '2024-01-20 10:15' },
  { id: '6', name: '赵敏', username: 'zhaomin', email: 'zhaomin@nhis.gov.cn', phone: '134****6789', role: 'auditor', departmentId: 'd3', status: 'active', createdAt: '2024-01-09', lastLogin: '2024-01-19 11:20' },
  { id: '7', name: '孙丽', username: 'sunli', email: 'sunli@nhis.gov.cn', phone: '133****9876', role: 'operator', departmentId: 'd4', status: 'active', createdAt: '2024-01-11', lastLogin: '2024-01-18 15:30' },
  { id: '8', name: '周杰', username: 'zhoujie', email: 'zhoujie@nhis.gov.cn', phone: '132****5432', role: 'auditor', departmentId: 'd4', status: 'active', createdAt: '2024-01-13', lastLogin: '2024-01-17 09:45' },
  { id: '9', name: '吴刚', username: 'wugang', email: 'wugang@nhis.gov.cn', phone: '131****2468', role: 'operator', departmentId: 'd5', status: 'active', createdAt: '2024-01-14', lastLogin: '2024-01-16 14:00' },
  { id: '10', name: '郑红', username: 'zhenghong', email: 'zhenghong@nhis.gov.cn', phone: '130****1357', role: 'auditor', departmentId: 'd5', status: 'active', createdAt: '2024-01-07', lastLogin: '2024-01-15 10:30' },
  { id: '11', name: '钱明', username: 'qianming', email: 'qianming@nhis.gov.cn', phone: '139****8642', role: 'operator', departmentId: 'd6', status: 'active', createdAt: '2024-01-06', lastLogin: '2024-01-14 16:20' },
  { id: '12', name: '冯伟', username: 'fengwei', email: 'fengwei@nhis.gov.cn', phone: '138****9753', role: 'auditor', departmentId: 'd6', status: 'active', createdAt: '2024-01-05', lastLogin: '2024-01-13 11:45' },
  { id: '13', name: '系统管理员', username: 'admin', email: 'admin@nhis.gov.cn', phone: '137****1111', role: 'operation_admin', departmentId: 'd7', status: 'active', createdAt: '2024-01-01', lastLogin: '2024-01-20 08:00' },
];

interface OperationAdminManagementProps {
  userRole: UserRole;
  userAgency: string;
}

export default function OperationAdminManagement({ userRole, userAgency }: OperationAdminManagementProps) {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [activeTab, setActiveTab] = useState<'staff' | 'department'>('staff');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const isProvince = getAgencyLevel(userAgency) === 'province';
  const canCreate = canDoManagementAction(userRole, userAgency, 'operation-admin', 'create');
  const canEdit = canDoManagementAction(userRole, userAgency, 'operation-admin', 'edit');
  const canDelete = canDoManagementAction(userRole, userAgency, 'operation-admin', 'delete');
  const visibleDepartmentIds = isProvince ? departments.map((dept) => dept.id) : ['d1', 'd2', 'd3', 'd4'];
  const visibleDepartments = departments.filter((dept) => visibleDepartmentIds.includes(dept.id));
  const visibleStaff = staff.filter((member) => visibleDepartmentIds.includes(member.departmentId));

  const filteredStaff = visibleStaff.filter(member => {
    const matchesDept = !selectedDepartment || member.departmentId === selectedDepartment;
    const matchesSearch = member.name.includes(searchTerm) || member.username.includes(searchTerm);
    const matchesRole = !filterRole || member.role === filterRole;
    return matchesDept && matchesSearch && matchesRole;
  });

  const getRoleInfo = (roleCode: string) => ROLES.find(r => r.code === roleCode) || ROLES[0];
  const getDeptName = (deptId: string) => departments.find(d => d.id === deptId)?.name || '未分配';

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
    setStaff(staff.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
  };

  const handleSaveStaff = (data: Partial<StaffMember>) => {
    if (editingStaff) {
      setStaff(staff.map(s => s.id === editingStaff.id ? { ...s, ...data } : s));
    } else {
      setStaff([...staff, {
        ...data,
        id: String(staff.length + 1),
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: '-'
      } as StaffMember]);
    }
    setShowStaffModal(false);
  };

  // 科室管理
  const handleAddDept = () => {
    setEditingDept(null);
    setShowDeptModal(true);
  };

  const handleEditDept = (dept: Department) => {
    setEditingDept(dept);
    setShowDeptModal(true);
  };

  const handleDeleteDept = (id: string) => {
    setDepartments(departments.filter(d => d.id !== id));
    if (selectedDepartment === id) setSelectedDepartment('');
  };

  const handleSaveDept = (data: Partial<Department>) => {
    if (editingDept) {
      setDepartments(departments.map(d => d.id === editingDept.id ? { ...d, ...data } : d));
    } else {
      setDepartments([...departments, { ...data as Department, id: Date.now().toString(), staffCount: 0 }]);
    }
    setShowDeptModal(false);
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
          <h2 className="text-2xl font-bold text-gray-800">系统管理</h2>
          <p className="text-sm text-gray-500 mt-1">
            {isProvince ? '当前为省局视角，可维护全省模板配置' : '当前为地市视角，仅维护本市系统账号与科室配置'}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'staff' ? 'bg-cyan-100 text-cyan-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Users className="w-4 h-4" />
            人员管理
          </button>
          <button
            onClick={() => setActiveTab('department')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${activeTab === 'department' ? 'bg-cyan-100 text-cyan-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <FolderTree className="w-4 h-4" />
            科室管理
          </button>
        </div>
      </div>

      {activeTab === 'staff' ? (
        <div className="grid grid-cols-4 gap-6">
          {/* 左侧科室筛选 */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <FolderTree className="w-5 h-5" />
                  <span className="font-medium">科室</span>
                </div>
                {canCreate && (
                  <button onClick={handleAddDept} className="p-1 hover:bg-gray-100 rounded">
                    <Plus className="w-4 h-4 text-cyan-600" />
                  </button>
                )}
              </div>
              <div className="p-2">
                <div
                  onClick={() => setSelectedDepartment('')}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors mb-1 ${selectedDepartment === '' ? 'bg-cyan-50 border border-cyan-200' : 'hover:bg-gray-50 border border-transparent'}`}
                >
                  <span className="font-medium">全部人员</span>
                  <span className="text-xs text-gray-400">{visibleStaff.length}人</span>
                </div>
                {visibleDepartments.map((dept) => (
                  <motion.div
                    key={dept.id}
                    onClick={() => setSelectedDepartment(dept.id)}
                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors mb-1 ${selectedDepartment === dept.id ? 'bg-cyan-50 border border-cyan-200' : 'hover:bg-gray-50 border border-transparent'}`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-cyan-600" />
                      <span className="font-medium">{dept.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{visibleStaff.filter(s => s.departmentId === dept.id).length}人</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧人员列表 */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* 头部统计 */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    {selectedDepartment ? getDeptName(selectedDepartment) : '全部人员'}
                  </h3>
                  {canCreate && (
                    <button
                      onClick={handleAddStaff}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      添加人员
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {ROLES.map(role => (
                    <div key={role.code} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">{role.name}</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {filteredStaff.filter(s => s.role === role.code).length}
                      </p>
                    </div>
                  ))}
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
                    {ROLES.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
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
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">所属科室</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStaff.map((member) => {
                      const roleInfo = getRoleInfo(member.role);
                      return (
                        <motion.tr key={member.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
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
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                              {roleInfo.name}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{getDeptName(member.departmentId)}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleToggleStatus(member.id)} className="cursor-pointer">
                              {getStatusBadge(member.status)}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setSelectedStaff(member)} className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button onClick={() => setShowPermissionModal(true)} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                                <Key className="w-4 h-4" />
                              </button>
                              {canEdit && (
                                <button onClick={() => handleEditStaff(member)} className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              )}
                              {canDelete && (
                                <button onClick={() => handleDeleteStaff(member.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredStaff.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>暂无人员</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 科室管理 */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">科室管理</h3>
            {canCreate && (
              <button
                onClick={handleAddDept}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                添加科室
              </button>
            )}
          </div>
          <div className="p-6 grid grid-cols-2 gap-6">
            {visibleDepartments.map((dept) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border border-gray-200 rounded-xl hover:border-cyan-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                      <FolderTree className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{dept.name}</h4>
                      <p className="text-sm text-gray-500">{dept.code}</p>
                    </div>
                  </div>
                  {(canEdit || canDelete) && (
                    <div className="flex items-center gap-1">
                      {canEdit && (
                        <button onClick={() => handleEditDept(dept)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button onClick={() => handleDeleteDept(dept.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4">{dept.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{visibleStaff.filter(s => s.departmentId === dept.id).length} 人</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 人员弹窗 */}
      <AnimatePresence>
        {showStaffModal && (
          <StaffModal
            departments={departments}
            editingStaff={editingStaff}
            onClose={() => setShowStaffModal(false)}
            onSave={handleSaveStaff}
          />
        )}
      </AnimatePresence>

      {/* 科室弹窗 */}
      <AnimatePresence>
        {showDeptModal && (
          <DeptModal
            editingDept={editingDept}
            onClose={() => setShowDeptModal(false)}
            onSave={handleSaveDept}
          />
        )}
      </AnimatePresence>

      {/* 权限弹窗 */}
      <AnimatePresence>
        {showPermissionModal && (
          <PermissionModal onClose={() => setShowPermissionModal(false)} />
        )}
      </AnimatePresence>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {selectedStaff && (
          <DetailModal
            staff={selectedStaff}
            departmentName={getDeptName(selectedStaff.departmentId)}
            onClose={() => setSelectedStaff(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// 人员弹窗
function StaffModal({ departments, editingStaff, onClose, onSave }: { departments: Department[], editingStaff: StaffMember | null, onClose: () => void, onSave: (data: Partial<StaffMember>) => void }) {
  const [formData, setFormData] = useState({
    name: editingStaff?.name || '',
    username: editingStaff?.username || '',
    email: editingStaff?.email || '',
    phone: editingStaff?.phone || '',
    role: editingStaff?.role || 'operator',
    departmentId: editingStaff?.departmentId || departments[0]?.id || '',
    status: editingStaff?.status || 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{editingStaff ? '编辑人员' : '添加人员'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500">
                {ROLES.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">所属科室</label>
              <select value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500">
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
            <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// 科室弹窗
function DeptModal({ editingDept, onClose, onSave }: { editingDept: Department | null, onClose: () => void, onSave: (data: Partial<Department>) => void }) {
  const [formData, setFormData] = useState({
    name: editingDept?.name || '',
    code: editingDept?.code || '',
    description: editingDept?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{editingDept ? '编辑科室' : '添加科室'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">科室名称</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">科室编码</label>
            <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">科室描述</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500" rows={3} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
            <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// 权限弹窗
function PermissionModal({ onClose }: { onClose: () => void }) {
  const permissions = [
    { module: '参保登记', actions: ['查看', '新增', '编辑', '删除'] },
    { module: '费用审核', actions: ['查看', '初审', '复审', '终审'] },
    { module: '基金结算', actions: ['查看', '结算', '拨付'] },
    { module: '稽核检查', actions: ['查看', '检查', '处理'] },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">权限配置</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircle className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">功能模块</th>
                <th className="px-4 py-3 text-left text-sm font-medium">权限</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {permissions.map((p, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 font-medium">{p.module}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {p.actions.map((a, j) => (
                        <label key={j} className="flex items-center gap-1 text-sm">
                          <input type="checkbox" className="rounded text-cyan-600" defaultChecked />
                          {a}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
          <button onClick={onClose} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// 详情弹窗
function DetailModal({ staff, departmentName, onClose }: { staff: StaffMember, departmentName: string, onClose: () => void }) {
  const roleInfo = ROLES.find(r => r.code === staff.role) || ROLES[0];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">人员详情</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-cyan-600" />
            </div>
            <div>
              <p className="text-xl font-bold">{staff.name}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>{roleInfo.name}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-500">用户名</p><p className="font-medium">{staff.username}</p></div>
            <div><p className="text-gray-500">所属科室</p><p className="font-medium">{departmentName}</p></div>
            <div><p className="text-gray-500">邮箱</p><p className="font-medium">{staff.email}</p></div>
            <div><p className="text-gray-500">电话</p><p className="font-medium">{staff.phone}</p></div>
            <div><p className="text-gray-500">状态</p><p className="font-medium">{staff.status === 'active' ? '启用' : '禁用'}</p></div>
            <div><p className="text-gray-500">创建时间</p><p className="font-medium">{staff.createdAt}</p></div>
          </div>
        </div>
        <div className="p-6 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">关闭</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
