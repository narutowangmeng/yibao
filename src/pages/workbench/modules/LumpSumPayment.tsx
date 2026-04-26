import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, FileText, CheckCircle, AlertCircle, Coins } from 'lucide-react';

export default function LumpSumPayment({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {
  const handleClose = onClose || onBack || (() => {});
  const [lumpSumType, setLumpSumType] = useState('retirement');
  const [years, setYears] = useState(5);
  const [agreed, setAgreed] = useState(false);

  const calculateAmount = () => {
    const baseAmount = 5000;
    return baseAmount * years * 12;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            ←
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">趸缴核定</h1>
            <p className="text-sm text-gray-500">一次性缴清剩余年限</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Coins className="w-5 h-5 text-purple-600" />
            趸缴类型
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setLumpSumType('retirement')}
              className={`p-4 border rounded-xl text-left ${lumpSumType === 'retirement' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
            >
              <div className="font-medium">退休趸缴</div>
              <div className="text-sm text-gray-500">达到退休年龄时一次性缴清</div>
            </button>
            <button
              onClick={() => setLumpSumType('supplement')}
              className={`p-4 border rounded-xl text-left ${lumpSumType === 'supplement' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
            >
              <div className="font-medium">一次性补缴</div>
              <div className="text-sm text-gray-500">提前缴清剩余年限</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            年限与金额计算
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">剩余年限</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">月缴费基数</label>
              <input type="number" defaultValue={5000} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">趸缴总金额</span>
              <span className="text-2xl font-bold text-purple-600">¥{calculateAmount().toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl border border-green-200 p-4 mb-6">
          <h4 className="font-medium text-green-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            优惠政策
          </h4>
          <ul className="text-sm text-green-700 mt-2 space-y-1">
            <li>• 趸缴可享受2%费率优惠</li>
            <li>• 一次性缴清免滞纳金</li>
            <li>• 优先办理退休手续</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            趸缴协议
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 mb-4">
            本人自愿申请一次性趸缴医疗保险费，承诺所提供信息真实有效...
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span className="text-sm">我已阅读并同意趸缴协议</span>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onBack} className="px-6 py-2 border rounded-lg">取消</button>
          <button disabled={!agreed} className="px-6 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50">
            确认趸缴
          </button>
        </div>
      </div>
    </div>
  );
}
