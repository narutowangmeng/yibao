import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, CheckCircle, Clock, AlertCircle, History, CreditCard, FileText, User, Calendar, DollarSign } from 'lucide-react';

interface RefundRecord {
  id: string;
  name: string;
  idCard: string;
  applyDate: string;
  refundAmount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  account: string;
  bank: string;
}

export default function RefundProcess({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {
  const handleClose = onClose || onBack || (() => {});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<RefundRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    idCard: '',
    reason: '',
    amount: '',
    account: '',
    bank: '',
    remark: ''
  });

  const refundRecords: RefundRecord[] = [
    { id: '1', name: '张三', idCard: '320101199001011234', applyDate: '2024-01-15', refundAmount: 2500, reason: '多缴费用', status: 'pending', account: '6222021234567890123', bank: '工商银行' },
    { id: '2', name: '李四', idCard: '320101198505056789', applyDate: '2024-01-14', refundAmount: 1800, reason: '重复缴费', status: 'approved', account: '6227001234567890456', bank: '建设银行' },
    { id: '3', name: '王五', idCard: '320101199212123456', applyDate: '2024-01-13', refundAmount: 3200, reason: '缴费基数调整', status: 'completed', account: '6228481234567890789', bank: '农业银行' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: '待审批' };
      case 'approved': return { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle, label: '已批准' };
      case 'rejected': return { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: '已拒绝' };
      case 'completed': return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: '已完成' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: '未知' };
    }
  };

  const handleSubmit = () => {
    setShowForm(false);
    setFormData({ name: '', idCard: '', reason: '', amount: '', account: '', bank: '', remark: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <span className="text-gray-600">←</span>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">退费处理</h1>
              <p className="text-sm text-gray-500">多缴错缴退费申请与审批</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            + 新增退费申请
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl"
                placeholder="搜索姓名、身份证号"
              />
            </div>
            <button className="px-6 py-3 bg-red-600 text-white rounded-xl">查询</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">身份证号</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">申请日期</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">退费金额</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">退费原因</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {refundRecords.map((record) => {
                const status = getStatusBadge(record.status);
                return (
                  <tr key={record.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{record.name}</td>
                    <td className="px-6 py-4 text-gray-600">{record.idCard}</td>
                    <td className="px-6 py-4 text-gray-600">{record.applyDate}</td>
                    <td className="px-6 py-4 font-medium text-red-600">¥{record.refundAmount}</td>
                    <td className="px-6 py-4 text-gray-600">{record.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.bg} ${status.text}`}>
                        <status.icon className="w-3 h-3" />{status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => setSelectedRecord(record)} className="text-blue-600 hover:underline">查看</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">新增退费申请</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">姓名 *</label><input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入姓名" /></div>
                <div><label className="block text-sm font-medium mb-1">身份证号 *</label><input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入身份证号" /></div>
                <div className="col-span-2"><label className="block text-sm font-medium mb-1">退费原因 *</label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>请选择退费原因</option>
                    <option>多缴费用</option>
                    <option>重复缴费</option>
                    <option>缴费基数调整</option>
                    <option>参保关系终止</option>
                    <option>其他原因</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">退费金额 *</label><input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入退费金额" /></div>
                <div><label className="block text-sm font-medium mb-1">开户银行 *</label><input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入开户银行" /></div>
                <div className="col-span-2"><label className="block text-sm font-medium mb-1">银行账号 *</label><input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入银行账号" /></div>
                <div className="col-span-2"><label className="block text-sm font-medium mb-1">备注说明</label><textarea className="w-full px-3 py-2 border rounded-lg" rows={3} placeholder="请输入备注说明"></textarea></div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">提交申请</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedRecord && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecord(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">退费详情</h3>
              <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><div className="text-sm text-gray-500">申请人</div><div className="font-medium">{selectedRecord.name}</div></div>
                <div><div className="text-sm text-gray-500">身份证号</div><div className="font-medium">{selectedRecord.idCard}</div></div>
                <div><div className="text-sm text-gray-500">退费金额</div><div className="font-medium text-red-600 text-xl">¥{selectedRecord.refundAmount}</div></div>
                <div><div className="text-sm text-gray-500">退费原因</div><div className="font-medium">{selectedRecord.reason}</div></div>
                <div><div className="text-sm text-gray-500">开户银行</div><div className="font-medium">{selectedRecord.bank}</div></div>
                <div><div className="text-sm text-gray-500">银行账号</div><div className="font-medium">{selectedRecord.account}</div></div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setSelectedRecord(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">关闭</button>
              {selectedRecord.status === 'pending' && (
                <><button className="px-4 py-2 bg-red-600 text-white rounded-lg">拒绝</button><button className="px-4 py-2 bg-green-600 text-white rounded-lg">批准</button></>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
