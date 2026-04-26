import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, Search, CheckCircle, BarChart3, X, Plus, Edit2, Trash2, Eye } from 'lucide-react';

const tabs = [
  { id: 'accept', label: '举报受理', icon: Phone },
  { id: 'handle', label: '投诉处理', icon: MessageSquare },
  { id: 'verify', label: '线索核查', icon: Search },
  { id: 'reply', label: '反馈回复', icon: CheckCircle },
  { id: 'stats', label: '统计分析', icon: BarChart3 }
];

const acceptDataSeed = [
  ['JB001', '违规结算', '南京鼓楼医院门诊慢特病重复结算疑点', '陈晓岚', '13851780011', '待受理', '2025-04-26'],
  ['JB002', '欺诈骗保', '苏州某双通道药店疑似串换肿瘤靶向药', '王欣悦', '13851780012', '已受理', '2025-04-25'],
  ['JB003', '违规收费', '无锡社区医院氧疗收费项目与目录不一致', '刘志成', '13851780013', '已受理', '2025-04-25'],
  ['JB004', '冒名就医', '徐州参保人社保卡在异地连续结算', '赵婉清', '13851780014', '待受理', '2025-04-24'],
  ['JB005', '过度诊疗', '常州三级医院高值检查频次明显偏高', '孙柏霖', '13851780015', '已受理', '2025-04-24'],
  ['JB006', '违规结算', '南通民营医院住院分解结算疑点', '顾明慧', '13851780016', '已受理', '2025-04-23'],
  ['JB007', '欺诈骗保', '连云港药店门诊统筹刷卡异常集中', '蒋思雨', '13851780017', '待受理', '2025-04-23'],
  ['JB008', '违规收费', '淮安护理院长期护理收费项目超标准', '邵泽宇', '13851780018', '已受理', '2025-04-22'],
  ['JB009', '违规结算', '盐城乡镇卫生院门诊统筹限额使用异常', '唐若溪', '13851780019', '已受理', '2025-04-22'],
  ['JB010', '欺诈骗保', '扬州市中医院短期内大量挂床住院', '潘嘉怡', '13851780020', '待受理', '2025-04-21'],
  ['JB011', '违规收费', '镇江口腔门诊诊疗项目拆分收费', '陆书航', '13851780021', '已受理', '2025-04-21'],
  ['JB012', '过度诊疗', '泰州中医院康复项目重复开立', '钱梦琪', '13851780022', '已受理', '2025-04-20'],
  ['JB013', '违规结算', '宿迁基层医疗机构门诊处方流转回传异常', '高沐阳', '13851780023', '待受理', '2025-04-20'],
  ['JB014', '欺诈骗保', '苏州参保人慢特病药品超限定支付', '魏楚宁', '13851780024', '已受理', '2025-04-19'],
  ['JB015', '违规收费', '南京双通道药店配送服务费重复计收', '沈可心', '13851780025', '已受理', '2025-04-19'],
  ['JB016', '违规结算', '无锡住院结算上传病案首页缺项', '严文哲', '13851780026', '待受理', '2025-04-18'],
  ['JB017', '过度诊疗', '徐州肿瘤医院辅助用药使用明显偏高', '韩子乔', '13851780027', '已受理', '2025-04-18'],
  ['JB018', '欺诈骗保', '南通零售药店家庭共济刷卡异常', '许芷宁', '13851780028', '待受理', '2025-04-17'],
  ['JB019', '违规收费', '常州产科分娩耗材目录外收费', '陶靖雯', '13851780029', '已受理', '2025-04-17'],
  ['JB020', '违规结算', '盐城异地就医联网结算费用回传不一致', '龚知远', '13851780030', '已受理', '2025-04-16'],
];

