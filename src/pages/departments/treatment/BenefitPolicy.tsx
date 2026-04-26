import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';

interface TierConfig {
  min: string;
  max: string;
  rate: string;
}

interface BenefitRule {
  id: string;
  name: string;
  insuranceType: string;
  hospitalLevel: string;
  deductible: string;
  cap: string;
  annualLimit: string;
  tiers: TierConfig[];
  drugClass: string;
  specialGroups: string[];
  status: 'active' | 'inactive';
  effectiveDate: string;
}

const insuranceTypes = ['职工基本医疗保险', '城乡居民基本医疗保险', '公务员医疗补助', '大病保险'];
const hospitalLevels = ['三级甲等医院', '三级医院', '二级医院', '一级及社区医疗机构'];
const drugClasses = ['甲类', '乙类', '丙类'];
const specialGroupOptions = ['低保对象', '特困人员', '重度残疾人', '高龄老人', '退役优抚对象'];

const initialRules: BenefitRule[] = [
  { id: '1', name: '职工医保三级甲等医院住院待遇', insuranceType: '职工基本医疗保险', hospitalLevel: '三级甲等医院', deductible: '1200', cap: '300000', annualLimit: '450000', tiers: [{ min: '0', max: '10000', rate: '85' }, { min: '10000', max: '50000', rate: '90' }, { min: '50000', max: '300000', rate: '93' }], drugClass: '甲类', specialGroups: ['高龄老人'], status: 'active', effectiveDate: '2026-01-01' },
  { id: '2', name: '职工医保二级医院住院待遇', insuranceType: '职工基本医疗保险', hospitalLevel: '二级医院', deductible: '800', cap: '280000', annualLimit: '420000', tiers: [{ min: '0', max: '10000', rate: '88' }, { min: '10000', max: '50000', rate: '92' }, { min: '50000', max: '280000', rate: '94' }], drugClass: '甲类', specialGroups: [], status: 'active', effectiveDate: '2026-01-01' },
  { id: '3', name: '职工医保社区门诊统筹待遇', insuranceType: '职工基本医疗保险', hospitalLevel: '一级及社区医疗机构', deductible: '0', cap: '6000', annualLimit: '6000', tiers: [{ min: '0', max: '3000', rate: '70' }, { min: '3000', max: '6000', rate: '75' }], drugClass: '甲类', specialGroups: ['高龄老人'], status: 'active', effectiveDate: '2026-01-01' },
  { id: '4', name: '居民医保三级医院住院待遇', insuranceType: '城乡居民基本医疗保险', hospitalLevel: '三级医院', deductible: '1500', cap: '180000', annualLimit: '260000', tiers: [{ min: '0', max: '10000', rate: '60' }, { min: '10000', max: '50000', rate: '68' }, { min: '50000', max: '180000', rate: '72' }], drugClass: '甲类', specialGroups: ['低保对象'], status: 'active', effectiveDate: '2026-01-01' },
  { id: '5', name: '居民医保二级医院住院待遇', insuranceType: '城乡居民基本医疗保险', hospitalLevel: '二级医院', deductible: '1000', cap: '180000', annualLimit: '260000', tiers: [{ min: '0', max: '10000', rate: '65' }, { min: '10000', max: '50000', rate: '72' }, { min: '50000', max: '180000', rate: '75' }], drugClass: '甲类', specialGroups: ['低保对象', '特困人员'], status: 'active', effectiveDate: '2026-01-01' },
  { id: '6', name: '居民医保一级医院住院待遇', insuranceType: '城乡居民基本医疗保险', hospitalLevel: '一级及社区医疗机构', deductible: '500', cap: '160000', annualLimit: '240000', tiers: [{ min: '0', max: '10000', rate: '72' }, { min: '10000', max: '50000', rate: '78' }, { min: '50000', max: '160000', rate: '82' }], drugClass: '甲类', specialGroups: ['低保对象'], status: 'active', effectiveDate: '2026-01-01' },
  { id: '7', name: '居民普通门诊统筹待遇', insuranceType: '城乡居民基本医疗保险', hospitalLevel: '一级及社区医疗机构', deductible: '0', cap: '1200', annualLimit: '1200', tiers: [{ min: '0', max: '600', rate: '50' }, { min: '600', max: '1200', rate: '55' }], drugClass: '甲类', specialGroups: [], status: 'active', effectiveDate: '2026-01-01' },
  { id: '8', name: '门诊慢特病高血压待遇', insuranceType: '城乡居民基本医疗保险', hospitalLevel: '一级及社区医疗机构', deductible: '0', cap: '3000', annualLimit: '3000', tiers: [{ min: '0', max: '1500', rate: '70' }, { min: '1500', max: '3000', rate: '75' }], drugClass: '乙类', specialGroups: ['高龄老人'], status: 'active', effectiveDate: '2026-01-01' },
  { id: '9', name: '门诊慢特病糖尿病待遇', insuranceType: '城乡居民基本医疗保险', hospitalLevel: '一级及社区医疗机构', deductible: '0', cap: '3600', annualLimit: '3600', tiers: [{ min: '0', max: '1800', rate: '72' }, { min: '1800', max: '3600', rate: '78' }], drugClass: '乙类', specialGroups: ['高龄老人'], status: 'active', effectiveDate: '2026-01-01' },
  { id: '10', name: '恶性肿瘤门诊放化疗待遇', insuranceType: '职工基本医疗保险', hospitalLevel: '三级甲等医院', deductible: '0', cap: '120000', annualLimit: '120000', tiers: [{ min: '0', max: '30000', rate: '88' }, { min: '30000', max: '80000', rate: '92' }, { min: '80000', max: '120000', rate: '95' }], drugClass: '乙类', specialGroups: ['重度残疾人'], status: 'active', effectiveDate: '2026-01-01' },
  { id: '11', name: '器官移植术后抗排异待遇', insuranceType: '职工基本医疗保险', hospitalLevel: '三级甲等医院', deductible: '0', cap: '150000', annualLimit: '150000', tiers: [{ min: '0', max: '50000', rate: '90' }, { min: '50000', max: '100000', rate: '93' }, { min: '100000', max: '150000', rate: '95' }], drugClass: '乙类', specialGroups: ['特困人员'], status: 'active', effectiveDate: '2026-01-01' },
  { id: '12', name: '居民大病保险起付线政策', insuranceType: '大病保险', hospitalLevel: '三级医院', deductible: '18000', cap: '400000', annualLimit: '400000', tiers: [{ min: '18000', max: '100000', rate: '60' }, { min: '100000', max: '200000', rate: '65' }, { min: '200000', max: '400000', rate: '70' }], drugClass: '甲类', specialGroups: ['低保对象', '特困人员'], status: 'active', effectiveDate: '2026-01-01' },
  { id: '13', name: '居民大病保险倾斜支付政策', insuranceType: '大病保险', hospitalLevel: '三级医院', deductible: '12000', cap: '450000', annualLimit: '450000', tiers: [{ min: '12000', max: '100000', rate: '68' }, { min: '100000', max: '200000', rate: '73' }, { min: '200000', max: '450000', rate: '78' }], drugClass: '甲类', specialGroups: ['低保对象', '特困人员', '重度残疾人'], status: 'active', effectiveDate: '2026-01-01' },
  { id: '14', name: '职工生育住院待遇', insuranceType: '职工基本医疗保险', hospitalLevel: '二级医院', deductible: '0', cap: '12000', annualLimit: '12000', tiers: [{ min: '0', max: '6000', rate: '90' }, { min: '6000', max: '12000', rate: '95' }], drugClass: '甲类', specialGroups: [], status: 'active', effectiveDate: '2026-01-01' },
  { id: '15', name: '公务员医疗补助住院待遇', insuranceType: '公务员医疗补助', hospitalLevel: '三级甲等医院', deductible: '500', cap: '200000', annualLimit: '200000', tiers: [{ min: '0', max: '10000', rate: '92' }, { min: '10000', max: '50000', rate: '95' }, { min: '50000', max: '200000', rate: '97' }], drugClass: '甲类', specialGroups: [], status: 'active', effectiveDate: '2026-01-01' },
  { id: '16', name: '异地转诊备案后住院待遇', insuranceType: '职工基本医疗保险', hospitalLevel: '三级医院', deductible: '1500', cap: '260000', annualLimit: '400000', tiers: [{ min: '0', max: '10000', rate: '80' }, { min: '10000', max: '50000', rate: '85' }, { min: '50000', max: '260000', rate: '90' }], drugClass: '甲类', specialGroups: [], status: 'active', effectiveDate: '2026-01-01' },
  { id: '17', name: '双通道药品支付待遇', insuranceType: '职工基本医疗保险', hospitalLevel: '三级甲等医院', deductible: '0', cap: '100000', annualLimit: '100000', tiers: [{ min: '0', max: '30000', rate: '85' }, { min: '30000', max: '60000', rate: '88' }, { min: '60000', max: '100000', rate: '90' }], drugClass: '乙类', specialGroups: ['重度残疾人'], status: 'active', effectiveDate: '2026-01-01' },
  { id: '18', name: '罕见病用药保障待遇', insuranceType: '职工基本医疗保险', hospitalLevel: '三级甲等医院', deductible: '0', cap: '200000', annualLimit: '200000', tiers: [{ min: '0', max: '50000', rate: '85' }, { min: '50000', max: '120000', rate: '90' }, { min: '120000', max: '200000', rate: '92' }], drugClass: '乙类', specialGroups: ['特困人员'], status: 'active', effectiveDate: '2026-01-01' },
  { id: '19', name: '居民门诊“两病”保障待遇', insuranceType: '城乡居民基本医疗保险', hospitalLevel: '一级及社区医疗机构', deductible: '0', cap: '2400', annualLimit: '2400', tiers: [{ min: '0', max: '1200', rate: '60' }, { min: '1200', max: '2400', rate: '65' }], drugClass: '乙类', specialGroups: ['高龄老人'], status: 'active', effectiveDate: '2026-01-01' },
  { id: '20', name: '离休干部门诊补助待遇', insuranceType: '公务员医疗补助', hospitalLevel: '三级甲等医院', deductible: '0', cap: '60000', annualLimit: '60000', tiers: [{ min: '0', max: '20000', rate: '95' }, { min: '20000', max: '60000', rate: '98' }], drugClass: '甲类', specialGroups: ['退役优抚对象'], status: 'inactive', effectiveDate: '2025-01-01' },
];

