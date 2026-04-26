import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Eye, MessageSquare, User, Clock, FileText, RotateCcw, Flag, Users } from 'lucide-react';

interface AuditItem {
  id: string;
  applicant: string;
  type: string;
  amount: number;
  firstAuditor: string;
  firstAuditTime: string;
  firstOpinion: string;
  status: 'pending' | 'approved' | 'rejected';
  riskLevel: 'low' | 'medium' | 'high';
  flagged: boolean;
  hospital: string;
  department: string;
  doctor: string;
}

const mockData: AuditItem[] = [
  { id: 'SA001', applicant: '张三', type: '门诊报销', amount: 580, firstAuditor: '李初审', firstAuditTime: '2024-01-20 10:30', firstOpinion: '资料齐全，费用合理，建议通过', status: 'pending', riskLevel: 'low', flagged: false, hospital: '南京市第一医院', department: '心内科', doctor: '王医生' },
  { id: 'SA002', applicant: '李四', type: '住院报销', amount: 12500, firstAuditor: '王初审', firstAuditTime: '2024-01-20 11:15', firstOpinion: '费用较高，需复审确认', status: 'pending', riskLevel: 'medium', flagged: true, hospital: '苏州大学附属医院', department: '骨科', doctor: '张医生' },
  { id: 'SA003', applicant: '王五', type: '特殊药品', amount: 3200, firstAuditor: '赵初审', firstAuditTime: '2024-01-20 09:45', firstOpinion: '药品在目录内，用量正常', status: 'pending', riskLevel: 'low', flagged: false, hospital: '无锡市人民医院', department: '肿瘤科', doctor: '李医生' },
  { id: 'SA004', applicant: '赵六', type: '门诊报销', amount: 890, firstAuditor: '李初审', firstAuditTime: '2024-01-20 14:20', firstOpinion: '发票存疑，需进一步核实', status: 'pending', riskLevel: 'high', flagged: true, hospital: '常州市中医院', department: '内科', doctor: '陈医生' },
];

