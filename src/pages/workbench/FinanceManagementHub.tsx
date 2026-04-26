import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FilePlus2,
  FileText,
  Landmark,
  PlayCircle,
  Scale,
  Search,
  Send,
  Upload,
  X,
} from 'lucide-react';
import * as XLSX from 'xlsx';

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
}

interface BaseRow {
  id: string;
}

interface FinanceRow extends BaseRow {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
  field7?: string;
}

interface SectionConfig<T extends BaseRow> {
  key: string;
  label: string;
  title: string;
  subtitle: string;
  importable?: boolean;
  toolbar: ActionButton[];
  columns: Array<TableColumn<T>>;
  data: T[];
  rowActions: (row: T) => ActionButton[];
}

interface PendingAction {
  title: string;
  target: string;
  confirmLabel: string;
}

interface ReportPreview {
  id: string;
  reportName: string;
  reportType: string;
  period: string;
  range: string;
  status: string;
  owner: string;
  generatedAt: string;
  summary: Array<{ label: string; value: string }>;
  cityRows: Array<{
    city: string;
    income: string;
    expense: string;
    balance: string;
    remark: string;
  }>;
}

interface ReportGenerationForm {
  template: string;
  period: string;
  range: string;
  sectionKey: string;
  targetId?: string;
}

const overviewStats = [
  { label: '本月基金收入', value: '12.68亿元' },
  { label: '本月基金支出', value: '11.94亿元' },
  { label: '清算在途金额', value: '2,348.62万元' },
  { label: '财务风险提示', value: '5项' },
];

const financeModules: FinanceModule[] = [
  { id: 'arrival', title: '到账确认', icon: Landmark, color: 'from-emerald-500 to-emerald-600', description: '处理银行回单、税务到账和财政补助到账确认。' },
  { id: 'reconcile', title: '对账中心', icon: Scale, color: 'from-cyan-500 to-cyan-600', description: '统一管理征缴台账、银行流水和清算专户对账。' },
  { id: 'difference', title: '差异处理', icon: AlertTriangle, color: 'from-rose-500 to-rose-600', description: '登记、核查并办结未对平、挂账和重复入账问题。' },
  { id: 'payment', title: '拨付管理', icon: Send, color: 'from-blue-500 to-blue-600', description: '覆盖拨付申请、拨付审核、回盘确认和退回重提。' },
  { id: 'ledger', title: '基金账务', icon: BookOpen, color: 'from-amber-500 to-amber-600', description: '围绕基金科目、往来科目和明细账开展账务管理。' },
  { id: 'report', title: '财务报表', icon: FileText, color: 'from-violet-500 to-violet-600', description: '统一管理基金收支、拨付分析和专题报表成品。' },
];

const commonColumns: Array<TableColumn<FinanceRow>> = [
  { key: 'id', title: '编号' },
  { key: 'field1', title: '主体/批次' },
  { key: 'field2', title: '业务类型' },
  { key: 'field3', title: '金额/范围' },
  { key: 'field4', title: '状态/结果' },
  { key: 'field5', title: '经办人员' },
  { key: 'field6', title: '时间' },
];

const reportColumns: Array<TableColumn<FinanceRow>> = [
  { key: 'id', title: '报表编号' },
  { key: 'field1', title: '报表名称' },
  { key: 'field2', title: '报表类型' },
  { key: 'field3', title: '统计周期' },
  { key: 'field7', title: '数据范围' },
  { key: 'field4', title: '生成状态' },
  { key: 'field5', title: '生成人' },
  { key: 'field6', title: '生成时间' },
];

const buildRows = (rows: Array<Omit<FinanceRow, 'id'>>, prefix: string): FinanceRow[] =>
  rows.map((row, index) => ({ id: `${prefix}${String(index + 1).padStart(3, '0')}`, ...row }));

