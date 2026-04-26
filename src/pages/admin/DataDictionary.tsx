import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, BookOpen } from 'lucide-react';

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
  { id: '1', code: 'INSURANCE_TYPE', name: '险种类型', description: '江苏省医疗保障险种分类', itemCount: 20 },
  { id: '2', code: 'PAY_STANDARD', name: '缴费标准', description: '居民、职工及灵活就业缴费标准项', itemCount: 20 },
  { id: '3', code: 'MEDICAL_LEVEL', name: '医疗机构等级', description: '定点医疗机构等级及类别', itemCount: 20 },
  { id: '4', code: 'DRUG_CLASS', name: '药品分类', description: '医保药品目录分类与支付属性', itemCount: 20 },
  { id: '5', code: 'SERVICE_CLASS', name: '诊疗项目分类', description: '诊疗服务项目和支付类别', itemCount: 20 },
  { id: '6', code: 'MATERIAL_CLASS', name: '医用耗材分类', description: '高值、低值及集采耗材分类', itemCount: 20 },
];

const mockDictItems: Record<string, DictItem[]> = {
  '1': [
    { id: '1-1', typeId: '1', code: 'EMP_BASE', name: '职工基本医疗保险', value: '01', sort: 1, status: 'active' },
    { id: '1-2', typeId: '1', code: 'RES_BASE', name: '城乡居民基本医疗保险', value: '02', sort: 2, status: 'active' },
    { id: '1-3', typeId: '1', code: 'FLEX_EMP', name: '灵活就业人员医疗保险', value: '03', sort: 3, status: 'active' },
    { id: '1-4', typeId: '1', code: 'MCH_INS', name: '生育保险', value: '04', sort: 4, status: 'active' },
    { id: '1-5', typeId: '1', code: 'SER_INJ', name: '职工工伤保险衔接保障', value: '05', sort: 5, status: 'inactive' },
    { id: '1-6', typeId: '1', code: 'RET_SUP', name: '退休人员补充保障', value: '06', sort: 6, status: 'active' },
    { id: '1-7', typeId: '1', code: 'POV_HELP', name: '医疗救助衔接保障', value: '07', sort: 7, status: 'active' },
    { id: '1-8', typeId: '1', code: 'MAJ_INS', name: '城乡居民大病保险', value: '08', sort: 8, status: 'active' },
    { id: '1-9', typeId: '1', code: 'CIV_AID', name: '公务员医疗补助', value: '09', sort: 9, status: 'active' },
    { id: '1-10', typeId: '1', code: 'LTC_INS', name: '长期护理保险', value: '10', sort: 10, status: 'active' },
    { id: '1-11', typeId: '1', code: 'RET_ARM', name: '退役军人优抚医疗', value: '11', sort: 11, status: 'active' },
    { id: '1-12', typeId: '1', code: 'RUR_OLD', name: '原新农合历史险种', value: '12', sort: 12, status: 'inactive' },
    { id: '1-13', typeId: '1', code: 'URB_OLD', name: '原城镇居民历史险种', value: '13', sort: 13, status: 'inactive' },
    { id: '1-14', typeId: '1', code: 'ORG_SUP', name: '单位补充医疗保险', value: '14', sort: 14, status: 'active' },
    { id: '1-15', typeId: '1', code: 'SPEC_HELP', name: '特殊困难群体医疗保障', value: '15', sort: 15, status: 'active' },
    { id: '1-16', typeId: '1', code: 'CLN_TRY', name: '临床试验保障衔接', value: '16', sort: 16, status: 'inactive' },
    { id: '1-17', typeId: '1', code: 'CHD_COV', name: '门诊慢特病专项保障', value: '17', sort: 17, status: 'active' },
    { id: '1-18', typeId: '1', code: 'DTC_DRG', name: '双通道药品专项保障', value: '18', sort: 18, status: 'active' },
    { id: '1-19', typeId: '1', code: 'RARE_DRG', name: '罕见病用药保障', value: '19', sort: 19, status: 'active' },
    { id: '1-20', typeId: '1', code: 'OFF_AID', name: '离休干部医疗待遇', value: '20', sort: 20, status: 'active' },
  ],
  '2': [
    { id: '2-1', typeId: '2', code: 'NJ_RES', name: '南京居民医保个人缴费', value: '470', sort: 1, status: 'active' },
    { id: '2-2', typeId: '2', code: 'WX_RES', name: '无锡居民医保个人缴费', value: '460', sort: 2, status: 'active' },
    { id: '2-3', typeId: '2', code: 'XZ_RES', name: '徐州居民医保个人缴费', value: '450', sort: 3, status: 'active' },
    { id: '2-4', typeId: '2', code: 'CZ_RES', name: '常州居民医保个人缴费', value: '460', sort: 4, status: 'active' },
    { id: '2-5', typeId: '2', code: 'SZ_RES', name: '苏州居民医保个人缴费', value: '470', sort: 5, status: 'active' },
    { id: '2-6', typeId: '2', code: 'NT_RES', name: '南通居民医保个人缴费', value: '460', sort: 6, status: 'active' },
    { id: '2-7', typeId: '2', code: 'LYG_RES', name: '连云港居民医保个人缴费', value: '460', sort: 7, status: 'active' },
    { id: '2-8', typeId: '2', code: 'HA_RES', name: '淮安居民医保个人缴费', value: '450', sort: 8, status: 'active' },
    { id: '2-9', typeId: '2', code: 'YC_RES', name: '盐城居民医保个人缴费', value: '460', sort: 9, status: 'active' },
    { id: '2-10', typeId: '2', code: 'YZ_RES', name: '扬州居民医保个人缴费', value: '470', sort: 10, status: 'active' },
    { id: '2-11', typeId: '2', code: 'ZJ_RES', name: '镇江居民医保个人缴费', value: '460', sort: 11, status: 'active' },
    { id: '2-12', typeId: '2', code: 'TZ_RES', name: '泰州居民医保个人缴费', value: '450', sort: 12, status: 'active' },
    { id: '2-13', typeId: '2', code: 'SQ_RES', name: '宿迁居民医保个人缴费', value: '440', sort: 13, status: 'active' },
    { id: '2-14', typeId: '2', code: 'EMP_RATE', name: '职工医保单位缴费费率', value: '7.5%', sort: 14, status: 'active' },
    { id: '2-15', typeId: '2', code: 'EMP_SELF', name: '职工医保个人缴费费率', value: '2.0%', sort: 15, status: 'active' },
    { id: '2-16', typeId: '2', code: 'FLEX_YEAR', name: '灵活就业年缴费参考标准', value: '6120', sort: 16, status: 'active' },
    { id: '2-17', typeId: '2', code: 'LTC_PAY', name: '长护险个人缴费标准', value: '100', sort: 17, status: 'active' },
    { id: '2-18', typeId: '2', code: 'SUBSIDY_STD', name: '财政补助标准', value: '700', sort: 18, status: 'active' },
    { id: '2-19', typeId: '2', code: 'LOW_ASSIST', name: '困难群体资助标准', value: '460', sort: 19, status: 'active' },
    { id: '2-20', typeId: '2', code: 'OLD_STD', name: '历史居民缴费档次', value: '380', sort: 20, status: 'inactive' },
  ],
  '3': [
    { id: '3-1', typeId: '3', code: '3A', name: '三级甲等医院', value: '3A', sort: 1, status: 'active' },
    { id: '3-2', typeId: '3', code: '3B', name: '三级乙等医院', value: '3B', sort: 2, status: 'active' },
    { id: '3-3', typeId: '3', code: '3', name: '三级医院', value: '3', sort: 3, status: 'active' },
    { id: '3-4', typeId: '3', code: '2A', name: '二级甲等医院', value: '2A', sort: 4, status: 'active' },
    { id: '3-5', typeId: '3', code: '2', name: '二级医院', value: '2', sort: 5, status: 'active' },
    { id: '3-6', typeId: '3', code: '1', name: '一级医院', value: '1', sort: 6, status: 'active' },
    { id: '3-7', typeId: '3', code: 'COMM', name: '社区卫生服务中心', value: 'COMM', sort: 7, status: 'active' },
    { id: '3-8', typeId: '3', code: 'TOWN', name: '乡镇卫生院', value: 'TOWN', sort: 8, status: 'active' },
    { id: '3-9', typeId: '3', code: 'TCM3A', name: '三级甲等中医院', value: 'TCM3A', sort: 9, status: 'active' },
    { id: '3-10', typeId: '3', code: 'MCH3A', name: '三级甲等妇幼保健院', value: 'MCH3A', sort: 10, status: 'active' },
    { id: '3-11', typeId: '3', code: 'REH', name: '康复医院', value: 'REH', sort: 11, status: 'active' },
    { id: '3-12', typeId: '3', code: 'MENT', name: '精神专科医院', value: 'MENT', sort: 12, status: 'active' },
    { id: '3-13', typeId: '3', code: 'DENT', name: '口腔专科医院', value: 'DENT', sort: 13, status: 'active' },
    { id: '3-14', typeId: '3', code: 'EYE', name: '眼科专科医院', value: 'EYE', sort: 14, status: 'active' },
    { id: '3-15', typeId: '3', code: 'CHD', name: '门诊慢特病定点机构', value: 'CHD', sort: 15, status: 'active' },
    { id: '3-16', typeId: '3', code: 'DTC', name: '双通道药店', value: 'DTC', sort: 16, status: 'active' },
    { id: '3-17', typeId: '3', code: 'RETAIL', name: '零售药店', value: 'RETAIL', sort: 17, status: 'active' },
    { id: '3-18', typeId: '3', code: 'HOME', name: '家庭病床服务机构', value: 'HOME', sort: 18, status: 'active' },
    { id: '3-19', typeId: '3', code: 'LTC', name: '长期护理服务机构', value: 'LTC', sort: 19, status: 'active' },
    { id: '3-20', typeId: '3', code: 'OLD', name: '历史已停用机构等级', value: 'OLD', sort: 20, status: 'inactive' },
  ],
  '4': Array.from({ length: 20 }, (_, i) => ({ id: `4-${i + 1}`, typeId: '4', code: `DRUG_${String(i + 1).padStart(2, '0')}`, name: ['甲类西药', '乙类西药', '甲类中成药', '乙类中成药', '国家集采药品', '门诊慢特病用药', '双通道药品', '国家谈判药品', '辅助用药', '儿童用药', '抗肿瘤药', '胰岛素类药品', '高血压用药', '罕见病药品', '血液制品', '抗菌药物', '精神类药品', '麻醉药品', '中药饮片', '历史停用品种'][i], value: String(i + 1), sort: i + 1, status: i === 19 ? 'inactive' : 'active' })),
  '5': Array.from({ length: 20 }, (_, i) => ({ id: `5-${i + 1}`, typeId: '5', code: `SERV_${String(i + 1).padStart(2, '0')}`, name: ['普通门诊诊察', '专家门诊诊察', '急诊诊察', '住院诊察', '门诊检查', '检验项目', '影像检查', '康复治疗', '中医治疗', '手术治疗', '麻醉项目', '护理项目', '输血项目', '病理项目', '口腔治疗', '透析治疗', '精神治疗', '重症监护', '远程会诊', '历史停用项目'][i], value: String(i + 1), sort: i + 1, status: i === 19 ? 'inactive' : 'active' })),
  '6': Array.from({ length: 20 }, (_, i) => ({ id: `6-${i + 1}`, typeId: '6', code: `MAT_${String(i + 1).padStart(2, '0')}`, name: ['人工关节', '心脏支架', '冠脉球囊', '骨科钢板', '脊柱固定系统', '血液透析器', '起搏器电极', '人工晶体', '吻合器', '留置针', '可吸收缝线', '医用导管', '呼吸过滤器', '负压引流装置', '雾化耗材', '集采骨水泥', '口腔种植体', '超声刀头', '造影导管', '历史停用耗材'][i], value: String(i + 1), sort: i + 1, status: i === 19 ? 'inactive' : 'active' })),
};

