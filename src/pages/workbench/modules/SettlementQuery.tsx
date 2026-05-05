import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Eye, Search, Upload, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getStoredSettlementSubmissions } from '../../../utils/settlementStorage';

interface SettlementItem {
  id: string;
  institution: string;
  period: string;
  amount: number;
  status: string;
  createTime: string;
  paymentNo: string;
  reconcileResult: string;
  arrivalStatus: string;
  operatorName: string;
  remark: string;
}

const exportHeaders = ['结算单号', '医疗机构', '结算周期', '结算金额', '状态', '申请日期', '拨付单号', '对账结果', '到账状态', '经办人员', '备注'];

const seed: SettlementItem[] = [
  { id: 'JS320100202604001', institution: '南京市第一医院', period: '2026-04', amount: 2850000, status: '已完成', createTime: '2026-04-15', paymentNo: 'BF20260415001', reconcileResult: '已平账', arrivalStatus: '已到账', operatorName: '周岚', remark: '月度住院统筹结算' },
  { id: 'JS320500202604002', institution: '苏州大学附属第一医院', period: '2026-04', amount: 4200000, status: '结算中', createTime: '2026-04-16', paymentNo: 'BF20260416002', reconcileResult: '差异处理中', arrivalStatus: '待到账', operatorName: '陆敏', remark: 'DRG结算复核中' },
  { id: 'JS320200202604003', institution: '无锡市人民医院', period: '2026-04', amount: 1980000, status: '待结算', createTime: '2026-04-17', paymentNo: '', reconcileResult: '待对账', arrivalStatus: '未拨付', operatorName: '钱莉', remark: '待补充完整清单' },
  { id: 'JS320300202604004', institution: '徐州市中心医院', period: '2026-04', amount: 2560000, status: '已完成', createTime: '2026-04-18', paymentNo: 'BF20260418004', reconcileResult: '已平账', arrivalStatus: '已到账', operatorName: '赵静', remark: '专项结算完成' },
  { id: 'JS320400202604005', institution: '常州市第二人民医院', period: '2026-04', amount: 1740000, status: '对账中', createTime: '2026-04-19', paymentNo: 'BF20260419005', reconcileResult: '银行回单待核', arrivalStatus: '待确认', operatorName: '蒋雯', remark: '到账回单未回传' },
  { id: 'JS320600202604006', institution: '南通市第一人民医院', period: '2026-04', amount: 2230000, status: '已完成', createTime: '2026-04-20', paymentNo: 'BF20260420006', reconcileResult: '已平账', arrivalStatus: '已到账', operatorName: '高宁', remark: '区域月度拨付完成' },
];

