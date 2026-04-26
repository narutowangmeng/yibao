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

const hospitals = ['江苏省人民医院', '南京鼓楼医院', '无锡市人民医院', '徐州医科大学附属医院', '常州市第一人民医院', '苏州大学附属第一医院', '南通大学附属医院', '连云港市第一人民医院', '淮安市第一人民医院', '盐城市第一人民医院', '扬州大学附属医院', '镇江市第一人民医院', '泰州市人民医院', '宿迁市人民医院'];
const cities = ['省本级', '南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'];

export default function PaymentReform() {
  const [activeTab, setActiveTab] = useState('drg');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [drgData, setDrgData] = useState(Array.from({ length: 20 }, (_, i) => ({ code: `DRG${String(i + 1).padStart(3, '0')}`, name: ['冠状动脉介入治疗', '心力衰竭综合治疗', '肺炎伴并发症', '剖宫产手术', '髋关节置换术'][i % 5], weight: Number((1.6 + i * 0.12).toFixed(2)), avgCost: 9800 + i * 1800 })));
  const [dipData, setDipData] = useState(Array.from({ length: 20 }, (_, i) => ({ code: `DIP${String(i + 1).padStart(3, '0')}`, name: ['急性心肌梗死', '脑梗死', '糖尿病并发症', '慢阻肺急性加重', '恶性肿瘤化疗'][i % 5], score: Number((58 + i * 3.6).toFixed(1)), avgCost: 6200 + i * 1300 })));
  const [standards, setStandards] = useState(Array.from({ length: 20 }, (_, i) => ({ id: i + 1, region: cities[i % cities.length], rate: 7200 + i * 260, year: 2026 })));
  const [groups, setGroups] = useState(Array.from({ length: 20 }, (_, i) => ({ id: i + 1, name: `江苏医保分组器${i + 1}号`, version: `V${2 + Math.floor(i / 10)}.${i % 10}`, status: i % 5 === 0 ? '停用' : '启用' })));
  const [analysis, setAnalysis] = useState(Array.from({ length: 20 }, (_, i) => ({ id: i + 1, hospital: hospitals[i % hospitals.length], income: 8600 + i * 520, cost: 7800 + i * 480, profit: 800 + i * 40 - (i % 6) * 260 })));
  const [assessments, setAssessments] = useState(Array.from({ length: 20 }, (_, i) => ({ id: i + 1, hospital: hospitals[i % hospitals.length], score: 82 + (i % 15), level: ['A', 'B', 'C'][i % 3], year: '2026' })));

  const openModal = (type: 'add' | 'edit' | 'view', item?: any) => { setModalType(type); setSelectedItem(item || null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setSelectedItem(null); };
  const handleDelete = (id: any, dataType: string) => {
    switch (dataType) {
      case 'drg': setDrgData(drgData.filter((i) => i.code !== id)); break;
      case 'dip': setDipData(dipData.filter((i) => i.code !== id)); break;
      case 'standard': setStandards(standards.filter((i) => i.id !== id)); break;
      case 'group': setGroups(groups.filter((i) => i.id !== id)); break;
      case 'analysis': setAnalysis(analysis.filter((i) => i.id !== id)); break;
      case 'assess': setAssessments(assessments.filter((i) => i.id !== id)); break;
    }
  };

  const renderContent = () => {
    const table = (head: string[], rows: any[], render: (item: any) => React.ReactNode) => <div className="space-y-4"><button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"><Plus className="w-4 h-4" />新增</button><table className="w-full bg-white rounded-xl border"><thead className="bg-gray-50"><tr>{head.map((h) => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr></thead><tbody>{rows.map(render)}</tbody></table></div>;
    switch (activeTab) {
      case 'drg':
        return table(['DRG编码', '病组名称', '权重', '平均费用', '操作'], drgData, (item) => <tr key={item.code} className="border-t"><td className="px-4 py-3 font-medium">{item.code}</td><td className="px-4 py-3">{item.name}</td><td className="px-4 py-3">{item.weight}</td><td className="px-4 py-3">￥{item.avgCost}</td><td className="px-4 py-3 flex gap-2"><button onClick={() => openModal('view', item)} className="text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-green-600"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(item.code, 'drg')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>);
      case 'dip':
        return table(['DIP编码', '病种名称', '分值', '平均费用', '操作'], dipData, (item) => <tr key={item.code} className="border-t"><td className="px-4 py-3 font-medium">{item.code}</td><td className="px-4 py-3">{item.name}</td><td className="px-4 py-3">{item.score}</td><td className="px-4 py-3">￥{item.avgCost}</td><td className="px-4 py-3 flex gap-2"><button onClick={() => openModal('view', item)} className="text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-green-600"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(item.code, 'dip')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>);
      case 'standard':
        return table(['统筹区', '费率', '年度', '操作'], standards, (item) => <tr key={item.id} className="border-t"><td className="px-4 py-3">{item.region}</td><td className="px-4 py-3 text-cyan-600">{item.rate}</td><td className="px-4 py-3">{item.year}</td><td className="px-4 py-3 flex gap-2"><button onClick={() => openModal('view', item)} className="text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-green-600"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'standard')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>);
      case 'group':
        return table(['分组器名称', '版本', '状态', '操作'], groups, (item) => <tr key={item.id} className="border-t"><td className="px-4 py-3">{item.name}</td><td className="px-4 py-3">{item.version}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${item.status === '启用' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td><td className="px-4 py-3 flex gap-2"><button onClick={() => openModal('view', item)} className="text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-green-600"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'group')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>);
      case 'analysis':
        return table(['医疗机构', '医保收入', '医疗成本', '盈亏', '操作'], analysis, (item) => <tr key={item.id} className="border-t"><td className="px-4 py-3">{item.hospital}</td><td className="px-4 py-3">{item.income}万</td><td className="px-4 py-3">{item.cost}万</td><td className="px-4 py-3"><span className={item.profit > 0 ? 'text-green-600' : 'text-red-600'}>{item.profit > 0 ? '+' : ''}{item.profit}万</span></td><td className="px-4 py-3 flex gap-2"><button onClick={() => openModal('view', item)} className="text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-green-600"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'analysis')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>);
      case 'assess':
        return table(['医疗机构', '考核得分', '等级', '年度', '操作'], assessments, (item) => <tr key={item.id} className="border-t"><td className="px-4 py-3">{item.hospital}</td><td className="px-4 py-3">{item.score}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${item.level === 'A' ? 'bg-green-100 text-green-700' : item.level === 'B' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.level}</span></td><td className="px-4 py-3">{item.year}</td><td className="px-4 py-3 flex gap-2"><button onClick={() => openModal('view', item)} className="text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-green-600"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'assess')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>);
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold">DRG/DIP支付改革</h2></div>
      <div className="flex gap-2 border-b">{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600'}`}><tab.icon className="w-4 h-4" />{tab.label}</button>)}</div>
      <AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{renderContent()}</motion.div></AnimatePresence>
      {modalOpen && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-xl p-6 w-96"><div className="flex justify-between items-center mb-4"><h3 className="font-bold">{modalType === 'add' ? '新增' : modalType === 'edit' ? '编辑' : '查看'}</h3><button onClick={closeModal}><X className="w-5 h-5" /></button></div><div className="space-y-3"><input disabled={modalType === 'view'} placeholder="名称" className="w-full px-3 py-2 border rounded" defaultValue={selectedItem?.name || ''} /><input disabled={modalType === 'view'} placeholder="编码" className="w-full px-3 py-2 border rounded" defaultValue={selectedItem?.code || ''} />{modalType !== 'view' && <button onClick={closeModal} className="w-full py-2 bg-cyan-600 text-white rounded">保存</button>}</div></div></div>}
    </div>
  );
}
