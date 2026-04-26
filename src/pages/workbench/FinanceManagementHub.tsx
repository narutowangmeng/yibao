import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  Scale,
  AlertTriangle,
  Send,
  BookOpen,
  FileText,
  ArrowRight,
  Eye,
  Download,
  X,
  Search,
  CheckCircle2,
  PlayCircle,
  ClipboardCheck,
  FilePlus2
} from 'lucide-react';

type ModuleId = 'arrival' | 'reconcile' | 'difference' | 'payment' | 'ledger' | 'report';
type ButtonTone = 'primary' | 'secondary';

interface FinanceModule {
  id: ModuleId;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

interface ActionButton {
  label: string;
  action: string;
  tone?: ButtonTone;
}

interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  align?: 'left' | 'right' | 'center';
  render?: (row: T) => React.ReactNode;
}

interface BaseRow {
  id: string;
}

interface SectionConfig<T extends BaseRow> {
  key: string;
  label: string;
  title: string;
  subtitle: string;
  toolbar: ActionButton[];
  columns: Array<TableColumn<T>>;
  data: T[];
  rowActions: (row: T) => ActionButton[];
}

interface ArrivalItem extends BaseRow {
  payer: string;
  type: string;
  amount: string;
  channel: string;
  receiveDate: string;
  status: string;
}

interface ReconcileItem extends BaseRow {
  batchNo: string;
  scope: string;
  source: string;
  target: string;
  result: string;
  completedAt: string;
}

interface DifferenceItem extends BaseRow {
  diffType: string;
  batchNo: string;
  involvedUnit: string;
  diffAmount: string;
  handler: string;
  status: string;
}

interface PaymentItem extends BaseRow {
  batchNo: string;
  object: string;
  amount: string;
  bank: string;
  reviewStatus: string;
  payDate: string;
}

interface LedgerItem extends BaseRow {
  subjectCode: string;
  subjectName: string;
  ledgerType: string;
  currentDebit: string;
  currentCredit: string;
  balance: string;
}

interface ReportItem extends BaseRow {
  reportName: string;
  cycle: string;
  scope: string;
  generatedAt: string;
  status: string;
}

interface PendingAction {
  title: string;
  target: string;
  confirmLabel: string;
}

const overviewStats = [
  { label: '本月基金收入', value: '12.68亿元' },
  { label: '本月基金支出', value: '11.94亿元' },
  { label: '清算在途金额', value: '2,348.62万元' },
  { label: '财务风险提示', value: '5项' }
];

const financeModules: FinanceModule[] = [
  { id: 'arrival', title: '到账确认', icon: Landmark, color: 'from-emerald-500 to-emerald-600', description: '处理银行回单、税务到账和财政补助到账确认' },
  { id: 'reconcile', title: '对账中心', icon: Scale, color: 'from-cyan-500 to-cyan-600', description: '统一管理征缴台账、银行流水和清算专户对账' },
  { id: 'difference', title: '差异处理', icon: AlertTriangle, color: 'from-rose-500 to-rose-600', description: '登记、核查和办结到账差异、挂账和重复入账问题' },
  { id: 'payment', title: '拨付管理', icon: Send, color: 'from-blue-500 to-blue-600', description: '覆盖拨付申请、复核审批、回盘确认和退回重提' },
  { id: 'ledger', title: '基金账务', icon: BookOpen, color: 'from-amber-500 to-amber-600', description: '按基金科目、往来科目和挂账科目进行账务管理' },
  { id: 'report', title: '财务报表', icon: FileText, color: 'from-violet-500 to-violet-600', description: '生成基金收支、拨付进度、差异处理等专题报表' }
];

const arrivalColumns: Array<TableColumn<ArrivalItem>> = [
  { key: 'id', title: '到账流水号' },
  { key: 'payer', title: '缴费主体/拨付来源' },
  { key: 'type', title: '业务类型' },
  { key: 'amount', title: '到账金额', align: 'right' },
  { key: 'channel', title: '到账渠道' },
  { key: 'receiveDate', title: '到账时间' },
  { key: 'status', title: '状态', render: (row) => statusBadge(row.status) }
];

const reconcileColumns: Array<TableColumn<ReconcileItem>> = [
  { key: 'batchNo', title: '批次号' },
  { key: 'scope', title: '对账范围' },
  { key: 'source', title: '源数据' },
  { key: 'target', title: '目标数据' },
  { key: 'result', title: '对账结果', render: (row) => statusBadge(row.result) },
  { key: 'completedAt', title: '完成时间' }
];

const differenceColumns: Array<TableColumn<DifferenceItem>> = [
  { key: 'id', title: '差异编号' },
  { key: 'diffType', title: '差异类型' },
  { key: 'batchNo', title: '关联批次' },
  { key: 'involvedUnit', title: '涉及机构' },
  { key: 'diffAmount', title: '差异金额', align: 'right' },
  { key: 'handler', title: '当前经办人' },
  { key: 'status', title: '办理状态', render: (row) => statusBadge(row.status) }
];

