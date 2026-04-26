import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, Search, CheckCircle, Clock, BarChart3, X, Plus, Edit2, Trash2, Eye } from 'lucide-react';

const tabs = [
  { id: 'accept', label: '举报受理', icon: Phone },
  { id: 'handle', label: '投诉处理', icon: MessageSquare },
  { id: 'verify', label: '线索核查', icon: Search },
  { id: 'reply', label: '反馈回复', icon: CheckCircle },
  { id: 'stats', label: '统计分析', icon: BarChart3 }
];

export default function ComplaintManagement() {
  const [activeTab, setActiveTab] = useState('accept');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [acceptData, setAcceptData] = useState([
    { id: 'JB001', type: '欺诈骗保', content: '某医院虚开药品', reporter: '参保人A', phone: '138****1234', status: '待受理', date: '2024-01-15' },
    { id: 'JB002', type: '违规收费', content: '某诊所超标准收费', reporter: '参保人B', phone: '139****5678', status: '已受理', date: '2024-01-14' }
  ]);

  const [handleData, setHandleData] = useState([
    { id: 'TS001', complainant: '参保人A', content: '报销被拒', type: '待遇争议', handler: '王经办', status: '处理中', date: '2024-01-13' }
  ]);

  const [verifyData, setVerifyData] = useState([
    { id: 'XS001', clue: '异常住院数据', source: '智能监控', priority: '高', status: '核查中', date: '2024-01-12' }
  ]);

  const [replyData, setReplyData] = useState([
    { id: 'FK001', title: '投诉处理结果', recipient: '参保人B', content: '经核实...', status: '已回复', date: '2024-01-11' }
  ]);

  const openModal = (type: 'add' | 'edit' | 'view', item?: any) => {
    setModalType(type);
    setSelectedItem(item || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'accept') setAcceptData(prev => prev.filter(i => i.id !== id));
    if (activeTab === 'handle') setHandleData(prev => prev.filter(i => i.id !== id));
    if (activeTab === 'verify') setVerifyData(prev => prev.filter(i => i.id !== id));
    if (activeTab === 'reply') setReplyData(prev => prev.filter(i => i.id !== id));
  };

  const renderAcceptModal = () => (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium mb-1">举报类型</label><select className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.type || ''}><option>欺诈骗保</option><option>违规收费</option><option>虚假住院</option></select></div>
      <div><label className="block text-sm font-medium mb-1">举报内容</label><textarea className="w-full border rounded-lg px-3 py-2" rows={3} defaultValue={selectedItem?.content || ''} /></div>
      <div><label className="block text-sm font-medium mb-1">举报人</label><input className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.reporter || ''} /></div>
      <div><label className="block text-sm font-medium mb-1">联系电话</label><input className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.phone || ''} /></div>
    </div>
  );

  const renderHandleModal = () => (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium mb-1">投诉人</label><input className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.complainant || ''} /></div>
      <div><label className="block text-sm font-medium mb-1">投诉内容</label><textarea className="w-full border rounded-lg px-3 py-2" rows={3} defaultValue={selectedItem?.content || ''} /></div>
      <div><label className="block text-sm font-medium mb-1">投诉类型</label><select className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.type || ''}><option>待遇争议</option><option>服务态度</option><option>报销问题</option></select></div>
      <div><label className="block text-sm font-medium mb-1">经办人</label><input className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.handler || ''} /></div>
    </div>
  );

  const renderVerifyModal = () => (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium mb-1">线索描述</label><textarea className="w-full border rounded-lg px-3 py-2" rows={3} defaultValue={selectedItem?.clue || ''} /></div>
      <div><label className="block text-sm font-medium mb-1">线索来源</label><select className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.source || ''}><option>智能监控</option><option>举报投诉</option><option>飞行检查</option></select></div>
      <div><label className="block text-sm font-medium mb-1">优先级</label><select className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.priority || '中'}><option>高</option><option>中</option><option>低</option></select></div>
    </div>
  );

  const renderReplyModal = () => (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium mb-1">回复标题</label><input className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.title || ''} /></div>
      <div><label className="block text-sm font-medium mb-1">接收人</label><input className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.recipient || ''} /></div>
      <div><label className="block text-sm font-medium mb-1">回复内容</label><textarea className="w-full border rounded-lg px-3 py-2" rows={4} defaultValue={selectedItem?.content || ''} /></div>
    </div>
  );

  const renderModalContent = () => {
    if (modalType === 'view') {
      return (
        <div className="space-y-3">
          {selectedItem && Object.entries(selectedItem).map(([key, val]) => (
            <div key={key} className="flex justify-between py-2 border-b"><span className="text-gray-500">{key}</span><span>{String(val)}</span></div>
          ))}
        </div>
      );
    }
    switch (activeTab) {
      case 'accept': return renderAcceptModal();
      case 'handle': return renderHandleModal();
      case 'verify': return renderVerifyModal();
      case 'reply': return renderReplyModal();
      default: return null;
    }
  };

  const renderContent = () => {
    const data = activeTab === 'accept' ? acceptData : activeTab === 'handle' ? handleData : activeTab === 'verify' ? verifyData : activeTab === 'reply' ? replyData : [];
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <input type="text" placeholder="搜索关键词..." className="flex-1 px-4 py-2 border rounded-lg" />
          <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"><Plus className="w-4 h-4" />新增</button>
        </div>
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">编号</th>
                <th className="px-4 py-3 text-left text-sm font-medium">内容</th>
                <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                <th className="px-4 py-3 text-left text-sm font-medium">日期</th>
                <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{item.id}</td>
                  <td className="px-4 py-3 text-sm">{item.content || item.clue || item.title}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded ${item.status === '已受理' || item.status === '已回复' || item.status === '已完成' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openModal('view', item)} className="p-1 text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => openModal('edit', item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-800">举报投诉管理</h2></div>
      <div className="flex gap-2 border-b">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'}`}>
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {activeTab === 'stats' ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border"><p className="text-gray-500">本月受理</p><p className="text-2xl font-bold text-cyan-600">156</p></div>
            <div className="bg-white p-4 rounded-lg border"><p className="text-gray-500">已办结</p><p className="text-2xl font-bold text-green-600">142</p></div>
            <div className="bg-white p-4 rounded-lg border"><p className="text-gray-500">办结率</p><p className="text-2xl font-bold text-blue-600">91%</p></div>
          </div>
        ) : renderContent()}
      </motion.div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{modalType === 'add' ? '新增' : modalType === 'edit' ? '编辑' : '查看'}{tabs.find(t => t.id === activeTab)?.label}</h3>
                <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
              </div>
              {renderModalContent()}
              {modalType !== 'view' && (
                <div className="flex gap-3 mt-6">
                  <button onClick={closeModal} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">取消</button>
                  <button onClick={closeModal} className="flex-1 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
