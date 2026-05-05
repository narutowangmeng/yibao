import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Printer, Mail, Eye, FileText, X } from 'lucide-react';

interface NoticeRecord {
  id: string;
  name: string;
  idCard: string;
  insuredNo: string;
  city: string;
  phone: string;
  amount: number;
  period: string;
  noticeType: string;
  status: '待发送' | '已发送' | '已打印';
  createTime: string;
}

const initialRecords: NoticeRecord[] = [
  { id: 'TZ001', name: '王立新', idCard: '320102197903124517', insuredNo: '320100000421587963', city: '南京', phone: '13851702146', amount: 11709.6, period: '2026年度', noticeType: '灵活就业年度缴费通知单', status: '待发送', createTime: '2026-04-08 09:12' },
  { id: 'TZ002', name: '周梦洁', idCard: '320205198812143621', insuredNo: '320200000318425174', city: '无锡', phone: '13961827350', amount: 470, period: '2026年度', noticeType: '城乡居民缴费通知单', status: '已发送', createTime: '2026-04-08 09:25' },
  { id: 'TZ003', name: '陈国梁', idCard: '320303197508214833', insuredNo: '320300000298741552', city: '徐州', phone: '13775840216', amount: 13008, period: '2026年度', noticeType: '退休续保补缴通知单', status: '已打印', createTime: '2026-04-08 09:36' },
  { id: 'TZ004', name: '蒋欣悦', idCard: '320402200809063524', insuredNo: '320400000521874236', city: '常州', phone: '13685273419', amount: 350, period: '2026年度', noticeType: '学生参保缴费通知单', status: '待发送', createTime: '2026-04-08 09:41' },
  { id: 'TZ005', name: '顾海峰', idCard: '320507198606174918', insuredNo: '320500000187542963', city: '苏州', phone: '13862471536', amount: 12360, period: '2026年度', noticeType: '灵活就业年度缴费通知单', status: '已发送', createTime: '2026-04-08 10:06' },
  { id: 'TZ006', name: '沈雨桐', idCard: '320602199511286728', insuredNo: '320600000365218794', city: '南通', phone: '13962948571', amount: 470, period: '2026年度', noticeType: '城乡居民缴费通知单', status: '已打印', createTime: '2026-04-08 10:18' },
  { id: 'TZ007', name: '韩世军', idCard: '320703197611035414', insuredNo: '320700000452361875', city: '连云港', phone: '13775496812', amount: 11232, period: '2026年度', noticeType: '单位停保续缴通知单', status: '待发送', createTime: '2026-04-08 10:26' },
  { id: 'TZ008', name: '高雅婷', idCard: '320803199304257245', insuredNo: '320800000418527194', city: '淮安', phone: '13852316497', amount: 11808, period: '2026年度', noticeType: '灵活就业年度缴费通知单', status: '已发送', createTime: '2026-04-08 10:35' },
  { id: 'TZ009', name: '彭俊杰', idCard: '320902198703093616', insuredNo: '320900000274639518', city: '盐城', phone: '13655184263', amount: 12864, period: '2026年度', noticeType: '退休续保补缴通知单', status: '已打印', createTime: '2026-04-08 10:42' },
  { id: 'TZ010', name: '唐若涵', idCard: '321002201302187846', insuredNo: '321000000589632741', city: '扬州', phone: '13852764915', amount: 350, period: '2026年度', noticeType: '学生参保缴费通知单', status: '待发送', createTime: '2026-04-08 10:56' },
  { id: 'TZ011', name: '孔祥瑞', idCard: '321102198410186312', insuredNo: '321100000481235976', city: '镇江', phone: '13952817463', amount: 12120, period: '2026年度', noticeType: '灵活就业年度缴费通知单', status: '已发送', createTime: '2026-04-08 11:07' },
  { id: 'TZ012', name: '许书瑶', idCard: '321202199808154028', insuredNo: '321200000392674185', city: '泰州', phone: '13775614892', amount: 470, period: '2026年度', noticeType: '城乡居民缴费通知单', status: '待发送', createTime: '2026-04-08 11:18' },
  { id: 'TZ013', name: '石向东', idCard: '321302197402264716', insuredNo: '321300000218963457', city: '宿迁', phone: '13675241958', amount: 12672, period: '2026年度', noticeType: '退休续保补缴通知单', status: '已打印', createTime: '2026-04-08 11:26' },
  { id: 'TZ014', name: '林婉清', idCard: '320104199210155247', insuredNo: '320100000648275319', city: '南京', phone: '13851976234', amount: 470, period: '2026年度', noticeType: '城乡居民缴费通知单', status: '待发送', createTime: '2026-04-08 11:37' },
  { id: 'TZ015', name: '赵子昂', idCard: '320585198902137532', insuredNo: '320500000746318529', city: '苏州', phone: '13962145387', amount: 13272, period: '2026年度', noticeType: '单位停保续缴通知单', status: '已发送', createTime: '2026-04-08 11:53' },
  { id: 'TZ016', name: '邵雨晨', idCard: '320213200711283844', insuredNo: '320200000825713642', city: '无锡', phone: '13771125864', amount: 350, period: '2026年度', noticeType: '学生参保缴费通知单', status: '已打印', createTime: '2026-04-08 12:05' },
  { id: 'TZ017', name: '郑国成', idCard: '320322198305246358', insuredNo: '320300000934287561', city: '徐州', phone: '13852164375', amount: 11424, period: '2026年度', noticeType: '灵活就业年度缴费通知单', status: '待发送', createTime: '2026-04-08 12:14' },
  { id: 'TZ018', name: '陆嘉欣', idCard: '320682199612073126', insuredNo: '320600000173846925', city: '南通', phone: '13656247183', amount: 380, period: '2026年度', noticeType: '新生儿参保缴费通知单', status: '已发送', createTime: '2026-04-08 12:26' },
  { id: 'TZ019', name: '袁晨波', idCard: '320706199001194373', insuredNo: '320700000284617395', city: '连云港', phone: '13961354862', amount: 11064, period: '2026年度', noticeType: '单位停保续缴通知单', status: '待发送', createTime: '2026-04-08 12:39' },
  { id: 'TZ020', name: '魏清妍', idCard: '320921199705116824', insuredNo: '320900000392176485', city: '盐城', phone: '13770028645', amount: 11952, period: '2026年度', noticeType: '灵活就业年度缴费通知单', status: '已打印', createTime: '2026-04-08 12:52' },
];

