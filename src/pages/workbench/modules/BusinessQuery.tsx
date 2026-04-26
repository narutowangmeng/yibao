import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Users, Clock, FileText, Wallet, Eye, Download, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';

interface QueryResult {
  id: string;
  type: 'enrollment' | 'payment' | 'reimbursement' | 'account';
  name: string;
  idCard: string;
  city: string;
  title: string;
  date: string;
  amount?: number;
  status: string;
  detail: string;
}

const queryTypes = [
  { id: 'enrollment', label: '参保信息', icon: Users },
  { id: 'payment', label: '缴费记录', icon: Clock },
  { id: 'reimbursement', label: '报销记录', icon: FileText },
  { id: 'account', label: '个人账户', icon: Wallet },
] as const;

const mockResults: QueryResult[] = [
  { id: 'YW320100202604001', type: 'enrollment', name: '陈思远', idCard: '320102198903152415', city: '南京', title: '城镇职工正常参保', date: '2026-04-02', status: '在保', detail: '参保单位为江苏省人民医院，缴费状态正常。' },
  { id: 'YW320200202604002', type: 'enrollment', name: '顾雨晨', idCard: '320211199410083629', city: '无锡', title: '城乡居民参保登记', date: '2026-03-15', status: '在保', detail: '所属社区为梁溪区广益街道，享受居民医保待遇。' },
  { id: 'YW320300202604003', type: 'enrollment', name: '王子扬', idCard: '320303197612054331', city: '徐州', title: '灵活就业参保', date: '2026-02-22', status: '在保', detail: '按灵活就业人员月度缴费档次参保。' },
  { id: 'YW320400202604004', type: 'enrollment', name: '沈佳宁', idCard: '320402199211236628', city: '常州', title: '城镇职工续保', date: '2026-01-18', status: '在保', detail: '工作单位为常州市第二人民医院，缴费基数已同步。' },
  { id: 'YW320500202604005', type: 'enrollment', name: '陆书怡', idCard: '320507200812163214', city: '苏州', title: '学生参保登记', date: '2026-03-01', status: '在保', detail: '就读于苏州工业园区星海实验中学，学生身份有效。' },
  { id: 'YW320600202604006', type: 'payment', name: '许文博', idCard: '320602198805204517', city: '南通', title: '2026年4月职工医保缴费', date: '2026-04-10', amount: 1280, status: '已到账', detail: '单位代扣代缴完成，到账日期为2026-04-10。' },
  { id: 'YW320700202604007', type: 'payment', name: '孙明轩', idCard: '320703198507276419', city: '连云港', title: '2026年居民医保缴费', date: '2026-03-26', amount: 450, status: '已缴费', detail: '居民医保个人缴费部分已完成，财政补助待入账。' },
  { id: 'YW320800202604008', type: 'payment', name: '朱雨彤', idCard: '320802199912167245', city: '淮安', title: '2026年4月灵活就业缴费', date: '2026-04-08', amount: 980, status: '已到账', detail: '灵活就业线上自主缴费成功。' },
  { id: 'YW320900202604009', type: 'payment', name: '何嘉悦', idCard: '320902200104217820', city: '盐城', title: '2026年学生医保缴费', date: '2026-02-20', amount: 380, status: '已缴费', detail: '学校统一代收代缴完成。' },
  { id: 'YW321000202604010', type: 'payment', name: '郭天宇', idCard: '321002198610024671', city: '扬州', title: '2026年4月职工医保补缴情形', date: '2026-04-16', amount: 620, status: '补缴完成', detail: '补缴情形为基数调整后差额补缴。' },
  { id: 'YW321100202604011', type: 'reimbursement', name: '宋知行', idCard: '321102197905185812', city: '镇江', title: '住院费用报销', date: '2026-04-11', amount: 12740, status: '已退回', detail: '高值耗材授权单缺失，需补充材料后重新申报。' },
  { id: 'YW321200202604012', type: 'reimbursement', name: '丁晓萌', idCard: '321202199512238426', city: '泰州', title: '门诊统筹结算', date: '2026-04-14', amount: 430, status: '已结算', detail: '泰州市人民医院门诊统筹直接结算成功。' },
  { id: 'YW321300202604013', type: 'reimbursement', name: '袁晨浩', idCard: '321302198311146117', city: '宿迁', title: '异地就医住院报销', date: '2026-04-20', amount: 21460, status: '审核中', detail: '跨省异地住院明细已回传，待复审。' },
  { id: 'YW320100202604014', type: 'reimbursement', name: '林若溪', idCard: '320104199807223942', city: '南京', title: '门诊慢特病结算', date: '2026-04-13', amount: 1760, status: '已结算', detail: '系统性红斑狼疮门慢费用已按政策支付。' },
  { id: 'YW320500202604015', type: 'reimbursement', name: '赵嘉铭', idCard: '320506197702013655', city: '苏州', title: '住院报销支付', date: '2026-04-10', amount: 8360, status: '已支付', detail: '报销款已拨付至本人社保卡金融账户。' },
  { id: 'YW320200202604016', type: 'account', name: '顾欣怡', idCard: '320205200011053728', city: '无锡', title: '个人账户余额', date: '2026-04-21', amount: 4580.5, status: '正常', detail: '本年划入 2400 元，本年支出 1260.5 元。' },
  { id: 'YW320300202604017', type: 'account', name: '韩亦辰', idCard: '320322198404206318', city: '徐州', title: '个人账户余额', date: '2026-04-06', amount: 3298.2, status: '正常', detail: '近三个月账户余额稳定，无冻结记录。' },
  { id: 'YW320700202604018', type: 'account', name: '蒋安琪', idCard: '320706199302148924', city: '连云港', title: '个人账户余额', date: '2026-04-03', amount: 2856.8, status: '正常', detail: '账户可用于定点零售药店购药结算。' },
  { id: 'YW320900202604019', type: 'account', name: '郑博文', idCard: '320921198612302416', city: '盐城', title: '个人账户余额', date: '2026-04-22', amount: 5120.4, status: '正常', detail: '近一年累计划入 5860 元。' },
  { id: 'YW321000202604020', type: 'account', name: '陶诗雅', idCard: '321003199611058260', city: '扬州', title: '个人账户余额', date: '2026-04-18', amount: 3672.9, status: '正常', detail: '门诊统筹与个人账户支付记录均正常。' },
];

