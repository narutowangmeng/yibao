import type { ElementType } from 'react';
import {
  Activity,
  BadgeDollarSign,
  BarChart3,
  Building2,
  ClipboardCheck,
  CreditCard,
  HeartPulse,
  ShieldAlert,
  TrendingUp,
  Users
} from 'lucide-react';

export type ReportGroupId =
  | 'overview'
  | 'enrollment'
  | 'collection'
  | 'benefit'
  | 'audit'
  | 'fund'
  | 'institution'
  | 'supervision'
  | 'medical'
  | 'special';

export type ReportCycle = '日报' | '周报' | '月报' | '季报' | '专题' | '年报';
export type ChartMode = 'line' | 'bar' | 'pie';

export interface ReportItem {
  id: string;
  name: string;
  cycle: ReportCycle;
  owner: string;
  summary: string;
}

export interface ReportGroup {
  id: ReportGroupId;
  name: string;
  icon: ElementType;
  description: string;
  color: string;
  light: string;
  reports: ReportItem[];
}

export interface ReportMetric {
  label: string;
  value: string;
  sub: string;
}

export interface ReportTableColumn {
  key: string;
  label: string;
}

export interface ReportDetail {
  period: string;
  scope: string;
  heroTitle: string;
  heroSummary: string;
  metrics: ReportMetric[];
  primaryChartTitle: string;
  primaryChartMode: ChartMode;
  primaryChartData: Array<Record<string, string | number>>;
  primaryChartKeys: string[];
  secondaryChartTitle: string;
  secondaryChartMode: ChartMode;
  secondaryChartData: Array<Record<string, string | number>>;
  secondaryChartKeys: string[];
  pieColors?: string[];
  tableTitle: string;
  tableColumns: ReportTableColumn[];
  tableRows: Array<Record<string, string>>;
  insights: string[];
}

