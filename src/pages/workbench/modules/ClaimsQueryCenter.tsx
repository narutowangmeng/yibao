import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Eye, Search, Upload, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ClaimItem {
  id: string;
  applicant: string;
  idCard: string;
  claimType: string;
  institution: string;
  acceptStage: string;
  amount: number;
  settlementAmount: number;
  status: string;
  riskLevel: string;
  reviewer: string;
  submitDate: string;
}

const headers = ['理赔单号', '申请人', '身份证号', '理赔类型', '就诊机构', '当前环节', '申报金额', '结算金额', '状态', '风险等级', '审核人员', '提交日期'];

const seed: ClaimItem[] = [
  { id: 'LP320100202604001', applicant: '陈思远', idCard: '320102198903152415', claimType: '门诊费用理赔', institution: '南京市第一医院', acceptStage: '人工审核', amount: 860, settlementAmount: 602, status: '审核中', riskLevel: '中', reviewer: '周岚', submitDate: '2026-04-12' },
  { id: 'LP320500202604002', applicant: '陆书怡', idCard: '320507200812163214', claimType: '特殊门诊理赔', institution: '苏州大学附属儿童医院', acceptStage: '申报受理', amount: 1260, settlementAmount: 0, status: '待受理', riskLevel: '低', reviewer: '陆敏', submitDate: '2026-04-16' },
  { id: 'LP320600202604003', applicant: '许文博', idCard: '320602198805204517', claimType: '异地就医理赔', institution: '上海瑞金医院', acceptStage: '机构对账', amount: 6400, settlementAmount: 4380, status: '已办结', riskLevel: '低', reviewer: '高宁', submitDate: '2026-04-05' },
  { id: 'LP320200202604004', applicant: '顾雨晨', idCard: '320211199410083629', claimType: '住院费用理赔', institution: '无锡市人民医院', acceptStage: '结算审核', amount: 14820, settlementAmount: 11260, status: '待复审', riskLevel: '中', reviewer: '钱莉', submitDate: '2026-04-09' },
  { id: 'LP320300202604005', applicant: '王子扬', idCard: '320303197612054331', claimType: '双通道药品理赔', institution: '徐州医科大学附属医院', acceptStage: '人工审核', amount: 3920, settlementAmount: 0, status: '审核中', riskLevel: '高', reviewer: '赵静', submitDate: '2026-04-18' },
  { id: 'LP320400202604006', applicant: '沈佳宁', idCard: '320402199211236628', claimType: '门诊费用理赔', institution: '常州市第二人民医院', acceptStage: '支付指令', amount: 540, settlementAmount: 380, status: '待支付', riskLevel: '低', reviewer: '蒋雯', submitDate: '2026-04-08' },
  { id: 'LP320700202604007', applicant: '孙明轩', idCard: '320703198507276419', claimType: '住院费用理赔', institution: '连云港市第一人民医院', acceptStage: '异常处理', amount: 18350, settlementAmount: 0, status: '异常退回', riskLevel: '高', reviewer: '韩倩', submitDate: '2026-04-07' },
  { id: 'LP320800202604008', applicant: '朱雨彤', idCard: '320802199912167245', claimType: '住院费用理赔', institution: '淮安市第一人民医院', acceptStage: '支付指令', amount: 9620, settlementAmount: 6300, status: '待支付', riskLevel: '低', reviewer: '严峰', submitDate: '2026-04-15' },
  { id: 'LP320900202604009', applicant: '何嘉悦', idCard: '320902200104217820', claimType: '特殊门诊理赔', institution: '盐城市第三人民医院', acceptStage: '人工审核', amount: 2210, settlementAmount: 0, status: '审核中', riskLevel: '中', reviewer: '曹颖', submitDate: '2026-04-19' },
  { id: 'LP321000202604010', applicant: '郭天宇', idCard: '321002198610024671', claimType: '特殊药品理赔', institution: '扬州大学附属医院', acceptStage: '机构对账', amount: 5680, settlementAmount: 3840, status: '已办结', riskLevel: '低', reviewer: '邹琳', submitDate: '2026-04-17' },
  { id: 'LP321100202604011', applicant: '宋知行', idCard: '321102197905185812', claimType: '住院费用理赔', institution: '镇江市第一人民医院', acceptStage: '异常处理', amount: 12740, settlementAmount: 0, status: '待补件', riskLevel: '高', reviewer: '唐璐', submitDate: '2026-04-11' },
  { id: 'LP321200202604012', applicant: '丁晓萌', idCard: '321202199512238426', claimType: '门诊费用理赔', institution: '泰州市人民医院', acceptStage: '支付指令', amount: 430, settlementAmount: 310, status: '待支付', riskLevel: '低', reviewer: '孔洁', submitDate: '2026-04-14' },
  { id: 'LP321300202604013', applicant: '袁晨浩', idCard: '321302198311146117', claimType: '异地就医理赔', institution: '宿迁市第一人民医院', acceptStage: '结算审核', amount: 21460, settlementAmount: 13280, status: '待复审', riskLevel: '中', reviewer: '彭雪', submitDate: '2026-04-20' },
  { id: 'LP320100202604014', applicant: '林若溪', idCard: '320104199807223942', claimType: '特殊门诊理赔', institution: '江苏省人民医院', acceptStage: '机构对账', amount: 1760, settlementAmount: 1170, status: '已办结', riskLevel: '低', reviewer: '周岚', submitDate: '2026-04-13' },
  { id: 'LP320500202604015', applicant: '赵嘉铭', idCard: '320506197702013655', claimType: '住院费用理赔', institution: '苏州市立医院', acceptStage: '支付指令', amount: 8360, settlementAmount: 5640, status: '已支付', riskLevel: '低', reviewer: '陆敏', submitDate: '2026-04-10' },
  { id: 'LP320200202604016', applicant: '顾欣怡', idCard: '320205200011053728', claimType: '门诊费用理赔', institution: '无锡市第二人民医院', acceptStage: '申报受理', amount: 580, settlementAmount: 0, status: '待受理', riskLevel: '低', reviewer: '钱莉', submitDate: '2026-04-21' },
  { id: 'LP320300202604017', applicant: '韩亦辰', idCard: '320322198404206318', claimType: '异地就医理赔', institution: '北京协和医院', acceptStage: '机构对账', amount: 10980, settlementAmount: 6880, status: '已办结', riskLevel: '中', reviewer: '赵静', submitDate: '2026-04-06' },
  { id: 'LP320700202604018', applicant: '蒋安琪', idCard: '320706199302148924', claimType: '门诊费用理赔', institution: '连云港市中医院', acceptStage: '支付指令', amount: 390, settlementAmount: 265, status: '待支付', riskLevel: '低', reviewer: '韩倩', submitDate: '2026-04-03' },
  { id: 'LP320900202604019', applicant: '郑博文', idCard: '320921198612302416', claimType: '住院费用理赔', institution: '盐城市第一人民医院', acceptStage: '异常处理', amount: 16780, settlementAmount: 0, status: '异常退回', riskLevel: '高', reviewer: '曹颖', submitDate: '2026-04-22' },
  { id: 'LP321000202604020', applicant: '陶诗雅', idCard: '321003199611058260', claimType: '特殊门诊理赔', institution: '扬州市妇幼保健院', acceptStage: '机构对账', amount: 2480, settlementAmount: 1660, status: '已办结', riskLevel: '低', reviewer: '邹琳', submitDate: '2026-04-18' },
];

