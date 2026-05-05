import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, CheckCircle, Eye, History, Ban, RotateCcw, Send } from 'lucide-react';

interface SettlementExceptionProps {
  onClose: () => void;
  onBack: () => void;
}

const exceptionTypes = [
  { id: 'amount', label: '金额异常', color: 'bg-red-100 text-red-700' },
  { id: 'data', label: '数据异常', color: 'bg-orange-100 text-orange-700' },
  { id: 'time', label: '时效异常', color: 'bg-yellow-100 text-yellow-700' },
] as const;

type ExceptionStatus = 'pending' | 'processing' | 'resolved';

interface SettlementExceptionItem {
  id: string;
  type: typeof exceptionTypes[number]['id'];
  institution: string;
  city: string;
  amount: number;
  reason: string;
  status: ExceptionStatus;
  time: string;
  suggestion: string;
  history: string[];
}

const initialRows: SettlementExceptionItem[] = [
  { id: 'SE320001', type: 'amount', institution: '南京市第一医院', city: '南京', amount: 2850000, reason: '结算金额与机构申报金额差异 6.8 万元', status: 'pending', time: '2026-05-02 09:30', suggestion: '核对DRG病组扣减清单与总账汇总表是否一致', history: ['2026-05-02 09:30 系统生成异常单', '2026-05-02 09:42 已推送结算岗待处理'] },
  { id: 'SE320002', type: 'data', institution: '苏州大学附属第一医院', city: '苏州', amount: 4200000, reason: '病案首页与结算清单主手术编码不一致', status: 'processing', time: '2026-05-02 10:12', suggestion: '联系机构补传病案首页并重新校验', history: ['2026-05-02 10:12 数据规则触发', '2026-05-02 10:30 已通知机构补正'] },
  { id: 'SE320003', type: 'time', institution: '无锡市人民医院', city: '无锡', amount: 1980000, reason: '超出月度结算申报时效 2 个工作日', status: 'resolved', time: '2026-05-02 10:48', suggestion: '保留逾期说明并纳入本次结算', history: ['2026-05-02 10:48 识别超期', '2026-05-02 11:05 机构提交逾期说明', '2026-05-02 11:18 已结案'] },
  { id: 'SE320004', type: 'amount', institution: '徐州市中心医院', city: '徐州', amount: 2560000, reason: '高值耗材汇总金额高于明细累计', status: 'pending', time: '2026-05-02 11:20', suggestion: '核查骨科高值耗材批次表与结算汇总表', history: ['2026-05-02 11:20 金额校验失败'] },
  { id: 'SE320005', type: 'data', institution: '南通大学附属医院', city: '南通', amount: 2230000, reason: '生育门诊费用重复归集至住院包干', status: 'processing', time: '2026-05-02 11:56', suggestion: '拆分门诊与住院费用后重新生成结算单', history: ['2026-05-02 11:56 规则命中', '2026-05-02 12:15 已发起人工复核'] },
];

