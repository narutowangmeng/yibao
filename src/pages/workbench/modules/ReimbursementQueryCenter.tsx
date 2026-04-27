import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Search, Upload, Eye, X } from 'lucide-react';
import * as XLSX from 'xlsx';

export interface FeeDetailItem {
  id: string;
  itemName: string;
  category: string;
  unitPrice: number;
  quantity: number;
  amount: number;
  scopeType: '目录内' | '目录外';
  selfPayRatio: number;
  payAmount: number;
  remark: string;
}

export interface ReimbursementLedgerItem {
  id: string;
  personName: string;
  idCard: string;
  reimbursementType: string;
  agency: string;
  hospital: string;
  hospitalLevel: string;
  visitDate: string;
  totalAmount: number;
  inScopeAmount: number;
  selfPayAmount: number;
  reimbursementAmount: number;
  status: string;
  diagnosis: string;
  settlementNo: string;
  auditOpinion: string;
  reviewerName: string;
  settleDate: string;
  feeDetails: FeeDetailItem[];
}

const reimbursementHeaders = [
  '报销单号',
  '姓名',
  '身份证号',
  '报销类型',
  '参保地',
  '就诊医院',
  '医院等级',
  '就诊日期',
  '总费用',
  '目录内金额',
  '个人自付金额',
  '报销金额',
  '状态',
  '诊断',
  '结算单号',
  '审核意见',
  '审核人员',
  '结算日期',
];

