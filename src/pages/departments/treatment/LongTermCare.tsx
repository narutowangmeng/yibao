import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, FileText, Clock, User, DollarSign, Edit2, Trash2, Eye, X } from 'lucide-react';
import { getAgencyLevel } from '../../../config/managementPermissions';

interface LongTermCareProps {
  userAgency: string;
}

const tabs = [
  { id: 'assessment', label: '失能评估申请', icon: FileText },
  { id: 'service', label: '护理服务管理', icon: Clock },
  { id: 'institutions', label: '护理机构列表', icon: User },
  { id: 'payment', label: '待遇支付记录', icon: DollarSign },
  { id: 'query', label: '评估查询', icon: Search },
];

const assessmentData = [
  { id: 'A001', name: '王桂兰', age: 79, status: '待评估', date: '2026-04-18', idCard: '320102194703156428', address: '南京市鼓楼区凤凰西街86号', contact: '13813800101' },
  { id: 'A002', name: '陈国华', age: 82, status: '已通过', date: '2026-04-18', idCard: '320205194402085216', address: '无锡市梁溪区中山路88号', contact: '13813800102' },
  { id: 'A003', name: '李素琴', age: 76, status: '复评中', date: '2026-04-17', idCard: '320303195001124625', address: '徐州市泉山区矿大南路33号', contact: '13813800103' },
];

const serviceData = [
  { id: 'S001', name: '王桂兰', service: '居家生活照护', date: '2026-04-18', status: '进行中', nurse: '周海燕', hours: 36 },
  { id: 'S002', name: '陈国华', service: '失能康复护理', date: '2026-04-18', status: '已完成', nurse: '许红梅', hours: 48 },
  { id: 'S003', name: '李素琴', service: '压疮护理', date: '2026-04-17', status: '进行中', nurse: '何晓梅', hours: 24 },
];

const institutionData = [
  { id: 'I001', name: '南京市鼓楼区康宁护理院', type: '定点护理机构', beds: 180, rating: 4.8, address: '南京市鼓楼区中央路18号', contact: '025-86620001' },
  { id: 'I002', name: '苏州市姑苏区康复护理中心', type: '定点护理机构', beds: 210, rating: 4.9, address: '苏州市姑苏区人民路16号', contact: '0512-65880035' },
  { id: 'I003', name: '盐城市亭湖区德馨护理院', type: '定点护理机构', beds: 140, rating: 4.7, address: '盐城市亭湖区建军东路121号', contact: '0515-88360016' },
];

const paymentData = [
  { id: 'P001', name: '王桂兰', amount: 2860, month: '2026-04', status: '已发放', bank: '中国工商银行', account: '6212****3481' },
  { id: 'P002', name: '陈国华', amount: 3200, month: '2026-04', status: '已发放', bank: '中国建设银行', account: '6227****5814' },
  { id: 'P003', name: '李素琴', amount: 2480, month: '2026-04', status: '已发放', bank: '中国银行', account: '6216****1920' },
];

