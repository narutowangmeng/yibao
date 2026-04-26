import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Play, CheckCircle, AlertTriangle, XCircle, Settings, Pill, Stethoscope, Package, UserCheck } from 'lucide-react';

interface Rule {
  id: string;
  name: string;
  category: 'drug' | 'service' | 'material' | 'behavior';
  type: 'forbidden' | 'limit' | 'warning';
  condition: string;
  status: 'enabled' | 'disabled';
  hitCount: number;
}

interface CheckResult {
  ruleId: string;
  ruleName: string;
  category: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
}

const mockRules: Rule[] = [
  { id: 'R001', name: '抗生素使用限制', category: 'drug', type: 'limit', condition: '同一患者7天内抗生素处方>3次', status: 'enabled', hitCount: 156 },
  { id: 'R002', name: '高价药品审批', category: 'drug', type: 'warning', condition: '单价>5000元需审批', status: 'enabled', hitCount: 89 },
  { id: 'R003', name: '重复收费检查', category: 'service', type: 'forbidden', condition: '同一项目同日重复收费', status: 'enabled', hitCount: 234 },
  { id: 'R004', name: '耗材匹配校验', category: 'material', type: 'warning', condition: '手术耗材与术式不匹配', status: 'disabled', hitCount: 45 },
  { id: 'R005', name: '超量开药预警', category: 'behavior', type: 'warning', condition: '单次开药量>30天', status: 'enabled', hitCount: 312 },
];

const categoryIcons = {
  drug: { icon: Pill, label: '药品规则', color: 'bg-blue-100 text-blue-600' },
  service: { icon: Stethoscope, label: '诊疗规则', color: 'bg-green-100 text-green-600' },
  material: { icon: Package, label: '材料规则', color: 'bg-purple-100 text-purple-600' },
  behavior: { icon: UserCheck, label: '行为规则', color: 'bg-orange-100 text-orange-600' },
};

const typeLabels = { forbidden: '禁止类', limit: '限制类', warning: '警告类' };

