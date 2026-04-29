import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Database, Plus, Edit, Trash2, Eye, X, CheckCircle } from 'lucide-react';

interface SystemParam {
  id: string;
  name: string;
  key: string;
  value: string;
  description: string;
}

const tabs = [
  { id: 'system', label: '系统参数', icon: Database },
  { id: 'notification', label: '通知设置', icon: Bell },
  { id: 'security', label: '安全设置', icon: Shield }
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('system');
  const [params, setParams] = useState<SystemParam[]>([
    { id: '1', name: '报销上限', key: 'max_reimbursement', value: '50000', description: '单次报销金额上限' },
    { id: '2', name: '审核时效', key: 'audit_timeout', value: '3', description: '审核超时天数' }
  ]);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    auditAlert: true
  });
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentItem, setCurrentItem] = useState<SystemParam | null>(null);
  const [formData, setFormData] = useState({ name: '', key: '', value: '', description: '' });

  const handleAdd = () => {
    setModalType('add');
    setFormData({ name: '', key: '', value: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (item: SystemParam) => {
    setModalType('edit');
    setCurrentItem(item);
    setFormData({ name: item.name, key: item.key, value: item.value, description: item.description });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setParams(params.filter(p => p.id !== id));
  };

  const handleSubmit = () => {
    if (modalType === 'add') {
      setParams([...params, { id: String(params.length + 1), ...formData }]);
    } else {
      setParams(params.map(p => p.id === currentItem?.id ? { ...p, ...formData } : p));
    }
    setShowModal(false);
  };

  const handleSaveNotifications = () => {
    setMessage('通知设置已保存');
  };

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      setMessage('两次输入的密码不一致');
      return;
    }
    setMessage('密码修改成功');
    setPasswordForm({ old: '', new: '', confirm: '' });
  };

  const renderSystem = () => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg">
          <Plus className="w-4 h-4" />新增参数
        </button>
      </div>
      <table className="w-full bg-white rounded-xl border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm">参数名称</th>
            <th className="px-4 py-3 text-left text-sm">参数键</th>
            <th className="px-4 py-3 text-left text-sm">参数值</th>
            <th className="px-4 py-3 text-left text-sm">操作</th>
          </tr>
        </thead>
        <tbody>
          {params.map(p => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{p.key}</td>
              <td className="px-4 py-3 text-sm">{p.value}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderNotification = () => (
    <div className="bg-white rounded-xl border p-6 space-y-6">
      <h3 className="font-medium">通知方式</h3>
      <div className="space-y-3">
        {[
          { key: 'email', label: '邮件通知' },
          { key: 'sms', label: '短信通知' },
          { key: 'push', label: '推送通知' },
          { key: 'auditAlert', label: '审核提醒' }
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between">
            <span className="text-sm">{item.label}</span>
            <button
              onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
              className={`w-12 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-cyan-600' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleSaveNotifications} className="w-full py-2 bg-cyan-600 text-white rounded-lg">保存设置</button>
    </div>
  );

  const renderSecurity = () => (
    <div className="bg-white rounded-xl border p-6 space-y-4">
      <h3 className="font-medium">修改密码</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">原密码</label>
          <input type="password" value={passwordForm.old} onChange={(e) => setPasswordForm({ ...passwordForm, old: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">新密码</label>
          <input type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">确认密码</label>
          <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
        </div>
      </div>
      <button onClick={handleChangePassword} className="w-full py-2 bg-cyan-600 text-white rounded-lg">修改密码</button>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">系统设置</h2>
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {activeTab === 'system' && renderSystem()}
          {activeTab === 'notification' && renderNotification()}
          {activeTab === 'security' && renderSecurity()}
        </motion.div>
      </AnimatePresence>
      {message && <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-700">{message}</div>}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{modalType === 'add' ? '新增参数' : '编辑参数'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">参数名称</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">参数键</label><input type="text" value={formData.key} onChange={(e) => setFormData({ ...formData, key: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">参数值</label><input type="text" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
              <div><label className="block text-sm font-medium mb-1">描述</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg" /></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">保存</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
