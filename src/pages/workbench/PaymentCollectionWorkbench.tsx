import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CreditCard,
  FileSpreadsheet,
  Landmark,
  Printer,
  QrCode,
  Receipt,
  ScanLine,
  Search,
  Smartphone,
  Wallet,
  X,
} from 'lucide-react';

type ModuleId = 'unit' | 'personal' | 'bill' | 'record' | 'arrival' | 'receipt';
type PaymentMethod = '银联' | '微信' | '支付宝' | '现金支付';

interface ModuleConfig {
  id: ModuleId;
  title: string;
  icon: React.ElementType;
  desc: string;
  color: string;
}

interface UnitPayment {
  id: string;
  city: string;
  payer: string;
  unitCode: string;
  socialCreditCode: string;
  contactName: string;
  contactPhone: string;
  period: string;
  insuranceType: string;
  amount: string;
  method: PaymentMethod;
  status: '待支付' | '已支付' | '已到账' | '待核验';
}

interface PersonalPayment {
  id: string;
  city: string;
  payer: string;
  gender: '男' | '女';
  credentialNo: string;
  insuredNo: string;
  phone: string;
  category: string;
  amount: string;
  method: PaymentMethod;
  status: '待支付' | '已支付' | '已到账';
}

interface PaymentBill {
  id: string;
  subject: string;
  type: string;
  period: string;
  count: string;
  issuer: string;
  status: '已生成' | '部分支付' | '已关闭' | '待处理';
}

interface PaymentRecord {
  id: string;
  payer: string;
  business: string;
  amount: string;
  method: PaymentMethod;
  transactionRef: string;
  operator: string;
  time: string;
}

interface ArrivalRecord {
  id: string;
  payer: string;
  business: string;
  channel: string;
  batch: string;
  amount: string;
  transactionRef: string;
  bankSerial: string;
  receiveTime: string;
  status: '已到账' | '部分到账' | '待回传' | '已核销';
}

interface ReceiptRecord {
  id: string;
  payer: string;
  voucher: string;
  method: PaymentMethod;
  status: '可打印' | '已归档';
  businessType: string;
  amount: string;
  payTime: string;
  operator: string;
  agency: string;
  period: string;
  batchNo: string;
  transactionRef: string;
  remark: string;
}

interface CreatePaymentDraft {
  payer: string;
  amount: string;
  periodOrCategory: string;
  method: PaymentMethod;
  identityNo: string;
  externalCode: string;
  contactName: string;
  contactPhone: string;
  gender: '男' | '女';
}

const unionPayAccount = {
  bankName: '中国建设银行南京鼓楼支行',
  accountName: '江苏省医疗保障局医保基金收入户',
  accountNo: '32050188001234567890',
  bankCode: '105301000123',
};

const paymentMethods: PaymentMethod[] = ['银联', '微信', '支付宝', '现金支付'];

const modules: ModuleConfig[] = [
  { id: 'unit', title: '单位缴费', icon: Building2, desc: '单位申报缴费，支持银联、微信、支付宝、现金支付', color: 'from-cyan-500 to-sky-600' },
  { id: 'personal', title: '个人缴费', icon: Wallet, desc: '灵活就业、城乡居民等个人缴费办理', color: 'from-emerald-500 to-teal-600' },
  { id: 'bill', title: '缴费单管理', icon: FileSpreadsheet, desc: '缴费单生成、关闭、状态流转处理', color: 'from-indigo-500 to-blue-600' },
  { id: 'record', title: '缴费记录查询', icon: Search, desc: '单位、个人缴费记录统一查询', color: 'from-violet-500 to-fuchsia-600' },
  { id: 'arrival', title: '到账状态查询', icon: Landmark, desc: '查询银行回单、税务回传和到账状态', color: 'from-amber-500 to-orange-600' },
  { id: 'receipt', title: '缴费回执打印', icon: Printer, desc: '缴费回执、电子凭证、打印清单', color: 'from-rose-500 to-pink-600' },
];

const initialUnitPayments: UnitPayment[] = [
  { id: 'UP001', city: '南京', payer: '南京江宁高新技术有限公司', period: '2026-04', insuranceType: '职工基本医疗保险', amount: '128,640.00', method: '银联', status: '待支付' },
  { id: 'UP002', city: '无锡', payer: '无锡华润医药有限公司', period: '2026-04', insuranceType: '职工基本医疗保险', amount: '96,280.00', method: '微信', status: '已支付' },
  { id: 'UP003', city: '苏州', payer: '苏州高新区云信工程有限公司', period: '2026-04', insuranceType: '职工基本医疗保险', amount: '203,560.00', method: '支付宝', status: '已到账' },
  { id: 'UP004', city: '南通', payer: '南通海工建工集团有限公司', period: '2026-04', insuranceType: '大病医疗保险', amount: '75,420.00', method: '现金支付', status: '待核验' },
  { id: 'UP005', city: '徐州', payer: '徐州矿建装备制造有限公司', period: '2026-04', insuranceType: '职工基本医疗保险', amount: '154,320.00', method: '银联', status: '待支付' },
  { id: 'UP006', city: '常州', payer: '常州天宁精密科技有限公司', period: '2026-04', insuranceType: '生育保险', amount: '68,540.00', method: '微信', status: '已支付' },
  { id: 'UP007', city: '连云港', payer: '连云港港盛物流有限公司', period: '2026-04', insuranceType: '职工基本医疗保险', amount: '87,960.00', method: '支付宝', status: '待支付' },
  { id: 'UP008', city: '淮安', payer: '淮安清江制药有限公司', period: '2026-04', insuranceType: '职工基本医疗保险', amount: '112,430.00', method: '银联', status: '已到账' },
  { id: 'UP009', city: '盐城', payer: '盐城东方齿轮有限公司', period: '2026-04', insuranceType: '大病医疗保险', amount: '59,870.00', method: '微信', status: '待支付' },
  { id: 'UP010', city: '扬州', payer: '扬州广陵商贸发展有限公司', period: '2026-04', insuranceType: '职工基本医疗保险', amount: '93,660.00', method: '支付宝', status: '已支付' },
  { id: 'UP011', city: '镇江', payer: '镇江新区船舶配套有限公司', period: '2026-04', insuranceType: '职工基本医疗保险', amount: '101,280.00', method: '银联', status: '待核验' },
  { id: 'UP012', city: '泰州', payer: '泰州医化新材料有限公司', period: '2026-04', insuranceType: '生育保险', amount: '72,910.00', method: '微信', status: '已到账' },
  { id: 'UP013', city: '宿迁', payer: '宿迁电子信息产业有限公司', period: '2026-04', insuranceType: '职工基本医疗保险', amount: '84,150.00', method: '支付宝', status: '待支付' },
  { id: 'UP014', city: '南京', payer: '南京软件谷产业运营有限公司', period: '2026-05', insuranceType: '职工基本医疗保险', amount: '186,470.00', method: '银联', status: '待支付' },
  { id: 'UP015', city: '苏州', payer: '苏州工业园区星海服务外包有限公司', period: '2026-05', insuranceType: '大病医疗保险', amount: '132,580.00', method: '微信', status: '已支付' },
  { id: 'UP016', city: '无锡', payer: '无锡惠山智能制造有限公司', period: '2026-05', insuranceType: '职工基本医疗保险', amount: '118,930.00', method: '支付宝', status: '待支付' },
  { id: 'UP017', city: '徐州', payer: '徐州铜山建工发展集团有限公司', period: '2026-05', insuranceType: '职工基本医疗保险', amount: '165,740.00', method: '银联', status: '已到账' },
  { id: 'UP018', city: '常州', payer: '常州武进轨道配件有限公司', period: '2026-05', insuranceType: '生育保险', amount: '70,380.00', method: '微信', status: '待支付' },
  { id: 'UP019', city: '扬州', payer: '扬州生态科技产业园投资有限公司', period: '2026-05', insuranceType: '职工基本医疗保险', amount: '146,290.00', method: '支付宝', status: '待核验' },
  { id: 'UP020', city: '盐城', payer: '盐城新能源装备有限公司', period: '2026-05', insuranceType: '大病医疗保险', amount: '124,860.00', method: '银联', status: '已支付' },
].map((item, index) => ({ ...item, ...buildUnitMeta(index) }));

const initialPersonalPayments: PersonalPayment[] = [
  { id: 'PP001', city: '南京', payer: '王聪', credentialNo: '320102198905163217', category: '灵活就业', amount: '560.00', method: '微信', status: '已支付' },
  { id: 'PP002', city: '无锡', payer: '李晓桐', credentialNo: '320211199409083624', category: '城乡居民', amount: '470.00', method: '支付宝', status: '已到账' },
  { id: 'PP003', city: '徐州', payer: '张文轩', credentialNo: '320303202603120018', category: '新生儿', amount: '380.00', method: '银联', status: '待支付' },
  { id: 'PP004', city: '常州', payer: '陈思宇', credentialNo: '320402200809145612', category: '学生', amount: '350.00', method: '现金支付', status: '已支付' },
  { id: 'PP005', city: '苏州', payer: '赵雨菲', credentialNo: '320505199112023846', category: '灵活就业', amount: '560.00', method: '微信', status: '待支付' },
  { id: 'PP006', city: '南通', payer: '周俊达', credentialNo: '320602198703217535', category: '城镇职工', amount: '920.00', method: '银联', status: '已支付' },
  { id: 'PP007', city: '连云港', payer: '孙可欣', credentialNo: '320703201509083521', category: '学生', amount: '350.00', method: '支付宝', status: '已到账' },
  { id: 'PP008', city: '淮安', payer: '吴星宇', credentialNo: '320803198812164219', category: '灵活就业', amount: '560.00', method: '微信', status: '待支付' },
  { id: 'PP009', city: '盐城', payer: '郑佳宁', credentialNo: '320902199603286243', category: '城乡居民', amount: '470.00', method: '现金支付', status: '已支付' },
  { id: 'PP010', city: '扬州', payer: '何沐阳', credentialNo: '321002201804067811', category: '新生儿', amount: '380.00', method: '银联', status: '待支付' },
  { id: 'PP011', city: '镇江', payer: '高嘉悦', credentialNo: '321102199908126425', category: '退役军人', amount: '0.00', method: '银联', status: '已到账' },
  { id: 'PP012', city: '泰州', payer: '许子衡', credentialNo: '321202201111203014', category: '学生', amount: '350.00', method: '支付宝', status: '已支付' },
  { id: 'PP013', city: '宿迁', payer: '蒋依晨', credentialNo: '321302199501052218', category: '城乡居民', amount: '470.00', method: '微信', status: '待支付' },
  { id: 'PP014', city: '南京', payer: '吕景川', credentialNo: '320104198406225117', category: '城镇职工', amount: '920.00', method: '银联', status: '已支付' },
  { id: 'PP015', city: '苏州', payer: '顾若彤', credentialNo: '320507199709182543', category: '灵活就业', amount: '560.00', method: '支付宝', status: '已到账' },
  { id: 'PP016', city: '无锡', payer: '唐文浩', credentialNo: '320213201610096812', category: '学生', amount: '350.00', method: '微信', status: '待支付' },
  { id: 'PP017', city: '徐州', payer: '邵子琪', credentialNo: '320322199302145820', category: '城乡居民', amount: '470.00', method: '现金支付', status: '已支付' },
  { id: 'PP018', city: '南通', payer: '彭浩然', credentialNo: '320682198811306514', category: '退役军人', amount: '0.00', method: '银联', status: '已到账' },
  { id: 'PP019', city: '扬州', payer: '韩清妍', credentialNo: '321003200512182424', category: '学生', amount: '350.00', method: '支付宝', status: '已支付' },
  { id: 'PP020', city: '宿迁', payer: '石承泽', credentialNo: '321324199012116731', category: '灵活就业', amount: '560.00', method: '微信', status: '待支付' },
].map((item, index) => ({ ...item, ...buildPersonalMeta(index) }));