export const reportGroups: ReportGroup[] = [
  {
    id: 'overview',
    name: '综合运行月报',
    icon: BarChart3,
    description: '汇总参保、征缴、待遇、基金、结算和风险，是领导层总入口。',
    color: 'bg-sky-600',
    light: 'bg-sky-50',
    reports: [
      { id: 'overview-1', name: '医保综合运行月报', cycle: '月报', owner: '报表中心', summary: '看全省综合运行质量、基金、风险与地市对比。' },
      { id: 'overview-2', name: '局领导重点指标日报', cycle: '日报', owner: '报表中心', summary: '看领导关注的核心指标和异常提醒。' },
      { id: 'overview-3', name: '地市运行对比分析表', cycle: '月报', owner: '综合分析组', summary: '看各地市参保、基金、支付、风险横向比较。' },
      { id: 'overview-4', name: '年度运营评估总表', cycle: '年报', owner: '综合分析组', summary: '看全年运营结果、短板和年度重点问题。' }
    ]
  },
  {
    id: 'enrollment',
    name: '参保统计报表',
    icon: Users,
    description: '围绕参保人数、结构、扩面和地区覆盖情况。',
    color: 'bg-cyan-600',
    light: 'bg-cyan-50',
    reports: [
      { id: 'enrollment-1', name: '参保人数统计表', cycle: '月报', owner: '待遇保障司', summary: '看参保人数总量、增量和险种结构。' },
      { id: 'enrollment-2', name: '新增/暂停/终止参保统计表', cycle: '月报', owner: '待遇保障司', summary: '看参保流转变化和重点异常波动。' },
      { id: 'enrollment-3', name: '人员参保结构分析表', cycle: '季报', owner: '待遇保障司', summary: '看职工、居民、灵活就业等结构变化。' },
      { id: 'enrollment-4', name: '地区参保覆盖率统计表', cycle: '月报', owner: '待遇保障司', summary: '看地市参保覆盖率和短板区域。' }
    ]
  },
  {
    id: 'collection',
    name: '征缴统计报表',
    icon: BadgeDollarSign,
    description: '围绕应缴、实缴、欠费、基数核定和年度征缴完成情况。',
    color: 'bg-emerald-600',
    light: 'bg-emerald-50',
    reports: [
      { id: 'collection-1', name: '单位应缴实缴统计表', cycle: '月报', owner: '征缴管理处', summary: '看应缴、实缴、到账率和差额。' },
      { id: 'collection-2', name: '缴费基数核定汇总表', cycle: '月报', owner: '征缴管理处', summary: '看各行业基数核定执行情况。' },
      { id: 'collection-3', name: '欠费单位明细表', cycle: '周报', owner: '征缴管理处', summary: '看重点欠费单位、催缴状态和欠费金额。' },
      { id: 'collection-4', name: '年度征缴完成情况表', cycle: '年报', owner: '征缴管理处', summary: '看年度目标完成进度和地市排名。' }
    ]
  },
  {
    id: 'benefit',
    name: '待遇支付报表',
    icon: HeartPulse,
    description: '用于查看门诊、住院、大病、慢特病和异地就医待遇支付。',
    color: 'bg-rose-600',
    light: 'bg-rose-50',
    reports: [
      { id: 'benefit-1', name: '门诊待遇支付统计表', cycle: '月报', owner: '待遇审核处', summary: '看门诊人次、金额和次均费用。' },
      { id: 'benefit-2', name: '住院待遇支付统计表', cycle: '月报', owner: '待遇审核处', summary: '看住院金额、病例结构和高费用分布。' },
      { id: 'benefit-3', name: '大病保险支付统计表', cycle: '月报', owner: '待遇审核处', summary: '看大病保险支出和重点病种。' },
      { id: 'benefit-4', name: '异地就医待遇结算表', cycle: '月报', owner: '待遇审核处', summary: '看异地结算流向和区域分布。' }
    ]
  },
  {
    id: 'audit',
    name: '报销审核报表',
    icon: ClipboardCheck,
    description: '查看受理量、审核通过率、驳回原因和审核时效。',
    color: 'bg-amber-600',
    light: 'bg-amber-50',
    reports: [
      { id: 'audit-1', name: '报销申请受理统计表', cycle: '月报', owner: '审核中心', summary: '看受理件数、来源结构和波动趋势。' },
      { id: 'audit-2', name: '初审复审终审通过率统计表', cycle: '月报', owner: '审核中心', summary: '看各审核环节通过率和积压情况。' },
      { id: 'audit-3', name: '驳回原因统计表', cycle: '周报', owner: '审核中心', summary: '看主要驳回原因和整改建议。' },
      { id: 'audit-4', name: '报销时效统计表', cycle: '月报', owner: '审核中心', summary: '看全流程时效和地区差异。' }
    ]
  },
  {
    id: 'fund',
    name: '基金运行报表',
    icon: CreditCard,
    description: '核心查看基金收入、支出、结余、预算执行和风险预警。',
    color: 'bg-violet-600',
    light: 'bg-violet-50',
    reports: [
      { id: 'fund-1', name: '基金收入支出月报', cycle: '月报', owner: '基金财务处', summary: '看基金收入、支出和当期结余。' },
      { id: 'fund-2', name: '基金结余分析表', cycle: '月报', owner: '基金财务处', summary: '看结余波动和重点风险地市。' },
      { id: 'fund-3', name: '基金预算执行表', cycle: '季报', owner: '基金财务处', summary: '看预算执行进度和偏差。' },
      { id: 'fund-4', name: '基金风险预警表', cycle: '周报', owner: '基金监管司', summary: '看基金运行中的异常预警。' }
    ]
  },
  {
    id: 'institution',
    name: '医疗机构结算报表',
    icon: Building2,
    description: '面向机构结算汇总、明细、时效和拒付扣款分析。',
    color: 'bg-indigo-600',
    light: 'bg-indigo-50',
    reports: [
      { id: 'institution-1', name: '医疗机构结算汇总表', cycle: '月报', owner: '医药服务管理司', summary: '看机构结算总量和结构。' },
      { id: 'institution-2', name: '医院结算明细表', cycle: '月报', owner: '医药服务管理司', summary: '看重点医院结算金额和审核情况。' },
      { id: 'institution-3', name: '机构结算时效分析表', cycle: '周报', owner: '医药服务管理司', summary: '看机构结算周期和积压。' },
      { id: 'institution-4', name: '拒付扣款统计表', cycle: '月报', owner: '医药服务管理司', summary: '看拒付原因和扣款分布。' }
    ]
  },
  {
    id: 'supervision',
    name: '监管稽核报表',
    icon: ShieldAlert,
    description: '用于看智能监管预警、违规机构、飞检结果和追回基金。',
    color: 'bg-red-600',
    light: 'bg-red-50',
    reports: [
      { id: 'supervision-1', name: '智能监管预警统计表', cycle: '日报', owner: '基金监管司', summary: '看当日预警分布和规则命中。' },
      { id: 'supervision-2', name: '违规机构明细表', cycle: '周报', owner: '基金监管司', summary: '看违规机构、问题类型和整改进展。' },
      { id: 'supervision-3', name: '飞行检查结果汇总表', cycle: '月报', owner: '基金监管司', summary: '看飞检覆盖、问题和处置结果。' },
      { id: 'supervision-4', name: '追回基金统计表', cycle: '月报', owner: '基金监管司', summary: '看追回金额和案件闭环。' }
    ]
  },
  {
    id: 'medical',
    name: '医药服务监管报表',
    icon: Activity,
    description: '围绕药品目录、耗材、诊疗项目、价格和集采执行。',
    color: 'bg-teal-600',
    light: 'bg-teal-50',
    reports: [
      { id: 'medical-1', name: '药品目录执行情况表', cycle: '月报', owner: '医药服务管理司', summary: '看目录执行率和重点药品使用。' },
      { id: 'medical-2', name: '诊疗项目使用统计表', cycle: '月报', owner: '医药服务管理司', summary: '看项目使用量和机构差异。' },
      { id: 'medical-3', name: '医用耗材使用分析表', cycle: '月报', owner: '医药服务管理司', summary: '看耗材使用、金额和高值耗材波动。' },
      { id: 'medical-4', name: '医疗服务价格监测表', cycle: '月报', owner: '医药服务管理司', summary: '看价格波动和异常项目。' }
    ]
  },
  {
    id: 'special',
    name: '专题分析报表',
    icon: TrendingUp,
    description: '承接慢特病、DRG/DIP、重点人群和年度综合专题。',
    color: 'bg-slate-700',
    light: 'bg-slate-100',
    reports: [
      { id: 'special-1', name: '慢特病保障专题分析', cycle: '专题', owner: '综合分析组', summary: '看慢特病人群、费用和保障结果。' },
      { id: 'special-2', name: 'DRG/DIP 改革分析报告', cycle: '专题', owner: '综合分析组', summary: '看改革成效、病组偏差和机构差异。' },
      { id: 'special-3', name: '重点人群保障专题', cycle: '专题', owner: '综合分析组', summary: '看老年、儿童和困难人群保障。' },
      { id: 'special-4', name: '年度综合评估报告', cycle: '年报', owner: '综合分析组', summary: '看全年核心指标和重点结论。' }
    ]
  }
];

