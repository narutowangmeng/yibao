import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, TrendingUp, AlertCircle, CheckCircle, BarChart3, X, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface InspectionStatsProps {
  onClose: () => void;
  onBack: () => void;
}

const trendData = [
  { month: '1月', count: 45, details: ['南京市第一医院', '苏州中医院'] },
  { month: '2月', count: 52, details: ['无锡人民医院', '常州二院'] },
  { month: '3月', count: 48, details: ['南通医院', '扬州医院'] },
  { month: '4月', count: 61, details: ['泰州医院', '盐城医院'] },
  { month: '5月', count: 55, details: ['徐州医院', '淮安医院'] },
  { month: '6月', count: 67, details: ['连云港医院', '宿迁医院'] },
];

const typeData = [
  { name: '过度医疗', value: 35, color: '#ef4444' },
  { name: '虚假住院', value: 25, color: '#f97316' },
  { name: '串换药品', value: 20, color: '#eab308' },
  { name: '其他违规', value: 20, color: '#6b7280' },
];

export default function InspectionStats({ onBack }: InspectionStatsProps) {
  const [showToast, setShowToast] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleExport = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleBarClick = (data: any) => {
    if (data && data.activeLabel) {
      setSelectedMonth(data.activeLabel);
    }
  };

  const handlePieClick = (data: any) => {
    if (data && data.name) {
      setSelectedType(data.name);
    }
  };

  const selectedMonthData = trendData.find(d => d.month === selectedMonth);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold">统计分析</h3>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
        >
          <Download className="w-4 h-4" />导出报表
        </button>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            报表导出成功
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedMonth('1月')}>
          <div className="flex items-center gap-2 text-blue-600 mb-2"><TrendingUp className="w-4 h-4" />稽核次数</div>
          <div className="text-2xl font-bold">328次</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedType('过度医疗')}>
          <div className="flex items-center gap-2 text-red-600 mb-2"><AlertCircle className="w-4 h-4" />违规查处</div>
          <div className="text-2xl font-bold">86起</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-600 mb-2"><CheckCircle className="w-4 h-4" />整改完成</div>
          <div className="text-2xl font-bold">92%</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-purple-600 mb-2"><BarChart3 className="w-4 h-4" />追回金额</div>
          <div className="text-2xl font-bold">¥1,256万</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-4 cursor-pointer" onClick={handleBarClick}>
          <h4 className="font-bold mb-4">稽核数量趋势（点击查看）</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData} onClick={handleBarClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border p-4 cursor-pointer">
          <h4 className="font-bold mb-4">违规类型分布（点击查看）</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie 
                data={typeData} 
                cx="50%" 
                cy="50%" 
                innerRadius={60} 
                outerRadius={80} 
                dataKey="value"
                onClick={handlePieClick}
              >
                {typeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {typeData.map(item => (
              <div 
                key={item.name} 
                className="flex items-center gap-1 text-xs cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                onClick={() => setSelectedType(item.name)}
              >
                <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedMonth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedMonth(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-96"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-600" />
                  {selectedMonth}稽核详情
                </h4>
                <button onClick={() => setSelectedMonth(null)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">稽核次数: {selectedMonthData?.count}次</div>
                <div className="text-sm font-medium">涉及机构:</div>
                {selectedMonthData?.details.map((inst, idx) => (
                  <div key={idx} className="p-2 bg-gray-50 rounded text-sm">{inst}</div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedType(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-96"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  {selectedType}详情
                </h4>
                <button onClick={() => setSelectedType(null)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-sm text-gray-600">违规数量</div>
                  <div className="text-xl font-bold text-red-600">
                    {typeData.find(t => t.name === selectedType)?.value}起
                  </div>
                </div>
                <div className="text-sm text-gray-600">占比: {Math.round((typeData.find(t => t.name === selectedType)?.value || 0) / 100 * 100)}%</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