export default function SettlementException({ onBack }: SettlementExceptionProps) {
  const [rows, setRows] = useState<SettlementExceptionItem[]>(initialRows);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedException, setSelectedException] = useState<string | null>(initialRows[0]?.id ?? null);

  const filteredData = useMemo(() => (selectedType === 'all' ? rows : rows.filter((item) => item.type === selectedType)), [rows, selectedType]);

  const getStatusBadge = (status: ExceptionStatus) => {
    const styles = { pending: 'bg-red-100 text-red-700', processing: 'bg-yellow-100 text-yellow-700', resolved: 'bg-green-100 text-green-700' };
    const labels = { pending: '待处理', processing: '处理中', resolved: '已解决' };
    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const selectedData = rows.find((item) => item.id === selectedException);

  const handleAction = (type: 'normal' | 'blacklist' | 'recalc' | 'notice') => {
    if (!selectedData) return;
    const actionText = {
      normal: '已标记正常',
      blacklist: '已加入重点监控',
      recalc: '已发起重新结算',
      notice: '已发送机构通知',
    }[type];
    const nextStatus: ExceptionStatus = type === 'normal' ? 'resolved' : 'processing';

    setRows((prev) =>
      prev.map((item) =>
        item.id === selectedData.id
          ? {
              ...item,
              status: nextStatus,
              history: [`${new Date().toLocaleString('zh-CN', { hour12: false })} ${actionText}`, ...item.history],
            }
          : item,
      ),
    );
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100"><ArrowLeft className="h-5 w-5" /></button>
        <h3 className="text-xl font-bold">结算异常处理</h3>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setSelectedType('all')} className={`rounded-lg px-4 py-2 text-sm ${selectedType === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>全部</button>
        {exceptionTypes.map((type) => (
          <button key={type.id} onClick={() => setSelectedType(type.id)} className={`rounded-lg px-4 py-2 text-sm ${selectedType === type.id ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>{type.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-xl border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">异常单号</th><th className="px-4 py-3 text-left text-sm">类型</th><th className="px-4 py-3 text-left text-sm">医疗机构</th><th className="px-4 py-3 text-left text-sm">地市</th><th className="px-4 py-3 text-left text-sm">金额</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-right text-sm">操作</th></tr></thead>
              <tbody className="divide-y">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-cyan-700">{item.id}</td>
                    <td className="px-4 py-3"><span className={`rounded px-2 py-1 text-xs ${exceptionTypes.find((t) => t.id === item.type)?.color}`}>{exceptionTypes.find((t) => t.id === item.type)?.label}</span></td>
                    <td className="px-4 py-3">{item.institution}</td>
                    <td className="px-4 py-3">{item.city}</td>
                    <td className="px-4 py-3">￥{item.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                    <td className="px-4 py-3 text-right"><button onClick={() => setSelectedException(item.id)} className="p-2 text-gray-400 hover:text-red-600"><Eye className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          {selectedData ? (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3 rounded-xl border bg-white p-4">
              <h4 className="font-semibold">异常详情</h4>
              <div className="rounded-lg bg-red-50 p-3">
                <div className="text-sm font-medium text-red-600">异常原因</div>
                <div className="text-sm">{selectedData.reason}</div>
              </div>
              <div className="space-y-1 text-sm">
                <div><span className="text-gray-500">单号：</span>{selectedData.id}</div>
                <div><span className="text-gray-500">机构：</span>{selectedData.institution}</div>
                <div><span className="text-gray-500">地市：</span>{selectedData.city}</div>
                <div><span className="text-gray-500">发现时间：</span>{selectedData.time}</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-sm">
                <div className="mb-1 font-medium text-gray-700">处理建议</div>
                <div>{selectedData.suggestion}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleAction('normal')} className="flex items-center justify-center gap-1 rounded bg-green-50 p-2 text-sm text-green-600"><CheckCircle className="h-4 w-4" />标记正常</button>
                <button onClick={() => handleAction('blacklist')} className="flex items-center justify-center gap-1 rounded bg-red-50 p-2 text-sm text-red-600"><Ban className="h-4 w-4" />重点监控</button>
                <button onClick={() => handleAction('recalc')} className="flex items-center justify-center gap-1 rounded bg-blue-50 p-2 text-sm text-blue-600"><RotateCcw className="h-4 w-4" />重新结算</button>
                <button onClick={() => handleAction('notice')} className="flex items-center justify-center gap-1 rounded bg-amber-50 p-2 text-sm text-amber-600"><Send className="h-4 w-4" />通知机构</button>
              </div>
              <div className="rounded-lg border p-3">
                <div className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700"><History className="h-4 w-4" />处理历史</div>
                <div className="space-y-2 text-sm text-gray-600">
                  {selectedData.history.map((entry) => (
                    <div key={entry} className="flex items-start gap-2">
                      <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                      <span>{entry}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-xl bg-gray-50 p-8 text-center text-gray-400"><AlertTriangle className="mx-auto mb-2 h-12 w-12" /><p>请选择异常单据</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
