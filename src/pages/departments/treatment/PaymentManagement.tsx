import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Bell, X } from 'lucide-react';

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

const initialStandards: PaymentStandard[] = [
  { id: '1', name: '南京市职工医保月缴费基数上限', type: '职工', amount: 24396, status: 'active' },
  { id: '2', name: '南京市职工医保月缴费基数下限', type: '职工', amount: 4879, status: 'active' },
  { id: '3', name: '无锡市职工医保月缴费基数上限', type: '职工', amount: 23118, status: 'active' },
  { id: '4', name: '无锡市职工医保月缴费基数下限', type: '职工', amount: 4624, status: 'active' },
  { id: '5', name: '徐州市职工医保月缴费基数上限', type: '职工', amount: 21624, status: 'active' },
  { id: '6', name: '徐州市职工医保月缴费基数下限', type: '职工', amount: 4325, status: 'active' },
  { id: '7', name: '常州市职工医保月缴费基数上限', type: '职工', amount: 22785, status: 'active' },
  { id: '8', name: '常州市职工医保月缴费基数下限', type: '职工', amount: 4557, status: 'active' },
  { id: '9', name: '苏州市职工医保月缴费基数上限', type: '职工', amount: 24042, status: 'active' },
  { id: '10', name: '苏州市职工医保月缴费基数下限', type: '职工', amount: 4808, status: 'active' },
  { id: '11', name: '南通市职工医保月缴费基数上限', type: '职工', amount: 22041, status: 'active' },
  { id: '12', name: '南通市职工医保月缴费基数下限', type: '职工', amount: 4408, status: 'active' },
  { id: '13', name: '连云港市居民医保个人缴费标准', type: '居民', amount: 460, status: 'active' },
  { id: '14', name: '淮安市居民医保个人缴费标准', type: '居民', amount: 450, status: 'active' },
  { id: '15', name: '盐城市居民医保个人缴费标准', type: '居民', amount: 460, status: 'active' },
  { id: '16', name: '扬州市居民医保个人缴费标准', type: '居民', amount: 470, status: 'active' },
  { id: '17', name: '镇江市居民医保个人缴费标准', type: '居民', amount: 460, status: 'active' },
  { id: '18', name: '泰州市居民医保个人缴费标准', type: '居民', amount: 450, status: 'active' },
  { id: '19', name: '宿迁市居民医保个人缴费标准', type: '居民', amount: 440, status: 'active' },
  { id: '20', name: '灵活就业人员医疗保险年缴费参考标准', type: '灵活就业', amount: 6120, status: 'inactive' },
];

const initialAudits: PaymentAudit[] = [
  { id: 'A01', person: '王建国', type: '南京职工医保补缴审核', amount: 4680, status: 'pending', date: '2026-04-18' },
  { id: 'A02', person: '陈海燕', type: '无锡居民医保参保审核', amount: 460, status: 'approved', date: '2026-04-18' },
  { id: 'A03', person: '赵文静', type: '徐州灵活就业参保审核', amount: 6120, status: 'pending', date: '2026-04-17' },
  { id: 'A04', person: '周明辉', type: '常州职工医保单位核定', amount: 9360, status: 'approved', date: '2026-04-17' },
  { id: 'A05', person: '孙晓梅', type: '苏州居民医保补缴审核', amount: 470, status: 'rejected', date: '2026-04-17' },
  { id: 'A06', person: '钱志强', type: '南通职工医保补缴审核', amount: 4680, status: 'pending', date: '2026-04-16' },
  { id: 'A07', person: '李桂芳', type: '连云港居民医保减免审核', amount: 460, status: 'approved', date: '2026-04-16' },
  { id: 'A08', person: '顾晨阳', type: '淮安灵活就业参保审核', amount: 6120, status: 'pending', date: '2026-04-15' },
  { id: 'A09', person: '唐雪梅', type: '盐城居民医保补贴审核', amount: 450, status: 'approved', date: '2026-04-15' },
  { id: 'A10', person: '郑宏伟', type: '扬州职工医保基数调整', amount: 5280, status: 'pending', date: '2026-04-15' },
  { id: 'A11', person: '谢丽华', type: '镇江居民医保参保审核', amount: 460, status: 'approved', date: '2026-04-14' },
  { id: 'A12', person: '龚立新', type: '泰州职工医保欠费核销', amount: 4860, status: 'pending', date: '2026-04-14' },
  { id: 'A13', person: '韩玉兰', type: '宿迁居民医保补缴审核', amount: 440, status: 'pending', date: '2026-04-13' },
  { id: 'A14', person: '蒋伟东', type: '南京居民医保参保审核', amount: 470, status: 'approved', date: '2026-04-13' },
  { id: 'A15', person: '魏春梅', type: '苏州职工医保转入审核', amount: 4680, status: 'pending', date: '2026-04-12' },
  { id: 'A16', person: '彭晓峰', type: '无锡职工医保补缴情形复核', amount: 5020, status: 'rejected', date: '2026-04-12' },
  { id: 'A17', person: '罗静', type: '常州居民医保资助审核', amount: 450, status: 'approved', date: '2026-04-11' },
  { id: 'A18', person: '贺家成', type: '南通灵活就业缴费核定', amount: 6120, status: 'pending', date: '2026-04-11' },
  { id: 'A19', person: '邱丽娟', type: '镇江居民医保停保审核', amount: 460, status: 'approved', date: '2026-04-10' },
  { id: 'A20', person: '梁志勇', type: '宿迁职工医保补缴情形审核', amount: 4860, status: 'pending', date: '2026-04-10' },
];

