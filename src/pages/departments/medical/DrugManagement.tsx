import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, Pencil, Pill, Plus, Search, ShieldCheck, Trash2, X } from 'lucide-react';
import insuranceKnowledgeBase from '../../../data/insuranceKnowledgeBase.json';
import { getAgencyLevel } from '../../../config/managementPermissions';

interface DrugDirectoryItem {
  id: string;
  kind: 'drug';
  category: string;
  negotiationType: string;
  code: string;
  name: string;
  dosageForm: string;
  textType: string;
  textContent: string;
  source: string;
}

interface ManagedDrug {
  id: string;
  code: string;
  name: string;
  category: string;
  negotiationType: string;
  dosageForm: string;
  source: string;
  status: 'enabled' | 'disabled';
  textTypes: string[];
  ruleCount: number;
  entries: DrugDirectoryItem[];
}

const drugDirectory = insuranceKnowledgeBase.drugDirectory as DrugDirectoryItem[];

function buildManagedDrugs(items: DrugDirectoryItem[]): ManagedDrug[] {
  const grouped = new Map<string, ManagedDrug>();

  for (const item of items) {
    const key = `${item.code}-${item.name}`;
    const existing = grouped.get(key);

    if (existing) {
      existing.ruleCount += 1;
      existing.entries.push(item);
      if (item.textType && !existing.textTypes.includes(item.textType)) {
        existing.textTypes.push(item.textType);
      }
      continue;
    }

    grouped.set(key, {
      id: key,
      code: item.code || '-',
      name: item.name || '未命名药品',
      category: item.category || '未分类',
      negotiationType: item.negotiationType || '目录药品',
      dosageForm: item.dosageForm || '未标注',
      source: item.source || '未知来源',
      status: 'enabled',
      textTypes: item.textType ? [item.textType] : [],
      ruleCount: 1,
      entries: [item],
    });
  }

  return Array.from(grouped.values()).sort((a, b) => a.code.localeCompare(b.code, 'zh-CN'));
}

const initialDrugs = buildManagedDrugs(drugDirectory);
const categoryOptions = ['全部分类', ...Array.from(new Set(initialDrugs.map((item) => item.category))).sort((a, b) => a.localeCompare(b, 'zh-CN'))];

const emptyForm = {
  code: '',
  name: '',
  category: '',
  negotiationType: '目录药品',
  dosageForm: '',
  source: '',
  status: 'enabled' as const,
};

