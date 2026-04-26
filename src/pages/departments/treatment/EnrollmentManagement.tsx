import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, Plus, Edit2, ArrowRightLeft, FileText, X, CheckCircle } from 'lucide-react';

interface Enrollment {
  id: string;
  name: string;
  idCard: string;
  type: '个人' | '单位';
  status: '正常' | '暂停';
  date: string;
  region: string;
  phone?: string;
  address?: string;
}

const mockData: Enrollment[] = [
  { id: '1', name: '参保人A', idCard: '110101199001011234', type: '个人', status: '正常', date: '2024-01-15', region: '北京市', phone: '138****0001', address: '北京市朝阳区' },
  { id: '2', name: 'ABC科技有限公司', idCard: '91110000123456789X', type: '单位', status: '正常', date: '2024-02-20', region: '上海市', phone: '010****1234', address: '上海市浦东新区' },
  { id: '3', name: '参保人B', idCard: '310101198505056789', type: '个人', status: '暂停', date: '2023-12-10', region: '广州市', phone: '139****0002', address: '广州市天河区' },
];

export default function EnrollmentManagement() {
  const [activeTab, setActiveTab] = useState('register');
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockData);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view' | 'transfer'>('add');
  const [selectedItem, setSelectedItem] = useState<Enrollment | null>(null);
  const [formData, setFormData] = useState({ name: '', idCard: '', type: '个人', region: '北京市', phone: '', address: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  const tabs = [
    { id: 'register', label: '参保登记', icon: Plus },
    { id: 'change', label: '信息变更', icon: Edit2 },
    { id: 'transfer', label: '关系转移', icon: ArrowRightLeft },
    { id: 'query', label: '参保查询', icon: Search },
  ];

  const filteredData = enrollments.filter(item =>
    item.name.includes(searchQuery) || item.idCard.includes(searchQuery)
  );

  const handleSubmit = () => {
    if (modalType === 'add') {
      const newItem: Enrollment = {
        id: String(enrollments.length + 1),
        name: formData.name,
        idCard: formData.idCard,
        type: formData.type as '个人' | '单位',
        status: '正常',
        date: new Date().toISOString().split('T')[0],
        region: formData.region,
        phone: formData.phone,
        address: formData.address,
      };
      setEnrollments([...enrollments, newItem]);
    } else if (modalType === 'edit' && selectedItem) {
      setEnrollments(enrollments.map(i => i.id === selectedItem.id ? { ...i, ...formData } : i));
    }
    setShowModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const openModal = (type: 'add' | 'edit' | 'view' | 'transfer', item?: Enrollment) => {
    setModalType(type);
    setSelectedItem(item || null);
    setFormData(item ? { name: item.name, idCard: item.idCard, type: item.type, region: item.region, phone: item.phone || '', address: item.address || '' } : { name: '', idCard: '', type: '个人', region: '北京市', phone: '', address: '' });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">参保管理</h2>
        {activeTab === 'register' && (
          <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
            <Plus className="w-4 h-4" /> 新增登记
          </button>
        )}
      </div>

      <div className="flex gap-2 bg-white p-2 rounded-lg border border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-cyan-100 text-cyan-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {(activeTab === 'query' || activeTab === 'change' || activeTab === 'transfer') && (
        <div className="flex gap-4 bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" placeholder="搜索姓名、身份证号..." />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" /> 筛选
          </button>
        </div>
      )}

      {activeTab === 'register' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className="block text-sm text-gray-600 mb-1">参保类型</label><select className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option>个人参保</option><option>单位参保</option></select></div>
            <div><label className="block text-sm text-gray-600 mb-1">姓名/单位名称</label><input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="请输入" /></div>
            <div><label className="block text-sm text-gray-600 mb-1">身份证号/统一社会信用代码</label><input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="请输入" /></div>
            <div><label className="block text-sm text-gray-600 mb-1">参保地区</label><select className="w-full px-3 py-2 border border-gray-300 rounded-lg"><option>北京市</option><option>上海市</option><option>广州市</option></select></div>
          </div>
          <div className="flex justify-end gap-2">
            <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">重置</button>
            <button onClick={() => openModal('add')} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">提交登记</button>
          </div>
        </motion.div>
      )}

      {(activeTab === 'query' || activeTab === 'change' || activeTab === 'transfer') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">参保编号</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">姓名/单位</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">身份证号</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">类型</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">参保日期</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{item.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.idCard}</td>
                  <td className="px-4 py-3 text-sm"><span className={`px-2 py-1 rounded text-xs ${item.type === '个人' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{item.type}</span></td>
                  <td className="px-4 py-3 text-sm"><span className={`px-2 py-1 rounded text-xs ${item.status === '正常' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{item.status}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.date}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      {activeTab === 'query' && <button onClick={() => openModal('view', item)} className="text-cyan-600 hover:text-cyan-700">查看</button>}
                      {activeTab === 'change' && <button onClick={() => openModal('edit', item)} className="text-amber-600 hover:text-amber-700">变更</button>}
                      {activeTab === 'transfer' && <button onClick={() => openModal('transfer', item)} className="text-blue-600 hover:text-blue-700">转移</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl w-full max-w-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{modalType === 'add' ? '参保登记' : modalType === 'edit' ? '信息变更' : modalType === 'transfer' ? '关系转移' : '参保详情'}</h3>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
              </div>
              {modalType === 'view' && selectedItem ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4"><div><label className="text-sm text-gray-500">姓名</label><p className="font-medium">{selectedItem.name}</p></div><div><label className="text-sm text-gray-500">身份证号</label><p className="font-medium">{selectedItem.idCard}</p></div></div>
                  <div className="grid grid-cols-2 gap-4"><div><label className="text-sm text-gray-500">参保类型</label><p className="font-medium">{selectedItem.type}</p></div><div><label className="text-sm text-gray-500">参保状态</label><p className="font-medium">{selectedItem.status}</p></div></div>
                  <div className="grid grid-cols-2 gap-4"><div><label className="text-sm text-gray-500">联系电话</label><p className="font-medium">{selectedItem.phone}</p></div><div><label className="text-sm text-gray-500">参保地区</label><p className="font-medium">{selectedItem.region}</p></div></div>
                  <div><label className="text-sm text-gray-500">地址</label><p className="font-medium">{selectedItem.address}</p></div>
                </div>
              ) : modalType === 'transfer' && selectedItem ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg"><p className="text-sm text-gray-600">当前参保人：{selectedItem.name}</p><p className="text-sm text-gray-600">当前参保地：{selectedItem.region}</p></div>
                  <div><label className="block text-sm font-medium mb-1">转入地区</label><select className="w-full px-3 py-2 border rounded-lg"><option>北京市</option><option>上海市</option><option>广州市</option></select></div>
                  <div><label className="block text-sm font-medium mb-1">转移原因</label><textarea className="w-full px-3 py-2 border rounded-lg" rows={3} placeholder="请输入转移原因" /></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">姓名/单位</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">身份证号</label><input type="text" value={formData.idCard} onChange={(e) => setFormData({ ...formData, idCard: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div></div>
                  <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">参保类型</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option>个人</option><option>单位</option></select></div><div><label className="block text-sm font-medium mb-1">参保地区</label><select value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option>北京市</option><option>上海市</option><option>广州市</option></select></div></div>
                  <div><label className="block text-sm font-medium mb-1">联系电话</label><input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">地址</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                </div>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">取消</button>
                {modalType !== 'view' && <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">操作成功</h3>
              <p className="text-gray-600">数据已保存</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
