import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Eye, Calendar, TrendingUp, FileText, CheckCircle } from 'lucide-react';

interface SettlementHistoryProps {
  onClose: () => void;
  onBack: () => void;
}

const mockHistory = [
  { id: 'JS202401001', institution: '南京市第一医院', period: '2024-01', amount: 2850000, status: 'completed', date: '2024-01-15' },
  { id: 'JS202401002', institution: '苏州大学附属医院', period: '2024-01', amount: 4200000, status: 'completed', date: '2024-01-16' },
  { id: 'JS202401003', institution: '无锡市人民医院', period: '2024-01', amount: 1980000, status: 'completed', date: '2024-01-17' },
];

export default function SettlementHistory({ onBack }: SettlementHistoryProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold">结算历史记录</h3>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Download className="w-4 h-4" />导出报表
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">156</div>
          <div className="text-sm opacity-90">历史结算笔数</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">¥8,520万</div>
          <div className="text-sm opacity-90">累计结算金额</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">98.5%</div>
          <div className="text-sm opacity-90">结算成功率</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">结算单号</th>
              <th className="px-4 py-3 text-left text-sm font-medium">医疗机构</th>
              <th className="px-4 py-3 text-left text-sm font-medium">结算周期</th>
              <th className="px-4 py-3 text-left text-sm font-medium">金额</th>
              <th className="px-4 py-3 text-left text-sm font-medium">结算日期</th>
              <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockHistory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.id}</td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3">{item.period}</td>
                <td className="px-4 py-3 font-medium">¥{(item.amount / 10000).toFixed(2)}万</td>
                <td className="px-4 py-3 text-gray-500">{item.date}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-cyan-600 hover:bg-cyan-50 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-gray-50 rounded">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
