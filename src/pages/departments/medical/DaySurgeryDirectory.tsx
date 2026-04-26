import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sun, Clock, CheckCircle, AlertCircle, Plus, Edit2, Trash2, Eye, X } from 'lucide-react';

interface Surgery {
  id: string;
  code: string;
  name: string;
  category: string;
  duration: string;
  recovery: string;
  price: number;
  status: 'active' | 'suspended';
}

const initialData: Surgery[] = [
  { id: '1', code: 'SS001', name: '白内障超声乳化摘除术', category: '眼科', duration: '30分钟', recovery: '2小时', price: 3500, status: 'active' },
  { id: '2', code: 'SS002', name: '腹股沟疝修补术', category: '普外科', duration: '45分钟', recovery: '4小时', price: 6800, status: 'active' },
];

const categories = ['全部', '眼科', '普外科', '肛肠科', '骨科', '耳鼻喉科'];

export default function DaySurgeryDirectory() {
  const [surgeries, setSurgeries] = useState<Surgery[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Surgery | null>(null);
  const [showDetail, setShowDetail] = useState<Surgery | null>(null);

  const filtered = surgeries.filter(s => {
    const matchesSearch = s.name.includes(searchTerm) || s.code.includes(searchTerm);
    const matchesCategory = selectedCategory === '全部' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (s: Surgery) => {
    setEditing(s);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setSurgeries(surgeries.filter(s => s.id !== id));
  };

  const handleSave = (data: Partial<Surgery>) => {
    if (editing) {
      setSurgeries(surgeries.map(s => s.id === editing.id ? { ...s, ...data } : s));
    } else {
      setSurgeries([...surgeries, { ...data, id: String(surgeries.length + 1) } as Surgery]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">日间手术治疗目录</h2>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
          <Plus className="w-4 h-4" /> 新增
        </button>
      </div>

      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">编码</th>
              <th className="px-4 py-3 text-left text-sm font-medium">名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium">分类</th>
              <th className="px-4 py-3 text-left text-sm font-medium">价格</th>
              <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
              <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((s) => (
              <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{s.code}</td>
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-sm">{s.category}</td>
                <td className="px-4 py-3 text-sm">¥{s.price}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {s.status === 'active' ? '启用' : '停用'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setShowDetail(s)} className="p-2 text-gray-500 hover:bg-gray-100 rounded"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => handleEdit(s)} className="p-2 text-blue-500 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <SurgeryModal editing={editing} onClose={() => setShowModal(false)} onSave={handleSave} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetail && (
          <DetailModal surgery={showDetail} onClose={() => setShowDetail(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function SurgeryModal({ editing, onClose, onSave }: { editing: Surgery | null; onClose: () => void; onSave: (d: Partial<Surgery>) => void }) {
  const [form, setForm] = useState({
    code: editing?.code || '',
    name: editing?.name || '',
    category: editing?.category || '眼科',
    duration: editing?.duration || '',
    recovery: editing?.recovery || '',
    price: editing?.price || 0,
    status: editing?.status || 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">{editing ? '编辑' : '新增'}日间手术</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="编码" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          <input type="text" placeholder="名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
            {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="text" placeholder="手术时长" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          <input type="text" placeholder="恢复时间" value={form.recovery} onChange={(e) => setForm({ ...form, recovery: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          <input type="number" placeholder="价格" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">保存</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function DetailModal({ surgery, onClose }: { surgery: Surgery; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">手术详情</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">编码</span><span>{surgery.code}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">名称</span><span>{surgery.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">分类</span><span>{surgery.category}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">手术时长</span><span>{surgery.duration}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">恢复时间</span><span>{surgery.recovery}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">价格</span><span>¥{surgery.price}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">状态</span><span>{surgery.status === 'active' ? '启用' : '停用'}</span></div>
        </div>
      </motion.div>
    </motion.div>
  );
}
