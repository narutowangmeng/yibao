import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Upload, Calculator, CheckCircle, X, FileText } from 'lucide-react';

export default function OutpatientReimbursement({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', idCard: '', phone: '',
    hospital: '', department: '', doctor: '', visitDate: '',
    totalAmount: 0, selfPay: 0, reimburseAmount: 0
  });

  const calculateReimburse = () => {
    const reimburse = (formData.totalAmount - formData.selfPay) * 0.7;
    setFormData({ ...formData, reimburseAmount: Math.max(0, reimburse) });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2"><Stethoscope className="w-5 h-5 text-blue-600" />门诊报销</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-6">
          {step === 1 && (
            <>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium mb-3">就诊信息</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input className="px-3 py-2 border rounded-lg" placeholder="姓名" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input className="px-3 py-2 border rounded-lg" placeholder="身份证号" value={formData.idCard} onChange={e => setFormData({...formData, idCard: e.target.value})} />
                  <input className="px-3 py-2 border rounded-lg" placeholder="就诊医院" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} />
                  <input className="px-3 py-2 border rounded-lg" placeholder="就诊科室" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                  <input className="px-3 py-2 border rounded-lg" placeholder="主治医生" value={formData.doctor} onChange={e => setFormData({...formData, doctor: e.target.value})} />
                  <input type="date" className="px-3 py-2 border rounded-lg" value={formData.visitDate} onChange={e => setFormData({...formData, visitDate: e.target.value})} />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2"><FileText className="w-4 h-4" />费用明细</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" className="px-3 py-2 border rounded-lg" placeholder="总费用" value={formData.totalAmount || ''} onChange={e => setFormData({...formData, totalAmount: Number(e.target.value)})} />
                  <input type="number" className="px-3 py-2 border rounded-lg" placeholder="自费金额" value={formData.selfPay || ''} onChange={e => setFormData({...formData, selfPay: Number(e.target.value)})} />
                </div>
                <button onClick={calculateReimburse} className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"><Calculator className="w-4 h-4" />计算报销</button>
                {formData.reimburseAmount > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-600">报销金额：</span>
                    <span className="text-xl font-bold text-blue-600">¥{formData.reimburseAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium mb-3">医保结算单上传</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">点击上传结算单</p>
                </div>
              </div>
            </>
          )}
          {step === 2 && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <h4 className="text-xl font-bold mb-2">提交成功</h4>
              <p className="text-gray-500">报销申请已提交，预计3-5个工作日到账</p>
            </div>
          )}
        </div>
        <div className="p-6 border-t flex justify-end gap-3">
          {step === 1 ? (
            <><button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
            <button onClick={() => setStep(2)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">提交申请</button></>
          ) : (
            <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg">完成</button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
