import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Clock, User, FileText, Shield, History, Search, Eye } from 'lucide-react';

interface AuditItem {
  id: string;
  applicant: string;
  idCard: string;
  insuranceType: string;
  amount: number;
  submitTime: string;
  priority: 'high' | 'normal' | 'low';
  status: 'pending' | 'approved' | 'rejected' | 'transferred';
  hospital: string;
  department: string;
  doctor: string;
}

const mockData: AuditItem[] = [
  { id: 'CX20240120001', applicant: '张建国', idCard: '110101196503152345', insuranceType: '城镇职工医保', amount: 5680.5, submitTime: '2024-01-20 09:30', priority: 'high', status: 'pending', hospital: '北京协和医院', department: '心内科', doctor: '李医生' },
  { id: 'CX20240120002', applicant: '王秀英', idCard: '110101197208204567', insuranceType: '城乡居民医保', amount: 3250.0, submitTime: '2024-01-20 10:15', priority: 'normal', status: 'pending', hospital: '北京大学人民医院', department: '骨科', doctor: '张医生' },
  { id: 'CX20240120003', applicant: '刘明华', idCard: '110101198511103456', insuranceType: '城镇职工医保', amount: 12800.0, submitTime: '2024-01-20 11:00', priority: 'high', status: 'pending', hospital: '北京天坛医院', department: '神经外科', doctor: '王医生' },
];

const feeDetailsMap: Record<string, any[]> = {
  'CX20240120001': [
    { name: '阿托伐他汀钙片', spec: '20mg*7片', quantity: 4, unitPrice: 45.5, amount: 182.0, category: '西药费' },
    { name: '心电图检查', spec: '常规', quantity: 1, unitPrice: 35.0, amount: 35.0, category: '检查费' },
  ],
  'CX20240120002': [
    { name: '骨科手术费', spec: '常规', quantity: 1, unitPrice: 2800.0, amount: 2800.0, category: '手术费' },
    { name: '床位费', spec: '普通病房', quantity: 3, unitPrice: 80.0, amount: 240.0, category: '床位费' },
  ],
  'CX20240120003': [
    { name: 'CT检查', spec: '头部', quantity: 1, unitPrice: 800.0, amount: 800.0, category: '检查费' },
    { name: '药品费', spec: '多种', quantity: 1, unitPrice: 12000.0, amount: 12000.0, category: '西药费' },
  ],
};

const historyMap: Record<string, any[]> = {
  'CX20240120001': [
    { time: '2024-01-20 09:30', action: '提交申请', operator: '张建国', status: 'success' },
    { time: '2024-01-20 09:35', action: '系统初审', operator: '智能审核', status: 'warning' },
  ],
  'CX20240120002': [
    { time: '2024-01-20 10:15', action: '提交申请', operator: '王秀英', status: 'success' },
    { time: '2024-01-20 10:20', action: '系统初审', operator: '智能审核', status: 'success' },
  ],
  'CX20240120003': [
    { time: '2024-01-20 11:00', action: '提交申请', operator: '刘明华', status: 'success' },
    { time: '2024-01-20 11:05', action: '系统初审', operator: '智能审核', status: 'warning' },
  ],
};

