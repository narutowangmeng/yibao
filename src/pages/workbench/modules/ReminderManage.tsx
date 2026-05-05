import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, Phone, Home, Send, CheckCircle, X, Bell } from 'lucide-react';

interface ArrearRecord {
  id: string;
  name: string;
  idCard: string;
  insuredNo: string;
  city: string;
  phone: string;
  amount: number;
  months: number;
  lastPayDate: string;
  status: '待催缴' | '已催缴' | '已缴清';
  reminderStage: string;
}

const initialRecords: ArrearRecord[] = [
  { id: 'CJ001', name: '王立新', idCard: '320102197903124517', insuredNo: '320100000421587963', city: '南京', phone: '13851702146', amount: 11709.6, months: 12, lastPayDate: '2025-12-21', status: '待催缴', reminderStage: '首次催缴' },
  { id: 'CJ002', name: '周梦洁', idCard: '320205198812143621', insuredNo: '320200000318425174', city: '无锡', phone: '13961827350', amount: 470, months: 12, lastPayDate: '2025-12-29', status: '已催缴', reminderStage: '短信催缴' },
  { id: 'CJ003', name: '陈国梁', idCard: '320303197508214833', insuredNo: '320300000298741552', city: '徐州', phone: '13775840216', amount: 13008, months: 12, lastPayDate: '2025-11-19', status: '待催缴', reminderStage: '电话催缴' },
  { id: 'CJ004', name: '蒋欣悦', idCard: '320402200809063524', insuredNo: '320400000521874236', city: '常州', phone: '13685273419', amount: 350, months: 12, lastPayDate: '2025-12-31', status: '已缴清', reminderStage: '已完成' },
  { id: 'CJ005', name: '顾海峰', idCard: '320507198606174918', insuredNo: '320500000187542963', city: '苏州', phone: '13862471536', amount: 12360, months: 12, lastPayDate: '2025-11-27', status: '待催缴', reminderStage: '首次催缴' },
  { id: 'CJ006', name: '沈雨桐', idCard: '320602199511286728', insuredNo: '320600000365218794', city: '南通', phone: '13962948571', amount: 470, months: 12, lastPayDate: '2025-12-30', status: '已催缴', reminderStage: '短信催缴' },
  { id: 'CJ007', name: '韩世军', idCard: '320703197611035414', insuredNo: '320700000452361875', city: '连云港', phone: '13775496812', amount: 11232, months: 12, lastPayDate: '2025-10-18', status: '待催缴', reminderStage: '上门催缴' },
  { id: 'CJ008', name: '高雅婷', idCard: '320803199304257245', insuredNo: '320800000418527194', city: '淮安', phone: '13852316497', amount: 11808, months: 12, lastPayDate: '2025-12-07', status: '已催缴', reminderStage: '电话催缴' },
  { id: 'CJ009', name: '彭俊杰', idCard: '320902198703093616', insuredNo: '320900000274639518', city: '盐城', phone: '13655184263', amount: 12864, months: 12, lastPayDate: '2025-11-03', status: '待催缴', reminderStage: '首次催缴' },
  { id: 'CJ010', name: '唐若涵', idCard: '321002201302187846', insuredNo: '321000000589632741', city: '扬州', phone: '13852764915', amount: 350, months: 12, lastPayDate: '2025-12-26', status: '已缴清', reminderStage: '已完成' },
  { id: 'CJ011', name: '孔祥瑞', idCard: '321102198410186312', insuredNo: '321100000481235976', city: '镇江', phone: '13952817463', amount: 12120, months: 12, lastPayDate: '2025-11-11', status: '待催缴', reminderStage: '短信催缴' },
  { id: 'CJ012', name: '许书瑶', idCard: '321202199808154028', insuredNo: '321200000392674185', city: '泰州', phone: '13775614892', amount: 470, months: 12, lastPayDate: '2025-12-28', status: '已催缴', reminderStage: '电话催缴' },
  { id: 'CJ013', name: '石向东', idCard: '321302197402264716', insuredNo: '321300000218963457', city: '宿迁', phone: '13675241958', amount: 12672, months: 12, lastPayDate: '2025-10-25', status: '待催缴', reminderStage: '上门催缴' },
  { id: 'CJ014', name: '林婉清', idCard: '320104199210155247', insuredNo: '320100000648275319', city: '南京', phone: '13851976234', amount: 470, months: 12, lastPayDate: '2025-12-31', status: '已催缴', reminderStage: '短信催缴' },
  { id: 'CJ015', name: '赵子昂', idCard: '320585198902137532', insuredNo: '320500000746318529', city: '苏州', phone: '13962145387', amount: 13272, months: 12, lastPayDate: '2025-11-01', status: '待催缴', reminderStage: '电话催缴' },
  { id: 'CJ016', name: '邵雨晨', idCard: '320213200711283844', insuredNo: '320200000825713642', city: '无锡', phone: '13771125864', amount: 350, months: 12, lastPayDate: '2025-12-24', status: '已缴清', reminderStage: '已完成' },
  { id: 'CJ017', name: '郑国成', idCard: '320322198305246358', insuredNo: '320300000934287561', city: '徐州', phone: '13852164375', amount: 11424, months: 12, lastPayDate: '2025-11-22', status: '待催缴', reminderStage: '首次催缴' },
  { id: 'CJ018', name: '陆嘉欣', idCard: '320682199612073126', insuredNo: '320600000173846925', city: '南通', phone: '13656247183', amount: 380, months: 12, lastPayDate: '2025-12-20', status: '已催缴', reminderStage: '短信催缴' },
  { id: 'CJ019', name: '袁晨波', idCard: '320706199001194373', insuredNo: '320700000284617395', city: '连云港', phone: '13961354862', amount: 11064, months: 12, lastPayDate: '2025-11-06', status: '待催缴', reminderStage: '上门催缴' },
  { id: 'CJ020', name: '魏清妍', idCard: '320921199705116824', insuredNo: '320900000392176485', city: '盐城', phone: '13770028645', amount: 11952, months: 12, lastPayDate: '2025-11-15', status: '已催缴', reminderStage: '电话催缴' },
];

