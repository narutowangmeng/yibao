import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldAlert, Eye, CheckCircle, Ban, RotateCcw, History, X, Building2, Calendar, AlertTriangle, Search } from 'lucide-react';

interface Violation {
  id: string;
  institution: string;
  city: string;
  type: string;
  amount: number;
  recovery: string;
  status: 'pending' | 'processing' | 'completed';
  date: string;
  description: string;
  evidence: string[];
  decision: string;
}

const mockViolations: Violation[] = [
  { id: 'VH320001', institution: '江苏省人民医院', city: '南京', type: '过度医疗', amount: 45000, recovery: '2.5 万元', status: 'pending', date: '2026-04-20', description: '骨科住院病例存在不必要检查与超适应症耗材使用。', evidence: ['病案首页', '耗材授权单', '收费清单'], decision: '拟追回基金并责令限期整改' },
  { id: 'VH320002', institution: '苏州雷允上双通道药房', city: '苏州', type: '串换药品', amount: 120000, recovery: '6.8 万元', status: 'processing', date: '2026-04-19', description: '双通道药品销售台账与医保结算药品编码不完全一致。', evidence: ['销售记录', '药品目录对照表', '审方留痕'], decision: '已进入行政处理流程，待补充药师说明' },
  { id: 'VH320003', institution: '无锡市人民医院', city: '无锡', type: '虚假住院', amount: 28000, recovery: '1.6 万元', status: 'completed', date: '2026-04-18', description: '存在住院指征不足仍办理住院结算的情况。', evidence: ['住院记录', '费用清单', '出院小结'], decision: '已追回基金并暂停相关医师医保结算权限' },
  { id: 'VH320004', institution: '徐州市中心医院', city: '徐州', type: '重复收费', amount: 36200, recovery: '1.2 万元', status: 'pending', date: '2026-04-22', description: '同日同患者存在理疗项目重复记费。', evidence: ['收费明细', '医嘱单', '诊疗记录'], decision: '待下发处理告知书' },
  { id: 'VH320005', institution: '常州市第二人民医院', city: '常州', type: '分解收费', amount: 51800, recovery: '2.9 万元', status: 'processing', date: '2026-04-23', description: '部分检查项目拆分计费，高于价格标准。', evidence: ['价格项目表', '收费清单', '检查申请单'], decision: '已责令整改并启动复核' },
  { id: 'VH320006', institution: '扬州大学附属医院', city: '扬州', type: '过度医疗', amount: 67300, recovery: '3.1 万元', status: 'completed', date: '2026-04-24', description: '肿瘤辅助治疗中存在超疗程结算疑点。', evidence: ['病历摘要', '化疗方案', '结算清单'], decision: '已追回基金并约谈科室负责人' },
];

const violationTypes = [
  { id: 'over', label: '过度医疗', color: 'bg-red-100 text-red-700' },
  { id: 'fake', label: '虚假住院', color: 'bg-orange-100 text-orange-700' },
  { id: 'swap', label: '串换药品', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'repeat', label: '重复收费', color: 'bg-blue-100 text-blue-700' },
  { id: 'split', label: '分解收费', color: 'bg-purple-100 text-purple-700' },
];

