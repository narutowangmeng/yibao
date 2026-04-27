import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Eye,
  X,
  Shield,
  Brain,
  Database,
  AlertTriangle,
  Search,
  Send,
  CheckCircle2,
  FileWarning,
  BarChart3,
  Power,
  PowerOff,
} from 'lucide-react';
import { getAgencyLevel } from '../../../config/managementPermissions';

type ProvinceTab = 'strategy' | 'rules' | 'models' | 'release' | 'monitor';
type CityTab = 'alerts' | 'clues' | 'cases' | 'rectification' | 'analysis';

interface ProvinceStrategy {
  id: string;
  name: string;
  scope: string;
  scene: string;
  cycle: string;
  owner: string;
  status: '执行中' | '待发布' | '已停用';
  updatedAt: string;
}

interface ProvinceRule {
  id: string;
  name: string;
  source: string;
  scene: string;
  level: string;
  version: string;
  cities: string;
  status: '生效中' | '待发布' | '评估中';
}

interface ProvinceModel {
  id: string;
  name: string;
  type: '规则模型' | '评分模型' | '机器学习';
  scene: string;
  threshold: string;
  accuracy: string;
  status: '运行中' | '已停用' | '灰度中';
  owner: string;
}

interface ProvinceRelease {
  id: string;
  packageName: string;
  content: string;
  target: string;
  publishTime: string;
  effect: string;
  status: '已发布' | '灰度中' | '待审批';
}

interface ProvinceMonitor {
  city: string;
  alerts: number;
  checked: number;
  escalated: number;
  recovered: string;
  topScene: string;
}

interface CityAlert {
  id: string;
  city: string;
  institution: string;
  scene: string;
  triggerRule: string;
  level: '高风险' | '中风险' | '一般';
  amount: string;
  status: '待签收' | '核查中' | '已排除' | '已升级';
  time: string;
}

interface CityClue {
  id: string;
  source: string;
  target: string;
  scene: string;
  summary: string;
  owner: string;
  status: '待核查' | '补充材料' | '已办结';
  deadline: string;
}

interface CityCase {
  id: string;
  target: string;
  caseType: string;
  amount: string;
  action: string;
  status: '拟移交' | '处理中' | '已追回' | '已结案';
  officer: string;
  time: string;
}

interface CityRectification {
  id: string;
  institution: string;
  issue: string;
  requirement: string;
  feedback: string;
  status: '待回告' | '待复核' | '已销号';
  dueDate: string;
}

interface CityAnalysis {
  id: string;
  subject: string;
  dimension: string;
  value: string;
  rank: string;
  conclusion: string;
  updatedAt: string;
}

type DetailItem = ProvinceStrategy | ProvinceRule | ProvinceModel | ProvinceRelease | CityAlert | CityClue | CityCase | CityRectification | CityAnalysis | ProvinceMonitor;

const provinceStrategies: ProvinceStrategy[] = [
  { id: 'CL001', name: '门诊统筹异常结算专项治理', scope: '全省统一', scene: '门诊统筹', cycle: '按周监测', owner: '省基金监管处', status: '执行中', updatedAt: '2026-04-26 09:30' },
  { id: 'CL002', name: '双通道特药实名购药监管策略', scope: '全省统一', scene: '双通道药店', cycle: '按日监测', owner: '省基金监管处', status: '执行中', updatedAt: '2026-04-24 16:10' },
  { id: 'CL003', name: '住院挂床与分解住院治理策略', scope: '全省统一', scene: '住院服务', cycle: '按周监测', owner: '省基金监管处', status: '执行中', updatedAt: '2026-04-23 11:25' },
  { id: 'CL004', name: 'DRG入组偏离风险干预策略', scope: '13市统用', scene: 'DRG付费', cycle: '按月评估', owner: '省支付方式改革专班', status: '待发布', updatedAt: '2026-04-22 14:00' },
  { id: 'CL005', name: '高值耗材串换支付监测策略', scope: '全省统一', scene: '耗材支付', cycle: '按日监测', owner: '省基金监管处', status: '执行中', updatedAt: '2026-04-21 10:18' },
  { id: 'CL006', name: '门诊慢特病超限定支付治理', scope: '13市统用', scene: '慢特病门诊', cycle: '按周监测', owner: '省待遇保障处', status: '执行中', updatedAt: '2026-04-20 17:40' },
  { id: 'CL007', name: '异地就医备案与结算一致性管控', scope: '全省统一', scene: '异地就医', cycle: '按日监测', owner: '省异地就医中心', status: '执行中', updatedAt: '2026-04-19 15:30' },
  { id: 'CL008', name: '长护险失能评估真实性复核策略', scope: '试点城市', scene: '长护险', cycle: '按月评估', owner: '省长护险专班', status: '待发布', updatedAt: '2026-04-18 09:45' },
];