const reminderTemplates = [
  { id: 'sms', name: '短信模板', content: '【江苏医保】尊敬的{name}，您尚有{amount}元医保费未缴，请于3个工作日内完成缴费。' },
  { id: 'phone', name: '电话话术', content: '您好，这里是医保中心，提醒您尽快补缴情形医保费用，避免影响待遇享受。' },
  { id: 'door', name: '上门通知', content: '医保催缴告知书：您存在历史欠费，请携带身份证件到参保地医保经办窗口办理。' },
];

export default function ReminderManage({ onBack, onClose }: { onBack?: () => void; onClose?: () => void }) {
  const [activeTab, setActiveTab] = useState<'list' | 'settings'>('list');
  const [records, setRecords] = useState(initialRecords);
  const [keyword, setKeyword] = useState('');
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [reminderType, setReminderType] = useState<'sms' | 'phone' | 'door'>('sms');
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<ArrearRecord | null>(null);

  const filteredRecords = useMemo(
    () => records.filter((item) => [item.id, item.name, item.idCard, item.insuredNo, item.city, item.phone].some((value) => value.includes(keyword))),
    [records, keyword],
  );

  const sendReminder = (ids: string[], type: 'sms' | 'phone' | 'door') => {
    setRecords((prev) =>
      prev.map((item) => (ids.includes(item.id) && item.status !== '已缴清' ? { ...item, status: '已催缴', reminderStage: type === 'sms' ? '短信催缴' : type === 'phone' ? '电话催缴' : '上门催缴' } : item)),
    );
    setShowSendModal(false);
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
              <h1 className="text-xl font-bold text-gray-800">催缴管理</h1>
              <p className="text-sm text-gray-500">针对年度欠费对象开展短信、电话、上门催缴并记录处置结果</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab('list')} className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === 'list' ? 'bg-cyan-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>欠费列表</button>
            <button onClick={() => setActiveTab('settings')} className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === 'settings' ? 'bg-cyan-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>模板设置</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        {activeTab === 'list' && (
          <>
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input value={keyword} onChange={(e) => setKeyword(e.target.value)} type="text" className="w-full rounded-lg border py-2 pl-10 pr-4" placeholder="搜索催缴单号、姓名、身份证号、医保个人编号、地市或手机号" />
                </div>
                <button
                  onClick={() => setShowSendModal(true)}
                  disabled={selectedRecords.length === 0}
                  className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />批量催缴（{selectedRecords.length}）
                </button>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-4 gap-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4"><div className="text-sm text-gray-500">欠费人数</div><div className="mt-1 text-2xl font-bold">{records.length}</div></div>
              <div className="rounded-xl border border-gray-200 bg-white p-4"><div className="text-sm text-gray-500">待催缴</div><div className="mt-1 text-2xl font-bold text-red-600">{records.filter((item) => item.status === '待催缴').length}</div></div>
              <div className="rounded-xl border border-gray-200 bg-white p-4"><div className="text-sm text-gray-500">已催缴</div><div className="mt-1 text-2xl font-bold text-yellow-600">{records.filter((item) => item.status === '已催缴').length}</div></div>
              <div className="rounded-xl border border-gray-200 bg-white p-4"><div className="text-sm text-gray-500">已缴清</div><div className="mt-1 text-2xl font-bold text-green-600">{records.filter((item) => item.status === '已缴清').length}</div></div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-[1360px] w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3"><input type="checkbox" checked={filteredRecords.length > 0 && selectedRecords.length === filteredRecords.length} onChange={() => setSelectedRecords(selectedRecords.length === filteredRecords.length ? [] : filteredRecords.map((item) => item.id))} /></th>
                      {['催缴单号', '姓名', '身份证号', '医保个人编号', '地市', '联系电话', '欠费金额', '欠费月数', '最后缴费日期', '催缴阶段', '状态', '操作'].map((header) => (
                        <th key={header} className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3"><input type="checkbox" checked={selectedRecords.includes(record.id)} onChange={() => setSelectedRecords((prev) => prev.includes(record.id) ? prev.filter((id) => id !== record.id) : [...prev, record.id])} /></td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-cyan-700">{record.id}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium">{record.name}</td>
                        <td className="whitespace-nowrap px-4 py-3">{record.idCard}</td>
                        <td className="whitespace-nowrap px-4 py-3">{record.insuredNo}</td>
                        <td className="whitespace-nowrap px-4 py-3">{record.city}</td>
                        <td className="whitespace-nowrap px-4 py-3">{record.phone}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-red-600">{record.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元</td>
                        <td className="whitespace-nowrap px-4 py-3">{record.months}个月</td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-500">{record.lastPayDate}</td>
                        <td className="whitespace-nowrap px-4 py-3">{record.reminderStage}</td>
                        <td className="whitespace-nowrap px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${record.status === '待催缴' ? 'bg-red-100 text-red-700' : record.status === '已催缴' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{record.status}</span></td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex gap-1 whitespace-nowrap">
                            <button onClick={() => setSelectedDetail(record)} className="rounded p-1.5 text-slate-600 hover:bg-slate-50" title="查看详情"><Bell className="h-4 w-4" /></button>
                            <button onClick={() => sendReminder([record.id], 'sms')} className="rounded p-1.5 text-blue-600 hover:bg-blue-50"><MessageSquare className="h-4 w-4" /></button>
                            <button onClick={() => sendReminder([record.id], 'phone')} className="rounded p-1.5 text-green-600 hover:bg-green-50"><Phone className="h-4 w-4" /></button>
                            <button onClick={() => sendReminder([record.id], 'door')} className="rounded p-1.5 text-orange-600 hover:bg-orange-50"><Home className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-800">催缴模板设置</h3>
            <div className="space-y-4">
              {reminderTemplates.map((template) => (
                <div key={template.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2 font-medium">
                    {template.id === 'sms' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                    {template.id === 'phone' && <Phone className="h-4 w-4 text-green-600" />}
                    {template.id === 'door' && <Home className="h-4 w-4 text-orange-600" />}
                    {template.name}
                  </div>
                  <textarea className="w-full rounded-lg border px-3 py-2 text-sm" rows={2} defaultValue={template.content} />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">保存设置</button>
            </div>
          </div>
        )}
      </div>

      {showSendModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowSendModal(false)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-md rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-bold">批量催缴</h3>
            <p className="mb-4 text-gray-600">已选中 {selectedRecords.length} 人</p>
            <div className="space-y-2 mb-6">
              <button onClick={() => setReminderType('sms')} className={`w-full rounded-lg border p-3 text-left ${reminderType === 'sms' ? 'border-cyan-500 bg-cyan-50' : ''}`}>短信催缴</button>
              <button onClick={() => setReminderType('phone')} className={`w-full rounded-lg border p-3 text-left ${reminderType === 'phone' ? 'border-cyan-500 bg-cyan-50' : ''}`}>电话催缴</button>
              <button onClick={() => setReminderType('door')} className={`w-full rounded-lg border p-3 text-left ${reminderType === 'door' ? 'border-cyan-500 bg-cyan-50' : ''}`}>上门催缴</button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowSendModal(false)} className="flex-1 rounded-lg border px-4 py-2">取消</button>
              <button onClick={() => sendReminder(selectedRecords, reminderType)} className="flex-1 rounded-lg bg-cyan-600 px-4 py-2 text-white">确认发送</button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {selectedDetail && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedDetail(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="w-full max-w-2xl rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">催缴详情 - {selectedDetail.id}</h3>
              <button onClick={() => setSelectedDetail(null)} className="rounded-full p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['姓名', selectedDetail.name],
                ['身份证号', selectedDetail.idCard],
                ['医保个人编号', selectedDetail.insuredNo],
                ['参保地市', selectedDetail.city],
                ['联系电话', selectedDetail.phone],
                ['欠费金额', `${selectedDetail.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 元`],
                ['欠费月数', `${selectedDetail.months} 个月`],
                ['最后缴费日期', selectedDetail.lastPayDate],
                ['催缴阶段', selectedDetail.reminderStage],
                ['状态', selectedDetail.status],
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
