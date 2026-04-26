import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Calendar, Download, Eye, ChevronRight, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface PolicyDoc {
  id: string;
  title: string;
  docNo: string;
  publishDate: string;
  category: string;
  summary: string;
  views: number;
  cityScope: string;
}

const mockPolicies: PolicyDoc[] = [
  { id: 'ZC001', title: '关于做好2026年度城乡居民基本医疗保险参保缴费工作的通知', docNo: '苏医保发〔2026〕12号', publishDate: '2026-01-15', category: '筹资政策', summary: '明确2026年度城乡居民医保个人缴费标准、财政补助标准及集中参保期安排。', views: 3256, cityScope: '南京、无锡、徐州、常州、苏州、南通、连云港、淮安、盐城、扬州、镇江、泰州、宿迁' },
  { id: 'ZC002', title: '江苏省门诊慢特病待遇保障经办规程', docNo: '苏医保办发〔2026〕5号', publishDate: '2026-02-08', category: '待遇保障', summary: '统一门诊慢特病病种认定、待遇支付比例及经办审核要求。', views: 2810, cityScope: '全省统一' },
  { id: 'ZC003', title: '关于规范异地就医直接结算管理服务的通知', docNo: '苏医保发〔2026〕8号', publishDate: '2026-02-20', category: '异地就医', summary: '进一步规范异地备案、跨省直接结算、转诊转院及费用审核流程。', views: 4120, cityScope: '全省统一' },
  { id: 'ZC004', title: '江苏省双通道药品保障服务管理办法', docNo: '苏医保规〔2026〕3号', publishDate: '2026-03-01', category: '药品保障', summary: '明确双通道药店遴选、处方流转、购药审核和基金结算要求。', views: 2988, cityScope: '全省统一' },
  { id: 'ZC005', title: '关于加强医保基金收支监测预警工作的通知', docNo: '苏医保监函〔2026〕6号', publishDate: '2026-03-12', category: '基金监管', summary: '建立基金收支波动监测、风险预警和分级处置机制。', views: 2650, cityScope: '全省统一' },
  { id: 'ZC006', title: '江苏省医疗服务价格动态调整实施细则', docNo: '苏医保价发〔2026〕4号', publishDate: '2026-03-18', category: '医疗服务价格', summary: '规范医疗服务价格项目调整、成本测算和听证论证流程。', views: 1926, cityScope: '全省统一' },
  { id: 'ZC007', title: '关于推进DRG/DIP支付方式改革提质扩面的通知', docNo: '苏医保发〔2026〕10号', publishDate: '2026-03-25', category: '支付方式改革', summary: '明确DRG/DIP分组管理、病案质量控制和支付结算考核要求。', views: 3568, cityScope: '全省统一' },
  { id: 'ZC008', title: '江苏省长期护理保险失能评估管理办法', docNo: '苏医保规〔2026〕6号', publishDate: '2026-04-02', category: '长期护理保险', summary: '明确失能评估标准、护理服务项目和待遇支付政策。', views: 1880, cityScope: '南京、苏州、南通、泰州试点并逐步推广' },
  { id: 'ZC009', title: '关于规范零售药店医保结算服务行为的通知', docNo: '苏医保函〔2026〕11号', publishDate: '2026-04-06', category: '药品保障', summary: '加强定点零售药店购药结算、处方留存、实名购药和信用评价管理。', views: 2204, cityScope: '全省统一' },
  { id: 'ZC010', title: '江苏省医保经办服务事项清单（2026版）', docNo: '苏医保办发〔2026〕9号', publishDate: '2026-04-10', category: '经办服务', summary: '统一参保登记、信息变更、待遇核定、费用报销等经办服务事项。', views: 4765, cityScope: '全省统一' },
  { id: 'ZC011', title: '关于加强门诊统筹基金支付管理的通知', docNo: '苏医保发〔2026〕13号', publishDate: '2026-04-12', category: '待遇保障', summary: '规范门诊统筹支付范围、年度限额和违规结算追责机制。', views: 2015, cityScope: '全省统一' },
  { id: 'ZC012', title: '江苏省医用耗材目录动态调整工作指引', docNo: '苏医保材发〔2026〕2号', publishDate: '2026-04-15', category: '耗材目录', summary: '规范医用耗材准入、编码映射、价格联动和支付政策衔接。', views: 1673, cityScope: '全省统一' },
];

const categories = ['all', ...Array.from(new Set(mockPolicies.map((policy) => policy.category)))];

