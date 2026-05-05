import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, Receipt, Download, X, RefreshCw, Eye } from 'lucide-react';

interface ArrivalRecord {
  id: string;
  payerName: string;
  idCard: string;
  insuredNo: string;
  amount: number;
  channelName: string;
  arrivalDate: string;
  status: '已匹配' | '待匹配' | '异常';
  voucherNo: string;
  businessType: string;
  city: string;
  period: string;
  bankSerial: string;
  taxSerial?: string;
  receiveAccount: string;
  handler: string;
  remark: string;
}

const bankRecords: ArrivalRecord[] = [
  { id: 'BK001', payerName: '王立新', idCard: '320102197903124517', insuredNo: '320100000421587963', amount: 11709.6, channelName: '工商银行南京鼓楼支行', arrivalDate: '2026-04-21 09:12', status: '已匹配', voucherNo: 'YH20260421001', businessType: '灵活就业年度缴费', city: '南京', period: '2026年度', bankSerial: 'ICBC202604210912001', receiveAccount: '江苏省医保基金收入户', handler: '周岚', remark: '线上缴费实时入账' },
  { id: 'BK002', payerName: '周梦洁', idCard: '320205198812143621', insuredNo: '320200000318425174', amount: 470, channelName: '建设银行无锡城中支行', arrivalDate: '2026-04-21 09:26', status: '已匹配', voucherNo: 'YH20260421002', businessType: '城乡居民年度缴费', city: '无锡', period: '2026年度', bankSerial: 'CCB202604210926118', receiveAccount: '江苏省医保基金收入户', handler: '曹颖', remark: '柜面代收' },
  { id: 'BK003', payerName: '陈国梁', idCard: '320303197508214833', insuredNo: '320300000298741552', amount: 13008, channelName: '中国银行徐州云龙支行', arrivalDate: '2026-04-21 09:43', status: '待匹配', voucherNo: 'YH20260421003', businessType: '退休续保补缴', city: '徐州', period: '2026年度', bankSerial: 'BOC202604210943526', receiveAccount: '江苏省医保基金收入户', handler: '韩璐', remark: '通知单号缺失，待人工确认' },
  { id: 'BK004', payerName: '蒋欣悦', idCard: '320402200809063524', insuredNo: '320400000521874236', amount: 350, channelName: '农业银行常州延陵支行', arrivalDate: '2026-04-21 10:05', status: '已匹配', voucherNo: 'YH20260421004', businessType: '学生参保缴费', city: '常州', period: '2026年度', bankSerial: 'ABC202604211005362', receiveAccount: '江苏省医保基金收入户', handler: '顾彤', remark: '学校批量代收' },
  { id: 'BK005', payerName: '顾海峰', idCard: '320507198606174918', insuredNo: '320500000187542963', amount: 12360, channelName: '邮储银行苏州工业园区支行', arrivalDate: '2026-04-21 10:18', status: '异常', voucherNo: 'YH20260421005', businessType: '灵活就业年度缴费', city: '苏州', period: '2026年度', bankSerial: 'PSBC202604211018459', receiveAccount: '江苏省医保基金收入户', handler: '陆敏', remark: '金额与核定单不一致' },
  { id: 'BK006', payerName: '沈雨桐', idCard: '320602199511286728', insuredNo: '320600000365218794', amount: 470, channelName: '交通银行南通崇川支行', arrivalDate: '2026-04-21 10:31', status: '已匹配', voucherNo: 'YH20260421006', businessType: '城乡居民年度缴费', city: '南通', period: '2026年度', bankSerial: 'BCM202604211031286', receiveAccount: '江苏省医保基金收入户', handler: '顾悦', remark: '居民续保' },
  { id: 'BK007', payerName: '韩世军', idCard: '320703197611035414', insuredNo: '320700000452361875', amount: 11232, channelName: '江苏银行连云港海州支行', arrivalDate: '2026-04-21 10:52', status: '待匹配', voucherNo: 'YH20260421007', businessType: '单位停保续缴', city: '连云港', period: '2026年度', bankSerial: 'JSBC202604211052147', receiveAccount: '江苏省医保基金收入户', handler: '高宁', remark: '单位编码未带出' },
  { id: 'BK008', payerName: '高雅婷', idCard: '320803199304257245', insuredNo: '320800000418527194', amount: 11808, channelName: '工商银行淮安清江浦支行', arrivalDate: '2026-04-21 11:09', status: '已匹配', voucherNo: 'YH20260421008', businessType: '灵活就业年度缴费', city: '淮安', period: '2026年度', bankSerial: 'ICBC202604211109428', receiveAccount: '江苏省医保基金收入户', handler: '周岚', remark: '线上缴费' },
  { id: 'BK009', payerName: '彭俊杰', idCard: '320902198703093616', insuredNo: '320900000274639518', amount: 12864, channelName: '农业银行盐城亭湖支行', arrivalDate: '2026-04-21 11:22', status: '已匹配', voucherNo: 'YH20260421009', businessType: '退休续保补缴', city: '盐城', period: '2026年度', bankSerial: 'ABC202604211122265', receiveAccount: '江苏省医保基金收入户', handler: '曹颖', remark: '补缴到账' },
  { id: 'BK010', payerName: '唐若涵', idCard: '321002201302187846', insuredNo: '321000000589632741', amount: 350, channelName: '建设银行扬州广陵支行', arrivalDate: '2026-04-21 11:46', status: '已匹配', voucherNo: 'YH20260421010', businessType: '学生参保缴费', city: '扬州', period: '2026年度', bankSerial: 'CCB202604211146208', receiveAccount: '江苏省医保基金收入户', handler: '韩璐', remark: '学校代收' },
];

