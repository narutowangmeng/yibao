import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Baby, Calendar, DollarSign, FileText, CheckCircle, X } from 'lucide-react';

export default function MaternityReimbursement({ onClose, onBack }: { onClose?: () => void; onBack?: () => void }) {
  const handleClose = onClose || onBack || (() => {});
  const [maternityType, setMaternityType] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [leaveDays, setLeaveDays] = useState(98);
  const [medicalFee, setMedicalFee] = useState(0);
  const [baseSalary, setBaseSalary] = useState(8000);

  const calculateAllowance = () => {
    return (baseSalary / 30) * leaveDays;
  };

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
            <Baby className="w-6 h-6 text-pink-600" />
            生育报销
          </h3>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 生育类型 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-700 mb-3">生育类型</h4>
            <div className="grid grid-cols-3 gap-3">
              {['顺产', '剖宫产', '流产'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setMaternityType(type);
                    setLeaveDays(type === '顺产' ? 98 : type === '剖宫产' ? 128 : 15);
                  }}
                  className={`p-3 border rounded-lg text-center ${maternityType === type ? 'border-pink-500 bg-pink-50 text-pink-700' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 生育登记 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />生育登记信息
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">生育服务证号</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入证号" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">分娩日期</label>
                <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">胎儿数量</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>单胎</option>
                  <option>双胞胎</option>
                  <option>多胞胎</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">医院名称</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入医院" />
              </div>
            </div>
          </div>

          {/* 医疗费用 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />生育医疗费用
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">产检费用</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">分娩费用</label>
                <input type="number" value={medicalFee} onChange={(e) => setMedicalFee(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">住院费用</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="0.00" />
              </div>
            </div>
          </div>

          {/* 生育津贴 */}
          <div className="bg-pink-50 rounded-xl p-4">
            <h4 className="font-medium text-pink-800 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />生育津贴计算
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">缴费基数</label>
                <input type="number" value={baseSalary} onChange={(e) => setBaseSalary(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">产假天数</label>
                <input type="number" value={leaveDays} onChange={(e) => setLeaveDays(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">预计津贴</label>
                <div className="px-3 py-2 bg-pink-100 border border-pink-200 rounded-lg text-pink-700 font-medium">
                  ¥{calculateAllowance().toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={handleClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
          <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />提交申请
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
