import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, CheckCircle, Clock, AlertCircle, Eye, FileText } from 'lucide-react';

interface RefundRecord {
  id: string;
  name: string;
  idCard: string;
  insuredNo: string;
  city: string;
  applyDate: string;
  refundAmount: number;
  reason: string;
  status: '待审核' | '已审核' | '已退付' | '已退回';
  account: string;
  bank: string;
  operator: string;
}

const initialRecords: RefundRecord[] = [
  { id: 'TF001', name: '王志鹏', idCard: '320102198904154317', insuredNo: '320100000214587639', city: '南京', applyDate: '2026-04-05', refundAmount: 1260, reason: '重复缴纳城乡居民医保费', status: '待审核', account: '6222023201024587639', bank: '工商银行南京中山支行', operator: '周岚' },
  { id: 'TF002', name: '沈倩雯', idCard: '320205199103286526', insuredNo: '320200000315482671', city: '无锡', applyDate: '2026-04-06', refundAmount: 470, reason: '参保关系重复登记', status: '已审核', account: '6227003202057845261', bank: '建设银行无锡城中支行', operator: '曹颖' },
  { id: 'TF003', name: '刘国峰', idCard: '320303197811064812', insuredNo: '320300000421385796', city: '徐州', applyDate: '2026-04-07', refundAmount: 2850, reason: '缴费基数调整后差额退费', status: '已退付', account: '6216603203039147825', bank: '中国银行徐州云龙支行', operator: '韩璐' },
  { id: 'TF004', name: '朱慧玲', idCard: '320402198612215228', insuredNo: '320400000587214365', city: '常州', applyDate: '2026-04-07', refundAmount: 920, reason: '单位误报停保后重缴', status: '待审核', account: '6228483204026372518', bank: '农业银行常州延陵支行', operator: '顾彤' },
  { id: 'TF005', name: '顾建华', idCard: '320507198209134916', insuredNo: '320500000317495826', city: '苏州', applyDate: '2026-04-08', refundAmount: 560, reason: '灵活就业重复扣款', status: '已退回', account: '6210983205071463728', bank: '邮储银行苏州工业园区支行', operator: '陆敏' },
  { id: 'TF006', name: '施红英', idCard: '320602197906154723', insuredNo: '320600000219465738', city: '南通', applyDate: '2026-04-09', refundAmount: 470, reason: '年度征缴重复入账', status: '已审核', account: '6222023206024985763', bank: '工商银行南通崇川支行', operator: '顾悦' },
  { id: 'TF007', name: '姜卫东', idCard: '320703198311145618', insuredNo: '320700000354129687', city: '连云港', applyDate: '2026-04-09', refundAmount: 1460, reason: '退役军人财政补助重复计征', status: '待审核', account: '6227003207034251783', bank: '建设银行连云港海州支行', operator: '高宁' },
  { id: 'TF008', name: '骆丽君', idCard: '320803199005076524', insuredNo: '320800000425673918', city: '淮安', applyDate: '2026-04-10', refundAmount: 380, reason: '新生儿参保随母重复缴费', status: '已退付', account: '6216603208032815746', bank: '中国银行淮安清江浦支行', operator: '周岚' },
  { id: 'TF009', name: '殷树成', idCard: '320902198104283677', insuredNo: '320900000514829736', city: '盐城', applyDate: '2026-04-11', refundAmount: 2240, reason: '职工停保补退', status: '待审核', account: '6228483209025172843', bank: '农业银行盐城亭湖支行', operator: '曹颖' },
  { id: 'TF010', name: '龚晓岚', idCard: '321002199007036629', insuredNo: '321000000689473521', city: '扬州', applyDate: '2026-04-11', refundAmount: 470, reason: '居民参保跨市重复参保', status: '已审核', account: '6210983210025162938', bank: '邮储银行扬州广陵支行', operator: '韩璐' },
  { id: 'TF011', name: '朱德勇', idCard: '321102198212214816', insuredNo: '321100000296487153', city: '镇江', applyDate: '2026-04-12', refundAmount: 3180, reason: '补缴核定调整退费', status: '已退付', account: '6222023211024378165', bank: '工商银行镇江京口支行', operator: '顾彤' },
  { id: 'TF012', name: '钱月芬', idCard: '321202199311154226', insuredNo: '321200000381465927', city: '泰州', applyDate: '2026-04-13', refundAmount: 560, reason: '灵活就业转职工后重复缴费', status: '待审核', account: '6227003212028426153', bank: '建设银行泰州海陵支行', operator: '陆敏' },
  { id: 'TF013', name: '冯长林', idCard: '321302198008286417', insuredNo: '321300000417926358', city: '宿迁', applyDate: '2026-04-14', refundAmount: 470, reason: '居民年度费误收', status: '已退回', account: '6216603213026814257', bank: '中国银行宿迁宿城支行', operator: '顾悦' },
  { id: 'TF014', name: '范桂枝', idCard: '320104198701164245', insuredNo: '320100000538216479', city: '南京', applyDate: '2026-04-15', refundAmount: 920, reason: '单位重复申报个人缴费', status: '已审核', account: '6228483201045132467', bank: '农业银行南京鼓楼支行', operator: '高宁' },
  { id: 'TF015', name: '程志远', idCard: '320585197912147831', insuredNo: '320500000623487195', city: '苏州', applyDate: '2026-04-16', refundAmount: 560, reason: '灵活就业误扣', status: '待审核', account: '6210983205854179283', bank: '邮储银行苏州吴中支行', operator: '周岚' },
  { id: 'TF016', name: '魏晓芳', idCard: '320213198810156842', insuredNo: '320200000738521964', city: '无锡', applyDate: '2026-04-16', refundAmount: 380, reason: '新生儿重复缴费', status: '已退付', account: '6222023202136425817', bank: '工商银行无锡滨湖支行', operator: '曹颖' },
  { id: 'TF017', name: '宋海忠', idCard: '320322197802246351', insuredNo: '320300000824619537', city: '徐州', applyDate: '2026-04-17', refundAmount: 1780, reason: '退休人员续缴差额退回', status: '待审核', account: '6227003203225813624', bank: '建设银行徐州泉山支行', operator: '韩璐' },
  { id: 'TF018', name: '杜彩霞', idCard: '320682198912024327', insuredNo: '320600000917324856', city: '南通', applyDate: '2026-04-18', refundAmount: 470, reason: '学籍变更重复征缴', status: '已审核', account: '6216603206824279168', bank: '中国银行南通通州支行', operator: '顾彤' },
  { id: 'TF019', name: '陶金明', idCard: '320706197911286318', insuredNo: '320700000186473258', city: '连云港', applyDate: '2026-04-19', refundAmount: 2440, reason: '单位参保批量撤销退费', status: '已退付', account: '6228483207065182647', bank: '农业银行连云港赣榆支行', operator: '陆敏' },
  { id: 'TF020', name: '陆春燕', idCard: '320921198603275623', insuredNo: '320900000274195386', city: '盐城', applyDate: '2026-04-19', refundAmount: 470, reason: '异地参保后本地误征', status: '待审核', account: '6210983209215471832', bank: '邮储银行盐城盐都支行', operator: '顾悦' },
];

