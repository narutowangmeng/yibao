import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ClipboardList, Building2, Calendar, User, CheckCircle, Clock, Eye, X, Play, RotateCcw } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  institution: string;
  type: string;
  date: string;
  assignee: string;
  status: 'pending' | 'processing' | 'completed';
  description?: string;
  findings?: string;
}

const mockTasks: Task[] = [
  { id: 'T001', name: '南京市医疗机构专项稽核', institution: '南京市第一医院', type: '专项稽核', date: '2024-01-20', assignee: '张稽核', status: 'processing', description: '对医院医保使用情况进行全面稽核' },
  { id: 'T002', name: '苏州市违规用药核查', institution: '苏州中医院', type: '违规查处', date: '2024-01-19', assignee: '李稽核', status: 'pending', description: '核查异常用药记录' },
];

const institutions = ['南京市第一医院', '苏州中医院', '无锡人民医院', '常州二院'];
const types = ['专项稽核', '飞行检查', '违规查处', '日常巡查'];

export default function InspectionTask({ onBack }: { onBack: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [formData, setFormData] = useState({ name: '', institution: '', type: '', date: '', assignee: '', description: '' });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleSubmit = () => {
    const newTask: Task = {
      id: `T${String(tasks.length + 1).padStart(3, '0')}`,
      ...formData,
      status: 'pending'
    };
    setTasks([...tasks, newTask]);
    setShowForm(false);
    setFormData({ name: '', institution: '', type: '', date: '', assignee: '', description: '' });
    showToast('任务创建成功');
  };

  const updateStatus = (id: string, status: Task['status']) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
    showToast('状态更新成功');
  };

  const getStatusBadge = (status: string) => {
    const styles = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' };
    const labels = { pending: '待处理', processing: '进行中', completed: '已完成' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <h3 className="text-xl font-bold">稽核任务</h3>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">创建任务</button>
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </motion.div>
      )}

      {showForm ? (
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">任务名称</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="请输入任务名称" /></div>
            <div><label className="block text-sm font-medium mb-1">稽核机构</label><select value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} className="w-full border rounded-lg px-3 py-2"><option value="">选择机构</option>{institutions.map(i => <option key={i}>{i}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">稽核类型</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border rounded-lg px-3 py-2"><option value="">选择类型</option>{types.map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">计划日期</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
            <div className="col-span-2"><label className="block text-sm font-medium mb-1">任务描述</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="请输入任务描述" rows={2} /></div>
            <div><label className="block text-sm font-medium mb-1">稽核人员</label><input value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="请输入稽核人员" /></div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">取消</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">创建</button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border">
          <table className="w-full">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">任务名称</th><th className="px-4 py-3 text-left text-sm">机构</th><th className="px-4 py-3 text-left text-sm">类型</th><th className="px-4 py-3 text-left text-sm">日期</th><th className="px-4 py-3 text-left text-sm">负责人</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-right text-sm">操作</th></tr></thead>
            <tbody className="divide-y">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{task.name}</td>
                  <td className="px-4 py-3">{task.institution}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{task.type}</span></td>
                  <td className="px-4 py-3">{task.date}</td>
                  <td className="px-4 py-3">{task.assignee}</td>
                  <td className="px-4 py-3">{getStatusBadge(task.status)}</td>
                  <td className="px-4 py-3 text-right"><button onClick={() => setSelectedTask(task)} className="p-2 text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {selectedTask && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] overflow-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <h4 className="text-lg font-bold">任务详情</h4>
                <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">任务编号:</span> {selectedTask.id}</div>
                  <div><span className="text-gray-500">任务名称:</span> {selectedTask.name}</div>
                  <div><span className="text-gray-500">稽核机构:</span> {selectedTask.institution}</div>
                  <div><span className="text-gray-500">稽核类型:</span> {selectedTask.type}</div>
                  <div><span className="text-gray-500">计划日期:</span> {selectedTask.date}</div>
                  <div><span className="text-gray-500">负责人:</span> {selectedTask.assignee}</div>
                  <div><span className="text-gray-500">当前状态:</span> {getStatusBadge(selectedTask.status)}</div>
                </div>
                {selectedTask.description && <div className="text-sm"><span className="text-gray-500">任务描述:</span> <p className="mt-1 text-gray-700">{selectedTask.description}</p></div>}
                <div className="flex gap-2 pt-4 border-t">
                  {selectedTask.status === 'pending' && (
                    <button onClick={() => { updateStatus(selectedTask.id, 'processing'); setSelectedTask(null); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-1"><Play className="w-4 h-4" />开始处理</button>
                  )}
                  {selectedTask.status === 'processing' && (
                    <button onClick={() => { updateStatus(selectedTask.id, 'completed'); setSelectedTask(null); }} className="flex-1 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4" />完成任务</button>
                  )}
                  {selectedTask.status === 'completed' && (
                    <button onClick={() => { updateStatus(selectedTask.id, 'pending'); setSelectedTask(null); }} className="flex-1 py-2 bg-gray-600 text-white rounded-lg flex items-center justify-center gap-1"><RotateCcw className="w-4 h-4" />重新打开</button>
                  )}
                  <button onClick={() => setSelectedTask(null)} className="px-4 py-2 border rounded-lg">关闭</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
