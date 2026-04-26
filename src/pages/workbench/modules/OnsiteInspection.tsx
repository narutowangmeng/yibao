import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Camera, CheckCircle, FileText, Building2, Upload, Eye, X } from 'lucide-react';

interface OnsiteInspectionProps {
  onClose: () => void;
  onBack: () => void;
}

interface CheckItem {
  id: string;
  name: string;
  status: 'pending' | 'pass' | 'fail';
}

interface InspectionRecord {
  id: string;
  institution: string;
  date: string;
  result: string;
  status: string;
}

const institutions = [
  { id: 'I001', name: '南京市第一医院' },
  { id: 'I002', name: '苏州大学附属医院' },
  { id: 'I003', name: '无锡市人民医院' },
];

const checkItems: CheckItem[] = [
  { id: 'C001', name: '医保目录执行情况', status: 'pending' },
  { id: 'C002', name: '诊疗项目合规性', status: 'pending' },
  { id: 'C003', name: '药品使用规范性', status: 'pending' },
  { id: 'C004', name: '收费价格标准', status: 'pending' },
];

const mockHistory: InspectionRecord[] = [
  { id: 'H001', institution: '南京市第一医院', date: '2024-01-15', result: '合格', status: '已完成' },
  { id: 'H002', institution: '苏州中医院', date: '2024-01-10', result: '基本合格', status: '已完成' },
];

export default function OnsiteInspection({ onBack }: OnsiteInspectionProps) {
  const [view, setView] = useState<'form' | 'history' | 'detail'>('form');
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [checkDate, setCheckDate] = useState('');
  const [checkResults, setCheckResults] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<InspectionRecord | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleCheckItem = (id: string, result: string) => {
    setCheckResults({ ...checkResults, [id]: result });
  };

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCheckResults({});
      setSelectedInstitution('');
      setCheckDate('');
      setPhotos([]);
    }, 1500);
  };

  const viewDetail = (record: InspectionRecord) => {
    setSelectedRecord(record);
    setView('detail');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold">现场检查</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('history')}
            className={`px-4 py-2 rounded-lg text-sm ${view === 'history' ? 'bg-cyan-600 text-white' : 'bg-gray-100'}`}
          >
            历史记录
          </button>
          <button
            onClick={() => setView('form')}
            className={`px-4 py-2 rounded-lg text-sm ${view === 'form' ? 'bg-cyan-600 text-white' : 'bg-gray-100'}`}
          >
            新建检查
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'form' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Building2 className="w-4 h-4" />检查机构
                </label>
                <select
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">请选择机构</option>
                  {institutions.map((i) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />检查日期
                </label>
                <input
                  type="date"
                  value={checkDate}
                  onChange={(e) => setCheckDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />检查项目清单
              </h4>
              <div className="space-y-2">
                {checkItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span>{item.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleCheckItem(item.id, 'pass')}
                        className={`px-3 py-1 rounded text-sm ${checkResults[item.id] === 'pass' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
                      >
                        通过
                      </button>
                      <button
                        onClick={() => toggleCheckItem(item.id, 'fail')}
                        className={`px-3 py-1 rounded text-sm ${checkResults[item.id] === 'fail' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}
                      >
                        不通过
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4" />现场拍照
              </h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-cyan-400 cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">点击上传现场照片</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={onBack} className="px-6 py-2 border rounded-lg hover:bg-gray-50">取消</button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />提交检查
              </button>
            </div>
          </motion.div>
        )}

        {view === 'history' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-white rounded-xl border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm">单号</th>
                    <th className="px-4 py-3 text-left text-sm">机构</th>
                    <th className="px-4 py-3 text-left text-sm">日期</th>
                    <th className="px-4 py-3 text-left text-sm">结果</th>
                    <th className="px-4 py-3 text-left text-sm">状态</th>
                    <th className="px-4 py-3 text-right text-sm">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{record.id}</td>
                      <td className="px-4 py-3">{record.institution}</td>
                      <td className="px-4 py-3">{record.date}</td>
                      <td className="px-4 py-3">{record.result}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">{record.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => viewDetail(record)}
                          className="p-2 text-cyan-600 hover:bg-cyan-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {view === 'detail' && selectedRecord && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold mb-2">检查详情</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">单号:</span> {selectedRecord.id}</div>
                <div><span className="text-gray-500">机构:</span> {selectedRecord.institution}</div>
                <div><span className="text-gray-500">日期:</span> {selectedRecord.date}</div>
                <div><span className="text-gray-500">结果:</span> {selectedRecord.result}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium mb-2">检查项目</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-white rounded"><span>医保目录执行情况</span><span className="text-green-600">通过</span></div>
                <div className="flex justify-between p-2 bg-white rounded"><span>诊疗项目合规性</span><span className="text-green-600">通过</span></div>
                <div className="flex justify-between p-2 bg-white rounded"><span>药品使用规范性</span><span className="text-yellow-600">基本通过</span></div>
              </div>
            </div>
            <button onClick={() => setView('history')} className="w-full py-2 border rounded-lg">返回</button>
          </motion.div>
        )}
      </AnimatePresence>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        >
          <div className="bg-white rounded-xl p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-lg font-medium">检查提交成功</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
