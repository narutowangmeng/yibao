import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Eye, History, Shield, Ban, UserCheck, FileText } from 'lucide-react';

interface ExceptionHandleProps {
  onClose: () => void;
  onBack: () => void;
}

const exceptionTypes = [
  { id: 'amount', label: '金额异常', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  { id: 'frequency', label: '频次异常', color: 'bg-orange-100 text-orange-700', icon: History },
  { id: 'hospital', label: '医院异常', color: 'bg-purple-100 text-purple-700', icon: Shield },
  { id: 'drug', label: '药品异常', color: 'bg-blue-100 text-blue-700', icon: FileText },
];

const riskLevels = [
  { id: 'high', label: '高风险', color: 'bg-red-500' },
  { id: 'medium', label: '中风险', color: 'bg-orange-500' },
  { id: 'low', label: '低风险', color: 'bg-yellow-500' },
];

const mockExceptions = [
  { id: 'E001', type: 'amount', applicant: '张三', amount: 85000, risk: 'high', status: 'pending', reason: '单次报销金额超出正常范围3倍', time: '2024-01-20 09:30' },
  { id: 'E002', type: 'frequency', applicant: '李四', amount: 3200, risk: 'medium', status: 'processing', reason: '30天内门诊次数达15次', time: '2024-01-20 10:15' },
  { id: 'E003', type: 'hospital', applicant: '王五', amount: 56000, risk: 'high', status: 'pending', reason: '就诊医院存在违规记录', time: '2024-01-19 14:20' },
  { id: 'E004', type: 'drug', applicant: '赵六', amount: 12800, risk: 'low', status: 'resolved', reason: '药品使用与诊断不符', time: '2024-01-18 16:45' },
];

const handleActions = [
  { id: 'normal', label: '标记正常', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  { id: 'blacklist', label: '加入黑名单', icon: Ban, color: 'text-red-600 bg-red-50' },
  { id: 'review', label: '人工复核', icon: UserCheck, color: 'text-blue-600 bg-blue-50' },
  { id: 'audit', label: '转稽核', icon: Shield, color: 'text-purple-600 bg-purple-50' },
];

export default function ExceptionHandle({ onBack }: ExceptionHandleProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedException, setSelectedException] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const filteredExceptions = selectedType === 'all'
    ? mockExceptions
    : mockExceptions.filter(e => e.type === selectedType);

  const getStatusBadge = (status: string) => {
    const styles = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', resolved: 'bg-green-100 text-green-700' };
    const labels = { pending: '待处理', processing: '处理中', resolved: '已处理' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  const selectedData = mockExceptions.find(e => e.id === selectedException);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" /> 返回
        </button>
        <h3 className="text-xl font-bold text-gray-800">异常处理</h3>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedType === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          全部异常
        </button>
        {exceptionTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedType === type.id ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <type.icon className="w-4 h-4" /> {type.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b">
            <h4 className="font-semibold text-gray-800">异常单据列表</h4>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">单号</th>
                <th className="px-4 py-3 text-left text-sm font-medium">异常类型</th>
                <th className="px-4 py-3 text-left text-sm font-medium">申请人</th>
                <th className="px-4 py-3 text-left text-sm font-medium">金额</th>
                <th className="px-4 py-3 text-left text-sm font-medium">风险等级</th>
                <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredExceptions.map(item => (
                <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.id}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${exceptionTypes.find(t => t.id === item.type)?.color}`}>
                      {exceptionTypes.find(t => t.id === item.type)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">{item.applicant}</td>
                  <td className="px-4 py-3">¥{item.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${riskLevels.find(r => r.id === item.risk)?.color}`} />
                      <span className="text-xs">{riskLevels.find(r => r.id === item.risk)?.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelectedException(item.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          {selectedData ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">异常详情</h4>
                <button onClick={() => setShowHistory(!showHistory)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                  <History className="w-4 h-4" /> 历史记录
                </button>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="text-sm text-red-600 font-medium mb-1">异常原因</div>
                  <div className="text-sm text-gray-700">{selectedData.reason}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">单号:</span> {selectedData.id}</div>
                  <div><span className="text-gray-500">申请人:</span> {selectedData.applicant}</div>
                  <div><span className="text-gray-500">金额:</span> ¥{selectedData.amount.toLocaleString()}</div>
                  <div><span className="text-gray-500">时间:</span> {selectedData.time}</div>
                </div>
                <div className="border-t pt-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">处理建议</div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    建议进行人工复核，核实就诊真实性和费用合理性
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {handleActions.map(action => (
                    <button key={action.id} className={`flex items-center justify-center gap-2 p-2 rounded-lg text-sm font-medium ${action.color} hover:opacity-80 transition-opacity`}>
                      <action.icon className="w-4 h-4" /> {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>请选择异常单据查看详情</p>
            </div>
          )}

          {showHistory && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-800 mb-3">处理历史</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>2024-01-20 10:30</span>
                  <span>系统自动标记异常</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>2024-01-20 09:15</span>
                  <span>单据提交审核</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
