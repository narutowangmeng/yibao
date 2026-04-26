import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Search, Calculator, CheckCircle, X } from 'lucide-react';

const diseases = [
  { id: '1', name: '高血压', limit: 3000 },
  { id: '2', name: '糖尿病', limit: 4000 },
  { id: '3', name: '冠心病', limit: 5000 },
  { id: '4', name: '慢性肾病', limit: 6000 },
];

export default function SpecialOutpatient({ onClose }: { onClose?: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisease, setSelectedDisease] = useState('');
  const [amount, setAmount] = useState('');
  const [showResult, setShowResult] = useState(false);

  const disease = diseases.find(d => d.id === selectedDisease);
  const reimburseAmount = disease && amount ? Math.min(parseFloat(amount) * 0.7, disease.limit) : 0;

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Pill className="w-6 h-6 text-purple-600" />特殊门诊报销
          </h3>
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
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">查询</button>
            </div>
          </div>

          {/* 慢病病种 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-700 mb-3">慢病病种选择</h4>
            <div className="grid grid-cols-2 gap-3">
              {diseases.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDisease(d.id)}
                  className={`p-3 border rounded-lg text-left ${selectedDisease === d.id ? 'border-purple-500 bg-purple-50' : ''}`}
                >
                  <div className="font-medium">{d.name}</div>
                  <div className="text-sm text-gray-500">年度限额 ¥{d.limit}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 费用录入 */}
          {selectedDisease && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" />费用明细
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">本次费用金额</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="输入金额"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">就诊日期</label>
                  <input type="date" className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <button
                onClick={() => setShowResult(true)}
                className="mt-4 w-full py-2 bg-purple-600 text-white rounded-lg"
              >
                计算报销金额
              </button>
            </div>
          )}

          {/* 计算结果 */}
          {showResult && selectedDisease && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h4 className="font-medium text-purple-800 mb-3">报销计算结果</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-500">本次费用</div>
                  <div className="text-xl font-bold">¥{amount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">报销比例</div>
                  <div className="text-xl font-bold text-purple-600">70%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">可报销</div>
                  <div className="text-xl font-bold text-green-600">¥{reimburseAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />提交申请
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
