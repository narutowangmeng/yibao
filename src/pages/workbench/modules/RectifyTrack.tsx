import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Eye, X, Search } from 'lucide-react';

interface RectifyItem {
  id: string;
  institution: string;
  city: string;
  issue: string;
  deadline: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed';
  description: string;
  measures: string[];
  owner: string;
}

const mockData: RectifyItem[] = [
  { id: 'RT320001', institution: '江苏省人民医院', city: '南京', issue: '过度医疗', deadline: '2026-05-15', progress: 60, status: 'processing', description: '存在过度检查、超适应症耗材使用问题。', measures: ['规范诊疗流程', '加强医师培训', '建立科室审核机制'], owner: '周岚' },
  { id: 'RT320002', institution: '苏州雷允上双通道药房', city: '苏州', issue: '串换药品', deadline: '2026-05-20', progress: 30, status: 'pending', description: '双通道药品编码与结算药品信息不一致。', measures: ['核查销售记录', '完善审方留痕', '整改库存台账'], owner: '陆敏' },
  { id: 'RT320003', institution: '无锡市人民医院', city: '无锡', issue: '虚假住院', deadline: '2026-05-10', progress: 100, status: 'completed', description: '住院指征不足仍发生医保结算。', measures: ['完善入院审核', '重审住院标准'], owner: '钱莉' },
  { id: 'RT320004', institution: '常州市第二人民医院', city: '常州', issue: '分解收费', deadline: '2026-05-18', progress: 75, status: 'processing', description: '检查项目拆分计费，高于标准执行。', measures: ['统一价格目录', '复核收费模板'], owner: '蒋雯' },
];

export default function RectifyTrack({ onBack }: { onBack: () => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [data, setData] = useState(mockData);
  const [showDetail, setShowDetail] = useState(false);
  const [keyword, setKeyword] = useState('');

  const filteredData = useMemo(
    () => data.filter((item) => [item.id, item.institution, item.city, item.issue, item.owner].some((field) => field.includes(keyword))),
    [data, keyword],
  );

  const selectedItem = data.find((item) => item.id === selectedId);

  const getStatusBadge = (status: RectifyItem['status']) => {
    const styles = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' };
    const labels = { pending: '待整改', processing: '整改中', completed: '已完成' };
    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const handleView = (id: string) => {
    setSelectedId(id);
    setShowDetail(true);
  };

  const handleProgressUpdate = (newProgress: number) => {
    if (!selectedId) return;
    setData((prev) => prev.map((item) => item.id === selectedId ? { ...item, progress: newProgress, status: newProgress === 100 ? 'completed' : newProgress > 0 ? 'processing' : 'pending' } : item));
  };

  const handleComplete = () => {
    if (!selectedId) return;
    setData((prev) => prev.map((item) => item.id === selectedId ? { ...item, progress: 100, status: 'completed' } : item));
    setShowDetail(false);
    setSelectedId(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100"><ArrowLeft className="h-5 w-5" /></button>
        <h3 className="text-xl font-bold">整改跟踪</h3>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full rounded-lg border py-2 pl-10 pr-4" placeholder="搜索单号、机构、地市、问题、负责人" />
      </div>

      <div className="space-y-3">
        {filteredData.map((item) => (
          <div key={item.id} className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{item.institution}</div>
                <div className="text-sm text-gray-500">{item.city} · {item.issue} · 截止 {item.deadline}</div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(item.status)}
                <button onClick={() => handleView(item.id)} className="rounded p-2 text-cyan-600 hover:bg-cyan-50"><Eye className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="mt-2">
              <div className="h-2 rounded-full bg-gray-200"><div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${item.progress}%` }} /></div>
              <div className="mt-1 text-xs text-gray-500">进度 {item.progress}% · 负责人 {item.owner}</div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showDetail && selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-white">
              <div className="flex items-center justify-between border-b p-6">
                <h4 className="text-lg font-bold">整改详情</h4>
                <button onClick={() => { setShowDetail(false); setSelectedId(null); }} className="rounded p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4 p-6">
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="text-lg font-medium">{selectedItem.institution}</div>
                  <div className="mt-1 text-sm text-gray-600">{selectedItem.city} · {selectedItem.issue}</div>
                  <div className="mt-2 text-sm text-gray-500">{selectedItem.description}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><span className="text-gray-500">整改单号：</span>{selectedItem.id}</div>
                  <div><span className="text-gray-500">截止日期：</span>{selectedItem.deadline}</div>
                  <div><span className="text-gray-500">负责人：</span>{selectedItem.owner}</div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">整改进度</label>
                  <div className="h-3 rounded-full bg-gray-200"><div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${selectedItem.progress}%` }} /></div>
                  <div className="mt-1 text-sm text-gray-500">{selectedItem.progress}%</div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">更新进度</label>
                  <div className="flex gap-2">
                    {[0, 25, 50, 75, 100].map((p) => <button key={p} onClick={() => handleProgressUpdate(p)} className={`flex-1 rounded-lg py-2 text-sm ${selectedItem.progress === p ? 'bg-cyan-600 text-white' : 'bg-gray-100'}`}>{p}%</button>)}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">整改措施</label>
                  <div className="space-y-2">
                    {selectedItem.measures.map((item) => <div key={item} className="flex items-center gap-2 rounded bg-gray-50 p-2"><CheckCircle className="h-4 w-4 text-green-600" /><span className="text-sm">{item}</span></div>)}
                  </div>
                </div>
                {selectedItem.status !== 'completed' && <button onClick={handleComplete} className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-white"><CheckCircle className="h-4 w-4" />确认整改完成</button>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
