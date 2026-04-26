import React from 'react';
import { X, Edit, FileText, GitBranch, Network, Target } from 'lucide-react';

interface RuleDetailProps {
  rule: any;
  onClose: () => void;
  onEdit: () => void;
}

export default function RuleDetail({ rule, onClose, onEdit }: RuleDetailProps) {
  if (!rule) return null;

  const categoryMap: Record<string, string> = {
    drug: '药品规则',
    service: '诊疗规则',
    charge: '收费规则',
    behavior: '行为规则'
  };

  const alertMap: Record<string, { label: string; color: string }> = {
    remind: { label: '提醒', color: 'bg-blue-100 text-blue-700' },
    intercept: { label: '拦截', color: 'bg-red-100 text-red-700' },
    audit: { label: '事后审核', color: 'bg-yellow-100 text-yellow-700' }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-600" />
            规则详情
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3">基本信息</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">规则编码</p>
                <p className="font-mono text-sm">{rule.code}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">规则名称</p>
                <p className="font-medium">{rule.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">分类</p>
                <span className="px-2 py-1 bg-gray-200 text-xs rounded">{categoryMap[rule.category]}</span>
              </div>
              <div>
                <p className="text-xs text-gray-400">预警级别</p>
                <span className={`px-2 py-1 text-xs rounded ${alertMap[rule.alertLevel]?.color || 'bg-gray-100'}`}>
                  {alertMap[rule.alertLevel]?.label}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              条件配置
            </h4>
            <div className="space-y-2">
              {rule.conditions?.map((cond: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">条件{idx + 1}</span>
                  <span>{cond.field}</span>
                  <span className="text-gray-400">{cond.operator}</span>
                  <span className="font-medium">{cond.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">逻辑关系: {rule.logicType === 'and' ? '全部满足(AND)' : '任一满足(OR)'}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
              <Network className="w-4 h-4" />
              知识图谱
            </h4>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">限适应证</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">限二线用药</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              适用场景
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400">适用对象</p>
                <p>{rule.targetType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">生效时间</p>
                <p>{rule.startDate} 至 {rule.endDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
