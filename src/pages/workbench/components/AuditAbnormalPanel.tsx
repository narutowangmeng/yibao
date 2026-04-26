import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, ShieldAlert, Building2, UserX, FileSearch,
  CheckCircle, XCircle, Clock, ChevronRight, Filter, Download,
  Eye, MessageSquare, TrendingUp, AlertOctagon
} from 'lucide-react';

const abnormalTypes = [
  { id: 'fee', label: '费用异常', icon: TrendingUp, color: 'orange', count: 23 },
  { id: 'behavior', label: '行为异常', icon: UserX, color: 'red', count: 15 },
  { id: 'institution', label: '机构异常', icon: Building2, color: 'purple', count: 8 }
];

const riskLevels = [
  { id: 'high', label: '高风险', color: 'red', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  { id: 'medium', label: '中风险', color: 'orange', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  { id: 'low', label: '低风险', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
];

const mockAbnormalData = [
  {
    id: 'A001',
    type: 'fee',
    riskLevel: 'high',
    title: '单次住院费用异常偏高',
    description: '患者参保人A在某三甲医院单次住院费用达28.5万元，超出同病种平均费用300%',
    patientName: '参保人A',
    patientId: '110101199001011234',
    institution: '北京协和医院',
    amount: 285000,
    normalAmount: 95000,
    deviation: 300,
    date: '2024-01-15',
    status: 'pending',
    rules: ['单次费用超均值200%', '高值耗材使用异常'],
    evidence: ['费用明细', '病历记录', '检查报告']
  },
  {
    id: 'A002',
    type: 'behavior',
    riskLevel: 'medium',
    title: '频繁门诊就诊',
    description: '患者参保人B30天内门诊就诊12次，涉及5家不同医院',
    patientName: '参保人B',
    patientId: '110101198505056789',
    institution: '多家医院',
    visitCount: 12,
    normalCount: 3,
    date: '2024-01-14',
    status: 'processing',
    rules: ['30天就诊超10次', '跨院就诊异常'],
    evidence: ['就诊记录', '处方记录']
  },
  {
    id: 'A003',
    type: 'institution',
    riskLevel: 'high',
    title: '医疗机构费用增长异常',
    description: '某社区医院本月医保费用环比增长180%，疑似虚假住院',
    institution: '朝阳区社区卫生服务中心',
    amount: 5800000,
    lastMonthAmount: 2070000,
    growth: 180,
    date: '2024-01-13',
    status: 'pending',
    rules: ['月度费用增长超100%', '住院人次异常增长'],
    evidence: ['月度报表', '住院清单', '病案首页']
  }
];

export default function AuditAbnormalPanel() {
  const [activeType, setActiveType] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [auditResult, setAuditResult] = useState('');
  const [auditComment, setAuditComment] = useState('');

  const filteredData = mockAbnormalData.filter(item => {
    if (activeType !== 'all' && item.type !== activeType) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  const handleAudit = (result: string) => {
    setAuditResult(result);
  };

  const submitAudit = () => {
    setSelectedItem(null);
    setAuditResult('');
    setAuditComment('');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {abnormalTypes.map((type) => {
          const Icon = type.icon;
          return (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveType(type.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                activeType === type.id
                  ? `border-${type.color}-500 bg-${type.color}-50`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${type.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${type.color}-600`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{type.label}</p>
                    <p className="text-xs text-gray-500">待核查 {type.count} 条</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'processing', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-cyan-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-cyan-400'
            }`}
          >
            {status === 'all' ? '全部' : status === 'pending' ? '待核查' : status === 'processing' ? '核查中' : '已完成'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">预警编号</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">异常类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">风险等级</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">异常描述</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">涉及对象</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">触发时间</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => {
              const riskConfig = riskLevels.find(r => r.id === item.riskLevel);
              const typeConfig = abnormalTypes.find(t => t.id === item.type);
              return (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{item.id}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded bg-${typeConfig?.color}-100 text-${typeConfig?.color}-700`}>
                      {typeConfig?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${riskConfig?.bg} ${riskConfig?.text} ${riskConfig?.border} border`}>
                      {riskConfig?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 max-w-xs truncate">{item.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.patientName || item.institution}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      item.status === 'completed' ? 'bg-green-100 text-green-700' :
                      item.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {item.status === 'completed' ? '已完成' : item.status === 'processing' ? '核查中' : '待核查'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-cyan-600 hover:bg-cyan-50 rounded"
                    >
                      <Eye className="w-4 h-4" />
                      核查
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{selectedItem.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{selectedItem.description}</p>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-600">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">预警编号</p>
                    <p className="font-mono text-gray-800">{selectedItem.id}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">触发时间</p>
                    <p className="text-gray-800">{selectedItem.date}</p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 flex items-center gap-2 mb-3">
                    <AlertOctagon className="w-5 h-5" />
                    异常指标
                  </h4>
                  <div className="space-y-2">
                    {selectedItem.rules.map((rule: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        {rule}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 flex items-center gap-2 mb-3">
                    <FileSearch className="w-5 h-5" />
                    相关证据
                  </h4>
                  <div className="flex gap-2">
                    {selectedItem.evidence.map((evi: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-white text-blue-700 text-sm rounded border border-blue-200">
                        {evi}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">核查结论</h4>
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => handleAudit('confirmed')}
                      className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
                        auditResult === 'confirmed'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">确认违规</span>
                    </button>
                    <button
                      onClick={() => handleAudit('normal')}
                      className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
                        auditResult === 'normal'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">正常业务</span>
                    </button>
                    <button
                      onClick={() => handleAudit('need_more')}
                      className={`flex-1 py-3 rounded-lg border-2 transition-colors ${
                        auditResult === 'need_more'
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <Clock className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">需进一步核查</span>
                    </button>
                  </div>

                  <textarea
                    value={auditComment}
                    onChange={(e) => setAuditComment(e.target.value)}
                    placeholder="请输入核查意见..."
                    className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  取消
                </button>
                <button
                  onClick={submitAudit}
                  disabled={!auditResult}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  提交核查结果
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
