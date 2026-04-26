import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, Download, AlertTriangle, CheckCircle, FileText, TrendingUp, TrendingDown } from 'lucide-react';

interface FundRecord {
  id: string;
  date: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  status: 'normal' | 'warning';
}

interface WarningItem {
  id: string;
  level: 'high' | 'medium' | 'low';
  title: string;
  content: string;
  date: string;
  status: 'pending' | 'processed';
  handler?: string;
}

const fundRecordsSeed: FundRecord[] = [
  ['F001', '2026-04-25', 'income', 12860000, '职工医保统筹基金收入', '南京市职工医保4月征缴入库', 'normal'],
  ['F002', '2026-04-25', 'expense', 9680000, '住院统筹基金支出', '苏州大学附属第一医院住院结算清分', 'normal'],
  ['F003', '2026-04-24', 'expense', 4360000, '门诊慢特病基金支出', '徐州市门诊慢特病待遇月度拨付', 'warning'],
  ['F004', '2026-04-24', 'income', 8260000, '居民医保财政补助', '无锡市居民医保财政补助到账', 'normal'],
  ['F005', '2026-04-23', 'expense', 2180000, '异地就医直接结算', '南通市异地就医跨省结算拨付', 'normal'],
  ['F006', '2026-04-23', 'expense', 1560000, '双通道药品支出', '连云港市双通道特药结算', 'warning'],
  ['F007', '2026-04-22', 'income', 6920000, '灵活就业参保缴费', '常州市灵活就业人员缴费入库', 'normal'],
  ['F008', '2026-04-22', 'expense', 3880000, '长期护理保险支出', '淮安市长期护理待遇月度拨付', 'normal'],
  ['F009', '2026-04-21', 'expense', 4980000, 'DRG付费清算', '盐城市DRG清算拨付', 'warning'],
  ['F010', '2026-04-21', 'income', 7340000, '单位缴费收入', '扬州市单位批量征缴入库', 'normal'],
  ['F011', '2026-04-20', 'expense', 1260000, '门诊统筹基金支出', '镇江市基层门诊统筹结算', 'normal'],
  ['F012', '2026-04-20', 'income', 3180000, '基金追回入账', '泰州市违规结算追回基金回流', 'normal'],
  ['F013', '2026-04-19', 'expense', 1780000, '高值耗材基金支出', '宿迁市骨科高值耗材专项结算', 'warning'],
  ['F014', '2026-04-19', 'income', 2640000, '城乡居民个人缴费', '南京市居民医保个人缴费入库', 'normal'],
  ['F015', '2026-04-18', 'expense', 2860000, '门诊特药基金支出', '苏州市肿瘤靶向药专项拨付', 'warning'],
  ['F016', '2026-04-18', 'income', 5520000, '省级调剂金划拨', '江苏省级基金调剂划拨到账', 'normal'],
  ['F017', '2026-04-17', 'expense', 920000, '工伤联网结算代垫', '无锡市工伤医疗联网代垫支出', 'normal'],
  ['F018', '2026-04-17', 'income', 1980000, '生育保险并轨划转', '徐州市生育保险统筹资金划转', 'normal'],
  ['F019', '2026-04-16', 'expense', 3360000, '住院按病种付费支出', '扬州市按病种付费清算', 'normal'],
  ['F020', '2026-04-16', 'income', 4280000, '专项补助资金', '南通市基金风险补助拨入', 'normal']
].map(([id, date, type, amount, category, description, status]) => ({ id, date, type: type as 'income' | 'expense', amount, category, description, status: status as 'normal' | 'warning' }));