const provinceRules: ProvinceRule[] = [
  { id: 'RL001', name: '同日跨院重复门诊统筹结算规则', source: '国家规则继承', scene: '门诊统筹', level: '高风险', version: 'v3.2', cities: '全省13市', status: '生效中' },
  { id: 'RL002', name: '肿瘤靶向药双通道支付次数异常规则', source: '省级补充规则', scene: '双通道特药', level: '高风险', version: 'v2.4', cities: '全省13市', status: '生效中' },
  { id: 'RL003', name: '住院天数异常偏离病组中位数规则', source: '省级补充规则', scene: '住院服务', level: '中风险', version: 'v1.8', cities: '全省13市', status: '评估中' },
  { id: 'RL004', name: '短期多次入出院疑似挂床规则', source: '国家规则继承', scene: '住院服务', level: '高风险', version: 'v4.0', cities: '全省13市', status: '生效中' },
  { id: 'RL005', name: '高值耗材收费编码与实际手术不匹配规则', source: '省级补充规则', scene: '高值耗材', level: '高风险', version: 'v2.1', cities: '全省13市', status: '生效中' },
  { id: 'RL006', name: '门诊慢特病药品超限定支付规则', source: '国家规则继承', scene: '慢特病门诊', level: '中风险', version: 'v3.0', cities: '全省13市', status: '生效中' },
  { id: 'RL007', name: '异地备案地与结算地不一致规则', source: '省级补充规则', scene: '异地就医', level: '中风险', version: 'v1.6', cities: '全省13市', status: '待发布' },
  { id: 'RL008', name: '药店统筹基金刷卡集中异常规则', source: '省级补充规则', scene: '零售药店', level: '高风险', version: 'v2.0', cities: '南京/苏州/南通', status: '评估中' },
];

const provinceModelsInit: ProvinceModel[] = [
  { id: 'MX001', name: '欺诈骗保综合评分模型', type: '评分模型', scene: '全业务', threshold: '85分预警', accuracy: '94.8%', status: '运行中', owner: '省信息中心' },
  { id: 'MX002', name: '门诊统筹异常就诊识别模型', type: '机器学习', scene: '门诊统筹', threshold: '0.82', accuracy: '93.6%', status: '运行中', owner: '省信息中心' },
  { id: 'MX003', name: '住院挂床识别模型', type: '规则模型', scene: '住院服务', threshold: '规则命中3项', accuracy: '96.1%', status: '运行中', owner: '省基金监管处' },
  { id: 'MX004', name: 'DRG病组偏离识别模型', type: '机器学习', scene: 'DRG支付', threshold: '偏离率20%', accuracy: '91.4%', status: '灰度中', owner: '省支付方式改革专班' },
  { id: 'MX005', name: '双通道特药异常购药模型', type: '评分模型', scene: '双通道特药', threshold: '78分预警', accuracy: '95.2%', status: '运行中', owner: '省基金监管处' },
  { id: 'MX006', name: '异地就医冒名结算模型', type: '规则模型', scene: '异地就医', threshold: '规则命中2项', accuracy: '92.7%', status: '已停用', owner: '省异地就医中心' },
];

const provinceReleases: ProvinceRelease[] = [
  { id: 'FB001', packageName: '2026年4月监管规则包', content: '新增门诊统筹重复结算、高值耗材串换等8项规则', target: '全省13市', publishTime: '2026-04-26 19:30', effect: '命中率提升12.6%', status: '已发布' },
  { id: 'FB002', packageName: '双通道特药策略包', content: '优化实名购药校验与处方流转校验逻辑', target: '苏州/无锡/南京', publishTime: '2026-04-24 16:20', effect: '误报率下降6.4%', status: '灰度中' },
  { id: 'FB003', packageName: 'DRG偏离监测模型v2', content: '新增病组中位数、医院层级、科室结构三维校验', target: '徐州/南通/盐城', publishTime: '2026-04-22 11:00', effect: '待观察', status: '待审批' },
  { id: 'FB004', packageName: '异地就医一致性规则包', content: '加强备案、转诊、结算地三方一致性控制', target: '全省13市', publishTime: '2026-04-20 14:40', effect: '异常线索下降9.1%', status: '已发布' },
];

