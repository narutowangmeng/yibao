import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Shield, Upload, CheckCircle, User, FileText, Calendar } from 'lucide-react';

interface ExemptionApplyProps {
  onClose?: () => void;
  onBack?: () => void;
}

export default function ExemptionApply({ onClose, onBack }: ExemptionApplyProps) {
  const handleClose = onClose || onBack || (() => {});
  const [step, setStep] = useState(1);
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setVerified(true);
    setStep(2);
  };

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
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-pink-600" />
            <h3 className="text-xl font-bold text-gray-800">免缴认定</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* 步骤指示 */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${step >= 1 ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-500'}`}>
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">身份核验</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${step >= 2 ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-500'}`}>
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">免缴申请</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${step >= 3 ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-500'}`}>
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">资格确认</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                <p className="text-pink-800 text-sm">请输入参保人信息进行身份核验，系统将自动查询低保/特困/残疾等身份</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">姓名 <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入姓名" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">身份证号 <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入身份证号" />
                </div>
              </div>
              <button onClick={handleVerify} className="w-full py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 font-medium">
                核验身份
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">免缴类型 <span className="text-red-500">*</span></label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>请选择</option>
                    <option>低保对象免缴</option>
                    <option>特困人员免缴</option>
                    <option>重度残疾免缴</option>
                    <option>建档立卡免缴</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">免缴期限 <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <input type="date" className="flex-1 px-3 py-2 border rounded-lg" />
                    <span className="py-2 text-gray-500">至</span>
                    <input type="date" className="flex-1 px-3 py-2 border rounded-lg" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">证明材料 <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">低保证/特困证</p>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">残疾证</p>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500">其他证明</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50">上一步</button>
                <button onClick={() => setStep(3)} className="flex-1 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700">下一步</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between"><span className="text-gray-600">姓名</span><span className="font-medium">张三</span></div>
                <div className="flex justify-between"><span className="text-gray-600">身份证号</span><span className="font-medium">320101199001011234</span></div>
                <div className="flex justify-between"><span className="text-gray-600">免缴类型</span><span className="font-medium">低保对象免缴</span></div>
                <div className="flex justify-between"><span className="text-gray-600">免缴期限</span><span className="font-medium">2024-01-01 至 2024-12-31</span></div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-800 text-sm">请核对以上信息，确认无误后提交免缴认定申请</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50">上一步</button>
                <button onClick={onClose} className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700">确认提交</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
