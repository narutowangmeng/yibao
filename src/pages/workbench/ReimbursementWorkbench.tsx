import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Pill,
  Building2,
  Baby,
  AlertCircle,
  Plane,
  HeartPulse,
  ChevronRight,
  X,
  ShieldCheck,
  Upload,
  Building,
  UserCheck,
  Search,
  RefreshCw,
  Calculator,
  Plus,
  Trash2,
} from 'lucide-react';
import ReimbursementQueryCenter, {
  initialReimbursementLedgerData,
  type FeeDetailItem,
  type ReimbursementLedgerItem,
} from './modules/ReimbursementQueryCenter';

const modules = [
  { id: 'outpatient', title: '门诊报销', icon: Stethoscope, color: 'from-blue-500 to-blue-600', desc: '普通门诊费用报销' },
  { id: 'special', title: '特殊门诊', icon: Pill, color: 'from-purple-500 to-purple-600', desc: '慢性病特殊门诊报销' },
  { id: 'inpatient', title: '住院报销', icon: Building2, color: 'from-emerald-500 to-emerald-600', desc: '住院费用报销申请' },
  { id: 'maternity', title: '生育报销', icon: Baby, color: 'from-pink-500 to-pink-600', desc: '生育医疗费用报销' },
  { id: 'emergency', title: '急诊报销', icon: AlertCircle, color: 'from-red-500 to-red-600', desc: '急诊抢救费用报销' },
  { id: 'remote', title: '异地报销', icon: Plane, color: 'from-orange-500 to-orange-600', desc: '异地就医费用报销' },
  { id: 'special_drug', title: '特殊药品报销', icon: Pill, color: 'from-cyan-500 to-cyan-600', desc: '特药定点药店报销' },
  { id: 'major_illness', title: '大病报销', icon: HeartPulse, color: 'from-rose-500 to-rose-600', desc: '大病保险二次报销' },
  { id: 'query_center', title: '报销查询', icon: Search, color: 'from-sky-500 to-sky-600', desc: '报销申请、审核进度、结算结果查询' },
];

interface ValidationResult {
  hospital: { valid: boolean; level: string; license: string; status: string } | null;
  doctor: { valid: boolean; name: string; certNo: string; scope: string } | null;
  drug: { valid: boolean; inDirectory: boolean; ratio: string; limit: string } | null;
}

interface ReimbursementFormData {
  name: string;
  idCard: string;
  phone: string;
  agency: string;
  insuranceType: string;
  hospital: string;
  doctor: string;
  diagnosis: string;
  visitDate: string;
  admissionDate: string;
  dischargeDate: string;
  recordNo: string;
  settlementNo: string;
  diseaseName: string;
  remotePlace: string;
  pharmacy: string;
  feeDetails: FeeDetailItem[];
}

const cityOptions = ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'];

const reimbursementProfiles: Record<
  string,
  {
    ratio: number;
    materials: string[];
    defaultDiagnosis: string;
    feeCatalog: Array<{ name: string; category: string; unitPrice: number; quantity: number; scope: '目录内' | '目录外' }>;
  }