const warningsSeed: WarningItem[] = [
  ['W001', 'high', '门诊慢特病支出增幅异常', '徐州市门诊慢特病基金单周支出环比增长 28.6%，超出预警阈值。', '2026-04-25', 'pending', ''],
  ['W002', 'medium', '双通道药店结算频次偏高', '连云港部分双通道药店肿瘤特药结算频次异常集中。', '2026-04-25', 'pending', ''],
  ['W003', 'high', 'DRG病组清算偏离率过高', '盐城市心血管DRG病组清算金额偏离全省均值。', '2026-04-24', 'processed', '陈思远'],
  ['W004', 'low', '居民医保缴费到账波动', '无锡市居民医保缴费到账较上周下降 8%。', '2026-04-24', 'processed', '赵雅宁'],
  ['W005', 'medium', '高值耗材支出集中预警', '宿迁市骨科高值耗材集中支付占比偏高。', '2026-04-23', 'pending', ''],
  ['W006', 'high', '异地就医清算重复拨付风险', '南通跨省异地结算清单存在重复入账疑点。', '2026-04-23', 'processed', '高若溪'],
  ['W007', 'medium', '门诊统筹处方天数异常', '镇江市基层机构门诊统筹处方平均天数偏高。', '2026-04-22', 'processed', '周景明'],
  ['W008', 'low', '基金追回入账延迟', '泰州市追回基金到账与台账登记时间不一致。', '2026-04-22', 'pending', ''],
  ['W009', 'high', '肿瘤特药专项拨付异常', '苏州市门诊特药支出超月度均值 31%。', '2026-04-21', 'processed', '彭若楠'],
  ['W010', 'medium', '长期护理支出回传滞后', '淮安市长期护理服务工时与支付回传存在时差。', '2026-04-21', 'processed', '顾文博'],
  ['W011', 'high', '住院统筹清算峰值异常', '苏州大学附属第一医院住院清算金额单日峰值异常。', '2026-04-20', 'processed', '陈雨桐'],
  ['W012', 'low', '灵活就业缴费批次波动', '常州市灵活就业缴费批次回款节奏变化。', '2026-04-20', 'processed', '沈嘉怡'],
  ['W013', 'medium', '跨统筹区转诊费用上升', '南京与镇江跨区转诊费用增长 14%。', '2026-04-19', 'pending', ''],
  ['W014', 'high', '医保基金支付比例异常', '扬州市部分三级医院支付比例偏离控制线。', '2026-04-19', 'processed', '许若琳'],
  ['W015', 'medium', '居民医保财政补助到账滞后', '无锡市居民医保财政补助到账时间晚于计划。', '2026-04-18', 'processed', '陆欣怡'],
  ['W016', 'low', '单位征缴笔数回落', '扬州市单位缴费批量征缴笔数较均值偏低。', '2026-04-18', 'processed', '邵立成'],
  ['W017', 'high', '双通道特药支付身份校验风险', '苏州部分双通道药店实名校验日志缺失。', '2026-04-17', 'pending', ''],
  ['W018', 'medium', 'DRG病组入组结构偏差', '盐城住院病例病组分布与历史均值偏差明显。', '2026-04-17', 'processed', '韩雪宁'],
  ['W019', 'low', '基金台账备注缺失', '宿迁专项补助资金台账备注信息不完整。', '2026-04-16', 'processed', '唐若宁'],
  ['W020', 'medium', '门特异地备案结算不同步', '连云港门特患者备案与结算地信息同步延迟。', '2026-04-16', 'processed', '魏心妍']
].map(([id, level, title, content, date, status, handler]) => ({ id, level: level as 'high' | 'medium' | 'low', title, content, date, status: status as 'pending' | 'processed', handler: handler || undefined }));

