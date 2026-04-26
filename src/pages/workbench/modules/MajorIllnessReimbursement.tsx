import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Search, Calculator, CheckCircle, X, FileText } from 'lucide-react';

const diseases = [
  '恶性肿瘤', '急性心肌梗死', '脑卒中', '重大器官移植', '终末期肾病',
  '白血病', '重性精神疾病', '先天性心脏病', '风湿性心脏病'
];

export default function MajorIllnessReimbursement({ onClose, onBack }: { onClose?: () => void; onBack?: () => void }) {
  const handleClose = onClose || onBack || (() => {});
  const [searchTerm, setSearchTerm] = useState('');
  const [personInfo, setPersonInfo] = useState<any>(null);
  const [selectedDisease, setSelectedDisease] = useState('');
  const [annualTotal, setAnnualTotal] = useState(80000);
  const [showResult, setShowResult] = useState(false);

  const handleSearch = () => {
    if (searchTerm) {
      setPersonInfo({
        name: '张三',
        idCard: '320101199001011234',
        insuranceType: '城镇职工',
        annualPaid: 25000
      });
    }
  };

  const calculateReimbursement = () => {
    setShowResult(true);
  };

  const selfPay = annualTotal - (personInfo?.annualPaid || 0);
  const threshold = 20000;
  const eligibleAmount = Math.max(0, selfPay - threshold);
  const reimburseRate = 0.6;
  const reimburseAmount = eligibleAmount * reimburseRate;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-rose-600" />大病报销
          </h3>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" />人员查询
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="输入姓名或身份证号"
              />
              <button onClick={handleSearch} className="px-4 py-2 bg-rose-600 text-white rounded-lg">
                查询
              </button>
            </div>
            {personInfo && (
              <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                <div><span className="text-gray-500">姓名:</span> {personInfo.name}</div>
                <div><span className="text-gray-500">身份证号:</span> {personInfo.idCard}</div>
                <div><span className="text-gray-500">参保类型:</span> {personInfo.insuranceType}</div>
                <div><span className="text-gray-500">本年已报:</span> {personInfo.annualPaid}元</div>
              </div>
            )}
          </div>

          {personInfo && (
            <>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-700 mb-3">大病病种选择</h4>
                <div className="grid grid-cols-3 gap-3">
                  {diseases.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDisease(d)}
                      className={`p-3 border rounded-lg text-sm ${selectedDisease === d ? 'border-rose-500 bg-rose-50' : ''}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />费用计算
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">年度累计总费用</label>
                    <input
                      type="number"
                      value={annualTotal}
                      onChange={(e) => setAnnualTotal(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">已报销金额</label>
                    <input
                      type="number"
                      value={personInfo.annualPaid}
                      readOnly
                      className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                    />
                  </div>
                </div>
                <button
                  onClick={calculateReimbursement}
                  disabled={!selectedDisease}
                  className="w-full mt-4 py-2 bg-rose-600 text-white rounded-lg disabled:opacity-50"
                >
                  计算大病报销
                </button>
              </div>

              {showResult && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                  <h4 className="font-medium text-rose-800 mb-3">大病报销计算结果</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-gray-500">个人自付</div>
                      <div className="text-lg font-bold">{selfPay}元</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-gray-500">大病起付线</div>
                      <div className="text-lg font-bold">{threshold}元</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-gray-500">可报金额</div>
                      <div className="text-lg font-bold text-rose-600">{eligibleAmount}元</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-gray-500">报销金额(60%)</div>
                      <div className="text-lg font-bold text-rose-600">{reimburseAmount.toFixed(2)}元</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={handleClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
          <button className="px-4 py-2 bg-rose-600 text-white rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />提交申请
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
