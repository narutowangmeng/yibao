import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface RuleCondition {
  field: string;
  operator: string;
  value: string;
}

interface Rule {
  id: string;
  code: string;
  name: string;
  category: string;
  conditions: RuleCondition[];
  logicType: 'and' | 'or';
  alertLevel: 'remind' | 'intercept' | 'audit';
  status: 'active' | 'inactive';
}

interface RuleListProps {
  rules: Rule[];
  onEdit: (rule: Rule) => void;
  onDelete: (id: string) => void;
}

const alertLevelMap: Record<string, { label: string; color: string }> = {
  remind: { label: '提醒', color: 'bg-blue-100 text-blue-700' },
  intercept: { label: '拦截', color: 'bg-red-100 text-red-700' },
  audit: { label: '事后审核', color: 'bg-yellow-100 text-yellow-700' }
};

const categoryMap: Record<string, string> = {
  drug: '药品规则',
  service: '诊疗规则',
  charge: '收费规则',
  behavior: '行为规则'
};

export default function RuleList({ rules, onEdit, onDelete }: RuleListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {rules.map(rule => (
        <motion.div
          key={rule.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-gray-200"
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-gray-500">{rule.code}</span>
              <span className="font-medium">{rule.name}</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {categoryMap[rule.category]}
              </span>
              <span className="text-sm text-gray-500">
                {rule.conditions.length}个条件
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 text-xs rounded ${alertLevelMap[rule.alertLevel].color}`}>
                {alertLevelMap[rule.alertLevel].label}
              </span>
              <span className={`px-2 py-1 text-xs rounded ${rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {rule.status === 'active' ? '启用' : '停用'}
              </span>
              <button
                onClick={() => setExpandedId(expandedId === rule.id ? null : rule.id)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                {expandedId === rule.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button onClick={() => onEdit(rule)} className="p-1.5 text-gray-400 hover:text-cyan-600">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(rule.id)} className="p-1.5 text-gray-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {expandedId === rule.id && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="border-t border-gray-100 bg-gray-50"
              >
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    触发条件 ({rule.logicType === 'and' ? '全部满足' : '任一满足'})
                  </p>
                  <div className="space-y-2">
                    {rule.conditions.map((cond, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-1 bg-white border rounded text-gray-600">{cond.field}</span>
                        <span className="text-gray-400">{cond.operator}</span>
                        <span className="px-2 py-1 bg-white border rounded text-gray-600">{cond.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
