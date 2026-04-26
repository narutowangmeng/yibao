import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Search, MapPin, FileText, CheckCircle, X, Calculator } from 'lucide-react';

const drugList = [
  { id: '1', name: '阿达木单抗', category: '抗肿瘤药', price: 7580, reimbursementRate: 70 },
  { id: '2', name: '贝伐珠单抗', category: '抗肿瘤药', price: 5200, reimbursementRate: 70 },
  { id: '3', name: '利妥昔单抗', category: '免疫调节药', price: 6800, reimbursementRate: 60 },
];

const pharmacyList = [
  { id: '1', name: '南京市特药定点药店', address: '南京市鼓楼区中山路1号', phone: '025-12345678' },
  { id: '2', name: '江苏省特药药房', address: '南京市玄武区珠江路2号', phone: '025-87654321' },
];

export default function SpecialDrugReimbursement({ onClose, onBack }: { onClose?: () => void; onBack?: () => void }) {
  const handleClose = onClose || onBack || (() => {});
  const [selectedDrug, setSelectedDrug] = useState<any>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [showResult, setShowResult] = useState(false);

  const calculateAmount = () => {
    if (!selectedDrug) return { total: 0, reimburse: 0, self: 0 };
    const total = selectedDrug.price * quantity;
    const reimburse = total * (selectedDrug.reimbursementRate / 100);
    return { total, reimburse, self: total - reimburse };
  };

  const amount = calculateAmount();

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
          <h3 className="text-xl font-bold text-gray-800">特殊药品报销</h3>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 特药选择 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4" />特药品种选择
            </h4>
            <div className="space-y-2">
              {drugList.map(drug => (
                <div
                  key={drug.id}
                  onClick={() => setSelectedDrug(drug)}
                  className={`p-3 border rounded-lg cursor-pointer ${selectedDrug?.id === drug.id ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{drug.name}</span>
                    <span className="text-cyan-600">¥{drug.price}</span>
                  </div>
                  <div className="text-sm text-gray-500">{drug.category} · 报销比例{drug.reimbursementRate}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* 定点药店 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />特药定点药店
            </h4>
            <div className="space-y-2">
              {pharmacyList.map(pharmacy => (
                <div
                  key={pharmacy.id}
                  onClick={() => setSelectedPharmacy(pharmacy)}
                  className={`p-3 border rounded-lg cursor-pointer ${selectedPharmacy?.id === pharmacy.id ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200'}`}
                >
                  <div className="font-medium">{pharmacy.name}</div>
                  <div className="text-sm text-gray-500">{pharmacy.address}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 处方信息 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />处方信息
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">处方编号</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入处方编号" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">数量</label>
                <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* 金额计算 */}
          {selectedDrug && (
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
              <h4 className="font-medium text-cyan-800 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" />报销金额计算
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-500">药品总价</div>
                  <div className="text-xl font-bold text-gray-800">¥{amount.total}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">可报销</div>
                  <div className="text-xl font-bold text-cyan-600">¥{amount.reimburse.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">自费金额</div>
                  <div className="text-xl font-bold text-orange-600">¥{amount.self.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={handleClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
          <button onClick={() => setShowResult(true)} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />提交申请
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