export default function FundMonitoring() {
  const [activeTab, setActiveTab] = useState('balance');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetail, setShowDetail] = useState<FundRecord | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [selectedWarning, setSelectedWarning] = useState<WarningItem | null>(null);
  const [fundRecords] = useState<FundRecord[]>(fundRecordsSeed);
  const [warnings, setWarnings] = useState<WarningItem[]>(warningsSeed);

  const handleProcessWarning = (warning: WarningItem) => { setSelectedWarning(warning); setShowWarningModal(true); };
  const handleConfirmProcess = () => {
    if (selectedWarning) setWarnings(warnings.map((w) => w.id === selectedWarning.id ? { ...w, status: 'processed', handler: '省医保中心预警岗' } : w));
    setShowWarningModal(false);
  };

  const renderBalanceContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200"><div className="flex items-center gap-2 text-gray-600 mb-2"><TrendingUp className="w-4 h-4" /><span className="text-sm">本月收入</span></div><p className="text-2xl font-bold text-green-600">￥9.56亿</p></div>
        <div className="bg-white p-4 rounded-xl border border-gray-200"><div className="flex items-center gap-2 text-gray-600 mb-2"><TrendingDown className="w-4 h-4" /><span className="text-sm">本月支出</span></div><p className="text-2xl font-bold text-red-600">￥8.74亿</p></div>
        <div className="bg-white p-4 rounded-xl border border-gray-200"><div className="flex items-center gap-2 text-gray-600 mb-2"><FileText className="w-4 h-4" /><span className="text-sm">基金结余</span></div><p className="text-2xl font-bold text-cyan-600">￥0.82亿</p></div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">收支明细</h3>
          <div className="flex gap-2">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="搜索..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg text-sm" /></div>
            <button className="flex items-center gap-1 px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm"><Download className="w-4 h-4" />导出</button>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">日期</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">类型</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">金额</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">分类</th><th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th></tr></thead>
          <tbody>{fundRecords.filter((r) => r.description.includes(searchTerm) || r.category.includes(searchTerm)).map((record) => <tr key={record.id} className="border-t border-gray-100 hover:bg-gray-50"><td className="px-4 py-3 text-sm text-gray-600">{record.date}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded ${record.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{record.type === 'income' ? '收入' : '支出'}</span></td><td className="px-4 py-3 text-sm font-medium">￥{record.amount.toLocaleString()}</td><td className="px-4 py-3 text-sm text-gray-600">{record.category}</td><td className="px-4 py-3"><button onClick={() => setShowDetail(record)} className="p-1.5 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );

  const renderWarningContent = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b"><h3 className="font-semibold">风险预警</h3></div>
        <div className="divide-y divide-gray-200">{warnings.map((warning) => <div key={warning.id} className="p-4 flex items-center justify-between hover:bg-gray-50"><div className="flex items-start gap-3"><AlertTriangle className={`w-5 h-5 ${warning.level === 'high' ? 'text-red-500' : warning.level === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} /><div><p className="font-medium text-gray-800">{warning.title}</p><p className="text-sm text-gray-500">{warning.content}</p><p className="text-xs text-gray-400 mt-1">{warning.date}</p></div></div><div className="flex items-center gap-2">{warning.status === 'pending' ? <button onClick={() => handleProcessWarning(warning)} className="px-3 py-1.5 bg-cyan-600 text-white text-sm rounded-lg">处理</button> : <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle className="w-4 h-4" />已处理</span>}</div></div>)}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200">
        <button onClick={() => setActiveTab('balance')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'balance' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600'}`}>基金收支</button>
        <button onClick={() => setActiveTab('warning')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'warning' ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600'}`}>风险预警</button>
      </div>
      {activeTab === 'balance' && renderBalanceContent()}
      {activeTab === 'warning' && renderWarningContent()}
      <AnimatePresence>{showDetail && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md p-6"><h3 className="text-lg font-bold mb-4">收支详情</h3><div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-gray-500">记录编号</span><span>{showDetail.id}</span></div><div className="flex justify-between"><span className="text-gray-500">日期</span><span>{showDetail.date}</span></div><div className="flex justify-between"><span className="text-gray-500">类型</span><span>{showDetail.type === 'income' ? '收入' : '支出'}</span></div><div className="flex justify-between"><span className="text-gray-500">金额</span><span className="font-bold">￥{showDetail.amount.toLocaleString()}</span></div><div className="flex justify-between"><span className="text-gray-500">分类</span><span>{showDetail.category}</span></div><div className="flex justify-between"><span className="text-gray-500">描述</span><span>{showDetail.description}</span></div></div><button onClick={() => setShowDetail(null)} className="w-full mt-6 py-2 bg-gray-100 rounded-lg">关闭</button></motion.div></motion.div>}</AnimatePresence>
      <AnimatePresence>{showWarningModal && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl w-full max-w-md p-6"><h3 className="text-lg font-bold mb-4">处理预警</h3><p className="text-gray-600 mb-4">确认处理该风险预警？</p><div className="flex gap-3"><button onClick={() => setShowWarningModal(false)} className="flex-1 py-2 border rounded-lg">取消</button><button onClick={handleConfirmProcess} className="flex-1 py-2 bg-cyan-600 text-white rounded-lg">确认</button></div></motion.div></motion.div>}</AnimatePresence>
    </div>
  );
}
