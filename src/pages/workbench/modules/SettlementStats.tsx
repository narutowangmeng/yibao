import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, TrendingUp, Building2, PieChart, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RePieChart, Pie, Cell } from 'recharts';

interface SettlementStatsProps {
  onClose: () => void;
  onBack: () => void;
}

const trendData = [
  { month: '1月', amount: 520 },
  { month: '2月', amount: 580 },
  { month: '3月', amount: 490 },
  { month: '4月', amount: 620 },
  { month: '5月', amount: 680 },
  { month: '6月', amount: 750 },
];

const rankData = [
  { name: '南京市第一医院', amount: 285 },
  { name: '苏州大学附属医院', amount: 420 },
  { name: '无锡市人民医院', amount: 198 },
  { name: '常州市中医院', amount: 156 },
  { name: '南通市妇幼保健院', amount: 98 },
];

const typeData = [
  { name: '门诊结算', value: 35, color: '#3b82f6' },
  { name: '住院结算', value: 45, color: '#10b981' },
  { name: '特殊药品', value: 20, color: '#f59e0b' },
];

export default function SettlementStats({ onBack }: SettlementStatsProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold">结算统计</h3>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg">
          <Download className="w-4 h-4" />导出报表
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-2"><TrendingUp className="w-4 h-4" />本月结算</div>
          <div className="text-2xl font-bold">¥8,520万</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-600 mb-2"><Building2 className="w-4 h-4" />结算机构</div>
          <div className="text-2xl font-bold">128家</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-orange-600 mb-2"><PieChart className="w-4 h-4" />结算笔数</div>
          <div className="text-2xl font-bold">3,256笔</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-purple-600 mb-2"><BarChart3 className="w-4 h-4" />环比增长</div>
          <div className="text-2xl font-bold">+12.5%</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-4">
          <h4 className="font-bold mb-4">结算金额趋势（万元）</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border p-4">
          <h4 className="font-bold mb-4">机构结算排行（万元）</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={rankData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="amount" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <h4 className="font-bold mb-4">结算类型分布</h4>
        <div className="flex items-center gap-8">
          <ResponsiveContainer width={300} height={200}>
            <RePieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                {typeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {typeData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                <span>{item.name} {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
