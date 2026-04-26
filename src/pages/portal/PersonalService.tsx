import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CreditCard, Users, Globe, Calculator, MessageSquare, Clock, X, Plus, Trash2, Eye } from 'lucide-react';

const tabs = [
  { id: 'rights', label: '权益记录', icon: User },
  { id: 'card', label: '电子凭证', icon: CreditCard },
  { id: 'family', label: '家庭共济', icon: Users },
  { id: 'remote', label: '异地就医', icon: Globe },
  { id: 'progress', label: '报销进度', icon: Clock },
  { id: 'calc', label: '待遇测算', icon: Calculator },
  { id: 'feedback', label: '投诉建议', icon: MessageSquare }
];

interface FamilyMember {
  id: string;
  name: string;
  idCard: string;
  relation: string;
  status: string;
}

interface RemoteRecord {
  id: string;
  location: string;
  type: string;
  startDate: string;
  status: '有效' | '已过期';
}

interface Feedback {
  id: string;
  content: string;
  status: string;
  date: string;
  reply?: string;
}

interface ProgressItem {
  id: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  hospital?: string;
}

export default function PersonalService() {
  const [activeTab, setActiveTab] = useState('rights');
  const [rating, setRating] = useState(0);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: '1', name: '王雅静', idCard: '320102198906153428', relation: '配偶', status: '已绑定' }
  ]);
  const [remoteRecords, setRemoteRecords] = useState<RemoteRecord[]>([
    { id: 'YD001', location: '北京市', type: '长期异地居住', startDate: '2024-03-15', status: '有效' }
  ]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    { id: '1', content: '报销流程优化建议', status: '已回复', date: '2024-03-10', reply: '感谢您的建议，我们会持续优化线上办理流程。' }
  ]);
  const [progressData] = useState<ProgressItem[]>([
    { id: '1', type: '门诊报销', amount: 320, status: '审核中', date: '2024-03-15', hospital: '南京市第一医院' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    idCard: '',
    relation: '配偶',
    location: '北京市',
    type: '长期异地居住',
    content: '',
    date: ''
  });

  const handleAddFamily = () => {
    setModalType('addFamily');
    setFormData({ ...formData, name: '', idCard: '', relation: '配偶' });
    setShowModal(true);
  };

  const handleDeleteFamily = (id: string) => {
    setFamilyMembers(familyMembers.filter((f) => f.id !== id));
  };

  const handleSubmitFamily = () => {
    if (!formData.name.trim() || !formData.idCard.trim()) {
      alert('姓名和身份证号不能为空');
      return;
    }

    setFamilyMembers([
      ...familyMembers,
      {
        id: String(familyMembers.length + 1),
        name: formData.name.trim(),
        idCard: formData.idCard.trim(),
        relation: formData.relation,
        status: '已绑定'
      }
    ]);
    setShowModal(false);
  };

  const handleViewFamily = (member: FamilyMember) => {
    setCurrentItem(member);
    setModalType('viewFamily');
    setShowModal(true);
  };

  const handleAddRemote = () => {
    setModalType('addRemote');
    setFormData({ ...formData, location: '北京市', type: '长期异地居住', date: '' });
    setShowModal(true);
  };

  const handleSubmitRemote = () => {
    setRemoteRecords([
      ...remoteRecords,
      {
        id: `YD${String(remoteRecords.length + 1).padStart(3, '0')}`,
        location: formData.location,
        type: formData.type,
        startDate: formData.date,
        status: '有效'
      }
    ]);
    setShowModal(false);
  };

  const handleSubmitFeedback = () => {
    setFeedbacks([
      ...feedbacks,
      {
        id: String(feedbacks.length + 1),
        content: formData.content,
        status: '待回复',
        date: new Date().toISOString().split('T')[0]
      }
    ]);
    setFormData({ ...formData, content: '' });
    alert('建议已提交');
  };

  const handleViewProgress = (item: ProgressItem) => {
    setCurrentItem(item);
    setModalType('viewProgress');
    setShowModal(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'rights':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border"><p className="text-sm text-gray-500">账户余额</p><p className="text-2xl font-bold text-cyan-600">12,560元</p></div>
              <div className="bg-white p-5 rounded-xl border"><p className="text-sm text-gray-500">累计缴费</p><p className="text-2xl font-bold text-blue-600">85,600元</p></div>
              <div className="bg-white p-5 rounded-xl border"><p className="text-sm text-gray-500">缴费年限</p><p className="text-2xl font-bold text-green-600">8年</p></div>
            </div>
          </div>
        );
      case 'card':
        return (
          <div className="bg-white rounded-xl border p-6">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
              <p className="text-sm opacity-80">医保电子凭证</p>
              <p className="text-xl font-bold mt-1">参保人</p>
              <p className="text-sm mt-2">110101********1234</p>
            </div>
          </div>
        );
      case 'family':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">家庭成员</h3>
                <button onClick={handleAddFamily} className="px-3 py-1 bg-cyan-600 text-white rounded text-sm flex items-center gap-1"><Plus className="w-4 h-4" />添加</button>
              </div>
              <div className="space-y-2">
                {familyMembers.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{f.name}</span>
                      <span className="text-sm text-gray-500 ml-2">{f.relation}</span>
                      <p className="text-xs text-gray-500 mt-1">{f.idCard}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleViewFamily(f)} className="p-1 text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                      <span className="text-sm text-gray-500">{f.status}</span>
                      <button onClick={() => handleDeleteFamily(f.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'remote':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-medium mb-4">异地就医备案申请</h3>
              <div className="space-y-3">
                <div><label className="text-sm text-gray-600">就医地</label><select className="w-full mt-1 p-2 border rounded" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}><option>北京市</option><option>上海市</option><option>广州市</option></select></div>
                <div><label className="text-sm text-gray-600">备案类型</label><select className="w-full mt-1 p-2 border rounded" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}><option>长期异地居住</option><option>临时外出就医</option><option>异地转诊</option></select></div>
                <div><label className="text-sm text-gray-600">开始日期</label><input type="date" className="w-full mt-1 p-2 border rounded" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} /></div>
                <button onClick={handleSubmitRemote} className="w-full py-2 bg-cyan-600 text-white rounded">提交备案</button>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-medium mb-3">我的备案记录</h3>
              <div className="space-y-2">
                {remoteRecords.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div><span className="text-sm font-medium">{r.location}</span><span className="text-xs text-gray-500 ml-2">{r.type}</span></div>
                    <span className={`px-2 py-1 text-xs rounded ${r.status === '有效' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'progress':
        return (
          <div className="bg-white rounded-xl border">
            <table className="w-full">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">类型</th><th className="px-4 py-3 text-left text-sm">金额</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-left text-sm">操作</th></tr></thead>
              <tbody>{progressData.map((item) => (<tr key={item.id} className="border-t"><td className="px-4 py-3 text-sm">{item.type}</td><td className="px-4 py-3 text-sm">{item.amount}元</td><td className="px-4 py-3"><span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">{item.status}</span></td><td className="px-4 py-3"><button onClick={() => handleViewProgress(item)} className="text-cyan-600 text-sm">查看</button></td></tr>))}</tbody>
            </table>
          </div>
        );
      case 'calc':
        return (
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-medium mb-4">待遇测算</h3>
            <div className="space-y-3">
              <div><label className="text-sm text-gray-600">就诊类型</label><select className="w-full mt-1 p-2 border rounded"><option>门诊</option><option>住院</option></select></div>
              <div><label className="text-sm text-gray-600">预计费用</label><input type="number" className="w-full mt-1 p-2 border rounded" placeholder="输入金额" /></div>
              <div className="p-3 bg-gray-50 rounded"><p className="text-sm text-gray-600">预计报销</p><p className="text-xl font-bold text-green-600">0元</p></div>
            </div>
          </div>
        );
      case 'feedback':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-medium mb-3">提交建议</h3>
              <textarea className="w-full p-2 border rounded h-24" placeholder="请输入您的建议..." value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}></textarea>
              <button onClick={handleSubmitFeedback} className="mt-2 px-4 py-2 bg-cyan-600 text-white rounded">提交</button>
            </div>
            <div className="bg-white rounded-xl border p-4">
              <h3 className="font-medium mb-3">满意度评价</h3>
              <div className="flex gap-1">{[1, 2, 3, 4, 5].map((i) => (<button key={i} onClick={() => setRating(i)} className={`text-2xl ${rating >= i ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>))}</div>
            </div>
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b"><h3 className="font-medium">我的反馈</h3></div>
              {feedbacks.map((item) => (<div key={item.id} className="p-4 border-t"><p className="text-sm">{item.content}</p><div className="flex justify-between mt-2 text-xs text-gray-500"><span>{item.date}</span><span className="text-green-600">{item.status}</span></div>{item.reply && <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded">回复：{item.reply}</p>}</div>))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">个人服务大厅</h2>
      <div className="flex gap-2 border-b border-gray-200">{tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600'}`}><tab.icon className="w-4 h-4" />{tab.label}</button>))}</div>
      <AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{renderContent()}</motion.div></AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{modalType === 'addFamily' ? '添加家庭成员' : modalType === 'viewFamily' ? '家庭成员详情' : modalType === 'viewProgress' ? '报销进度详情' : '备案详情'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            {modalType === 'addFamily' ? (
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">姓名</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">身份证号</label><input type="text" value={formData.idCard} onChange={(e) => setFormData({ ...formData, idCard: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">关系</label><select value={formData.relation} onChange={(e) => setFormData({ ...formData, relation: e.target.value })} className="w-full px-3 py-2 border rounded-lg"><option>配偶</option><option>子女</option><option>父母</option></select></div>
                <div className="flex justify-end gap-2"><button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">取消</button><button onClick={handleSubmitFamily} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">添加</button></div>
              </div>
            ) : modalType === 'viewFamily' && currentItem ? (
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-500">姓名</span><span>{currentItem.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">身份证号</span><span>{currentItem.idCard}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">关系</span><span>{currentItem.relation}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">绑定状态</span><span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">{currentItem.status}</span></div>
              </div>
            ) : modalType === 'viewProgress' && currentItem ? (
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-500">类型</span><span>{currentItem.type}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">金额</span><span className="font-medium">{currentItem.amount}元</span></div>
                <div className="flex justify-between"><span className="text-gray-500">医院</span><span>{currentItem.hospital}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">状态</span><span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">{currentItem.status}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">日期</span><span>{currentItem.date}</span></div>
              </div>
            ) : null}
          </motion.div>
        </div>
      )}
    </div>
  );
}
