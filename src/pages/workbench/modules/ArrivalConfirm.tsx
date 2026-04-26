import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, AlertCircle, Building2, Receipt, FileText, Download, X, RefreshCw } from 'lucide-react';

interface ArrivalRecord {
  id: string;
  payerName: string;
  idCard: string;
  amount: number;
  bankName: string;
  arrivalDate: string;
  status: 'matched' | 'unmatched' | 'exception';
  voucherNo: string;
}

export default function ArrivalConfirm({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {
  const handleClose = onClose || onBack || (() => {});
  const [activeTab, setActiveTab] = useState<'bank' | 'tax'>('bank');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ArrivalRecord | null>(null);

  const records: ArrivalRecord[] = [
    { id: '1', payerName: '张三', idCard: '320101199001011234', amount: 2500, bankName: '工商银行', arrivalDate: '2024-01-15', status: 'matched', voucherNo: 'BK20240115001' },
    { id: '2', payerName: '李四', idCard: '320101198505056789', amount: 1800, bankName: '建设银行', arrivalDate: '2024-01-14', status: 'unmatched', voucherNo: 'BK20240114002' },
    { id: '3', payerName: '王五', idCard: '320101199212123456', amount: 3200, bankName: '农业银行', arrivalDate: '2024-01-13', status: 'exception', voucherNo: 'BK20240113003' },
  ];

  const filteredRecords = records.filter(r => 
    r.payerName.includes(searchTerm) || r.idCard.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'matched': return { bg: 'bg-green-100', text: 'text-green-700', label: '已匹配' };
      case 'unmatched': return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '待匹配' };
      case 'exception': return { bg: 'bg-red-100', text: 'text-red-700', label: '异常' };
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
              <h1 className="text-xl font-bold text-gray-800">到账确认</h1>
              <p className="text-sm text-gray-500">银行税务到账确认与对账</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <RefreshCw className="w-4 h-4" />自动对账
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              <Download className="w-4 h-4" />导出报表
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('bank')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${activeTab === 'bank' ? 'bg-emerald-600 text-white' : 'bg-white border hover:bg-gray-50'}`}
          >
            <Building2 className="w-5 h-5" />银行到账
          </button>
          <button
            onClick={() => setActiveTab('tax')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium ${activeTab === 'tax' ? 'bg-emerald-600 text-white' : 'bg-white border hover:bg-gray-50'}`}
          >
            <Receipt className="w-5 h-5" />税务到账
          </button>
        </div>

        <div className="bg-white rounded-xl border p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-xl"
                placeholder="搜索姓名或身份证号"
              />
            </div>
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl">查询</button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <div className="text-sm text-gray-500">总到账笔数</div>
            <div className="text-2xl font-bold text-gray-800">156</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="text-sm text-gray-500">已匹配</div>
            <div className="text-2xl font-bold text-green-600">142</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="text-sm text-gray-500">待匹配</div>
            <div className="text-2xl font-bold text-yellow-600">10</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <div className="text-sm text-gray-500">异常</div>
            <div className="text-2xl font-bold text-red-600">4</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">缴费人</th>
                <th className="px-6 py-3 text-left text-sm font-medium">身份证号</th>
                <th className="px-6 py-3 text-left text-sm font-medium">到账金额</th>
                <th className="px-6 py-3 text-left text-sm font-medium">银行</th>
                <th className="px-6 py-3 text-left text-sm font-medium">到账日期</th>
                <th className="px-6 py-3 text-left text-sm font-medium">状态</th>
                <th className="px-6 py-3 text-left text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const status = getStatusBadge(record.status);
                return (
                  <tr key={record.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{record.payerName}</td>
                    <td className="px-6 py-4 text-gray-600">{record.idCard}</td>
                    <td className="px-6 py-4 font-medium">¥{record.amount}</td>
                    <td className="px-6 py-4">{record.bankName}</td>
                    <td className="px-6 py-4">{record.arrivalDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${status.bg} ${status.text}`}>{status.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => setSelectedRecord(record)} className="text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded-lg">查看</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRecord && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecord(null)}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">到账详情</h3>
              <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-500">缴费人</span><span className="font-medium">{selectedRecord.payerName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">身份证号</span><span className="font-medium">{selectedRecord.idCard}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">到账金额</span><span className="font-medium text-emerald-600">¥{selectedRecord.amount}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">银行</span><span className="font-medium">{selectedRecord.bankName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">凭证号</span><span className="font-medium">{selectedRecord.voucherNo}</span></div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setSelectedRecord(null)} className="flex-1 py-2 border rounded-lg">关闭</button>
              {selectedRecord.status === 'unmatched' && (
                <button className="flex-1 py-2 bg-emerald-600 text-white rounded-lg">手动匹配</button>
              )}
              {selectedRecord.status === 'exception' && (
                <button className="flex-1 py-2 bg-red-600 text-white rounded-lg">处理异常</button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
