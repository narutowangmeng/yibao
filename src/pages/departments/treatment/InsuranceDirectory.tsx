import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Pill, Stethoscope, Package, X, Edit2, Trash2 } from 'lucide-react';

interface DirectoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  type: '甲类' | '乙类';
  price: number;
  status: '正常' | '调整中' | '停用';
}

const drugNames = [
  ['YB001', '阿托伐他汀钙片', '西药', '甲类', 24.6, '正常'],
  ['YB002', '缬沙坦胶囊', '西药', '甲类', 31.2, '正常'],
  ['YB003', '盐酸二甲双胍片', '西药', '甲类', 12.8, '正常'],
  ['YB004', '门冬胰岛素注射液', '生物制剂', '乙类', 76.5, '正常'],
  ['YB005', '硫酸氢氯吡格雷片', '西药', '甲类', 39.8, '正常'],
  ['YB006', '瑞舒伐他汀钙片', '西药', '乙类', 42.3, '正常'],
  ['YB007', '头孢呋辛酯片', '抗感染药', '乙类', 27.4, '调整中'],
  ['YB008', '阿莫西林克拉维酸钾片', '抗感染药', '甲类', 18.9, '正常'],
  ['YB009', '氨氯地平阿托伐他汀钙片', '西药', '乙类', 53.6, '正常'],
  ['YB010', '达格列净片', '西药', '乙类', 68.5, '正常'],
  ['YB011', '注射用曲妥珠单抗', '抗肿瘤药', '乙类', 1380, '正常'],
  ['YB012', '贝伐珠单抗注射液', '抗肿瘤药', '乙类', 1980, '正常'],
  ['YB013', '连花清瘟胶囊', '中成药', '甲类', 22.8, '正常'],
  ['YB014', '血塞通软胶囊', '中成药', '乙类', 36.2, '正常'],
  ['YB015', '复方丹参滴丸', '中成药', '甲类', 29.5, '正常'],
  ['YB016', '注射用头孢哌酮钠舒巴坦钠', '抗感染药', '乙类', 84.7, '调整中'],
  ['YB017', '恩替卡韦分散片', '抗病毒药', '甲类', 45.9, '正常'],
  ['YB018', '替格瑞洛片', '西药', '乙类', 96.4, '正常'],
  ['YB019', '人血白蛋白注射液', '血液制品', '乙类', 428, '正常'],
  ['YB020', '乌灵胶囊', '中成药', '乙类', 41.6, '停用']
] as const;

const serviceNames = [
  ['ZL001', '普通门诊诊查费', '诊查费', '甲类', 15, '正常'],
  ['ZL002', '专家门诊诊查费', '诊查费', '乙类', 40, '正常'],
  ['ZL003', '急诊留观诊查费', '诊查费', '甲类', 30, '正常'],
  ['ZL004', '胸部CT平扫', '检查费', '乙类', 280, '正常'],
  ['ZL005', '腹部增强CT', '检查费', '乙类', 620, '正常'],
  ['ZL006', '头颅MRI平扫', '检查费', '乙类', 560, '正常'],
  ['ZL007', '彩色多普勒超声检查', '检查费', '甲类', 135, '正常'],
  ['ZL008', '胃镜检查', '检查费', '乙类', 320, '正常'],
  ['ZL009', '肠镜检查', '检查费', '乙类', 480, '正常'],
  ['ZL010', '血常规检验', '检验费', '甲类', 18, '正常'],
  ['ZL011', '肝功能全套', '检验费', '甲类', 68, '正常'],
  ['ZL012', '肾功能全套', '检验费', '甲类', 52, '正常'],
  ['ZL013', '糖化血红蛋白检测', '检验费', '甲类', 75, '正常'],
  ['ZL014', '门诊静脉输液', '治疗费', '甲类', 28, '正常'],
  ['ZL015', '雾化吸入治疗', '治疗费', '甲类', 42, '正常'],
  ['ZL016', '血液透析', '治疗费', '乙类', 420, '正常'],
  ['ZL017', '高压氧治疗', '治疗费', '乙类', 180, '调整中'],
  ['ZL018', '康复训练评定', '康复费', '甲类', 90, '正常'],
  ['ZL019', '针灸治疗', '中医治疗', '甲类', 46, '正常'],
  ['ZL020', '中医推拿治疗', '中医治疗', '甲类', 58, '正常']
] as const;

