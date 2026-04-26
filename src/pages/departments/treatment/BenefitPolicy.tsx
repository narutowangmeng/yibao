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

const insuranceTypes = ['职工基本医疗保险', '城乡居民基本医疗保险', '大病保险', '生育保险'];
const hospitalLevels = ['一级医院', '二级医院', '三级医院', '社区医疗机构'];
const drugClasses = ['甲类', '乙类', '丙类'];
const specialGroupOptions = ['低保对象', '特困人员', '重度残疾人', '优抚对象', '老年人'];

export default function BenefitPolicy() {
  const [rules, setRules] = useState<BenefitRule[]>([
    {
      id: '1',
      name: '职工住院报销标准',
      insuranceType: '职工基本医疗保险',
      hospitalLevel: '三级医院',
      deductible: '1000',
      cap: '500000',
      annualLimit: '500000',
      tiers: [
        { min: '0', max: '10000', rate: '85' },
        { min: '10000', max: '50000', rate: '90' },
        { min: '50000', max: '500000', rate: '95' }
      ],
      drugClass: '甲类',
      specialGroups: ['低保对象', '特困人员'],
      status: 'active',
      effectiveDate: '2024-01-01'
    }
  ]);
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
    effectiveDate: ''
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
      effectiveDate: ''
    });
    setShowModal(true);
  };

  const handleEdit = (rule: BenefitRule) => {
    setEditingRule(rule);
    setFormData({ ...rule });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const handleSave = () => {
    if (editingRule) {
      setRules(rules.map(r => r.id === editingRule.id ? { ...r, ...formData } as BenefitRule : r));
    } else {
      setRules([...rules, { id: String(Date.now()), ...formData } as BenefitRule]);
    }
    setShowModal(false);
  };

  const addTier = () => {
    const lastTier = formData.tiers?.[formData.tiers.length - 1];
    setFormData({
      ...formData,
      tiers: [...(formData.tiers || []), { min: lastTier?.max || '0', max: '', rate: '' }]
    });
  };

  const removeTier = (index: number) => {
    setFormData({
      ...formData,
      tiers: formData.tiers?.filter((_, i) => i !== index) || []
    });
  };

  const updateTier = (index: number, field: keyof TierConfig, value: string) => {
    const newTiers = formData.tiers?.map((t, i) => i === index ? { ...t, [field]: value } : t) || [];
    setFormData({ ...formData, tiers: newTiers });
  };

  const toggleSpecialGroup = (group: string) => {
    const current = formData.specialGroups || [];
    setFormData({
      ...formData,
      specialGroups: current.includes(group) ? current.filter(g => g !== group) : [...current, group]
    });
  };

  const filteredRules = rules.filter(r => r.name.includes(searchTerm) || r.insuranceType.includes(searchTerm));

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
          <input type="text" placeholder="搜索规则..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredRules.map(rule => (
          <motion.div key={rule.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{rule.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{rule.insuranceType} · {rule.hospitalLevel}</p>
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
                  <span className="text-sm text-gray-500">特殊人群:</span>
                  <div className="flex gap-1">
                    {rule.specialGroups.map(g => <span key={g} className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded">{g}</span>)}
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
                          <span className="font-medium text-cyan-600">报销{tier.rate}%</span>
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
                  <div><label className="block text-sm font-medium mb-1">险种类型</label><select value={formData.insuranceType} onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })} className="w-full px-3 py-2 border rounded-lg">{insuranceTypes.map(t => <option key={t}>{t}</option>)}</select></div>
                  <div><label className="block text-sm font-medium mb-1">医院等级</label><select value={formData.hospitalLevel} onChange={(e) => setFormData({ ...formData, hospitalLevel: e.target.value })} className="w-full px-3 py-2 border rounded-lg">{hospitalLevels.map(l => <option key={l}>{l}</option>)}</select></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium mb-1">起付线(元)</label><input value={formData.deductible} onChange={(e) => setFormData({ ...formData, deductible: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">封顶线(元)</label><input value={formData.cap} onChange={(e) => setFormData({ ...formData, cap: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-sm font-medium mb-1">年度限额(元)</label><input value={formData.annualLimit} onChange={(e) => setFormData({ ...formData, annualLimit: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">药品分类</label><select value={formData.drugClass} onChange={(e) => setFormData({ ...formData, drugClass: e.target.value })} className="w-full px-3 py-2 border rounded-lg">{drugClasses.map(c => <option key={c}>{c}</option>)}</select></div>
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
                  <label className="block text-sm font-medium mb-2">特殊人群倾斜</label>
                  <div className="flex flex-wrap gap-2">
                    {specialGroupOptions.map(group => (
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
