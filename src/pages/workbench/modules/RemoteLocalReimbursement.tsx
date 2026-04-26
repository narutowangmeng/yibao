import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home, ArrowLeft, Search, CheckCircle, Calendar, Building2, Upload
} from 'lucide-react';

interface ReimbursementRecord {
  id: string;
  name: string;
  idCard: string;
  hospital: string;
  date: string;
  amount: number;
  status: 'pending' | 'reviewing' | 'approved';
}

export default function RemoteLocalReimbursement({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  const mockRecords: ReimbursementRecord[] = [
    { id: 'R001', name: '参保人A', idCard: '110101199001011234', hospital: '上海瑞金医院', date: '2024-01-15', amount: 368.5, status: 'pending' },
    { id: 'R002', name: '参保人B', idCard: '110101198505056789', hospital: '广州中山医院', date: '2024-01-14', amount: 256.0, status: 'reviewing' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { bg: 'bg-orange-100', text: 'text-orange-700', label: '待受理' };
      case 'reviewing': return { bg: 'bg-blue-100', text: 'text-blue-700', label: '审核中' };
      case 'approved': return { bg: 'bg-green-100', text: 'text-green-700', label: '已通过' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: '未知' };
    }
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
              <h1 className="text-xl font-bold text-gray-800">异地安置报销</h1>
              <p className="text-sm text-gray-500">异地安置人员费用报销</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-lg ${activeTab === 'list' ? 'bg-violet-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>报销列表</button>
            <button onClick={() => setActiveTab('new')} className={`px-4 py-2 rounded-lg ${activeTab === 'new' ? 'bg-violet-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>新增报销</button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {activeTab === 'list' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl" placeholder="搜索姓名或身份证号" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">单据号</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">异地医院</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">金额</th>
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
                        <td className="px-6 py-4 text-sm text-gray-600">{record.hospital}</td>
                        <td className="px-6 py-4 text-sm font-medium text-violet-600">¥{record.amount.toFixed(2)}</td>
                        <td className="px-6 py-4"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>{status.label}</span></td>
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
              <h3 className="font-semibold text-gray-800 mb-6">异地安置信息</h3>
              <div className="grid grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">身份证号</label><input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="请输入身份证号" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">异地医院</label><input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="请输入异地医院名称" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">就诊日期</label><input type="date" className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">就诊金额</label><input type="number" className="w-full px-4 py-3 border border-gray-200 rounded-xl" placeholder="请输入金额" /></div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-6">上传材料</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-violet-400 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">上传异地安置证明、发票、费用清单等材料</p>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={() => setActiveTab('list')} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50">取消</button>
              <button className="px-8 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 flex items-center gap-2"><CheckCircle className="w-4 h-4" />提交报销</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
