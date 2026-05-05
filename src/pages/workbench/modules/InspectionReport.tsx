import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Eye, X, Printer, Save, Search } from 'lucide-react';

interface ReportItem {
  id: string;
  title: string;
  institution: string;
  city: string;
  date: string;
  status: 'completed' | 'draft';
  type: string;
  content: string;
}

const templates = [
  { id: 'T001', name: '常规稽核报告', desc: '适用于日常巡查和一般性基金监管检查' },
  { id: 'T002', name: '专项稽核报告', desc: '适用于高值耗材、门诊慢特病、价格执行等专项检查' },
  { id: 'T003', name: '飞行检查报告', desc: '适用于突击检查、双通道药店、异地结算专项核查' },
];

const initialReports: ReportItem[] = [
  { id: 'IR320001', title: '江苏省人民医院高值耗材专项稽核报告', institution: '江苏省人民医院', city: '南京', date: '2026-04-20', status: 'completed', type: '专项稽核报告', content: '本次稽核发现骨科高值耗材授权单留存不完整，个别病例存在目录外耗材收费口径不规范问题。建议追回基金 2.5 万元，并限期 15 个工作日完成整改。' },
  { id: 'IR320002', title: '苏州雷允上双通道药房飞行检查报告', institution: '苏州雷允上双通道药房', city: '苏州', date: '2026-04-22', status: 'draft', type: '飞行检查报告', content: '报告草稿：已核查双通道处方流转、审方留痕和库存追溯，待补充药师说明材料。' },
  { id: 'IR320003', title: '无锡市人民医院门诊慢特病巡查报告', institution: '无锡市人民医院', city: '无锡', date: '2026-04-18', status: 'completed', type: '常规稽核报告', content: '门诊慢特病备案、药品目录和待遇支付比例执行总体规范，发现 1 例药品周期边界问题，已现场纠正。' },
];

export default function InspectionReport({ onBack }: { onBack: () => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [reportInstitution, setReportInstitution] = useState('');
  const [reportCity, setReportCity] = useState('');
  const [viewingReport, setViewingReport] = useState<ReportItem | null>(null);
  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [showToast, setShowToast] = useState('');
  const [keyword, setKeyword] = useState('');

  const filteredReports = useMemo(
    () => reports.filter((item) => [item.id, item.title, item.institution, item.city, item.type].some((field) => field.includes(keyword))),
    [reports, keyword],
  );

  const handleGenerate = () => {
    if (!selectedTemplate || !reportContent || !reportInstitution || !reportCity) {
      setShowToast('请填写完整报告信息');
      setTimeout(() => setShowToast(''), 1800);
      return;
    }
    const newReport: ReportItem = {
      id: `IR${String(reports.length + 320001).slice(-6)}`,
      title: `${reportInstitution}${templates.find((item) => item.id === selectedTemplate)?.name || '稽核报告'}`,
      institution: reportInstitution,
      city: reportCity,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      type: templates.find((item) => item.id === selectedTemplate)?.name || '稽核报告',
      content: reportContent,
    };
    setReports([newReport, ...reports]);
    setShowToast('报告生成成功');
    setTimeout(() => setShowToast(''), 1800);
    setReportContent('');
    setSelectedTemplate('');
    setReportInstitution('');
    setReportCity('');
  };

  const handleSaveDraft = () => {
    setShowToast('草稿已保存');
    setTimeout(() => setShowToast(''), 1800);
  };

  const handleDownload = () => {
    setShowToast('报告下载中...');
    setTimeout(() => setShowToast(''), 1800);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100"><ArrowLeft className="h-5 w-5" /></button>
          <h3 className="text-xl font-bold">稽核报告</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">选择报告模板</h4>
          <div className="space-y-2">
            {templates.map((item) => (
              <div key={item.id} onClick={() => setSelectedTemplate(item.id)} className={`cursor-pointer rounded-lg border p-4 ${selectedTemplate === item.id ? 'border-cyan-500 bg-cyan-50' : 'hover:bg-gray-50'}`}>
                <div className="font-medium">{item.name}</div>
                <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">报告内容</h4>
          <div className="grid grid-cols-2 gap-3">
            <input value={reportInstitution} onChange={(e) => setReportInstitution(e.target.value)} className="rounded-lg border px-3 py-2" placeholder="医疗机构" />
            <input value={reportCity} onChange={(e) => setReportCity(e.target.value)} className="rounded-lg border px-3 py-2" placeholder="参保地市" />
          </div>
          <textarea value={reportContent} onChange={(e) => setReportContent(e.target.value)} placeholder="请输入稽核报告正文、问题说明、处理建议和整改要求" className="h-56 w-full resize-none rounded-lg border p-4" />
          <div className="flex gap-3">
            <button onClick={handleSaveDraft} className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 hover:bg-gray-50"><Save className="h-4 w-4" />保存草稿</button>
            <button onClick={handleGenerate} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-600 py-2 text-white"><Download className="h-4 w-4" />生成报告</button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white">
        <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
          <h4 className="font-medium">历史报告</h4>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-72 rounded-lg border py-2 pl-10 pr-4" placeholder="搜索报告、机构、地市、类型" />
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">报告标题</th>
              <th className="px-4 py-2 text-left">医疗机构</th>
              <th className="px-4 py-2 text-left">地市</th>
              <th className="px-4 py-2 text-left">日期</th>
              <th className="px-4 py-2 text-left">状态</th>
              <th className="px-4 py-2 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredReports.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3">{item.city}</td>
                <td className="px-4 py-3">{item.date}</td>
                <td className="px-4 py-3"><span className={`rounded px-2 py-1 text-xs ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status === 'completed' ? '已完成' : '草稿'}</span></td>
                <td className="flex justify-end gap-2 px-4 py-3 text-right">
                  <button onClick={() => setViewingReport(item)} className="rounded p-1 text-cyan-600 hover:bg-cyan-50"><Eye className="h-4 w-4" /></button>
                  <button onClick={handleDownload} className="rounded p-1 text-gray-600 hover:bg-gray-50"><Download className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {viewingReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="max-h-[80vh] w-full max-w-3xl overflow-auto rounded-xl bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">{viewingReport.title}</h3>
                <button onClick={() => setViewingReport(null)} className="rounded p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div><span className="text-gray-500">机构：</span>{viewingReport.institution}</div>
                  <div><span className="text-gray-500">地市：</span>{viewingReport.city}</div>
                  <div><span className="text-gray-500">日期：</span>{viewingReport.date}</div>
                  <div><span className="text-gray-500">状态：</span><span className={`rounded px-2 py-1 text-xs ${viewingReport.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{viewingReport.status === 'completed' ? '已完成' : '草稿'}</span></div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 font-medium">报告内容</h4>
                  <p className="text-sm text-gray-700">{viewingReport.content}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleDownload} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-600 py-2 text-white"><Download className="h-4 w-4" />下载报告</button>
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-2"><Printer className="h-4 w-4" />打印</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-4 right-4 rounded-lg bg-gray-800 px-4 py-2 text-white shadow-lg">{showToast}</motion.div>}
      </AnimatePresence>
    </div>
  );
}
