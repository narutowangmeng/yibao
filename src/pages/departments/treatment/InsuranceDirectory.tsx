import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Edit2, Trash2, Pill, Stethoscope, Package, X } from 'lucide-react';

interface DirectoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  type: '甲类' | '乙类';
  price: number;
  status: '正常' | '调整中' | '停用';
}

const initialData: Record<string, DirectoryItem[]> = {
  drugs: [
    { id: '1', code: 'YB001', name: '阿莫西林胶囊', category: '西药', type: '甲类', price: 12.5, status: '正常' },
    { id: '2', code: 'YB002', name: '布洛芬缓释片', category: '西药', type: '乙类', price: 28, status: '正常' },
    { id: '3', code: 'YB003', name: '连花清瘟胶囊', category: '中成药', type: '甲类', price: 35, status: '调整中' },
  ],
  services: [
    { id: '1', code: 'ZL001', name: '普通门诊诊查费', category: '诊查费', type: '甲类', price: 15, status: '正常' },
    { id: '2', code: 'ZL002', name: 'CT平扫', category: '检查费', type: '乙类', price: 280, status: '正常' },
  ],
  materials: [
    { id: '1', code: 'HC001', name: '一次性输液器', category: '耗材', type: '甲类', price: 3.5, status: '正常' },
    { id: '2', code: 'HC002', name: '心脏支架', category: '高值耗材', type: '乙类', price: 8500, status: '正常' },
  ],
};

const tabs = [
  { id: 'drugs', label: '药品目录', icon: Pill },
  { id: 'services', label: '诊疗项目', icon: Stethoscope },
  { id: 'materials', label: '医用耗材', icon: Package },
];

export default function InsuranceDirectory() {
  const [activeTab, setActiveTab] = useState('drugs');
  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DirectoryItem | null>(null);
  const [formData, setFormData] = useState<Partial<DirectoryItem>>({});

  const currentData = data[activeTab] || [];
  const filteredData = currentData.filter(item => {
    const matchSearch = item.name.includes(searchQuery) || item.code.includes(searchQuery);
    const matchType = !filterType || item.type === filterType;
    const matchStatus = !filterStatus || item.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ type: '甲类', status: '正常' });
    setShowModal(true);
  };

  const handleEdit = (item: DirectoryItem) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setData(prev => ({ ...prev, [activeTab]: prev[activeTab].filter(item => item.id !== id) }));
  };

  const handleSave = () => {
    if (!formData.code || !formData.name) return;
    if (editingItem) {
      setData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(item => item.id === editingItem.id ? { ...item, ...formData } as DirectoryItem : item)
      }));
    } else {
      const newItem: DirectoryItem = {
        id: String(Date.now()),
        code: formData.code || '',
        name: formData.name || '',
        category: formData.category || '',
        type: (formData.type as '甲类' | '乙类') || '甲类',
        price: Number(formData.price) || 0,
        status: (formData.status as '正常' | '调整中' | '停用') || '正常',
      };
      setData(prev => ({ ...prev, [activeTab]: [...prev[activeTab], newItem] }));
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">医保目录管理</h2>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />
          新增项目
        </button>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索编码、名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
          <option value="">全部类型</option>
          <option value="甲类">甲类</option>
          <option value="乙类">乙类</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
          <option value="">全部状态</option>
          <option value="正常">正常</option>
          <option value="调整中">调整中</option>
          <option value="停用">停用</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">编码</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">分类</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">价格</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">{item.code}</td>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${item.type === '甲类' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">¥{item.price}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${
                    item.status === '正常' ? 'bg-green-100 text-green-700' :
                    item.status === '调整中' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="p-1 hover:bg-gray-200 rounded"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1 hover:bg-gray-200 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && <div className="py-8 text-center text-gray-400">暂无数据</div>}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl p-6 w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{editingItem ? '编辑' : '新增'}</h3>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <input type="text" placeholder="编码" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                <input type="text" placeholder="名称" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                <input type="text" placeholder="分类" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as '甲类' | '乙类'})} className="w-full px-3 py-2 border rounded-lg">
                  <option value="甲类">甲类</option>
                  <option value="乙类">乙类</option>
                </select>
                <input type="number" placeholder="价格" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as '正常' | '调整中' | '停用'})} className="w-full px-3 py-2 border rounded-lg">
                  <option value="正常">正常</option>
                  <option value="调整中">调整中</option>
                  <option value="停用">停用</option>
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded-lg">取消</button>
                <button onClick={handleSave} className="flex-1 py-2 bg-cyan-600 text-white rounded-lg">保存</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
