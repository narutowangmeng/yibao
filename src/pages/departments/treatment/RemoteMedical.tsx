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
  { id: 'POL-004', name: '门诊慢特病跨市直接结算经办规程', status: '生效中', updateTime: '2026-04-15', content: '明确门诊慢特病备案认定、待遇衔接和跨市联网结算流程。' },
  { id: 'POL-005', name: '双通道药店异地购药结算管理规范', status: '生效中', updateTime: '2026-04-14', content: '规范双通道药店异地购药、处方流转和基金支付管理。' },
  { id: 'POL-006', name: '异地急诊抢救先救治后备案操作指引', status: '生效中', updateTime: '2026-04-13', content: '对异地急诊抢救人员实行先结算后补备案的经办要求。' },
  { id: 'POL-007', name: '省内转诊转院异地结算审核口径', status: '生效中', updateTime: '2026-04-12', content: '统一转诊手续、审核单据和异地支付比例口径。' },
  { id: 'POL-008', name: '异地安置退休人员长期备案服务规范', status: '生效中', updateTime: '2026-04-11', content: '规范退休异地安置备案、续期和关系维护。' },
  { id: 'POL-009', name: '常驻异地工作人员医疗保障备案规则', status: '生效中', updateTime: '2026-04-10', content: '明确常驻异地工作人员备案范围、时限和核验材料。' },
  { id: 'POL-010', name: '异地生育医疗费用联网结算试行办法', status: '生效中', updateTime: '2026-04-09', content: '支持符合条件的异地生育住院费用直接结算。' },
  { id: 'POL-011', name: '跨省门诊慢特病待遇追溯结算规定', status: '生效中', updateTime: '2026-04-08', content: '对跨省门诊慢特病补登记和追溯结算作出统一要求。' },
  { id: 'POL-012', name: '异地就医基金垫付清算管理办法', status: '生效中', updateTime: '2026-04-07', content: '规范异地垫付资金归集、月度清算和差错调整。' },
  { id: 'POL-013', name: '异地就医违规结算核查处理规范', status: '生效中', updateTime: '2026-04-06', content: '明确违规结算线索移交、基金追回和信用联动机制。' },
  { id: 'POL-014', name: '省内跨市康复住院异地结算试点方案', status: '生效中', updateTime: '2026-04-05', content: '推动康复住院跨市直接结算与待遇衔接。' },
  { id: 'POL-015', name: '异地就医信息变更与备案撤销经办规程', status: '生效中', updateTime: '2026-04-04', content: '规范备案变更、撤销、失效重办等操作流程。' },
  { id: 'POL-016', name: '跨省异地门诊统筹联网结算实施方案', status: '生效中', updateTime: '2026-04-03', content: '推进跨省普通门诊联网结算覆盖范围扩面。' },
  { id: 'POL-017', name: '异地就医转外购药审核细则', status: '生效中', updateTime: '2026-04-02', content: '明确转外购药备案认定、处方流转和支付审核要求。' },
  { id: 'POL-018', name: '省外定点医疗机构协议管理办法', status: '已废止', updateTime: '2026-04-01', content: '原省外定点协议签约规则已由新制度替代。' },
  { id: 'POL-019', name: '异地就医经办服务评价指标体系', status: '生效中', updateTime: '2026-03-31', content: '建立备案时效、结算成功率和投诉处置等评价指标。' },
  { id: 'POL-020', name: '江苏省异地就医备案材料目录清单', status: '生效中', updateTime: '2026-03-30', content: '统一全省异地安置、转诊转院、临时外出等材料目录。' },
];

const initialInstitutions: Institution[] = [
  { id: 'INST-001', name: '南京鼓楼医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '南京市鼓楼区中山路321号' },
  { id: 'INST-002', name: '江苏省人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '南京市鼓楼区广州路300号' },
  { id: 'INST-003', name: '苏州市立医院本部', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '苏州市姑苏区道前街26号' },
  { id: 'INST-004', name: '无锡市人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '无锡市梁溪区清扬路299号' },
  { id: 'INST-005', name: '徐州医科大学附属医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '徐州市泉山区淮海西路99号' },
  { id: 'INST-006', name: '常州市第一人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '常州市天宁区局前街185号' },
  { id: 'INST-007', name: '南通大学附属医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '南通市崇川区西寺路20号' },
  { id: 'INST-008', name: '连云港市第一人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '连云港市海州区振华东路6号' },
  { id: 'INST-009', name: '淮安市第一人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '淮安市清江浦区北京西路6号' },
  { id: 'INST-010', name: '盐城市第一人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '盐城市亭湖区毓龙西路166号' },
  { id: 'INST-011', name: '苏北人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '扬州市广陵区南通西路98号' },
  { id: 'INST-012', name: '镇江市第一人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '镇江市京口区电力路8号' },
  { id: 'INST-013', name: '泰州市人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '泰州市海陵区迎春东路210号' },
  { id: 'INST-014', name: '宿迁市第一人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '宿迁市宿城区宿支路120号' },
  { id: 'INST-015', name: '南京市江宁医院', level: '三级医院', status: '已签约', expireDate: '2026-12-31', address: '南京市江宁区鼓山路168号' },
  { id: 'INST-016', name: '无锡市第二人民医院', level: '三级医院', status: '已签约', expireDate: '2026-12-31', address: '无锡市梁溪区中山路68号' },
  { id: 'INST-017', name: '苏州大学附属第一医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '苏州市姑苏区十梓街188号' },
  { id: 'INST-018', name: '南通市第一人民医院', level: '三级医院', status: '已签约', expireDate: '2026-12-31', address: '南通市崇川区孩儿巷北路6号' },
  { id: 'INST-019', name: '扬州市妇幼保健院', level: '三级医院', status: '已签约', expireDate: '2026-12-31', address: '扬州市邗江区国展路66号' },
  { id: 'INST-020', name: '镇江市中医院', level: '三级医院', status: '解约', expireDate: '2026-03-31', address: '镇江市京口区桃花坞路10号' },
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
