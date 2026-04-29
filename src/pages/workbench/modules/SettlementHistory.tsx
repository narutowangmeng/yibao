import React, { useMemo } from 'react';
import { ArrowLeft, Download, Eye } from 'lucide-react';
import { exportJsonToWorkbook } from '../../../utils/exportHelpers';
import { getStoredSettlementSubmissions } from '../../../utils/settlementStorage';

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
  const historyRows = useMemo(
    () => [
      ...getStoredSettlementSubmissions().map((item) => ({
        id: item.id,
        institution: item.institution,
        period: item.period,
        amount: item.amount,
        status: 'processing',
        date: item.createTime,
      })),
      ...mockHistory,
    ],
    [],
  );

  const handleExport = () => {
    exportJsonToWorkbook(
      historyRows.map((item) => ({
        结算单号: item.id,
        医疗机构: item.institution,
        结算周期: item.period,
        结算金额: item.amount,
        结算日期: item.date,
      })),
      '结算历史',
      '基金结算历史记录.xlsx',
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-bold">结算历史记录</h3>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
          <Download className="h-4 w-4" />
          导出报表
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
          <div className="text-2xl font-bold">{historyRows.length}</div>
          <div className="text-sm opacity-90">历史结算笔数</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-4 text-white">
          <div className="text-2xl font-bold">¥{(historyRows.reduce((sum, item) => sum + item.amount, 0) / 10000).toFixed(2)}万</div>
          <div className="text-sm opacity-90">累计结算金额</div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white">
          <div className="text-2xl font-bold">
            {historyRows.length ? `${((historyRows.filter((item) => item.status === 'completed').length / historyRows.length) * 100).toFixed(1)}%` : '0%'}
          </div>
          <div className="text-sm opacity-90">结算完成率</div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
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
            {historyRows.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.id}</td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3">{item.period}</td>
                <td className="px-4 py-3 font-medium">¥{(item.amount / 10000).toFixed(2)}万</td>
                <td className="px-4 py-3 text-gray-500">{item.date}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="rounded p-2 text-cyan-600 hover:bg-cyan-50">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={handleExport} className="rounded p-2 text-gray-400 hover:bg-gray-50 hover:text-cyan-600">
                      <Download className="h-4 w-4" />
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