const initialPaymentBills: PaymentBill[] = [
  { id: 'BILL001', subject: '南京医保四月单位应缴单', type: '单位缴费单', period: '2026-04', count: '286笔', issuer: '南京医保中心基金征缴科', status: '已生成' },
  { id: 'BILL002', subject: '无锡灵活就业人员集中缴费单', type: '个人缴费单', period: '2026-04', count: '132笔', issuer: '无锡医保中心个人参保科', status: '部分支付' },
  { id: 'BILL003', subject: '苏州学生医保年度缴费单', type: '个人缴费单', period: '2026年度', count: '420笔', issuer: '苏州医保中心居民参保科', status: '已关闭' },
  { id: 'BILL004', subject: '南通退休补缴单', type: '补缴单', period: '2026-04', count: '56笔', issuer: '南通医保中心待遇审核科', status: '待处理' },
  { id: 'BILL005', subject: '徐州单位五月应缴汇总单', type: '单位缴费单', period: '2026-05', count: '198笔', issuer: '徐州医保中心征缴科', status: '已生成' },
  { id: 'BILL006', subject: '常州生育保险补征单', type: '补缴单', period: '2026-05', count: '34笔', issuer: '常州医保中心征缴科', status: '待处理' },
  { id: 'BILL007', subject: '连云港城乡居民批量缴费单', type: '个人缴费单', period: '2026年度', count: '265笔', issuer: '连云港医保中心居民科', status: '部分支付' },
  { id: 'BILL008', subject: '淮安新生儿参保缴费单', type: '个人缴费单', period: '2026年度', count: '89笔', issuer: '淮安医保中心居民科', status: '已生成' },
  { id: 'BILL009', subject: '盐城单位大病保险应缴单', type: '单位缴费单', period: '2026-05', count: '143笔', issuer: '盐城医保中心基金征缴科', status: '已生成' },
  { id: 'BILL010', subject: '扬州学生医保年度补缴单', type: '补缴单', period: '2026年度', count: '77笔', issuer: '扬州医保中心居民科', status: '待处理' },
  { id: 'BILL011', subject: '镇江灵活就业批量缴费单', type: '个人缴费单', period: '2026-05', count: '116笔', issuer: '镇江医保中心个人科', status: '已关闭' },
  { id: 'BILL012', subject: '泰州单位四月应缴核定单', type: '单位缴费单', period: '2026-04', count: '208笔', issuer: '泰州医保中心征缴科', status: '已生成' },
  { id: 'BILL013', subject: '宿迁城乡居民征缴任务单', type: '个人缴费单', period: '2026年度', count: '312笔', issuer: '宿迁医保中心居民科', status: '部分支付' },
  { id: 'BILL014', subject: '南京软件园企业补缴单', type: '补缴单', period: '2026-05', count: '28笔', issuer: '南京医保中心征缴科', status: '待处理' },
  { id: 'BILL015', subject: '苏州工业园区企业应缴单', type: '单位缴费单', period: '2026-05', count: '255笔', issuer: '苏州医保中心征缴科', status: '已生成' },
  { id: 'BILL016', subject: '无锡居民集中续缴单', type: '个人缴费单', period: '2026年度', count: '184笔', issuer: '无锡医保中心居民科', status: '已关闭' },
  { id: 'BILL017', subject: '徐州退役军人补缴单', type: '补缴单', period: '2026-05', count: '22笔', issuer: '徐州医保中心个人科', status: '已生成' },
  { id: 'BILL018', subject: '常州武进园区单位应缴单', type: '单位缴费单', period: '2026-05', count: '167笔', issuer: '常州医保中心征缴科', status: '部分支付' },
  { id: 'BILL019', subject: '南通灵活就业月度缴费单', type: '个人缴费单', period: '2026-05', count: '93笔', issuer: '南通医保中心个人科', status: '已生成' },
  { id: 'BILL020', subject: '扬州广陵单位补差单', type: '补缴单', period: '2026-05', count: '19笔', issuer: '扬州医保中心基金征缴科', status: '待处理' },
];

const initialPaymentRecords: PaymentRecord[] = [
  { id: 'REC001', payer: '南京城建集团', business: '单位缴费', amount: '182,460.00', method: '银联', transactionRef: 'YL202604270912581', operator: '周岚', time: '2026-04-27 09:12' },
  { id: 'REC002', payer: '张蕾', business: '个人缴费', amount: '560.00', method: '微信', transactionRef: 'WX202604270935214', operator: '周岚', time: '2026-04-27 09:35' },
  { id: 'REC003', payer: '苏州明星电子有限公司', business: '单位缴费', amount: '96,780.00', method: '支付宝', transactionRef: 'ZFB202604271006452', operator: '陈昊', time: '2026-04-27 10:06' },
  { id: 'REC004', payer: '周雪', business: '居民缴费', amount: '470.00', method: '现金支付', transactionRef: 'CASH202604271048021', operator: '李婷', time: '2026-04-27 10:48' },
  { id: 'REC005', payer: '徐州矿建装备制造有限公司', business: '单位缴费', amount: '154,320.00', method: '银联', transactionRef: 'YL202604271105386', operator: '王璐', time: '2026-04-27 11:05' },
  { id: 'REC006', payer: '赵雨菲', business: '个人缴费', amount: '560.00', method: '微信', transactionRef: 'WX202604271116732', operator: '周岚', time: '2026-04-27 11:16' },
  { id: 'REC007', payer: '常州天宁精密科技有限公司', business: '单位缴费', amount: '68,540.00', method: '微信', transactionRef: 'WX202604271126615', operator: '陈昊', time: '2026-04-27 11:26' },
  { id: 'REC008', payer: '周俊达', business: '个人缴费', amount: '920.00', method: '银联', transactionRef: 'YL202604271138420', operator: '李婷', time: '2026-04-27 11:38' },
  { id: 'REC009', payer: '连云港港盛物流有限公司', business: '单位缴费', amount: '87,960.00', method: '支付宝', transactionRef: 'ZFB202604271205316', operator: '周岚', time: '2026-04-27 12:05' },
  { id: 'REC010', payer: '孙可欣', business: '学生缴费', amount: '350.00', method: '支付宝', transactionRef: 'ZFB202604271228704', operator: '王璐', time: '2026-04-27 12:28' },
  { id: 'REC011', payer: '淮安清江制药有限公司', business: '单位缴费', amount: '112,430.00', method: '银联', transactionRef: 'YL202604271305224', operator: '陈昊', time: '2026-04-27 13:05' },
  { id: 'REC012', payer: '吴星宇', business: '个人缴费', amount: '560.00', method: '微信', transactionRef: 'WX202604271318625', operator: '周岚', time: '2026-04-27 13:18' },
  { id: 'REC013', payer: '扬州广陵商贸发展有限公司', business: '单位缴费', amount: '93,660.00', method: '支付宝', transactionRef: 'ZFB202604271333942', operator: '李婷', time: '2026-04-27 13:33' },
  { id: 'REC014', payer: '郑佳宁', business: '居民缴费', amount: '470.00', method: '现金支付', transactionRef: 'CASH202604271345013', operator: '周岚', time: '2026-04-27 13:45' },
  { id: 'REC015', payer: '镇江新区船舶配套有限公司', business: '单位缴费', amount: '101,280.00', method: '银联', transactionRef: 'YL202604271402671', operator: '王璐', time: '2026-04-27 14:02' },
  { id: 'REC016', payer: '何沐阳', business: '新生儿缴费', amount: '380.00', method: '银联', transactionRef: 'YL202604271415905', operator: '李婷', time: '2026-04-27 14:15' },
  { id: 'REC017', payer: '泰州医化新材料有限公司', business: '单位缴费', amount: '72,910.00', method: '微信', transactionRef: 'WX202604271428632', operator: '陈昊', time: '2026-04-27 14:28' },
  { id: 'REC018', payer: '高嘉悦', business: '退役军人缴费', amount: '0.00', method: '银联', transactionRef: 'YL202604271439812', operator: '周岚', time: '2026-04-27 14:39' },
  { id: 'REC019', payer: '宿迁电子信息产业有限公司', business: '单位缴费', amount: '84,150.00', method: '支付宝', transactionRef: 'ZFB202604271452524', operator: '陈昊', time: '2026-04-27 14:52' },
  { id: 'REC020', payer: '许子衡', business: '学生缴费', amount: '350.00', method: '支付宝', transactionRef: 'ZFB202604271506351', operator: '王璐', time: '2026-04-27 15:06' },
];

