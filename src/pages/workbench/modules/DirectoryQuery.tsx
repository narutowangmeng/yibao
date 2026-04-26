import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, ArrowLeft, Pill, Stethoscope, Package, Filter, ChevronDown, CheckCircle
} from 'lucide-react';

interface DirectoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  reimbursement: string;
  status: 'active' | 'inactive';
}

export default function DirectoryQuery({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'drug' | 'service' | 'material'>('drug');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockDrugs: DirectoryItem[] = [
    { id: '1', code: 'A001', name: '阿莫西林胶囊', category: '抗生素', price: 25.5, reimbursement: '甲类', status: 'active' },
    { id: '2', code: 'A002', name: '布洛芬缓释胶囊', category: '解热镇痛', price: 18.8, reimbursement: '甲类', status: 'active' },
    { id: '3', code: 'A003', name: '奥美拉唑肠溶胶囊', category: '消化系统', price: 32.0, reimbursement: '乙类', status: 'active' },
    { id: '4', code: 'A004', name: '二甲双胍片', category: '降糖药', price: 15.6, reimbursement: '甲类', status: 'active' },
  ];

  const mockServices: DirectoryItem[] = [
    { id: '1', code: 'S001', name: '普通门诊诊查费', category: '诊查费', price: 15.0, reimbursement: '甲类', status: 'active' },
    { id: '2', code: 'S002', name: '血常规检查', category: '检验费', price: 25.0, reimbursement: '甲类', status: 'active' },
    { id: '3', code: 'S003', name: 'CT平扫', category: '影像检查', price: 280.0, reimbursement: '乙类', status: 'active' },
    { id: '4', code: 'S004', name: '核磁共振', category: '影像检查', price: 580.0, reimbursement: '乙类', status: 'active' },
  ];

  const mockMaterials: DirectoryItem[] = [
    { id: '1', code: 'M001', name: '一次性输液器', category: '耗材', price: 3.5, reimbursement: '甲类', status: 'active' },
    { id: '2', code: 'M002', name: '医用纱布', category: '耗材', price: 2.0, reimbursement: '甲类', status: 'active' },
    { id: '3', code: 'M003', name: '心脏支架', category: '高值耗材', price: 8500.0, reimbursement: '乙类', status: 'active' },
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'drug': return mockDrugs;
      case 'service': return mockServices;
      case 'material': return mockMaterials;
      default: return mockDrugs;
    }
  };

  const filteredData = getCurrentData().filter(item =>
    (item.name.includes(searchTerm) || item.code.includes(searchTerm)) &&
    (selectedCategory === 'all' || item.category === selectedCategory)
  );

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'drug': return Pill;
      case 'service': return Stethoscope;
      case 'material': return Package;
      default: return Pill;
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'drug': return '药品目录';
      case 'service': return '诊疗目录';
      case 'material': return '耗材目录';
      default: return '药品目录';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">目录查询</h1>
            <p className="text-sm text-gray-500">药品诊疗目录查询</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Tab切换 */}
          <div className="flex gap-2">
            {(['drug', 'service', 'material'] as const).map((tab) => {
              const Icon = getTabIcon(tab);
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-cyan-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {getTabLabel(tab)}
                </button>
              );
            })}
          </div>

          {/* 搜索和筛选 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl"
                  placeholder="搜索名称或编码"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-4 pr-10 py-3 border border-gray-200 rounded-xl appearance-none bg-white"
                >
                  <option value="all">全部分类</option>
                  <option value="甲类">甲类</option>
                  <option value="乙类">乙类</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 数据表格 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">编码</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">名称</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">分类</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">价格</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">报销类别</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{item.code}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">¥{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        item.reimbursement === '甲类'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.reimbursement}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" />
                        有效
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-sm text-gray-500">药品数量</div>
              <div className="text-2xl font-bold text-cyan-600">{mockDrugs.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-sm text-gray-500">诊疗项目</div>
              <div className="text-2xl font-bold text-cyan-600">{mockServices.length}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-sm text-gray-500">耗材数量</div>
              <div className="text-2xl font-bold text-cyan-600">{mockMaterials.length}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
