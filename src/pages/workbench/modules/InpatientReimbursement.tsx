import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar, FileText, Calculator, CheckCircle, X } from 'lucide-react';

export default function InpatientReimbursement({ onClose, onBack }: { onClose?: () => void; onBack?: () => void }) {
  const handleClose = onClose || onBack || (() => {});
  const [formData, setFormData] = useState({
    name: '',
    idCard: '',
    hospital: '',
    department: '',
    admissionDate: '',
    dischargeDate: '',
    totalAmount: 0,
    surgeryAmount: 0,
    drugAmount: 0,
    checkAmount: 0,
  });

  const calculateReimburse = () => {
    const total = formData.totalAmount || 0;
    const deductible = 1000;
    const rate = 0.8;
    return Math.max(0, (total - deductible) * rate);
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
            <Building2 className="w-5 h-5 text-emerald-600" />
            住院报销
          </h3>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 基本信息 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-800 mb-4">基本信息</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">姓名 *</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入姓名" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">身份证号 *</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入身份证号" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">联系电话</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入联系电话" />
              </div>
            </div>
          </div>

          {/* 住院信息 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />住院信息
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">就诊医院 *</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入医院名称" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">科室</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入科室" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">床位号</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入床位号" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">入院日期 *</label>
                <input type="date" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">出院日期 *</label>
                <input type="date" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">住院天数</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="自动计算" readOnly />
              </div>
            </div>
          </div>

          {/* 费用明细 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />费用明细
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">总费用 *</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入总费用" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">手术费</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入手术费" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">药品费</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入药品费" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">检查费</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入检查费" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">治疗费</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入治疗费" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">材料费</label>
                <input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入材料费" />
              </div>
            </div>
          </div>

          {/* 报销计算 */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <h4 className="font-medium text-emerald-800 mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4" />报销计算
            </h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3">
                <div className="text-sm text-gray-500">总费用</div>
                <div className="text-xl font-bold text-gray-800">¥{formData.totalAmount || 0}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-sm text-gray-500">起付线</div>
                <div className="text-xl font-bold text-orange-600">¥1000</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-sm text-gray-500">报销比例</div>
                <div className="text-xl font-bold text-blue-600">80%</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-sm text-gray-500">预计报销</div>
                <div className="text-xl font-bold text-emerald-600">¥{calculateReimburse().toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* 附件上传 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-800 mb-4">附件上传</h4>
            <div className="grid grid-cols-4 gap-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">住院发票</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">费用清单</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">出院小结</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">诊断证明</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={handleClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />提交申请
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
