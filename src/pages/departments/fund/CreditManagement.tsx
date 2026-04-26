import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, FileText, AlertTriangle, RefreshCw, Globe, Search, Filter, Plus, X, Edit2, Trash2, Eye } from 'lucide-react';

const tabs = [
  { id: 'evaluation', label: '信用评价', icon: Star },
  { id: 'archive', label: '信用档案', icon: FileText },
  { id: 'punishment', label: '失信惩戒', icon: AlertTriangle },
  { id: 'repair', label: '信用修复', icon: RefreshCw },
  { id: 'publicity', label: '信用公示', icon: Globe }
];

export default function CreditManagement() {
  const [activeTab, setActiveTab] = useState('evaluation');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [evaluationData, setEvaluationData] = useState([
    { id: 1, name: '某医院', score: 95, level: 'A级', date: '2024-01' },
    { id: 2, name: '某药店', score: 82, level: 'B级', date: '2024-01' },
    { id: 3, name: '某诊所', score: 65, level: 'C级', date: '2024-01' }
  ]);

  const [archiveData, setArchiveData] = useState([
    { id: 1, name: '某医院', type: '医疗机构', records: 12, status: '正常', details: '近三年无违规记录，信用良好' },
    { id: 2, name: '某药店', type: '零售药店', records: 5, status: '正常', details: '按时报送数据，无异常' }
  ]);

  const [punishmentData, setPunishmentData] = useState([
    { id: 1, name: '某诊所', reason: '欺诈骗保', measure: '暂停结算', date: '2024-01-15' },
    { id: 2, name: '某药店', reason: '违规刷卡', measure: '罚款2万', date: '2024-01-10' }
  ]);

  const [repairData, setRepairData] = useState([
    { id: 1, name: '某药店', applyDate: '2024-01-20', status: '审核中', reason: '已整改完毕' },
    { id: 2, name: '某诊所', applyDate: '2024-01-18', status: '已通过', reason: '完成信用修复培训' }
  ]);

  const [publicityData, setPublicityData] = useState([
    { id: 1, title: '2024年第一期信用评价结果', date: '2024-01-15', views: 1256, content: '本次评价覆盖全市医疗机构...' },
    { id: 2, title: '失信惩戒名单公示', date: '2024-01-10', views: 892, content: '根据相关规定，现将失信机构公示...' }
  ]);

  const openModal = (type: 'add' | 'edit' | 'view', item?: any) => {
    setModalType(type);
    setSelectedItem(item || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = (id: number) => {
    if (activeTab === 'evaluation') setEvaluationData(evaluationData.filter(i => i.id !== id));
    if (activeTab === 'punishment') setPunishmentData(punishmentData.filter(i => i.id !== id));
    if (activeTab === 'repair') setRepairData(repairData.filter(i => i.id !== id));
    if (activeTab === 'publicity') setPublicityData(publicityData.filter(i => i.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    if (activeTab === 'evaluation') {
      const newItem = {
        id: selectedItem?.id || Date.now(),
        name: formData.get('name') as string,
        score: Number(formData.get('score')),
        level: formData.get('level') as string,
        date: formData.get('date') as string
      };
      if (modalType === 'edit') {
        setEvaluationData(evaluationData.map(i => i.id === selectedItem.id ? newItem : i));
      } else {
        setEvaluationData([...evaluationData, newItem]);
      }
    }
    
    if (activeTab === 'punishment') {
      const newItem = {
        id: selectedItem?.id || Date.now(),
        name: formData.get('name') as string,
        reason: formData.get('reason') as string,
        measure: formData.get('measure') as string,
        date: formData.get('date') as string
      };
      if (modalType === 'edit') {
        setPunishmentData(punishmentData.map(i => i.id === selectedItem.id ? newItem : i));
      } else {
        setPunishmentData([...punishmentData, newItem]);
      }
    }
    
    if (activeTab === 'repair') {
      const newItem = {
        id: selectedItem?.id || Date.now(),
        name: formData.get('name') as string,
        applyDate: formData.get('applyDate') as string,
        status: formData.get('status') as string,
        reason: formData.get('reason') as string
      };
      if (modalType === 'edit') {
        setRepairData(repairData.map(i => i.id === selectedItem.id ? newItem : i));
      } else {
        setRepairData([...repairData, newItem]);
      }
    }
    
    if (activeTab === 'publicity') {
      const newItem = {
        id: selectedItem?.id || Date.now(),
        title: formData.get('title') as string,
        date: formData.get('date') as string,
        views: selectedItem?.views || 0,
        content: formData.get('content') as string
      };
      if (modalType === 'edit') {
        setPublicityData(publicityData.map(i => i.id === selectedItem.id ? newItem : i));
      } else {
        setPublicityData([...publicityData, newItem]);
      }
    }
    
    closeModal();
  };

  const renderModal = () => {
    if (!modalOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">
              {modalType === 'add' ? '新增' : modalType === 'edit' ? '编辑' : '查看'}
              {activeTab === 'evaluation' && '信用评价'}
              {activeTab === 'archive' && '信用档案'}
              {activeTab === 'punishment' && '失信惩戒'}
              {activeTab === 'repair' && '信用修复'}
              {activeTab === 'publicity' && '信用公示'}
            </h3>
            <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
          </div>
          
          {modalType === 'view' && activeTab === 'archive' ? (
            <div className="space-y-4">
              <p><span className="font-medium">机构名称：</span>{selectedItem?.name}</p>
              <p><span className="font-medium">机构类型：</span>{selectedItem?.type}</p>
              <p><span className="font-medium">档案记录：</span>{selectedItem?.records}条</p>
              <p><span className="font-medium">状态：</span>{selectedItem?.status}</p>
              <p><span className="font-medium">详细说明：</span>{selectedItem?.details}</p>
            </div>
          ) : modalType === 'view' ? (
            <div className="space-y-2">
              {Object.entries(selectedItem || {}).map(([key, val]) => (
                <p key={key}><span className="font-medium">{key}：</span>{String(val)}</p>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              {activeTab === 'evaluation' && (
                <>
                  <input name="name" defaultValue={selectedItem?.name} placeholder="机构名称" className="w-full px-3 py-2 border rounded-lg" required />
                  <input name="score" type="number" defaultValue={selectedItem?.score} placeholder="信用评分" className="w-full px-3 py-2 border rounded-lg" required />
                  <select name="level" defaultValue={selectedItem?.level || 'A级'} className="w-full px-3 py-2 border rounded-lg">
                    <option value="A级">A级</option>
                    <option value="B级">B级</option>
                    <option value="C级">C级</option>
                  </select>
                  <input name="date" defaultValue={selectedItem?.date} placeholder="评价日期" className="w-full px-3 py-2 border rounded-lg" required />
                </>
              )}
              {activeTab === 'punishment' && (
                <>
                  <input name="name" defaultValue={selectedItem?.name} placeholder="机构名称" className="w-full px-3 py-2 border rounded-lg" required />
                  <input name="reason" defaultValue={selectedItem?.reason} placeholder="失信原因" className="w-full px-3 py-2 border rounded-lg" required />
                  <input name="measure" defaultValue={selectedItem?.measure} placeholder="惩戒措施" className="w-full px-3 py-2 border rounded-lg" required />
                  <input name="date" defaultValue={selectedItem?.date} placeholder="惩戒日期" className="w-full px-3 py-2 border rounded-lg" required />
                </>
              )}
              {activeTab === 'repair' && (
                <>
                  <input name="name" defaultValue={selectedItem?.name} placeholder="机构名称" className="w-full px-3 py-2 border rounded-lg" required />
                  <input name="applyDate" defaultValue={selectedItem?.applyDate} placeholder="申请日期" className="w-full px-3 py-2 border rounded-lg" required />
                  <select name="status" defaultValue={selectedItem?.status || '审核中'} className="w-full px-3 py-2 border rounded-lg">
                    <option value="审核中">审核中</option>
                    <option value="已通过">已通过</option>
                    <option value="已驳回">已驳回</option>
                  </select>
                  <textarea name="reason" defaultValue={selectedItem?.reason} placeholder="修复原因" className="w-full px-3 py-2 border rounded-lg" rows={3} />
                </>
              )}
              {activeTab === 'publicity' && (
                <>
                  <input name="title" defaultValue={selectedItem?.title} placeholder="公示标题" className="w-full px-3 py-2 border rounded-lg" required />
                  <input name="date" defaultValue={selectedItem?.date} placeholder="发布日期" className="w-full px-3 py-2 border rounded-lg" required />
                  <textarea name="content" defaultValue={selectedItem?.content} placeholder="公示内容" className="w-full px-3 py-2 border rounded-lg" rows={4} />
                </>
              )}
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
                <button type="button" onClick={closeModal} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">取消</button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    );
  };

  const renderContent = () => {
    const data = activeTab === 'evaluation' ? evaluationData :
                 activeTab === 'archive' ? archiveData :
                 activeTab === 'punishment' ? punishmentData :
                 activeTab === 'repair' ? repairData :
                 activeTab === 'publicity' ? publicityData : [];
    
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="搜索..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />筛选
          </button>
          {activeTab !== 'archive' && (
            <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
              <Plus className="w-4 h-4" />新增
            </button>
          )}
        </div>
        
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {activeTab === 'evaluation' && <><th className="p-3 text-left">机构名称</th><th className="p-3">信用评分</th><th className="p-3">信用等级</th><th className="p-3">评价日期</th><th className="p-3">操作</th></>}
                {activeTab === 'archive' && <><th className="p-3 text-left">机构名称</th><th className="p-3">机构类型</th><th className="p-3">档案记录</th><th className="p-3">状态</th><th className="p-3">操作</th></>}
                {activeTab === 'punishment' && <><th className="p-3 text-left">机构名称</th><th className="p-3">失信原因</th><th className="p-3">惩戒措施</th><th className="p-3">惩戒日期</th><th className="p-3">操作</th></>}
                {activeTab === 'repair' && <><th className="p-3 text-left">机构名称</th><th className="p-3">申请日期</th><th className="p-3">审核状态</th><th className="p-3">操作</th></>}
                {activeTab === 'publicity' && <><th className="p-3 text-left">公示标题</th><th className="p-3">发布日期</th><th className="p-3">浏览量</th><th className="p-3">操作</th></>}
              </tr>
            </thead>
            <tbody>
              {data.map((item: any) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{item.name || item.title}</td>
                  {item.score && <td className="p-3 text-center text-cyan-600 font-medium">{item.score}</td>}
                  {item.level && <td className="p-3 text-center"><span className={`px-2 py-1 rounded text-xs ${item.level === 'A级' ? 'bg-green-100 text-green-700' : item.level === 'B级' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>{item.level}</span></td>}
                  {item.type && <td className="p-3 text-center text-gray-600">{item.type}</td>}
                  {item.records && <td className="p-3 text-center">{item.records}条</td>}
                  {item.reason && !item.applyDate && <td className="p-3 text-center text-red-600">{item.reason}</td>}
                  {item.measure && <td className="p-3 text-center">{item.measure}</td>}
                  {item.applyDate && <td className="p-3 text-center">{item.applyDate}</td>}
                  {item.status && <td className="p-3 text-center"><span className={`px-2 py-1 rounded text-xs ${item.status === '正常' || item.status === '已通过' ? 'bg-green-100 text-green-700' : item.status === '审核中' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td>}
                  {item.date && !item.applyDate && <td className="p-3 text-center text-gray-600">{item.date}</td>}
                  {item.views && <td className="p-3 text-center text-gray-600">{item.views}</td>}
                  <td className="p-3">
                    <div className="flex items-center gap-2 justify-center">
                      <button onClick={() => openModal('view', item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                      {activeTab !== 'archive' && (
                        <button onClick={() => openModal('edit', item)} className="p-1 text-cyan-600 hover:bg-cyan-50 rounded"><Edit2 className="w-4 h-4" /></button>
                      )}
                      {activeTab !== 'archive' && (
                        <button onClick={() => handleDelete(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{renderContent()}</motion.div>
      <AnimatePresence>{renderModal()}</AnimatePresence>
    </div>
  );
}