export default function FirstAudit({ onBack }: { onBack: () => void }) {
  const [selectedId, setSelectedId] = useState<string>(mockData[0]?.id);
  const [auditComment, setAuditComment] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [data, setData] = useState(mockData);
  const [message, setMessage] = useState('');

  const selectedItem = data.find(item => item.id === selectedId);
  const feeDetails = feeDetailsMap[selectedId] || [];
  const historyRecords = historyMap[selectedId] || [];

  const handleAudit = (action: 'approve' | 'reject' | 'transfer') => {
    if (!auditComment.trim()) {
      setMessage('请先填写审核意见');
      return;
    }
    const newStatus = action === 'approve' ? 'transferred' : action === 'reject' ? 'rejected' : 'transferred';
    setData(data.map(item => item.id === selectedId ? { ...item, status: newStatus } : item));
    setMessage(action === 'approve' ? '已通过并转复审' : action === 'reject' ? '已驳回' : '已转复审');
    setAuditComment('');
    setTimeout(() => setMessage(''), 2000);
  };

  const getPriorityBadge = (priority: string) => {
    const styles = { high: 'bg-red-100 text-red-700', normal: 'bg-blue-100 text-blue-700', low: 'bg-gray-100 text-gray-600' };
    const labels = { high: '紧急', normal: '普通', low: '一般' };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[priority as keyof typeof styles]}`}>{labels[priority as keyof typeof labels]}</span>;
  };

  if (showDetail && selectedItem) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <h3 className="text-xl font-bold">单据详情 - {selectedItem.id}</h3>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">申请人：</span>{selectedItem.applicant}</div>
            <div><span className="text-gray-500">身份证号：</span>{selectedItem.idCard}</div>
            <div><span className="text-gray-500">参保类型：</span>{selectedItem.insuranceType}</div>
            <div><span className="text-gray-500">就诊医院：</span>{selectedItem.hospital}</div>
            <div><span className="text-gray-500">科室：</span>{selectedItem.department}</div>
            <div><span className="text-gray-500">金额：</span>¥{selectedItem.amount.toLocaleString()}</div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <h4 className="font-medium mb-2">费用明细</h4>
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left">项目</th><th className="px-3 py-2 text-right">金额</th></tr></thead>
            <tbody>
              {feeDetails.map((fee, idx) => (
                <tr key={idx} className="border-t"><td className="px-3 py-2">{fee.name}</td><td className="px-3 py-2 text-right">¥{fee.amount}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
        <h3 className="text-xl font-bold">初审审核</h3>
        {message && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{message}</span>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 space-y-2">
          {data.filter(i => i.status === 'pending').map((item) => (
            <button key={item.id} onClick={() => setSelectedId(item.id)} className={`w-full p-3 rounded-lg text-left border ${selectedId === item.id ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}>
              <div className="flex justify-between"><span className="font-medium">{item.id}</span>{getPriorityBadge(item.priority)}</div>
              <div className="text-sm text-gray-600">{item.applicant} · ¥{item.amount}</div>
            </button>
          ))}
        </div>

        <div className="col-span-2 space-y-4">
          {selectedItem && (
            <>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-lg">{selectedItem.applicant}</div>
                    <div className="text-sm text-gray-500">{selectedItem.idCard}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">¥{selectedItem.amount.toLocaleString()}</div>
                    <button onClick={() => setShowDetail(true)} className="text-sm text-cyan-600 flex items-center gap-1 mt-1"><Eye className="w-4 h-4" />查看详情</button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-3 text-sm">
                  <div><span className="text-gray-500">医院：</span>{selectedItem.hospital}</div>
                  <div><span className="text-gray-500">科室：</span>{selectedItem.department}</div>
                  <div><span className="text-gray-500">医生：</span>{selectedItem.doctor}</div>
                  <div><span className="text-gray-500">参保：</span>{selectedItem.insuranceType}</div>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2"><FileText className="w-4 h-4" />费用明细</h4>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left">项目</th><th className="px-3 py-2 text-left">规格</th><th className="px-3 py-2 text-right">金额</th></tr></thead>
                  <tbody>
                    {feeDetails.map((fee, idx) => (
                      <tr key={idx} className="border-t"><td className="px-3 py-2">{fee.name}</td><td className="px-3 py-2 text-gray-500">{fee.spec}</td><td className="px-3 py-2 text-right">¥{fee.amount}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-lg border p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2"><History className="w-4 h-4" />审核历史</h4>
                <div className="space-y-2">
                  {historyRecords.map((r, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-gray-500">{r.time}</span>
                      <span>{r.action}</span>
                      <span className="text-gray-400">{r.operator}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg border p-4">
                <label className="block text-sm font-medium mb-2">审核意见 *</label>
                <textarea value={auditComment} onChange={(e) => setAuditComment(e.target.value)} placeholder="请输入审核意见..." className="w-full h-20 px-3 py-2 border rounded-lg resize-none" />
              </div>

              <div className="flex gap-3">
                <button onClick={() => handleAudit('transfer')} className="flex-1 py-2 border rounded-lg">转复审</button>
                <button onClick={() => handleAudit('reject')} className="flex-1 py-2 border border-red-300 text-red-600 rounded-lg">驳回</button>
                <button onClick={() => handleAudit('approve')} className="flex-1 py-2 bg-blue-600 text-white rounded-lg">通过</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