const initialArrivalRecords: ArrivalRecord[] = [
  { id: 'AR001', payer: '南京城建集团', business: '单位缴费', channel: '银联缴费通道', batch: '20260427-01', amount: '218,450.00', transactionRef: 'YL202604270912581', bankSerial: 'JSYL20260427001', receiveTime: '2026-04-27 09:40', status: '已到账' },
  { id: 'AR002', payer: '无锡华润医药有限公司', business: '单位缴费', channel: '微信支付', batch: '20260427-02', amount: '12,680.00', transactionRef: 'WX202604270955268', bankSerial: 'JSWX20260427002', receiveTime: '2026-04-27 09:55', status: '部分到账' },
  { id: 'AR003', payer: '苏州高新区云信工程有限公司', business: '单位缴费', channel: '支付宝支付', batch: '20260427-03', amount: '35,240.00', transactionRef: 'ZFB202604271012553', bankSerial: 'JSZFB20260427003', receiveTime: '2026-04-27 10:12', status: '待回传' },
  { id: 'AR004', payer: '周雪', business: '居民缴费', channel: '现金收件', batch: '20260427-04', amount: '4,860.00', transactionRef: 'CASH202604271048021', bankSerial: 'JSCASH20260427004', receiveTime: '2026-04-27 10:48', status: '已核销' },
  { id: 'AR005', payer: '徐州矿建装备制造有限公司', business: '单位缴费', channel: '银联缴费通道', batch: '20260427-05', amount: '154,320.00', transactionRef: 'YL202604271105386', bankSerial: 'JSYL20260427005', receiveTime: '2026-04-27 11:16', status: '已到账' },
  { id: 'AR006', payer: '赵雨菲', business: '个人缴费', channel: '微信支付', batch: '20260427-06', amount: '560.00', transactionRef: 'WX202604271116732', bankSerial: 'JSWX20260427006', receiveTime: '2026-04-27 11:21', status: '已到账' },
  { id: 'AR007', payer: '常州天宁精密科技有限公司', business: '单位缴费', channel: '微信支付', batch: '20260427-07', amount: '68,540.00', transactionRef: 'WX202604271126615', bankSerial: 'JSWX20260427007', receiveTime: '2026-04-27 11:35', status: '待回传' },
  { id: 'AR008', payer: '周俊达', business: '个人缴费', channel: '银联缴费通道', batch: '20260427-08', amount: '920.00', transactionRef: 'YL202604271138420', bankSerial: 'JSYL20260427008', receiveTime: '2026-04-27 11:46', status: '已到账' },
  { id: 'AR009', payer: '连云港港盛物流有限公司', business: '单位缴费', channel: '支付宝支付', batch: '20260427-09', amount: '87,960.00', transactionRef: 'ZFB202604271205316', bankSerial: 'JSZFB20260427009', receiveTime: '2026-04-27 12:13', status: '部分到账' },
  { id: 'AR010', payer: '孙可欣', business: '学生缴费', channel: '支付宝支付', batch: '20260427-10', amount: '350.00', transactionRef: 'ZFB202604271228704', bankSerial: 'JSZFB20260427010', receiveTime: '2026-04-27 12:31', status: '已到账' },
  { id: 'AR011', payer: '淮安清江制药有限公司', business: '单位缴费', channel: '银联缴费通道', batch: '20260427-11', amount: '112,430.00', transactionRef: 'YL202604271305224', bankSerial: 'JSYL20260427011', receiveTime: '2026-04-27 13:14', status: '已到账' },
  { id: 'AR012', payer: '吴星宇', business: '个人缴费', channel: '微信支付', batch: '20260427-12', amount: '560.00', transactionRef: 'WX202604271318625', bankSerial: 'JSWX20260427012', receiveTime: '2026-04-27 13:20', status: '待回传' },
  { id: 'AR013', payer: '扬州广陵商贸发展有限公司', business: '单位缴费', channel: '支付宝支付', batch: '20260427-13', amount: '93,660.00', transactionRef: 'ZFB202604271333942', bankSerial: 'JSZFB20260427013', receiveTime: '2026-04-27 13:40', status: '已到账' },
  { id: 'AR014', payer: '郑佳宁', business: '居民缴费', channel: '现金收件', batch: '20260427-14', amount: '470.00', transactionRef: 'CASH202604271345013', bankSerial: 'JSCASH20260427014', receiveTime: '2026-04-27 13:45', status: '已核销' },
  { id: 'AR015', payer: '镇江新区船舶配套有限公司', business: '单位缴费', channel: '银联缴费通道', batch: '20260427-15', amount: '101,280.00', transactionRef: 'YL202604271402671', bankSerial: 'JSYL20260427015', receiveTime: '2026-04-27 14:08', status: '部分到账' },
  { id: 'AR016', payer: '何沐阳', business: '新生儿缴费', channel: '银联缴费通道', batch: '20260427-16', amount: '380.00', transactionRef: 'YL202604271415905', bankSerial: 'JSYL20260427016', receiveTime: '2026-04-27 14:16', status: '已到账' },
  { id: 'AR017', payer: '泰州医化新材料有限公司', business: '单位缴费', channel: '微信支付', batch: '20260427-17', amount: '72,910.00', transactionRef: 'WX202604271428632', bankSerial: 'JSWX20260427017', receiveTime: '2026-04-27 14:31', status: '待回传' },
  { id: 'AR018', payer: '高嘉悦', business: '退役军人缴费', channel: '银联缴费通道', batch: '20260427-18', amount: '0.00', transactionRef: 'YL202604271439812', bankSerial: 'JSYL20260427018', receiveTime: '2026-04-27 14:40', status: '已到账' },
  { id: 'AR019', payer: '宿迁电子信息产业有限公司', business: '单位缴费', channel: '支付宝支付', batch: '20260427-19', amount: '84,150.00', transactionRef: 'ZFB202604271452524', bankSerial: 'JSZFB20260427019', receiveTime: '2026-04-27 14:56', status: '已到账' },
  { id: 'AR020', payer: '许子衡', business: '学生缴费', channel: '支付宝支付', batch: '20260427-20', amount: '350.00', transactionRef: 'ZFB202604271506351', bankSerial: 'JSZFB20260427020', receiveTime: '2026-04-27 15:10', status: '待回传' },
];

