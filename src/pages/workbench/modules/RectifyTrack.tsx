import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, Eye, Calendar, FileText, X } from 'lucide-react';

interface RectifyItem {
  id: string;
  institution: string;
  issue: string;
  deadline: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed';
  description: string;
  measures: string[];
}

const mockData: RectifyItem[] = [
  { id: 'R001', institution: '南京某医院', issue: '过度医疗', deadline: '2024-02-15', progress: 60, status: 'processing', description: '存在过度检查、过度用药问题', measures: ['规范诊疗流程', '加强医生培训', '建立审核机制'] },
  { id: 'R002', institution: '苏州某诊所', issue: '虚假住院', deadline: '2024-02-20', progress: 30, status: 'pending', description: '涉嫌虚构住院记录', measures: ['核查住院记录', '完善登记制度'] },
  { id: 'R003', institution: '无锡某药店', issue: '串换药品', deadline: '2024-01-30', progress: 100, status: 'completed', description: '将非医保药品串换为医保药品', measures: ['加强药品管理', '完善进销存系统'] },
];

export default function RectifyTrack({ onBack }: { onBack: () => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [data, setData] = useState(mockData);
  const [showDetail, setShowDetail] = useState(false);

  const selectedItem = data.find(item => item.id === selectedId);

  const getStatusBadge = (status: string) => {
    const styles = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' };
    const labels = { pending: '待整改', processing: '整改中', completed: '已完成' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  const handleView = (id: string) => {
    setSelectedId(id);
    setShowDetail(true);
  };

  const handleProgressUpdate = (newProgress: number) => {
    if (!selectedId) return;
    setData(prev => prev.map(item => item.id === selectedId ? { ...item, progress: newProgress, status: newProgress === 100 ? 'completed' : newProgress > 0 ? 'processing' : 'pending' } : item));
  };

  const handleComplete = () => {
    if (!selectedId) return;
    setData(prev => prev.map(item => item.id === selectedId ? { ...item, progress: 100, status: 'completed' } : item));
    setShowDetail(false);
    setSelectedId(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
        <h3 className="text-xl font-bold">整改跟踪</h3>
      </div>

      <div className="space-y-3">
        {data.map(item => (
          <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{item.institution}</div>
                <div className="text-sm text-gray-500">{item.issue} · 截止: {item.deadline}</div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(item.status)}
                <button onClick={() => handleView(item.id)} className="p-2 text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full"><div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${item.progress}%` }} /></div>
              <div className="text-xs text-gray-500 mt-1">进度 {item.progress}%</div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showDetail && selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <h4 className="text-lg font-bold">整改详情</h4>
                <button onClick={() => { setShowDetail(false); setSelectedId(null); }} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="font-medium text-lg">{selectedItem.institution}</div>
                  <div className="text-sm text-gray-600 mt-1">{selectedItem.issue}</div>
                  <div className="text-sm text-gray-500 mt-2">{selectedItem.description}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">整改进度</label>
                  <div className="h-3 bg-gray-200 rounded-full"><div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${selectedItem.progress}%` }} /></div>
                  <div className="text-sm text-gray-500 mt-1">{selectedItem.progress}%</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">更新进度</label>
                  <div className="flex gap-2">
                    {[0, 25, 50, 75, 100].map(p => (
                      <button key={p} onClick={() => handleProgressUpdate(p)} className={`flex-1 py-2 rounded-lg text-sm ${selectedItem.progress === p ? 'bg-cyan-600 text-white' : 'bg-gray-100'}`}>{p}%</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">整改措施</label>
                  <div className="space-y-2">
                    {selectedItem.measures.map((m, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded"><CheckCircle className="w-4 h-4 text-green-600" /><span className="text-sm">{m}</span></div>
                    ))}
                  </div>
                </div>
                {selectedItem.status !== 'completed' && (
                  <button onClick={handleComplete} className="w-full py-3 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" />确认整改完成</button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
