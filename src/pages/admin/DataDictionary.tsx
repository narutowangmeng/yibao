import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, BookOpen } from 'lucide-react';
import { getAgencyLevel } from '../../config/managementPermissions';

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

interface DataDictionaryProps {
  userAgency?: string;
}

const mockDictTypes: DictType[] = [
  { id: '1', code: 'INSURANCE_TYPE', name: '险种类型', description: '江苏省医疗保障险种分类', itemCount: 20 },
  { id: '2', code: 'PAY_STANDARD', name: '缴费标准', description: '居民、职工及灵活就业缴费标准项', itemCount: 20 },
  { id: '3', code: 'MEDICAL_LEVEL', name: '医疗机构等级', description: '定点医疗机构等级及类别', itemCount: 20 },
];

const mockDictItems: Record<string, DictItem[]> = {
  '1': [
    { id: '1-1', typeId: '1', code: 'EMP_BASE', name: '职工基本医疗保险', value: '01', sort: 1, status: 'active' },
    { id: '1-2', typeId: '1', code: 'RES_BASE', name: '城乡居民基本医疗保险', value: '02', sort: 2, status: 'active' },
    { id: '1-3', typeId: '1', code: 'FLEX_EMP', name: '灵活就业人员医疗保险', value: '03', sort: 3, status: 'active' },
    { id: '1-4', typeId: '1', code: 'LTC_INS', name: '长期护理保险', value: '04', sort: 4, status: 'active' },
    { id: '1-5', typeId: '1', code: 'SER_BIRTH', name: '生育保险并入职工医保', value: '05', sort: 5, status: 'active' },
    { id: '1-6', typeId: '1', code: 'DB_INS', name: '城乡居民大病保险', value: '06', sort: 6, status: 'active' },
    { id: '1-7', typeId: '1', code: 'CIV_AID', name: '公务员医疗补助', value: '07', sort: 7, status: 'active' },
    { id: '1-8', typeId: '1', code: 'RET_SVC', name: '退休异地安置医疗保障', value: '08', sort: 8, status: 'active' },
    { id: '1-9', typeId: '1', code: 'NEWBORN', name: '新生儿落地参保', value: '09', sort: 9, status: 'active' },
    { id: '1-10', typeId: '1', code: 'STUDENT', name: '学生居民参保', value: '10', sort: 10, status: 'active' },
    { id: '1-11', typeId: '1', code: 'VETERAN', name: '退役军人补充保障', value: '11', sort: 11, status: 'active' },
    { id: '1-12', typeId: '1', code: 'POOR_AID', name: '医疗救助资助参保', value: '12', sort: 12, status: 'active' },
    { id: '1-13', typeId: '1', code: 'MATERNITY', name: '生育医疗待遇保障', value: '13', sort: 13, status: 'active' },
    { id: '1-14', typeId: '1', code: 'SPECIAL_CLINIC', name: '门诊慢特病保障', value: '14', sort: 14, status: 'active' },
    { id: '1-15', typeId: '1', code: 'DTC_DRUG', name: '双通道药品待遇', value: '15', sort: 15, status: 'active' },
    { id: '1-16', typeId: '1', code: 'REMOTE', name: '异地就医联网结算', value: '16', sort: 16, status: 'active' },
    { id: '1-17', typeId: '1', code: 'DAY_SURG', name: '日间手术保障', value: '17', sort: 17, status: 'active' },
    { id: '1-18', typeId: '1', code: 'REHAB', name: '康复住院保障', value: '18', sort: 18, status: 'active' },
    { id: '1-19', typeId: '1', code: 'EMP_SUPP', name: '企业补充医疗保险', value: '19', sort: 19, status: 'active' },
    { id: '1-20', typeId: '1', code: 'RURAL_AID', name: '农村特困人员医疗保障', value: '20', sort: 20, status: 'active' },
  ],
  '2': [
    { id: '2-1', typeId: '2', code: 'NJ_RES', name: '南京居民医保个人缴费', value: '470', sort: 1, status: 'active' },
    { id: '2-2', typeId: '2', code: 'SZ_RES', name: '苏州居民医保个人缴费', value: '470', sort: 2, status: 'active' },
    { id: '2-3', typeId: '2', code: 'EMP_RATE', name: '职工医保单位缴费费率', value: '7.5%', sort: 3, status: 'active' },
    { id: '2-4', typeId: '2', code: 'FLEX_YEAR', name: '灵活就业年缴费参考标准', value: '6120', sort: 4, status: 'active' },
    { id: '2-5', typeId: '2', code: 'WX_RES', name: '无锡居民医保个人缴费', value: '470', sort: 5, status: 'active' },
    { id: '2-6', typeId: '2', code: 'XZ_RES', name: '徐州居民医保个人缴费', value: '450', sort: 6, status: 'active' },
    { id: '2-7', typeId: '2', code: 'CZ_RES', name: '常州居民医保个人缴费', value: '460', sort: 7, status: 'active' },
    { id: '2-8', typeId: '2', code: 'NT_RES', name: '南通居民医保个人缴费', value: '450', sort: 8, status: 'active' },
    { id: '2-9', typeId: '2', code: 'LYG_RES', name: '连云港居民医保个人缴费', value: '430', sort: 9, status: 'active' },
    { id: '2-10', typeId: '2', code: 'HA_RES', name: '淮安居民医保个人缴费', value: '430', sort: 10, status: 'active' },
    { id: '2-11', typeId: '2', code: 'YC_RES', name: '盐城居民医保个人缴费', value: '430', sort: 11, status: 'active' },
    { id: '2-12', typeId: '2', code: 'YZ_RES', name: '扬州居民医保个人缴费', value: '450', sort: 12, status: 'active' },
    { id: '2-13', typeId: '2', code: 'ZJ_RES', name: '镇江居民医保个人缴费', value: '450', sort: 13, status: 'active' },
    { id: '2-14', typeId: '2', code: 'TZ_RES', name: '泰州居民医保个人缴费', value: '440', sort: 14, status: 'active' },
    { id: '2-15', typeId: '2', code: 'SQ_RES', name: '宿迁居民医保个人缴费', value: '420', sort: 15, status: 'active' },
    { id: '2-16', typeId: '2', code: 'EMP_PERSON', name: '职工医保个人缴费费率', value: '2.0%', sort: 16, status: 'active' },
    { id: '2-17', typeId: '2', code: 'LTC_PERSON', name: '长期护理保险个人筹资', value: '120', sort: 17, status: 'active' },
    { id: '2-18', typeId: '2', code: 'STUDENT_STD', name: '大学生参保个人缴费', value: '350', sort: 18, status: 'active' },
    { id: '2-19', typeId: '2', code: 'NEWBORN_STD', name: '新生儿落地参保个人缴费', value: '380', sort: 19, status: 'active' },
    { id: '2-20', typeId: '2', code: 'DB_STD', name: '居民大病保险个人筹资', value: '95', sort: 20, status: 'active' },
  ],
  '3': [
    { id: '3-1', typeId: '3', code: '3A', name: '三级甲等医院', value: '3A', sort: 1, status: 'active' },
    { id: '3-2', typeId: '3', code: '2A', name: '二级甲等医院', value: '2A', sort: 2, status: 'active' },
    { id: '3-3', typeId: '3', code: 'COMM', name: '社区卫生服务中心', value: 'COMM', sort: 3, status: 'active' },
    { id: '3-4', typeId: '3', code: 'DTC', name: '双通道药店', value: 'DTC', sort: 4, status: 'active' },
    { id: '3-5', typeId: '3', code: '3B', name: '三级乙等医院', value: '3B', sort: 5, status: 'active' },
    { id: '3-6', typeId: '3', code: '3C', name: '三级丙等医院', value: '3C', sort: 6, status: 'active' },
    { id: '3-7', typeId: '3', code: '2B', name: '二级乙等医院', value: '2B', sort: 7, status: 'active' },
    { id: '3-8', typeId: '3', code: '2C', name: '二级丙等医院', value: '2C', sort: 8, status: 'active' },
    { id: '3-9', typeId: '3', code: '1H', name: '一级医院', value: '1H', sort: 9, status: 'active' },
    { id: '3-10', typeId: '3', code: 'TCM3A', name: '三级甲等中医医院', value: 'TCM3A', sort: 10, status: 'active' },
    { id: '3-11', typeId: '3', code: 'TCM2A', name: '二级甲等中医医院', value: 'TCM2A', sort: 11, status: 'active' },
    { id: '3-12', typeId: '3', code: 'WOMAN', name: '妇幼保健院', value: 'WOMAN', sort: 12, status: 'active' },
    { id: '3-13', typeId: '3', code: 'REHAB', name: '康复医院', value: 'REHAB', sort: 13, status: 'active' },
    { id: '3-14', typeId: '3', code: 'NURSING', name: '护理院', value: 'NURSING', sort: 14, status: 'active' },
    { id: '3-15', typeId: '3', code: 'MENTAL', name: '精神专科医院', value: 'MENTAL', sort: 15, status: 'active' },
    { id: '3-16', typeId: '3', code: 'CHRONIC', name: '慢病专科门诊部', value: 'CHRONIC', sort: 16, status: 'active' },
    { id: '3-17', typeId: '3', code: 'CLINIC', name: '普通诊所', value: 'CLINIC', sort: 17, status: 'active' },
    { id: '3-18', typeId: '3', code: 'PHARM', name: '零售药店', value: 'PHARM', sort: 18, status: 'active' },
    { id: '3-19', typeId: '3', code: 'EMERGENCY', name: '急救中心', value: 'EMERGENCY', sort: 19, status: 'active' },
    { id: '3-20', typeId: '3', code: 'REMOTE', name: '异地联网定点机构', value: 'REMOTE', sort: 20, status: 'active' },
  ],
};