const materialNames = [
  ['HC001', '一次性输液器', '基础耗材', '甲类', 3.5, '正常'],
  ['HC002', '一次性注射器', '基础耗材', '甲类', 1.8, '正常'],
  ['HC003', '留置针', '基础耗材', '乙类', 14.2, '正常'],
  ['HC004', '医用敷贴', '基础耗材', '甲类', 6.4, '正常'],
  ['HC005', '高压注射器连接管', '检查耗材', '乙类', 28.6, '正常'],
  ['HC006', '冠脉药物洗脱支架', '高值耗材', '乙类', 7980, '正常'],
  ['HC007', '髋关节假体', '高值耗材', '乙类', 12600, '正常'],
  ['HC008', '膝关节假体', '高值耗材', '乙类', 13800, '正常'],
  ['HC009', '人工晶体', '高值耗材', '乙类', 1860, '正常'],
  ['HC010', '血液透析器', '治疗耗材', '乙类', 118, '正常'],
  ['HC011', '吻合器', '手术耗材', '乙类', 1280, '正常'],
  ['HC012', '可吸收缝线', '手术耗材', '甲类', 56, '正常'],
  ['HC013', '骨科锁定钢板', '高值耗材', '乙类', 3280, '调整中'],
  ['HC014', '椎间融合器', '高值耗材', '乙类', 4680, '正常'],
  ['HC015', '腔镜切割闭合器', '手术耗材', '乙类', 1590, '正常'],
  ['HC016', '中心静脉导管包', '治疗耗材', '乙类', 186, '正常'],
  ['HC017', '负压引流装置', '治疗耗材', '甲类', 72, '正常'],
  ['HC018', '电刀负极板', '手术耗材', '甲类', 24, '正常'],
  ['HC019', '医用胶片替代打印耗材', '检查耗材', '乙类', 12, '停用'],
  ['HC020', '心脏起搏器电极导线', '高值耗材', '乙类', 5600, '正常']
] as const;

const createItems = (source: readonly (readonly [string, string, string, '甲类' | '乙类', number, '正常' | '调整中' | '停用'])[]) =>
  source.map(([code, name, category, type, price, status], index) => ({
    id: String(index + 1),
    code,
    name,
    category,
    type,
    price,
    status
  }));

const initialData: Record<string, DirectoryItem[]> = {
  drugs: createItems(drugNames),
  services: createItems(serviceNames),
  materials: createItems(materialNames)
};

const tabs = [
  { id: 'drugs', label: '药品目录', icon: Pill },
  { id: 'services', label: '诊疗项目', icon: Stethoscope },
  { id: 'materials', label: '医用耗材', icon: Package }
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
  const filteredData = currentData.filter((item) => {
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
    setData((prev) => ({ ...prev, [activeTab]: prev[activeTab].filter((item) => item.id !== id) }));
  };

  const handleSave = () => {
    if (!formData.code || !formData.name) return;
    if (editingItem) {
      setData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((item) => (item.id === editingItem.id ? { ...item, ...formData } as DirectoryItem : item))
      }));
    } else {
      const newItem: DirectoryItem = {
        id: String(Date.now()),
        code: formData.code || '',
        name: formData.name || '',
        category: formData.category || '',
        type: (formData.type as '甲类' | '乙类') || '甲类',
        price: Number(formData.price) || 0,
        status: (formData.status as '正常' | '调整中' | '停用') || '正常'
      };
      setData((prev) => ({ ...prev, [activeTab]: [...prev[activeTab], newItem] }));
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
        {tabs.map((tab) => {
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
            placeholder="搜索编码、名称"
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
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">{item.code}</td>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${item.type === '甲类' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">￥{item.price}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${item.status === '正常' ? 'bg-green-100 text-green-700' : item.status === '调整中' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
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
                <input type="text" placeholder="编码" value={formData.code || ''} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                <input type="text" placeholder="名称" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                <input type="text" placeholder="分类" value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as '甲类' | '乙类' })} className="w-full px-3 py-2 border rounded-lg">
                  <option value="甲类">甲类</option>
                  <option value="乙类">乙类</option>
                </select>
                <input type="number" placeholder="价格" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as '正常' | '调整中' | '停用' })} className="w-full px-3 py-2 border rounded-lg">
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
