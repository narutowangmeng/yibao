import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MessageSquare, Phone, Home, Send, History, BarChart3, Settings, CheckCircle, X, Bell } from 'lucide-react';

interface ArrearRecord {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  amount: number;
  months: number;
  lastPayDate: string;
  status: 'pending' | 'reminded' | 'paid';
}

const mockRecords: ArrearRecord[] = [
  { id: '1', name: '张三', idCard: '320101199001011234', phone: '13800138001', amount: 2400, months: 3, lastPayDate: '2024-09-15', status: 'pending' },
  { id: '2', name: '李四', idCard: '320101198505056789', phone: '13900139002', amount: 1600, months: 2, lastPayDate: '2024-10-20', status: 'reminded' },
  { id: '3', name: '王五', idCard: '320101199212123456', phone: '13700137003', amount: 800, months: 1, lastPayDate: '2024-11-10', status: 'pending' },
];

const reminderTemplates = [
  { id: 'sms', name: '短信模板', content: '【医保局】尊敬的{name}，您有{amount}元医保费用已欠费{months}个月，请及时缴费。' },
  { id: 'phone', name: '电话话术', content: '您好，这里是医保局，提醒您医保费用已欠费，请尽快处理。' },
  { id: 'door', name: '上门通知', content: '医保费用催缴通知单：您已欠费{amount}元，请于7日内到医保局办理。' },
];

export default function ReminderManage({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {
  const handleClose = onClose || onBack || (() => {});
  const [activeTab, setActiveTab] = useState<'list' | 'history' | 'stats' | 'settings'>('list');
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [reminderType, setReminderType] = useState<'sms' | 'phone' | 'door'>('sms');
  const [showSendModal, setShowSendModal] = useState(false);

  const stats = {
    totalArrears: 156,
    totalAmount: 312500,
    smsSent: 89,
    phoneCalled: 45,
    doorVisited: 12,
    successRate: 68,
  };

  const toggleSelect = (id: string) => {
    setSelectedRecords(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    setSelectedRecords(selectedRecords.length === mockRecords.length ? [] : mockRecords.map(r => r.id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">催缴管理</h1>
              <p className="text-sm text-gray-500">短信电话上门催缴</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {['list', 'history', 'stats', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab ? 'bg-cyan-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab === 'list' && '欠费列表'}
                {tab === 'history' && '催缴记录'}
                {tab === 'stats' && '统计报表'}
                {tab === 'settings' && '模板设置'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {activeTab === 'list' && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" className="w-full pl-10 pr-4 py-2 border rounded-lg" placeholder="搜索姓名、身份证号" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />筛选
                </button>
                <button 
                  onClick={() => setShowSendModal(true)}
                  disabled={selectedRecords.length === 0}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />批量催缴 ({selectedRecords.length})
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">
                      <input type="checkbox" checked={selectedRecords.length === mockRecords.length} onChange={selectAll} />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">姓名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">身份证号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">联系电话</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">欠费金额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">欠费月数</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">最后缴费</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecords.map((record) => (
                    <tr key={record.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedRecords.includes(record.id)} onChange={() => toggleSelect(record.id)} />
                      </td>
                      <td className="px-4 py-3 font-medium">{record.name}</td>
                      <td className="px-4 py-3 text-gray-600">{record.idCard}</td>
                      <td className="px-4 py-3">{record.phone}</td>
                      <td className="px-4 py-3 text-red-600 font-medium">¥{record.amount}</td>
                      <td className="px-4 py-3">{record.months}个月</td>
                      <td className="px-4 py-3 text-gray-500">{record.lastPayDate}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          record.status === 'pending' ? 'bg-red-100 text-red-700' :
                          record.status === 'reminded' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {record.status === 'pending' ? '待催缴' : record.status === 'reminded' ? '已催缴' : '已缴费'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><MessageSquare className="w-4 h-4" /></button>
                          <button className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Phone className="w-4 h-4" /></button>
                          <button className="p-1.5 text-orange-600 hover:bg-orange-50 rounded"><Home className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">欠费人数</p>
                  <p className="text-2xl font-bold">{stats.totalArrears}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">欠费总额 ¥{stats.totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">已催缴</p>
                  <p className="text-2xl font-bold">{stats.smsSent + stats.phoneCalled + stats.doorVisited}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                短信 {stats.smsSent} / 电话 {stats.phoneCalled} / 上门 {stats.doorVisited}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">催缴成功率</p>
                  <p className="text-2xl font-bold">{stats.successRate}%</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">本月催缴效果统计</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">催缴模板设置</h3>
            <div className="space-y-4">
              {reminderTemplates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {template.id === 'sms' && <MessageSquare className="w-4 h-4 text-blue-600" />}
                    {template.id === 'phone' && <Phone className="w-4 h-4 text-green-600" />}
                    {template.id === 'door' && <Home className="w-4 h-4 text-orange-600" />}
                    <span className="font-medium">{template.name}</span>
                  </div>
                  <textarea className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} defaultValue={template.content} />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存设置</button>
            </div>
          </div>
        )}
      </div>

      {showSendModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSendModal(false)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">批量催缴</h3>
            <p className="text-gray-600 mb-4">已选择 {selectedRecords.length} 人</p>
            <div className="space-y-2 mb-6">
              <button onClick={() => setReminderType('sms')} className={`w-full flex items-center gap-3 p-3 border rounded-lg ${reminderType === 'sms' ? 'border-cyan-500 bg-cyan-50' : ''}`}>
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span>短信催缴</span>
              </button>
              <button onClick={() => setReminderType('phone')} className={`w-full flex items-center gap-3 p-3 border rounded-lg ${reminderType === 'phone' ? 'border-cyan-500 bg-cyan-50' : ''}`}>
                <Phone className="w-5 h-5 text-green-600" />
                <span>电话催缴</span>
              </button>
              <button onClick={() => setReminderType('door')} className={`w-full flex items-center gap-3 p-3 border rounded-lg ${reminderType === 'door' ? 'border-cyan-500 bg-cyan-50' : ''}`}>
                <Home className="w-5 h-5 text-orange-600" />
                <span>上门催缴</span>
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowSendModal(false)} className="flex-1 px-4 py-2 border rounded-lg">取消</button>
              <button onClick={() => setShowSendModal(false)} className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg">确认发送</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
