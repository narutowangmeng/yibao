import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Eye, History, Ban, RotateCcw } from 'lucide-react';

interface SettlementExceptionProps {
  onClose: () => void;
  onBack: () => void;
}

const exceptionTypes = [
  { id: 'amount', label: '金额异常', color: 'bg-red-100 text-red-700' },
  { id: 'data', label: '数据异常', color: 'bg-orange-100 text-orange-700' },
  { id: 'time', label: '时效异常', color: 'bg-yellow-100 text-yellow-700' },
];

const mockExceptions = [
  { id: 'E001', type: 'amount', institution: '南京市第一医院', amount: 2850000, reason: '结算金额与申报金额不符', status: 'pending', time: '2024-01-20 09:30' },
  { id: 'E002', type: 'data', institution: '苏州医院', amount: 4200000, reason: '数据缺失，无法核对', status: 'processing', time: '2024-01-20 10:15' },
  { id: 'E003', type: 'time', institution: '无锡医院', amount: 1980000, reason: '超过结算时效', status: 'resolved', time: '2024-01-19 14:20' },
];

export default function SettlementException({ onBack }: SettlementExceptionProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedException, setSelectedException] = useState<string | null>(null);

  const filteredData = selectedType === 'all' ? mockExceptions : mockExceptions.filter(e => e.type === selectedType);

  const getStatusBadge = (status: string) => {
    const styles = { pending: 'bg-red-100 text-red-700', processing: 'bg-yellow-100 text-yellow-700', resolved: 'bg-green-100 text-green-700' };
    const labels = { pending: '待处理', processing: '处理中', resolved: '已解决' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  const selectedData = mockExceptions.find(e => e.id === selectedException);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
        <h3 className="text-xl font-bold">结算异常处理</h3>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setSelectedType('all')} className={`px-4 py-2 rounded-lg text-sm ${selectedType === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>全部</button>
        {exceptionTypes.map(t => (
          <button key={t.id} onClick={() => setSelectedType(t.id)} className={`px-4 py-2 rounded-lg text-sm ${selectedType === t.id ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>{t.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl border">
          <table className="w-full">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">单号</th><th className="px-4 py-3 text-left text-sm">类型</th><th className="px-4 py-3 text-left text-sm">医疗机构</th><th className="px-4 py-3 text-left text-sm">金额</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-right text-sm">操作</th></tr></thead>
            <tbody className="divide-y">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.id}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${exceptionTypes.find(t => t.id === item.type)?.color}`}>{exceptionTypes.find(t => t.id === item.type)?.label}</span></td>
                  <td className="px-4 py-3">{item.institution}</td>
                  <td className="px-4 py-3">¥{(item.amount / 10000).toFixed(2)}万</td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3 text-right"><button onClick={() => setSelectedException(item.id)} className="p-2 text-gray-400 hover:text-red-600"><Eye className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          {selectedData ? (
            <div className="bg-white rounded-xl border p-4 space-y-3">
              <h4 className="font-semibold">异常详情</h4>
              <div className="p-3 bg-red-50 rounded-lg"><div className="text-sm text-red-600 font-medium">异常原因</div><div className="text-sm">{selectedData.reason}</div></div>
              <div className="text-sm space-y-1"><div><span className="text-gray-500">单号:</span> {selectedData.id}</div><div><span className="text-gray-500">机构:</span> {selectedData.institution}</div><div><span className="text-gray-500">时间:</span> {selectedData.time}</div></div>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-1 p-2 bg-green-50 text-green-600 rounded text-sm"><CheckCircle className="w-4 h-4" />标记正常</button>
                <button className="flex items-center justify-center gap-1 p-2 bg-red-50 text-red-600 rounded text-sm"><Ban className="w-4 h-4" />加入黑名单</button>
                <button className="flex items-center justify-center gap-1 p-2 bg-blue-50 text-blue-600 rounded text-sm"><RotateCcw className="w-4 h-4" />重新结算</button>
                <button className="flex items-center justify-center gap-1 p-2 bg-gray-50 text-gray-600 rounded text-sm"><History className="w-4 h-4" />查看历史</button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400"><AlertTriangle className="w-12 h-12 mx-auto mb-2" /><p>请选择异常单据</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