export const topSummaryCards = [
  { label: '参保总人数', value: '8,426,300', sub: '本月新增 62,814 人', icon: Users, tone: 'text-sky-700 bg-sky-50' },
  { label: '当月征缴金额', value: '19.82 亿元', sub: '征缴完成率 96.4%', icon: BadgeDollarSign, tone: 'text-emerald-700 bg-emerald-50' },
  { label: '待遇支付金额', value: '16.73 亿元', sub: '住院支付占比 58.2%', icon: HeartPulse, tone: 'text-rose-700 bg-rose-50' },
  { label: '基金当期结余', value: '3.09 亿元', sub: '累计结余保持安全', icon: CreditCard, tone: 'text-violet-700 bg-violet-50' }
];

export const publishedReports = reportGroups.flatMap((group) =>
  group.reports.map((report, index) => ({
    id: `RPT-${String(index + 1).padStart(3, '0')}-${group.id}`,
    name: report.name,
    groupId: group.id,
    cycle: report.cycle,
    department: report.owner,
    updatedAt: `2026-04-${String(26 - index).padStart(2, '0')} ${String(9 + index).padStart(2, '0')}:20`,
    status: (index === 0 ? '已发布' : index === 1 ? '待审核' : index === 2 ? '已发布' : '草稿') as '已发布' | '待审核' | '草稿',
    reportId: report.id
  }))
);

function baseMonthSeries(index: number) {
  return [
    { period: '1月', a: 82 + index, b: 74 + index, c: 12 + index },
    { period: '2月', a: 84 + index, b: 76 + index, c: 13 + index },
    { period: '3月', a: 88 + index, b: 80 + index, c: 14 + index },
    { period: '4月', a: 91 + index, b: 83 + index, c: 15 + index },
    { period: '5月', a: 95 + index, b: 86 + index, c: 16 + index },
    { period: '6月', a: 99 + index, b: 90 + index, c: 17 + index }
  ];
}

export function getReportGroup(groupId: ReportGroupId) {
  return reportGroups.find((group) => group.id === groupId);
}

export function getReportItem(groupId: ReportGroupId, reportId: string) {
  return getReportGroup(groupId)?.reports.find((report) => report.id === reportId);
}

