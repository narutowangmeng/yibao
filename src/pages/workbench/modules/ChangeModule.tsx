import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, CreditCard, Building, FileText, Search, Filter,
  Download, CheckCircle, Clock, AlertCircle, ChevronRight,
  History, Edit3, Plus
} from 'lucide-react';

const changeTypes = [
  { id: 'basic', label: '基本信息变更', icon: User, desc: '姓名、身份证号、联系方式等' },
  { id: 'insurance', label: '参保信息变更', icon: CreditCard, desc: '参保类型、缴费档次、参保状态等' },
  { id: 'bank', label: '银行账户变更', icon: Building, desc: '银行卡号、开户行信息等' }
];

const mockChangeRecords = [
  { id: 'C001', type: '基本信息变更', name: '参保人A', idCard: '110101199001011234', item: '联系电话', oldValue: '138****1234', newValue: '139****5678', status: '已通过', time: '2024-01-15 10:30' },
  { id: 'C002', type: '参保信息变更', name: '参保人B', idCard: '110101198505056789', item: '参保类型', oldValue: '城乡居民', newValue: '灵活就业', status: '审核中', time: '2024-01-15 09:15' },
  { id: 'C003', type: '银行账户变更', name: '参保人C', idCard: '110101199212123456', item: '银行卡号', oldValue: '6222****1234', newValue: '6225****5678', status: '待提交', time: '2024-01-14 16:45' }
];

export default function ChangeModule() {
  const [activeType, setActiveType] = useState('basic');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = {
    today: 23,
    pending: 8,
    approved: 156,
    rejected: 12
  };

  const filteredRecords = mockChangeRecords.filter(r => {
    if (filterStatus !== 'all' && !r.status.includes(filterStatus)) return false;
    if (searchTerm && !r.name.includes(searchTerm) && !r.idCard.includes(searchTerm)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">今日变更</p>
          <p className="text-2xl font-bold text-cyan-600">{stats.today}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">待审核</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">已通过</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">已驳回</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {changeTypes.map((type) => {
          const Icon = type.icon;
          return (
            <motion.button
              key={type.id}
              onClick={() => { setActiveType(type.id); setShowForm(false); }}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                activeType === type.id ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:border-cyan-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${activeType === type.id ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{type.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {!showForm ? (
        <>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索姓名或身份证号"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">全部状态</option>
              <option value="待提交">待提交</option>
              <option value="审核中">审核中</option>
              <option value="已通过">已通过</option>
              <option value="已驳回">已驳回</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              导出
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            >
              <Plus className="w-4 h-4" />
              新增变更
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">变更编号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">变更类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">姓名/身份证号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">变更项目</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">原值→新值</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">时间</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{record.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{record.type}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-800">{record.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{record.idCard}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.item}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-gray-400">{record.oldValue}</span>
                      <ChevronRight className="w-3 h-3 inline mx-1 text-gray-400" />
                      <span className="text-cyan-600">{record.newValue}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        record.status === '已通过' ? 'bg-green-100 text-green-700' :
                        record.status === '审核中' ? 'bg-blue-100 text-blue-700' :
                        record.status === '已驳回' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{record.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{record.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Edit3 className="w-5 h-5 text-cyan-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              {changeTypes.find(t => t.id === activeType)?.label}申请
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">身份证号 *</label>
              <input type="text" className="w-full rounded-lg border border-gray-200 px-3 py-2" placeholder="请输入身份证号" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
              <input type="text" className="w-full rounded-lg border border-gray-200 px-3 py-2" placeholder="请输入姓名" />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">变更内容 *</label>
            <textarea className="w-full rounded-lg border border-gray-200 px-3 py-2 h-24" placeholder="请详细描述变更内容" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">证明材料</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">点击上传或拖拽文件到此处</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">提交申请</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
