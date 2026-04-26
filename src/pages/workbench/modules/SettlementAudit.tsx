import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Eye, FileText, Building2, Calendar, DollarSign, History, Search } from 'lucide-react';

interface SettlementAuditProps {
  onClose: () => void;
  onBack: () => void;
}

const mockData = [
  { id: 'SA001', institution: '南京市第一医院', period: '2024-01', amount: 2850000, status: 'pending', submitTime: '2024-01-15' },
  { id: 'SA002', institution: '苏州大学附属医院', period: '2024-01', amount: 4200000, status: 'pending', submitTime: '2024-01-16' },
];

const historyRecords = [
  { time: '2024-01-15 09:30', action: '提交申请', operator: '医院管理员', status: 'success' },
  { time: '2024-01-16 10:00', action: '系统初审', operator: '智能审核', status: 'success' },
];

export default function SettlementAudit({ onBack }: SettlementAuditProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [auditComment, setAuditComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedItem = mockData.find(item => item.id === selectedId);
  const filteredData = mockData.filter(item => item.institution.includes(searchTerm));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold">结算审核</h3>
        </div>
        <span className="text-sm text-gray-500">待审核 {mockData.length} 笔</span>
      </div>

      {!selectedId ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索医疗机构..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <div className="space-y-2">
            {filteredData.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.institution}</div>
                    <div className="text-sm text-gray-500">{item.period} | ¥{(item.amount / 10000).toFixed(2)}万</div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">待审核</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{selectedItem?.institution}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div><span className="text-gray-500">结算周期:</span> {selectedItem?.period}</div>
              <div><span className="text-gray-500">申请金额:</span> ¥{(selectedItem?.amount || 0).toLocaleString()}</div>
              <div><span className="text-gray-500">提交时间:</span> {selectedItem?.submitTime}</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />票据审核
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span>医疗费用清单</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span>医保结算单</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <History className="w-4 h-4" />审核历史
            </h4>
            <div className="space-y-2">
              {historyRecords.map((record, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-500">{record.time}</span>
                  <span>{record.action}</span>
                  <span className="text-gray-400">{record.operator}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">审核意见</label>
            <textarea
              value={auditComment}
              onChange={(e) => setAuditComment(e.target.value)}
              placeholder="请输入审核意见..."
              className="w-full h-20 px-3 py-2 border rounded-lg resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setSelectedId(null)}
              className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
            >
              返回
            </button>
            <button className="flex-1 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4" />驳回
            </button>
            <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />通过
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