export default function DataDictionary({ userAgency = 'headquarters' }: DataDictionaryProps) {
  const [dictTypes, setDictTypes] = useState<DictType[]>(mockDictTypes);
  const [dictItems, setDictItems] = useState<Record<string, DictItem[]>>(mockDictItems);
  const [selectedType, setSelectedType] = useState<DictType | null>(mockDictTypes[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingType, setEditingType] = useState<DictType | null>(null);
  const [editingItem, setEditingItem] = useState<DictItem | null>(null);
  const isProvince = getAgencyLevel(userAgency) === 'province';

  const filteredTypes = dictTypes.filter((item) => item.name.includes(searchTerm) || item.code.includes(searchTerm));

  const handleAddType = () => {
    setEditingType(null);
    setShowTypeModal(true);
  };

  const handleEditType = (type: DictType) => {
    setEditingType(type);
    setShowTypeModal(true);
  };

  const handleDeleteType = (id: string) => {
    setDictTypes((prev) => prev.filter((item) => item.id !== id));
    if (selectedType?.id === id) setSelectedType(null);
  };

  const handleSaveType = (data: Partial<DictType>) => {
    if (editingType) {
      setDictTypes((prev) => prev.map((item) => (item.id === editingType.id ? { ...item, ...data } : item)));
    } else {
      setDictTypes((prev) => [...prev, { id: String(prev.length + 1), code: data.code || '', name: data.name || '', description: data.description || '', itemCount: 0 }]);
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
    setDictItems({ ...dictItems, [selectedType.id]: items.filter((item) => item.id !== itemId) });
    setDictTypes((prev) => prev.map((item) => (item.id === selectedType.id ? { ...item, itemCount: item.itemCount - 1 } : item)));
  };

  const handleSaveItem = (data: Partial<DictItem>) => {
    if (!selectedType) return;
    const items = dictItems[selectedType.id] || [];
    if (editingItem) {
      setDictItems({ ...dictItems, [selectedType.id]: items.map((item) => (item.id === editingItem.id ? { ...item, ...data } : item)) });
    } else {
      const newItem: DictItem = { id: `${selectedType.id}-${items.length + 1}`, typeId: selectedType.id, code: data.code || '', name: data.name || '', value: data.value || '', sort: items.length + 1, status: 'active' };
      setDictItems({ ...dictItems, [selectedType.id]: [...items, newItem] });
      setDictTypes((prev) => prev.map((item) => (item.id === selectedType.id ? { ...item, itemCount: item.itemCount + 1 } : item)));
    }
    setShowItemModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">数据字典</h2>
        {isProvince ? (
          <button onClick={handleAddType} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
            <Plus className="h-4 w-4" />
            新增字典类型
          </button>
        ) : (
          <div className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700">地市账号仅可查看基础数据字典</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="搜索字典类型..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredTypes.map((type) => (
              <div key={type.id} onClick={() => setSelectedType(type)} className={`cursor-pointer p-4 transition-colors ${selectedType?.id === type.id ? 'bg-cyan-50' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-cyan-600" />
                    <div>
                      <p className="font-medium text-gray-800">{type.name}</p>
                      <p className="text-xs text-gray-500">{type.code} / {type.itemCount}项</p>
                    </div>
                  </div>
                  {isProvince && (
                    <div className="flex gap-1">
                      <button onClick={(e) => { e.stopPropagation(); handleEditType(type); }} className="p-1.5 text-gray-400 hover:text-cyan-600">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteType(type.id); }} className="p-1.5 text-gray-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          {selectedType ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedType.name}</h3>
                  <p className="text-xs text-gray-500">{selectedType.description}</p>
                </div>
                {isProvince && (
                  <button onClick={handleAddItem} className="flex items-center gap-1 rounded-lg bg-cyan-600 px-3 py-1.5 text-sm text-white hover:bg-cyan-700">
                    <Plus className="h-4 w-4" />
                    新增字典项
                  </button>
                )}
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
                        {isProvince && (
                          <div className="flex justify-end gap-1">
                            <button onClick={() => handleEditItem(item)} className="p-1 text-gray-400 hover:text-cyan-600">
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleDeleteItem(item.id)} className="p-1 text-gray-400 hover:text-red-600">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div className="p-12 text-center text-gray-400">
              <BookOpen className="mx-auto mb-3 h-12 w-12 opacity-30" />
              <p>请选择左侧字典类型</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isProvince && showTypeModal && (
          <Modal title={editingType ? '编辑字典类型' : '新增字典类型'}>
            <TypeForm data={editingType} onSave={handleSaveType} onClose={() => setShowTypeModal(false)} />
          </Modal>
        )}
        {isProvince && showItemModal && (
          <Modal title={editingItem ? '编辑字典项' : '新增字典项'}>
            <ItemForm data={editingItem} onSave={handleSaveItem} onClose={() => setShowItemModal(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md rounded-xl bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">{title}</h3>
        {children}
      </motion.div>
    </motion.div>
  );
}

function TypeForm({ data, onSave, onClose }: { data: DictType | null; onSave: (data: Partial<DictType>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ code: data?.code || '', name: data?.name || '', description: data?.description || '' });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">类型编码</label>
        <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">类型名称</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">描述</label>
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2" />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">取消</button>
        <button type="submit" className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">保存</button>
      </div>
    </form>
  );
}

function ItemForm({ data, onSave, onClose }: { data: DictItem | null; onSave: (data: Partial<DictItem>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ code: data?.code || '', name: data?.name || '', value: data?.value || '' });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">项编码</label>
        <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">项名称</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2" required />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">项值</label>
        <input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2" required />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">取消</button>
        <button type="submit" className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">保存</button>
      </div>
    </form>
  );
}