const taxRecords: ArrivalRecord[] = [
  { id: 'SW001', payerName: '南京云联数据科技有限公司', idCard: '91320104MA27XQ6M8H', insuredNo: 'DW3201000001', amount: 286540, channelName: '江苏税务征收', arrivalDate: '2026-04-21 08:36', status: '已匹配', voucherNo: 'SW20260421001', businessType: '单位职工医保批量扣缴', city: '南京', period: '2026-04', bankSerial: 'TAXBANK202604210836015', taxSerial: 'JSTAX202604210001', receiveAccount: '江苏省医保基金收入户', handler: '周岚', remark: '税务批扣成功' },
  { id: 'SW002', payerName: '无锡华润医药有限公司', idCard: '91320214MA1X8Y7N5P', insuredNo: 'DW3202000002', amount: 96280, channelName: '江苏税务征收', arrivalDate: '2026-04-21 08:52', status: '已匹配', voucherNo: 'SW20260421002', businessType: '单位职工医保批量扣缴', city: '无锡', period: '2026-04', bankSerial: 'TAXBANK202604210852146', taxSerial: 'JSTAX202604210002', receiveAccount: '江苏省医保基金收入户', handler: '曹颖', remark: '税务回传正常' },
  { id: 'SW003', payerName: '徐州矿建装备制造有限公司', idCard: '91320303MA24P7W38K', insuredNo: 'DW3203000003', amount: 154320, channelName: '江苏税务征收', arrivalDate: '2026-04-21 09:10', status: '待匹配', voucherNo: 'SW20260421003', businessType: '单位职工医保批量扣缴', city: '徐州', period: '2026-04', bankSerial: 'TAXBANK202604210910283', taxSerial: 'JSTAX202604210003', receiveAccount: '江苏省医保基金收入户', handler: '韩璐', remark: '税务已扣款，医保批次待回写' },
  { id: 'SW004', payerName: '常州天宁精密科技有限公司', idCard: '91320402MA1Y2M7D8W', insuredNo: 'DW3204000004', amount: 68540, channelName: '江苏税务征收', arrivalDate: '2026-04-21 09:32', status: '已匹配', voucherNo: 'SW20260421004', businessType: '生育保险批量扣缴', city: '常州', period: '2026-04', bankSerial: 'TAXBANK202604210932456', taxSerial: 'JSTAX202604210004', receiveAccount: '江苏省医保基金收入户', handler: '顾彤', remark: '税务到账正常' },
  { id: 'SW005', payerName: '苏州高新区云信工程有限公司', idCard: '91320505MA1N6A3J2M', insuredNo: 'DW3205000005', amount: 203560, channelName: '江苏税务征收', arrivalDate: '2026-04-21 09:48', status: '异常', voucherNo: 'SW20260421005', businessType: '单位职工医保批量扣缴', city: '苏州', period: '2026-04', bankSerial: 'TAXBANK202604210948376', taxSerial: 'JSTAX202604210005', receiveAccount: '江苏省医保基金收入户', handler: '陆敏', remark: '税务金额多出补缴差额，待拆分' },
  { id: 'SW006', payerName: '南通海工建工集团有限公司', idCard: '91320621MA20M8Q42F', insuredNo: 'DW3206000006', amount: 75420, channelName: '江苏税务征收', arrivalDate: '2026-04-21 10:06', status: '已匹配', voucherNo: 'SW20260421006', businessType: '大病保险单位缴费', city: '南通', period: '2026-04', bankSerial: 'TAXBANK202604211006124', taxSerial: 'JSTAX202604210006', receiveAccount: '江苏省医保基金收入户', handler: '顾悦', remark: '到账成功' },
  { id: 'SW007', payerName: '连云港港盛物流有限公司', idCard: '91320700MA1M7F2Q9D', insuredNo: 'DW3207000007', amount: 87960, channelName: '江苏税务征收', arrivalDate: '2026-04-21 10:22', status: '待匹配', voucherNo: 'SW20260421007', businessType: '单位职工医保批量扣缴', city: '连云港', period: '2026-04', bankSerial: 'TAXBANK202604211022567', taxSerial: 'JSTAX202604210007', receiveAccount: '江苏省医保基金收入户', handler: '高宁', remark: '税务流水已回传，通知单号待挂接' },
  { id: 'SW008', payerName: '淮安清江制药有限公司', idCard: '91320803MA1Q4K8C5N', insuredNo: 'DW3208000008', amount: 112430, channelName: '江苏税务征收', arrivalDate: '2026-04-21 10:37', status: '已匹配', voucherNo: 'SW20260421008', businessType: '单位职工医保批量扣缴', city: '淮安', period: '2026-04', bankSerial: 'TAXBANK202604211037218', taxSerial: 'JSTAX202604210008', receiveAccount: '江苏省医保基金收入户', handler: '周岚', remark: '到账成功' },
  { id: 'SW009', payerName: '盐城东方齿轮有限公司', idCard: '91320903MA1W3L9J6F', insuredNo: 'DW3209000009', amount: 59870, channelName: '江苏税务征收', arrivalDate: '2026-04-21 10:56', status: '已匹配', voucherNo: 'SW20260421009', businessType: '大病保险单位缴费', city: '盐城', period: '2026-04', bankSerial: 'TAXBANK202604211056304', taxSerial: 'JSTAX202604210009', receiveAccount: '江苏省医保基金收入户', handler: '曹颖', remark: '税务正常回传' },
  { id: 'SW010', payerName: '扬州广陵商贸发展有限公司', idCard: '91321002MA1N1X8R4M', insuredNo: 'DW3210000010', amount: 93660, channelName: '江苏税务征收', arrivalDate: '2026-04-21 11:18', status: '异常', voucherNo: 'SW20260421010', businessType: '单位职工医保批量扣缴', city: '扬州', period: '2026-04', bankSerial: 'TAXBANK202604211118624', taxSerial: 'JSTAX202604210010', receiveAccount: '江苏省医保基金收入户', handler: '韩璐', remark: '同一批次重复回传，待去重' },
];

