import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitPullRequest, Users, Clock, CheckCircle, Plus, Eye, Edit, Trash2, X, Play, Pause } from 'lucide-react';

interface Flow {
  id: string;
  name: string;
  departments: string[];
  status: 'active' | 'inactive';
  steps?: number;
}

interface SignTask {
  id: string;
  title: string;
  initiator: string;
  current: string;
  status: 'pending' | 'processing' | 'completed';
  description?: string;
}

interface Progress {
  id: string;
  title: string;
  step: number;
  total: number;
  status: string;
  applicant?: string;
}

const tabs = [
  { id: 'flows', label: '审批流程', icon: GitPullRequest },
  { id: 'sign', label: '会签管理', icon: Users },
  { id: 'progress', label: '进度跟踪', icon: Clock },
  { id: 'result', label: '结果公示', icon: CheckCircle }
];

export default function CollaborativeApproval() {
  const [activeTab, setActiveTab] = useState('flows');
  const [flows, setFlows] = useState<Flow[]>([
    { id: 'FLOW-001', name: '门诊慢特病待遇准入会审流程', departments: ['待遇保障处', '医药服务管理处', '基金监督处'], status: 'active', steps: 3 },
    { id: 'FLOW-002', name: '双通道药店协议准入审批流程', departments: ['医药服务管理处', '基金监督处', '信息管理中心'], status: 'active', steps: 3 },
    { id: 'FLOW-003', name: '异地就医结算规则调整审批流程', departments: ['待遇保障处', '经办服务中心', '信息管理中心'], status: 'active', steps: 3 },
    { id: 'FLOW-004', name: '耗材目录动态调整审批流程', departments: ['医药服务管理处', '价格招采处', '基金监督处'], status: 'inactive', steps: 3 },
    { id: 'FLOW-005', name: '违规结算基金追回联审流程', departments: ['基金监督处', '稽核中心', '财务审计处'], status: 'active', steps: 3 },
    { id: 'FLOW-006', name: '零售药店信用修复复核流程', departments: ['基金监督处', '医药服务管理处'], status: 'active', steps: 2 }
  ]);
  const [signTasks, setSignTasks] = useState<SignTask[]>([
    { id: 'SIGN-001', title: '南京市门诊慢特病扩围方案会签', initiator: '待遇保障处', current: '医药服务管理处', status: 'processing', description: '涉及糖尿病、慢阻肺病种支付范围调整。' },
    { id: 'SIGN-002', title: '苏州市双通道药店新增名单会签', initiator: '医药服务管理处', current: '基金监督处', status: 'pending', description: '新增 12 家双通道药店协议资格复核。' },
    { id: 'SIGN-003', title: '徐州市异地就医直接结算优化方案会签', initiator: '经办服务中心', current: '信息管理中心', status: 'processing', description: '统一跨省备案审核时限与结算提示口径。' },
    { id: 'SIGN-004', title: '无锡市违规结算追回资金拨回会签', initiator: '基金监督处', current: '财务审计处', status: 'completed', description: '涉及 2026 年第一季度追回基金 286.4 万元。' },
    { id: 'SIGN-005', title: '连云港市耗材目录价格联动调整会签', initiator: '价格招采处', current: '医药服务管理处', status: 'pending', description: '对高值医用耗材支付标准开展季度复核。' },
    { id: 'SIGN-006', title: '扬州市医保定点机构信用评价结果会签', initiator: '基金监督处', current: '待遇保障处', status: 'processing', description: '拟公示 A 级机构 36 家、B 级机构 12 家。' }
  ]);
  const [progressList, setProgressList] = useState<Progress[]>([
    { id: 'PRO-001', title: '南京市门诊慢特病扩围申请', step: 2, total: 3, status: '审核中', applicant: '陈雨桐' },
    { id: 'PRO-002', title: '苏州市双通道药店新增申请', step: 1, total: 3, status: '待会签', applicant: '周景明' },
    { id: 'PRO-003', title: '徐州市异地就医结算参数调整', step: 3, total: 3, status: '已完成', applicant: '顾文博' },
    { id: 'PRO-004', title: '无锡市违规结算追回拨付申请', step: 3, total: 3, status: '已完成', applicant: '沈嘉怡' },
    { id: 'PRO-005', title: '常州市耗材目录动态调整申请', step: 2, total: 3, status: '审核中', applicant: '唐思远' },
    { id: 'PRO-006', title: '南通市零售药店信用修复申请', step: 1, total: 2, status: '待会签', applicant: '许若琳' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    departments: '',
    description: '',
    initiator: ''
  });

  const handleAdd = () => {
    setModalType('add');
    setCurrentItem(null);
    setFormData({ name: '', title: '', departments: '', description: '', initiator: '' });
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setModalType('edit');
    setCurrentItem(item);
    if (activeTab === 'flows') {
      setFormData({ ...formData, name: item.name, departments: item.departments.join(',') });
    } else {
      setFormData({ ...formData, title: item.title, description: item.description || '' });
    }
    setShowModal(true);
  };

  const handleView = (item: any) => {
    setModalType('view');
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'flows') {
      setFlows(flows.filter((f) => f.id !== id));
    } else if (activeTab === 'sign') {
      setSignTasks(signTasks.filter((s) => s.id !== id));
    } else {
      setProgressList(progressList.filter((p) => p.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setFlows(flows.map((f) => (f.id === id ? { ...f, status: f.status === 'active' ? 'inactive' : 'active' } : f)));
  };

  const handleProcessSign = (id: string) => {
    setSignTasks(
      signTasks.map((s) => {
        if (s.id === id) {
          if (s.status === 'pending') return { ...s, status: 'processing' };
          if (s.status === 'processing') return { ...s, status: 'completed', current: '已完成' };
        }
        return s;
      })
    );
  };

  const handleSubmit = () => {
    if (activeTab === 'flows') {
      if (modalType === 'add') {
        const departments = formData.departments.split(',').map((d) => d.trim()).filter(Boolean);
        const newFlow: Flow = {
          id: `FLOW-${String(flows.length + 1).padStart(3, '0')}`,
          name: formData.name,
          departments,
          status: 'active',
          steps: departments.length
        };
        setFlows([...flows, newFlow]);
      } else {
        setFlows(
          flows.map((f) =>
            f.id === currentItem.id
              ? { ...f, name: formData.name, departments: formData.departments.split(',').map((d) => d.trim()).filter(Boolean) }
              : f
          )
        );
      }
    } else if (activeTab === 'sign') {
      if (modalType === 'add') {
        const newTask: SignTask = {
          id: `SIGN-${String(signTasks.length + 1).padStart(3, '0')}`,
          title: formData.title,
          initiator: '省医保中心',
          current: '待分派',
          status: 'pending',
          description: formData.description
        };
        setSignTasks([...signTasks, newTask]);
      } else {
        setSignTasks(signTasks.map((s) => (s.id === currentItem.id ? { ...s, title: formData.title, description: formData.description } : s)));
      }
    }
    setShowModal(false);
  };

  const renderFlows = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />
          新建流程
        </button>
      </div>
      <div className="space-y-3">
        {flows.map((flow) => (
          <div key={flow.id} className="bg-white p-4 rounded-xl border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{flow.name}</p>
                <p className="text-sm text-gray-500 mt-1">{flow.departments.join(' -> ')}</p>
                <p className="text-xs text-gray-400 mt-1">步骤数: {flow.steps}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs rounded ${flow.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {flow.status === 'active' ? '启用' : '停用'}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => handleView(flow)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleEdit(flow)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleToggleStatus(flow.id)} className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded">
                    {flow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(flow.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSign = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />
          发起会签
        </button>
      </div>
      <div className="space-y-3">
        {signTasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded-xl border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-gray-500 mt-1">发起: {task.initiator} | 当前: {task.current}</p>
                {task.description && <p className="text-xs text-gray-400 mt-1">{task.description}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : task.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {task.status === 'completed' ? '已完成' : task.status === 'processing' ? '会签中' : '待发起'}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => handleView(task)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleEdit(task)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"><Edit className="w-4 h-4" /></button>
                  {task.status !== 'completed' && (
                    <button onClick={() => handleProcessSign(task.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(task.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        {progressList.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl border">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">申请人: {item.applicant}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {item.step}/{item.total}
                </span>
                <span className={`px-2 py-1 text-xs rounded ${item.status === '已完成' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.status}
                </span>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${(item.step / item.total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold mb-4">审批结果公示</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm">申请标题</th>
              <th className="px-4 py-3 text-left text-sm">申请人</th>
              <th className="px-4 py-3 text-left text-sm">审批结果</th>
              <th className="px-4 py-3 text-left text-sm">公示日期</th>
            </tr>
          </thead>
          <tbody>
            {progressList.filter((p) => p.status === '已完成').map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{item.title}</td>
                <td className="px-4 py-3 text-sm">{item.applicant}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">通过</span></td>
                <td className="px-4 py-3 text-sm">2026-04-26</td>
              </tr>
            ))}
            {progressList.filter((p) => p.status === '已完成').length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">暂无公示结果</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">跨部门协同审批</h2>
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {activeTab === 'flows' && renderFlows()}
          {activeTab === 'sign' && renderSign()}
          {activeTab === 'progress' && renderProgress()}
          {activeTab === 'result' && renderResult()}
        </motion.div>
      </AnimatePresence>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {modalType === 'add' ? '添加' : modalType === 'edit' ? '编辑' : '查看'}
                {activeTab === 'flows' ? '流程' : '会签'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            {modalType === 'view' ? (
              <div className="space-y-4">
                <div><label className="text-sm text-gray-500">{activeTab === 'flows' ? '流程名称' : '会签标题'}</label><p className="font-medium">{currentItem?.name || currentItem?.title}</p></div>
                {activeTab === 'flows' && <div><label className="text-sm text-gray-500">参与部门</label><p>{currentItem?.departments?.join(', ')}</p></div>}
                {activeTab === 'sign' && (
                  <>
                    <div><label className="text-sm text-gray-500">发起人</label><p>{currentItem?.initiator}</p></div>
                    <div><label className="text-sm text-gray-500">当前节点</label><p>{currentItem?.current}</p></div>
                  </>
                )}
                {currentItem?.description && <div><label className="text-sm text-gray-500">描述</label><p className="text-sm text-gray-600">{currentItem.description}</p></div>}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{activeTab === 'flows' ? '流程名称' : '会签标题'}</label>
                  <input
                    type="text"
                    value={activeTab === 'flows' ? formData.name : formData.title}
                    onChange={(e) => setFormData({ ...formData, [activeTab === 'flows' ? 'name' : 'title']: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                {activeTab === 'flows' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">参与部门（用逗号分隔）</label>
                    <input
                      type="text"
                      value={formData.departments}
                      onChange={(e) => setFormData({ ...formData, departments: e.target.value })}
                      placeholder="如：待遇保障处, 医药服务管理处, 基金监督处"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
              {modalType !== 'view' && (
                <button onClick={handleSubmit} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
