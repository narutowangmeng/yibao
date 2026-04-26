import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Search, Upload, Eye, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface PaymentLedgerItem {
  id: string;
  personName: string;
  idCard: string;
  insuranceType: string;
  paymentType: string;
  agency: string;
  period: string;
  baseAmount: number;
  receivableAmount: number;
  paidAmount: number;
  status: string;
  employerName: string;
  employerCode: string;
  noticeNo: string;
  arrivalChannel: string;
  handlingStatus: string;
  operatorName: string;
  approvedDate: string;
  remarks: string;
}

const paymentHeaders = [
  '核定单号',
  '姓名',
  '身份证号',
  '险种',
  '缴费类型',
  '参保地',
  '费款所属期',
  '缴费基数',
  '应缴金额',
  '实缴金额',
  '到账状态',
  '单位名称',
  '统一社会信用代码',
  '通知单号',
  '到账渠道',
  '经办状态',
  '经办人员',
  '核定日期',
  '备注',
];

const initialRows: PaymentLedgerItem[] = [
  { id: 'JD320100202604001', personName: '陈思远', idCard: '320102198903152415', insuranceType: '职工基本医疗保险', paymentType: '基数核定', agency: '南京', period: '2026-04', baseAmount: 9800, receivableAmount: 980, paidAmount: 980, status: '已到账', employerName: '南京云联数据科技有限公司', employerCode: '91320104MA27XQ6M8H', noticeNo: 'TZD20260411001', arrivalChannel: '税务批扣', handlingStatus: '已办结', operatorName: '周岚', approvedDate: '2026-04-11', remarks: '按4月工资申报口径核定' },
  { id: 'JD320200202604002', personName: '周语彤', idCard: '320205199407263526', insuranceType: '城乡居民基本医疗保险', paymentType: '年度正常缴费', agency: '无锡', period: '2026', baseAmount: 0, receivableAmount: 450, paidAmount: 450, status: '已到账', employerName: '无锡市梁溪区医保中心', employerCode: '12320200MB1F40211L', noticeNo: 'TZD20260409002', arrivalChannel: '银行柜面', handlingStatus: '已办结', operatorName: '许晴', approvedDate: '2026-04-09', remarks: '居民年度缴费到账确认' },
  { id: 'JD320300202604003', personName: '顾嘉言', idCard: '320302199101084633', insuranceType: '职工基本医疗保险', paymentType: '灵活就业核定', agency: '徐州', period: '2026-04', baseAmount: 7600, receivableAmount: 912, paidAmount: 912, status: '已到账', employerName: '徐州市泉山区医保经办中心', employerCode: '12320303MB0N21344P', noticeNo: 'TZD20260408003', arrivalChannel: '江苏医保公共服务平台', handlingStatus: '已办结', operatorName: '高宁', approvedDate: '2026-04-08', remarks: '灵活就业按60%档核定' },
  { id: 'JD320400202604004', personName: '沈知夏', idCard: '320412201910215628', insuranceType: '城乡居民基本医疗保险', paymentType: '年度正常缴费', agency: '常州', period: '2026', baseAmount: 0, receivableAmount: 430, paidAmount: 0, status: '未到账', employerName: '常州市钟楼区永红街道便民中心', employerCode: '12320404MB1H90203T', noticeNo: 'TZD20260405004', arrivalChannel: '待缴费', handlingStatus: '待催缴', operatorName: '沈倩', approvedDate: '2026-04-05', remarks: '新生儿参保缴费通知已推送' },
  { id: 'JD320500202604005', personName: '陆书怡', idCard: '320507200812163214', insuranceType: '城乡居民基本医疗保险', paymentType: '年度正常缴费', agency: '苏州', period: '2026', baseAmount: 0, receivableAmount: 460, paidAmount: 460, status: '待确认', employerName: '苏州工业园区星海实验中学', employerCode: '52320594MJ6951028A', noticeNo: 'TZD20260422014', arrivalChannel: '学校代收', handlingStatus: '待到账确认', operatorName: '陆敏', approvedDate: '2026-04-22', remarks: '学生批量参保缴费' },
  { id: 'JD320600202604006', personName: '许文博', idCard: '320602198805204517', insuranceType: '职工基本医疗保险', paymentType: '补缴核定', agency: '南通', period: '2025-12', baseAmount: 8600, receivableAmount: 516, paidAmount: 516, status: '已到账', employerName: '南通海安城市服务集团', employerCode: '91320621MA24K8YB2F', noticeNo: 'TZD20260418023', arrivalChannel: '税务批扣', handlingStatus: '已办结', operatorName: '钱蓉', approvedDate: '2026-04-18', remarks: '断缴补缴两个月' },
  { id: 'JD320700202604007', personName: '孙明轩', idCard: '320703198507276419', insuranceType: '职工基本医疗保险', paymentType: '基数核定', agency: '连云港', period: '2026-04', baseAmount: 10200, receivableAmount: 1020, paidAmount: 1020, status: '已到账', employerName: '连云港港口控股集团有限公司', employerCode: '91320700MA1N8C0K6P', noticeNo: 'TZD20260412007', arrivalChannel: '税务批扣', handlingStatus: '已办结', operatorName: '韩倩', approvedDate: '2026-04-12', remarks: '单位基数上调后重新核定' },
  { id: 'JD320800202604008', personName: '朱雨彤', idCard: '320802199912167245', insuranceType: '灵活就业人员医保', paymentType: '自主缴费', agency: '淮安', period: '2026-04', baseAmount: 7800, receivableAmount: 936, paidAmount: 936, status: '已到账', employerName: '淮安市清江浦区医保中心', employerCode: '12320800MB2C22471A', noticeNo: 'TZD20260413008', arrivalChannel: '线上缴费', handlingStatus: '已办结', operatorName: '严峰', approvedDate: '2026-04-13', remarks: '灵活就业按70%档缴费' },
  { id: 'JD320900202604009', personName: '何嘉悦', idCard: '320902200104217820', insuranceType: '城乡居民基本医疗保险', paymentType: '年度正常缴费', agency: '盐城', period: '2026', baseAmount: 0, receivableAmount: 420, paidAmount: 420, status: '已到账', employerName: '盐城市亭湖区医保服务大厅', employerCode: '12320902MB3D22851C', noticeNo: 'TZD20260414009', arrivalChannel: '银行代收', handlingStatus: '已办结', operatorName: '曹颖', approvedDate: '2026-04-14', remarks: '居民年度续保完成' },
  { id: 'JD321000202604010', personName: '郭天宇', idCard: '321002198610024671', insuranceType: '职工基本医疗保险', paymentType: '补缴核定', agency: '扬州', period: '2026-03', baseAmount: 9200, receivableAmount: 552, paidAmount: 552, status: '已到账', employerName: '扬州城控产业投资有限公司', employerCode: '91321003MA1Y0F2C7N', noticeNo: 'TZD20260415010', arrivalChannel: '税务批扣', handlingStatus: '已办结', operatorName: '邹琳', approvedDate: '2026-04-15', remarks: '基数调整差额补缴' },
  { id: 'JD321100202604011', personName: '宋知行', idCard: '321102197905185812', insuranceType: '职工基本医疗保险', paymentType: '基数核定', agency: '镇江', period: '2026-04', baseAmount: 8700, receivableAmount: 870, paidAmount: 0, status: '未到账', employerName: '镇江市第一人民医院', employerCode: '12321100466000318R', noticeNo: 'TZD20260416011', arrivalChannel: '待缴费', handlingStatus: '待催缴', operatorName: '唐璐', approvedDate: '2026-04-16', remarks: '单位批量核定后未扣款' },
  { id: 'JD321200202604012', personName: '丁晓萌', idCard: '321202199512238426', insuranceType: '职工基本医疗保险', paymentType: '基数核定', agency: '泰州', period: '2026-04', baseAmount: 8300, receivableAmount: 830, paidAmount: 830, status: '已到账', employerName: '泰州市人民医院', employerCode: '12321200466000420F', noticeNo: 'TZD20260417012', arrivalChannel: '税务批扣', handlingStatus: '已办结', operatorName: '孔洁', approvedDate: '2026-04-17', remarks: '医院职工月度正常核定' },
  { id: 'JD321300202604013', personName: '袁晨浩', idCard: '321302198311146117', insuranceType: '职工基本医疗保险', paymentType: '趸缴核定', agency: '宿迁', period: '2026', baseAmount: 0, receivableAmount: 12560, paidAmount: 12560, status: '已到账', employerName: '宿迁市宿城区医保经办中心', employerCode: '12321302MB4E21590A', noticeNo: 'TZD20260418013', arrivalChannel: '银行柜面', handlingStatus: '已办结', operatorName: '彭雪', approvedDate: '2026-04-18', remarks: '一次性缴清剩余年限' },
  { id: 'JD320100202604014', personName: '林若溪', idCard: '320104199807223942', insuranceType: '职工基本医疗保险', paymentType: '基数核定', agency: '南京', period: '2026-04', baseAmount: 11000, receivableAmount: 1100, paidAmount: 1100, status: '已到账', employerName: '江苏省人民医院', employerCode: '12320000466001234P', noticeNo: 'TZD20260419014', arrivalChannel: '税务批扣', handlingStatus: '已办结', operatorName: '周岚', approvedDate: '2026-04-19', remarks: '省属医院月度正常缴费' },
  { id: 'JD320200202604015', personName: '顾欣怡', idCard: '320205200011053728', insuranceType: '灵活就业人员医保', paymentType: '自主缴费', agency: '无锡', period: '2026-04', baseAmount: 8000, receivableAmount: 960, paidAmount: 960, status: '已到账', employerName: '无锡市医保服务中心', employerCode: '12320200MB0R40311L', noticeNo: 'TZD20260420015', arrivalChannel: '线上缴费', handlingStatus: '已办结', operatorName: '钱莉', approvedDate: '2026-04-20', remarks: '微信缴费成功' },
  { id: 'JD320300202604016', personName: '韩亦辰', idCard: '320322198404206318', insuranceType: '职工基本医疗保险', paymentType: '基数核定', agency: '徐州', period: '2026-04', baseAmount: 9400, receivableAmount: 940, paidAmount: 940, status: '已到账', employerName: '徐州矿务集团有限公司', employerCode: '91320300134781047K', noticeNo: 'TZD20260421016', arrivalChannel: '税务批扣', handlingStatus: '已办结', operatorName: '赵静', approvedDate: '2026-04-21', remarks: '集团批量缴费完成' },
  { id: 'JD320400202604017', personName: '蒋安琪', idCard: '320706199302148924', insuranceType: '职工基本医疗保险', paymentType: '退费处理', agency: '常州', period: '2026-03', baseAmount: 0, receivableAmount: 0, paidAmount: 260, status: '退费中', employerName: '常州高新区人民医院', employerCode: '12320411MB2R12085A', noticeNo: 'TZD20260422017', arrivalChannel: '原路退回', handlingStatus: '待财务审核', operatorName: '蒋雯', approvedDate: '2026-04-22', remarks: '离职重复缴费退回' },
  { id: 'JD320700202604018', personName: '郑博文', idCard: '320921198612302416', insuranceType: '职工基本医疗保险', paymentType: '缓缴申请', agency: '连云港', period: '2026-04', baseAmount: 0, receivableAmount: 0, paidAmount: 0, status: '待审批', employerName: '连云港东海新材料有限公司', employerCode: '91320722MA20P6627Q', noticeNo: 'TZD20260423018', arrivalChannel: '待审批', handlingStatus: '缓缴申请受理中', operatorName: '韩倩', approvedDate: '2026-04-23', remarks: '困难企业申请缓缴三个月' },
  { id: 'JD320900202604019', personName: '陶诗雅', idCard: '321003199611058260', insuranceType: '城乡居民基本医疗保险', paymentType: '年度正常缴费', agency: '盐城', period: '2026', baseAmount: 0, receivableAmount: 430, paidAmount: 430, status: '已到账', employerName: '盐城市第一中学', employerCode: '52320900466022836K', noticeNo: 'TZD20260424019', arrivalChannel: '学校代收', handlingStatus: '已办结', operatorName: '曹颖', approvedDate: '2026-04-24', remarks: '学生集中缴费完成' },
  { id: 'JD321100202604020', personName: '赵嘉铭', idCard: '320506197702013655', insuranceType: '职工基本医疗保险', paymentType: '基数核定', agency: '镇江', period: '2026-04', baseAmount: 9600, receivableAmount: 960, paidAmount: 960, status: '已到账', employerName: '镇江港务集团有限公司', employerCode: '91321100134782056N', noticeNo: 'TZD20260425020', arrivalChannel: '税务批扣', handlingStatus: '已办结', operatorName: '唐璐', approvedDate: '2026-04-25', remarks: '港务集团月度缴费' },
];

