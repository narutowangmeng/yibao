import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Search, Building2, FileText, History, ShieldCheck } from 'lucide-react';

interface SettlementAuditProps {
  onClose: () => void;
  onBack: () => void;
}

interface SettlementAuditItem {
  id: string;
  institution: string;
  institutionType: string;
  city: string;
  period: string;
  amount: number;
  caseCount: number;
  drgAmount: number;
  dipAmount: number;
  reserveAmount: number;
  status: 'pending';
  submitTime: string;
  operator: string;
  summary: string;
  riskHint: string;
}

const seeds = [
  ['SA3201001', '江苏省人民医院', '三级甲等医院', '南京', '2026-04', 4680000, 1240, 3280000, 920000, 480000, '2026-05-02 09:18', '周岚', '住院统筹与门诊慢特病月度汇总结算', '高值耗材病组均次费用偏高，需复核扣减说明'],
  ['SA3205002', '苏州大学附属第一医院', '三级甲等医院', '苏州', '2026-04', 4200000, 1138, 2960000, 840000, 400000, '2026-05-02 09:46', '陆敏', 'DRG付费病例与特药结算批次合并提交', '病案首页编码抽检待确认'],
  ['SA3202003', '无锡市人民医院', '三级甲等医院', '无锡', '2026-04', 2850000, 865, 1980000, 560000, 310000, '2026-05-02 10:15', '钱莉', '普通住院结算及异地转诊病例汇总', '异地病例上传清单中有2条明细待补正'],
  ['SA3203004', '徐州市中心医院', '三级甲等医院', '徐州', '2026-04', 2560000, 792, 1730000, 520000, 310000, '2026-05-02 10:42', '赵静', '双通道药品及住院结算批次', '双通道药品清单与处方流转编号需抽核'],
  ['SA3204005', '常州市第二人民医院', '三级甲等医院', '常州', '2026-04', 1740000, 648, 1160000, 360000, 220000, '2026-05-02 11:08', '蒋雯', '门诊统筹与日间手术批次结算', '日间手术病种映射规则待复核'],
  ['SA3206006', '南通大学附属医院', '三级甲等医院', '南通', '2026-04', 2230000, 706, 1520000, 410000, 300000, '2026-05-02 11:33', '高宁', '生育住院及普通住院合并结算', '生育门诊检查归集口径需确认'],
];

const initialData: SettlementAuditItem[] = seeds.map((item) => ({
  id: item[0],
  institution: item[1],
  institutionType: item[2],
  city: item[3],
  period: item[4],
  amount: item[5] as number,
  caseCount: item[6] as number,
  drgAmount: item[7] as number,
  dipAmount: item[8] as number,
  reserveAmount: item[9] as number,
  submitTime: item[10],
  operator: item[11],
  summary: item[12],
  riskHint: item[13],
  status: 'pending',
}));

const historyRecords = [
  { time: '2026-05-02 09:30', action: '机构提交结算申请', operator: '医院结算专员', status: 'success' },
  { time: '2026-05-02 10:05', action: '系统自动校验通过', operator: '智能审核引擎', status: 'success' },
  { time: '2026-05-02 10:36', action: '经办初审完成', operator: '基金结算岗', status: 'success' },
];

export default function SettlementAudit({ onBack }: SettlementAuditProps) {
  const [rows, setRows] = useState<SettlementAuditItem[]>(initialData);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [auditComment, setAuditComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState('');

  const selectedItem = rows.find((item) => item.id === selectedId);
  const filteredData = useMemo(
    () => rows.filter((item) => [item.institution, item.id, item.city, item.summary].some((field) => field.includes(searchTerm))),
    [rows, searchTerm],
  );

  const handleDecision = (type: 'approve' | 'reject') => {
    if (!selectedItem) return;
    if (!auditComment.trim()) {
      setToast('请输入审核意见');
      setTimeout(() => setToast(''), 1500);
      return;
    }
    setRows((prev) => prev.filter((item) => item.id !== selectedItem.id));
    setToast(type === 'approve' ? '已通过结算审核' : '已驳回并退回机构补正');
    setSelectedId(null);
    setAuditComment('');
    setTimeout(() => setToast(''), 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed right-4 top-4 z-50 rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-bold">结算审核</h3>
        </div>
        <span className="text-sm text-gray-500">待审核 {filteredData.length} 笔</span>
      </div>

      {!selectedId ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="搜索机构、单号、地市、结算摘要" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-lg border py-2 pl-10 pr-4" />
          </div>

          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="w-full min-w-[980px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">结算单号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">医疗机构</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">地市</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">结算周期</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">申请金额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">病例数</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-cyan-700">{item.id}</td>
                    <td className="px-4 py-3">{item.institution}</td>
                    <td className="px-4 py-3">{item.city}</td>
                    <td className="px-4 py-3">{item.period}</td>
                    <td className="px-4 py-3 font-medium">￥{item.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">{item.caseCount}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelectedId(item.id)} className="rounded-lg bg-cyan-600 px-3 py-1.5 text-sm text-white">进入审核</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{selectedItem?.institution}</span>
              <span className="rounded-full bg-white px-2 py-1 text-xs text-gray-500">{selectedItem?.institutionType}</span>
            </div>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div><span className="text-gray-500">参保地市：</span>{selectedItem?.city}</div>
              <div><span className="text-gray-500">结算周期：</span>{selectedItem?.period}</div>
              <div><span className="text-gray-500">申请金额：</span>￥{selectedItem?.amount.toLocaleString()}</div>
              <div><span className="text-gray-500">提交时间：</span>{selectedItem?.submitTime}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border bg-white p-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium"><FileText className="h-4 w-4 text-cyan-600" />结算构成</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">DRG结算金额</span><span>￥{selectedItem?.drgAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">DIP结算金额</span><span>￥{selectedItem?.dipAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">预留金</span><span>￥{selectedItem?.reserveAmount.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">结算病例数</span><span>{selectedItem?.caseCount}</span></div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium"><ShieldCheck className="h-4 w-4 text-cyan-600" />审核要点</h4>
              <div className="space-y-3 text-sm">
                <div className="rounded-lg bg-gray-50 p-3 text-gray-700">{selectedItem?.summary}</div>
                <div className="rounded-lg bg-red-50 p-3 text-gray-700">{selectedItem?.riskHint}</div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <h4 className="mb-3 flex items-center gap-2 font-medium"><History className="h-4 w-4 text-cyan-600" />流转记录</h4>
              <div className="space-y-2 text-sm">
                {historyRecords.map((record) => (
                  <div key={`${record.time}-${record.action}`} className="flex items-start gap-2">
                    <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <div className="text-gray-700">{record.action}</div>
                      <div className="text-xs text-gray-500">{record.time} · {record.operator}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">审核意见</label>
            <textarea value={auditComment} onChange={(e) => setAuditComment(e.target.value)} placeholder="请输入审核意见、扣减说明、退回原因等" className="h-24 w-full resize-none rounded-lg border px-3 py-2" />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setSelectedId(null)} className="flex-1 rounded-lg border py-2 hover:bg-gray-50">返回</button>
            <button onClick={() => handleDecision('reject')} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 py-2 text-red-600 hover:bg-red-50">
              <XCircle className="h-4 w-4" />
              驳回
            </button>
            <button onClick={() => handleDecision('approve')} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700">
              <CheckCircle className="h-4 w-4" />
              通过
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
