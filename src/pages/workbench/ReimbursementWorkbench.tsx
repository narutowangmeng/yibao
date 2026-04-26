import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Pill, Building2, Baby, AlertCircle, Plane, Pill as PillIcon, HeartPulse, ChevronRight, X, ShieldCheck, Upload, AlertTriangle, CheckCircle, Building, UserCheck, Search, RefreshCw } from 'lucide-react';
import OutpatientReimbursement from './modules/OutpatientReimbursement';
import SpecialOutpatient from './modules/SpecialOutpatient';
import InpatientReimbursement from './modules/InpatientReimbursement';
import MaternityReimbursement from './modules/MaternityReimbursement';
import EmergencyReimbursement from './modules/EmergencyReimbursement';
import RemoteReimbursement from './modules/RemoteReimbursement';
import SpecialDrugReimbursement from './modules/SpecialDrugReimbursement';
import MajorIllnessReimbursement from './modules/MajorIllnessReimbursement';
import ReimbursementQueryCenter from './modules/ReimbursementQueryCenter';

const modules = [
  { id: 'outpatient', title: '门诊报销', icon: Stethoscope, color: 'from-blue-500 to-blue-600', desc: '普通门诊费用报销', component: OutpatientReimbursement },
  { id: 'special', title: '特殊门诊', icon: Pill, color: 'from-purple-500 to-purple-600', desc: '慢性病特殊门诊报销', component: SpecialOutpatient },
  { id: 'inpatient', title: '住院报销', icon: Building2, color: 'from-emerald-500 to-emerald-600', desc: '住院费用报销申请', component: InpatientReimbursement },
  { id: 'maternity', title: '生育报销', icon: Baby, color: 'from-pink-500 to-pink-600', desc: '生育医疗费用报销', component: MaternityReimbursement },
  { id: 'emergency', title: '急诊报销', icon: AlertCircle, color: 'from-red-500 to-red-600', desc: '急诊抢救费用报销', component: EmergencyReimbursement },
  { id: 'remote', title: '异地报销', icon: Plane, color: 'from-orange-500 to-orange-600', desc: '异地就医费用报销', component: RemoteReimbursement },
  { id: 'special_drug', title: '特殊药品报销', icon: PillIcon, color: 'from-cyan-500 to-cyan-600', desc: '特药定点药店报销', component: SpecialDrugReimbursement },
  { id: 'major_illness', title: '大病报销', icon: HeartPulse, color: 'from-rose-500 to-rose-600', desc: '大病保险二次报销', component: MajorIllnessReimbursement },
  { id: 'query_center', title: '报销查询', icon: Search, color: 'from-sky-500 to-sky-600', desc: '报销申请、审核进度、结算结果查询与导入导出', component: ReimbursementQueryCenter },
];

interface ValidationResult {
  hospital: { valid: boolean; level: string; license: string; status: string } | null;
  doctor: { valid: boolean; name: string; certNo: string; scope: string } | null;
  drug: { valid: boolean; inDirectory: boolean; ratio: string; limit: string } | null;
}