const createFeeDetails = (type: string, totalAmount: number): FeeDetailItem[] => {
  const templates: Record<string, Array<{ itemName: string; category: string; unitPrice: number; quantity: number; scopeType: '目录内' | '目录外'; selfPayRatio: number; remark: string }>> = {
    门诊报销: [
      { itemName: '普通门诊诊查费', category: '诊疗项目', unitPrice: 18, quantity: 1, scopeType: '目录内', selfPayRatio: 0.15, remark: '门诊统筹范围内' },
      { itemName: '血常规检查', category: '检验项目', unitPrice: 35, quantity: 1, scopeType: '目录内', selfPayRatio: 0.15, remark: '诊断所需检查' },
      { itemName: '厄贝沙坦片', category: '药品费用', unitPrice: 46, quantity: 2, scopeType: '目录内', selfPayRatio: 0.15, remark: '慢病常用药' },
    ],
    特殊门诊: [
      { itemName: '门慢门特诊查费', category: '诊疗项目', unitPrice: 24, quantity: 1, scopeType: '目录内', selfPayRatio: 0.1, remark: '门特备案有效' },
      { itemName: '糖化血红蛋白检测', category: '检验项目', unitPrice: 82, quantity: 1, scopeType: '目录内', selfPayRatio: 0.1, remark: '随访检测' },
      { itemName: '甘精胰岛素注射液', category: '药品费用', unitPrice: 138, quantity: 2, scopeType: '目录内', selfPayRatio: 0.1, remark: '门特药品' },
    ],
    住院报销: [
      { itemName: '住院床位费', category: '床位护理', unitPrice: 80, quantity: 6, scopeType: '目录内', selfPayRatio: 0.15, remark: '普通病房床位' },
      { itemName: '手术治疗费', category: '手术治疗', unitPrice: 4200, quantity: 1, scopeType: '目录内', selfPayRatio: 0.15, remark: '按病种支付范围内' },
      { itemName: '抗菌药物费用', category: '药品费用', unitPrice: 86, quantity: 8, scopeType: '目录内', selfPayRatio: 0.15, remark: '住院常规用药' },
      { itemName: '一次性耗材', category: '医用耗材', unitPrice: 980, quantity: 1, scopeType: '目录外', selfPayRatio: 1, remark: '部分耗材个人自付' },
    ],
    生育报销: [
      { itemName: '产前检查费', category: '诊疗项目', unitPrice: 320, quantity: 1, scopeType: '目录内', selfPayRatio: 0.12, remark: '生育待遇范围内' },
      { itemName: '分娩接生费', category: '手术治疗', unitPrice: 2600, quantity: 1, scopeType: '目录内', selfPayRatio: 0.12, remark: '符合生育支付政策' },
      { itemName: '待产床位费', category: '床位护理', unitPrice: 120, quantity: 3, scopeType: '目录内', selfPayRatio: 0.12, remark: '住院期间床位费' },
    ],
    急诊报销: [
      { itemName: '急诊诊查费', category: '诊疗项目', unitPrice: 26, quantity: 1, scopeType: '目录内', selfPayRatio: 0.2, remark: '急诊就医项目' },
      { itemName: '抢救监护费', category: '治疗项目', unitPrice: 180, quantity: 1, scopeType: '目录内', selfPayRatio: 0.2, remark: '抢救期间监护' },
      { itemName: '补液治疗费', category: '治疗项目', unitPrice: 98, quantity: 2, scopeType: '目录内', selfPayRatio: 0.2, remark: '抢救辅助治疗' },
    ],
    异地报销: [
      { itemName: '异地门诊诊查费', category: '诊疗项目', unitPrice: 25, quantity: 1, scopeType: '目录内', selfPayRatio: 0.18, remark: '已备案异地就医' },
      { itemName: 'MRI检查', category: '检验项目', unitPrice: 620, quantity: 1, scopeType: '目录内', selfPayRatio: 0.18, remark: '门诊影像检查' },
      { itemName: '康复治疗费', category: '治疗项目', unitPrice: 85, quantity: 5, scopeType: '目录内', selfPayRatio: 0.18, remark: '异地康复治疗' },
    ],
    特殊药品报销: [
      { itemName: '阿达木单抗注射液', category: '双通道药品', unitPrice: 1298, quantity: 2, scopeType: '目录内', selfPayRatio: 0.1, remark: '双通道药店购药' },
      { itemName: '药事服务费', category: '药事服务', unitPrice: 20, quantity: 1, scopeType: '目录内', selfPayRatio: 0.1, remark: '定点药店配药' },
      { itemName: '冷链配送服务费', category: '其他费用', unitPrice: 30, quantity: 1, scopeType: '目录外', selfPayRatio: 1, remark: '目录外服务费' },
    ],
    大病报销: [
      { itemName: '肿瘤内科诊疗费', category: '诊疗项目', unitPrice: 120, quantity: 2, scopeType: '目录内', selfPayRatio: 0.08, remark: '大病待遇范围内' },
      { itemName: '化疗药物费用', category: '药品费用', unitPrice: 980, quantity: 4, scopeType: '目录内', selfPayRatio: 0.08, remark: '大病特殊治疗药品' },
      { itemName: '输液泵使用费', category: '医用耗材', unitPrice: 260, quantity: 1, scopeType: '目录外', selfPayRatio: 1, remark: '部分耗材个人负担' },
    ],
  };

  const details = templates[type] || templates['门诊报销'];
  const currentTotal = details.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const scale = currentTotal > 0 ? totalAmount / currentTotal : 1;

  return details.map((item, index) => {
    const amount = Number((item.unitPrice * item.quantity * scale).toFixed(2));
    return {
      id: `${type}-${index + 1}`,
      itemName: item.itemName,
      category: item.category,
      unitPrice: Number((item.unitPrice * scale).toFixed(2)),
      quantity: item.quantity,
      amount,
      scopeType: item.scopeType,
      selfPayRatio: item.selfPayRatio,
      payAmount: item.scopeType === '目录内' ? Number((amount * (1 - item.selfPayRatio) * 0.8).toFixed(2)) : 0,
      remark: item.remark,
    };
  });
};