const handleDataSeed = [
  ['TS001', '周亦凡', '南京市民医保门诊统筹报销比例争议', '待遇争议', '顾晨曦', '处理中', '2025-04-26'],
  ['TS002', '宋雅宁', '苏州双通道药店取药审核时长过长', '服务投诉', '沈雨泽', '已办结', '2025-04-25'],
  ['TS003', '陈思源', '无锡异地就医备案后仍提示未备案', '系统问题', '蒋嘉禾', '处理中', '2025-04-25'],
  ['TS004', '卢婉晴', '徐州门诊慢特病认定材料退回说明不清', '经办投诉', '赵清越', '处理中', '2025-04-24'],
  ['TS005', '袁安然', '常州住院结算窗口排队时间较长', '服务投诉', '彭书宁', '已办结', '2025-04-24'],
  ['TS006', '顾一诺', '南通单位缴费到账后状态未更新', '系统问题', '韩承宇', '处理中', '2025-04-23'],
  ['TS007', '何嘉怡', '连云港长期护理评估预约进度过慢', '待遇争议', '陆晨皓', '处理中', '2025-04-23'],
  ['TS008', '杜文琪', '淮安居民医保集中参保信息录入错误', '经办投诉', '潘越泽', '已办结', '2025-04-22'],
  ['TS009', '邵诗涵', '盐城门特审批结果短信未推送', '系统问题', '陶一鸣', '处理中', '2025-04-22'],
  ['TS010', '孙牧川', '扬州零售药店门诊统筹结算退费迟缓', '服务投诉', '高书瑶', '处理中', '2025-04-21'],
  ['TS011', '赵苒宁', '镇江异地转诊备案审核退回次数过多', '经办投诉', '顾星野', '已办结', '2025-04-21'],
  ['TS012', '魏嘉宁', '泰州生育待遇申报材料要求不一致', '待遇争议', '韩知行', '处理中', '2025-04-20'],
  ['TS013', '许承希', '宿迁医保电子凭证刷码结算失败', '系统问题', '周景言', '处理中', '2025-04-20'],
  ['TS014', '蒋语彤', '南京定点医院结算窗口解释口径不统一', '服务投诉', '钱安和', '已办结', '2025-04-19'],
  ['TS015', '唐书妍', '苏州门诊共济保障政策宣传不到位', '待遇争议', '陈昱辰', '处理中', '2025-04-19'],
  ['TS016', '高子墨', '无锡住院押金退还时间过长', '服务投诉', '梁若川', '处理中', '2025-04-18'],
  ['TS017', '陆可欣', '徐州医保中心热线接听成功率偏低', '服务投诉', '方知夏', '已办结', '2025-04-18'],
  ['TS018', '林泽宇', '南通单位参保登记需补材料次数过多', '经办投诉', '乔嘉铭', '处理中', '2025-04-17'],
  ['TS019', '冯若宁', '常州门特药品续方审核反馈慢', '待遇争议', '夏知远', '处理中', '2025-04-17'],
  ['TS020', '韩清禾', '盐城异地就医备案页面无法提交', '系统问题', '杜承安', '已办结', '2025-04-16'],
];

