import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

interface ValueSet {
  id: string;
  valueSetId: string;
  valueSetName: string;
  entityId: string;
  sourceCode: string;
  term: string;
  valueSource: string;
}

const categories = ['限工伤保险', '限新生儿', '限科室类别', '限单日频次/数量', '限总频次/数量', '限女性', '限男性'];

export default function ValueSetManagement() {
  const [valueSets, setValueSets] = useState<ValueSet[]>([
    { id: '1', valueSetId: 'D00003', valueSetName: '限工伤保险', entityId: '1567677492370102806', sourceCode: '33120400500', term: '阴茎再植术', valueSource: '浙江省基本医疗保险医疗服务项目目录(2025)' },
    { id: '2', valueSetId: 'D00005', valueSetName: '限新生儿', entityId: '1567677492930050830', sourceCode: '31120201000', term: '新生儿换血术', valueSource: '浙江省基本医疗保险医疗服务项目目录(2025)' },
    { id: '3', valueSetId: 'D00025', valueSetName: '限女性', entityId: '1576768507169411231', sourceCode: '33130600700', term: '经宫腔镜子宫纵隔切除术', valueSource: '浙江省基本医疗保险医疗服务项目目录(2025)' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ValueSet | null>(null);
  const [formData, setFormData] = useState<Partial<ValueSet>>({ valueSetId: '', valueSetName: '', entityId: '', sourceCode: '', term: '', valueSource: '' });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ valueSetId: '', valueSetName: '', entityId: '', sourceCode: '', term: '', valueSource: '' });
    setShowModal(true);
  };

  const handleEdit = (item: ValueSet) => {
    setEditingItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleDelete = (id: string) => setValueSets(valueSets.filter(v => v.id !== id));

  const handleSave = () => {
    if (editingItem) {
      setValueSets(valueSets.map(v => v.id === editingItem.id ? { ...v, ...formData } as ValueSet : v));
    } else {
      setValueSets([...valueSets, { id: String(Date.now()), ...formData } as ValueSet]);
    }
    setShowModal(false);
  };

  const filtered = valueSets.filter(v => {
    const matchSearch = v.valueSetName.includes(searchTerm) || v.term.includes(searchTerm);
    const matchCategory = !filterCategory || v.valueSetName === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">值集字典管理</h1>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />新增值集
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索值集..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg">
          <option value="">全部分类</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="px-4 py-3 text-left text-sm font-medium">值集ID</th><th className="px-4 py-3 text-left text-sm font-medium">值集名称</th><th className="px-4 py-3 text-left text-sm font-medium">实体ID</th><th className="px-4 py-3 text-left text-sm font-medium">来源编码</th><th className="px-4 py-3 text-left text-sm font-medium">术语</th><th className="px-4 py-3 text-left text-sm font-medium">来源</th><th className="px-4 py-3 text-left text-sm font-medium">操作</th></tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono text-cyan-600">{item.valueSetId}</td>
                <td className="px-4 py-3 text-sm font-medium">{item.valueSetName}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.entityId}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.sourceCode}</td>
                <td className="px-4 py-3 text-sm">{item.term}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{item.valueSource}</td>
                <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => handleEdit(item)} className="p-1.5 text-gray-500 hover:text-cyan-600"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-lg p-6">
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">{editingItem ? '编辑' : '新增'}值集</h3><button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button></div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1">值集ID</label><input value={formData.valueSetId} onChange={(e) => setFormData({ ...formData, valueSetId: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">值集名称</label><select value={formData.valueSetName} onChange={(e) => setFormData({ ...formData, valueSetName: e.target.value })} className="w-full px-3 py-2 border rounded-lg">{categories.map(c => <option key={c}>{c}</option>)}</select></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1">实体ID</label><input value={formData.entityId} onChange={(e) => setFormData({ ...formData, entityId: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">来源编码</label><input value={formData.sourceCode} onChange={(e) => setFormData({ ...formData, sourceCode: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">术语</label><input value={formData.term} onChange={(e) => setFormData({ ...formData, term: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">来源</label><input value={formData.valueSource} onChange={(e) => setFormData({ ...formData, valueSource: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              </div>
              <div className="flex justify-end gap-3 mt-4"><button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">取消</button><button onClick={handleSave} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">保存</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
