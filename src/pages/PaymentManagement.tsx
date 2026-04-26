import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Bell, X, Search } from 'lucide-react';

interface PaymentRecord {
  id: string;
  name: string;
  idCard: string;
  baseAmount: number;
  amount: number;
  month: string;
  status: 'pending' | 'confirmed' | 'overdue' | 'paid';
}

interface OverdueRecord {
  id: string;
  name: string;
  month: string;
  amount: number;
  days: number;
}

export default function PaymentManagement() {
  const [activeTab, setActiveTab] = useState('calc');
  const [payments, setPayments] = useState<PaymentRecord[]>([
    { id: 'P001', name: '张三', idCard: '110101********1234', baseAmount: 8500, amount: 680, month: '2024-03', status: 'pending' },
    { id: 'P002', name: '李四', idCard: '110101********2345', baseAmount: 5200, amount: 416, month: '2024-03', status: 'confirmed' },
    { id: 'P003', name: '王五', idCard: '110101********3456', baseAmount: 8500, amount: 680, month: '2024-02', status: 'overdue' }
  ]);
  const [overdues, setOverdues] = useState<OverdueRecord[]>([
    { id: 'O001', name: '王五', month: '2024-02', amount: 680, days: 15 }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [currentItem, setCurrentItem] = useState<PaymentRecord | null>(null);
  const [formData, setFormData] = useState({ name: '', idCard: '', baseAmount: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = () => {
    setModalType('add');
    setCurrentItem(null);
    setFormData({ name: '', idCard: '', baseAmount: '' });
    setShowModal(true);
  };

  const handleEdit = (item: PaymentRecord) => {
    setModalType('edit');
    setCurrentItem(item);
    setFormData({ name: item.name, idCard: item.idCard, baseAmount: String(item.baseAmount) });
    setShowModal(true);
  };

  const handleView = (item: PaymentRecord) => {
    setModalType('view');
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  const handleSubmit = () => {
    const amount = Math.floor(Number(formData.baseAmount) * 0.08);
    if (modalType === 'add') {
      setPayments([...payments, {
        id: `P${String(payments.length + 1).padStart(3, '0')}`,
        name: formData.name,
        idCard: formData.idCard,
        baseAmount: Number(formData.baseAmount),
        amount,
        month: new Date().toISOString().slice(0, 7),
        status: 'pending'
      }]);
    } else if (currentItem) {
      setPayments(payments.map(p => p.id === currentItem.id ? { ...p, name: formData.name, idCard: formData.idCard, baseAmount: Number(formData.baseAmount), amount } : p));
    }
    setShowModal(false);
  };

  const handleConfirm = (id: string) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'confirmed' } : p));
  };

  const handleRevoke = (id: string) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'pending' } : p));
  };

  const handleRemind = (id: string) => {
    alert('催缴通知已发送');
    setOverdues(overdues.filter(o => o.id !== id));
  };

  const filteredPayments = payments.filter(p => p.name.includes(searchQuery) || p.idCard.includes(searchQuery));

  const tabs = [
    { id: 'calc', label: '缴费核定' },
    { id: 'records', label: '缴费记录' },
    { id: 'overdue', label: '欠费催缴' }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">缴费管理</h2>
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500'}`}>{tab.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {activeTab === 'calc' && (
            <div className="space-y-4">
              <div className="flex gap-2 justify-between">
                <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"><Plus className="w-4 h-4" />新增核定</button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="搜索..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <table className="w-full bg-white rounded-xl border">
                <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">姓名</th><th className="px-4 py-3 text-left text-sm">身份证号</th><th className="px-4 py-3 text-left text-sm">缴费基数</th><th className="px-4 py-3 text-left text-sm">应缴金额</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-left text-sm">操作</th></tr></thead>
                <tbody>{filteredPayments.map(p => (<tr key={p.id} className="border-t hover:bg-gray-50"><td className="px-4 py-3 text-sm">{p.name}</td><td className="px-4 py-3 text-sm">{p.idCard}</td><td className="px-4 py-3 text-sm">¥{p.baseAmount}</td><td className="px-4 py-3 text-sm">¥{p.amount}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded ${p.status === 'confirmed' ? 'bg-green-100 text-green-700' : p.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status === 'confirmed' ? '已确认' : p.status === 'overdue' ? '欠费' : '待确认'}</span></td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => handleView(p)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button><button onClick={() => handleEdit(p)} className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(p.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button></div></td></tr>))}</tbody>
              </table>
            </div>
          )}
          {activeTab === 'records' && (
            <div className="space-y-4">
              <table className="w-full bg-white rounded-xl border">
                <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">姓名</th><th className="px-4 py-3 text-left text-sm">月份</th><th className="px-4 py-3 text-left text-sm">金额</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-left text-sm">操作</th></tr></thead>
                <tbody>{payments.filter(p => p.status !== 'pending').map(p => (<tr key={p.id} className="border-t hover:bg-gray-50"><td className="px-4 py-3 text-sm">{p.name}</td><td className="px-4 py-3 text-sm">{p.month}</td><td className="px-4 py-3 text-sm">¥{p.amount}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded ${p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{p.status === 'paid' ? '已缴纳' : '已确认'}</span></td><td className="px-4 py-3"><div className="flex gap-2">{p.status === 'confirmed' && <button onClick={() => handleRevoke(p.id)} className="px-2 py-1 text-xs bg-gray-600 text-white rounded">撤销</button>}<button onClick={() => handleConfirm(p.id)} className="px-2 py-1 text-xs bg-green-600 text-white rounded" disabled={p.status === 'paid'}>确认缴费</button></div></td></tr>))}</tbody>
              </table>
            </div>
          )}
          {activeTab === 'overdue' && (
            <div className="space-y-4">
              {overdues.map(o => (
                <div key={o.id} className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between">
                    <div><p className="font-medium">{o.name}</p><p className="text-sm text-gray-600">{o.month} · ¥{o.amount} · 逾期{o.days}天</p></div>
                    <button onClick={() => handleRemind(o.id)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg"><Bell className="w-4 h-4" />催缴</button>
                  </div>
                </div>
              ))}
              {overdues.length === 0 && <div className="text-center text-gray-500 py-8">暂无欠费记录</div>}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">{modalType === 'add' ? '新增核定' : modalType === 'edit' ? '编辑核定' : '详情'}</h3><button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button></div>
            {modalType === 'view' && currentItem ? (
              <div className="space-y-3"><div className="flex justify-between"><span className="text-gray-500">姓名</span><span>{currentItem.name}</span></div><div className="flex justify-between"><span className="text-gray-500">身份证号</span><span>{currentItem.idCard}</span></div><div className="flex justify-between"><span className="text-gray-500">缴费基数</span><span>¥{currentItem.baseAmount}</span></div><div className="flex justify-between"><span className="text-gray-500">应缴金额</span><span>¥{currentItem.amount}</span></div><div className="flex justify-between"><span className="text-gray-500">月份</span><span>{currentItem.month}</span></div></div>
            ) : (
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">姓名</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">身份证号</label><input type="text" value={formData.idCard} onChange={(e) => setFormData({ ...formData, idCard: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">缴费基数</label><input type="number" value={formData.baseAmount} onChange={(e) => setFormData({ ...formData, baseAmount: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-6"><button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">取消</button>{modalType !== 'view' && <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">保存</button>}</div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
