import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, FileText, Download, RefreshCw } from 'lucide-react';

interface ReconcileProcessProps {
  onClose: () => void;
  onBack: () => void;
}

const mockDifferences = [
  { id: 'D001', type: '金额不符', bankAmount: 50000, systemAmount: 50000, diff: 0, status: 'matched' },
  { id: 'D002', type: '银行多笔', bankAmount: 120000, systemAmount: 100000, diff: 20000, status: 'unmatched' },
  { id: 'D003', type: '系统漏记', bankAmount: 0, systemAmount: 35000, diff: -35000, status: 'unmatched' },
];

export default function ReconcileProcess({ onBack }: ReconcileProcessProps) {
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload');
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = () => {
    setUploaded(true);
    setStep('processing');
    setTimeout(() => setStep('result'), 1500);
  };

  const matchedCount = mockDifferences.filter(d => d.status === 'matched').length;
  const unmatchedCount = mockDifferences.filter(d => d.status === 'unmatched').length;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold">对账处理</h3>
      </div>

      {step === 'upload' && (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-cyan-400 cursor-pointer transition-colors"
               onClick={handleUpload}>
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700">点击上传银行对账单</p>
            <p className="text-sm text-gray-500 mt-2">支持 Excel、CSV 格式</p>
          </div>
          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />下载模板
            </button>
          </div>
        </div>
      )}

      {step === 'processing' && (
        <div className="text-center py-12">
          <RefreshCw className="w-12 h-12 mx-auto text-cyan-600 animate-spin mb-4" />
          <p className="text-lg font-medium">系统自动对账中...</p>
          <p className="text-sm text-gray-500 mt-2">正在比对银行流水与系统数据</p>
        </div>
      )}

      {step === 'result' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{matchedCount}</p>
              <p className="text-sm text-gray-600">匹配成功</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{unmatchedCount}</p>
              <p className="text-sm text-gray-600">存在差异</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{mockDifferences.length}</p>
              <p className="text-sm text-gray-600">总笔数</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border">
            <div className="px-4 py-3 border-b bg-gray-50 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
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
                {mockDifferences.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3">{item.type}</td>
                    <td className="px-4 py-3 text-right">¥{item.bankAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">¥{item.systemAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-medium" style={{ color: item.diff > 0 ? 'red' : 'green' }}>
                      {item.diff > 0 ? '+' : ''}{item.diff.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.status === 'matched' ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">已匹配</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">待处理</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.status === 'unmatched' && (
                        <button className="text-cyan-600 hover:underline text-xs">手动调平</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setStep('upload')} className="px-4 py-2 border rounded-lg hover:bg-gray-50">重新导入</button>
            <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />确认对账结果
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
