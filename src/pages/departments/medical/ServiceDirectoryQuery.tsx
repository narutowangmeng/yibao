import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpenText, Eye, FileText, Search, Stethoscope, X } from 'lucide-react';
import insuranceKnowledgeBase from '../../../data/insuranceKnowledgeBase.json';

interface ServiceDirectoryItem {
  id: string;
  kind: 'service';
  code: string;
  name: string;
  textType: string;
  textContent: string;
  source: string;
}

const serviceDirectory = insuranceKnowledgeBase.serviceDirectory as ServiceDirectoryItem[];

interface ServiceSummary {
  code: string;
  name: string;
  source: string;
  textTypes: string[];
  entryCount: number;
  entries: ServiceDirectoryItem[];
}

function buildServiceSummaries(items: ServiceDirectoryItem[]): ServiceSummary[] {
  const grouped = new Map<string, ServiceSummary>();

  for (const item of items) {
    const key = `${item.code}-${item.name}`;
    const existing = grouped.get(key);
    if (existing) {
      existing.entryCount += 1;
      if (item.textType && !existing.textTypes.includes(item.textType)) {
        existing.textTypes.push(item.textType);
      }
      existing.entries.push(item);
      continue;
    }

    grouped.set(key, {
      code: item.code,
      name: item.name,
      source: item.source,
      textTypes: item.textType ? [item.textType] : [],
      entryCount: 1,
      entries: [item]
    });
  }

  return Array.from(grouped.values()).sort((a, b) => a.code.localeCompare(b.code, 'zh-CN'));
}

const serviceSummaries = buildServiceSummaries(serviceDirectory);
const textTypes = ['全部文本', ...Array.from(new Set(serviceDirectory.map((item) => item.textType).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'zh-CN'))];

export default function ServiceDirectoryQuery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTextType, setSelectedTextType] = useState('全部文本');
  const [selectedItem, setSelectedItem] = useState<ServiceSummary | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filteredItems = useMemo(() => {
    const keyword = searchTerm.trim();
    return serviceSummaries.filter((item) => {
      const matchesSearch =
        !keyword
        || item.name.includes(keyword)
        || item.code.includes(keyword)
        || item.entries.some((entry) => entry.textContent.includes(keyword));
      const matchesTextType = selectedTextType === '全部文本' || item.textTypes.includes(selectedTextType);
      return matchesSearch && matchesTextType;
    });
  }, [searchTerm, selectedTextType]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">诊疗项目目录查询</h2>
          <p className="mt-1 text-sm text-gray-500">已接入真实诊疗项目目录文本，可查询项目内涵、除外内容和政策备注。</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-right sm:grid-cols-3">
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500">项目条目</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">{serviceSummaries.length}</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500">文本记录</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">{serviceDirectory.length}</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm border border-gray-200 col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500">文本类型</p>
            <p className="mt-2 text-xl font-semibold text-gray-900">{textTypes.length - 1}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.5fr_0.7fr]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="搜索项目名称、编码或文本原文"
              className="w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-4 outline-none transition focus:border-cyan-500"
            />
          </div>
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">项目信息</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">文本类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">文本条数</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">来源</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pagedItems.map((item) => (
              <tr key={`${item.code}-${item.name}`} className="hover:bg-slate-50/70">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50">
                      <Stethoscope className="h-5 w-5 text-cyan-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">{item.textTypes.join('、') || '未标注'}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{item.entryCount}</td>
                <td className="px-4 py-4 text-sm text-gray-700 max-w-[360px] truncate">{item.source}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-cyan-700 transition hover:bg-cyan-50"
                    >
                      <Eye className="h-4 w-4" />
                      查看详情
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
          共 {filteredItems.length} 条，当前第 {currentPage} / {totalPages} 页
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
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
            onClick={() => setSelectedItem(null)}
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
                    <h3 className="text-2xl font-semibold text-gray-900">{selectedItem.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{selectedItem.code}</p>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">文本类型</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{selectedItem.textTypes.join('、') || '未标注'}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <BookOpenText className="h-4 w-4" />
                      <span className="text-sm font-medium">来源</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{selectedItem.source}</p>
                  </div>
                </div>
              </div>

              <div className="max-h-[55vh] space-y-4 overflow-y-auto px-6 py-5">
                {selectedItem.entries.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-gray-200 p-4">
                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs text-cyan-700">{entry.textType || '目录文本'}</span>
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