const reportPreviewMap: Record<string, ReportPreview> = {
  SR001: {
    id: 'SR001',
    reportName: '全省医保基金收支日报',
    reportType: '日报',
    period: '2026-04-26',
    range: '江苏省13个设区市',
    status: '已生成',
    owner: '系统自动',
    generatedAt: '2026-04-26 08:30',
    summary: [
      { label: '基金收入', value: '4.26亿元' },
      { label: '基金支出', value: '3.98亿元' },
      { label: '当日结余', value: '0.28亿元' },
      { label: '财政补助到账', value: '0.64亿元' },
    ],
    cityRows: [
      { city: '南京', income: '5,620万元', expense: '5,180万元', balance: '440万元', remark: '门慢结算支出增长' },
      { city: '无锡', income: '3,880万元', expense: '3,640万元', balance: '240万元', remark: '职工医保收入稳定' },
      { city: '徐州', income: '4,320万元', expense: '4,080万元', balance: '240万元', remark: '居民医保支出平稳' },
      { city: '常州', income: '2,960万元', expense: '2,770万元', balance: '190万元', remark: '双通道药店拨付正常' },
      { city: '苏州', income: '6,240万元', expense: '5,960万元', balance: '280万元', remark: '异地结算资金回流' },
      { city: '南通', income: '3,280万元', expense: '3,160万元', balance: '120万元', remark: '财政补助到账完成' },
      { city: '连云港', income: '2,180万元', expense: '2,060万元', balance: '120万元', remark: '居民参保到账正常' },
      { city: '淮安', income: '2,460万元', expense: '2,310万元', balance: '150万元', remark: '灵活就业缴费增长' },
      { city: '盐城', income: '3,420万元', expense: '3,210万元', balance: '210万元', remark: '基金运行平稳' },
      { city: '扬州', income: '2,540万元', expense: '2,410万元', balance: '130万元', remark: '待遇支付略增' },
      { city: '镇江', income: '2,210万元', expense: '2,090万元', balance: '120万元', remark: '回款及时' },
      { city: '泰州', income: '2,360万元', expense: '2,240万元', balance: '120万元', remark: '门诊统筹支出可控' },
      { city: '宿迁', income: '2,110万元', expense: '1,980万元', balance: '130万元', remark: '财政补助核对完成' },
    ],
  },
  SR002: {
    id: 'SR002',
    reportName: '基金月度收入汇总表',
    reportType: '月报',
    period: '2026年4月',
    range: '省本级及各设区市',
    status: '待上报',
    owner: '周岚',
    generatedAt: '2026-04-25 17:10',
    summary: [
      { label: '职工医保收入', value: '7.82亿元' },
      { label: '居民医保收入', value: '3.46亿元' },
      { label: '灵活就业收入', value: '1.12亿元' },
      { label: '财政补助收入', value: '2.05亿元' },
    ],
    cityRows: [
      { city: '南京', income: '1.28亿元', expense: '0.98亿元', balance: '0.30亿元', remark: '职工单位缴费占比高' },
      { city: '无锡', income: '0.86亿元', expense: '0.71亿元', balance: '0.15亿元', remark: '税务共享到账及时' },
      { city: '徐州', income: '0.92亿元', expense: '0.79亿元', balance: '0.13亿元', remark: '居民筹资集中到账' },
      { city: '常州', income: '0.71亿元', expense: '0.60亿元', balance: '0.11亿元', remark: '基金运行正常' },
      { city: '苏州', income: '1.46亿元', expense: '1.18亿元', balance: '0.28亿元', remark: '异地就医结算量大' },
      { city: '南通', income: '0.74亿元', expense: '0.62亿元', balance: '0.12亿元', remark: '财政补助已确认' },
    ],
  },
  SR003: {
    id: 'SR003',
    reportName: '财政补助拨入分析表',
    reportType: '专题',
    period: '2026年4月',
    range: '全省',
    status: '已发布',
    owner: '曹颖',
    generatedAt: '2026-04-24 16:40',
    summary: [
      { label: '本月财政补助', value: '2.05亿元' },
      { label: '已到账金额', value: '1.94亿元' },
      { label: '待确认金额', value: '0.11亿元' },
      { label: '差异笔数', value: '5笔' },
    ],
    cityRows: [
      { city: '南京', income: '1,520万元', expense: '1,480万元', balance: '40万元', remark: '月底拨付待核实' },
      { city: '苏州', income: '1,860万元', expense: '1,810万元', balance: '50万元', remark: '分发完成' },
      { city: '徐州', income: '1,240万元', expense: '1,210万元', balance: '30万元', remark: '补助清算正常' },
      { city: '盐城', income: '1,110万元', expense: '1,080万元', balance: '30万元', remark: '异地拨入完成' },
      { city: '宿迁', income: '920万元', expense: '890万元', balance: '30万元', remark: '待月末复核' },
    ],
  },
  BFB001: {
    id: 'BFB001',
    reportName: '定点医疗机构拨付进度表',
    reportType: '日报',
    period: '2026-04-26',
    range: '全省经办系统',
    status: '已发布',
    owner: '陆敏',
    generatedAt: '2026-04-26 09:10',
    summary: [
      { label: '应拨付金额', value: '3.86亿元' },
      { label: '已拨付金额', value: '3.41亿元' },
      { label: '待拨付金额', value: '0.45亿元' },
      { label: '退回重提批次', value: '7批次' },
    ],
    cityRows: [
      { city: '南京', income: '4,800万元', expense: '4,300万元', balance: '500万元', remark: '三甲医院批次已回盘' },
      { city: '苏州', income: '5,600万元', expense: '5,020万元', balance: '580万元', remark: '双通道药店已分发' },
      { city: '无锡', income: '3,920万元', expense: '3,510万元', balance: '410万元', remark: '待复核1批' },
      { city: '南通', income: '3,180万元', expense: '2,960万元', balance: '220万元', remark: '回盘正常' },
    ],
  },
};

