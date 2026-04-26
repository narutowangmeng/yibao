import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, BookOpen, ChevronRight } from 'lucide-react';

interface DictType {
  id: string;
  code: string;
  name: string;
  description: string;
  itemCount: number;
}

interface DictItem {
  id: string;
  typeId: string;
  code: string;
  name: string;
  value: string;
  sort: number;
  status: 'active' | 'inactive';
}

const mockDictTypes: DictType[] = [
  { id: '1', code: 'INSURANCE_TYPE', name: '险种类型', description: '医保险种分类', itemCount: 4 },
  { id: '2', code: 'PAYMENT_STD', name: '缴费标准', description: '缴费标准档次', itemCount: 3 },
  { id: '3', code: 'INST_LEVEL', name: '机构等级', description: '医疗机构等级', itemCount: 5 },
  { id: '4', code: 'DRUG_CATEGORY', name: '药品分类', description: '医保药品分类', itemCount: 6 },
];

const mockDictItems: Record<string, DictItem[]> = {
  '1': [
    { id: '1-1', typeId: '1', code: 'EMPLOYEE', name: '职工医保', value: '1', sort: 1, status: 'active' },
    { id: '1-2', typeId: '1', code: 'RESIDENT', name: '居民医保', value: '2', sort: 2, status: 'active' },
    { id: '1-3', typeId: '1', code: 'FLEXIBLE', name: '灵活就业', value: '3', sort: 3, status: 'active' },
    { id: '1-4', typeId: '1', code: 'RURAL', name: '新农合', value: '4', sort: 4, status: 'inactive' },
  ],
  '2': [
    { id: '2-1', typeId: '2', code: 'HIGH', name: '高档', value: '3600', sort: 1, status: 'active' },
    { id: '2-2', typeId: '2', code: 'MID', name: '中档', value: '600', sort: 2, status: 'active' },
    { id: '2-3', typeId: '2', code: 'LOW', name: '低档', value: '350', sort: 3, status: 'active' },
  ],
};

export default function DataDictionary() {
  const [dictTypes, setDictTypes] = useState<DictType[]>(mockDictTypes);
  const [dictItems, setDictItems] = useState<Record<string, DictItem[]>>(mockDictItems);
  const [selectedType, setSelectedType] = useState<DictType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingType, setEditingType] = useState<DictType | null>(null);
  const [editingItem, setEditingItem] = useState<DictItem | null>(null);

  const filteredTypes = dictTypes.filter(t =>
    t.name.includes(searchTerm) || t.code.includes(searchTerm)
  );

  const handleAddType = () => {
    setEditingType(null);
    setShowTypeModal(true);
  };

  const handleEditType = (type: DictType) => {
    setEditingType(type);
    setShowTypeModal(true);
  };

  const handleDeleteType = (id: string) => {
    setDictTypes(dictTypes.filter(t => t.id !== id));
    if (selectedType?.id === id) setSelectedType(null);
  };

  const handleSaveType = (data: Partial<DictType>) => {
    if (editingType) {
      setDictTypes(dictTypes.map(t => t.id === editingType.id ? { ...t, ...data } : t));
    } else {
      const newType: DictType = {
        id: String(dictTypes.length + 1),
        code: data.code || '',
        name: data.name || '',
        description: data.description || '',
        itemCount: 0,
      };
      setDictTypes([...dictTypes, newType]);
    }
    setShowTypeModal(false);
  };

  const handleAddItem = () => {
    if (!selectedType) return;
    setEditingItem(null);
    setShowItemModal(true);
  };

  const handleEditItem = (item: DictItem) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!selectedType) return;
    const items = dictItems[selectedType.id] || [];
    setDictItems({ ...dictItems, [selectedType.id]: items.filter(i => i.id !== itemId) });
    setDictTypes(dictTypes.map(t =>
      t.id === selectedType.id ? { ...t, itemCount: t.itemCount - 1 } : t
    ));
  };

  const handleSaveItem = (data: Partial<DictItem>) => {
    if (!selectedType) return;
    const items = dictItems[selectedType.id] || [];
    if (editingItem) {
      setDictItems({
        ...dictItems,
        [selectedType.id]: items.map(i => i.id === editingItem.id ? { ...i, ...data } : i)
      });
    } else {
      const newItem: DictItem = {
        id: `${selectedType.id}-${items.length + 1}`,
        typeId: selectedType.id,
        code: data.code || '',
        name: data.name || '',
        value: data.value || '',
        sort: items.length + 1,
        status: 'active',
      };
      setDictItems({ ...dictItems, [selectedType.id]: [...items, newItem] });
      setDictTypes(dictTypes.map(t =>
        t.id === selectedType.id ? { ...t, itemCount: t.itemCount + 1 } : t
      ));
    }
    setShowItemModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">数据字典</h2>
        <button onClick={handleAddType} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />
          新增字典类型
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索字典类型..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => setSelectedType(type)}
                className={`p-4 cursor-pointer transition-colors ${selectedType?.id === type.id ? 'bg-cyan-50' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-cyan-600" />
                    <div>
                      <p className="font-medium text-gray-800">{type.name}</p>
                      <p className="text-xs text-gray-500">{type.code} · {type.itemCount}项</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); handleEditType(type); }} className="p-1.5 text-gray-400 hover:text-cyan-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteType(type.id); }} className="p-1.5 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          {selectedType ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedType.name}</h3>
                  <p className="text-xs text-gray-500">{selectedType.description}</p>
                </div>
                <button onClick={handleAddItem} className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700">
                  <Plus className="w-4 h-4" />
                  新增字典项
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">编码</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">名称</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">值</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(dictItems[selectedType.id] || []).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-600">{item.code}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{item.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{item.value}</td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => handleEditItem(item)} className="p-1 text-gray-400 hover:text-cyan-600">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteItem(item.id)} className="p-1 text-gray-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div className="p-12 text-center text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>请选择左侧字典类型</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showTypeModal && (
          <Modal title={editingType ? '编辑字典类型' : '新增字典类型'} onClose={() => setShowTypeModal(false)}>
            <TypeForm data={editingType} onSave={handleSaveType} onClose={() => setShowTypeModal(false)} />
          </Modal>
        )}
        {showItemModal && (
          <Modal title={editingItem ? '编辑字典项' : '新增字典项'} onClose={() => setShowItemModal(false)}>
            <ItemForm data={editingItem} onSave={handleSaveItem} onClose={() => setShowItemModal(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        {children}
      </motion.div>
    </motion.div>
  );
}

function TypeForm({ data, onSave, onClose }: { data: DictType | null; onSave: (d: Partial<DictType>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ code: data?.code || '', name: data?.name || '', description: data?.description || '' });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">类型编码</label>
        <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">类型名称</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
        <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
      </div>
    </form>
  );
}

function ItemForm({ data, onSave, onClose }: { data: DictItem | null; onSave: (d: Partial<DictItem>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ code: data?.code || '', name: data?.name || '', value: data?.value || '' });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">项编码</label>
        <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">项名称</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">项值</label>
        <input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" required />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
        <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
      </div>
    </form>
  );
}
