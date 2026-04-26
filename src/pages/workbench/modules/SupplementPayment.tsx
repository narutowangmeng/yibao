import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Calculator, AlertCircle, CheckCircle } from 'lucide-react';

interface SupplementRecord {
  id: string;
  startMonth: string;
  endMonth: string;
  months: number;
  baseAmount: number;
  principal: number;
  lateFee: number;
  total: number;
}

const reasons = [
  '单位欠缴',
  '个人断缴',
  '系统漏缴',
  '基数调整补差',
  '政策性补缴',
  '其他原因'
];

export default function SupplementPayment({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {
  const handleClose = onClose || onBack || (() => {});
  const [reason, setReason] = useState('');
  const [records, setRecords] = useState<SupplementRecord[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const addRecord = () => {
    const newRecord: SupplementRecord = {
      id: Date.now().toString(),
      startMonth: '',
      endMonth: '',
      months: 0,
      baseAmount: 0,
      principal: 0,
      lateFee: 0,
      total: 0
    };
    setRecords([...records, newRecord]);
  };

  const removeRecord = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  const updateRecord = (id: string, field: keyof SupplementRecord, value: any) => {
    setRecords(records.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      if (field === 'startMonth' || field === 'endMonth') {
        const start = new Date(updated.startMonth);
        const end = new Date(updated.endMonth);
        if (start && end) {
          updated.months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1;
        }
      }
      if (field === 'baseAmount' || field === 'months') {
        updated.principal = updated.baseAmount * updated.months * 0.08;
        updated.lateFee = updated.principal * 0.0005 * 30 * updated.months;
        updated.total = updated.principal + updated.lateFee;
      }
      return updated;
    }));
  };

  const totalAmount = records.reduce((sum, r) => sum + r.total, 0);
  const totalPrincipal = records.reduce((sum, r) => sum + r.principal, 0);
  const totalLateFee = records.reduce((sum, r) => sum + r.lateFee, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <span className="text-gray-600">返回</span>
            </button>
            <h1 className="text-xl font-bold text-gray-800">补缴核定</h1>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">参保人姓名</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入姓名" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">身份证号</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入身份证号" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">补缴原因 <span className="text-red-500">*</span></label>
              <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                <option value="">请选择</option>
                {reasons.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">参保类型</label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>城镇职工</option>
                <option>城乡居民</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">补缴明细</h3>
            <button onClick={addRecord} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" />添加时间段
            </button>
          </div>

          {records.length > 0 && (
            <div className="space-y-4 mb-6">
              {records.map((record) => (
                <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-6 gap-3 items-end">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">开始月份</label>
                      <input type="month" value={record.startMonth} onChange={(e) => updateRecord(record.id, 'startMonth', e.target.value)} className="w-full px-2 py-1 border rounded" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">结束月份</label>
                      <input type="month" value={record.endMonth} onChange={(e) => updateRecord(record.id, 'endMonth', e.target.value)} className="w-full px-2 py-1 border rounded" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">月数</label>
                      <input type="number" value={record.months} readOnly className="w-full px-2 py-1 border rounded bg-gray-100" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">缴费基数</label>
                      <input type="number" value={record.baseAmount} onChange={(e) => updateRecord(record.id, 'baseAmount', Number(e.target.value))} className="w-full px-2 py-1 border rounded" placeholder="元" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">小计</label>
                      <div className="text-sm font-medium text-gray-800">{record.total.toFixed(2)}元</div>
                    </div>
                    <button onClick={() => removeRecord(record.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>本金: {record.principal.toFixed(2)}元</span>
                    <span>滞纳金: {record.lateFee.toFixed(2)}元</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-800">补缴金额汇总</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-500">补缴本金</div>
                <div className="text-xl font-bold text-gray-800">{totalPrincipal.toFixed(2)}元</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">滞纳金</div>
                <div className="text-xl font-bold text-orange-600">{totalLateFee.toFixed(2)}元</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">应缴总额</div>
                <div className="text-xl font-bold text-blue-600">{totalAmount.toFixed(2)}元</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={onBack} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
            <button onClick={() => setShowConfirm(true)} disabled={records.length === 0} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              确认补缴方案
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowConfirm(false)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">补缴方案确认</h3>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between"><span className="text-gray-600">补缴原因</span><span className="font-medium">{reason}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">补缴月数</span><span className="font-medium">{records.reduce((s, r) => s + r.months, 0)}个月</span></div>
              <div className="flex justify-between"><span className="text-gray-600">补缴本金</span><span className="font-medium">{totalPrincipal.toFixed(2)}元</span></div>
              <div className="flex justify-between"><span className="text-gray-600">滞纳金</span><span className="font-medium text-orange-600">{totalLateFee.toFixed(2)}元</span></div>
              <div className="flex justify-between border-t pt-2"><span className="text-gray-800 font-medium">应缴总额</span><span className="text-xl font-bold text-blue-600">{totalAmount.toFixed(2)}元</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">返回修改</button>
              <button onClick={() => { setShowConfirm(false); onBack(); }} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />确认提交
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
