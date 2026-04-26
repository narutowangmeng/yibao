import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Eye, Edit, Trash2, X, CheckCircle, XCircle, Search, Filter } from 'lucide-react';

interface ReimbursementItem {
  id: string;
  patient: string;
  type: '门诊' | '住院' | '特殊门诊';
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  hospital: string;
  diagnosis?: string;
}

const tabs = [
  { id: 'outpatient', label: '门诊报销' },
  { id: 'inpatient', label: '住院报销' },
  { id: 'special', label: '特殊门诊' }
];

export default function Reimbursement() {
  const [activeTab, setActiveTab] = useState('outpatient');
  const [items, setItems] = useState<ReimbursementItem[]>([
    { id: 'RB001', patient: '张三', type: '门诊', amount: 320, date: '2024-03-15', status: 'pending', hospital: '市第一人民医院' },
    { id: 'RB002', patient: '李四', type: '住院', amount: 12500, date: '2024-03-10', status: 'approved', hospital: '市中心医院', diagnosis: '肺炎' },
    { id: 'RB003', patient: '王五', type: '特殊门诊', amount: 2800, date: '2024-03-08', status: 'rejected', hospital: '省人民医院' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [currentItem, setCurrentItem] = useState<ReimbursementItem | null>(null);
  const [formData, setFormData] = useState({ patient: '', type: '门诊', amount: '', hospital: '', diagnosis: '' });

  const filteredItems = items.filter(i => {
    if (activeTab === 'outpatient') return i.type === '门诊';
    if (activeTab === 'inpatient') return i.type === '住院';
    return i.type === '特殊门诊';
  });

  const handleAdd = () => {
    setModalType('add');
    setFormData({ patient: '', type: activeTab === 'outpatient' ? '门诊' : activeTab === 'inpatient' ? '住院' : '特殊门诊', amount: '', hospital: '', diagnosis: '' });
    setShowModal(true);
  };

  const handleEdit = (item: ReimbursementItem) => {
    setModalType('edit');
    setCurrentItem(item);
    setFormData({ patient: item.patient, type: item.type, amount: String(item.amount), hospital: item.hospital, diagnosis: item.diagnosis || '' });
    setShowModal(true);
  };

  const handleView = (item: ReimbursementItem) => {
    setModalType('view');
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleAudit = (id: string, approved: boolean) => {
    setItems(items.map(i => i.id === id ? { ...i, status: approved ? 'approved' : 'rejected' } : i));
  };

  const handleSubmit = () => {
    if (modalType === 'add') {
      setItems([...items, {
        id: `RB${String(items.length + 1).padStart(3, '0')}`,
        patient: formData.patient,
        type: formData.type as '门诊' | '住院' | '特殊门诊',
        amount: Number(formData.amount),
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        hospital: formData.hospital,
        diagnosis: formData.diagnosis
      }]);
    } else if (currentItem) {
      setItems(items.map(i => i.id === currentItem.id ? { ...i, patient: formData.patient, amount: Number(formData.amount), hospital: formData.hospital, diagnosis: formData.diagnosis } : i));
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">费用报销管理</h2>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg">
          <Plus className="w-4 h-4" />新增申请
        </button>
      </div>
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm">编号</th>
              <th className="px-4 py-3 text-left text-sm">患者</th>
              <th className="px-4 py-3 text-left text-sm">金额</th>
              <th className="px-4 py-3 text-left text-sm">医院</th>
              <th className="px-4 py-3 text-left text-sm">日期</th>
              <th className="px-4 py-3 text-left text-sm">状态</th>
              <th className="px-4 py-3 text-left text-sm">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{item.id}</td>
                <td className="px-4 py-3 text-sm">{item.patient}</td>
                <td className="px-4 py-3 text-sm">¥{item.amount}</td>
                <td className="px-4 py-3 text-sm">{item.hospital}</td>
                <td className="px-4 py-3 text-sm">{item.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${
                    item.status === 'approved' ? 'bg-green-100 text-green-700' :
                    item.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status === 'approved' ? '已通过' : item.status === 'rejected' ? '已驳回' : '待审核'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleView(item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => handleEdit(item)} className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"><Edit className="w-4 h-4" /></button>
                    {item.status === 'pending' && (
                      <>
                        <button onClick={() => handleAudit(item.id, true)} className="p-1 text-green-600 hover:bg-green-50 rounded"><CheckCircle className="w-4 h-4" /></button>
                        <button onClick={() => handleAudit(item.id, false)} className="p-1 text-red-600 hover:bg-red-50 rounded"><XCircle className="w-4 h-4" /></button>
                      </>
                    )}
                    <button onClick={() => handleDelete(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{modalType === 'add' ? '新增申请' : modalType === 'edit' ? '编辑申请' : '申请详情'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            {modalType === 'view' && currentItem ? (
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-500">编号</span><span>{currentItem.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">患者</span><span>{currentItem.patient}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">类型</span><span>{currentItem.type}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">金额</span><span className="font-medium">¥{currentItem.amount}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">医院</span><span>{currentItem.hospital}</span></div>
                {currentItem.diagnosis && <div className="flex justify-between"><span className="text-gray-500">诊断</span><span>{currentItem.diagnosis}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">日期</span><span>{currentItem.date}</span></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">患者姓名</label><input type="text" value={formData.patient} onChange={(e) => setFormData({ ...formData, patient: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">报销金额</label><input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">就诊医院</label><input type="text" value={formData.hospital} onChange={(e) => setFormData({ ...formData, hospital: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">诊断</label><input type="text" value={formData.diagnosis} onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">取消</button>
              {modalType !== 'view' && <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">保存</button>}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