const provinceMonitorRows: ProvinceMonitor[] = [
  { city: '南京', alerts: 318, checked: 241, escalated: 18, recovered: '126.8万', topScene: '门诊统筹重复结算' },
  { city: '无锡', alerts: 246, checked: 198, escalated: 15, recovered: '98.5万', topScene: '双通道特药异常购药' },
  { city: '徐州', alerts: 284, checked: 206, escalated: 21, recovered: '115.2万', topScene: '住院挂床疑点' },
  { city: '常州', alerts: 193, checked: 154, escalated: 11, recovered: '73.6万', topScene: '高值耗材串换' },
  { city: '苏州', alerts: 362, checked: 287, escalated: 24, recovered: '168.4万', topScene: '药店统筹刷卡集中异常' },
  { city: '南通', alerts: 228, checked: 176, escalated: 16, recovered: '89.1万', topScene: 'DRG病组偏离' },
  { city: '连云港', alerts: 141, checked: 109, escalated: 9, recovered: '42.7万', topScene: '异地备案不一致' },
  { city: '淮安', alerts: 167, checked: 132, escalated: 12, recovered: '56.4万', topScene: '慢特病超限定支付' },
];

const cityAlertsInit: CityAlert[] = [
  { id: 'YJ001', city: '南京', institution: '南京市第一医院', scene: '门诊统筹', triggerRule: '同日跨院重复门诊统筹结算', level: '高风险', amount: '2.8万', status: '待签收', time: '2026-04-27 09:12' },
  { id: 'YJ002', city: '南京', institution: '南京国大益丰大药房双通道门店', scene: '双通道特药', triggerRule: '肿瘤靶向药支付次数异常', level: '高风险', amount: '6.3万', status: '核查中', time: '2026-04-27 10:25' },
  { id: 'YJ003', city: '南京', institution: '南京市中医院', scene: '住院服务', triggerRule: '短期多次入出院疑似挂床', level: '中风险', amount: '4.1万', status: '待签收', time: '2026-04-27 11:40' },
  { id: 'YJ004', city: '南京', institution: '江宁区东山街道社区卫生服务中心', scene: '慢特病门诊', triggerRule: '门诊慢特病药品超限定支付', level: '中风险', amount: '1.6万', status: '已排除', time: '2026-04-26 15:18' },
  { id: 'YJ005', city: '南京', institution: '南京鼓楼医院', scene: '高值耗材', triggerRule: '收费编码与手术记录不匹配', level: '高风险', amount: '8.7万', status: '已升级', time: '2026-04-26 16:05' },
  { id: 'YJ006', city: '南京', institution: '南京医科大学第二附属医院', scene: '异地就医', triggerRule: '备案地与结算地不一致', level: '一般', amount: '0.9万', status: '核查中', time: '2026-04-25 09:55' },
];

const cityCluesInit: CityClue[] = [
  { id: 'XS001', source: '智能监管', target: '南京市中西医结合医院', scene: '住院服务', summary: '同一参保人14天内两次短期住院，费用结构高度相似', owner: '赵欣', status: '待核查', deadline: '2026-04-30' },
  { id: 'XS002', source: '举报投诉', target: '玄武区康济药店', scene: '药店统筹', summary: '家庭共济刷卡集中发生，疑似代刷套现', owner: '陈松', status: '补充材料', deadline: '2026-04-29' },
  { id: 'XS003', source: '飞行检查', target: '南京鼓楼医院', scene: '高值耗材', summary: '手术耗材出库与医保结算明细存在编码偏差', owner: '周倩', status: '待核查', deadline: '2026-05-02' },
  { id: 'XS004', source: '智能监管', target: '江宁区某社区卫生服务中心', scene: '慢特病门诊', summary: '高血压慢特病处方天数连续三月超上限', owner: '周倩', status: '已办结', deadline: '2026-04-24' },
  { id: 'XS005', source: '经办抽查', target: '南京市第一医院', scene: '门诊统筹', summary: '短期内同科室重复检查项目计费频次异常', owner: '赵欣', status: '待核查', deadline: '2026-04-30' },
];

const cityCasesInit: CityCase[] = [
  { id: 'AJ001', target: '南京国大益丰大药房双通道门店', caseType: '违规结算', amount: '12.6万', action: '追回基金并暂停协议结算', status: '处理中', officer: '陈松', time: '2026-04-26 14:00' },
  { id: 'AJ002', target: '南京鼓楼医院', caseType: '高值耗材串换', amount: '18.4万', action: '移交基金监管处立案', status: '拟移交', officer: '周倩', time: '2026-04-25 16:30' },
  { id: 'AJ003', target: '玄武区康济药店', caseType: '欺诈骗保', amount: '7.2万', action: '终止门诊统筹服务协议', status: '已追回', officer: '赵欣', time: '2026-04-24 10:20' },
  { id: 'AJ004', target: '南京市中西医结合医院', caseType: '分解住院', amount: '9.8万', action: '责令整改并追回基金', status: '处理中', officer: '陈松', time: '2026-04-23 09:40' },
];

