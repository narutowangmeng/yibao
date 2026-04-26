import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ChevronRight } from 'lucide-react';

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface ConditionGroup {
  id: string;
  logic: 'and' | 'or';
  conditions: Condition[];
}

interface RuleConditionBuilderProps {
  groups: ConditionGroup[];
  onChange: (groups: ConditionGroup[]) => void;
}

const operators = ['等于', '不等于', '大于', '小于', '包含', '不包含', '在区间', '不在区间', '在图谱中', '等于任意一个'];
const fields = ['药品编码', '诊疗项目', '收费金额', '就诊次数', '参保类型', '医院等级', '年龄', '性别'];

export default function RuleConditionBuilder({ groups, onChange }: RuleConditionBuilderProps) {
  const addGroup = () => {
    onChange([...groups, { id: String(Date.now()), logic: 'and', conditions: [{ id: String(Date.now()), field: '', operator: '', value: '' }] }]);
  };

  const removeGroup = (groupId: string) => {
    onChange(groups.filter(g => g.id !== groupId));
  };

  const addCondition = (groupId: string) => {
    onChange(groups.map(g => g.id === groupId ? { ...g, conditions: [...g.conditions, { id: String(Date.now()), field: '', operator: '', value: '' }] } : g));
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    onChange(groups.map(g => g.id === groupId ? { ...g, conditions: g.conditions.filter(c => c.id !== conditionId) } : g));
  };

  const updateCondition = (groupId: string, conditionId: string, field: keyof Condition, value: string) => {
    onChange(groups.map(g => g.id === groupId ? { ...g, conditions: g.conditions.map(c => c.id === conditionId ? { ...c, [field]: value } : c) } : g));
  };

  const updateGroupLogic = (groupId: string, logic: 'and' | 'or') => {
    onChange(groups.map(g => g.id === groupId ? { ...g, logic } : g));
  };

  return (
    <div className="space-y-3">
      {groups.map((group, idx) => (
        <motion.div key={group.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">条件组 {idx + 1}</span>
              <select value={group.logic} onChange={(e) => updateGroupLogic(group.id, e.target.value as 'and' | 'or')} className="text-xs px-2 py-1 border rounded">
                <option value="and">全部满足(AND)</option>
                <option value="or">任一满足(OR)</option>
              </select>
            </div>
            {groups.length > 1 && <button onClick={() => removeGroup(group.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3" /></button>}
          </div>
          <div className="space-y-2">
            {group.conditions.map((cond, cidx) => (
              <div key={cond.id} className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <select value={cond.field} onChange={(e) => updateCondition(group.id, cond.id, 'field', e.target.value)} className="flex-1 text-sm px-2 py-1 border rounded">
                  <option value="">选择字段</option>
                  {fields.map(f => <option key={f}>{f}</option>)}
                </select>
                <select value={cond.operator} onChange={(e) => updateCondition(group.id, cond.id, 'operator', e.target.value)} className="text-sm px-2 py-1 border rounded">
                  <option value="">选择操作</option>
                  {operators.map(o => <option key={o}>{o}</option>)}
                </select>
                <input value={cond.value} onChange={(e) => updateCondition(group.id, cond.id, 'value', e.target.value)} placeholder="值" className="flex-1 text-sm px-2 py-1 border rounded" />
                {group.conditions.length > 1 && <button onClick={() => removeCondition(group.id, cond.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3" /></button>}
              </div>
            ))}
            <button onClick={() => addCondition(group.id)} className="text-xs text-cyan-600 flex items-center gap-1 mt-1"><Plus className="w-3 h-3" />添加条件</button>
          </div>
        </motion.div>
      ))}
      <button onClick={addGroup} className="text-sm text-cyan-600 flex items-center gap-1"><Plus className="w-4 h-4" />添加条件组</button>
    </div>
  );
}
