import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { getAgencyLevel } from '../../../config/managementPermissions';

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

interface BenefitPolicyProps {
  userAgency: string;
}

const insuranceTypes = ['职工基本医疗保险', '城乡居民基本医疗保险', '公务员医疗补助', '大病保险'];
const hospitalLevels = ['三级甲等医院', '三级医院', '二级医院', '一级及社区医疗机构'];
const drugClasses = ['甲类', '乙类', '丙类'];
const specialGroupOptions = ['低保对象', '特困人员', '重度残疾人', '高龄老人', '退役军人优抚对象'];

const initialRules: BenefitRule[] = [
  {
    id: '1',
    name: '南京职工医保三级甲等医院住院待遇',
    insuranceType: '职工基本医疗保险',
    hospitalLevel: '三级甲等医院',
    deductible: '1200',
    cap: '300000',
    annualLimit: '450000',
    tiers: [
      { min: '0', max: '10000', rate: '85' },
      { min: '10000', max: '50000', rate: '90' },
      { min: '50000', max: '300000', rate: '93' },
    ],
    drugClass: '甲类',
    specialGroups: ['高龄老人'],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '2',
    name: '无锡居民医保二级医院住院待遇',
    insuranceType: '城乡居民基本医疗保险',
    hospitalLevel: '二级医院',
    deductible: '1000',
    cap: '180000',
    annualLimit: '260000',
    tiers: [
      { min: '0', max: '10000', rate: '65' },
      { min: '10000', max: '50000', rate: '72' },
      { min: '50000', max: '180000', rate: '75' },
    ],
    drugClass: '甲类',
    specialGroups: ['低保对象', '特困人员'],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '3',
    name: '徐州门诊慢特病高血压待遇',
    insuranceType: '城乡居民基本医疗保险',
    hospitalLevel: '一级及社区医疗机构',
    deductible: '0',
    cap: '3000',
    annualLimit: '3000',
    tiers: [
      { min: '0', max: '1500', rate: '70' },
      { min: '1500', max: '3000', rate: '75' },
    ],
    drugClass: '乙类',
    specialGroups: ['高龄老人'],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '4',
    name: '常州双通道药品支付待遇',
    insuranceType: '职工基本医疗保险',
    hospitalLevel: '三级甲等医院',
    deductible: '0',
    cap: '100000',
    annualLimit: '100000',
    tiers: [
      { min: '0', max: '30000', rate: '85' },
      { min: '30000', max: '60000', rate: '88' },
      { min: '60000', max: '100000', rate: '90' },
    ],
    drugClass: '乙类',
    specialGroups: ['重度残疾人'],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '5',
    name: '苏州职工医保三级医院门诊统筹待遇',
    insuranceType: '职工基本医疗保险',
    hospitalLevel: '三级医院',
    deductible: '600',
    cap: '15000',
    annualLimit: '15000',
    tiers: [
      { min: '0', max: '5000', rate: '70' },
      { min: '5000', max: '10000', rate: '75' },
      { min: '10000', max: '15000', rate: '80' },
    ],
    drugClass: '甲类',
    specialGroups: [],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '6',
    name: '南通居民医保三级医院住院待遇',
    insuranceType: '城乡居民基本医疗保险',
    hospitalLevel: '三级医院',
    deductible: '1500',
    cap: '200000',
    annualLimit: '300000',
    tiers: [
      { min: '0', max: '15000', rate: '60' },
      { min: '15000', max: '50000', rate: '68' },
      { min: '50000', max: '200000', rate: '72' },
    ],
    drugClass: '甲类',
    specialGroups: ['低保对象'],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '7',
    name: '连云港居民医保社区医院门诊慢特病糖尿病待遇',
    insuranceType: '城乡居民基本医疗保险',
    hospitalLevel: '一级及社区医疗机构',
    deductible: '0',
    cap: '3600',
    annualLimit: '3600',
    tiers: [
      { min: '0', max: '1800', rate: '72' },
      { min: '1800', max: '3600', rate: '78' },
    ],
    drugClass: '乙类',
    specialGroups: ['高龄老人'],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '8',
    name: '淮安职工医保二级医院住院待遇',
    insuranceType: '职工基本医疗保险',
    hospitalLevel: '二级医院',
    deductible: '800',
    cap: '260000',
    annualLimit: '400000',
    tiers: [
      { min: '0', max: '10000', rate: '88' },
      { min: '10000', max: '50000', rate: '92' },
      { min: '50000', max: '260000', rate: '94' },
    ],
    drugClass: '甲类',
    specialGroups: [],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '9',
    name: '盐城大病保险年度二次补偿待遇',
    insuranceType: '大病保险',
    hospitalLevel: '三级甲等医院',
    deductible: '18000',
    cap: '500000',
    annualLimit: '500000',
    tiers: [
      { min: '18000', max: '50000', rate: '60' },
      { min: '50000', max: '100000', rate: '65' },
      { min: '100000', max: '500000', rate: '70' },
    ],
    drugClass: '甲类',
    specialGroups: ['特困人员'],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '10',
    name: '扬州公务员医疗补助门诊待遇',
    insuranceType: '公务员医疗补助',
    hospitalLevel: '三级医院',
    deductible: '0',
    cap: '20000',
    annualLimit: '20000',
    tiers: [
      { min: '0', max: '10000', rate: '90' },
      { min: '10000', max: '20000', rate: '95' },
    ],
    drugClass: '甲类',
    specialGroups: [],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '11',
    name: '镇江职工医保门诊慢特病恶性肿瘤放化疗待遇',
    insuranceType: '职工基本医疗保险',
    hospitalLevel: '三级甲等医院',
    deductible: '0',
    cap: '80000',
    annualLimit: '80000',
    tiers: [
      { min: '0', max: '30000', rate: '88' },
      { min: '30000', max: '60000', rate: '90' },
      { min: '60000', max: '80000', rate: '92' },
    ],
    drugClass: '乙类',
    specialGroups: ['重度残疾人'],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '12',
    name: '泰州居民医保生育住院待遇',
    insuranceType: '城乡居民基本医疗保险',
    hospitalLevel: '二级医院',
    deductible: '500',
    cap: '12000',
    annualLimit: '12000',
    tiers: [
      { min: '0', max: '6000', rate: '65' },
      { min: '6000', max: '12000', rate: '70' },
    ],
    drugClass: '甲类',
    specialGroups: [],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '13',
    name: '宿迁居民医保异地转诊住院待遇',
    insuranceType: '城乡居民基本医疗保险',
    hospitalLevel: '三级甲等医院',
    deductible: '1800',
    cap: '180000',
    annualLimit: '260000',
    tiers: [
      { min: '0', max: '10000', rate: '55' },
      { min: '10000', max: '50000', rate: '60' },
      { min: '50000', max: '180000', rate: '65' },
    ],
    drugClass: '甲类',
    specialGroups: ['特困人员'],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '14',
    name: '南京灵活就业人员住院待遇',
    insuranceType: '职工基本医疗保险',
    hospitalLevel: '二级医院',
    deductible: '1000',
    cap: '220000',
    annualLimit: '320000',
    tiers: [
      { min: '0', max: '10000', rate: '82' },
      { min: '10000', max: '50000', rate: '88' },
      { min: '50000', max: '220000', rate: '90' },
    ],
    drugClass: '甲类',
    specialGroups: [],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '15',
    name: '无锡退休人员社区医院普通门诊待遇',
    insuranceType: '职工基本医疗保险',
    hospitalLevel: '一级及社区医疗机构',
    deductible: '0',
    cap: '8000',
    annualLimit: '8000',
    tiers: [
      { min: '0', max: '4000', rate: '85' },
      { min: '4000', max: '8000', rate: '90' },
    ],
    drugClass: '甲类',
    specialGroups: ['高龄老人'],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '16',
    name: '徐州居民医保双通道药店购药待遇',
    insuranceType: '城乡居民基本医疗保险',
    hospitalLevel: '一级及社区医疗机构',
    deductible: '0',
    cap: '50000',
    annualLimit: '50000',
    tiers: [
      { min: '0', max: '20000', rate: '65' },
      { min: '20000', max: '35000', rate: '70' },
      { min: '35000', max: '50000', rate: '75' },
    ],
    drugClass: '乙类',
    specialGroups: ['低保对象'],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '17',
    name: '常州职工医保日间手术待遇',
    insuranceType: '职工基本医疗保险',
    hospitalLevel: '三级医院',
    deductible: '300',
    cap: '50000',
    annualLimit: '50000',
    tiers: [
      { min: '0', max: '10000', rate: '85' },
      { min: '10000', max: '30000', rate: '90' },
      { min: '30000', max: '50000', rate: '92' },
    ],
    drugClass: '甲类',
    specialGroups: [],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '18',
    name: '苏州居民医保门诊特药待遇',
    insuranceType: '城乡居民基本医疗保险',
    hospitalLevel: '三级甲等医院',
    deductible: '0',
    cap: '60000',
    annualLimit: '60000',
    tiers: [
      { min: '0', max: '20000', rate: '70' },
      { min: '20000', max: '40000', rate: '75' },
      { min: '40000', max: '60000', rate: '80' },
    ],
    drugClass: '乙类',
    specialGroups: ['特困人员'],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '19',
    name: '南通居民医保基层首诊转诊待遇',
    insuranceType: '城乡居民基本医疗保险',
    hospitalLevel: '一级及社区医疗机构',
    deductible: '200',
    cap: '80000',
    annualLimit: '120000',
    tiers: [
      { min: '0', max: '10000', rate: '72' },
      { min: '10000', max: '30000', rate: '76' },
      { min: '30000', max: '80000', rate: '80' },
    ],
    drugClass: '甲类',
    specialGroups: [],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
  {
    id: '20',
    name: '盐城退役军人优抚对象门诊补助待遇',
    insuranceType: '公务员医疗补助',
    hospitalLevel: '三级医院',
    deductible: '0',
    cap: '12000',
    annualLimit: '12000',
    tiers: [
      { min: '0', max: '6000', rate: '92' },
      { min: '6000', max: '12000', rate: '95' },
    ],
    drugClass: '甲类',
    specialGroups: ['退役军人优抚对象'],
    status: 'active',
    effectiveDate: '2026-01-01',
  },
];

export default function BenefitPolicy({ userAgency }: BenefitPolicyProps) {
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
  const isProvince = getAgencyLevel(userAgency) === 'province';

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
    setRules((prev) => prev.filter((rule) => rule.id !== id));
  };

  const handleSave = () => {
    if (editingRule) {
      setRules((prev) => prev.map((rule) => (rule.id === editingRule.id ? ({ ...rule, ...formData } as BenefitRule) : rule)));
    } else {
      setRules((prev) => [...prev, { id: String(Date.now()), ...formData } as BenefitRule]);
    }
    setShowModal(false);
  };

  const addTier = () => {
    const lastTier = formData.tiers?.[formData.tiers.length - 1];
    setFormData((prev) => ({
      ...prev,
      tiers: [...(prev.tiers || []), { min: lastTier?.max || '0', max: '', rate: '' }],
    }));
  };

  const removeTier = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tiers: prev.tiers?.filter((_, tierIndex) => tierIndex !== index) || [],
    }));
  };

  const updateTier = (index: number, field: keyof TierConfig, value: string) => {
    setFormData((prev) => ({
      ...prev,
      tiers: prev.tiers?.map((tier, tierIndex) => (tierIndex === index ? { ...tier, [field]: value } : tier)) || [],
    }));
  };

  const toggleSpecialGroup = (group: string) => {
    setFormData((prev) => {
      const currentGroups = prev.specialGroups || [];
      return {
        ...prev,
        specialGroups: currentGroups.includes(group)
          ? currentGroups.filter((item) => item !== group)
          : [...currentGroups, group],
      };
    });
  };

  const filteredRules = rules.filter((rule) => rule.name.includes(searchTerm) || rule.insuranceType.includes(searchTerm));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">待遇政策配置</h1>
        {isProvince ? (
          <button onClick={handleAdd} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
            <Plus className="h-4 w-4" />
            新增规则
          </button>
        ) : (
          <div className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700">
            地市账号仅可查看待遇政策，不能新增、修改或删除
          </div>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="搜索待遇规则..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredRules.map((rule) => (
          <motion.div key={rule.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{rule.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {rule.insuranceType} / {rule.hospitalLevel}
                  </p>
                </div>
                <span className={`rounded px-2 py-1 text-xs ${rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {rule.status === 'active' ? '生效中' : '已停用'}
                </span>
              </div>
            </div>
            <div className="space-y-3 p-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">起付线</p>
                  <p className="font-medium">{rule.deductible}元</p>
                </div>
                <div>
                  <p className="text-gray-400">封顶线</p>
                  <p className="font-medium">{rule.cap}元</p>
                </div>
                <div>
                  <p className="text-gray-400">年度限额</p>
                  <p className="font-medium">{rule.annualLimit}元</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">药品分类:</span>
                <span className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-600">{rule.drugClass}</span>
              </div>
              {rule.specialGroups.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">特殊群体:</span>
                  <div className="flex flex-wrap gap-1">
                    {rule.specialGroups.map((group) => (
                      <span key={group} className="rounded bg-orange-50 px-2 py-1 text-xs text-orange-600">
                        {group}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
              <button onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)} className="flex items-center gap-1 text-sm text-cyan-600">
                {expandedRule === rule.id ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    收起
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    查看分段报销
                  </>
                )}
              </button>
            </div>
            <AnimatePresence>
              {expandedRule === rule.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-gray-100 bg-gray-50">
                  <div className="p-4">
                    <p className="mb-2 text-sm font-medium text-gray-700">分段报销比例</p>
                    <div className="space-y-2">
                      {rule.tiers.map((tier, index) => (
                        <div key={index} className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">
                            {tier.min} - {tier.max}元
                          </span>
                          <span className="font-medium text-cyan-600">报销 {tier.rate}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {isProvince && (
              <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-4 py-3">
                <button onClick={() => handleEdit(rule)} className="p-2 text-gray-500 hover:text-cyan-600">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(rule.id)} className="p-2 text-gray-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">{editingRule ? '编辑' : '新增'}待遇规则</h3>
                <button onClick={() => setShowModal(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">规则名称</label>
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">险种类型</label>
                    <select value={formData.insuranceType} onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })} className="w-full rounded-lg border px-3 py-2">
                      {insuranceTypes.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">医院等级</label>
                    <select value={formData.hospitalLevel} onChange={(e) => setFormData({ ...formData, hospitalLevel: e.target.value })} className="w-full rounded-lg border px-3 py-2">
                      {hospitalLevels.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">起付线(元)</label>
                    <input value={formData.deductible} onChange={(e) => setFormData({ ...formData, deductible: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">封顶线(元)</label>
                    <input value={formData.cap} onChange={(e) => setFormData({ ...formData, cap: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">年度限额(元)</label>
                    <input value={formData.annualLimit} onChange={(e) => setFormData({ ...formData, annualLimit: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">药品分类</label>
                  <select value={formData.drugClass} onChange={(e) => setFormData({ ...formData, drugClass: e.target.value })} className="w-full rounded-lg border px-3 py-2">
                    {drugClasses.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">分段报销设置</label>
                  <div className="space-y-2">
                    {formData.tiers?.map((tier, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input placeholder="起付金额" value={tier.min} onChange={(e) => updateTier(index, 'min', e.target.value)} className="flex-1 rounded-lg border px-3 py-2 text-sm" />
                        <span className="text-gray-400">-</span>
                        <input placeholder="截止金额" value={tier.max} onChange={(e) => updateTier(index, 'max', e.target.value)} className="flex-1 rounded-lg border px-3 py-2 text-sm" />
                        <input placeholder="比例%" value={tier.rate} onChange={(e) => updateTier(index, 'rate', e.target.value)} className="w-24 rounded-lg border px-3 py-2 text-sm" />
                        {formData.tiers!.length > 1 && (
                          <button onClick={() => removeTier(index)} className="p-2 text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={addTier} className="flex items-center gap-1 text-sm text-cyan-600">
                      <Plus className="h-4 w-4" />
                      添加分段
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">特殊群体倾斜</label>
                  <div className="flex flex-wrap gap-2">
                    {specialGroupOptions.map((group) => (
                      <button
                        key={group}
                        onClick={() => toggleSpecialGroup(group)}
                        className={`rounded-full px-3 py-1 text-sm ${formData.specialGroups?.includes(group) ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">生效日期</label>
                    <input type="date" value={formData.effectiveDate} onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">状态</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} className="w-full rounded-lg border px-3 py-2">
                      <option value="active">生效中</option>
                      <option value="inactive">已停用</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2">取消</button>
                <button onClick={handleSave} className="rounded-lg bg-cyan-600 px-4 py-2 text-white">保存</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
