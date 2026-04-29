import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Calendar, DollarSign, User, Upload, FileText, X } from 'lucide-react';
import { appendSettlementSubmission } from '../../../utils/settlementStorage';

interface SettlementApplyProps {
  onClose: () => void;
  onBack: () => void;
}

const institutions = [
  { id: 'I001', name: '南京市第一医院', type: '三甲医院' },
  { id: 'I002', name: '苏州大学附属第一医院', type: '三甲医院' },
  { id: 'I003', name: '无锡市人民医院', type: '三甲医院' },
  { id: 'I004', name: '常州市中医院', type: '三甲医院' },
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
    if (!formData.institution || !formData.period || !formData.amount || !formData.contact) {
      return;
    }

    const institution = institutions.find((item) => item.id === formData.institution);
    const now = new Date();
    const sequence = `${now.getHours()}${now.getMinutes()}${now.getSeconds()}`.padStart(6, '0');

    appendSettlementSubmission({
      id: `JS${formData.period.replace('-', '')}${sequence}`,
      institution: institution?.name || formData.institution,
      period: formData.period,
      amount: Number(formData.amount),
      status: '待结算',
      createTime: now.toISOString().slice(0, 10),
      paymentNo: '',
      reconcileResult: '待提交结算申请',
      arrivalStatus: '未拨付',
      operatorName: formData.contact,
      remark: files.length ? `已上传${files.length}份结算材料` : '待补充结算材料',
    });

    onBack();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h3 className="text-xl font-bold">结算申请</h3>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
            <Building2 className="h-4 w-4" />医疗机构
          </label>
          <select
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">请选择医疗机构</option>
            {institutions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
            <Calendar className="h-4 w-4" />结算周期
          </label>
          <input
            type="month"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
            <DollarSign className="h-4 w-4" />申请金额
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="请输入金额"
          />
        </div>
        <div>
          <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
            <User className="h-4 w-4" />联系人
          </label>
          <input
            type="text"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="请输入联系人姓名"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700">
          <FileText className="h-4 w-4" />结算材料
        </label>
        <div
          onClick={() => setFiles((prev) => (prev.length ? prev : ['住院结算汇总表.pdf', '机构对账清单.xlsx']))}
          className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-cyan-400"
        >
          <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm text-gray-600">点击补入结算材料</p>
          <p className="mt-1 text-xs text-gray-400">支持 PDF、Excel、图片格式</p>
        </div>
        {files.length > 0 && (
          <div className="mt-2 space-y-1">
            {files.map((file, index) => (
              <div key={file} className="flex items-center justify-between rounded bg-gray-50 p-2">
                <span className="text-sm">{file}</span>
                <button onClick={() => setFiles(files.filter((_, current) => current !== index))}>
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onBack} className="rounded-lg border px-6 py-2 hover:bg-gray-50">
          取消
        </button>
        <button onClick={handleSubmit} className="rounded-lg bg-cyan-600 px-6 py-2 text-white hover:bg-cyan-700">
          提交申请
        </button>
      </div>
    </motion.div>
  );
}
