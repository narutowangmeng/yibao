import React, { useState } from 'react';
import { Play, Pause, RotateCcw, GitBranch, Settings, Plus, Edit3, Save, Eye, Copy, CheckCircle, Clock } from 'lucide-react';

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
  { id: 'WF-001', name: '门诊慢特病待遇认定流程', category: '待遇保障', version: 'v3.2', status: 'active', nodes: [], updatedAt: '2025-04-18' },
  { id: 'WF-002', name: '异地就医备案审核流程', category: '待遇保障', version: 'v2.7', status: 'active', nodes: [], updatedAt: '2025-04-10' },
  { id: 'WF-003', name: '双通道药店准入审批流程', category: '医药服务', version: 'v1.9', status: 'draft', nodes: [], updatedAt: '2025-04-22' },
  { id: 'WF-004', name: '定点医疗机构协议续签流程', category: '医药服务', version: 'v2.3', status: 'active', nodes: [], updatedAt: '2025-04-07' },
  { id: 'WF-005', name: '医保目录外诊疗项目申报流程', category: '医药服务', version: 'v1.6', status: 'inactive', nodes: [], updatedAt: '2025-03-28' },
  { id: 'WF-006', name: '医保基金飞行检查立项流程', category: '基金监管', version: 'v4.0', status: 'active', nodes: [], updatedAt: '2025-04-15' },
  { id: 'WF-007', name: '违规结算案件核查流程', category: '基金监管', version: 'v3.5', status: 'active', nodes: [], updatedAt: '2025-04-19' },
  { id: 'WF-008', name: '投诉举报线索分办流程', category: '基金监管', version: 'v2.2', status: 'active', nodes: [], updatedAt: '2025-04-12' },
  { id: 'WF-009', name: '信用评价结果复核流程', category: '基金监管', version: 'v1.8', status: 'draft', nodes: [], updatedAt: '2025-04-21' },
  { id: 'WF-010', name: '长期护理保险失能评估复审流程', category: '待遇保障', version: 'v1.5', status: 'active', nodes: [], updatedAt: '2025-04-11' },
  { id: 'WF-011', name: '居民医保集中参保登记流程', category: '经办管理', version: 'v2.4', status: 'active', nodes: [], updatedAt: '2025-04-05' },
  { id: 'WF-012', name: '单位缴费基数调整审批流程', category: '经办管理', version: 'v2.1', status: 'active', nodes: [], updatedAt: '2025-04-02' },
  { id: 'WF-013', name: '门诊费用稽核复审流程', category: '经办管理', version: 'v2.8', status: 'inactive', nodes: [], updatedAt: '2025-03-26' },
  { id: 'WF-014', name: '基金追回支付指令流程', category: '基金监管', version: 'v1.4', status: 'active', nodes: [], updatedAt: '2025-04-08' },
  { id: 'WF-015', name: '耗材目录调整申报流程', category: '医药服务', version: 'v1.7', status: 'draft', nodes: [], updatedAt: '2025-04-24' },
  { id: 'WF-016', name: '药品目录准入会审流程', category: '医药服务', version: 'v2.0', status: 'active', nodes: [], updatedAt: '2025-04-17' },
  { id: 'WF-017', name: '医保数据字典发布流程', category: '系统治理', version: 'v1.3', status: 'active', nodes: [], updatedAt: '2025-04-13' },
  { id: 'WF-018', name: '规则引擎生产发布流程', category: '系统治理', version: 'v2.6', status: 'active', nodes: [], updatedAt: '2025-04-20' },
  { id: 'WF-019', name: '13市月度统计报表汇交流程', category: '系统治理', version: 'v1.9', status: 'active', nodes: [], updatedAt: '2025-04-25' },
  { id: 'WF-020', name: '医保中心用户权限申请流程', category: '系统治理', version: 'v2.2', status: 'active', nodes: [], updatedAt: '2025-04-09' },
];

