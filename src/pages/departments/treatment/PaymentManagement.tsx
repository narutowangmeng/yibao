import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, DollarSign, Bell, CheckCircle, X } from 'lucide-react';

interface PaymentStandard {
  id: string;
  name: string;
  type: string;
  amount: number;
  status: 'active' | 'inactive';
}

interface PaymentAudit {
  id: string;
  person: string;
  type: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

interface OverduePayment {
  id: string;
  person: string;
  amount: number;
  dueDate: string;
  days: number;
}

export default function PaymentManagement() {
  const [activeTab, setActiveTab] = useState('standard');
  const [standards, setStandards] = useState<PaymentStandard[]>([
    { id: '1', name: '职工医保高档', type: '职工', amount: 3600, status: 'active' },
    { id: '2', name: '居民医保中档', type: '居民', amount: 600, status: 'active' },
  ]);
  const [audits, setAudits] = useState<PaymentAudit[]>([
    { id: '1', person: '参保人A', type: '职工医保', amount: 3600, status: 'pending', date: '2024-01-15' },
    { id: '2', person: '参保人B', type: '居民医保', amount: 600, status: 'pending', date: '2024-01-14' },
  ]);
  const [overdues, setOverdues] = useState<OverduePayment[]>([
    { id: '1', person: '参保人C', amount: 3600, dueDate: '2024-01-01', days: 15 },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', type: '职工', amount: 0 });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', type: '职工', amount: 0 });
    setShowModal(true);
  };

  const handleEdit = (item: PaymentStandard) => {
    setEditingItem(item);
    setFormData({ name: item.name, type: item.type, amount: item.amount });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setStandards(standards.filter(s => s.id !== id));
  };

  const handleSave = () => {
    if (editingItem) {
      setStandards(standards.map(s => s.id === editingItem.id ? { ...s, ...formData } : s));
    } else {
      setStandards([...standards, { id: String(Date.now()), ...formData, status: 'active' }]);
    }
    setShowModal(false);
  };

  const handleAudit = (id: string, status: 'approved' | 'rejected') => {
    setAudits(audits.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleRemind = (id: string) => {
    setOverdues(overdues.filter(o => o.id !== id));
    alert('催缴通知已发送');
  };

  const renderStandardTab = () => (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索缴费标准..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" /> 新增标准
        </button>
      </div>
      <div className="bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">标准名称</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">类型</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">金额</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {standards.filter(s => s.name.includes(searchTerm)).map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.type}</td>
                <td className="px-4 py-3 text-sm text-cyan-600 font-medium">¥{item.amount}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{item.status === 'active' ? '启用' : '停用'}</span></td>
                <td className="px-4 py-3"><div className="flex justify-end gap-2"><button onClick={() => handleEdit(item)} className="p-1.5 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAuditTab = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">参保人</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">险种</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">金额</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th></tr></thead>
        <tbody className="divide-y divide-gray-200">
          {audits.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.person}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{item.type}</td>
              <td className="px-4 py-3 text-sm text-cyan-600">¥{item.amount}</td>
              <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.status === 'pending' ? '待审核' : item.status === 'approved' ? '已通过' : '已驳回'}</span></td>
              <td className="px-4 py-3"><div className="flex justify-end gap-2">{item.status === 'pending' && (<><button onClick={() => handleAudit(item.id, 'approved')} className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">通过</button><button onClick={() => handleAudit(item.id, 'rejected')} className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">驳回</button></>)}</div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderOverdueTab = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">参保人</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">欠费金额</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">应缴日期</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">逾期天数</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th></tr></thead>
        <tbody className="divide-y divide-gray-200">
          {overdues.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.person}</td>
              <td className="px-4 py-3 text-sm text-red-600 font-medium">¥{item.amount}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{item.dueDate}</td>
              <td className="px-4 py-3 text-sm text-orange-600">{item.days}天</td>
              <td className="px-4 py-3"><div className="flex justify-end"><button onClick={() => handleRemind(item.id)} className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white text-xs rounded hover:bg-orange-700"><Bell className="w-3 h-3" /> 发送催缴</button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200">
        {[{ id: 'standard', label: '缴费标准' }, { id: 'audit', label: '缴费核定' }, { id: 'overdue', label: '催缴管理' }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'}`}>{tab.label}</button>
        ))}
      </div>
      {activeTab === 'standard' && renderStandardTab()}
      {activeTab === 'audit' && renderAuditTab()}
      {activeTab === 'overdue' && renderOverdueTab()}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">{editingItem ? '编辑' : '新增'}缴费标准</h3><button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button></div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">标准名称</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">类型</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg"><option>职工</option><option>居民</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">金额</label><input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
              </div>
              <div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">取消</button><button onClick={handleSave} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