export default function ViolationHandle({ onBack }: { onBack: () => void }) {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [violations, setViolations] = useState<Violation[]>(mockViolations);
  const [showDetail, setShowDetail] = useState(false);
  const [toast, setToast] = useState('');
  const [keyword, setKeyword] = useState('');

  const filteredData = useMemo(() => {
    const byType = selectedType === 'all' ? violations : violations.filter((item) => item.type === violationTypes.find((t) => t.id === selectedType)?.label);
    return byType.filter((item) => [item.id, item.institution, item.city, item.type].some((field) => field.includes(keyword)));
  }, [selectedType, violations, keyword]);

  const selectedData = violations.find((item) => item.id === selectedId);

  const handleView = (id: string) => {
    setSelectedId(id);
    setShowDetail(true);
  };

  const handleAction = (action: string) => {
    if (!selectedId) return;
    setViolations((prev) =>
      prev.map((item) =>
        item.id === selectedId
          ? { ...item, status: action === 'punish' || action === 'complete' ? 'completed' : 'processing' }
          : item,
      ),
    );
    const messages: Record<string, string> = {
      complete: '已确认整改完成',
      punish: '已执行处罚并归档',
      recheck: '已发起重新核查',
    };
    setToast(messages[action] || '操作成功');
    setTimeout(() => setToast(''), 1800);
    setShowDetail(false);
  };

  const getStatusBadge = (status: Violation['status']) => {
    const styles = { pending: 'bg-red-100 text-red-700', processing: 'bg-yellow-100 text-yellow-700', completed: 'bg-green-100 text-green-700' };
    const labels = { pending: '待处理', processing: '处理中', completed: '已处置' };
    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100"><ArrowLeft className="h-5 w-5" /></button>
        <h3 className="text-xl font-bold">违规查处</h3>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={() => setSelectedType('all')} className={`rounded-lg px-4 py-2 text-sm ${selectedType === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>全部</button>
          {violationTypes.map((item) => <button key={item.id} onClick={() => setSelectedType(item.id)} className={`rounded-lg px-4 py-2 text-sm ${selectedType === item.id ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>{item.label}</button>)}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-72 rounded-lg border py-2 pl-10 pr-3" placeholder="搜索单号、机构、地市、类型" />
        </div>
      </div>

      <div className="rounded-xl border bg-white">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">单号</th><th className="px-4 py-3 text-left text-sm">类型</th><th className="px-4 py-3 text-left text-sm">机构</th><th className="px-4 py-3 text-left text-sm">地市</th><th className="px-4 py-3 text-left text-sm">涉及金额</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-right text-sm">操作</th></tr></thead>
          <tbody className="divide-y">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-cyan-700">{item.id}</td>
                <td className="px-4 py-3"><span className={`rounded px-2 py-1 text-xs ${violationTypes.find((t) => t.label === item.type)?.color || 'bg-gray-100'}`}>{item.type}</span></td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3">{item.city}</td>
                <td className="px-4 py-3">￥{item.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => handleView(item.id)} className="rounded p-2 text-gray-400 hover:text-red-600"><Eye className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showDetail && selectedData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowDetail(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="mx-4 w-full max-w-2xl rounded-xl bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="flex items-center gap-2 text-lg font-bold"><ShieldAlert className="h-5 w-5 text-red-600" />违规详情</h4>
                  <button onClick={() => setShowDetail(false)} className="rounded p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg bg-red-50 p-3"><div className="text-sm font-medium text-red-600">违规类型</div><div className="text-sm">{selectedData.type}</div></div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-gray-400" /><span className="text-gray-500">机构：</span>{selectedData.institution}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" /><span className="text-gray-500">日期：</span>{selectedData.date}</div>
                    <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-gray-400" /><span className="text-gray-500">金额：</span>￥{selectedData.amount.toLocaleString()}</div>
                    <div><span className="text-gray-500">基金追回：</span>{selectedData.recovery}</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3"><div className="mb-1 text-sm font-medium">违规描述</div><div className="text-sm text-gray-600">{selectedData.description}</div></div>
                  <div className="rounded-lg bg-blue-50 p-3"><div className="mb-1 text-sm font-medium">处理决定</div><div className="text-sm text-gray-600">{selectedData.decision}</div></div>
                  <div className="rounded-lg bg-gray-50 p-3"><div className="mb-1 text-sm font-medium">证据材料</div><div className="flex flex-wrap gap-2">{selectedData.evidence.map((item) => <span key={item} className="rounded border bg-white px-2 py-1 text-xs">{item}</span>)}</div></div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleAction('complete')} className="flex items-center justify-center gap-1 rounded bg-green-50 p-2 text-sm text-green-600 hover:bg-green-100"><CheckCircle className="h-4 w-4" />整改完成</button>
                    <button onClick={() => handleAction('punish')} className="flex items-center justify-center gap-1 rounded bg-red-50 p-2 text-sm text-red-600 hover:bg-red-100"><Ban className="h-4 w-4" />处罚归档</button>
                    <button onClick={() => handleAction('recheck')} className="flex items-center justify-center gap-1 rounded bg-blue-50 p-2 text-sm text-blue-600 hover:bg-blue-100"><RotateCcw className="h-4 w-4" />重新核查</button>
                    <button className="flex items-center justify-center gap-1 rounded bg-gray-50 p-2 text-sm text-gray-600 hover:bg-gray-100"><History className="h-4 w-4" />历史记录</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-4 right-4 z-50 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg">{toast}</motion.div>}
      </AnimatePresence>
    </div>
  );
}
