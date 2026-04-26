import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  History,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  FileText,
  MessageSquare
} from 'lucide-react';

interface AuditItem {
  id: string;
  type: 'reimbursement' | 'payment' | 'institution' | 'insured';
  title: string;
  applicant: string;
  amount?: number;
  submitTime: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  remarks?: string;
}

const typeLabels: Record<string, string> = {
  reimbursement: '报销审核',
  payment: '缴费审核',
  institution: '机构审核',
  insured: '参保审核',
};

const typeColors: Record<string, string> = {
  reimbursement: 'bg-blue-100 text-blue-700',
  payment: 'bg-green-100 text-green-700',
  institution: 'bg-purple-100 text-purple-700',
  insured: 'bg-orange-100 text-orange-700',
};

const priorityConfig = {
  high: { color: 'text-red-600 bg-red-50', label: '紧急' },
  medium: { color: 'text-yellow-600 bg-yellow-50', label: '一般' },
  low: { color: 'text-gray-600 bg-gray-50', label: '普通' },
};

export default function AuditCenter() {
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'rules'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [auditItems, setAuditItems] = useState<AuditItem[]>([
    { id: '1', type: 'reimbursement', title: '住院费用报销申请', applicant: '参保人A', amount: 15800, submitTime: '2024-01-15 09:30', status: 'pending', priority: 'high' },
    { id: '2', type: 'institution', title: '定点医疗机构资质审核', applicant: '仁爱医院', submitTime: '2024-01-15 10:15', status: 'pending', priority: 'medium' },
    { id: '3', type: 'payment', title: '企业医保缴费核定', applicant: '科技有限公司', amount: 45000, submitTime: '2024-01-14 16:45', status: 'pending', priority: 'low' },
    { id: '4', type: 'reimbursement', title: '门诊特殊病种报销', applicant: '参保人B', amount: 3200, submitTime: '2024-01-14 11:20', status: 'approved', priority: 'medium' },
    { id: '5', type: 'insured', title: '医保关系转移接续', applicant: '参保人C', submitTime: '2024-01-13 14:00', status: 'rejected', priority: 'high' },
  ]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<AuditItem | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [remarks, setRemarks] = useState('');

  const filteredItems = auditItems.filter(item => {
    if (activeTab === 'pending') return item.status === 'pending';
    if (activeTab === 'history') return item.status !== 'pending';
    return true;
  }).filter(item =>
    item.title.includes(searchQuery) || item.applicant.includes(searchQuery)
  );

  const stats = {
    pending: auditItems.filter(i => i.status === 'pending').length,
    today: auditItems.filter(i => i.status !== 'pending').length,
    avgTime: '2.5小时',
    passRate: '94%',
  };

  const handleViewDetail = (item: AuditItem) => {
    setCurrentItem(item);
    setShowDetailModal(true);
  };

  const handleAction = (item: AuditItem, action: 'approve' | 'reject') => {
    setCurrentItem(item);
    setActionType(action);
    setRemarks('');
    setShowActionModal(true);
  };

  const handleSubmitAction = () => {
    if (currentItem) {
      setAuditItems(auditItems.map(item =>
        item.id === currentItem.id
          ? { ...item, status: actionType, remarks }
          : item
      ));
      setShowActionModal(false);
      setCurrentItem(null);
      setRemarks('');
    }
  };

  const handleToggleRule = (ruleName: string) => {
    // 规则开关逻辑
    console.log('Toggle rule:', ruleName);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '待审核', value: stats.pending, icon: Clock, color: 'text-orange-600' },
          { label: '今日已审', value: stats.today, icon: CheckCircle, color: 'text-green-600' },
          { label: '平均耗时', value: stats.avgTime, icon: History, color: 'text-blue-600' },
          { label: '通过率', value: stats.passRate, icon: ClipboardCheck, color: 'text-purple-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex gap-2">
            {[
              { id: 'pending', label: '待审核', icon: Clock },
              { id: 'history', label: '审核历史', icon: History },
              { id: 'rules', label: '审核规则', icon: Settings },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#0891B2] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索审核事项..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0891B2] w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>
        </div>

        {activeTab !== 'rules' ? (
          <div className="divide-y divide-gray-100">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[item.type]}`}>
                      {typeLabels[item.type]}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        申请人: {item.applicant} {item.amount && `· 金额: ¥${item.amount.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityConfig[item.priority].color}`}>
                      {priorityConfig[item.priority].label}
                    </span>
                    <span className="text-sm text-gray-400">{item.submitTime}</span>
                    {item.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(item, 'approve')}
                          className="flex items-center gap-1 px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />通过
                        </button>
                        <button
                          onClick={() => handleAction(item, 'reject')}
                          className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                        >
                          <XCircle className="w-4 h-4" />驳回
                        </button>
                      </div>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.status === 'approved' ? '已通过' : '已驳回'}
                      </span>
                    )}
                    <button
                      onClick={() => handleViewDetail(item)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {[
              { name: '报销金额上限校验', desc: '单次报销金额不超过5万元', status: 'enabled' },
              { name: '医疗机构资质校验', desc: '审核机构是否为定点医疗单位', status: 'enabled' },
              { name: '重复报销检测', desc: '检测同一费用是否重复申请', status: 'enabled' },
              { name: '参保状态校验', desc: '审核时校验申请人参保状态', status: 'disabled' },
            ].map((rule, index) => (
              <motion.div
                key={rule.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-800">{rule.name}</p>
                    <p className="text-sm text-gray-500">{rule.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleRule(rule.name)}
                    className={`px-3 py-1 rounded text-xs transition-colors ${
                      rule.status === 'enabled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {rule.status === 'enabled' ? '已启用' : '已禁用'}
                  </button>
                  <button className="text-sm text-[#0891B2] hover:underline">配置</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 详情弹窗 */}
      {showDetailModal && currentItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">审核详情</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-gray-500">申请类型</label><p>{typeLabels[currentItem.type]}</p></div>
                <div><label className="text-sm text-gray-500">优先级</label><p>{priorityConfig[currentItem.priority].label}</p></div>
              </div>
              <div><label className="text-sm text-gray-500">申请标题</label><p className="font-medium">{currentItem.title}</p></div>
              <div><label className="text-sm text-gray-500">申请人</label><p>{currentItem.applicant}</p></div>
              {currentItem.amount && <div><label className="text-sm text-gray-500">金额</label><p className="font-medium text-lg">¥{currentItem.amount.toLocaleString()}</p></div>}
              <div><label className="text-sm text-gray-500">提交时间</label><p>{currentItem.submitTime}</p></div>
              <div><label className="text-sm text-gray-500">审核状态</label>
                <span className={`px-2 py-1 rounded text-xs ${
                  currentItem.status === 'approved' ? 'bg-green-100 text-green-700' :
                  currentItem.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {currentItem.status === 'approved' ? '已通过' : currentItem.status === 'rejected' ? '已驳回' : '待审核'}
                </span>
              </div>
              {currentItem.remarks && (
                <div><label className="text-sm text-gray-500">审核备注</label><p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{currentItem.remarks}</p></div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* 审核操作弹窗 */}
      {showActionModal && currentItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              {actionType === 'approve' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              )}
              <h3 className="text-lg font-semibold">{actionType === 'approve' ? '通过审核' : '驳回申请'}</h3>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">申请: {currentItem.title}</p>
              <p className="text-sm text-gray-600">申请人: {currentItem.applicant}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                审核意见
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                placeholder={actionType === 'approve' ? '请输入通过意见（可选）' : '请输入驳回原因（必填）'}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0891B2] text-sm"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowActionModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
              <button
                onClick={handleSubmitAction}
                className={`px-4 py-2 rounded-lg text-white ${
                  actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                确认{actionType === 'approve' ? '通过' : '驳回'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
