import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Building2, BarChart3, Plus, Edit2, Trash2, Eye, X } from 'lucide-react';

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

const initialPolicies: Policy[] = [
  { id: 'POL-001', name: '江苏省异地就医备案管理办法', status: '生效中', updateTime: '2026-04-18', content: '统一全省异地就医备案渠道、备案材料和办理时限。' },
  { id: 'POL-002', name: '跨省异地住院直接结算实施细则', status: '生效中', updateTime: '2026-04-17', content: '规范跨省异地住院结算范围、基金支付比例和个人先行自付规则。' },
  { id: 'POL-003', name: '省内异地普通门诊直接结算规则', status: '生效中', updateTime: '2026-04-16', content: '支持 13 个设区市定点医疗机构普通门诊费用直接结算。' },
  { id: 'POL-004', name: '异地门诊慢特病备案及结算口径', status: '生效中', updateTime: '2026-04-15', content: '明确门诊慢特病跨统筹区备案、认定和费用结算口径。' },
  { id: 'POL-005', name: '异地转诊转院管理规范', status: '生效中', updateTime: '2026-04-14', content: '统一转诊指征、转诊单时效和就医等级管理要求。' },
  { id: 'POL-006', name: '双通道药品异地配药结算规则', status: '生效中', updateTime: '2026-04-13', content: '支持符合条件的双通道药店开展异地购药直接结算。' },
  { id: 'POL-007', name: '长期异地居住人员备案政策', status: '生效中', updateTime: '2026-04-12', content: '面向异地安置退休、长期居住和常驻异地工作人员实施备案管理。' },
  { id: 'POL-008', name: '临时外出就医待遇结算指引', status: '生效中', updateTime: '2026-04-11', content: '明确临时外出急诊、抢救和住院待遇执行规则。' },
  { id: 'POL-009', name: '异地急诊抢救先备案后补登记规则', status: '生效中', updateTime: '2026-04-10', content: '对急诊抢救参保人员实行事后补备案机制。' },
  { id: 'POL-010', name: '异地就医基金结算对账规范', status: '生效中', updateTime: '2026-04-09', content: '规范省内外清分、对账、拒付和回退处理流程。' },
  { id: 'POL-011', name: '异地生育医疗费用结算办法', status: '生效中', updateTime: '2026-04-08', content: '明确生育住院和产前检查异地结算执行标准。' },
  { id: 'POL-012', name: '异地康复治疗费用支付规则', status: '生效中', updateTime: '2026-04-07', content: '统一异地康复项目支付范围和待遇衔接要求。' },
  { id: 'POL-013', name: '省内异地定点医疗机构协议管理规范', status: '生效中', updateTime: '2026-04-06', content: '强化定点协议、结算责任和服务质量考核。' },
  { id: 'POL-014', name: '异地就医违规结算追偿办法', status: '生效中', updateTime: '2026-04-05', content: '对违规串换项目、虚假住院等行为启动追偿和信用管理。' },
  { id: 'POL-015', name: '跨省联网结算历史接口迁移方案', status: '已废止', updateTime: '2025-12-31', content: '原历史接口方案已停止执行，统一切换国家异地就医平台新接口。' },
];

