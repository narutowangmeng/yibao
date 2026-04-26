import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

interface ValueSet { id: string; valueSetId: string; valueSetName: string; entityId: string; sourceCode: string; term: string; valueSource: string; }
const categories = ['医保机构等级', '医保机构类别', '险种类型', '结算方式', '支付类别', '基金预警等级', '信用评价等级'];
const seeded: ValueSet[] = [
  ['VS0001', '医保机构等级', 'ENT1001', 'A01', '三级甲等', '江苏省医保定点机构基础字典'],
  ['VS0002', '医保机构等级', 'ENT1001', 'A02', '三级乙等', '江苏省医保定点机构基础字典'],
  ['VS0003', '医保机构等级', 'ENT1001', 'A03', '二级甲等', '江苏省医保定点机构基础字典'],
  ['VS0004', '医保机构类别', 'ENT1002', 'B01', '综合医院', '江苏省医保机构分类字典'],
  ['VS0005', '医保机构类别', 'ENT1002', 'B02', '中医医院', '江苏省医保机构分类字典'],
  ['VS0006', '医保机构类别', 'ENT1002', 'B03', '社区医院', '江苏省医保机构分类字典'],
  ['VS0007', '医保机构类别', 'ENT1002', 'B04', '零售药店', '江苏省医保机构分类字典'],
  ['VS0008', '医保机构类别', 'ENT1002', 'B05', '双通道药店', '江苏省医保机构分类字典'],
  ['VS0009', '险种类型', 'ENT1003', 'C01', '职工医保', '江苏省参保业务基础字典'],
  ['VS0010', '险种类型', 'ENT1003', 'C02', '居民医保', '江苏省参保业务基础字典'],
  ['VS0011', '险种类型', 'ENT1003', 'C03', '长期护理保险', '江苏省参保业务基础字典'],
  ['VS0012', '结算方式', 'ENT1004', 'D01', 'DRG付费', '江苏省医保结算基础字典'],
  ['VS0013', '结算方式', 'ENT1004', 'D02', 'DIP付费', '江苏省医保结算基础字典'],
  ['VS0014', '结算方式', 'ENT1004', 'D03', '按项目付费', '江苏省医保结算基础字典'],
  ['VS0015', '结算方式', 'ENT1004', 'D04', '异地就医直接结算', '江苏省医保结算基础字典'],
  ['VS0016', '支付类别', 'ENT1005', 'E01', '甲类', '江苏省医保目录基础字典'],
  ['VS0017', '支付类别', 'ENT1005', 'E02', '乙类', '江苏省医保目录基础字典'],
  ['VS0018', '基金预警等级', 'ENT1006', 'F01', '高风险', '江苏省基金监管预警字典'],
  ['VS0019', '基金预警等级', 'ENT1006', 'F02', '中风险', '江苏省基金监管预警字典'],
  ['VS0020', '信用评价等级', 'ENT1007', 'G01', 'A级', '江苏省信用评价结果字典']
].map(([valueSetId, valueSetName, entityId, sourceCode, term, valueSource], index) => ({ id: String(index + 1), valueSetId, valueSetName, entityId, sourceCode, term, valueSource }));

export default function ValueSetManagement() {
  const [valueSets, setValueSets] = useState<ValueSet[]>(seeded);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ValueSet | null>(null);
  const [formData, setFormData] = useState<Partial<ValueSet>>({ valueSetId: '', valueSetName: '', entityId: '', sourceCode: '', term: '', valueSource: '' });
  const filtered = valueSets.filter((v) => (!filterCategory || v.valueSetName === filterCategory) && (v.valueSetName.includes(searchTerm) || v.term.includes(searchTerm)));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-800">值集字典管理</h1><button onClick={() => { setEditingItem(null); setFormData({ valueSetId: '', valueSetName: '', entityId: '', sourceCode: '', term: '', valueSource: '' }); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"><Plus className="w-4 h-4" />新增值集</button></div>
      <div className="flex gap-4"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="搜索值集..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" /></div><select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg"><option value="">全部分类</option>{categories.map((c) => <option key={c}>{c}</option>)}</select></div>
      <div className="bg-white rounded-xl border border-gray-200"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium">值集ID</th><th className="px-4 py-3 text-left text-sm font-medium">值集名称</th><th className="px-4 py-3 text-left text-sm font-medium">实体ID</th><th className="px-4 py-3 text-left text-sm font-medium">来源编码</th><th className="px-4 py-3 text-left text-sm font-medium">术语</th><th className="px-4 py-3 text-left text-sm font-medium">来源</th><th className="px-4 py-3 text-left text-sm font-medium">操作</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50"><td className="px-4 py-3 text-sm font-mono text-cyan-600">{item.valueSetId}</td><td className="px-4 py-3 text-sm font-medium">{item.valueSetName}</td><td className="px-4 py-3 text-sm text-gray-600">{item.entityId}</td><td className="px-4 py-3 text-sm text-gray-600">{item.sourceCode}</td><td className="px-4 py-3 text-sm">{item.term}</td><td className="px-4 py-3 text-sm text-gray-500">{item.valueSource}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => { setEditingItem(item); setFormData({ ...item }); setShowModal(true); }} className="p-1.5 text-gray-500 hover:text-cyan-600"><Edit2 className="w-4 h-4" /></button><button onClick={() => setValueSets(valueSets.filter((v) => v.id !== item.id))} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></div></td></tr>)}</tbody></table></div>
      <AnimatePresence>{showModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-lg p-6"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">{editingItem ? '编辑' : '新增'}值集</h3><button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button></div><div className="space-y-3"><div className="grid grid-cols-2 gap-3"><input value={formData.valueSetId} onChange={(e) => setFormData({ ...formData, valueSetId: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /><select value={formData.valueSetName} onChange={(e) => setFormData({ ...formData, valueSetName: e.target.value })} className="w-full px-3 py-2 border rounded-lg">{categories.map((c) => <option key={c}>{c}</option>)}</select></div><div className="grid grid-cols-2 gap-3"><input value={formData.entityId} onChange={(e) => setFormData({ ...formData, entityId: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /><input value={formData.sourceCode} onChange={(e) => setFormData({ ...formData, sourceCode: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div><input value={formData.term} onChange={(e) => setFormData({ ...formData, term: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /><input value={formData.valueSource} onChange={(e) => setFormData({ ...formData, valueSource: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div><div className="flex justify-end gap-3 mt-4"><button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">取消</button><button onClick={() => { if (editingItem) setValueSets(valueSets.map((v) => v.id === editingItem.id ? { ...v, ...formData } as ValueSet : v)); else setValueSets([...valueSets, { id: String(Date.now()), ...formData } as ValueSet]); setShowModal(false); }} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">保存</button></div></motion.div></motion.div>}</AnimatePresence>
    </div>
  );
}
