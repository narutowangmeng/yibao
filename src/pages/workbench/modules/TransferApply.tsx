import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeftRight, ArrowLeft, Search, User, CheckCircle,
  Building2, MapPin, FileText, Upload, Plane, ArrowRight
} from 'lucide-react';

interface TransferRecord {
  id: string;
  name: string;
  idCard: string;
  fromRegion: string;
  toRegion: string;
  type: 'in' | 'out';
  status: 'pending' | 'processing' | 'completed';
  applyDate: string;
}

export default function TransferApply({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
  const [transferType, setTransferType] = useState<'in' | 'out'>('in');
  const [showSuccess, setShowSuccess] = useState(false);

  const mockRecords: TransferRecord[] = [
    { id: 'T001', name: '参保人A', idCard: '110101199001011234', fromRegion: '河北省', toRegion: '北京市', type: 'in', status: 'completed', applyDate: '2024-01-10' },
    { id: 'T002', name: '参保人B', idCard: '110101198505056789', fromRegion: '北京市', toRegion: '上海市', type: 'out', status: 'processing', applyDate: '2024-01-15' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { bg: 'bg-orange-100', text: 'text-orange-700', label: '待审核' };
      case 'processing': return { bg: 'bg-blue-100', text: 'text-blue-700', label: '处理中' };
      case 'completed': return { bg: 'bg-green-100', text: 'text-green-700', label: '已完成' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: '未知' };
    }
  };

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setActiveTab('list');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">关系转移</h1>
              <p className="text-sm text-gray-500">医保关系转移接续</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'list' ? 'bg-rose-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              转移记录
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'new' ? 'bg-rose-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              申请转移
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {activeTab === 'list' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">申请编号</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">转移类型</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">转出地</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">转入地</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">申请日期</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecords.map((record) => {
                    const status = getStatusBadge(record.status);
                    return (
                      <tr key={record.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono text-gray-600">{record.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">{record.name}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            record.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {record.type === 'in' ? '转入' : '转出'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{record.fromRegion}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{record.toRegion}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{record.applyDate}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-6">选择转移类型</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setTransferType('in')}
                  className={`flex-1 p-6 rounded-xl border-2 text-center transition-all ${
                    transferType === 'in'
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ArrowRight className={`w-8 h-8 mx-auto mb-2 ${transferType === 'in' ? 'text-rose-600' : 'text-gray-400'}`} />
                  <div className={`font-medium ${transferType === 'in' ? 'text-rose-700' : 'text-gray-700'}`}>医保关系转入</div>
                  <div className="text-sm text-gray-500 mt-1">从外地转入本市</div>
                </button>
                <button
                  onClick={() => setTransferType('out')}
                  className={`flex-1 p-6 rounded-xl border-2 text-center transition-all ${
                    transferType === 'out'
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Plane className={`w-8 h-8 mx-auto mb-2 ${transferType === 'out' ? 'text-rose-600' : 'text-gray-400'}`} />
                  <div className={`font-medium ${transferType === 'out' ? 'text-rose-700' : 'text-gray-700'}`}>医保关系转出</div>
                  <div className="text-sm text-gray-500 mt-1">从本市转出外地</div>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-6">基本信息</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">身份证号</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="请输入身份证号"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="请输入姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {transferType === 'in' ? '转出地' : '转入地'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder={`请输入${transferType === 'in' ? '转出地' : '转入地'}医保经办机构`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">联系电话</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="请输入联系电话"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-6">上传材料</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-rose-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">点击或拖拽上传身份证、参保证明等材料</p>
                <p className="text-sm text-gray-400 mt-2">支持 PDF、JPG、PNG 格式</p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setActiveTab('list')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                提交申请
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">申请成功</h3>
            <p className="text-gray-600">转移申请已提交，请等待审核</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
