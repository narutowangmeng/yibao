import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, TrendingUp, AlertCircle, CheckCircle, BarChart3, X, FileText } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface InspectionStatsProps {
  onClose: () => void;
  onBack: () => void;
}

const trendData = [
  { month: '1月', count: 45, details: ['江苏省人民医院', '苏州大学附属第一医院'] },
  { month: '2月', count: 52, details: ['无锡市人民医院', '常州市第二人民医院'] },
  { month: '3月', count: 48, details: ['南通大学附属医院', '扬州大学附属医院'] },
  { month: '4月', count: 61, details: ['泰州市人民医院', '盐城市第三人民医院'] },
  { month: '5月', count: 55, details: ['徐州市中心医院', '淮安市第一人民医院'] },
  { month: '6月', count: 67, details: ['连云港市第一人民医院', '宿迁市第一人民医院'] },
];

const typeData = [
  { name: '过度医疗', value: 35, color: '#ef4444' },
  { name: '虚假住院', value: 25, color: '#f97316' },
  { name: '串换药品', value: 20, color: '#eab308' },
  { name: '重复收费', value: 12, color: '#3b82f6' },
  { name: '其他违规', value: 8, color: '#6b7280' },
];

export default function InspectionStats({ onBack }: InspectionStatsProps) {
  const [showToast, setShowToast] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleExport = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  const selectedMonthData = trendData.find((item) => item.month === selectedMonth);
  const selectedTypeData = typeData.find((item) => item.name === selectedType);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100"><ArrowLeft className="h-5 w-5" /></button>
          <h3 className="text-xl font-bold">统计分析</h3>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
          <Download className="h-4 w-4" />导出报表
        </button>
      </div>

      <AnimatePresence>
        {showToast && <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed right-6 top-20 z-50 flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg"><CheckCircle className="h-4 w-4" />报表导出成功</motion.div>}
      </AnimatePresence>

      <div className="grid grid-cols-4 gap-4">
        <div className="cursor-pointer rounded-xl bg-blue-50 p-4 hover:shadow-md" onClick={() => setSelectedMonth('4月')}>
          <div className="mb-2 flex items-center gap-2 text-blue-600"><TrendingUp className="h-4 w-4" />稽核次数</div>
          <div className="text-2xl font-bold">328 次</div>
        </div>
        <div className="cursor-pointer rounded-xl bg-red-50 p-4 hover:shadow-md" onClick={() => setSelectedType('过度医疗')}>
          <div className="mb-2 flex items-center gap-2 text-red-600"><AlertCircle className="h-4 w-4" />违规查处</div>
          <div className="text-2xl font-bold">86 起</div>
        </div>
        <div className="rounded-xl bg-green-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-green-600"><CheckCircle className="h-4 w-4" />整改完成</div>
          <div className="text-2xl font-bold">92%</div>
        </div>
        <div className="rounded-xl bg-purple-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-purple-600"><BarChart3 className="h-4 w-4" />追回金额</div>
          <div className="text-2xl font-bold">￥1,256万</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="cursor-pointer rounded-xl border bg-white p-4" onClick={() => setSelectedMonth('4月')}>
          <h4 className="mb-4 font-bold">稽核数量趋势</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h4 className="mb-4 font-bold">违规类型分布</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={84} dataKey="value" onClick={(data: any) => data?.name && setSelectedType(data.name)}>
                {typeData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-3">
            {typeData.map((item) => (
              <div key={item.name} className="cursor-pointer rounded px-2 py-1 text-xs hover:bg-gray-100" onClick={() => setSelectedType(item.name)}>
                <div className="mr-1 inline-block h-3 w-3 rounded" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedMonth && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedMonth(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-96 rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-bold"><FileText className="h-5 w-5 text-cyan-600" />{selectedMonth}稽核详情</h4>
                <button onClick={() => setSelectedMonth(null)} className="rounded p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">稽核次数：{selectedMonthData?.count} 次</div>
                <div className="text-sm font-medium">涉及机构：</div>
                {selectedMonthData?.details.map((item) => <div key={item} className="rounded bg-gray-50 p-2 text-sm">{item}</div>)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedType && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedType(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-96 rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-bold"><AlertCircle className="h-5 w-5 text-red-600" />{selectedType}详情</h4>
                <button onClick={() => setSelectedType(null)} className="rounded p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg bg-red-50 p-3">
                  <div className="text-sm text-gray-600">违规数量</div>
                  <div className="text-xl font-bold text-red-600">{selectedTypeData?.value} 起</div>
                </div>
                <div className="text-sm text-gray-600">占比：{selectedTypeData?.value}%</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