const initialInstitutions: Institution[] = [
  { id: 'INST-001', name: '南京鼓楼医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '南京市鼓楼区中山路321号' },
  { id: 'INST-002', name: '江苏省人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '南京市鼓楼区广州路300号' },
  { id: 'INST-003', name: '无锡市人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '无锡市梁溪区清扬路299号' },
  { id: 'INST-004', name: '江南大学附属医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '无锡市滨湖区和风路1000号' },
  { id: 'INST-005', name: '徐州医科大学附属医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '徐州市泉山区淮海西路99号' },
  { id: 'INST-006', name: '徐州市中心医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '徐州市云龙区解放南路199号' },
  { id: 'INST-007', name: '常州市第一人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '常州市天宁区局前街185号' },
  { id: 'INST-008', name: '苏州大学附属第一医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '苏州市姑苏区十梓街188号' },
  { id: 'INST-009', name: '苏州市立医院本部', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '苏州市姑苏区道前街26号' },
  { id: 'INST-010', name: '南通大学附属医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '南通市崇川区西寺路20号' },
  { id: 'INST-011', name: '连云港市第一人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '连云港市海州区振华东路6号' },
  { id: 'INST-012', name: '淮安市第一人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '淮安市清江浦区黄河西路1号' },
  { id: 'INST-013', name: '盐城市第一人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '盐城市亭湖区人民南路66号' },
  { id: 'INST-014', name: '扬州大学附属医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '扬州市广陵区南通西路98号' },
  { id: 'INST-015', name: '镇江市第一人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '镇江市京口区电力路8号' },
  { id: 'INST-016', name: '泰州市人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '泰州市海陵区迎春东路210号' },
  { id: 'INST-017', name: '宿迁市人民医院', level: '三级甲等医院', status: '已签约', expireDate: '2026-12-31', address: '宿迁市宿城区黄河南路138号' },
  { id: 'INST-018', name: '南京市栖霞区仙林社区卫生服务中心', level: '社区医院', status: '已签约', expireDate: '2026-12-31', address: '南京市栖霞区文苑路99号' },
  { id: 'INST-019', name: '苏州市工业园区星湖医院', level: '二级医院', status: '已签约', expireDate: '2026-12-31', address: '苏州市工业园区崇文路9号' },
  { id: 'INST-020', name: '盐城市亭湖区东亭社区卫生服务中心', level: '社区医院', status: '已解约', expireDate: '2025-12-31', address: '盐城市亭湖区开放大道51号' },
];

export default function RemoteMedical() {
  const [activeTab, setActiveTab] = useState<'policy' | 'institution' | 'settlement'>('policy');
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [institutions, setInstitutions] = useState<Institution[]>(initialInstitutions);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const openModal = (type: 'add' | 'edit' | 'view', item?: any) => {
    setModalType(type);
    setCurrentItem(item);
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
        const newPolicy: Policy = {
          id: `POL-${String(policies.length + 1).padStart(3, '0')}`,
          ...formData,
          status: formData.status || '生效中',
          updateTime: new Date().toISOString().split('T')[0],
        };
        setPolicies([...policies, newPolicy]);
      } else if (modalType === 'edit' && currentItem) {
        setPolicies(policies.map((p) => (p.id === currentItem.id ? { ...p, ...formData, updateTime: new Date().toISOString().split('T')[0] } : p)));
      }
    } else if (activeTab === 'institution') {
      if (modalType === 'add') {
        const newInst: Institution = {
          id: `INST-${String(institutions.length + 1).padStart(3, '0')}`,
          ...formData,
          status: formData.status || '已签约',
        };
        setInstitutions([...institutions, newInst]);
      } else if (modalType === 'edit' && currentItem) {
        setInstitutions(institutions.map((i) => (i.id === currentItem.id ? { ...i, ...formData } : i)));
      }
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'policy') setPolicies(policies.filter((p) => p.id !== id));
    if (activeTab === 'institution') setInstitutions(institutions.filter((i) => i.id !== id));
  };

  const renderModal = () => {
    if (!modalOpen) return null;
    const isView = modalType === 'view';
    const title = isView ? '查看详情' : modalType === 'add' ? '新增' : '编辑';
    const isPolicy = activeTab === 'policy';

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{title}{isPolicy ? '政策' : '定点机构'}</h3>
            <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isPolicy ? '政策名称' : '机构名称'}</label>
              <input type="text" value={formData.name || ''} disabled={isView} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" />
            </div>
            {isPolicy ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <select value={formData.status || '生效中'} disabled={isView} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50">
                    <option value="生效中">生效中</option>
                    <option value="已废止">已废止</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">政策内容</label>
                  <textarea value={formData.content || ''} disabled={isView} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-3 py-2 border rounded-lg h-24 disabled:bg-gray-50" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">机构等级</label>
                  <input type="text" value={formData.level || ''} disabled={isView} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <select value={formData.status || '已签约'} disabled={isView} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50">
                    <option value="已签约">已签约</option>
                    <option value="已解约">已解约</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">协议到期日</label>
                  <input type="date" value={formData.expireDate || ''} disabled={isView} onChange={(e) => setFormData({ ...formData, expireDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                  <input type="text" value={formData.address || ''} disabled={isView} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50" />
                </div>
              </>
            )}
          </div>
          {!isView && (
            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  const renderPolicy = () => (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />新增政策
        </button>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="p-3 text-left text-sm font-medium">政策编号</th><th className="p-3 text-left text-sm font-medium">政策名称</th><th className="p-3 text-left text-sm font-medium">状态</th><th className="p-3 text-left text-sm font-medium">更新时间</th><th className="p-3 text-left text-sm font-medium">操作</th></tr>
          </thead>
          <tbody>
            {policies.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3 text-sm">{item.id}</td>
                <td className="p-3 text-sm font-medium">{item.name}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${item.status === '生效中' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td>
                <td className="p-3 text-sm text-gray-600">{item.updateTime}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => openModal('view', item)} className="p-1 text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => openModal('edit', item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInstitution = () => (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
          <Plus className="w-4 h-4" />新增定点
        </button>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr><th className="p-3 text-left text-sm font-medium">机构编号</th><th className="p-3 text-left text-sm font-medium">机构名称</th><th className="p-3 text-left text-sm font-medium">等级</th><th className="p-3 text-left text-sm font-medium">状态</th><th className="p-3 text-left text-sm font-medium">协议到期</th><th className="p-3 text-left text-sm font-medium">操作</th></tr>
          </thead>
          <tbody>
            {institutions.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3 text-sm">{item.id}</td>
                <td className="p-3 text-sm font-medium">{item.name}</td>
                <td className="p-3 text-sm">{item.level}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${item.status === '已签约' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td>
                <td className="p-3 text-sm text-gray-600">{item.expireDate}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => openModal('view', item)} className="p-1 text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => openModal('edit', item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettlement = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded-xl border"><p className="text-gray-500 text-sm">本月结算金额</p><p className="text-2xl font-bold text-cyan-600">¥5.86亿</p></div>
        <div className="bg-white p-4 rounded-xl border"><p className="text-gray-500 text-sm">待清算资金</p><p className="text-2xl font-bold text-orange-600">¥0.74亿</p></div>
        <div className="bg-white p-4 rounded-xl border"><p className="text-gray-500 text-sm">直接结算率</p><p className="text-2xl font-bold text-green-600">97.8%</p></div>
      </div>
      <div className="bg-white p-4 rounded-xl border">
        <h3 className="font-medium mb-3">资金清算进度</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span>跨省住院清算</span><span className="text-green-600">已完成</span></div>
          <div className="flex justify-between text-sm"><span>省内普通门诊清算</span><span className="text-green-600">已完成</span></div>
          <div className="flex justify-between text-sm"><span>门诊慢特病清算</span><span className="text-yellow-600">进行中</span></div>
          <div className="flex justify-between text-sm"><span>双通道药店对账</span><span className="text-yellow-600">进行中</span></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">异地就医管理</h1>
          <p className="text-gray-500 mt-1">异地政策制定、定点机构管理、结算监控</p>
        </div>
      </div>
      <div className="flex gap-2 border-b">
        {[
          { id: 'policy', label: '异地政策管理', icon: FileText },
          { id: 'institution', label: '异地定点管理', icon: Building2 },
          { id: 'settlement', label: '异地结算监控', icon: BarChart3 },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-500'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-6 shadow-sm border">
        {activeTab === 'policy' && renderPolicy()}
        {activeTab === 'institution' && renderInstitution()}
        {activeTab === 'settlement' && renderSettlement()}
      </motion.div>
      {renderModal()}
    </div>
  );
}
