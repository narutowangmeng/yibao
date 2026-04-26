import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, FileText, Pill, Search, ShieldAlert, Tags, X } from 'lucide-react';
import insuranceKnowledgeBase from '../../../data/insuranceKnowledgeBase.json';

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

const drugDirectory = insuranceKnowledgeBase.drugDirectory as DrugDirectoryItem[];

interface DrugSummary {
  code: string;
  name: string;
  category: string;
  negotiationType: string;
  dosageForm: string;
  source: string;
  textTypes: string[];
  ruleCount: number;
  entries: DrugDirectoryItem[];
}

function buildDrugSummaries(items: DrugDirectoryItem[]): DrugSummary[] {
  const grouped = new Map<string, DrugSummary>();

  for (const item of items) {
    const key = `${item.code}-${item.name}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.ruleCount += 1;
      if (item.textType && !existing.textTypes.includes(item.textType)) {
        existing.textTypes.push(item.textType);
      }
      existing.entries.push(item);
      continue;
    }

    grouped.set(key, {
      code: item.code,
      name: item.name,
      category: item.category || '未分类',
      negotiationType: item.negotiationType || '目录药品',
      dosageForm: item.dosageForm || '未标注',
      source: item.source,
      textTypes: item.textType ? [item.textType] : [],
      ruleCount: 1,
      entries: [item]
    });
  }

  return Array.from(grouped.values()).sort((a, b) => a.code.localeCompare(b.code, 'zh-CN'));
}

const drugSummaries = buildDrugSummaries(drugDirectory);
const categories = ['全部分类', ...Array.from(new Set(drugSummaries.map((item) => item.category))).sort((a, b) => a.localeCompare(b, 'zh-CN'))];
const textTypes = ['全部文本', ...Array.from(new Set(drugDirectory.map((item) => item.textType).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-CN'))];

export default function DrugDirectoryQuery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部分类');
  const [selectedTextType, setSelectedTextType] = useState('全部文本');
  const [selectedDrug, setSelectedDrug] = useState<DrugSummary | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filteredDrugs = useMemo(() => {
    const keyword = searchTerm.trim();

    return drugSummaries.filter((drug) => {
      const matchesSearch =
        !keyword
        || drug.name.includes(keyword)
        || drug.code.includes(keyword)
        || drug.entries.some((entry) => entry.textContent.includes(keyword));
      const matchesCategory = selectedCategory === '全部分类' || drug.category === selectedCategory;
      const matchesTextType = selectedTextType === '全部文本' || drug.textTypes.includes(selectedTextType);
      return matchesSearch && matchesCategory && matchesTextType;
    });
  }, [searchTerm, selectedCategory, selectedTextType]);

  const totalPages = Math.max(1, Math.ceil(filteredDrugs.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedDrugs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDrugs.slice(start, start + pageSize);
  }, [filteredDrugs, currentPage]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">药品目录查询</h2>
          <p className="mt-1 text-sm text-gray-500">已接入真实药品规则文本，可直接查看国家医保目录中的限制条件和来源说明。</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-right sm:grid-cols-3">
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500">药品条目</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">{drugSummaries.length}</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500">规则文本</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">{drugDirectory.length}</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm border border-gray-200 col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500">文本类型</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">{textTypes.length - 1}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.6fr_0.8fr_0.8fr]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="搜索药品名称、编码或限制原文"
              className="w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-4 outline-none transition focus:border-cyan-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-cyan-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={selectedTextType}
            onChange={(e) => {
              setSelectedTextType(e.target.value);
              setPage(1);
            }}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-cyan-500"
          >
            {textTypes.map((textType) => (
              <option key={textType} value={textType}>{textType}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">药品信息</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">类别</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">目录属性</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">规则数</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pagedDrugs.map((drug) => (
              <tr key={`${drug.code}-${drug.name}`} className="hover:bg-slate-50/70">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50">
                      <Pill className="h-5 w-5 text-cyan-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{drug.name}</p>
                      <p className="text-xs text-gray-500">{drug.code} · {drug.dosageForm}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">{drug.category}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs ${
                    drug.negotiationType.includes('谈判')
                      ? 'bg-amber-100 text-amber-700'
                      : drug.negotiationType.includes('竞价')
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-slate-100 text-slate-700'
                  }`}>
                    {drug.negotiationType}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">{drug.ruleCount}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedDrug(drug)}
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-cyan-700 transition hover:bg-cyan-50"
                    >
                      <Eye className="h-4 w-4" />
                      查看规则
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm text-gray-500">
          共 {filteredDrugs.length} 条，当前第 {currentPage} / {totalPages} 页
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            上一页
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            下一页
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedDrug && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
            onClick={() => setSelectedDrug(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-2xl"
            >
              <div className="border-b border-gray-200 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">{selectedDrug.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{selectedDrug.code} · {selectedDrug.category} · {selectedDrug.dosageForm}</p>
                  </div>
                  <button onClick={() => setSelectedDrug(null)} className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Tags className="h-4 w-4" />
                      <span className="text-sm font-medium">目录属性</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{selectedDrug.negotiationType}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">规则文本类型</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{selectedDrug.textTypes.join('、') || '未标注'}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <ShieldAlert className="h-4 w-4" />
                      <span className="text-sm font-medium">来源</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{selectedDrug.source}</p>
                  </div>
                </div>
              </div>

              <div className="max-h-[55vh] space-y-4 overflow-y-auto px-6 py-5">
                {selectedDrug.entries.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs text-cyan-700">{entry.textType || '规则文本'}</span>
                      <span className="text-xs text-gray-400">{entry.source}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-gray-700">{entry.textContent}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
