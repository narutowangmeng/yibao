import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, Plus, Edit2, Trash2, Eye, X } from 'lucide-react';

interface Material {
  id: string;
  code: string;
  name: string;
  category: string;
  spec: string;
  unit: string;
  price: number;
  status: 'active' | 'inactive';
}

const mockMaterials: Material[] = [
  { id: '1', code: 'HC001', name: '一次性输液器', category: '基础耗材', spec: '普通型', unit: '套', price: 2.5, status: 'active' },
  { id: '2', code: 'HC002', name: '医用纱布', category: '基础耗材', spec: '10x10cm', unit: '包', price: 1.2, status: 'active' },
];

const categories = ['基础耗材', '手术耗材', '检验耗材'];

export default function MaterialDirectoryQuery() {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [showDetail, setShowDetail] = useState<Material | null>(null);

  const filtered = materials.filter(m =>
    m.name.includes(searchTerm) || m.code.includes(searchTerm)
  );

  const handleSave = (data: Partial<Material>) => {
    if (editing) {
      setMaterials(materials.map(m => m.id === editing.id ? { ...m, ...data } : m));
    } else {
      setMaterials([...materials, { ...data, id: String(Date.now()) } as Material]);
    }
    setShowModal(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">耗材目录管理</h2>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
          <Plus className="w-4 h-4" /> 新增
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>
      </div>

      <table className="w-full bg-white rounded-lg shadow-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">编码</th>
            <th className="px-4 py-3 text-left text-sm font-medium">名称</th>
            <th className="px-4 py-3 text-left text-sm font-medium">分类</th>
            <th className="px-4 py-3 text-left text-sm font-medium">价格</th>
            <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {filtered.map(m => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{m.code}</td>
              <td className="px-4 py-3 font-medium">{m.name}</td>
              <td className="px-4 py-3 text-sm">{m.category}</td>
              <td className="px-4 py-3 text-sm">¥{m.price}</td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => setShowDetail(m)} className="p-1 text-gray-500 hover:text-blue-500"><Eye className="w-4 h-4" /></button>
                <button onClick={() => { setEditing(m); setShowModal(true); }} className="p-1 text-gray-500 hover:text-blue-500"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(m.id)} className="p-1 text-gray-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AnimatePresence>
        {showModal && (
          <Modal editing={editing} onClose={() => setShowModal(false)} onSave={handleSave} />
        )}
        {showDetail && (
          <DetailModal material={showDetail} onClose={() => setShowDetail(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ editing, onClose, onSave }: { editing: Material | null; onClose: () => void; onSave: (d: Partial<Material>) => void }) {
  const [form, setForm] = useState({
    code: editing?.code || '',
    name: editing?.name || '',
    category: editing?.category || categories[0],
    spec: editing?.spec || '',
    unit: editing?.unit || '',
    price: editing?.price || 0,
    status: editing?.status || 'active'
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4">{editing ? '编辑' : '新增'}耗材</h3>
        <form onSubmit={submit} className="space-y-3">
          <input type="text" placeholder="编码" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          <input type="text" placeholder="名称" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <input type="text" placeholder="规格" value={form.spec} onChange={e => setForm({ ...form, spec: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          <input type="text" placeholder="单位" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          <input type="number" placeholder="价格" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">取消</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">保存</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function DetailModal({ material, onClose }: { material: Material; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">耗材详情</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-2 text-sm">
          <p><span className="text-gray-500">编码:</span> {material.code}</p>
          <p><span className="text-gray-500">名称:</span> {material.name}</p>
          <p><span className="text-gray-500">分类:</span> {material.category}</p>
          <p><span className="text-gray-500">规格:</span> {material.spec}</p>
          <p><span className="text-gray-500">单位:</span> {material.unit}</p>
          <p><span className="text-gray-500">价格:</span> ¥{material.price}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