> = {
  outpatient: {
    ratio: 0.72,
    materials: ['门诊发票', '门诊费用清单', '处方笺', '检验检查报告'],
    defaultDiagnosis: '高血压伴心功能不全',
    feeCatalog: [
      { name: '普通门诊诊查费', category: '诊疗项目', unitPrice: 18, quantity: 1, scope: '目录内' },
      { name: '血常规检查', category: '检验项目', unitPrice: 32, quantity: 1, scope: '目录内' },
      { name: '厄贝沙坦片', category: '药品费用', unitPrice: 48, quantity: 2, scope: '目录内' },
    ],
  },
  special: {
    ratio: 0.78,
    materials: ['门慢门特备案表', '门诊发票', '门诊费用清单', '长期处方'],
    defaultDiagnosis: '2型糖尿病并周围神经病变',
    feeCatalog: [
      { name: '门诊慢特病诊查费', category: '诊疗项目', unitPrice: 24, quantity: 1, scope: '目录内' },
      { name: '糖化血红蛋白检测', category: '检验项目', unitPrice: 80, quantity: 1, scope: '目录内' },
      { name: '甘精胰岛素注射液', category: '药品费用', unitPrice: 138, quantity: 2, scope: '目录内' },
    ],
  },
  inpatient: {
    ratio: 0.82,
    materials: ['住院发票', '住院费用总清单', '出院记录', '病案首页'],
    defaultDiagnosis: '胆囊结石伴慢性胆囊炎',
    feeCatalog: [
      { name: '住院床位费', category: '床位护理', unitPrice: 80, quantity: 6, scope: '目录内' },
      { name: '腹腔镜胆囊切除术', category: '手术治疗', unitPrice: 4200, quantity: 1, scope: '目录内' },
      { name: '头孢呋辛钠', category: '药品费用', unitPrice: 86, quantity: 8, scope: '目录内' },
      { name: '一次性腔镜套件', category: '医用耗材', unitPrice: 980, quantity: 1, scope: '目录外' },
    ],
  },
  maternity: {
    ratio: 0.76,
    materials: ['生育医疗发票', '住院清单', '出院记录', '生育服务证明'],
    defaultDiagnosis: '顺产分娩',
    feeCatalog: [
      { name: '产前检查费', category: '诊疗项目', unitPrice: 320, quantity: 1, scope: '目录内' },
      { name: '分娩接生费', category: '手术治疗', unitPrice: 2600, quantity: 1, scope: '目录内' },
      { name: '待产床位费', category: '床位护理', unitPrice: 120, quantity: 3, scope: '目录内' },
    ],
  },
  emergency: {
    ratio: 0.7,
    materials: ['急诊发票', '急诊病历', '抢救记录', '费用清单'],
    defaultDiagnosis: '急性胃肠炎伴脱水',
    feeCatalog: [
      { name: '急诊诊查费', category: '诊疗项目', unitPrice: 26, quantity: 1, scope: '目录内' },
      { name: '抢救室监护费', category: '治疗项目', unitPrice: 180, quantity: 1, scope: '目录内' },
      { name: '补液治疗费', category: '治疗项目', unitPrice: 98, quantity: 2, scope: '目录内' },
    ],
  },
  remote: {
    ratio: 0.74,
    materials: ['异地就医备案信息', '发票', '费用清单', '转诊备案单'],
    defaultDiagnosis: '腰椎间盘突出症',
    feeCatalog: [
      { name: '异地门诊诊查费', category: '诊疗项目', unitPrice: 25, quantity: 1, scope: '目录内' },
      { name: 'MRI检查', category: '检验项目', unitPrice: 620, quantity: 1, scope: '目录内' },
      { name: '中频脉冲治疗', category: '治疗项目', unitPrice: 85, quantity: 5, scope: '目录内' },
    ],
  },
  special_drug: {
    ratio: 0.8,
    materials: ['双通道购药凭证', '门诊发票', '特药处方', '特药备案表'],
    defaultDiagnosis: '强直性脊柱炎',
    feeCatalog: [
      { name: '阿达木单抗注射液', category: '双通道药品', unitPrice: 1298, quantity: 2, scope: '目录内' },
      { name: '药事服务费', category: '药事服务', unitPrice: 20, quantity: 1, scope: '目录内' },
      { name: '冷链配送服务费', category: '其他费用', unitPrice: 30, quantity: 1, scope: '目录外' },
    ],
  },
  major_illness: {
    ratio: 0.84,
    materials: ['大病保险申请表', '结算清单', '诊断证明', '住院发票'],
    defaultDiagnosis: '恶性肿瘤术后化疗',
    feeCatalog: [
      { name: '肿瘤内科诊疗费', category: '诊疗项目', unitPrice: 120, quantity: 2, scope: '目录内' },
      { name: '化疗药物费用', category: '药品费用', unitPrice: 980, quantity: 4, scope: '目录内' },
      { name: '输液泵使用费', category: '医用耗材', unitPrice: 260, quantity: 1, scope: '目录外' },
    ],
  },
};

