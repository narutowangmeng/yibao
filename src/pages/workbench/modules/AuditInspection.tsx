import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, Plus, FileText, CheckCircle, AlertCircle,
  Calendar, MapPin, User, Building2, Download, Eye, Edit2,
  ClipboardCheck, TrendingUp, Clock, XCircle, Send
} from 'lucide-react';

const tabs = [
  { id: 'tasks', label: '稽核任务', icon: ClipboardCheck },
  { id: 'plans', label: '稽核计划', icon: Calendar },
  { id: 'records', label: '现场记录', icon: FileText },
  { id: 'issues', label: '问题登记', icon: AlertCircle },
  { id: 'reports', label: '稽核报告', icon: FileText },
  { id: 'notices', label: '整改通知', icon: Send },
  { id: 'tracking', label: '整改跟踪', icon: CheckCircle },
  { id: 'stats', label: '统计分析', icon: TrendingUp }
];

const mockTasks = [
  { id: 'J001', name: 'XX医院专项稽核', type: '医疗机构', status: '进行中', startDate: '2024-01-15', endDate: '2024-01-20', leader: '参保人A' },
  { id: 'J002', name: '药店飞行检查', type: '定点药店', status: '待开始', startDate: '2024-01-22', endDate: '2024-01-22', leader: '参保人B' },
  { id: 'J003', name: '参保单位核查', type: '参保单位', status: '已完成', startDate: '2024-01-10', endDate: '2024-01-12', leader: '参保人C' }
];

const mockIssues = [
  { id: 'W001', taskId: 'J001', desc: '处方管理不规范', severity: '一般', status: '待整改', deadline: '2024-01-25' },
  { id: 'W002', taskId: 'J001', desc: '进销存记录不完整', severity: '严重', status: '整改中', deadline: '2024-01-20' }
];

export default function AuditInspection() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [showModal, setShowModal] = useState(false);

  const stats = { total: 156, ongoing: 12, completed: 134, issues: 45 };

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="搜索任务名称" className="w-full pl-10 pr-4 py-2 border rounded-lg" />
              </div>
              <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg">
                <Plus className="w-4 h-4" />新建任务
              </button>
            </div>
            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">任务编号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">任务名称</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">稽核对象</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">负责人</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTasks.map((t) => (
                    <tr key={t.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono">{t.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{t.name}</td>
                      <td className="px-4 py-3 text-sm">{t.type}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded ${t.status === '已完成' ? 'bg-green-100 text-green-700' : t.status === '进行中' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{t.status}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{t.leader}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="p-1 text-gray-400 hover:text-cyan-600"><Eye className="w-4 h-4" /></button>
                          <button className="p-1 text-gray-400 hover:text-cyan-600"><Edit2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'issues':
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="搜索问题描述" className="w-full pl-10 pr-4 py-2 border rounded-lg" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg">
                <Plus className="w-4 h-4" />登记问题
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {mockIssues.map((i) => (
                <div key={i.id} className="bg-white rounded-xl p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono text-gray-500">{i.id}</span>
                    <span className={`px-2 py-1 text-xs rounded ${i.severity === '严重' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{i.severity}</span>
                  </div>
                  <p className="text-sm font-medium mb-2">{i.desc}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>关联任务: {i.taskId}</span>
                    <span>截止: {i.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>该模块功能正在开发中</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">稽核任务总数</p>
          <p className="text-2xl font-bold text-cyan-600">{stats.total}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">进行中</p>
          <p className="text-2xl font-bold text-blue-600">{stats.ongoing}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">已完成</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">发现问题</p>
          <p className="text-2xl font-bold text-orange-600">{stats.issues}</p>
        </motion.div>
      </div>

      <div className="flex gap-2 border-b">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === t.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600'}`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{renderContent()}</motion.div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">新建稽核任务</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">任务名称</label>
                <input type="text" className="w-full rounded-lg border px-3 py-2" placeholder="请输入任务名称" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">稽核对象类型</label>
                <select className="w-full rounded-lg border px-3 py-2">
                  <option>医疗机构</option>
                  <option>定点药店</option>
                  <option>参保单位</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">开始日期</label>
                  <input type="date" className="w-full rounded-lg border px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">结束日期</label>
                  <input type="date" className="w-full rounded-lg border px-3 py-2" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">创建任务</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
