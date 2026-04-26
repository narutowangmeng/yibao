import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Eye, X } from 'lucide-react';

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

const categories = ['基础耗材', '手术耗材', '检查耗材', '治疗耗材', '高值耗材'];

const mockMaterials: Material[] = [
  ['HC001', '一次性输液器', '基础耗材', '标准型', '套', 3.5, 'active'],
  ['HC002', '一次性注射器', '基础耗材', '5ml', '支', 1.8, 'active'],
  ['HC003', '留置针', '基础耗材', '24G', '支', 14.2, 'active'],
  ['HC004', '医用纱布块', '基础耗材', '10x10cm', '包', 2.6, 'active'],
  ['HC005', '换药包', '治疗耗材', '无菌型', '套', 18.5, 'active'],
  ['HC006', '中心静脉导管包', '治疗耗材', '双腔', '套', 186, 'active'],
  ['HC007', '负压引流装置', '治疗耗材', '400ml', '套', 72, 'active'],
  ['HC008', '高压注射器连接管', '检查耗材', 'CT专用', '根', 28.6, 'active'],
  ['HC009', '造影导管', '检查耗材', '5F', '根', 168, 'active'],
  ['HC010', '电刀负极板', '手术耗材', '成人型', '片', 24, 'active'],
  ['HC011', '可吸收缝线', '手术耗材', '2-0', '根', 56, 'active'],
  ['HC012', '腔镜切割闭合器', '手术耗材', '60mm', '把', 1590, 'active'],
  ['HC013', '吻合器', '手术耗材', '一次性', '把', 1280, 'active'],
  ['HC014', '冠脉药物洗脱支架', '高值耗材', '3.0x18mm', '枚', 7980, 'active'],
  ['HC015', '髋关节假体', '高值耗材', '国产', '套', 12600, 'active'],
  ['HC016', '膝关节假体', '高值耗材', '后稳定型', '套', 13800, 'active'],
  ['HC017', '人工晶体', '高值耗材', '折叠型', '枚', 1860, 'active'],
  ['HC018', '椎间融合器', '高值耗材', 'PEEK', '枚', 4680, 'active'],
  ['HC019', '骨科锁定钢板', '高值耗材', '股骨型', '块', 3280, 'inactive'],
  ['HC020', '心脏起搏器电极导线', '高值耗材', '双极', '根', 5600, 'active']
].map(([code, name, category, spec, unit, price, status], index) => ({
  id: String(index + 1),
  code,
  name,
  category,
  spec,
  unit,
  price,
  status: status as 'active' | 'inactive'
}));

export default function MaterialDirectoryQuery() {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [showDetail, setShowDetail] = useState<Material | null>(null);

  const filtered = materials.filter((m) => m.name.includes(searchTerm) || m.code.includes(searchTerm));

  const handleSave = (data: Partial<Material>) => {
    if (editing) {
      setMaterials(materials.map((m) => (m.id === editing.id ? { ...m, ...data } : m)));
    } else {
      setMaterials([...materials, { ...data, id: String(Date.now()) } as Material]);
    }
    setShowModal(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
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
          <input type="text" placeholder="搜索编码、名称" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
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
          {filtered.map((m) => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{m.code}</td>
              <td className="px-4 py-3 font-medium">{m.name}</td>
              <td className="px-4 py-3 text-sm">{m.category}</td>
              <td className="px-4 py-3 text-sm">￥{m.price}</td>
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
        {showModal && <Modal editing={editing} onClose={() => setShowModal(false)} onSave={handleSave} />}
        {showDetail && <DetailModal material={showDetail} onClose={() => setShowDetail(null)} />}
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
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4">{editing ? '编辑' : '新增'}耗材</h3>
        <form onSubmit={submit} className="space-y-3">
          <input type="text" placeholder="编码" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          <input type="text" placeholder="名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="text" placeholder="规格" value={form.spec} onChange={(e) => setForm({ ...form, spec: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          <input type="text" placeholder="单位" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          <input type="number" placeholder="价格" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
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
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
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
          <p><span className="text-gray-500">价格:</span> ￥{material.price}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
