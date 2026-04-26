import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

interface DataElement {
  id: string;
  dmId: string;
  deId: string;
  deName: string;
  dataType: string;
  deNote: string;
}

const initialData: DataElement[] = [
  { id: '1', dmId: 'M00002', deId: '10001', deName: '性别', dataType: '字符型', deNote: '按照标准GB/T2261.1中的性别代码' },
  { id: '2', dmId: 'M00002', deId: '10002', deName: '年龄(岁)', dataType: '数值型', deNote: '大于1岁（含1岁）时的年龄字段，单位岁' },
  { id: '3', dmId: 'M00002', deId: '10003', deName: '年龄(天)', dataType: '数值型', deNote: '小于1岁时的的年龄字段，单位天' },
  { id: '4', dmId: 'M00002', deId: '10004', deName: '医疗机构等级', dataType: '字符型', deNote: '参考医保信息标准中的医院等级字典' },
  { id: '5', dmId: 'M00002', deId: '10005', deName: '医疗类别', dataType: '字符型', deNote: '参考医保信息标准中的医疗类别字典' },
  { id: '6', dmId: 'M00002', deId: '10006', deName: '生育状态', dataType: '字符型', deNote: '参考医保信息标准中的生育状态字典' },
  { id: '7', dmId: 'M00002', deId: '10007', deName: '险种类型', dataType: '字符型', deNote: '参考医保信息标准中的险种类型字典' },
  { id: '8', dmId: 'M00002', deId: '10008', deName: '诊断编码', dataType: '字符型', deNote: '医保疾病诊断分类与代码中的编码' },
  { id: '9', dmId: 'M00002', deId: '10009', deName: '诊断名称', dataType: '字符型', deNote: '医保疾病诊断分类与代码中的名称' },
  { id: '10', dmId: 'M00002', deId: '10010', deName: '出入诊断类别', dataType: '字符型', deNote: '参考医保信息标准中的出入院诊断类别' },
  { id: '11', dmId: 'M00002', deId: '10011', deName: '诊断类别', dataType: '字符型', deNote: '参考医保信息标准中的诊断类别' },
  { id: '12', dmId: 'M00002', deId: '10012', deName: '主诊断标志', dataType: '字符型', deNote: '参考医保信息标准中的主诊断标志' },
  { id: '13', dmId: 'M00002', deId: '10013', deName: '手术操作编码', dataType: '字符型', deNote: '医保手术操作分类与代码中的编码' },
  { id: '14', dmId: 'M00002', deId: '10014', deName: '手术操作名称', dataType: '字符型', deNote: '医保手术操作分类与代码中的名称' },
  { id: '15', dmId: 'M00002', deId: '10015', deName: '手术操作类别', dataType: '字符型', deNote: '参考医保信息标准中的手术操作类别' },
  { id: '16', dmId: 'M00002', deId: '10016', deName: '麻醉方式', dataType: '字符型', deNote: '参考医保信息标准中的麻醉方法代码字典' },
  { id: '17', dmId: 'M00002', deId: '10017', deName: '医保目录编码', dataType: '字符型', deNote: '药品、医疗服务项目、医用耗材在医保目录中的编码' },
  { id: '18', dmId: 'M00002', deId: '10018', deName: '医保目录名称', dataType: '字符型', deNote: '药品、医疗服务项目、医用耗材在医保目录中的名称' },
  { id: '19', dmId: 'M00002', deId: '10019', deName: '医疗收费项目类别', dataType: '字符型', deNote: '参考医保信息标准中的医疗收费项目类别' },
  { id: '20', dmId: 'M00002', deId: '10020', deName: '目录类别', dataType: '字符型', deNote: '参考医保信息标准中的目录类别' },
  { id: '21', dmId: 'M00002', deId: '10021', deName: '医药机构目录编码', dataType: '字符型', deNote: '医疗机构内部字典目录中的编码' },
  { id: '22', dmId: 'M00002', deId: '10022', deName: '医药机构目录名称', dataType: '字符型', deNote: '医疗机构内部字典目录中的名称' },
  { id: '23', dmId: 'M00002', deId: '10023', deName: '费用发生时间', dataType: '日期时间型', deNote: '明细项目的费用发生时间' },
  { id: '24', dmId: 'M00002', deId: '10024', deName: '明细项目费用总额', dataType: '数值型', deNote: '明细项目的费用总额' },
  { id: '25', dmId: 'M00002', deId: '10025', deName: '数量', dataType: '数值型', deNote: '明细项目的数量' },
  { id: '26', dmId: 'M00002', deId: '10026', deName: '单次剂量描述', dataType: '字符型', deNote: '单次剂量说明' },
  { id: '27', dmId: 'M00002', deId: '10027', deName: '使用频次描述', dataType: '字符型', deNote: '使用频次描述' },
  { id: '28', dmId: 'M00002', deId: '10028', deName: '周期天数', dataType: '数值型', deNote: '使用周期，单位天' },
  { id: '29', dmId: 'M00002', deId: '10029', deName: '用药途径描述', dataType: '字符型', deNote: '用药途径说明' },
  { id: '30', dmId: 'M00002', deId: '10030', deName: '商品名', dataType: '字符型', deNote: '商品名' },
  { id: '31', dmId: 'M00002', deId: '10031', deName: '规格', dataType: '字符型', deNote: '规格' },
  { id: '32', dmId: 'M00002', deId: '10032', deName: '剂型名称', dataType: '字符型', deNote: '剂型名称' },
  { id: '33', dmId: 'M00003', deId: '20001', deName: '药品编码', dataType: '字符型', deNote: '国家医保药品目录中的药品编码' },
  { id: '34', dmId: 'M00003', deId: '20002', deName: '药品名称', dataType: '字符型', deNote: '国家医保药品目录中的药品名称' },
  { id: '35', dmId: 'M00003', deId: '20003', deName: '药品分类', dataType: '字符型', deNote: '西药/中成药/中药饮片' },
  { id: '36', dmId: 'M00003', deId: '20004', deName: '剂型', dataType: '字符型', deNote: '片剂/胶囊/注射剂等' },
  { id: '37', dmId: 'M00003', deId: '20005', deName: '规格', dataType: '字符型', deNote: '药品规格' },
  { id: '38', dmId: 'M00003', deId: '20006', deName: '限定支付范围', dataType: '字符型', deNote: '药品限定支付范围' },
  { id: '39', dmId: 'M00003', deId: '20007', deName: '二线用药标志', dataType: '字符型', deNote: '是否限二线用药' },
  { id: '40', dmId: 'M00003', deId: '20008', deName: '适应证', dataType: '字符型', deNote: '药品限定适应证' }
];

