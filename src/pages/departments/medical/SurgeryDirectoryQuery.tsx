import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Eye, X } from 'lucide-react';
import { getAgencyLevel } from '../../../config/managementPermissions';

interface SurgeryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  level: '一级' | '二级' | '三级' | '四级';
  price: number;
  status: 'active' | 'inactive';
}

interface SurgeryDirectoryQueryProps {
  userAgency: string;
}

const categories = ['全部', '腹部手术', '骨科手术', '眼科手术', '心胸外科', '神经外科'];
const levels = ['全部', '一级', '二级', '三级', '四级'];

const mockData: SurgeryItem[] = [
  ['SUR001', '阑尾切除术', '腹部手术', '二级', 3500],
  ['SUR002', '腹腔镜胆囊切除术', '腹部手术', '三级', 6800],
  ['SUR003', '腹股沟疝修补术', '腹部手术', '二级', 4200],
  ['SUR004', '胃癌根治术', '腹部手术', '四级', 18600],
  ['SUR005', '股骨颈骨折内固定术', '骨科手术', '三级', 9200],
  ['SUR006', '人工全髋关节置换术', '骨科手术', '四级', 28600],
  ['SUR007', '膝关节镜半月板成形术', '骨科手术', '三级', 11800],
  ['SUR008', '腰椎间盘摘除术', '骨科手术', '四级', 15800],
  ['SUR009', '白内障超声乳化吸除术', '眼科手术', '二级', 5200],
  ['SUR010', '玻璃体切除术', '眼科手术', '三级', 9800],
  ['SUR011', '角膜移植术', '眼科手术', '四级', 16800],
  ['SUR012', '冠状动脉旁路移植术', '心胸外科', '四级', 46800],
  ['SUR013', '心脏瓣膜置换术', '心胸外科', '四级', 43600],
  ['SUR014', '肺叶切除术', '心胸外科', '三级', 19800],
  ['SUR015', '胸腔镜纵隔肿物切除术', '心胸外科', '三级', 15600],
  ['SUR016', '颅内血肿清除术', '神经外科', '四级', 23800],
  ['SUR017', '脑膜瘤切除术', '神经外科', '四级', 32800],
  ['SUR018', '脑室腹腔分流术', '神经外科', '三级', 12600],
  ['SUR019', '经皮椎体成形术', '骨科手术', '三级', 10800],
  ['SUR020', '甲状腺部分切除术', '腹部手术', '三级', 7600],
].map(([code, name, category, level, price], index) => ({
  id: String(index + 1),
  code,
  name,
  category,
  level: level as SurgeryItem['level'],
  price,
  status: 'active' as const,
}));

export default function SurgeryDirectoryQuery({ userAgency }: SurgeryDirectoryQueryProps) {
  const [data, setData] = useState<SurgeryItem[]>(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedLevel, setSelectedLevel] = useState('全部');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SurgeryItem | null>(null);
  const [showDetail, setShowDetail] = useState<SurgeryItem | null>(null);
  const [formData, setFormData] = useState({ code: '', name: '', category: '腹部手术', level: '二级' as const, price: 0 });
  const isProvince = getAgencyLevel(userAgency) === 'province';

  const filteredData = data.filter((item) => {
    const matchesSearch = item.name.includes(searchTerm) || item.code.includes(searchTerm);
    const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory;
    const matchesLevel = selectedLevel === '全部' || item.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ code: '', name: '', category: '腹部手术', level: '二级', price: 0 });
    setShowModal(true);
  };

  const handleEdit = (item: SurgeryItem) => {
    setEditingItem(item);
    setFormData({ code: item.code, name: item.name, category: item.category, level: item.level, price: item.price });
    setShowModal(true);
  };

  const handleDelete = (id: string) => setData(data.filter((item) => item.id !== id));

  const handleSave = () => {
    if (editingItem) {
      setData(data.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item)));
    } else {
      setData([...data, { ...formData, id: String(Date.now()), status: 'active' }]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">手术操作目录管理</h2>
        {isProvince ? (
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
            <Plus className="w-4 h-4" />
            新增手术
          </button>
        ) : (
          <div className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700">地市账号仅可查询和查看手术目录，不可新增、编辑或删除</div>
        )}
      </div>
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索编码、名称" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 border rounded-lg">
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="px-4 py-2 border rounded-lg">
          {levels.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">编码</th>
              <th className="px-4 py-3 text-left text-sm font-medium">名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium">分类</th>
              <th className="px-4 py-3 text-left text-sm font-medium">级别</th>
              <th className="px-4 py-3 text-left text-sm font-medium">价格</th>
              <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredData.map((item) => (
              <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{item.code}</td>
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${item.level === '四级' ? 'bg-red-100 text-red-700' : item.level === '三级' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                    {item.level}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">￥{item.price}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setShowDetail(item)} className="p-2 text-gray-500 hover:text-blue-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    {isProvince && (
                      <>
                        <button onClick={() => handleEdit(item)} className="p-2 text-gray-500 hover:text-blue-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {isProvince && showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">{editingItem ? '编辑手术' : '新增手术'}</h3>
              <div className="space-y-4">
                <input type="text" placeholder="手术编码" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                <input type="text" placeholder="手术名称" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                  {categories.filter((c) => c !== '全部').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value as any })} className="w-full px-3 py-2 border rounded-lg">
                  {levels.filter((l) => l !== '全部').map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <input type="number" placeholder="价格" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">取消</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-lg">保存</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showDetail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDetail(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">手术详情</h3>
                <button onClick={() => setShowDetail(null)}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <p><span className="text-gray-500">编码:</span> {showDetail.code}</p>
                <p><span className="text-gray-500">名称:</span> {showDetail.name}</p>
                <p><span className="text-gray-500">分类:</span> {showDetail.category}</p>
                <p><span className="text-gray-500">级别:</span> {showDetail.level}</p>
                <p><span className="text-gray-500">价格:</span> ￥{showDetail.price}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