export default function RefundProcess({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState<RefundRecord[]>(initialRecords);
  const [selectedRecord, setSelectedRecord] = useState<RefundRecord | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredRecords = useMemo(
    () => records.filter((item) => [item.id, item.name, item.idCard, item.insuredNo, item.city, item.reason].some((value) => value.includes(searchTerm))),
    [records, searchTerm],
  );

  const updateStatus = (id: string, status: RefundRecord['status']) => {
    setRecords((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    setSelectedRecord((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  };

  const getStatusBadge = (status: RefundRecord['status']) => {
    switch (status) {
      case '待审核':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock };
      case '已审核':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle };
      case '已退付':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle };
      default:
        return { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="rounded-full p-2 transition-colors hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">退费处理</h1>
              <p className="text-sm text-gray-500">受理重复缴费、误扣费、关系变更等退费申请并完成审核退付</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">+ 新增退费申请</button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4"
                placeholder="搜索申请单号、姓名、身份证号、医保个人编号、地市或退费原因"
              />
            </div>
            <button className="rounded-xl bg-red-600 px-6 py-3 text-white">查询</button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[1340px] w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['申请单号', '姓名', '身份证号', '医保个人编号', '地市', '申请日期', '退费金额', '退费原因', '状态', '经办人员', '操作'].map((header) => (
                    <th key={header} className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-gray-600">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredRecords.map((record) => {
                  const status = getStatusBadge(record.status);
                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-cyan-700">{record.id}</td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium">{record.name}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">{record.idCard}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">{record.insuredNo}</td>
                      <td className="whitespace-nowrap px-6 py-4">{record.city}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">{record.applyDate}</td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-red-600">{record.refundAmount.toLocaleString()} 元</td>
                      <td className="px-6 py-4 text-gray-600">{record.reason}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${status.bg} ${status.text}`}>
                          <status.icon className="h-3 w-3" />{record.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">{record.operator}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex gap-2 whitespace-nowrap">
                          <button onClick={() => setSelectedRecord(record)} className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-50">查看</button>
                          {record.status === '待审核' && (
                            <>
                              <button onClick={() => updateStatus(record.id, '已审核')} className="rounded-lg border border-green-200 px-3 py-1.5 text-xs text-green-700 hover:bg-green-50">审核通过</button>
                              <button onClick={() => updateStatus(record.id, '已退回')} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50">退回补正</button>
                            </>
                          )}
                          {record.status === '已审核' && (
                            <button onClick={() => updateStatus(record.id, '已退付')} className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50">确认退付</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-2xl rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b p-6">
              <h3 className="text-lg font-bold">新增退费申请</h3>
              <button onClick={() => setShowForm(false)} className="rounded-full p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6">
              {['姓名', '身份证号', '医保个人编号', '退费金额', '开户银行', '银行卡号'].map((label) => (
                <div key={label}>
                  <label className="mb-1 block text-sm font-medium">{label}</label>
                  <input className="w-full rounded-lg border px-3 py-2" placeholder={`请输入${label}`} />
                </div>
              ))}
              <div className="col-span-2">
                <label className="mb-1 block text-sm font-medium">退费原因</label>
                <textarea className="w-full rounded-lg border px-3 py-2" rows={3} placeholder="请输入重复缴费、误扣费、关系变更等退费原因" />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t p-6">
              <button onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">取消</button>
              <button onClick={() => setShowForm(false)} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">提交申请</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedRecord && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedRecord(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-3xl rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold"><Eye className="h-5 w-5 text-blue-600" />退费申请详情</h3>
              <button onClick={() => setSelectedRecord(null)} className="rounded-full p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['申请单号', selectedRecord.id],
                  ['姓名', selectedRecord.name],
                  ['身份证号', selectedRecord.idCard],
                  ['医保个人编号', selectedRecord.insuredNo],
                  ['参保地市', selectedRecord.city],
                  ['申请日期', selectedRecord.applyDate],
                  ['退费金额', `${selectedRecord.refundAmount.toLocaleString()} 元`],
                  ['开户银行', selectedRecord.bank],
                  ['银行卡号', selectedRecord.account],
                  ['经办人员', selectedRecord.operator],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2 font-medium text-gray-800"><FileText className="h-4 w-4" />退费原因说明</div>
                <div className="text-sm text-gray-600">{selectedRecord.reason}</div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t p-6">
              <button onClick={() => setSelectedRecord(null)} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">关闭</button>
              {selectedRecord.status === '待审核' && <button onClick={() => updateStatus(selectedRecord.id, '已审核')} className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">审核通过</button>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
