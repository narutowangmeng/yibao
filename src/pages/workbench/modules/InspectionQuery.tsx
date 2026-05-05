import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Download, Eye, X, CheckCircle, Clock, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

type InspectionStatus = '已完成' | '进行中' | '待处理';

interface InspectionRecord {
  id: string;
  institution: string;
  city: string;
  type: string;
  status: InspectionStatus;
  date: string;
  amount: number;
  inspector: string;
  issues: number;
  description: string;
  actionResult: string;
  fundRecovery: string;
}

const records: InspectionRecord[] = [
  { id: 'JH320100202605001', institution: '江苏省人民医院', city: '南京', type: '专项稽核', status: '已完成', date: '2026-04-15', amount: 125000, inspector: '周岚', issues: 3, description: '医保目录执行及高值耗材收费专项稽核', actionResult: '责令整改并追回基金 2.5 万元', fundRecovery: '2.5 万元' },
  { id: 'JH320500202605002', institution: '苏州雷允上双通道药房', city: '苏州', type: '飞行检查', status: '进行中', date: '2026-04-16', amount: 89000, inspector: '陆敏', issues: 1, description: '双通道处方流转与审方记录核查', actionResult: '待形成正式检查意见', fundRecovery: '待核定' },
  { id: 'JH320200202605003', institution: '无锡市人民医院', city: '无锡', type: '日常巡查', status: '已完成', date: '2026-04-14', amount: 56000, inspector: '钱莉', issues: 0, description: '门诊慢特病待遇执行巡查', actionResult: '未发现明显违规问题', fundRecovery: '0 元' },
  { id: 'JH320400202605004', institution: '常州市第二人民医院', city: '常州', type: '专项稽核', status: '待处理', date: '2026-04-18', amount: 156000, inspector: '蒋雯', issues: 5, description: '医疗服务价格执行与拆分收费检查', actionResult: '待下发处理决定书', fundRecovery: '拟追回 4.6 万元' },
  { id: 'JH320300202605005', institution: '徐州市中心医院', city: '徐州', type: '飞行检查', status: '已完成', date: '2026-04-11', amount: 103000, inspector: '赵静', issues: 2, description: '门诊慢特病处方流转与结算一致性检查', actionResult: '追回基金 1.2 万元并约谈科室负责人', fundRecovery: '1.2 万元' },
  { id: 'JH320600202605006', institution: '南通大学附属医院', city: '南通', type: '专项稽核', status: '进行中', date: '2026-04-19', amount: 182000, inspector: '高宁', issues: 4, description: '高值耗材采购与使用台账核验', actionResult: '现场核对耗材出入库记录中', fundRecovery: '待核定' },
  { id: 'JH320700202605007', institution: '连云港市第一人民医院', city: '连云港', type: '日常巡查', status: '已完成', date: '2026-04-09', amount: 47000, inspector: '韩雪', issues: 1, description: '异地就医直接结算业务规范检查', actionResult: '补充完善转诊备案留痕', fundRecovery: '0.3 万元' },
  { id: 'JH320800202605008', institution: '淮安市第一人民医院', city: '淮安', type: '专项稽核', status: '待处理', date: '2026-04-20', amount: 136000, inspector: '严峰', issues: 6, description: '康复项目频次及住院指征专项检查', actionResult: '拟暂停相关科室医保结算权限', fundRecovery: '拟追回 5.1 万元' },
  { id: 'JH320900202605009', institution: '盐城市第三人民医院', city: '盐城', type: '飞行检查', status: '已完成', date: '2026-04-08', amount: 78000, inspector: '曹颖', issues: 2, description: '双通道药店处方外配协同检查', actionResult: '追回违规结算 0.8 万元', fundRecovery: '0.8 万元' },
  { id: 'JH321000202605010', institution: '扬州大学附属医院', city: '扬州', type: '日常巡查', status: '进行中', date: '2026-04-17', amount: 69000, inspector: '邱琳', issues: 2, description: '住院病案首页与结算清单一致性核查', actionResult: '正在补调病案首页影像', fundRecovery: '待核定' },
];

const exportHeaders = ['稽核单号', '医疗机构', '参保地市', '稽核类型', '状态', '稽核日期', '涉及金额', '稽核人员', '问题数量', '检查描述', '处理结果', '基金追回'];

