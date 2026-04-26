import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calculator, History, CheckCircle, X, User, Building2, Percent, TrendingUp } from 'lucide-react';

interface PersonInfo {
  name: string;
  idCard: string;
  workUnit: string;
  currentBase: number;
}

interface BaseHistory {
  year: string;
  baseAmount: number;
  companyRate: number;
  personalRate: number;
  status: string;
}

export default function PaymentCalc({ onClose, onBack }: { onClose?: () => void; onBack?: () => void }) {
  const handleClose = onClose || onBack || (() => {});
  const [searchTerm, setSearchTerm] = useState('');
  const [personInfo, setPersonInfo] = useState<PersonInfo | null>(null);
  const [salaryInput, setSalaryInput] = useState('');
  const [calculatedBase, setCalculatedBase] = useState(0);
  const [companyRate, setCompanyRate] = useState(8);
  const [personalRate, setPersonalRate] = useState(2);
  const [showHistory, setShowHistory] = useState(false);

  const historyData: BaseHistory[] = [
    { year: '2023', baseAmount: 6500, companyRate: 8, personalRate: 2, status: '已核定' },
    { year: '2022', baseAmount: 6000, companyRate: 8, personalRate: 2, status: '已核定' },
  ];

  const handleSearch = () => {
    if (searchTerm) {
      setPersonInfo({
        name: '张三',
        idCard: '320101199001011234',
        workUnit: '南京科技有限公司',
        currentBase: 8000
      });
    }
  };

  const calculateBase = () => {
    const salary = parseFloat(salaryInput) || 0;
    const minBase = 4494;
    const maxBase = 24042;
    const base = Math.max(minBase, Math.min(maxBase, salary));
    setCalculatedBase(base);
  };

  const companyPay = calculatedBase * (companyRate / 100);
  const personalPay = calculatedBase * (personalRate / 100);
  const totalPay = companyPay + personalPay;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">缴费基数核定</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 人员查询 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" />人员信息查询
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="输入姓名或身份证号"
              />
              <button onClick={handleSearch} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
                查询
              </button>
            </div>
            {personInfo && (
              <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                <div><span className="text-gray-500">姓名:</span> {personInfo.name}</div>
                <div><span className="text-gray-500">身份证号:</span> {personInfo.idCard}</div>
                <div><span className="text-gray-500">单位:</span> {personInfo.workUnit}</div>
                <div><span className="text-gray-500">当前基数:</span> {personInfo.currentBase}元</div>
              </div>
            )}
          </div>

          {personInfo && (
            <>
              {/* 基数计算 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />缴费基数计算
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">上年度月平均工资</label>
                    <input
                      type="number"
                      value={salaryInput}
                      onChange={(e) => setSalaryInput(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="输入工资"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">核定基数</label>
                    <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 font-medium">
                      {calculatedBase > 0 ? calculatedBase : '待计算'} 元
                    </div>
                  </div>
                  <div>
                    <button onClick={calculateBase} className="w-full py-2 bg-blue-600 text-white rounded-lg mt-6">
                      计算基数
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">基数范围: 4494元 - 24042元</p>
              </div>

              {/* 缴费比例 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Percent className="w-4 h-4" />缴费比例选择
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">单位缴纳比例</label>
                    <select
                      value={companyRate}
                      onChange={(e) => setCompanyRate(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value={8}>8%</option>
                      <option value={7}>7%</option>
                      <option value={6}>6%</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">个人缴纳比例</label>
                    <select
                      value={personalRate}
                      onChange={(e) => setPersonalRate(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value={2}>2%</option>
                      <option value={1}>1%</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 历史记录 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <History className="w-4 h-4" />基数调整历史
                  </h4>
                  <button onClick={() => setShowHistory(!showHistory)} className="text-sm text-blue-600">
                    {showHistory ? '收起' : '展开'}
                  </button>
                </div>
                {showHistory && (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr><th className="px-3 py-2 text-left">年度</th><th className="px-3 py-2 text-left">基数</th><th className="px-3 py-2 text-left">单位比例</th><th className="px-3 py-2 text-left">个人比例</th><th className="px-3 py-2 text-left">状态</th></tr>
                    </thead>
                    <tbody>
                      {historyData.map((h, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-3 py-2">{h.year}</td>
                          <td className="px-3 py-2">{h.baseAmount}元</td>
                          <td className="px-3 py-2">{h.companyRate}%</td>
                          <td className="px-3 py-2">{h.personalRate}%</td>
                          <td className="px-3 py-2"><span className="text-green-600">{h.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* 核定结果 */}
              {calculatedBase > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <h4 className="font-medium text-emerald-800 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />核定结果预览
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-gray-500">单位应缴</div>
                      <div className="text-xl font-bold text-emerald-600">{companyPay.toFixed(2)}元</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-gray-500">个人应缴</div>
                      <div className="text-xl font-bold text-blue-600">{personalPay.toFixed(2)}元</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-gray-500">合计应缴</div>
                      <div className="text-xl font-bold text-purple-600">{totalPay.toFixed(2)}元</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />确认核定
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