export default function DrugManagement({ userAgency }: { userAgency: string }) {
  const [drugs, setDrugs] = useState<ManagedDrug[]>(initialDrugs);
  const [keyword, setKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部分类');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [selectedDrug, setSelectedDrug] = useState<ManagedDrug | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingDrug, setEditingDrug] = useState<ManagedDrug | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const isProvince = getAgencyLevel(userAgency) === 'province';

  const filteredDrugs = useMemo(() => {
    const search = keyword.trim();
    return drugs.filter((drug) => {
      const matchesKeyword =
        !search ||
        drug.name.includes(search) ||
        drug.code.includes(search) ||
        drug.entries.some((entry) => entry.textContent.includes(search));
      const matchesCategory = categoryFilter === '全部分类' || drug.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || drug.status === statusFilter;
      return matchesKeyword && matchesCategory && matchesStatus;
    });
  }, [drugs, keyword, categoryFilter, statusFilter]);

  const summary = useMemo(() => {
    const enabledCount = drugs.filter((item) => item.status === 'enabled').length;
    const disabledCount = drugs.filter((item) => item.status === 'disabled').length;
    const ruleCount = drugs.reduce((sum, item) => sum + item.ruleCount, 0);
    return { total: drugs.length, enabledCount, disabledCount, ruleCount };
  }, [drugs]);

  const openAddEditor = () => {
    setEditingDrug(null);
    setFormData(emptyForm);
    setShowEditor(true);
  };

  const openEditEditor = (drug: ManagedDrug) => {
    setEditingDrug(drug);
    setFormData({
      code: drug.code,
      name: drug.name,
      category: drug.category,
      negotiationType: drug.negotiationType,
      dosageForm: drug.dosageForm,
      source: drug.source,
      status: drug.status,
    });
    setShowEditor(true);
  };

  const handleSave = () => {
    const payload = {
      code: formData.code.trim(),
      name: formData.name.trim(),
      category: formData.category.trim() || '未分类',
      negotiationType: formData.negotiationType.trim() || '目录药品',
      dosageForm: formData.dosageForm.trim() || '未标注',
      source: formData.source.trim() || '手工维护',
      status: formData.status,
    };

    if (!payload.code || !payload.name) return;

    if (editingDrug) {
      setDrugs((current) => current.map((item) => (item.id === editingDrug.id ? { ...item, ...payload } : item)));
      if (selectedDrug?.id === editingDrug.id) {
        setSelectedDrug({ ...editingDrug, ...payload });
      }
    } else {
      setDrugs((current) => [
        {
          id: `custom-${Date.now()}`,
          ...payload,
          textTypes: ['手工维护'],
          ruleCount: 0,
          entries: [],
        },
        ...current,
      ]);
    }

    setShowEditor(false);
  };

  const handleDelete = (id: string) => {
    setDrugs((current) => current.filter((item) => item.id !== id));
    if (selectedDrug?.id === id) setSelectedDrug(null);
  };

  const toggleStatus = (id: string) => {
    setDrugs((current) =>
      current.map((item) => (item.id === id ? { ...item, status: item.status === 'enabled' ? 'disabled' : 'enabled' } : item)),
    );
    if (selectedDrug?.id === id) {
      setSelectedDrug({ ...selectedDrug, status: selectedDrug.status === 'enabled' ? 'disabled' : 'enabled' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">药品目录管理</h2>
          <p className="mt-1 text-sm text-gray-500">统一使用医保药品目录真实数据，可查看目录规则、支付属性和启停状态。</p>
        </div>
        {isProvince ? (
          <button onClick={openAddEditor} className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            新增药品
          </button>
        ) : (
          <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">地市账号仅可查看药品目录，不可新增、编辑、启停或删除</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-3xl border border-gray-200 bg-white px-5 py-4 shadow-sm"><p className="text-xs text-gray-500">目录药品</p><p className="mt-2 text-2xl font-semibold text-gray-900">{summary.total}</p></div>
        <div className="rounded-3xl border border-gray-200 bg-white px-5 py-4 shadow-sm"><p className="text-xs text-gray-500">启用目录</p><p className="mt-2 text-2xl font-semibold text-emerald-600">{summary.enabledCount}</p></div>
        <div className="rounded-3xl border border-gray-200 bg-white px-5 py-4 shadow-sm"><p className="text-xs text-gray-500">停用目录</p><p className="mt-2 text-2xl font-semibold text-amber-600">{summary.disabledCount}</p></div>
        <div className="rounded-3xl border border-gray-200 bg-white px-5 py-4 shadow-sm"><p className="text-xs text-gray-500">规则文本</p><p className="mt-2 text-2xl font-semibold text-blue-600">{summary.ruleCount}</p></div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.5fr_0.8fr_0.8fr]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="搜索药品名称、编码或规则原文" className="w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500">
            {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | 'enabled' | 'disabled')} className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500">
            <option value="all">全部状态</option>
            <option value="enabled">启用</option>
            <option value="disabled">停用</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">药品信息</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">目录属性</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">规则文本数</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDrugs.map((drug) => (
              <tr key={drug.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50"><Pill className="h-5 w-5 text-blue-700" /></div>
                    <div>
                      <p className="font-medium text-gray-900">{drug.name}</p>
                      <p className="text-xs text-gray-500">{drug.code} / {drug.category} / {drug.dosageForm}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">{drug.negotiationType}</span>
                    <p className="text-xs text-gray-500">{drug.source}</p>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">{drug.ruleCount}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs ${drug.status === 'enabled' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {drug.status === 'enabled' ? '启用' : '停用'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setSelectedDrug(drug)} className="rounded-xl p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-700"><Eye className="h-4 w-4" /></button>
                    {isProvince && (
                      <>
                        <button onClick={() => openEditEditor(drug)} className="rounded-xl p-2 text-gray-500 transition hover:bg-slate-100 hover:text-gray-900"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => toggleStatus(drug.id)} className="rounded-xl p-2 text-gray-500 transition hover:bg-emerald-50 hover:text-emerald-700"><ShieldCheck className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(drug.id)} className="rounded-xl p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedDrug && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" onClick={() => setSelectedDrug(null)}>
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="border-b border-gray-200 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">{selectedDrug.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{selectedDrug.code} / {selectedDrug.category} / {selectedDrug.dosageForm}</p>
                  </div>
                  <button onClick={() => setSelectedDrug(null)} className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"><X className="h-5 w-5" /></button>
                </div>
              </div>
              <div className="max-h-[56vh] space-y-4 overflow-y-auto px-6 py-5">
                {selectedDrug.entries.length > 0 ? selectedDrug.entries.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">{entry.textType || '规则文本'}</span>
                      <span className="text-xs text-gray-400">{entry.source}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-gray-700">{entry.textContent}</p>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-slate-50 p-8 text-center text-sm text-gray-500">该条目为手工新增数据，当前还没有关联规则文本。</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProvince && showEditor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" onClick={() => setShowEditor(false)}>
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="w-full max-w-3xl rounded-[28px] bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{editingDrug ? '编辑药品目录' : '新增药品目录'}</h3>
                  <p className="mt-1 text-sm text-gray-500">省级账号可维护全省医保药品目录主数据。</p>
                </div>
                <button onClick={() => setShowEditor(false)} className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"><X className="h-5 w-5" /></button>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <input value={formData.code} onChange={(e) => setFormData((current) => ({ ...current, code: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="药品编码" />
                <input value={formData.name} onChange={(e) => setFormData((current) => ({ ...current, name: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="药品名称" />
                <input value={formData.category} onChange={(e) => setFormData((current) => ({ ...current, category: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="药品分类" />
                <input value={formData.negotiationType} onChange={(e) => setFormData((current) => ({ ...current, negotiationType: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="目录属性" />
                <input value={formData.dosageForm} onChange={(e) => setFormData((current) => ({ ...current, dosageForm: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="剂型" />
                <select value={formData.status} onChange={(e) => setFormData((current) => ({ ...current, status: e.target.value as 'enabled' | 'disabled' }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500">
                  <option value="enabled">启用</option>
                  <option value="disabled">停用</option>
                </select>
                <input value={formData.source} onChange={(e) => setFormData((current) => ({ ...current, source: e.target.value }))} className="md:col-span-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="数据来源" />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowEditor(false)} className="rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50">取消</button>
                <button onClick={handleSave} className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700">保存目录</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
