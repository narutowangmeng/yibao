import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Layers, DollarSign, Settings, TrendingUp, Award, Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { getAgencyLevel } from '../../../config/managementPermissions';

type ProvinceTabId = 'drg' | 'dip' | 'standard' | 'grouper' | 'pilot' | 'evaluation';
type CityTabId = 'execution' | 'settlement' | 'exception' | 'monitor' | 'assessment';
type ModalMode = 'add' | 'edit' | 'view';

type ProvinceEditableRecord = DrgGroup | DipCatalog | PaymentStandard | GrouperVersion;

interface DrgGroup {
  id: string;
  groupCode: string;
  groupName: string;
  mdc: string;
  weight: string;
  admissionRule: string;
  exclusionRule: string;
  version: string;
  effectiveDate: string;
  status: '启用' | '停用';
}

interface DipCatalog {
  id: string;
  dipCode: string;
  diseaseName: string;
  diseaseGroup: string;
  score: string;
  settlementScope: string;
  version: string;
  effectiveDate: string;
  status: '启用' | '停用';
}

interface PaymentStandard {
  id: string;
  region: string;
  reformMode: string;
  pointValue: string;
  rateFactor: string;
  annualBudget: string;
  settleYear: string;
  status: '启用' | '停用';
}

interface GrouperVersion {
  id: string;
  grouperName: string;
  version: string;
  applyRegion: string;
  publishDate: string;
  updater: string;
  upgradeNote: string;
  status: '启用' | '停用';
}

interface PilotScope {
  id: string;
  city: string;
  reformMode: string;
  institutionCount: number;
  coveredCases: string;
  startDate: string;
  currentStatus: string;
  keyTask: string;
}

interface PolicyEvaluation {
  id: string;
  city: string;
  groupingRate: string;
  abnormalRate: string;
  settlementTimeliness: string;
  fundTrend: string;
  qualityScore: string;
  evaluation: string;
}

interface InstitutionExecution {
  id: string;
  institution: string;
  city: string;
  reformMode: string;
  launchStatus: string;
  uploadRate: string;
  settlementStatus: string;
  latestBatch: string;
}

interface CaseSettlement {
  id: string;
  institution: string;
  month: string;
  totalCases: number;
  settledCases: number;
  avgCost: string;
  balance: string;
  dominantGroup: string;
}

interface ExceptionCase {
  id: string;
  institution: string;
  caseNo: string;
  exceptionType: string;
  applyAmount: string;
  reviewStatus: string;
  reviewer: string;
  reviewDate: string;
}

interface OperationMonitor {
  id: string;
  institution: string;
  groupingRate: string;
  codingQuality: string;
  uploadTimeliness: string;
  ruleAlert: string;
  fundRisk: string;
  monitorDate: string;
}

interface CityAssessment {
  id: string;
  institution: string;
  period: string;
  executionScore: string;
  caseQualityScore: string;
  settlementScore: string;
  finalLevel: string;
  assessmentResult: string;
}

const provinceTabs: { id: ProvinceTabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'drg', label: 'DRG分组标准', icon: Layers },
  { id: 'dip', label: 'DIP病种目录', icon: Calculator },
  { id: 'standard', label: '支付标准', icon: DollarSign },
  { id: 'grouper', label: '分组器版本', icon: Settings },
  { id: 'pilot', label: '试点范围', icon: TrendingUp },
  { id: 'evaluation', label: '政策评估', icon: Award },
];

const cityTabs: { id: CityTabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'execution', label: '机构执行', icon: Layers },
  { id: 'settlement', label: '病例结算分析', icon: DollarSign },
  { id: 'exception', label: '特例单议管理', icon: Calculator },
  { id: 'monitor', label: '运行监测', icon: TrendingUp },
  { id: 'assessment', label: '考核评价', icon: Award },
];

const provinceTabDescriptions: Record<ProvinceTabId, string> = {
  drg: '全省DRG病组编码、入组规则和权重标准维护',
  dip: '全省DIP病种目录、分值和结算适用范围管理',
  standard: '支付点值、费率系数、年度预算和统筹区标准配置',
  grouper: '分组器版本发布、适用范围和升级说明管理',
  pilot: '试点城市覆盖范围、进度安排和重点任务跟踪',
  evaluation: '改革成效评估、基金运行趋势和质量分析',
};

const cityTabDescriptions: Record<CityTabId, string> = {
  execution: '查看本地定点机构上线执行、批次联调和结算状态',
  settlement: '分析病例结算量、次均费用和结余超支情况',
  exception: '受理高倍率病例、病组争议和特例单议申请',
  monitor: '跟踪入组率、编码质量、预警规则和基金风险',
  assessment: '查看机构考核结果、执行评分和整改建议',
};

const cities = ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'];
const hospitals = [
  '江苏省人民医院',
  '南京鼓楼医院',
  '无锡市人民医院',
  '徐州医科大学附属医院',
  '常州市第一人民医院',
  '苏州大学附属第一医院',
  '南通大学附属医院',
  '连云港市第一人民医院',
  '淮安市第一人民医院',
  '盐城市第一人民医院',
  '扬州大学附属医院',
  '镇江市第一人民医院',
  '泰州市人民医院',
  '宿迁市人民医院',
];

