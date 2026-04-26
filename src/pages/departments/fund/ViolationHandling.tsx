import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Filter, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ViolationCase {
  id: string;
  title: string;
  institution: string;
  type: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed';
  date: string;
  handler: string;
  description: string;
}

const mockCases: ViolationCase[] = [
  { id: 'V001', title: '虚假住院案', institution: '某医院', type: '虚假报销', amount: 50000, status: 'pending', date: '2024-01-15', handler: '经办A', description: '涉嫌虚假住院骗取医保基金' },
  { id: 'V002', title: '过度医疗案', institution: '某诊所', type: '过度医疗', amount: 12000, status: 'processing', date: '2024-01-10', handler: '经办B', description: '存在过度检查、过度用药问题' },
];

const typeOptions = ['虚假报销', '过度医疗', '串换药品', '冒名就医', '其他'];
const statusOptions = [
  { value: 'pending', label: '待处理', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  { value: 'processing', label: '处理中', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  { value: 'completed', label: '已结案', color: 'bg-green-100 text-green-700', icon: CheckCircle },
];

export default function ViolationHandling() {
  const [cases, setCases] = useState<ViolationCase[]>(mockCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCase, setEditingCase] = useState<ViolationCase | null>(null);
  const [formData, setFormData] = useState<Partial<ViolationCase>>({});

  const filteredCases = cases.filter(c => {
    const matchSearch = c.title.includes(searchTerm) || c.institution.includes(searchTerm);
    const matchType = !filterType || c.type === filterType;
    const matchStatus = !filterStatus || c.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const handleAdd = () => {
    setEditingCase(null);
    setFormData({ status: 'pending' });
    setShowModal(true);
  };

  const handleEdit = (c: ViolationCase) => {
    setEditingCase(c);
    setFormData(c);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setCases(cases.filter(c => c.id !== id));
  };

  const handleSave = () => {
    if (editingCase) {
      setCases(cases.map(c => c.id === editingCase.id ? { ...c, ...formData } as ViolationCase : c));
    } else {
      const newCase: ViolationCase = {
        id: 'V' + String(cases.length + 1).padStart(3, '0'),
        title: formData.title || '',
        institution: formData.institution || '',
        type: formData.type || typeOptions[0],
        amount: formData.amount || 0,
        status: formData.status as ViolationCase['status'] || 'pending',
        date: new Date().toISOString().split('T')[0],
        handler: formData.handler || '当前用户',
        description: formData.description || '',
      };
      setCases([...cases, newCase]);
    }
    setShowModal(false);
  };

  const handleStatusChange = (id: string, newStatus: ViolationCase['status']) => {
    setCases(cases.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const getStatusBadge = (status: string) => {
    const s = statusOptions.find(o => o.value === status);
    if (!s) return null;
    const Icon = s.icon;
    return (
      <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${s.color}`}>
        <Icon className="w-3 h-3" /> {s.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">违规查处</h2>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" /> 新增案件
        </button>
      </div>

      <div className="flex gap-3 bg-white p-3 rounded-lg border border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索案件名称、机构..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
          <option value="">全部类型</option>
          {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
          <option value="">全部状态</option>
          {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">案件信息</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">违规类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">涉及金额</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">经办人</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((c) => (
              <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-800">{c.title}</p>
                    <p className="text-xs text-gray-500">{c.institution} · {c.date}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{c.type}</td>
                <td className="px-4 py-3 text-sm text-red-600 font-medium">¥{c.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{getStatusBadge(c.status)}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{c.handler}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {c.status !== 'completed' && (
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value as ViolationCase['status'])}
                        className="text-xs px-2 py-1 border border-gray-200 rounded"
                      >
                        {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    )}
                    <button onClick={() => handleEdit(c)} className="p-1.5 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{editingCase ? '编辑案件' : '新增案件'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">案件名称</label>
                  <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">涉及机构</label>
                  <input type="text" value={formData.institution || ''} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">违规类型</label>
                    <select value={formData.type || ''} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                      {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">涉及金额</label>
                    <input type="number" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">案件描述</label>
                  <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
                <button onClick={handleSave} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