const paymentColumns: Array<TableColumn<PaymentItem>> = [
  { key: 'batchNo', title: '拨付批次号' },
  { key: 'object', title: '拨付对象' },
  { key: 'amount', title: '拨付金额', align: 'right' },
  { key: 'bank', title: '开户银行' },
  { key: 'reviewStatus', title: '审核状态', render: (row) => statusBadge(row.reviewStatus) },
  { key: 'payDate', title: '计划日期' }
];

const ledgerColumns: Array<TableColumn<LedgerItem>> = [
  { key: 'subjectCode', title: '科目编码' },
  { key: 'subjectName', title: '科目名称' },
  { key: 'ledgerType', title: '账务类型' },
  { key: 'currentDebit', title: '本日借方', align: 'right' },
  { key: 'currentCredit', title: '本日贷方', align: 'right' },
  { key: 'balance', title: '当前余额', align: 'right' }
];

const reportColumns: Array<TableColumn<ReportItem>> = [
  { key: 'reportName', title: '报表名称' },
  { key: 'cycle', title: '报表周期' },
  { key: 'scope', title: '统计范围' },
  { key: 'generatedAt', title: '生成时间' },
  { key: 'status', title: '状态', render: (row) => statusBadge(row.status) }
];

const moduleSections: Record<ModuleId, { title: string; desc: string; sections: Array<SectionConfig<any>> }> = {
  arrival: {
    title: '到账确认',
    desc: '围绕银行回单、税务到账、财政补助划拨进行确认与留痕。',
    sections: [
      {
        key: 'bank',
        label: '银行到账确认',
        title: '银行到账确认',
        subtitle: '核对银行回单与医保征缴到账信息。',
        toolbar: [
          { label: '批量确认', tone: 'primary', action: '批量确认到账' },
          { label: '导入回单', action: '导入银行回单' }
        ],
        columns: arrivalColumns,
        data: [
          { id: 'DZ20260426001', payer: '南京华宁科技有限公司', type: '职工医保单位缴费', amount: '84.26万元', channel: '工商银行江苏省分行', receiveDate: '2026-04-26 09:18', status: '已确认' },
          { id: 'DZ20260426002', payer: '苏州恒川精密制造有限公司', type: '职工医保单位缴费', amount: '126.38万元', channel: '农业银行苏州分行', receiveDate: '2026-04-26 09:42', status: '已确认' },
          { id: 'DZ20260426003', payer: '无锡瑞康药业连锁有限公司', type: '生育保险缴费', amount: '18.42万元', channel: '建设银行无锡分行', receiveDate: '2026-04-26 10:05', status: '待确认' }
        ],
        rowActions: (row: ArrivalItem) => [
          { label: '查看', action: `查看到账流水 ${row.id}` },
          { label: '确认到账', tone: 'primary', action: `确认到账 ${row.id}` }
        ]
      },
      {
        key: 'tax',
        label: '税务到账确认',
        title: '税务到账确认',
        subtitle: '核对税务共享平台与系统到账信息。',
        toolbar: [
          { label: '发起同步', tone: 'primary', action: '同步税务到账数据' },
          { label: '导出待确认', action: '导出待确认清单' }
        ],
        columns: arrivalColumns,
        data: [
          { id: 'SW20260426001', payer: '徐州泉山人力资源服务中心', type: '灵活就业医保缴费', amount: '42.87万元', channel: '税务联网平台', receiveDate: '2026-04-26 10:26', status: '已确认' },
          { id: 'SW20260426002', payer: '扬州市广陵区医保中心', type: '城乡居民医保缴费', amount: '35.16万元', channel: '税务共享平台', receiveDate: '2026-04-26 10:56', status: '待确认' },
          { id: 'SW20260426003', payer: '镇江市京口区医保中心', type: '居民医保批量缴费', amount: '28.43万元', channel: '税务共享平台', receiveDate: '2026-04-26 11:18', status: '已确认' }
        ],
        rowActions: (row: ArrivalItem) => [
          { label: '查看', action: `查看税务到账 ${row.id}` },
          { label: '确认到账', tone: 'primary', action: `确认税务到账 ${row.id}` }
        ]
      },
      {
        key: 'fiscal',
        label: '财政补助到账',
        title: '财政补助到账',
        subtitle: '跟踪财政补助划拨到账及确认情况。',
        toolbar: [
          { label: '登记到账', tone: 'primary', action: '登记财政补助到账' },
          { label: '发起协查', action: '发起财政补助协查' }
        ],
        columns: arrivalColumns,
        data: [
          { id: 'CZ20260426001', payer: '南通市医保中心', type: '财政补助划拨', amount: '235.00万元', channel: '人民银行国库', receiveDate: '2026-04-26 10:48', status: '异常待核' },
          { id: 'CZ20260426002', payer: '宿迁市医保局', type: '困难人员资助参保补助', amount: '62.40万元', channel: '财政一体化平台', receiveDate: '2026-04-26 11:05', status: '已确认' },
          { id: 'CZ20260426003', payer: '连云港市医保局', type: '居民医保财政补助', amount: '88.16万元', channel: '财政一体化平台', receiveDate: '2026-04-26 11:40', status: '已确认' }
        ],
        rowActions: (row: ArrivalItem) => [
          { label: '查看', action: `查看财政到账 ${row.id}` },
          { label: '发起核查', tone: 'primary', action: `发起核查 ${row.id}` }
        ]
      },
      {
        key: 'trace',
        label: '到账回单留痕',
        title: '到账回单留痕',
        subtitle: '查看回单归档、异常留痕与处理记录。',
        toolbar: [
          { label: '补录留痕', tone: 'primary', action: '补录回单留痕' },
          { label: '导出归档', action: '导出回单归档记录' }
        ],
        columns: arrivalColumns,
        data: [
          { id: 'LY20260426001', payer: '苏州恒川精密制造有限公司', type: '回单留痕已归档', amount: '126.38万元', channel: '农业银行苏州分行', receiveDate: '2026-04-26 09:42', status: '已确认' },
          { id: 'LY20260426002', payer: '南通市医保中心', type: '异常回单待补正', amount: '235.00万元', channel: '人民银行国库', receiveDate: '2026-04-26 10:48', status: '异常待核' },
          { id: 'LY20260426003', payer: '扬州市广陵区医保中心', type: '电子回单已留存', amount: '35.16万元', channel: '税务共享平台', receiveDate: '2026-04-26 10:56', status: '待确认' }
        ],
        rowActions: (row: ArrivalItem) => [
          { label: '查看', action: `查看回单留痕 ${row.id}` },
          { label: '补录', tone: 'primary', action: `补录回单 ${row.id}` }
        ]
      }
    ]
  },
  reconcile: {
    title: '对账中心',
    desc: '统一管理医保征缴、银行流水、税务平台和清算专户之间的批次对账。',
    sections: [
      {
        key: 'daily',
        label: '日对账批次',
        title: '日对账批次',
        subtitle: '查看当日对账批次和结果。',
        toolbar: [
          { label: '发起日对账', tone: 'primary', action: '发起日对账' },
          { label: '下载模板', action: '下载对账模板' }
        ],
        columns: reconcileColumns,
        data: [
          { id: '1', batchNo: 'DZP20260426-01', scope: '南京市职工医保收入', source: '医保征缴台账', target: '工商银行回单', result: '对平', completedAt: '2026-04-26 10:16' },
          { id: '2', batchNo: 'DZP20260426-02', scope: '苏州市居民医保收入', source: '税务共享平台', target: '税务到账流水', result: '对平', completedAt: '2026-04-26 10:28' },
          { id: '3', batchNo: 'DZP20260426-04', scope: '淮安市灵活就业缴费', source: '医保征缴台账', target: '建设银行回单', result: '待复核', completedAt: '2026-04-26 11:05' }
        ],
        rowActions: (row: ReconcileItem) => [
          { label: '查看', action: `查看对账批次 ${row.batchNo}` },
          { label: '重新执行', tone: 'primary', action: `重新执行对账 ${row.batchNo}` }
        ]
      },
      {
        key: 'monthly',
        label: '月度对账',
        title: '月度对账',
        subtitle: '查看月度汇总对账批次。',
        toolbar: [
          { label: '发起月对账', tone: 'primary', action: '发起月度对账' },
          { label: '导出汇总', action: '导出月度对账汇总' }
        ],
        columns: reconcileColumns,
        data: [
          { id: '4', batchNo: 'YDZ202604-01', scope: '全省居民医保月度汇总', source: '月度征缴汇总表', target: '银行月结单', result: '对平', completedAt: '2026-04-25 17:32' },
          { id: '5', batchNo: 'YDZ202604-02', scope: '全省财政补助月度汇总', source: '基金收入台账', target: '国库月报', result: '存在差异', completedAt: '2026-04-25 18:10' },
          { id: '6', batchNo: 'YDZ202604-03', scope: '泰州市灵活就业月度汇总', source: '医保征缴月报', target: '银行月结单', result: '待复核', completedAt: '2026-04-25 18:36' }
        ],
        rowActions: (row: ReconcileItem) => [
          { label: '查看', action: `查看月对账 ${row.batchNo}` },
          { label: '差异转办', tone: 'primary', action: `差异转办 ${row.batchNo}` }
        ]
      },
      {
        key: 'special',
        label: '专项复核',
        title: '专项复核',
        subtitle: '专项资金与清算回款复核情况。',
        toolbar: [
          { label: '发起专项复核', tone: 'primary', action: '发起专项复核' },
          { label: '查看规则', action: '查看专项复核规则' }
        ],
        columns: reconcileColumns,
        data: [
          { id: '7', batchNo: 'ZX202604-01', scope: '全省异地就医清算回款', source: '省级清算平台', target: '清算专户流水', result: '对平', completedAt: '2026-04-26 11:18' },
          { id: '8', batchNo: 'ZX202604-02', scope: '双通道药店拨付回盘', source: '拨付台账', target: '回盘结果文件', result: '存在差异', completedAt: '2026-04-26 11:52' },
          { id: '9', batchNo: 'ZX202604-03', scope: '门慢专项资金核对', source: '专项基金台账', target: '财政拨付流水', result: '对平', completedAt: '2026-04-26 12:16' }
        ],
        rowActions: (row: ReconcileItem) => [
          { label: '查看', action: `查看专项批次 ${row.batchNo}` },
          { label: '提交复核', tone: 'primary', action: `提交复核 ${row.batchNo}` }
        ]
      }
    ]
  },
  difference: {
    title: '差异处理',
    desc: '承接未对平、重复入账、挂账等问题，形成差异登记、核查、冲销和办结台账。',
    sections: [
      {
        key: 'register',
        label: '差异登记',
        title: '差异登记',
        subtitle: '登记新发生的到账和对账差异。',
        toolbar: [
          { label: '登记差异', tone: 'primary', action: '新增差异登记' },
          { label: '批量导入', action: '批量导入差异' }
        ],
        columns: differenceColumns,
        data: [
          { id: 'CY20260426001', diffType: '到账金额不一致', batchNo: 'DZP20260426-03', involvedUnit: '南通市医保中心', diffAmount: '12.00万元', handler: '许文博', status: '处理中' },
          { id: 'CY20260426002', diffType: '银行回单缺参保单位编码', batchNo: 'DZP20260426-04', involvedUnit: '淮安清江浦医保中心', diffAmount: '3.26万元', handler: '陆雨桐', status: '待补录' },
          { id: 'CY20260426003', diffType: '重复入账', batchNo: 'DZP20260425-11', involvedUnit: '苏州市医保中心', diffAmount: '5.60万元', handler: '韩嘉铭', status: '待冲回' }
        ],
        rowActions: (row: DifferenceItem) => [
          { label: '查看', action: `查看差异 ${row.id}` },
          { label: '受理', tone: 'primary', action: `受理差异 ${row.id}` }
        ]
      },
      {
        key: 'check',
        label: '核查协办',
        title: '核查协办',
        subtitle: '跨机构协查和异常核实记录。',
        toolbar: [
          { label: '发起协查', tone: 'primary', action: '发起协查任务' },
          { label: '催办协查', action: '催办协查事项' }
        ],
        columns: differenceColumns,
        data: [
          { id: 'HC20260426001', diffType: '财政补助未到账', batchNo: 'DZP20260425-08', involvedUnit: '宿迁市医保中心', diffAmount: '18.00万元', handler: '陈知夏', status: '协查中' },
          { id: 'HC20260426002', diffType: '清算回款挂账', batchNo: 'DZP20260424-19', involvedUnit: '省级异地结算专户', diffAmount: '9.88万元', handler: '赵景澄', status: '已办结' },
          { id: 'HC20260426003', diffType: '税务回传失败', batchNo: 'YDZ202604-05', involvedUnit: '盐城市医保中心', diffAmount: '2.14万元', handler: '程书意', status: '处理中' }
        ],
        rowActions: (row: DifferenceItem) => [
          { label: '查看', action: `查看协查单 ${row.id}` },
          { label: '办结', tone: 'primary', action: `办结协查 ${row.id}` }
        ]
      },
      {
        key: 'adjust',
        label: '冲销调整',
        title: '冲销调整',
        subtitle: '查看冲销、补记和账务调整处理。',
        toolbar: [
          { label: '新增调整', tone: 'primary', action: '新增账务调整' },
          { label: '导出调整单', action: '导出调整记录' }
        ],
        columns: differenceColumns,
        data: [
          { id: 'TZ20260426001', diffType: '重复入账冲销', batchNo: 'DZP20260421-03', involvedUnit: '无锡市医保中心', diffAmount: '4.50万元', handler: '顾明舟', status: '已办结' },
          { id: 'TZ20260426002', diffType: '挂账转正式入账', batchNo: 'DZP20260422-09', involvedUnit: '常州市医保中心', diffAmount: '7.22万元', handler: '俞安然', status: '处理中' },
          { id: 'TZ20260426003', diffType: '手工补记差额', batchNo: 'DZP20260423-07', involvedUnit: '镇江市医保中心', diffAmount: '1.86万元', handler: '周以宁', status: '待补录' }
        ],
        rowActions: (row: DifferenceItem) => [
          { label: '查看', action: `查看调整单 ${row.id}` },
          { label: '提交调整', tone: 'primary', action: `提交调整 ${row.id}` }
        ]
      }
    ]
  },
  payment: {
    title: '拨付管理',
    desc: '覆盖拨付申请、复核审批、批量拨付、回盘确认和退回重提等经办流程。',
    sections: [
      {
        key: 'batch',
        label: '拨付批次',
        title: '拨付批次',
        subtitle: '查看基金拨付批次和计划日期。',
        toolbar: [
          { label: '新建拨付批次', tone: 'primary', action: '新建拨付批次' },
          { label: '批量提交拨付', action: '批量提交拨付' }
        ],
        columns: paymentColumns,
        data: [
          { id: 'BF20260426001', batchNo: 'PF-NJ-20260426-01', object: '南京市第一医院住院结算拨付', amount: '1,286.00万元', bank: '交通银行南京鼓楼支行', reviewStatus: '复核通过', payDate: '2026-04-26' },
          { id: 'BF20260426002', batchNo: 'PF-SZ-20260426-02', object: '苏州大学附属第一医院门诊统筹拨付', amount: '986.45万元', bank: '中国银行苏州分行', reviewStatus: '待拨付', payDate: '2026-04-26' },
          { id: 'BF20260426003', batchNo: 'PF-NT-20260426-03', object: '南通市双通道药店月度拨付', amount: '268.22万元', bank: '建设银行南通分行', reviewStatus: '待复核', payDate: '2026-04-27' }
        ],
        rowActions: (row: PaymentItem) => [
          { label: '查看', action: `查看拨付批次 ${row.batchNo}` },
          { label: '提交拨付', tone: 'primary', action: `提交拨付 ${row.batchNo}` }
        ]
      },
      {
        key: 'review',
        label: '双人复核',
        title: '双人复核',
        subtitle: '大额拨付批次复核情况。',
        toolbar: [
          { label: '发起复核', tone: 'primary', action: '发起双人复核' },
          { label: '复核规则', action: '查看复核规则' }
        ],
        columns: paymentColumns,
        data: [
          { id: 'FH20260426001', batchNo: 'FH-NJ-20260426-01', object: '南京鼓楼医院门诊统筹复核', amount: '368.20万元', bank: '工商银行南京分行', reviewStatus: '待复核', payDate: '2026-04-26' },
          { id: 'FH20260426002', batchNo: 'FH-SQ-20260426-02', object: '宿迁市人民医院住院复核', amount: '226.50万元', bank: '农业银行宿迁分行', reviewStatus: '复核通过', payDate: '2026-04-26' },
          { id: 'FH20260426003', batchNo: 'FH-YZ-20260426-03', object: '扬州双通道药店复核', amount: '82.16万元', bank: '中国银行扬州分行', reviewStatus: '待复核', payDate: '2026-04-27' }
        ],
        rowActions: (row: PaymentItem) => [
          { label: '查看', action: `查看复核批次 ${row.batchNo}` },
          { label: '通过复核', tone: 'primary', action: `通过复核 ${row.batchNo}` }
        ]
      },
      {
        key: 'return',
        label: '退回重提',
        title: '退回重提',
        subtitle: '退回重提批次和整改情况。',
        toolbar: [
          { label: '批量退回', tone: 'primary', action: '批量退回重提' },
          { label: '导出退回清单', action: '导出退回清单' }
        ],
        columns: paymentColumns,
        data: [
          { id: 'TH20260426001', batchNo: 'TH-YC-20260426-01', object: '盐城市异地就医即时结算拨付', amount: '173.64万元', bank: '工商银行盐城分行', reviewStatus: '退回重提', payDate: '2026-04-25' },
          { id: 'TH20260426002', batchNo: 'TH-LYG-20260426-02', object: '连云港市门慢拨付', amount: '96.20万元', bank: '建设银行连云港分行', reviewStatus: '退回重提', payDate: '2026-04-25' },
          { id: 'TH20260426003', batchNo: 'TH-TZ-20260426-03', object: '泰州市药店月度拨付', amount: '58.46万元', bank: '交通银行泰州分行', reviewStatus: '退回重提', payDate: '2026-04-24' }
        ],
        rowActions: (row: PaymentItem) => [
          { label: '查看', action: `查看退回批次 ${row.batchNo}` },
          { label: '重新提交', tone: 'primary', action: `重新提交 ${row.batchNo}` }
        ]
      }
    ]
  },
  ledger: {
    title: '基金账务',
    desc: '按基金科目、往来科目和拨付挂账进行账务管理，体现医保基金账实一致。',
    sections: [
      {
        key: 'fund',
        label: '基金分类账',
        title: '基金分类账',
        subtitle: '查看基金收入和基金科目账务。',
        toolbar: [
          { label: '新增科目', tone: 'primary', action: '新增基金科目' },
          { label: '导出分类账', action: '导出基金分类账' }
        ],
        columns: ledgerColumns,
        data: [
          { id: 'KJ001', subjectCode: '110101', subjectName: '职工基本医疗保险统筹基金收入', ledgerType: '收入类', currentDebit: '0.00元', currentCredit: '568.24万元', balance: '12.86亿元' },
          { id: 'KJ002', subjectCode: '110102', subjectName: '居民基本医疗保险统筹基金收入', ledgerType: '收入类', currentDebit: '0.00元', currentCredit: '426.88万元', balance: '9.42亿元' },
          { id: 'KJ003', subjectCode: '110201', subjectName: '大病保险基金收入', ledgerType: '收入类', currentDebit: '0.00元', currentCredit: '112.36万元', balance: '3.18亿元' }
        ],
        rowActions: (row: LedgerItem) => [
          { label: '查看', action: `查看科目 ${row.subjectCode}` },
          { label: '查看分录', tone: 'primary', action: `查看分录 ${row.subjectCode}` }
        ]
      },
      {
        key: 'current',
        label: '往来账务',
        title: '往来账务',
        subtitle: '跟踪清算、补助和待清分往来。',
        toolbar: [
          { label: '发起清分', tone: 'primary', action: '发起往来清分' },
          { label: '导出往来账', action: '导出往来账务' }
        ],
        columns: ledgerColumns,
        data: [
          { id: 'WL001', subjectCode: '130401', subjectName: '异地就医清算往来', ledgerType: '往来类', currentDebit: '289.62万元', currentCredit: '146.18万元', balance: '1,206.39万元' },
          { id: 'WL002', subjectCode: '130402', subjectName: '财政补助暂收款', ledgerType: '往来类', currentDebit: '86.14万元', currentCredit: '22.06万元', balance: '268.70万元' },
          { id: 'WL003', subjectCode: '130403', subjectName: '税务共享待清分往来', ledgerType: '往来类', currentDebit: '35.26万元', currentCredit: '14.80万元', balance: '98.52万元' }
        ],
        rowActions: (row: LedgerItem) => [
          { label: '查看', action: `查看往来科目 ${row.subjectCode}` },
          { label: '发起清理', tone: 'primary', action: `发起清理 ${row.subjectCode}` }
        ]
      },
      {
        key: 'balance',
        label: '余额跟踪',
        title: '余额跟踪',
        subtitle: '查看重点负债科目和余额变化。',
        toolbar: [
          { label: '余额校验', tone: 'primary', action: '执行余额校验' },
          { label: '导出余额表', action: '导出余额跟踪表' }
        ],
        columns: ledgerColumns,
        data: [
          { id: 'YE001', subjectCode: '220301', subjectName: '定点医疗机构应付账款', ledgerType: '负债类', currentDebit: '1,268.30万元', currentCredit: '0.00元', balance: '3,486.52万元' },
          { id: 'YE002', subjectCode: '220302', subjectName: '双通道药店应付账款', ledgerType: '负债类', currentDebit: '268.22万元', currentCredit: '0.00元', balance: '862.47万元' },
          { id: 'YE003', subjectCode: '220303', subjectName: '异地结算待拨付', ledgerType: '负债类', currentDebit: '173.64万元', currentCredit: '0.00元', balance: '516.28万元' }
        ],
        rowActions: (row: LedgerItem) => [
          { label: '查看', action: `查看余额 ${row.subjectCode}` },
          { label: '发起调账', tone: 'primary', action: `发起调账 ${row.subjectCode}` }
        ]
      }
    ]
  },
  report: {
    title: '财务报表',
    desc: '沉淀日报、周报、月报和专题分析报表，服务局领导、财务人员和经办复核岗位。',
    sections: [
      {
        key: 'income',
        label: '收支日报',
        title: '收支日报',
        subtitle: '基金收支日报、月报和收入分析。',
        toolbar: [
          { label: '生成日报', tone: 'primary', action: '生成收支日报' },
          { label: '批量分发', action: '批量分发报表' }
        ],
        columns: reportColumns,
        data: [
          { id: 'BB20260426001', reportName: '全省医保基金收支日报', cycle: '日报', scope: '江苏省13市', generatedAt: '2026-04-26 08:30', status: '已生成' },
          { id: 'BB20260426002', reportName: '基金月度收入汇总表', cycle: '月报', scope: '省本级及各市', generatedAt: '2026-04-25 17:10', status: '待上报' },
          { id: 'BB20260426003', reportName: '财政补助拨入分析表', cycle: '专题', scope: '全省', generatedAt: '2026-04-24 16:40', status: '已分发' }
        ],
        rowActions: (row: ReportItem) => [
          { label: '查看', action: `查看报表 ${row.reportName}` },
          { label: '重新生成', tone: 'primary', action: `重新生成 ${row.reportName}` }
        ]
      },
      {
        key: 'payment',
        label: '拨付日报',
        title: '拨付日报',
        subtitle: '拨付进度日报和专题分析。',
        toolbar: [
          { label: '生成拨付报表', tone: 'primary', action: '生成拨付日报' },
          { label: '导出专题', action: '导出拨付专题分析' }
        ],
        columns: reportColumns,
        data: [
          { id: 'BB20260426004', reportName: '定点医疗机构拨付进度表', cycle: '日报', scope: '全省经办系统', generatedAt: '2026-04-26 09:10', status: '已分发' },
          { id: 'BB20260426005', reportName: '双通道药店拨付专题分析', cycle: '专题', scope: '南京、苏州、无锡', generatedAt: '2026-04-24 16:45', status: '退回修订' },
          { id: 'BB20260426006', reportName: '门慢结算拨付周报', cycle: '周报', scope: '省本级及各市', generatedAt: '2026-04-25 18:05', status: '已生成' }
        ],
        rowActions: (row: ReportItem) => [
          { label: '查看', action: `查看报表 ${row.reportName}` },
          { label: '发布', tone: 'primary', action: `发布报表 ${row.reportName}` }
        ]
      },
      {
        key: 'diff',
        label: '差异周报',
        title: '差异周报',
        subtitle: '差异处理和清算专题报表。',
        toolbar: [
          { label: '生成周报', tone: 'primary', action: '生成差异周报' },
          { label: '上报省级', action: '上报省级报表' }
        ],
        columns: reportColumns,
        data: [
          { id: 'BB20260426007', reportName: '基金差异处理台账周报', cycle: '周报', scope: '省本级及各市', generatedAt: '2026-04-25 18:05', status: '已生成' },
          { id: 'BB20260426008', reportName: '到账异常跟踪日报', cycle: '日报', scope: '全省', generatedAt: '2026-04-26 11:20', status: '已生成' },
          { id: 'BB20260426009', reportName: '异地就医清算月报', cycle: '月报', scope: '江苏省13市', generatedAt: '2026-04-25 17:30', status: '待上报' }
        ],
        rowActions: (row: ReportItem) => [
          { label: '查看', action: `查看报表 ${row.reportName}` },
          { label: '上报', tone: 'primary', action: `上报报表 ${row.reportName}` }
        ]
      }
    ]
  }
};

