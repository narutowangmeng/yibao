import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  category: string;
  balance: number;
  status: 'active' | 'inactive';
}

interface LedgerDetail {
  id: string;
  date: string;
  voucherNo: string;
  summary: string;
  debit: number;
  credit: number;
  balance: number;
}

const mockAccounts: LedgerAccount[] = [
  { id: '1', code: '1001', name: '库存现金', category: '资产类', balance: 1250000, status: 'active' },
  { id: '2', code: '1002', name: '银行存款', category: '资产类', balance: 82560000, status: 'active' },
  { id: '3', code: '2001', name: '应付账款', category: '负债类', balance: 3200000, status: 'active' },
  { id: '4', code: '4001', name: '实收资本', category: '权益类', balance: 50000000, status: 'active' },
];

const mockDetails: LedgerDetail[] = [
  { id: '1', date: '2024-01-20', voucherNo: 'PZ-001', summary: '医保基金收入', debit: 500000, credit: 0, balance: 82560000 },
  { id: '2', date: '2024-01-19', voucherNo: 'PZ-002', summary: '医疗费用支出', debit: 0, credit: 200000, balance: 82060000 },
  { id: '3', date: '2024-01-18', voucherNo: 'PZ-003', summary: '个人账户划入', debit: 300000, credit: 0, balance: 82360000 },
];

interface FinanceLedgerProps {
  onBack: () => void;
}

export default function FinanceLedger({ onBack }: FinanceLedgerProps) {
  const [selectedAccount, setSelectedAccount] = useState<LedgerAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAccounts = mockAccounts.filter(a => 
    a.name.includes(searchTerm) || a.code.includes(searchTerm)
  );

  if (selectedAccount) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setSelectedAccount(null)} className="p-2 hover:bg-amber-50 rounded-lg text-amber-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold text-gray-800">科目明细 - {selectedAccount.name}</h3>
        </div>

        <div className="bg-amber-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div><span className="text-gray-500">科目编码:</span> <span className="font-medium">{selectedAccount.code}</span></div>
            <div><span className="text-gray-500">科目名称:</span> <span className="font-medium">{selectedAccount.name}</span></div>
            <div><span className="text-gray-500">科目类别:</span> <span className="font-medium">{selectedAccount.category}</span></div>
            <div><span className="text-gray-500">当前余额:</span> <span className="font-medium text-amber-600">¥{selectedAccount.balance.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">日期</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">凭证号</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">摘要</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">借方</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">贷方</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">余额</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockDetails.map((detail) => (
                <tr key={detail.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{detail.date}</td>
                  <td className="px-4 py-3 text-sm text-amber-600">{detail.voucherNo}</td>
                  <td className="px-4 py-3 text-sm">{detail.summary}</td>
                  <td className="px-4 py-3 text-sm text-right">{detail.debit > 0 ? `¥${detail.debit.toLocaleString()}` : '-'}</td>
                  <td className="px-4 py-3 text-sm text-right">{detail.credit > 0 ? `¥${detail.credit.toLocaleString()}` : '-'}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">¥{detail.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-amber-50 rounded-lg text-amber-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-gray-800">总账管理</h3>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索科目编码或名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-amber-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">科目编码</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">科目名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">科目类别</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">当前余额</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">状态</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredAccounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-amber-600">{account.code}</td>
                <td className="px-4 py-3 text-sm font-medium">{account.name}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">{account.category}</span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-medium">¥{account.balance.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${account.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {account.status === 'active' ? '启用' : '停用'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => setSelectedAccount(account)}
                    className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
