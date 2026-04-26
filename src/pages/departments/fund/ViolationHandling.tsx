import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ViolationCase {
  id: string;
  title: string;
  institution: string;
  type: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed';
  date: string;
  handler: string;
  description: string;
}

const mockCases: ViolationCase[] = [
  { id: 'V001', title: '南京某三甲医院门诊慢特病违规结算案', institution: '南京鼓楼医院', type: '违规结算', amount: 186000, status: 'pending', date: '2025-04-26', handler: '顾晨曦', description: '涉及门诊慢特病限定支付规则突破和重复结算。' },
  { id: 'V002', title: '苏州双通道药店串换药品案', institution: '苏州仁和双通道药店', type: '串换药品', amount: 128000, status: 'processing', date: '2025-04-25', handler: '沈雨泽', description: '涉嫌将目录内药品与目录外药品串换后结算。' },
  { id: 'V003', title: '无锡社区医院过度诊疗案', institution: '无锡梁溪社区医院', type: '过度诊疗', amount: 76400, status: 'completed', date: '2025-04-25', handler: '蒋嘉禾', description: '高频重复检验检查与辅助用药使用比例偏高。' },
  { id: 'V004', title: '徐州住院分解结算案', institution: '徐州矿总医院', type: '违规结算', amount: 213500, status: 'processing', date: '2025-04-24', handler: '赵清越', description: '将同一疗程拆分多次住院结算，疑似规避支付限额。' },
  { id: 'V005', title: '常州冒名就医结算案', institution: '常州市第一人民医院', type: '冒名就医', amount: 48200, status: 'pending', date: '2025-04-24', handler: '彭书宁', description: '医保电子凭证和就诊实名信息出现多次不匹配。' },
  { id: 'V006', title: '南通零售药店家庭共济异常案', institution: '南通通州惠民药房', type: '违规结算', amount: 59300, status: 'processing', date: '2025-04-23', handler: '韩承宇', description: '家庭共济账户短期内集中结算慢病药品。' },
  { id: 'V007', title: '连云港门诊统筹超限定支付案', institution: '连云港市第二人民医院', type: '超限定支付用药', amount: 84200, status: 'completed', date: '2025-04-23', handler: '陆晨皓', description: '多例肿瘤辅助用药不符合限定支付条件。' },
  { id: 'V008', title: '淮安长期护理服务回传异常案', institution: '淮安康宁护理院', type: '违规结算', amount: 46800, status: 'processing', date: '2025-04-22', handler: '潘越泽', description: '服务工时、服务人员排班与结算工时不一致。' },
  { id: 'V009', title: '盐城按病种付费入组偏离案', institution: '盐城市人民医院', type: '违规结算', amount: 119600, status: 'pending', date: '2025-04-22', handler: '陶一鸣', description: '多病例病组选择偏高，住院费用显著超均值。' },
  { id: 'V010', title: '扬州中医诊疗项目串换案', institution: '扬州市中医院', type: '串换药品', amount: 53700, status: 'processing', date: '2025-04-21', handler: '高书瑶', description: '中医理疗项目与西医诊疗项目编码混用结算。' },
  { id: 'V011', title: '镇江门诊统筹处方天数异常案', institution: '镇江江大附院', type: '过度诊疗', amount: 62400, status: 'completed', date: '2025-04-21', handler: '顾星野', description: '慢病处方天数超上限并出现重复开药。' },
  { id: 'V012', title: '泰州骨科高值耗材价格执行案', institution: '泰州市人民医院', type: '违规收费', amount: 96800, status: 'processing', date: '2025-04-20', handler: '韩知行', description: '部分骨科耗材执行价格高于集采中选价。' },
  { id: 'V013', title: '宿迁基层医疗机构挂床住院案', institution: '宿迁宿豫区人民医院', type: '冒名就医', amount: 70300, status: 'pending', date: '2025-04-20', handler: '周景言', description: '夜间生命体征记录缺失且住院轨迹异常。' },
  { id: 'V014', title: '南京双通道药店处方回流案', institution: '南京安和双通道药房', type: '串换药品', amount: 132400, status: 'processing', date: '2025-04-19', handler: '钱安和', description: '门诊慢特病处方外流后存在重复回流结算。' },
  { id: 'V015', title: '苏州住院床位费超标准案', institution: '苏州大学附属第一医院', type: '违规收费', amount: 44200, status: 'completed', date: '2025-04-19', handler: '陈昱辰', description: '部分住院床位费项目执行标准不一致。' },
  { id: 'V016', title: '无锡康复项目重复收费案', institution: '无锡市康复医院', type: '违规收费', amount: 51800, status: 'pending', date: '2025-04-18', handler: '梁若川', description: '同日同患者重复计收康复评定项目。' },
  { id: 'V017', title: '徐州肿瘤辅助用药超量案', institution: '徐州市肿瘤医院', type: '超限定支付用药', amount: 88700, status: 'processing', date: '2025-04-18', handler: '方知夏', description: '靶向药合并辅助用药使用超出支付限定范围。' },
  { id: 'V018', title: '南通日间手术拆分结算案', institution: '南通市第一人民医院', type: '违规结算', amount: 61000, status: 'completed', date: '2025-04-17', handler: '乔嘉铭', description: '同一日间手术拆分为多次门诊结算。' },
  { id: 'V019', title: '常州处方流转价格回传异常案', institution: '常州德安药房', type: '违规结算', amount: 35600, status: 'processing', date: '2025-04-17', handler: '夏知远', description: '药店回传价格与医保目录价格不一致。' },
  { id: 'V020', title: '盐城异地就医结算回传不一致案', institution: '盐城市第三人民医院', type: '违规结算', amount: 79000, status: 'pending', date: '2025-04-16', handler: '杜承安', description: '跨省住院结算与病案首页明细存在金额差异。' },
];