export default function DataModelManagement() {
  const [elements, setElements] = useState<DataElement[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DataElement | null>(null);
  const [formData, setFormData] = useState({ dmId: '', deId: '', deName: '', dataType: '字符型', deNote: '' });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ dmId: '', deId: '', deName: '', dataType: '字符型', deNote: '' });
    setShowModal(true);
  };

  const handleEdit = (item: DataElement) => {
    setEditingItem(item);
    setFormData({ dmId: item.dmId, deId: item.deId, deName: item.deName, dataType: item.dataType, deNote: item.deNote });
    setShowModal(true);
  };

  const handleDelete = (id: string) => setElements(elements.filter(e => e.id !== id));

  const handleSave = () => {
    if (editingItem) {
      setElements(elements.map(e => e.id === editingItem.id ? { ...e, ...formData } : e));
    } else {
      setElements([...elements, { id: String(Date.now()), ...formData }]);
    }
    setShowModal(false);
  };

  const filtered = elements.filter(e => e.deName.includes(searchTerm) || e.deId.includes(searchTerm));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">数据模型管理</h1>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg">
          <Plus className="w-4 h-4" />新增数据元素
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索数据元素..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">数据模型</th>
              <th className="px-4 py-3 text-left text-sm font-medium">元素编码</th>
              <th className="px-4 py-3 text-left text-sm font-medium">元素名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium">数据类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium">说明</th>
              <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono text-gray-600">{item.dmId}</td>
                <td className="px-4 py-3 text-sm font-mono text-cyan-600">{item.deId}</td>
                <td className="px-4 py-3 text-sm font-medium">{item.deName}</td>
                <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{item.dataType}</span></td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{item.deNote}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-gray-500 hover:text-cyan-600"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{editingItem ? '编辑' : '新增'}数据元素</h3>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">数据模型</label><input value={formData.dmId} onChange={(e) => setFormData({ ...formData, dmId: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">元素编码</label><input value={formData.deId} onChange={(e) => setFormData({ ...formData, deId: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">元素名称</label><input value={formData.deName} onChange={(e) => setFormData({ ...formData, deName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">数据类型</label><select value={formData.dataType} onChange={(e) => setFormData({ ...formData, dataType: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option>字符型</option><option>数值型</option><option>日期时间型</option></select></div>
                <div><label className="block text-sm font-medium mb-1">说明</label><textarea value={formData.deNote} onChange={(e) => setFormData({ ...formData, deNote: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={3} /></div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">取消</button>
                <button onClick={handleSave} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">保存</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
