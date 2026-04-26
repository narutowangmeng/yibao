import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Download, AlertTriangle, CheckCircle, FileText, TrendingUp, TrendingDown } from 'lucide-react';

interface FundRecord {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  status: 'normal' | 'warning';
}

interface WarningItem {
  id: string;
  level: 'high' | 'medium' | 'low';
  title: string;
  content: string;
  date: string;
  status: 'pending' | 'processed';
  handler?: string;
}

export default function FundMonitoring() {
  const [activeTab, setActiveTab] = useState('balance');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetail, setShowDetail] = useState<FundRecord | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState<WarningItem | null>(null);

  const [fundRecords] = useState<FundRecord[]>([
    { id: 'F001', date: '2024-01-15', type: 'income', amount: 5000000, category: '参保缴费', description: '1月参保缴费收入', status: 'normal' },
    { id: 'F002', date: '2024-01-14', type: 'expense', amount: 3200000, category: '报销支出', description: '医疗费用报销', status: 'normal' },
    { id: 'F003', date: '2024-01-13', type: 'expense', amount: 850000, category: '报销支出', description: '大额报销预警', status: 'warning' },
  ]);

  const [warnings, setWarnings] = useState<WarningItem[]>([
    { id: 'W001', level: 'high', title: '支出异常', content: '单日支出超过阈值', date: '2024-01-15', status: 'pending' },
    { id: 'W002', level: 'medium', title: '收入波动', content: '收入环比下降15%', date: '2024-01-14', status: 'pending' },
  ]);

  const handleViewDetail = (record: FundRecord) => {
    setShowDetail(record);
  };

  const handleProcessWarning = (warning: WarningItem) => {
    setSelectedWarning(warning);
    setShowWarningModal(true);
  };

  const handleConfirmProcess = () => {
    if (selectedWarning) {
      setWarnings(warnings.map(w => w.id === selectedWarning.id ? { ...w, status: 'processed', handler: '当前用户' } : w));
    }
    setShowWarningModal(false);
  };

  const handleExport = () => {
    alert('报表导出成功！');
  };

  const renderBalanceContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2"><TrendingUp className="w-4 h-4" /><span className="text-sm">本月收入</span></div>
          <p className="text-2xl font-bold text-green-600">¥5,000万</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2"><TrendingDown className="w-4 h-4" /><span className="text-sm">本月支出</span></div>
          <p className="text-2xl font-bold text-red-600">¥4,050万</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 text-gray-600 mb-2"><FileText className="w-4 h-4" /><span className="text-sm">基金结余</span></div>
          <p className="text-2xl font-bold text-cyan-600">¥950万</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">收支明细</h3>
          <div className="flex gap-2">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="搜索..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg text-sm" /></div>
            <button onClick={handleExport} className="flex items-center gap-1 px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm"><Download className="w-4 h-4" />导出</button>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">日期</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">类型</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">金额</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">分类</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th></tr></thead>
          <tbody>
            {fundRecords.filter(r => r.description.includes(searchTerm)).map((record) => (
              <tr key={record.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">{record.date}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded ${record.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{record.type === 'income' ? '收入' : '支出'}</span></td>
                <td className="px-4 py-3 text-sm font-medium">¥{record.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{record.category}</td>
                <td className="px-4 py-3"><button onClick={() => handleViewDetail(record)} className="p-1.5 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderWarningContent = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b"><h3 className="font-semibold">风险预警</h3></div>
        <div className="divide-y divide-gray-200">
          {warnings.map((warning) => (
            <div key={warning.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 ${warning.level === 'high' ? 'text-red-500' : warning.level === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                <div>
                  <p className="font-medium text-gray-800">{warning.title}</p>
                  <p className="text-sm text-gray-500">{warning.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{warning.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {warning.status === 'pending' ? (
                  <button onClick={() => handleProcessWarning(warning)} className="px-3 py-1.5 bg-cyan-600 text-white text-sm rounded-lg">处理</button>
                ) : (
                  <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle className="w-4 h-4" />已处理</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200">
        <button onClick={() => setActiveTab('balance')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'balance' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600'}`}>基金收支</button>
        <button onClick={() => setActiveTab('warning')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'warning' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600'}`}>风险预警</button>
      </div>
      {activeTab === 'balance' && renderBalanceContent()}
      {activeTab === 'warning' && renderWarningContent()}

      <AnimatePresence>
        {showDetail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold mb-4">收支详情</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">记录编号</span><span>{showDetail.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">日期</span><span>{showDetail.date}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">类型</span><span>{showDetail.type === 'income' ? '收入' : '支出'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">金额</span><span className="font-bold">¥{showDetail.amount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">分类</span><span>{showDetail.category}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">描述</span><span>{showDetail.description}</span></div>
              </div>
              <button onClick={() => setShowDetail(null)} className="w-full mt-6 py-2 bg-gray-100 rounded-lg">关闭</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWarningModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold mb-4">处理预警</h3>
              <p className="text-gray-600 mb-4">确认处理该风险预警？</p>
              <div className="flex gap-3">
                <button onClick={() => setShowWarningModal(false)} className="flex-1 py-2 border rounded-lg">取消</button>
                <button onClick={handleConfirmProcess} className="flex-1 py-2 bg-cyan-600 text-white rounded-lg">确认</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