export default function SecondAudit({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<AuditItem[]>(mockData);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reviewOpinion, setReviewOpinion] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [toast, setToast] = useState('');

  const selectedItem = data.find(item => item.id === selectedId);

  const handleItemSelect = (id: string) => {
    if (batchMode) {
      setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setSelectedId(id);
      setShowDetail(true);
    }
  };

  const handleAudit = (action: 'pass' | 'return' | 'reject') => {
    if (!reviewOpinion.trim()) {
      setToast('请输入复审意见');
      setTimeout(() => setToast(''), 2000);
      return;
    }
    const actionText = action === 'pass' ? '通过并转终审' : action === 'return' ? '退回初审' : '驳回申请';
    setToast(`${actionText}成功`);
    setTimeout(() => {
      setData(prev => prev.filter(item => item.id !== selectedId));
      setShowDetail(false);
      setSelectedId(null);
      setReviewOpinion('');
      setToast('');
    }, 1500);
  };

  const handleBatchAction = (action: 'pass' | 'return') => {
    if (selectedItems.length === 0) {
      setToast('请先选择单据');
      setTimeout(() => setToast(''), 2000);
      return;
    }
    const actionText = action === 'pass' ? '批量通过' : '批量退回';
    setToast(`${actionText} ${selectedItems.length} 条记录成功`);
    setTimeout(() => {
      setData(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      setToast('');
    }, 1500);
  };

  const getRiskBadge = (level: string) => {
    const styles = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700' };
    const labels = { low: '低风险', medium: '中风险', high: '高风险' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[level as keyof typeof styles]}`}>{labels[level as keyof typeof labels]}</span>;
  };

  if (showDetail && selectedItem) {
    return (
      <div className="p-6 space-y-4">
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            {toast}
          </motion.div>
        )}
        <div className="flex items-center gap-4">
          <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold">复审详情 - {selectedItem.id}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border p-4">
            <h4 className="font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-cyan-600" /> 单据信息</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">申请人</span><span className="font-medium">{selectedItem.applicant}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">报销类型</span><span className="font-medium">{selectedItem.type}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">就诊医院</span><span className="font-medium">{selectedItem.hospital}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">科室</span><span className="font-medium">{selectedItem.department}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">申请金额</span><span className="font-medium text-lg text-cyan-600">¥{selectedItem.amount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">风险等级</span>{getRiskBadge(selectedItem.riskLevel)}</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
            <h4 className="font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-blue-600" /> 初审结果</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">初审人</span><span className="font-medium flex items-center gap-1"><User className="w-4 h-4" />{selectedItem.firstAuditor}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">初审时间</span><span className="font-medium flex items-center gap-1"><Clock className="w-4 h-4" />{selectedItem.firstAuditTime}</span></div>
              <div className="pt-2 border-t border-blue-200"><span className="text-gray-500">初审意见</span><p className="mt-1 text-gray-700 bg-white p-2 rounded">{selectedItem.firstOpinion}</p></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h4 className="font-bold mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-cyan-600" /> 复审意见</h4>
          <textarea value={reviewOpinion} onChange={(e) => setReviewOpinion(e.target.value)} placeholder="请输入复审意见..." className="w-full h-20 p-3 border rounded-lg resize-none" />
          <div className="flex gap-3 mt-4">
            <button onClick={() => handleAudit('pass')} className="flex-1 py-2 bg-emerald-500 text-white rounded-lg flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> 通过并转终审</button>
            <button onClick={() => handleAudit('return')} className="flex-1 py-2 bg-orange-500 text-white rounded-lg flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> 退回初审</button>
            <button onClick={() => handleAudit('reject')} className="flex-1 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center gap-2"><XCircle className="w-4 h-4" /> 驳回申请</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </motion.div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <h3 className="text-xl font-bold">复审审核</h3>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setBatchMode(!batchMode)} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${batchMode ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100'}`}>
            <Users className="w-4 h-4" /> {batchMode ? '退出批量' : '批量复审'}
          </button>
          <span className="text-sm text-gray-500">待复审: {data.length} 条</span>
        </div>
      </div>

      {batchMode && selectedItems.length > 0 && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-cyan-800 font-medium">已选择 {selectedItems.length} 条记录</span>
          <div className="flex gap-2">
            <button onClick={() => handleBatchAction('pass')} className="px-4 py-2 bg-emerald-500 text-white rounded-lg flex items-center gap-1"><CheckCircle className="w-4 h-4" /> 批量通过</button>
            <button onClick={() => handleBatchAction('return')} className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-1"><RotateCcw className="w-4 h-4" /> 批量退回</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {batchMode && <th className="px-4 py-3 text-left"><input type="checkbox" checked={selectedItems.length === data.length && data.length > 0} onChange={() => setSelectedItems(selectedItems.length === data.length ? [] : data.map(d => d.id))} className="rounded" /></th>}
              <th className="px-4 py-3 text-left text-sm font-medium">单号</th>
              <th className="px-4 py-3 text-left text-sm font-medium">申请人</th>
              <th className="px-4 py-3 text-left text-sm font-medium">类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium">金额</th>
              <th className="px-4 py-3 text-left text-sm font-medium">初审人</th>
              <th className="px-4 py-3 text-left text-sm font-medium">风险等级</th>
              <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((item) => (
              <tr key={item.id} className={`hover:bg-gray-50 ${selectedItems.includes(item.id) ? 'bg-cyan-50' : ''}`}>
                {batchMode && <td className="px-4 py-3"><input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => handleItemSelect(item.id)} className="rounded" /></td>}
                <td className="px-4 py-3 font-medium">{item.id}</td>
                <td className="px-4 py-3">{item.applicant}</td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3 font-medium text-cyan-600">¥{item.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.firstAuditor}</td>
                <td className="px-4 py-3">{getRiskBadge(item.riskLevel)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => handleItemSelect(item.id)} className="flex items-center gap-1 px-3 py-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg"><Eye className="w-4 h-4" /> 查看</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
