import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, Eye, FileText, User, Calendar, X } from 'lucide-react';

interface QueryResult {
  id: string;
  name: string;
  idCard: string;
  type: string;
  status: string;
  enrollDate: string;
  lastPayment: string;
}

const mockData: QueryResult[] = [
  { id: 'Q001', name: '张三', idCard: '110101********1234', type: '职工医保', status: '正常', enrollDate: '2020-01-15', lastPayment: '2024-03' },
  { id: 'Q002', name: '李四', idCard: '110101********2345', type: '居民医保', status: '正常', enrollDate: '2021-06-20', lastPayment: '2024-03' },
  { id: 'Q003', name: '王五', idCard: '110101********3456', type: '职工医保', status: '暂停', enrollDate: '2019-03-10', lastPayment: '2024-01' },
];

export default function QuerySystem() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [results, setResults] = useState<QueryResult[]>(mockData);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<QueryResult | null>(null);

  const handleSearch = () => {
    const filtered = mockData.filter(item => {
      const matchQuery = item.name.includes(searchQuery) || item.idCard.includes(searchQuery);
      const matchType = filterType === 'all' || item.type === filterType;
      const matchStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchQuery && matchType && matchStatus;
    });
    setResults(filtered);
  };

  const handleView = (item: QueryResult) => {
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleExport = () => {
    alert(`已导出 ${results.length} 条记录`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">综合查询系统</h2>

      <div className="bg-white p-6 rounded-xl border space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="姓名/身份证号"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">全部类型</option>
            <option value="职工医保">职工医保</option>
            <option value="居民医保">居民医保</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">全部状态</option>
            <option value="正常">正常</option>
            <option value="暂停">暂停</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"
          >
            <Search className="w-4 h-4" />查询
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg"
          >
            <Download className="w-4 h-4" />导出
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-medium">查询结果 ({results.length})</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm">姓名</th>
              <th className="px-4 py-3 text-left text-sm">身份证号</th>
              <th className="px-4 py-3 text-left text-sm">参保类型</th>
              <th className="px-4 py-3 text-left text-sm">状态</th>
              <th className="px-4 py-3 text-left text-sm">操作</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{item.name}</td>
                <td className="px-4 py-3 text-sm">{item.idCard}</td>
                <td className="px-4 py-3 text-sm">{item.type}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded ${
                    item.status === '正常' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleView(item)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && currentItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">参保人详情</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">姓名</span>
                <span className="font-medium">{currentItem.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">身份证号</span>
                <span>{currentItem.idCard}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">参保类型</span>
                <span>{currentItem.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">参保状态</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  currentItem.status === '正常' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {currentItem.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">参保日期</span>
                <span>{currentItem.enrollDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">最近缴费</span>
                <span>{currentItem.lastPayment}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
