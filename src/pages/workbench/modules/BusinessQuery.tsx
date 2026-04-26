import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, ArrowLeft, Users, Clock, FileText, Wallet,
  ChevronRight, TrendingUp, TrendingDown, Calendar
} from 'lucide-react';

interface QueryResult {
  id: string;
  type: string;
  title: string;
  date: string;
  amount?: number;
  status: string;
}

export default function BusinessQuery({ onBack }: { onBack: () => void }) {
  const [queryType, setQueryType] = useState('enrollment');
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const queryTypes = [
    { id: 'enrollment', label: '参保信息', icon: Users },
    { id: 'payment', label: '缴费记录', icon: Clock },
    { id: 'reimbursement', label: '报销记录', icon: FileText },
    { id: 'account', label: '账户余额', icon: Wallet },
  ];

  const mockResults: QueryResult[] = [
    { id: '1', type: 'enrollment', title: '城乡居民参保登记', date: '2024-01-15', status: '正常参保' },
    { id: '2', type: 'payment', title: '2024年度缴费', date: '2024-01-15', amount: 580, status: '已缴费' },
    { id: '3', type: 'reimbursement', title: '门诊费用报销', date: '2024-01-10', amount: 368.5, status: '已报销' },
    { id: '4', type: 'payment', title: '2023年度缴费', date: '2023-01-15', amount: 580, status: '已缴费' },
  ];

  const handleSearch = () => {
    setHasSearched(true);
  };

  const filteredResults = mockResults.filter(r => r.type === queryType);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">业务查询</h1>
            <p className="text-sm text-gray-500">综合业务信息查询</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* 查询类型选择 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">选择查询类型</h3>
          <div className="grid grid-cols-4 gap-4">
            {queryTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => { setQueryType(type.id); setHasSearched(false); }}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  queryType === type.id
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <type.icon className={`w-6 h-6 mx-auto mb-2 ${queryType === type.id ? 'text-cyan-600' : 'text-gray-400'}`} />
                <div className={`font-medium ${queryType === type.id ? 'text-cyan-700' : 'text-gray-700'}`}>{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 查询条件 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl"
                placeholder="请输入身份证号或姓名查询"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700"
            >
              查询
            </button>
          </div>
        </div>

        {/* 查询结果 */}
        {hasSearched && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {queryType === 'account' ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-6">个人账户信息</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-cyan-50 rounded-xl p-6">
                    <div className="text-sm text-gray-500 mb-2">账户余额</div>
                    <div className="text-3xl font-bold text-cyan-600">¥3,680.50</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="text-sm text-gray-500 mb-2">本年划入</div>
                    <div className="text-3xl font-bold text-gray-700">¥2,400.00</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="text-sm text-gray-500 mb-2">本年支出</div>
                    <div className="text-3xl font-bold text-gray-700">¥1,256.50</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">查询结果</h3>
                  <p className="text-sm text-gray-500 mt-1">共找到 {filteredResults.length} 条记录</p>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">业务类型</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">业务内容</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">办理日期</th>
                      {queryType !== 'enrollment' && <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">金额</th>}
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((result) => (
                      <tr key={result.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            result.type === 'enrollment' ? 'bg-blue-100 text-blue-700' :
                            result.type === 'payment' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-violet-100 text-violet-700'
                          }`}>
                            {queryTypes.find(t => t.id === result.type)?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">{result.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{result.date}</td>
                        {queryType !== 'enrollment' && (
                          <td className="px-6 py-4 text-sm font-medium text-cyan-600">
                            {result.amount ? `¥${result.amount.toFixed(2)}` : '-'}
                          </td>
                        )}
                        <td className="px-6 py-4 text-sm text-gray-600">{result.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
