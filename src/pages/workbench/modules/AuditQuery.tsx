import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Download, Eye, X, CheckCircle, Clock, XCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface AuditRecord {
  id: string;
  applicant: string;
  idCard: string;
  type: string;
  amount: number;
  status: '待审核' | '已通过' | '已退回';
  level: string;
  auditor: string;
  submitTime: string;
  hospital: string;
  diagnosis: string;
  ruleHit: string;
  auditOpinion: string;
}

const records: AuditRecord[] = [
  { id: 'SH320100202604001', applicant: '陈思远', idCard: '320102198903152415', type: '门诊慢特病审核', amount: 860, status: '待审核', level: '初审', auditor: '周岚', submitTime: '2026-04-12 09:30', hospital: '南京市第一医院', diagnosis: '高血压伴眩晕', ruleHit: '门诊统筹限额复核', auditOpinion: '待补充本次门诊发票原件' },
  { id: 'SH320500202604002', applicant: '陆书怡', idCard: '320507200812163214', type: '门诊慢特病审核', amount: 1260, status: '已通过', level: '终审', auditor: '陆敏', submitTime: '2026-04-16 14:10', hospital: '苏州大学附属儿童医院', diagnosis: '儿童哮喘门慢复诊', ruleHit: '门慢备案有效', auditOpinion: '符合门诊慢特病待遇支付政策' },
  { id: 'SH320600202604003', applicant: '许文博', idCard: '320602198805204517', type: '异地就医审核', amount: 6400, status: '已退回', level: '复审', auditor: '高宁', submitTime: '2026-04-05 11:25', hospital: '上海瑞金医院', diagnosis: '腰椎间盘突出', ruleHit: '异地转诊材料缺失', auditOpinion: '缺转诊备案材料，退回补件' },
  { id: 'SH320200202604004', applicant: '顾雨晨', idCard: '320211199410083629', type: '住院报销审核', amount: 14820, status: '已通过', level: '终审', auditor: '钱莉', submitTime: '2026-04-09 16:40', hospital: '无锡市人民医院', diagnosis: '胆囊结石伴急性胆囊炎', ruleHit: '住院天数匹配', auditOpinion: '票据与费用清单一致，准予支付' },
  { id: 'SH320300202604005', applicant: '王子扬', idCard: '320303197612054331', type: '双通道购药审核', amount: 3920, status: '待审核', level: '初审', auditor: '赵静', submitTime: '2026-04-18 10:05', hospital: '徐州医科大学附属医院', diagnosis: '类风湿关节炎', ruleHit: '双通道处方时效复核', auditOpinion: '待核验处方流转时间是否超期' },
  { id: 'SH320400202604006', applicant: '沈佳宁', idCard: '320402199211236628', type: '门诊统筹审核', amount: 540, status: '已通过', level: '初审', auditor: '蒋雯', submitTime: '2026-04-08 08:55', hospital: '常州市第二人民医院', diagnosis: '上呼吸道感染', ruleHit: '普通门诊政策校验', auditOpinion: '费用构成清晰，符合统筹支付范围' },
  { id: 'SH320700202604007', applicant: '孙明轩', idCard: '320703198507276419', type: '异地就医审核', amount: 18350, status: '已退回', level: '终审', auditor: '韩倩', submitTime: '2026-04-07 13:48', hospital: '连云港市第一人民医院', diagnosis: '冠状动脉粥样硬化性心脏病', ruleHit: '重复结算疑点', auditOpinion: '发现同日跨机构结算记录，退回核实' },
  { id: 'SH320800202604008', applicant: '朱雨彤', idCard: '320802199912167245', type: '住院报销审核', amount: 9620, status: '已通过', level: '复审', auditor: '严峰', submitTime: '2026-04-15 15:20', hospital: '淮安市第一人民医院', diagnosis: '子宫肌瘤', ruleHit: '病种与手术编码一致', auditOpinion: '病案首页及费用清单齐全' },
  { id: 'SH320900202604009', applicant: '何嘉悦', idCard: '320902200104217820', type: '门诊慢特病审核', amount: 2210, status: '待审核', level: '初审', auditor: '曹颖', submitTime: '2026-04-19 09:12', hospital: '盐城市第三人民医院', diagnosis: '糖尿病并周围神经病变', ruleHit: '门慢用药目录复核', auditOpinion: '待复核两项耗材是否纳入支付' },
  { id: 'SH321000202604010', applicant: '郭天宇', idCard: '321002198610024671', type: '双通道购药审核', amount: 5680, status: '已通过', level: '终审', auditor: '邹琳', submitTime: '2026-04-17 17:36', hospital: '扬州大学附属医院', diagnosis: '强直性脊柱炎', ruleHit: '双通道药店处方关联成功', auditOpinion: '药品目录匹配，支付比例正确' },
  { id: 'SH321100202604011', applicant: '宋知行', idCard: '321102197905185812', type: '住院报销审核', amount: 12740, status: '已退回', level: '复审', auditor: '唐璐', submitTime: '2026-04-11 10:44', hospital: '镇江市第一人民医院', diagnosis: '膝关节半月板损伤', ruleHit: '手术耗材超限提醒', auditOpinion: '高值耗材授权单缺失，退回补正' },
  { id: 'SH321200202604012', applicant: '丁晓萌', idCard: '321202199512238426', type: '门诊统筹审核', amount: 430, status: '已通过', level: '初审', auditor: '孔洁', submitTime: '2026-04-14 11:02', hospital: '泰州市人民医院', diagnosis: '慢性胃炎', ruleHit: '门诊诊疗项目目录校验', auditOpinion: '目录内项目，票据完整' },
  { id: 'SH321300202604013', applicant: '袁晨浩', idCard: '321302198311146117', type: '异地就医审核', amount: 21460, status: '待审核', level: '复审', auditor: '彭雪', submitTime: '2026-04-20 14:18', hospital: '宿迁市第一人民医院', diagnosis: '恶性肿瘤术后化疗', ruleHit: '异地住院备案待确认', auditOpinion: '待核实备案起止时间与住院时间一致性' },
  { id: 'SH320100202604014', applicant: '林若溪', idCard: '320104199807223942', type: '门诊慢特病审核', amount: 1760, status: '已通过', level: '终审', auditor: '周岚', submitTime: '2026-04-13 16:05', hospital: '江苏省人民医院', diagnosis: '系统性红斑狼疮', ruleHit: '慢特病年度限额充足', auditOpinion: '符合待遇政策，予以支付' },
  { id: 'SH320500202604015', applicant: '赵嘉铭', idCard: '320506197702013655', type: '住院报销审核', amount: 8360, status: '已通过', level: '复审', auditor: '陆敏', submitTime: '2026-04-10 09:56', hospital: '苏州市立医院', diagnosis: '泌尿系结石', ruleHit: '住院费用结构正常', auditOpinion: '无违规收费项目' },
  { id: 'SH320200202604016', applicant: '顾欣怡', idCard: '320205200011053728', type: '双通道购药审核', amount: 4580, status: '待审核', level: '初审', auditor: '钱莉', submitTime: '2026-04-21 08:41', hospital: '无锡市第二人民医院', diagnosis: '银屑病', ruleHit: '双通道药品用量预警', auditOpinion: '待核实本月重复购药情况' },
  { id: 'SH320300202604017', applicant: '韩亦辰', idCard: '320322198404206318', type: '异地就医审核', amount: 10980, status: '已通过', level: '终审', auditor: '赵静', submitTime: '2026-04-06 15:32', hospital: '北京协和医院', diagnosis: '甲状腺恶性肿瘤', ruleHit: '转诊备案完整', auditOpinion: '异地就医流程合规，准予结算' },
  { id: 'SH320700202604018', applicant: '蒋安琪', idCard: '320706199302148924', type: '门诊统筹审核', amount: 390, status: '已通过', level: '初审', auditor: '韩倩', submitTime: '2026-04-03 10:11', hospital: '连云港市中医院', diagnosis: '颈椎病', ruleHit: '普通门诊项目复核', auditOpinion: '收费项目与病情相符' },
  { id: 'SH320900202604019', applicant: '郑博文', idCard: '320921198612302416', type: '住院报销审核', amount: 16780, status: '已退回', level: '终审', auditor: '曹颖', submitTime: '2026-04-22 13:27', hospital: '盐城市第一人民医院', diagnosis: '脑梗死恢复期', ruleHit: '康复项目频次异常', auditOpinion: '康复治疗频次超医保支付规则，退回复核' },
  { id: 'SH321000202604020', applicant: '陶诗雅', idCard: '321003199611058260', type: '门诊慢特病审核', amount: 2480, status: '已通过', level: '复审', auditor: '邹琳', submitTime: '2026-04-18 18:06', hospital: '扬州市妇幼保健院', diagnosis: '甲状腺功能减退', ruleHit: '慢病用药周期校验', auditOpinion: '用药周期和剂量合理' },
];

