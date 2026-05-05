import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Download, Eye, X, CheckCircle, Clock, XCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

type AuditStatus = '待审核' | '已通过' | '已退回';

interface AuditRecord {
  id: string;
  applicant: string;
  idCard: string;
  insuranceType: string;
  city: string;
  type: string;
  amount: number;
  status: AuditStatus;
  level: string;
  auditor: string;
  submitTime: string;
  hospital: string;
  diagnosis: string;
  ruleHit: string;
  auditOpinion: string;
  inCatalogAmount: number;
  outCatalogAmount: number;
  suggestedPayAmount: number;
}

const seeds = [
  ['SH320100202605001', '陈思远', '320102198903152415', '城镇职工', '南京', '门诊慢特病审核', 860, '待审核', '初审', '周岚', '2026-05-01 09:30', '南京市第一医院', '高血压伴眩晕', '门诊统筹限额复核', '待补充本次门诊原始发票', 720, 140, 576],
  ['SH320500202605002', '陆书宁', '320507200812163214', '城乡居民', '苏州', '门诊慢特病审核', 1260, '已通过', '终审', '陆敏', '2026-05-01 10:10', '苏州大学附属儿童医院', '儿童哮喘门慢复诊', '门慢备案有效', '符合门诊慢特病待遇政策', 1260, 0, 1008],
  ['SH320600202605003', '许文卿', '320602198805204517', '城镇职工', '南通', '异地就医审核', 6400, '已退回', '复审', '高宁', '2026-05-01 11:25', '上海瑞金医院', '腰椎间盘突出', '异地转诊材料缺失', '缺转诊备案材料，退回补正', 5180, 1220, 4662],
  ['SH320200202605004', '顾雨晴', '320211199410083629', '灵活就业', '无锡', '住院报销审核', 14820, '已通过', '终审', '钱莉', '2026-05-01 12:40', '无锡市人民医院', '胆囊结石伴急性胆囊炎', '住院天数匹配', '票据与费用清单一致，准予支付', 12050, 2770, 10845],
  ['SH320300202605005', '王子杭', '320303197612054331', '城镇职工', '徐州', '双通道购药审核', 3920, '待审核', '初审', '赵静', '2026-05-01 13:05', '徐州医科大学附属医院', '类风湿关节炎', '双通道处方时效复核', '待核验处方流转时间是否超期', 3920, 0, 3528],
  ['SH320400202605006', '沈佳宁', '320402199211236628', '城乡居民', '常州', '门诊统筹审核', 540, '已通过', '初审', '蒋雯', '2026-05-01 13:55', '常州市第二人民医院', '上呼吸道感染', '普通门诊政策校验', '费用结构清晰，符合支付范围', 430, 110, 344],
  ['SH320700202605007', '孙明轩', '320703198507276419', '城乡居民', '连云港', '异地就医审核', 18350, '已退回', '终审', '韩雪', '2026-05-01 14:48', '连云港市第一人民医院', '冠心病', '重复结算疑点', '发现同日跨机构结算记录，退回核实', 14820, 3530, 13338],
  ['SH320800202605008', '朱语彤', '320802199912167245', '城镇职工', '淮安', '住院报销审核', 9620, '已通过', '复审', '严峰', '2026-05-01 15:20', '淮安市第一人民医院', '子宫肌瘤', '病种与手术编码一致', '病案首页与费用清单齐全', 7900, 1720, 7110],
  ['SH320900202605009', '何嘉悦', '320902200104217820', '城乡居民', '盐城', '门诊慢特病审核', 2210, '待审核', '初审', '曹颖', '2026-05-01 15:52', '盐城市第三人民医院', '糖尿病并周围神经病变', '门慢用药目录复核', '待复核两项耗材是否纳入支付', 1890, 320, 1512],
  ['SH321000202605010', '郭天宇', '321002198610024671', '城镇职工', '扬州', '双通道购药审核', 5680, '已通过', '终审', '邱琳', '2026-05-01 16:26', '扬州大学附属医院', '强直性脊柱炎', '药店处方关联成功', '药品目录匹配，支付比例正确', 5680, 0, 5112],
  ['SH321100202605011', '宋知言', '321102197905185812', '城镇职工', '镇江', '住院报销审核', 12740, '已退回', '复审', '唐璐', '2026-05-01 16:44', '镇江市第一人民医院', '膝关节半月板损伤', '手术耗材超限提醒', '高值耗材授权单缺失，退回补正', 10160, 2580, 9144],
  ['SH321200202605012', '林若溪', '321202199512238426', '学生', '泰州', '门诊统筹审核', 430, '已通过', '初审', '贺倩', '2026-05-01 17:02', '泰州市人民医院', '慢性胃炎', '诊疗项目目录校验', '目录内项目，票据完整', 370, 60, 296],
  ['SH321300202605013', '袁晨浩', '321302198311146117', '灵活就业', '宿迁', '异地就医审核', 21460, '待审核', '复审', '彭雪', '2026-05-01 17:18', '宿迁市第一人民医院', '恶性肿瘤术后化疗', '异地备案待确认', '待核实备案起止时间与住院时间一致性', 17980, 3480, 16182],
  ['SH320100202605014', '蒋安琪', '320104199807223942', '城镇职工', '南京', '住院报销审核', 8360, '已通过', '复审', '周岚', '2026-05-02 08:12', '南京市第一医院', '泌尿系结石', '费用结构正常', '无违规收费项目', 6840, 1520, 6156],
  ['SH320200202605015', '郑博文', '320205200011053728', '灵活就业', '无锡', '门诊慢特病审核', 2480, '待审核', '初审', '钱莉', '2026-05-02 08:46', '无锡市第二人民医院', '甲状腺功能减退', '慢病用药周期校验', '待核查本月重复购药情况', 2220, 260, 1776],
  ['SH320300202605016', '陶诗雨', '320322198404206318', '城镇职工', '徐州', '特殊药品审核', 7820, '已通过', '终审', '赵静', '2026-05-02 09:08', '徐州市中心医院', '乳腺恶性肿瘤术后辅助治疗', '特药备案生效中', '符合双通道特药支付政策', 7820, 0, 7038],
  ['SH320400202605017', '彭书远', '320404198612302416', '城乡居民', '常州', '异地就医审核', 11860, '已通过', '复审', '蒋雯', '2026-05-02 09:34', '上海市第六人民医院', '膝骨关节炎', '转诊备案完整', '异地就医流程合规，准予结算', 9600, 2260, 7680],
  ['SH320500202605018', '周辰逸', '320506199302148924', '城镇职工', '苏州', '住院报销审核', 19640, '已退回', '终审', '陆敏', '2026-05-02 10:02', '苏州市立医院', '冠心病支架植入术后', '介入耗材价格预警', '高值耗材价格超同类均价，退回复核', 15840, 3800, 14256],
  ['SH320600202605019', '孟知夏', '320621199611058260', '城乡居民', '南通', '门诊统筹审核', 620, '已通过', '初审', '高宁', '2026-05-02 10:28', '南通市第一人民医院', '支气管炎', '门诊统筹目录校验', '费用合理，准予支付', 500, 120, 400],
  ['SH321300202605020', '贺嘉颖', '321301199412085527', '城乡居民', '宿迁', '双通道购药审核', 6320, '待审核', '复审', '彭雪', '2026-05-02 10:56', '宿迁市第一人民医院', '系统性红斑狼疮', '特药登记周期复核', '待核验上次取药日期与剩余剂量', 6320, 0, 5688],
];

