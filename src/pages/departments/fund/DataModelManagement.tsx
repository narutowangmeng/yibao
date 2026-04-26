import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

interface DataElement { id: string; dmId: string; deId: string; deName: string; dataType: string; deNote: string; }

const initialData: DataElement[] = [
  ['DM1001', 'DE10001', '统筹区代码', '字符型', '江苏省及13个设区市医保统筹区编码。'],
  ['DM1001', 'DE10002', '参保人姓名', '字符型', '参保人员法定姓名。'],
  ['DM1001', 'DE10003', '参保人证件号码', '字符型', '居民身份证或其他有效证件号。'],
  ['DM1001', 'DE10004', '险种类型', '字符型', '职工医保、居民医保、长期护理保险等。'],
  ['DM1001', 'DE10005', '参保状态', '字符型', '正常参保、暂停参保、终止参保。'],
  ['DM1002', 'DE20001', '定点机构编码', '字符型', '医保定点医疗机构或药店唯一编码。'],
  ['DM1002', 'DE20002', '定点机构名称', '字符型', '医保协议管理使用的机构全称。'],
  ['DM1002', 'DE20003', '机构类别', '字符型', '三级医院、社区医院、零售药店、双通道药店。'],
  ['DM1002', 'DE20004', '机构等级', '字符型', '三级甲等、三级乙等、二级甲等、一级等。'],
  ['DM1002', 'DE20005', '协议状态', '字符型', '签约、暂停、退出。'],
  ['DM1003', 'DE30001', '医保目录编码', '字符型', '药品、诊疗项目、耗材统一医保目录编码。'],
  ['DM1003', 'DE30002', '医保目录名称', '字符型', '医保目录标准名称。'],
  ['DM1003', 'DE30003', '目录类别', '字符型', '药品目录、诊疗项目目录、耗材目录。'],
  ['DM1003', 'DE30004', '支付类别', '字符型', '甲类、乙类、自费。'],
  ['DM1003', 'DE30005', '限定支付范围', '字符型', '门诊慢特病、住院、双通道等限定条件。'],
  ['DM1004', 'DE40001', '结算单据号', '字符型', '医保结算业务唯一单据编号。'],
  ['DM1004', 'DE40002', '基金支付金额', '数值型', '医保基金统筹支付金额。'],
  ['DM1004', 'DE40003', '个人自付金额', '数值型', '参保人现金或个人账户支付金额。'],
  ['DM1004', 'DE40004', '结算时间', '日期时间型', '医保结算完成时间。'],
  ['DM1004', 'DE40005', '结算方式', '字符型', 'DRG、DIP、按项目付费、异地就医直接结算。']
].map(([dmId, deId, deName, dataType, deNote], index) => ({ id: String(index + 1), dmId, deId, deName, dataType, deNote }));

export default function DataModelManagement() {
  const [elements, setElements] = useState<DataElement[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DataElement | null>(null);
  const [formData, setFormData] = useState({ dmId: '', deId: '', deName: '', dataType: '字符型', deNote: '' });
  const filtered = elements.filter((e) => e.deName.includes(searchTerm) || e.deId.includes(searchTerm));
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-800">数据模型管理</h1><button onClick={() => { setEditingItem(null); setFormData({ dmId: '', deId: '', deName: '', dataType: '字符型', deNote: '' }); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"><Plus className="w-4 h-4" />新增数据元素</button></div>
      <div className="flex gap-4"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="搜索数据元素..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" /></div></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium">数据模型</th><th className="px-4 py-3 text-left text-sm font-medium">元素编码</th><th className="px-4 py-3 text-left text-sm font-medium">元素名称</th><th className="px-4 py-3 text-left text-sm font-medium">数据类型</th><th className="px-4 py-3 text-left text-sm font-medium">说明</th><th className="px-4 py-3 text-left text-sm font-medium">操作</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50"><td className="px-4 py-3 text-sm font-mono text-gray-600">{item.dmId}</td><td className="px-4 py-3 text-sm font-mono text-cyan-600">{item.deId}</td><td className="px-4 py-3 text-sm font-medium">{item.deName}</td><td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{item.dataType}</span></td><td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{item.deNote}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => { setEditingItem(item); setFormData({ dmId: item.dmId, deId: item.deId, deName: item.deName, dataType: item.dataType, deNote: item.deNote }); setShowModal(true); }} className="p-1.5 text-gray-500 hover:text-cyan-600"><Edit2 className="w-4 h-4" /></button><button onClick={() => setElements(elements.filter((e) => e.id !== item.id))} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></div></td></tr>)}</tbody></table></div>
      <AnimatePresence>{showModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md p-6"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">{editingItem ? '编辑' : '新增'}数据元素</h3><button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button></div><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><input value={formData.dmId} onChange={(e) => setFormData({ ...formData, dmId: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /><input value={formData.deId} onChange={(e) => setFormData({ ...formData, deId: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div><input value={formData.deName} onChange={(e) => setFormData({ ...formData, deName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /><select value={formData.dataType} onChange={(e) => setFormData({ ...formData, dataType: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option>字符型</option><option>数值型</option><option>日期时间型</option></select><textarea value={formData.deNote} onChange={(e) => setFormData({ ...formData, deNote: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} /></div><div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">取消</button><button onClick={() => { if (editingItem) setElements(elements.map((e) => e.id === editingItem.id ? { ...e, ...formData } : e)); else setElements([...elements, { id: String(Date.now()), ...formData }]); setShowModal(false); }} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">保存</button></div></motion.div></motion.div>}</AnimatePresence>
    </div>
  );
}
