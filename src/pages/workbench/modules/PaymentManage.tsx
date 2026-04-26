import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, CheckCircle, Building2, DollarSign, Calendar, Search, Filter, Download, Eye } from 'lucide-react';

interface PaymentItem {
  id: string;
  institution: string;
  amount: number;
  bankName: string;
  bankAccount: string;
  status: 'pending' | 'processing' | 'completed';
  applyTime: string;
}

const mockData: PaymentItem[] = [
  { id: 'P001', institution: '南京市第一医院', amount: 2850000, bankName: '工商银行', bankAccount: '6222****1234', status: 'pending', applyTime: '2024-01-20' },
  { id: 'P002', institution: '苏州大学附属医院', amount: 4200000, bankName: '建设银行', bankAccount: '6227****5678', status: 'pending', applyTime: '2024-01-19' },
  { id: 'P003', institution: '无锡市人民医院', amount: 1980000, bankName: '农业银行', bankAccount: '6228****9012', status: 'processing', applyTime: '2024-01-18' },
];

export default function PaymentManage({ onBack }: { onBack: () => void }) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('bank');

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const totalAmount = mockData.filter(i => selectedItems.includes(i.id)).reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <h3 className="text-xl font-bold">拨付管理</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"><Download className="w-4 h-4" />导出</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="text-2xl font-bold text-blue-600">{mockData.length}</div>
          <div className="text-sm text-gray-600">待拨付</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="text-2xl font-bold text-green-600">¥{(totalAmount / 10000).toFixed(1)}万</div>
          <div className="text-sm text-gray-600">已选金额</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <div className="text-2xl font-bold text-purple-600">{selectedItems.length}</div>
          <div className="text-sm text-gray-600">已选笔数</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="p-4 border-b flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="搜索机构名称..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"><Filter className="w-4 h-4" />筛选</button>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left"><input type="checkbox" className="rounded" /></th>
              <th className="px-4 py-3 text-left text-sm font-medium">单号</th>
              <th className="px-4 py-3 text-left text-sm font-medium">医疗机构</th>
              <th className="px-4 py-3 text-left text-sm font-medium">金额</th>
              <th className="px-4 py-3 text-left text-sm font-medium">银行信息</th>
              <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
              <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleSelect(item.id)} className="rounded" /></td>
                <td className="px-4 py-3 font-medium">{item.id}</td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3 font-medium text-blue-600">¥{item.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{item.bankName} {item.bankAccount}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{item.status === 'pending' ? '待拨付' : '处理中'}</span></td>
                <td className="px-4 py-3 text-right"><button className="p-2 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h4 className="font-medium mb-4">拨付确认</h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">拨付方式</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
              <option value="bank">银行转账</option>
              <option value="check">支票</option>
              <option value="cash">现金</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">拨付日期</label>
            <input type="date" className="w-full px-3 py-2 border rounded-lg" />
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />确认拨付
          </button>
          <button className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">批量拨付</button>
        </div>
      </div>
    </div>
  );
}
