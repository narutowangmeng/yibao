import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  Banknote,
  ClipboardCheck,
  FileCheck2,
  FileInput,
  Landmark,
  ShieldAlert,
} from 'lucide-react';

export interface ClaimsMetric {
  label: string;
  value: string;
  trend: string;
}

export interface ClaimsStageConfig {
  id: string;
  title: string;
  shortTitle: string;
  path: string;
  icon: LucideIcon;
  accent: string;
  summary: string;
  focus: string;
  metrics: ClaimsMetric[];
}

export interface CrudField {
  key: string;
  label: string;
  type?: 'text' | 'select' | 'date' | 'number';
  options?: string[];
}

export interface ClaimsRecord {
  id: string;
  applicant: string;
  institution: string;
  amount: string;
  status: string;
  risk: string;
  [key: string]: string;
}

export const claimsStages: ClaimsStageConfig[] = [
  {
    id: 'intake',
    title: '申报受理',
    shortTitle: '受理',
    path: '/workbench/claims/intake',
    icon: FileInput,
    accent: 'from-blue-500 to-blue-600',
    summary: '统一接收门诊、住院、异地就医等申报材料，完成登记、校验和分派。',
    focus: '材料齐全性、身份有效性、就医凭证一致性。',
    metrics: [
      { label: '待受理件', value: '286', trend: '较昨日 +18' },
      { label: '当日收件', value: '124', trend: '线上占比 68%' },
      { label: '超时预警', value: '17', trend: '需优先处理' },
    ],
  },
  {
    id: 'manual-review',
    title: '人工审核',
    shortTitle: '人工审核',
    path: '/workbench/claims/manual-review',
    icon: ClipboardCheck,
    accent: 'from-cyan-500 to-cyan-600',
    summary: '对高风险案件、规则命中案件和重点案件进行人工复核与结论确认。',
    focus: '疑点费用、目录外项目、重复报销、病历逻辑冲突。',
    metrics: [
      { label: '待审核件', value: '94', trend: '高风险 21 件' },
      { label: '平均时长', value: '18 分钟', trend: '较上周 -3 分钟' },
      { label: '退回补件', value: '12', trend: '补件率 12.8%' },
    ],
  },
  {
    id: 'settlement-review',
    title: '结算审核',
    shortTitle: '结算审核',
    path: '/workbench/claims/settlement-review',
    icon: FileCheck2,
    accent: 'from-emerald-500 to-emerald-600',
    summary: '按机构、周期和批次核对结算清单，确认应支付金额、拒付金额和调整项。',
    focus: '批次差异、基金支付限额、跨月回退、补差逻辑。',
    metrics: [
      { label: '待结算批次', value: '36', trend: '跨月 9 批' },
      { label: '待确认金额', value: '¥ 1280 万', trend: '本周峰值' },
      { label: '差异批次', value: '7', trend: '需人工复核' },
    ],
  },
  {
    id: 'payment-orders',
    title: '支付指令',
    shortTitle: '支付',
    path: '/workbench/claims/payment-orders',
    icon: Banknote,
    accent: 'from-amber-500 to-amber-600',
    summary: '对已通过结算审核的批次生成支付指令，推送财务拨付和回盘跟踪。',
    focus: '批量生成、到账确认、失败回退、补发控制。',
    metrics: [
      { label: '待下发指令', value: '18', trend: '金额 ¥ 642 万' },
      { label: '已下发成功', value: '73', trend: '成功率 98.4%' },
      { label: '失败回盘', value: '3', trend: '需重新发起' },
    ],
  },
  {
    id: 'reconciliation',
    title: '机构对账',
    shortTitle: '对账',
    path: '/workbench/claims/reconciliation',
    icon: Landmark,
    accent: 'from-purple-500 to-purple-600',
    summary: '对医疗机构申报清单、医保结算清单、财务拨付结果开展账账一致性核对。',
    focus: '批次差额、退费冲回、重复拨付、机构申诉。',
    metrics: [
      { label: '待对账机构', value: '29', trend: '三级机构 11 家' },
      { label: '已发现差异', value: '41', trend: '金额 ¥ 83.6 万' },
      { label: '已完成销账', value: '117', trend: '完成率 80%' },
    ],
  },
  {
    id: 'exceptions',
    title: '异常处理',
    shortTitle: '异常',
    path: '/workbench/claims/exceptions',
    icon: AlertTriangle,
    accent: 'from-rose-500 to-red-600',
    summary: '统一承接受理、审核、结算、支付、对账环节产生的异常任务和处置闭环。',
    focus: '退件、挂账、规则冲突、支付失败、申诉复核。',
    metrics: [
      { label: '异常待办', value: '58', trend: '紧急 8 件' },
      { label: '超时异常', value: '13', trend: '需升级处理' },
      { label: '已闭环', value: '209', trend: '闭环率 87%' },
    ],
  },
];

export const claimsOverviewMetrics = [
  { label: '理赔在途案件', value: '631', description: '覆盖申报、审核、结算、支付全链路' },
  { label: '本月结算金额', value: '¥ 3820 万', description: '较上月增长 6.8%' },
  { label: '规则命中案件', value: '129', description: '自动转人工审核与异常池' },
  { label: '机构对账完成率', value: '80%', description: '当前周期已完成 117/146 家' },
];

export const claimsControlPoints = [
  { title: '身份资格校验', detail: '参保状态、待遇状态、异地备案状态联动核验。', icon: ShieldAlert },
  { title: '目录规则校验', detail: '药品、耗材、诊疗项目目录及限制条件自动核查。', icon: FileCheck2 },
  { title: '基金支付闭环', detail: '从审核通过到支付到账、对账销账形成完整追踪。', icon: Landmark },
];
