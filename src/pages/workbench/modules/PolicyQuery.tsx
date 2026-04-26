import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, ArrowLeft, Search, Calendar, Download, Eye, ChevronRight
} from 'lucide-react';

interface PolicyDoc {
  id: string;
  title: string;
  docNo: string;
  publishDate: string;
  category: string;
  summary: string;
  views: number;
}

export default function PolicyQuery({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<PolicyDoc | null>(null);

  const mockPolicies: PolicyDoc[] = [
    {
      id: '1',
      title: '关于调整城乡居民基本医疗保险筹资标准的通知',
      docNo: '医保发〔2024〕1号',
      publishDate: '2024-01-15',
      category: '筹资政策',
      summary: '根据经济社会发展水平和医疗费用增长情况，调整2024年度城乡居民基本医疗保险筹资标准...',
      views: 1256
    },
    {
      id: '2',
      title: '门诊慢性病特殊病管理办法',
      docNo: '医保发〔2023〕15号',
      publishDate: '2023-12-01',
      category: '待遇政策',
      summary: '为进一步完善门诊慢性病特殊病保障机制，规范管理服务，制定本办法...',
      views: 2341
    },
    {
      id: '3',
      title: '医保基金使用监督管理条例',
      docNo: '国务院令第735号',
      publishDate: '2023-10-01',
      category: '基金监管',
      summary: '为了加强医疗保障基金使用监督管理，保障基金安全，促进基金有效使用...',
      views: 3420
    },
    {
      id: '4',
      title: '关于推进医保支付方式改革的指导意见',
      docNo: '医保发〔2023〕8号',
      publishDate: '2023-08-15',
      category: '支付方式',
      summary: '为深化医药卫生体制改革，推进医保支付方式改革，提高医保基金使用效率...',
      views: 1890
    },
    {
      id: '5',
      title: '异地就医直接结算管理办法',
      docNo: '医保发〔2023〕5号',
      publishDate: '2023-06-20',
      category: '异地就医',
      summary: '为规范异地就医直接结算管理，方便参保人员异地就医，制定本办法...',
      views: 4567
    },
  ];

  const categories = ['all', '筹资政策', '待遇政策', '基金监管', '支付方式', '异地就医'];

  const filteredPolicies = mockPolicies.filter(policy =>
    (policy.title.includes(searchTerm) || policy.docNo.includes(searchTerm)) &&
    (selectedCategory === 'all' || policy.category === selectedCategory)
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '筹资政策': 'bg-blue-100 text-blue-700',
      '待遇政策': 'bg-green-100 text-green-700',
      '基金监管': 'bg-red-100 text-red-700',
      '支付方式': 'bg-purple-100 text-purple-700',
      '异地就医': 'bg-orange-100 text-orange-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">政策查询</h1>
            <p className="text-sm text-gray-500">医保政策文件查询</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 搜索栏 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl"
                placeholder="搜索政策标题或文号"
              />
            </div>
          </div>

          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {cat === 'all' ? '全部' : cat}
              </button>
            ))}
          </div>

          {/* 政策列表 */}
          <div className="space-y-4">
            {filteredPolicies.map((policy) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedDoc(policy)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(policy.category)}`}>
                        {policy.category}
                      </span>
                      <span className="text-sm text-gray-500">{policy.docNo}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{policy.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{policy.summary}</p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {policy.publishDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {policy.views} 次浏览
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 详情弹窗 */}
      {selectedDoc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedDoc(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedDoc.category)}`}>
                    {selectedDoc.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mt-2">{selectedDoc.title}</h3>
                </div>
                <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>文号：{selectedDoc.docNo}</span>
                  <span>发布日期：{selectedDoc.publishDate}</span>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{selectedDoc.summary}</p>
                  <p className="text-gray-700 mt-4">
                    为贯彻落实党中央、国务院关于医疗保障工作的决策部署，进一步完善医疗保障制度，
                    根据《中华人民共和国社会保险法》等法律法规，结合工作实际，制定本政策。
                  </p>
                  <h4 className="font-semibold text-gray-800 mt-6">一、适用范围</h4>
                  <p className="text-gray-700">本政策适用于本市行政区域内参加基本医疗保险的用人单位和个人。</p>
                  <h4 className="font-semibold text-gray-800 mt-6">二、主要内容</h4>
                  <p className="text-gray-700">（一）明确筹资标准和待遇水平；</p>
                  <p className="text-gray-700">（二）规范基金使用管理；</p>
                  <p className="text-gray-700">（三）加强监督管理。</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                关闭
              </button>
              <button className="px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                下载文件
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