export default function SettlementQuery({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState<SettlementItem[]>([...getStoredSettlementSubmissions(), ...seed]);
  const [keyword, setKeyword] = useState('');
  const [selectedItem, setSelectedItem] = useState<SettlementItem | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => rows.filter((item) => [item.id, item.institution, item.paymentNo, item.operatorName].some((value) => value.includes(keyword))),
    [rows, keyword],
  );

  const toRow = (item: SettlementItem) => ({
    结算单号: item.id,
    医疗机构: item.institution,
    结算周期: item.period,
    结算金额: item.amount,
    状态: item.status,
    申请日期: item.createTime,
    拨付单号: item.paymentNo,
    对账结果: item.reconcileResult,
    到账状态: item.arrivalStatus,
    经办人员: item.operatorName,
    备注: item.remark,
  });

  const writeWorkbook = (data: Array<Record<string, string | number>>, fileName: string) => {
    const sheet = XLSX.utils.json_to_sheet(data, { header: exportHeaders });
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, '基金结算查询');
    XLSX.writeFile(book, fileName);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '', raw: false });
    const importedRows = data
      .filter((item) => item['结算单号'] && item['医疗机构'])
      .map((item, index) => ({
        id: String(item['结算单号'] || `JSIMP${String(index + 1).padStart(4, '0')}`),
        institution: String(item['医疗机构'] || ''),
        period: String(item['结算周期'] || ''),
        amount: Number(item['结算金额'] || 0),
        status: String(item['状态'] || '待结算'),
        createTime: String(item['申请日期'] || ''),
        paymentNo: String(item['拨付单号'] || ''),
        reconcileResult: String(item['对账结果'] || ''),
        arrivalStatus: String(item['到账状态'] || ''),
        operatorName: String(item['经办人员'] || ''),
        remark: String(item['备注'] || ''),
      }));

    if (importedRows.length) setRows((prev) => [...importedRows, ...prev]);
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">基金结算查询</h1>
              <p className="text-sm text-gray-500">基金结算、拨付、到账、对账统一查询与导入导出</p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4"><div className="text-sm text-gray-500">结算记录</div><div className="mt-2 text-3xl font-bold text-gray-800">{rows.length}</div></div>
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4"><div className="text-sm text-green-700">已完成</div><div className="mt-2 text-3xl font-bold text-green-600">{rows.filter((item) => item.status === '已完成').length}</div></div>
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4"><div className="text-sm text-yellow-700">处理中</div><div className="mt-2 text-3xl font-bold text-yellow-600">{rows.filter((item) => item.status !== '已完成').length}</div></div>
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4"><div className="text-sm text-cyan-700">已到账</div><div className="mt-2 text-3xl font-bold text-cyan-600">{rows.filter((item) => item.arrivalStatus === '已到账').length}</div></div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="请输入结算单号、医疗机构、拨付单号、经办人员查询" className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4" />
            </div>
            <button onClick={() => writeWorkbook(seed.slice(0, 3).map(toRow), '基金结算导入模板.xlsx')} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
              <Download className="h-4 w-4" />
              下载模板
            </button>
            <button onClick={() => importRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-cyan-300 px-4 py-2 text-cyan-700 hover:bg-cyan-50">
              <Upload className="h-4 w-4" />
              导入台账
            </button>
            <button onClick={() => writeWorkbook(filtered.map(toRow), `基金结算查询结果_${new Date().toISOString().slice(0, 10)}.xlsx`)} className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
              <Download className="h-4 w-4" />
              导出结果
            </button>
            <input ref={importRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[1120px]">
            <thead className="bg-gray-50">
              <tr>
                {['结算单号', '医疗机构', '结算周期', '结算金额', '状态', '拨付单号', '到账状态', '经办人员', '操作'].map((header) => (
                  <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-600">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-cyan-600">{item.id}</td>
                  <td className="px-4 py-3">{item.institution}</td>
                  <td className="px-4 py-3">{item.period}</td>
                  <td className="px-4 py-3">￥{item.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">{item.paymentNo || '-'}</td>
                  <td className="px-4 py-3">{item.arrivalStatus}</td>
                  <td className="px-4 py-3">{item.operatorName}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedItem(item)} className="rounded p-2 text-cyan-600 hover:bg-cyan-50">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedItem(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-3xl rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b p-6">
                <h3 className="text-lg font-bold text-gray-800">结算详情 - {selectedItem.id}</h3>
                <button onClick={() => setSelectedItem(null)} className="rounded p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-4 p-6 text-sm">
                <div className="rounded-xl border p-4">
                  <h4 className="mb-3 font-bold">基础信息</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">医疗机构</span><span>{selectedItem.institution}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">结算周期</span><span>{selectedItem.period}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">申请日期</span><span>{selectedItem.createTime}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">经办人员</span><span>{selectedItem.operatorName}</span></div>
                  </div>
                </div>
                <div className="rounded-xl border p-4">
                  <h4 className="mb-3 font-bold">结算状态</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">结算金额</span><span>￥{selectedItem.amount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">状态</span><span>{selectedItem.status}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">拨付单号</span><span>{selectedItem.paymentNo || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">到账状态</span><span>{selectedItem.arrivalStatus}</span></div>
                  </div>
                </div>
                <div className="rounded-xl border bg-blue-50 p-4">
                  <h4 className="mb-2 font-bold">对账结果</h4>
                  <div className="text-gray-700">{selectedItem.reconcileResult}</div>
                </div>
                <div className="rounded-xl border bg-gray-50 p-4">
                  <h4 className="mb-2 font-bold">备注</h4>
                  <div className="text-gray-700">{selectedItem.remark}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
