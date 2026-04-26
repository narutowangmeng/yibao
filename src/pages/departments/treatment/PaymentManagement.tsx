import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Bell, X } from 'lucide-react';
import { getAgencyLevel } from '../../../config/managementPermissions';

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

interface PaymentManagementProps {
  userAgency: string;
}

const initialStandards: PaymentStandard[] = [
  { id: '1', name: '南京市职工医保月缴费基数上限', type: '职工', amount: 24396, status: 'active' },
  { id: '2', name: '南京市职工医保月缴费基数下限', type: '职工', amount: 4879, status: 'active' },
  { id: '3', name: '苏州市职工医保月缴费基数上限', type: '职工', amount: 24042, status: 'active' },
  { id: '4', name: '江苏省灵活就业人员年缴费参考标准', type: '灵活就业', amount: 6120, status: 'inactive' },
];

const initialAudits: PaymentAudit[] = [
  { id: 'A01', person: '王建国', type: '南京职工医保补缴情形审核', amount: 4680, status: 'pending', date: '2026-04-18' },
  { id: 'A02', person: '陈海燕', type: '无锡居民医保参保审核', amount: 460, status: 'approved', date: '2026-04-18' },
  { id: 'A03', person: '赵文静', type: '徐州灵活就业参保审核', amount: 6120, status: 'rejected', date: '2026-04-17' },
];

const initialOverdues: OverduePayment[] = [
  { id: 'O01', person: '朱建平', amount: 4680, dueDate: '2026-03-31', days: 18 },
  { id: 'O02', person: '姜美琴', amount: 460, dueDate: '2026-04-01', days: 17 },
  { id: 'O03', person: '许志鹏', amount: 6120, dueDate: '2026-03-28', days: 21 },
];

export default function PaymentManagement({ userAgency }: PaymentManagementProps) {
  const [activeTab, setActiveTab] = useState('standard');
  const [standards, setStandards] = useState<PaymentStandard[]>(initialStandards);
  const [audits, setAudits] = useState<PaymentAudit[]>(initialAudits);
  const [overdues, setOverdues] = useState<OverduePayment[]>(initialOverdues);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PaymentStandard | null>(null);
  const [formData, setFormData] = useState({ name: '', type: '职工', amount: 0 });
  const isProvince = getAgencyLevel(userAgency) === 'province';

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
    setStandards((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (editingItem) {
      setStandards((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item)));
    } else {
      setStandards((prev) => [...prev, { id: String(Date.now()), ...formData, status: 'active' }]);
    }
    setShowModal(false);
  };

  const handleAudit = (id: string, status: 'approved' | 'rejected') => {
    setAudits((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const handleRemind = (id: string) => {
    setOverdues((prev) => prev.filter((item) => item.id !== id));
    window.alert('催缴通知已发送');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'standard', label: '缴费标准' },
          { id: 'audit', label: '缴费核定' },
          { id: 'overdue', label: '催缴管理' },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-600 hover:text-gray-800'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'standard' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="搜索缴费标准..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4" />
            </div>
            {isProvince ? (
              <button onClick={handleAdd} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
                <Plus className="h-4 w-4" />
                新增标准
              </button>
            ) : (
              <div className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700">地市账号仅可查看筹资政策相关标准和记录</div>
            )}
          </div>
          <div className="rounded-lg border border-gray-200 bg-white">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">标准名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">金额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {standards.filter((item) => item.name.includes(searchTerm)).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.type}</td>
                    <td className="px-4 py-3 text-sm font-medium text-cyan-600">¥{item.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-1 text-xs ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {item.status === 'active' ? '启用' : '停用'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {isProvince && (
                          <>
                            <button onClick={() => handleEdit(item)} className="rounded p-1.5 text-gray-500 hover:bg-cyan-50 hover:text-cyan-600">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">参保人</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">审核事项</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">金额</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {audits.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.person}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-cyan-600">¥{item.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-1 text-xs ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.status === 'pending' ? '待审核' : item.status === 'approved' ? '已通过' : '已驳回'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {isProvince && item.status === 'pending' && (
                        <>
                          <button onClick={() => handleAudit(item.id, 'approved')} className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700">通过</button>
                          <button onClick={() => handleAudit(item.id, 'rejected')} className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700">驳回</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'overdue' && (
        <div className="rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">参保人</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">欠费金额</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">应缴日期</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">逾期天数</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {overdues.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.person}</td>
                  <td className="px-4 py-3 text-sm font-medium text-red-600">¥{item.amount}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.dueDate}</td>
                  <td className="px-4 py-3 text-sm text-orange-600">{item.days}天</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {isProvince && (
                        <button onClick={() => handleRemind(item.id)} className="flex items-center gap-1 rounded bg-orange-600 px-3 py-1.5 text-xs text-white hover:bg-orange-700">
                          <Bell className="h-3 w-3" />
                          发送催缴
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md rounded-xl bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">{editingItem ? '编辑' : '新增'}缴费标准</h3>
                <button onClick={() => setShowModal(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">标准名称</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">类型</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2">
                    <option>职工</option>
                    <option>居民</option>
                    <option>灵活就业</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">金额</label>
                  <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2">取消</button>
                <button onClick={handleSave} className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">保存</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
