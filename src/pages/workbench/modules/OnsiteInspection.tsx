import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Building2, Upload, Eye, CheckSquare, Search } from 'lucide-react';

interface OnsiteInspectionProps {
  onClose: () => void;
  onBack: () => void;
}

interface InspectionRecord {
  id: string;
  institution: string;
  city: string;
  date: string;
  team: string;
  result: string;
  status: string;
  issueCount: number;
}

const institutions = [
  { id: 'I001', name: '江苏省人民医院', city: '南京' },
  { id: 'I002', name: '苏州大学附属第一医院', city: '苏州' },
  { id: 'I003', name: '无锡市人民医院', city: '无锡' },
  { id: 'I004', name: '徐州市中心医院', city: '徐州' },
];

const checkItems = [
  '医保目录执行情况',
  '诊疗项目合规性',
  '药品使用规范性',
  '医疗服务价格执行',
  '异地就医备案留痕',
  '双通道药品处方流转',
];

const mockHistory: InspectionRecord[] = [
  { id: 'XC320001', institution: '江苏省人民医院', city: '南京', date: '2026-04-15', team: '省局第一检查组', result: '基本合格', status: '已完成', issueCount: 3 },
  { id: 'XC320002', institution: '苏州大学附属第一医院', city: '苏州', date: '2026-04-18', team: '省局第二检查组', result: '合格', status: '已完成', issueCount: 1 },
  { id: 'XC320003', institution: '无锡市人民医院', city: '无锡', date: '2026-04-20', team: '市级联动检查组', result: '整改中', status: '整改跟踪', issueCount: 4 },
];

export default function OnsiteInspection({ onBack }: OnsiteInspectionProps) {
  const [view, setView] = useState<'form' | 'history' | 'detail'>('form');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [checkDate, setCheckDate] = useState('');
  const [checkResults, setCheckResults] = useState<Record<string, string>>({});
  const [selectedRecord, setSelectedRecord] = useState<InspectionRecord | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [keyword, setKeyword] = useState('');

  const toggleCheckItem = (id: string, result: string) => setCheckResults({ ...checkResults, [id]: result });

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCheckResults({});
      setSelectedInstitution('');
      setCheckDate('');
    }, 1400);
  };

  const filteredHistory = mockHistory.filter((item) => [item.id, item.institution, item.city, item.team].some((field) => field.includes(keyword)));

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100"><ArrowLeft className="h-5 w-5" /></button>
          <h3 className="text-xl font-bold">现场检查</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('history')} className={`rounded-lg px-4 py-2 text-sm ${view === 'history' ? 'bg-cyan-600 text-white' : 'bg-gray-100'}`}>历史记录</button>
          <button onClick={() => setView('form')} className={`rounded-lg px-4 py-2 text-sm ${view === 'form' ? 'bg-cyan-600 text-white' : 'bg-gray-100'}`}>新建检查</button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'form' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700"><Building2 className="h-4 w-4" />检查机构</label>
                <select value={selectedInstitution} onChange={(e) => setSelectedInstitution(e.target.value)} className="w-full rounded-lg border px-3 py-2">
                  <option value="">请选择机构</option>
                  {institutions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">检查日期</label>
                <input type="date" value={checkDate} onChange={(e) => setCheckDate(e.target.value)} className="w-full rounded-lg border px-3 py-2" />
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <h4 className="mb-3 font-medium">检查项目清单</h4>
              <div className="space-y-2">
                {checkItems.map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-lg bg-white p-3">
                    <span>{item}</span>
                    <div className="flex gap-2">
                      <button onClick={() => toggleCheckItem(item, 'pass')} className={`rounded px-3 py-1 text-sm ${checkResults[item] === 'pass' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>通过</button>
                      <button onClick={() => toggleCheckItem(item, 'fail')} className={`rounded px-3 py-1 text-sm ${checkResults[item] === 'fail' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>异常</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <h4 className="mb-3 font-medium">现场取证材料</h4>
              <div className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-cyan-400">
                <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">点击上传现场照片、病历截图、价格公示资料</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={onBack} className="rounded-lg border px-6 py-2 hover:bg-gray-50">取消</button>
              <button onClick={handleSubmit} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-2 text-white hover:bg-cyan-700"><CheckSquare className="h-4 w-4" />提交检查</button>
            </div>
          </motion.div>
        )}

        {view === 'history' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="rounded-xl border bg-white">
              <div className="border-b p-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full rounded-lg border py-2 pl-10 pr-4" placeholder="搜索单号、机构、地市、检查组" />
                </div>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm">单号</th>
                    <th className="px-4 py-3 text-left text-sm">机构</th>
                    <th className="px-4 py-3 text-left text-sm">地市</th>
                    <th className="px-4 py-3 text-left text-sm">检查日期</th>
                    <th className="px-4 py-3 text-left text-sm">检查组</th>
                    <th className="px-4 py-3 text-left text-sm">问题数</th>
                    <th className="px-4 py-3 text-left text-sm">结果</th>
                    <th className="px-4 py-3 text-right text-sm">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{record.id}</td>
                      <td className="px-4 py-3">{record.institution}</td>
                      <td className="px-4 py-3">{record.city}</td>
                      <td className="px-4 py-3">{record.date}</td>
                      <td className="px-4 py-3">{record.team}</td>
                      <td className="px-4 py-3">{record.issueCount}</td>
                      <td className="px-4 py-3">{record.result}</td>
                      <td className="px-4 py-3 text-right"><button onClick={() => { setSelectedRecord(record); setView('detail'); }} className="rounded p-2 text-cyan-600 hover:bg-cyan-50"><Eye className="h-4 w-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {view === 'detail' && selectedRecord && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="rounded-xl bg-blue-50 p-4">
              <h4 className="mb-2 font-semibold">检查详情</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">单号：</span>{selectedRecord.id}</div>
                <div><span className="text-gray-500">机构：</span>{selectedRecord.institution}</div>
                <div><span className="text-gray-500">地市：</span>{selectedRecord.city}</div>
                <div><span className="text-gray-500">检查日期：</span>{selectedRecord.date}</div>
                <div><span className="text-gray-500">检查组：</span>{selectedRecord.team}</div>
                <div><span className="text-gray-500">检查结果：</span>{selectedRecord.result}</div>
              </div>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <h4 className="mb-2 font-medium">检查摘要</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between rounded bg-white p-2"><span>医保目录执行情况</span><span className="text-green-600">通过</span></div>
                <div className="flex justify-between rounded bg-white p-2"><span>药品使用规范性</span><span className="text-yellow-600">发现 1 项疑点</span></div>
                <div className="flex justify-between rounded bg-white p-2"><span>价格执行与收费合规</span><span className="text-green-600">通过</span></div>
              </div>
            </div>
            <button onClick={() => setView('history')} className="w-full rounded-lg border py-2">返回</button>
          </motion.div>
        )}
      </AnimatePresence>

      {showSuccess && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl bg-white p-6 text-center">
            <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
            <p className="text-lg font-medium">检查提交成功</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
