import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, FileText, Pill, FlaskConical, Award, Plus, Edit2, Trash2, Eye, X } from 'lucide-react';

const tabs = [
  { id: 'behavior', label: '诊疗行为监管', icon: Stethoscope },
  { id: 'prescription', label: '处方审核', icon: FileText },
  { id: 'rational', label: '合理用药', icon: Pill },
  { id: 'inspection', label: '检查检验', icon: FlaskConical },
  { id: 'quality', label: '医疗质量', icon: Award }
];

const cities = ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'];
const hospitals = ['江苏省人民医院', '南京鼓楼医院', '无锡市人民医院', '徐州医科大学附属医院', '常州市第一人民医院', '苏州大学附属第一医院', '南通大学附属医院', '连云港市第一人民医院', '淮安市第一人民医院', '盐城市第一人民医院', '扬州大学附属医院', '镇江市第一人民医院', '泰州市人民医院', '宿迁市人民医院'];
const names = ['周文斌', '顾晨曦', '沈嘉豪', '陶雨晴', '陈志远', '陆欣怡', '赵明哲', '韩雪宁', '邵立成', '丁若涵', '许承泽', '魏心妍', '袁博文', '夏静怡', '顾海峰', '蒋雯丽', '钱宇航', '黎书瑶', '宋嘉木', '唐若宁'];

