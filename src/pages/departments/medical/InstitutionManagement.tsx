import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, FileCheck, Award, LogOut, Plus, Search, Stethoscope, Pill, Star, Edit2, Trash2, Filter } from 'lucide-react';

const tabs = [
  { id: 'access', label: '机构准入', icon: Building2 },
  { id: 'classification', label: '分级分类', icon: Award },
  { id: 'physician', label: '医保医师', icon: Stethoscope },
  { id: 'pharmacist', label: '医保药师', icon: Pill },
  { id: 'agreement', label: '协议管理', icon: FileCheck },
  { id: 'assessment', label: '机构考核', icon: Star },
  { id: 'exit', label: '退出管理', icon: LogOut }
];

interface Institution {
  id: string;
  name: string;
  type: string;
  level: string;
  category: string;
  region: string;
  beds: number;
  physicians: number;
  pharmacists: number;
  creditScore: number;
}

interface Physician {
  id: string;
  name: string;
  gender: string;
  title: string;
  department: string;
  institution: string;
  licenseNo: string;
  creditScore: number;
  status: string;
}

interface Pharmacist {
  id: string;
  name: string;
  gender: string;
  title: string;
  institution: string;
  licenseNo: string;
  creditScore: number;
  status: string;
}

export default function InstitutionManagement() {
  const [activeTab, setActiveTab] = useState('access');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'institution' | 'physician' | 'pharmacist'>('institution');

  const [institutions, setInstitutions] = useState<Institution[]>([
    { id: 'INST-001', name: '省人民医院', type: '综合医院', level: '三级甲等', category: 'A类', region: 'XX市', beds: 2500, physicians: 856, pharmacists: 128, creditScore: 95 },
    { id: 'INST-002', name: '市第一医院', type: '综合医院', level: '三级乙等', category: 'B类', region: 'XX区', beds: 1200, physicians: 456, pharmacists: 68, creditScore: 82 },
    { id: 'INST-003', name: '社区卫生服务中心', type: '社区中心', level: '一级', category: 'C类', region: 'XX区', beds: 50, physicians: 28, pharmacists: 8, creditScore: 78 }
  ]);

  const [physicians, setPhysicians] = useState<Physician[]>([
    { id: 'PHY-001', name: '医师A', gender: '男', title: '主任医师', department: '心内科', institution: '省人民医院', licenseNo: '110110****0001', creditScore: 96, status: 'active' },
    { id: 'PHY-002', name: '医师B', gender: '女', title: '副主任医师', department: '呼吸科', institution: '省人民医院', licenseNo: '110110****0002', creditScore: 88, status: 'active' },
    { id: 'PHY-003', name: '医师C', gender: '男', title: '主治医师', department: '外科', institution: '市第一医院', licenseNo: '110110****0003', creditScore: 65, status: 'suspended' }
  ]);

  const [pharmacists, setPharmacists] = useState<Pharmacist[]>([
    { id: 'PHA-001', name: '药师A', gender: '女', title: '主任药师', institution: '省人民医院', licenseNo: '210110****0001', creditScore: 94, status: 'active' },
    { id: 'PHA-002', name: '药师B', gender: '男', title: '主管药师', institution: '市第一医院', licenseNo: '210110****0002', creditScore: 85, status: 'active' }
  ]);

  const filteredInstitutions = institutions.filter(item => {
    const matchesSearch = item.name.includes(searchQuery) || item.id.includes(searchQuery);
    const matchesCategory = !filterCategory || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredPhysicians = physicians.filter(item =>
    item.name.includes(searchQuery) || item.id.includes(searchQuery) || item.institution.includes(searchQuery)
  );

  const filteredPharmacists = pharmacists.filter(item =>
    item.name.includes(searchQuery) || item.id.includes(searchQuery) || item.institution.includes(searchQuery)
  );

  const handleAdd = (type: 'institution' | 'physician' | 'pharmacist') => {
    setModalType(type);
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: any, type: 'institution' | 'physician' | 'pharmacist') => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = (id: string, type: 'institution' | 'physician' | 'pharmacist') => {
    if (type === 'institution') setInstitutions(prev => prev.filter(i => i.id !== id));
    else if (type === 'physician') setPhysicians(prev => prev.filter(i => i.id !== id));
    else setPharmacists(prev => prev.filter(i => i.id !== id));
  };

  const handleSave = (formData: any) => {
    if (modalType === 'institution') {
      if (editingItem) {
        setInstitutions(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
      } else {
        setInstitutions(prev => [...prev, { ...formData, id: `INST-${String(prev.length + 1).padStart(3, '0')}` }]);
      }
    } else if (modalType === 'physician') {
      if (editingItem) {
        setPhysicians(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
      } else {
        setPhysicians(prev => [...prev, { ...formData, id: `PHY-${String(prev.length + 1).padStart(3, '0')}` }]);
      }
    } else {
      if (editingItem) {
        setPharmacists(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
      } else {
        setPharmacists(prev => [...prev, { ...formData, id: `PHA-${String(prev.length + 1).padStart(3, '0')}` }]);
      }
    }
    setShowModal(false);
  };

  const renderAccessContent = () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索机构名称或编码" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg">
          <option value="">全部分类</option>
          <option value="A类">A类</option>
          <option value="B类">B类</option>
          <option value="C类">C类</option>
        </select>
        <button onClick={() => handleAdd('institution')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />新增机构
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">机构名称</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">类型</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">等级</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">分类</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">床位数</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">信用分</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th></tr></thead>
          <tbody>{filteredInstitutions.map((item) => (<tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50"><td className="px-4 py-3 text-sm text-gray-800 font-medium">{item.name}</td><td className="px-4 py-3 text-sm text-gray-600">{item.type}</td><td className="px-4 py-3 text-sm text-gray-600">{item.level}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded ${item.category === 'A类' ? 'bg-green-100 text-green-700' : item.category === 'B类' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.category}</span></td><td className="px-4 py-3 text-sm text-gray-600">{item.beds}</td><td className="px-4 py-3 text-sm font-medium text-green-600">{item.creditScore}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => handleEdit(item, 'institution')} className="p-1.5 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'institution')} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></div></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );

  const renderPhysicianContent = () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索医师姓名或所属机构" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
        </div>
        <button onClick={() => handleAdd('physician')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />新增医师
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">医师姓名</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">职称</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">科室</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">所属机构</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">信用分</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th></tr></thead>
          <tbody>{filteredPhysicians.map((item) => (<tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50"><td className="px-4 py-3 text-sm text-gray-800 font-medium">{item.name}</td><td className="px-4 py-3 text-sm text-gray-600">{item.title}</td><td className="px-4 py-3 text-sm text-gray-600">{item.department}</td><td className="px-4 py-3 text-sm text-gray-600">{item.institution}</td><td className="px-4 py-3 text-sm font-medium text-green-600">{item.creditScore}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.status === 'active' ? '正常' : '暂停'}</span></td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => handleEdit(item, 'physician')} className="p-1.5 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'physician')} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></div></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );

  const renderPharmacistContent = () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索药师姓名或所属机构" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
        </div>
        <button onClick={() => handleAdd('pharmacist')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />新增药师
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">药师姓名</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">职称</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">所属机构</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">信用分</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th></tr></thead>
          <tbody>{filteredPharmacists.map((item) => (<tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50"><td className="px-4 py-3 text-sm text-gray-800 font-medium">{item.name}</td><td className="px-4 py-3 text-sm text-gray-600">{item.title}</td><td className="px-4 py-3 text-sm text-gray-600">{item.institution}</td><td className="px-4 py-3 text-sm font-medium text-green-600">{item.creditScore}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.status === 'active' ? '正常' : '暂停'}</span></td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => handleEdit(item, 'pharmacist')} className="p-1.5 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'pharmacist')} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></div></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;
    return (
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{editingItem ? '编辑' : '新增'}{modalType === 'institution' ? '机构' : modalType === 'physician' ? '医师' : '药师'}</h3>
            <form onSubmit={(e) => { e.preventDefault(); const formData = new FormData(e.currentTarget); handleSave(Object.fromEntries(formData)); }} className="space-y-4">
              {modalType === 'institution' && (<><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">机构名称</label><input name="name" defaultValue={editingItem?.name} className="w-full px-3 py-2 border border-gray-200 rounded-lg" required /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">机构类型</label><select name="type" defaultValue={editingItem?.type || '综合医院'} className="w-full px-3 py-2 border border-gray-200 rounded-lg"><option>综合医院</option><option>专科医院</option><option>社区中心</option></select></div></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">等级</label><select name="level" defaultValue={editingItem?.level || '三级甲等'} className="w-full px-3 py-2 border border-gray-200 rounded-lg"><option>三级甲等</option><option>三级乙等</option><option>二级</option><option>一级</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">分类</label><select name="category" defaultValue={editingItem?.category || 'A类'} className="w-full px-3 py-2 border border-gray-200 rounded-lg"><option>A类</option><option>B类</option><option>C类</option></select></div></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">床位数</label><input name="beds" type="number" defaultValue={editingItem?.beds} className="w-full px-3 py-2 border border-gray-200 rounded-lg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">信用分</label><input name="creditScore" type="number" defaultValue={editingItem?.creditScore} className="w-full px-3 py-2 border border-gray-200 rounded-lg" /></div></div></>)}
              {modalType === 'physician' && (<><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">医师姓名</label><input name="name" defaultValue={editingItem?.name} className="w-full px-3 py-2 border border-gray-200 rounded-lg" required /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">性别</label><select name="gender" defaultValue={editingItem?.gender || '男'} className="w-full px-3 py-2 border border-gray-200 rounded-lg"><option>男</option><option>女</option></select></div></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">职称</label><select name="title" defaultValue={editingItem?.title || '主任医师'} className="w-full px-3 py-2 border border-gray-200 rounded-lg"><option>主任医师</option><option>副主任医师</option><option>主治医师</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">科室</label><input name="department" defaultValue={editingItem?.department} className="w-full px-3 py-2 border border-gray-200 rounded-lg" /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">所属机构</label><input name="institution" defaultValue={editingItem?.institution} className="w-full px-3 py-2 border border-gray-200 rounded-lg" /></div></>)}
              {modalType === 'pharmacist' && (<><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">药师姓名</label><input name="name" defaultValue={editingItem?.name} className="w-full px-3 py-2 border border-gray-200 rounded-lg" required /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">性别</label><select name="gender" defaultValue={editingItem?.gender || '女'} className="w-full px-3 py-2 border border-gray-200 rounded-lg"><option>男</option><option>女</option></select></div></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">职称</label><select name="title" defaultValue={editingItem?.title || '主任药师'} className="w-full px-3 py-2 border border-gray-200 rounded-lg"><option>主任药师</option><option>副主任药师</option><option>主管药师</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">所属机构</label><input name="institution" defaultValue={editingItem?.institution} className="w-full px-3 py-2 border border-gray-200 rounded-lg" /></div></div></>)}
              <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button><button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button></div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-200">{tabs.map((tab) => { const Icon = tab.icon; return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'}`}><Icon className="w-4 h-4" />{tab.label}</button>); })}</div>
      {activeTab === 'access' && renderAccessContent()}
      {activeTab === 'physician' && renderPhysicianContent()}
      {activeTab === 'pharmacist' && renderPharmacistContent()}
      {renderModal()}
    </div>
  );
}
