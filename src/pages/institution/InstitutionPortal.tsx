import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertTriangle, Bell, User, Pill, ClipboardCheck, Eye, X, Check, Trash2 } from 'lucide-react';

interface Settlement {
  id: string;
  patient: string;
  amount: number;
  status: 'pending' | 'uploaded' | 'approved';
  date?: string;
}

interface Prescription {
  id: string;
  patient: string;
  doctor: string;
  status: 'pending' | 'approved' | 'rejected';
  items: number;
  amount: number;
}

interface Alert {
  id: number;
  type: string;
  patient: string;
  msg: string;
  level: 'warning' | 'error';
  status: 'unhandled' | 'handled';
}

const tabs = [
  { id: 'settlement', label: '结算清单', icon: FileText },
  { id: 'claim', label: '费用申报', icon: Upload },
  { id: 'reconcile', label: '对账确认', icon: CheckCircle },
  { id: 'alerts', label: '智能提醒', icon: Bell },
  { id: 'physician', label: '医师工作站', icon: User },
  { id: 'prescription', label: '处方流转', icon: Pill }
];

export default function InstitutionPortal() {
  const [activeTab, setActiveTab] = useState('settlement');
  const [settlements, setSettlements] = useState<Settlement[]>([
    { id: 'ST001', patient: '患者A', amount: 3500, status: 'pending' },
    { id: 'ST002', patient: '患者B', amount: 5200, status: 'uploaded', date: '2024-03-15' }
  ]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { id: 'RX001', patient: '患者A', doctor: '医师A', status: 'pending', items: 3, amount: 280 },
    { id: 'RX002', patient: '患者B', doctor: '医师B', status: 'approved', items: 2, amount: 150 }
  ]);
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, type: '超量用药', patient: '患者A', msg: '7天用量超过常规5天', level: 'warning', status: 'unhandled' },
    { id: 2, type: '重复收费', patient: '患者B', msg: '同日重复开具', level: 'error', status: 'unhandled' },
    { id: 3, type: '违规提示', patient: '患者C', msg: '药品与诊断不符', level: 'error', status: 'handled' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'upload' | 'view' | 'audit'>('upload');
  const [currentItem, setCurrentItem] = useState<any>(null);

  const handleUpload = () => {
    const newSettlement: Settlement = {
      id: `ST${String(settlements.length + 1).padStart(3, '0')}`,
      patient: `患者${String.fromCharCode(67 + settlements.length)}`,
      amount: Math.floor(Math.random() * 5000) + 1000,
      status: 'uploaded',
      date: new Date().toISOString().split('T')[0]
    };
    setSettlements([...settlements, newSettlement]);
  };

  const handleDeleteSettlement = (id: string) => {
    setSettlements(settlements.filter(s => s.id !== id));
  };

  const handleViewSettlement = (item: Settlement) => {
    setCurrentItem(item);
    setModalType('view');
    setShowModal(true);
  };

  const handleAuditPrescription = (item: Prescription, action: 'approved' | 'rejected') => {
    setPrescriptions(prescriptions.map(p => p.id === item.id ? { ...p, status: action } : p));
  };

  const handleHandleAlert = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'handled' } : a));
  };

  const renderSettlement = () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={handleUpload} className="px-4 py-2 bg-cyan-600 text-white rounded-lg flex items-center gap-2">
          <Upload className="w-4 h-4" />上传清单
        </button>
        <button className="px-4 py-2 border rounded-lg">批量导入</button>
      </div>
      <table className="w-full bg-white rounded-xl border">
        <thead className="bg-gray-50">
          <tr><th className="px-4 py-3 text-left text-sm">清单号</th><th className="px-4 py-3 text-left text-sm">患者</th><th className="px-4 py-3 text-left text-sm">金额</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-left text-sm">操作</th></tr>
        </thead>
        <tbody>
          {settlements.map(s => (
            <tr key={s.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{s.id}</td>
              <td className="px-4 py-3 text-sm">{s.patient}</td>
              <td className="px-4 py-3 text-sm">¥{s.amount}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded ${
                  s.status === 'approved' ? 'bg-green-100 text-green-700' :
                  s.status === 'uploaded' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {s.status === 'approved' ? '已审核' : s.status === 'uploaded' ? '已上传' : '待上传'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button onClick={() => handleViewSettlement(s)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteSettlement(s.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-3">
      {alerts.map(alert => (
        <div key={alert.id} className={`p-4 rounded-lg border ${alert.level === 'error' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-5 h-5 ${alert.level === 'error' ? 'text-red-600' : 'text-yellow-600'}`} />
              <span className="font-medium">{alert.type}</span>
              {alert.status === 'handled' && <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">已处理</span>}
            </div>
            {alert.status === 'unhandled' && (
              <button onClick={() => handleHandleAlert(alert.id)} className="px-3 py-1 bg-cyan-600 text-white text-sm rounded">处理</button>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{alert.patient} - {alert.msg}</p>
        </div>
      ))}
    </div>
  );

  const renderPrescription = () => (
    <table className="w-full bg-white rounded-xl border">
      <thead className="bg-gray-50">
        <tr><th className="px-4 py-3 text-left text-sm">处方号</th><th className="px-4 py-3 text-left text-sm">患者</th><th className="px-4 py-3 text-left text-sm">医师</th><th className="px-4 py-3 text-left text-sm">金额</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-left text-sm">操作</th></tr>
      </thead>
      <tbody>
        {prescriptions.map(rx => (
          <tr key={rx.id} className="border-t hover:bg-gray-50">
            <td className="px-4 py-3 text-sm">{rx.id}</td>
            <td className="px-4 py-3 text-sm">{rx.patient}</td>
            <td className="px-4 py-3 text-sm">{rx.doctor}</td>
            <td className="px-4 py-3 text-sm">¥{rx.amount}</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 text-xs rounded ${
                rx.status === 'approved' ? 'bg-green-100 text-green-700' :
                rx.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{rx.status === 'approved' ? '已通过' : rx.status === 'rejected' ? '已驳回' : '待审核'}</span>
            </td>
            <td className="px-4 py-3">
              {rx.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => handleAuditPrescription(rx, 'approved')} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
                  <button onClick={() => handleAuditPrescription(rx, 'rejected')} className="p-1 text-red-600 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">医疗机构门户</h2>
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {activeTab === 'settlement' && renderSettlement()}
          {activeTab === 'claim' && renderSettlement()}
          {activeTab === 'reconcile' && renderSettlement()}
          {activeTab === 'alerts' && renderAlerts()}
          {activeTab === 'physician' && <div className="bg-white p-8 rounded-xl border text-center text-gray-500">医师工作站</div>}
          {activeTab === 'prescription' && renderPrescription()}
        </motion.div>
      </AnimatePresence>

      {showModal && currentItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">结算清单详情</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-500">清单号</span><span>{currentItem.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">患者</span><span>{currentItem.patient}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">金额</span><span className="font-medium">¥{currentItem.amount}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">状态</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  currentItem.status === 'approved' ? 'bg-green-100 text-green-700' :
                  currentItem.status === 'uploaded' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{currentItem.status === 'approved' ? '已审核' : currentItem.status === 'uploaded' ? '已上传' : '待上传'}</span>
              </div>
              {currentItem.date && <div className="flex justify-between"><span className="text-gray-500">日期</span><span>{currentItem.date}</span></div>}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
