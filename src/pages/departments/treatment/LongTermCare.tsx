import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, FileText, Clock, User, DollarSign, Edit2, Trash2, Eye, X } from 'lucide-react';

const tabs = [
  { id: 'assessment', label: '失能评估申请', icon: FileText },
  { id: 'service', label: '护理服务管理', icon: Clock },
  { id: 'institutions', label: '护理机构列表', icon: User },
  { id: 'payment', label: '待遇支付记录', icon: DollarSign },
  { id: 'query', label: '评估查询', icon: Search }
];

export default function LongTermCare() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [assessments, setAssessments] = useState([
    { id: 'A001', name: '参保人A', age: 78, status: '待评估', date: '2024-01-15', idCard: '11010119460101XXXX', address: '北京市朝阳区', contact: '13800138001' },
    { id: 'A002', name: '参保人B', age: 82, status: '已通过', date: '2024-01-14', idCard: '11010119420101XXXX', address: '北京市海淀区', contact: '13800138002' }
  ]);

  const [services, setServices] = useState([
    { id: 'S001', name: '参保人A', service: '日常护理', date: '2024-01-15', status: '进行中', nurse: '李护士', hours: 40 },
    { id: 'S002', name: '参保人B', service: '康复护理', date: '2024-01-14', status: '已完成', nurse: '王护士', hours: 60 }
  ]);

  const [institutions, setInstitutions] = useState([
    { id: 'I001', name: '阳光护理院', type: '定点机构', beds: 120, rating: 4.8, address: '北京市朝阳区阳光路1号', contact: '010-12345678' },
    { id: 'I002', name: '康乐养老中心', type: '定点机构', beds: 80, rating: 4.5, address: '北京市海淀区康乐路2号', contact: '010-87654321' }
  ]);

  const [payments, setPayments] = useState([
    { id: 'P001', name: '参保人A', amount: 2800, month: '2024-01', status: '已发放', bank: '工商银行', account: '6222****1234' },
    { id: 'P002', name: '参保人B', amount: 3200, month: '2024-01', status: '已发放', bank: '建设银行', account: '6227****5678' }
  ]);

  const [queryResult, setQueryResult] = useState<any>(null);

  const openModal = (type: 'add' | 'edit' | 'view', item?: any) => {
    setModalType(type);
    setSelectedItem(item || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = (id: string, type: string) => {
    if (type === 'assessment') setAssessments(prev => prev.filter(i => i.id !== id));
    if (type === 'service') setServices(prev => prev.filter(i => i.id !== id));
    if (type === 'institution') setInstitutions(prev => prev.filter(i => i.id !== id));
  };

  const handleQuery = () => {
    const result = assessments.find(a => a.name.includes(searchTerm) || a.id.includes(searchTerm));
    setQueryResult(result || { msg: '未找到相关记录' });
  };

  const renderModal = () => {
    if (!modalOpen) return null;
    const isView = modalType === 'view';
    const title = modalType === 'add' ? '新增' : modalType === 'edit' ? '编辑' : '查看';

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{title}{activeTab === 'assessment' ? '评估申请' : activeTab === 'service' ? '护理服务' : activeTab === 'institutions' ? '护理机构' : '支付记录'}</h3>
            <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            {activeTab === 'assessment' && (
              <>
                <div><label className="block text-sm font-medium mb-1">姓名</label><input type="text" defaultValue={selectedItem?.name || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">年龄</label><input type="number" defaultValue={selectedItem?.age || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">身份证号</label><input type="text" defaultValue={selectedItem?.idCard || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">联系电话</label><input type="text" defaultValue={selectedItem?.contact || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">地址</label><input type="text" defaultValue={selectedItem?.address || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
              </>
            )}
            {activeTab === 'service' && (
              <>
                <div><label className="block text-sm font-medium mb-1">服务对象</label><input type="text" defaultValue={selectedItem?.name || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">服务类型</label><input type="text" defaultValue={selectedItem?.service || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">护理人员</label><input type="text" defaultValue={selectedItem?.nurse || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">服务时长(小时)</label><input type="number" defaultValue={selectedItem?.hours || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
              </>
            )}
            {activeTab === 'institutions' && (
              <>
                <div><label className="block text-sm font-medium mb-1">机构名称</label><input type="text" defaultValue={selectedItem?.name || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">机构类型</label><input type="text" defaultValue={selectedItem?.type || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">床位数</label><input type="number" defaultValue={selectedItem?.beds || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">地址</label><input type="text" defaultValue={selectedItem?.address || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">联系电话</label><input type="text" defaultValue={selectedItem?.contact || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
              </>
            )}
            {activeTab === 'payment' && (
              <>
                <div><label className="block text-sm font-medium mb-1">姓名</label><input type="text" defaultValue={selectedItem?.name || ''} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" /></div>
                <div><label className="block text-sm font-medium mb-1">发放月份</label><input type="text" defaultValue={selectedItem?.month || ''} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" /></div>
                <div><label className="block text-sm font-medium mb-1">金额</label><input type="text" defaultValue={selectedItem?.amount || ''} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" /></div>
                <div><label className="block text-sm font-medium mb-1">开户银行</label><input type="text" defaultValue={selectedItem?.bank || ''} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" /></div>
                <div><label className="block text-sm font-medium mb-1">银行账号</label><input type="text" defaultValue={selectedItem?.account || ''} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" /></div>
              </>
            )}
          </div>
          {!isView && (
            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
              <button onClick={closeModal} className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'assessment':
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="搜索申请人姓名或编号" className="w-full pl-10 pr-4 py-2 border rounded-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"><Plus className="w-4 h-4" />新增申请</button>
            </div>
            <div className="bg-white rounded-lg border">
              <table className="w-full">
                <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium">编号</th><th className="px-4 py-3 text-left text-sm font-medium">姓名</th><th className="px-4 py-3 text-left text-sm font-medium">年龄</th><th className="px-4 py-3 text-left text-sm font-medium">日期</th><th className="px-4 py-3 text-left text-sm font-medium">状态</th><th className="px-4 py-3 text-left text-sm font-medium">操作</th></tr></thead>
                <tbody>{assessments.map((item) => (<tr key={item.id} className="border-t"><td className="px-4 py-3 text-sm">{item.id}</td><td className="px-4 py-3 text-sm">{item.name}</td><td className="px-4 py-3 text-sm">{item.age}岁</td><td className="px-4 py-3 text-sm">{item.date}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${item.status === '已通过' ? 'bg-green-100 text-green-700' : item.status === '待评估' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{item.status}</span></td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => openModal('view', item)} className="text-cyan-600 hover:underline"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-blue-600 hover:underline"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'assessment')} className="text-red-600 hover:underline"><Trash2 className="w-4 h-4" /></button></div></td></tr>))}</tbody>
              </table>
            </div>
          </div>
        );
      case 'service':
        return (
          <div className="space-y-4">
            <div className="flex justify-end"><button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"><Plus className="w-4 h-4" />新增服务</button></div>
            <div className="grid grid-cols-2 gap-4">{services.map((item) => (<div key={item.id} className="bg-white p-4 rounded-lg border"><div className="flex items-center justify-between mb-3"><h4 className="font-medium">{item.name}</h4><span className={`px-2 py-1 text-xs rounded-full ${item.status === '已完成' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.status}</span></div><p className="text-sm text-gray-600 mb-2">服务类型: {item.service}</p><p className="text-sm text-gray-500">护理人员: {item.nurse}</p><div className="flex gap-2 mt-3"><button onClick={() => openModal('view', item)} className="text-cyan-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-blue-600"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'service')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></div></div>))}</div>
          </div>
        );
      case 'institutions':
        return (
          <div className="space-y-4">
            <div className="flex justify-end"><button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"><Plus className="w-4 h-4" />新增机构</button></div>
            <div className="grid grid-cols-2 gap-4">{institutions.map((item) => (<div key={item.id} className="bg-white p-4 rounded-lg border"><div className="flex items-center justify-between mb-3"><h4 className="font-medium">{item.name}</h4><span className="px-2 py-1 text-xs bg-cyan-100 text-cyan-700 rounded-full">{item.type}</span></div><div className="text-sm text-gray-600 space-y-1"><p>床位: {item.beds}张 | 评分: {item.rating}分</p><p>地址: {item.address}</p><p>电话: {item.contact}</p></div><div className="flex gap-2 mt-3"><button onClick={() => openModal('view', item)} className="text-cyan-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-blue-600"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'institution')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></div></div>))}</div>
          </div>
        );
      case 'payment':
        return (
          <div className="bg-white rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium">姓名</th><th className="px-4 py-3 text-left text-sm font-medium">月份</th><th className="px-4 py-3 text-left text-sm font-medium">金额</th><th className="px-4 py-3 text-left text-sm font-medium">状态</th><th className="px-4 py-3 text-left text-sm font-medium">操作</th></tr></thead>
              <tbody>{payments.map((item) => (<tr key={item.id} className="border-t"><td className="px-4 py-3 text-sm">{item.name}</td><td className="px-4 py-3 text-sm">{item.month}</td><td className="px-4 py-3 text-sm text-cyan-600 font-medium">¥{item.amount}</td><td className="px-4 py-3"><span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">{item.status}</span></td><td className="px-4 py-3"><button onClick={() => openModal('view', item)} className="text-cyan-600 hover:underline">查看详情</button></td></tr>))}</tbody>
            </table>
          </div>
        );
      case 'query':
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <input type="text" placeholder="输入身份证号或评估编号" className="flex-1 px-4 py-2 border rounded-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button onClick={handleQuery} className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">查询</button>
            </div>
            {queryResult && (
              <div className="bg-white p-6 rounded-lg border">
                {queryResult.msg ? <p className="text-gray-500 text-center">{queryResult.msg}</p> : (
                  <div className="space-y-3">
                    <h4 className="font-bold text-lg">查询结果</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm"><p><span className="text-gray-500">姓名:</span> {queryResult.name}</p><p><span className="text-gray-500">年龄:</span> {queryResult.age}岁</p><p><span className="text-gray-500">状态:</span> {queryResult.status}</p><p><span className="text-gray-500">申请日期:</span> {queryResult.date}</p><p><span className="text-gray-500">身份证号:</span> {queryResult.idCard}</p><p><span className="text-gray-500">联系电话:</span> {queryResult.contact}</p></div>
                    <p className="text-sm"><span className="text-gray-500">地址:</span> {queryResult.address}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4"><span>待遇保障司</span><span>/</span><span className="text-gray-800">长期护理保险</span></div>
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'}`}>
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-h-[400px]">{renderContent()}</motion.div>
      {renderModal()}
    </div>
  );
}
