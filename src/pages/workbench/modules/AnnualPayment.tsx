import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Calculator, FileText, CheckCircle, ChevronRight, X, Download, Printer, Search } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  idCard: string;
  insuredNo: string;
  city: string;
  insuranceType: string;
  identityType: string;
  baseAmount: number;
  months: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'partial';
  period: string;
}

const persons: Person[] = [
  { id: 'AP001', name: '王立新', idCard: '320102197903124517', insuredNo: '320100000421587963', city: '南京', insuranceType: '灵活就业人员基本医疗保险', identityType: '灵活就业', baseAmount: 4879, months: 12, totalAmount: 11709.6, status: 'pending', period: '2026年度' },
  { id: 'AP002', name: '周梦洁', idCard: '320205198812143621', insuredNo: '320200000318425174', city: '无锡', insuranceType: '城乡居民基本医疗保险', identityType: '城乡居民', baseAmount: 0, months: 12, totalAmount: 470, status: 'paid', period: '2026年度' },
  { id: 'AP003', name: '陈国梁', idCard: '320303197508214833', insuredNo: '320300000298741552', city: '徐州', insuranceType: '职工基本医疗保险', identityType: '退休续保', baseAmount: 5420, months: 12, totalAmount: 13008, status: 'partial', period: '2026年度' },
  { id: 'AP004', name: '蒋欣悦', idCard: '320402200809063524', insuredNo: '320400000521874236', city: '常州', insuranceType: '城乡居民基本医疗保险', identityType: '学生', baseAmount: 0, months: 12, totalAmount: 350, status: 'paid', period: '2026年度' },
  { id: 'AP005', name: '顾海峰', idCard: '320507198606174918', insuredNo: '320500000187542963', city: '苏州', insuranceType: '灵活就业人员基本医疗保险', identityType: '灵活就业', baseAmount: 5150, months: 12, totalAmount: 12360, status: 'pending', period: '2026年度' },
  { id: 'AP006', name: '沈雨桐', idCard: '320602199511286728', insuredNo: '320600000365218794', city: '南通', insuranceType: '城乡居民基本医疗保险', identityType: '城乡居民', baseAmount: 0, months: 12, totalAmount: 470, status: 'partial', period: '2026年度' },
  { id: 'AP007', name: '韩世军', idCard: '320703197611035414', insuredNo: '320700000452361875', city: '连云港', insuranceType: '职工基本医疗保险', identityType: '单位停保续缴', baseAmount: 4680, months: 12, totalAmount: 11232, status: 'pending', period: '2026年度' },
  { id: 'AP008', name: '高雅婷', idCard: '320803199304257245', insuredNo: '320800000418527194', city: '淮安', insuranceType: '灵活就业人员基本医疗保险', identityType: '灵活就业', baseAmount: 4920, months: 12, totalAmount: 11808, status: 'paid', period: '2026年度' },
  { id: 'AP009', name: '彭俊杰', idCard: '320902198703093616', insuredNo: '320900000274639518', city: '盐城', insuranceType: '职工基本医疗保险', identityType: '退休续保', baseAmount: 5360, months: 12, totalAmount: 12864, status: 'pending', period: '2026年度' },
  { id: 'AP010', name: '唐若涵', idCard: '321002201302187846', insuredNo: '321000000589632741', city: '扬州', insuranceType: '城乡居民基本医疗保险', identityType: '学生', baseAmount: 0, months: 12, totalAmount: 350, status: 'paid', period: '2026年度' },
  { id: 'AP011', name: '孔祥瑞', idCard: '321102198410186312', insuredNo: '321100000481235976', city: '镇江', insuranceType: '灵活就业人员基本医疗保险', identityType: '灵活就业', baseAmount: 5050, months: 12, totalAmount: 12120, status: 'partial', period: '2026年度' },
  { id: 'AP012', name: '许书瑶', idCard: '321202199808154028', insuredNo: '321200000392674185', city: '泰州', insuranceType: '城乡居民基本医疗保险', identityType: '城乡居民', baseAmount: 0, months: 12, totalAmount: 470, status: 'pending', period: '2026年度' },
  { id: 'AP013', name: '石向东', idCard: '321302197402264716', insuredNo: '321300000218963457', city: '宿迁', insuranceType: '职工基本医疗保险', identityType: '退休续保', baseAmount: 5280, months: 12, totalAmount: 12672, status: 'paid', period: '2026年度' },
  { id: 'AP014', name: '林婉清', idCard: '320104199210155247', insuredNo: '320100000648275319', city: '南京', insuranceType: '城乡居民基本医疗保险', identityType: '城乡居民', baseAmount: 0, months: 12, totalAmount: 470, status: 'pending', period: '2026年度' },
  { id: 'AP015', name: '赵子昂', idCard: '320585198902137532', insuredNo: '320500000746318529', city: '苏州', insuranceType: '职工基本医疗保险', identityType: '单位停保续缴', baseAmount: 5530, months: 12, totalAmount: 13272, status: 'partial', period: '2026年度' },
  { id: 'AP016', name: '邵雨晨', idCard: '320213200711283844', insuredNo: '320200000825713642', city: '无锡', insuranceType: '城乡居民基本医疗保险', identityType: '学生', baseAmount: 0, months: 12, totalAmount: 350, status: 'paid', period: '2026年度' },
  { id: 'AP017', name: '郑国成', idCard: '320322198305246358', insuredNo: '320300000934287561', city: '徐州', insuranceType: '灵活就业人员基本医疗保险', identityType: '灵活就业', baseAmount: 4760, months: 12, totalAmount: 11424, status: 'pending', period: '2026年度' },
  { id: 'AP018', name: '陆嘉欣', idCard: '320682199612073126', insuredNo: '320600000173846925', city: '南通', insuranceType: '城乡居民基本医疗保险', identityType: '新生儿转居民', baseAmount: 0, months: 12, totalAmount: 380, status: 'paid', period: '2026年度' },
  { id: 'AP019', name: '袁晨波', idCard: '320706199001194373', insuredNo: '320700000284617395', city: '连云港', insuranceType: '职工基本医疗保险', identityType: '单位停保续缴', baseAmount: 4610, months: 12, totalAmount: 11064, status: 'pending', period: '2026年度' },
  { id: 'AP020', name: '魏清妍', idCard: '320921199705116824', insuredNo: '320900000392176485', city: '盐城', insuranceType: '灵活就业人员基本医疗保险', identityType: '灵活就业', baseAmount: 4980, months: 12, totalAmount: 11952, status: 'partial', period: '2026年度' },
];

