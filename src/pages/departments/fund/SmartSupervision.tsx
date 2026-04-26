import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Brain, AlertTriangle, Shield, Database } from 'lucide-react';

interface FraudModel {
  id: string;
  name: string;
  type: 'score' | 'rule' | 'ml';
  threshold: number;
  status: 'active' | 'inactive';
  accuracy: number;
}

interface FraudCase {
  id: string;
  type: string;
  amount: number;
  date: string;
  status: string;
}

const mockModels: FraudModel[] = [
  { id: '1', name: '异常就诊行为检测', type: 'ml', threshold: 0.75, status: 'active', accuracy: 92.5 },
  { id: '2', name: '高频开药风险评分', type: 'score', threshold: 80, status: 'active', accuracy: 88.3 },
  { id: '3', name: '虚假住院识别', type: 'rule', threshold: 0.85, status: 'active', accuracy: 95.1 },
];

const mockCases: FraudCase[] = [
  { id: 'F001', type: '虚假住院', amount: 120000, date: '2024-01-20', status: '已确认' },
  { id: 'F002', type: '过度医疗', amount: 45000, date: '2024-01-19', status: '调查中' },
];

export default function SmartSupervision() {
  const [activeTab, setActiveTab] = useState('models');
  const [models, setModels] = useState<FraudModel[]>(mockModels);
  const [cases] = useState<FraudCase[]>(mockCases);
  const [showModal, setShowModal] = useState(false);
  const [editingModel, setEditingModel] = useState<FraudModel | null>(null);

  const handleAdd = () => {
    setEditingModel(null);
    setShowModal(true);
  };

  const handleEdit = (model: FraudModel) => {
    setEditingModel(model);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setModels(models.filter(m => m.id !== id));
  };

  const getTypeBadge = (type: string) => {
    const styles = { ml: 'bg-purple-100 text-purple-700', score: 'bg-blue-100 text-blue-700', rule: 'bg-green-100 text-green-700' };
    const labels = { ml: '机器学习', score: '评分模型', rule: '规则引擎' };
    return <span className={`px-2 py-1 rounded text-xs ${styles[type as keyof typeof styles]}`}>{labels[type as keyof typeof labels]}</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">智能监管与欺诈检测</h1>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg">
          <Plus className="w-4 h-4" />新增模型
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '检测模型', value: models.length, icon: Brain, color: 'text-purple-600' },
          { label: '运行中', value: models.filter(m => m.status === 'active').length, icon: Shield, color: 'text-green-600' },
          { label: '欺诈案例', value: cases.length, icon: AlertTriangle, color: 'text-red-600' },
          { label: '平均准确率', value: '91.9%', icon: Database, color: 'text-blue-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border">
            <div className="flex items-center gap-2 text-gray-500 mb-2"><stat.icon className={`w-4 h-4 ${stat.color}`} />{stat.label}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b">
        {[{ id: 'models', label: '检测模型' }, { id: 'cases', label: '欺诈案例库' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-medium ${activeTab === tab.id ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'models' && (
        <div className="bg-white rounded-xl border">
          <table className="w-full">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">模型名称</th><th className="px-4 py-3 text-left text-sm">类型</th><th className="px-4 py-3 text-left text-sm">阈值</th><th className="px-4 py-3 text-left text-sm">准确率</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-left text-sm">操作</th></tr></thead>
            <tbody>
              {models.map(m => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3">{getTypeBadge(m.type)}</td>
                  <td className="px-4 py-3">{m.threshold}</td>
                  <td className="px-4 py-3">{m.accuracy}%</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{m.status === 'active' ? '运行中' : '已停用'}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => handleEdit(m)} className="p-1.5 text-gray-500 hover:text-cyan-600"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(m.id)} className="p-1.5 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'cases' && (
        <div className="bg-white rounded-xl border">
          <table className="w-full">
            <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">案例编号</th><th className="px-4 py-3 text-left text-sm">欺诈类型</th><th className="px-4 py-3 text-left text-sm">涉及金额</th><th className="px-4 py-3 text-left text-sm">发现日期</th><th className="px-4 py-3 text-left text-sm">状态</th></tr></thead>
            <tbody>
              {cases.map(c => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.id}</td>
                  <td className="px-4 py-3">{c.type}</td>
                  <td className="px-4 py-3">¥{c.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{c.date}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${c.status === '已确认' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-lg p-6">
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">{editingModel ? '编辑' : '新增'}检测模型</h3><button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button></div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">模型名称</label><input defaultValue={editingModel?.name} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">模型类型</label><select defaultValue={editingModel?.type} className="w-full px-3 py-2 border rounded-lg"><option value="ml">机器学习</option><option value="score">评分模型</option><option value="rule">规则引擎</option></select></div>
                <div><label className="block text-sm font-medium mb-1">风险阈值</label><input type="number" defaultValue={editingModel?.threshold} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">状态</label><select defaultValue={editingModel?.status} className="w-full px-3 py-2 border rounded-lg"><option value="active">运行中</option><option value="inactive">已停用</option></select></div>
              </div>
              <div className="flex justify-end gap-3 mt-6"><button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">取消</button><button onClick={() => setShowModal(false)} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">保存</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
