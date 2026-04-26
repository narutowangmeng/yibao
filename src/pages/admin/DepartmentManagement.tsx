import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, Plus, Search, Edit2, Trash2, ChevronRight, ChevronDown, UserPlus, X } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  code: string;
  level: number;
  parentId?: string;
  manager: string;
  memberCount: number;
  permissions: string[];
  children?: Department[];
}

interface Person {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'inactive';
}

const initialDepartments: Department[] = [
  {
    id: '1',
    name: '国家医保局',
    code: 'NHSA',
    level: 1,
    manager: '局长A',
    memberCount: 127,
    permissions: ['全部权限'],
    children: [
      {
        id: '1-1',
        name: '待遇保障司',
        code: 'DYBZS',
        level: 2,
        parentId: '1',
        manager: '司长A',
        memberCount: 45,
        permissions: ['参保管理', '缴费管理', '待遇政策']
      },
      {
        id: '1-2',
        name: '基金监管司',
        code: 'JJJGS',
        level: 2,
        parentId: '1',
        manager: '司长B',
        memberCount: 38,
        permissions: ['基金监管', '飞行检查', '智能监管']
      },
      {
        id: '1-3',
        name: '医药服务管理司',
        code: 'YYFWGLS',
        level: 2,
        parentId: '1',
        manager: '司长C',
        memberCount: 44,
        permissions: ['医疗机构管理', '药品管理', '医疗服务价格']
      }
    ]
  }
];

const mockPersons: Person[] = [
  { id: 'p1', name: '员工A', role: '业务专员', status: 'active' },
  { id: 'p2', name: '员工B', role: '业务专员', status: 'active' },
  { id: 'p3', name: '员工C', role: '审核专员', status: 'active' },
];

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(['1']));
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [deptPersons, setDeptPersons] = useState<Person[]>([]);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', manager: '' });

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedDepts);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedDepts(newSet);
  };

  const handleAddDept = (parentId?: string) => {
    setEditingDept(null);
    setFormData({ name: '', code: '', manager: '' });
    setShowDeptModal(true);
  };

  const handleEditDept = (dept: Department) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, code: dept.code, manager: dept.manager });
    setShowDeptModal(true);
  };

  const handleDeleteDept = (deptId: string) => {
    const deleteFromTree = (items: Department[]): Department[] => {
      return items.filter(item => {
        if (item.id === deptId) return false;
        if (item.children) item.children = deleteFromTree(item.children);
        return true;
      });
    };
    setDepartments(deleteFromTree(departments));
    if (selectedDept?.id === deptId) setSelectedDept(null);
  };

  const handleSaveDept = () => {
    if (editingDept) {
      const updateTree = (items: Department[]): Department[] => {
        return items.map(item => {
          if (item.id === editingDept.id) {
            return { ...item, ...formData };
          }
          if (item.children) item.children = updateTree(item.children);
          return item;
        });
      };
      setDepartments(updateTree(departments));
      setSelectedDept({ ...editingDept, ...formData });
    } else {
      const newDept: Department = {
        id: Date.now().toString(),
        ...formData,
        level: selectedDept ? selectedDept.level + 1 : 1,
        parentId: selectedDept?.id,
        memberCount: 0,
        permissions: []
      };
      if (selectedDept) {
        const addToTree = (items: Department[]): Department[] => {
          return items.map(item => {
            if (item.id === selectedDept.id) {
              return { ...item, children: [...(item.children || []), newDept] };
            }
            if (item.children) item.children = addToTree(item.children);
            return item;
          });
        };
        setDepartments(addToTree(departments));
      } else {
        setDepartments([...departments, newDept]);
      }
    }
    setShowDeptModal(false);
  };

  const handleAddPerson = () => {
    setShowPersonModal(true);
  };

  const handleRemovePerson = (personId: string) => {
    setDeptPersons(deptPersons.filter(p => p.id !== personId));
  };

  const handleAssignPerson = (person: Person) => {
    if (!deptPersons.find(p => p.id === person.id)) {
      setDeptPersons([...deptPersons, person]);
    }
    setShowPersonModal(false);
  };

  const renderDepartmentTree = (depts: Department[], level = 0) => {
    return depts.map((dept) => (
      <div key={dept.id}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
            selectedDept?.id === dept.id ? 'bg-cyan-50 border border-cyan-200' : 'hover:bg-gray-50 border border-transparent'
          }`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
          onClick={() => setSelectedDept(dept)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); toggleExpand(dept.id); }}
            className="p-1 rounded hover:bg-gray-200 mr-2"
          >
            {dept.children ? expandedDepts.has(dept.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" /> : <span className="w-4" />}
          </button>
          <Building2 className="w-5 h-5 text-cyan-600 mr-3" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{dept.name}</span>
              <span className="text-xs text-gray-500">({dept.code})</span>
            </div>
            <div className="text-xs text-gray-500">{dept.manager} · {dept.memberCount}人</div>
          </div>
        </motion.div>
        {dept.children && expandedDepts.has(dept.id) && renderDepartmentTree(dept.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">部门管理</h1>
        <button onClick={() => handleAddDept()} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" /> 新增部门
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="搜索部门..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="p-2 max-h-[600px] overflow-y-auto">{renderDepartmentTree(departments)}</div>
          </div>
        </div>

        <div className="col-span-2">
          {selectedDept ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{selectedDept.name}</h2>
                    <p className="text-gray-500">部门编码: {selectedDept.code}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditDept(selectedDept)} className="p-2 hover:bg-gray-100 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteDept(selectedDept.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2"><Users className="w-4 h-4" /><span className="text-sm">人员数量</span></div>
                    <p className="text-2xl font-bold">{selectedDept.memberCount}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2"><Building2 className="w-4 h-4" /><span className="text-sm">部门层级</span></div>
                    <p className="text-2xl font-bold">{selectedDept.level}级</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2"><Users className="w-4 h-4" /><span className="text-sm">权限数量</span></div>
                    <p className="text-2xl font-bold">{selectedDept.permissions.length}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">部门人员</h3>
                    <button onClick={handleAddPerson} className="flex items-center gap-1 text-sm text-cyan-600"><UserPlus className="w-4 h-4" /> 分配人员</button>
                  </div>
                  <div className="border rounded-lg divide-y">
                    {deptPersons.map((person) => (
                      <div key={person.id} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center"><span className="text-sm font-medium text-cyan-700">{person.name[0]}</span></div>
                          <div><p className="font-medium">{person.name}</p><p className="text-xs text-gray-500">{person.role}</p></div>
                        </div>
                        <button onClick={() => handleRemovePerson(person.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                    {deptPersons.length === 0 && <div className="p-4 text-center text-gray-400">暂无人员</div>}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">请选择左侧部门查看详情</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showDeptModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold mb-4">{editingDept ? '编辑部门' : '新增部门'}</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">部门名称</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">部门编码</label><input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">负责人</label><input type="text" value={formData.manager} onChange={(e) => setFormData({ ...formData, manager: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowDeptModal(false)} className="px-4 py-2 border rounded-lg">取消</button>
                <button onClick={handleSaveDept} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">保存</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPersonModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold mb-4">分配人员</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mockPersons.map((person) => (
                  <button key={person.id} onClick={() => handleAssignPerson(person)} className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center"><span className="text-sm font-medium text-cyan-700">{person.name[0]}</span></div>
                      <div><p className="font-medium">{person.name}</p><p className="text-xs text-gray-500">{person.role}</p></div>
                    </div>
                    <Plus className="w-4 h-4 text-cyan-600" />
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={() => setShowPersonModal(false)} className="px-4 py-2 border rounded-lg">关闭</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
