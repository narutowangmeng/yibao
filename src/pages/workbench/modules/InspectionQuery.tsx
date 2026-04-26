import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Download, Eye, X, CheckCircle, Clock, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

interface InspectionRecord {
  id: string;
  institution: string;
  type: string;
  status: '已完成' | '进行中' | '待处理';
  date: string;
  amount: number;
  inspector: string;
  issues: number;
  description: string;
  actionResult: string;
}

const records: InspectionRecord[] = [
  { id: 'JH320100202604001', institution: '南京市第一医院', type: '专项稽核', status: '已完成', date: '2026-04-15', amount: 125000, inspector: '张晨林', issues: 3, description: '医保目录执行及诊疗项目合规性检查', actionResult: '责令整改并追回基金2.5万元' },
  { id: 'JH320500202604002', institution: '苏州市中医医院', type: '飞行检查', status: '进行中', date: '2026-04-16', amount: 89000, inspector: '李晨璇', issues: 1, description: '突击检查药品使用规范性', actionResult: '待出具正式检查意见' },
  { id: 'JH320200202604003', institution: '无锡市人民医院', type: '日常巡查', status: '已完成', date: '2026-04-14', amount: 56000, inspector: '王嘉屹', issues: 0, description: '常规医保政策执行情况巡查', actionResult: '未发现明显违规问题' },
  { id: 'JH320400202604004', institution: '常州市第二人民医院', type: '专项稽核', status: '待处理', date: '2026-04-18', amount: 156000, inspector: '赵清越', issues: 5, description: '收费价格标准执行情况专项稽核', actionResult: '待形成处理决定书' },
  { id: 'JH320300202604005', institution: '徐州市中心医院', type: '飞行检查', status: '已完成', date: '2026-04-11', amount: 103000, inspector: '周沐阳', issues: 2, description: '门诊慢特病处方流转与结算一致性检查', actionResult: '追回基金1.2万元并约谈科室负责人' },
  { id: 'JH320600202604006', institution: '南通市第一人民医院', type: '专项稽核', status: '进行中', date: '2026-04-19', amount: 182000, inspector: '何静怡', issues: 4, description: '高值耗材采购与使用台账核验', actionResult: '现场核对耗材出入库记录中' },
  { id: 'JH320700202604007', institution: '连云港市第一人民医院', type: '日常巡查', status: '已完成', date: '2026-04-09', amount: 47000, inspector: '孙博涵', issues: 1, description: '异地就医直接结算业务规范检查', actionResult: '补充完善转诊备案留痕' },
  { id: 'JH320800202604008', institution: '淮安市第一人民医院', type: '专项稽核', status: '待处理', date: '2026-04-20', amount: 136000, inspector: '朱云舒', issues: 6, description: '康复项目频次及住院指征专项检查', actionResult: '拟暂停相关科室医保结算权限' },
  { id: 'JH320900202604009', institution: '盐城市第三人民医院', type: '飞行检查', status: '已完成', date: '2026-04-08', amount: 78000, inspector: '陈知行', issues: 2, description: '双通道药店处方外配监管协同检查', actionResult: '追回违规结算0.8万元' },
  { id: 'JH321000202604010', institution: '扬州大学附属医院', type: '日常巡查', status: '进行中', date: '2026-04-17', amount: 69000, inspector: '郭语桐', issues: 2, description: '住院病案首页与结算清单一致性核查', actionResult: '正在补调病案首页影像' },
  { id: 'JH321100202604011', institution: '镇江市第一人民医院', type: '专项稽核', status: '已完成', date: '2026-04-10', amount: 91000, inspector: '宋佳衡', issues: 3, description: '骨科高值耗材授权与收费执行检查', actionResult: '追回基金1.6万元并限期整改' },
  { id: 'JH321200202604012', institution: '泰州市人民医院', type: '飞行检查', status: '待处理', date: '2026-04-21', amount: 118000, inspector: '丁一诺', issues: 4, description: '门诊统筹超量开药及重复结算检查', actionResult: '待下发行政处理告知书' },
  { id: 'JH321300202604013', institution: '宿迁市第一人民医院', type: '专项稽核', status: '进行中', date: '2026-04-22', amount: 149000, inspector: '袁可欣', issues: 5, description: '肿瘤化疗项目与药品目录支付匹配检查', actionResult: '规则命中数据复核中' },
  { id: 'JH320100202604014', institution: '江苏省人民医院', type: '日常巡查', status: '已完成', date: '2026-04-07', amount: 42000, inspector: '林亦凡', issues: 0, description: '医保窗口经办流程规范抽查', actionResult: '经办留痕完整，未发现异常' },
  { id: 'JH320500202604015', institution: '苏州市立医院', type: '专项稽核', status: '已完成', date: '2026-04-06', amount: 88000, inspector: '赵安宁', issues: 2, description: '检验检查项目组合收费专项核查', actionResult: '纠正项目拆分收费问题' },
  { id: 'JH320200202604016', institution: '无锡市第二人民医院', type: '飞行检查', status: '进行中', date: '2026-04-23', amount: 132000, inspector: '顾以晴', issues: 3, description: '药品进销存与医保结算关联比对', actionResult: '现场盘点与系统台账核对中' },
  { id: 'JH320300202604017', institution: '徐州市第一人民医院', type: '日常巡查', status: '已完成', date: '2026-04-12', amount: 36000, inspector: '韩奕辰', issues: 1, description: '慢病备案与门诊结算一致性核查', actionResult: '要求补录备案变更说明' },
  { id: 'JH320600202604018', institution: '南通大学附属医院', type: '专项稽核', status: '待处理', date: '2026-04-24', amount: 173000, inspector: '蒋书瑶', issues: 7, description: 'ICU收费项目与病程记录匹配检查', actionResult: '待组织专家复核后处理' },
  { id: 'JH320700202604019', institution: '连云港市中医院', type: '飞行检查', status: '已完成', date: '2026-04-13', amount: 54000, inspector: '郑卓然', issues: 1, description: '中医适宜技术项目收费核查', actionResult: '退回多收基金0.3万元' },
  { id: 'JH320900202604020', institution: '盐城市第一人民医院', type: '专项稽核', status: '进行中', date: '2026-04-25', amount: 161000, inspector: '陶诗涵', issues: 4, description: '异地就医住院结算跨省费用明细检查', actionResult: '待省平台返回明细比对结果' },
];