const initialOverdues: OverduePayment[] = [
  { id: 'O01', person: '朱建平', amount: 4680, dueDate: '2026-03-31', days: 18 },
  { id: 'O02', person: '姜美玲', amount: 460, dueDate: '2026-04-01', days: 17 },
  { id: 'O03', person: '许志鹏', amount: 6120, dueDate: '2026-03-28', days: 21 },
  { id: 'O04', person: '严春花', amount: 470, dueDate: '2026-04-02', days: 16 },
  { id: 'O05', person: '戴国强', amount: 4860, dueDate: '2026-03-30', days: 19 },
  { id: 'O06', person: '陶慧', amount: 450, dueDate: '2026-04-03', days: 15 },
  { id: 'O07', person: '盛志明', amount: 5020, dueDate: '2026-03-27', days: 22 },
  { id: 'O08', person: '黄玉琴', amount: 460, dueDate: '2026-04-04', days: 14 },
  { id: 'O09', person: '蔡俊峰', amount: 4680, dueDate: '2026-03-29', days: 20 },
  { id: 'O10', person: '陆春燕', amount: 440, dueDate: '2026-04-05', days: 13 },
  { id: 'O11', person: '马金海', amount: 6120, dueDate: '2026-03-25', days: 24 },
  { id: 'O12', person: '袁雪梅', amount: 460, dueDate: '2026-04-06', days: 12 },
  { id: 'O13', person: '孟祥东', amount: 4860, dueDate: '2026-03-26', days: 23 },
  { id: 'O14', person: '顾海霞', amount: 470, dueDate: '2026-04-07', days: 11 },
  { id: 'O15', person: '范立群', amount: 4680, dueDate: '2026-03-24', days: 25 },
  { id: 'O16', person: '谢晓丽', amount: 450, dueDate: '2026-04-08', days: 10 },
  { id: 'O17', person: '褚建华', amount: 6120, dueDate: '2026-03-23', days: 26 },
  { id: 'O18', person: '邵美英', amount: 460, dueDate: '2026-04-09', days: 9 },
  { id: 'O19', person: '任宏伟', amount: 4860, dueDate: '2026-03-22', days: 27 },
  { id: 'O20', person: '倪晓红', amount: 440, dueDate: '2026-04-10', days: 8 },
];

export default function PaymentManagement() {
  const [activeTab, setActiveTab] = useState('standard');
  const [standards, setStandards] = useState<PaymentStandard[]>(initialStandards);
  const [audits, setAudits] = useState<PaymentAudit[]>(initialAudits);
  const [overdues, setOverdues] = useState<OverduePayment[]>(initialOverdues);
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
    setStandards(standards.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    if (editingItem) {
      setStandards(standards.map((s) => (s.id === editingItem.id ? { ...s, ...formData } : s)));
    } else {
      setStandards([...standards, { id: String(Date.now()), ...formData, status: 'active' }]);
    }
    setShowModal(false);
  };

  const handleAudit = (id: string, status: 'approved' | 'rejected') => {
    setAudits(audits.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const handleRemind = (id: string) => {
    setOverdues(overdues.filter((o) => o.id !== id));
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
            {standards.filter((s) => s.name.includes(searchTerm)).map((item) => (
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
        <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">参保人</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">审核事项</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">金额</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th><th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th></tr></thead>
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
                <div><label className="block text-sm font-medium text-gray-700 mb-1">类型</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg"><option>职工</option><option>居民</option><option>灵活就业</option></select></div>
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
