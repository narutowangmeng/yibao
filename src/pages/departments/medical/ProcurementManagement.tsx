import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Gavel, FileSignature, Truck, CreditCard, Plus, Search, X, Eye, Edit2, Trash2, CheckCircle } from 'lucide-react';

const tabs = [
  { id: 'plan', label: '采购计划', icon: ClipboardList },
  { id: 'bidding', label: '招标管理', icon: Gavel },
  { id: 'contract', label: '合同管理', icon: FileSignature },
  { id: 'delivery', label: '配送监管', icon: Truck },
  { id: 'settlement', label: '结算管理', icon: CreditCard }
];

export default function ProcurementManagement() {
  const [activeTab, setActiveTab] = useState('plan');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [plans, setPlans] = useState([
    { id: 'P001', name: '2024年药品集中采购', amount: 12500, status: '执行中', date: '2024-01' },
    { id: 'P002', name: '高值耗材采购计划', amount: 8600, status: '待审批', date: '2024-02' }
  ]);

  const [biddings, setBiddings] = useState([
    { id: 'B001', name: '抗肿瘤药品招标', type: '公开招标', status: '进行中', deadline: '2024-02-15' },
    { id: 'B002', name: '医用耗材招标', type: '邀请招标', status: '已结束', deadline: '2024-01-20' }
  ]);

  const [contracts, setContracts] = useState([
    { id: 'C001', supplier: '某制药公司', amount: 5200, status: '生效中', date: '2024-01-10' },
    { id: 'C002', supplier: '某器械公司', amount: 3800, status: '待签署', date: '2024-01-15' }
  ]);

  const [deliveries, setDeliveries] = useState([
    { id: 'D001', item: '阿莫西林胶囊', supplier: '某制药', qty: 10000, status: '已配送' },
    { id: 'D002', item: '心脏支架', supplier: '某器械', qty: 500, status: '配送中' }
  ]);

  const [settlements, setSettlements] = useState([
    { id: 'S001', supplier: '某制药公司', amount: 12500, status: '已结算', date: '2024-01-20' },
    { id: 'S002', supplier: '某器械公司', amount: 8600, status: '待结算', date: '-' }
  ]);

  const [formData, setFormData] = useState<any>({});

  const openModal = (type: 'add' | 'edit' | 'view', item?: any) => {
    setModalType(type);
    setSelectedItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setFormData({});
  };

  const handleSave = () => {
    if (activeTab === 'plan') {
      if (modalType === 'add') {
        setPlans([...plans, { ...formData, id: `P${String(plans.length + 1).padStart(3, '0')}` }]);
      } else if (modalType === 'edit') {
        setPlans(plans.map(p => p.id === selectedItem.id ? { ...formData, id: selectedItem.id } : p));
      }
    } else if (activeTab === 'bidding') {
      if (modalType === 'edit') {
        setBiddings(biddings.map(b => b.id === selectedItem.id ? { ...formData, id: selectedItem.id } : b));
      }
    } else if (activeTab === 'contract') {
      if (modalType === 'add') {
        setContracts([...contracts, { ...formData, id: `C${String(contracts.length + 1).padStart(3, '0')}` }]);
      } else if (modalType === 'edit') {
        setContracts(contracts.map(c => c.id === selectedItem.id ? { ...formData, id: selectedItem.id } : c));
      }
    } else if (activeTab === 'delivery') {
      if (modalType === 'add') {
        setDeliveries([...deliveries, { ...formData, id: `D${String(deliveries.length + 1).padStart(3, '0')}` }]);
      } else if (modalType === 'edit') {
        setDeliveries(deliveries.map(d => d.id === selectedItem.id ? { ...formData, id: selectedItem.id } : d));
      }
    } else if (activeTab === 'settlement') {
      if (modalType === 'edit') {
        setSettlements(settlements.map(s => s.id === selectedItem.id ? { ...formData, id: selectedItem.id } : s));
      }
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'plan') setPlans(plans.filter(p => p.id !== id));
    else if (activeTab === 'contract') setContracts(contracts.filter(c => c.id !== id));
    else if (activeTab === 'delivery') setDeliveries(deliveries.filter(d => d.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    if (activeTab === 'bidding') {
      setBiddings(biddings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } else if (activeTab === 'settlement') {
      setSettlements(settlements.map(s => s.id === id ? { ...s, status: newStatus } : s));
    }
  };

  const renderPlanModal = () => (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium mb-1">计划名称</label><input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" disabled={modalType === 'view'} /></div>
      <div><label className="block text-sm font-medium mb-1">采购金额</label><input type="number" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" disabled={modalType === 'view'} /></div>
      <div><label className="block text-sm font-medium mb-1">状态</label><select value={formData.status || '待审批'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg" disabled={modalType === 'view'}><option>待审批</option><option>执行中</option><option>已完成</option></select></div>
    </div>
  );

  const renderBiddingModal = () => (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium mb-1">招标名称</label><input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" disabled={modalType === 'view'} /></div>
      <div><label className="block text-sm font-medium mb-1">招标类型</label><select value={formData.type || '公开招标'} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg" disabled={modalType === 'view'}><option>公开招标</option><option>邀请招标</option><option>竞争性谈判</option></select></div>
      <div><label className="block text-sm font-medium mb-1">截止日期</label><input type="date" value={formData.deadline || ''} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full px-3 py-2 border rounded-lg" disabled={modalType === 'view'} /></div>
    </div>
  );

  const renderContractModal = () => (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium mb-1">供应商</label><input type="text" value={formData.supplier || ''} onChange={e => setFormData({...formData, supplier: e.target.value})} className="w-full px-3 py-2 border rounded-lg" disabled={modalType === 'view'} /></div>
      <div><label className="block text-sm font-medium mb-1">合同金额</label><input type="number" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" disabled={modalType === 'view'} /></div>
      <div><label className="block text-sm font-medium mb-1">状态</label><select value={formData.status || '待签署'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg" disabled={modalType === 'view'}><option>待签署</option><option>生效中</option><option>已到期</option></select></div>
    </div>
  );

  const renderDeliveryModal = () => (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium mb-1">物品名称</label><input type="text" value={formData.item || ''} onChange={e => setFormData({...formData, item: e.target.value})} className="w-full px-3 py-2 border rounded-lg" disabled={modalType === 'view'} /></div>
      <div><label className="block text-sm font-medium mb-1">供应商</label><input type="text" value={formData.supplier || ''} onChange={e => setFormData({...formData, supplier: e.target.value})} className="w-full px-3 py-2 border rounded-lg" disabled={modalType === 'view'} /></div>
      <div><label className="block text-sm font-medium mb-1">数量</label><input type="number" value={formData.qty || ''} onChange={e => setFormData({...formData, qty: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" disabled={modalType === 'view'} /></div>
    </div>
  );

  const renderSettlementModal = () => (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium mb-1">供应商</label><input type="text" value={formData.supplier || ''} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" /></div>
      <div><label className="block text-sm font-medium mb-1">结算金额</label><input type="number" value={formData.amount || ''} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" /></div>
      <div><label className="block text-sm font-medium mb-1">状态</label><select value={formData.status || '待结算'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg" disabled={modalType === 'view'}><option>待结算</option><option>已结算</option></select></div>
    </div>
  );

  const renderContent = () => {
    const data = activeTab === 'plan' ? plans : activeTab === 'bidding' ? biddings : activeTab === 'contract' ? contracts : activeTab === 'delivery' ? deliveries : settlements;
    const columns = activeTab === 'plan' ? ['id', 'name', 'amount', 'status', 'date'] : activeTab === 'bidding' ? ['id', 'name', 'type', 'status', 'deadline'] : activeTab === 'contract' ? ['id', 'supplier', 'amount', 'status', 'date'] : activeTab === 'delivery' ? ['id', 'item', 'supplier', 'qty', 'status'] : ['id', 'supplier', 'amount', 'status', 'date'];
    const labels = activeTab === 'plan' ? ['编号', '名称', '金额(万)', '状态', '日期'] : activeTab === 'bidding' ? ['编号', '名称', '类型', '状态', '截止日'] : activeTab === 'contract' ? ['编号', '供应商', '金额(万)', '状态', '日期'] : activeTab === 'delivery' ? ['编号', '物品', '供应商', '数量', '状态'] : ['编号', '供应商', '金额(万)', '状态', '日期'];

    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="搜索..." className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div>
          {(activeTab === 'plan' || activeTab === 'contract' || activeTab === 'delivery') && (
            <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"><Plus className="w-4 h-4" />新增</button>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>{labels.map((l, i) => <th key={i} className="px-4 py-3 text-left text-sm font-medium text-gray-600">{l}</th>)}<th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th></tr></thead>
            <tbody>
              {data.map((item: any) => (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                  {columns.map((col, i) => (
                    <td key={i} className="px-4 py-3 text-sm text-gray-800">
                      {col === 'status' ? <span className={`px-2 py-1 text-xs rounded ${item.status === '已结算' || item.status === '已配送' || item.status === '生效中' || item.status === '已完成' || item.status === '已结束' ? 'bg-green-100 text-green-700' : item.status === '进行中' || item.status === '执行中' || item.status === '配送中' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span> : col === 'amount' ? `¥${item[col]}` : item[col]}</td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openModal('view', item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => openModal('edit', item)} className="p-1 text-cyan-600 hover:bg-cyan-50 rounded"><Edit2 className="w-4 h-4" /></button>
                      {(activeTab === 'plan' || activeTab === 'contract' || activeTab === 'delivery') && (
                        <button onClick={() => handleDelete(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      )}
                      {activeTab === 'bidding' && item.status === '进行中' && (
                        <button onClick={() => handleStatusChange(item.id, '已结束')} className="p-1 text-green-600 hover:bg-green-50 rounded"><CheckCircle className="w-4 h-4" /></button>
                      )}
                      {activeTab === 'settlement' && item.status === '待结算' && (
                        <button onClick={() => handleStatusChange(item.id, '已结算')} className="p-1 text-green-600 hover:bg-green-50 rounded"><CheckCircle className="w-4 h-4" /></button>
                      )}
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
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-800">招标采购管理</h2></div>
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'}`}>
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderContent()}</motion.div></AnimatePresence>
      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{modalType === 'add' ? '新增' : modalType === 'edit' ? '编辑' : '查看'}{tabs.find(t => t.id === activeTab)?.label}</h3>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            {activeTab === 'plan' && renderPlanModal()}
            {activeTab === 'bidding' && renderBiddingModal()}
            {activeTab === 'contract' && renderContractModal()}
            {activeTab === 'delivery' && renderDeliveryModal()}
            {activeTab === 'settlement' && renderSettlementModal()}
            {modalType !== 'view' && (
              <div className="flex gap-3 mt-6">
                <button onClick={closeModal} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
                <button onClick={handleSave} className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