function statusBadge(status: string) {
  const styleMap: Record<string, string> = {
    已确认: 'bg-emerald-100 text-emerald-700',
    对平: 'bg-emerald-100 text-emerald-700',
    已办结: 'bg-emerald-100 text-emerald-700',
    已拨付: 'bg-emerald-100 text-emerald-700',
    已生成: 'bg-emerald-100 text-emerald-700',
    已分发: 'bg-blue-100 text-blue-700',
    复核通过: 'bg-blue-100 text-blue-700',
    待确认: 'bg-amber-100 text-amber-700',
    待复核: 'bg-amber-100 text-amber-700',
    待补录: 'bg-amber-100 text-amber-700',
    待拨付: 'bg-amber-100 text-amber-700',
    待上报: 'bg-amber-100 text-amber-700',
    待冲回: 'bg-amber-100 text-amber-700',
    异常待核: 'bg-rose-100 text-rose-700',
    存在差异: 'bg-rose-100 text-rose-700',
    处理中: 'bg-rose-100 text-rose-700',
    协查中: 'bg-rose-100 text-rose-700',
    退回重提: 'bg-rose-100 text-rose-700',
    退回修订: 'bg-rose-100 text-rose-700'
  };

  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${styleMap[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
}

function toneButtonClass(tone: ButtonTone = 'secondary') {
  return tone === 'primary'
    ? 'bg-cyan-600 text-white hover:bg-cyan-700'
    : 'border border-gray-200 text-gray-600 hover:bg-gray-50';
}

function matchesKeyword(row: BaseRow, keyword: string) {
  if (!keyword.trim()) return true;
  const normalized = keyword.trim().toLowerCase();
  return Object.values(row).some((value) => String(value).toLowerCase().includes(normalized));
}

function DataTable<T extends BaseRow>({
  title,
  subtitle,
  columns,
  data,
  toolbar,
  rowActions,
  keyword,
  onKeywordChange,
  onAction
}: {
  title: string;
  subtitle: string;
  columns: Array<TableColumn<T>>;
  data: T[];
  toolbar: ActionButton[];
  rowActions: (row: T) => ActionButton[];
  keyword: string;
  onKeywordChange: (value: string) => void;
  onAction: (action: ActionButton, row?: T) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {toolbar.map((button) => (
              <button
                key={button.label}
                onClick={() => onAction(button)}
                className={`px-4 py-2 rounded-xl text-sm transition-colors ${toneButtonClass(button.tone)}`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300"
              placeholder="输入关键字查询当前页数据"
            />
          </div>
          <button className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">查询</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px]">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-sm font-medium text-gray-600 ${
                    column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {column.title}
                </th>
              ))}
              <th className="px-6 py-3 text-sm font-medium text-gray-600 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-6 py-4 text-sm text-gray-700 ${
                      column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}
                  </td>
                ))}
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    {rowActions(row).map((button) => (
                      <button
                        key={button.label}
                        onClick={() => onAction(button, row)}
                        className={`${button.tone === 'primary' ? 'text-cyan-600' : 'text-gray-500'} hover:underline text-sm`}
                      >
                        {button.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-10 text-center text-sm text-gray-500">
                  未查询到匹配数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function FinanceManagementHub() {
  const [selectedModule, setSelectedModule] = useState<ModuleId | null>(null);
  const [activeSection, setActiveSection] = useState('');
  const [keyword, setKeyword] = useState('');
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [feedback, setFeedback] = useState('');

  const currentModule = selectedModule ? moduleSections[selectedModule] : null;
  const currentSection = currentModule
    ? currentModule.sections.find((section) => section.key === activeSection) || currentModule.sections[0]
    : null;

  const filteredData = useMemo(() => {
    if (!currentSection) return [];
    return currentSection.data.filter((row: BaseRow) => matchesKeyword(row, keyword));
  }, [currentSection, keyword]);

  const openModule = (moduleId: ModuleId) => {
    setSelectedModule(moduleId);
    setActiveSection(moduleSections[moduleId].sections[0].key);
    setKeyword('');
    setFeedback('');
  };

  const switchSection = (sectionKey: string) => {
    setActiveSection(sectionKey);
    setKeyword('');
  };

  const openAction = (action: ActionButton, row?: BaseRow) => {
    setPendingAction({
      title: action.action,
      target: row?.id || currentSection?.label || '',
      confirmLabel: action.label
    });
  };

  const confirmAction = () => {
    if (!pendingAction) return;
    setFeedback(`${pendingAction.title} 已提交`);
    setPendingAction(null);
    window.setTimeout(() => setFeedback(''), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">财务管理工作台</h2>
          <p className="mt-1 text-sm text-gray-500">请选择具体财务业务环节进入办理</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <div className="grid grid-cols-4 gap-4">
          {overviewStats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-gray-50 rounded-2xl p-5 border border-gray-100"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {financeModules.map((module) => (
          <button
            key={module.id}
            onClick={() => openModule(module.id)}
            className="group bg-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-xl hover:border-cyan-400 hover:-translate-y-1 transition-all text-left"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-5 shadow-lg`}>
              <module.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-2">{module.title}</h3>
            <p className="text-base text-gray-500 mb-5">{module.description}</p>
            <div className="flex items-center text-cyan-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>点击进入</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selectedModule && currentModule && currentSection && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl w-full max-w-7xl max-h-[88vh] overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{currentModule.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{currentModule.desc}</p>
                </div>
                <button onClick={() => setSelectedModule(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="px-6 pt-4 border-b border-gray-200 flex gap-2 flex-wrap">
                {currentModule.sections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => switchSection(section.key)}
                    className={`px-4 py-2 text-sm rounded-t-xl border-b-2 ${
                      activeSection === section.key
                        ? 'border-cyan-500 text-cyan-600 bg-cyan-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              {feedback && (
                <div className="mx-6 mt-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {feedback}
                </div>
              )}

              <div className="p-6 overflow-auto max-h-[calc(88vh-136px)]">
                <DataTable
                  title={currentSection.title}
                  subtitle={currentSection.subtitle}
                  columns={currentSection.columns}
                  data={filteredData}
                  toolbar={currentSection.toolbar}
                  rowActions={currentSection.rowActions}
                  keyword={keyword}
                  onKeywordChange={setKeyword}
                  onAction={openAction}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingAction && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60] p-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h4 className="text-lg font-bold text-gray-800">业务办理确认</h4>
                <button onClick={() => setPendingAction(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                  <p className="text-sm text-gray-500">操作事项</p>
                  <p className="mt-1 font-semibold text-gray-800">{pendingAction.title}</p>
                  <p className="mt-3 text-sm text-gray-500">目标对象</p>
                  <p className="mt-1 text-gray-700">{pendingAction.target}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">
                    <ClipboardCheck className="w-4 h-4 inline mr-2" />
                    查看详情
                  </button>
                  <button className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">
                    <FilePlus2 className="w-4 h-4 inline mr-2" />
                    生成记录
                  </button>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setPendingAction(null)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
                  取消
                </button>
                <button onClick={confirmAction} className="px-4 py-2 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700">
                  <PlayCircle className="w-4 h-4 inline mr-2" />
                  确认办理
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
