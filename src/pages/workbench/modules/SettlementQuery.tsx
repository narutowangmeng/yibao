import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Filter, Download, Eye, X, Calendar, Building2, DollarSign } from 'lucide-react';

interface SettlementItem {
  id: string;
  institution: string;
  period: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed';
  createTime: string;
}

const mockData: SettlementItem[] = [
  { id: 'JS001', institution: '南京市第一医院', period: '2024-01', amount: 2850000, status: 'completed', createTime: '2024-01-15' },
  { id: 'JS002', institution: '苏州大学附属医院', period: '2024-01', amount: 4200000, status: 'processing', createTime: '2024-01-16' },
  { id: 'JS003', institution: '无锡市人民医院', period: '2024-01', amount: 1980000, status: 'pending', createTime: '2024-01-17' },
];

export default function SettlementQuery({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<SettlementItem | null>(null);

  const filteredData = mockData.filter(item => {
    const matchSearch = item.id.includes(searchTerm) || item.institution.includes(searchTerm);
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' };
    const labels = { pending: '待结算', processing: '结算中', completed: '已完成' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
        <h3 className="text-xl font-bold">结算查询</h3>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索单号、机构..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
          <option value="all">全部状态</option>
          <option value="pending">待结算</option>
          <option value="processing">结算中</option>
          <option value="completed">已完成</option>
        </select>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"><Download className="w-4 h-4" />导出</button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">单号</th>
              <th className="px-4 py-3 text-left text-sm font-medium">医疗机构</th>
              <th className="px-4 py-3 text-left text-sm font-medium">结算周期</th>
              <th className="px-4 py-3 text-left text-sm font-medium">金额</th>
              <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
              <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredData.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.id}</td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3">{item.period}</td>
                <td className="px-4 py-3 font-medium">¥{(item.amount / 10000).toFixed(2)}万</td>
                <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setSelectedItem(item)} className="p-2 text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedItem && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedItem(null)}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold">结算详情</h4>
              <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-500">单号</span><span className="font-medium">{selectedItem.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">医疗机构</span><span className="font-medium">{selectedItem.institution}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">结算周期</span><span className="font-medium">{selectedItem.period}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">金额</span><span className="font-medium text-cyan-600">¥{(selectedItem.amount / 10000).toFixed(2)}万</span></div>
              <div className="flex justify-between"><span className="text-gray-500">状态</span>{getStatusBadge(selectedItem.status)}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
