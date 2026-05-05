import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle, Search, Download, Eye, CreditCard } from 'lucide-react';
import { exportJsonToWorkbook } from '../../../utils/exportHelpers';

interface PaymentItem {
  id: string;
  institution: string;
  city: string;
  amount: number;
  bankName: string;
  bankAccount: string;
  batchNo: string;
  status: '待拨付' | '拨付中' | '已完成';
  applyTime: string;
}

const initialRows: PaymentItem[] = [
  { id: 'PM320001', institution: '南京市第一医院', city: '南京', amount: 2850000, bankName: '工商银行南京玄武支行', bankAccount: '3201****1234', batchNo: 'BF20260502001', status: '待拨付', applyTime: '2026-05-02 09:00' },
  { id: 'PM320002', institution: '苏州大学附属第一医院', city: '苏州', amount: 4200000, bankName: '建设银行苏州工业园区支行', bankAccount: '3205****5678', batchNo: 'BF20260502002', status: '待拨付', applyTime: '2026-05-02 09:30' },
  { id: 'PM320003', institution: '无锡市人民医院', city: '无锡', amount: 1980000, bankName: '农业银行无锡分行营业部', bankAccount: '3202****9012', batchNo: 'BF20260502003', status: '拨付中', applyTime: '2026-05-02 10:10' },
  { id: 'PM320004', institution: '徐州市中心医院', city: '徐州', amount: 2560000, bankName: '中国银行徐州云龙支行', bankAccount: '3203****2468', batchNo: 'BF20260502004', status: '已完成', applyTime: '2026-05-02 10:42' },
];

export default function PaymentManage({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState<PaymentItem[]>(initialRows);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [keyword, setKeyword] = useState('');
  const [selectedItem, setSelectedItem] = useState<PaymentItem | null>(null);

  const filteredData = useMemo(
    () => rows.filter((item) => [item.institution, item.city, item.id, item.batchNo].some((field) => field.includes(keyword))),
    [rows, keyword],
  );

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const totalAmount = filteredData.filter((item) => selectedItems.includes(item.id)).reduce((sum, item) => sum + item.amount, 0);

  const handlePayment = (batch = false) => {
    const targetIds = batch ? selectedItems : selectedItem ? [selectedItem.id] : [];
    if (!targetIds.length) return;
    setRows((prev) => prev.map((item) => (targetIds.includes(item.id) ? { ...item, status: '已完成' } : item)));
    setSelectedItems([]);
    setSelectedItem(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100"><ArrowLeft className="h-5 w-5" /></button>
          <h3 className="text-xl font-bold">拨付管理</h3>
        </div>
        <button
          onClick={() =>
            exportJsonToWorkbook(
              rows.map((item) => ({
                拨付单号: item.batchNo,
                医疗机构: item.institution,
                地市: item.city,
                拨付金额: item.amount,
                开户行: item.bankName,
                账号: item.bankAccount,
                状态: item.status,
                申请时间: item.applyTime,
              })),
              '拨付管理',
              '基金拨付管理.xlsx',
            )
          }
          className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />导出
        </button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4"><div className="text-2xl font-bold text-blue-600">{filteredData.filter((item) => item.status === '待拨付').length}</div><div className="text-sm text-gray-600">待拨付</div></div>
        <div className="rounded-xl border border-green-100 bg-green-50 p-4"><div className="text-2xl font-bold text-green-600">￥{(totalAmount / 10000).toFixed(2)}万</div><div className="text-sm text-gray-600">已选金额</div></div>
        <div className="rounded-xl border border-purple-100 bg-purple-50 p-4"><div className="text-2xl font-bold text-purple-600">{selectedItems.length}</div><div className="text-sm text-gray-600">已选笔数</div></div>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-4 border-b p-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} type="text" placeholder="搜索机构、地市、单号、拨付批次" className="w-full rounded-lg border py-2 pl-10 pr-4" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" checked={selectedItems.length > 0 && selectedItems.length === filteredData.length} onChange={() => setSelectedItems(selectedItems.length === filteredData.length ? [] : filteredData.map((item) => item.id))} className="rounded" /></th>
                <th className="px-4 py-3 text-left text-sm font-medium">拨付单号</th>
                <th className="px-4 py-3 text-left text-sm font-medium">医疗机构</th>
                <th className="px-4 py-3 text-left text-sm font-medium">地市</th>
                <th className="px-4 py-3 text-left text-sm font-medium">金额</th>
                <th className="px-4 py-3 text-left text-sm font-medium">银行信息</th>
                <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleSelect(item.id)} className="rounded" /></td>
                  <td className="px-4 py-3 font-medium text-cyan-700">{item.batchNo}</td>
                  <td className="px-4 py-3">{item.institution}</td>
                  <td className="px-4 py-3">{item.city}</td>
                  <td className="px-4 py-3 font-medium text-blue-600">￥{item.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{item.bankName} {item.bankAccount}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs ${item.status === '待拨付' ? 'bg-yellow-100 text-yellow-700' : item.status === '拨付中' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{item.status}</span></td>
                  <td className="px-4 py-3 text-right"><button onClick={() => setSelectedItem(item)} className="p-2 text-gray-400 hover:text-blue-600"><Eye className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <h4 className="mb-4 font-medium">拨付确认</h4>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-gray-600">拨付方式</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full rounded-lg border px-3 py-2">
              <option value="bank">银行转账</option>
              <option value="check">支票</option>
              <option value="cash">现金</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">拨付日期</label>
            <input type="date" className="w-full rounded-lg border px-3 py-2" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handlePayment(true)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700">
            <CheckCircle className="h-4 w-4" />批量拨付
          </button>
          <button onClick={() => selectedItem && handlePayment(false)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 hover:bg-gray-50">
            <CreditCard className="h-4 w-4" />当前详情拨付
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedItem(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-2xl rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-bold">拨付详情</h4>
                <button onClick={() => setSelectedItem(null)} className="rounded p-2 hover:bg-gray-100">关闭</button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-gray-50 p-3"><div className="text-gray-500">医疗机构</div><div className="mt-1 font-medium">{selectedItem.institution}</div></div>
                <div className="rounded-lg bg-gray-50 p-3"><div className="text-gray-500">拨付单号</div><div className="mt-1 font-medium">{selectedItem.batchNo}</div></div>
                <div className="rounded-lg bg-gray-50 p-3"><div className="text-gray-500">拨付金额</div><div className="mt-1 font-medium text-cyan-700">￥{selectedItem.amount.toLocaleString()}</div></div>
                <div className="rounded-lg bg-gray-50 p-3"><div className="text-gray-500">状态</div><div className="mt-1 font-medium">{selectedItem.status}</div></div>
                <div className="col-span-2 rounded-lg bg-blue-50 p-3"><div className="text-gray-500">银行信息</div><div className="mt-1 font-medium">{selectedItem.bankName} {selectedItem.bankAccount}</div></div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button onClick={() => setSelectedItem(null)} className="rounded-lg border px-4 py-2">关闭</button>
                <button onClick={() => handlePayment(false)} className="rounded-lg bg-blue-600 px-4 py-2 text-white">确认拨付</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
