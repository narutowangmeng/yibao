import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plane, Building2, Users, CheckCircle, XCircle, Shuffle, Eye, Calendar, FileText, CheckSquare } from 'lucide-react';

interface InspectionRecord {
  id: string;
  institution: string;
  date: string;
  inspectors: string[];
  status: 'planned' | 'executing' | 'completed';
  result?: string;
  opinion?: string;
  items: { name: string; passed: boolean }[];
}

const mockInstitutions = ['南京市第一医院', '苏州大学附属医院', '无锡市人民医院', '常州市中医院'];
const mockInspectors = ['张检查员', '李检查员', '王检查员', '赵检查员'];

const initialRecords: InspectionRecord[] = [
  { id: 'F001', institution: '南京市第一医院', date: '2024-01-20', inspectors: ['张检查员', '李检查员'], status: 'completed', result: '合格', items: [{ name: '病历抽查', passed: true }, { name: '药品核查', passed: true }] },
  { id: 'F002', institution: '苏州中医院', date: '2024-01-18', inspectors: ['王检查员'], status: 'executing', items: [{ name: '病历抽查', passed: true }, { name: '收费检查', passed: false }] },
];

export default function FlightInspection({ onBack }: { onBack: () => void }) {
  const [records, setRecords] = useState<InspectionRecord[]>(initialRecords);
  const [viewRecord, setViewRecord] = useState<InspectionRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState<'plan' | 'execute' | 'result'>('plan');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [selectedInspectors, setSelectedInspectors] = useState<string[]>([]);
  const [checkDate, setCheckDate] = useState('');
  const [checkItems, setCheckItems] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState('合格');
  const [opinion, setOpinion] = useState('');
  const [message, setMessage] = useState('');

  const randomSelect = () => {
    setSelectedInstitution(mockInstitutions[Math.floor(Math.random() * mockInstitutions.length)]);
    const shuffled = [...mockInspectors].sort(() => 0.5 - Math.random());
    setSelectedInspectors(shuffled.slice(0, 2));
  };

  const startInspection = () => {
    if (!selectedInstitution || !checkDate) {
      setMessage('请填写完整信息');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    setStep('execute');
  };

  const submitResult = () => {
    const newRecord: InspectionRecord = {
      id: `F${String(records.length + 1).padStart(3, '0')}`,
      institution: selectedInstitution,
      date: checkDate,
      inspectors: selectedInspectors,
      status: 'completed',
      result,
      opinion,
      items: Object.entries(checkItems).map(([name, passed]) => ({ name, passed })),
    };
    setRecords([newRecord, ...records]);
    setMessage('检查完成，结果已保存');
    setTimeout(() => {
      setMessage('');
      setShowForm(false);
      setStep('plan');
      setSelectedInstitution('');
      setSelectedInspectors([]);
      setCheckDate('');
      setCheckItems({});
      setOpinion('');
    }, 1500);
  };

  const toggleCheckItem = (name: string) => {
    setCheckItems({ ...checkItems, [name]: !checkItems[name] });
  };

  if (viewRecord) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setViewRecord(null)} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <h3 className="text-xl font-bold">检查详情</h3>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-500">检查单号</label><div className="font-medium">{viewRecord.id}</div></div>
            <div><label className="text-sm text-gray-500">检查机构</label><div className="font-medium">{viewRecord.institution}</div></div>
            <div><label className="text-sm text-gray-500">检查日期</label><div className="font-medium">{viewRecord.date}</div></div>
            <div><label className="text-sm text-gray-500">检查人员</label><div className="font-medium">{viewRecord.inspectors.join(', ')}</div></div>
            <div><label className="text-sm text-gray-500">检查结果</label><div className="font-medium">{viewRecord.result || '进行中'}</div></div>
          </div>
          {viewRecord.items.length > 0 && (
            <div>
              <label className="text-sm text-gray-500 mb-2 block">检查项目</label>
              <div className="space-y-2">
                {viewRecord.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded">
                    <CheckSquare className={`w-4 h-4 ${item.passed ? 'text-green-500' : 'text-red-500'}`} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {viewRecord.opinion && (
            <div>
              <label className="text-sm text-gray-500 mb-2 block">检查意见</label>
              <div className="p-3 bg-white rounded text-sm">{viewRecord.opinion}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <h3 className="text-xl font-bold">飞行检查</h3>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">新建检查</button>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {showForm ? (
        <div className="bg-white rounded-xl border p-6">
          {step === 'plan' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-2 mb-4"><Plane className="w-5 h-5 text-blue-600" /><span className="font-medium">突击检查计划</span></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm text-gray-600 mb-1">检查日期</label><input type="date" value={checkDate} onChange={e => setCheckDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm text-gray-600 mb-1">检查类型</label><select className="w-full px-3 py-2 border rounded-lg"><option>常规飞行检查</option><option>专项飞行检查</option></select></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2"><Building2 className="w-5 h-5 text-gray-600" /><span className="font-medium">随机抽取机构</span></div>
                  <button onClick={randomSelect} className="flex items-center gap-1 px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-lg text-sm"><Shuffle className="w-4 h-4" />随机抽取</button>
                </div>
                {selectedInstitution && <div className="p-3 bg-cyan-50 rounded-lg"><span className="font-medium">{selectedInstitution}</span></div>}
              </div>
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center gap-2 mb-4"><Users className="w-5 h-5 text-gray-600" /><span className="font-medium">检查人员</span></div>
                {selectedInspectors.length > 0 && <div className="flex gap-2">{selectedInspectors.map((i, idx) => <span key={idx} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm">{i}</span>)}</div>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2 border rounded-lg">取消</button>
                <button onClick={startInspection} className="flex-1 py-2 bg-cyan-600 text-white rounded-lg">开始检查</button>
              </div>
            </div>
          )}
          {step === 'execute' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <p className="text-sm text-yellow-800">正在对 <span className="font-medium">{selectedInstitution}</span> 进行飞行检查...</p>
              </div>
              <div className="space-y-2">
                {['病历抽查', '药品核查', '收费检查', '设备检查'].map(item => (
                  <div key={item} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50" onClick={() => toggleCheckItem(item)}>
                    <input type="checkbox" checked={checkItems[item] || false} onChange={() => {}} className="w-4 h-4" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('plan')} className="flex-1 py-2 border rounded-lg">返回</button>
                <button onClick={() => setStep('result')} className="flex-1 py-2 bg-cyan-600 text-white rounded-lg">提交结果</button>
              </div>
            </div>
          )}
          {step === 'result' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium mb-3">检查结果</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span>总体评价</span>
                    <select value={result} onChange={e => setResult(e.target.value)} className="border rounded px-2 py-1">
                      <option>合格</option><option>基本合格</option><option>不合格</option>
                    </select>
                  </div>
                </div>
              </div>
              <div><label className="block text-sm text-gray-600 mb-1">检查意见</label><textarea value={opinion} onChange={e => setOpinion(e.target.value)} className="w-full h-20 px-3 py-2 border rounded-lg resize-none" placeholder="请输入检查意见..." /></div>
              <div className="flex gap-3">
                <button onClick={() => setStep('execute')} className="flex-1 py-2 border rounded-lg">返回</button>
                <button onClick={submitResult} className="flex-1 py-2 bg-cyan-600 text-white rounded-lg">完成</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border">
          <table className="w-full">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">单号</th><th className="px-4 py-3 text-left text-sm">机构</th><th className="px-4 py-3 text-left text-sm">日期</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-right text-sm">操作</th></tr></thead>
            <tbody className="divide-y">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r.id}</td>
                  <td className="px-4 py-3">{r.institution}</td>
                  <td className="px-4 py-3">{r.date}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${r.status === 'completed' ? 'bg-green-100 text-green-700' : r.status === 'executing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status === 'completed' ? '已完成' : r.status === 'executing' ? '进行中' : '计划中'}</span></td>
                  <td className="px-4 py-3 text-right"><button onClick={() => setViewRecord(r)} className="p-2 text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