const verifyDataSeed = [
  ['XS001', '南京某三级医院心内科高值耗材使用率异常', '智能监管', '高', '核查中', '2025-04-26'],
  ['XS002', '苏州双通道药店门特处方重复结算', '举报投诉', '高', '核查中', '2025-04-25'],
  ['XS003', '无锡某民营医院短期重复住院数据异常', '飞行检查', '高', '已办结', '2025-04-25'],
  ['XS004', '徐州门诊统筹基金支出环比异常增长', '智能监管', '中', '核查中', '2025-04-24'],
  ['XS005', '常州基层医疗机构检验项目串换结算', '举报投诉', '中', '已办结', '2025-04-24'],
  ['XS006', '南通异地就医备案与结算地不一致', '智能监管', '中', '核查中', '2025-04-23'],
  ['XS007', '连云港药店门诊慢特病限定支付疑点', '举报投诉', '高', '核查中', '2025-04-23'],
  ['XS008', '淮安长期护理机构服务工时回传异常', '飞行检查', '中', '核查中', '2025-04-22'],
  ['XS009', '盐城住院按病种付费分组偏离率过高', '智能监管', '中', '已办结', '2025-04-22'],
  ['XS010', '扬州中医诊疗项目价格执行不一致', '举报投诉', '低', '核查中', '2025-04-21'],
  ['XS011', '镇江门诊统筹处方天数异常集中', '智能监管', '中', '核查中', '2025-04-21'],
  ['XS012', '泰州高值耗材目录编码使用错误', '飞行检查', '低', '已办结', '2025-04-20'],
  ['XS013', '宿迁零售药店家庭共济结算异常', '举报投诉', '中', '核查中', '2025-04-20'],
  ['XS014', '南京肿瘤靶向药双通道支付次数异常', '智能监管', '高', '核查中', '2025-04-19'],
  ['XS015', '苏州生育待遇免申即享回传失败', '系统监测', '中', '已办结', '2025-04-19'],
  ['XS016', '无锡门诊慢特病认定上传材料缺页', '经办抽查', '低', '核查中', '2025-04-18'],
  ['XS017', '徐州疑似挂床住院病例夜间记录缺失', '飞行检查', '高', '核查中', '2025-04-18'],
  ['XS018', '南通DRG结算病组入组异常', '智能监管', '中', '已办结', '2025-04-17'],
  ['XS019', '常州处方流转平台药品回传价格异常', '系统监测', '低', '核查中', '2025-04-17'],
  ['XS020', '盐城市第三人民医院违规拆分日间手术结算', '举报投诉', '高', '核查中', '2025-04-16'],
];

const replyDataSeed = [
  ['FK001', '关于南京门诊统筹重复结算举报处理结果的回复', '陈晓岚', '经核查，相关定点医院已完成违规结算冲销并退回基金，后续移交基金监管处处理。', '已回复', '2025-04-26'],
  ['FK002', '关于苏州双通道药店服务投诉的回复', '宋雅宁', '经核实，药店已优化处方审核岗配置并缩短审核时长，属地医保局已督促整改。', '已回复', '2025-04-25'],
  ['FK003', '关于无锡异地就医备案失败问题的回复', '陈思源', '系统接口已恢复，历史失败记录已补处理，可正常办理异地就医备案。', '已回复', '2025-04-25'],
  ['FK004', '关于徐州门特认定材料退回争议的回复', '卢婉晴', '已重新审核申请材料并补充一次性告知清单，申请状态更新为复审中。', '待发送', '2025-04-24'],
  ['FK005', '关于常州住院结算窗口服务投诉的回复', '袁安然', '现场已增设引导岗并优化分流，窗口排队时长已明显下降。', '已回复', '2025-04-24'],
  ['FK006', '关于南通单位缴费到账延迟问题的回复', '顾一诺', '已补同步银行到账回执，单位缴费状态已更新为到账。', '已回复', '2025-04-23'],
  ['FK007', '关于连云港长期护理预约进度咨询的回复', '何嘉怡', '评估机构已重新排期，预计三个工作日内完成入户评估。', '待发送', '2025-04-23'],
  ['FK008', '关于淮安参保信息录入错误的回复', '杜文琪', '经办窗口已完成更正并补发电子凭证。', '已回复', '2025-04-22'],
  ['FK009', '关于盐城门特短信通知未送达的回复', '邵诗涵', '短信通道异常已修复，审批结果已重新推送。', '已回复', '2025-04-22'],
  ['FK010', '关于扬州药店退费迟缓问题的回复', '孙牧川', '经协调，相关退费已按原路径退回并完成到账。', '待发送', '2025-04-21'],
  ['FK011', '关于镇江转诊备案反复退回的回复', '赵苒宁', '已统一受理标准并对经办岗进行培训，申请重新进入审核。', '已回复', '2025-04-21'],
  ['FK012', '关于泰州生育待遇材料要求不一致的回复', '魏嘉宁', '属地医保中心已统一材料目录，您本次申请可按最新清单办理。', '已回复', '2025-04-20'],
  ['FK013', '关于宿迁电子凭证结算失败问题的回复', '许承希', '系统参数已修复，建议重新尝试刷码结算。', '已回复', '2025-04-20'],
  ['FK014', '关于南京定点医院解释口径不统一的回复', '蒋语彤', '已责成机构加强医保政策培训并向您致歉。', '待发送', '2025-04-19'],
  ['FK015', '关于苏州门诊共济政策宣传不足的回复', '唐书妍', '已通过门户、公众号和窗口三渠道补充公示说明。', '已回复', '2025-04-19'],
  ['FK016', '关于无锡住院押金退还慢的回复', '高子墨', '医院财务已加快审核，押金预计次日原路退回。', '已回复', '2025-04-18'],
  ['FK017', '关于徐州热线接听问题的回复', '陆可欣', '已增加高峰时段坐席数量，并回拨未接来电。', '已回复', '2025-04-18'],
  ['FK018', '关于南通单位登记补材料过多的回复', '林泽宇', '已优化一次性告知模板并减少重复提交。', '待发送', '2025-04-17'],
  ['FK019', '关于常州门特药品续方审核进度的回复', '冯若宁', '经核实，续方已进入终审环节。', '已回复', '2025-04-17'],
  ['FK020', '关于盐城备案页面异常的回复', '韩清禾', '页面提交异常已修复，历史草稿可继续提交。', '已回复', '2025-04-16'],
];

