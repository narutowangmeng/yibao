import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plane, CheckSquare, Eye, Shuffle, Search } from 'lucide-react';

interface InspectionRecord {
  id: string;
  institution: string;
  city: string;
  date: string;
  inspectors: string[];
  status: 'planned' | 'executing' | 'completed';
  result?: string;
  opinion?: string;
  focus: string;
  items: { name: string; passed: boolean }[];
}

const mockInstitutions = [
  { name: '江苏省人民医院', city: '南京' },
  { name: '苏州雷允上双通道药房', city: '苏州' },
  { name: '无锡市人民医院', city: '无锡' },
  { name: '常州市第二人民医院', city: '常州' },
  { name: '扬州大学附属医院', city: '扬州' },
];
const mockInspectors = ['周岚', '陆敏', '钱莉', '赵静', '蒋雯', '高宁'];

const initialRecords: InspectionRecord[] = [
  { id: 'FI320001', institution: '江苏省人民医院', city: '南京', date: '2026-04-20', inspectors: ['周岚', '钱莉'], status: 'completed', result: '基本合格', focus: '高值耗材授权与收费一致性', opinion: '发现 1 项耗材收费口径不规范，已要求限期整改。', items: [{ name: '病历抽查', passed: true }, { name: '耗材授权', passed: false }, { name: '收费明细', passed: true }] },
  { id: 'FI320002', institution: '苏州雷允上双通道药房', city: '苏州', date: '2026-04-22', inspectors: ['陆敏', '赵静'], status: 'executing', focus: '双通道处方流转与审方留痕', items: [{ name: '处方流转', passed: true }, { name: '审方记录', passed: false }, { name: '库存追溯', passed: false }] },
  { id: 'FI320003', institution: '无锡市人民医院', city: '无锡', date: '2026-04-24', inspectors: ['蒋雯', '高宁'], status: 'planned', focus: '门诊慢特病待遇执行', items: [] },
];