const baseRows: Omit<ReimbursementLedgerItem, 'feeDetails'>[] = [
  { id: 'BX320100202604001', personName: '陈思远', idCard: '320102198903152415', reimbursementType: '门诊报销', agency: '南京', hospital: '南京市第一医院', hospitalLevel: '三级甲等', visitDate: '2026-04-12', totalAmount: 860, inScopeAmount: 780, selfPayAmount: 178, reimbursementAmount: 602, status: '已办结', diagnosis: '高血压伴眩晕', settlementNo: 'JSJS20260412001', auditOpinion: '票据齐全，按门诊统筹支付', reviewerName: '周岚', settleDate: '2026-04-15' },
  { id: 'BX320200202604002', personName: '周语彤', idCard: '320205199407263526', reimbursementType: '住院报销', agency: '无锡', hospital: '无锡市人民医院', hospitalLevel: '三级甲等', visitDate: '2026-04-08', totalAmount: 13200, inScopeAmount: 11800, selfPayAmount: 3960, reimbursementAmount: 9240, status: '审核中', diagnosis: '胆囊结石', settlementNo: 'JSJS20260408002', auditOpinion: '待复核住院病案首页', reviewerName: '许晴', settleDate: '' },
  { id: 'BX320500202604003', personName: '陆书恺', idCard: '320507200812163214', reimbursementType: '特殊门诊', agency: '苏州', hospital: '苏州大学附属儿童医院', hospitalLevel: '三级甲等', visitDate: '2026-04-16', totalAmount: 1260, inScopeAmount: 1080, selfPayAmount: 315, reimbursementAmount: 945, status: '待初审', diagnosis: '儿童哮喘门慢复诊', settlementNo: 'JSJS20260416003', auditOpinion: '待核验门慢备案信息', reviewerName: '陆敏', settleDate: '' },
  { id: 'BX320600202604004', personName: '许文博', idCard: '320602198805204517', reimbursementType: '异地报销', agency: '南通', hospital: '上海瑞金医院', hospitalLevel: '三级甲等', visitDate: '2026-04-05', totalAmount: 6400, inScopeAmount: 5600, selfPayAmount: 2020, reimbursementAmount: 4380, status: '已办结', diagnosis: '腰椎间盘突出', settlementNo: 'JSJS20260405004', auditOpinion: '异地备案有效，按政策支付', reviewerName: '高宁', settleDate: '2026-04-10' },
  { id: 'BX320300202604005', personName: '王子拓', idCard: '320303197612054331', reimbursementType: '特殊药品报销', agency: '徐州', hospital: '徐州医科大学附属医院', hospitalLevel: '三级甲等', visitDate: '2026-04-18', totalAmount: 3920, inScopeAmount: 3560, selfPayAmount: 980, reimbursementAmount: 2580, status: '待复审', diagnosis: '类风湿关节炎', settlementNo: 'JSJS20260418005', auditOpinion: '双通道处方待校验', reviewerName: '赵静', settleDate: '' },
  { id: 'BX320400202604006', personName: '沈佳宁', idCard: '320402199211236628', reimbursementType: '门诊报销', agency: '常州', hospital: '常州市第二人民医院', hospitalLevel: '三级甲等', visitDate: '2026-04-08', totalAmount: 540, inScopeAmount: 500, selfPayAmount: 120, reimbursementAmount: 380, status: '已办结', diagnosis: '上呼吸道感染', settlementNo: 'JSJS20260408006', auditOpinion: '普通门诊统筹结算完成', reviewerName: '蒋雯', settleDate: '2026-04-09' },
  { id: 'BX320700202604007', personName: '孙明轩', idCard: '320703198507276419', reimbursementType: '住院报销', agency: '连云港', hospital: '连云港市第一人民医院', hospitalLevel: '三级甲等', visitDate: '2026-04-07', totalAmount: 18350, inScopeAmount: 16900, selfPayAmount: 5080, reimbursementAmount: 11820, status: '退回补件', diagnosis: '冠状动脉粥样硬化性心脏病', settlementNo: 'JSJS20260407007', auditOpinion: '需补充高值耗材授权单', reviewerName: '韩倩', settleDate: '' },
  { id: 'BX320800202604008', personName: '朱雨彤', idCard: '320802199912167245', reimbursementType: '生育报销', agency: '淮安', hospital: '淮安市第一人民医院', hospitalLevel: '三级甲等', visitDate: '2026-04-15', totalAmount: 9620, inScopeAmount: 8840, selfPayAmount: 2540, reimbursementAmount: 6300, status: '已办结', diagnosis: '子宫肌瘤', settlementNo: 'JSJS20260415008', auditOpinion: '病案首页及清单齐全', reviewerName: '严峰', settleDate: '2026-04-18' },
  { id: 'BX320900202604009', personName: '何嘉悦', idCard: '320902200104217820', reimbursementType: '特殊门诊', agency: '盐城', hospital: '盐城市第三人民医院', hospitalLevel: '三级甲等', visitDate: '2026-04-19', totalAmount: 2210, inScopeAmount: 1980, selfPayAmount: 540, reimbursementAmount: 1440, status: '审核中', diagnosis: '糖尿病并周围神经病变', settlementNo: 'JSJS20260419009', auditOpinion: '待复核耗材支付范围', reviewerName: '曹颖', settleDate: '' },
  { id: 'BX321000202604010', personName: '郭天宇', idCard: '321002198610024671', reimbursementType: '特殊药品报销', agency: '扬州', hospital: '扬州大学附属医院', hospitalLevel: '三级甲等', visitDate: '2026-04-17', totalAmount: 5680, inScopeAmount: 5360, selfPayAmount: 1520, reimbursementAmount: 3840, status: '已办结', diagnosis: '强直性脊柱炎', settlementNo: 'JSJS20260417010', auditOpinion: '双通道药品按比例支付', reviewerName: '邵琳', settleDate: '2026-04-20' },
  { id: 'BX321100202604011', personName: '宋知行', idCard: '321102197905185812', reimbursementType: '住院报销', agency: '镇江', hospital: '镇江市第一人民医院', hospitalLevel: '三级甲等', visitDate: '2026-04-11', totalAmount: 12740, inScopeAmount: 11360, selfPayAmount: 4020, reimbursementAmount: 7340, status: '退回补件', diagnosis: '膝关节半月板损伤', settlementNo: 'JSJS20260411011', auditOpinion: '高值耗材授权材料缺失', reviewerName: '唐璐', settleDate: '' },
  { id: 'BX321200202604012', personName: '丁晓岚', idCard: '321202199512238426', reimbursementType: '门诊报销', agency: '泰州', hospital: '泰州市人民医院', hospitalLevel: '三级甲等', visitDate: '2026-04-14', totalAmount: 430, inScopeAmount: 400, selfPayAmount: 90, reimbursementAmount: 310, status: '已办结', diagnosis: '慢性胃炎', settlementNo: 'JSJS20260414012', auditOpinion: '目录内项目，票据完整', reviewerName: '孔洁', settleDate: '2026-04-15' },
  { id: 'BX321300202604013', personName: '袁晨浩', idCard: '321302198311146117', reimbursementType: '大病报销', agency: '宿迁', hospital: '宿迁市第一人民医院', hospitalLevel: '三级甲等', visitDate: '2026-04-20', totalAmount: 21460, inScopeAmount: 19500, selfPayAmount: 6220, reimbursementAmount: 13280, status: '审核中', diagnosis: '恶性肿瘤术后化疗', settlementNo: 'JSJS20260420013', auditOpinion: '待跨省明细回传校验', reviewerName: '彭雪', settleDate: '' },
  { id: 'BX320100202604014', personName: '林若溪', idCard: '320104199807223942', reimbursementType: '特殊门诊', agency: '南京', hospital: '江苏省人民医院', hospitalLevel: '三级甲等', visitDate: '2026-04-13', totalAmount: 1760, inScopeAmount: 1620, selfPayAmount: 450, reimbursementAmount: 1170, status: '已办结', diagnosis: '系统性红斑狼疮', settlementNo: 'JSJS20260413014', auditOpinion: '门慢待遇支付完成', reviewerName: '周岚', settleDate: '2026-04-16' },
  { id: 'BX320500202604015', personName: '赵嘉钰', idCard: '320506197702013655', reimbursementType: '住院报销', agency: '苏州', hospital: '苏州市立医院', hospitalLevel: '三级甲等', visitDate: '2026-04-10', totalAmount: 8360, inScopeAmount: 7680, selfPayAmount: 2040, reimbursementAmount: 5640, status: '已支付', diagnosis: '泌尿系结石', settlementNo: 'JSJS20260410015', auditOpinion: '报销款已拨付', reviewerName: '陆敏', settleDate: '2026-04-13' },
  { id: 'BX320200202604016', personName: '顾辰昊', idCard: '320205200011053728', reimbursementType: '门诊报销', agency: '无锡', hospital: '无锡市第二人民医院', hospitalLevel: '三级甲等', visitDate: '2026-04-21', totalAmount: 580, inScopeAmount: 520, selfPayAmount: 130, reimbursementAmount: 390, status: '待初审', diagnosis: '银屑病复诊', settlementNo: 'JSJS20260421016', auditOpinion: '待审核电子发票真伪', reviewerName: '钱莹', settleDate: '' },
  { id: 'BX320300202604017', personName: '韩奕辰', idCard: '320322198404206318', reimbursementType: '异地报销', agency: '徐州', hospital: '北京协和医院', hospitalLevel: '三级甲等', visitDate: '2026-04-06', totalAmount: 10980, inScopeAmount: 9860, selfPayAmount: 2980, reimbursementAmount: 6880, status: '已办结', diagnosis: '甲状腺恶性肿瘤', settlementNo: 'JSJS20260406017', auditOpinion: '异地转诊备案完整', reviewerName: '赵静', settleDate: '2026-04-11' },
  { id: 'BX320700202604018', personName: '蒋安琪', idCard: '320706199302148924', reimbursementType: '门诊报销', agency: '连云港', hospital: '连云港市中医院', hospitalLevel: '三级甲等', visitDate: '2026-04-03', totalAmount: 390, inScopeAmount: 360, selfPayAmount: 95, reimbursementAmount: 265, status: '已办结', diagnosis: '颈椎病', settlementNo: 'JSJS20260403018', auditOpinion: '收费项目与病情相符', reviewerName: '韩倩', settleDate: '2026-04-04' },
  { id: 'BX320900202604019', personName: '郑博森', idCard: '320921198612302416', reimbursementType: '住院报销', agency: '盐城', hospital: '盐城市第一人民医院', hospitalLevel: '三级甲等', visitDate: '2026-04-22', totalAmount: 16780, inScopeAmount: 15260, selfPayAmount: 4680, reimbursementAmount: 10580, status: '退回补件', diagnosis: '脑梗死恢复期', settlementNo: 'JSJS20260422019', auditOpinion: '康复项目频次需复核', reviewerName: '曹颖', settleDate: '' },
  { id: 'BX321000202604020', personName: '陶诗雨', idCard: '321003199611058260', reimbursementType: '特殊门诊', agency: '扬州', hospital: '扬州市妇幼保健院', hospitalLevel: '三级甲等', visitDate: '2026-04-18', totalAmount: 2480, inScopeAmount: 2280, selfPayAmount: 620, reimbursementAmount: 1660, status: '已办结', diagnosis: '甲状腺功能减退', settlementNo: 'JSJS20260418020', auditOpinion: '用药周期和剂量合理', reviewerName: '邵琳', settleDate: '2026-04-21' },
];