const drgGroupSeed: DrgGroup[] = Array.from({ length: 20 }, (_, index) => ({
  id: `DRG-${String(index + 1).padStart(3, '0')}`,
  groupCode: `JS-DRG-${String(index + 1).padStart(3, '0')}`,
  groupName: ['冠状动脉介入治疗', '心力衰竭综合治疗', '肺炎伴并发症', '剖宫产手术', '髋关节置换术'][index % 5],
  mdc: ['MDC05循环系统', 'MDC04呼吸系统', 'MDC14妊娠分娩', 'MDC08肌肉骨骼', 'MDC10内分泌'][index % 5],
  weight: (1.6 + index * 0.12).toFixed(2),
  admissionRule: ['主诊断匹配且手术编码完整', '住院天数符合病组规则', '并发症编码齐全', '病例首页质控通过'][index % 4],
  exclusionRule: ['转院病例排除', '重大器官移植排除', '精神专科病例排除', '日间手术单独管理'][index % 4],
  version: `V3.${index % 10}`,
  effectiveDate: `2026-${String((index % 6) + 1).padStart(2, '0')}-01`,
  status: index % 6 === 0 ? '停用' : '启用',
}));

const dipCatalogSeed: DipCatalog[] = Array.from({ length: 20 }, (_, index) => ({
  id: `DIP-${String(index + 1).padStart(3, '0')}`,
  dipCode: `JS-DIP-${String(index + 1).padStart(3, '0')}`,
  diseaseName: ['急性心肌梗死', '脑梗死', '糖尿病并发症', '慢阻肺急性加重', '恶性肿瘤化疗'][index % 5],
  diseaseGroup: ['循环系统', '神经系统', '代谢系统', '呼吸系统', '肿瘤系统'][index % 5],
  score: (58 + index * 3.6).toFixed(1),
  settlementScope: ['住院', '住院+门特', '住院', '住院+慢病', '住院+日间治疗'][index % 5],
  version: `V2.${index % 10}`,
  effectiveDate: `2026-${String((index % 6) + 1).padStart(2, '0')}-15`,
  status: index % 7 === 0 ? '停用' : '启用',
}));

const paymentStandardSeed: PaymentStandard[] = Array.from({ length: 20 }, (_, index) => ({
  id: `STD-${String(index + 1).padStart(3, '0')}`,
  region: index === 0 ? '省本级' : cities[(index - 1) % cities.length],
  reformMode: index % 2 === 0 ? 'DRG' : 'DIP',
  pointValue: `${(82 + index * 1.8).toFixed(2)}元`,
  rateFactor: `${(0.92 + (index % 6) * 0.03).toFixed(2)}`,
  annualBudget: `${(8.6 + index * 0.4).toFixed(1)}亿元`,
  settleYear: '2026',
  status: index % 6 === 0 ? '停用' : '启用',
}));

const grouperSeed: GrouperVersion[] = Array.from({ length: 20 }, (_, index) => ({
  id: `GRP-${String(index + 1).padStart(3, '0')}`,
  grouperName: `江苏医保分组器${index + 1}号`,
  version: `V${2 + Math.floor(index / 10)}.${index % 10}`,
  applyRegion: index < 10 ? '全省统一' : cities[index % cities.length],
  publishDate: `2026-${String((index % 6) + 1).padStart(2, '0')}-${String((index % 18) + 10).padStart(2, '0')}`,
  updater: ['省医保局医药服务管理处', '省医保信息中心', '支付方式改革专班'][index % 3],
  upgradeNote: ['优化权重映射规则', '更新编码映射关系', '补充特病特例识别逻辑', '修订基层病组入组边界'][index % 4],
  status: index % 5 === 0 ? '停用' : '启用',
}));

const pilotSeed: PilotScope[] = Array.from({ length: 20 }, (_, index) => ({
  id: `PILOT-${String(index + 1).padStart(3, '0')}`,
  city: cities[index % cities.length],
  reformMode: index % 2 === 0 ? 'DRG付费' : 'DIP付费',
  institutionCount: 12 + (index % 8),
  coveredCases: `${(6.2 + index * 0.5).toFixed(1)}万例`,
  startDate: `2025-${String((index % 10) + 1).padStart(2, '0')}-01`,
  currentStatus: ['稳定运行', '扩面推进', '试点评估', '规则调优'][index % 4],
  keyTask: ['推进二级医院全覆盖', '优化病组入组规则', '压降异常病例占比', '完善特例单议机制'][index % 4],
}));

const policyEvaluationSeed: PolicyEvaluation[] = Array.from({ length: 20 }, (_, index) => ({
  id: `EVAL-${String(index + 1).padStart(3, '0')}`,
  city: cities[index % cities.length],
  groupingRate: `${(92 + (index % 6) * 1.1).toFixed(1)}%`,
  abnormalRate: `${(1.8 + (index % 5) * 0.3).toFixed(1)}%`,
  settlementTimeliness: `${(96 + (index % 4) * 0.7).toFixed(1)}%`,
  fundTrend: ['基金运行平稳', '基金支出略增', '住院结构优化', '基层病种转诊减少'][index % 4],
  qualityScore: `${88 + (index % 10)}`,
  evaluation: ['执行成效较好', '需加强编码质控', '应优化点值测算', '适合继续扩围'][index % 4],
}));

const executionSeed: InstitutionExecution[] = Array.from({ length: 20 }, (_, index) => ({
  id: `EXEC-${String(index + 1).padStart(3, '0')}`,
  institution: hospitals[index % hospitals.length],
  city: cities[index % cities.length],
  reformMode: index % 2 === 0 ? 'DRG' : 'DIP',
  launchStatus: ['已上线', '试运行', '规则联调', '批量验证'][index % 4],
  uploadRate: `${(93 + (index % 5) * 1.2).toFixed(1)}%`,
  settlementStatus: ['已结算', '待结算', '差异复核中', '月度清算完成'][index % 4],
  latestBatch: `JS2026${String((index % 4) + 1).padStart(2, '0')}${String(index + 1).padStart(3, '0')}`,
}));

