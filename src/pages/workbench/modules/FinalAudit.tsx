import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, FileText, User, Clock, DollarSign, Shield, Edit3, RotateCcw, Eye } from 'lucide-react';

interface FinalAuditProps {
  onClose: () => void;
  onBack: () => void;
}

interface Application {
  id: string;
  applicant: string;
  type: string;
  applyAmount: number;
  auditAmount: number;
  risk: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  firstAuditor: string;
  firstAuditTime: string;
  firstOpinion: string;
  secondAuditor: string;
  secondAuditTime: string;
  secondOpinion: string;
}

const mockApplications: Application[] = [
  { id: 'FA001', applicant: '王五', type: '住院报销', applyAmount: 25800, auditAmount: 25600, risk: 'low', status: 'pending', firstAuditor: '张初审', firstAuditTime: '2024-01-20 10:30', firstOpinion: '资料齐全，费用合理', secondAuditor: '李复审', secondAuditTime: '2024-01-20 14:20', secondOpinion: '金额核算无误' },
  { id: 'FA002', applicant: '赵六', type: '特殊药品', applyAmount: 15800, auditAmount: 14200, risk: 'medium', status: 'pending', firstAuditor: '王初审', firstAuditTime: '2024-01-20 11:15', firstOpinion: '药品在目录内', secondAuditor: '赵复审', secondAuditTime: '2024-01-20 15:30', secondOpinion: '建议部分拨付' },
  { id: 'FA003', applicant: '孙七', type: '门诊报销', applyAmount: 3200, auditAmount: 3200, risk: 'low', status: 'pending', firstAuditor: '钱初审', firstAuditTime: '2024-01-20 09:00', firstOpinion: '符合报销条件', secondAuditor: '周复审', secondAuditTime: '2024-01-20 13:00', secondOpinion: '同意通过' },
];