const cityRectificationInit: CityRectification[] = [
  { id: 'ZG001', institution: '南京市第一医院', issue: '重复检查收费', requirement: '7日内完成费用核减与内部复核', feedback: '已提交整改报告', status: '待复核', dueDate: '2026-04-29' },
  { id: 'ZG002', institution: '南京鼓楼医院', issue: '高值耗材编码管理不规范', requirement: '补录耗材追溯码并说明原因', feedback: '待机构回告', status: '待回告', dueDate: '2026-05-01' },
  { id: 'ZG003', institution: '玄武区康济药店', issue: '药店统筹刷卡异常集中', requirement: '提交监控记录与处方留存材料', feedback: '已核验完成', status: '已销号', dueDate: '2026-04-24' },
  { id: 'ZG004', institution: '江宁区东山街道社区卫生服务中心', issue: '慢特病处方超限定支付', requirement: '调整处方审核流程并培训医师', feedback: '已提交培训签到和制度修订', status: '待复核', dueDate: '2026-04-30' },
];

const cityAnalysisRows: CityAnalysis[] = [
  { id: 'FX001', subject: '南京鼓楼医院', dimension: '高值耗材', value: '预警金额 38.6万', rank: '全市第1', conclusion: '重点关注骨科与心内科耗材串换风险', updatedAt: '2026-04-27 08:30' },
  { id: 'FX002', subject: '南京国大益丰大药房双通道门店', dimension: '双通道特药', value: '预警 16次', rank: '全市第1', conclusion: '实名购药核验需加强', updatedAt: '2026-04-27 08:30' },
  { id: 'FX003', subject: '门诊统筹重复结算', dimension: '规则场景', value: '本周 42条', rank: '场景第1', conclusion: '建议持续保持高频监测', updatedAt: '2026-04-27 08:30' },
  { id: 'FX004', subject: '住院挂床疑点', dimension: '规则场景', value: '本周 19条', rank: '场景第2', conclusion: '重点看三级医院和康复机构', updatedAt: '2026-04-27 08:30' },
];

const provinceTabLabels: Array<{ id: ProvinceTab; label: string }> = [
  { id: 'strategy', label: '监管策略' },
  { id: 'rules', label: '规则与知识库' },
  { id: 'models', label: '监管模型' },
  { id: 'release', label: '发布与评估' },
  { id: 'monitor', label: '全省监测总览' },
];

const cityTabLabels: Array<{ id: CityTab; label: string }> = [
  { id: 'alerts', label: '预警中心' },
  { id: 'clues', label: '线索核查' },
  { id: 'cases', label: '案件转办' },
  { id: 'rectification', label: '整改回告' },
  { id: 'analysis', label: '本市监管分析' },
];

const badgeStyles: Record<string, string> = {
  执行中: 'bg-green-100 text-green-700',
  待发布: 'bg-amber-100 text-amber-700',
  已停用: 'bg-gray-100 text-gray-600',
  生效中: 'bg-green-100 text-green-700',
  评估中: 'bg-blue-100 text-blue-700',
  运行中: 'bg-green-100 text-green-700',
  灰度中: 'bg-sky-100 text-sky-700',
  已发布: 'bg-emerald-100 text-emerald-700',
  待审批: 'bg-amber-100 text-amber-700',
  高风险: 'bg-red-100 text-red-700',
  中风险: 'bg-orange-100 text-orange-700',
  一般: 'bg-slate-100 text-slate-700',
  待签收: 'bg-amber-100 text-amber-700',
  核查中: 'bg-blue-100 text-blue-700',
  已排除: 'bg-gray-100 text-gray-600',
  已升级: 'bg-red-100 text-red-700',
  待核查: 'bg-amber-100 text-amber-700',
  补充材料: 'bg-blue-100 text-blue-700',
  已办结: 'bg-green-100 text-green-700',
  拟移交: 'bg-red-100 text-red-700',
  处理中: 'bg-blue-100 text-blue-700',
  已追回: 'bg-green-100 text-green-700',
  已结案: 'bg-slate-100 text-slate-700',
  待回告: 'bg-amber-100 text-amber-700',
  待复核: 'bg-blue-100 text-blue-700',
  已销号: 'bg-green-100 text-green-700',
};

