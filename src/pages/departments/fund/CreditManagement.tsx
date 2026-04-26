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
    { id: 1, name: '江苏省人民医院', score: 98, level: 'A级', date: '2026-03' },
    { id: 2, name: '南京鼓楼医院', score: 97, level: 'A级', date: '2026-03' },
    { id: 3, name: '无锡市人民医院', score: 95, level: 'A级', date: '2026-03' },
    { id: 4, name: '徐州医科大学附属医院', score: 96, level: 'A级', date: '2026-03' },
    { id: 5, name: '常州市第一人民医院', score: 93, level: 'A级', date: '2026-03' },
    { id: 6, name: '苏州大学附属第一医院', score: 98, level: 'A级', date: '2026-03' },
    { id: 7, name: '南通大学附属医院', score: 94, level: 'A级', date: '2026-03' },
    { id: 8, name: '连云港市第一人民医院', score: 91, level: 'B级', date: '2026-03' },
    { id: 9, name: '淮安市第一人民医院', score: 92, level: 'A级', date: '2026-03' },
    { id: 10, name: '盐城市第一人民医院', score: 93, level: 'A级', date: '2026-03' },
    { id: 11, name: '扬州大学附属医院', score: 92, level: 'A级', date: '2026-03' },
    { id: 12, name: '镇江市第一人民医院', score: 89, level: 'B级', date: '2026-03' },
    { id: 13, name: '泰州市人民医院', score: 90, level: 'B级', date: '2026-03' },
    { id: 14, name: '宿迁市人民医院', score: 88, level: 'B级', date: '2026-03' },
    { id: 15, name: '南京益丰大药房中央路店', score: 90, level: 'B级', date: '2026-03' },
    { id: 16, name: '无锡九州大药房广瑞路店', score: 87, level: 'B级', date: '2026-03' },
    { id: 17, name: '苏州礼安医药双通道药房园区店', score: 95, level: 'A级', date: '2026-03' },
    { id: 18, name: '南通国大药房崇川店', score: 86, level: 'B级', date: '2026-03' },
    { id: 19, name: '扬州百信缘大药房文昌阁店', score: 84, level: 'B级', date: '2026-03' },
    { id: 20, name: '宿迁大参林药房宿城店', score: 79, level: 'C级', date: '2026-03' }
  ]);

  const [archiveData] = useState([
    { id: 1, name: '江苏省人民医院', type: '医疗机构', records: 16, status: '正常', details: '近三年按月报送结算清单，飞检未发现重大违规结算。' },
    { id: 2, name: '南京鼓楼医院', type: '医疗机构', records: 14, status: '正常', details: '门诊慢特病审核及时，异地就医结算差错率低于全省均值。' },
    { id: 3, name: '无锡市人民医院', type: '医疗机构', records: 12, status: '正常', details: '医保医师和医保药师年度考核结果良好。' },
    { id: 4, name: '徐州医科大学附属医院', type: '医疗机构', records: 13, status: '正常', details: 'DRG 结算偏差率持续下降，基金使用规范。' },
    { id: 5, name: '常州市第一人民医院', type: '医疗机构', records: 11, status: '正常', details: '耗材目录执行规范，违规收费整改已闭环。' },
    { id: 6, name: '苏州大学附属第一医院', type: '医疗机构', records: 17, status: '正常', details: '双通道处方流转管理规范，药品追溯数据完整。' },
    { id: 7, name: '南通大学附属医院', type: '医疗机构', records: 10, status: '正常', details: '异地联网结算服务满意度较高。' },
    { id: 8, name: '连云港市第一人民医院', type: '医疗机构', records: 9, status: '观察', details: '门诊统筹审核曾出现编码维护滞后，已纳入季度复核。' },
    { id: 9, name: '淮安市第一人民医院', type: '医疗机构', records: 10, status: '正常', details: '基金监督抽查记录完整，无重复收费问题。' },
    { id: 10, name: '盐城市第一人民医院', type: '医疗机构', records: 12, status: '正常', details: '医保接口调用稳定，月度对账准确率高。' },
    { id: 11, name: '扬州大学附属医院', type: '医疗机构', records: 11, status: '正常', details: '高值耗材备案及时，诊疗项目匹配率良好。' },
    { id: 12, name: '镇江市第一人民医院', type: '医疗机构', records: 8, status: '观察', details: '曾发生 1 起超标准收费投诉，已完成整改复核。' },
    { id: 13, name: '泰州市人民医院', type: '医疗机构', records: 9, status: '正常', details: '医保结算清分及时，信用评价保持稳定。' },
    { id: 14, name: '宿迁市人民医院', type: '医疗机构', records: 7, status: '观察', details: '门诊处方审核规则执行有提升空间。' },
    { id: 15, name: '南京益丰大药房中央路店', type: '零售药店', records: 6, status: '正常', details: '处方留存与药品追溯台账完整。' },
    { id: 16, name: '苏州礼安医药双通道药房园区店', type: '双通道药店', records: 7, status: '正常', details: '双通道特药供应稳定，购药实名核验执行到位。' },
    { id: 17, name: '南通国大药房崇川店', type: '零售药店', records: 5, status: '正常', details: '月度信用检查未发现违规刷卡结算。' },
    { id: 18, name: '扬州百信缘大药房文昌阁店', type: '零售药店', records: 5, status: '观察', details: '曾因上传票据延迟被提醒整改。' },
    { id: 19, name: '宿迁大参林药房宿城店', type: '零售药店', records: 4, status: '预警', details: '存在一次串换药品编码结算问题，处于重点监管期。' },
    { id: 20, name: '无锡九州大药房广瑞路店', type: '零售药店', records: 5, status: '正常', details: '购药实名制与发票开具规范。' }
  ]);

  const [punishmentData, setPunishmentData] = useState([
    { id: 1, name: '宿迁大参林药房宿城店', reason: '串换药品编码结算', measure: '暂停医保结算 3 个月', date: '2026-02-18' },
    { id: 2, name: '镇江市第一人民医院', reason: '超标准收取一次性耗材费用', measure: '责令退回基金 18.6 万元', date: '2026-02-09' },
    { id: 3, name: '连云港市第一人民医院', reason: '重复上传住院结算清单', measure: '全院通报并限期整改', date: '2026-01-26' },
    { id: 4, name: '扬州百信缘大药房文昌阁店', reason: '未按规定留存电子处方', measure: '记分 6 分', date: '2026-01-19' },
    { id: 5, name: '宿迁市人民医院', reason: '门诊统筹审核规则执行不到位', measure: '约谈分管负责人', date: '2026-01-12' },
    { id: 6, name: '无锡九州大药房广瑞路店', reason: '医保结算票据上传不及时', measure: '责令整改并书面说明', date: '2025-12-28' }
  ]);

  const [repairData, setRepairData] = useState([
    { id: 1, name: '宿迁大参林药房宿城店', applyDate: '2026-03-08', status: '审核中', reason: '已完成药品编码专项培训并补建追溯台账。' },
    { id: 2, name: '镇江市第一人民医院', applyDate: '2026-03-12', status: '已通过', reason: '已退回违规基金并完成耗材收费规则重检。' },
    { id: 3, name: '连云港市第一人民医院', applyDate: '2026-03-15', status: '审核中', reason: '已完成结算上传接口改造并提交核验材料。' },
    { id: 4, name: '扬州百信缘大药房文昌阁店', applyDate: '2026-03-20', status: '已通过', reason: '电子处方归档补齐，门店负责人完成信用修复培训。' },
    { id: 5, name: '宿迁市人民医院', applyDate: '2026-03-22', status: '驳回', reason: '需补充门诊统筹审核整改复盘材料。' },
    { id: 6, name: '无锡九州大药房广瑞路店', applyDate: '2026-03-25', status: '审核中', reason: '票据上传时效已改善，申请解除重点关注。' }
  ]);

  const [publicityData, setPublicityData] = useState([
    { id: 1, title: '2026年第一季度江苏省定点医药机构信用评价结果公示', date: '2026-04-02', views: 2356, content: '本次信用评价覆盖全省医疗机构、零售药店和双通道药店，评价周期为 2026 年第一季度。' },
    { id: 2, title: '2026年第一批失信惩戒机构名单公示', date: '2026-03-21', views: 1824, content: '依据基金监督检查结果，对存在违规结算和票据管理问题的机构予以公示。' },
    { id: 3, title: '江苏省医保信用修复通过名单（2026年3月）', date: '2026-03-31', views: 1498, content: '对已完成整改、培训和基金退回的定点机构信用修复结果予以公告。' },
    { id: 4, title: '双通道药店专项检查信用提示', date: '2026-03-12', views: 1265, content: '提示全省双通道药店加强实名购药、电子处方留存和药品追溯管理。' }
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
    if (activeTab === 'evaluation') setEvaluationData(evaluationData.filter((i) => i.id !== id));
    if (activeTab === 'punishment') setPunishmentData(punishmentData.filter((i) => i.id !== id));
    if (activeTab === 'repair') setRepairData(repairData.filter((i) => i.id !== id));
    if (activeTab === 'publicity') setPublicityData(publicityData.filter((i) => i.id !== id));
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
        setEvaluationData(evaluationData.map((i) => (i.id === selectedItem.id ? newItem : i)));
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
        setPunishmentData(punishmentData.map((i) => (i.id === selectedItem.id ? newItem : i)));
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
        setRepairData(repairData.map((i) => (i.id === selectedItem.id ? newItem : i)));
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
        setPublicityData(publicityData.map((i) => (i.id === selectedItem.id ? newItem : i)));
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
                    <option value="驳回">驳回</option>
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
    const data =
      activeTab === 'evaluation'
        ? evaluationData
        : activeTab === 'archive'
          ? archiveData
          : activeTab === 'punishment'
            ? punishmentData
            : activeTab === 'repair'
              ? repairData
              : activeTab === 'publicity'
                ? publicityData
                : [];

    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="搜索机构、药店或公示标题" className="w-full pl-10 pr-4 py-2 border rounded-lg" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            筛选
          </button>
          {activeTab !== 'archive' && (
            <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
              <Plus className="w-4 h-4" />
              新增
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
                  {item.status && <td className="p-3 text-center"><span className={`px-2 py-1 rounded text-xs ${item.status === '正常' || item.status === '已通过' ? 'bg-green-100 text-green-700' : item.status === '审核中' || item.status === '观察' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span></td>}
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
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{renderContent()}</motion.div>
      <AnimatePresence>{renderModal()}</AnimatePresence>
    </div>
  );
}