const headers = ['稽核单号', '医疗机构', '稽核类型', '状态', '稽核日期', '涉及金额', '稽核人员', '问题数量', '检查描述', '处理结果'];

export default function InspectionQuery({ onBack }: { onBack: () => void }) {
  const [keyword, setKeyword] = useState('');
  const [selectedItem, setSelectedItem] = useState<InspectionRecord | null>(null);

  const filtered = useMemo(
    () =>
      records.filter((item) =>
        [item.id, item.institution, item.inspector, item.type].some((value) => value.includes(keyword)),
      ),
    [keyword],
  );

  const statusBadge = (status: InspectionRecord['status']) => {
    const styles = {
      已完成: 'bg-green-100 text-green-700',
      进行中: 'bg-blue-100 text-blue-700',
      待处理: 'bg-yellow-100 text-yellow-700',
    };
    const icons = { 已完成: CheckCircle, 进行中: Clock, 待处理: FileText };
    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  const toRow = (item: InspectionRecord) => ({
    稽核单号: item.id,
    医疗机构: item.institution,
    稽核类型: item.type,
    状态: item.status,
    稽核日期: item.date,
    涉及金额: item.amount,
    稽核人员: item.inspector,
    问题数量: item.issues,
    检查描述: item.description,
    处理结果: item.actionResult,
  });

  const handleExport = () => {
    const sheet = XLSX.utils.json_to_sheet(filtered.map(toRow), { header: headers });
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, '稽核查询');
    XLSX.writeFile(book, `稽核查询结果_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-bold">稽核查询</h3>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white">
          <Download className="h-4 w-4" />
          导出查询结果
        </button>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">稽核记录</p>
          <p className="mt-2 text-3xl font-bold text-gray-800">{records.length}</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-700">已完成</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{records.filter((item) => item.status === '已完成').length}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-700">进行中</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{records.filter((item) => item.status === '进行中').length}</p>
        </div>
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-700">待处理</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{records.filter((item) => item.status === '待处理').length}</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="请输入稽核单号、医疗机构、稽核人员、稽核类型查询"
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full min-w-[1400px]">
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
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3">{statusBadge(item.status)}</td>
                <td className="px-4 py-3">{item.date}</td>
                <td className="px-4 py-3">{item.amount}</td>
                <td className="px-4 py-3">{item.inspector}</td>
                <td className="px-4 py-3">{item.issues}</td>
                <td className="px-4 py-3">{item.description}</td>
                <td className="px-4 py-3">{item.actionResult}</td>
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
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-3xl rounded-xl bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-bold">稽核详情</h4>
                <button onClick={() => setSelectedItem(null)} className="rounded p-1 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(toRow(selectedItem)).map(([label, value]) => (
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
