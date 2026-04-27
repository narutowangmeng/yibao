import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  BookOpen,
  Building2,
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
  Wallet,
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
  key: keyof T;
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
  field8?: string;
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

interface BillDetailSection {
  label: string;
  items?: Array<{ label: string; value: string }>;
  rows?: Array<Record<string, string>>;
}

interface BillDetailModalState {
  type: 'receivable' | 'payable';
  row: FinanceRow;
  title: string;
  tabs: Array<{ key: string; label: string }>;
  sections: Record<string, BillDetailSection>;
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
  cityRows: Array<{ city: string; income: string; expense: string; balance: string; remark: string }>;
}

interface ReportGenerationForm {
  template: string;
  period: string;
  range: string;
  sectionKey: string;
  targetId?: string;
}

const financeModules: FinanceModule[] = [
  { id: 'arrival', title: '到账确认', icon: Landmark, color: 'from-emerald-500 to-emerald-600', description: '按应收账单、到账流水、到账差异三个阶段管理收入资金。' },
  { id: 'reconcile', title: '对账中心', icon: Scale, color: 'from-cyan-500 to-cyan-600', description: '统一处理日对账、月对账和跨系统核对。' },
  { id: 'difference', title: '差异处理', icon: AlertTriangle, color: 'from-rose-500 to-rose-600', description: '登记、核查并闭环处理差异问题。' },
  { id: 'payment', title: '拨付管理', icon: Send, color: 'from-blue-500 to-blue-600', description: '按应付账单、拨付批次、回盘结果三个阶段管理基金拨付。' },
  { id: 'ledger', title: '基金账务', icon: BookOpen, color: 'from-amber-500 to-amber-600', description: '基金总账、明细账、往来科目和余额跟踪。' },
  { id: 'report', title: '财务报表', icon: FileText, color: 'from-violet-500 to-violet-600', description: '收支、拨付和专题报表生成、预览、发布。' },
];

const overviewStats = [
  { label: '本月基金收入', value: '12.68亿元' },
  { label: '本月基金支出', value: '11.94亿元' },
  { label: '在途拨付金额', value: '2348.62万元' },
  { label: '财务异常提示', value: '5项' },
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

const receivableBillColumns: Array<TableColumn<FinanceRow>> = [
  { key: 'id', title: '账单号' },
  { key: 'field1', title: '缴费主体' },
  { key: 'field2', title: '险种' },
  { key: 'field3', title: '费款所属期' },
  { key: 'field4', title: '应收金额' },
  { key: 'field5', title: '已收金额' },
  { key: 'field6', title: '未收金额' },
  { key: 'field7', title: '账单状态' },
  { key: 'field8', title: '生成时间' },
];

const payableBillColumns: Array<TableColumn<FinanceRow>> = [
  { key: 'id', title: '账单号' },
  { key: 'field1', title: '结算对象' },
  { key: 'field2', title: '机构类型' },
  { key: 'field3', title: '结算周期' },
  { key: 'field4', title: '应付金额' },
  { key: 'field5', title: '已付金额' },
  { key: 'field6', title: '未付金额' },
  { key: 'field7', title: '拨付状态' },
  { key: 'field8', title: '结算批次' },
];

const arrivalExceptionColumns: Array<TableColumn<FinanceRow>> = [
  { key: 'id', title: '异常编号' },
  { key: 'field1', title: '关联账单/流水' },
  { key: 'field2', title: '异常类型' },
  { key: 'field3', title: '异常金额' },
  { key: 'field4', title: '当前状态' },
  { key: 'field5', title: '处理人' },
  { key: 'field6', title: '发现时间' },
  { key: 'field7', title: '异常说明' },
];

const arrivalFlowColumns: Array<TableColumn<FinanceRow>> = [
  { key: 'id', title: '流水号' },
  { key: 'field1', title: '到账渠道' },
  { key: 'field2', title: '付款主体/附言' },
  { key: 'field3', title: '到账金额' },
  { key: 'field4', title: '关联账单' },
  { key: 'field5', title: '匹配结果' },
  { key: 'field6', title: '处理人' },
  { key: 'field7', title: '到账时间' },
];

const paymentBatchColumns: Array<TableColumn<FinanceRow>> = [
  { key: 'id', title: '批次号' },
  { key: 'field1', title: '拨付类型' },
  { key: 'field2', title: '结算对象/范围' },
  { key: 'field3', title: '申请金额' },
  { key: 'field4', title: '批次状态' },
  { key: 'field5', title: '提交人' },
  { key: 'field6', title: '提交时间' },
];

const paymentBackColumns: Array<TableColumn<FinanceRow>> = [
  { key: 'id', title: '回盘号' },
  { key: 'field1', title: '回盘结果' },
  { key: 'field2', title: '关联机构/批次' },
  { key: 'field3', title: '回盘金额' },
  { key: 'field4', title: '处理状态' },
  { key: 'field5', title: '处理人' },
  { key: 'field6', title: '回盘时间' },
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
      { city: '南京', income: '5620万元', expense: '5180万元', balance: '440万元', remark: '门慢结算支出增长' },
      { city: '无锡', income: '3880万元', expense: '3640万元', balance: '240万元', remark: '职工医保收入稳定' },
      { city: '徐州', income: '4320万元', expense: '4080万元', balance: '240万元', remark: '居民医保支出平稳' },
      { city: '苏州', income: '6240万元', expense: '5960万元', balance: '280万元', remark: '异地清算量较大' },
      { city: '南通', income: '3280万元', expense: '3160万元', balance: '120万元', remark: '到账确认及时' },
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
      { city: '南京', income: '4800万元', expense: '4300万元', balance: '500万元', remark: '三甲医院批次已回盘' },
      { city: '苏州', income: '5600万元', expense: '5020万元', balance: '580万元', remark: '双通道药店已分发' },
      { city: '无锡', income: '3920万元', expense: '3510万元', balance: '410万元', remark: '待复核2批' },
      { city: '南通', income: '3180万元', expense: '2960万元', balance: '220万元', remark: '回盘正常' },
    ],
  },
};

