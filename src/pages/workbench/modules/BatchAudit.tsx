import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Filter, CheckCircle, XCircle, Eye, Search, FileText, AlertTriangle } from 'lucide-react';

interface AuditItem {
  id: string;
  applicant: string;
  type: string;
  amount: number;
  region: string;
  submitTime: string;
  status: 'pending';
  hasException: boolean;
}

const mockData: AuditItem[] = [
  { id: 'BA001', applicant: '张三', type: '门诊报销', amount: 580, region: '杭州市', submitTime: '2024-01-20', status: 'pending', hasException: false },
  { id: 'BA002', applicant: '李四', type: '住院报销', amount: 12500, region: '宁波市', submitTime: '2024-01-19', status: 'pending', hasException: true },
  { id: 'BA003', applicant: '王五', type: '特殊药品', amount: 3200, region: '温州市', submitTime: '2024-01-18', status: 'pending', hasException: false },
  { id: 'BA004', applicant: '赵六', type: '门诊报销', amount: 890, region: '杭州市', submitTime: '2024-01-20', status: 'pending', hasException: false },
];

export default function BatchAudit({ onBack }: { onBack: () => void }) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: '', region: '' });
  const [selectedDetail, setSelectedDetail] = useState<AuditItem | null>(null);
  const [toast, setToast] = useState('');

  const filteredData = useMemo(() => {
    return mockData.filter(item => {
      if (searchTerm && !item.applicant.includes(searchTerm) && !item.id.includes(searchTerm)) return false;
      if (filters.type && item.type !== filters.type) return false;
      if (filters.region && !item.region.includes(filters.region)) return false;
      return true;
    });
  }, [searchTerm, filters]);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedItems(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredData.length) setSelectedItems(new Set());
    else setSelectedItems(new Set(filteredData.map(item => item.id)));
  };

  const handleBatchAction = (action: 'approve' | 'reject') => {
    if (selectedItems.size === 0) return;
    setToast(action === 'approve' ? `已通过 ${selectedItems.size} 条` : `已驳回 ${selectedItems.size} 条`);
    setSelectedItems(new Set());
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <h3 className="text-xl font-bold">批量审核</h3>
        </div>
        <span className="text-sm text-gray-500">待审核 {filteredData.length} 笔</span>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索申请人、单号" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>
        <select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))} className="px-3 py-2 border rounded-lg">
          <option value="">全部类型</option>
          <option>门诊报销</option>
          <option>住院报销</option>
          <option>特殊药品</option>
        </select>
        <select value={filters.region} onChange={e => setFilters(f => ({ ...f, region: e.target.value }))} className="px-3 py-2 border rounded-lg">
          <option value="">全部地区</option>
          <option>杭州市</option>
          <option>宁波市</option>
          <option>温州市</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left"><input type="checkbox" checked={selectedItems.size === filteredData.length && filteredData.length > 0} onChange={toggleSelectAll} /></th>
              <th className="px-4 py-3 text-left text-sm">单号</th>
              <th className="px-4 py-3 text-left text-sm">申请人</th>
              <th className="px-4 py-3 text-left text-sm">类型</th>
              <th className="px-4 py-3 text-left text-sm">金额</th>
              <th className="px-4 py-3 text-left text-sm">地区</th>
              <th className="px-4 py-3 text-center text-sm">状态</th>
              <th className="px-4 py-3 text-right text-sm">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredData.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><input type="checkbox" checked={selectedItems.has(item.id)} onChange={() => toggleSelect(item.id)} /></td>
                <td className="px-4 py-3 font-medium">{item.id}</td>
                <td className="px-4 py-3">{item.applicant}</td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3 font-medium">¥{item.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.region}</td>
                <td className="px-4 py-3 text-center">{item.hasException && <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">异常</span>}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setSelectedDetail(item)} className="p-2 text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedItems.size > 0 && (
        <div className="mt-4 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <span className="text-sm">已选择 {selectedItems.size} 条</span>
          <div className="flex gap-2">
            <button onClick={() => handleBatchAction('reject')} className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">批量驳回</button>
            <button onClick={() => handleBatchAction('approve')} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">批量通过</button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedDetail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDetail(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold">单据详情</h4>
                <button onClick={() => setSelectedDetail(null)} className="p-2 hover:bg-gray-100 rounded"><XCircle className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">单号</span><span className="font-medium">{selectedDetail.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">申请人</span><span className="font-medium">{selectedDetail.applicant}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">类型</span><span>{selectedDetail.type}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">金额</span><span className="font-medium text-cyan-600">¥{selectedDetail.amount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">地区</span><span>{selectedDetail.region}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">提交时间</span><span>{selectedDetail.submitTime}</span></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