const records: AuditRecord[] = seeds.map((item) => ({
  id: item[0],
  applicant: item[1],
  idCard: item[2],
  insuranceType: item[3],
  city: item[4],
  type: item[5],
  amount: item[6] as number,
  status: item[7] as AuditStatus,
  level: item[8],
  auditor: item[9],
  submitTime: item[10],
  hospital: item[11],
  diagnosis: item[12],
  ruleHit: item[13],
  auditOpinion: item[14],
  inCatalogAmount: item[15] as number,
  outCatalogAmount: item[16] as number,
  suggestedPayAmount: item[17] as number,
}));

const exportHeaders = ['审核单号', '申请人', '身份证号', '险种', '参保地市', '审核类型', '申报金额', '审核状态', '审核层级', '审核人员', '提交时间', '就诊医院', '诊断', '规则命中', '审核意见', '目录内金额', '目录外金额', '建议支付金额'];

export default function AuditQuery({ onBack }: { onBack: () => void }) {
  const [keyword, setKeyword] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);

  const filtered = useMemo(
    () =>
      records.filter((item) =>
        [item.id, item.applicant, item.idCard, item.hospital, item.type, item.auditor, item.city].some((value) =>
          value.includes(keyword),
        ),
      ),
    [keyword],
  );

  const statusBadge = (status: AuditStatus) => {
    const styles = {
      待审核: 'bg-yellow-100 text-yellow-700',
      已通过: 'bg-green-100 text-green-700',
      已退回: 'bg-red-100 text-red-700',
    };
    const icons = { 待审核: Clock, 已通过: CheckCircle, 已退回: XCircle };
    const Icon = icons[status];
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const toExportRow = (item: AuditRecord) => ({
    审核单号: item.id,
    申请人: item.applicant,
    身份证号: item.idCard,
    险种: item.insuranceType,
    参保地市: item.city,
    审核类型: item.type,
    申报金额: item.amount,
    审核状态: item.status,
    审核层级: item.level,
    审核人员: item.auditor,
    提交时间: item.submitTime,
    就诊医院: item.hospital,
    诊断: item.diagnosis,
    规则命中: item.ruleHit,
    审核意见: item.auditOpinion,
    目录内金额: item.inCatalogAmount,
    目录外金额: item.outCatalogAmount,
    建议支付金额: item.suggestedPayAmount,
  });

  const handleExport = () => {
    const sheet = XLSX.utils.json_to_sheet(filtered.map(toExportRow), { header: exportHeaders });
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, '费用审核查询');
    XLSX.writeFile(book, `费用审核查询结果_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-bold">审核查询</h3>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white">
          <Download className="h-4 w-4" />
          导出查询结果
        </button>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4"><p className="text-sm text-gray-500">审核记录</p><p className="mt-2 text-3xl font-bold text-gray-800">{records.length}</p></div>
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4"><p className="text-sm text-yellow-700">待审核</p><p className="mt-2 text-3xl font-bold text-yellow-600">{records.filter((item) => item.status === '待审核').length}</p></div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4"><p className="text-sm text-green-700">已通过</p><p className="mt-2 text-3xl font-bold text-green-600">{records.filter((item) => item.status === '已通过').length}</p></div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4"><p className="text-sm text-red-700">已退回</p><p className="mt-2 text-3xl font-bold text-red-600">{records.filter((item) => item.status === '已退回').length}</p></div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="请输入审核单号、申请人、身份证号、医院、审核人、地市查询" className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-gray-50">
            <tr>
              {['审核单号', '申请人', '参保地市', '审核类型', '申报金额', '审核状态', '审核层级', '审核人员', '提交时间', '操作'].map((header) => (
                <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-600">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-cyan-600">{item.id}</td>
                <td className="px-4 py-3">{item.applicant}</td>
                <td className="px-4 py-3">{item.city}</td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3">￥{item.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{statusBadge(item.status)}</td>
                <td className="px-4 py-3">{item.level}</td>
                <td className="px-4 py-3">{item.auditor}</td>
                <td className="px-4 py-3">{item.submitTime}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelectedRecord(item)} className="rounded p-2 text-cyan-600 hover:bg-cyan-50">
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedRecord && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedRecord(null)}>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }} className="w-full max-w-4xl rounded-xl bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b p-6">
                <h3 className="text-lg font-bold">审核详情 - {selectedRecord.id}</h3>
                <button onClick={() => setSelectedRecord(null)} className="rounded p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-4 p-6 text-sm">
                <div className="rounded-xl border bg-white p-4">
                  <h4 className="mb-3 font-bold">参保与审核信息</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">申请人</span><span>{selectedRecord.applicant}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">身份证号</span><span>{selectedRecord.idCard}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">险种</span><span>{selectedRecord.insuranceType}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">参保地市</span><span>{selectedRecord.city}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">审核层级</span><span>{selectedRecord.level}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">审核人员</span><span>{selectedRecord.auditor}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">审核状态</span>{statusBadge(selectedRecord.status)}</div>
                  </div>
                </div>
                <div className="rounded-xl border bg-white p-4">
                  <h4 className="mb-3 font-bold">就医与费用信息</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">审核类型</span><span>{selectedRecord.type}</span></div>
                    <div className="flex justify-between items-start"><span className="text-gray-500">医疗机构</span><span className="w-52 text-right">{selectedRecord.hospital}</span></div>
                    <div className="flex justify-between items-start"><span className="text-gray-500">诊断</span><span className="w-52 text-right">{selectedRecord.diagnosis}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">申报金额</span><span>￥{selectedRecord.amount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">目录内金额</span><span>￥{selectedRecord.inCatalogAmount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">目录外金额</span><span>￥{selectedRecord.outCatalogAmount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">建议支付金额</span><span className="font-medium text-cyan-700">￥{selectedRecord.suggestedPayAmount.toLocaleString()}</span></div>
                  </div>
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border bg-yellow-50 p-4">
                    <h4 className="mb-2 font-bold">规则命中</h4>
                    <div className="text-gray-700">{selectedRecord.ruleHit}</div>
                  </div>
                  <div className="rounded-xl border bg-blue-50 p-4">
                    <h4 className="mb-2 font-bold">审核意见</h4>
                    <div className="text-gray-700">{selectedRecord.auditOpinion}</div>
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
