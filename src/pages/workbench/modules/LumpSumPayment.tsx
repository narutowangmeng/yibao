import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, FileText, CheckCircle, AlertCircle, Coins, ChevronRight, Search, X } from 'lucide-react';

interface LumpSumCase {
  id: string;
  name: string;
  idCard: string;
  insuredNo: string;
  city: string;
  type: '退休趸缴' | '一次性补缴';
  insuranceType: string;
  remainingMonths: number;
  baseAmount: number;
  amount: number;
  status: '待核定' | '已测算' | '已提交';
}

const rows: LumpSumCase[] = [
  { id: 'DJ001', name: '刘成海', idCard: '320102196605124511', insuredNo: '320100000214587639', city: '南京', type: '退休趸缴', insuranceType: '职工基本医疗保险', remainingMonths: 36, baseAmount: 5120, amount: 18432, status: '待核定' },
  { id: 'DJ002', name: '谢丽萍', idCard: '320205196709083628', insuredNo: '320200000315482671', city: '无锡', type: '退休趸缴', insuranceType: '职工基本医疗保险', remainingMonths: 24, baseAmount: 4980, amount: 11952, status: '已测算' },
  { id: 'DJ003', name: '唐国安', idCard: '320303196412184833', insuredNo: '320300000421385796', city: '徐州', type: '一次性补缴', insuranceType: '灵活就业人员基本医疗保险', remainingMonths: 60, baseAmount: 4630, amount: 33336, status: '待核定' },
  { id: 'DJ004', name: '徐春梅', idCard: '320402196810266127', insuredNo: '320400000587214365', city: '常州', type: '退休趸缴', insuranceType: '职工基本医疗保险', remainingMonths: 18, baseAmount: 5250, amount: 11340, status: '已提交' },
  { id: 'DJ005', name: '顾建华', idCard: '320507196512023419', insuredNo: '320500000317495826', city: '苏州', type: '一次性补缴', insuranceType: '灵活就业人员基本医疗保险', remainingMonths: 48, baseAmount: 5060, amount: 29145.6, status: '待核定' },
  { id: 'DJ006', name: '施红英', idCard: '320602196711205724', insuredNo: '320600000219465738', city: '南通', type: '退休趸缴', insuranceType: '职工基本医疗保险', remainingMonths: 30, baseAmount: 4890, amount: 17604, status: '已测算' },
  { id: 'DJ007', name: '姜卫东', idCard: '320703196403113611', insuredNo: '320700000354129687', city: '连云港', type: '一次性补缴', insuranceType: '灵活就业人员基本医疗保险', remainingMonths: 72, baseAmount: 4380, amount: 37843.2, status: '待核定' },
  { id: 'DJ008', name: '骆丽君', idCard: '320803196905296526', insuredNo: '320800000425673918', city: '淮安', type: '退休趸缴', insuranceType: '职工基本医疗保险', remainingMonths: 12, baseAmount: 4720, amount: 6796.8, status: '已提交' },
  { id: 'DJ009', name: '殷树成', idCard: '320902196606184373', insuredNo: '320900000514829736', city: '盐城', type: '一次性补缴', insuranceType: '灵活就业人员基本医疗保险', remainingMonths: 54, baseAmount: 4520, amount: 29311.2, status: '待核定' },
  { id: 'DJ010', name: '龚晓岚', idCard: '321002196801156625', insuredNo: '321000000689473521', city: '扬州', type: '退休趸缴', insuranceType: '职工基本医疗保险', remainingMonths: 20, baseAmount: 5010, amount: 12024, status: '已测算' },
  { id: 'DJ011', name: '朱德勇', idCard: '321102196503275818', insuredNo: '321100000296487153', city: '镇江', type: '一次性补缴', insuranceType: '灵活就业人员基本医疗保险', remainingMonths: 42, baseAmount: 4460, amount: 22478.4, status: '待核定' },
  { id: 'DJ012', name: '钱月芬', idCard: '321202196712234225', insuredNo: '321200000381465927', city: '泰州', type: '退休趸缴', insuranceType: '职工基本医疗保险', remainingMonths: 16, baseAmount: 4840, amount: 9292.8, status: '已提交' },
  { id: 'DJ013', name: '冯长林', idCard: '321302196410146412', insuredNo: '321300000417926358', city: '宿迁', type: '一次性补缴', insuranceType: '灵活就业人员基本医疗保险', remainingMonths: 66, baseAmount: 4310, amount: 34135.2, status: '待核定' },
  { id: 'DJ014', name: '范桂枝', idCard: '320104196811054248', insuredNo: '320100000538216479', city: '南京', type: '退休趸缴', insuranceType: '职工基本医疗保险', remainingMonths: 14, baseAmount: 4930, amount: 8282.4, status: '已测算' },
  { id: 'DJ015', name: '程志远', idCard: '320585196601123832', insuredNo: '320500000623487195', city: '苏州', type: '一次性补缴', insuranceType: '灵活就业人员基本医疗保险', remainingMonths: 50, baseAmount: 5180, amount: 31080, status: '待核定' },
  { id: 'DJ016', name: '魏晓芳', idCard: '320213196907215841', insuredNo: '320200000738521964', city: '无锡', type: '退休趸缴', insuranceType: '职工基本医疗保险', remainingMonths: 28, baseAmount: 4760, amount: 15993.6, status: '已提交' },
  { id: 'DJ017', name: '宋海忠', idCard: '320322196504066352', insuredNo: '320300000824619537', city: '徐州', type: '一次性补缴', insuranceType: '灵活就业人员基本医疗保险', remainingMonths: 58, baseAmount: 4490, amount: 31240.8, status: '待核定' },
  { id: 'DJ018', name: '杜彩霞', idCard: '320682196802233426', insuredNo: '320600000917324856', city: '南通', type: '退休趸缴', insuranceType: '职工基本医疗保险', remainingMonths: 22, baseAmount: 4860, amount: 12830.4, status: '已测算' },
  { id: 'DJ019', name: '陶金明', idCard: '320706196603284317', insuredNo: '320700000186473258', city: '连云港', type: '一次性补缴', insuranceType: '灵活就业人员基本医疗保险', remainingMonths: 46, baseAmount: 4410, amount: 24343.2, status: '待核定' },
  { id: 'DJ020', name: '陆春燕', idCard: '320921196905185624', insuredNo: '320900000274195386', city: '盐城', type: '退休趸缴', insuranceType: '职工基本医疗保险', remainingMonths: 26, baseAmount: 4670, amount: 14570.4, status: '已提交' },
];