const moduleSections: Record<ModuleId, { title: string; desc: string; sections: Array<SectionConfig<FinanceRow>> }> = {
  arrival: {
    title: '到账确认',
    desc: '围绕银行回单、税务到账和财政补助到账进行确认与留痕。',
    sections: [
      {
        key: 'arrival_bank',
        label: '银行到账确认',
        title: '银行到账确认',
        subtitle: '核对银行回单与医保征缴到账信息。',
        importable: true,
        toolbar: [
          { label: '查询', action: '查询银行到账记录' },
          { label: '导入回单', action: '导入银行回单' },
          { label: '导出结果', action: '导出银行到账结果' },
        ],
        columns: commonColumns,
        data: buildRows([
          { field1: '南京华宁科技有限公司', field2: '职工医保单位缴费', field3: '84.26万元', field4: '已确认', field5: '周岚', field6: '2026-04-26 09:18' },
          { field1: '苏州恒川精密制造有限公司', field2: '职工医保单位缴费', field3: '126.38万元', field4: '已确认', field5: '陆敏', field6: '2026-04-26 09:42' },
          { field1: '无锡瑞康药业连锁有限公司', field2: '生育保险缴费', field3: '18.42万元', field4: '待确认', field5: '钱莉', field6: '2026-04-26 10:05' },
        ], 'DZ'),
        rowActions: (row) => [
          { label: '查看', action: `查看到账记录 ${row.id}` },
          { label: '确认到账', action: `确认到账 ${row.id}`, tone: 'primary' },
        ],
      },
      {
        key: 'arrival_tax',
        label: '税务到账确认',
        title: '税务到账确认',
        subtitle: '核对税务共享平台与系统到账信息。',
        importable: true,
        toolbar: [
          { label: '查询', action: '查询税务到账记录' },
          { label: '导入台账', action: '导入税务到账台账' },
          { label: '导出结果', action: '导出税务到账结果' },
        ],
        columns: commonColumns,
        data: buildRows([
          { field1: '徐州泉山人力资源服务中心', field2: '灵活就业医保缴费', field3: '42.87万元', field4: '已确认', field5: '赵静', field6: '2026-04-26 10:26' },
          { field1: '扬州市广陵区医保中心', field2: '居民医保缴费', field3: '35.16万元', field4: '待确认', field5: '邹琳', field6: '2026-04-26 10:56' },
          { field1: '镇江市京口区医保中心', field2: '居民医保批量缴费', field3: '28.43万元', field4: '已确认', field5: '唐璐', field6: '2026-04-26 11:18' },
        ], 'SW'),
        rowActions: (row) => [
          { label: '查看', action: `查看税务到账 ${row.id}` },
          { label: '确认到账', action: `确认税务到账 ${row.id}`, tone: 'primary' },
        ],
      },
    ],
  },
  reconcile: {
    title: '对账中心',
    desc: '统一管理医保征缴、银行流水、税务平台和清算专户之间的批次对账。',
    sections: [
      {
        key: 'reconcile_daily',
        label: '日对账批次',
        title: '日对账批次',
        subtitle: '查看当日对账批次和结果。',
        importable: true,
        toolbar: [
          { label: '查询', action: '查询日对账批次' },
          { label: '导入对账文件', action: '导入对账文件' },
          { label: '导出结果', action: '导出日对账结果' },
        ],
        columns: commonColumns,
        data: buildRows([
          { field1: 'DZP20260426-01', field2: '南京市职工医保收入', field3: '医保征缴台账', field4: '对平', field5: '周岚', field6: '2026-04-26 10:16' },
          { field1: 'DZP20260426-02', field2: '苏州市居民医保收入', field3: '税务共享平台', field4: '对平', field5: '陆敏', field6: '2026-04-26 10:28' },
          { field1: 'DZP20260426-04', field2: '淮安市灵活就业缴费', field3: '建设银行回单', field4: '待复核', field5: '严峰', field6: '2026-04-26 11:05' },
        ], 'DZP'),
        rowActions: (row) => [
          { label: '查看', action: `查看对账批次 ${row.id}` },
          { label: '重新执行', action: `重新执行对账 ${row.id}`, tone: 'primary' },
        ],
      },
      {
        key: 'reconcile_monthly',
        label: '月度对账',
        title: '月度对账',
        subtitle: '查看月度汇总对账批次。',
        importable: true,
        toolbar: [
          { label: '查询', action: '查询月度对账' },
          { label: '导入汇总文件', action: '导入月度汇总文件' },
          { label: '导出汇总', action: '导出月度对账汇总' },
        ],
        columns: commonColumns,
        data: buildRows([
          { field1: 'YDZ202604-01', field2: '全省居民医保月度汇总', field3: '月度征缴汇总表', field4: '对平', field5: '孔洁', field6: '2026-04-25 17:32' },
          { field1: 'YDZ202604-02', field2: '全省财政补助月度汇总', field3: '基金收入台账', field4: '存在差异', field5: '曹颖', field6: '2026-04-25 18:10' },
          { field1: 'YDZ202604-03', field2: '泰州市灵活就业月度汇总', field3: '医保征缴月报', field4: '待复核', field5: '彭雪', field6: '2026-04-25 18:36' },
        ], 'YDZ'),
        rowActions: (row) => [
          { label: '查看', action: `查看月度对账 ${row.id}` },
          { label: '差异转办', action: `差异转办 ${row.id}`, tone: 'primary' },
        ],
      },
    ],
  },
  difference: {
    title: '差异处理',
    desc: '承接未对平、重复入账、挂账等问题，形成差异登记、核查、冲销和办结台账。',
    sections: [
      {
        key: 'difference_register',
        label: '差异登记',
        title: '差异登记',
        subtitle: '登记新发生的到账和对账差异。',
        importable: true,
        toolbar: [
          { label: '查询', action: '查询差异登记' },
          { label: '批量导入', action: '批量导入差异' },
          { label: '导出结果', action: '导出差异清单' },
        ],
        columns: commonColumns,
        data: buildRows([
          { field1: '到账金额不一致', field2: 'DZP20260426-03', field3: '12.00万元', field4: '处理中', field5: '许文博', field6: '2026-04-26 11:20' },
          { field1: '银行回单缺单位编码', field2: 'DZP20260426-04', field3: '3.26万元', field4: '待补录', field5: '陆雨桐', field6: '2026-04-26 11:32' },
          { field1: '重复入账', field2: 'DZP20260425-11', field3: '5.60万元', field4: '待冲回', field5: '韩嘉钰', field6: '2026-04-26 12:08' },
        ], 'CY'),
        rowActions: (row) => [
          { label: '查看', action: `查看差异 ${row.id}` },
          { label: '受理', action: `受理差异 ${row.id}`, tone: 'primary' },
        ],
      },
      {
        key: 'difference_check',
        label: '核查协办',
        title: '核查协办',
        subtitle: '跨机构协查和异常核实记录。',
        importable: true,
        toolbar: [
          { label: '查询', action: '查询核查协办' },
          { label: '导入差异台账', action: '导入差异台账' },
          { label: '导出结果', action: '导出协查结果' },
        ],
        columns: commonColumns,
        data: buildRows([
          { field1: '财政补助未到账', field2: 'DZP20260425-08', field3: '18.00万元', field4: '协查中', field5: '陈知夏', field6: '2026-04-26 13:08' },
          { field1: '银行回盘金额偏差', field2: 'BF20260424015', field3: '600元', field4: '待回复', field5: '陆敏', field6: '2026-04-26 13:20' },
          { field1: '税务到账日期异常', field2: 'SW20260426002', field3: '35.16万元', field4: '已核实', field5: '邹琳', field6: '2026-04-26 13:48' },
        ], 'HC'),
        rowActions: (row) => [
          { label: '查看', action: `查看核查 ${row.id}` },
          { label: '发起协查', action: `发起协查 ${row.id}`, tone: 'primary' },
        ],
      },
    ],
  },
  payment: {
    title: '拨付管理',
    desc: '覆盖拨付申请、拨付审核、回盘确认和退回重提的全流程管理。',
    sections: [
      {
        key: 'payment_apply',
        label: '拨付申请',
        title: '拨付申请',
        subtitle: '查看待拨付、已提交和退回重提批次。',
        toolbar: [
          { label: '查询', action: '查询拨付申请' },
          { label: '导出清单', action: '导出拨付申请清单' },
        ],
        columns: commonColumns,
        data: buildRows([
          { field1: 'BF20260426001', field2: '南京市第一医院', field3: '285.00万元', field4: '待审核', field5: '周岚', field6: '2026-04-26 09:30' },
          { field1: 'BF20260426002', field2: '苏州大学附属第一医院', field3: '420.00万元', field4: '待复核', field5: '陆敏', field6: '2026-04-26 09:52' },
          { field1: 'BF20260426003', field2: '无锡市人民医院', field3: '198.00万元', field4: '退回重提', field5: '钱莉', field6: '2026-04-26 10:20' },
        ], 'BF'),
        rowActions: (row) => [
          { label: '查看', action: `查看拨付批次 ${row.id}` },
          { label: '提交审核', action: `提交审核 ${row.id}`, tone: 'primary' },
        ],
      },
      {
        key: 'payment_back',
        label: '回盘确认',
        title: '回盘确认',
        subtitle: '查看银行回盘和退回重提情况。',
        toolbar: [
          { label: '查询', action: '查询回盘记录' },
          { label: '导出回盘', action: '导出回盘记录' },
        ],
        columns: commonColumns,
        data: buildRows([
          { field1: '回盘成功', field2: '南京市第一医院', field3: '285.00万元', field4: '已到账', field5: '周岚', field6: '2026-04-26 14:10' },
          { field1: '回盘成功', field2: '南通市第一人民医院', field3: '223.00万元', field4: '已到账', field5: '高宁', field6: '2026-04-26 14:18' },
          { field1: '回盘退回', field2: '苏州市立医院', field3: '209.00万元', field4: '待重提', field5: '陆敏', field6: '2026-04-26 14:26' },
        ], 'HP'),
        rowActions: (row) => [
          { label: '查看', action: `查看回盘 ${row.id}` },
          { label: '重新提交', action: `重新提交 ${row.id}`, tone: 'primary' },
        ],
      },
    ],
  },
  ledger: {
    title: '基金账务',
    desc: '按基金科目、往来科目和挂账科目进行总账、明细账和余额跟踪。',
    sections: [
      {
        key: 'ledger_subject',
        label: '科目余额',
        title: '科目余额',
        subtitle: '查看基金科目、往来科目和挂账科目余额。',
        toolbar: [
          { label: '查询', action: '查询科目余额' },
          { label: '导出分类账', action: '导出基金分类账' },
        ],
        columns: commonColumns,
        data: buildRows([
          { field1: '100201', field2: '职工医保基金收入', field3: '本日借方 1,260.00万元', field4: '余额正常', field5: '周岚', field6: '2026-04-26 15:00' },
          { field1: '100202', field2: '居民医保基金收入', field3: '本日借方 860.00万元', field4: '余额正常', field5: '陆敏', field6: '2026-04-26 15:00' },
          { field1: '220301', field2: '财政补助往来', field3: '余额 188.00万元', field4: '待核销', field5: '曹颖', field6: '2026-04-26 15:00' },
        ], 'KM'),
        rowActions: (row) => [
          { label: '查看', action: `查看科目 ${row.id}` },
          { label: '查看明细', action: `查看明细 ${row.id}`, tone: 'primary' },
        ],
      },
      {
        key: 'ledger_detail',
        label: '明细账',
        title: '明细账',
        subtitle: '查看指定科目明细流水。',
        toolbar: [
          { label: '查询', action: '查询明细账' },
          { label: '导出明细', action: '导出明细账' },
        ],
        columns: commonColumns,
        data: buildRows([
          { field1: 'PZ20260426001', field2: '南京市第一医院拨付', field3: '贷方 285.00万元', field4: '已记账', field5: '周岚', field6: '2026-04-26 15:18' },
          { field1: 'PZ20260426002', field2: '苏州大学附属第一医院拨付', field3: '贷方 420.00万元', field4: '已记账', field5: '陆敏', field6: '2026-04-26 15:26' },
          { field1: 'PZ20260426003', field2: '财政补助到账', field3: '借方 62.40万元', field4: '已记账', field5: '曹颖', field6: '2026-04-26 15:35' },
        ], 'MX'),
        rowActions: (row) => [
          { label: '查看', action: `查看凭证 ${row.id}` },
          { label: '导出凭证', action: `导出凭证 ${row.id}`, tone: 'primary' },
        ],
      },
    ],
  },
  report: {
    title: '财务报表',
    desc: '统一管理报表目录、报表生成、报表预览、单张导出和发布分发。',
    sections: [
      {
        key: 'report_income',
        label: '收支报表中心',
        title: '收支报表中心',
        subtitle: '围绕基金收支日报、月报和财政补助专题报表开展目录管理。',
        toolbar: [
          { label: '查询', action: '查询收支报表目录' },
          { label: '生成报表', action: '生成收支报表' },
          { label: '导出目录', action: '导出收支报表目录' },
        ],
        columns: reportColumns,
        data: buildRows([
          { field1: '全省医保基金收支日报', field2: '日报', field3: '2026-04-26', field4: '已生成', field5: '系统自动', field6: '2026-04-26 08:30', field7: '江苏省13个设区市' },
          { field1: '基金月度收入汇总表', field2: '月报', field3: '2026年4月', field4: '待上报', field5: '周岚', field6: '2026-04-25 17:10', field7: '省本级及各设区市' },
          { field1: '财政补助拨入分析表', field2: '专题', field3: '2026年4月', field4: '已发布', field5: '曹颖', field6: '2026-04-24 16:40', field7: '全省' },
        ], 'SR'),
        rowActions: (row) => [
          { label: '查看', action: `查看报表 ${row.id}` },
          { label: row.field4 === '未生成' ? '生成' : '重新生成', action: `生成报表 ${row.id}`, tone: 'primary' },
          { label: '导出', action: `导出报表 ${row.id}` },
          { label: row.field4 === '已发布' ? '已发布' : '发布', action: `发布报表 ${row.id}` },
        ],
      },
      {
        key: 'report_payment',
        label: '拨付报表中心',
        title: '拨付报表中心',
        subtitle: '围绕拨付进度、回盘情况和双通道药店专题报表开展目录管理。',
        toolbar: [
          { label: '查询', action: '查询拨付报表目录' },
          { label: '生成报表', action: '生成拨付报表' },
          { label: '导出目录', action: '导出拨付报表目录' },
        ],
        columns: reportColumns,
        data: buildRows([
          { field1: '定点医疗机构拨付进度表', field2: '日报', field3: '2026-04-26', field4: '已发布', field5: '陆敏', field6: '2026-04-26 09:10', field7: '全省经办系统' },
          { field1: '双通道药店拨付专题分析', field2: '专题', field3: '2026年4月', field4: '退回修订', field5: '高宁', field6: '2026-04-24 16:45', field7: '南京、苏州、无锡' },
          { field1: '门慢结算拨付周报', field2: '周报', field3: '2026年第17周', field4: '已生成', field5: '严峰', field6: '2026-04-25 18:05', field7: '省本级及各设区市' },
        ], 'BFB'),
        rowActions: (row) => [
          { label: '查看', action: `查看报表 ${row.id}` },
          { label: row.field4 === '未生成' ? '生成' : '重新生成', action: `生成报表 ${row.id}`, tone: 'primary' },
          { label: '导出', action: `导出报表 ${row.id}` },
          { label: row.field4 === '已发布' ? '已发布' : '发布', action: `发布报表 ${row.id}` },
        ],
      },
    ],
  },
};