const moduleSections: Record<ModuleId, { title: string; desc: string; sections: Array<SectionConfig<FinanceRow>> }> = {
  arrival: {
    title: '到账确认',
    desc: '先看应收账单，再核对到账流水，最后处理到账差异，流程更顺也更像真实财务业务。',
    sections: [
      {
        key: 'arrival_receivable',
        label: '应收账单',
        title: '应收账单',
        subtitle: '统一管理单位缴费、个人缴费、居民征缴和财政补助等应收账单，作为到账核对的源头台账。',
        importable: true,
        toolbar: [
          { label: '查询', action: '查询应收账单' },
          { label: '导入账单', action: '导入应收账单' },
          { label: '导出结果', action: '导出应收账单结果' },
        ],
        columns: receivableBillColumns,
        data: buildRows([
          { field1: '南京华宁科技有限公司', field2: '职工医保', field3: '2026年04月', field4: '84.26万元', field5: '84.26万元', field6: '0.00万元', field7: '已收清', field8: '2026-04-26 08:30' },
          { field1: '苏州恒川精密制造有限公司', field2: '职工医保', field3: '2026年04月', field4: '126.38万元', field5: '126.38万元', field6: '0.00万元', field7: '已收清', field8: '2026-04-26 08:42' },
          { field1: '无锡瑞康药业连锁有限公司', field2: '生育保险', field3: '2026年04月', field4: '18.42万元', field5: '0.00万元', field6: '18.42万元', field7: '待到账', field8: '2026-04-26 09:05' },
          { field1: '徐州云龙人力资源服务有限公司', field2: '灵活就业医保', field3: '2026年04月', field4: '42.87万元', field5: '38.11万元', field6: '4.76万元', field7: '部分到账', field8: '2026-04-26 09:16' },
          { field1: '常州经开区居民医保专户', field2: '城乡居民医保', field3: '2026年04月', field4: '65.30万元', field5: '65.30万元', field6: '0.00万元', field7: '已收清', field8: '2026-04-26 09:20' },
          { field1: '苏州工业园区财政局', field2: '财政补助', field3: '2026年第二季度', field4: '320.00万元', field5: '200.00万元', field6: '120.00万元', field7: '部分到账', field8: '2026-04-26 09:28' },
          { field1: '南通海门区教育局', field2: '学生居民医保', field3: '2026年春季学期', field4: '28.40万元', field5: '28.40万元', field6: '0.00万元', field7: '已收清', field8: '2026-04-26 09:36' },
          { field1: '连云港赣榆区退役军人事务局', field2: '退役军人医保补助', field3: '2026年04月', field4: '12.80万元', field5: '0.00万元', field6: '12.80万元', field7: '待到账', field8: '2026-04-26 09:48' },
          { field1: '淮安清江浦区社区居民专户', field2: '城乡居民医保', field3: '2026年04月', field4: '33.76万元', field5: '33.76万元', field6: '0.00万元', field7: '已收清', field8: '2026-04-26 09:54' },
          { field1: '盐城亭湖区灵活就业专户', field2: '灵活就业医保', field3: '2026年04月', field4: '21.95万元', field5: '18.52万元', field6: '3.43万元', field7: '部分到账', field8: '2026-04-26 10:02' },
          { field1: '扬州江都区医保中心', field2: '大病保险', field3: '2026年04月', field4: '15.68万元', field5: '15.68万元', field6: '0.00万元', field7: '已收清', field8: '2026-04-26 10:08' },
          { field1: '镇江丹徒区民政局', field2: '医疗救助配套补助', field3: '2026年第二季度', field4: '46.00万元', field5: '0.00万元', field6: '46.00万元', field7: '待到账', field8: '2026-04-26 10:16' },
          { field1: '泰州海陵区机关事业单位', field2: '职工医保', field3: '2026年04月', field4: '58.92万元', field5: '58.92万元', field6: '0.00万元', field7: '已收清', field8: '2026-04-26 10:22' },
          { field1: '宿迁宿豫区居民医保专户', field2: '城乡居民医保', field3: '2026年04月', field4: '25.73万元', field5: '19.73万元', field6: '6.00万元', field7: '部分到账', field8: '2026-04-26 10:30' },
        ], 'YS'),
        rowActions: (row) => [
          { label: '查看', action: `查看应收账单 ${row.id}` },
          { label: '关联流水', action: `关联流水 ${row.id}`, tone: 'primary' },
        ],
      },
      {
        key: 'arrival_confirm',
        label: '到账流水',
        title: '到账流水',
        subtitle: '统一接收银行回单、税务共享流水和财政拨款流水，完成与应收账单的匹配核对。',
        importable: true,
        toolbar: [
          { label: '查询', action: '查询到账流水' },
          { label: '导入流水', action: '导入到账流水' },
          { label: '导出结果', action: '导出到账流水结果' },
        ],
        columns: arrivalFlowColumns,
        data: buildRows([
          { field1: '建设银行省分行回单', field2: '南京华宁科技有限公司 / 职工医保2026年04月', field3: '84.26万元', field4: 'YS001', field5: '已匹配', field6: '周岚', field7: '2026-04-26 10:18' },
          { field1: '税务共享缴费流水', field2: '徐州云龙人力资源服务有限公司 / 灵活就业医保', field3: '38.11万元', field4: 'YS004', field5: '部分匹配', field6: '赵静', field7: '2026-04-26 10:26' },
          { field1: '财政补助拨款通知', field2: '苏州工业园区财政局 / 2026年第二季度补助', field3: '200.00万元', field4: 'YS006', field5: '已匹配', field6: '曹颖', field7: '2026-04-26 10:33' },
          { field1: '工商银行回单', field2: '连云港赣榆区退役军人事务局 / 退役军人补助', field3: '12.80万元', field4: 'YS008', field5: '待匹配', field6: '韩倩', field7: '2026-04-26 10:45' },
          { field1: '建设银行灵活就业专户', field2: '盐城亭湖区灵活就业专户 / 4月费款', field3: '18.52万元', field4: 'YS010', field5: '已匹配', field6: '曹颖', field7: '2026-04-26 11:02' },
          { field1: '民政专项补助流水', field2: '镇江丹徒区民政局 / 医疗救助配套补助', field3: '46.00万元', field4: 'YS012', field5: '待匹配', field6: '唐璐', field7: '2026-04-26 11:16' },
        ], 'LS'),
        rowActions: (row) => [
          { label: '查看', action: `查看到账流水 ${row.id}` },
          { label: '匹配账单', action: `匹配账单 ${row.id}`, tone: 'primary' },
        ],
      },
      {
        key: 'arrival_exception',
        label: '到账差异',
        title: '到账差异',
        subtitle: '统一登记少到账、错到账、重复到账和长时间未到账等差异问题，形成处理闭环。',
        importable: true,
        toolbar: [
          { label: '查询', action: '查询到账差异' },
          { label: '导入差异', action: '导入到账差异清单' },
          { label: '导出结果', action: '导出到账差异结果' },
        ],
        columns: arrivalExceptionColumns,
        data: buildRows([
          { field1: 'YS004 / 建行江苏省分行流水2404260018', field2: '少到账', field3: '4.76万元', field4: '处理中', field5: '赵静', field6: '2026-04-26 10:31', field7: '到账金额少于应收账单，待税务侧复核' },
          { field1: 'YS006 / 财政补助拨款通知2026Q2-12', field2: '到账延期', field3: '120.00万元', field4: '协查中', field5: '曹颖', field6: '2026-04-26 10:52', field7: '财政补助仅到账首笔，剩余未拨入' },
          { field1: 'YS008 / 工行回单20260426-2231', field2: '未到账', field3: '12.80万元', field4: '待处理', field5: '韩倩', field6: '2026-04-26 11:05', field7: '退役军人补助账单超时未回款' },
          { field1: 'YS014 / 农行回单20260426-8892', field2: '重复到账', field3: '19.73万元', field4: '待冲退', field5: '彭雪', field6: '2026-04-26 11:18', field7: '银行回单重复入账，需发起冲退处理' },
          { field1: 'YS012 / 民政专项补助流水20260426-17', field2: '错账', field3: '46.00万元', field4: '处理中', field5: '唐璐', field6: '2026-04-26 11:28', field7: '附言信息缺失，无法自动匹配账单' },
        ], 'YC'),
        rowActions: (row) => [
          { label: '查看', action: `查看到账差异 ${row.id}` },
          { label: '发起处理', action: `发起到账差异处理 ${row.id}`, tone: 'primary' },
        ],
      },
    ],
  },
  reconcile: {
    title: '对账中心',
    desc: '负责系统间对账和批次核对，重点看是否对平，不直接承担差异处置。',
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
          { label: '导出结果', action: '导出月度对账结果' },
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
    desc: '承接到账侧和对账侧抛转的问题，完成登记、核查、协办和办结闭环。',
    sections: [
      {
        key: 'difference_register',
        label: '差异登记',
        title: '差异登记',
        subtitle: '登记新发生的到账和对账差异。',
        importable: true,
        toolbar: [
          { label: '查询', action: '查询差异登记' },
          { label: '导入差异', action: '导入差异清单' },
          { label: '导出结果', action: '导出差异清单' },
        ],
        columns: commonColumns,
        data: buildRows([
          { field1: '到账金额不一致', field2: 'DZP20260426-03', field3: '12.00万元', field4: '处理中', field5: '许文博', field6: '2026-04-26 11:20' },
          { field1: '银行回单缺单位编码', field2: 'DZP20260426-04', field3: '3.26万元', field4: '待补录', field5: '陆雨桐', field6: '2026-04-26 11:32' },
          { field1: '重复入账', field2: 'DZP20260425-11', field3: '5.60万元', field4: '待冲回', field5: '韩嘉铭', field6: '2026-04-26 12:08' },
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
          { label: '导入协查', action: '导入协查清单' },
          { label: '导出结果', action: '导出协查结果' },
        ],
        columns: commonColumns,
        data: buildRows([
          { field1: '财政补助未到账', field2: 'DZP20260425-08', field3: '18.00万元', field4: '协查中', field5: '陈知远', field6: '2026-04-26 13:08' },
          { field1: '银行回盘金额偏差', field2: 'BF20260424015', field3: '600元', field4: '待回复', field5: '陆敏', field6: '2026-04-26 13:20' },
          { field1: '税务到账日期异常', field2: 'SW20260426002', field3: '35.16万元', field4: '已核实', field5: '邵琳', field6: '2026-04-26 13:48' },
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
    desc: '先形成应付账单，再汇总拨付批次，最后核对银行回盘结果，流程和到账侧对应。',
    sections: [
      {
        key: 'payment_payable',
        label: '应付账单',
        title: '应付账单',
        subtitle: '统一管理定点医疗机构、药店、零星报销和异地结算等应付账单。',
        toolbar: [
          { label: '查询', action: '查询应付账单' },
          { label: '导出清单', action: '导出应付账单清单' },
        ],
        columns: payableBillColumns,
        data: buildRows([
          { field1: '南京市第一医院', field2: '三甲医院', field3: '2026年04月上旬', field4: '285.00万元', field5: '0.00万元', field6: '285.00万元', field7: '待拨付', field8: 'JSJF202604-NJ-001' },
          { field1: '苏州大学附属第一医院', field2: '三甲医院', field3: '2026年04月上旬', field4: '420.00万元', field5: '0.00万元', field6: '420.00万元', field7: '待复核', field8: 'JSJF202604-SZ-003' },
          { field1: '无锡市人民医院', field2: '三甲医院', field3: '2026年04月上旬', field4: '198.00万元', field5: '0.00万元', field6: '198.00万元', field7: '退回重提', field8: 'JSJF202604-WX-002' },
          { field1: '徐州广济连锁大药房双通道门店', field2: '双通道药店', field3: '2026年04月第3周', field4: '56.80万元', field5: '56.80万元', field6: '0.00万元', field7: '已拨付', field8: 'JSJF202604-XZ-011' },
          { field1: '常州市第二人民医院', field2: '三甲医院', field3: '2026年04月上旬', field4: '176.50万元', field5: '80.00万元', field6: '96.50万元', field7: '部分拨付', field8: 'JSJF202604-CZ-004' },
          { field1: '苏州工业园区星湖医院', field2: '社区医院', field3: '2026年04月门慢结算', field4: '32.40万元', field5: '0.00万元', field6: '32.40万元', field7: '待拨付', field8: 'JSJF202604-SZ-018' },
          { field1: '南通市第一人民医院', field2: '三甲医院', field3: '2026年04月上旬', field4: '223.00万元', field5: '223.00万元', field6: '0.00万元', field7: '已拨付', field8: 'JSJF202604-NT-006' },
          { field1: '连云港市第一人民医院', field2: '三甲医院', field3: '2026年04月异地清算', field4: '128.60万元', field5: '0.00万元', field6: '128.60万元', field7: '待审核', field8: 'JSJF202604-LYG-005' },
          { field1: '淮安市淮阴医院', field2: '三级医院', field3: '2026年04月住院结算', field4: '96.30万元', field5: '96.30万元', field6: '0.00万元', field7: '已拨付', field8: 'JSJF202604-HA-009' },
          { field1: '盐城华泽大药房双通道门店', field2: '双通道药店', field3: '2026年04月第3周', field4: '41.72万元', field5: '0.00万元', field6: '41.72万元', field7: '待拨付', field8: 'JSJF202604-YC-016' },
          { field1: '扬州市中医院', field2: '三甲医院', field3: '2026年04月门特结算', field4: '87.65万元', field5: '30.00万元', field6: '57.65万元', field7: '部分拨付', field8: 'JSJF202604-YZ-010' },
          { field1: '镇江市第一人民医院', field2: '三甲医院', field3: '2026年04月上旬', field4: '164.20万元', field5: '0.00万元', field6: '164.20万元', field7: '待拨付', field8: 'JSJF202604-ZJ-007' },
          { field1: '泰州人民医院', field2: '三甲医院', field3: '2026年04月零星报销', field4: '24.86万元', field5: '24.86万元', field6: '0.00万元', field7: '已拨付', field8: 'JSJF202604-TZ-013' },
          { field1: '宿迁市第一人民医院', field2: '三甲医院', field3: '2026年04月异地清算', field4: '78.44万元', field5: '0.00万元', field6: '78.44万元', field7: '待复核', field8: 'JSJF202604-SQ-012' },
        ], 'YF'),
        rowActions: (row) => [
          { label: '查看', action: `查看应付账单 ${row.id}` },
          { label: '生成批次', action: `生成拨付批次 ${row.id}`, tone: 'primary' },
        ],
      },
      {
        key: 'payment_apply',
        label: '拨付批次',
        title: '拨付批次',
        subtitle: '查看由应付账单汇总生成的待提交、待审核、退回重提和已发送银行批次。',
        toolbar: [
          { label: '查询', action: '查询拨付批次' },
          { label: '导出清单', action: '导出拨付批次清单' },
        ],
        columns: paymentBatchColumns,
        data: buildRows([
          { field1: '住院结算拨付', field2: '南京市第一医院等12家机构', field3: '285.00万元', field4: '待审核', field5: '周岚', field6: '2026-04-26 09:30' },
          { field1: '住院结算拨付', field2: '苏州大学附属第一医院等9家机构', field3: '420.00万元', field4: '待复核', field5: '陆敏', field6: '2026-04-26 09:52' },
          { field1: '住院结算拨付', field2: '无锡市人民医院等7家机构', field3: '198.00万元', field4: '退回重提', field5: '钱莉', field6: '2026-04-26 10:20' },
          { field1: '双通道特药拨付', field2: '盐城华泽大药房等18家药店', field3: '41.72万元', field4: '待审核', field5: '曹颖', field6: '2026-04-26 10:42' },
          { field1: '异地结算拨付', field2: '宿迁市第一人民医院等5家机构', field3: '78.44万元', field4: '待复核', field5: '彭雪', field6: '2026-04-26 11:08' },
        ], 'BF'),
        rowActions: (row) => [
          { label: '查看', action: `查看拨付批次 ${row.id}` },
          { label: '发送银行', action: `发送银行 ${row.id}`, tone: 'primary' },
        ],
      },
      {
        key: 'payment_back',
        label: '回盘结果',
        title: '回盘结果',
        subtitle: '查看银行回盘成功、失败、退回重提等结果，并与拨付批次进行闭环核对。',
        toolbar: [
          { label: '查询', action: '查询回盘结果' },
          { label: '导出回盘', action: '导出回盘结果' },
        ],
        columns: paymentBackColumns,
        data: buildRows([
          { field1: '回盘成功', field2: '南京市第一医院 / BF001', field3: '285.00万元', field4: '已到账', field5: '周岚', field6: '2026-04-26 14:10' },
          { field1: '回盘成功', field2: '南通市第一人民医院 / BF006', field3: '223.00万元', field4: '已到账', field5: '高宁', field6: '2026-04-26 14:18' },
          { field1: '回盘退回', field2: '苏州市立医院 / BF002', field3: '209.00万元', field4: '待重提', field5: '陆敏', field6: '2026-04-26 14:26' },
          { field1: '回盘成功', field2: '徐州广济连锁大药房双通道门店 / BF011', field3: '56.80万元', field4: '已到账', field5: '赵静', field6: '2026-04-26 14:32' },
          { field1: '回盘退回', field2: '宿迁市第一人民医院 / BF005', field3: '78.44万元', field4: '待重提', field5: '彭雪', field6: '2026-04-26 14:45' },
        ], 'HP'),
        rowActions: (row) => [
          { label: '查看', action: `查看回盘结果 ${row.id}` },
          { label: '发起重提', action: `发起回盘重提 ${row.id}`, tone: 'primary' },
        ],
      },
    ],
  },
  ledger: {
    title: '基金账务',
    desc: '聚焦基金入账后的会计视角，查看科目余额、凭证明细和往来挂账情况。',
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
          { field1: '100201', field2: '职工医保基金收入', field3: '本日借方 1260.00万元', field4: '余额正常', field5: '周岚', field6: '2026-04-26 15:00' },
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
    desc: '统一管理基金收支、拨付进度和专题分析报表，支持生成、预览、导出和发布。',
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
    已收清: 'bg-emerald-100 text-emerald-700',
    对平: 'bg-emerald-100 text-emerald-700',
    已到账: 'bg-emerald-100 text-emerald-700',
    已拨付: 'bg-emerald-100 text-emerald-700',
    已记账: 'bg-emerald-100 text-emerald-700',
    已生成: 'bg-emerald-100 text-emerald-700',
    已发布: 'bg-blue-100 text-blue-700',
    已核实: 'bg-cyan-100 text-cyan-700',
    部分到账: 'bg-amber-100 text-amber-700',
    部分拨付: 'bg-amber-100 text-amber-700',
    待到账: 'bg-amber-100 text-amber-700',
    待确认: 'bg-amber-100 text-amber-700',
    待复核: 'bg-amber-100 text-amber-700',
    待审核: 'bg-yellow-100 text-yellow-700',
    处理中: 'bg-rose-100 text-rose-700',
    协查中: 'bg-rose-100 text-rose-700',
    退回重提: 'bg-rose-100 text-rose-700',
    退回修订: 'bg-rose-100 text-rose-700',
    待冲退: 'bg-orange-100 text-orange-700',
    待核销: 'bg-orange-100 text-orange-700',
    余额正常: 'bg-slate-100 text-slate-700',
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
      { city: '南京', income: '4260万元', expense: '4020万元', balance: '240万元', remark: '自动汇总生成' },
      { city: '苏州', income: '5180万元', expense: '4860万元', balance: '320万元', remark: '支持单张导出' },
      { city: '徐州', income: '3760万元', expense: '3520万元', balance: '240万元', remark: '待人工复核' },
      { city: '南通', income: '2980万元', expense: '2770万元', balance: '210万元', remark: '可继续发布' },
    ],
  };
}

function buildReceivableBillDetail(row: FinanceRow): BillDetailModalState {
  const payerCodeMap: Record<string, string> = {
    南京华宁科技有限公司: '91320104759423198K',
    苏州恒川精密制造有限公司: '91320594682137456Q',
    无锡瑞康药业连锁有限公司: '91320214681273654M',
    徐州云龙人力资源服务有限公司: '91320303694527361L',
    常州经开区居民医保专户: 'CZJKQJMYB202604',
    苏州工业园区财政局: 'SZGYYQCZJ2026Q2',
    南通海门区教育局: 'NTHMJYJ2026S1',
    连云港赣榆区退役军人事务局: 'LYGGYTYJRSW202604',
    淮安清江浦区社区居民专户: 'HAQJPJM202604',
    盐城亭湖区灵活就业专户: 'YCTHLHJY202604',
    扬州江都区医保中心: 'YZJDYBZX202604',
    镇江丹徒区民政局: 'ZJDTMZJ2026Q2',
    泰州海陵区机关事业单位: 'TZHLJG202604',
    宿迁宿豫区居民医保专户: 'SQSYJM202604',
  };

  const mainItems = [
    { label: '账单号', value: row.id },
    { label: '缴费主体', value: row.field1 },
    { label: '主体编码', value: payerCodeMap[row.field1] || `${row.id}-CODE` },
    { label: '险种', value: row.field2 },
    { label: '费款所属期', value: row.field3 },
    { label: '账单状态', value: row.field7 || '待处理' },
    { label: '生成时间', value: row.field8 || row.field6 },
    { label: '经办机构', value: `${row.field1.slice(0, 2)}医保中心` },
  ];

  const amountItems = [
    { label: '应收金额', value: row.field4 },
    { label: '已收金额', value: row.field5 },
    { label: '未收金额', value: row.field6 },
    { label: '单位应缴', value: row.field2.includes('职工') ? row.field4 : '0.00万元' },
    { label: '个人应缴', value: row.field2.includes('职工') || row.field2.includes('灵活') ? '18.26万元' : '0.00万元' },
    { label: '财政补助', value: row.field2.includes('财政') || row.field2.includes('补助') ? row.field4 : '0.00万元' },
    { label: '滞纳金', value: '0.00万元' },
    { label: '减免金额', value: '0.00万元' },
  ];

  const arrivalItems = [
    { label: '到账银行', value: '中国建设银行江苏省分行营业部' },
    { label: '回单号', value: `HD${row.id.slice(-3)}20260426` },
    { label: '银行流水号', value: `JSYH20260426${row.id.slice(-3)}` },
    { label: '到账时间', value: row.field7 === '待到账' ? '-' : `${row.field8 || row.field6} 10:28` },
    { label: '到账方式', value: row.field2.includes('财政') ? '财政专户拨入' : '银行托收到账' },
    { label: '到账批次', value: `ARR-${row.id}` },
    { label: '到账结果', value: row.field7 || '待处理' },
    { label: '备注', value: row.field7 === '部分到账' ? '到账金额与账单金额存在差额，待差异处理。' : '账单到账信息完整。' },
  ];

  const trackRows = [
    { 环节: '账单生成', 时间: row.field8 || row.field6, 处理人: '系统自动', 结果: '已生成', 说明: '根据征缴台账自动生成应收账单' },
    { 环节: '账单推送', 时间: row.field8 || row.field6, 处理人: '周岚', 结果: '已发送', 说明: '已推送到到账确认队列' },
    { 环节: '到账确认', 时间: row.field7 === '待到账' ? '-' : row.field6, 处理人: row.field1.slice(0, 2) + '财务岗', 结果: row.field7 || '待确认', 说明: row.field7 === '部分到账' ? '存在部分到账差额' : '到账信息已核验' },
    { 环节: '差异处理', 时间: row.field7 === '部分到账' ? row.field6 : '-', 处理人: row.field7 === '部分到账' ? '赵静' : '-', 结果: row.field7 === '部分到账' ? '处理中' : '无需处理', 说明: row.field7 === '部分到账' ? '待补核对税务侧明细' : '无差异' },
  ];

  return {
    type: 'receivable',
    row,
    title: `应收账单详情 - ${row.id}`,
    tabs: [
      { key: 'basic', label: '基本信息' },
      { key: 'amount', label: '金额构成' },
      { key: 'arrival', label: '到账信息' },
      { key: 'track', label: '处理轨迹' },
    ],
    sections: {
      basic: { label: '基本信息', items: mainItems },
      amount: { label: '金额构成', items: amountItems },
      arrival: { label: '到账信息', items: arrivalItems },
      track: { label: '处理轨迹', rows: trackRows },
    },
  };
}

function buildPayableBillDetail(row: FinanceRow): BillDetailModalState {
  const instCodeMap: Record<string, string> = {
    南京市第一医院: 'H3201000001',
    苏州大学附属第一医院: 'H3205000003',
    无锡市人民医院: 'H3202000002',
    徐州广济连锁大药房双通道门店: 'P3203001016',
    常州市第二人民医院: 'H3204000005',
    苏州工业园区星湖医院: 'H3205001048',
    南通市第一人民医院: 'H3206000001',
    连云港市第一人民医院: 'H3207000001',
    淮安市淮阴医院: 'H3208000017',
    盐城华泽大药房双通道门店: 'P3209001022',
    扬州市中医院: 'H3210000006',
    镇江市第一人民医院: 'H3211000001',
    泰州人民医院: 'H3212000001',
    宿迁市第一人民医院: 'H3213000001',
  };

  const basicItems = [
    { label: '账单号', value: row.id },
    { label: '结算对象', value: row.field1 },
    { label: '机构类型', value: row.field2 },
    { label: '医保定点编码', value: instCodeMap[row.field1] || `${row.id}-INST` },
    { label: '结算周期', value: row.field3 },
    { label: '结算批次', value: row.field8 || `JSJF-${row.id}` },
    { label: '开户行', value: '中国银行江苏省分行营业部' },
    { label: '收款账号', value: `622848******${row.id.slice(-4)}` },
  ];

  const amountItems = [
    { label: '应付金额', value: row.field4 },
    { label: '已付金额', value: row.field5 },
    { label: '未付金额', value: row.field6 },
    { label: '统筹基金支付', value: row.field4 },
    { label: '大病保险支付', value: row.field2.includes('三甲') ? '18.50万元' : '6.80万元' },
    { label: '医疗救助支付', value: row.field2.includes('社区') ? '2.40万元' : '0.00万元' },
    { label: '个人账户支付', value: row.field2.includes('药店') ? '4.10万元' : '0.00万元' },
    { label: '退回金额', value: row.field7 === '退回重提' ? row.field4 : '0.00万元' },
  ];

  const settlementRows = [
    { 结算单号: `${row.id}-01`, 业务类型: row.field2.includes('药店') ? '双通道特药结算' : '住院结算', 人次: '126', 费用总额: '312.40万元', 基金支付: '285.00万元', 状态: '已汇总' },
    { 结算单号: `${row.id}-02`, 业务类型: row.field2.includes('社区') ? '门慢门特结算' : '异地结算', 人次: '84', 费用总额: '108.20万元', 基金支付: '96.30万元', 状态: '已汇总' },
    { 结算单号: `${row.id}-03`, 业务类型: '零星报销结算', 人次: '23', 费用总额: '26.85万元', 基金支付: '24.86万元', 状态: row.field7 === '待审核' ? '待审核' : '已汇总' },
  ];

  const trackRows = [
    { 环节: '账单生成', 时间: '2026-04-26 08:20', 处理人: '系统自动', 结果: '已生成', 说明: '根据结算清单自动汇总应付账单' },
    { 环节: '拨付申请', 时间: '2026-04-26 09:30', 处理人: '周岚', 结果: '已提交', 说明: '已生成拨付申请批次' },
    { 环节: '审核复核', 时间: '2026-04-26 10:18', 处理人: '陆敏', 结果: row.field7 || '待审核', 说明: row.field7 === '退回重提' ? '账户信息校验未通过，已退回' : '正在按流程复核' },
    { 环节: '银行回盘', 时间: row.field7 === '已拨付' ? '2026-04-26 14:32' : '-', 处理人: row.field7 === '已拨付' ? '高宁' : '-', 结果: row.field7 === '已拨付' ? '回盘成功' : '待回盘', 说明: row.field7 === '已拨付' ? '回盘状态正常，资金已到账' : '尚未进入回盘确认环节' },
  ];

  return {
    type: 'payable',
    row,
    title: `应付账单详情 - ${row.id}`,
    tabs: [
      { key: 'basic', label: '基本信息' },
      { key: 'amount', label: '金额构成' },
      { key: 'settlement', label: '结算清单' },
      { key: 'track', label: '拨付轨迹' },
    ],
    sections: {
      basic: { label: '基本信息', items: basicItems },
      amount: { label: '金额构成', items: amountItems },
      settlement: { label: '结算清单', rows: settlementRows },
      track: { label: '拨付轨迹', rows: trackRows },
    },
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
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h4 className="text-2xl font-bold text-gray-800">{title}</h4>
            <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {toolbar.map((action) => (
              <button
                key={action.label}
                onClick={() => onAction(action)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${toneButtonClass(action.tone)}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="输入关键字查询当前页数据"
              className="w-full rounded-2xl border border-gray-200 py-3 pl-12 pr-4 text-sm text-gray-700 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
            />
          </div>
          <button
            onClick={() => onAction({ label: '查询', action: `查询${title}` })}
            className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            查询
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full min-w-[1180px]">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-4 text-sm font-medium text-gray-600 ${
                    column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {column.title}
                </th>
              ))}
              <th className="sticky right-0 z-10 bg-gray-50 px-6 py-4 text-right text-sm font-medium text-gray-600 shadow-[-10px_0_18px_-16px_rgba(15,23,42,0.28)]">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((column) => {
                  const value = row[column.key];
                  const isStatus = typeof value === 'string' && ['已确认', '已收清', '对平', '已到账', '已拨付', '已记账', '已生成', '已发布', '已核实', '部分到账', '部分拨付', '待到账', '待确认', '待复核', '待审核', '处理中', '协查中', '退回重提', '退回修订', '待冲退', '待核销', '余额正常'].includes(value);
                  return (
                    <td
                      key={String(column.key)}
                      className={`px-6 py-5 text-sm text-gray-700 ${
                        column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {isStatus ? statusBadge(String(value)) : String(value ?? '-')}
                    </td>
                  );
                })}
                <td className="sticky right-0 bg-white px-6 py-5 text-right shadow-[-10px_0_18px_-16px_rgba(15,23,42,0.28)]">
                  <div className="flex justify-end gap-2">
                    {rowActions(row).map((action) => (
                      <button
                        key={action.label}
                        onClick={() => onAction(action, row)}
                        className={`rounded-xl px-3 py-2 text-sm font-medium transition ${toneButtonClass(action.tone)}`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DetailInfoGrid({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="text-xs text-gray-500">{item.label}</div>
          <div className="mt-2 text-sm font-medium text-gray-800 break-all">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function DetailRowsTable({ rows }: { rows: Array<Record<string, string>> }) {
  if (!rows.length) return null;
  const headers = Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200">
      <table className="w-full min-w-[680px]">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-600">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row, index) => (
            <tr key={`${index}-${row[headers[0]] || 'row'}`} className="hover:bg-gray-50">
              {headers.map((header) => (
                <td key={header} className="px-4 py-3 text-sm text-gray-700">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
  const [billDetail, setBillDetail] = useState<BillDetailModalState | null>(null);
  const [billDetailTab, setBillDetailTab] = useState('');
  const [pendingImportKey, setPendingImportKey] = useState('');
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
    setBillDetail(null);
    setBillDetailTab('');
  };

  const switchSection = (sectionKey: string) => {
    setActiveSection(sectionKey);
    setKeyword('');
    setBillDetail(null);
    setBillDetailTab('');
  };

  const exportSectionData = (section: SectionConfig<FinanceRow>, rows: FinanceRow[]) => {
    const exportRows = rows.map((row) => {
      const record: Record<string, string> = {};
      section.columns.forEach((column) => {
        record[column.title] = String(row[column.key] ?? '');
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
        record[column.title] = String(row[column.key] ?? '');
      });
      return record;
    });
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${section.label}模板`);
    XLSX.writeFile(workbook, `${section.title}导入模板.xlsx`);
  };

  const getReportByRow = (row: FinanceRow) => reportPreviewMap[row.id] || createFallbackReportPreview(row);

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
        field8: '',
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
      window.setTimeout(() => setFeedback(''), 1600);
      return;
    }

    if (selectedModule === 'arrival' && currentSection.key === 'arrival_receivable' && action.label === '查看' && row) {
      const nextDetail = buildReceivableBillDetail(row);
      setBillDetail(nextDetail);
      setBillDetailTab(nextDetail.tabs[0].key);
      return;
    }

    if (selectedModule === 'payment' && currentSection.key === 'payment_payable' && action.label === '查看' && row) {
      const nextDetail = buildPayableBillDetail(row);
      setBillDetail(nextDetail);
      setBillDetailTab(nextDetail.tabs[0].key);
      return;
    }

    if (selectedModule === 'report' && action.label === '查看' && row) {
      setSelectedReport(getReportByRow(row));
      return;
    }

    if (selectedModule === 'report' && (action.label === '生成报表' || action.label === '生成' || action.label === '重新生成')) {
      setGenerationForm({
        template: row?.field1 || (currentSection.key === 'report_income' ? '全省医保基金收支日报' : '定点医疗机构拨付进度表'),
        period: row?.field3 || (currentSection.key === 'report_income' ? '2026-04-26' : '2026年第17周'),
        range: row?.field7 || '江苏省13个设区市',
        sectionKey: currentSection.key,
        targetId: row?.id,
      });
      return;
    }

    if (selectedModule === 'report' && action.label === '导出' && row) {
      exportReportFile(getReportByRow(row));
      setFeedback(`${row.field1}已导出`);
      window.setTimeout(() => setFeedback(''), 1600);
      return;
    }

    if (selectedModule === 'report' && action.label === '发布' && row) {
      updateReportRow(currentSection.key, row.id, { field4: '已发布', field6: getNowString(), field5: '周岚' });
      setFeedback(`${row.field1}已发布`);
      window.setTimeout(() => setFeedback(''), 1600);
      return;
    }

    if (action.label.includes('导出')) {
      exportSectionData(currentSection, filteredData);
      setFeedback(`${currentSection.title}已导出`);
      window.setTimeout(() => setFeedback(''), 1600);
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
      window.setTimeout(() => setFeedback(''), 1600);
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

    const importedRows: FinanceRow[] = rows.map((row, index) => {
      const record: FinanceRow = {
        id: `${pendingImportKey.toUpperCase().slice(0, 3)}${String(index + 1).padStart(3, '0')}`,
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        field5: '',
        field6: '',
        field7: '',
        field8: '',
      };
      section.columns.forEach((column) => {
        const value = row[column.title] || '';
        record[column.key] = value;
      });
      return record;
    });

    setSectionDataMap((prev) => ({
      ...prev,
      [pendingImportKey]: [...importedRows, ...(prev[pendingImportKey] || [])],
    }));
    setFeedback(`${section.title}已导入${importedRows.length}条记录`);
    window.setTimeout(() => setFeedback(''), 1600);
    event.target.value = '';
    setPendingImportKey('');
  };

  const confirmAction = () => {
    if (!pendingAction) return;
    setFeedback(`${pendingAction.title}已办理`);
    setPendingAction(null);
    window.setTimeout(() => setFeedback(''), 1600);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {overviewStats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {financeModules.map((module, index) => (
          <motion.button
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => openModule(module.id)}
            className="group rounded-3xl border border-gray-200 bg-white p-8 text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl"
          >
            <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${module.color}`}>
              <module.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{module.title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-500">{module.description}</p>
          </motion.button>
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
              className="max-h-[88vh] w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800">{currentModule.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{currentModule.desc}</p>
                </div>
                <button onClick={() => setSelectedModule(null)} className="rounded-xl p-2 hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 border-b border-gray-200 px-8 pt-5">
                {currentModule.sections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => switchSection(section.key)}
                    className={`rounded-t-2xl border-b-2 px-6 py-3 text-sm font-medium ${
                      activeSection === section.key ? 'border-cyan-500 bg-cyan-50 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              {feedback && (
                <div className="mx-8 mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {feedback}
                </div>
              )}

              <div className="max-h-[calc(88vh-148px)] overflow-hidden p-8">
                <div className="flex h-full gap-6">
                  <div className={`${billDetail ? 'min-w-0 flex-1' : 'w-full'}`}>
                    <div className="h-full overflow-auto pr-1">
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
                  </div>

                  {billDetail && (
                    <div className="w-[420px] shrink-0 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                      <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">{billDetail.title}</h4>
                          <p className="mt-1 text-xs text-gray-500">
                            {billDetail.type === 'receivable' ? '查看应收账单的主体、金额、到账和轨迹信息。' : '查看应付账单的结算、金额、清单和拨付轨迹。'}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setBillDetail(null);
                            setBillDetailTab('');
                          }}
                          className="rounded-xl p-2 hover:bg-gray-100"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 border-b border-gray-100 px-4 pt-4">
                        {billDetail.tabs.map((tab) => (
                          <button
                            key={tab.key}
                            onClick={() => setBillDetailTab(tab.key)}
                            className={`rounded-t-xl border-b-2 px-4 py-2 text-sm ${
                              billDetailTab === tab.key ? 'border-cyan-500 bg-cyan-50 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      <div className="h-[calc(88vh-250px)] overflow-auto p-5">
                        {billDetailTab && billDetail.sections[billDetailTab] && (
                          <div className="space-y-4">
                            <div>
                              <h5 className="text-base font-bold text-gray-800">{billDetail.sections[billDetailTab].label}</h5>
                            </div>
                            {billDetail.sections[billDetailTab].items && <DetailInfoGrid items={billDetail.sections[billDetailTab].items!} />}
                            {billDetail.sections[billDetailTab].rows && <DetailRowsTable rows={billDetail.sections[billDetailTab].rows!} />}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
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