export default function ClaimsQueryCenter({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState(seed);
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState<ClaimItem | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => rows.filter((item) => [item.id, item.applicant, item.idCard, item.institution].some((value) => value.includes(keyword))),
    [rows, keyword],
  );

  const toRow = (item: ClaimItem) => ({
    理赔单号: item.id,
    申请人: item.applicant,
    身份证号: item.idCard,
    理赔类型: item.claimType,
    就诊机构: item.institution,
    当前环节: item.acceptStage,
    申报金额: item.amount,
    结算金额: item.settlementAmount,
    状态: item.status,
    风险等级: item.riskLevel,
    审核人员: item.reviewer,
    提交日期: item.submitDate,
  });

  const writeWorkbook = (data: Array<Record<string, string | number>>, fileName: string) => {
    const sheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, '理赔查询');
    XLSX.writeFile(book, fileName);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '', raw: false });
    const imported = data
      .filter((item) => item['申请人'] && item['身份证号'])
      .map((item, index) => ({
        id: String(item['理赔单号'] || `LPIMP${String(index + 1).padStart(4, '0')}`),
        applicant: String(item['申请人'] || ''),
        idCard: String(item['身份证号'] || ''),
        claimType: String(item['理赔类型'] || '门诊费用理赔'),
        institution: String(item['就诊机构'] || ''),
        acceptStage: String(item['当前环节'] || '申报受理'),
        amount: Number(item['申报金额'] || 0),
        settlementAmount: Number(item['结算金额'] || 0),
        status: String(item['状态'] || '待受理'),
        riskLevel: String(item['风险等级'] || '低'),
        reviewer: String(item['审核人员'] || ''),
        submitDate: String(item['提交日期'] || ''),
      }));

    if (imported.length) {
      setRows((prev) => [...imported, ...prev]);
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
              <h1 className="text-xl font-bold text-gray-800">理赔查询</h1>
              <p className="text-sm text-gray-500">申报受理、人工审核、结算审核、支付指令、机构对账、异常处理统一查询</p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-sm text-gray-500">理赔记录</div>
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
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="text-sm text-red-700">高风险</div>
            <div className="mt-2 text-3xl font-bold text-red-600">{rows.filter((item) => item.riskLevel === '高').length}</div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="请输入申请人、身份证号、理赔单号、机构名称查询"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4"
              />
            </div>
            <button onClick={() => writeWorkbook(seed.slice(0, 3).map(toRow), '理赔查询导入模板.xlsx')} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
              <Download className="h-4 w-4" />
              下载模板
            </button>
            <button onClick={() => importRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-cyan-300 px-4 py-2 text-cyan-700 hover:bg-cyan-50">
              <Upload className="h-4 w-4" />
              导入台账
            </button>
            <button onClick={() => writeWorkbook(filtered.map(toRow), `理赔查询结果_${new Date().toISOString().slice(0, 10)}.xlsx`)} className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
              <Download className="h-4 w-4" />
              导出结果
            </button>
            <input ref={importRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full min-w-[1450px]">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    {header}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-cyan-600">{item.id}</td>
                  <td className="px-4 py-3">{item.applicant}</td>
                  <td className="px-4 py-3">{item.idCard}</td>
                  <td className="px-4 py-3">{item.claimType}</td>
                  <td className="px-4 py-3">{item.institution}</td>
                  <td className="px-4 py-3">{item.acceptStage}</td>
                  <td className="px-4 py-3">{item.amount}</td>
                  <td className="px-4 py-3">{item.settlementAmount}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">{item.riskLevel}</td>
                  <td className="px-4 py-3">{item.reviewer}</td>
                  <td className="px-4 py-3">{item.submitDate}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelected(item)} className="rounded p-2 text-cyan-600 hover:bg-cyan-50">
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
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl rounded-2xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b p-6">
                <h3 className="text-lg font-bold text-gray-800">理赔详情 - {selected.id}</h3>
                <button onClick={() => setSelected(null)} className="rounded p-2 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 p-6 text-sm">
                {Object.entries(toRow(selected)).map(([label, value]) => (
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