export default function ReimbursementWorkbench() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const resetForm = () => {
    setSelectedModule(null);
    setFormData({});
    setValidationResult(null);
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const runValidation = () => {
    setValidating(true);
    setTimeout(() => {
      setValidationResult({
        hospital: { valid: true, level: '三级甲等', license: '浙卫医政字[2020]第001号', status: '医保定点' },
        doctor: { valid: true, name: '王医生', certNo: '110101199001011234', scope: '内科、外科' },
        drug: { valid: true, inDirectory: true, ratio: '85%', limit: '无限制' }
      });
      setValidating(false);
    }, 1500);
  };

  const renderModule = () => {
    const module = modules.find(m => m.id === selectedModule);
    if (!module) return null;
    const Component = module.component;
    return (
      <motion.div key={selectedModule} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
        <Component onClose={() => setSelectedModule(null)} onBack={() => setSelectedModule(null)} />
      </motion.div>
    );
  };

  const renderForm = () => {
    const module = modules.find(m => m.id === selectedModule);
    if (!module) return null;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={resetForm}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">{module.title} - 业务办理</h3>
            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-800 mb-4">基本信息</h4>
              <div className="grid grid-cols-4 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">参保人姓名 <span className="text-red-500">*</span></label><input type="text" value={formData.name || ''} onChange={e => handleInputChange('name', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="请输入姓名" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">身份证号 <span className="text-red-500">*</span></label><input type="text" value={formData.idCard || ''} onChange={e => handleInputChange('idCard', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="请输入身份证号" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">就诊医院 <span className="text-red-500">*</span></label><input type="text" value={formData.hospital || ''} onChange={e => handleInputChange('hospital', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="请输入医院名称" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">主治医生 <span className="text-red-500">*</span></label><input type="text" value={formData.doctor || ''} onChange={e => handleInputChange('doctor', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="请输入医生姓名" /></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-800 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-cyan-600" />实时机构资质校验</h4>
                <button onClick={runValidation} disabled={validating} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 disabled:opacity-50">
                  {validating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {validating ? '校验中...' : '开始校验'}
                </button>
              </div>

              {validationResult && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2"><Building className="w-4 h-4 text-blue-600" /><span className="font-medium text-sm">医院资质</span></div>
                    {validationResult.hospital?.valid ? (
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">医院等级</span><span className="text-green-600 font-medium">{validationResult.hospital.level}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">执业许可</span><span className="text-green-600 font-medium">{validationResult.hospital.license}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">定点资质</span><span className="text-green-600 font-medium">{validationResult.hospital.status}</span></div>
                      </div>
                    ) : <span className="text-red-500 text-sm">校验失败</span>}
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2"><UserCheck className="w-4 h-4 text-purple-600" /><span className="font-medium text-sm">医生执业资格</span></div>
                    {validationResult.doctor?.valid ? (
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">医师姓名</span><span className="text-green-600 font-medium">{validationResult.doctor.name}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">执业证号</span><span className="text-green-600 font-medium">{validationResult.doctor.certNo}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">执业范围</span><span className="text-green-600 font-medium">{validationResult.doctor.scope}</span></div>
                      </div>
                    ) : <span className="text-red-500 text-sm">校验失败</span>}
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2"><Pill className="w-4 h-4 text-emerald-600" /><span className="font-medium text-sm">药品目录</span></div>
                    {validationResult.drug?.valid ? (
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">目录状态</span><span className="text-green-600 font-medium">{validationResult.drug.inDirectory ? '目录内' : '目录外'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">报销比例</span><span className="text-green-600 font-medium">{validationResult.drug.ratio}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">限制条件</span><span className="text-green-600 font-medium">{validationResult.drug.limit}</span></div>
                      </div>
                    ) : <span className="text-red-500 text-sm">校验失败</span>}
                  </div>
                </div>
              )}

              {!validationResult && !validating && (
                <div className="text-center py-6 text-gray-500 text-sm">点击"开始校验"按钮进行医院资质、医生执业资格、药品目录的实时校验</div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-800 mb-4">费用信息</h4>
              <div className="grid grid-cols-4 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">总费用金额</label><input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="0.00" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">自费金额</label><input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="0.00" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">报销金额</label><input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="0.00" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">报销比例(%)</label><input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="0" /></div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-800 mb-4">上传材料</h4>
              <div className="grid grid-cols-4 gap-4">
                {['发票', '病历', '费用清单', '诊断证明'].map(item => (
                  <div key={item} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-cyan-400 cursor-pointer">
                    <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">上传{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t flex justify-end gap-3">
            <button onClick={resetForm} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
            <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">提交申请</button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">费用报销工作台</h2>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {modules.map((module, index) => (
          <motion.button key={module.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedModule(module.id)}
            className="group bg-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-2xl hover:border-cyan-400 hover:-translate-y-1 transition-all duration-300">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
              <module.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-3">{module.title}</h3>
            <p className="text-base text-gray-500 leading-relaxed">{module.desc}</p>
            <div className="mt-5 flex items-center gap-1 text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-sm font-medium">进入办理</span><ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>{selectedModule && renderModule()}</AnimatePresence>
    </div>
  );
}
