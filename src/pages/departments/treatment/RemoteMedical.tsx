import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Building2, BarChart3, Plus, Edit2, Trash2, Eye, X } from 'lucide-react';
import { getAgencyLevel } from '../../../config/managementPermissions';

interface Policy {
  id: string;
  name: string;
  status: '生效中' | '已废止';
  updateTime: string;
  content?: string;
}

interface Institution {
  id: string;
  name: string;
  level: string;
  status: '已签约' | '已解约';
  expireDate: string;
  address?: string;
}

interface RemoteMedicalProps {
  userAgency: string;
}

const initialPolicies: Policy[] = [
  { id: 'POL-001', name: '江苏省异地就医备案管理办法', status: '生效中', updateTime: '2026-04-18', content: '统一全省异地就医备案渠道、备案材料和办理时限。' },
  { id: 'POL-002', name: '跨省异地住院直接结算实施细则', status: '生效中', updateTime: '2026-04-17', content: '规范跨省异地住院结算范围、基金支付比例和个人先行自付规则。' },
  { id: 'POL-003', name: '省内异地普通门诊直接结算规则', status: '生效中', updateTime: '2026-04-16', content: '支持 13 个设区市定点医疗机构普通门诊直接结算。' },
];

const initialInstitutions: Institution[] = [
  { id: 'INST-001', name: '南京鼓楼医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '南京市鼓楼区中山路321号' },
  { id: 'INST-002', name: '江苏省人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '南京市鼓楼区广州路300号' },
  { id: 'INST-003', name: '苏州市立医院本部', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '苏州市姑苏区道前街26号' },
];

export default function RemoteMedical({ userAgency }: RemoteMedicalProps) {
  const [activeTab, setActiveTab] = useState<'policy' | 'institution' | 'settlement'>('policy');
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [institutions, setInstitutions] = useState<Institution[]>(initialInstitutions);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const isProvince = getAgencyLevel(userAgency) === 'province';

  const openModal = (type: 'add' | 'edit' | 'view', item?: any) => {
    setModalType(type);
    setCurrentItem(item || null);
    setFormData(item || {});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentItem(null);
    setFormData({});
  };

  const handleSave = () => {
    if (activeTab === 'policy') {
      if (modalType === 'add') {
        setPolicies((prev) => [...prev, { id: `POL-${String(prev.length + 1).padStart(3, '0')}`, ...formData, status: formData.status || '生效中', updateTime: new Date().toISOString().split('T')[0] }]);
      } else if (modalType === 'edit' && currentItem) {
        setPolicies((prev) => prev.map((item) => (item.id === currentItem.id ? { ...item, ...formData, updateTime: new Date().toISOString().split('T')[0] } : item)));
      }
    } else if (activeTab === 'institution') {
      if (modalType === 'add') {
        setInstitutions((prev) => [...prev, { id: `INST-${String(prev.length + 1).padStart(3, '0')}`, ...formData, status: formData.status || '已签约' }]);
      } else if (modalType === 'edit' && currentItem) {
        setInstitutions((prev) => prev.map((item) => (item.id === currentItem.id ? { ...item, ...formData } : item)));
      }
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'policy') setPolicies((prev) => prev.filter((item) => item.id !== id));
    if (activeTab === 'institution') setInstitutions((prev) => prev.filter((item) => item.id !== id));
  };

  const renderModal = () => {
    if (!modalOpen) return null;
    const isView = modalType === 'view';
    const title = isView ? '查看详情' : modalType === 'add' ? '新增' : '编辑';
    const isPolicy = activeTab === 'policy';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg rounded-xl bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">{title}{isPolicy ? '政策' : '定点机构'}</h3>
            <button onClick={closeModal} className="rounded p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">{isPolicy ? '政策名称' : '机构名称'}</label>
              <input type="text" value={formData.name || ''} disabled={isView} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
            </div>
            {isPolicy ? (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">状态</label>
                  <select value={formData.status || '生效中'} disabled={isView} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50">
                    <option value="生效中">生效中</option>
                    <option value="已废止">已废止</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">政策内容</label>
                  <textarea value={formData.content || ''} disabled={isView} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="h-24 w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">机构等级</label>
                  <input type="text" value={formData.level || ''} disabled={isView} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">状态</label>
                  <select value={formData.status || '已签约'} disabled={isView} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50">
                    <option value="已签约">已签约</option>
                    <option value="已解约">已解约</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">协议到期日</label>
                  <input type="date" value={formData.expireDate || ''} disabled={isView} onChange={(e) => setFormData({ ...formData, expireDate: e.target.value })} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
                </div>
              </>
            )}
          </div>
          {!isView && isProvince && (
            <div className="mt-6 flex gap-3">
              <button onClick={closeModal} className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50">取消</button>
              <button onClick={handleSave} className="flex-1 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">保存</button>
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">异地就医管理</h1>
        <p className="mt-1 text-gray-500">异地政策制定、定点机构管理、结算监控</p>
      </div>
      <div className="flex gap-2 border-b">
        {[
          { id: 'policy', label: '异地政策管理', icon: FileText },
          { id: 'institution', label: '异地定点管理', icon: Building2 },
          { id: 'settlement', label: '异地结算监控', icon: BarChart3 },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as 'policy' | 'institution' | 'settlement')} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}`}>
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border bg-white p-6 shadow-sm">
        {activeTab === 'policy' && (
          <div className="space-y-4">
            <div className="mb-4 flex gap-2">
              {isProvince ? (
                <button onClick={() => openModal('add')} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
                  <Plus className="h-4 w-4" />
                  新增政策
                </button>
              ) : (
                <div className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700">地市账号仅可查看异地就医政策和机构清单</div>
              )}
            </div>
            <div className="overflow-hidden rounded-xl border bg-white">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">政策编号</th>
                    <th className="p-3 text-left text-sm font-medium">政策名称</th>
                    <th className="p-3 text-left text-sm font-medium">状态</th>
                    <th className="p-3 text-left text-sm font-medium">更新时间</th>
                    <th className="p-3 text-left text-sm font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {policies.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-sm">{item.id}</td>
                      <td className="p-3 text-sm font-medium">{item.name}</td>
                      <td className="p-3"><span className={`rounded px-2 py-1 text-xs ${item.status === '生效中' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td>
                      <td className="p-3 text-sm text-gray-600">{item.updateTime}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => openModal('view', item)} className="rounded p-1 text-cyan-600 hover:bg-cyan-50"><Eye className="h-4 w-4" /></button>
                          {isProvince && <><button onClick={() => openModal('edit', item)} className="rounded p-1 text-blue-600 hover:bg-blue-50"><Edit2 className="h-4 w-4" /></button><button onClick={() => handleDelete(item.id)} className="rounded p-1 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'institution' && (
          <div className="space-y-4">
            <div className="mb-4 flex gap-2">{isProvince && <button onClick={() => openModal('add')} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"><Plus className="h-4 w-4" />新增定点</button>}</div>
            <div className="overflow-hidden rounded-xl border bg-white">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">机构编号</th>
                    <th className="p-3 text-left text-sm font-medium">机构名称</th>
                    <th className="p-3 text-left text-sm font-medium">等级</th>
                    <th className="p-3 text-left text-sm font-medium">状态</th>
                    <th className="p-3 text-left text-sm font-medium">协议到期</th>
                    <th className="p-3 text-left text-sm font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {institutions.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-sm">{item.id}</td>
                      <td className="p-3 text-sm font-medium">{item.name}</td>
                      <td className="p-3 text-sm">{item.level}</td>
                      <td className="p-3"><span className={`rounded px-2 py-1 text-xs ${item.status === '已签约' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td>
                      <td className="p-3 text-sm text-gray-600">{item.expireDate}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => openModal('view', item)} className="rounded p-1 text-cyan-600 hover:bg-cyan-50"><Eye className="h-4 w-4" /></button>
                          {isProvince && <><button onClick={() => openModal('edit', item)} className="rounded p-1 text-blue-600 hover:bg-blue-50"><Edit2 className="h-4 w-4" /></button><button onClick={() => handleDelete(item.id)} className="rounded p-1 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settlement' && (
          <div className="space-y-4">
            <div className="mb-4 grid grid-cols-3 gap-4">
              <div className="rounded-xl border bg-white p-4"><p className="text-sm text-gray-500">本月结算金额</p><p className="text-2xl font-bold text-cyan-600">¥5.86亿</p></div>
              <div className="rounded-xl border bg-white p-4"><p className="text-sm text-gray-500">待清算资金</p><p className="text-2xl font-bold text-orange-600">¥0.74亿</p></div>
              <div className="rounded-xl border bg-white p-4"><p className="text-sm text-gray-500">直接结算率</p><p className="text-2xl font-bold text-green-600">97.8%</p></div>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <h3 className="mb-3 font-medium">资金清算进度</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span>跨省住院清算</span><span className="text-green-600">已完成</span></div>
                <div className="flex justify-between text-sm"><span>省内普通门诊清算</span><span className="text-green-600">已完成</span></div>
                <div className="flex justify-between text-sm"><span>门诊慢特病清算</span><span className="text-yellow-600">进行中</span></div>
                <div className="flex justify-between text-sm"><span>双通道药店对账</span><span className="text-yellow-600">进行中</span></div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      {renderModal()}
    </div>
  );
}
