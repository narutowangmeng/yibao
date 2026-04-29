import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, Trash2, Calendar, CheckCircle, Clock } from 'lucide-react';
import { exportJsonToWorkbook } from '../../../utils/exportHelpers';

interface FinanceReportProps {
  onBack: () => void;
}

const mockReports = [
  { id: 1, name: '2024年6月基金收支月报', type: '月报', date: '2024-07-05', size: '2.3MB', status: '已生成' },
  { id: 2, name: '2024年第二季度基金分析报告', type: '季报', date: '2024-07-01', size: '5.1MB', status: '已生成' },
  { id: 3, name: '2024年上半年基金统计报告', type: '半年报', date: '2024-07-01', size: '8.5MB', status: '已生成' },
];

export default function FinanceReport({ onBack }: FinanceReportProps) {
  const [reportType, setReportType] = useState('月报');
  const [reportPeriod, setReportPeriod] = useState('2024-06');
  const [reports, setReports] = useState(mockReports);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const newReport = {
        id: reports.length + 1,
        name: `${reportPeriod} ${reportType}`,
        type: reportType,
        date: new Date().toISOString().split('T')[0],
        size: '1.5MB',
        status: '已生成'
      };
      setReports([newReport, ...reports]);
      setGenerating(false);
    }, 1500);
  };

  const handleDownload = (report: typeof reports[0]) => {
    exportJsonToWorkbook(
      reports.map((item) => ({
        报表名称: item.name,
        报表类型: item.type,
        生成日期: item.date,
        文件大小: item.size,
        状态: item.status,
      })),
      '财务报表',
      `${report.name}.xlsx`,
    );
  };

  const handleDelete = (id: number) => {
    setReports(reports.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">基金报表</h2>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-700 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              生成新报表
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">报表类型</label>
                <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500">
                  <option>月报</option>
                  <option>季报</option>
                  <option>半年报</option>
                  <option>年报</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">报表期间</label>
                <input type="month" value={reportPeriod} onChange={(e) => setReportPeriod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
              </div>
              <button onClick={handleGenerate} disabled={generating} className="w-full py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2">
                {generating ? <Clock className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                {generating ? '生成中...' : '生成报表'}
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-800 mb-4">报表统计</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">{reports.length}</p>
                <p className="text-sm text-gray-600">已生成报表</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{reports.filter(r => r.status === '已生成').length}</p>
                <p className="text-sm text-gray-600">可下载</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">已生成报表</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div key={report.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <FileText className="w-10 h-10 text-amber-600" />
                  <div>
                    <p className="font-medium text-gray-800">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.type} · {report.date} · {report.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />{report.status}
                  </span>
                  <button onClick={() => handleDownload(report)} className="p-2 text-gray-400 hover:text-amber-600">
                    <Download className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(report.id)} className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
