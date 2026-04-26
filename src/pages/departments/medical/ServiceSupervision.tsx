import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, FileText, Pill, FlaskConical, Award, Plus, Search, Edit2, Trash2, Eye, X, CheckCircle } from 'lucide-react';

const tabs = [
  { id: 'behavior', label: '诊疗行为监管', icon: Stethoscope },
  { id: 'prescription', label: '处方审核', icon: FileText },
  { id: 'rational', label: '合理用药', icon: Pill },
  { id: 'inspection', label: '检查检验', icon: FlaskConical },
  { id: 'quality', label: '医疗质量', icon: Award }
];

export default function ServiceSupervision() {
  const [activeTab, setActiveTab] = useState('behavior');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [behaviorData, setBehaviorData] = useState([
    { id: 1, hospital: '市人民医院', doctor: '张医生', issue: '过度检查', status: '待处理' },
    { id: 2, hospital: '中医院', doctor: '李医生', issue: '分解收费', status: '已整改' }
  ]);

  const [prescriptionData, setPrescriptionData] = useState([
    { id: 1, patient: '参保人A', drug: '阿莫西林', qty: 2, status: '已通过' },
    { id: 2, patient: '参保人B', drug: '抗生素', qty: 5, status: '存疑' }
  ]);

  const [rationalData, setRationalData] = useState([
    { id: 1, drug: '抗生素', usage: '超剂量使用', rate: '15%', level: '高' },
    { id: 2, drug: '激素', usage: '适应症不符', rate: '8%', level: '中' }
  ]);

  const [inspectionData, setInspectionData] = useState([
    { id: 1, item: 'CT检查', count: 1256, abnormal: 45 },
    { id: 2, item: '核磁共振', count: 856, abnormal: 23 }
  ]);

  const [qualityData, setQualityData] = useState([
    { id: 1, hospital: '市人民医院', score: 95, level: 'A' },
    { id: 2, hospital: '中医院', score: 88, level: 'B' }
  ]);

  const handleAdd = () => {
    setModalType('add');
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setModalType('edit');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleView = (item: any) => {
    setModalType('view');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (activeTab === 'behavior') setBehaviorData(behaviorData.filter(i => i.id !== id));
    if (activeTab === 'prescription') setPrescriptionData(prescriptionData.filter(i => i.id !== id));
    if (activeTab === 'rational') setRationalData(rationalData.filter(i => i.id !== id));
    if (activeTab === 'inspection') setInspectionData(inspectionData.filter(i => i.id !== id));
    if (activeTab === 'quality') setQualityData(qualityData.filter(i => i.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const newItem: any = { id: selectedItem?.id || Date.now() };
    formData.forEach((value, key) => { newItem[key] = value; });

    if (activeTab === 'behavior') {
      if (modalType === 'add') setBehaviorData([...behaviorData, newItem]);
      else setBehaviorData(behaviorData.map(i => i.id === selectedItem.id ? newItem : i));
    }
    if (activeTab === 'prescription') {
      if (modalType === 'add') setPrescriptionData([...prescriptionData, newItem]);
      else setPrescriptionData(prescriptionData.map(i => i.id === selectedItem.id ? newItem : i));
    }
    if (activeTab === 'rational') {
      if (modalType === 'add') setRationalData([...rationalData, newItem]);
      else setRationalData(rationalData.map(i => i.id === selectedItem.id ? newItem : i));
    }
    if (activeTab === 'inspection') {
      if (modalType === 'add') setInspectionData([...inspectionData, newItem]);
      else setInspectionData(inspectionData.map(i => i.id === selectedItem.id ? newItem : i));
    }
    if (activeTab === 'quality') {
      if (modalType === 'add') setQualityData([...qualityData, newItem]);
      else setQualityData(qualityData.map(i => i.id === selectedItem.id ? newItem : i));
    }
    setShowModal(false);
  };

  const renderTable = () => {
    let data: any[] = [];
    let columns: string[] = [];

    switch (activeTab) {
      case 'behavior':
        data = behaviorData;
        columns = ['hospital', 'doctor', 'issue', 'status'];
        break;
      case 'prescription':
        data = prescriptionData;
        columns = ['patient', 'drug', 'qty', 'status'];
        break;
      case 'rational':
        data = rationalData;
        columns = ['drug', 'usage', 'rate', 'level'];
        break;
      case 'inspection':
        data = inspectionData;
        columns = ['item', 'count', 'abnormal'];
        break;
      case 'quality':
        data = qualityData;
        columns = ['hospital', 'score', 'level'];
        break;
    }

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => <th key={col} className="px-4 py-3 text-left text-sm font-medium text-gray-600 capitalize">{col}</th>)}
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: any) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col} className="px-4 py-3 text-sm text-gray-800">
                    {col === 'status' ? (
                      <span className={`px-2 py-1 text-xs rounded ${item[col] === '已通过' || item[col] === '已整改' ? 'bg-green-100 text-green-700' : item[col] === '待处理' || item[col] === '存疑' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{item[col]}</span>
                    ) : col === 'level' ? (
                      <span className={`px-2 py-1 text-xs rounded ${item[col] === 'A' || item[col] === '高' ? 'bg-red-100 text-red-700' : item[col] === 'B' || item[col] === '中' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{item[col]}</span>
                    ) : item[col]}</td>
                ))}
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => handleView(item)} className="text-blue-600 hover:text-blue-800"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleEdit(item)} className="text-cyan-600 hover:text-cyan-800"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderModal = () => {
    if (!showModal) return null;
    const isView = modalType === 'view';

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{modalType === 'add' ? '新增' : modalType === 'edit' ? '编辑' : '查看'}{tabs.find(t => t.id === activeTab)?.label}</h3>
            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          {isView ? (
            <div className="space-y-3">
              {Object.entries(selectedItem || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b"><span className="text-gray-500 capitalize">{key}</span><span className="font-medium">{String(value)}</span></div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              {activeTab === 'behavior' && (
                <><div><label className="block text-sm font-medium mb-1">医疗机构</label><input name="hospital" defaultValue={selectedItem?.hospital} className="w-full px-3 py-2 border rounded-lg" required /></div><div><label className="block text-sm font-medium mb-1">医生</label><input name="doctor" defaultValue={selectedItem?.doctor} className="w-full px-3 py-2 border rounded-lg" required /></div><div><label className="block text-sm font-medium mb-1">问题</label><input name="issue" defaultValue={selectedItem?.issue} className="w-full px-3 py-2 border rounded-lg" required /></div><div><label className="block text-sm font-medium mb-1">状态</label><select name="status" defaultValue={selectedItem?.status || '待处理'} className="w-full px-3 py-2 border rounded-lg"><option>待处理</option><option>已整改</option><option>已处罚</option></select></div></>
              )}
              {activeTab === 'prescription' && (
                <><div><label className="block text-sm font-medium mb-1">患者</label><input name="patient" defaultValue={selectedItem?.patient} className="w-full px-3 py-2 border rounded-lg" required /></div><div><label className="block text-sm font-medium mb-1">药品</label><input name="drug" defaultValue={selectedItem?.drug} className="w-full px-3 py-2 border rounded-lg" required /></div><div><label className="block text-sm font-medium mb-1">数量</label><input name="qty" type="number" defaultValue={selectedItem?.qty} className="w-full px-3 py-2 border rounded-lg" required /></div><div><label className="block text-sm font-medium mb-1">状态</label><select name="status" defaultValue={selectedItem?.status || '待审核'} className="w-full px-3 py-2 border rounded-lg"><option>待审核</option><option>已通过</option><option>存疑</option><option>已拒绝</option></select></div></>
              )}
              {activeTab === 'rational' && (
                <><div><label className="block text-sm font-medium mb-1">药品</label><input name="drug" defaultValue={selectedItem?.drug} className="w-full px-3 py-2 border rounded-lg" required /></div><div><label className="block text-sm font-medium mb-1">使用情况</label><input name="usage" defaultValue={selectedItem?.usage} className="w-full px-3 py-2 border rounded-lg" required /></div><div><label className="block text-sm font-medium mb-1">异常率</label><input name="rate" defaultValue={selectedItem?.rate} className="w-full px-3 py-2 border rounded-lg" required /></div><div><label className="block text-sm font-medium mb-1">等级</label><select name="level" defaultValue={selectedItem?.level || '低'} className="w-full px-3 py-2 border rounded-lg"><option>高</option><option>中</option><option>低</option></select></div></>
              )}
              {activeTab === 'inspection' && (
                <><div><label className="block text-sm font-medium mb-1">项目名称</label><input name="item" defaultValue={selectedItem?.item} className="w-full px-3 py-2 border rounded-lg" required /></div><div><label className="block text-sm font-medium mb-1">检查次数</label><input name="count" type="number" defaultValue={selectedItem?.count} className="w-full px-3 py-2 border rounded-lg" required /></div><div><label className="block text-sm font-medium mb-1">异常数</label><input name="abnormal" type="number" defaultValue={selectedItem?.abnormal} className="w-full px-3 py-2 border rounded-lg" required /></div></>
              )}
              {activeTab === 'quality' && (
                <><div><label className="block text-sm font-medium mb-1">医疗机构</label><input name="hospital" defaultValue={selectedItem?.hospital} className="w-full px-3 py-2 border rounded-lg" required /></div><div><label className="block text-sm font-medium mb-1">评分</label><input name="score" type="number" defaultValue={selectedItem?.score} className="w-full px-3 py-2 border rounded-lg" required /></div><div><label className="block text-sm font-medium mb-1">等级</label><select name="level" defaultValue={selectedItem?.level || 'A'} className="w-full px-3 py-2 border rounded-lg"><option>A</option><option>B</option><option>C</option></select></div></>
              )}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">取消</button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">医疗服务行为监管</h2>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />新增
        </button>
      </div>

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

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {renderTable()}
        </motion.div>
      </AnimatePresence>

      {renderModal()}
    </div>
  );
}
