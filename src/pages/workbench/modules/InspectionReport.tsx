import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText, Download, Eye, Calendar, Building2, CheckCircle, X, Printer, Save } from 'lucide-react';

const templates = [
  { id: 'T001', name: '常规稽核报告', desc: '适用于日常稽核工作' },
  { id: 'T002', name: '专项稽核报告', desc: '适用于专项检查工作' },
  { id: 'T003', name: '飞行检查报告', desc: '适用于突击检查工作' },
];

const mockReports = [
  { id: 'R001', title: '南京市第一医院2024年1月稽核报告', institution: '南京市第一医院', date: '2024-01-20', status: 'completed', content: '本次稽核发现该医院在医保目录执行方面总体规范，但存在个别药品使用不规范的情况。建议加强内部管理，完善审核流程。' },
  { id: 'R002', title: '苏州中医院违规用药核查报告', institution: '苏州中医院', date: '2024-01-19', status: 'draft', content: '报告草稿，待完善...' },
];

export default function InspectionReport({ onBack }: { onBack: () => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [viewingReport, setViewingReport] = useState<typeof mockReports[0] | null>(null);
  const [reports, setReports] = useState(mockReports);
  const [showToast, setShowToast] = useState('');

  const handleView = (report: typeof mockReports[0]) => {
    setViewingReport(report);
  };

  const handleGenerate = () => {
    if (!selectedTemplate || !reportContent) {
      setShowToast('请填写完整信息');
      setTimeout(() => setShowToast(''), 2000);
      return;
    }
    const newReport = {
      id: `R${String(reports.length + 1).padStart(3, '0')}`,
      title: `新建稽核报告-${new Date().toLocaleDateString()}`,
      institution: '待填写',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      content: reportContent
    };
    setReports([newReport, ...reports]);
    setShowToast('报告生成成功');
    setTimeout(() => setShowToast(''), 2000);
    setReportContent('');
    setSelectedTemplate('');
  };

  const handleSaveDraft = () => {
    setShowToast('草稿保存成功');
    setTimeout(() => setShowToast(''), 2000);
  };

  const handleDownload = (report: typeof mockReports[0]) => {
    setShowToast('报告下载中...');
    setTimeout(() => setShowToast(''), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold">稽核报告</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">选择报告模板</h4>
          <div className="space-y-2">
            {templates.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`p-4 border rounded-lg cursor-pointer ${selectedTemplate === t.id ? 'border-cyan-500 bg-cyan-50' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-600" />
                  <span className="font-medium">{t.name}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">报告内容</h4>
          <textarea
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
            placeholder="请输入稽核报告内容..."
            className="w-full h-48 p-4 border rounded-lg resize-none"
          />
          <div className="flex gap-3">
            <button onClick={handleSaveDraft} className="flex-1 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />保存草稿
            </button>
            <button onClick={handleGenerate} className="flex-1 py-2 bg-cyan-600 text-white rounded-lg flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />生成报告
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h4 className="font-medium">历史报告</h4>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">报告标题</th>
              <th className="px-4 py-2 text-left">医疗机构</th>
              <th className="px-4 py-2 text-left">日期</th>
              <th className="px-4 py-2 text-left">状态</th>
              <th className="px-4 py-2 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {reports.map(r => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3">{r.title}</td>
                <td className="px-4 py-3">{r.institution}</td>
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${r.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {r.status === 'completed' ? '已完成' : '草稿'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right flex gap-2 justify-end">
                  <button onClick={() => handleView(r)} className="p-1 text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleDownload(r)} className="p-1 text-gray-600 hover:bg-gray-50 rounded"><Download className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {viewingReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{viewingReport.title}</h3>
                <button onClick={() => setViewingReport(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><span className="text-gray-500">机构:</span> {viewingReport.institution}</div>
                  <div><span className="text-gray-500">日期:</span> {viewingReport.date}</div>
                  <div><span className="text-gray-500">状态:</span> <span className={`px-2 py-1 rounded text-xs ${viewingReport.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{viewingReport.status === 'completed' ? '已完成' : '草稿'}</span></div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">报告内容</h4>
                  <p className="text-sm text-gray-700">{viewingReport.content}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleDownload(viewingReport)} className="flex-1 py-2 bg-cyan-600 text-white rounded-lg flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />下载报告
                  </button>
                  <button className="flex-1 py-2 border rounded-lg flex items-center justify-center gap-2">
                    <Printer className="w-4 h-4" />打印
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