export default function BusinessQuery({ onBack }: { onBack: () => void }) {
  const [queryType, setQueryType] = useState<(typeof queryTypes)[number]['id']>('enrollment');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<QueryResult | null>(null);

  const filteredResults = useMemo(
    () =>
      mockResults.filter(
        (item) =>
          item.type === queryType &&
          [item.name, item.idCard, item.id, item.city, item.title].some((value) => value.includes(searchTerm)),
      ),
    [queryType, searchTerm],
  );

  const exportRows = () => {
    const rows = filteredResults.map((item) => ({
      业务编号: item.id,
      查询类型: queryTypes.find((type) => type.id === item.type)?.label,
      姓名: item.name,
      身份证号: item.idCard,
      所属地市: item.city,
      业务内容: item.title,
      业务日期: item.date,
      金额: item.amount ?? '',
      状态: item.status,
      说明: item.detail,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, '业务查询');
    XLSX.writeFile(workbook, `业务查询结果_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const currentLabel = queryTypes.find((item) => item.id === queryType)?.label ?? '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="rounded-full p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">业务查询</h1>
            <p className="text-sm text-gray-500">参保、缴费、报销、个人账户统一查询</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 grid grid-cols-4 gap-4">
          {queryTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setQueryType(type.id)}
              className={`rounded-2xl border-2 p-4 text-left transition-all ${
                queryType === type.id ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <type.icon className={`mb-3 h-6 w-6 ${queryType === type.id ? 'text-cyan-600' : 'text-gray-400'}`} />
              <div className={`font-medium ${queryType === type.id ? 'text-cyan-700' : 'text-gray-700'}`}>{type.label}</div>
            </button>
          ))}
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4"
                placeholder="请输入姓名、身份证号、业务编号、所属地市或业务内容查询"
              />
            </div>
            <button onClick={exportRows} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-white hover:bg-cyan-700">
              <Download className="h-4 w-4" />
              导出结果
            </button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="text-sm text-gray-500">{currentLabel}记录</div>
              <div className="mt-2 text-3xl font-bold text-gray-800">{filteredResults.length}</div>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-sm text-emerald-700">已办结</div>
              <div className="mt-2 text-3xl font-bold text-emerald-600">{filteredResults.filter((item) => ['在保', '已到账', '已缴费', '已结算', '已支付', '正常', '补缴完成'].includes(item.status)).length}</div>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="text-sm text-amber-700">处理中</div>
              <div className="mt-2 text-3xl font-bold text-amber-600">{filteredResults.filter((item) => item.status.includes('审核')).length}</div>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="text-sm text-blue-700">涉及地市</div>
              <div className="mt-2 text-3xl font-bold text-blue-600">{new Set(filteredResults.map((item) => item.city)).size}</div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full min-w-[1280px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">业务编号</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">身份证号</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">所属地市</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">业务内容</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">业务日期</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">金额</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result) => (
                  <tr key={result.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-cyan-600">{result.id}</td>
                    <td className="px-6 py-4">{result.name}</td>
                    <td className="px-6 py-4">{result.idCard}</td>
                    <td className="px-6 py-4">{result.city}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{result.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{result.date}</td>
                    <td className="px-6 py-4 text-sm font-medium text-cyan-600">{result.amount ? `¥${result.amount.toFixed(2)}` : '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{result.status}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setSelectedRecord(result)} className="rounded p-2 text-cyan-600 hover:bg-cyan-50">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-2xl bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{selectedRecord.title}</h3>
                  <p className="text-sm text-gray-500">{selectedRecord.id}</p>
                </div>
                <button onClick={() => setSelectedRecord(null)} className="rounded-full p-2 hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-gray-500">姓名</div>
                  <div className="mt-1 font-medium">{selectedRecord.name}</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-gray-500">身份证号</div>
                  <div className="mt-1 font-medium">{selectedRecord.idCard}</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-gray-500">所属地市</div>
                  <div className="mt-1 font-medium">{selectedRecord.city}</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-gray-500">状态</div>
                  <div className="mt-1 font-medium">{selectedRecord.status}</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    业务日期
                  </div>
                  <div className="mt-1 font-medium">{selectedRecord.date}</div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-gray-500">金额</div>
                  <div className="mt-1 font-medium">{selectedRecord.amount ? `¥${selectedRecord.amount.toFixed(2)}` : '-'}</div>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-cyan-50 p-4 text-sm text-cyan-900">{selectedRecord.detail}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