const typeOptions = ['违规结算', '过度诊疗', '串换药品', '冒名就医', '违规收费', '超限定支付用药'];
const statusOptions = [
  { value: 'pending', label: '待处理', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  { value: 'processing', label: '处理中', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  { value: 'completed', label: '已结案', color: 'bg-green-100 text-green-700', icon: CheckCircle },
];

export default function ViolationHandling() {
  const [cases, setCases] = useState<ViolationCase[]>(mockCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCase, setEditingCase] = useState<ViolationCase | null>(null);
  const [formData, setFormData] = useState<Partial<ViolationCase>>({});

  const filteredCases = cases.filter((c) => {
    const matchSearch = c.title.includes(searchTerm) || c.institution.includes(searchTerm);
    const matchType = !filterType || c.type === filterType;
    const matchStatus = !filterStatus || c.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const handleAdd = () => {
    setEditingCase(null);
    setFormData({ status: 'pending' });
    setShowModal(true);
  };

  const handleEdit = (c: ViolationCase) => {
    setEditingCase(c);
    setFormData(c);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setCases(cases.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    if (editingCase) {
      setCases(cases.map((c) => c.id === editingCase.id ? { ...c, ...formData } as ViolationCase : c));
    } else {
      const newCase: ViolationCase = {
        id: `V${String(cases.length + 1).padStart(3, '0')}`,
        title: formData.title || '',
        institution: formData.institution || '',
        type: formData.type || typeOptions[0],
        amount: formData.amount || 0,
        status: formData.status as ViolationCase['status'] || 'pending',
        date: new Date().toISOString().split('T')[0],
        handler: formData.handler || '当前用户',
        description: formData.description || '',
      };
      setCases([...cases, newCase]);
    }
    setShowModal(false);
  };

  const handleStatusChange = (id: string, newStatus: ViolationCase['status']) => {
    setCases(cases.map((c) => c.id === id ? { ...c, status: newStatus } : c));
  };

  const getStatusBadge = (status: string) => {
    const s = statusOptions.find((o) => o.value === status);
    if (!s) return null;
    const Icon = s.icon;
    return (
      <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${s.color}`}>
        <Icon className="w-3 h-3" /> {s.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">违规查处</h2>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" /> 新增案件
        </button>
      </div>

      <div className="flex gap-3 bg-white p-3 rounded-lg border border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索案件名称、机构..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
          <option value="">全部类型</option>
          {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
          <option value="">全部状态</option>
          {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">案件信息</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">违规类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">涉及金额</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">经办人</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((c) => (
              <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-800">{c.title}</p>
                    <p className="text-xs text-gray-500">{c.institution} · {c.date}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{c.type}</td>
                <td className="px-4 py-3 text-sm text-red-600 font-medium">¥{c.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{getStatusBadge(c.status)}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{c.handler}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {c.status !== 'completed' && (
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value as ViolationCase['status'])}
                        className="text-xs px-2 py-1 border border-gray-200 rounded"
                      >
                        {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    )}
                    <button onClick={() => handleEdit(c)} className="p-1.5 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{editingCase ? '编辑案件' : '新增案件'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">案件名称</label>
                  <input type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">涉及机构</label>
                  <input type="text" value={formData.institution || ''} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">违规类型</label>
                    <select value={formData.type || ''} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                      {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">涉及金额</label>
                    <input type="number" value={formData.amount || ''} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">案件描述</label>
                  <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
                <button onClick={handleSave} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