export default function InspectionQuery({ onBack }: { onBack: () => void }) {
  const [keyword, setKeyword] = useState('');
  const [selectedItem, setSelectedItem] = useState<InspectionRecord | null>(null);

  const filtered = useMemo(
    () => records.filter((item) => [item.id, item.institution, item.inspector, item.type, item.city].some((value) => value.includes(keyword))),
    [keyword],
  );

  const statusBadge = (status: InspectionStatus) => {
    const styles = { 已完成: 'bg-green-100 text-green-700', 进行中: 'bg-blue-100 text-blue-700', 待处理: 'bg-yellow-100 text-yellow-700' };
    const icons = { 已完成: CheckCircle, 进行中: Clock, 待处理: FileText };
    const Icon = icons[status];
    return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}><Icon className="h-3 w-3" />{status}</span>;
  };

  const toRow = (item: InspectionRecord) => ({
    稽核单号: item.id,
    医疗机构: item.institution,
    参保地市: item.city,
    稽核类型: item.type,
    状态: item.status,
    稽核日期: item.date,
    涉及金额: item.amount,
    稽核人员: item.inspector,
    问题数量: item.issues,
    检查描述: item.description,
    处理结果: item.actionResult,
    基金追回: item.fundRecovery,
  });

  const handleExport = () => {
    const sheet = XLSX.utils.json_to_sheet(filtered.map(toRow), { header: exportHeaders });
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, '稽核查询');
    XLSX.writeFile(book, `稽核查询结果_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100"><ArrowLeft className="h-5 w-5" /></button>
          <h3 className="text-xl font-bold">稽核查询</h3>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white">
          <Download className="h-4 w-4" />
          导出查询结果
        </button>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4"><p className="text-sm text-gray-500">稽核记录</p><p className="mt-2 text-3xl font-bold text-gray-800">{records.length}</p></div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4"><p className="text-sm text-green-700">已完成</p><p className="mt-2 text-3xl font-bold text-green-600">{records.filter((item) => item.status === '已完成').length}</p></div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4"><p className="text-sm text-blue-700">进行中</p><p className="mt-2 text-3xl font-bold text-blue-600">{records.filter((item) => item.status === '进行中').length}</p></div>
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4"><p className="text-sm text-yellow-700">待处理</p><p className="mt-2 text-3xl font-bold text-yellow-600">{records.filter((item) => item.status === '待处理').length}</p></div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="请输入稽核单号、医疗机构、地市、稽核人员、稽核类型查询" className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full min-w-[1040px]">
          <thead className="bg-gray-50">
            <tr>
              {['稽核单号', '医疗机构', '参保地市', '稽核类型', '状态', '稽核日期', '稽核人员', '问题数量', '操作'].map((header) => <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-600">{header}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-cyan-600">{item.id}</td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3">{item.city}</td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3">{statusBadge(item.status)}</td>
                <td className="px-4 py-3">{item.date}</td>
                <td className="px-4 py-3">{item.inspector}</td>
                <td className="px-4 py-3">{item.issues}</td>
                <td className="px-4 py-3"><button onClick={() => setSelectedItem(item)} className="rounded p-2 text-cyan-600 hover:bg-cyan-50"><Eye className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedItem(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-3xl rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-bold">稽核详情</h4>
                <button onClick={() => setSelectedItem(null)} className="rounded p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border p-4">
                  <h5 className="mb-3 font-bold">基础信息</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">稽核单号</span><span>{selectedItem.id}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">医疗机构</span><span>{selectedItem.institution}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">参保地市</span><span>{selectedItem.city}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">稽核类型</span><span>{selectedItem.type}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">稽核状态</span>{statusBadge(selectedItem.status)}</div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <h5 className="mb-3 font-bold">金额与处置</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">涉及金额</span><span>￥{selectedItem.amount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">问题数量</span><span>{selectedItem.issues}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">基金追回</span><span>{selectedItem.fundRecovery}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">稽核人员</span><span>{selectedItem.inspector}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">稽核日期</span><span>{selectedItem.date}</span></div>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <h5 className="mb-2 font-bold">检查描述</h5>
                  <div className="text-gray-700">{selectedItem.description}</div>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <h5 className="mb-2 font-bold">处理结果</h5>
                  <div className="text-gray-700">{selectedItem.actionResult}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