const buildFeeItem = (
  moduleId: string,
  template?: { name: string; category: string; unitPrice: number; quantity: number; scope: '目录内' | '目录外' },
  index = 0,
): FeeDetailItem => {
  const profile = reimbursementProfiles[moduleId] || reimbursementProfiles.outpatient;
  const seed = template || profile.feeCatalog[Math.min(index, profile.feeCatalog.length - 1)];
  return {
    id: `${moduleId}-fee-${Date.now()}-${index}`,
    itemName: seed.name,
    category: seed.category,
    unitPrice: seed.unitPrice,
    quantity: seed.quantity,
    amount: Number((seed.unitPrice * seed.quantity).toFixed(2)),
    scopeType: seed.scope,
    selfPayRatio: seed.scope === '目录内' ? 0.15 : 1,
    payAmount: 0,
    remark: seed.scope === '目录内' ? '符合医保支付范围' : '目录外个人自付',
  };
};

const createInitialFormData = (moduleId: string): ReimbursementFormData => {
  const profile = reimbursementProfiles[moduleId] || reimbursementProfiles.outpatient;
  return {
    name: '',
    idCard: '',
    phone: '',
    agency: '南京',
    insuranceType: '职工医保',
    hospital: '',
    doctor: '',
    diagnosis: profile.defaultDiagnosis,
    visitDate: '2026-04-27',
    admissionDate: '2026-04-21',
    dischargeDate: '2026-04-27',
    recordNo: '',
    settlementNo: '',
    diseaseName: moduleId === 'special' ? '糖尿病门特' : '',
    remotePlace: moduleId === 'remote' ? '上海市黄浦区' : '',
    pharmacy: moduleId === 'special_drug' ? '苏州大学附属第一医院双通道药房' : '',
    feeDetails: profile.feeCatalog.map((item, index) => buildFeeItem(moduleId, item, index)),
  };
};