export default function DataDictionary() {
  const [dictTypes, setDictTypes] = useState<DictType[]>(mockDictTypes);
  const [dictItems, setDictItems] = useState<Record<string, DictItem[]>>(mockDictItems);
  const [selectedType, setSelectedType] = useState<DictType | null>(mockDictTypes[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingType, setEditingType] = useState<DictType | null>(null);
  const [editingItem, setEditingItem] = useState<DictItem | null>(null);

  const filteredTypes = dictTypes.filter((t) => t.name.includes(searchTerm) || t.code.includes(searchTerm));

  const handleAddType = () => {
    setEditingType(null);
    setShowTypeModal(true);
  };

  const handleEditType = (type: DictType) => {
    setEditingType(type);
    setShowTypeModal(true);
  };

  const handleDeleteType = (id: string) => {
    setDictTypes(dictTypes.filter((t) => t.id !== id));
    if (selectedType?.id === id) setSelectedType(null);
  };

  const handleSaveType = (data: Partial<DictType>) => {
    if (editingType) {
      setDictTypes(dictTypes.map((t) => (t.id === editingType.id ? { ...t, ...data } : t)));
    } else {
      const newType: DictType = { id: String(dictTypes.length + 1), code: data.code || '', name: data.name || '', description: data.description || '', itemCount: 0 };
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
    setDictItems({ ...dictItems, [selectedType.id]: items.filter((i) => i.id !== itemId) });
    setDictTypes(dictTypes.map((t) => (t.id === selectedType.id ? { ...t, itemCount: t.itemCount - 1 } : t)));
  };

  const handleSaveItem = (data: Partial<DictItem>) => {
    if (!selectedType) return;
    const items = dictItems[selectedType.id] || [];
    if (editingItem) {
      setDictItems({ ...dictItems, [selectedType.id]: items.map((i) => (i.id === editingItem.id ? { ...i, ...data } : i)) });
    } else {
      const newItem: DictItem = { id: `${selectedType.id}-${items.length + 1}`, typeId: selectedType.id, code: data.code || '', name: data.name || '', value: data.value || '', sort: items.length + 1, status: 'active' };
      setDictItems({ ...dictItems, [selectedType.id]: [...items, newItem] });
      setDictTypes(dictTypes.map((t) => (t.id === selectedType.id ? { ...t, itemCount: t.itemCount + 1 } : t)));
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
              <input type="text" placeholder="搜索字典类型..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredTypes.map((type) => (
              <div key={type.id} onClick={() => setSelectedType(type)} className={`p-4 cursor-pointer transition-colors ${selectedType?.id === type.id ? 'bg-cyan-50' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-cyan-600" />
                    <div>
                      <p className="font-medium text-gray-800">{type.name}</p>
                      <p className="text-xs text-gray-500">{type.code} / {type.itemCount}项</p>
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

function Modal({ title, children }: { title: string; children: React.ReactNode; onClose: () => void }) {
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