const initialReceiptRecords: ReceiptRecord[] = [
  {
    id: 'RP001',
    payer: '王聪',
    voucher: '电子回执',
    method: '微信',
    status: '可打印',
    businessType: '个人缴费',
    amount: '560.00',
    payTime: '2026-04-27 09:35',
    operator: '南京经办柜员-周岚',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年度城乡居民医保',
    batchNo: 'PP001-20260427',
    transactionRef: 'WX202604270935001',
    remark: '扫码缴费成功，可据此办理参保到账确认。',
  },
  {
    id: 'RP002',
    payer: '南京科辉制造有限公司',
    voucher: '缴费凭证',
    method: '银联',
    status: '可打印',
    businessType: '单位缴费',
    amount: '128,640.00',
    payTime: '2026-04-27 10:18',
    operator: '南京经办柜员-陈昊',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年04月单位职工医保',
    batchNo: 'UP008-20260427',
    transactionRef: 'YL2026042710188866',
    remark: '已收妥单位当期医疗保险费。',
  },
  {
    id: 'RP003',
    payer: '陈思宇',
    voucher: '支付回执',
    method: '支付宝',
    status: '已归档',
    businessType: '个人缴费',
    amount: '350.00',
    payTime: '2026-04-27 11:02',
    operator: '南京经办柜员-王璐',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年度学生医保',
    batchNo: 'PP004-20260427',
    transactionRef: 'ZFB2026042711025521',
    remark: '学生医保缴费已完成并归档。',
  },
  {
    id: 'RP004',
    payer: '周雪',
    voucher: '现金收据',
    method: '现金支付',
    status: '可打印',
    businessType: '居民缴费',
    amount: '470.00',
    payTime: '2026-04-27 10:48',
    operator: '南京经办柜员-李婷',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年度城乡居民医保',
    batchNo: 'PP009-20260427',
    transactionRef: 'CASH202604271048021',
    remark: '现金收讫，请妥善保管本回执。',
  },
  {
    id: 'RP005',
    payer: '徐州矿建装备制造有限公司',
    voucher: '缴费凭证',
    method: '银联',
    status: '可打印',
    businessType: '单位缴费',
    amount: '154,320.00',
    payTime: '2026-04-27 11:05',
    operator: '南京经办柜员-王璐',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年04月单位职工医保',
    batchNo: 'UP005-20260427',
    transactionRef: 'YL202604271105386',
    remark: '单位缴费成功，可打印正式缴费凭证。',
  },
  {
    id: 'RP006',
    payer: '赵雨菲',
    voucher: '电子回执',
    method: '微信',
    status: '可打印',
    businessType: '个人缴费',
    amount: '560.00',
    payTime: '2026-04-27 11:16',
    operator: '南京经办柜员-周岚',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年度灵活就业医保',
    batchNo: 'PP005-20260427',
    transactionRef: 'WX202604271116732',
    remark: '灵活就业人员扫码缴费成功。',
  },
  {
    id: 'RP007',
    payer: '常州天宁精密科技有限公司',
    voucher: '缴费凭证',
    method: '微信',
    status: '已归档',
    businessType: '单位缴费',
    amount: '68,540.00',
    payTime: '2026-04-27 11:26',
    operator: '南京经办柜员-陈昊',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年04月生育保险',
    batchNo: 'UP006-20260427',
    transactionRef: 'WX202604271126615',
    remark: '单位微信缴费已成功并归档。',
  },
  {
    id: 'RP008',
    payer: '周俊达',
    voucher: '电子回执',
    method: '银联',
    status: '可打印',
    businessType: '个人缴费',
    amount: '920.00',
    payTime: '2026-04-27 11:38',
    operator: '南京经办柜员-李婷',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年度城镇职工医保',
    batchNo: 'PP006-20260427',
    transactionRef: 'YL202604271138420',
    remark: '职工个人补缴情形已受理并完成收款。',
  },
  {
    id: 'RP009',
    payer: '连云港港盛物流有限公司',
    voucher: '缴费凭证',
    method: '支付宝',
    status: '可打印',
    businessType: '单位缴费',
    amount: '87,960.00',
    payTime: '2026-04-27 12:05',
    operator: '南京经办柜员-周岚',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年04月单位职工医保',
    batchNo: 'UP007-20260427',
    transactionRef: 'ZFB202604271205316',
    remark: '单位支付宝缴费成功，等待渠道回传。',
  },
  {
    id: 'RP010',
    payer: '孙可欣',
    voucher: '电子回执',
    method: '支付宝',
    status: '可打印',
    businessType: '学生缴费',
    amount: '350.00',
    payTime: '2026-04-27 12:28',
    operator: '南京经办柜员-王璐',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年度学生医保',
    batchNo: 'PP007-20260427',
    transactionRef: 'ZFB202604271228704',
    remark: '学生医保年度缴费完成。',
  },
  {
    id: 'RP011',
    payer: '淮安清江制药有限公司',
    voucher: '缴费凭证',
    method: '银联',
    status: '已归档',
    businessType: '单位缴费',
    amount: '112,430.00',
    payTime: '2026-04-27 13:05',
    operator: '南京经办柜员-陈昊',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年04月单位职工医保',
    batchNo: 'UP008-20260427',
    transactionRef: 'YL202604271305224',
    remark: '单位征缴成功并完成回执归档。',
  },
  {
    id: 'RP012',
    payer: '吴星宇',
    voucher: '电子回执',
    method: '微信',
    status: '可打印',
    businessType: '个人缴费',
    amount: '560.00',
    payTime: '2026-04-27 13:18',
    operator: '南京经办柜员-周岚',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年度灵活就业医保',
    batchNo: 'PP008-20260427',
    transactionRef: 'WX202604271318625',
    remark: '灵活就业续缴成功。',
  },
  {
    id: 'RP013',
    payer: '郑佳宁',
    voucher: '现金收据',
    method: '现金支付',
    status: '可打印',
    businessType: '居民缴费',
    amount: '470.00',
    payTime: '2026-04-27 13:45',
    operator: '南京经办柜员-周岚',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年度城乡居民医保',
    batchNo: 'PP009-20260427',
    transactionRef: 'CASH202604271345013',
    remark: '居民现金缴费完成，可现场打印收据。',
  },
  {
    id: 'RP014',
    payer: '何沐阳',
    voucher: '电子回执',
    method: '银联',
    status: '可打印',
    businessType: '新生儿缴费',
    amount: '380.00',
    payTime: '2026-04-27 14:15',
    operator: '南京经办柜员-李婷',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年度新生儿医保',
    batchNo: 'PP010-20260427',
    transactionRef: 'YL202604271415905',
    remark: '新生儿随监护人办理参保缴费成功。',
  },
  {
    id: 'RP015',
    payer: '高嘉悦',
    voucher: '待遇确认回执',
    method: '银联',
    status: '已归档',
    businessType: '退役军人缴费',
    amount: '0.00',
    payTime: '2026-04-27 14:39',
    operator: '南京经办柜员-周岚',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年度退役军人医保',
    batchNo: 'PP011-20260427',
    transactionRef: 'YL202604271439812',
    remark: '退役军人按政策免缴，已完成待遇确认。',
  },
  {
    id: 'RP016',
    payer: '许子衡',
    voucher: '电子回执',
    method: '支付宝',
    status: '可打印',
    businessType: '学生缴费',
    amount: '350.00',
    payTime: '2026-04-27 15:06',
    operator: '南京经办柜员-王璐',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年度学生医保',
    batchNo: 'PP012-20260427',
    transactionRef: 'ZFB202604271506351',
    remark: '学生年度缴费成功，支持电子回执打印。',
  },
  {
    id: 'RP017',
    payer: '蒋依晨',
    voucher: '电子回执',
    method: '微信',
    status: '可打印',
    businessType: '居民缴费',
    amount: '470.00',
    payTime: '2026-04-27 15:18',
    operator: '南京经办柜员-李婷',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年度城乡居民医保',
    batchNo: 'PP013-20260427',
    transactionRef: 'WX202604271518417',
    remark: '居民续保缴费成功。',
  },
  {
    id: 'RP018',
    payer: '吕景川',
    voucher: '电子回执',
    method: '银联',
    status: '可打印',
    businessType: '个人缴费',
    amount: '920.00',
    payTime: '2026-04-27 15:26',
    operator: '南京经办柜员-周岚',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年度城镇职工医保',
    batchNo: 'PP014-20260427',
    transactionRef: 'YL202604271526619',
    remark: '个人续缴成功，可据此办理关系转移业务。',
  },
  {
    id: 'RP019',
    payer: '顾若彤',
    voucher: '电子回执',
    method: '支付宝',
    status: '已归档',
    businessType: '个人缴费',
    amount: '560.00',
    payTime: '2026-04-27 15:31',
    operator: '南京经办柜员-陈昊',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年度灵活就业医保',
    batchNo: 'PP015-20260427',
    transactionRef: 'ZFB202604271531552',
    remark: '灵活就业年度缴费完成并归档。',
  },
  {
    id: 'RP020',
    payer: '韩清妍',
    voucher: '电子回执',
    method: '支付宝',
    status: '可打印',
    businessType: '学生缴费',
    amount: '350.00',
    payTime: '2026-04-27 15:42',
    operator: '南京经办柜员-王璐',
    agency: '江苏省医疗保障经办服务中心',
    period: '2026年度学生医保',
    batchNo: 'PP019-20260427',
    transactionRef: 'ZFB202604271542374',
    remark: '学生参保缴费成功，可打印电子回执。',
  },
];

function parseAmount(amount: string) {
  return Number(amount.replace(/,/g, ''));
}