export default function LongTermCare({ userAgency }: LongTermCareProps) {
  const [activeTab, setActiveTab] = useState('assessment');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [assessments, setAssessments] = useState(assessmentData);
  const [services, setServices] = useState(serviceData);
  const [institutions, setInstitutions] = useState(institutionData);
  const [queryResult, setQueryResult] = useState<any>(null);
  const isProvince = getAgencyLevel(userAgency) === 'province';

  const openModal = (type: 'add' | 'edit' | 'view', item?: any) => {
    setModalType(type);
    setSelectedItem(item || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = (id: string, type: string) => {
    if (type === 'assessment') setAssessments((prev) => prev.filter((item) => item.id !== id));
    if (type === 'service') setServices((prev) => prev.filter((item) => item.id !== id));
    if (type === 'institution') setInstitutions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuery = () => {
    const result = assessments.find((item) => item.name.includes(searchTerm) || item.id.includes(searchTerm) || item.idCard.includes(searchTerm));
    setQueryResult(result || { msg: '未找到相关记录' });
  };

  const renderModal = () => {
    if (!modalOpen) return null;
    const isView = modalType === 'view';
    const title = modalType === 'add' ? '新增' : modalType === 'edit' ? '编辑' : '查看';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">
              {title}
              {activeTab === 'assessment' ? '评估申请' : activeTab === 'service' ? '护理服务' : activeTab === 'institutions' ? '护理机构' : '支付记录'}
            </h3>
            <button onClick={closeModal} className="rounded p-1 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">名称</label>
              <input type="text" defaultValue={selectedItem?.name || ''} disabled={isView} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
            </div>
            {activeTab === 'assessment' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium">年龄</label>
                  <input type="number" defaultValue={selectedItem?.age || ''} disabled={isView} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">身份证号</label>
                  <input type="text" defaultValue={selectedItem?.idCard || ''} disabled={isView} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
                </div>
              </>
            )}
            {activeTab === 'service' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium">服务类型</label>
                  <input type="text" defaultValue={selectedItem?.service || ''} disabled={isView} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">护理人员</label>
                  <input type="text" defaultValue={selectedItem?.nurse || ''} disabled={isView} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
                </div>
              </>
            )}
            {activeTab === 'institutions' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium">机构类型</label>
                  <input type="text" defaultValue={selectedItem?.type || ''} disabled={isView} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">联系电话</label>
                  <input type="text" defaultValue={selectedItem?.contact || ''} disabled={isView} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
                </div>
              </>
            )}
            {activeTab === 'payment' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium">发放月份</label>
                  <input type="text" defaultValue={selectedItem?.month || ''} disabled className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">金额</label>
                  <input type="text" defaultValue={selectedItem?.amount || ''} disabled className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
                </div>
              </>
            )}
          </div>
          {!isView && isProvince && (
            <div className="mt-6 flex gap-3">
              <button onClick={closeModal} className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50">取消</button>
              <button onClick={closeModal} className="flex-1 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">保存</button>
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <span>待遇保障司</span>
        <span>/</span>
        <span className="text-gray-800">长期护理保险</span>
      </div>
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-600 hover:text-gray-800'}`}>
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-h-[400px]">
        {activeTab === 'assessment' && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="搜索申请人姓名或编号" className="w-full rounded-lg border py-2 pl-10 pr-4" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              {isProvince ? (
                <button onClick={() => openModal('add')} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
                  <Plus className="h-4 w-4" />
                  新增申请
                </button>
              ) : (
                <div className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700">地市账号仅可查看长期护理保险数据</div>
              )}
            </div>
            <div className="rounded-lg border bg-white">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">编号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">姓名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">年龄</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">日期</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.filter((item) => item.name.includes(searchTerm) || item.id.includes(searchTerm)).map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-3 text-sm">{item.id}</td>
                      <td className="px-4 py-3 text-sm">{item.name}</td>
                      <td className="px-4 py-3 text-sm">{item.age}岁</td>
                      <td className="px-4 py-3 text-sm">{item.date}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs ${item.status === '已通过' ? 'bg-green-100 text-green-700' : item.status === '待评估' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{item.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openModal('view', item)} className="text-cyan-600 hover:underline"><Eye className="h-4 w-4" /></button>
                          {isProvince && <><button onClick={() => openModal('edit', item)} className="text-blue-600 hover:underline"><Edit2 className="h-4 w-4" /></button><button onClick={() => handleDelete(item.id, 'assessment')} className="text-red-600 hover:underline"><Trash2 className="h-4 w-4" /></button></>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'service' && (
          <div className="space-y-4">
            <div className="flex justify-end">{isProvince && <button onClick={() => openModal('add')} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"><Plus className="h-4 w-4" />新增服务</button>}</div>
            <div className="grid grid-cols-2 gap-4">
              {services.map((item) => (
                <div key={item.id} className="rounded-lg border bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium">{item.name}</h4>
                    <span className={`rounded-full px-2 py-1 text-xs ${item.status === '已完成' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.status}</span>
                  </div>
                  <p className="mb-2 text-sm text-gray-600">服务类型: {item.service}</p>
                  <p className="text-sm text-gray-500">护理人员: {item.nurse}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => openModal('view', item)} className="text-cyan-600"><Eye className="h-4 w-4" /></button>
                    {isProvince && <><button onClick={() => openModal('edit', item)} className="text-blue-600"><Edit2 className="h-4 w-4" /></button><button onClick={() => handleDelete(item.id, 'service')} className="text-red-600"><Trash2 className="h-4 w-4" /></button></>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'institutions' && (
          <div className="space-y-4">
            <div className="flex justify-end">{isProvince && <button onClick={() => openModal('add')} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"><Plus className="h-4 w-4" />新增机构</button>}</div>
            <div className="grid grid-cols-2 gap-4">
              {institutions.map((item) => (
                <div key={item.id} className="rounded-lg border bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium">{item.name}</h4>
                    <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs text-cyan-700">{item.type}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>床位: {item.beds}张 | 评分: {item.rating}分</p>
                    <p>地址: {item.address}</p>
                    <p>电话: {item.contact}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => openModal('view', item)} className="text-cyan-600"><Eye className="h-4 w-4" /></button>
                    {isProvince && <><button onClick={() => openModal('edit', item)} className="text-blue-600"><Edit2 className="h-4 w-4" /></button><button onClick={() => handleDelete(item.id, 'institution')} className="text-red-600"><Trash2 className="h-4 w-4" /></button></>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="rounded-lg border bg-white">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">姓名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">月份</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">金额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {paymentData.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3 text-sm">{item.name}</td>
                    <td className="px-4 py-3 text-sm">{item.month}</td>
                    <td className="px-4 py-3 text-sm font-medium text-cyan-600">¥{item.amount}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">{item.status}</span></td>
                    <td className="px-4 py-3"><button onClick={() => openModal('view', item)} className="text-cyan-600 hover:underline">查看详情</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'query' && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <input type="text" placeholder="输入身份证号或评估编号" className="flex-1 rounded-lg border px-4 py-2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button onClick={handleQuery} className="rounded-lg bg-cyan-600 px-6 py-2 text-white hover:bg-cyan-700">查询</button>
            </div>
            {queryResult && (
              <div className="rounded-lg border bg-white p-6">
                {queryResult.msg ? (
                  <p className="text-center text-gray-500">{queryResult.msg}</p>
                ) : (
                  <div className="space-y-3">
                    <h4 className="text-lg font-bold">查询结果</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p><span className="text-gray-500">姓名:</span> {queryResult.name}</p>
                      <p><span className="text-gray-500">年龄:</span> {queryResult.age}岁</p>
                      <p><span className="text-gray-500">状态:</span> {queryResult.status}</p>
                      <p><span className="text-gray-500">申请日期:</span> {queryResult.date}</p>
                      <p><span className="text-gray-500">身份证号:</span> {queryResult.idCard}</p>
                      <p><span className="text-gray-500">联系电话:</span> {queryResult.contact}</p>
                    </div>
                    <p className="text-sm"><span className="text-gray-500">地址:</span> {queryResult.address}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
      {renderModal()}
    </div>
  );
}