export default function ComplaintManagement() {
  const [activeTab, setActiveTab] = useState('accept');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [acceptData, setAcceptData] = useState(acceptDataSeed.map(([id, type, content, reporter, phone, status, date]) => ({ id, type, content, reporter, phone, status, date })));
  const [handleData, setHandleData] = useState(handleDataSeed.map(([id, complainant, content, type, handler, status, date]) => ({ id, complainant, content, type, handler, status, date })));
  const [verifyData, setVerifyData] = useState(verifyDataSeed.map(([id, clue, source, priority, status, date]) => ({ id, clue, source, priority, status, date })));
  const [replyData, setReplyData] = useState(replyDataSeed.map(([id, title, recipient, content, status, date]) => ({ id, title, recipient, content, status, date })));

  const openModal = (type: 'add' | 'edit' | 'view', item?: any) => {
    setModalType(type);
    setSelectedItem(item || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'accept') setAcceptData((prev) => prev.filter((i) => i.id !== id));
    if (activeTab === 'handle') setHandleData((prev) => prev.filter((i) => i.id !== id));
    if (activeTab === 'verify') setVerifyData((prev) => prev.filter((i) => i.id !== id));
    if (activeTab === 'reply') setReplyData((prev) => prev.filter((i) => i.id !== id));
  };

  const renderAcceptModal = () => (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium mb-1">举报类型</label><select className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.type || ''}><option>欺诈骗保</option><option>违规结算</option><option>过度诊疗</option><option>违规收费</option></select></div>
      <div><label className="block text-sm font-medium mb-1">举报内容</label><textarea className="w-full border rounded-lg px-3 py-2" rows={3} defaultValue={selectedItem?.content || ''} /></div>
      <div><label className="block text-sm font-medium mb-1">举报人</label><input className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.reporter || ''} /></div>
      <div><label className="block text-sm font-medium mb-1">联系电话</label><input className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.phone || ''} /></div>
    </div>
  );

  const renderHandleModal = () => (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium mb-1">投诉人</label><input className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.complainant || ''} /></div>
      <div><label className="block text-sm font-medium mb-1">投诉内容</label><textarea className="w-full border rounded-lg px-3 py-2" rows={3} defaultValue={selectedItem?.content || ''} /></div>
      <div><label className="block text-sm font-medium mb-1">投诉类型</label><select className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.type || ''}><option>待遇争议</option><option>服务投诉</option><option>系统问题</option><option>经办投诉</option></select></div>
      <div><label className="block text-sm font-medium mb-1">经办人</label><input className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.handler || ''} /></div>
    </div>
  );

  const renderVerifyModal = () => (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium mb-1">线索描述</label><textarea className="w-full border rounded-lg px-3 py-2" rows={3} defaultValue={selectedItem?.clue || ''} /></div>
      <div><label className="block text-sm font-medium mb-1">线索来源</label><select className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.source || ''}><option>智能监管</option><option>举报投诉</option><option>飞行检查</option><option>系统监测</option><option>经办抽查</option></select></div>
      <div><label className="block text-sm font-medium mb-1">优先级</label><select className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.priority || '中'}><option>高</option><option>中</option><option>低</option></select></div>
    </div>
  );

  const renderReplyModal = () => (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium mb-1">回复标题</label><input className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.title || ''} /></div>
      <div><label className="block text-sm font-medium mb-1">接收人</label><input className="w-full border rounded-lg px-3 py-2" defaultValue={selectedItem?.recipient || ''} /></div>
      <div><label className="block text-sm font-medium mb-1">回复内容</label><textarea className="w-full border rounded-lg px-3 py-2" rows={4} defaultValue={selectedItem?.content || ''} /></div>
    </div>
  );

  const renderModalContent = () => {
    if (modalType === 'view') {
      return (
        <div className="space-y-3">
          {selectedItem && Object.entries(selectedItem).map(([key, val]) => (
            <div key={key} className="flex justify-between py-2 border-b"><span className="text-gray-500">{key}</span><span>{String(val)}</span></div>
          ))}
        </div>
      );
    }
    switch (activeTab) {
      case 'accept': return renderAcceptModal();
      case 'handle': return renderHandleModal();
      case 'verify': return renderVerifyModal();
      case 'reply': return renderReplyModal();
      default: return null;
    }
  };

  const renderContent = () => {
    const data = activeTab === 'accept' ? acceptData : activeTab === 'handle' ? handleData : activeTab === 'verify' ? verifyData : activeTab === 'reply' ? replyData : [];
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <input type="text" placeholder="搜索关键字..." className="flex-1 px-4 py-2 border rounded-lg" />
          <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg"><Plus className="w-4 h-4" />新增</button>
        </div>
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">编号</th>
                <th className="px-4 py-3 text-left text-sm font-medium">内容</th>
                <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                <th className="px-4 py-3 text-left text-sm font-medium">日期</th>
                <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{item.id}</td>
                  <td className="px-4 py-3 text-sm">{item.content || item.clue || item.title}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded ${item.status === '已受理' || item.status === '已回复' || item.status === '已办结' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.status}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.date}</td>
                  <td className="px-4 py-3">
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
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-800">举报投诉管理</h2></div>
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'}`}>
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {activeTab === 'stats' ? (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border"><p className="text-gray-500">本月受理</p><p className="text-2xl font-bold text-cyan-600">386</p></div>
            <div className="bg-white p-4 rounded-lg border"><p className="text-gray-500">已办结</p><p className="text-2xl font-bold text-green-600">341</p></div>
            <div className="bg-white p-4 rounded-lg border"><p className="text-gray-500">基金追回</p><p className="text-2xl font-bold text-amber-600">1268万元</p></div>
            <div className="bg-white p-4 rounded-lg border"><p className="text-gray-500">办结率</p><p className="text-2xl font-bold text-blue-600">88.3%</p></div>
          </div>
        ) : renderContent()}
      </motion.div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{modalType === 'add' ? '新增' : modalType === 'edit' ? '编辑' : '查看'}{tabs.find((t) => t.id === activeTab)?.label}</h3>
                <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
              </div>
              {renderModalContent()}
              {modalType !== 'view' && (
                <div className="flex gap-3 mt-6">
                  <button onClick={closeModal} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">取消</button>
                  <button onClick={closeModal} className="flex-1 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
