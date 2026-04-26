import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, Calendar, DollarSign, FileText, Clock, CheckCircle, X, Upload } from 'lucide-react';

export default function DeferApplication({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {
  const handleClose = onClose || onBack || (() => {});
  const [step, setStep] = useState(1);
  const [enterprise, setEnterprise] = useState<any>(null);
  const [formData, setFormData] = useState({
    reason: '',
    startDate: '',
    endDate: '',
    deferAmount: '',
    agreement: null
  });

  const searchEnterprise = () => {
    setEnterprise({
      name: '南京科技有限公司',
      code: '91320100MA1XXXXXX',
      address: '南京市鼓楼区中山路1号',
      employees: 156,
      monthlyAmount: 46800
    });
  };

  const reasons = ['经营困难', '资金周转问题', '疫情影响', '自然灾害', '其他'];

  const calculateDeferAmount = () => {
    if (!enterprise || !formData.startDate || !formData.endDate) return 0;
    return enterprise.monthlyAmount * 3;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">缓缴申请</h1>
            <p className="text-sm text-gray-500">困难企业社保费缓缴申请</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-emerald-500' : 'bg-gray-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />企业信息查询
            </h3>
            <div className="flex gap-3 mb-6">
              <input type="text" className="flex-1 px-4 py-3 border rounded-lg" placeholder="输入企业统一社会信用代码或名称" />
              <button onClick={searchEnterprise} className="px-6 py-3 bg-emerald-600 text-white rounded-lg flex items-center gap-2">
                <Search className="w-4 h-4" />查询
              </button>
            </div>
            {enterprise && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between"><span className="text-gray-500">企业名称</span><span className="font-medium">{enterprise.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">统一社会信用代码</span><span>{enterprise.code}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">参保人数</span><span>{enterprise.employees}人</span></div>
                <div className="flex justify-between"><span className="text-gray-500">月应缴金额</span><span className="text-emerald-600 font-medium">¥{enterprise.monthlyAmount}</span></div>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button onClick={() => setStep(2)} disabled={!enterprise} className="px-6 py-3 bg-emerald-600 text-white rounded-lg disabled:opacity-50">下一步</button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />缓缴原因与期限
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">缓缴原因</label>
                <div className="grid grid-cols-3 gap-3">
                  {reasons.map((r) => (
                    <button key={r} onClick={() => setFormData({ ...formData, reason: r })} className={`p-3 border rounded-lg text-center ${formData.reason === r ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : ''}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">缓缴开始日期</label>
                  <input type="date" className="w-full px-4 py-3 border rounded-lg" onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">缓缴结束日期</label>
                  <input type="date" className="w-full px-4 py-3 border rounded-lg" onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-3 border rounded-lg">上一步</button>
              <button onClick={() => setStep(3)} disabled={!formData.reason || !formData.startDate || !formData.endDate} className="px-6 py-3 bg-emerald-600 text-white rounded-lg disabled:opacity-50">下一步</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />缓缴金额计算
            </h3>
            <div className="bg-emerald-50 rounded-lg p-6 mb-6">
              <div className="text-center">
                <p className="text-gray-600 mb-2">预计缓缴金额</p>
                <p className="text-4xl font-bold text-emerald-600">¥{calculateDeferAmount().toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">缓缴期限：{formData.startDate} 至 {formData.endDate}</p>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">缓缴协议上传</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">点击上传缓缴协议书</p>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="px-6 py-3 border rounded-lg">上一步</button>
              <button onClick={() => setStep(4)} className="px-6 py-3 bg-emerald-600 text-white rounded-lg">提交申请</button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />审批进度
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600" /></div>
                <div className="flex-1"><p className="font-medium">申请提交</p><p className="text-sm text-gray-500">2024-01-15 10:30</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center"><Clock className="w-5 h-5 text-yellow-600" /></div>
                <div className="flex-1"><p className="font-medium">审核中</p><p className="text-sm text-gray-500">预计1-3个工作日</p></div>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button onClick={onBack} className="px-6 py-3 bg-gray-600 text-white rounded-lg">返回工作台</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