export default function ArrivalConfirm({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {
  const [activeTab, setActiveTab] = useState<'bank' | 'tax'>('bank');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ArrivalRecord | null>(null);
  const currentRecords = activeTab === 'bank' ? bankRecords : taxRecords;
  const filteredRecords = useMemo(
    () => currentRecords.filter((item) => [item.id, item.payerName, item.idCard, item.insuredNo, item.voucherNo, item.businessType, item.city].some((value) => value.includes(searchTerm))),
    [currentRecords, searchTerm],
  );
  const summary = {
    total: currentRecords.length,
    matched: currentRecords.filter((item) => item.status === '已匹配').length,
    pending: currentRecords.filter((item) => item.status === '待匹配').length,
    exception: currentRecords.filter((item) => item.status === '异常').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="rounded-full p-2 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">到账确认</h1>
              <p className="text-sm text-gray-500">区分银行到账和税务到账，支持匹配核定单、查看异常和人工确认</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50">
              <RefreshCw className="h-4 w-4" />自动对账
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
              <Download className="h-4 w-4" />导出报表
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex gap-4">
          <button onClick={() => setActiveTab('bank')} className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium ${activeTab === 'bank' ? 'bg-emerald-600 text-white' : 'border bg-white hover:bg-gray-50'}`}>
            <Building2 className="h-5 w-5" />银行到账
          </button>
          <button onClick={() => setActiveTab('tax')} className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium ${activeTab === 'tax' ? 'bg-emerald-600 text-white' : 'border bg-white hover:bg-gray-50'}`}>
            <Receipt className="h-5 w-5" />税务到账
          </button>
        </div>

        <div className="mb-6 rounded-xl border bg-white p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-xl border py-3 pl-12 pr-4" placeholder={`搜索${activeTab === 'bank' ? '到账单号、姓名、身份证号、医保编号、业务类型' : '税务批次、单位名称、统一社会信用代码、凭证号'}`} />
            </div>
            <button className="rounded-xl bg-emerald-600 px-6 py-3 text-white">查询</button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-xl border bg-white p-4"><div className="text-sm text-gray-500">到账笔数</div><div className="text-2xl font-bold text-gray-800">{summary.total}</div></div>
          <div className="rounded-xl border bg-white p-4"><div className="text-sm text-gray-500">已匹配</div><div className="text-2xl font-bold text-green-600">{summary.matched}</div></div>
          <div className="rounded-xl border bg-white p-4"><div className="text-sm text-gray-500">待匹配</div><div className="text-2xl font-bold text-yellow-600">{summary.pending}</div></div>
          <div className="rounded-xl border bg-white p-4"><div className="text-sm text-gray-500">异常</div><div className="text-2xl font-bold text-red-600">{summary.exception}</div></div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[1320px] w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['到账单号', activeTab === 'bank' ? '缴费人' : '缴费主体', activeTab === 'bank' ? '医保个人编号/身份证号' : '统一信用代码', '业务类型', '费款所属期', '到账金额', activeTab === 'bank' ? '银行渠道' : '税务渠道', '到账时间', '状态', '操作'].map((header) => (
                    <th key={header} className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-emerald-700">{record.id}</td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{record.payerName}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">{activeTab === 'bank' ? `${record.insuredNo} / ${record.idCard}` : record.idCard}</td>
                    <td className="whitespace-nowrap px-6 py-4">{record.businessType}</td>
                    <td className="whitespace-nowrap px-6 py-4">{record.period}</td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-emerald-600">{record.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元</td>
                    <td className="whitespace-nowrap px-6 py-4">{record.channelName}</td>
                    <td className="whitespace-nowrap px-6 py-4">{record.arrivalDate}</td>
                    <td className="whitespace-nowrap px-6 py-4"><span className={`rounded-full px-2 py-1 text-xs ${record.status === '已匹配' ? 'bg-green-100 text-green-700' : record.status === '待匹配' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{record.status}</span></td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button onClick={() => setSelectedRecord(record)} className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50">
                        <Eye className="h-4 w-4" />查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedRecord && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedRecord(null)}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-3xl rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">到账详情 - {selectedRecord.id}</h3>
              <button onClick={() => setSelectedRecord(null)} className="rounded-full p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['缴费主体', selectedRecord.payerName],
                ['身份证号/信用代码', selectedRecord.idCard],
                ['医保编号/单位编号', selectedRecord.insuredNo],
                ['参保地市', selectedRecord.city],
                ['业务类型', selectedRecord.businessType],
                ['费款所属期', selectedRecord.period],
                ['到账金额', `${selectedRecord.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元`],
                ['到账渠道', selectedRecord.channelName],
                ['到账时间', selectedRecord.arrivalDate],
                ['入账账户', selectedRecord.receiveAccount],
                ['到账凭证号', selectedRecord.voucherNo],
                ['银行流水号', selectedRecord.bankSerial],
                ['税务流水号', selectedRecord.taxSerial || '-'],
                ['当前状态', selectedRecord.status],
                ['经办人员', selectedRecord.handler],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-right font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border p-4 text-sm text-gray-600">
              <div className="mb-1 font-medium text-gray-800">处理备注</div>
              {selectedRecord.remark}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setSelectedRecord(null)} className="flex-1 rounded-lg border py-2">关闭</button>
              {selectedRecord.status === '待匹配' && <button className="flex-1 rounded-lg bg-emerald-600 py-2 text-white">人工匹配</button>}
              {selectedRecord.status === '异常' && <button className="flex-1 rounded-lg bg-red-600 py-2 text-white">处理异常</button>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
