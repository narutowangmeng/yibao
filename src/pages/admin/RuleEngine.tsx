import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Filter,
  GitBranch,
  Pencil,
  Pill,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Stethoscope,
  Trash2,
  X
} from 'lucide-react';
import insuranceKnowledgeBase from '../../data/insuranceKnowledgeBase.json';

interface KnowledgeRuleCondition {
  conditionId: string;
  conditionCombine: string;
  groupId: string;
  groupCombine: string;
  deId: string;
  paramTag: string;
  operator: string;
  value: string;
  valueSetId: string;
  valueSetName: string;
  kgProperty: string;
  ruleName: string;
}

interface KnowledgeRuleConclusion {
  resultType: string;
  resultTip: string;
}

interface KnowledgeRule {
  id: string;
  domain: 'drug' | 'service';
  name: string;
  type: string;
  note: string;
  splitFlag: string;
  originRuleId: string;
  status: string;
  source: string;
  conditions: KnowledgeRuleCondition[];
  conclusions: KnowledgeRuleConclusion[];
}

const initialRules = insuranceKnowledgeBase.ruleLibrary as KnowledgeRule[];

const domainMeta = {
  drug: {
    label: '药品规则',
    icon: Pill,
    badge: 'bg-cyan-100 text-cyan-700',
    card: 'bg-cyan-50 text-cyan-700'
  },
  service: {
    label: '诊疗项目规则',
    icon: Stethoscope,
    badge: 'bg-emerald-100 text-emerald-700',
    card: 'bg-emerald-50 text-emerald-700'
  }
} as const;

function makeEmptyCondition(index: number): KnowledgeRuleCondition {
  return {
    conditionId: `C${index + 1}`,
    conditionCombine: 'AND',
    groupId: 'G1',
    groupCombine: 'AND',
    deId: '',
    paramTag: '',
    operator: '=',
    value: '',
    valueSetId: '',
    valueSetName: '',
    kgProperty: '',
    ruleName: ''
  };
}

function makeEmptyConclusion(): KnowledgeRuleConclusion {
  return {
    resultType: '提示',
    resultTip: ''
  };
}

function makeEmptyRule(): KnowledgeRule {
  return {
    id: '',
    domain: 'drug',
    name: '',
    type: '',
    note: '',
    splitFlag: '0',
    originRuleId: '',
    status: '1',
    source: '手工维护',
    conditions: [makeEmptyCondition(0)],
    conclusions: [makeEmptyConclusion()]
  };
}

