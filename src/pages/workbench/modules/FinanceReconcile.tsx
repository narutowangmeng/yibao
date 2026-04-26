import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, RefreshCw, Settings, Eye, Edit, FileText, Scale } from 'lucide-react';

interface FinanceReconcileProps {
  onBack: () => void;
}

const mockRules = [
  { id: 'R001', name: '银行流水对账', source: '医保系统', target: '银行系统', matchFields: ['交易日期', '交易金额'], tolerance: 0.01, status: 'active' },
  { id: 'R002', name: '税务数据对账', source: '医保系统', target: '税务系统', matchFields: ['纳税人识别号', '缴费金额'], tolerance: 0, status: 'active' },
];

const mockDifferences = [
  { id: 'D001', type: '金额不符', bankAmount: 50000, systemAmount: 50000, diff: 0, status: 'matched', reason: '' },
  { id: 'D002', type: '银行多笔', bankAmount: 120000, systemAmount: 100000, diff: 20000, status: 'unmatched', reason: '待核实' },
  { id: 'D003', type: '系统漏记', bankAmount: 0, systemAmount: 35000, diff: -35000, status: 'unmatched', reason: '' },
];

export default function FinanceReconcile({ onBack }: FinanceReconcileProps) {
  const [activeTab, setActiveTab] = useState<'rules' | 'execute' | 'diff'>('rules');
  const [showAddRule, setShowAddRule] = useState(false);
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload');
  const [selectedDiff, setSelectedDiff] = useState<string | null>(null);
  const [diffReason, setDiffReason] = useState('');

  const handleUpload = () => {
    setStep('processing');
    setTimeout(() => setStep('result'), 1500);
  };

  const matchedCount = mockDifferences.filter(d => d.status === 'matched').length;
  const unmatchedCount = mockDifferences.filter(d => d.status === 'unmatched').length;

  const handleAdjustDiff = (diffId: string) => {
    setSelectedDiff(diffId);
    const diff = mockDifferences.find(d => d.id === diffId);
    setDiffReason(diff?.reason || '');
  };

  const handleSaveReason = () => {
    setSelectedDiff(null);
    setDiffReason('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">自动对账</h2>
        </div>

        <div className="flex gap-2 border-b border-gray-200 mb-6">
          {[
            { id: 'rules', label: '对账规则', icon: Settings },
            { id: 'execute', label: '对账执行', icon: RefreshCw },
            { id: 'diff', label: '差异处理', icon: Scale },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'rules' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">对账规则配置</h3>
              <button onClick={() => setShowAddRule(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600">
                <Settings className="w-4 h-4" />新增规则
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">规则名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">数据源</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">对账目标</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">匹配字段</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">容忍度</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockRules.map(rule => (
                  <tr key={rule.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{rule.name}</td>
                    <td className="px-4 py-3 text-gray-600">{rule.source}</td>
                    <td className="px-4 py-3 text-gray-600">{rule.target}</td>
                    <td className="px-4 py-3">{rule.matchFields.join(', ')}</td>
                    <td className="px-4 py-3">{rule.tolerance > 0 ? `±${rule.tolerance}` : '严格匹配'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${rule.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {rule.status === 'active' ? '启用' : '停用'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1.5 text-gray-400 hover:text-amber-600"><Edit className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showAddRule && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg">
                  <h3 className="text-lg font-semibold mb-4">新增对账规则</h3>
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1">规则名称</label><input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="请输入规则名称" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium mb-1">数据源</label><select className="w-full px-3 py-2 border rounded-lg"><option>医保系统</option><option>银行系统</option></select></div>
                      <div><label className="block text-sm font-medium mb-1">对账目标</label><select className="w-full px-3 py-2 border rounded-lg"><option>银行系统</option><option>税务系统</option></select></div>
                    </div>
                    <div><label className="block text-sm font-medium mb-1">匹配字段</label><input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="如：交易日期,交易金额" /></div>
                    <div><label className="block text-sm font-medium mb-1">差异容忍度</label><input type="number" className="w-full px-3 py-2 border rounded-lg" placeholder="0.01" /></div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button onClick={() => setShowAddRule(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
                    <button onClick={() => setShowAddRule(false)} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">保存</button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'execute' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 p-6">
            {step === 'upload' && (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-amber-300 rounded-xl p-12 text-center hover:border-amber-500 cursor-pointer transition-colors bg-amber-50" onClick={handleUpload}>
                  <Upload className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                  <p className="text-lg font-medium text-gray-700">点击上传银行对账单</p>
                  <p className="text-sm text-gray-500 mt-2">支持 Excel、CSV 格式</p>
                </div>
                <div className="flex justify-center">
                  <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-600">
                    <FileText className="w-4 h-4" />下载模板
                  </button>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 mx-auto text-amber-500 animate-spin mb-4" />
                <p className="text-lg font-medium">系统自动对账中...</p>
                <p className="text-sm text-gray-500 mt-2">正在比对银行流水与系统数据</p>
              </div>
            )}

            {step === 'result' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                    <p className="text-2xl font-bold text-green-600">{matchedCount}</p>
                    <p className="text-sm text-gray-600">匹配成功</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
                    <p className="text-2xl font-bold text-red-600">{unmatchedCount}</p>
                    <p className="text-sm text-gray-600">存在差异</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 text-center border border-amber-200">
                    <p className="text-2xl font-bold text-amber-600">{mockDifferences.length}</p>
                    <p className="text-sm text-gray-600">总笔数</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border">
                  <div className="px-4 py-3 border-b bg-gray-50 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="font-medium">对账结果明细</span>
                  </div>
                  <table className="w-full">
                    <thead className="bg-gray-50 text-sm">
                      <tr>
                        <th className="px-4 py-2 text-left">差异类型</th>
                        <th className="px-4 py-2 text-right">银行金额</th>
                        <th className="px-4 py-2 text-right">系统金额</th>
                        <th className="px-4 py-2 text-right">差额</th>
                        <th className="px-4 py-2 text-center">状态</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {mockDifferences.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="px-4 py-3">{item.type}</td>
                          <td className="px-4 py-3 text-right">¥{item.bankAmount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">¥{item.systemAmount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-medium" style={{ color: item.diff > 0 ? 'red' : 'green' }}>
                            {item.diff > 0 ? '+' : ''}{item.diff.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.status === 'matched' ? (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">已匹配</span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">待处理</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-3">
                  <button onClick={() => setStep('upload')} className="px-4 py-2 border rounded-lg hover:bg-gray-50">重新导入</button>
                  <button onClick={() => setActiveTab('diff')} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2">
                    <Scale className="w-4 h-4" />处理差异
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'diff' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">差异处理</h3>
            <div className="space-y-4">
              {mockDifferences.filter(d => d.status === 'unmatched').map(diff => (
                <div key={diff.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium">{diff.type}</span>
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">待处理</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>银行金额: <span className="font-medium">¥{diff.bankAmount.toLocaleString()}</span></div>
                        <div>系统金额: <span className="font-medium">¥{diff.systemAmount.toLocaleString()}</span></div>
                        <div>差额: <span className="font-medium text-red-600">¥{diff.diff.toLocaleString()}</span></div>
                      </div>
                    </div>
                    <button onClick={() => handleAdjustDiff(diff.id)} className="p-2 text-amber-600 hover:bg-amber-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  {diff.reason && <p className="mt-2 text-sm text-gray-500">原因: {diff.reason}</p>}
                </div>
              ))}
            </div>

            {selectedDiff && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">差异原因标注</h3>
                  <textarea
                    value={diffReason}
                    onChange={(e) => setDiffReason(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg mb-4"
                    rows={3}
                    placeholder="请输入差异原因..."
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setSelectedDiff(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
                    <button onClick={handleSaveReason} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">保存</button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
