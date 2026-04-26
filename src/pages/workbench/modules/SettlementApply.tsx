import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Calendar, DollarSign, User, Upload, FileText, X } from 'lucide-react';

interface SettlementApplyProps {
  onClose: () => void;
  onBack: () => void;
}

const institutions = [
  { id: 'I001', name: '南京市第一医院', type: '三甲医院' },
  { id: 'I002', name: '苏州大学附属医院', type: '三甲医院' },
  { id: 'I003', name: '无锡市人民医院', type: '三甲医院' },
  { id: 'I004', name: '常州市中医院', type: '二甲医院' },
];

export default function SettlementApply({ onBack }: SettlementApplyProps) {
  const [formData, setFormData] = useState({
    institution: '',
    period: '',
    amount: '',
    contact: '',
    phone: '',
  });
  const [files, setFiles] = useState<string[]>([]);

  const handleSubmit = () => {
    alert('结算申请已提交');
    onBack();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold">结算申请</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Building2 className="w-4 h-4" />医疗机构
          </label>
          <select
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">请选择医疗机构</option>
            {institutions.map((i) => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Calendar className="w-4 h-4" />结算周期
          </label>
          <input
            type="month"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <DollarSign className="w-4 h-4" />申请金额
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="请输入金额"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <User className="w-4 h-4" />联系人
          </label>
          <input
            type="text"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="请输入联系人姓名"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
          <FileText className="w-4 h-4" />结算材料
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-cyan-400 cursor-pointer">
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">点击上传结算材料</p>
          <p className="text-xs text-gray-400 mt-1">支持 PDF、Excel、图片格式</p>
        </div>
        {files.length > 0 && (
          <div className="mt-2 space-y-1">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm">{f}</span>
                <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onBack} className="px-6 py-2 border rounded-lg hover:bg-gray-50">取消</button>
        <button onClick={handleSubmit} className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">提交申请</button>
      </div>
    </motion.div>
  );
}