const instanceData = [
  { id: 'INST-001', name: '门诊慢特病待遇认定流程', initiator: '南京市医保中心', node: '复审节点', status: 'running', time: '2025-04-26 09:10' },
  { id: 'INST-002', name: '异地就医备案审核流程', initiator: '苏州市医保中心', node: '初审节点', status: 'completed', time: '2025-04-26 08:54' },
  { id: 'INST-003', name: '双通道药店准入审批流程', initiator: '无锡市医保局', node: '会签节点', status: 'suspended', time: '2025-04-25 17:33' },
  { id: 'INST-004', name: '定点医疗机构协议续签流程', initiator: '徐州市医保局', node: '终审节点', status: 'running', time: '2025-04-25 16:41' },
  { id: 'INST-005', name: '医保基金飞行检查立项流程', initiator: '省医保局基金监管处', node: '领导审批', status: 'running', time: '2025-04-25 15:28' },
  { id: 'INST-006', name: '投诉举报线索分办流程', initiator: '南通市医保中心', node: '案件分办', status: 'completed', time: '2025-04-25 14:52' },
  { id: 'INST-007', name: '信用评价结果复核流程', initiator: '镇江市医保局', node: '材料补正', status: 'running', time: '2025-04-25 14:11' },
  { id: 'INST-008', name: '长期护理保险失能评估复审流程', initiator: '盐城市医保局', node: '专家评估', status: 'running', time: '2025-04-25 13:40' },
  { id: 'INST-009', name: '居民医保集中参保登记流程', initiator: '宿迁市医保中心', node: '数据校验', status: 'completed', time: '2025-04-25 11:24' },
  { id: 'INST-010', name: '单位缴费基数调整审批流程', initiator: '常州市医保中心', node: '经办审核', status: 'running', time: '2025-04-25 10:37' },
  { id: 'INST-011', name: '门诊费用稽核复审流程', initiator: '扬州市医保中心', node: '复审节点', status: 'suspended', time: '2025-04-25 10:06' },
  { id: 'INST-012', name: '基金追回支付指令流程', initiator: '泰州市医保局', node: '财务确认', status: 'running', time: '2025-04-25 09:18' },
  { id: 'INST-013', name: '耗材目录调整申报流程', initiator: '省医保局医药服务管理处', node: '专家评议', status: 'running', time: '2025-04-24 18:22' },
  { id: 'INST-014', name: '药品目录准入会审流程', initiator: '连云港市医保局', node: '会签节点', status: 'completed', time: '2025-04-24 17:09' },
  { id: 'INST-015', name: '医保数据字典发布流程', initiator: '省医保局信息中心', node: '版本校验', status: 'running', time: '2025-04-24 16:44' },
  { id: 'INST-016', name: '规则引擎生产发布流程', initiator: '省医保局信息中心', node: '灰度发布', status: 'running', time: '2025-04-24 15:36' },
  { id: 'INST-017', name: '13市月度统计报表汇交流程', initiator: '淮安市医保中心', node: '数据复核', status: 'completed', time: '2025-04-24 15:08' },
  { id: 'INST-018', name: '医保中心用户权限申请流程', initiator: '苏州市医保局', node: '信息中心审批', status: 'running', time: '2025-04-24 14:39' },
  { id: 'INST-019', name: '违规结算案件核查流程', initiator: '南京市医保局', node: '调查取证', status: 'running', time: '2025-04-24 13:55' },
  { id: 'INST-020', name: '异地就医备案审核流程', initiator: '泰州市医保中心', node: '自动归档', status: 'completed', time: '2025-04-24 12:43' },
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
        ].map((tab) => (
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
              {workflows.map((wf) => (
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
                {nodeTypes.map((node) => (
                  <div key={node.type} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 cursor-pointer hover:border-cyan-400">
                    <div className={`w-3 h-3 rounded-full ${node.color}`} />
                    <span className="text-sm text-gray-700">{node.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 p-8 bg-gray-50 relative">
              <div className="flex flex-col items-center gap-6">
                <div className="w-40 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm">流程发起</div>
                <div className="w-0.5 h-8 bg-gray-300" />
                <div className="w-40 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">经办审核</div>
                <div className="w-0.5 h-8 bg-gray-300" />
                <div className="w-40 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white text-sm">规则校验</div>
                <div className="w-0.5 h-8 bg-gray-300" />
                <div className="w-40 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">复核审批</div>
                <div className="w-0.5 h-8 bg-gray-300" />
                <div className="w-40 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm">流程归档</div>
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
                  <label className="text-xs text-gray-500">审批岗位</label>
                  <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm">
                    <option>经办审核岗</option>
                    <option>基金监管岗</option>
                    <option>复核审批岗</option>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">发起方</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">当前节点</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">启动时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {instanceData.map((inst) => (
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
            { name: '标准三级审核', desc: '经办审核 → 复核审批 → 归档发布', icon: GitBranch },
            { name: '快速待遇审批', desc: '自动校验后单级审批快速通过', icon: CheckCircle },
            { name: '跨处室会签流程', desc: '待遇保障、医药服务、基金监管并行会签', icon: Settings },
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
