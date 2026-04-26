import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, AlertCircle, CheckCircle, Info, Eye } from 'lucide-react';
import { getAgencyLevel } from '../../../config/managementPermissions';

interface RuleConclusion {
  id: string;
  ruleId: string;
  resultType: '提示' | '警告' | '拦截';
  resultTip: string;
  status: 'active' | 'inactive';
}

const resultTypeIcons = { 提示: Info, 警告: AlertCircle, 拦截: CheckCircle };
const resultTypeColors = { 提示: 'bg-blue-100 text-blue-700', 警告: 'bg-yellow-100 text-yellow-700', 拦截: 'bg-red-100 text-red-700' };

export default function RuleConclusionManagement({ userAgency }: { userAgency: string }) {
  const [conclusions, setConclusions] = useState<RuleConclusion[]>([
    { id: '1', ruleId: 'R00001', resultType: '提示', resultTip: '根据2025年国家医保药品目录规定，该药品限工伤保险使用方可报销。', status: 'active' },
    { id: '2', ruleId: 'R00003', resultType: '提示', resultTip: '根据2025年国家医保药品目录规定，该中药饮片非医保支付范围。', status: 'active' },
    { id: '3', ruleId: 'R00005', resultType: '提示', resultTip: '根据2025年国家医保药品目录规定，该药品限二线治疗用药时方可报销。', status: 'active' },
    { id: '4', ruleId: 'R00007', resultType: '提示', resultTip: '根据2025年国家医保药品目录规定，该药品限儿童使用时方可报销。', status: 'active' },
    { id: '5', ruleId: 'R00008', resultType: '提示', resultTip: '根据2025年国家医保药品目录规定，该药品限指定适应证患者使用方可报销。', status: 'active' },
    { id: '6', ruleId: 'R00012', resultType: '提示', resultTip: '根据2025年国家医保药品目录规定，该药品限指定医疗机构级别的医院方可报销。', status: 'active' },
    { id: '7', ruleId: 'R00017', resultType: '提示', resultTip: '根据2025年国家医保药品目录规定，该药品限急救抢救时方可报销。', status: 'active' },
    { id: '8', ruleId: 'R00021', resultType: '提示', resultTip: '根据2025年国家医保药品目录规定，该药品限与特定医疗服务项目同时使用方可报销。', status: 'active' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<RuleConclusion | null>(null);
  const [viewingItem, setViewingItem] = useState<RuleConclusion | null>(null);
  const [formData, setFormData] = useState({ ruleId: '', resultType: '提示' as const, resultTip: '', status: 'active' as const });
  const isProvince = getAgencyLevel(userAgency) === 'province';

  const handleAdd = () => { setEditingItem(null); setFormData({ ruleId: '', resultType: '提示', resultTip: '', status: 'active' }); setShowModal(true); };
  const handleEdit = (item: RuleConclusion) => { setEditingItem(item); setFormData({ ruleId: item.ruleId, resultType: item.resultType, resultTip: item.resultTip, status: item.status }); setShowModal(true); };
  const handleDelete = (id: string) => setConclusions(conclusions.filter(c => c.id !== id));
  const handleSave = () => { if (editingItem) setConclusions(conclusions.map(c => c.id === editingItem.id ? { ...c, ...formData } : c)); else setConclusions([...conclusions, { id: String(Date.now()), ...formData }]); setShowModal(false); };
  const filtered = conclusions.filter(c => c.ruleId.includes(searchTerm) || c.resultTip.includes(searchTerm));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">规则结论管理</h1>
        {isProvince ? (
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"><Plus className="w-4 h-4" />新增结论</button>
        ) : (
          <div className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700">地市账号仅可查看规则结论，不可新增、编辑或删除</div>
        )}
      </div>
      <div className="flex gap-4"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="搜索规则编码或提示内容..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" /></div></div>
      <div className="bg-white rounded-xl border border-gray-200"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium">规则编码</th><th className="px-4 py-3 text-left text-sm font-medium">提示类型</th><th className="px-4 py-3 text-left text-sm font-medium">提示内容</th><th className="px-4 py-3 text-left text-sm font-medium">状态</th><th className="px-4 py-3 text-left text-sm font-medium">操作</th></tr></thead><tbody>{filtered.map(item => { const Icon = resultTypeIcons[item.resultType]; return <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50"><td className="px-4 py-3 text-sm font-mono text-cyan-600">{item.ruleId}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${resultTypeColors[item.resultType]}`}><Icon className="w-3 h-3" />{item.resultType}</span></td><td className="px-4 py-3 text-sm text-gray-700 max-w-md truncate">{item.resultTip}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.status === 'active' ? '启用' : '停用'}</span></td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => setViewingItem(item)} className="p-1.5 text-gray-500 hover:text-cyan-600"><Eye className="w-4 h-4" /></button>{isProvince && <><button onClick={() => handleEdit(item)} className="p-1.5 text-gray-500 hover:text-cyan-600"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></>}</div></td></tr>; })}</tbody></table></div>
      <AnimatePresence>
        {viewingItem && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md p-6"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">规则结论详情</h3><button onClick={() => setViewingItem(null)}><X className="w-5 h-5" /></button></div><div className="space-y-3 text-sm"><p><span className="text-gray-500">规则编码:</span> {viewingItem.ruleId}</p><p><span className="text-gray-500">提示类型:</span> {viewingItem.resultType}</p><p><span className="text-gray-500">提示内容:</span> {viewingItem.resultTip}</p><p><span className="text-gray-500">状态:</span> {viewingItem.status === 'active' ? '启用' : '停用'}</p></div></motion.div></motion.div>}
        {isProvince && showModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md p-6"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">{editingItem ? '编辑' : '新增'}规则结论</h3><button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button></div><div className="space-y-4"><div><label className="block text-sm font-medium mb-1">规则编码</label><input value={formData.ruleId} onChange={(e) => setFormData({ ...formData, ruleId: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">提示类型</label><select value={formData.resultType} onChange={(e) => setFormData({ ...formData, resultType: e.target.value as '提示' | '警告' | '拦截' })} className="w-full px-3 py-2 border rounded-lg"><option>提示</option><option>警告</option><option>拦截</option></select></div><div><label className="block text-sm font-medium mb-1">提示内容</label><textarea value={formData.resultTip} onChange={(e) => setFormData({ ...formData, resultTip: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">状态</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} className="w-full px-3 py-2 border rounded-lg"><option value="active">启用</option><option value="inactive">停用</option></select></div></div><div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">取消</button><button onClick={handleSave} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">保存</button></div></motion.div></motion.div>}
      </AnimatePresence>
    </div>
  );
}