export function buildReportDetail(groupId: ReportGroupId, reportId: string): ReportDetail {
  const group = getReportGroup(groupId) || reportGroups[0];
  const report = getReportItem(groupId, reportId) || group.reports[0];
  const index = Math.max(group.reports.findIndex((item) => item.id === report.id), 0);
  const series = baseMonthSeries(index);

  const commonSecondaryData = [
    { name: '南京', value: 28 + index },
    { name: '苏州', value: 24 + index },
    { name: '无锡', value: 18 + index },
    { name: '徐州', value: 15 + index },
    { name: '南通', value: 12 + index }
  ];

  if (groupId === 'overview') {
    return {
      period: report.cycle === '年报' ? '2026年度' : '2026年1月-6月',
      scope: '全省医保综合运行',
      heroTitle: report.name,
      heroSummary: '面向领导层，统览参保、征缴、待遇、基金、机构结算与监管风险运行情况。',
      metrics: [
        { label: '综合运行指数', value: `${95 + index}.2`, sub: '较上期提升 1.6 分' },
        { label: '重点预警事项', value: `${8 + index} 项`, sub: '高风险事项 2 项' },
        { label: '地区达标率', value: `${91 + index}.4%`, sub: '11 个地市保持达标' }
      ],
      primaryChartTitle: '综合运行趋势',
      primaryChartMode: 'line',
      primaryChartData: series.map((item) => ({
        period: item.period,
        参保扩面指数: item.a,
        基金运行指数: item.b,
        风险控制指数: item.c + 70
      })),
      primaryChartKeys: ['参保扩面指数', '基金运行指数', '风险控制指数'],
      secondaryChartTitle: '地市综合得分',
      secondaryChartMode: 'bar',
      secondaryChartData: commonSecondaryData,
      secondaryChartKeys: ['value'],
      tableTitle: '地市综合运行明细',
      tableColumns: [
        { key: 'city', label: '地区' },
        { key: 'insured', label: '参保人数' },
        { key: 'fund', label: '基金结余' },
        { key: 'warning', label: '预警数' },
        { key: 'score', label: '综合得分' }
      ],
      tableRows: [
        { city: '南京', insured: '126.5万', fund: '4.1亿元', warning: '12条', score: '96.4' },
        { city: '苏州', insured: '139.2万', fund: '5.4亿元', warning: '9条', score: '95.8' },
        { city: '无锡', insured: '82.1万', fund: '2.6亿元', warning: '6条', score: '94.6' },
        { city: '徐州', insured: '101.3万', fund: '3.2亿元', warning: '11条', score: '93.7' }
      ],
      insights: [
        '综合运行总体平稳，参保扩面和基金运行保持正向增长。',
        '风险预警集中在高值耗材和重复收费两类问题。',
        '建议领导总报表增加地市排名和异常闭环跟踪。'
      ]
    };
  }

  if (groupId === 'enrollment') {
    return {
      period: '2026年6月',
      scope: '全省参保业务口径',
      heroTitle: report.name,
      heroSummary: '关注参保人数、结构变化、停续保波动和地区覆盖水平。',
      metrics: [
        { label: '参保人数', value: `${842 + index * 4}.6万`, sub: '环比增长 2.4%' },
        { label: '新增参保', value: `${6.2 + index * 0.4}万`, sub: '灵活就业增长明显' },
        { label: '参保覆盖率', value: `${97.1 - index * 0.1}%`, sub: '总体保持高位' }
      ],
      primaryChartTitle: '险种人数变化',
      primaryChartMode: 'bar',
      primaryChartData: series.map((item) => ({
        period: item.period,
        职工医保: 420 + item.a,
        居民医保: 330 + item.b,
        灵活就业: 28 + item.c
      })),
      primaryChartKeys: ['职工医保', '居民医保', '灵活就业'],
      secondaryChartTitle: '地区参保覆盖率',
      secondaryChartMode: 'line',
      secondaryChartData: commonSecondaryData.map((item, idx) => ({
        period: item.name,
        覆盖率: 96.1 + idx * 0.3
      })),
      secondaryChartKeys: ['覆盖率'],
      tableTitle: '参保结构明细',
      tableColumns: [
        { key: 'type', label: '类型' },
        { key: 'count', label: '人数' },
        { key: 'change', label: '环比变化' },
        { key: 'share', label: '占比' }
      ],
      tableRows: [
        { type: '职工医保', count: '452.6万', change: '+1.8%', share: '53.7%' },
        { type: '居民医保', count: '331.4万', change: '+2.1%', share: '39.3%' },
        { type: '灵活就业', count: '39.2万', change: '+5.6%', share: '4.7%' },
        { type: '其他', count: '19.4万', change: '+0.9%', share: '2.3%' }
      ],
      insights: [
        '灵活就业人群是本月新增参保的主要来源。',
        '停保和终止参保主要集中在部分制造业单位。',
        '建议把人员参保结构与征缴情况联动看。'
      ]
    };
  }

  if (groupId === 'collection') {
    return {
      period: report.cycle === '年报' ? '2026年度' : '2026年6月',
      scope: '征缴管理口径',
      heroTitle: report.name,
      heroSummary: '聚焦应缴实缴、欠费单位、基数核定和年度征缴完成率。',
      metrics: [
        { label: '应缴金额', value: `${21.4 + index * 0.5}亿元`, sub: '较上月增长 3.1%' },
        { label: '实缴金额', value: `${19.8 + index * 0.4}亿元`, sub: '到账率 96.4%' },
        { label: '欠费单位', value: `${124 - index * 8}户`, sub: '重点单位已纳入催缴' }
      ],
      primaryChartTitle: '应缴实缴趋势',
      primaryChartMode: 'line',
      primaryChartData: series.map((item) => ({
        period: item.period,
        应缴金额: 18.4 + item.a * 0.03,
        实缴金额: 17.6 + item.b * 0.03,
        欠费单位: 170 - item.c * 3
      })),
      primaryChartKeys: ['应缴金额', '实缴金额', '欠费单位'],
      secondaryChartTitle: '行业欠费分布',
      secondaryChartMode: 'pie',
      secondaryChartData: [
        { name: '建筑业', value: 32 },
        { name: '制造业', value: 26 },
        { name: '服务业', value: 18 },
        { name: '物流运输', value: 14 },
        { name: '其他', value: 10 }
      ],
      secondaryChartKeys: ['value'],
      pieColors: ['#10B981', '#0284C7', '#F59E0B', '#E11D48', '#64748B'],
      tableTitle: '重点欠费单位',
      tableColumns: [
        { key: 'company', label: '单位名称' },
        { key: 'base', label: '核定基数' },
        { key: 'arrears', label: '欠费金额' },
        { key: 'status', label: '催缴状态' }
      ],
      tableRows: [
        { company: '江宁建设集团', base: '2860万元', arrears: '312万元', status: '已催缴' },
        { company: '苏北机电制造', base: '1740万元', arrears: '188万元', status: '已提醒' },
        { company: '扬州城运服务', base: '1320万元', arrears: '126万元', status: '待复核' },
        { company: '盐城华盛材料', base: '980万元', arrears: '92万元', status: '已约谈' }
      ],
      insights: [
        '欠费单位主要集中在建筑业和制造业。',
        '应缴实缴差额较大的单位建议同步推送单位管理条线。',
        '年度征缴完成情况建议增加地市和行业双维度排名。'
      ]
    };
  }

  if (groupId === 'benefit') {
    return {
      period: '2026年6月',
      scope: '待遇支付口径',
      heroTitle: report.name,
      heroSummary: '聚焦门诊、住院、大病、慢特病和异地就医待遇支付规模。',
      metrics: [
        { label: '支付金额', value: `${16.7 + index * 0.9}亿元`, sub: '较上月增长 2.8%' },
        { label: '结算人次', value: `${52 + index * 2}.4万`, sub: '门诊为主要增量' },
        { label: '次均费用', value: `${382 + index * 18}元`, sub: '住院次均费用小幅上升' }
      ],
      primaryChartTitle: '待遇支付趋势',
      primaryChartMode: 'line',
      primaryChartData: series.map((item) => ({
        period: item.period,
        支付金额: 12.4 + item.a * 0.05,
        结算人次: 36 + item.b * 0.2,
        次均费用: 310 + item.c * 6
      })),
      primaryChartKeys: ['支付金额', '结算人次', '次均费用'],
      secondaryChartTitle: '待遇支付结构',
      secondaryChartMode: 'pie',
      secondaryChartData: [
        { name: '住院待遇', value: 58.2 },
        { name: '门诊待遇', value: 24.6 },
        { name: '慢特病', value: 10.4 },
        { name: '异地就医', value: 6.8 }
      ],
      secondaryChartKeys: ['value'],
      pieColors: ['#E11D48', '#0284C7', '#7C3AED', '#059669'],
      tableTitle: '待遇类别明细',
      tableColumns: [
        { key: 'item', label: '待遇类别' },
        { key: 'amount', label: '支付金额' },
        { key: 'times', label: '结算人次' },
        { key: 'ratio', label: '基金支付占比' }
      ],
      tableRows: [
        { item: '普通门诊', amount: '3.42亿元', times: '28.4万', ratio: '61.2%' },
        { item: '住院待遇', amount: '9.74亿元', times: '12.1万', ratio: '72.8%' },
        { item: '慢特病', amount: '1.83亿元', times: '6.7万', ratio: '68.4%' },
        { item: '异地就医', amount: '1.12亿元', times: '5.2万', ratio: '58.1%' }
      ],
      insights: [
        '住院待遇仍是基金支付主体，高费用病例需要穿透分析。',
        '异地就医结算增长较快，应和备案量联动查看。',
        '建议后续补病种和机构双维度下钻。'
      ]
    };
  }

  if (groupId === 'audit') {
    return {
      period: '2026年6月',
      scope: '审核中心业务口径',
      heroTitle: report.name,
      heroSummary: '关注受理量、审核通过率、驳回原因和全流程审核时效。',
      metrics: [
        { label: '受理件数', value: `${18.2 + index}万件`, sub: '日均受理 6,200 件' },
        { label: '审核通过率', value: `${92.4 - index}%`, sub: '终审通过率稳定' },
        { label: '平均时效', value: `${3.6 + index * 0.3}天`, sub: '较上月缩短 0.3 天' }
      ],
      primaryChartTitle: '审核流转情况',
      primaryChartMode: 'bar',
      primaryChartData: series.map((item) => ({
        period: item.period,
        受理件数: 10 + item.a * 0.08,
        通过件数: 9 + item.b * 0.08,
        驳回件数: 1 + item.c * 0.05
      })),
      primaryChartKeys: ['受理件数', '通过件数', '驳回件数'],
      secondaryChartTitle: '环节通过率',
      secondaryChartMode: 'line',
      secondaryChartData: [
        { period: '初审', 通过率: 94.2 },
        { period: '复审', 通过率: 91.4 },
        { period: '终审', 通过率: 96.6 }
      ],
      secondaryChartKeys: ['通过率'],
      tableTitle: '驳回原因分布',
      tableColumns: [
        { key: 'reason', label: '驳回原因' },
        { key: 'count', label: '件数' },
        { key: 'share', label: '占比' },
        { key: 'action', label: '处理建议' }
      ],
      tableRows: [
        { reason: '材料不完整', count: '1,286', share: '32.1%', action: '补件提醒' },
        { reason: '票据不规范', count: '964', share: '24.1%', action: '重新上传' },
        { reason: '不符合待遇政策', count: '812', share: '20.3%', action: '政策解释' },
        { reason: '重复申报', count: '468', share: '11.7%', action: '系统拦截' }
      ],
      insights: [
        '材料不完整仍是主要驳回原因，前置提醒空间较大。',
        '复审节点有积压趋势，需关注地市审核资源配置。',
        '建议增加机构维度时效排名。'
      ]
    };
  }

  if (groupId === 'fund') {
    return {
      period: report.cycle === '季报' ? '2026年第二季度' : '2026年6月',
      scope: '基金财务口径',
      heroTitle: report.name,
      heroSummary: '关注基金收入、支出、结余、预算执行和风险波动情况。',
      metrics: [
        { label: '基金收入', value: `${19.8 + index * 0.5}亿元`, sub: '财政补助到账稳定' },
        { label: '基金支出', value: `${16.7 + index * 0.4}亿元`, sub: '待遇支付支出平稳' },
        { label: '当期结余', value: `${3.1 + index * 0.2}亿元`, sub: '安全区间内运行' }
      ],
      primaryChartTitle: '基金运行趋势',
      primaryChartMode: 'line',
      primaryChartData: series.map((item) => ({
        period: item.period,
        基金收入: 18.2 + item.a * 0.02,
        基金支出: 15.9 + item.b * 0.02,
        当期结余: 2.3 + item.c * 0.05
      })),
      primaryChartKeys: ['基金收入', '基金支出', '当期结余'],
      secondaryChartTitle: '预算执行结构',
      secondaryChartMode: 'bar',
      secondaryChartData: [
        { period: '职工医保', 已执行: 64.2, 预算总额: 128 },
        { period: '居民医保', 已执行: 46.8, 预算总额: 92 },
        { period: '大病保险', 已执行: 8.6, 预算总额: 18 },
        { period: '医疗救助', 已执行: 4.9, 预算总额: 10 }
      ],
      secondaryChartKeys: ['已执行', '预算总额'],
      tableTitle: '基金预算执行明细',
      tableColumns: [
        { key: 'project', label: '预算项目' },
        { key: 'budget', label: '预算金额' },
        { key: 'actual', label: '已执行' },
        { key: 'progress', label: '执行率' }
      ],
      tableRows: [
        { project: '职工医保基金', budget: '128亿元', actual: '64.2亿元', progress: '50.2%' },
        { project: '居民医保基金', budget: '92亿元', actual: '46.8亿元', progress: '50.9%' },
        { project: '大病保险基金', budget: '18亿元', actual: '8.6亿元', progress: '47.8%' },
        { project: '医疗救助基金', budget: '10亿元', actual: '4.9亿元', progress: '49.0%' }
      ],
      insights: [
        '基金预算执行整体均衡，居民医保执行率略高。',
        '局部地区结余下探，需要结合待遇支出和征缴一起观察。',
        '建议新增财政补助到账时效图。'
      ]
    };
  }

  if (groupId === 'institution') {
    return {
      period: '2026年6月',
      scope: '定点机构结算口径',
      heroTitle: report.name,
      heroSummary: '关注机构结算规模、类型结构、时效、拒付和扣款情况。',
      metrics: [
        { label: '结算机构数', value: `${2480 + index * 24}家`, sub: '医院和药店均已纳入' },
        { label: '结算总额', value: `${12.6 + index * 0.6}亿元`, sub: '同比增长 7.2%' },
        { label: '平均结算时长', value: `${4.2 - index * 0.2}天`, sub: '时效持续改善' }
      ],
      primaryChartTitle: '机构结算规模',
      primaryChartMode: 'bar',
      primaryChartData: commonSecondaryData.map((item, idx) => ({
        period: item.name,
        结算金额: 2.6 + idx * 0.8,
        拒付金额: 0.18 + idx * 0.04
      })),
      primaryChartKeys: ['结算金额', '拒付金额'],
      secondaryChartTitle: '机构类型结构',
      secondaryChartMode: 'pie',
      secondaryChartData: [
        { name: '三级医院', value: 38 },
        { name: '二级医院', value: 26 },
        { name: '基层机构', value: 18 },
        { name: '定点药店', value: 18 }
      ],
      secondaryChartKeys: ['value'],
      pieColors: ['#4F46E5', '#0891B2', '#10B981', '#F59E0B'],
      tableTitle: '重点机构结算明细',
      tableColumns: [
        { key: 'name', label: '机构名称' },
        { key: 'type', label: '机构类型' },
        { key: 'amount', label: '结算金额' },
        { key: 'days', label: '结算时长' }
      ],
      tableRows: [
        { name: '南京市第一医院', type: '三级医院', amount: '8,620万元', days: '3.2天' },
        { name: '苏州市中心医院', type: '三级医院', amount: '7,910万元', days: '3.8天' },
        { name: '无锡市人民医院', type: '三级医院', amount: '6,880万元', days: '4.1天' },
        { name: '连锁医保药房A', type: '定点药店', amount: '2,120万元', days: '2.6天' }
      ],
      insights: [
        '三级医院仍占结算主体，但药店结算增长较快。',
        '个别地市结算时长偏高，需要跟踪积压原因。',
        '拒付扣款建议增加问题类型明细和责任科室。'
      ]
    };
  }

  if (groupId === 'supervision') {
    return {
      period: report.cycle === '日报' ? '2026-04-26' : '2026年6月',
      scope: '基金监管口径',
      heroTitle: report.name,
      heroSummary: '关注规则命中、违规机构、飞检结果和追回基金闭环。',
      metrics: [
        { label: '预警条数', value: `${128 + index * 12}条`, sub: '高风险 18 条' },
        { label: '飞检机构', value: `${24 + index * 2}家`, sub: '问题机构 7 家' },
        { label: '追回基金', value: `${0.86 + index * 0.16}亿元`, sub: '闭环率 82.4%' }
      ],
      primaryChartTitle: '风险问题分布',
      primaryChartMode: 'bar',
      primaryChartData: [
        { period: '串换项目', count: 36 + index * 2 },
        { period: '重复收费', count: 29 + index * 2 },
        { period: '超限定支付', count: 22 + index },
        { period: '异常住院', count: 18 + index },
        { period: '高值耗材异常', count: 14 + index }
      ],
      primaryChartKeys: ['count'],
      secondaryChartTitle: '预警来源结构',
      secondaryChartMode: 'pie',
      secondaryChartData: [
        { name: '规则命中', value: 52 },
        { name: '飞检发现', value: 22 },
        { name: '举报投诉', value: 14 },
        { name: '人工复核', value: 12 }
      ],
      secondaryChartKeys: ['value'],
      pieColors: ['#DC2626', '#F59E0B', '#0284C7', '#64748B'],
      tableTitle: '重点监管对象',
      tableColumns: [
        { key: 'org', label: '机构名称' },
        { key: 'issue', label: '主要问题' },
        { key: 'amount', label: '涉及金额' },
        { key: 'status', label: '整改状态' }
      ],
      tableRows: [
        { org: '某专科医院', issue: '重复收费', amount: '82万元', status: '已立案' },
        { org: '某民营医院', issue: '串换项目', amount: '64万元', status: '整改中' },
        { org: '某连锁药房', issue: '超限定支付', amount: '28万元', status: '已追回' },
        { org: '某社区机构', issue: '异常住院', amount: '19万元', status: '待复核' }
      ],
      insights: [
        '重复收费和串换项目仍是最主要风险。',
        '飞检和规则命中结果一致度较高，模型较稳定。',
        '建议补充案件闭环时长分析。'
      ]
    };
  }

  if (groupId === 'medical') {
    return {
      period: '2026年6月',
      scope: '医药服务管理口径',
      heroTitle: report.name,
      heroSummary: '关注药品目录执行、耗材使用、项目使用和价格波动。',
      metrics: [
        { label: '目录执行率', value: `${93.6 - index * 0.6}%`, sub: '总体执行稳定' },
        { label: '重点药品监测数', value: `${186 + index * 8}个`, sub: '集采药品重点跟踪' },
        { label: '价格异常项目', value: `${16 + index * 2}项`, sub: '已推送复核' }
      ],
      primaryChartTitle: '医药服务执行情况',
      primaryChartMode: 'line',
      primaryChartData: series.map((item) => ({
        period: item.period,
        目录执行率: 90.2 + item.a * 0.04,
        集采执行率: 88.4 + item.b * 0.05,
        价格异常数: 26 - item.c
      })),
      primaryChartKeys: ['目录执行率', '集采执行率', '价格异常数'],
      secondaryChartTitle: '目录执行结构',
      secondaryChartMode: 'bar',
      secondaryChartData: [
        { period: '药品', 执行率: 94.2 },
        { period: '耗材', 执行率: 91.7 },
        { period: '诊疗项目', 执行率: 89.8 },
        { period: '价格项目', 执行率: 92.1 }
      ],
      secondaryChartKeys: ['执行率'],
      tableTitle: '重点医药项目',
      tableColumns: [
        { key: 'item', label: '项目名称' },
        { key: 'type', label: '类别' },
        { key: 'usage', label: '使用量' },
        { key: 'remark', label: '监测结论' }
      ],
      tableRows: [
        { item: '集采药品A', type: '药品', usage: '12.4万盒', remark: '执行正常' },
        { item: '高值耗材B', type: '耗材', usage: '8,620件', remark: '部分机构偏高' },
        { item: '诊疗项目C', type: '项目', usage: '4.8万人次', remark: '价格波动待复核' },
        { item: '服务项目D', type: '项目', usage: '3.2万人次', remark: '执行稳定' }
      ],
      insights: [
        '集采执行率稳定提升，但高值耗材仍需重点盯防。',
        '价格异常项目数下降，说明整改初见成效。',
        '建议药品、耗材、诊疗项目继续拆细页。'
      ]
    };
  }

  return {
    period: report.cycle === '年报' ? '2026年度' : '2026年6月',
    scope: '综合专题分析口径',
    heroTitle: report.name,
    heroSummary: '专题分析页面用于沉淀重点问题、重点病种、重点人群和年度评估结论。',
    metrics: [
      { label: '专题样本量', value: `${42 + index * 6}万`, sub: '覆盖重点人群和病种' },
      { label: '专题费用规模', value: `${6.8 + index * 0.8}亿元`, sub: '年度累计持续增长' },
      { label: '重点发现', value: `${12 + index}项`, sub: '已形成建议清单' }
    ],
    primaryChartTitle: '专题分析趋势',
    primaryChartMode: 'line',
    primaryChartData: series.map((item) => ({
      period: item.period,
      样本量: 28 + item.a * 0.2,
      支付金额: 5.2 + item.b * 0.04,
      风险人群: 8 + item.c * 0.4
    })),
    primaryChartKeys: ['样本量', '支付金额', '风险人群'],
    secondaryChartTitle: '专题对象结构',
    secondaryChartMode: 'pie',
    secondaryChartData: [
      { name: '慢特病', value: 34 },
      { name: '重点人群', value: 26 },
      { name: 'DRG/DIP', value: 22 },
      { name: '年度评估', value: 18 }
    ],
    secondaryChartKeys: ['value'],
    pieColors: ['#7C3AED', '#0284C7', '#10B981', '#F59E0B'],
    tableTitle: '专题结论摘录',
    tableColumns: [
      { key: 'topic', label: '分析主题' },
      { key: 'finding', label: '核心发现' },
      { key: 'impact', label: '影响范围' },
      { key: 'suggestion', label: '建议方向' }
    ],
    tableRows: [
      { topic: '慢特病保障', finding: '高频复诊人群费用增速快', impact: '全省', suggestion: '优化慢病随访管理' },
      { topic: 'DRG/DIP 改革', finding: '部分机构病组偏差明显', impact: '重点医院', suggestion: '加强病组复核' },
      { topic: '重点人群保障', finding: '高龄群体门诊需求提升', impact: '老年群体', suggestion: '完善门诊保障政策' },
      { topic: '年度评估', finding: '地区间基金压力分化', impact: '部分地市', suggestion: '加强预算调度' }
    ],
    insights: [
      '专题分析要服务政策调整，不只是展示数据。',
      '每个专题都应保留结论、问题和行动建议三块。',
      '后续可继续扩展为可下载的专题报告界面。'
    ]
  };
}
