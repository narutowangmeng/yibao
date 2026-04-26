import React, { useState } from 'react';
import { Play, Pause, RotateCcw, GitBranch, Settings, Plus, Trash2, Edit3, Save, Eye, Copy, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'start' | 'approval' | 'condition' | 'parallel' | 'end';
  name: string;
  config?: Record<string, any>;
}

interface WorkflowDef {
  id: string;
  name: string;
  category: string;
  version: string;
  status: 'active' | 'inactive' | 'draft';
  nodes: WorkflowNode[];
  updatedAt: string;
}

const mockWorkflows: WorkflowDef[] = [
  { id: '1', name: '费用报销审批', category: '报销业务', version: 'v2.1', status: 'active', nodes: [], updatedAt: '2024-01-15' },
  { id: '2', name: '参保登记审批', category: '参保业务', version: 'v1.3', status: 'active', nodes: [], updatedAt: '2024-01-10' },
  { id: '3', name: '机构准入审批', category: '机构管理', version: 'v1.0', status: 'draft', nodes: [], updatedAt: '2024-01-20' },
];

const nodeTypes = [
  { type: 'start', name: '开始节点', color: 'bg-green-500' },
  { type: 'approval', name: '审批节点', color: 'bg-blue-500' },
  { type: 'condition', name: '条件节点', color: 'bg-yellow-500' },
  { type: 'parallel', name: '并行节点', color: 'bg-purple-500' },
  { type: 'end', name: '结束节点', color: 'bg-red-500' },
];

export default function WorkflowEngine() {
  const [workflows] = useState<WorkflowDef[]>(mockWorkflows);
  const [activeTab, setActiveTab] = useState<'designer' | 'instances' | 'templates'>('designer');
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDef | null>(null);
  const [showDesigner, setShowDesigner] = useState(false);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-600',
      draft: 'bg-yellow-100 text-yellow-700',
    };
    const labels = { active: '已启用', inactive: '已停用', draft: '草稿' };
    return <span className={`px-2 py-1 rounded-full text-xs ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">工作流引擎配置</h1>
        <p className="text-gray-500 mt-1">审批流程设计、节点配置、流程版本管理</p>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { id: 'designer', label: '流程设计器', icon: GitBranch },
          { id: 'instances', label: '流程实例', icon: Play },
          { id: 'templates', label: '流程模板', icon: Copy },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-cyan-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'designer' && !showDesigner && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">流程定义列表</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700">
              <Plus className="w-4 h-4" />
              新建流程
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">流程名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">分类</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">版本</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">更新时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {workflows.map(wf => (
                <tr key={wf.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{wf.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{wf.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{wf.version}</td>
                  <td className="px-4 py-3">{getStatusBadge(wf.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{wf.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedWorkflow(wf); setShowDesigner(true); }} className="p-1 text-cyan-600 hover:bg-cyan-50 rounded">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-600 hover:bg-gray-100 rounded"><Eye className="w-4 h-4" /></button>
                      <button className="p-1 text-gray-600 hover:bg-gray-100 rounded"><Copy className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'designer' && showDesigner && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowDesigner(false)} className="text-gray-600 hover:text-gray-800">← 返回</button>
              <h2 className="font-semibold text-gray-800">{selectedWorkflow?.name}</h2>
              <span className="text-xs text-gray-500">{selectedWorkflow?.version}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                <RotateCcw className="w-4 h-4" />重置
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700">
                <Save className="w-4 h-4" />保存
              </button>
            </div>
          </div>
          <div className="flex h-[500px]">
            <div className="w-48 border-r border-gray-200 p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-3">节点类型</h3>
              <div className="space-y-2">
                {nodeTypes.map(node => (
                  <div key={node.type} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 cursor-pointer hover:border-cyan-400">
                    <div className={`w-3 h-3 rounded-full ${node.color}`} />
                    <span className="text-sm text-gray-700">{node.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 p-8 bg-gray-50 relative">
              <div className="flex flex-col items-center gap-6">
                <div className="w-32 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm">开始</div>
                <div className="w-0.5 h-8 bg-gray-300" />
                <div className="w-32 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">初审</div>
                <div className="w-0.5 h-8 bg-gray-300" />
                <div className="w-32 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-sm">条件判断</div>
                <div className="w-0.5 h-8 bg-gray-300" />
                <div className="w-32 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">复审</div>
                <div className="w-0.5 h-8 bg-gray-300" />
                <div className="w-32 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm">结束</div>
              </div>
            </div>
            <div className="w-64 border-l border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">节点配置</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">节点名称</label>
                  <input type="text" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm" placeholder="输入节点名称" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">审批人</label>
                  <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm">
                    <option>初审岗</option>
                    <option>复审岗</option>
                    <option>终审</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">超时设置(小时)</label>
                  <input type="number" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm" defaultValue={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'instances' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">流程实例监控</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">实例ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">流程名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">发起人</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">当前节点</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">启动时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { id: 'INST-001', name: '费用报销审批', initiator: '参保人A', node: '复审', status: 'running', time: '2024-01-20 10:30' },
                { id: 'INST-002', name: '参保登记审批', initiator: '参保人B', node: '初审', status: 'completed', time: '2024-01-20 09:15' },
                { id: 'INST-003', name: '费用报销审批', initiator: '参保人C', node: '初审', status: 'suspended', time: '2024-01-19 16:45' },
              ].map(inst => (
                <tr key={inst.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{inst.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{inst.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{inst.initiator}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{inst.node}</td>
                  <td className="px-4 py-3">
                    {inst.status === 'running' && <span className="flex items-center gap-1 text-blue-600 text-xs"><Clock className="w-3 h-3" />运行中</span>}
                    {inst.status === 'completed' && <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle className="w-3 h-3" />已完成</span>}
                    {inst.status === 'suspended' && <span className="flex items-center gap-1 text-yellow-600 text-xs"><Pause className="w-3 h-3" />已暂停</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{inst.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: '标准三级审批', desc: '初审→复审→终审', icon: GitBranch },
            { name: '快速审批', desc: '单级审批快速通过', icon: CheckCircle },
            { name: '会签审批', desc: '多部门并行审批', icon: Settings },
          ].map((tpl, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:border-cyan-400 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <tpl.icon className="w-5 h-5 text-cyan-600" />
                </div>
                <h3 className="font-medium text-gray-800">{tpl.name}</h3>
              </div>
              <p className="text-sm text-gray-500">{tpl.desc}</p>
              <button className="mt-3 text-sm text-cyan-600 hover:text-cyan-700">使用模板 →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
