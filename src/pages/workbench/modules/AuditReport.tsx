import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, FileText, Calendar, MapPin, Building2, TrendingUp, CheckCircle, Clock, DollarSign, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { downloadTextFile, exportJsonToWorkbook } from '../../../utils/exportHelpers';

interface AuditReportProps {
  onClose: () => void;
  onBack: () => void;
}

const trendData = [
  { month: '1月', auditCount: 1200, passRate: 85 },
  { month: '2月', auditCount: 1350, passRate: 87 },
  { month: '3月', auditCount: 1180, passRate: 84 },
  { month: '4月', auditCount: 1420, passRate: 89 },
  { month: '5月', auditCount: 1380, passRate: 88 },
  { month: '6月', auditCount: 1500, passRate: 90 },
];

const typeData = [
  { name: '门诊报销', value: 35, color: '#3b82f6' },
  { name: '住院报销', value: 28, color: '#10b981' },
  { name: '特殊药品', value: 20, color: '#f59e0b' },
  { name: '异地就医', value: 12, color: '#8b5cf6' },
  { name: '其他', value: 5, color: '#6b7280' },
];

const performerData = [
  { name: '张审核员', count: 328, passRate: 94, avgTime: '2.5h' },
  { name: '李审核员', count: 295, passRate: 92, avgTime: '2.8h' },
  { name: '王审核员', count: 276, passRate: 91, avgTime: '3.1h' },
  { name: '赵审核员', count: 254, passRate: 89, avgTime: '3.2h' },
  { name: '刘审核员', count: 231, passRate: 93, avgTime: '2.9h' },
];

export default function AuditReport({ onBack }: AuditReportProps) {
  const [timeRange, setTimeRange] = useState('本月');
  const [region, setRegion] = useState('全部');
  const [institution, setInstitution] = useState('全部');

  const stats = [
    { title: '审核总量', value: '8,234', unit: '笔', icon: FileText, color: 'bg-blue-500', trend: '+12.5%' },
    { title: '通过率', value: '87.3', unit: '%', icon: CheckCircle, color: 'bg-green-500', trend: '+2.1%' },
    { title: '平均审核时长', value: '2.8', unit: '小时', icon: Clock, color: 'bg-orange-500', trend: '-0.3h' },
    { title: '审核金额', value: '1,256.8', unit: '万元', icon: DollarSign, color: 'bg-purple-500', trend: '+8.7%' },
  ];

  const handleExportExcel = () => {
    exportJsonToWorkbook(
      performerData.map((item) => ({
        审核员: item.name,
        审核量: item.count,
        通过率: `${item.passRate}%`,
        平均时长: item.avgTime,
      })),
      '审核统计',
      '费用审核统计报表.xlsx',
    );
  };

  const handleExportPdf = () => {
    downloadTextFile(
      '费用审核统计报表.txt',
      [
        `时间范围：${timeRange}`,
        `地区范围：${region}`,
        `机构类型：${institution}`,
        '',
        ...stats.map((item) => `${item.title}：${item.value}${item.unit}`),
      ].join('\n'),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-xl font-bold text-gray-800">审核统计报表</h3>
            <p className="text-sm text-gray-500">多维度审核数据分析</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />导出Excel
          </button>
          <button onClick={handleExportPdf} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="w-4 h-4" />导出PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
              <option>本月</option>
              <option>上月</option>
              <option>本季度</option>
              <option>本年度</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <select value={region} onChange={(e) => setRegion(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
              <option>全部地区</option>
              <option>杭州市</option>
              <option>宁波市</option>
              <option>温州市</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <select value={institution} onChange={(e) => setInstitution(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
              <option>全部机构</option>
              <option>三甲医院</option>
              <option>社区医院</option>
              <option>专科医院</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                  <span className="text-sm text-gray-500">{stat.unit}</span>
                </div>
                <span className={`text-xs mt-2 inline-block ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend} 环比
                </span>
              </div>
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />审核量趋势
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="auditCount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />通过率趋势
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="passRate" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-bold text-gray-800 mb-4">报销类型分布</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label>
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-4">
            {typeData.map((item) => (
              <div key={item.name} className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                <span>{item.name} {item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />审核人员绩效排行
          </h4>
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b">
                <th className="pb-2">排名</th>
                <th className="pb-2">审核员</th>
                <th className="pb-2">审核量</th>
                <th className="pb-2">通过率</th>
                <th className="pb-2">平均时长</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {performerData.map((item, index) => (
                <tr key={item.name} className="border-b last:border-0">
                  <td className="py-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                    }`}>{index + 1}</span>
                  </td>
                  <td className="py-3">{item.name}</td>
                  <td className="py-3">{item.count}</td>
                  <td className="py-3 text-green-600">{item.passRate}%</td>
                  <td className="py-3 text-gray-500">{item.avgTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
