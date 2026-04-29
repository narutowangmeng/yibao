import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Search, Plus, FileText, CheckCircle, Activity, BarChart3, X, Edit2, Eye, Trash2 } from 'lucide-react';
import { getAgencyLevel } from '../../../config/managementPermissions';

const tabs = [
  { id: 'standard', label: '项目规范', icon: FileText },
  { id: 'approval', label: '新增审批', icon: CheckCircle },
  { id: 'pricing', label: '价格制定', icon: DollarSign },
  { id: 'monitor', label: '价格监测', icon: Activity },
  { id: 'analysis', label: '监测分析', icon: BarChart3 },
];

const hospitals = ['江苏省人民医院', '南京鼓楼医院', '无锡市人民医院', '徐州医科大学附属医院', '常州市第一人民医院', '苏州大学附属第一医院', '南通大学附属医院', '连云港市第一人民医院', '淮安市第一人民医院', '盐城市第一人民医院', '扬州大学附属医院', '镇江市第一人民医院', '泰州市人民医院', '宿迁市人民医院'];

export default function PriceManagement({ userAgency }: { userAgency: string }) {
  const [activeTab, setActiveTab] = useState('standard');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view' | 'approve'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const isProvince = getAgencyLevel(userAgency) === 'province';

  const [standards, setStandards] = useState(Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    code: `PR${String(i + 1).padStart(3, '0')}`,
    name: ['普通门诊诊查费', '专家门诊诊查费', '胸部CT平扫', '头颅MRI平扫', '血液透析', '针灸治疗', '肠镜检查', '康复训练评定'][i % 8],
    category: ['诊查费', '检查费', '治疗费', '中医治疗', '康复费'][i % 5],
    price: 30 + i * 18,
    status: ['生效中', '论证中', '待调整'][i % 3],
  })));
  const [approvals, setApprovals] = useState(Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: ['机器人辅助腹腔镜手术', 'PET-CT检查', '肿瘤靶向基因检测', '血液净化治疗', '术中神经监测'][i % 5],
    category: ['治疗费', '检查费', '检验费'][i % 3],
    price: 800 + i * 160,
    applicant: hospitals[i % hospitals.length],
    status: ['待审核', '已通过', '退回补充'][i % 3],
  })));
  const [monitors, setMonitors] = useState(Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: ['门诊诊查费', 'MRI检查', '血液透析', '中医针灸治疗', '病理检查'][i % 5],
    price: 60 + i * 25,
    change: Number((2.5 + (i % 7) * 1.8).toFixed(1)),
    alert: i % 4 === 0,
  })));

  const [formData, setFormData] = useState({ code: '', name: '', category: '', price: '', status: '生效中' });

  const openModal = (type: 'add' | 'edit' | 'view' | 'approve', item?: any) => {
    setModalType(type);
    setSelectedItem(item);
    if (item) setFormData({ code: item.code || '', name: item.name || '', category: item.category || '', price: item.price?.toString() || '', status: item.status || '生效中' });
    else setFormData({ code: '', name: '', category: '', price: '', status: '生效中' });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setSelectedItem(null); };
  const handleSave = () => {
    if (modalType === 'add') setStandards([...standards, { id: Date.now(), code: formData.code, name: formData.name, category: formData.category, price: parseFloat(formData.price), status: formData.status }]);
    else if (modalType === 'edit' && selectedItem) setStandards(standards.map((s) => (s.id === selectedItem.id ? { ...s, ...formData, price: parseFloat(formData.price) } : s)));
    else if (modalType === 'approve' && selectedItem) setApprovals(approvals.map((a) => (a.id === selectedItem.id ? { ...a, status: '已通过' } : a)));
    closeModal();
  };
  const handleDelete = (id: number) => setStandards(standards.filter((s) => s.id !== id));
  const handleProcessAlert = (id: number) => setMonitors(monitors.map((m) => (m.id === id ? { ...m, alert: false } : m)));

  const renderContent = () => {
    switch (activeTab) {
      case 'standard':
      case 'pricing':
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="搜索项目..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
              </div>
              {isProvince && <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"><Plus className="w-4 h-4" />新增</button>}
            </div>
            <table className="w-full bg-white rounded-xl border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">编码</th>
                  <th className="px-4 py-3 text-left text-sm">项目名称</th>
                  <th className="px-4 py-3 text-left text-sm">分类</th>
                  <th className="px-4 py-3 text-left text-sm">价格</th>
                  <th className="px-4 py-3 text-left text-sm">状态</th>
                  <th className="px-4 py-3 text-left text-sm">操作</th>
                </tr>
              </thead>
              <tbody>
                {standards.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3 text-sm">{item.code}</td>
                    <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-sm">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-cyan-600">￥{item.price}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded ${item.status === '生效中' ? 'bg-green-100 text-green-700' : item.status === '论证中' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openModal('view', item)} className="text-cyan-600"><Eye className="w-4 h-4" /></button>
                        {isProvince && (
                          <>
                            <button onClick={() => openModal('edit', item)} className="text-blue-600"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'approval':
        return (
          <table className="w-full bg-white rounded-xl border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">项目名称</th>
                <th className="px-4 py-3 text-left text-sm">分类</th>
                <th className="px-4 py-3 text-left text-sm">申请价格</th>
                <th className="px-4 py-3 text-left text-sm">申请机构</th>
                <th className="px-4 py-3 text-left text-sm">状态</th>
                <th className="px-4 py-3 text-left text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-sm">{item.category}</td>
                  <td className="px-4 py-3 text-sm text-cyan-600">￥{item.price}</td>
                  <td className="px-4 py-3 text-sm">{item.applicant}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded ${item.status === '已通过' ? 'bg-green-100 text-green-700' : item.status === '待审核' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {isProvince && item.status === '待审核' && <button onClick={() => openModal('approve', item)} className="text-cyan-600 text-sm">审批</button>}
                      <button onClick={() => openModal('view', item)} className="text-gray-600 text-sm"><Eye className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'monitor':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border"><p className="text-sm text-gray-500">监测项目</p><p className="text-2xl font-bold text-blue-600">20</p></div>
              <div className="bg-white p-4 rounded-xl border"><p className="text-sm text-gray-500">异常预警</p><p className="text-2xl font-bold text-red-600">{monitors.filter((m) => m.alert).length}</p></div>
              <div className="bg-white p-4 rounded-xl border"><p className="text-sm text-gray-500">平均涨幅</p><p className="text-2xl font-bold text-cyan-600">6.8%</p></div>
            </div>
            <table className="w-full bg-white rounded-xl border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">项目名称</th>
                  <th className="px-4 py-3 text-left text-sm">当前价格</th>
                  <th className="px-4 py-3 text-left text-sm">涨跌幅</th>
                  <th className="px-4 py-3 text-left text-sm">预警</th>
                  <th className="px-4 py-3 text-left text-sm">操作</th>
                </tr>
              </thead>
              <tbody>
                {monitors.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-sm">￥{item.price}</td>
                    <td className="px-4 py-3 text-sm"><span className={item.change > 10 ? 'text-red-600' : 'text-green-600'}>+{item.change}%</span></td>
                    <td className="px-4 py-3">{item.alert ? <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">异常</span> : <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">正常</span>}</td>
                    <td className="px-4 py-3">{isProvince && item.alert ? <button onClick={() => handleProcessAlert(item.id)} className="text-cyan-600 text-sm">处理</button> : <button onClick={() => openModal('view', item)} className="text-gray-600 text-sm">查看</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'analysis':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border"><h3 className="font-medium mb-4">价格分类占比</h3><div className="space-y-2"><div className="flex justify-between text-sm"><span>诊查费</span><span>22%</span></div><div className="flex justify-between text-sm"><span>检查费</span><span>31%</span></div><div className="flex justify-between text-sm"><span>治疗费</span><span>27%</span></div><div className="flex justify-between text-sm"><span>中医治疗</span><span>20%</span></div></div></div>
            <div className="bg-white p-5 rounded-xl border"><h3 className="font-medium mb-4">价格趋势</h3><div className="h-24 flex items-end gap-1">{[45, 52, 58, 61, 66, 70].map((h, i) => <div key={i} className="flex-1 bg-cyan-500 rounded-t" style={{ height: `${h}%` }} />)}</div></div>
          </div>
        );
      default:
        return <div className="bg-white rounded-xl border p-8 text-center text-gray-500">暂无更多内容，请从上方标签切换到已配置页面。</div>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">医疗服务价格管理</h2>
          {!isProvince && <p className="mt-1 text-sm text-amber-700">地市账号仅可查看价格标准、审批结果和监测分析，不可维护全省价格主数据</p>}
        </div>
        <span className="text-sm text-gray-500">医药服务管理 / 价格管理</span>
      </div>
      <div className="flex gap-2 border-b">{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500'}`}><tab.icon className="w-4 h-4" />{tab.label}</button>)}</div>
      <AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderContent()}</motion.div></AnimatePresence>
      {isProvince && modalOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-96 max-w-full"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">{{ add: '新增项目', edit: '编辑项目', view: '查看详情', approve: '审批处理' }[modalType]}</h3><button onClick={closeModal}><X className="w-5 h-5" /></button></div><div className="space-y-3">{(modalType === 'add' || modalType === 'edit') && <><input type="text" placeholder="项目编码" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /><input type="text" placeholder="项目名称" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /><input type="text" placeholder="分类" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /><input type="number" placeholder="价格" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></>}{modalType === 'approve' && selectedItem && <div className="space-y-2"><p className="text-sm"><span className="text-gray-500">申请项目:</span> {selectedItem.name}</p><p className="text-sm"><span className="text-gray-500">申请价格:</span> ￥{selectedItem.price}</p><p className="text-sm"><span className="text-gray-500">申请机构:</span> {selectedItem.applicant}</p></div>}</div><div className="flex gap-2 mt-4"><button onClick={handleSave} className="flex-1 py-2 bg-cyan-600 text-white rounded-lg">{modalType === 'approve' ? '通过' : '保存'}</button><button onClick={closeModal} className="flex-1 py-2 border rounded-lg">取消</button></div></motion.div></div>}
      {!isProvince && modalOpen && selectedItem && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-96 max-w-full"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">查看详情</h3><button onClick={closeModal}><X className="w-5 h-5" /></button></div><div className="space-y-2 text-sm"><p><span className="text-gray-500">名称:</span> {selectedItem.name}</p><p><span className="text-gray-500">分类:</span> {selectedItem.category}</p>{selectedItem.price !== undefined && <p><span className="text-gray-500">价格:</span> ￥{selectedItem.price}</p>}{selectedItem.status && <p><span className="text-gray-500">状态:</span> {selectedItem.status}</p>}</div><div className="mt-4"><button onClick={closeModal} className="w-full py-2 border rounded-lg">关闭</button></div></motion.div></div>}
    </div>
  );
}
