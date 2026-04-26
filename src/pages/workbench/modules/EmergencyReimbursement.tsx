import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, Ambulance, FileText, CheckCircle, X } from 'lucide-react';

export default function EmergencyReimbursement({ onClose, onBack }: { onClose?: () => void; onBack?: () => void }) {
  const handleClose = onClose || onBack || (() => {});
  const [step, setStep] = useState(1);
  const [emergencyType, setEmergencyType] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  const emergencyTypes = ['心梗抢救', '脑卒中', '外伤急救', '中毒抢救', '其他急诊'];

  const calculateReimburse = () => {
    return totalAmount * 0.85;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b flex items-center justify-between bg-red-50">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-bold text-gray-800">急诊报销</h3>
            <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">24小时</span>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* 步骤指示 */}
          <div className="flex items-center gap-2">
            {['急诊信息', '费用明细', '确认提交'].map((s, i) => (
              <div key={i} className={`flex-1 py-2 text-center rounded-lg text-sm ${step === i + 1 ? 'bg-red-100 text-red-700 font-medium' : 'bg-gray-100 text-gray-500'}`}>{s}</div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">急诊抢救时间：系统自动记录</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">参保人姓名 *</label><input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入姓名" /></div>
                <div><label className="block text-sm font-medium mb-1">身份证号 *</label><input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入身份证号" /></div>
                <div><label className="block text-sm font-medium mb-1">急诊医院 *</label><input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入急诊医院" /></div>
                <div><label className="block text-sm font-medium mb-1">急诊类型 *</label>
                  <select value={emergencyType} onChange={(e) => setEmergencyType(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                    <option value="">请选择</option>
                    {emergencyTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">抢救开始时间 *</label><input type="datetime-local" className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">抢救结束时间</label><input type="datetime-local" className="w-full px-3 py-2 border rounded-lg" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">转诊信息</label><input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="如从其他医院转诊，请填写" /></div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">急诊总费用 *</label><input type="number" value={totalAmount} onChange={(e) => setTotalAmount(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" placeholder="请输入总费用" /></div>
                <div><label className="block text-sm font-medium mb-1">抢救费</label><input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入抢救费" /></div>
                <div><label className="block text-sm font-medium mb-1">检查费</label><input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入检查费" /></div>
                <div><label className="block text-sm font-medium mb-1">药品费</label><input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入药品费" /></div>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">预计报销金额（85%）</span>
                  <span className="text-2xl font-bold text-red-600">¥{calculateReimburse().toFixed(2)}</span>
                </div>
              </div>
              <div><label className="block text-sm font-medium mb-1">上传急诊病历</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">上传急诊病历、抢救记录等</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between"><span className="text-gray-600">急诊类型</span><span className="font-medium">{emergencyType || '心梗抢救'}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">总费用</span><span className="font-medium">¥{totalAmount || 5000}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">报销金额</span><span className="font-bold text-red-600">¥{calculateReimburse().toFixed(2) || 4250}</span></div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800">急诊报销优先处理，预计1-3个工作日到账</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-between">
          <button onClick={handleClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
          <div className="flex gap-3">
            {step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 border rounded-lg">上一步</button>}
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} className="px-4 py-2 bg-red-600 text-white rounded-lg">下一步</button>
            ) : (
              <button onClick={handleClose} className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2"><CheckCircle className="w-4 h-4" />提交申请</button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