export default function PolicyQuery({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<PolicyDoc | null>(null);

  const filteredPolicies = useMemo(
    () =>
      mockPolicies.filter(
        (policy) =>
          [policy.title, policy.docNo, policy.cityScope].some((value) => value.includes(searchTerm)) &&
          (selectedCategory === 'all' || policy.category === selectedCategory),
      ),
    [searchTerm, selectedCategory],
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      筹资政策: 'bg-blue-100 text-blue-700',
      待遇保障: 'bg-green-100 text-green-700',
      基金监管: 'bg-red-100 text-red-700',
      支付方式改革: 'bg-purple-100 text-purple-700',
      异地就医: 'bg-orange-100 text-orange-700',
      药品保障: 'bg-cyan-100 text-cyan-700',
      医疗服务价格: 'bg-pink-100 text-pink-700',
      长期护理保险: 'bg-indigo-100 text-indigo-700',
      经办服务: 'bg-amber-100 text-amber-700',
      耗材目录: 'bg-teal-100 text-teal-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const exportRows = () => {
    const rows = filteredPolicies.map((policy) => ({
      标题: policy.title,
      文号: policy.docNo,
      发布日期: policy.publishDate,
      分类: policy.category,
      浏览量: policy.views,
      适用范围: policy.cityScope,
      摘要: policy.summary,
    }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, '政策查询');
    XLSX.writeFile(workbook, `政策查询结果_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="rounded-full p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">政策查询</h1>
            <p className="text-sm text-gray-500">医保政策文件、经办规程、监管通知查询</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4"
                  placeholder="请输入政策标题、文号或适用范围查询"
                />
              </div>
              <button onClick={exportRows} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-white hover:bg-cyan-700">
                <Download className="h-4 w-4" />
                导出结果
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-600 text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat === 'all' ? '全部' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="text-sm text-gray-500">政策总数</div>
              <div className="mt-2 text-3xl font-bold text-gray-800">{filteredPolicies.length}</div>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="text-sm text-blue-700">待遇保障类</div>
              <div className="mt-2 text-3xl font-bold text-blue-600">{filteredPolicies.filter((item) => item.category === '待遇保障').length}</div>
            </div>
            <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
              <div className="text-sm text-purple-700">支付改革类</div>
              <div className="mt-2 text-3xl font-bold text-purple-600">{filteredPolicies.filter((item) => item.category === '支付方式改革').length}</div>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="text-sm text-amber-700">总浏览量</div>
              <div className="mt-2 text-3xl font-bold text-amber-600">{filteredPolicies.reduce((sum, item) => sum + item.views, 0)}</div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredPolicies.map((policy) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
                onClick={() => setSelectedDoc(policy)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(policy.category)}`}>{policy.category}</span>
                      <span className="text-sm text-gray-500">{policy.docNo}</span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{policy.title}</h3>
                    <p className="text-sm text-gray-600">{policy.summary}</p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {policy.publishDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {policy.views} 次浏览
                      </span>
                      <span>{policy.cityScope}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedDoc(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(selectedDoc.category)}`}>{selectedDoc.category}</span>
                    <h3 className="mt-2 text-xl font-bold text-gray-800">{selectedDoc.title}</h3>
                  </div>
                  <button onClick={() => setSelectedDoc(null)} className="rounded-full p-2 hover:bg-gray-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="max-h-[55vh] overflow-y-auto p-6">
                <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>文号：{selectedDoc.docNo}</span>
                  <span>发布日期：{selectedDoc.publishDate}</span>
                  <span>适用范围：{selectedDoc.cityScope}</span>
                </div>
                <div className="space-y-4 text-sm leading-7 text-gray-700">
                  <p>{selectedDoc.summary}</p>
                  <p>为进一步规范全省医保经办与基金使用管理，统一业务口径，提升参保群众办事体验，结合江苏省13个设区市实际运行情况，对政策执行、经办审核、待遇保障、支付结算和监管协同提出明确要求。</p>
                  <p>重点包括：统一业务受理标准，明确待遇支付边界，规范异地就医和双通道药品结算流程，强化违规结算追溯与基金追回机制，完善信用评价和风险预警联动。</p>
                  <p>各设区市医保局、医保中心、定点医疗机构、定点零售药店应结合本地实际抓好贯彻落实，确保经办留痕完整、支付规则一致、监管数据可追溯。</p>
                </div>
              </div>
              <div className="flex justify-end gap-4 border-t border-gray-200 p-6">
                <button onClick={() => setSelectedDoc(null)} className="rounded-xl border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50">
                  关闭
                </button>
                <button onClick={exportRows} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-white hover:bg-cyan-700">
                  <Download className="h-4 w-4" />
                  导出列表
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
