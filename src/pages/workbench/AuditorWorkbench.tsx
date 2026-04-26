import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, Clock, Users, BookOpen, Settings, AlertCircle, CheckCircle, XCircle, MessageSquare, FileText, Eye, Play, RotateCcw, Plus, Edit, Trash2, X } from 'lucide-react';

interface AuditTask {
  id: string;
  type: '初审' | '复审' | '终审';
  patient: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed';
  deadline: string;
  assignee: string;
  description?: string;
  hospital?: string;
  diagnosis?: string;
}

interface ConsultCase {
  id: string;
  title: string;
  applicant: string;
  status: 'waiting' | 'processing' | 'completed';
  experts: number;
  description?: string;
}

interface CaseItem {
  id: string;
  title: string;
  category: string;
  views: number;
  content?: string;
}

const tabs = [
  { id: 'tasks', label: '审核任务', icon: ClipboardCheck },
  { id: 'monitor', label: '时效监控', icon: Clock },
  { id: 'quality', label: '质量评估', icon: Users },
  { id: 'consult', label: '疑难会商', icon: MessageSquare },
  { id: 'rules', label: '规则配置', icon: Settings },
  { id: 'cases', label: '案例库', icon: BookOpen }
];

export default function AuditorWorkbench() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [auditTasks, setAuditTasks] = useState<AuditTask[]>([
    { id: 'AUD-001', type: '初审', patient: '参保人A', amount: 12500, status: 'pending', deadline: '2024-03-20', assignee: '初审岗', hospital: '市第一人民医院', diagnosis: '急性阑尾炎' },
    { id: 'AUD-002', type: '复审', patient: '参保人B', amount: 8600, status: 'processing', deadline: '2024-03-18', assignee: '复审岗', hospital: '市中心医院', diagnosis: '肺炎' },
    { id: 'AUD-003', type: '终审', patient: '参保人C', amount: 23400, status: 'completed', deadline: '2024-03-15', assignee: '终审岗', hospital: '省人民医院', diagnosis: '心脏支架手术' }
  ]);
  const [consultCases, setConsultCases] = useState<ConsultCase[]>([
    { id: 'CON-001', title: '疑难病例会诊', applicant: '初审岗', status: 'waiting', experts: 3, description: '复杂病例需要多学科专家会诊' },
    { id: 'CON-002', title: '复杂费用审核', applicant: '复审岗', status: 'processing', experts: 5, description: '费用异常需要专家审核' }
  ]);
  const [caseLibrary, setCaseLibrary] = useState<CaseItem[]>([
    { id: 'CASE-001', title: '重复收费典型案例', category: '违规案例', views: 1256, content: '案例详情...' },
    { id: 'CASE-002', title: '超量用药审核要点', category: '审核要点', views: 892, content: '审核要点详情...' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view' | 'audit'>('add');
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '违规案例',
    content: '',
    description: ''
  });
  const [auditRemarks, setAuditRemarks] = useState('');

  const handleViewTask = (task: AuditTask) => {
    setCurrentItem(task);
    setModalType('view');
    setShowModal(true);
  };

  const handleAuditTask = (task: AuditTask) => {
    setCurrentItem(task);
    setAuditRemarks('');
    setModalType('audit');
    setShowModal(true);
  };

  const handleProcessTask = (action: 'approve' | 'reject' | 'start') => {
    if (currentItem) {
      if (action === 'start') {
        setAuditTasks(auditTasks.map(t => t.id === currentItem.id ? { ...t, status: 'processing' } : t));
      } else {
        setAuditTasks(auditTasks.map(t => t.id === currentItem.id ? { ...t, status: 'completed' } : t));
      }
      setShowModal(false);
      setAuditRemarks('');
    }
  };

  const handleProcessConsult = (id: string) => {
    setConsultCases(consultCases.map(c => {
      if (c.id === id) {
        if (c.status === 'waiting') return { ...c, status: 'processing' };
        if (c.status === 'processing') return { ...c, status: 'completed' };
      }
      return c;
    }));
  };

  const handleAddCase = () => {
    setModalType('add');
    setCurrentItem(null);
    setFormData({ title: '', category: '违规案例', content: '', description: '' });
    setShowModal(true);
  };

  const handleEditCase = (item: CaseItem) => {
    setModalType('edit');
    setCurrentItem(item);
    setFormData({ title: item.title, category: item.category, content: item.content || '', description: '' });
    setShowModal(true);
  };

  const handleViewCase = (item: CaseItem) => {
    setModalType('view');
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleDeleteCase = (id: string) => {
    setCaseLibrary(caseLibrary.filter(c => c.id !== id));
  };

  const handleSubmitCase = () => {
    if (modalType === 'add') {
      const newCase: CaseItem = {
        id: `CASE-${String(caseLibrary.length + 1).padStart(3, '0')}`,
        title: formData.title,
        category: formData.category,
        views: 0,
        content: formData.content
      };
      setCaseLibrary([newCase, ...caseLibrary]);
    } else {
      setCaseLibrary(caseLibrary.map(c => c.id === currentItem.id ? { ...c, title: formData.title, category: formData.category, content: formData.content } : c));
    }
    setShowModal(false);
  };

  const renderTasks = () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['初审', '复审', '终审'].map(type => (
          <button key={type} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
            {type} ({auditTasks.filter(t => t.type === type).length})
          </button>
        ))}
      </div>
      <table className="w-full bg-white rounded-xl border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm">任务编号</th>
            <th className="px-4 py-3 text-left text-sm">类型</th>
            <th className="px-4 py-3 text-left text-sm">患者</th>
            <th className="px-4 py-3 text-left text-sm">金额</th>
            <th className="px-4 py-3 text-left text-sm">截止</th>
            <th className="px-4 py-3 text-left text-sm">状态</th>
            <th className="px-4 py-3 text-left text-sm">操作</th>
          </tr>
        </thead>
        <tbody>
          {auditTasks.map(item => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{item.id}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded ${
                  item.type === '初审' ? 'bg-blue-100 text-blue-700' :
                  item.type === '复审' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>{item.type}</span>
              </td>
              <td className="px-4 py-3 text-sm">{item.patient}</td>
              <td className="px-4 py-3 text-sm">¥{item.amount.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm">{item.deadline}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded ${
                  item.status === 'completed' ? 'bg-green-100 text-green-700' :
                  item.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {item.status === 'completed' ? '已完成' : item.status === 'processing' ? '进行中' : '待审核'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button onClick={() => handleViewTask(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                  {item.status !== 'completed' && (
                    <button onClick={() => handleAuditTask(item)} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Play className="w-4 h-4" /></button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMonitor = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">平均审核时效</p>
          <p className="text-2xl font-bold text-blue-600">2.5天</p>
          <p className="text-xs text-green-600 mt-1">较上月 -0.3天</p>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">超时任务</p>
          <p className="text-2xl font-bold text-red-600">3</p>
          <p className="text-xs text-red-600 mt-1">需紧急处理</p>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-gray-500">待分配任务</p>
          <p className="text-2xl font-bold text-cyan-600">12</p>
          <p className="text-xs text-gray-500 mt-1">可分配</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold mb-4">时效趋势</h3>
        <div className="h-48 flex items-end gap-4">
          {[2.8, 2.6, 2.5, 2.4, 2.5, 2.3].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-blue-100 rounded-t" style={{ height: `${v * 40}px` }} />
              <span className="text-xs text-gray-500">{i + 1}月</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConsult = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />发起会诊
        </button>
      </div>
      <table className="w-full bg-white rounded-xl border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm">会诊标题</th>
            <th className="px-4 py-3 text-left text-sm">申请人</th>
            <th className="px-4 py-3 text-left text-sm">专家数</th>
            <th className="px-4 py-3 text-left text-sm">状态</th>
            <th className="px-4 py-3 text-left text-sm">操作</th>
          </tr>
        </thead>
        <tbody>
          {consultCases.map(item => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium">{item.title}</td>
              <td className="px-4 py-3 text-sm">{item.applicant}</td>
              <td className="px-4 py-3 text-sm">{item.experts}人</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded ${
                  item.status === 'completed' ? 'bg-green-100 text-green-700' :
                  item.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.status === 'completed' ? '已完成' : item.status === 'processing' ? '会诊中' : '待会诊'}
                </span>
              </td>
              <td className="px-4 py-3">
                {item.status !== 'completed' && (
                  <button onClick={() => handleProcessConsult(item.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                    <Play className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCases = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button onClick={handleAddCase} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />添加案例
        </button>
      </div>
      <table className="w-full bg-white rounded-xl border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm">案例标题</th>
            <th className="px-4 py-3 text-left text-sm">分类</th>
            <th className="px-4 py-3 text-left text-sm">浏览量</th>
            <th className="px-4 py-3 text-left text-sm">操作</th>
          </tr>
        </thead>
        <tbody>
          {caseLibrary.map(item => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-sm font-medium">{item.title}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">{item.category}</span>
              </td>
              <td className="px-4 py-3 text-sm">{item.views}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button onClick={() => handleViewCase(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleEditCase(item)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteCase(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">审核岗工作台</h2>
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {activeTab === 'tasks' && renderTasks()}
          {activeTab === 'monitor' && renderMonitor()}
          {activeTab === 'consult' && renderConsult()}
          {activeTab === 'cases' && renderCases()}
          {activeTab === 'quality' && <div className="bg-white p-8 rounded-xl border text-center text-gray-500">质量评估功能开发中</div>}
          {activeTab === 'rules' && <div className="bg-white p-8 rounded-xl border text-center text-gray-500">规则配置功能开发中</div>}
        </motion.div>
      </AnimatePresence>

      {/* 弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {modalType === 'audit' ? '审核任务' : modalType === 'add' ? '添加案例' : modalType === 'edit' ? '编辑案例' : '查看详情'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>

            {modalType === 'audit' && currentItem && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between"><span className="text-sm text-gray-500">任务编号</span><span>{currentItem.id}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-500">患者</span><span>{currentItem.patient}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-500">金额</span><span className="font-medium">¥{currentItem.amount.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-500">医院</span><span>{currentItem.hospital}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-500">诊断</span><span>{currentItem.diagnosis}</span></div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">审核意见</label>
                  <textarea
                    value={auditRemarks}
                    onChange={(e) => setAuditRemarks(e.target.value)}
                    rows={3}
                    placeholder="请输入审核意见..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="flex gap-2">
                  {currentItem.status === 'pending' && (
                    <button onClick={() => handleProcessTask('start')} className="flex-1 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                      开始审核
                    </button>
                  )}
                  {currentItem.status === 'processing' && (
                    <>
                      <button onClick={() => handleProcessTask('approve')} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />通过
                      </button>
                      <button onClick={() => handleProcessTask('reject')} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2">
                        <XCircle className="w-4 h-4" />驳回
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {(modalType === 'view' || modalType === 'add' || modalType === 'edit') && activeTab === 'tasks' && currentItem && (
              <div className="space-y-4">
                <div><label className="text-sm text-gray-500">任务编号</label><p>{currentItem.id}</p></div>
                <div><label className="text-sm text-gray-500">审核类型</label><p>{currentItem.type}</p></div>
                <div><label className="text-sm text-gray-500">患者</label><p>{currentItem.patient}</p></div>
                <div><label className="text-sm text-gray-500">金额</label><p className="font-medium">¥{currentItem.amount.toLocaleString()}</p></div>
                <div><label className="text-sm text-gray-500">医院</label><p>{currentItem.hospital}</p></div>
                <div><label className="text-sm text-gray-500">诊断</label><p>{currentItem.diagnosis}</p></div>
                <div><label className="text-sm text-gray-500">状态</label>
                  <span className={`px-2 py-1 rounded text-xs ${
                    currentItem.status === 'completed' ? 'bg-green-100 text-green-700' :
                    currentItem.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {currentItem.status === 'completed' ? '已完成' : currentItem.status === 'processing' ? '进行中' : '待审核'}
                  </span>
                </div>
              </div>
            )}

            {(modalType === 'add' || modalType === 'edit') && activeTab === 'cases' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">案例标题</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="违规案例">违规案例</option>
                    <option value="审核要点">审核要点</option>
                    <option value="典型案例">典型案例</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">内容</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}

            {modalType === 'view' && activeTab === 'cases' && currentItem && (
              <div className="space-y-4">
                <div><label className="text-sm text-gray-500">案例标题</label><p className="font-medium">{currentItem.title}</p></div>
                <div><label className="text-sm text-gray-500">分类</label><span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">{currentItem.category}</span></div>
                <div><label className="text-sm text-gray-500">浏览量</label><p>{currentItem.views}</p></div>
                <div><label className="text-sm text-gray-500">内容</label><p className="text-sm text-gray-600 mt-1">{currentItem.content || '暂无内容'}</p></div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
              {(modalType === 'add' || modalType === 'edit') && activeTab === 'cases' && (
                <button onClick={handleSubmitCase} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