const settlementSeed: CaseSettlement[] = Array.from({ length: 20 }, (_, index) => ({
  id: `SET-${String(index + 1).padStart(3, '0')}`,
  institution: hospitals[index % hospitals.length],
  month: `2026-${String((index % 4) + 1).padStart(2, '0')}`,
  totalCases: 680 + index * 26,
  settledCases: 650 + index * 24,
  avgCost: `${(0.86 + index * 0.03).toFixed(2)}万元`,
  balance: `${index % 4 === 0 ? '-' : '+'}${120 + index * 18}万元`,
  dominantGroup: ['冠脉介入组', '脑梗死病种组', '肺炎并发症组', '髋膝关节置换组'][index % 4],
}));

const exceptionSeed: ExceptionCase[] = Array.from({ length: 20 }, (_, index) => ({
  id: `EXC-${String(index + 1).padStart(3, '0')}`,
  institution: hospitals[index % hospitals.length],
  caseNo: `CASE2026${String((index % 4) + 1).padStart(2, '0')}${String(index + 11).padStart(4, '0')}`,
  exceptionType: ['高倍率病例', '低倍率病例', '特病特例申请', '病组争议申诉'][index % 4],
  applyAmount: `${58 + index * 6}万元`,
  reviewStatus: ['待复核', '专家会审中', '已通过', '退回补证'][index % 4],
  reviewer: ['张蕾', '王敏', '顾明珠', '林悦'][index % 4],
  reviewDate: `2026-${String((index % 4) + 1).padStart(2, '0')}-${String((index % 18) + 10).padStart(2, '0')}`,
}));

const monitorSeed: OperationMonitor[] = Array.from({ length: 20 }, (_, index) => ({
  id: `MON-${String(index + 1).padStart(3, '0')}`,
  institution: hospitals[index % hospitals.length],
  groupingRate: `${(91 + (index % 6) * 1.2).toFixed(1)}%`,
  codingQuality: `${88 + (index % 10)}分`,
  uploadTimeliness: `${(95 + (index % 4) * 1.1).toFixed(1)}%`,
  ruleAlert: ['2条病案首页缺项', '1条高倍率预警', '无异常', '3条目录映射异常'][index % 4],
  fundRisk: ['低风险', '低风险', '中风险', '中风险'][index % 4],
  monitorDate: `2026-${String((index % 4) + 1).padStart(2, '0')}-28`,
}));

const cityAssessmentSeed: CityAssessment[] = Array.from({ length: 20 }, (_, index) => ({
  id: `ASM-${String(index + 1).padStart(3, '0')}`,
  institution: hospitals[index % hospitals.length],
  period: `2026年${['一季度', '二季度', '三季度', '四季度'][index % 4]}`,
  executionScore: `${89 + (index % 8)}`,
  caseQualityScore: `${87 + (index % 10)}`,
  settlementScore: `${88 + (index % 9)}`,
  finalLevel: ['A', 'A-', 'B+', 'B'][index % 4],
  assessmentResult: ['执行良好', '需优化编码质量', '需降低异常病例率', '建议纳入重点辅导'][index % 4],
}));

const provinceSearchMap: Record<ProvinceTabId, (item: any) => string[]> = {
  drg: (item: DrgGroup) => [item.groupCode, item.groupName, item.mdc, item.version, item.status],
  dip: (item: DipCatalog) => [item.dipCode, item.diseaseName, item.diseaseGroup, item.version, item.status],
  standard: (item: PaymentStandard) => [item.region, item.reformMode, item.settleYear, item.status],
  grouper: (item: GrouperVersion) => [item.grouperName, item.version, item.applyRegion, item.status, item.upgradeNote],
  pilot: (item: PilotScope) => [item.city, item.reformMode, item.currentStatus, item.keyTask],
  evaluation: (item: PolicyEvaluation) => [item.city, item.fundTrend, item.evaluation],
};

const citySearchMap: Record<CityTabId, (item: any) => string[]> = {
  execution: (item: InstitutionExecution) => [item.institution, item.city, item.reformMode, item.launchStatus, item.settlementStatus, item.latestBatch],
  settlement: (item: CaseSettlement) => [item.institution, item.month, item.balance, item.dominantGroup],
  exception: (item: ExceptionCase) => [item.institution, item.caseNo, item.exceptionType, item.reviewStatus, item.reviewer],
  monitor: (item: OperationMonitor) => [item.institution, item.groupingRate, item.ruleAlert, item.fundRisk],
  assessment: (item: CityAssessment) => [item.institution, item.period, item.finalLevel, item.assessmentResult],
};

const editableTabTitles: Record<ProvinceTabId, string> = {
  drg: 'DRG分组标准',
  dip: 'DIP病种目录',
  standard: '支付标准',
  grouper: '分组器版本',
  pilot: '试点范围',
  evaluation: '政策评估',
};