export default function FinalAudit({ onBack }: FinalAuditProps) {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [decision, setDecision] = useState<'approve' | 'partial' | 'reject' | 'return' | null>(null);
  const [finalAmount, setFinalAmount] = useState(0);
  const [comment, setComment] = useState('');
  const [signed, setSigned] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [result, setResult] = useState('');

  const handleSelect = (app: Application) => {
    setSelectedApp(app);
    setFinalAmount(app.auditAmount);
    setDecision(null);
    setComment('');
    setSigned(false);
  };

  const handleSubmit = () => {
    if (!decision || !comment || !signed || !selectedApp) return;
    
    const newStatus = decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : decision === 'return' ? 'returned' : 'approved';
    setApplications(prev => prev.filter(a => a.id !== selectedApp.id));
    setResult(decision === 'approve' ? '终审通过' : decision === 'reject' ? '已驳回' : decision === 'return' ? '已退回重审' : '部分拨付');
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedApp(null);
    }, 1500);
  };

  const getRiskBadge = (risk: string) => {
    const styles = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[risk as keyof typeof styles]}`}>{risk === 'low' ? '低风险' : risk === 'medium' ? '中风险' : '高风险'}</span>;
  };

  if (showDetail && selectedApp) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <h3 className="text-xl font-bold">终审详情 - {selectedApp.id}</h3>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div><span className="text-gray-500">申请人:</span> {selectedApp.applicant}</div>
            <div><span className="text-gray-500">类型:</span> {selectedApp.type}</div>
            <div><span className="text-gray-500">申请金额:</span> ¥{selectedApp.applyAmount.toLocaleString()}</div>
            <div><span className="text-gray-500">风险等级:</span> {getRiskBadge(selectedApp.risk)}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <h4 className="font-bold mb-3">审核链路</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">初</div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-medium">初审</span><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">通过</span></div>
                <div className="text-sm text-gray-500">{selectedApp.firstAuditor} · {selectedApp.firstAuditTime}</div>
                <p className="text-sm text-gray-600 mt-1">{selectedApp.firstOpinion}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold">复</div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-medium">复审</span><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">通过</span></div>
                <div className="text-sm text-gray-500">{selectedApp.secondAuditor} · {selectedApp.secondAuditTime}</div>
                <p className="text-sm text-gray-600 mt-1">{selectedApp.secondOpinion}</p>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => setShowDetail(false)} className="w-full py-2 bg-gray-100 rounded-lg">返回</button>
      </div>
    );
  }

  if (selectedApp) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
            <h3 className="text-xl font-bold">终审审核</h3>
          </div>
          <button onClick={() => setShowDetail(true)} className="flex items-center gap-1 px-3 py-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg"><Eye className="w-4 h-4" />查看详情</button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border"><div className="text-sm text-gray-500 mb-1">申请金额</div><div className="text-xl font-bold">¥{selectedApp.applyAmount.toLocaleString()}</div></div>
          <div className="bg-white rounded-xl p-4 shadow-sm border"><div className="text-sm text-gray-500 mb-1">已审核金额</div><div className="text-xl font-bold">¥{selectedApp.auditAmount.toLocaleString()}</div></div>
          <div className="bg-white rounded-xl p-4 shadow-sm border"><div className="text-sm text-gray-500 mb-1">拟拨付金额</div><div className="text-xl font-bold text-cyan-600">¥{finalAmount.toLocaleString()}</div></div>
          <div className="bg-white rounded-xl p-4 shadow-sm border"><div className="text-sm text-gray-500 mb-1">风险等级</div><div>{getRiskBadge(selectedApp.risk)}</div></div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h4 className="font-bold mb-3">终审决策</h4>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[{ id: 'approve', label: '同意拨付', icon: CheckCircle, color: 'green' }, { id: 'partial', label: '部分拨付', icon: Edit3, color: 'blue' }, { id: 'reject', label: '拒绝拨付', icon: XCircle, color: 'red' }, { id: 'return', label: '退回重审', icon: RotateCcw, color: 'amber' }].map((opt) => (
              <button key={opt.id} onClick={() => setDecision(opt.id as typeof decision)} className={`p-4 rounded-xl border-2 transition-all ${decision === opt.id ? `border-${opt.color}-500 bg-${opt.color}-50` : 'border-gray-200'}`}>
                <opt.icon className={`w-6 h-6 mx-auto mb-2 ${decision === opt.id ? `text-${opt.color}-500` : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${decision === opt.id ? `text-${opt.color}-700` : 'text-gray-600'}`}>{opt.label}</span>
              </button>
            ))}
          </div>
          {decision === 'partial' && (
            <div className="mb-4"><label className="block text-sm font-medium mb-2">调整拨付金额</label><div className="flex items-center gap-2"><span>¥</span><input type="number" value={finalAmount} onChange={(e) => setFinalAmount(Number(e.target.value))} className="flex-1 px-4 py-2 border rounded-lg" /></div></div>
          )}
          <div className="mb-4"><label className="block text-sm font-medium mb-2">终审意见 <span className="text-red-500">*</span></label><textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="请输入终审意见..." rows={3} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-4">
            <input type="checkbox" id="sign" checked={signed} onChange={(e) => setSigned(e.target.checked)} className="w-4 h-4" />
            <label htmlFor="sign" className="flex items-center gap-2 text-sm"><Shield className="w-4 h-4 text-cyan-600" />本人确认以上审核结果准确无误，同意签章</label>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setSelectedApp(null)} className="px-6 py-2 border rounded-lg">取消</button>
            <button onClick={handleSubmit} disabled={!decision || !comment || !signed} className="px-6 py-2 bg-cyan-600 text-white rounded-lg disabled:opacity-50">确认终审</button>
          </div>
        </div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 text-center"><CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" /><p className="text-lg font-bold">{result}</p></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
        <h3 className="text-xl font-bold">终审审核</h3>
        <span className="text-sm text-gray-500">待终审: {applications.length} 笔</span>
      </div>
      <div className="bg-white rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">单号</th><th className="px-4 py-3 text-left text-sm">申请人</th><th className="px-4 py-3 text-left text-sm">类型</th><th className="px-4 py-3 text-left text-sm">金额</th><th className="px-4 py-3 text-left text-sm">风险</th><th className="px-4 py-3 text-right text-sm">操作</th></tr></thead>
          <tbody className="divide-y">
            {applications.map(app => (
              <tr key={app.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleSelect(app)}>
                <td className="px-4 py-3 font-medium">{app.id}</td>
                <td className="px-4 py-3">{app.applicant}</td>
                <td className="px-4 py-3">{app.type}</td>
                <td className="px-4 py-3">¥{app.auditAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{getRiskBadge(app.risk)}</td>
                <td className="px-4 py-3 text-right"><button className="px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-sm">审核</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