export const initialReimbursementLedgerData: ReimbursementLedgerItem[] = baseRows.map((item) => ({
  ...item,
  feeDetails: createFeeDetails(item.reimbursementType, item.totalAmount),
}));

export default function ReimbursementQueryCenter({
  onBack,
  rows: externalRows,
  onRowsChange,
  initialKeyword,
}: {
  onBack: () => void;
  rows?: ReimbursementLedgerItem[];
  onRowsChange?: (rows: ReimbursementLedgerItem[]) => void;
  initialKeyword?: string;
}) {
  const [keyword, setKeyword] = useState(initialKeyword || '');
  const [rows, setRows] = useState<ReimbursementLedgerItem[]>(externalRows || initialReimbursementLedgerData);
  const [selectedItem, setSelectedItem] = useState<ReimbursementLedgerItem | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (externalRows) {
      setRows(externalRows);
    }
  }, [externalRows]);

  useEffect(() => {
    if (initialKeyword !== undefined) {
      setKeyword(initialKeyword);
    }
  }, [initialKeyword]);

  const filteredRows = useMemo(
    () =>
      rows.filter((item) =>
        [item.id, item.personName, item.idCard, item.hospital, item.settlementNo, item.reimbursementType].some((value) =>
          value.includes(keyword),
        ),
      ),
    [rows, keyword],
  );

  const writeWorkbook = (data: Array<Record<string, string | number>>, fileName: string) => {
    const sheet = XLSX.utils.json_to_sheet(data, { header: reimbursementHeaders });
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, '费用报销台账');
    XLSX.writeFile(book, fileName);
  };

  const toExportRow = (item: ReimbursementLedgerItem) => ({
    报销单号: item.id,
    姓名: item.personName,
    身份证号: item.idCard,
    报销类型: item.reimbursementType,
    参保地: item.agency,
    就诊医院: item.hospital,
    医院等级: item.hospitalLevel,
    就诊日期: item.visitDate,
    总费用: item.totalAmount,
    目录内金额: item.inScopeAmount,
    个人自付金额: item.selfPayAmount,
    报销金额: item.reimbursementAmount,
    状态: item.status,
    诊断: item.diagnosis,
    结算单号: item.settlementNo,
    审核意见: item.auditOpinion,
    审核人员: item.reviewerName,
    结算日期: item.settleDate,
  });

  const downloadTemplate = () => {
    writeWorkbook(initialReimbursementLedgerData.slice(0, 3).map(toExportRow), '费用报销导入模板.xlsx');
  };

  const exportRows = () => {
    writeWorkbook(filteredRows.map(toExportRow), `费用报销查询结果_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '', raw: false });

    const importedRows: ReimbursementLedgerItem[] = data
      .filter((item) => item['姓名'] && item['身份证号'])
      .map((item, index) => {
        const reimbursementType = String(item['报销类型'] || '门诊报销');
        const totalAmount = Number(item['总费用'] || 0);
        return {
          id: String(item['报销单号'] || `BXIMP${String(index + 1).padStart(4, '0')}`),
          personName: String(item['姓名'] || ''),
          idCard: String(item['身份证号'] || ''),
          reimbursementType,
          agency: String(item['参保地'] || ''),
          hospital: String(item['就诊医院'] || ''),
          hospitalLevel: String(item['医院等级'] || '三级甲等'),
          visitDate: String(item['就诊日期'] || ''),
          totalAmount,
          inScopeAmount: Number(item['目录内金额'] || 0),
          selfPayAmount: Number(item['个人自付金额'] || 0),
          reimbursementAmount: Number(item['报销金额'] || 0),
          status: String(item['状态'] || '待初审'),
          diagnosis: String(item['诊断'] || ''),
          settlementNo: String(item['结算单号'] || ''),
          auditOpinion: String(item['审核意见'] || ''),
          reviewerName: String(item['审核人员'] || ''),
          settleDate: String(item['结算日期'] || ''),
          feeDetails: createFeeDetails(reimbursementType, totalAmount),
        };
      });

    if (importedRows.length) {
      setRows((prev) => {
        const nextRows = [...importedRows, ...prev];
        onRowsChange?.(nextRows);
        return nextRows;
      });
    }
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">费用报销查询</h1>
              <p className="text-sm text-gray-500">统一查询报销申请、审核进度、结算结果，并支持导入导出。</p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-sm text-gray-500">报销记录</div>
            <div className="mt-2 text-3xl font-bold text-gray-800">{rows.length}</div>
          </div>
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="text-sm text-green-700">已办结</div>
            <div className="mt-2 text-3xl font-bold text-green-600">{rows.filter((item) => ['已办结', '已支付'].includes(item.status)).length}</div>
          </div>
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
            <div className="text-sm text-yellow-700">处理中</div>
            <div className="mt-2 text-3xl font-bold text-yellow-600">{rows.filter((item) => !['已办结', '已支付'].includes(item.status)).length}</div>
          </div>
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
            <div className="text-sm text-cyan-700">费用明细条数</div>
            <div className="mt-2 text-3xl font-bold text-cyan-600">{rows.reduce((sum, item) => sum + item.feeDetails.length, 0)}</div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="请输入姓名、身份证号、报销单号、医院名称、结算单号查询"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4"
              />
            </div>
            <button onClick={downloadTemplate} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
              <Download className="h-4 w-4" />
              下载模板
            </button>
            <button onClick={() => importRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-cyan-300 px-4 py-2 text-cyan-700 hover:bg-cyan-50">
              <Upload className="h-4 w-4" />
              导入台账
            </button>
            <button onClick={exportRows} className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
              <Download className="h-4 w-4" />
              导出结果
            </button>
            <input ref={importRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[1650px]">
            <thead className="bg-gray-50">
              <tr>
                {reimbursementHeaders.map((header) => (
                  <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    {header}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRows.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-cyan-600">{item.id}</td>
                  <td className="px-4 py-3">{item.personName}</td>
                  <td className="px-4 py-3">{item.idCard}</td>
                  <td className="px-4 py-3">{item.reimbursementType}</td>
                  <td className="px-4 py-3">{item.agency}</td>
                  <td className="px-4 py-3">{item.hospital}</td>
                  <td className="px-4 py-3">{item.hospitalLevel}</td>
                  <td className="px-4 py-3">{item.visitDate}</td>
                  <td className="px-4 py-3">{item.totalAmount}</td>
                  <td className="px-4 py-3">{item.inScopeAmount}</td>
                  <td className="px-4 py-3">{item.selfPayAmount}</td>
                  <td className="px-4 py-3">{item.reimbursementAmount}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">{item.diagnosis}</td>
                  <td className="px-4 py-3">{item.settlementNo}</td>
                  <td className="px-4 py-3">{item.auditOpinion}</td>
                  <td className="px-4 py-3">{item.reviewerName}</td>
                  <td className="px-4 py-3">{item.settleDate || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelectedItem(item)} className="rounded p-2 text-cyan-600 hover:bg-cyan-50">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-6xl rounded-2xl bg-white max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b p-6">
                <h3 className="text-lg font-bold text-gray-800">报销详情 - {selectedItem.id}</h3>
                <button onClick={() => setSelectedItem(null)} className="rounded p-2 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(toExportRow(selectedItem)).map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 border-b border-gray-100 py-2">
                      <span className="text-gray-500">{label}</span>
                      <span className="text-right font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-base font-bold text-gray-800">费用明细</h4>
                    <span className="text-sm text-gray-500">共 {selectedItem.feeDetails.length} 条</span>
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-gray-200">
                    <table className="w-full min-w-[980px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">项目名称</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">费用类别</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">单价</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">数量</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">金额</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">目录属性</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">个人自付比例</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">医保支付金额</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">备注</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {selectedItem.feeDetails.map((detail) => (
                          <tr key={detail.id}>
                            <td className="px-4 py-3">{detail.itemName}</td>
                            <td className="px-4 py-3">{detail.category}</td>
                            <td className="px-4 py-3">{detail.unitPrice.toFixed(2)}</td>
                            <td className="px-4 py-3">{detail.quantity}</td>
                            <td className="px-4 py-3">{detail.amount.toFixed(2)}</td>
                            <td className="px-4 py-3">{detail.scopeType}</td>
                            <td className="px-4 py-3">{(detail.selfPayRatio * 100).toFixed(0)}%</td>
                            <td className="px-4 py-3 text-emerald-600 font-medium">{detail.payAmount.toFixed(2)}</td>
                            <td className="px-4 py-3">{detail.remark}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