const headers = ['审核单号', '申请人', '身份证号', '审核类型', '申报金额', '审核状态', '审核层级', '审核人员', '提交时间', '就诊医院', '诊断', '规则命中', '审核意见'];

export default function AuditQuery({ onBack }: { onBack: () => void }) {
  const [keyword, setKeyword] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);

  const filtered = useMemo(
    () =>
      records.filter((item) =>
        [item.id, item.applicant, item.idCard, item.hospital, item.type, item.auditor].some((value) =>
          value.includes(keyword),
        ),
      ),
    [keyword],
  );

  const statusBadge = (status: AuditRecord['status']) => {
    const styles = {
      待审核: 'bg-yellow-100 text-yellow-700',
      已通过: 'bg-green-100 text-green-700',
      已退回: 'bg-red-100 text-red-700',
    };
    const icons = {
      待审核: Clock,
      已通过: CheckCircle,
      已退回: XCircle,
    };
    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const toRow = (item: AuditRecord) => ({
    审核单号: item.id,
    申请人: item.applicant,
    身份证号: item.idCard,
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
  });

  const handleExport = () => {
    const sheet = XLSX.utils.json_to_sheet(filtered.map(toRow), { header: headers });
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
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">审核记录</p>
          <p className="mt-2 text-3xl font-bold text-gray-800">{records.length}</p>
        </div>
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-700">待审核</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{records.filter((item) => item.status === '待审核').length}</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-700">已通过</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{records.filter((item) => item.status === '已通过').length}</p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">已退回</p>
          <p className="mt-2 text-3xl font-bold text-red-600">{records.filter((item) => item.status === '已退回').length}</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="请输入审核单号、申请人、身份证号、医院、审核人员查询"
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full min-w-[1500px]">
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
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3">{item.amount}</td>
                <td className="px-4 py-3">{statusBadge(item.status)}</td>
                <td className="px-4 py-3">{item.level}</td>
                <td className="px-4 py-3">{item.auditor}</td>
                <td className="px-4 py-3">{item.submitTime}</td>
                <td className="px-4 py-3">{item.hospital}</td>
                <td className="px-4 py-3">{item.diagnosis}</td>
                <td className="px-4 py-3">{item.ruleHit}</td>
                <td className="px-4 py-3">{item.auditOpinion}</td>
                <td className="px-4 py-3 text-right">
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-3xl rounded-xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b p-6">
                <h3 className="text-lg font-bold">审核详情 - {selectedRecord.id}</h3>
                <button onClick={() => setSelectedRecord(null)} className="rounded p-2 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 p-6 text-sm">
                {Object.entries(toRow(selectedRecord)).map(([label, value]) => (
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