export default function ServiceSupervision() {
  const [activeTab, setActiveTab] = useState('behavior');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [behaviorData, setBehaviorData] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      hospital: hospitals[i % hospitals.length],
      doctor: names[i],
      issue: ['重复检查提醒', '超适应证治疗', '分解收费核查', '住院天数异常', '高值耗材使用偏高'][i % 5],
      status: ['待处理', '已整改', '已处置'][i % 3]
    }))
  );
  const [prescriptionData, setPrescriptionData] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      patient: `${cities[i % cities.length]}参保人${i + 1}`,
      drug: ['阿托伐他汀钙片', '达格列净片', '头孢呋辛酯片', '连花清瘟胶囊', '替格瑞洛片'][i % 5],
      qty: [1, 2, 3, 4, 5][i % 5],
      status: ['已通过', '存疑', '待审核'][i % 3]
    }))
  );
  const [rationalData, setRationalData] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      drug: ['抗菌药物', '质子泵抑制剂', '糖皮质激素', '辅助用药', '中药注射剂'][i % 5],
      usage: ['超疗程使用', '联合用药不规范', '适应证不符', '住院期间使用率偏高', '门诊用量异常'][i % 5],
      rate: `${8 + i}%`,
      level: ['高', '中', '低'][i % 3]
    }))
  );
  const [inspectionData, setInspectionData] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      item: ['胸部CT', '头颅MRI', '彩超检查', '胃镜检查', '肿瘤标志物检测'][i % 5],
      count: 800 + i * 37,
      abnormal: 12 + (i % 7) * 3
    }))
  );
  const [qualityData, setQualityData] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      hospital: hospitals[i % hospitals.length],
      score: 86 + (i % 12),
      level: ['A', 'B', 'C'][i % 3]
    }))
  );

  const handleAdd = () => { setModalType('add'); setSelectedItem(null); setShowModal(true); };
  const handleEdit = (item: any) => { setModalType('edit'); setSelectedItem(item); setShowModal(true); };
  const handleView = (item: any) => { setModalType('view'); setSelectedItem(item); setShowModal(true); };
  const handleDelete = (id: number) => {
    if (activeTab === 'behavior') setBehaviorData(behaviorData.filter((i) => i.id !== id));
    if (activeTab === 'prescription') setPrescriptionData(prescriptionData.filter((i) => i.id !== id));
    if (activeTab === 'rational') setRationalData(rationalData.filter((i) => i.id !== id));
    if (activeTab === 'inspection') setInspectionData(inspectionData.filter((i) => i.id !== id));
    if (activeTab === 'quality') setQualityData(qualityData.filter((i) => i.id !== id));
  };
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const newItem: any = { id: selectedItem?.id || Date.now() };
    formData.forEach((value, key) => { newItem[key] = value; });
    if (activeTab === 'behavior') modalType === 'add' ? setBehaviorData([...behaviorData, newItem]) : setBehaviorData(behaviorData.map((i) => i.id === selectedItem.id ? newItem : i));
    if (activeTab === 'prescription') modalType === 'add' ? setPrescriptionData([...prescriptionData, newItem]) : setPrescriptionData(prescriptionData.map((i) => i.id === selectedItem.id ? newItem : i));
    if (activeTab === 'rational') modalType === 'add' ? setRationalData([...rationalData, newItem]) : setRationalData(rationalData.map((i) => i.id === selectedItem.id ? newItem : i));
    if (activeTab === 'inspection') modalType === 'add' ? setInspectionData([...inspectionData, newItem]) : setInspectionData(inspectionData.map((i) => i.id === selectedItem.id ? newItem : i));
    if (activeTab === 'quality') modalType === 'add' ? setQualityData([...qualityData, newItem]) : setQualityData(qualityData.map((i) => i.id === selectedItem.id ? newItem : i));
    setShowModal(false);
  };

  const renderTable = () => {
    let data: any[] = [];
    let columns: string[] = [];
    switch (activeTab) {
      case 'behavior': data = behaviorData; columns = ['hospital', 'doctor', 'issue', 'status']; break;
      case 'prescription': data = prescriptionData; columns = ['patient', 'drug', 'qty', 'status']; break;
      case 'rational': data = rationalData; columns = ['drug', 'usage', 'rate', 'level']; break;
      case 'inspection': data = inspectionData; columns = ['item', 'count', 'abnormal']; break;
      case 'quality': data = qualityData; columns = ['hospital', 'score', 'level']; break;
    }
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>{columns.map((col) => <th key={col} className="px-4 py-3 text-left text-sm font-medium text-gray-600 capitalize">{col}</th>)}<th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th></tr></thead>
          <tbody>
            {data.map((item: any) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-3 text-sm text-gray-800">
                    {col === 'status' ? <span className={`px-2 py-1 text-xs rounded ${item[col] === '已通过' || item[col] === '已整改' ? 'bg-green-100 text-green-700' : item[col] === '待处理' || item[col] === '存疑' || item[col] === '待审核' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{item[col]}</span> : col === 'level' ? <span className={`px-2 py-1 text-xs rounded ${item[col] === 'A' || item[col] === '高' ? 'bg-red-100 text-red-700' : item[col] === 'B' || item[col] === '中' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{item[col]}</span> : item[col]}
                  </td>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">医疗服务行为监管</h2>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"><Plus className="w-4 h-4" />新增</button>
      </div>
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => { const Icon = tab.icon; return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'}`}><Icon className="w-4 h-4" />{tab.label}</button>; })}
      </div>
      <AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{renderTable()}</motion.div></AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">{modalType === 'add' ? '新增' : modalType === 'edit' ? '编辑' : '查看'}{tabs.find((t) => t.id === activeTab)?.label}</h3><button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button></div>
            {modalType === 'view' ? <div className="space-y-3">{Object.entries(selectedItem || {}).map(([key, value]) => <div key={key} className="flex justify-between py-2 border-b"><span className="text-gray-500 capitalize">{key}</span><span className="font-medium">{String(value)}</span></div>)}</div> : <form onSubmit={handleSave} className="space-y-4">
              {activeTab === 'behavior' && <><input name="hospital" defaultValue={selectedItem?.hospital} className="w-full px-3 py-2 border rounded-lg" required /><input name="doctor" defaultValue={selectedItem?.doctor} className="w-full px-3 py-2 border rounded-lg" required /><input name="issue" defaultValue={selectedItem?.issue} className="w-full px-3 py-2 border rounded-lg" required /><select name="status" defaultValue={selectedItem?.status || '待处理'} className="w-full px-3 py-2 border rounded-lg"><option>待处理</option><option>已整改</option><option>已处置</option></select></>}
              {activeTab === 'prescription' && <><input name="patient" defaultValue={selectedItem?.patient} className="w-full px-3 py-2 border rounded-lg" required /><input name="drug" defaultValue={selectedItem?.drug} className="w-full px-3 py-2 border rounded-lg" required /><input name="qty" type="number" defaultValue={selectedItem?.qty} className="w-full px-3 py-2 border rounded-lg" required /><select name="status" defaultValue={selectedItem?.status || '待审核'} className="w-full px-3 py-2 border rounded-lg"><option>待审核</option><option>已通过</option><option>存疑</option><option>已驳回</option></select></>}
              {activeTab === 'rational' && <><input name="drug" defaultValue={selectedItem?.drug} className="w-full px-3 py-2 border rounded-lg" required /><input name="usage" defaultValue={selectedItem?.usage} className="w-full px-3 py-2 border rounded-lg" required /><input name="rate" defaultValue={selectedItem?.rate} className="w-full px-3 py-2 border rounded-lg" required /><select name="level" defaultValue={selectedItem?.level || '低'} className="w-full px-3 py-2 border rounded-lg"><option>高</option><option>中</option><option>低</option></select></>}
              {activeTab === 'inspection' && <><input name="item" defaultValue={selectedItem?.item} className="w-full px-3 py-2 border rounded-lg" required /><input name="count" type="number" defaultValue={selectedItem?.count} className="w-full px-3 py-2 border rounded-lg" required /><input name="abnormal" type="number" defaultValue={selectedItem?.abnormal} className="w-full px-3 py-2 border rounded-lg" required /></>}
              {activeTab === 'quality' && <><input name="hospital" defaultValue={selectedItem?.hospital} className="w-full px-3 py-2 border rounded-lg" required /><input name="score" type="number" defaultValue={selectedItem?.score} className="w-full px-3 py-2 border rounded-lg" required /><select name="level" defaultValue={selectedItem?.level || 'A'} className="w-full px-3 py-2 border rounded-lg"><option>A</option><option>B</option><option>C</option></select></>}
              <div className="flex gap-3 pt-4"><button type="submit" className="flex-1 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button><button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">取消</button></div>
            </form>}
          </motion.div>
        </div>
      )}
    </div>
  );
}