export default function BenefitPolicy() {
  const [rules, setRules] = useState<BenefitRule[]>(initialRules);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<BenefitRule | null>(null);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BenefitRule>>({
    name: '',
    insuranceType: insuranceTypes[0],
    hospitalLevel: hospitalLevels[0],
    deductible: '',
    cap: '',
    annualLimit: '',
    tiers: [{ min: '0', max: '', rate: '' }],
    drugClass: drugClasses[0],
    specialGroups: [],
    status: 'active',
    effectiveDate: '',
  });

  const handleAdd = () => {
    setEditingRule(null);
    setFormData({
      name: '',
      insuranceType: insuranceTypes[0],
      hospitalLevel: hospitalLevels[0],
      deductible: '',
      cap: '',
      annualLimit: '',
      tiers: [{ min: '0', max: '', rate: '' }],
      drugClass: drugClasses[0],
      specialGroups: [],
      status: 'active',
      effectiveDate: '',
    });
    setShowModal(true);
  };

  const handleEdit = (rule: BenefitRule) => {
    setEditingRule(rule);
    setFormData({ ...rule });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    if (editingRule) {
      setRules(rules.map((r) => (r.id === editingRule.id ? ({ ...r, ...formData } as BenefitRule) : r)));
    } else {
      setRules([...rules, { id: String(Date.now()), ...formData } as BenefitRule]);
    }
    setShowModal(false);
  };

  const addTier = () => {
    const lastTier = formData.tiers?.[formData.tiers.length - 1];
    setFormData({
      ...formData,
      tiers: [...(formData.tiers || []), { min: lastTier?.max || '0', max: '', rate: '' }],
    });
  };

  const removeTier = (index: number) => {
    setFormData({
      ...formData,
      tiers: formData.tiers?.filter((_, i) => i !== index) || [],
    });
  };

  const updateTier = (index: number, field: keyof TierConfig, value: string) => {
    const newTiers = formData.tiers?.map((t, i) => (i === index ? { ...t, [field]: value } : t)) || [];
    setFormData({ ...formData, tiers: newTiers });
  };

  const toggleSpecialGroup = (group: string) => {
    const current = formData.specialGroups || [];
    setFormData({
      ...formData,
      specialGroups: current.includes(group) ? current.filter((g) => g !== group) : [...current, group],
    });
  };

  const filteredRules = rules.filter((r) => r.name.includes(searchTerm) || r.insuranceType.includes(searchTerm));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">待遇政策配置</h1>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />新增规则
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="搜索待遇规则..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredRules.map((rule) => (
          <motion.div key={rule.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{rule.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{rule.insuranceType} / {rule.hospitalLevel}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {rule.status === 'active' ? '生效中' : '已停用'}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><p className="text-gray-400">起付线</p><p className="font-medium">{rule.deductible}元</p></div>
                <div><p className="text-gray-400">封顶线</p><p className="font-medium">{rule.cap}元</p></div>
                <div><p className="text-gray-400">年度限额</p><p className="font-medium">{rule.annualLimit}元</p></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">药品分类:</span>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">{rule.drugClass}</span>
              </div>
              {rule.specialGroups.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">特殊群体:</span>
                  <div className="flex gap-1 flex-wrap">
                    {rule.specialGroups.map((g) => <span key={g} className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded">{g}</span>)}
                  </div>
                </div>
              )}
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <button onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)} className="flex items-center gap-1 text-sm text-cyan-600">
                {expandedRule === rule.id ? <><ChevronUp className="w-4 h-4" />收起</> : <><ChevronDown className="w-4 h-4" />查看分段报销</>}
              </button>
            </div>
            <AnimatePresence>
              {expandedRule === rule.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-gray-50 border-t border-gray-100">
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">分段报销比例</p>
                    <div className="space-y-2">
                      {rule.tiers.map((tier, idx) => (
                        <div key={idx} className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">{tier.min} - {tier.max}元</span>
                          <span className="font-medium text-cyan-600">报销 {tier.rate}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => handleEdit(rule)} className="p-2 text-gray-500 hover:text-cyan-600"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(rule.id)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{editingRule ? '编辑' : '新增'}待遇规则</h3>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">规则名称</label><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">险种类型</label><select value={formData.insuranceType} onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })} className="w-full px-3 py-2 border rounded-lg">{insuranceTypes.map((t) => <option key={t}>{t}</option>)}</select></div>
                  <div><label className="block text-sm font-medium mb-1">医院等级</label><select value={formData.hospitalLevel} onChange={(e) => setFormData({ ...formData, hospitalLevel: e.target.value })} className="w-full px-3 py-2 border rounded-lg">{hospitalLevels.map((l) => <option key={l}>{l}</option>)}</select></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium mb-1">起付线(元)</label><input value={formData.deductible} onChange={(e) => setFormData({ ...formData, deductible: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">封顶线(元)</label><input value={formData.cap} onChange={(e) => setFormData({ ...formData, cap: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">年度限额(元)</label><input value={formData.annualLimit} onChange={(e) => setFormData({ ...formData, annualLimit: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">药品分类</label><select value={formData.drugClass} onChange={(e) => setFormData({ ...formData, drugClass: e.target.value })} className="w-full px-3 py-2 border rounded-lg">{drugClasses.map((c) => <option key={c}>{c}</option>)}</select></div>
                <div>
                  <label className="block text-sm font-medium mb-2">分段报销设置</label>
                  <div className="space-y-2">
                    {formData.tiers?.map((tier, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input placeholder="起付金额" value={tier.min} onChange={(e) => updateTier(idx, 'min', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                        <span className="text-gray-400">-</span>
                        <input placeholder="截止金额" value={tier.max} onChange={(e) => updateTier(idx, 'max', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                        <input placeholder="报销比例%" value={tier.rate} onChange={(e) => updateTier(idx, 'rate', e.target.value)} className="w-24 px-3 py-2 border rounded-lg text-sm" />
                        {formData.tiers!.length > 1 && <button onClick={() => removeTier(idx)} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>}
                      </div>
                    ))}
                    <button onClick={addTier} className="text-sm text-cyan-600 flex items-center gap-1"><Plus className="w-4 h-4" />添加分段</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">特殊群体倾斜</label>
                  <div className="flex flex-wrap gap-2">
                    {specialGroupOptions.map((group) => (
                      <button key={group} onClick={() => toggleSpecialGroup(group)} className={`px-3 py-1 rounded-full text-sm ${formData.specialGroups?.includes(group) ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-600'}`}>
                        {group}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">生效日期</label><input type="date" value={formData.effectiveDate} onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">状态</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} className="w-full px-3 py-2 border rounded-lg"><option value="active">生效中</option><option value="inactive">已停用</option></select></div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">取消</button>
                <button onClick={handleSave} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">保存</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