export default function PaymentReform({ userAgency }: { userAgency: string }) {
  const isProvince = getAgencyLevel(userAgency) === 'province';
  const [provinceTab, setProvinceTab] = useState<ProvinceTabId>('drg');
  const [cityTab, setCityTab] = useState<CityTabId>('execution');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('view');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [drgData, setDrgData] = useState<DrgGroup[]>(drgGroupSeed);
  const [dipData, setDipData] = useState<DipCatalog[]>(dipCatalogSeed);
  const [standardData, setStandardData] = useState<PaymentStandard[]>(paymentStandardSeed);
  const [grouperData, setGrouperData] = useState<GrouperVersion[]>(grouperSeed);

  const activeProvinceTab = provinceTab;
  const activeCityTab = cityTab;

  const provinceRows = {
    drg: drgData,
    dip: dipData,
    standard: standardData,
    grouper: grouperData,
    pilot: pilotSeed,
    evaluation: policyEvaluationSeed,
  };

  const cityRows = {
    execution: executionSeed,
    settlement: settlementSeed,
    exception: exceptionSeed,
    monitor: monitorSeed,
    assessment: cityAssessmentSeed,
  };

  const filteredProvinceRows = useMemo(() => {
    const rows = provinceRows[activeProvinceTab];
    return rows.filter((item) => provinceSearchMap[activeProvinceTab](item).some((field) => field.includes(searchQuery)));
  }, [activeProvinceTab, searchQuery, drgData, dipData, standardData, grouperData]);

  const filteredCityRows = useMemo(() => {
    const rows = cityRows[activeCityTab];
    return rows.filter((item) => citySearchMap[activeCityTab](item).some((field) => field.includes(searchQuery)));
  }, [activeCityTab, searchQuery]);

  const openModal = (mode: ModalMode, item?: any) => {
    setModalMode(mode);
    setSelectedItem(item || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = (id: string) => {
    if (activeProvinceTab === 'drg') setDrgData((prev) => prev.filter((item) => item.id !== id));
    if (activeProvinceTab === 'dip') setDipData((prev) => prev.filter((item) => item.id !== id));
    if (activeProvinceTab === 'standard') setStandardData((prev) => prev.filter((item) => item.id !== id));
    if (activeProvinceTab === 'grouper') setGrouperData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleProvinceSave = (payload: Record<string, FormDataEntryValue>) => {
    if (activeProvinceTab === 'drg') {
      const nextItem: DrgGroup = {
        id: selectedItem?.id || `DRG-${String(Date.now()).slice(-6)}`,
        groupCode: String(payload.groupCode || ''),
        groupName: String(payload.groupName || ''),
        mdc: String(payload.mdc || ''),
        weight: String(payload.weight || ''),
        admissionRule: String(payload.admissionRule || ''),
        exclusionRule: String(payload.exclusionRule || ''),
        version: String(payload.version || ''),
        effectiveDate: String(payload.effectiveDate || ''),
        status: String(payload.status || '启用') as '启用' | '停用',
      };
      setDrgData((prev) => (modalMode === 'edit' ? prev.map((item) => (item.id === nextItem.id ? nextItem : item)) : [nextItem, ...prev]));
    }

    if (activeProvinceTab === 'dip') {
      const nextItem: DipCatalog = {
        id: selectedItem?.id || `DIP-${String(Date.now()).slice(-6)}`,
        dipCode: String(payload.dipCode || ''),
        diseaseName: String(payload.diseaseName || ''),
        diseaseGroup: String(payload.diseaseGroup || ''),
        score: String(payload.score || ''),
        settlementScope: String(payload.settlementScope || ''),
        version: String(payload.version || ''),
        effectiveDate: String(payload.effectiveDate || ''),
        status: String(payload.status || '启用') as '启用' | '停用',
      };
      setDipData((prev) => (modalMode === 'edit' ? prev.map((item) => (item.id === nextItem.id ? nextItem : item)) : [nextItem, ...prev]));
    }

    if (activeProvinceTab === 'standard') {
      const nextItem: PaymentStandard = {
        id: selectedItem?.id || `STD-${String(Date.now()).slice(-6)}`,
        region: String(payload.region || ''),
        reformMode: String(payload.reformMode || ''),
        pointValue: String(payload.pointValue || ''),
        rateFactor: String(payload.rateFactor || ''),
        annualBudget: String(payload.annualBudget || ''),
        settleYear: String(payload.settleYear || ''),
        status: String(payload.status || '启用') as '启用' | '停用',
      };
      setStandardData((prev) => (modalMode === 'edit' ? prev.map((item) => (item.id === nextItem.id ? nextItem : item)) : [nextItem, ...prev]));
    }

    if (activeProvinceTab === 'grouper') {
      const nextItem: GrouperVersion = {
        id: selectedItem?.id || `GRP-${String(Date.now()).slice(-6)}`,
        grouperName: String(payload.grouperName || ''),
        version: String(payload.version || ''),
        applyRegion: String(payload.applyRegion || ''),
        publishDate: String(payload.publishDate || ''),
        updater: String(payload.updater || ''),
        upgradeNote: String(payload.upgradeNote || ''),
        status: String(payload.status || '启用') as '启用' | '停用',
      };
      setGrouperData((prev) => (modalMode === 'edit' ? prev.map((item) => (item.id === nextItem.id ? nextItem : item)) : [nextItem, ...prev]));
    }

    closeModal();
  };

  const renderSearchBar = (placeholder: string) => (
    <div className="relative max-w-md">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm"
      />
      <Eye className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
    </div>
  );

  const renderProvinceActions = (item: ProvinceEditableRecord) => (
    <div className="flex gap-2">
      <button onClick={() => openModal('view', item)} className="text-blue-600">
        <Eye className="h-4 w-4" />
      </button>
      {['drg', 'dip', 'standard', 'grouper'].includes(activeProvinceTab) && (
        <>
          <button onClick={() => openModal('edit', item)} className="text-green-600">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => handleDelete(item.id)} className="text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );

  const renderCityActions = (item: any) => (
    <div className="flex gap-2">
      <button onClick={() => openModal('view', item)} className="text-blue-600">
        <Eye className="h-4 w-4" />
      </button>
    </div>
  );

  const renderProvinceContent = () => {
    switch (activeProvinceTab) {
      case 'drg':
        return (
          <table className="w-full rounded-xl border bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">病组编码</th>
                <th className="px-4 py-3 text-left text-sm">病组名称</th>
                <th className="px-4 py-3 text-left text-sm">MDC大类</th>
                <th className="px-4 py-3 text-left text-sm">权重</th>
                <th className="px-4 py-3 text-left text-sm">版本</th>
                <th className="px-4 py-3 text-left text-sm">生效日期</th>
                <th className="px-4 py-3 text-left text-sm">状态</th>
                <th className="px-4 py-3 text-left text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProvinceRows.map((item: any) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 text-sm font-medium">{item.groupCode}</td>
                  <td className="px-4 py-3 text-sm">{item.groupName}</td>
                  <td className="px-4 py-3 text-sm">{item.mdc}</td>
                  <td className="px-4 py-3 text-sm">{item.weight}</td>
                  <td className="px-4 py-3 text-sm">{item.version}</td>
                  <td className="px-4 py-3 text-sm">{item.effectiveDate}</td>
                  <td className="px-4 py-3 text-sm">{item.status}</td>
                  <td className="px-4 py-3">{renderProvinceActions(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'dip':
        return (
          <table className="w-full rounded-xl border bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">病种编码</th>
                <th className="px-4 py-3 text-left text-sm">病种名称</th>
                <th className="px-4 py-3 text-left text-sm">病种组别</th>
                <th className="px-4 py-3 text-left text-sm">分值</th>
                <th className="px-4 py-3 text-left text-sm">结算范围</th>
                <th className="px-4 py-3 text-left text-sm">版本</th>
                <th className="px-4 py-3 text-left text-sm">状态</th>
                <th className="px-4 py-3 text-left text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProvinceRows.map((item: any) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 text-sm font-medium">{item.dipCode}</td>
                  <td className="px-4 py-3 text-sm">{item.diseaseName}</td>
                  <td className="px-4 py-3 text-sm">{item.diseaseGroup}</td>
                  <td className="px-4 py-3 text-sm">{item.score}</td>
                  <td className="px-4 py-3 text-sm">{item.settlementScope}</td>
                  <td className="px-4 py-3 text-sm">{item.version}</td>
                  <td className="px-4 py-3 text-sm">{item.status}</td>
                  <td className="px-4 py-3">{renderProvinceActions(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'standard':
        return (
          <table className="w-full rounded-xl border bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">统筹区</th>
                <th className="px-4 py-3 text-left text-sm">改革模式</th>
                <th className="px-4 py-3 text-left text-sm">点值</th>
                <th className="px-4 py-3 text-left text-sm">费率系数</th>
                <th className="px-4 py-3 text-left text-sm">年度预算</th>
                <th className="px-4 py-3 text-left text-sm">年度</th>
                <th className="px-4 py-3 text-left text-sm">状态</th>
                <th className="px-4 py-3 text-left text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProvinceRows.map((item: any) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 text-sm font-medium">{item.region}</td>
                  <td className="px-4 py-3 text-sm">{item.reformMode}</td>
                  <td className="px-4 py-3 text-sm text-cyan-600">{item.pointValue}</td>
                  <td className="px-4 py-3 text-sm">{item.rateFactor}</td>
                  <td className="px-4 py-3 text-sm">{item.annualBudget}</td>
                  <td className="px-4 py-3 text-sm">{item.settleYear}</td>
                  <td className="px-4 py-3 text-sm">{item.status}</td>
                  <td className="px-4 py-3">{renderProvinceActions(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'grouper':
        return (
          <table className="w-full rounded-xl border bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">分组器名称</th>
                <th className="px-4 py-3 text-left text-sm">版本号</th>
                <th className="px-4 py-3 text-left text-sm">适用范围</th>
                <th className="px-4 py-3 text-left text-sm">发布日期</th>
                <th className="px-4 py-3 text-left text-sm">发布单位</th>
                <th className="px-4 py-3 text-left text-sm">状态</th>
                <th className="px-4 py-3 text-left text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProvinceRows.map((item: any) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 text-sm font-medium">{item.grouperName}</td>
                  <td className="px-4 py-3 text-sm">{item.version}</td>
                  <td className="px-4 py-3 text-sm">{item.applyRegion}</td>
                  <td className="px-4 py-3 text-sm">{item.publishDate}</td>
                  <td className="px-4 py-3 text-sm">{item.updater}</td>
                  <td className="px-4 py-3 text-sm">{item.status}</td>
                  <td className="px-4 py-3">{renderProvinceActions(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'pilot':
        return (
          <table className="w-full rounded-xl border bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">统筹区</th>
                <th className="px-4 py-3 text-left text-sm">改革模式</th>
                <th className="px-4 py-3 text-left text-sm">纳入机构数</th>
                <th className="px-4 py-3 text-left text-sm">覆盖病例量</th>
                <th className="px-4 py-3 text-left text-sm">启动时间</th>
                <th className="px-4 py-3 text-left text-sm">当前状态</th>
                <th className="px-4 py-3 text-left text-sm">重点任务</th>
                <th className="px-4 py-3 text-left text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProvinceRows.map((item: any) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 text-sm font-medium">{item.city}</td>
                  <td className="px-4 py-3 text-sm">{item.reformMode}</td>
                  <td className="px-4 py-3 text-sm">{item.institutionCount}</td>
                  <td className="px-4 py-3 text-sm">{item.coveredCases}</td>
                  <td className="px-4 py-3 text-sm">{item.startDate}</td>
                  <td className="px-4 py-3 text-sm">{item.currentStatus}</td>
                  <td className="px-4 py-3 text-sm">{item.keyTask}</td>
                  <td className="px-4 py-3">{renderProvinceActions(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'evaluation':
        return (
          <table className="w-full rounded-xl border bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">统筹区</th>
                <th className="px-4 py-3 text-left text-sm">入组率</th>
                <th className="px-4 py-3 text-left text-sm">异常病例率</th>
                <th className="px-4 py-3 text-left text-sm">结算及时率</th>
                <th className="px-4 py-3 text-left text-sm">基金趋势</th>
                <th className="px-4 py-3 text-left text-sm">质量评分</th>
                <th className="px-4 py-3 text-left text-sm">评估结论</th>
                <th className="px-4 py-3 text-left text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProvinceRows.map((item: any) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 text-sm font-medium">{item.city}</td>
                  <td className="px-4 py-3 text-sm">{item.groupingRate}</td>
                  <td className="px-4 py-3 text-sm">{item.abnormalRate}</td>
                  <td className="px-4 py-3 text-sm">{item.settlementTimeliness}</td>
                  <td className="px-4 py-3 text-sm">{item.fundTrend}</td>
                  <td className="px-4 py-3 text-sm">{item.qualityScore}</td>
                  <td className="px-4 py-3 text-sm">{item.evaluation}</td>
                  <td className="px-4 py-3">{renderProvinceActions(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  const renderCityContent = () => {
    switch (activeCityTab) {
      case 'execution':
        return (
          <table className="w-full rounded-xl border bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">医疗机构</th>
                <th className="px-4 py-3 text-left text-sm">统筹区</th>
                <th className="px-4 py-3 text-left text-sm">改革模式</th>
                <th className="px-4 py-3 text-left text-sm">上线状态</th>
                <th className="px-4 py-3 text-left text-sm">上传率</th>
                <th className="px-4 py-3 text-left text-sm">结算状态</th>
                <th className="px-4 py-3 text-left text-sm">最新批次</th>
                <th className="px-4 py-3 text-left text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredCityRows.map((item: any) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 text-sm font-medium">{item.institution}</td>
                  <td className="px-4 py-3 text-sm">{item.city}</td>
                  <td className="px-4 py-3 text-sm">{item.reformMode}</td>
                  <td className="px-4 py-3 text-sm">{item.launchStatus}</td>
                  <td className="px-4 py-3 text-sm">{item.uploadRate}</td>
                  <td className="px-4 py-3 text-sm">{item.settlementStatus}</td>
                  <td className="px-4 py-3 text-sm">{item.latestBatch}</td>
                  <td className="px-4 py-3">{renderCityActions(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'settlement':
        return (
          <table className="w-full rounded-xl border bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">医疗机构</th>
                <th className="px-4 py-3 text-left text-sm">月份</th>
                <th className="px-4 py-3 text-left text-sm">总病例数</th>
                <th className="px-4 py-3 text-left text-sm">已结算病例</th>
                <th className="px-4 py-3 text-left text-sm">次均费用</th>
                <th className="px-4 py-3 text-left text-sm">结余/超支</th>
                <th className="px-4 py-3 text-left text-sm">主导病组</th>
                <th className="px-4 py-3 text-left text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredCityRows.map((item: any) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 text-sm font-medium">{item.institution}</td>
                  <td className="px-4 py-3 text-sm">{item.month}</td>
                  <td className="px-4 py-3 text-sm">{item.totalCases}</td>
                  <td className="px-4 py-3 text-sm">{item.settledCases}</td>
                  <td className="px-4 py-3 text-sm">{item.avgCost}</td>
                  <td className={`px-4 py-3 text-sm ${String(item.balance).startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>{item.balance}</td>
                  <td className="px-4 py-3 text-sm">{item.dominantGroup}</td>
                  <td className="px-4 py-3">{renderCityActions(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'exception':
        return (
          <table className="w-full rounded-xl border bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">医疗机构</th>
                <th className="px-4 py-3 text-left text-sm">病例号</th>
                <th className="px-4 py-3 text-left text-sm">特例类型</th>
                <th className="px-4 py-3 text-left text-sm">申报金额</th>
                <th className="px-4 py-3 text-left text-sm">复核状态</th>
                <th className="px-4 py-3 text-left text-sm">复核人</th>
                <th className="px-4 py-3 text-left text-sm">复核日期</th>
                <th className="px-4 py-3 text-left text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredCityRows.map((item: any) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 text-sm font-medium">{item.institution}</td>
                  <td className="px-4 py-3 text-sm">{item.caseNo}</td>
                  <td className="px-4 py-3 text-sm">{item.exceptionType}</td>
                  <td className="px-4 py-3 text-sm">{item.applyAmount}</td>
                  <td className="px-4 py-3 text-sm">{item.reviewStatus}</td>
                  <td className="px-4 py-3 text-sm">{item.reviewer}</td>
                  <td className="px-4 py-3 text-sm">{item.reviewDate}</td>
                  <td className="px-4 py-3">{renderCityActions(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'monitor':
        return (
          <table className="w-full rounded-xl border bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">医疗机构</th>
                <th className="px-4 py-3 text-left text-sm">入组率</th>
                <th className="px-4 py-3 text-left text-sm">编码质量</th>
                <th className="px-4 py-3 text-left text-sm">上传及时率</th>
                <th className="px-4 py-3 text-left text-sm">规则预警</th>
                <th className="px-4 py-3 text-left text-sm">基金风险</th>
                <th className="px-4 py-3 text-left text-sm">监测日期</th>
                <th className="px-4 py-3 text-left text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredCityRows.map((item: any) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 text-sm font-medium">{item.institution}</td>
                  <td className="px-4 py-3 text-sm">{item.groupingRate}</td>
                  <td className="px-4 py-3 text-sm">{item.codingQuality}</td>
                  <td className="px-4 py-3 text-sm">{item.uploadTimeliness}</td>
                  <td className="px-4 py-3 text-sm">{item.ruleAlert}</td>
                  <td className="px-4 py-3 text-sm">{item.fundRisk}</td>
                  <td className="px-4 py-3 text-sm">{item.monitorDate}</td>
                  <td className="px-4 py-3">{renderCityActions(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'assessment':
        return (
          <table className="w-full rounded-xl border bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">医疗机构</th>
                <th className="px-4 py-3 text-left text-sm">考核周期</th>
                <th className="px-4 py-3 text-left text-sm">执行得分</th>
                <th className="px-4 py-3 text-left text-sm">病案质量得分</th>
                <th className="px-4 py-3 text-left text-sm">结算得分</th>
                <th className="px-4 py-3 text-left text-sm">综合等级</th>
                <th className="px-4 py-3 text-left text-sm">考核结果</th>
                <th className="px-4 py-3 text-left text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredCityRows.map((item: any) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 text-sm font-medium">{item.institution}</td>
                  <td className="px-4 py-3 text-sm">{item.period}</td>
                  <td className="px-4 py-3 text-sm">{item.executionScore}</td>
                  <td className="px-4 py-3 text-sm">{item.caseQualityScore}</td>
                  <td className="px-4 py-3 text-sm">{item.settlementScore}</td>
                  <td className="px-4 py-3 text-sm">{item.finalLevel}</td>
                  <td className="px-4 py-3 text-sm">{item.assessmentResult}</td>
                  <td className="px-4 py-3">{renderCityActions(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  const renderProvinceForm = () => {
    if (activeProvinceTab === 'drg') {
      return (
        <div className="space-y-4">
          <input name="groupCode" defaultValue={selectedItem?.groupCode} placeholder="病组编码" className="w-full rounded border px-3 py-2" />
          <input name="groupName" defaultValue={selectedItem?.groupName} placeholder="病组名称" className="w-full rounded border px-3 py-2" />
          <input name="mdc" defaultValue={selectedItem?.mdc} placeholder="MDC大类" className="w-full rounded border px-3 py-2" />
          <input name="weight" defaultValue={selectedItem?.weight} placeholder="权重" className="w-full rounded border px-3 py-2" />
          <input name="admissionRule" defaultValue={selectedItem?.admissionRule} placeholder="入组规则" className="w-full rounded border px-3 py-2" />
          <input name="exclusionRule" defaultValue={selectedItem?.exclusionRule} placeholder="排除规则" className="w-full rounded border px-3 py-2" />
          <div className="grid grid-cols-2 gap-4">
            <input name="version" defaultValue={selectedItem?.version} placeholder="版本" className="w-full rounded border px-3 py-2" />
            <input name="effectiveDate" defaultValue={selectedItem?.effectiveDate} placeholder="生效日期" className="w-full rounded border px-3 py-2" />
          </div>
          <select name="status" defaultValue={selectedItem?.status || '启用'} className="w-full rounded border px-3 py-2">
            <option value="启用">启用</option>
            <option value="停用">停用</option>
          </select>
        </div>
      );
    }

    if (activeProvinceTab === 'dip') {
      return (
        <div className="space-y-4">
          <input name="dipCode" defaultValue={selectedItem?.dipCode} placeholder="病种编码" className="w-full rounded border px-3 py-2" />
          <input name="diseaseName" defaultValue={selectedItem?.diseaseName} placeholder="病种名称" className="w-full rounded border px-3 py-2" />
          <input name="diseaseGroup" defaultValue={selectedItem?.diseaseGroup} placeholder="病种组别" className="w-full rounded border px-3 py-2" />
          <input name="score" defaultValue={selectedItem?.score} placeholder="分值" className="w-full rounded border px-3 py-2" />
          <input name="settlementScope" defaultValue={selectedItem?.settlementScope} placeholder="结算范围" className="w-full rounded border px-3 py-2" />
          <div className="grid grid-cols-2 gap-4">
            <input name="version" defaultValue={selectedItem?.version} placeholder="版本" className="w-full rounded border px-3 py-2" />
            <input name="effectiveDate" defaultValue={selectedItem?.effectiveDate} placeholder="生效日期" className="w-full rounded border px-3 py-2" />
          </div>
          <select name="status" defaultValue={selectedItem?.status || '启用'} className="w-full rounded border px-3 py-2">
            <option value="启用">启用</option>
            <option value="停用">停用</option>
          </select>
        </div>
      );
    }

    if (activeProvinceTab === 'standard') {
      return (
        <div className="space-y-4">
          <input name="region" defaultValue={selectedItem?.region} placeholder="统筹区" className="w-full rounded border px-3 py-2" />
          <input name="reformMode" defaultValue={selectedItem?.reformMode} placeholder="改革模式" className="w-full rounded border px-3 py-2" />
          <div className="grid grid-cols-2 gap-4">
            <input name="pointValue" defaultValue={selectedItem?.pointValue} placeholder="点值" className="w-full rounded border px-3 py-2" />
            <input name="rateFactor" defaultValue={selectedItem?.rateFactor} placeholder="费率系数" className="w-full rounded border px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input name="annualBudget" defaultValue={selectedItem?.annualBudget} placeholder="年度预算" className="w-full rounded border px-3 py-2" />
            <input name="settleYear" defaultValue={selectedItem?.settleYear} placeholder="年度" className="w-full rounded border px-3 py-2" />
          </div>
          <select name="status" defaultValue={selectedItem?.status || '启用'} className="w-full rounded border px-3 py-2">
            <option value="启用">启用</option>
            <option value="停用">停用</option>
          </select>
        </div>
      );
    }

    if (activeProvinceTab === 'grouper') {
      return (
        <div className="space-y-4">
          <input name="grouperName" defaultValue={selectedItem?.grouperName} placeholder="分组器名称" className="w-full rounded border px-3 py-2" />
          <div className="grid grid-cols-2 gap-4">
            <input name="version" defaultValue={selectedItem?.version} placeholder="版本号" className="w-full rounded border px-3 py-2" />
            <input name="applyRegion" defaultValue={selectedItem?.applyRegion} placeholder="适用范围" className="w-full rounded border px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input name="publishDate" defaultValue={selectedItem?.publishDate} placeholder="发布日期" className="w-full rounded border px-3 py-2" />
            <input name="updater" defaultValue={selectedItem?.updater} placeholder="发布单位" className="w-full rounded border px-3 py-2" />
          </div>
          <input name="upgradeNote" defaultValue={selectedItem?.upgradeNote} placeholder="升级说明" className="w-full rounded border px-3 py-2" />
          <select name="status" defaultValue={selectedItem?.status || '启用'} className="w-full rounded border px-3 py-2">
            <option value="启用">启用</option>
            <option value="停用">停用</option>
          </select>
        </div>
      );
    }

    return null;
  };

  const renderViewBody = () => (
    <div className="space-y-3 text-sm">
      {Object.entries(selectedItem || {}).map(([key, value]) => (
        <div key={key} className="flex justify-between gap-4 rounded bg-gray-50 px-3 py-2">
          <span className="text-gray-500">{key}</span>
          <span className="text-right text-gray-800">{String(value)}</span>
        </div>
      ))}
    </div>
  );

  const activeTabs = isProvince ? provinceTabs : cityTabs;
  const activeDescriptions = isProvince ? provinceTabDescriptions : cityTabDescriptions;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">DRG/DIP支付方式改革</h2>
          <p className="mt-1 text-sm text-gray-500">
            {isProvince
              ? '省级侧重全省支付方式改革标准、参数、版本和试点范围管理。'
              : '地市侧重本地医疗机构执行、病例结算、特例单议和运行监测闭环。'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {activeTabs.map((tab) => {
          const Icon = tab.icon;
          const active = isProvince ? provinceTab === tab.id : cityTab === tab.id;

          return (
            <button
              key={`card-${tab.id}`}
              type="button"
              onClick={() => {
                if (isProvince) setProvinceTab(tab.id as ProvinceTabId);
                else setCityTab(tab.id as CityTabId);
                setSearchQuery('');
              }}
              className={`rounded-xl border bg-white p-5 text-left transition-all ${
                active ? 'border-cyan-500 shadow-sm ring-2 ring-cyan-100' : 'border-gray-200 hover:border-cyan-300 hover:shadow-sm'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${active ? 'bg-cyan-50 text-cyan-600' : 'bg-gray-50 text-gray-500'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-sm font-medium ${active ? 'text-cyan-600' : 'text-gray-400'}`}>{active ? '当前功能' : '点击进入'}</span>
              </div>
              <div className="text-base font-semibold text-gray-800">{tab.label}</div>
              <p className="mt-2 text-sm leading-6 text-gray-500">{activeDescriptions[tab.id as keyof typeof activeDescriptions]}</p>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 border-b">
        {(isProvince ? provinceTabs : cityTabs).map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (isProvince) setProvinceTab(tab.id as ProvinceTabId);
              else setCityTab(tab.id as CityTabId);
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
              (isProvince ? provinceTab === tab.id : cityTab === tab.id)
                ? 'border-b-2 border-cyan-600 text-cyan-600'
                : 'text-gray-600'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        {renderSearchBar(
          isProvince
            ? `搜索${editableTabTitles[activeProvinceTab]}相关内容`
            : '搜索机构、病例、批次、评估结果',
        )}
        {isProvince && ['drg', 'dip', 'standard', 'grouper'].includes(activeProvinceTab) && (
          <button onClick={() => openModal('add')} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white">
            <Plus className="h-4 w-4" />
            新增
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={isProvince ? provinceTab : cityTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {isProvince ? renderProvinceContent() : renderCityContent()}
        </motion.div>
      </AnimatePresence>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                {modalMode === 'add' ? '新增' : modalMode === 'edit' ? '编辑' : '查看'}
                {isProvince ? editableTabTitles[activeProvinceTab] : cityTabs.find((item) => item.id === cityTab)?.label}
              </h3>
              <button onClick={closeModal}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalMode === 'view' || !isProvince || !['drg', 'dip', 'standard', 'grouper'].includes(activeProvinceTab) ? (
              renderViewBody()
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProvinceSave(Object.fromEntries(new FormData(e.currentTarget)));
                }}
                className="space-y-4"
              >
                {renderProvinceForm()}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="rounded border px-4 py-2">
                    取消
                  </button>
                  <button type="submit" className="rounded bg-cyan-600 px-4 py-2 text-white">
                    保存
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
