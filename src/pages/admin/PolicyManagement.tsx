import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, BookOpen, BarChart3, XCircle, Plus, Eye, Edit, Trash2, X, CheckCircle } from 'lucide-react';

interface Policy {
  id: string;
  title: string;
  type: string;
  date: string;
  status: '生效中' | '已废止' | '待发布';
  views: number;
  content?: string;
}

interface Interpretation {
  id: string;
  policy: string;
  title: string;
  author: string;
  date: string;
  content?: string;
}

const tabs = [
  { id: 'publish', label: '政策发布', icon: FileText },
  { id: 'interpret', label: '政策解读', icon: BookOpen },
  { id: 'evaluate', label: '效果评估', icon: BarChart3 },
  { id: 'revoke', label: '政策废止', icon: XCircle }
];

export default function PolicyManagement() {
  const [activeTab, setActiveTab] = useState('publish');
  const [policies, setPolicies] = useState<Policy[]>([
    { id: 'POL-001', title: '门诊共济保障机制', type: '待遇政策', date: '2024-01-01', status: '生效中', views: 12560, content: '政策内容详情...' },
    { id: 'POL-002', title: 'DRG付费改革推进方案', type: '支付政策', date: '2024-02-01', status: '生效中', views: 8920, content: '政策内容详情...' }
  ]);
  const [interpretations, setInterpretations] = useState<Interpretation[]>([
    { id: 'INT-001', policy: '门诊共济保障机制', title: '政策解读：门诊共济如何惠及参保人', author: '待遇保障司', date: '2024-01-05', content: '解读内容...' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '待遇政策',
    content: '',
    policy: ''
  });

  const handleAdd = () => {
    setModalType('add');
    setCurrentItem(null);
    setFormData({ title: '', type: '待遇政策', content: '', policy: '' });
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setModalType('edit');
    setCurrentItem(item);
    if (activeTab === 'publish' || activeTab === 'revoke') {
      setFormData({
        title: item.title,
        type: item.type,
        content: item.content || '',
        policy: ''
      });
    } else {
      setFormData({
        title: item.title,
        type: '',
        content: item.content || '',
        policy: item.policy
      });
    }
    setShowModal(true);
  };

  const handleView = (item: any) => {
    setModalType('view');
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'publish' || activeTab === 'revoke') {
      setPolicies(policies.filter(p => p.id !== id));
    } else {
      setInterpretations(interpretations.filter(i => i.id !== id));
    }
  };

  const handleRevoke = (id: string) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, status: '已废止' as const } : p));
  };

  const handleSubmit = () => {
    if (activeTab === 'publish' || activeTab === 'revoke') {
      if (modalType === 'add') {
        const newPolicy: Policy = {
          id: `POL-${String(policies.length + 1).padStart(3, '0')}`,
          title: formData.title,
          type: formData.type,
          date: new Date().toISOString().split('T')[0],
          status: '生效中',
          views: 0,
          content: formData.content
        };
        setPolicies([...policies, newPolicy]);
      } else {
        setPolicies(policies.map(p => p.id === currentItem.id ? { ...p, ...formData } : p));
      }
    } else {
      if (modalType === 'add') {
        const newInterpretation: Interpretation = {
          id: `INT-${String(interpretations.length + 1).padStart(3, '0')}`,
          policy: formData.policy,
          title: formData.title,
          author: '待遇保障司',
          date: new Date().toISOString().split('T')[0],
          content: formData.content
        };
        setInterpretations([...interpretations, newInterpretation]);
      } else {
        setInterpretations(interpretations.map(i => i.id === currentItem.id ? { ...i, ...formData } : i));
      }
    }
    setShowModal(false);
  };

  const renderPublish = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />发布政策
        </button>
      </div>
      <table className="w-full bg-white rounded-xl border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm">政策编号</th>
            <th className="px-4 py-3 text-left text-sm">标题</th>
            <th className="px-4 py-3 text-left text-sm">类型</th>
            <th className="px-4 py-3 text-left text-sm">发布日期</th>
            <th className="px-4 py-3 text-left text-sm">状态</th>
            <th className="px-4 py-3 text-left text-sm">操作</th>
          </tr>
        </thead>
        <tbody>
          {policies.filter(p => p.status === '生效中').map(p => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{p.id}</td>
              <td className="px-4 py-3 text-sm font-medium">{p.title}</td>
              <td className="px-4 py-3 text-sm">{p.type}</td>
              <td className="px-4 py-3 text-sm">{p.date}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">{p.status}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button onClick={() => handleView(p)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleEdit(p)} className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleRevoke(p.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><XCircle className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderInterpret = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />添加解读
        </button>
      </div>
      <table className="w-full bg-white rounded-xl border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm">关联政策</th>
            <th className="px-4 py-3 text-left text-sm">解读标题</th>
            <th className="px-4 py-3 text-left text-sm">发布单位</th>
            <th className="px-4 py-3 text-left text-sm">日期</th>
            <th className="px-4 py-3 text-left text-sm">操作</th>
          </tr>
        </thead>
        <tbody>
          {interpretations.map(i => (
            <tr key={i.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{i.policy}</td>
              <td className="px-4 py-3 text-sm font-medium">{i.title}</td>
              <td className="px-4 py-3 text-sm">{i.author}</td>
              <td className="px-4 py-3 text-sm">{i.date}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button onClick={() => handleView(i)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleEdit(i)} className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(i.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEvaluate = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">政策覆盖率</p>
          <p className="text-2xl font-bold text-blue-600">98.5%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">群众满意度</p>
          <p className="text-2xl font-bold text-green-600">92.3%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">基金影响</p>
          <p className="text-2xl font-bold text-cyan-600">+5.2%</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold mb-4">政策效果评估</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm">政策名称</th>
              <th className="px-4 py-3 text-left text-sm">执行效果</th>
              <th className="px-4 py-3 text-left text-sm">满意度</th>
              <th className="px-4 py-3 text-left text-sm">建议</th>
            </tr>
          </thead>
          <tbody>
            {policies.filter(p => p.status === '生效中').map(p => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3 text-sm">{p.title}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">良好</span>
                </td>
                <td className="px-4 py-3 text-sm">94.2%</td>
                <td className="px-4 py-3 text-sm text-gray-500">继续执行</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRevoke = () => (
    <div className="space-y-4">
      <table className="w-full bg-white rounded-xl border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm">政策编号</th>
            <th className="px-4 py-3 text-left text-sm">标题</th>
            <th className="px-4 py-3 text-left text-sm">废止日期</th>
            <th className="px-4 py-3 text-left text-sm">状态</th>
            <th className="px-4 py-3 text-left text-sm">操作</th>
          </tr>
        </thead>
        <tbody>
          {policies.filter(p => p.status === '已废止').map(p => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{p.id}</td>
              <td className="px-4 py-3 text-sm font-medium">{p.title}</td>
              <td className="px-4 py-3 text-sm">{p.date}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">{p.status}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button onClick={() => handleView(p)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
          {policies.filter(p => p.status === '已废止').length === 0 && (
            <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">暂无废止政策</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">政策管理</h2>
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500'}`}
          >
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {activeTab === 'publish' && renderPublish()}
          {activeTab === 'interpret' && renderInterpret()}
          {activeTab === 'evaluate' && renderEvaluate()}
          {activeTab === 'revoke' && renderRevoke()}
        </motion.div>
      </AnimatePresence>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {modalType === 'add' ? '添加' : modalType === 'edit' ? '编辑' : '查看'}
                {activeTab === 'publish' || activeTab === 'revoke' ? '政策' : '解读'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            {modalType === 'view' ? (
              <div className="space-y-4">
                <div><label className="text-sm text-gray-500">标题</label><p className="font-medium">{currentItem?.title}</p></div>
                {(activeTab === 'publish' || activeTab === 'revoke') && <div><label className="text-sm text-gray-500">类型</label><p>{currentItem?.type}</p></div>}
                {activeTab === 'interpret' && <div><label className="text-sm text-gray-500">关联政策</label><p>{currentItem?.policy}</p></div>}
                <div><label className="text-sm text-gray-500">内容</label><p className="text-sm text-gray-600 mt-1">{currentItem?.content || '暂无内容'}</p></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">标题</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                {(activeTab === 'publish' || activeTab === 'revoke') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">类型</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="待遇政策">待遇政策</option>
                      <option value="支付政策">支付政策</option>
                      <option value="监管政策">监管政策</option>
                    </select>
                  </div>
                )}
                {activeTab === 'interpret' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">关联政策</label>
                    <select
                      value={formData.policy}
                      onChange={(e) => setFormData({ ...formData, policy: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">请选择</option>
                      {policies.filter(p => p.status === '生效中').map(p => (
                        <option key={p.id} value={p.title}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">内容</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
              {modalType !== 'view' && (
                <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