export default function ReimbursementWorkbench() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [formData, setFormData] = useState<ReimbursementFormData>(createInitialFormData('outpatient'));
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [ledgerRows, setLedgerRows] = useState<ReimbursementLedgerItem[]>(initialReimbursementLedgerData);
  const [queryKeyword, setQueryKeyword] = useState('');

  const selectedProfile = useMemo(
    () => reimbursementProfiles[selectedModule || 'outpatient'] || reimbursementProfiles.outpatient,
    [selectedModule],
  );

  const totals = useMemo(() => {
    const totalAmount = formData.feeDetails.reduce((sum, item) => sum + item.amount, 0);
    const selfPayAmount = formData.feeDetails.reduce((sum, item) => sum + Number((item.amount * item.selfPayRatio).toFixed(2)), 0);
    const inScopeAmount = Math.max(totalAmount - selfPayAmount, 0);
    const reimbursementAmount = Number((inScopeAmount * selectedProfile.ratio).toFixed(2));
    return {
      totalAmount: Number(totalAmount.toFixed(2)),
      selfPayAmount: Number(selfPayAmount.toFixed(2)),
      inScopeAmount: Number(inScopeAmount.toFixed(2)),
      reimbursementAmount,
    };
  }, [formData.feeDetails, selectedProfile.ratio]);

  const resetForm = () => {
    setSelectedModule(null);
    setFormData(createInitialFormData('outpatient'));
    setValidationResult(null);
  };

  const openModule = (moduleId: string) => {
    setSelectedModule(moduleId);
    if (moduleId !== 'query_center') {
      setFormData(createInitialFormData(moduleId));
      setValidationResult(null);
    }
  };

  const handleInputChange = (name: keyof ReimbursementFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateFeeDetail = (index: number, field: keyof FeeDetailItem, value: string | number) => {
    setFormData((prev) => {
      const nextDetails = prev.feeDetails.map((item, currentIndex) => {
        if (currentIndex !== index) return item;
        const nextItem = { ...item, [field]: value };
        const unitPrice = field === 'unitPrice' ? Number(value) : Number(nextItem.unitPrice);
        const quantity = field === 'quantity' ? Number(value) : Number(nextItem.quantity);
        const amount = Number((unitPrice * quantity).toFixed(2));
        const selfPayRatio = field === 'scopeType' ? (value === '目录内' ? 0.15 : 1) : Number(nextItem.selfPayRatio);
        return {
          ...nextItem,
          unitPrice,
          quantity,
          amount,
          selfPayRatio,
          remark: selfPayRatio >= 1 ? '目录外个人自付' : nextItem.remark || '符合医保支付范围',
        };
      });
      return { ...prev, feeDetails: nextDetails };
    });
  };

  const addFeeDetail = () => {
    if (!selectedModule) return;
    setFormData((prev) => ({
      ...prev,
      feeDetails: [
        ...prev.feeDetails,
        buildFeeItem(selectedModule, {
          name: '新增费用项目',
          category: '其他费用',
          unitPrice: 0,
          quantity: 1,
          scope: '目录内',
        }, prev.feeDetails.length),
      ],
    }));
  };

  const removeFeeDetail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      feeDetails: prev.feeDetails.length > 1 ? prev.feeDetails.filter((_, currentIndex) => currentIndex !== index) : prev.feeDetails,
    }));
  };

  const runValidation = () => {
    setValidating(true);
    setTimeout(() => {
      setValidationResult({
        hospital: { valid: true, level: '三级甲等', license: '苏卫医政字〔2022〕018号', status: '医保定点' },
        doctor: { valid: true, name: formData.doctor || '周静', certNo: '110320100000245', scope: '内科、外科、全科' },
        drug: { valid: true, inDirectory: true, ratio: `${Math.round(selectedProfile.ratio * 100)}%`, limit: '符合当前待遇支付政策' },
      });
      setValidating(false);
    }, 900);
  };

  const buildReimbursementType = (moduleId: string) => {
    const mapping: Record<string, string> = {
      outpatient: '门诊报销',
      special: '特殊门诊',
      inpatient: '住院报销',
      maternity: '生育报销',
      emergency: '急诊报销',
      remote: '异地报销',
      special_drug: '特殊药品报销',
      major_illness: '大病报销',
    };
    return mapping[moduleId] || '费用报销';
  };

  const submitApplication = () => {
    if (!selectedModule || selectedModule === 'query_center') return;
    const module = modules.find((item) => item.id === selectedModule);
    if (!module) return;

    const nextId = `BXAUTO${String(ledgerRows.length + 1).padStart(4, '0')}`;
    const reimbursementType = buildReimbursementType(selectedModule);
    const normalizedFeeDetails = formData.feeDetails.map((item) => ({
      ...item,
      payAmount:
        item.scopeType === '目录内'
          ? Number((item.amount * (1 - item.selfPayRatio) * selectedProfile.ratio).toFixed(2))
          : 0,
    }));

    const nextRow: ReimbursementLedgerItem = {
      id: nextId,
      personName: formData.name || '待补姓名',
      idCard: formData.idCard || '320102199001011234',
      reimbursementType,
      agency: formData.agency,
      hospital: formData.hospital || '江苏省人民医院',
      hospitalLevel: '三级甲等',
      visitDate: selectedModule === 'inpatient' ? formData.dischargeDate || formData.visitDate : formData.visitDate,
      totalAmount: totals.totalAmount,
      inScopeAmount: totals.inScopeAmount,
      selfPayAmount: totals.selfPayAmount,
      reimbursementAmount: totals.reimbursementAmount,
      status: '待初审',
      diagnosis: formData.diagnosis || module.desc,
      settlementNo: formData.settlementNo || `JSJS${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(ledgerRows.length + 1).padStart(3, '0')}`,
      auditOpinion: '经办受理完成，待审核人员初审',
      reviewerName: '待分派',
      settleDate: '',
      feeDetails: normalizedFeeDetails,
    };

    setLedgerRows((prev) => [nextRow, ...prev]);
    setQueryKeyword(nextId);
    setSelectedModule('query_center');
    setFormData(createInitialFormData(selectedModule));
    setValidationResult(null);
  };

  const renderQueryCenter = () => (
    <motion.div key="query_center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50">
      <ReimbursementQueryCenter
        onBack={() => setSelectedModule(null)}
        rows={ledgerRows}
        onRowsChange={setLedgerRows}
        initialKeyword={queryKeyword}
      />
    </motion.div>
  );

  const renderDynamicFields = () => {
    if (!selectedModule) return null;
    const fieldClass = 'w-full px-3 py-2 border rounded-lg text-sm';

    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-medium text-gray-800 mb-4">业务补充信息</h4>
        <div className="grid grid-cols-4 gap-4">
          {selectedModule === 'special' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">门慢病种</label>
              <input value={formData.diseaseName} onChange={(e) => handleInputChange('diseaseName', e.target.value)} className={fieldClass} />
            </div>
          )}
          {selectedModule === 'remote' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">异地就医地</label>
              <input value={formData.remotePlace} onChange={(e) => handleInputChange('remotePlace', e.target.value)} className={fieldClass} />
            </div>
          )}
          {selectedModule === 'special_drug' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">购药药店/药房</label>
              <input value={formData.pharmacy} onChange={(e) => handleInputChange('pharmacy', e.target.value)} className={fieldClass} />
            </div>
          )}
          {selectedModule === 'inpatient' || selectedModule === 'maternity' || selectedModule === 'major_illness' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">入院日期</label>
                <input type="date" value={formData.admissionDate} onChange={(e) => handleInputChange('admissionDate', e.target.value)} className={fieldClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">出院日期</label>
                <input type="date" value={formData.dischargeDate} onChange={(e) => handleInputChange('dischargeDate', e.target.value)} className={fieldClass} />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">就诊日期</label>
              <input type="date" value={formData.visitDate} onChange={(e) => handleInputChange('visitDate', e.target.value)} className={fieldClass} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">病历/备案编号</label>
            <input value={formData.recordNo} onChange={(e) => handleInputChange('recordNo', e.target.value)} className={fieldClass} placeholder="如：BA20260427018" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">结算单号</label>
            <input value={formData.settlementNo} onChange={(e) => handleInputChange('settlementNo', e.target.value)} className={fieldClass} placeholder="如：JSJS20260427015" />
          </div>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    const module = modules.find((item) => item.id === selectedModule);
    if (!module) return null;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={resetForm}>
        <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">{module.title} - 业务办理</h3>
            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-800 mb-4">基本信息</h4>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">参保人姓名</label>
                  <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="请输入姓名" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">身份证号</label>
                  <input type="text" value={formData.idCard} onChange={(e) => handleInputChange('idCard', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="请输入身份证号" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                  <input type="text" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="请输入联系电话" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">参保地市</label>
                  <select value={formData.agency} onChange={(e) => handleInputChange('agency', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">险种类型</label>
                  <select value={formData.insuranceType} onChange={(e) => handleInputChange('insuranceType', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="职工医保">职工医保</option>
                    <option value="居民医保">居民医保</option>
                    <option value="大病保险">大病保险</option>
                    <option value="生育保险">生育保险</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">就医医院</label>
                  <input type="text" value={formData.hospital} onChange={(e) => handleInputChange('hospital', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="请输入医院名称" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">主治医生</label>
                  <input type="text" value={formData.doctor} onChange={(e) => handleInputChange('doctor', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="请输入主治医生" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">主要诊断</label>
                  <input type="text" value={formData.diagnosis} onChange={(e) => handleInputChange('diagnosis', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
            </div>

            {renderDynamicFields()}

            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-800 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-600" />
                  机构资质与目录规则校验
                </h4>
                <button onClick={runValidation} disabled={validating} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 disabled:opacity-50">
                  {validating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {validating ? '校验中...' : '开始校验'}
                </button>
              </div>

              {validationResult ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm">医院资质</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">医院等级</span>
                        <span className="text-green-600 font-medium">{validationResult.hospital?.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">执业许可</span>
                        <span className="text-green-600 font-medium">{validationResult.hospital?.license}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">定点资格</span>
                        <span className="text-green-600 font-medium">{validationResult.hospital?.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-sm">医生资格</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">医生姓名</span>
                        <span className="text-green-600 font-medium">{validationResult.doctor?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">执业证号</span>
                        <span className="text-green-600 font-medium">{validationResult.doctor?.certNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">执业范围</span>
                        <span className="text-green-600 font-medium">{validationResult.doctor?.scope}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-sm">支付政策</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">目录状态</span>
                        <span className="text-green-600 font-medium">{validationResult.drug?.inDirectory ? '目录内' : '目录外'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">支付比例</span>
                        <span className="text-green-600 font-medium">{validationResult.drug?.ratio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">规则说明</span>
                        <span className="text-green-600 font-medium">{validationResult.drug?.limit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 text-sm">点击“开始校验”校验医院资质、医生资格和目录支付规则。</div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-800 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  费用明细
                </h4>
                <button onClick={addFeeDetail} className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700">
                  <Plus className="w-4 h-4" />
                  新增明细
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="w-full min-w-[1200px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-600">项目名称</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-600">费用类别</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-600">单价</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-600">数量</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-600">金额</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-600">目录属性</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-600">个人自付比例</th>
                      <th className="px-3 py-3 text-left text-sm font-medium text-gray-600">备注</th>
                      <th className="px-3 py-3 text-right text-sm font-medium text-gray-600">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {formData.feeDetails.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-3 py-3">
                          <input value={item.itemName} onChange={(e) => updateFeeDetail(index, 'itemName', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </td>
                        <td className="px-3 py-3">
                          <input value={item.category} onChange={(e) => updateFeeDetail(index, 'category', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </td>
                        <td className="px-3 py-3">
                          <input type="number" value={item.unitPrice} onChange={(e) => updateFeeDetail(index, 'unitPrice', Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </td>
                        <td className="px-3 py-3">
                          <input type="number" value={item.quantity} onChange={(e) => updateFeeDetail(index, 'quantity', Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </td>
                        <td className="px-3 py-3 text-sm font-medium text-gray-800">{item.amount.toFixed(2)}</td>
                        <td className="px-3 py-3">
                          <select value={item.scopeType} onChange={(e) => updateFeeDetail(index, 'scopeType', e.target.value as '目录内' | '目录外')} className="w-full px-3 py-2 border rounded-lg text-sm">
                            <option value="目录内">目录内</option>
                            <option value="目录外">目录外</option>
                          </select>
                        </td>
                        <td className="px-3 py-3">
                          <input type="number" min="0" max="1" step="0.05" value={item.selfPayRatio} onChange={(e) => updateFeeDetail(index, 'selfPayRatio', Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </td>
                        <td className="px-3 py-3">
                          <input value={item.remark} onChange={(e) => updateFeeDetail(index, 'remark', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button onClick={() => removeFeeDetail(index)} className="rounded p-2 text-rose-600 hover:bg-rose-50">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <h4 className="font-medium text-emerald-800 mb-4">报销测算</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm text-gray-500">费用总额</div>
                  <div className="text-xl font-bold text-gray-800">¥{totals.totalAmount.toFixed(2)}</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm text-gray-500">目录内金额</div>
                  <div className="text-xl font-bold text-blue-600">¥{totals.inScopeAmount.toFixed(2)}</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm text-gray-500">个人自付</div>
                  <div className="text-xl font-bold text-orange-600">¥{totals.selfPayAmount.toFixed(2)}</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-sm text-gray-500">预计报销</div>
                  <div className="text-xl font-bold text-emerald-600">¥{totals.reimbursementAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-800 mb-4">材料上传</h4>
              <div className="grid grid-cols-4 gap-4">
                {selectedProfile.materials.map((item) => (
                  <div key={item} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-cyan-400 cursor-pointer">
                    <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t flex justify-end gap-3">
            <button onClick={resetForm} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              取消
            </button>
            <button onClick={submitApplication} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
              提交申请
            </button>
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
          <motion.button
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => openModule(module.id)}
            className="group bg-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-2xl hover:border-cyan-400 hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
              <module.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-3">{module.title}</h3>
            <p className="text-base text-gray-500 leading-relaxed">{module.desc}</p>
            <div className="mt-5 flex items-center gap-1 text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-sm font-medium">进入办理</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>{selectedModule === 'query_center' ? renderQueryCenter() : selectedModule ? renderForm() : null}</AnimatePresence>
    </div>
  );
}
