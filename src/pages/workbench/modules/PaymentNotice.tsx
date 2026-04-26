import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Printer, Download, Mail, Eye, FileText, CheckCircle, X } from 'lucide-react';

interface NoticeRecord {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  amount: number;
  period: string;
  status: 'pending' | 'sent' | 'printed';
  createTime: string;
}

export default function PaymentNotice({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {
  const handleClose = onClose || onBack || (() => {});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<NoticeRecord | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [filters, setFilters] = useState({ status: '', period: '' });

  const records: NoticeRecord[] = [
    { id: '1', name: '张三', idCard: '320101199001011234', phone: '13800138001', amount: 2400, period: '2024年1-6月', status: 'pending', createTime: '2024-01-15' },
    { id: '2', name: '李四', idCard: '320101198505056789', phone: '13900139002', amount: 1800, period: '2024年1-6月', status: 'sent', createTime: '2024-01-14' },
  ];

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.name.includes(searchTerm) || r.idCard.includes(searchTerm);
    const matchesStatus = !filters.status || r.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '待发送' };
      case 'sent': return { bg: 'bg-green-100', text: 'text-green-700', label: '已发送' };
      case 'printed': return { bg: 'bg-blue-100', text: 'text-blue-700', label: '已打印' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: '未知' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">缴费通知单</h1>
              <p className="text-sm text-gray-500">生成和管理缴费通知单</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              <FileText className="w-4 h-4" />
              生成通知单
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl"
                placeholder="搜索姓名或身份证号"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-3 border border-gray-200 rounded-xl"
            >
              <option value="">全部状态</option>
              <option value="pending">待发送</option>
              <option value="sent">已发送</option>
              <option value="printed">已打印</option>
            </select>
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl">查询</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">身份证号</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">联系电话</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">缴费金额</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">缴费期间</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const status = getStatusBadge(record.status);
                return (
                  <tr key={record.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{record.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{record.idCard}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">¥{record.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.period}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setSelectedRecord(record); setShowPreview(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                          <Printer className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showPreview && selectedRecord && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl max-w-lg w-full p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">医保缴费通知单</h3>
              <p className="text-sm text-gray-500 mt-1">编号：{selectedRecord.id}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">姓名</span><span className="font-medium">{selectedRecord.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">身份证号</span><span>{selectedRecord.idCard}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">缴费期间</span><span>{selectedRecord.period}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">应缴金额</span><span className="text-lg font-bold text-emerald-600">¥{selectedRecord.amount}</span></div>
            </div>
            <div className="mt-6 pt-4 border-t flex justify-end gap-3">
              <button onClick={() => setShowPreview(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">关闭</button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2">
                <Printer className="w-4 h-4" />打印
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
