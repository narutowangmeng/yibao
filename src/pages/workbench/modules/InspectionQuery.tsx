import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Filter, Download, Eye, Calendar, Building2, X, CheckCircle, Clock, FileText } from 'lucide-react';

const mockData = [
  { id: 'J001', institution: '南京市第一医院', type: '专项稽核', status: '已完成', date: '2024-01-15', amount: 125000, inspector: '张稽核', issues: 3, description: '医保目录执行情况及诊疗项目合规性检查' },
  { id: 'J002', institution: '苏州中医院', type: '飞行检查', status: '进行中', date: '2024-01-16', amount: 89000, inspector: '李稽核', issues: 1, description: '突击检查药品使用规范性' },
  { id: 'J003', institution: '无锡人民医院', type: '日常巡查', status: '已完成', date: '2024-01-14', amount: 56000, inspector: '王稽核', issues: 0, description: '常规医保政策执行情况巡查' },
  { id: 'J004', institution: '常州二院', type: '专项稽核', status: '待处理', date: '2024-01-18', amount: 156000, inspector: '赵稽核', issues: 5, description: '收费价格标准执行情况专项稽核' },
];

export default function InspectionQuery({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<typeof mockData[0] | null>(null);
  const [toast, setToast] = useState('');

  const filteredData = mockData.filter(item => {
    const matchSearch = item.id.includes(searchTerm) || item.institution.includes(searchTerm);
    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    const labels: Record<string, string> = { all: '全部', '已完成': '已完成', '进行中': '进行中', '待处理': '待处理' };
    setToast(`已筛选: ${labels[status]}`);
    setTimeout(() => setToast(''), 2000);
  };

  const handleExport = () => {
    setToast('导出成功！');
    setTimeout(() => setToast(''), 2000);
  };

  const getStatusBadge = (status: string) => {
    const styles = { '已完成': 'bg-green-100 text-green-700', '进行中': 'bg-blue-100 text-blue-700', '待处理': 'bg-yellow-100 text-yellow-700' };
    const icons = { '已完成': CheckCircle, '进行中': Clock, '待处理': FileText };
    const Icon = icons[status as keyof typeof icons];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />{status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
        <h3 className="text-xl font-bold">稽核查询</h3>
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50">
          {toast}
        </motion.div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索单号、机构..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>
        <select value={statusFilter} onChange={e => handleStatusChange(e.target.value)} className="px-4 py-2 border rounded-lg">
          <option value="all">全部状态</option>
          <option value="已完成">已完成</option>
          <option value="进行中">进行中</option>
          <option value="待处理">待处理</option>
        </select>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"><Download className="w-4 h-4" />导出</button>
      </div>

      <div className="bg-white rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">单号</th><th className="px-4 py-3 text-left text-sm">医疗机构</th><th className="px-4 py-3 text-left text-sm">类型</th><th className="px-4 py-3 text-left text-sm">金额</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-right text-sm">操作</th></tr></thead>
          <tbody className="divide-y">
            {filteredData.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.id}</td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3">¥{item.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setSelectedItem(item)} className="p-2 text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl max-w-lg w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold">稽核详情</h4>
                <button onClick={() => setSelectedItem(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-gray-500 text-sm">单号</span><div className="font-medium">{selectedItem.id}</div></div>
                  <div><span className="text-gray-500 text-sm">状态</span><div>{getStatusBadge(selectedItem.status)}</div></div>
                  <div><span className="text-gray-500 text-sm">医疗机构</span><div className="font-medium">{selectedItem.institution}</div></div>
                  <div><span className="text-gray-500 text-sm">稽核类型</span><div>{selectedItem.type}</div></div>
                  <div><span className="text-gray-500 text-sm">稽核金额</span><div className="font-medium text-cyan-600">¥{selectedItem.amount.toLocaleString()}</div></div>
                  <div><span className="text-gray-500 text-sm">稽核人员</span><div>{selectedItem.inspector}</div></div>
                </div>
                <div><span className="text-gray-500 text-sm">稽核描述</span><div className="p-3 bg-gray-50 rounded-lg mt-1">{selectedItem.description}</div></div>
                <div><span className="text-gray-500 text-sm">发现问题数</span><div className="font-medium text-red-600">{selectedItem.issues} 项</div></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setSelectedItem(null)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">关闭</button>
                <button onClick={() => { setToast('已生成报告'); setSelectedItem(null); setTimeout(() => setToast(''), 2000); }} className="flex-1 py-2 bg-cyan-600 text-white rounded-lg">生成报告</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