export default function FlightInspection({ onBack }: { onBack: () => void }) {
  const [records, setRecords] = useState<InspectionRecord[]>(initialRecords);
  const [viewRecord, setViewRecord] = useState<InspectionRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState<'plan' | 'execute' | 'result'>('plan');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedInspectors, setSelectedInspectors] = useState<string[]>([]);
  const [checkDate, setCheckDate] = useState('');
  const [checkItems, setCheckItems] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState('合格');
  const [opinion, setOpinion] = useState('');
  const [message, setMessage] = useState('');
  const [focus, setFocus] = useState('');
  const [keyword, setKeyword] = useState('');

  const randomSelect = () => {
    const selected = mockInstitutions[Math.floor(Math.random() * mockInstitutions.length)];
    setSelectedInstitution(selected.name);
    setSelectedCity(selected.city);
    setSelectedInspectors([...mockInspectors].sort(() => 0.5 - Math.random()).slice(0, 2));
    setFocus(selected.name.includes('药房') ? '双通道处方流转与审方留痕' : '高值耗材、门诊慢特病与异地结算抽查');
  };

  const startInspection = () => {
    if (!selectedInstitution || !checkDate) {
      setMessage('请填写完整信息');
      setTimeout(() => setMessage(''), 1600);
      return;
    }
    setStep('execute');
  };

  const submitResult = () => {
    const newRecord: InspectionRecord = {
      id: `FI${String(records.length + 320001).slice(-6)}`,
      institution: selectedInstitution,
      city: selectedCity,
      date: checkDate,
      inspectors: selectedInspectors,
      status: 'completed',
      result,
      opinion,
      focus,
      items: Object.entries(checkItems).map(([name, passed]) => ({ name, passed })),
    };
    setRecords([newRecord, ...records]);
    setMessage('飞行检查已归档');
    setTimeout(() => {
      setMessage('');
      setShowForm(false);
      setStep('plan');
      setSelectedInstitution('');
      setSelectedCity('');
      setSelectedInspectors([]);
      setCheckDate('');
      setCheckItems({});
      setOpinion('');
      setFocus('');
    }, 1500);
  };

  const toggleCheckItem = (name: string) => setCheckItems({ ...checkItems, [name]: !checkItems[name] });

  const filteredRecords = records.filter((item) => [item.id, item.institution, item.city, item.focus].some((field) => field.includes(keyword)));

  if (viewRecord) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => setViewRecord(null)} className="rounded-lg p-2 hover:bg-gray-100"><ArrowLeft className="h-5 w-5" /></button>
          <h3 className="text-xl font-bold">检查详情</h3>
        </div>
        <div className="space-y-4 rounded-xl bg-gray-50 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm text-gray-500">检查单号</label><div className="font-medium">{viewRecord.id}</div></div>
            <div><label className="text-sm text-gray-500">机构</label><div className="font-medium">{viewRecord.institution}</div></div>
            <div><label className="text-sm text-gray-500">地市</label><div className="font-medium">{viewRecord.city}</div></div>
            <div><label className="text-sm text-gray-500">检查日期</label><div className="font-medium">{viewRecord.date}</div></div>
            <div><label className="text-sm text-gray-500">检查人员</label><div className="font-medium">{viewRecord.inspectors.join('、')}</div></div>
            <div><label className="text-sm text-gray-500">检查结果</label><div className="font-medium">{viewRecord.result || '进行中'}</div></div>
          </div>
          <div className="rounded-lg bg-blue-50 p-4"><div className="mb-1 text-sm font-medium">抽查重点</div><div className="text-sm text-gray-700">{viewRecord.focus}</div></div>
          {viewRecord.items.length > 0 && (
            <div>
              <label className="mb-2 block text-sm text-gray-500">检查项目</label>
              <div className="space-y-2">
                {viewRecord.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded bg-white p-2">
                    <CheckSquare className={`h-4 w-4 ${item.passed ? 'text-green-500' : 'text-red-500'}`} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {viewRecord.opinion && <div className="rounded-lg bg-white p-4 text-sm text-gray-700">{viewRecord.opinion}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100"><ArrowLeft className="h-5 w-5" /></button>
          <h3 className="text-xl font-bold">飞行检查</h3>
        </div>
        <button onClick={() => setShowForm(true)} className="rounded-lg bg-cyan-600 px-4 py-2 text-white">新建检查</button>
      </div>

      <AnimatePresence>
        {message && <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 rounded-lg bg-green-100 p-3 text-center text-green-700">{message}</motion.div>}
      </AnimatePresence>

      {showForm ? (
        <div className="rounded-xl border bg-white p-6">
          {step === 'plan' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
                <div className="mb-4 flex items-center gap-2"><Plane className="h-5 w-5 text-blue-600" /><span className="font-medium">突击检查计划</span></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="mb-1 block text-sm text-gray-600">检查日期</label><input type="date" value={checkDate} onChange={(e) => setCheckDate(e.target.value)} className="w-full rounded-lg border px-3 py-2" /></div>
                  <div><label className="mb-1 block text-sm text-gray-600">检查类型</label><select className="w-full rounded-lg border px-3 py-2"><option>常规飞行检查</option><option>专项飞行检查</option></select></div>
                </div>
              </div>
              <div className="rounded-xl border p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-medium">随机抽取机构</span>
                  <button onClick={randomSelect} className="flex items-center gap-1 rounded-lg bg-cyan-100 px-3 py-1.5 text-sm text-cyan-700"><Shuffle className="h-4 w-4" />随机抽取</button>
                </div>
                {selectedInstitution && <div className="rounded-lg bg-cyan-50 p-3"><span className="font-medium">{selectedInstitution}</span><span className="ml-2 text-sm text-gray-500">{selectedCity}</span></div>}
              </div>
              <div className="rounded-xl border p-6">
                <div className="mb-2 font-medium">检查人员</div>
                {selectedInspectors.length > 0 && <div className="flex gap-2">{selectedInspectors.map((item) => <span key={item} className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm">{item}</span>)}</div>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 rounded-lg border py-2">取消</button>
                <button onClick={startInspection} className="flex-1 rounded-lg bg-cyan-600 py-2 text-white">开始检查</button>
              </div>
            </div>
          )}
          {step === 'execute' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">正在对 <span className="font-medium">{selectedInstitution}</span> 开展飞行检查，重点：{focus}</div>
              <div className="space-y-2">
                {['病历抽查', '收费检查', '药品审方', '库存追溯', '双通道处方流转', '异地备案留痕'].map((item) => (
                  <div key={item} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-gray-50" onClick={() => toggleCheckItem(item)}>
                    <input type="checkbox" checked={checkItems[item] || false} onChange={() => {}} className="h-4 w-4" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('plan')} className="flex-1 rounded-lg border py-2">返回</button>
                <button onClick={() => setStep('result')} className="flex-1 rounded-lg bg-cyan-600 py-2 text-white">提交结果</button>
              </div>
            </div>
          )}
          {step === 'result' && (
            <div className="space-y-4">
              <div className="rounded-xl bg-gray-50 p-4">
                <h4 className="mb-3 font-medium">检查结果</h4>
                <div className="flex items-center justify-between rounded bg-white p-3">
                  <span>总体评价</span>
                  <select value={result} onChange={(e) => setResult(e.target.value)} className="rounded border px-2 py-1">
                    <option>合格</option>
                    <option>基本合格</option>
                    <option>不合格</option>
                  </select>
                </div>
              </div>
              <div><label className="mb-1 block text-sm text-gray-600">检查意见</label><textarea value={opinion} onChange={(e) => setOpinion(e.target.value)} className="h-24 w-full resize-none rounded-lg border px-3 py-2" placeholder="请输入检查意见、问题说明和整改要求" /></div>
              <div className="flex gap-3">
                <button onClick={() => setStep('execute')} className="flex-1 rounded-lg border py-2">返回</button>
                <button onClick={submitResult} className="flex-1 rounded-lg bg-cyan-600 py-2 text-white">完成</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border bg-white">
          <div className="border-b p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full rounded-lg border py-2 pl-10 pr-4" placeholder="搜索单号、机构、地市、重点" />
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">单号</th><th className="px-4 py-3 text-left text-sm">机构</th><th className="px-4 py-3 text-left text-sm">地市</th><th className="px-4 py-3 text-left text-sm">日期</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-right text-sm">操作</th></tr></thead>
            <tbody className="divide-y">
              {filteredRecords.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.id}</td>
                  <td className="px-4 py-3">{item.institution}</td>
                  <td className="px-4 py-3">{item.city}</td>
                  <td className="px-4 py-3">{item.date}</td>
                  <td className="px-4 py-3"><span className={`rounded px-2 py-1 text-xs ${item.status === 'completed' ? 'bg-green-100 text-green-700' : item.status === 'executing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status === 'completed' ? '已完成' : item.status === 'executing' ? '进行中' : '计划中'}</span></td>
                  <td className="px-4 py-3 text-right"><button onClick={() => setViewRecord(item)} className="rounded p-2 text-cyan-600 hover:bg-cyan-50"><Eye className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
