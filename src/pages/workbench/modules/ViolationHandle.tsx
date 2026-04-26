import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldAlert, Eye, CheckCircle, Ban, RotateCcw, History, X, FileText, Building2, Calendar, AlertTriangle } from 'lucide-react';

interface Violation {
  id: string;
  institution: string;
  type: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed';
  date: string;
  description: string;
  evidence: string[];
}

const mockViolations: Violation[] = [
  { id: 'V001', institution: '南京某医院', type: '过度医疗', amount: 45000, status: 'pending', date: '2024-01-20', description: '存在不必要的检查项目，涉及金额较大', evidence: ['检查报告', '病历记录'] },
  { id: 'V002', institution: '苏州某诊所', type: '虚假住院', amount: 120000, status: 'processing', date: '2024-01-19', description: '虚构住院记录骗取医保基金', evidence: ['住院记录', '费用清单'] },
  { id: 'V003', institution: '无锡某药店', type: '串换药品', amount: 28000, status: 'completed', date: '2024-01-18', description: '将非医保药品串换为医保药品报销', evidence: ['销售记录', '药品清单'] },
];

const violationTypes = [
  { id: 'over', label: '过度医疗', color: 'bg-red-100 text-red-700' },
  { id: 'fake', label: '虚假住院', color: 'bg-orange-100 text-orange-700' },
  { id: 'swap', label: '串换药品', color: 'bg-yellow-100 text-yellow-700' },
];

export default function ViolationHandle({ onBack }: { onBack: () => void }) {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [violations, setViolations] = useState<Violation[]>(mockViolations);
  const [showDetail, setShowDetail] = useState(false);
  const [toast, setToast] = useState('');

  const filteredData = selectedType === 'all' ? violations : violations.filter(v => v.type === violationTypes.find(t => t.id === selectedType)?.label);
  const selectedData = violations.find(v => v.id === selectedId);

  const handleView = (id: string) => {
    setSelectedId(id);
    setShowDetail(true);
  };

  const handleAction = (action: string) => {
    if (!selectedId) return;
    
    setViolations(prev => prev.map(v => {
      if (v.id === selectedId) {
        return { ...v, status: action === 'complete' ? 'completed' : action === 'punish' ? 'completed' : 'processing' };
      }
      return v;
    }));
    
    const messages: Record<string, string> = {
      complete: '整改完成已确认',
      punish: '处罚已执行',
      recheck: '已发起重新核查',
    };
    setToast(messages[action] || '操作成功');
    setTimeout(() => setToast(''), 2000);
    setShowDetail(false);
  };

  const getStatusBadge = (status: string) => {
    const styles = { pending: 'bg-red-100 text-red-700', processing: 'bg-yellow-100 text-yellow-700', completed: 'bg-green-100 text-green-700' };
    const labels = { pending: '待处理', processing: '整改中', completed: '已处罚' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
        <h3 className="text-xl font-bold">违规查处</h3>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setSelectedType('all')} className={`px-4 py-2 rounded-lg text-sm ${selectedType === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>全部</button>
        {violationTypes.map(t => (
          <button key={t.id} onClick={() => setSelectedType(t.id)} className={`px-4 py-2 rounded-lg text-sm ${selectedType === t.id ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>{t.label}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">单号</th><th className="px-4 py-3 text-left text-sm">类型</th><th className="px-4 py-3 text-left text-sm">机构</th><th className="px-4 py-3 text-left text-sm">金额</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-right text-sm">操作</th></tr></thead>
          <tbody className="divide-y">
            {filteredData.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.id}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${violationTypes.find(t => t.label === item.type)?.color || 'bg-gray-100'}`}>{item.type}</span></td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3">¥{item.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => handleView(item.id)} className="p-2 text-gray-400 hover:text-red-600"><Eye className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showDetail && selectedData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDetail(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-600" />违规详情</h4>
                  <button onClick={() => setShowDetail(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 rounded-lg"><div className="text-sm text-red-600 font-medium">违规类型</div><div className="text-sm">{selectedData.type}</div></div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-400" /><span className="text-gray-500">机构:</span> {selectedData.institution}</div>
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /><span className="text-gray-500">日期:</span> {selectedData.date}</div>
                    <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-gray-400" /><span className="text-gray-500">金额:</span> ¥{selectedData.amount.toLocaleString()}</div>
                    <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /><span className="text-gray-500">单号:</span> {selectedData.id}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg"><div className="text-sm font-medium mb-1">违规描述</div><div className="text-sm text-gray-600">{selectedData.description}</div></div>
                  <div className="p-3 bg-gray-50 rounded-lg"><div className="text-sm font-medium mb-1">证据材料</div><div className="flex gap-2">{selectedData.evidence.map((e, i) => <span key={i} className="px-2 py-1 bg-white rounded text-xs border">{e}</span>)}</div></div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleAction('complete')} className="flex items-center justify-center gap-1 p-2 bg-green-50 text-green-600 rounded text-sm hover:bg-green-100"><CheckCircle className="w-4 h-4" />整改完成</button>
                    <button onClick={() => handleAction('punish')} className="flex items-center justify-center gap-1 p-2 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100"><Ban className="w-4 h-4" />处罚</button>
                    <button onClick={() => handleAction('recheck')} className="flex items-center justify-center gap-1 p-2 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100"><RotateCcw className="w-4 h-4" />重新核查</button>
                    <button className="flex items-center justify-center gap-1 p-2 bg-gray-50 text-gray-600 rounded text-sm hover:bg-gray-100"><History className="w-4 h-4" />历史记录</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