export default function RuleEngine() {
  const [rules, setRules] = useState<KnowledgeRule[]>(initialRules);
  const [keyword, setKeyword] = useState('');
  const [domainFilter, setDomainFilter] = useState<'all' | 'drug' | 'service'>('all');
  const [typeFilter, setTypeFilter] = useState('全部类型');
  const [selectedRuleId, setSelectedRuleId] = useState(initialRules[0]?.id ?? '');
  const [showEditor, setShowEditor] = useState(false);
  const [editingRule, setEditingRule] = useState<KnowledgeRule | null>(null);
  const [draftRule, setDraftRule] = useState<KnowledgeRule>(makeEmptyRule());

  const typeOptions = useMemo(() => (
    ['全部类型', ...Array.from(new Set(rules.map((rule) => rule.type).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-CN'))]
  ), [rules]);

  const filteredRules = useMemo(() => {
    const search = keyword.trim();
    return rules.filter((rule) => {
      const matchKeyword =
        !search
        || rule.name.includes(search)
        || rule.type.includes(search)
        || rule.note.includes(search)
        || rule.source.includes(search)
        || rule.id.includes(search);
      const matchDomain = domainFilter === 'all' || rule.domain === domainFilter;
      const matchType = typeFilter === '全部类型' || rule.type === typeFilter;
      return matchKeyword && matchDomain && matchType;
    });
  }, [rules, keyword, domainFilter, typeFilter]);

  const selectedRule = filteredRules.find((rule) => rule.id === selectedRuleId) || filteredRules[0] || null;

  useEffect(() => {
    if (selectedRule && selectedRule.id !== selectedRuleId) {
      setSelectedRuleId(selectedRule.id);
    }
    if (!selectedRule && filteredRules.length === 0) {
      setSelectedRuleId('');
    }
  }, [selectedRule, selectedRuleId, filteredRules]);

  const summary = useMemo(() => {
    const drugCount = rules.filter((rule) => rule.domain === 'drug').length;
    const serviceCount = rules.filter((rule) => rule.domain === 'service').length;
    const enabledCount = rules.filter((rule) => rule.status === '1').length;
    const conditionCount = rules.reduce((sum, rule) => sum + rule.conditions.length, 0);
    return { total: rules.length, drugCount, serviceCount, enabledCount, conditionCount };
  }, [rules]);

  const openAddEditor = () => {
    setEditingRule(null);
    setDraftRule(makeEmptyRule());
    setShowEditor(true);
  };

  const openEditEditor = (rule: KnowledgeRule) => {
    setEditingRule(rule);
    setDraftRule({
      ...rule,
      conditions: rule.conditions.map((condition) => ({ ...condition })),
      conclusions: rule.conclusions.map((conclusion) => ({ ...conclusion }))
    });
    setShowEditor(true);
  };

  const saveRule = () => {
    const normalizedName = draftRule.name.trim();
    const normalizedType = draftRule.type.trim();

    if (!normalizedName || !normalizedType) {
      return;
    }

    const normalizedRule: KnowledgeRule = {
      ...draftRule,
      id: editingRule?.id || draftRule.id || `RULE-${Date.now()}`,
      name: normalizedName,
      type: normalizedType,
      note: draftRule.note.trim(),
      source: draftRule.source.trim() || '手工维护',
      originRuleId: draftRule.originRuleId.trim() || editingRule?.originRuleId || '',
      conditions: draftRule.conditions.map((condition, index) => ({
        ...condition,
        conditionId: condition.conditionId.trim() || `C${index + 1}`,
        groupId: condition.groupId.trim() || 'G1',
        operator: condition.operator.trim() || '=',
        ruleName: normalizedName
      })),
      conclusions: draftRule.conclusions.map((conclusion) => ({
        ...conclusion,
        resultType: conclusion.resultType.trim() || '提示',
        resultTip: conclusion.resultTip.trim()
      }))
    };

    if (editingRule) {
      setRules((current) => current.map((rule) => (rule.id === editingRule.id ? normalizedRule : rule)));
      setSelectedRuleId(normalizedRule.id);
    } else {
      setRules((current) => [normalizedRule, ...current]);
      setSelectedRuleId(normalizedRule.id);
    }

    setShowEditor(false);
  };

  const deleteRule = (id: string) => {
    setRules((current) => current.filter((rule) => rule.id !== id));
    if (selectedRuleId === id) {
      setSelectedRuleId('');
    }
  };

  const toggleStatus = (id: string) => {
    setRules((current) => current.map((rule) => (
      rule.id === id
        ? { ...rule, status: rule.status === '1' ? '0' : '1' }
        : rule
    )));
  };

  const updateCondition = (index: number, field: keyof KnowledgeRuleCondition, value: string) => {
    setDraftRule((current) => ({
      ...current,
      conditions: current.conditions.map((condition, conditionIndex) => (
        conditionIndex === index ? { ...condition, [field]: value } : condition
      ))
    }));
  };

  const updateConclusion = (index: number, field: keyof KnowledgeRuleConclusion, value: string) => {
    setDraftRule((current) => ({
      ...current,
      conclusions: current.conclusions.map((conclusion, conclusionIndex) => (
        conclusionIndex === index ? { ...conclusion, [field]: value } : conclusion
      ))
    }));
  };

  const addCondition = () => {
    setDraftRule((current) => ({
      ...current,
      conditions: [...current.conditions, makeEmptyCondition(current.conditions.length)]
    }));
  };

  const removeCondition = (index: number) => {
    setDraftRule((current) => ({
      ...current,
      conditions: current.conditions.length === 1
        ? current.conditions
        : current.conditions.filter((_, conditionIndex) => conditionIndex !== index)
    }));
  };

  const addConclusion = () => {
    setDraftRule((current) => ({
      ...current,
      conclusions: [...current.conclusions, makeEmptyConclusion()]
    }));
  };

  const removeConclusion = (index: number) => {
    setDraftRule((current) => ({
      ...current,
      conclusions: current.conclusions.length === 1
        ? current.conclusions
        : current.conclusions.filter((_, conclusionIndex) => conclusionIndex !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-gray-200 bg-gradient-to-r from-red-50 via-white to-cyan-50 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-gray-600 shadow-sm">
              <Settings2 className="h-4 w-4 text-red-600" />
              基金监管 / 规则引擎
            </div>
            <h2 className="mt-4 text-3xl font-bold text-gray-900">规则引擎</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-600">
              统一纳入基金监管模块，支持真实规则数据的新增、编辑、删除、启停和明细维护，不再只是查看页面。
            </p>
          </div>
          <button
            onClick={openAddEditor}
            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700"
          >
            <Plus className="h-4 w-4" />
            新增规则
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <div className="rounded-3xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs text-gray-500">规则总数</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{summary.total}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs text-gray-500">药品规则</p>
          <p className="mt-2 text-2xl font-semibold text-cyan-700">{summary.drugCount}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs text-gray-500">诊疗规则</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">{summary.serviceCount}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs text-gray-500">启用规则</p>
          <p className="mt-2 text-2xl font-semibold text-red-600">{summary.enabledCount}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs text-gray-500">条件总数</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{summary.conditionCount}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.5fr_0.8fr_0.8fr]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索规则名称、ID、类型、备注或来源"
              className="w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-4 outline-none transition focus:border-red-500"
            />
          </div>
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value as 'all' | 'drug' | 'service')}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-500"
          >
            <option value="all">全部领域</option>
            <option value="drug">药品规则</option>
            <option value="service">诊疗项目规则</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-500"
          >
            {typeOptions.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">规则列表</h3>
            </div>
            <span className="text-sm text-gray-500">{filteredRules.length} 条</span>
          </div>

          <div className="space-y-3">
            {filteredRules.map((rule) => {
              const meta = domainMeta[rule.domain];
              const DomainIcon = meta.icon;
              const isSelected = selectedRule?.id === rule.id;
              return (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl border p-4 transition ${
                    isSelected ? 'border-red-300 bg-red-50/60' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-slate-50'
                  }`}
                >
                  <button
                    onClick={() => setSelectedRuleId(rule.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${meta.card}`}>
                          <DomainIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{rule.name}</p>
                          <p className="mt-1 text-xs text-gray-500">{rule.id}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs ${meta.badge}`}>{meta.label}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{rule.note || '暂无备注说明'}</p>
                  </button>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="rounded-full bg-slate-100 px-3 py-1">{rule.type || '未分类'}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">条件 {rule.conditions.length}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">结论 {rule.conclusions.length}</span>
                      <span className={`rounded-full px-3 py-1 ${rule.status === '1' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {rule.status === '1' ? '启用' : '停用'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStatus(rule.id)}
                        className="rounded-xl px-3 py-2 text-xs text-gray-600 transition hover:bg-slate-100"
                      >
                        {rule.status === '1' ? '停用' : '启用'}
                      </button>
                      <button
                        onClick={() => openEditEditor(rule)}
                        className="rounded-xl p-2 text-gray-500 transition hover:bg-slate-100 hover:text-gray-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="rounded-xl p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          {selectedRule ? (
            <>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">{selectedRule.name}</h3>
                    <p className="mt-2 text-sm text-gray-500">{selectedRule.id} · {selectedRule.type || '未分类'}</p>
                    <p className="mt-3 text-sm leading-7 text-gray-600">{selectedRule.note || '暂无规则说明'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs ${domainMeta[selectedRule.domain].badge}`}>
                      {domainMeta[selectedRule.domain].label}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs ${selectedRule.status === '1' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {selectedRule.status === '1' ? '启用' : '停用'}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <GitBranch className="h-4 w-4" />
                      <span className="text-sm font-medium">条件数</span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-gray-900">{selectedRule.conditions.length}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <FileCheck2 className="h-4 w-4" />
                      <span className="text-sm font-medium">结论数</span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-gray-900">{selectedRule.conclusions.length}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Activity className="h-4 w-4" />
                      <span className="text-sm font-medium">来源</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{selectedRule.source}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <ShieldCheck className="h-4 w-4" />
                      <span className="text-sm font-medium">原始规则ID</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{selectedRule.originRuleId || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">规则条件</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200 bg-slate-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-sm font-medium text-gray-600">条件ID</th>
                        <th className="px-3 py-3 text-left text-sm font-medium text-gray-600">参数标签</th>
                        <th className="px-3 py-3 text-left text-sm font-medium text-gray-600">数据项</th>
                        <th className="px-3 py-3 text-left text-sm font-medium text-gray-600">运算符</th>
                        <th className="px-3 py-3 text-left text-sm font-medium text-gray-600">判断值</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedRule.conditions.map((condition, index) => (
                        <tr key={`${selectedRule.id}-${index}`}>
                          <td className="px-3 py-3 text-sm text-gray-700">{condition.conditionId || '-'}</td>
                          <td className="px-3 py-3 text-sm text-gray-700">{condition.paramTag || '-'}</td>
                          <td className="px-3 py-3 text-sm text-gray-700">{condition.deId || condition.kgProperty || '-'}</td>
                          <td className="px-3 py-3 text-sm text-gray-700">{condition.operator || '-'}</td>
                          <td className="px-3 py-3 text-sm text-gray-700">{condition.value || condition.valueSetName || condition.valueSetId || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">规则结论</h3>
                </div>
                <div className="space-y-3">
                  {selectedRule.conclusions.map((conclusion, index) => (
                    <div key={`${selectedRule.id}-conclusion-${index}`} className="rounded-2xl border border-gray-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs text-red-700">
                          {conclusion.resultType || '提示'}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-gray-700">{conclusion.resultTip || '暂无结论描述'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
              当前筛选条件下没有规则数据
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
            onClick={() => setShowEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {editingRule ? '编辑规则' : '新增规则'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">支持规则定义、条件和结论的完整维护。</p>
                </div>
                <button
                  onClick={() => setShowEditor(false)}
                  className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[72vh] space-y-6 overflow-y-auto px-6 py-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">规则名称</span>
                    <input
                      value={draftRule.name}
                      onChange={(e) => setDraftRule((current) => ({ ...current, name: e.target.value }))}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-500"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">规则类型</span>
                    <input
                      value={draftRule.type}
                      onChange={(e) => setDraftRule((current) => ({ ...current, type: e.target.value }))}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-500"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">规则领域</span>
                    <select
                      value={draftRule.domain}
                      onChange={(e) => setDraftRule((current) => ({ ...current, domain: e.target.value as 'drug' | 'service' }))}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-500"
                    >
                      <option value="drug">药品规则</option>
                      <option value="service">诊疗项目规则</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">规则状态</span>
                    <select
                      value={draftRule.status}
                      onChange={(e) => setDraftRule((current) => ({ ...current, status: e.target.value }))}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-500"
                    >
                      <option value="1">启用</option>
                      <option value="0">停用</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">来源</span>
                    <input
                      value={draftRule.source}
                      onChange={(e) => setDraftRule((current) => ({ ...current, source: e.target.value }))}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-500"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">原始规则ID</span>
                    <input
                      value={draftRule.originRuleId}
                      onChange={(e) => setDraftRule((current) => ({ ...current, originRuleId: e.target.value }))}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-500"
                    />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-gray-700">备注说明</span>
                    <textarea
                      value={draftRule.note}
                      onChange={(e) => setDraftRule((current) => ({ ...current, note: e.target.value }))}
                      rows={3}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-red-500"
                    />
                  </label>
                </div>

                <div className="rounded-3xl border border-gray-200 p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-red-600" />
                      <h4 className="text-lg font-semibold text-gray-900">规则条件</h4>
                    </div>
                    <button
                      onClick={addCondition}
                      className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800"
                    >
                      <Plus className="h-4 w-4" />
                      新增条件
                    </button>
                  </div>

                  <div className="space-y-4">
                    {draftRule.conditions.map((condition, index) => (
                      <div key={`condition-${index}`} className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-gray-800">条件 {index + 1}</p>
                          <button
                            onClick={() => removeCondition(index)}
                            className="rounded-xl p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                          <input
                            value={condition.conditionId}
                            onChange={(e) => updateCondition(index, 'conditionId', e.target.value)}
                            placeholder="条件ID"
                            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-red-500"
                          />
                          <input
                            value={condition.paramTag}
                            onChange={(e) => updateCondition(index, 'paramTag', e.target.value)}
                            placeholder="参数标签"
                            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-red-500"
                          />
                          <input
                            value={condition.deId}
                            onChange={(e) => updateCondition(index, 'deId', e.target.value)}
                            placeholder="数据项 deId"
                            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-red-500"
                          />
                          <input
                            value={condition.operator}
                            onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                            placeholder="运算符"
                            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-red-500"
                          />
                          <input
                            value={condition.value}
                            onChange={(e) => updateCondition(index, 'value', e.target.value)}
                            placeholder="判断值"
                            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-red-500"
                          />
                          <input
                            value={condition.valueSetName}
                            onChange={(e) => updateCondition(index, 'valueSetName', e.target.value)}
                            placeholder="值集名称"
                            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-red-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-red-600" />
                      <h4 className="text-lg font-semibold text-gray-900">规则结论</h4>
                    </div>
                    <button
                      onClick={addConclusion}
                      className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
                    >
                      <Plus className="h-4 w-4" />
                      新增结论
                    </button>
                  </div>

                  <div className="space-y-4">
                    {draftRule.conclusions.map((conclusion, index) => (
                      <div key={`conclusion-${index}`} className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-gray-800">结论 {index + 1}</p>
                          <button
                            onClick={() => removeConclusion(index)}
                            className="rounded-xl p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[0.6fr_1.4fr]">
                          <input
                            value={conclusion.resultType}
                            onChange={(e) => updateConclusion(index, 'resultType', e.target.value)}
                            placeholder="结论类型"
                            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-red-500"
                          />
                          <textarea
                            value={conclusion.resultTip}
                            onChange={(e) => updateConclusion(index, 'resultTip', e.target.value)}
                            placeholder="结论内容"
                            rows={3}
                            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-red-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-5">
                <button
                  onClick={() => setShowEditor(false)}
                  className="rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={saveRule}
                  className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  保存规则
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
