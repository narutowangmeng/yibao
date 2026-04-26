import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Plus, Edit2, Trash2, Eye, X, ArrowLeft } from 'lucide-react';

interface Disease {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
}

const mockDiseases: Disease[] = [
  { id: '1', code: 'A00', name: '霍乱', category: '传染病', description: '由霍乱弧菌引起的急性肠道传染病' },
  { id: '2', code: 'E11', name: '2型糖尿病', category: '内分泌疾病', description: '以高血糖为特征的代谢性疾病' },
];

const categories = ['传染病', '内分泌疾病', '心血管疾病', '恶性肿瘤'];

export default function DiseaseDiagnosisQuery({ onBack }: { onBack?: () => void }) {
  const [diseases, setDiseases] = useState<Disease[]>(mockDiseases);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [showModal, setShowModal] = useState(false);
  const [editingDisease, setEditingDisease] = useState<Disease | null>(null);
  const [showDetail, setShowDetail] = useState<Disease | null>(null);

  const filteredDiseases = diseases.filter(d => {
    const matchesSearch = d.name.includes(searchTerm) || d.code.includes(searchTerm);
    const matchesCategory = selectedCategory === '全部' || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = () => {
    setEditingDisease(null);
    setShowModal(true);
  };

  const handleEdit = (disease: Disease) => {
    setEditingDisease(disease);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setDiseases(diseases.filter(d => d.id !== id));
  };

  const handleSave = (data: Partial<Disease>) => {
    if (editingDisease) {
      setDiseases(diseases.map(d => d.id === editingDisease.id ? { ...d, ...data } : d));
    } else {
      setDiseases([...diseases, { ...data, id: String(diseases.length + 1) } as Disease]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" /> 返回
            </button>
          )}
          <h2 className="text-xl font-bold">疾病与诊断目录管理</h2>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <Plus className="w-4 h-4" /> 新增疾病
        </button>
      </div>

      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索疾病名称或编码..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="全部">全部</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">ICD编码</th>
              <th className="px-4 py-3 text-left text-sm font-medium">疾病名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium">分类</th>
              <th className="px-4 py-3 text-left text-sm font-medium">描述</th>
              <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredDiseases.map(d => (
              <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-blue-600">{d.code}</td>
                <td className="px-4 py-3 text-sm">{d.name}</td>
                <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{d.category}</span></td>
                <td className="px-4 py-3 text-sm text-gray-500">{d.description}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setShowDetail(d)} className="p-2 text-gray-500 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => handleEdit(d)} className="p-2 text-gray-500 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(d.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <DiseaseModal editing={editingDisease} onClose={() => setShowModal(false)} onSave={handleSave} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetail && (
          <DetailModal disease={showDetail} onClose={() => setShowDetail(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function DiseaseModal({ editing, onClose, onSave }: { editing: Disease | null; onClose: () => void; onSave: (data: Partial<Disease>) => void }) {
  const [formData, setFormData] = useState({
    code: editing?.code || '',
    name: editing?.name || '',
    category: editing?.category || categories[0],
    description: editing?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">{editing ? '编辑疾病' : '新增疾病'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ICD编码</label>
            <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">疾病名称</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" rows={3} />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">保存</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function DetailModal({ disease, onClose }: { disease: Disease; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">疾病详情</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <div><p className="text-gray-500 text-sm">ICD编码</p><p className="font-medium text-blue-600">{disease.code}</p></div>
          <div><p className="text-gray-500 text-sm">疾病名称</p><p className="font-medium">{disease.name}</p></div>
          <div><p className="text-gray-500 text-sm">分类</p><p className="font-medium">{disease.category}</p></div>
          <div><p className="text-gray-500 text-sm">描述</p><p className="text-gray-700">{disease.description}</p></div>
        </div>
      </motion.div>
    </motion.div>
  );
}