function formatCurrency(amount: number) {
  return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function buildGatewayTransactionRef(method: PaymentMethod) {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
  const suffix = String(Math.floor(Math.random() * 900) + 100);
  return `${method === '微信' ? 'WX' : 'ZFB'}${stamp}${suffix}`;
}

function buildUnitMeta(index: number) {
  const contactNames = ['周岚', '陈昊', '王璐', '李婷', '高远', '许宁', '韩璟', '孙恺', '顾凡', '郑颖', '邵宁', '蒋帆', '唐洁', '石磊', '吕彤', '彭超', '何洁', '曹颖', '谢楠', '沈悦'];
  const phones = ['13805120011', '13961730025', '13776080036', '13646210048', '13584620052', '13815430067', '13912150073', '13770560084', '13611570095', '13852780106', '13913490217', '13739100328', '13625210439', '13861320541', '13987030652', '13752640763', '13680850874', '13821960985', '13932071096', '13745181207'];
  return {
    unitCode: `DW${String(index + 1).padStart(4, '0')}`,
    socialCreditCode: `9132${String(10000000000000 + index).slice(0, 14)}X`,
    contactName: contactNames[index],
    contactPhone: phones[index],
  };
}

function buildPersonalMeta(index: number) {
  const genders: Array<'男' | '女'> = ['男', '女', '男', '男', '女', '男', '女', '男', '女', '男', '女', '男', '女', '男', '女', '男', '女', '男', '女', '男'];
  const insuredNos = Array.from({ length: 20 }, (_, idx) => `YB3200${String(idx + 1).padStart(8, '0')}`);
  const phones = ['13905110021', '13861720032', '13775830043', '13646140054', '13912750065', '13862960076', '13770170087', '13685280098', '13901490109', '13805200210', '13776410321', '13645220432', '13917330543', '13851640654', '13771950765', '13621560876', '13938270987', '13814681098', '13776891109', '13657001210'];
  return {
    gender: genders[index],
    insuredNo: insuredNos[index],
    phone: phones[index],
  };
}

function StatusPill({ text }: { text: string }) {
  const color =
    text.includes('到账') || text.includes('可打印') || text.includes('已支付')
      ? 'bg-green-100 text-green-700'
      : text.includes('部分') || text.includes('待')
        ? 'bg-amber-100 text-amber-700'
        : 'bg-slate-100 text-slate-700';
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>{text}</span>;
}

function SummaryCard({ title, value, icon: Icon }: { title: string; value: string; icon: React.ElementType }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

function ModuleShell({
  title,
  desc,
  onBack,
  children,
}: {
  title: string;
  desc: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <span>缴费模块</span>
              <ArrowRight className="h-4 w-4" />
              <span>{title}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">{desc}</p>
          </div>
          <button onClick={onBack} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" />
            返回卡片页
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function PaymentActionModal({
  open,
  title,
  amount,
  payer,
  paymentMethod,
  editableAmount,
  onAmountChange,
  transactionRef,
  onTransactionRefChange,
  payerCardSuffix,
  onPayerCardSuffixChange,
  cashReceived,
  onCashReceivedChange,
  onMethodChange,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  amount: string;
  payer: string;
  paymentMethod: PaymentMethod;
  editableAmount: string;
  onAmountChange: (value: string) => void;
  transactionRef: string;
  onTransactionRefChange: (value: string) => void;
  payerCardSuffix: string;
  onPayerCardSuffixChange: (value: string) => void;
  cashReceived: string;
  onCashReceivedChange: (value: string) => void;
  onMethodChange: (method: PaymentMethod) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  const payableAmount = Number(editableAmount || '0');
  const cashAmount = Number(cashReceived || '0');
  const canSubmit =
    payableAmount > 0 &&
    (paymentMethod !== '现金支付' || cashAmount >= payableAmount) &&
    (paymentMethod === '银联' ? payerCardSuffix.trim().length >= 4 : true) &&
    (paymentMethod === '微信' || paymentMethod === '支付宝' || paymentMethod === '银联'
      ? transactionRef.trim().length > 0
      : true);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">请确认支付对象、支付方式和收款信息，完成本次缴费办理。</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">缴费对象</span>
                <span className="font-medium text-gray-800">{payer}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-500">应缴金额</span>
                <span className="text-lg font-bold text-cyan-700">{amount}</span>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">手动输入金额</span>
                  <input
                    value={editableAmount}
                    onChange={(event) => onAmountChange(event.target.value.replace(/[^\d.]/g, ''))}
                    placeholder="请输入本次实缴金额"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
                  />
                </label>
                <div className="rounded-xl border border-dashed border-cyan-200 bg-cyan-50/60 px-4 py-3">
                  <p className="text-sm text-gray-500">本次确认金额</p>
                  <p className="mt-1 text-2xl font-bold text-cyan-700">{formatCurrency(payableAmount || 0)}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-gray-700">支付方式</p>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method}
                    onClick={() => onMethodChange(method)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                      paymentMethod === method ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {(paymentMethod === '微信' || paymentMethod === '支付宝') && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-800">{paymentMethod}收款码</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {paymentMethod === '微信' ? '请使用微信扫一扫完成缴费。' : '请使用支付宝扫一扫完成缴费。'}
                    </p>
                    <label className="mt-4 block">
                      <span className="mb-2 block text-sm font-medium text-gray-700">支付流水号</span>
                      <div className="flex gap-3">
                        <input
                          value={transactionRef}
                          readOnly
                          placeholder="支付成功后系统自动回填"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => onTransactionRefChange(buildGatewayTransactionRef(paymentMethod))}
                          className="shrink-0 rounded-xl border border-cyan-200 px-4 py-2.5 text-sm text-cyan-700 hover:bg-cyan-50"
                        >
                          查询支付结果
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">扫码完成后，点击“查询支付结果”自动回填微信/支付宝交易流水。</p>
                    </label>
                  </div>
                  <div className="flex h-48 w-48 flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-300 bg-cyan-50 text-cyan-700">
                    <QrCode className="h-16 w-16" />
                    <div className="mt-3 grid grid-cols-6 gap-1">
                      {Array.from({ length: 36 }).map((_, index) => (
                        <span key={index} className={`h-3 w-3 rounded-sm ${index % 2 === 0 || index % 5 === 0 ? 'bg-cyan-700' : 'bg-cyan-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === '银联' && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h4 className="text-base font-semibold text-gray-800">银联转账收款信息</h4>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-gray-700">
                    <p><span className="text-gray-500">开户行：</span>{unionPayAccount.bankName}</p>
                    <p className="mt-2"><span className="text-gray-500">户名：</span>{unionPayAccount.accountName}</p>
                    <p className="mt-2"><span className="text-gray-500">账号：</span>{unionPayAccount.accountNo}</p>
                    <p className="mt-2"><span className="text-gray-500">联行号：</span>{unionPayAccount.bankCode}</p>
                  </div>
                  <div className="space-y-4">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-gray-700">付款卡号后四位</span>
                      <input
                        value={payerCardSuffix}
                        onChange={(event) => onPayerCardSuffixChange(event.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="请输入付款卡号后四位"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-gray-700">银行交易流水号</span>
                      <input
                        value={transactionRef}
                        onChange={(event) => onTransactionRefChange(event.target.value)}
                        placeholder="请输入银行转账流水号"
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === '现金支付' && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h4 className="text-base font-semibold text-gray-800">现金收款办理</h4>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-700">实收金额</span>
                    <input
                      value={cashReceived}
                      onChange={(event) => onCashReceivedChange(event.target.value.replace(/[^\d.]/g, ''))}
                      placeholder="请输入实收金额"
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
                    />
                  </label>
                  <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-gray-700">
                    <p className="text-gray-500">应找零</p>
                    <p className="mt-1 text-xl font-bold text-amber-700">{formatCurrency(Math.max(cashAmount - payableAmount, 0))}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-gray-700">
                    <p><span className="text-gray-500">收款窗口：</span>南京经办服务大厅 2号窗口</p>
                    <p className="mt-2"><span className="text-gray-500">经办人员：</span>周岚</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-5">
              <h4 className="text-base font-semibold text-gray-800">办理提示</h4>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <p>1. 先核对应缴金额，再选择支付方式。</p>
                <p>2. 扫码支付需录入交易流水号，银联转账需补录银行卡信息。</p>
                <p>3. 现金支付需录入实收金额，系统自动计算找零。</p>
                <p>4. 确认后将同步生成缴费记录、到账批次和缴费回执。</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h4 className="text-base font-semibold text-gray-800">本次收款结果</h4>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">支付方式</span>
                  <span>{paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">确认金额</span>
                  <span className="font-semibold text-cyan-700">{formatCurrency(payableAmount || 0)}</span>
                </div>
                {transactionRef && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">交易流水</span>
                    <span>{transactionRef}</span>
                  </div>
                )}
                {paymentMethod === '银联' && payerCardSuffix && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">付款卡号</span>
                    <span>**** {payerCardSuffix}</span>
                  </div>
                )}
                {paymentMethod === '现金支付' && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">实收金额</span>
                    <span>{formatCurrency(cashAmount || 0)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            取消
          </button>
          <button
            onClick={onConfirm}
            disabled={!canSubmit}
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            发起缴费
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ReceiptPreviewModal({
  open,
  record,
  onClose,
  onArchive,
}: {
  open: boolean;
  record: ReceiptRecord | null;
  onClose: () => void;
  onArchive: (id: string) => void;
}) {
  if (!open || !record) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">缴费回执预览</h3>
            <p className="mt-1 text-sm text-gray-500">支持打印和归档当前缴费回执。</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-2xl border border-cyan-200 bg-cyan-50/30 p-6">
          <div className="border-b border-cyan-100 pb-5 text-center">
            <p className="text-2xl font-bold text-gray-800">江苏省医疗保险缴费回执</p>
            <p className="mt-2 text-sm text-gray-500">{record.agency}</p>
            <div className="mt-3 flex items-center justify-center gap-8 text-sm text-gray-600">
              <span>回执号：{record.id}</span>
              <span>业务批次：{record.batchNo}</span>
              <span>状态：{record.status}</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-gray-700">
            <div><span className="text-gray-500">缴费人：</span>{record.payer}</div>
            <div><span className="text-gray-500">业务类型：</span>{record.businessType}</div>
            <div><span className="text-gray-500">缴费期间：</span>{record.period}</div>
            <div><span className="text-gray-500">支付方式：</span>{record.method}</div>
            <div><span className="text-gray-500">凭证类型：</span>{record.voucher}</div>
            <div>
              <span className="text-gray-500">缴费金额：</span>
              <span className="font-semibold text-cyan-700">{formatCurrency(parseAmount(record.amount))}</span>
            </div>
            <div><span className="text-gray-500">缴费时间：</span>{record.payTime}</div>
            <div><span className="text-gray-500">经办人员：</span>{record.operator}</div>
            <div><span className="text-gray-500">交易流水：</span>{record.transactionRef}</div>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-700">
            <p className="font-medium text-gray-800">回执说明</p>
            <p className="mt-2 leading-7">{record.remark}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>基金收入户：{unionPayAccount.accountName}</span>
              <span>打印时间：2026-04-27 15:30</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            关闭
          </button>
          <button onClick={() => onArchive(record.id)} className="rounded-xl border border-cyan-200 px-4 py-2 text-sm text-cyan-700 hover:bg-cyan-50">
            标记归档
          </button>
          <button onClick={onClose} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm text-white hover:bg-cyan-700">
            打印
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SearchBar({
  value,
  onChange,
  placeholder,
  extra,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-cyan-400"
        />
      </div>
      {extra}
    </div>
  );
}

function CreatePaymentModal({
  open,
  type,
  draft,
  onChange,
  onClose,
  onConfirm,
}: {
  open: boolean;
  type: 'unit' | 'personal';
  draft: CreatePaymentDraft;
  onChange: (draft: CreatePaymentDraft) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[65] flex items-center justify-center bg-black/40 p-4">
      <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{type === 'unit' ? '新建单位缴费' : '新建个人缴费'}</h3>
            <p className="mt-1 text-sm text-gray-500">先登记本次缴费对象和金额，再进入正式收款办理。</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">{type === 'unit' ? '缴费单位名称' : '缴费人姓名'}</span>
            <input
              value={draft.payer}
              onChange={(event) => onChange({ ...draft, payer: event.target.value })}
              placeholder={type === 'unit' ? '请输入单位名称' : '请输入缴费人姓名'}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">{type === 'unit' ? '缴费期数' : '参保类型'}</span>
            {type === 'unit' ? (
              <input
                value={draft.periodOrCategory}
                onChange={(event) => onChange({ ...draft, periodOrCategory: event.target.value })}
                placeholder="如 2026-05"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
              />
            ) : (
              <select
                value={draft.periodOrCategory}
                onChange={(event) => onChange({ ...draft, periodOrCategory: event.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
              >
                {['城乡居民', '城镇职工', '灵活就业', '新生儿', '退役军人', '学生'].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">{type === 'unit' ? '单位编号' : '医保编号'}</span>
            <input
              value={draft.externalCode}
              onChange={(event) => onChange({ ...draft, externalCode: event.target.value })}
              placeholder={type === 'unit' ? '请输入单位编号' : '请输入医保编号'}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">{type === 'unit' ? '统一社会信用代码' : '身份证号'}</span>
            <input
              value={draft.identityNo}
              onChange={(event) => onChange({ ...draft, identityNo: event.target.value })}
              placeholder={type === 'unit' ? '请输入统一社会信用代码' : '请输入身份证号'}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">应缴金额</span>
            <input
              value={draft.amount}
              onChange={(event) => onChange({ ...draft, amount: event.target.value.replace(/[^\d.]/g, '') })}
              placeholder="请输入应缴金额"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">默认支付方式</span>
            <select
              value={draft.method}
              onChange={(event) => onChange({ ...draft, method: event.target.value as PaymentMethod })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>
          {type === 'personal' && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">性别</span>
              <select
                value={draft.gender}
                onChange={(event) => onChange({ ...draft, gender: event.target.value as '男' | '女' })}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
              >
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </label>
          )}
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">{type === 'unit' ? '单位联系人' : '联系电话'}</span>
            <input
              value={draft.contactName}
              onChange={(event) => onChange({ ...draft, contactName: event.target.value })}
              placeholder={type === 'unit' ? '请输入单位联系人' : '请输入联系人姓名'}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">{type === 'unit' ? '联系电话' : '手机号'}</span>
            <input
              value={draft.contactPhone}
              onChange={(event) => onChange({ ...draft, contactPhone: event.target.value.replace(/\D/g, '').slice(0, 11) })}
              placeholder={type === 'unit' ? '请输入联系电话' : '请输入手机号'}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            取消
          </button>
          <button
            onClick={onConfirm}
            disabled={!draft.payer.trim() || !draft.amount || !draft.periodOrCategory.trim() || !draft.identityNo.trim() || !draft.externalCode.trim()}
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            下一步去缴费
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PaymentCollectionWorkbench() {
  const [selectedModule, setSelectedModule] = useState<ModuleId | null>(null);
  const [unitPayments, setUnitPayments] = useState<UnitPayment[]>(initialUnitPayments);
  const [personalPayments, setPersonalPayments] = useState<PersonalPayment[]>(initialPersonalPayments);
  const [paymentBills, setPaymentBills] = useState<PaymentBill[]>(initialPaymentBills);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(initialPaymentRecords);
  const [arrivalRecords, setArrivalRecords] = useState<ArrivalRecord[]>(initialArrivalRecords);
  const [receiptRecords, setReceiptRecords] = useState<ReceiptRecord[]>(initialReceiptRecords);

  const [searchTerm, setSearchTerm] = useState('');
  const [recordMethodFilter, setRecordMethodFilter] = useState<'全部' | PaymentMethod>('全部');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [createPaymentOpen, setCreatePaymentOpen] = useState(false);
  const [activePaymentType, setActivePaymentType] = useState<'unit' | 'personal'>('unit');
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('银联');
  const [editableAmount, setEditableAmount] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [payerCardSuffix, setPayerCardSuffix] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const [receiptPreviewOpen, setReceiptPreviewOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<ReceiptRecord | null>(null);
  const [focusedArrivalId, setFocusedArrivalId] = useState<string | null>(null);
  const [createPaymentDraft, setCreatePaymentDraft] = useState<CreatePaymentDraft>({
    payer: '',
    amount: '',
    periodOrCategory: '2026-05',
    method: '银联',
    identityNo: '',
    externalCode: '',
    contactName: '',
    contactPhone: '',
    gender: '男',
  });

  const currentModule = useMemo(() => modules.find((item) => item.id === selectedModule) || null, [selectedModule]);

  const activeUnitPayment = unitPayments.find((item) => item.id === activePaymentId) || null;
  const activePersonalPayment = personalPayments.find((item) => item.id === activePaymentId) || null;
  
  const openReceiptPreview = (receipt: ReceiptRecord) => {
    setActiveReceipt(receipt);
    setReceiptPreviewOpen(true);
  };

  const openOrCreateReceiptForPayment = (type: 'unit' | 'personal', paymentId: string) => {
    const existingReceipt = receiptRecords.find((receipt) => receipt.batchNo.startsWith(paymentId));
    if (existingReceipt) {
      openReceiptPreview(existingReceipt);
      return;
    }

    const unitPayment = type === 'unit' ? unitPayments.find((item) => item.id === paymentId) : null;
    const personalPayment = type === 'personal' ? personalPayments.find((item) => item.id === paymentId) : null;
    const payment = unitPayment || personalPayment;

    if (!payment) return;

    const receiptId = `RP${String(receiptRecords.length + 1).padStart(3, '0')}`;
    const payTime = '2026-04-27 15:30';
    const generatedReceipt: ReceiptRecord = type === 'unit'
      ? {
          id: receiptId,
          payer: unitPayment!.payer,
          voucher: '缴费凭证',
          method: unitPayment!.method,
          status: '可打印',
          businessType: '单位缴费',
          amount: unitPayment!.amount,
          payTime,
          operator: '南京经办柜员-周岚',
          agency: '江苏省医疗保障经办服务中心',
          period: `${unitPayment!.period} ${unitPayment!.insuranceType}`,
          batchNo: `${unitPayment!.id}-20260427`,
          transactionRef: `${unitPayment!.method === '银联' ? 'YL' : unitPayment!.method === '微信' ? 'WX' : unitPayment!.method === '支付宝' ? 'ZFB' : 'CASH'}202604271530${String(receiptRecords.length + 1).padStart(3, '0')}`,
          remark: '根据已缴费记录补生成正式缴费回执。',
        }
      : {
          id: receiptId,
          payer: personalPayment!.payer,
          voucher: personalPayment!.method === '现金支付' ? '现金收据' : '电子回执',
          method: personalPayment!.method,
          status: '可打印',
          businessType: personalPayment!.category.includes('学生')
            ? '学生缴费'
            : personalPayment!.category.includes('新生儿')
              ? '新生儿缴费'
              : personalPayment!.category.includes('退役军人')
                ? '退役军人缴费'
                : '个人缴费',
          amount: personalPayment!.amount,
          payTime,
          operator: '南京经办柜员-周岚',
          agency: '江苏省医疗保障经办服务中心',
          period: `2026年度${personalPayment!.category}医保`,
          batchNo: `${personalPayment!.id}-20260427`,
          transactionRef: `${personalPayment!.method === '银联' ? 'YL' : personalPayment!.method === '微信' ? 'WX' : personalPayment!.method === '支付宝' ? 'ZFB' : 'CASH'}202604271530${String(receiptRecords.length + 1).padStart(3, '0')}`,
          remark: '根据已缴费记录补生成正式缴费回执。',
        };

    setReceiptRecords((prev) => [generatedReceipt, ...prev]);
    openReceiptPreview(generatedReceipt);
  };

  const todayUnitAmount = formatCurrency(
    unitPayments.reduce((sum, item) => sum + parseAmount(item.amount), 0),
  );
  const todayArrivalAmount = formatCurrency(
    arrivalRecords.reduce((sum, item) => sum + parseAmount(item.amount), 0),
  );

  const filteredUnitPayments = unitPayments.filter(
    (item) =>
      item.payer.includes(searchTerm) ||
      item.id.includes(searchTerm) ||
      item.period.includes(searchTerm) ||
      item.city.includes(searchTerm) ||
      item.insuranceType.includes(searchTerm) ||
      item.unitCode.includes(searchTerm) ||
      item.socialCreditCode.includes(searchTerm) ||
      item.contactName.includes(searchTerm) ||
      item.contactPhone.includes(searchTerm),
  );
  const filteredPersonalPayments = personalPayments.filter(
    (item) =>
      item.payer.includes(searchTerm) ||
      item.id.includes(searchTerm) ||
      item.category.includes(searchTerm) ||
      item.city.includes(searchTerm) ||
      item.credentialNo.includes(searchTerm) ||
      item.insuredNo.includes(searchTerm) ||
      item.phone.includes(searchTerm) ||
      item.gender.includes(searchTerm),
  );
  const filteredBills = paymentBills.filter(
    (item) =>
      item.subject.includes(searchTerm) ||
      item.id.includes(searchTerm) ||
      item.type.includes(searchTerm) ||
      item.period.includes(searchTerm) ||
      item.issuer.includes(searchTerm),
  );
  const filteredRecords = paymentRecords.filter((item) => {
    const matchesText =
      item.id.includes(searchTerm) ||
      item.payer.includes(searchTerm) ||
      item.business.includes(searchTerm) ||
      item.transactionRef.includes(searchTerm) ||
      item.operator.includes(searchTerm);
    const matchesMethod = recordMethodFilter === '全部' || item.method === recordMethodFilter;
    return matchesText && matchesMethod;
  });
  const filteredArrivals = arrivalRecords.filter(
    (item) =>
      item.batch.includes(searchTerm) ||
      item.channel.includes(searchTerm) ||
      item.status.includes(searchTerm) ||
      item.payer.includes(searchTerm) ||
      item.business.includes(searchTerm) ||
      item.transactionRef.includes(searchTerm) ||
      item.bankSerial.includes(searchTerm) ||
      item.receiveTime.includes(searchTerm),
  );
  const filteredReceipts = receiptRecords.filter(
    (item) =>
      item.id.includes(searchTerm) ||
      item.payer.includes(searchTerm) ||
      item.method.includes(searchTerm) ||
      item.businessType.includes(searchTerm) ||
      item.transactionRef.includes(searchTerm),
  );

  const openCreatePayment = (type: 'unit' | 'personal') => {
    setActivePaymentType(type);
    setCreatePaymentDraft({
      payer: '',
      amount: '',
      periodOrCategory: type === 'unit' ? '2026-05' : '城乡居民',
      method: '银联',
      identityNo: '',
      externalCode: '',
      contactName: '',
      contactPhone: '',
      gender: '男',
    });
    setCreatePaymentOpen(true);
  };

  const openArrivalLookup = (payer: string, transactionRef?: string) => {
    setSearchTerm(transactionRef || payer);
    setFocusedArrivalId(
      arrivalRecords.find((item) => item.transactionRef === transactionRef || item.payer === payer)?.id || null,
    );
    setSelectedModule('arrival');
  };

  const openPaymentModal = (type: 'unit' | 'personal', id: string, method: PaymentMethod) => {
    const targetAmount =
      type === 'unit'
        ? unitPayments.find((item) => item.id === id)?.amount || '0'
        : personalPayments.find((item) => item.id === id)?.amount || '0';
    setActivePaymentType(type);
    setActivePaymentId(id);
    setSelectedMethod(method);
    setEditableAmount(parseAmount(targetAmount).toFixed(2));
    setTransactionRef('');
    setPayerCardSuffix('');
    setCashReceived(parseAmount(targetAmount).toFixed(2));
    setPaymentModalOpen(true);
  };

  const createAndOpenPayment = () => {
    const normalizedAmount = Number(createPaymentDraft.amount || '0').toFixed(2);

    if (activePaymentType === 'unit') {
      const newId = `UP${String(unitPayments.length + 1).padStart(3, '0')}`;
      setUnitPayments((prev) => [
        {
          id: newId,
          city: '南京',
          payer: createPaymentDraft.payer,
          unitCode: createPaymentDraft.externalCode,
          socialCreditCode: createPaymentDraft.identityNo,
          contactName: createPaymentDraft.contactName || '周岚',
          contactPhone: createPaymentDraft.contactPhone || '13805120011',
          period: createPaymentDraft.periodOrCategory,
          insuranceType: '职工基本医疗保险',
          amount: normalizedAmount,
          method: createPaymentDraft.method,
          status: '待支付',
        },
        ...prev,
      ]);
      setCreatePaymentOpen(false);
      setActivePaymentType('unit');
      setActivePaymentId(newId);
      setSelectedMethod(createPaymentDraft.method);
      setEditableAmount(normalizedAmount);
      setTransactionRef('');
      setPayerCardSuffix('');
      setCashReceived(normalizedAmount);
      setPaymentModalOpen(true);
      return;
    }

    const newId = `PP${String(personalPayments.length + 1).padStart(3, '0')}`;
    setPersonalPayments((prev) => [
      {
        id: newId,
        city: '南京',
        payer: createPaymentDraft.payer,
        gender: createPaymentDraft.gender,
        credentialNo: createPaymentDraft.identityNo,
        insuredNo: createPaymentDraft.externalCode,
        phone: createPaymentDraft.contactPhone || '13905110021',
        category: createPaymentDraft.periodOrCategory,
        amount: normalizedAmount,
        method: createPaymentDraft.method,
        status: '待支付',
      },
      ...prev,
    ]);
    setCreatePaymentOpen(false);
    setActivePaymentType('personal');
    setActivePaymentId(newId);
    setSelectedMethod(createPaymentDraft.method);
    setEditableAmount(normalizedAmount);
    setTransactionRef('');
    setPayerCardSuffix('');
    setCashReceived(normalizedAmount);
    setPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setTransactionRef('');
    setPayerCardSuffix('');
    setCashReceived('');
  };

  const confirmPayment = () => {
    const now = '2026-04-27 15:20';
    const arrivalStatus = selectedMethod === '现金支付' ? '已核销' : '待回传';
    const arrivalChannel =
      selectedMethod === '银联'
        ? '银联缴费通道'
        : selectedMethod === '微信'
          ? '微信支付'
          : selectedMethod === '支付宝'
            ? '支付宝支付'
            : '现金收件';
    const receiptId = `RP${String(receiptRecords.length + 1).padStart(3, '0')}`;
    const receiptBase = {
      id: receiptId,
      method: selectedMethod,
      status: '可打印' as const,
      amount: Number(editableAmount || '0').toFixed(2),
      payTime: now,
      operator: '南京经办柜员-周岚',
      agency: '江苏省医疗保障经办服务中心',
      transactionRef:
        transactionRef ||
        (selectedMethod === '现金支付'
          ? `CASH${now.replace(/[-:\s]/g, '')}`
          : `${selectedMethod === '银联' ? 'YL' : selectedMethod === '微信' ? 'WX' : 'ZFB'}${now.replace(/[-:\s]/g, '')}`),
      remark:
        selectedMethod === '现金支付'
          ? '现金缴费已收讫，请凭本回执办理后续医保业务。'
          : '电子缴费已成功，请凭本回执办理后续医保业务。',
    };
    let createdReceipt: ReceiptRecord | null = null;

    if (activePaymentType === 'unit' && activeUnitPayment) {
      setUnitPayments((prev) =>
        prev.map((item) =>
          item.id === activeUnitPayment.id ? { ...item, method: selectedMethod, status: '已支付' } : item,
        ),
      );
      setPaymentRecords((prev) => [
        {
          id: `REC${String(prev.length + 1).padStart(3, '0')}`,
          payer: activeUnitPayment.payer,
          business: '单位缴费',
          amount: Number(editableAmount || '0').toFixed(2),
          method: selectedMethod,
          transactionRef: receiptBase.transactionRef,
          operator: '周岚',
          time: now,
        },
        ...prev,
      ]);
      setArrivalRecords((prev) => [
        {
          id: `AR${String(prev.length + 1).padStart(3, '0')}`,
          payer: activeUnitPayment.payer,
          business: '单位缴费',
          channel: arrivalChannel,
          batch: `${activeUnitPayment.id}-${now.slice(0, 10).replace(/-/g, '')}`,
          amount: Number(editableAmount || '0').toFixed(2),
          transactionRef: receiptBase.transactionRef,
          bankSerial: `${selectedMethod === '银联' ? 'JSYL' : selectedMethod === '微信' ? 'JSWX' : selectedMethod === '支付宝' ? 'JSZFB' : 'JSCASH'}${now.replace(/[-:\s]/g, '')}`,
          receiveTime: now,
          status: arrivalStatus,
        },
        ...prev,
      ]);
      createdReceipt = {
        ...receiptBase,
        payer: activeUnitPayment.payer,
        voucher: '缴费凭证',
        businessType: '单位缴费',
        period: `${activeUnitPayment.period} 单位职工医保`,
        batchNo: `${activeUnitPayment.id}-${now.slice(0, 10).replace(/-/g, '')}`,
      };
      setReceiptRecords((prev) => [createdReceipt as ReceiptRecord, ...prev]);
    }

    if (activePaymentType === 'personal' && activePersonalPayment) {
      setPersonalPayments((prev) =>
        prev.map((item) =>
          item.id === activePersonalPayment.id ? { ...item, method: selectedMethod, status: '已支付' } : item,
        ),
      );
      setPaymentRecords((prev) => [
        {
          id: `REC${String(prev.length + 1).padStart(3, '0')}`,
          payer: activePersonalPayment.payer,
          business: '个人缴费',
          amount: Number(editableAmount || '0').toFixed(2),
          method: selectedMethod,
          transactionRef: receiptBase.transactionRef,
          operator: '周岚',
          time: now,
        },
        ...prev,
      ]);
      setArrivalRecords((prev) => [
        {
          id: `AR${String(prev.length + 1).padStart(3, '0')}`,
          payer: activePersonalPayment.payer,
          business: '个人缴费',
          channel: arrivalChannel,
          batch: `${activePersonalPayment.id}-${now.slice(0, 10).replace(/-/g, '')}`,
          amount: Number(editableAmount || '0').toFixed(2),
          transactionRef: receiptBase.transactionRef,
          bankSerial: `${selectedMethod === '银联' ? 'JSYL' : selectedMethod === '微信' ? 'JSWX' : selectedMethod === '支付宝' ? 'JSZFB' : 'JSCASH'}${now.replace(/[-:\s]/g, '')}`,
          receiveTime: now,
          status: arrivalStatus,
        },
        ...prev,
      ]);
      createdReceipt = {
        ...receiptBase,
        payer: activePersonalPayment.payer,
        voucher: '电子回执',
        businessType: '个人缴费',
        period: `2026年度${activePersonalPayment.category}医保`,
        batchNo: `${activePersonalPayment.id}-${now.slice(0, 10).replace(/-/g, '')}`,
      };
      setReceiptRecords((prev) => [createdReceipt as ReceiptRecord, ...prev]);
    }

    closePaymentModal();
    if (createdReceipt) {
      openReceiptPreview(createdReceipt);
    }
  };

  const handleBillAction = (billId: string, action: 'generate' | 'close') => {
    setPaymentBills((prev) =>
      prev.map((item) => {
        if (item.id !== billId) return item;
        return {
          ...item,
          status: action === 'generate' ? '已生成' : '已关闭',
        };
      }),
    );
  };

  const handleArrivalConfirm = (recordId: string) => {
    setArrivalRecords((prev) =>
      prev.map((item) => (item.id === recordId ? { ...item, status: '已到账' } : item)),
    );
  };

  const handleReceiptArchive = (receiptId: string) => {
    setReceiptRecords((prev) =>
      prev.map((item) => (item.id === receiptId ? { ...item, status: '已归档' } : item)),
    );
    setActiveReceipt((prev) => (prev && prev.id === receiptId ? { ...prev, status: '已归档' } : prev));
    setReceiptPreviewOpen(false);
  };

  const renderModuleContent = () => {
    if (!currentModule) return null;

    if (currentModule.id === 'unit') {
      return (
        <ModuleShell title="单位缴费" desc="支持选单缴费、支付方式切换、发起缴费和结果入账流转" onBack={() => setSelectedModule(null)}>
          <div className="grid grid-cols-4 gap-4">
            <SummaryCard title="今日单位缴费笔数" value={String(unitPayments.length)} icon={Building2} />
            <SummaryCard title="今日缴费金额" value={todayUnitAmount} icon={CreditCard} />
            <SummaryCard title="待支付单量" value={String(unitPayments.filter((item) => item.status === '待支付').length)} icon={QrCode} />
            <SummaryCard title="已到账单量" value={String(unitPayments.filter((item) => item.status === '已到账').length)} icon={CheckCircle2} />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between rounded-2xl bg-cyan-50/70 p-4">
              <div>
                <p className="text-base font-semibold text-gray-800">办理入口</p>
                <p className="mt-1 text-sm text-gray-500">先点“新建单位缴费”，录入单位和金额后，再进入正式收款和打印回执。</p>
              </div>
              <button onClick={() => openCreatePayment('unit')} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm text-white hover:bg-cyan-700">
                新建单位缴费
              </button>
            </div>
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="搜索单位名称、单号或缴费期数" />
            <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-200">
              <table className="min-w-[1680px] w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['单号', '地市', '缴费单位', '单位编号', '统一社会信用代码', '联系人/电话', '险种', '缴费期数', '金额', '支付方式', '状态', '操作'].map((header) => (
                      <th key={header} className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-600">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUnitPayments.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{item.id}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{item.city}</td>
                      <td className="max-w-[220px] px-4 py-3 text-sm font-medium text-gray-800">
                        <div className="line-clamp-2 leading-6">{item.payer}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{item.unitCode}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-600">{item.socialCreditCode}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{item.contactName} / {item.contactPhone}</td>
                      <td className="max-w-[140px] px-4 py-3 text-sm">
                        <div className="line-clamp-2 leading-6">{item.insuranceType}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{item.period}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-cyan-700">{formatCurrency(parseAmount(item.amount))}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{item.method}</td>
                      <td className="whitespace-nowrap px-4 py-3"><StatusPill text={item.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {(item.status === '待支付' || item.status === '待核验') && (
                            <button onClick={() => openPaymentModal('unit', item.id, item.method)} className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs text-white hover:bg-cyan-700">
                              发起缴费
                            </button>
                          )}
                          {item.status === '已支付' && (
                            <>
                              <button
                                onClick={() => openOrCreateReceiptForPayment('unit', item.id)}
                                className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50"
                              >
                                打印回执
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ModuleShell>
      );
    }

    if (currentModule.id === 'personal') {
      return (
        <ModuleShell title="个人缴费" desc="支持个人缴费发起、方式切换、支付完成后自动生成回执" onBack={() => setSelectedModule(null)}>
          <div className="grid grid-cols-4 gap-4">
            <SummaryCard title="今日个人缴费笔数" value={String(personalPayments.length)} icon={Wallet} />
            <SummaryCard title="微信支付" value={String(personalPayments.filter((item) => item.method === '微信').length)} icon={Smartphone} />
            <SummaryCard title="支付宝支付" value={String(personalPayments.filter((item) => item.method === '支付宝').length)} icon={BadgeCheck} />
            <SummaryCard title="待支付人数" value={String(personalPayments.filter((item) => item.status === '待支付').length)} icon={Receipt} />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between rounded-2xl bg-emerald-50/70 p-4">
              <div>
                <p className="text-base font-semibold text-gray-800">办理入口</p>
                <p className="mt-1 text-sm text-gray-500">先点“新建个人缴费”，录入缴费人、参保类型和金额后，再进入正式收款和打印回执。</p>
              </div>
              <button onClick={() => openCreatePayment('personal')} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700">
                新建个人缴费
              </button>
            </div>
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="搜索缴费人、业务号或参保类型" />
            <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-200">
              <table className="min-w-[1720px] w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['业务号', '地市', '缴费人', '性别', '身份证号', '医保编号', '手机号', '参保类型', '金额', '支付方式', '状态', '操作'].map((header) => (
                      <th key={header} className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-gray-600">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPersonalPayments.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{item.id}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{item.city}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800">{item.payer}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{item.gender}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{item.credentialNo}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{item.insuredNo}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{item.phone}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{item.category}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-cyan-700">{formatCurrency(parseAmount(item.amount))}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{item.method}</td>
                      <td className="whitespace-nowrap px-4 py-3"><StatusPill text={item.status} /></td>
                      <td className="px-4 py-3">
                        {item.status === '待支付' ? (
                          <button onClick={() => openPaymentModal('personal', item.id, item.method)} className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs text-white hover:bg-cyan-700">
                            立即缴费
                          </button>
                        ) : (
                          <button
                            onClick={() => openOrCreateReceiptForPayment('personal', item.id)}
                            className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50"
                          >
                            打印回执
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ModuleShell>
      );
    }

    if (currentModule.id === 'bill') {
      return (
        <ModuleShell title="缴费单管理" desc="支持缴费单生成、关闭和状态处置" onBack={() => setSelectedModule(null)}>
          <div className="grid grid-cols-4 gap-4">
            <SummaryCard title="今日新生成单量" value="68" icon={FileSpreadsheet} />
            <SummaryCard title="待处理单量" value={String(paymentBills.filter((item) => item.status === '待处理').length)} icon={Receipt} />
            <SummaryCard title="部分支付" value={String(paymentBills.filter((item) => item.status === '部分支付').length)} icon={ScanLine} />
            <SummaryCard title="已关闭单量" value={String(paymentBills.filter((item) => item.status === '已关闭').length)} icon={Printer} />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="搜索缴费单号、主题或类型" />
            <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['单号', '主题', '单据类型', '征缴期间', '人数/笔数', '制单科室', '状态', '操作'].map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBills.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{item.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.subject}</td>
                      <td className="px-4 py-3 text-sm">{item.type}</td>
                      <td className="px-4 py-3 text-sm">{item.period}</td>
                      <td className="px-4 py-3 text-sm">{item.count}</td>
                      <td className="px-4 py-3 text-sm">{item.issuer}</td>
                      <td className="px-4 py-3"><StatusPill text={item.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {item.status === '待处理' && (
                            <button onClick={() => handleBillAction(item.id, 'generate')} className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs text-white hover:bg-cyan-700">
                              生成缴费单
                            </button>
                          )}
                          {item.status !== '已关闭' && (
                            <button onClick={() => handleBillAction(item.id, 'close')} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                              关闭单据
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ModuleShell>
      );
    }

    if (currentModule.id === 'record') {
      return (
        <ModuleShell title="缴费记录查询" desc="支持按关键字和支付方式检索缴费记录" onBack={() => setSelectedModule(null)}>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="搜索记录号、缴费人或业务类型"
              extra={
                <select
                  value={recordMethodFilter}
                  onChange={(event) => setRecordMethodFilter(event.target.value as '全部' | PaymentMethod)}
                  className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-cyan-400"
                >
                  <option value="全部">全部方式</option>
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              }
            />

            <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['记录号', '缴费人', '业务类型', '金额', '支付方式', '交易流水', '经办人员', '支付时间'].map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{item.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.payer}</td>
                      <td className="px-4 py-3 text-sm">{item.business}</td>
                      <td className="px-4 py-3 text-sm text-cyan-700">{formatCurrency(parseAmount(item.amount))}</td>
                      <td className="px-4 py-3 text-sm">{item.method}</td>
                      <td className="px-4 py-3 text-sm">{item.transactionRef}</td>
                      <td className="px-4 py-3 text-sm">{item.operator}</td>
                      <td className="px-4 py-3 text-sm">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ModuleShell>
      );
    }

    if (currentModule.id === 'arrival') {
      return (
        <ModuleShell title="到账状态查询" desc="支持查询到账状态并手工确认到账" onBack={() => setSelectedModule(null)}>
          <div className="grid grid-cols-4 gap-4">
            <SummaryCard title="当日到账批次" value={String(arrivalRecords.length)} icon={Landmark} />
            <SummaryCard title="已到账金额" value={todayArrivalAmount} icon={CheckCircle2} />
            <SummaryCard title="待回传批次" value={String(arrivalRecords.filter((item) => item.status === '待回传').length)} icon={ScanLine} />
            <SummaryCard title="部分到账批次" value={String(arrivalRecords.filter((item) => item.status === '部分到账').length)} icon={BadgeCheck} />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            {focusedArrivalId && (
              <div className="mb-4 rounded-2xl border border-cyan-200 bg-cyan-50/60 p-4">
                <p className="text-sm font-semibold text-gray-800">当前查看的是某一笔缴费对应的到账结果</p>
                <p className="mt-1 text-sm text-gray-600">
                  已按缴费人或交易流水自动筛到对应到账记录，不需要你自己在列表里猜。
                </p>
              </div>
            )}
            <SearchBar value={searchTerm} onChange={(value) => { setSearchTerm(value); if (!value) setFocusedArrivalId(null); }} placeholder="搜索缴费人、交易流水、批次号、通道或状态" />
            <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['缴费人', '业务类型', '交易流水', '批次号', '通道', '金额', '银行流水', '到账时间', '状态', '操作'].map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredArrivals.map((item) => (
                    <tr key={item.id} className={`${focusedArrivalId === item.id ? 'bg-cyan-50/60' : 'hover:bg-gray-50'}`}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.payer}</td>
                      <td className="px-4 py-3 text-sm">{item.business}</td>
                      <td className="px-4 py-3 text-sm">{item.transactionRef}</td>
                      <td className="px-4 py-3 text-sm">{item.batch}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.channel}</td>
                      <td className="px-4 py-3 text-sm text-cyan-700">{formatCurrency(parseAmount(item.amount))}</td>
                      <td className="px-4 py-3 text-sm">{item.bankSerial}</td>
                      <td className="px-4 py-3 text-sm">{item.receiveTime}</td>
                      <td className="px-4 py-3"><StatusPill text={item.status} /></td>
                      <td className="px-4 py-3">
                        {item.status !== '已到账' && (
                          <button onClick={() => handleArrivalConfirm(item.id)} className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs text-white hover:bg-cyan-700">
                            确认到账
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ModuleShell>
      );
    }

    return (
      <ModuleShell title="缴费回执打印" desc="支持预览、打印和归档缴费回执" onBack={() => setSelectedModule(null)}>
        <div className="grid grid-cols-4 gap-4">
          <SummaryCard title="今日可打印回执" value={String(receiptRecords.filter((item) => item.status === '可打印').length)} icon={Printer} />
          <SummaryCard title="电子回执" value={String(receiptRecords.filter((item) => item.voucher.includes('电子')).length)} icon={Receipt} />
          <SummaryCard title="现金收据" value={String(receiptRecords.filter((item) => item.method === '现金支付').length)} icon={Wallet} />
          <SummaryCard title="已归档数量" value={String(receiptRecords.filter((item) => item.status === '已归档').length)} icon={BadgeCheck} />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="搜索回执号、缴费人或支付方式" />
          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['回执号', '缴费人', '业务类型', '凭证类型', '支付方式', '交易流水', '状态', '操作'].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReceipts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{item.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.payer}</td>
                    <td className="px-4 py-3 text-sm">{item.businessType}</td>
                    <td className="px-4 py-3 text-sm">{item.voucher}</td>
                    <td className="px-4 py-3 text-sm">{item.method}</td>
                    <td className="px-4 py-3 text-sm">{item.transactionRef}</td>
                    <td className="px-4 py-3"><StatusPill text={item.status} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => openReceiptPreview(item)} className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs text-white hover:bg-cyan-700">
                        打印
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ModuleShell>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">缴费工作台</h2>
          <p className="mt-1 text-sm text-gray-500">单位缴费、个人缴费、缴费单管理、到账与回执办理</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {modules.map((module, index) => {
          const Icon = module.icon;
          return (
            <motion.button
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setSearchTerm('');
                setSelectedModule(module.id);
              }}
              className="group rounded-2xl border border-gray-200 bg-white p-8 text-left shadow-md transition-all hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl"
            >
              <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${module.color} shadow-lg transition-transform group-hover:scale-110`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">{module.title}</h3>
              <p className="mb-5 text-base text-gray-500">{module.desc}</p>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <span key={method} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                    {method}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center text-sm font-medium text-cyan-600 opacity-0 transition-opacity group-hover:opacity-100">
                <span>进入办理</span>
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedModule && currentModule && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 overflow-y-auto bg-gray-100">
            {renderModuleContent()}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <CreatePaymentModal
          open={createPaymentOpen}
          type={activePaymentType}
          draft={createPaymentDraft}
          onChange={setCreatePaymentDraft}
          onClose={() => setCreatePaymentOpen(false)}
          onConfirm={createAndOpenPayment}
        />
      </AnimatePresence>

      <AnimatePresence>
        <PaymentActionModal
          open={paymentModalOpen}
          title={activePaymentType === 'unit' ? '单位缴费办理' : '个人缴费办理'}
          amount={formatCurrency(parseAmount(activePaymentType === 'unit' ? activeUnitPayment?.amount || '0' : activePersonalPayment?.amount || '0'))}
          payer={activePaymentType === 'unit' ? activeUnitPayment?.payer || '' : activePersonalPayment?.payer || ''}
          paymentMethod={selectedMethod}
          editableAmount={editableAmount}
          onAmountChange={setEditableAmount}
          transactionRef={transactionRef}
          onTransactionRefChange={setTransactionRef}
          payerCardSuffix={payerCardSuffix}
          onPayerCardSuffixChange={setPayerCardSuffix}
          cashReceived={cashReceived}
          onCashReceivedChange={setCashReceived}
          onMethodChange={setSelectedMethod}
          onClose={closePaymentModal}
          onConfirm={confirmPayment}
        />
      </AnimatePresence>

      <AnimatePresence>
        <ReceiptPreviewModal
          open={receiptPreviewOpen}
          record={activeReceipt}
          onClose={() => {
            setReceiptPreviewOpen(false);
            setActiveReceipt(null);
          }}
          onArchive={handleReceiptArchive}
        />
      </AnimatePresence>
    </div>
  );
}
