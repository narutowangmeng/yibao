import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Search, Plus, Edit2, Trash2, Eye, X, Users, Phone, Mail, ArrowLeft } from 'lucide-react';

interface Enterprise {
  id: string;
  name: string;
  creditCode: string;
  type: '国有企业' | '民营企业' | '外资企业' | '个体工商户';
  employeeCount: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  status: 'active' | 'inactive';
}

const mockEnterprises: Enterprise[] = [
  { id: '1', name: '南京科技有限公司', creditCode: '91320100MA1P000001', type: '民营企业', employeeCount: 156, contactName: '张经理', contactPhone: '138****0001', contactEmail: 'zhang@njtech.com', address: '南京市鼓楼区软件大道1号', status: 'active' },
  { id: '2', name: '苏州制造集团', creditCode: '91320500MA1P000002', type: '国有企业', employeeCount: 892, contactName: '李总', contactPhone: '139****0002', contactEmail: 'li@szmfg.com', address: '苏州市工业园区制造路88号', status: 'active' },
  { id: '3', name: '无锡贸易公司', creditCode: '91320200MA1P000003', type: '外资企业', employeeCount: 45, contactName: '王经理', contactPhone: '137****0003', contactEmail: 'wang@wxtrade.com', address: '无锡市梁溪区商贸街66号', status: 'inactive' },
];

interface EnterpriseManagementProps {
  onBack?: () => void;
}

export default function EnterpriseManagement({ onBack }: EnterpriseManagementProps) {
  const [enterprises, setEnterprises] = useState<Enterprise[]>(mockEnterprises);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEnterprise, setEditingEnterprise] = useState<Enterprise | null>(null);
  const [showDetail, setShowDetail] = useState<Enterprise | null>(null);

  const filteredEnterprises = enterprises.filter(e =>
    e.name.includes(searchTerm) || e.creditCode.includes(searchTerm)
  );

  const handleAdd = () => {
    setEditingEnterprise(null);
    setShowModal(true);
  };

  const handleEdit = (enterprise: Enterprise) => {
    setEditingEnterprise(enterprise);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setEnterprises(enterprises.filter(e => e.id !== id));
  };

  const handleSave = (data: Partial<Enterprise>) => {
    if (editingEnterprise) {
      setEnterprises(enterprises.map(e => e.id === editingEnterprise.id ? { ...e, ...data } : e));
    } else {
      setEnterprises([...enterprises, { ...data, id: String(enterprises.length + 1) } as Enterprise]);
    }
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-lg">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">企业管理</h1>
              <p className="text-sm text-gray-500">管理企业信息及参保情况</p>
            </div>
          </div>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
            <Plus className="w-4 h-4" /> 新增企业
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索企业名称、统一社会信用代码..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">企业信息</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">企业类型</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">参保人数</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">联系人</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEnterprises.map((enterprise) => (
                <motion.tr key={enterprise.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Building className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{enterprise.name}</p>
                        <p className="text-sm text-gray-500">{enterprise.creditCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{enterprise.type}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" /> {enterprise.employeeCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div>{enterprise.contactName}</div>
                    <div className="text-gray-400 text-xs">{enterprise.contactPhone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      enterprise.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {enterprise.status === 'active' ? '正常' : '停用'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setShowDetail(enterprise)} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(enterprise)} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(enterprise.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <EnterpriseModal
            editing={editingEnterprise}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetail && (
          <DetailModal enterprise={showDetail} onClose={() => setShowDetail(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function EnterpriseModal({ editing, onClose, onSave }: { editing: Enterprise | null; onClose: () => void; onSave: (data: Partial<Enterprise>) => void }) {
  const [formData, setFormData] = useState({
    name: editing?.name || '',
    creditCode: editing?.creditCode || '',
    type: editing?.type || '民营企业',
    employeeCount: editing?.employeeCount || 0,
    contactName: editing?.contactName || '',
    contactPhone: editing?.contactPhone || '',
    contactEmail: editing?.contactEmail || '',
    address: editing?.address || '',
    status: editing?.status || 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{editing ? '编辑企业' : '新增企业'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">企业名称</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">统一社会信用代码</label>
              <input type="text" value={formData.creditCode} onChange={(e) => setFormData({ ...formData, creditCode: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">企业类型</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500">
                <option>国有企业</option>
                <option>民营企业</option>
                <option>外资企业</option>
                <option>个体工商户</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">参保人数</label>
              <input type="number" value={formData.employeeCount} onChange={(e) => setFormData({ ...formData, employeeCount: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">联系人姓名</label>
            <input type="text" value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
              <input type="tel" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系邮箱</label>
              <input type="email" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">企业地址</label>
            <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
            <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">保存</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function DetailModal({ enterprise, onClose }: { enterprise: Enterprise; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">企业详情</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
              <Building className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <p className="text-xl font-bold">{enterprise.name}</p>
              <p className="text-gray-500">{enterprise.type}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-gray-500">统一社会信用代码</p><p className="font-medium">{enterprise.creditCode}</p></div>
            <div><p className="text-gray-500">参保人数</p><p className="font-medium">{enterprise.employeeCount}人</p></div>
            <div><p className="text-gray-500">联系人</p><p className="font-medium">{enterprise.contactName}</p></div>
            <div><p className="text-gray-500">联系电话</p><p className="font-medium">{enterprise.contactPhone}</p></div>
            <div><p className="text-gray-500">邮箱</p><p className="font-medium">{enterprise.contactEmail}</p></div>
            <div><p className="text-gray-500">状态</p><p className="font-medium">{enterprise.status === 'active' ? '正常' : '停用'}</p></div>
          </div>
          <div>
            <p className="text-gray-500 text-sm">企业地址</p>
            <p className="font-medium">{enterprise.address}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
