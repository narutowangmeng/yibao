import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Layers, DollarSign, Settings, TrendingUp, Award, Plus, Edit, Trash2, Eye, X } from 'lucide-react';

const tabs = [
  { id: 'drg', label: 'DRG分组', icon: Layers },
  { id: 'dip', label: 'DIP病种', icon: Calculator },
  { id: 'standard', label: '付费标准', icon: DollarSign },
  { id: 'group', label: '分组器', icon: Settings },
  { id: 'analysis', label: '盈亏分析', icon: TrendingUp },
  { id: 'assess', label: '绩效考核', icon: Award }
];

export default function PaymentReform() {
  const [activeTab, setActiveTab] = useState('drg');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [drgData, setDrgData] = useState([
    { code: 'FA19', name: '心脏瓣膜手术', weight: 3.52, avgCost: 85600 },
    { code: 'FB11', name: '冠状动脉介入', weight: 2.18, avgCost: 52300 }
  ]);

  const [dipData, setDipData] = useState([
    { code: 'DIP001', name: '急性心肌梗死', score: 125.6, avgCost: 28500 },
    { code: 'DIP002', name: '肺炎', score: 68.5, avgCost: 15200 }
  ]);

  const [standards, setStandards] = useState([
    { id: 1, region: '省本级', rate: 8500, year: 2024 },
    { id: 2, region: 'XX市', rate: 7800, year: 2024 }
  ]);

  const [groups, setGroups] = useState([
    { id: 1, name: '标准分组器', version: 'V2.0', status: '启用' },
    { id: 2, name: '试点分组器', version: 'V1.5', status: '停用' }
  ]);

  const [analysis, setAnalysis] = useState([
    { id: 1, hospital: '省人民医院', income: 12500, cost: 11200, profit: 1300 },
    { id: 2, hospital: '市第一医院', income: 8600, cost: 9200, profit: -600 }
  ]);

  const [assessments, setAssessments] = useState([
    { id: 1, hospital: '省人民医院', score: 95, level: 'A', year: '2024' },
    { id: 2, hospital: '市第一医院', score: 88, level: 'B', year: '2024' }
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

  const handleDelete = (id: any, dataType: string) => {
    if (confirm('确定删除吗？')) {
      switch (dataType) {
        case 'drg': setDrgData(drgData.filter(i => i.code !== id)); break;
        case 'dip': setDipData(dipData.filter(i => i.code !== id)); break;
        case 'standard': setStandards(standards.filter(i => i.id !== id)); break;
        case 'group': setGroups(groups.filter(i => i.id !== id)); break;
        case 'analysis': setAnalysis(analysis.filter(i => i.id !== id)); break;
        case 'assess': setAssessments(assessments.filter(i => i.id !== id)); break;
      }
    }
  };

  const renderModal = () => {
    if (!modalOpen) return null;
    const isView = modalType === 'view';
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">{modalType === 'add' ? '新增' : modalType === 'edit' ? '编辑' : '查看'}</h3>
            <button onClick={closeModal}><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-3">
            <input disabled={isView} placeholder="名称" className="w-full px-3 py-2 border rounded" defaultValue={selectedItem?.name || ''} />
            <input disabled={isView} placeholder="编码" className="w-full px-3 py-2 border rounded" defaultValue={selectedItem?.code || ''} />
            {!isView && <button onClick={closeModal} className="w-full py-2 bg-cyan-600 text-white rounded">保存</button>}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'drg':
        return (
          <div className="space-y-4">
            <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"><Plus className="w-4 h-4" />新增</button>
            <table className="w-full bg-white rounded-xl border">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">DRG编码</th><th className="px-4 py-3">病组名称</th><th className="px-4 py-3">权重</th><th className="px-4 py-3">平均费用</th><th className="px-4 py-3">操作</th></tr></thead>
              <tbody>{drgData.map(item => (<tr key={item.code} className="border-t"><td className="px-4 py-3 font-medium">{item.code}</td><td className="px-4 py-3">{item.name}</td><td className="px-4 py-3">{item.weight}</td><td className="px-4 py-3">¥{item.avgCost}</td><td className="px-4 py-3 flex gap-2"><button onClick={() => openModal('view', item)} className="text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-green-600"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(item.code, 'drg')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>))}</tbody>
            </table>
          </div>
        );
      case 'dip':
        return (
          <div className="space-y-4">
            <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"><Plus className="w-4 h-4" />新增</button>
            <table className="w-full bg-white rounded-xl border">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">DIP编码</th><th className="px-4 py-3">病种名称</th><th className="px-4 py-3">分值</th><th className="px-4 py-3">平均费用</th><th className="px-4 py-3">操作</th></tr></thead>
              <tbody>{dipData.map(item => (<tr key={item.code} className="border-t"><td className="px-4 py-3 font-medium">{item.code}</td><td className="px-4 py-3">{item.name}</td><td className="px-4 py-3">{item.score}</td><td className="px-4 py-3">¥{item.avgCost}</td><td className="px-4 py-3 flex gap-2"><button onClick={() => openModal('view', item)} className="text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-green-600"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(item.code, 'dip')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>))}</tbody>
            </table>
          </div>
        );
      case 'standard':
        return (
          <div className="space-y-4">
            <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"><Plus className="w-4 h-4" />新增</button>
            <table className="w-full bg-white rounded-xl border">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">统筹区</th><th className="px-4 py-3">费率</th><th className="px-4 py-3">年度</th><th className="px-4 py-3">操作</th></tr></thead>
              <tbody>{standards.map(item => (<tr key={item.id} className="border-t"><td className="px-4 py-3">{item.region}</td><td className="px-4 py-3 text-cyan-600">{item.rate}</td><td className="px-4 py-3">{item.year}</td><td className="px-4 py-3 flex gap-2"><button onClick={() => openModal('view', item)} className="text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-green-600"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'standard')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>))}</tbody>
            </table>
          </div>
        );
      case 'group':
        return (
          <div className="space-y-4">
            <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"><Plus className="w-4 h-4" />新增</button>
            <table className="w-full bg-white rounded-xl border">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">分组器名称</th><th className="px-4 py-3">版本</th><th className="px-4 py-3">状态</th><th className="px-4 py-3">操作</th></tr></thead>
              <tbody>{groups.map(item => (<tr key={item.id} className="border-t"><td className="px-4 py-3">{item.name}</td><td className="px-4 py-3">{item.version}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${item.status === '启用' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td><td className="px-4 py-3 flex gap-2"><button onClick={() => openModal('view', item)} className="text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-green-600"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'group')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>))}</tbody>
            </table>
          </div>
        );
      case 'analysis':
        return (
          <div className="space-y-4">
            <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"><Plus className="w-4 h-4" />新增</button>
            <table className="w-full bg-white rounded-xl border">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">医疗机构</th><th className="px-4 py-3">医保收入</th><th className="px-4 py-3">医疗成本</th><th className="px-4 py-3">盈亏</th><th className="px-4 py-3">操作</th></tr></thead>
              <tbody>{analysis.map(item => (<tr key={item.id} className="border-t"><td className="px-4 py-3">{item.hospital}</td><td className="px-4 py-3">{item.income}万</td><td className="px-4 py-3">{item.cost}万</td><td className="px-4 py-3"><span className={item.profit > 0 ? 'text-green-600' : 'text-red-600'}>{item.profit > 0 ? '+' : ''}{item.profit}万</span></td><td className="px-4 py-3 flex gap-2"><button onClick={() => openModal('view', item)} className="text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-green-600"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'analysis')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>))}</tbody>
            </table>
          </div>
        );
      case 'assess':
        return (
          <div className="space-y-4">
            <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"><Plus className="w-4 h-4" />新增</button>
            <table className="w-full bg-white rounded-xl border">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">医疗机构</th><th className="px-4 py-3">考核得分</th><th className="px-4 py-3">等级</th><th className="px-4 py-3">年度</th><th className="px-4 py-3">操作</th></tr></thead>
              <tbody>{assessments.map(item => (<tr key={item.id} className="border-t"><td className="px-4 py-3">{item.hospital}</td><td className="px-4 py-3">{item.score}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${item.level === 'A' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.level}</span></td><td className="px-4 py-3">{item.year}</td><td className="px-4 py-3 flex gap-2"><button onClick={() => openModal('view', item)} className="text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-green-600"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'assess')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>))}</tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold">DRG/DIP支付改革</h2></div>
      <div className="flex gap-2 border-b">{tabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600'}`}><tab.icon className="w-4 h-4" />{tab.label}</button>))}</div>
      <AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{renderContent()}</motion.div></AnimatePresence>
      {renderModal()}
    </div>
  );
}