export default function PaymentNotice({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<NoticeRecord | null>(null);
  const [records, setRecords] = useState(initialRecords);

  const filteredRecords = useMemo(
    () => records.filter((item) => [item.id, item.name, item.idCard, item.insuredNo, item.city, item.noticeType].some((value) => value.includes(searchTerm))),
    [records, searchTerm],
  );

  const handleStatus = (id: string, status: NoticeRecord['status']) => {
    setRecords((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    setSelectedRecord((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
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
              <h1 className="text-xl font-bold text-gray-800">缴费通知单</h1>
              <p className="text-sm text-gray-500">生成、查看、打印和发送个人年度缴费通知单</p>
            </div>
          </div>
          <button onClick={() => records[0] && setSelectedRecord(records[0])} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
            <FileText className="h-4 w-4" />
            生成通知单
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4"
                placeholder="搜索通知单号、姓名、身份证号、医保个人编号、地市或通知类型"
              />
            </div>
            <button className="rounded-xl bg-emerald-600 px-6 py-3 text-white">查询</button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[1440px] w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['通知单号', '姓名', '身份证号', '医保个人编号', '地市', '联系电话', '通知类型', '应缴金额', '费款所属期', '生成时间', '状态', '操作'].map((header) => (
                    <th key={header} className="whitespace-nowrap px-6 py-3 text-left text-sm font-medium text-gray-600">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-cyan-700">{record.id}</td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-800">{record.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">{record.idCard}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">{record.insuredNo}</td>
                    <td className="whitespace-nowrap px-6 py-4">{record.city}</td>
                    <td className="whitespace-nowrap px-6 py-4">{record.phone}</td>
                    <td className="px-6 py-4">{record.noticeType}</td>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-emerald-600">{record.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元</td>
                    <td className="whitespace-nowrap px-6 py-4">{record.period}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">{record.createTime}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${record.status === '待发送' ? 'bg-yellow-100 text-yellow-700' : record.status === '已发送' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{record.status}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <button onClick={() => setSelectedRecord(record)} className="rounded-lg border border-blue-200 p-2 text-blue-600 hover:bg-blue-50"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleStatus(record.id, '已打印')} className="rounded-lg border border-green-200 p-2 text-green-600 hover:bg-green-50"><Printer className="h-4 w-4" /></button>
                        <button onClick={() => handleStatus(record.id, '已发送')} className="rounded-lg border border-orange-200 p-2 text-orange-600 hover:bg-orange-50"><Mail className="h-4 w-4" /></button>
                      </div>
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
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-3xl rounded-2xl bg-white p-8" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-gray-800">江苏省医疗保险缴费通知单</h3>
              <p className="mt-1 text-sm text-gray-500">通知单号：{selectedRecord.id}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['姓名', selectedRecord.name],
                ['身份证号', selectedRecord.idCard],
                ['医保个人编号', selectedRecord.insuredNo],
                ['参保地市', selectedRecord.city],
                ['联系电话', selectedRecord.phone],
                ['通知类型', selectedRecord.noticeType],
                ['费款所属期', selectedRecord.period],
                ['生成时间', selectedRecord.createTime],
                ['应缴金额', `${selectedRecord.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元`],
                ['当前状态', selectedRecord.status],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg border p-4 text-sm text-gray-600">
              请持本通知单于费款所属期内通过经办窗口、医保公共服务平台或指定缴费渠道完成缴费。逾期未缴费的，按当地年度征缴规则办理。
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setSelectedRecord(null)} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">关闭</button>
              <button onClick={() => handleStatus(selectedRecord.id, '已打印')} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"><Printer className="h-4 w-4" />打印</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