function statusBadge(status: string) {
  const styleMap: Record<string, string> = {
    已确认: 'bg-emerald-100 text-emerald-700',
    对平: 'bg-emerald-100 text-emerald-700',
    已办结: 'bg-emerald-100 text-emerald-700',
    已到账: 'bg-emerald-100 text-emerald-700',
    已记账: 'bg-emerald-100 text-emerald-700',
    已生成: 'bg-emerald-100 text-emerald-700',
    已发布: 'bg-blue-100 text-blue-700',
    已核实: 'bg-cyan-100 text-cyan-700',
    待确认: 'bg-amber-100 text-amber-700',
    待复核: 'bg-amber-100 text-amber-700',
    待补录: 'bg-amber-100 text-amber-700',
    待重提: 'bg-amber-100 text-amber-700',
    待上报: 'bg-amber-100 text-amber-700',
    待审核: 'bg-yellow-100 text-yellow-700',
    处理中: 'bg-rose-100 text-rose-700',
    协查中: 'bg-rose-100 text-rose-700',
    存在差异: 'bg-rose-100 text-rose-700',
    退回重提: 'bg-rose-100 text-rose-700',
    退回修订: 'bg-rose-100 text-rose-700',
    余额正常: 'bg-slate-100 text-slate-700',
    待核销: 'bg-orange-100 text-orange-700',
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

function getNowString() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function createFallbackReportPreview(row: FinanceRow): ReportPreview {
  return {
    id: row.id,
    reportName: row.field1,
    reportType: row.field2,
    period: row.field3,
    range: row.field7 || '江苏省13个设区市',
    status: row.field4,
    owner: row.field5,
    generatedAt: row.field6,
    summary: [
      { label: '统计口径', value: row.field2 },
      { label: '统计周期', value: row.field3 },
      { label: '数据范围', value: row.field7 || '江苏省13个设区市' },
      { label: '当前状态', value: row.field4 },
    ],
    cityRows: [
      { city: '南京', income: '4,260万元', expense: '4,020万元', balance: '240万元', remark: '自动汇总生成' },
      { city: '苏州', income: '5,180万元', expense: '4,860万元', balance: '320万元', remark: '支持单张导出' },
      { city: '徐州', income: '3,760万元', expense: '3,520万元', balance: '240万元', remark: '待人工复核' },
      { city: '南通', income: '2,980万元', expense: '2,770万元', balance: '210万元', remark: '可继续发布' },
    ],
  };
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
  onAction,
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
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {toolbar.map((button) => (
              <button
                key={button.label}
                onClick={() => onAction(button)}
                className={`rounded-xl px-4 py-2 text-sm transition-colors ${toneButtonClass(button.tone)}`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              placeholder="输入关键字查询当前页数据"
            />
          </div>
          <button onClick={() => onAction({ label: '查询', action: '执行查询' })} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
            查询
          </button>
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
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">操作</th>
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
                    {column.key === 'field4' ? statusBadge(String(row[column.key as keyof T] ?? '')) : String(row[column.key as keyof T] ?? '')}
                  </td>
                ))}
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {rowActions(row).map((button) => (
                      <button
                        key={button.label}
                        onClick={() => onAction(button, row)}
                        disabled={button.label === '已发布'}
                        className={`${button.tone === 'primary' ? 'text-cyan-600' : 'text-gray-500'} text-sm hover:underline disabled:cursor-not-allowed disabled:text-gray-300 disabled:no-underline`}
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
  const [selectedReport, setSelectedReport] = useState<ReportPreview | null>(null);
  const [generationForm, setGenerationForm] = useState<ReportGenerationForm | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [sectionDataMap, setSectionDataMap] = useState<Record<string, FinanceRow[]>>(() => {
    const map: Record<string, FinanceRow[]> = {};
    Object.values(moduleSections).forEach((module) => {
      module.sections.forEach((section) => {
        map[section.key] = section.data;
      });
    });
    return map;
  });
  const [pendingImportKey, setPendingImportKey] = useState<string>('');

  const currentModule = selectedModule ? moduleSections[selectedModule] : null;
  const currentSection = currentModule ? currentModule.sections.find((section) => section.key === activeSection) || currentModule.sections[0] : null;
  const currentRows = currentSection ? sectionDataMap[currentSection.key] || currentSection.data : [];

  const filteredData = useMemo(() => {
    if (!currentSection) return [];
    return currentRows.filter((row) => matchesKeyword(row, keyword));
  }, [currentRows, currentSection, keyword]);

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

  const exportSectionData = (section: SectionConfig<FinanceRow>, rows: FinanceRow[]) => {
    const exportRows = rows.map((row) => {
      const record: Record<string, string> = {};
      section.columns.forEach((column) => {
        record[column.title] = String(row[column.key as keyof FinanceRow] ?? '');
      });
      return record;
    });
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, section.label);
    XLSX.writeFile(workbook, `${section.title}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportReportFile = (report: ReportPreview) => {
    const workbook = XLSX.utils.book_new();
    const baseSheet = XLSX.utils.json_to_sheet([
      { 项目: '报表编号', 内容: report.id },
      { 项目: '报表名称', 内容: report.reportName },
      { 项目: '报表类型', 内容: report.reportType },
      { 项目: '统计周期', 内容: report.period },
      { 项目: '数据范围', 内容: report.range },
      { 项目: '生成状态', 内容: report.status },
      { 项目: '生成人', 内容: report.owner },
      { 项目: '生成时间', 内容: report.generatedAt },
    ]);
    const summarySheet = XLSX.utils.json_to_sheet(report.summary.map((item) => ({ 指标: item.label, 数值: item.value })));
    const detailSheet = XLSX.utils.json_to_sheet(
      report.cityRows.map((item) => ({
        设区市: item.city,
        基金收入: item.income,
        基金支出: item.expense,
        当期结余: item.balance,
        备注: item.remark,
      })),
    );
    XLSX.utils.book_append_sheet(workbook, baseSheet, '报表信息');
    XLSX.utils.book_append_sheet(workbook, summarySheet, '摘要');
    XLSX.utils.book_append_sheet(workbook, detailSheet, '13市明细');
    XLSX.writeFile(workbook, `${report.reportName}_${report.period}.xlsx`);
  };

  const downloadTemplate = (section: SectionConfig<FinanceRow>) => {
    const rows = (sectionDataMap[section.key] || section.data).slice(0, 3).map((row) => {
      const record: Record<string, string> = {};
      section.columns.forEach((column) => {
        record[column.title] = String(row[column.key as keyof FinanceRow] ?? '');
      });
      return record;
    });
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${section.label}模板`);
    XLSX.writeFile(workbook, `${section.title}导入模板.xlsx`);
  };

  const getReportByRow = (row: FinanceRow) => reportPreviewMap[row.id] || createFallbackReportPreview(row);

  const openReportPreview = (row: FinanceRow) => {
    setSelectedReport(getReportByRow(row));
  };

  const openReportGeneration = (section: SectionConfig<FinanceRow>, row?: FinanceRow) => {
    setGenerationForm({
      template: row?.field1 || (section.key === 'report_income' ? '全省医保基金收支日报' : '定点医疗机构拨付进度表'),
      period: row?.field3 || (section.key === 'report_income' ? '2026-04-26' : '2026年第17周'),
      range: row?.field7 || '江苏省13个设区市',
      sectionKey: section.key,
      targetId: row?.id,
    });
  };

  const updateReportRow = (sectionKey: string, rowId: string, patch: Partial<FinanceRow>) => {
    setSectionDataMap((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).map((item) => (item.id === rowId ? { ...item, ...patch } : item)),
    }));
  };

  const createGeneratedReport = () => {
    if (!generationForm) return;

    const now = getNowString();
    const sectionRows = sectionDataMap[generationForm.sectionKey] || [];

    if (generationForm.targetId) {
      updateReportRow(generationForm.sectionKey, generationForm.targetId, {
        field1: generationForm.template,
        field3: generationForm.period,
        field4: '已生成',
        field5: '周岚',
        field6: now,
        field7: generationForm.range,
      });
      setFeedback(`${generationForm.template}已重新生成`);
    } else {
      const prefix = generationForm.sectionKey === 'report_income' ? 'SR' : 'BFB';
      const nextId = `${prefix}${String(sectionRows.length + 1).padStart(3, '0')}`;
      const type =
        generationForm.template.includes('专题') ? '专题' : generationForm.period.includes('周') ? '周报' : generationForm.period.includes('月') ? '月报' : '日报';
      const newRow: FinanceRow = {
        id: nextId,
        field1: generationForm.template,
        field2: type,
        field3: generationForm.period,
        field4: '已生成',
        field5: '周岚',
        field6: now,
        field7: generationForm.range,
      };
      setSectionDataMap((prev) => ({
        ...prev,
        [generationForm.sectionKey]: [newRow, ...(prev[generationForm.sectionKey] || [])],
      }));
      setFeedback(`${generationForm.template}已生成并加入目录`);
    }

    setGenerationForm(null);
    window.setTimeout(() => setFeedback(''), 1800);
  };

  const openAction = (action: ActionButton, row?: FinanceRow) => {
    if (!currentSection) return;

    if (action.label.includes('查询')) {
      setFeedback(`已完成${currentSection.title}查询`);
      window.setTimeout(() => setFeedback(''), 1800);
      return;
    }

    if (selectedModule === 'report' && action.label === '查看' && row) {
      openReportPreview(row);
      return;
    }

    if (selectedModule === 'report' && (action.label === '生成报表' || action.label === '生成' || action.label === '重新生成')) {
      openReportGeneration(currentSection, row);
      return;
    }

    if (selectedModule === 'report' && action.label === '导出' && row) {
      exportReportFile(getReportByRow(row));
      setFeedback(`${row.field1}已导出`);
      window.setTimeout(() => setFeedback(''), 1800);
      return;
    }

    if (selectedModule === 'report' && action.label === '导出目录') {
      exportSectionData(currentSection, filteredData);
      setFeedback(`${currentSection.title}目录已导出`);
      window.setTimeout(() => setFeedback(''), 1800);
      return;
    }

    if (selectedModule === 'report' && action.label === '发布' && row) {
      updateReportRow(currentSection.key, row.id, { field4: '已发布', field6: getNowString(), field5: '周岚' });
      setFeedback(`${row.field1}已发布`);
      window.setTimeout(() => setFeedback(''), 1800);
      return;
    }

    if (action.label.includes('导出')) {
      exportSectionData(currentSection, filteredData);
      setFeedback(`${currentSection.title}已导出`);
      window.setTimeout(() => setFeedback(''), 1800);
      return;
    }

    if (action.label.includes('导入')) {
      setPendingImportKey(currentSection.key);
      importInputRef.current?.click();
      return;
    }

    if (action.label.includes('模板')) {
      downloadTemplate(currentSection);
      setFeedback(`${currentSection.title}导入模板已生成`);
      window.setTimeout(() => setFeedback(''), 1800);
      return;
    }

    setPendingAction({
      title: action.action,
      target: row?.id || currentSection.label,
      confirmLabel: action.label,
    });
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !pendingImportKey) {
      event.target.value = '';
      return;
    }

    const section = Object.values(moduleSections)
      .flatMap((module) => module.sections)
      .find((item) => item.key === pendingImportKey);

    if (!section) {
      event.target.value = '';
      return;
    }

    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '', raw: false });
    const importedRows: FinanceRow[] = rows.map((item, index) => {
      const row: FinanceRow = {
        id: item['编号'] || `${pendingImportKey.toUpperCase()}IMP${String(index + 1).padStart(4, '0')}`,
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        field5: '',
        field6: '',
        field7: '',
      };
      section.columns.forEach((column) => {
        const key = String(column.key) as keyof FinanceRow;
        row[key] = String(item[column.title] || '');
      });
      return row;
    });

    if (importedRows.length) {
      setSectionDataMap((prev) => ({
        ...prev,
        [pendingImportKey]: [...importedRows, ...(prev[pendingImportKey] || [])],
      }));
      setFeedback(`已导入${importedRows.length}条${section.title}记录`);
      window.setTimeout(() => setFeedback(''), 1800);
    }

    setPendingImportKey('');
    event.target.value = '';
  };

  const confirmAction = () => {
    if (!pendingAction) return;
    setFeedback(`${pendingAction.title}已提交`);
    setPendingAction(null);
    window.setTimeout(() => setFeedback(''), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">财务管理工作台</h2>
          <p className="mt-1 text-sm text-gray-500">请选择具体财务业务环节进入办理。</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-md">
        <div className="grid grid-cols-4 gap-4">
          {overviewStats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-gray-800">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {financeModules.map((module) => (
          <button
            key={module.id}
            onClick={() => openModule(module.id)}
            className="group rounded-2xl border border-gray-200 bg-white p-8 text-left shadow-md transition-all hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl"
          >
            <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${module.color} shadow-lg`}>
              <module.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-800">{module.title}</h3>
            <p className="mb-5 text-base text-gray-500">{module.description}</p>
            <div className="flex items-center text-sm font-medium text-cyan-600 opacity-0 transition-opacity group-hover:opacity-100">
              <span>点击进入</span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>

      <input ref={importInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImportFile} />

      <AnimatePresence>
        {selectedModule && currentModule && currentSection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="max-h-[88vh] w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{currentModule.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{currentModule.desc}</p>
                </div>
                <button onClick={() => setSelectedModule(null)} className="rounded-xl p-2 hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 border-b border-gray-200 px-6 pt-4">
                {currentModule.sections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => switchSection(section.key)}
                    className={`rounded-t-xl border-b-2 px-4 py-2 text-sm ${
                      activeSection === section.key ? 'border-cyan-500 bg-cyan-50 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              {feedback && (
                <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {feedback}
                </div>
              )}

              <div className="max-h-[calc(88vh-136px)] overflow-auto p-6">
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
        {selectedReport && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-8 py-5">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedReport.reportName}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedReport.reportType} | {selectedReport.period} | {selectedReport.range}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => exportReportFile(selectedReport)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <Download className="mr-2 inline h-4 w-4" />
                    导出当前报表
                  </button>
                  <button
                    onClick={() =>
                      setGenerationForm({
                        template: selectedReport.reportName,
                        period: selectedReport.period,
                        range: selectedReport.range,
                        sectionKey: selectedReport.id.startsWith('SR') ? 'report_income' : 'report_payment',
                        targetId: selectedReport.id,
                      })
                    }
                    className="rounded-xl bg-cyan-600 px-4 py-2 text-sm text-white hover:bg-cyan-700"
                  >
                    <PlayCircle className="mr-2 inline h-4 w-4" />
                    重新生成
                  </button>
                  <button onClick={() => setSelectedReport(null)} className="rounded-xl p-2 hover:bg-gray-100">
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="max-h-[calc(90vh-88px)] overflow-auto px-8 py-6">
                <div className="grid grid-cols-4 gap-4">
                  {selectedReport.summary.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-gray-100 bg-slate-50 p-5">
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="mt-2 text-2xl font-bold text-gray-800">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-gray-200 bg-white">
                  <div className="grid grid-cols-4 gap-4 border-b border-gray-100 px-6 py-5">
                    <div>
                      <p className="text-sm text-gray-500">报表编号</p>
                      <p className="mt-1 font-semibold text-gray-800">{selectedReport.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">生成状态</p>
                      <div className="mt-1">{statusBadge(selectedReport.status)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">生成人</p>
                      <p className="mt-1 font-semibold text-gray-800">{selectedReport.owner}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">生成时间</p>
                      <p className="mt-1 font-semibold text-gray-800">{selectedReport.generatedAt}</p>
                    </div>
                  </div>

                  <div className="px-6 py-5">
                    <h4 className="text-lg font-bold text-gray-800">13市汇总预览</h4>
                    <p className="mt-1 text-sm text-gray-500">查看正式报表主体内容，支持单张导出和重新生成。</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">设区市</th>
                          <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">基金收入</th>
                          <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">基金支出</th>
                          <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">当期结余</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">备注</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedReport.cityRows.map((item) => (
                          <tr key={item.city} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-700">{item.city}</td>
                            <td className="px-6 py-4 text-right text-sm text-gray-700">{item.income}</td>
                            <td className="px-6 py-4 text-right text-sm text-gray-700">{item.expense}</td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-gray-800">{item.balance}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{item.remark}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {generationForm && (
          <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/30 p-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{generationForm.targetId ? '重新生成报表' : '生成报表'}</h4>
                  <p className="mt-1 text-sm text-gray-500">设置统计周期、数据范围和报表模板后生成正式报表。</p>
                </div>
                <button onClick={() => setGenerationForm(null)} className="rounded-xl p-2 hover:bg-gray-100">
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <div className="space-y-5 px-6 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-700">报表模板</span>
                    <input
                      value={generationForm.template}
                      onChange={(e) => setGenerationForm({ ...generationForm, template: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-700">统计周期</span>
                    <input
                      value={generationForm.period}
                      onChange={(e) => setGenerationForm({ ...generationForm, period: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">数据范围</span>
                  <input
                    value={generationForm.range}
                    onChange={(e) => setGenerationForm({ ...generationForm, range: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                  />
                </label>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                    <p className="text-sm text-cyan-700">目录定位</p>
                    <p className="mt-2 font-semibold text-cyan-900">{generationForm.sectionKey === 'report_income' ? '收支报表中心' : '拨付报表中心'}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">导出方式</p>
                    <p className="mt-2 font-semibold text-gray-800">单张报表导出</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">查看方式</p>
                    <p className="mt-2 font-semibold text-gray-800">报表预览弹窗</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-5">
                <button onClick={() => setGenerationForm(null)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                  取消
                </button>
                <button onClick={createGeneratedReport} className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm text-white hover:bg-cyan-700">
                  <FilePlus2 className="mr-2 inline h-4 w-4" />
                  确认生成
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingAction && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <h4 className="text-lg font-bold text-gray-800">业务办理确认</h4>
                <button onClick={() => setPendingAction(null)} className="rounded-xl p-2 hover:bg-gray-100">
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4 px-6 py-5">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">操作事项</p>
                  <p className="mt-1 font-semibold text-gray-800">{pendingAction.title}</p>
                  <p className="mt-3 text-sm text-gray-500">目标对象</p>
                  <p className="mt-1 text-gray-700">{pendingAction.target}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">
                    <ClipboardCheck className="mr-2 inline h-4 w-4" />
                    查看详情
                  </button>
                  <button className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">
                    <Upload className="mr-2 inline h-4 w-4" />
                    附件留痕
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-5">
                <button onClick={() => setPendingAction(null)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                  取消
                </button>
                <button onClick={confirmAction} className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm text-white hover:bg-cyan-700">
                  <PlayCircle className="mr-2 inline h-4 w-4" />
                  确认{pendingAction.confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