function StatusBadge({ value }: { value: string }) {
  return <span className={`px-2 py-1 rounded-full text-xs ${badgeStyles[value] || 'bg-gray-100 text-gray-700'}`}>{value}</span>;
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
        active ? 'border-b-2 border-cyan-600 text-cyan-600 bg-cyan-50/60' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );
}

export default function SmartSupervision({ userAgency }: { userAgency: string }) {
  const isProvince = getAgencyLevel(userAgency) === 'province';
  const [provinceTab, setProvinceTab] = useState<ProvinceTab>('strategy');
  const [cityTab, setCityTab] = useState<CityTab>('alerts');
  const [searchTerm, setSearchTerm] = useState('');
  const [strategyRows, setStrategyRows] = useState(provinceStrategies);
  const [ruleRows] = useState(provinceRules);
  const [modelRows, setModelRows] = useState(provinceModelsInit);
  const [releaseRows] = useState(provinceReleases);
  const [monitorRows] = useState(provinceMonitorRows);
  const [alertRows, setAlertRows] = useState(cityAlertsInit);
  const [clueRows, setClueRows] = useState(cityCluesInit);
  const [caseRows, setCaseRows] = useState(cityCasesInit);
  const [rectificationRows, setRectificationRows] = useState(cityRectificationInit);
  const [analysisRows] = useState(cityAnalysisRows);
  const [detailItem, setDetailItem] = useState<DetailItem | null>(null);
  const [toast, setToast] = useState('');

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  const filteredProvinceStrategies = useMemo(
    () => strategyRows.filter((item) => `${item.name}${item.scene}${item.owner}${item.scope}`.includes(searchTerm)),
    [searchTerm, strategyRows],
  );
  const filteredProvinceRules = useMemo(
    () => ruleRows.filter((item) => `${item.name}${item.scene}${item.source}${item.cities}`.includes(searchTerm)),
    [searchTerm, ruleRows],
  );
  const filteredProvinceModels = useMemo(
    () => modelRows.filter((item) => `${item.name}${item.scene}${item.owner}${item.type}`.includes(searchTerm)),
    [searchTerm, modelRows],
  );
  const filteredProvinceReleases = useMemo(
    () => releaseRows.filter((item) => `${item.packageName}${item.content}${item.target}`.includes(searchTerm)),
    [searchTerm, releaseRows],
  );
  const filteredProvinceMonitor = useMemo(
    () => monitorRows.filter((item) => `${item.city}${item.topScene}`.includes(searchTerm)),
    [searchTerm, monitorRows],
  );

  const filteredCityAlerts = useMemo(
    () => alertRows.filter((item) => `${item.institution}${item.scene}${item.triggerRule}`.includes(searchTerm)),
    [alertRows, searchTerm],
  );
  const filteredCityClues = useMemo(
    () => clueRows.filter((item) => `${item.target}${item.scene}${item.summary}`.includes(searchTerm)),
    [clueRows, searchTerm],
  );
  const filteredCityCases = useMemo(
    () => caseRows.filter((item) => `${item.target}${item.caseType}${item.action}`.includes(searchTerm)),
    [caseRows, searchTerm],
  );
  const filteredCityRectifications = useMemo(
    () => rectificationRows.filter((item) => `${item.institution}${item.issue}${item.requirement}`.includes(searchTerm)),
    [rectificationRows, searchTerm],
  );
  const filteredCityAnalysis = useMemo(
    () => analysisRows.filter((item) => `${item.subject}${item.dimension}${item.conclusion}`.includes(searchTerm)),
    [analysisRows, searchTerm],
  );

  const provinceStats = [
    { label: '全省监管策略', value: strategyRows.length, icon: Shield, color: 'text-emerald-600' },
    { label: '生效规则', value: ruleRows.filter((item) => item.status === '生效中').length, icon: Database, color: 'text-cyan-600' },
    { label: '运行模型', value: modelRows.filter((item) => item.status === '运行中').length, icon: Brain, color: 'text-violet-600' },
    { label: '本月升级线索', value: monitorRows.reduce((sum, item) => sum + item.escalated, 0), icon: AlertTriangle, color: 'text-rose-600' },
  ];

  const cityStats = [
    { label: '待签收预警', value: alertRows.filter((item) => item.status === '待签收').length, icon: AlertTriangle, color: 'text-amber-600' },
    { label: '核查中线索', value: clueRows.filter((item) => item.status !== '已办结').length, icon: FileWarning, color: 'text-cyan-600' },
    { label: '转办案件', value: caseRows.length, icon: Send, color: 'text-rose-600' },
    { label: '待复核整改', value: rectificationRows.filter((item) => item.status === '待复核').length, icon: CheckCircle2, color: 'text-emerald-600' },
  ];

  const activePlaceholder = isProvince
    ? '搜索策略名称、规则场景、模型名称...'
    : '搜索机构名称、线索摘要、案件类型...';

  const handleProvinceModelToggle = (id: string) => {
    setModelRows((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === '运行中' ? '已停用' : '运行中' }
          : item,
      ),
    );
    notify('模型状态已更新');
  };

  const handleCityAlertReceive = (id: string) => {
    setAlertRows((prev) => prev.map((item) => (item.id === id ? { ...item, status: '核查中' } : item)));
    notify('预警已签收');
  };

  const handleCityAlertEscalate = (id: string) => {
    setAlertRows((prev) => prev.map((item) => (item.id === id ? { ...item, status: '已升级' } : item)));
    notify('预警已升级至案件转办');
  };

  const handleClueDone = (id: string) => {
    setClueRows((prev) => prev.map((item) => (item.id === id ? { ...item, status: '已办结' } : item)));
    notify('线索已办结');
  };

  const handleRectificationReview = (id: string) => {
    setRectificationRows((prev) => prev.map((item) => (item.id === id ? { ...item, status: '已销号' } : item)));
    notify('整改已复核销号');
  };

  const renderProvinceActions = () => {
    if (provinceTab === 'strategy') {
      return (
        <button onClick={() => notify('策略新增弹窗可下一步补充')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg">
          <Plus className="w-4 h-4" />新增策略
        </button>
      );
    }
    if (provinceTab === 'models') {
      return (
        <button onClick={() => notify('模型新增弹窗可下一步补充')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg">
          <Plus className="w-4 h-4" />新增模型
        </button>
      );
    }
    if (provinceTab === 'release') {
      return (
        <button onClick={() => notify('发布流程已触发')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg">
          <Send className="w-4 h-4" />发起发布
        </button>
      );
    }
    return null;
  };

  const renderProvinceContent = () => {
    if (provinceTab === 'strategy') {
      return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">策略编号</th>
                <th className="px-4 py-3 text-left text-sm font-medium">策略名称</th>
                <th className="px-4 py-3 text-left text-sm font-medium">监管场景</th>
                <th className="px-4 py-3 text-left text-sm font-medium">适用范围</th>
                <th className="px-4 py-3 text-left text-sm font-medium">监测周期</th>
                <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProvinceStrategies.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.id}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.scene}</td>
                  <td className="px-4 py-3">{item.scope}</td>
                  <td className="px-4 py-3">{item.cycle}</td>
                  <td className="px-4 py-3"><StatusBadge value={item.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setDetailItem(item)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => notify(`已进入${item.name}编辑态`)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (provinceTab === 'rules') {
      return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">规则编号</th>
                <th className="px-4 py-3 text-left text-sm font-medium">规则名称</th>
                <th className="px-4 py-3 text-left text-sm font-medium">来源</th>
                <th className="px-4 py-3 text-left text-sm font-medium">场景</th>
                <th className="px-4 py-3 text-left text-sm font-medium">风险等级</th>
                <th className="px-4 py-3 text-left text-sm font-medium">版本</th>
                <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProvinceRules.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.id}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.source}</td>
                  <td className="px-4 py-3">{item.scene}</td>
                  <td className="px-4 py-3">{item.level}</td>
                  <td className="px-4 py-3">{item.version}</td>
                  <td className="px-4 py-3"><StatusBadge value={item.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setDetailItem(item)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => notify(`已进入${item.name}编辑态`)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (provinceTab === 'models') {
      return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">模型编号</th>
                <th className="px-4 py-3 text-left text-sm font-medium">模型名称</th>
                <th className="px-4 py-3 text-left text-sm font-medium">模型类型</th>
                <th className="px-4 py-3 text-left text-sm font-medium">适用场景</th>
                <th className="px-4 py-3 text-left text-sm font-medium">阈值</th>
                <th className="px-4 py-3 text-left text-sm font-medium">准确率</th>
                <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProvinceModels.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.id}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.type}</td>
                  <td className="px-4 py-3">{item.scene}</td>
                  <td className="px-4 py-3">{item.threshold}</td>
                  <td className="px-4 py-3">{item.accuracy}</td>
                  <td className="px-4 py-3"><StatusBadge value={item.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setDetailItem(item)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => notify(`已进入${item.name}编辑态`)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleProvinceModelToggle(item.id)} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded">
                        {item.status === '运行中' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (provinceTab === 'release') {
      return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">发布批次</th>
                <th className="px-4 py-3 text-left text-sm font-medium">发布包名称</th>
                <th className="px-4 py-3 text-left text-sm font-medium">发布内容</th>
                <th className="px-4 py-3 text-left text-sm font-medium">目标范围</th>
                <th className="px-4 py-3 text-left text-sm font-medium">发布时间</th>
                <th className="px-4 py-3 text-left text-sm font-medium">效果评估</th>
                <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProvinceReleases.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.id}</td>
                  <td className="px-4 py-3">{item.packageName}</td>
                  <td className="px-4 py-3">{item.content}</td>
                  <td className="px-4 py-3">{item.target}</td>
                  <td className="px-4 py-3">{item.publishTime}</td>
                  <td className="px-4 py-3">{item.effect}</td>
                  <td className="px-4 py-3"><StatusBadge value={item.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setDetailItem(item)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => notify(`${item.packageName}已重新提交审批`)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Send className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">地市</th>
              <th className="px-4 py-3 text-left text-sm font-medium">预警数</th>
              <th className="px-4 py-3 text-left text-sm font-medium">已核查</th>
              <th className="px-4 py-3 text-left text-sm font-medium">升级线索</th>
              <th className="px-4 py-3 text-left text-sm font-medium">追回金额</th>
              <th className="px-4 py-3 text-left text-sm font-medium">高发场景</th>
              <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredProvinceMonitor.map((item) => (
              <tr key={item.city} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.city}</td>
                <td className="px-4 py-3">{item.alerts}</td>
                <td className="px-4 py-3">{item.checked}</td>
                <td className="px-4 py-3">{item.escalated}</td>
                <td className="px-4 py-3">{item.recovered}</td>
                <td className="px-4 py-3">{item.topScene}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setDetailItem(item)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => notify(`已向${item.city}下发核查提醒`)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Send className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCityContent = () => {
    if (cityTab === 'alerts') {
      return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">预警编号</th>
                <th className="px-4 py-3 text-left text-sm font-medium">机构名称</th>
                <th className="px-4 py-3 text-left text-sm font-medium">监管场景</th>
                <th className="px-4 py-3 text-left text-sm font-medium">触发规则</th>
                <th className="px-4 py-3 text-left text-sm font-medium">风险等级</th>
                <th className="px-4 py-3 text-left text-sm font-medium">涉及金额</th>
                <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCityAlerts.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.id}</td>
                  <td className="px-4 py-3">{item.institution}</td>
                  <td className="px-4 py-3">{item.scene}</td>
                  <td className="px-4 py-3">{item.triggerRule}</td>
                  <td className="px-4 py-3"><StatusBadge value={item.level} /></td>
                  <td className="px-4 py-3">{item.amount}</td>
                  <td className="px-4 py-3"><StatusBadge value={item.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setDetailItem(item)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                      {item.status === '待签收' && <button onClick={() => handleCityAlertReceive(item.id)} className="px-3 py-1.5 text-xs bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100">签收</button>}
                      {item.status !== '已升级' && item.status !== '已排除' && <button onClick={() => handleCityAlertEscalate(item.id)} className="px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100">升级</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (cityTab === 'clues') {
      return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">线索编号</th>
                <th className="px-4 py-3 text-left text-sm font-medium">来源</th>
                <th className="px-4 py-3 text-left text-sm font-medium">核查对象</th>
                <th className="px-4 py-3 text-left text-sm font-medium">场景</th>
                <th className="px-4 py-3 text-left text-sm font-medium">摘要</th>
                <th className="px-4 py-3 text-left text-sm font-medium">承办人</th>
                <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCityClues.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.id}</td>
                  <td className="px-4 py-3">{item.source}</td>
                  <td className="px-4 py-3">{item.target}</td>
                  <td className="px-4 py-3">{item.scene}</td>
                  <td className="px-4 py-3">{item.summary}</td>
                  <td className="px-4 py-3">{item.owner}</td>
                  <td className="px-4 py-3"><StatusBadge value={item.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setDetailItem(item)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                      {item.status !== '已办结' && <button onClick={() => handleClueDone(item.id)} className="px-3 py-1.5 text-xs bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">办结</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (cityTab === 'cases') {
      return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">案件编号</th>
                <th className="px-4 py-3 text-left text-sm font-medium">处理对象</th>
                <th className="px-4 py-3 text-left text-sm font-medium">案件类型</th>
                <th className="px-4 py-3 text-left text-sm font-medium">涉及金额</th>
                <th className="px-4 py-3 text-left text-sm font-medium">处理措施</th>
                <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                <th className="px-4 py-3 text-left text-sm font-medium">承办人</th>
                <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCityCases.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.id}</td>
                  <td className="px-4 py-3">{item.target}</td>
                  <td className="px-4 py-3">{item.caseType}</td>
                  <td className="px-4 py-3">{item.amount}</td>
                  <td className="px-4 py-3">{item.action}</td>
                  <td className="px-4 py-3"><StatusBadge value={item.status} /></td>
                  <td className="px-4 py-3">{item.officer}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setDetailItem(item)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => notify(`已打开${item.id}转办处理流`)} className="px-3 py-1.5 text-xs bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100">处理</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (cityTab === 'rectification') {
      return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">整改编号</th>
                <th className="px-4 py-3 text-left text-sm font-medium">机构名称</th>
                <th className="px-4 py-3 text-left text-sm font-medium">问题事项</th>
                <th className="px-4 py-3 text-left text-sm font-medium">整改要求</th>
                <th className="px-4 py-3 text-left text-sm font-medium">回告情况</th>
                <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                <th className="px-4 py-3 text-left text-sm font-medium">到期日</th>
                <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCityRectifications.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{item.id}</td>
                  <td className="px-4 py-3">{item.institution}</td>
                  <td className="px-4 py-3">{item.issue}</td>
                  <td className="px-4 py-3">{item.requirement}</td>
                  <td className="px-4 py-3">{item.feedback}</td>
                  <td className="px-4 py-3"><StatusBadge value={item.status} /></td>
                  <td className="px-4 py-3">{item.dueDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setDetailItem(item)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                      {item.status !== '已销号' && <button onClick={() => handleRectificationReview(item.id)} className="px-3 py-1.5 text-xs bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100">复核销号</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">分析编号</th>
              <th className="px-4 py-3 text-left text-sm font-medium">对象</th>
              <th className="px-4 py-3 text-left text-sm font-medium">分析维度</th>
              <th className="px-4 py-3 text-left text-sm font-medium">指标值</th>
              <th className="px-4 py-3 text-left text-sm font-medium">排序</th>
              <th className="px-4 py-3 text-left text-sm font-medium">结论</th>
              <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredCityAnalysis.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.id}</td>
                <td className="px-4 py-3">{item.subject}</td>
                <td className="px-4 py-3">{item.dimension}</td>
                <td className="px-4 py-3">{item.value}</td>
                <td className="px-4 py-3">{item.rank}</td>
                <td className="px-4 py-3">{item.conclusion}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setDetailItem(item)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => notify(`已生成${item.subject}专项分析报告`)} className="px-3 py-1.5 text-xs bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100">生成报告</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{isProvince ? '智能监管治理' : '智能监管执行'}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isProvince
              ? '省级侧重全省监管策略、规则知识库、模型发布和效果评估。'
              : `当前为${userAgency}视角，重点处置本市预警、线索、案件和整改闭环。`}
          </p>
        </div>
        {isProvince ? renderProvinceActions() : <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">地市端不维护全省主规则和模型，只负责执行核查与处置。</div>}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {(isProvince ? provinceStats : cityStats).map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              {item.label}
            </div>
            <div className="text-2xl font-bold text-gray-800">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 pt-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex gap-1 overflow-x-auto">
            {isProvince
              ? provinceTabLabels.map((item) => (
                  <TabButton key={item.id} active={provinceTab === item.id} onClick={() => setProvinceTab(item.id)} label={item.label} />
                ))
              : cityTabLabels.map((item) => (
                  <TabButton key={item.id} active={cityTab === item.id} onClick={() => setCityTab(item.id)} label={item.label} />
                ))}
          </div>
          <div className="relative w-full max-w-sm mb-3">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={activePlaceholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
        <div className="p-4">{isProvince ? renderProvinceContent() : renderCityContent()}</div>
      </div>

      <AnimatePresence>
        {detailItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} className="bg-white rounded-xl w-full max-w-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">详情查看</h3>
                <button onClick={() => setDetailItem(null)} className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(detailItem).map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-gray-50 px-4 py-3">
                    <div className="text-gray-500 mb-1">{key}</div>
                    <div className="text-gray-800 break-all">{String(value)}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
        {toast && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
