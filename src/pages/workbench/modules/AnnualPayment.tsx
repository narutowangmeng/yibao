import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Calculator, FileText, CheckCircle, ChevronRight, X, Download, Printer } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  idCard: string;
  insuranceType: string;
  baseAmount: number;
  months: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'partial';
}

export default function AnnualPayment({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {
  const handleClose = onBack || onClose || (() => {});
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedPersons, setSelectedPersons] = useState<string[]>([]);
  const [showDetail, setShowDetail] = useState(false);

  const persons: Person[] = [
    { id: '1', name: '张三', idCard: '320101199001011234', insuranceType: '城镇职工', baseAmount: 8000, months: 12, totalAmount: 11520, status: 'pending' },
    { id: '2', name: '李四', idCard: '320101198505056789', insuranceType: '城乡居民', baseAmount: 5000, months: 12, totalAmount: 3600, status: 'paid' },
    { id: '3', name: '王五', idCard: '320101199212123456', insuranceType: '灵活就业', baseAmount: 6000, months: 10, totalAmount: 7200, status: 'partial' },
  ];

  const summary = {
    totalPersons: persons.length,
    totalAmount: persons.reduce((sum, p) => sum + p.totalAmount, 0),
    paidAmount: persons.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.totalAmount, 0),
    pendingAmount: persons.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.totalAmount, 0),
  };

  const toggleSelect = (id: string) => {
    setSelectedPersons(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    setSelectedPersons(selectedPersons.length === persons.length ? [] : persons.map(p => p.id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">年度正常缴费</h1>
              <p className="text-sm text-gray-500">正常年度缴费核定与批量处理</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />导出
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Printer className="w-4 h-4" />打印
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span className="font-medium text-gray-700">缴费年度</span>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="px-4 py-2 border rounded-lg">
                <option>2024</option><option>2023</option><option>2022</option>
              </select>
            </div>
            <button onClick={() => setShowDetail(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              <Calculator className="w-4 h-4" />批量计算
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500">参保人数</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">{summary.totalPersons}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500">应缴总额</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">¥{summary.totalAmount.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500">已缴金额</div>
            <div className="text-2xl font-bold text-green-600 mt-1">¥{summary.paidAmount.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500">待缴金额</div>
            <div className="text-2xl font-bold text-orange-600 mt-1">¥{summary.pendingAmount.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5" />参保人员列表
            </h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={selectedPersons.length === persons.length} onChange={selectAll} />
                全选 ({selectedPersons.length})
              </label>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" checked={selectedPersons.length === persons.length} onChange={selectAll} /></th>
                <th className="px-4 py-3 text-left text-sm font-medium">姓名</th>
                <th className="px-4 py-3 text-left text-sm font-medium">身份证号</th>
                <th className="px-4 py-3 text-left text-sm font-medium">参保类型</th>
                <th className="px-4 py-3 text-left text-sm font-medium">缴费基数</th>
                <th className="px-4 py-3 text-left text-sm font-medium">缴费月数</th>
                <th className="px-4 py-3 text-left text-sm font-medium">应缴金额</th>
                <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {persons.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><input type="checkbox" checked={selectedPersons.includes(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{p.idCard}</td>
                  <td className="px-4 py-3">{p.insuranceType}</td>
                  <td className="px-4 py-3">¥{p.baseAmount}</td>
                  <td className="px-4 py-3">{p.months}个月</td>
                  <td className="px-4 py-3 font-medium text-emerald-600">¥{p.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'paid' ? 'bg-green-100 text-green-700' : p.status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                      {p.status === 'paid' ? '已缴清' : p.status === 'partial' ? '部分缴纳' : '待缴费'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetail && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetail(false)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2"><Calculator className="w-5 h-5" />年度缴费计算</h3>
              <button onClick={() => setShowDetail(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-500">计算年度</div><div className="text-lg font-bold">{selectedYear}年</div></div>
                <div className="bg-gray-50 p-4 rounded-lg"><div className="text-sm text-gray-500">选中人数</div><div className="text-lg font-bold">{selectedPersons.length}人</div></div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between mb-2"><span>缴费基数合计</span><span className="font-medium">¥{persons.filter(p => selectedPersons.includes(p.id)).reduce((s, p) => s + p.baseAmount, 0).toLocaleString()}</span></div>
                <div className="flex justify-between mb-2"><span>缴费月数合计</span><span className="font-medium">{persons.filter(p => selectedPersons.includes(p.id)).reduce((s, p) => s + p.months, 0)}个月</span></div>
                <div className="flex justify-between pt-2 border-t"><span className="font-bold">应缴总额</span><span className="font-bold text-emerald-600 text-xl">¥{persons.filter(p => selectedPersons.includes(p.id)).reduce((s, p) => s + p.totalAmount, 0).toLocaleString()}</span></div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setShowDetail(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"><CheckCircle className="w-4 h-4" />确认生成</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
