import React, { useMemo, useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { exportJsonToWorkbook } from '../../../utils/exportHelpers';

interface ReconcileProcessProps {
  onClose: () => void;
  onBack: () => void;
}

interface DifferenceItem {
  id: string;
  type: string;
  bankAmount: number;
  systemAmount: number;
  diff: number;
  status: 'matched' | 'unmatched' | 'adjusted';
}

const initialDifferences: DifferenceItem[] = [
  { id: 'RC320001', type: '银行多笔回单', bankAmount: 120000, systemAmount: 100000, diff: 20000, status: 'unmatched' },
  { id: 'RC320002', type: '系统漏记到账', bankAmount: 0, systemAmount: 35000, diff: -35000, status: 'unmatched' },
  { id: 'RC320003', type: '金额完全匹配', bankAmount: 50000, systemAmount: 50000, diff: 0, status: 'matched' },
  { id: 'RC320004', type: '税务回盘金额差异', bankAmount: 268000, systemAmount: 266800, diff: 1200, status: 'unmatched' },
];

export default function ReconcileProcess({ onBack }: ReconcileProcessProps) {
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload');
  const [rows, setRows] = useState<DifferenceItem[]>(initialDifferences);

  const handleUpload = () => {
    setStep('processing');
    setTimeout(() => setStep('result'), 1200);
  };

  const handleAdjust = (id: string) => {
    setRows((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'adjusted', diff: 0, systemAmount: item.bankAmount } : item)));
  };

  const matchedCount = useMemo(() => rows.filter((item) => item.status === 'matched' || item.status === 'adjusted').length, [rows]);
  const unmatchedCount = useMemo(() => rows.filter((item) => item.status === 'unmatched').length, [rows]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h3 className="text-xl font-bold">对账处理</h3>
      </div>

      {step === 'upload' && (
        <div className="space-y-6">
          <div className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-12 text-center transition-colors hover:border-cyan-400" onClick={handleUpload}>
            <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-lg font-medium text-gray-700">点击上传银行 / 税务对账单</p>
            <p className="mt-2 text-sm text-gray-500">支持 Excel、CSV 格式</p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() =>
                exportJsonToWorkbook(
                  [
                    { 对账编号: 'RC-TPL-001', 差异类型: '银行多笔回单', 银行金额: 120000, 系统金额: 100000, 差额: 20000, 状态: '待处理' },
                    { 对账编号: 'RC-TPL-002', 差异类型: '系统漏记到账', 银行金额: 0, 系统金额: 35000, 差额: -35000, 状态: '待处理' },
                  ],
                  '对账模板',
                  '银行税务对账模板.xlsx',
                )
              }
              className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              下载模板
            </button>
          </div>
        </div>
      )}

      {step === 'processing' && (
        <div className="py-12 text-center">
          <RefreshCw className="mx-auto mb-4 h-12 w-12 animate-spin text-cyan-600" />
          <p className="text-lg font-medium">系统自动对账中...</p>
          <p className="mt-2 text-sm text-gray-500">正在比对银行流水、税务回盘和系统台账</p>
        </div>
      )}

      {step === 'result' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-green-50 p-4 text-center"><p className="text-2xl font-bold text-green-600">{matchedCount}</p><p className="text-sm text-gray-600">已平账</p></div>
            <div className="rounded-lg bg-red-50 p-4 text-center"><p className="text-2xl font-bold text-red-600">{unmatchedCount}</p><p className="text-sm text-gray-600">存在差异</p></div>
            <div className="rounded-lg bg-blue-50 p-4 text-center"><p className="text-2xl font-bold text-blue-600">{rows.length}</p><p className="text-sm text-gray-600">总笔数</p></div>
          </div>

          <div className="rounded-lg border bg-white">
            <div className="flex items-center gap-2 border-b bg-gray-50 px-4 py-3">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="font-medium">差异明细</span>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 text-sm">
                <tr>
                  <th className="px-4 py-2 text-left">差异类型</th>
                  <th className="px-4 py-2 text-right">银行金额</th>
                  <th className="px-4 py-2 text-right">系统金额</th>
                  <th className="px-4 py-2 text-right">差额</th>
                  <th className="px-4 py-2 text-center">状态</th>
                  <th className="px-4 py-2 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {rows.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3">{item.type}</td>
                    <td className="px-4 py-3 text-right">￥{item.bankAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">￥{item.systemAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-medium" style={{ color: item.diff > 0 ? 'red' : item.diff < 0 ? '#ca8a04' : 'green' }}>{item.diff > 0 ? '+' : ''}{item.diff.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      {item.status === 'matched' ? <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">已匹配</span> : item.status === 'adjusted' ? <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">已调平</span> : <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-700">待处理</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.status === 'unmatched' && <button onClick={() => handleAdjust(item.id)} className="text-xs text-cyan-600 hover:underline">手动调平</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setStep('upload')} className="rounded-lg border px-4 py-2 hover:bg-gray-50">重新导入</button>
            <button className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
              <CheckCircle className="h-4 w-4" />
              确认对账结果
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