export default function PaymentQueryCenter({ onBack }: { onBack: () => void }) {
  const [keyword, setKeyword] = useState('');
  const [rows, setRows] = useState<PaymentLedgerItem[]>(initialRows);
  const [selectedItem, setSelectedItem] = useState<PaymentLedgerItem | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const filteredRows = useMemo(
    () => rows.filter((item) => [item.id, item.personName, item.idCard, item.employerName, item.noticeNo].some((value) => value.includes(keyword))),
    [rows, keyword],
  );

  const writeWorkbook = (data: Array<Record<string, string | number>>, fileName: string) => {
    const sheet = XLSX.utils.json_to_sheet(data, { header: paymentHeaders });
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, '缴费核定台账');
    XLSX.writeFile(book, fileName);
  };

  const toExportRow = (item: PaymentLedgerItem) => ({
    核定单号: item.id,
    姓名: item.personName,
    身份证号: item.idCard,
    险种: item.insuranceType,
    缴费类型: item.paymentType,
    参保地: item.agency,
    费款所属期: item.period,
    缴费基数: item.baseAmount,
    应缴金额: item.receivableAmount,
    实缴金额: item.paidAmount,
    到账状态: item.status,
    单位名称: item.employerName,
    统一社会信用代码: item.employerCode,
    通知单号: item.noticeNo,
    到账渠道: item.arrivalChannel,
    经办状态: item.handlingStatus,
    经办人员: item.operatorName,
    核定日期: item.approvedDate,
    备注: item.remarks,
  });

  const downloadTemplate = () => {
    writeWorkbook(initialRows.slice(0, 3).map(toExportRow), '缴费核定导入模板.xlsx');
  };

  const exportRows = () => {
    writeWorkbook(filteredRows.map(toExportRow), `缴费核定查询结果_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '', raw: false });

    const importedRows: PaymentLedgerItem[] = data
      .filter((item) => item['姓名'] && item['身份证号'])
      .map((item, index) => ({
        id: String(item['核定单号'] || `JDIMP${String(index + 1).padStart(4, '0')}`),
        personName: String(item['姓名'] || ''),
        idCard: String(item['身份证号'] || ''),
        insuranceType: String(item['险种'] || '职工基本医疗保险'),
        paymentType: String(item['缴费类型'] || '基数核定'),
        agency: String(item['参保地'] || ''),
        period: String(item['费款所属期'] || ''),
        baseAmount: Number(item['缴费基数'] || 0),
        receivableAmount: Number(item['应缴金额'] || 0),
        paidAmount: Number(item['实缴金额'] || 0),
        status: String(item['到账状态'] || '待确认'),
        employerName: String(item['单位名称'] || ''),
        employerCode: String(item['统一社会信用代码'] || ''),
        noticeNo: String(item['通知单号'] || ''),
        arrivalChannel: String(item['到账渠道'] || ''),
        handlingStatus: String(item['经办状态'] || '待处理'),
        operatorName: String(item['经办人员'] || ''),
        approvedDate: String(item['核定日期'] || ''),
        remarks: String(item['备注'] || ''),
      }));

    if (importedRows.length) {
      setRows((prev) => [...importedRows, ...prev]);
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
              <h1 className="text-xl font-bold text-gray-800">缴费核定查询</h1>
              <p className="text-sm text-gray-500">核定结果、到账状态、补退费处理统一查询与导入导出</p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-sm text-gray-500">核定记录</div>
            <div className="mt-2 text-3xl font-bold text-gray-800">{rows.length}</div>
          </div>
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="text-sm text-green-700">已到账</div>
            <div className="mt-2 text-3xl font-bold text-green-600">{rows.filter((item) => item.status === '已到账').length}</div>
          </div>
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
            <div className="text-sm text-yellow-700">待处理</div>
            <div className="mt-2 text-3xl font-bold text-yellow-600">{rows.filter((item) => item.status !== '已到账').length}</div>
          </div>
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
            <div className="text-sm text-cyan-700">涉及地市</div>
            <div className="mt-2 text-3xl font-bold text-cyan-600">{new Set(rows.map((item) => item.agency)).size}</div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="请输入姓名、身份证号、核定单号、单位名称、通知单号查询"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4"
              />
            </div>
            <button onClick={downloadTemplate} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
              <Download className="h-4 w-4" />
              下载模板
            </button>
            <button onClick={() => importRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 px-4 py-2 text-emerald-700 hover:bg-emerald-50">
              <Upload className="h-4 w-4" />
              导入台账
            </button>
            <button onClick={exportRows} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
              <Download className="h-4 w-4" />
              导出结果
            </button>
            <input ref={importRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[1700px]">
            <thead className="bg-gray-50">
              <tr>
                {paymentHeaders.map((header) => (
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
                  <td className="px-4 py-3 font-medium text-emerald-600">{item.id}</td>
                  <td className="px-4 py-3">{item.personName}</td>
                  <td className="px-4 py-3">{item.idCard}</td>
                  <td className="px-4 py-3">{item.insuranceType}</td>
                  <td className="px-4 py-3">{item.paymentType}</td>
                  <td className="px-4 py-3">{item.agency}</td>
                  <td className="px-4 py-3">{item.period}</td>
                  <td className="px-4 py-3">{item.baseAmount}</td>
                  <td className="px-4 py-3">{item.receivableAmount}</td>
                  <td className="px-4 py-3">{item.paidAmount}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">{item.employerName}</td>
                  <td className="px-4 py-3">{item.employerCode}</td>
                  <td className="px-4 py-3">{item.noticeNo}</td>
                  <td className="px-4 py-3">{item.arrivalChannel}</td>
                  <td className="px-4 py-3">{item.handlingStatus}</td>
                  <td className="px-4 py-3">{item.operatorName}</td>
                  <td className="px-4 py-3">{item.approvedDate}</td>
                  <td className="px-4 py-3">{item.remarks}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelectedItem(item)} className="rounded p-2 text-emerald-600 hover:bg-emerald-50">
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
              className="w-full max-w-4xl rounded-2xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b p-6">
                <h3 className="text-lg font-bold text-gray-800">核定详情 - {selectedItem.id}</h3>
                <button onClick={() => setSelectedItem(null)} className="rounded p-2 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 p-6 text-sm">
                {Object.entries(toExportRow(selectedItem)).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-gray-100 py-2">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-right font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