export default function LumpSumPayment({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {
  const [keyword, setKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [resultText, setResultText] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [detailItem, setDetailItem] = useState<LumpSumCase | null>(null);
  const filteredRows = useMemo(
    () => rows.filter((item) => [item.name, item.idCard, item.insuredNo, item.city, item.type].some((value) => value.includes(keyword))),
    [keyword],
  );
  const selectedRows = filteredRows.filter((item) => selectedIds.includes(item.id));

  const handleSubmit = (action: 'calculate' | 'generate' | 'submit') => {
    if (!selectedRows.length) {
      setResultText('请先勾选至少 1 条趸缴核定记录，再进行批量处理。');
      setShowResult(true);
      return;
    }
    const totalAmount = selectedRows.reduce((sum, item) => sum + item.amount, 0);
    const actionText = action === 'calculate' ? '完成批量测算' : action === 'generate' ? '生成趸缴核定单' : '提交审核';
    setResultText(`已对 ${selectedRows.length} 条记录${actionText}，趸缴总金额 ${totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元。`);
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="rounded-full p-2 hover:bg-gray-100">
            <ChevronRight className="h-5 w-5 rotate-180 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">趸缴核定</h1>
            <p className="text-sm text-gray-500">对退休趸缴、一次性补缴人员进行测算、生成核定单和提交审核</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_180px_180px_180px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索姓名、身份证号、医保个人编号或地市"
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4"
              />
            </div>
            <button onClick={() => handleSubmit('calculate')} className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">批量测算</button>
            <button onClick={() => handleSubmit('generate')} className="rounded-lg border border-purple-200 px-4 py-2 text-purple-700 hover:bg-purple-50">生成核定单</button>
            <button onClick={() => handleSubmit('submit')} className="rounded-lg border border-green-200 px-4 py-2 text-green-700 hover:bg-green-50">提交审核</button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4"><div className="text-sm text-gray-500">待核定</div><div className="mt-1 text-2xl font-bold">{rows.filter((item) => item.status === '待核定').length}</div></div>
          <div className="rounded-xl border border-gray-200 bg-white p-4"><div className="text-sm text-gray-500">已测算</div><div className="mt-1 text-2xl font-bold text-purple-600">{rows.filter((item) => item.status === '已测算').length}</div></div>
          <div className="rounded-xl border border-gray-200 bg-white p-4"><div className="text-sm text-gray-500">已提交</div><div className="mt-1 text-2xl font-bold text-green-600">{rows.filter((item) => item.status === '已提交').length}</div></div>
          <div className="rounded-xl border border-gray-200 bg-white p-4"><div className="text-sm text-gray-500">趸缴总额</div><div className="mt-1 text-2xl font-bold text-orange-600">{rows.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</div></div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h3 className="flex items-center gap-2 font-semibold text-gray-800"><Coins className="h-5 w-5 text-purple-600" />趸缴核定对象</h3>
            <label className="text-sm text-gray-600">
              <input
                type="checkbox"
                checked={filteredRows.length > 0 && selectedIds.length === filteredRows.length}
                onChange={() => setSelectedIds(selectedIds.length === filteredRows.length ? [] : filteredRows.map((item) => item.id))}
                className="mr-2"
              />
              全选当前结果
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[1380px] w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-left"></th>
                  {['姓名', '身份证号', '医保个人编号', '地市', '核定类型', '险种', '剩余月数', '测算基数', '趸缴金额', '状态', '操作'].map((header) => (
                    <th key={header} className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-600">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredRows.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => setSelectedIds((prev) => prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id])} /></td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium">{item.name}</td>
                    <td className="whitespace-nowrap px-4 py-3">{item.idCard}</td>
                    <td className="whitespace-nowrap px-4 py-3">{item.insuredNo}</td>
                    <td className="whitespace-nowrap px-4 py-3">{item.city}</td>
                    <td className="whitespace-nowrap px-4 py-3">{item.type}</td>
                    <td className="px-4 py-3">{item.insuranceType}</td>
                    <td className="whitespace-nowrap px-4 py-3">{item.remainingMonths}个月</td>
                    <td className="whitespace-nowrap px-4 py-3">{item.baseAmount.toLocaleString()} 元</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-purple-600">{item.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="whitespace-nowrap px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${item.status === '已提交' ? 'bg-green-100 text-green-700' : item.status === '已测算' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button onClick={() => setDetailItem(item)} className="rounded-lg border border-purple-200 px-3 py-1.5 text-xs text-purple-700 hover:bg-purple-50">查看详情</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <h4 className="mb-2 flex items-center gap-2 font-medium text-green-800"><AlertCircle className="h-4 w-4" />办理提示</h4>
          <ul className="space-y-1 text-sm text-green-700">
            <li>勾选记录后先点“批量测算”，确认金额无误再“生成核定单”。</li>
            <li>核定单生成后再点“提交审核”，才会进入后续财务缴费流程。</li>
            <li>退休趸缴和一次性补缴采用不同测算口径，列表中已按业务类型区分。</li>
          </ul>
        </div>
      </div>

      {showResult && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowResult(false)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-xl rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold"><FileText className="h-5 w-5" />趸缴核定处理结果</h3>
              <button onClick={() => setShowResult(false)} className="rounded-full p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 p-6">
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">{resultText}</div>
              <div className="rounded-lg border p-4 text-sm text-gray-600">
                当前流程：勾选对象 → 批量测算 → 生成核定单 → 提交审核 → 进入缴费。
              </div>
            </div>
            <div className="flex justify-end border-t p-6">
              <button onClick={() => setShowResult(false)} className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"><CheckCircle className="h-4 w-4" />我知道了</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {detailItem && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDetailItem(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-2xl rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">趸缴核定详情 - {detailItem.id}</h3>
              <button onClick={() => setDetailItem(null)} className="rounded-full p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['姓名', detailItem.name],
                ['身份证号', detailItem.idCard],
                ['医保个人编号', detailItem.insuredNo],
                ['参保地市', detailItem.city],
                ['核定类型', detailItem.type],
                ['险种', detailItem.insuranceType],
                ['剩余月数', `${detailItem.remainingMonths} 个月`],
                ['测算基数', `${detailItem.baseAmount.toLocaleString()} 元`],
                ['趸缴金额', `${detailItem.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元`],
                ['状态', detailItem.status],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
