import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Filter, Download, Eye, X, CheckCircle, Clock, XCircle, FileText, User, DollarSign } from 'lucide-react';

interface AuditRecord {
  id: string;
  applicant: string;
  type: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  level: string;
  auditor: string;
  submitTime: string;
  hospital?: string;
  diagnosis?: string;
  items?: { name: string; price: number; qty: number }[];
}

const mockData: AuditRecord[] = [
  { id: 'A001', applicant: '张三', type: '门诊报销', amount: 580, status: 'pending', level: '初审', auditor: '李审核', submitTime: '2024-01-20', hospital: '市人民医院', diagnosis: '急性上呼吸道感染', items: [{ name: '头孢克洛胶囊', price: 45, qty: 2 }, { name: '诊疗费', price: 15, qty: 1 }] },
  { id: 'A002', applicant: '李四', type: '住院报销', amount: 12500, status: 'approved', level: '终审', auditor: '王审核', submitTime: '2024-01-19', hospital: '省立医院', diagnosis: '腰椎间盘突出', items: [{ name: '床位费', price: 80, qty: 7 }, { name: '手术费', price: 8000, qty: 1 }] },
  { id: 'A003', applicant: '王五', type: '特殊药品', amount: 3200, status: 'rejected', level: '初审', auditor: '赵审核', submitTime: '2024-01-18', hospital: '肿瘤医院', diagnosis: '恶性肿瘤', items: [{ name: '靶向药A', price: 3200, qty: 1 }] },
];

export default function AuditQuery({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);

  const filteredData = mockData.filter(item =>
    item.applicant.includes(searchTerm) || item.id.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    const styles = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };
    const labels = { pending: '待审核', approved: '已通过', rejected: '已驳回' };
    const icons = { pending: Clock, approved: CheckCircle, rejected: XCircle };
    const Icon = icons[status as keyof typeof icons];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />{labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <h3 className="text-xl font-bold">审核查询</h3>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"><Download className="w-4 h-4" />导出</button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索单号或姓名..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>
      </div>

      <div className="bg-white rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">单号</th>
              <th className="px-4 py-3 text-left text-sm font-medium">申请人</th>
              <th className="px-4 py-3 text-left text-sm font-medium">类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium">金额</th>
              <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
              <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-cyan-600">{item.id}</td>
                <td className="px-4 py-3">{item.applicant}</td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3 font-medium">¥{item.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setSelectedRecord(item)} className="p-2 text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedRecord && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecord(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-lg font-bold">单据详情 - {selectedRecord.id}</h3>
                <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm text-gray-500">申请人</label><div className="font-medium">{selectedRecord.applicant}</div></div>
                  <div><label className="text-sm text-gray-500">就诊医院</label><div className="font-medium">{selectedRecord.hospital}</div></div>
                  <div><label className="text-sm text-gray-500">诊断</label><div className="font-medium">{selectedRecord.diagnosis}</div></div>
                  <div><label className="text-sm text-gray-500">金额</label><div className="font-medium text-cyan-600">¥{selectedRecord.amount.toLocaleString()}</div></div>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">费用明细</label>
                  <table className="w-full border rounded-lg text-sm">
                    <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left">项目</th><th className="px-4 py-2 text-right">单价</th><th className="px-4 py-2 text-right">数量</th><th className="px-4 py-2 text-right">金额</th></tr></thead>
                    <tbody>
                      {selectedRecord.items?.map((item, i) => (
                        <tr key={i} className="border-t"><td className="px-4 py-2">{item.name}</td><td className="px-4 py-2 text-right">¥{item.price}</td><td className="px-4 py-2 text-right">{item.qty}</td><td className="px-4 py-2 text-right">¥{item.price * item.qty}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">审核流程</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded"><CheckCircle className="w-4 h-4 text-green-500" /><span>提交申请</span><span className="text-gray-400 text-sm">2024-01-20 09:30</span></div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded"><Clock className="w-4 h-4 text-blue-500" /><span>初审审核</span><span className="text-gray-400 text-sm">{selectedRecord.auditor}</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
