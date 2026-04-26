import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightLeft, Search, Plus, FileText, Printer, Clock,
  CheckCircle, AlertCircle, Download, Eye, RotateCcw,
  MapPin, Building2, User, Calendar, Phone
} from 'lucide-react';

const tabs = [
  { id: 'in', label: '转入申请', icon: ArrowRightLeft },
  { id: 'out', label: '转出申请', icon: ArrowRightLeft },
  { id: 'progress', label: '转移进度', icon: Clock },
  { id: 'history', label: '历史记录', icon: FileText }
];

const mockTransferIn = [
  { id: 'TI001', name: '参保人A', idCard: '110101199001011234', fromRegion: '上海市', toRegion: '北京市', status: '审核中', applyDate: '2024-01-15' },
  { id: 'TI002', name: '参保人B', idCard: '310101198505056789', fromRegion: '广东省深圳市', toRegion: '北京市', status: '待确认', applyDate: '2024-01-14' }
];

const mockTransferOut = [
  { id: 'TO001', name: '参保人C', idCard: '110101199212123456', toRegion: '浙江省杭州市', status: '已转出', applyDate: '2024-01-10', outDate: '2024-01-12' }
];

const mockProgress = [
  { id: 'TP001', name: '参保人D', idCard: '110101199508152222', currentStep: '资金划转中', progress: 75, steps: ['申请提交', '转出地审核', '资金划转中', '转入地确认', '完成'] }
];

export default function TransferModule() {
  const [activeTab, setActiveTab] = useState('in');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'in' | 'out'>('in');

  const renderContent = () => {
    switch (activeTab) {
      case 'in':
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="搜索姓名或身份证号" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
              </div>
              <button onClick={() => { setModalType('in'); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg">
                <Plus className="w-4 h-4" />新增转入
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50"><tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">身份证号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">转出地</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">申请日期</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                </tr></thead>
                <tbody>
                  {mockTransferIn.map((item) => (
                    <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{item.idCard}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.fromRegion}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded ${item.status === '审核中' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{item.status}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.applyDate}</td>
                      <td className="px-4 py-3"><div className="flex gap-2"><button className="p-1 text-gray-400 hover:text-cyan-600"><Eye className="w-4 h-4" /></button><button className="p-1 text-gray-400 hover:text-cyan-600"><Printer className="w-4 h-4" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'out':
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="搜索姓名或身份证号" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
              </div>
              <button onClick={() => { setModalType('out'); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg">
                <Plus className="w-4 h-4" />新增转出
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50"><tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">转入地</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">转出日期</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                </tr></thead>
                <tbody>
                  {mockTransferOut.map((item) => (
                    <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.toRegion}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">{item.status}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.outDate}</td>
                      <td className="px-4 py-3"><div className="flex gap-2"><button className="p-1 text-gray-400 hover:text-cyan-600"><Eye className="w-4 h-4" /></button><button className="p-1 text-gray-400 hover:text-cyan-600"><Download className="w-4 h-4" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'progress':
        return (
          <div className="space-y-4">
            {mockProgress.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div><h4 className="font-semibold text-gray-800">{item.name}</h4><p className="text-sm text-gray-500">{item.idCard}</p></div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{item.currentStep}</span>
                </div>
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full"><div className="h-2 bg-cyan-600 rounded-full" style={{ width: `${item.progress}%` }} /></div>
                  <div className="flex justify-between mt-2">
                    {item.steps.map((step, idx) => (
                      <div key={idx} className={`text-xs ${idx <= 2 ? 'text-cyan-600' : 'text-gray-400'}`}>{step}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500"><FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>暂无历史记录</p></div>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'}`}>
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{renderContent()}</motion.div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">{modalType === 'in' ? '医保关系转入申请' : '医保关系转出申请'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="mb-1 block text-sm font-medium text-gray-700">姓名 *</label><input type="text" className="w-full rounded-lg border border-gray-200 px-3 py-2" placeholder="请输入姓名" /></div>
                <div><label className="mb-1 block text-sm font-medium text-gray-700">身份证号 *</label><input type="text" className="w-full rounded-lg border border-gray-200 px-3 py-2" placeholder="请输入身份证号" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="mb-1 block text-sm font-medium text-gray-700">{modalType === 'in' ? '转出地' : '转入地'} *</label><select className="w-full rounded-lg border border-gray-200 px-3 py-2"><option>选择省份</option><option>北京市</option><option>上海市</option><option>广东省</option></select></div>
                <div><label className="mb-1 block text-sm font-medium text-gray-700">联系电话 *</label><input type="text" className="w-full rounded-lg border border-gray-200 px-3 py-2" placeholder="请输入联系电话" /></div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">取消</button>
              <button onClick={() => setShowModal(false)} className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">提交申请</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
