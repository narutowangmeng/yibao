import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit2, MapPin, Phone, CheckCircle, XCircle } from 'lucide-react';

interface Institution {
  id: string;
  name: string;
  level: '三级甲等' | '三级乙等' | '二级甲等' | '二级乙等' | '一级';
  type: '医院' | '药店' | '诊所';
  address: string;
  phone: string;
  status: '合作中' | '已暂停' | '已终止';
}

const mockData: Institution[] = [
  { id: '1', name: '北京协和医院', level: '三级甲等', type: '医院', address: '北京市东城区帅府园1号', phone: '010-69156114', status: '合作中' },
  { id: '2', name: '同仁堂大药房', level: '一级', type: '药店', address: '北京市东城区王府井大街', phone: '010-65287654', status: '合作中' },
  { id: '3', name: '朝阳医院', level: '三级甲等', type: '医院', address: '北京市朝阳区工体南路8号', phone: '010-85231777', status: '已暂停' },
];

export default function Institutions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredData = mockData.filter(i =>
    i.name.includes(searchTerm) || i.address.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case '合作中': return 'bg-green-100 text-green-700';
      case '已暂停': return 'bg-yellow-100 text-yellow-700';
      case '已终止': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#134E4A]">医疗机构</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-[#0891B2] px-4 py-2 text-white transition hover:bg-[#0891B2]/90"
        >
          <Plus size={18} />
          新增机构
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索机构名称或地址"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:border-[#0891B2] focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">机构名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">等级</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">地址</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">联系方式</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">合作状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.type}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.level}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-gray-400" />
                    {item.address}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone size={14} className="text-gray-400" />
                    {item.phone}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status === '合作中' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="flex items-center gap-1 rounded-md p-1 text-[#0891B2] transition hover:bg-[#0891B2]/10">
                    <Edit2 size={16} />
                    编辑
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <h3 className="mb-4 text-lg font-semibold text-[#134E4A]">新增医疗机构</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">机构名称</label>
                <input type="text" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#0891B2] focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">机构类型</label>
                <select className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#0891B2] focus:outline-none">
                  <option>医院</option>
                  <option>药店</option>
                  <option>诊所</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">地址</label>
                <input type="text" className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-[#0891B2] focus:outline-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="rounded-lg px-4 py-2 text-gray-600 transition hover:bg-gray-100">取消</button>
              <button onClick={() => setShowModal(false)} className="rounded-lg bg-[#0891B2] px-4 py-2 text-white transition hover:bg-[#0891B2]/90">保存</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