export default function AnnualPayment({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {
  const handleClose = onBack || onClose || (() => {});
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedPersons, setSelectedPersons] = useState<string[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Person['status']>('all');
  const [calcResult, setCalcResult] = useState<string>('');

  const filteredPersons = useMemo(
    () =>
      persons.filter((item) => {
        const matchesKeyword = [item.name, item.idCard, item.insuredNo, item.city, item.insuranceType, item.identityType].some((value) => value.includes(keyword));
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesKeyword && matchesStatus;
      }),
    [keyword, statusFilter],
  );

  const summary = useMemo(
    () => ({
      totalPersons: filteredPersons.length,
      totalAmount: filteredPersons.reduce((sum, p) => sum + p.totalAmount, 0),
      paidAmount: filteredPersons.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.totalAmount, 0),
      pendingAmount: filteredPersons.filter((p) => p.status !== 'paid').reduce((sum, p) => sum + p.totalAmount, 0),
    }),
    [filteredPersons],
  );

  const toggleSelect = (id: string) => {
    setSelectedPersons((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const selectAll = () => {
    const currentIds = filteredPersons.map((item) => item.id);
    setSelectedPersons(selectedPersons.length === currentIds.length ? [] : currentIds);
  };

  const selectedRows = filteredPersons.filter((item) => selectedPersons.includes(item.id));

  const handleBatchCalc = () => {
    if (!selectedRows.length) {
      setCalcResult('请先勾选需要核定的参保人员。');
      setShowDetail(true);
      return;
    }
    const total = selectedRows.reduce((sum, item) => sum + item.totalAmount, 0);
    setCalcResult(`已按 ${selectedRows.length} 人生成 ${selectedYear} 年度缴费核定结果，应缴总额 ${total.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元。`);
    setShowDetail(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="rounded-full p-2 transition-colors hover:bg-gray-100">
              <ChevronRight className="h-5 w-5 rotate-180 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">年度正常缴费</h1>
              <p className="text-sm text-gray-500">按年度核定城乡居民、灵活就业和续保人员医保应缴费用</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
              <Download className="h-4 w-4" />导出
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
              <Printer className="h-4 w-4" />打印
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_1fr_180px_180px_180px]">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full rounded-lg border px-4 py-2">
                <option value="2026">2026年度</option>
                <option value="2025">2025年度</option>
                <option value="2024">2024年度</option>
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索姓名、身份证号、医保个人编号、险种或地市"
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | Person['status'])} className="rounded-lg border px-4 py-2">
              <option value="all">全部状态</option>
              <option value="pending">待缴费</option>
              <option value="partial">部分缴纳</option>
              <option value="paid">已缴清</option>
            </select>
            <button onClick={handleBatchCalc} className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
              <Calculator className="h-4 w-4" />批量核定
            </button>
            <button
              onClick={() => {
                setKeyword('');
                setStatusFilter('all');
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              重置条件
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm text-gray-500">核定人数</div>
            <div className="mt-1 text-2xl font-bold text-gray-800">{summary.totalPersons}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm text-gray-500">应缴总额</div>
            <div className="mt-1 text-2xl font-bold text-emerald-600">{summary.totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm text-gray-500">已缴金额</div>
            <div className="mt-1 text-2xl font-bold text-green-600">{summary.paidAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="text-sm text-gray-500">待缴金额</div>
            <div className="mt-1 text-2xl font-bold text-orange-600">{summary.pendingAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 className="flex items-center gap-2 font-semibold text-gray-800">
              <Users className="h-5 w-5" />参保人员列表
            </h3>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={filteredPersons.length > 0 && selectedPersons.length === filteredPersons.length} onChange={selectAll} />
              全选当前结果（{selectedPersons.length}）
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[1280px] w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 text-left"><input type="checkbox" checked={filteredPersons.length > 0 && selectedPersons.length === filteredPersons.length} onChange={selectAll} /></th>
                  {['姓名', '身份证号', '医保个人编号', '地市', '险种', '身份类型', '缴费基数', '缴费月数', '应缴金额', '费款所属期', '状态'].map((header) => (
                    <th key={header} className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-600">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPersons.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3"><input type="checkbox" checked={selectedPersons.includes(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium">{p.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{p.idCard}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{p.insuredNo}</td>
                    <td className="whitespace-nowrap px-4 py-3">{p.city}</td>
                    <td className="px-4 py-3">{p.insuranceType}</td>
                    <td className="whitespace-nowrap px-4 py-3">{p.identityType}</td>
                    <td className="whitespace-nowrap px-4 py-3">{p.baseAmount ? `${p.baseAmount.toLocaleString()} 元` : '-'}</td>
                    <td className="whitespace-nowrap px-4 py-3">{p.months}个月</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-emerald-600">{p.totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="whitespace-nowrap px-4 py-3">{p.period}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs ${p.status === 'paid' ? 'bg-green-100 text-green-700' : p.status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                        {p.status === 'paid' ? '已缴清' : p.status === 'partial' ? '部分缴纳' : '待缴费'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDetail && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowDetail(false)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-2xl rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold"><Calculator className="h-5 w-5" />年度缴费核定结果</h3>
              <button onClick={() => setShowDetail(false)} className="rounded-full p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-4"><div className="text-sm text-gray-500">核定年度</div><div className="text-lg font-bold">{selectedYear}年度</div></div>
                <div className="rounded-lg bg-gray-50 p-4"><div className="text-sm text-gray-500">勾选人数</div><div className="text-lg font-bold">{selectedRows.length}人</div></div>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{calcResult}</div>
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex justify-between"><span>核定基数合计</span><span className="font-medium">{selectedRows.reduce((sum, item) => sum + item.baseAmount, 0).toLocaleString()} 元</span></div>
                <div className="mb-2 flex justify-between"><span>缴费月数合计</span><span className="font-medium">{selectedRows.reduce((sum, item) => sum + item.months, 0)} 个月</span></div>
                <div className="flex justify-between border-t pt-2"><span className="font-bold">应缴总额</span><span className="text-xl font-bold text-emerald-600">{selectedRows.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t p-6">
              <button onClick={() => setShowDetail(false)} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">关闭</button>
              <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"><CheckCircle className="h-4 w-4" />确认生成核定单</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
