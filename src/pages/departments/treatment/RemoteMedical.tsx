import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, FileText, Building2, BarChart3, Plus, Edit2, Trash2, Eye, X, Search } from 'lucide-react';

interface Policy {
  id: string;
  name: string;
  status: '生效中' | '已废止';
  updateTime: string;
  content?: string;
}

interface Institution {
  id: string;
  name: string;
  level: string;
  status: '已签约' | '已解约';
  expireDate: string;
  address?: string;
}

const initialPolicies: Policy[] = [
  { id: 'POL-001', name: '跨省异地就医直接结算政策', status: '生效中', updateTime: '2024-01-15', content: '支持跨省异地就医直接结算' },
  { id: 'POL-002', name: '省内异地就医结算规则', status: '生效中', updateTime: '2024-01-10', content: '省内异地就医结算标准' }
];

const initialInstitutions: Institution[] = [
  { id: 'INST-001', name: '北京协和医院', level: '三级甲等', status: '已签约', expireDate: '2024-12-31', address: '北京市东城区' },
  { id: 'INST-002', name: '上海瑞金医院', level: '三级甲等', status: '已签约', expireDate: '2024-12-31', address: '上海市黄浦区' }
];

export default function RemoteMedical() {
  const [activeTab, setActiveTab] = useState<'policy' | 'institution' | 'settlement'>('policy');
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [institutions, setInstitutions] = useState<Institution[]>(initialInstitutions);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const openModal = (type: 'add' | 'edit' | 'view', item?: any) => {
    setModalType(type);
    setCurrentItem(item);
    setFormData(item || {});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentItem(null);
    setFormData({});
  };

  const handleSave = () => {
    if (activeTab === 'policy') {
      if (modalType === 'add') {
        const newPolicy: Policy = {
          id: `POL-${String(policies.length + 1).padStart(3, '0')}`,
          ...formData,
          status: formData.status || '生效中',
          updateTime: new Date().toISOString().split('T')[0]
        };
        setPolicies([...policies, newPolicy]);
      } else if (modalType === 'edit' && currentItem) {
        setPolicies(policies.map(p => p.id === currentItem.id ? { ...p, ...formData, updateTime: new Date().toISOString().split('T')[0] } : p));
      }
    } else if (activeTab === 'institution') {
      if (modalType === 'add') {
        const newInst: Institution = {
          id: `INST-${String(institutions.length + 1).padStart(3, '0')}`,
          ...formData,
          status: formData.status || '已签约'
        };
        setInstitutions([...institutions, newInst]);
      } else if (modalType === 'edit' && currentItem) {
        setInstitutions(institutions.map(i => i.id === currentItem.id ? { ...i, ...formData } : i));
      }
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'policy') {
      setPolicies(policies.filter(p => p.id !== id));
    } else if (activeTab === 'institution') {
      setInstitutions(institutions.filter(i => i.id !== id));
    }
  };

  const renderModal = () => {
    if (!modalOpen) return null;
    const isView = modalType === 'view';
    const title = isView ? '查看详情' : modalType === 'add' ? '新增' : '编辑';
    const isPolicy = activeTab === 'policy';

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{title}{isPolicy ? '政策' : '定点机构'}</h3>
            <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isPolicy ? '政策名称' : '机构名称'}</label>
              <input type="text" value={formData.name || ''} disabled={isView} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" />
            </div>
            {isPolicy ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <select value={formData.status || '生效中'} disabled={isView} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50">
                    <option value="生效中">生效中</option>
                    <option value="已废止">已废止</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">政策内容</label>
                  <textarea value={formData.content || ''} disabled={isView} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full px-3 py-2 border rounded-lg h-24 disabled:bg-gray-50" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">机构等级</label>
                  <input type="text" value={formData.level || ''} disabled={isView} onChange={e => setFormData({ ...formData, level: e.target.value })} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <select value={formData.status || '已签约'} disabled={isView} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50">
                    <option value="已签约">已签约</option>
                    <option value="已解约">已解约</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">协议到期日</label>
                  <input type="date" value={formData.expireDate || ''} disabled={isView} onChange={e => setFormData({ ...formData, expireDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                  <input type="text" value={formData.address || ''} disabled={isView} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" />
                </div>
              </>
            )}
          </div>
          {!isView && (
            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  const renderPolicy = () => (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />新增政策
        </button>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="p-3 text-left text-sm font-medium">政策编号</th><th className="p-3 text-left text-sm font-medium">政策名称</th><th className="p-3 text-left text-sm font-medium">状态</th><th className="p-3 text-left text-sm font-medium">更新时间</th><th className="p-3 text-left text-sm font-medium">操作</th></tr>
          </thead>
          <tbody>
            {policies.map(item => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3 text-sm">{item.id}</td>
                <td className="p-3 text-sm font-medium">{item.name}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${item.status === '生效中' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td>
                <td className="p-3 text-sm text-gray-600">{item.updateTime}</td>
                <td className="p-3">
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

  const renderInstitution = () => (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />新增定点
        </button>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="p-3 text-left text-sm font-medium">机构编号</th><th className="p-3 text-left text-sm font-medium">机构名称</th><th className="p-3 text-left text-sm font-medium">等级</th><th className="p-3 text-left text-sm font-medium">状态</th><th className="p-3 text-left text-sm font-medium">协议到期</th><th className="p-3 text-left text-sm font-medium">操作</th></tr>
          </thead>
          <tbody>
            {institutions.map(item => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3 text-sm">{item.id}</td>
                <td className="p-3 text-sm font-medium">{item.name}</td>
                <td className="p-3 text-sm">{item.level}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${item.status === '已签约' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td>
                <td className="p-3 text-sm text-gray-600">{item.expireDate}</td>
                <td className="p-3">
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

  const renderSettlement = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded-xl border"><p className="text-gray-500 text-sm">本月结算金额</p><p className="text-2xl font-bold text-cyan-600">¥485.6万</p></div>
        <div className="bg-white p-4 rounded-xl border"><p className="text-gray-500 text-sm">待清算资金</p><p className="text-2xl font-bold text-orange-600">¥86.4万</p></div>
        <div className="bg-white p-4 rounded-xl border"><p className="text-gray-500 text-sm">结算率</p><p className="text-2xl font-bold text-green-600">98.5%</p></div>
      </div>
      <div className="bg-white p-4 rounded-xl border">
        <h3 className="font-medium mb-3">资金清算进度</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span>跨省清算</span><span className="text-green-600">已完成</span></div>
          <div className="flex justify-between text-sm"><span>省内清算</span><span className="text-yellow-600">进行中</span></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">异地就医管理</h1>
          <p className="text-gray-500 mt-1">异地政策制定、定点机构管理、结算监控</p>
        </div>
      </div>
      <div className="flex gap-2 border-b">
        {[
          { id: 'policy', label: '异地政策管理', icon: FileText },
          { id: 'institution', label: '异地定点管理', icon: Building2 },
          { id: 'settlement', label: '异地结算监控', icon: BarChart3 }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-6 shadow-sm border">
        {activeTab === 'policy' && renderPolicy()}
        {activeTab === 'institution' && renderInstitution()}
        {activeTab === 'settlement' && renderSettlement()}
      </motion.div>
      {renderModal()}
    </div>
  );
}
