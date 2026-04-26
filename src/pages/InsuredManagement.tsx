import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, Eye, Edit, Trash2, X, CheckCircle, XCircle, History } from 'lucide-react';

interface Insured {
  id: string;
  name: string;
  idCard: string;
  type: '职工' | '居民';
  status: '正常' | '暂停' | '终止';
  enrollDate: string;
  phone?: string;
}

interface PaymentRecord {
  id: string;
  month: string;
  amount: number;
  status: '已缴纳' | '欠费';
}

export default function InsuredManagement() {
  const [insureds, setInsureds] = useState<Insured[]>([
    { id: 'I001', name: '张三', idCard: '110101********1234', type: '职工', status: '正常', enrollDate: '2024-01-15', phone: '138****1234' },
    { id: 'I002', name: '李四', idCard: '110101********2345', type: '居民', status: '正常', enrollDate: '2024-02-01', phone: '139****5678' }
  ]);
  const [payments] = useState<PaymentRecord[]>([
    { id: 'P001', month: '2024-06', amount: 680, status: '已缴纳' },
    { id: 'P002', month: '2024-05', amount: 680, status: '已缴纳' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view' | 'payments'>('add');
  const [currentItem, setCurrentItem] = useState<Insured | null>(null);
  const [formData, setFormData] = useState({ name: '', idCard: '', type: '职工', phone: '', status: '正常' });

  const filteredInsureds = insureds.filter(i =>
    i.name.includes(searchQuery) || i.idCard.includes(searchQuery)
  );

  const handleAdd = () => {
    setModalType('add');
    setFormData({ name: '', idCard: '', type: '职工', phone: '', status: '正常' });
    setShowModal(true);
  };

  const handleEdit = (item: Insured) => {
    setModalType('edit');
    setCurrentItem(item);
    setFormData({ name: item.name, idCard: item.idCard, type: item.type, phone: item.phone || '', status: item.status });
    setShowModal(true);
  };

  const handleView = (item: Insured) => {
    setModalType('view');
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleViewPayments = (item: Insured) => {
    setModalType('payments');
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setInsureds(insureds.filter(i => i.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setInsureds(insureds.map(i => {
      if (i.id === id) {
        const statuses: ('正常' | '暂停' | '终止')[] = ['正常', '暂停', '终止'];
        const currentIndex = statuses.indexOf(i.status);
        return { ...i, status: statuses[(currentIndex + 1) % statuses.length] };
      }
      return i;
    }));
  };

  const handleSubmit = () => {
    if (modalType === 'add') {
      const newInsured: Insured = {
        id: `I${String(insureds.length + 1).padStart(3, '0')}`,
        name: formData.name,
        idCard: formData.idCard,
        type: formData.type as '职工' | '居民',
        status: formData.status as '正常' | '暂停' | '终止',
        enrollDate: new Date().toISOString().split('T')[0],
        phone: formData.phone
      };
      setInsureds([...insureds, newInsured]);
    } else if (modalType === 'edit' && currentItem) {
      setInsureds(insureds.map(i => i.id === currentItem.id ? { ...i, ...formData } : i));
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">参保人员管理</h2>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />新增参保
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索姓名或身份证号..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">姓名</th>
              <th className="px-4 py-3 text-left text-sm font-medium">身份证号</th>
              <th className="px-4 py-3 text-left text-sm font-medium">类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium">参保日期</th>
              <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInsureds.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                <td className="px-4 py-3 text-sm">{item.idCard}</td>
                <td className="px-4 py-3 text-sm">{item.type}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleStatus(item.id)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      item.status === '正常' ? 'bg-green-100 text-green-700' :
                      item.status === '暂停' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {item.status}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm">{item.enrollDate}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleView(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleViewPayments(item)} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded"><History className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {modalType === 'add' ? '新增参保' : modalType === 'edit' ? '编辑参保' : modalType === 'payments' ? '缴费记录' : '参保详情'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>

            {modalType === 'payments' ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">参保人：{currentItem?.name}</p>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr><th className="px-3 py-2 text-left text-sm">月份</th><th className="px-3 py-2 text-left text-sm">金额</th><th className="px-3 py-2 text-left text-sm">状态</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {payments.map(p => (
                      <tr key={p.id}>
                        <td className="px-3 py-2 text-sm">{p.month}</td>
                        <td className="px-3 py-2 text-sm">¥{p.amount}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 text-xs rounded ${p.status === '已缴纳' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : modalType === 'view' && currentItem ? (
              <div className="space-y-3">
                <div><label className="text-sm text-gray-500">姓名</label><p className="font-medium">{currentItem.name}</p></div>
                <div><label className="text-sm text-gray-500">身份证号</label><p>{currentItem.idCard}</p></div>
                <div><label className="text-sm text-gray-500">参保类型</label><p>{currentItem.type}</p></div>
                <div><label className="text-sm text-gray-500">联系电话</label><p>{currentItem.phone || '-'}</p></div>
                <div><label className="text-sm text-gray-500">参保日期</label><p>{currentItem.enrollDate}</p></div>
                <div><label className="text-sm text-gray-500">状态</label>
                  <span className={`px-2 py-1 text-xs rounded ${currentItem.status === '正常' ? 'bg-green-100 text-green-700' : currentItem.status === '暂停' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{currentItem.status}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">姓名</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">身份证号</label>
                  <input type="text" value={formData.idCard} onChange={(e) => setFormData({ ...formData, idCard: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">参保类型</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                    <option value="职工">职工</option>
                    <option value="居民">居民</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">联系电话</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                {modalType === 'edit' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">状态</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                      <option value="正常">正常</option>
                      <option value="暂停">暂停</option>
                      <option value="终止">终止</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">关闭</button>
              {(modalType === 'add' || modalType === 'edit') && (
                <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