export default function RuleCheck({ onBack }: { onBack: () => void }) {
  const [rules, setRules] = useState<Rule[]>(mockRules);
  const [activeTab, setActiveTab] = useState<'all' | Rule['category']>('all');
  const [billNo, setBillNo] = useState('');
  const [checkResults, setCheckResults] = useState<CheckResult[] | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredRules = activeTab === 'all' ? rules : rules.filter(r => r.category === activeTab);

  const handleCheck = () => {
    if (!billNo.trim()) return;
    setIsChecking(true);
    setTimeout(() => {
      setCheckResults([
        { ruleId: 'R001', ruleName: '抗生素使用限制', category: '药品规则', status: 'pass', message: '未触发限制条件' },
        { ruleId: 'R002', ruleName: '高价药品审批', category: '药品规则', status: 'warning', message: '药品单价4800元，接近限额' },
        { ruleId: 'R003', ruleName: '重复收费检查', category: '诊疗规则', status: 'pass', message: '无重复收费项目' },
        { ruleId: 'R005', ruleName: '超量开药预警', category: '行为规则', status: 'fail', message: '单次开药35天，超出30天限制' },
      ]);
      setIsChecking(false);
    }, 800);
  };

  const toggleRuleStatus = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, status: r.status === 'enabled' ? 'disabled' : 'enabled' } : r));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const saveRule = (rule: Partial<Rule>) => {
    if (editingRule) {
      setRules(rules.map(r => r.id === editingRule.id ? { ...r, ...rule } as Rule : r));
    } else {
      setRules([...rules, { ...rule as Rule, id: `R${String(rules.length + 1).padStart(3, '0')}`, hitCount: 0 }]);
    }
    setShowForm(false);
    setEditingRule(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-800">规则校验</h2>
            <p className="text-sm text-gray-500">智能规则引擎配置与实时校验</p>
          </div>
        </div>
        <button onClick={() => { setEditingRule(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
          <Plus className="w-4 h-4" />新增规则
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-cyan-600" />实时校验测试
        </h3>
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="输入单据号进行规则校验..."
            value={billNo}
            onChange={(e) => setBillNo(e.target.value)}
            className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={handleCheck}
            disabled={!billNo.trim() || isChecking}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isChecking ? '校验中...' : <><Play className="w-4 h-4" />开始校验</>}
          </button>
        </div>

        {checkResults && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center gap-1 text-sm"><CheckCircle className="w-4 h-4 text-green-500" />通过 2项</span>
              <span className="flex items-center gap-1 text-sm"><AlertTriangle className="w-4 h-4 text-yellow-500" />警告 1项</span>
              <span className="flex items-center gap-1 text-sm"><XCircle className="w-4 h-4 text-red-500" />不通过 1项</span>
            </div>
            {checkResults.map((result, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                result.status === 'pass' ? 'bg-green-50 border-green-500' :
                result.status === 'warning' ? 'bg-yellow-50 border-yellow-500' : 'bg-red-50 border-red-500'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {result.status === 'pass' ? <CheckCircle className="w-5 h-5 text-green-500" /> :
                     result.status === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-500" /> :
                     <XCircle className="w-5 h-5 text-red-500" />}
                    <span className="font-medium text-gray-800">{result.ruleName}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">{result.category}</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    result.status === 'pass' ? 'text-green-600' :
                    result.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {result.status === 'pass' ? '通过' : result.status === 'warning' ? '警告' : '不通过'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 ml-8">{result.message}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-cyan-600" />
            <h3 className="text-lg font-bold text-gray-800">规则引擎配置</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'all' ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>全部</button>
            {(['drug', 'service', 'material', 'behavior'] as const).map(cat => {
              const { icon: Icon, label } = categoryIcons[cat];
              return (
                <button key={cat} onClick={() => setActiveTab(cat)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === cat ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  <Icon className="w-4 h-4" />{label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="divide-y">
          {filteredRules.map((rule) => {
            const { icon: Icon, color } = categoryIcons[rule.category];
            return (
              <div key={rule.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{rule.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${rule.type === 'forbidden' ? 'bg-red-100 text-red-600' : rule.type === 'limit' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>{typeLabels[rule.type]}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{rule.condition}</p>
                    <p className="text-xs text-gray-400 mt-1">命中次数: {rule.hitCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleRuleStatus(rule.id)} className={`px-3 py-1 rounded text-sm font-medium transition-colors ${rule.status === 'enabled' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{rule.status === 'enabled' ? '已启用' : '已禁用'}</button>
                  <button onClick={() => { setEditingRule(rule); setShowForm(true); }} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => deleteRule(rule.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{editingRule ? '编辑规则' : '新增规则'}</h3>
            <RuleForm initialData={editingRule} onSave={saveRule} onCancel={() => { setShowForm(false); setEditingRule(null); }} />
          </motion.div>
        </div>
      )}
    </div>
  );
}

function RuleForm({ initialData, onSave, onCancel }: { initialData: Rule | null; onSave: (r: Partial<Rule>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'drug',
    type: initialData?.type || 'warning',
    condition: initialData?.condition || '',
    status: initialData?.status || 'enabled',
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">规则名称</label>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500" placeholder="输入规则名称" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">规则分类</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Rule['category'] })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500">
            <option value="drug">药品规则</option>
            <option value="service">诊疗规则</option>
            <option value="material">材料规则</option>
            <option value="behavior">行为规则</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">规则类型</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Rule['type'] })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500">
            <option value="forbidden">禁止类</option>
            <option value="limit">限制类</option>
            <option value="warning">警告类</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">触发条件</label>
        <textarea value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500" rows={3} placeholder="输入规则触发条件描述" />
      </div>
      <div className="flex gap-3 pt-4">
        <button onClick={() => onSave(form)} className="flex-1 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
        <button onClick={onCancel} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">取消</button>
      </div>
    </div>
  );
}
