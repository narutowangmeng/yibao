import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, CheckCircle, Eye, History, Shield, Ban, UserCheck, FileText, Send } from 'lucide-react';

interface ExceptionHandleProps {
  onClose: () => void;
  onBack: () => void;
}

type ExceptionStatus = 'pending' | 'processing' | 'resolved' | 'transferred';

const exceptionTypes = [
  { id: 'amount', label: '金额异常', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
  { id: 'frequency', label: '频次异常', color: 'bg-orange-100 text-orange-700', icon: History },
  { id: 'hospital', label: '机构疑点', color: 'bg-purple-100 text-purple-700', icon: Shield },
  { id: 'drug', label: '药品规则', color: 'bg-blue-100 text-blue-700', icon: FileText },
] as const;

const riskLevels = [
  { id: 'high', label: '高风险', color: 'bg-red-500' },
  { id: 'medium', label: '中风险', color: 'bg-orange-500' },
  { id: 'low', label: '低风险', color: 'bg-yellow-500' },
] as const;

interface ExceptionItem {
  id: string;
  type: typeof exceptionTypes[number]['id'];
  applicant: string;
  city: string;
  institution: string;
  amount: number;
  risk: typeof riskLevels[number]['id'];
  status: ExceptionStatus;
  reason: string;
  ruleCode: string;
  clue: string;
  time: string;
  history: string[];
}

const seeds = [
  ['EX320001', 'amount', '陈思远', '南京', '江苏省人民医院', 85000, 'high', 'pending', '单次住院申报金额显著高于同病组均值', 'AMT-DRG-017', '人工关节及配套耗材总额偏高，疑似存在目录外高价耗材分摊异常', '2026-05-02 09:30', ['2026-05-02 09:30 系统自动生成疑点单', '2026-05-02 09:45 初审员周岚标记重点复核']],
  ['EX320002', 'frequency', '顾雨晴', '苏州', '苏州大学附属第一医院', 3200, 'medium', 'processing', '30日内门诊慢特病重复购药频次异常', 'FRE-DRUG-006', '同一门慢病种在28天内出现两次高值处方', '2026-05-02 10:12', ['2026-05-02 10:12 命中药品频次规则', '2026-05-02 10:30 已发起人工复核']],
  ['EX320003', 'hospital', '许文卿', '南通', '南通大学附属医院', 56000, 'high', 'pending', '机构同病种平均费用明显偏高', 'ORG-COST-021', '妇产类住院病例均次费用连续两周高于同级机构', '2026-05-02 10:58', ['2026-05-02 10:58 触发机构均次费用预警']],
  ['EX320004', 'drug', '王子杭', '徐州', '徐州医科大学附属医院', 12800, 'resolved', 'resolved', '药品使用与诊断不完全匹配', 'DRUG-DIAG-013', '双通道生物制剂处方适应症材料已补齐', '2026-05-02 11:15', ['2026-05-02 11:15 系统识别适应症缺失', '2026-05-02 13:10 医院补传病历摘要', '2026-05-02 13:28 已标记正常']],
  ['EX320005', 'frequency', '孙明轩', '连云港', '连云港市第一人民医院', 18350, 'high', 'transferred', '康复治疗项目频次连续超限', 'FRE-REH-004', '同一住院周期内康复理疗频次高于支付规则上限', '2026-05-02 11:42', ['2026-05-02 11:42 命中康复频次规则', '2026-05-02 12:05 转稽核检查']],
  ['EX320006', 'amount', '沈佳宁', '常州', '常州市第二人民医院', 9800, 'medium', 'processing', '普通门诊单日统筹金额偏高', 'AMT-OUT-005', '同日治疗与药品费用集中，需核查是否拆分收费', '2026-05-02 12:10', ['2026-05-02 12:10 生成疑点单', '2026-05-02 12:26 复核员领取处理']],
  ['EX320007', 'drug', '何嘉悦', '盐城', '盐城市第三人民医院', 5680, 'low', 'pending', '双通道药品领用周期临界', 'DRUG-PERIOD-002', '本次取药与上次间隔接近最短周期', '2026-05-02 12:42', ['2026-05-02 12:42 药品周期规则触发']],
  ['EX320008', 'hospital', '郭天宇', '扬州', '扬州大学附属医院', 22400, 'medium', 'pending', '机构上传清单与病案首页编码存在差异', 'ORG-CODE-011', '手术编码和费用清单主项目不一致', '2026-05-02 13:06', ['2026-05-02 13:06 编码差异识别']],
  ['EX320009', 'amount', '宋知言', '镇江', '镇江市第一人民医院', 16780, 'high', 'processing', '高值耗材价格高于省标参考区间', 'AMT-MAT-008', '膝关节镜手术耗材存在价格异常波动', '2026-05-02 13:28', ['2026-05-02 13:28 系统预警', '2026-05-02 13:55 已通知医院补充采购凭证']],
  ['EX320010', 'frequency', '林若溪', '泰州', '泰州市人民医院', 2860, 'low', 'resolved', '门诊复诊间隔偏短', 'FRE-OUT-003', '经核实为药物不良反应复诊，处置完结', '2026-05-02 13:52', ['2026-05-02 13:52 生成疑点', '2026-05-02 14:20 医生说明上传', '2026-05-02 14:28 已结案']],
  ['EX320011', 'drug', '袁晨浩', '宿迁', '宿迁市第一人民医院', 6320, 'medium', 'pending', '特药登记与处方流转编号待核验', 'DRUG-SPEC-007', '处方流转系统回传存在延迟', '2026-05-02 14:16', ['2026-05-02 14:16 系统触发特药一致性校验']],
  ['EX320012', 'hospital', '蒋安琪', '南京', '南京市第一医院', 14260, 'medium', 'processing', '住院天数与临床路径偏差较大', 'ORG-LOS-015', '同病种住院日超均值4天，需核病程记录', '2026-05-02 14:38', ['2026-05-02 14:38 住院天数预警', '2026-05-02 15:00 已转人工复核']],
  ['EX320013', 'amount', '郑博文', '无锡', '无锡市第二人民医院', 2480, 'low', 'pending', '门诊慢特病耗材支付占比偏高', 'AMT-MT-003', '本次耗材费用占比接近上限', '2026-05-02 15:02', ['2026-05-02 15:02 触发门慢耗材占比规则']],
  ['EX320014', 'drug', '陶诗雨', '徐州', '徐州市中心医院', 7820, 'medium', 'transferred', '双通道药品诊断佐证材料不足', 'DRUG-DIAG-021', '已移送医保中心进一步核验备案与病理结果', '2026-05-02 15:26', ['2026-05-02 15:26 命中适应症规则', '2026-05-02 15:48 转医保中心核验']],
  ['EX320015', 'frequency', '彭书远', '常州', '上海市第六人民医院', 11860, 'medium', 'processing', '异地康复治疗日次密集', 'FRE-OTR-009', '异地住院后连续康复记录需核验转诊意见', '2026-05-02 15:52', ['2026-05-02 15:52 生成疑点单', '2026-05-02 16:10 经办员领取']],
  ['EX320016', 'hospital', '周辰逸', '苏州', '苏州市立医院', 19640, 'high', 'pending', '介入耗材目录编码上传不完整', 'ORG-MAT-014', '同批支架材料存在缺失编码', '2026-05-02 16:18', ['2026-05-02 16:18 目录编码校验失败']],
  ['EX320017', 'amount', '孟知夏', '南通', '南通市第一人民医院', 620, 'low', 'resolved', '门诊项目金额临界异常', 'AMT-OUT-002', '经核实为急诊夜间加收项目，已结案', '2026-05-02 16:40', ['2026-05-02 16:40 生成疑点', '2026-05-02 16:55 已补充急诊说明', '2026-05-02 17:08 标记正常']],
  ['EX320018', 'drug', '贺嘉颖', '宿迁', '宿迁市第一人民医院', 9320, 'high', 'pending', '特药费用高且购药周期异常', 'DRUG-SPEC-012', '需核验是否存在重复领药', '2026-05-02 17:05', ['2026-05-02 17:05 命中特药重复领用规则']],
  ['EX320019', 'hospital', '朱语彤', '淮安', '淮安市第一人民医院', 9620, 'medium', 'processing', '病种与手术主项目编码差异', 'ORG-CODE-013', '妇科手术项目编码与首页手术码不一致', '2026-05-02 17:22', ['2026-05-02 17:22 自动识别差异', '2026-05-02 17:36 已发起编码复核']],
  ['EX320020', 'frequency', '顾语彤', '南京', '江苏省人民医院', 28600, 'high', 'pending', '高值耗材审批记录缺失', 'FRE-MAT-001', '同一病例关联多次耗材补录，需核查操作链路', '2026-05-02 17:50', ['2026-05-02 17:50 生成高风险疑点']],
];

const mockExceptions: ExceptionItem[] = seeds.map((item) => ({
  id: item[0],
  type: item[1] as ExceptionItem['type'],
  applicant: item[2],
  city: item[3],
  institution: item[4],
  amount: item[5] as number,
  risk: item[6] as ExceptionItem['risk'],
  status: item[7] as ExceptionStatus,
  reason: item[8],
  ruleCode: item[9],
  clue: item[10],
  time: item[11],
  history: item[12] as string[],
}));

const handleActions = [
  { id: 'normal', label: '标记正常', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  { id: 'blacklist', label: '加入黑名单', icon: Ban, color: 'text-red-600 bg-red-50' },
  { id: 'review', label: '人工复核', icon: UserCheck, color: 'text-blue-600 bg-blue-50' },
  { id: 'audit', label: '转稽核', icon: Shield, color: 'text-purple-600 bg-purple-50' },
  { id: 'notice', label: '发机构通知', icon: Send, color: 'text-amber-600 bg-amber-50' },
] as const;

export default function ExceptionHandle({ onBack }: ExceptionHandleProps) {
  const [rows, setRows] = useState<ExceptionItem[]>(mockExceptions);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedException, setSelectedException] = useState<string | null>(mockExceptions[0]?.id ?? null);
  const [showHistory, setShowHistory] = useState(false);

  const filteredExceptions = useMemo(
    () => (selectedType === 'all' ? rows : rows.filter((item) => item.type === selectedType)),
    [rows, selectedType],
  );

  const getStatusBadge = (status: ExceptionStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      resolved: 'bg-green-100 text-green-700',
      transferred: 'bg-purple-100 text-purple-700',
    };
    const labels = {
      pending: '待处理',
      processing: '处理中',
      resolved: '已处理',
      transferred: '已转稽核',
    };
    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const selectedData = rows.find((item) => item.id === selectedException);

  const handleAction = (actionId: string) => {
    if (!selectedData) return;
    const nextStatus: Record<string, ExceptionStatus> = {
      normal: 'resolved',
      blacklist: 'processing',
      review: 'processing',
      audit: 'transferred',
      notice: 'processing',
    };
    setRows((prev) =>
      prev.map((item) =>
        item.id === selectedData.id
          ? {
              ...item,
              status: nextStatus[actionId],
              history: [`${new Date().toLocaleString('zh-CN', { hour12: false })} 已执行${handleActions.find((a) => a.id === actionId)?.label}`, ...item.history],
            }
          : item,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" />
          返回
        </button>
        <h3 className="text-xl font-bold text-gray-800">异常处理</h3>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setSelectedType('all')} className={`rounded-lg px-4 py-2 text-sm font-medium ${selectedType === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>全部疑点</button>
        {exceptionTypes.map((type) => (
          <button key={type.id} onClick={() => setSelectedType(type.id)} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${selectedType === type.id ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            <type.icon className="h-4 w-4" />
            {type.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b p-4">
            <h4 className="font-semibold text-gray-800">疑点单列表</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">疑点单号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">疑点类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">参保人</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">地市</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">机构</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">疑点金额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredExceptions.map((item) => (
                  <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-cyan-700">{item.id}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-1 text-xs font-medium ${exceptionTypes.find((t) => t.id === item.type)?.color}`}>{exceptionTypes.find((t) => t.id === item.type)?.label}</span>
                    </td>
                    <td className="px-4 py-3">{item.applicant}</td>
                    <td className="px-4 py-3">{item.city}</td>
                    <td className="px-4 py-3">{item.institution}</td>
                    <td className="px-4 py-3">￥{item.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setSelectedException(item.id)} className="rounded p-2 text-gray-500 hover:bg-red-50 hover:text-red-600">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          {selectedData ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">疑点详情</h4>
                <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                  <History className="h-4 w-4" />
                  处置轨迹
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                  <div className="mb-1 text-sm font-medium text-red-600">疑点原因</div>
                  <div className="text-gray-700">{selectedData.reason}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-gray-500">疑点单号</span><div className="font-medium">{selectedData.id}</div></div>
                  <div><span className="text-gray-500">规则编码</span><div className="font-medium">{selectedData.ruleCode}</div></div>
                  <div><span className="text-gray-500">参保人</span><div className="font-medium">{selectedData.applicant}</div></div>
                  <div><span className="text-gray-500">参保地市</span><div className="font-medium">{selectedData.city}</div></div>
                  <div><span className="text-gray-500">机构名称</span><div className="font-medium">{selectedData.institution}</div></div>
                  <div><span className="text-gray-500">疑点金额</span><div className="font-medium">￥{selectedData.amount.toLocaleString()}</div></div>
                  <div><span className="text-gray-500">发现时间</span><div className="font-medium">{selectedData.time}</div></div>
                  <div><span className="text-gray-500">当前状态</span><div>{getStatusBadge(selectedData.status)}</div></div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="mb-1 font-medium text-gray-700">疑点说明</div>
                  <div className="text-gray-600">{selectedData.clue}</div>
                </div>

                <div className="border-t pt-3">
                  <div className="mb-2 text-sm font-medium text-gray-700">处置动作</div>
                  <div className="grid grid-cols-2 gap-2">
                    {handleActions.map((action) => (
                      <button key={action.id} onClick={() => handleAction(action.id)} className={`flex items-center justify-center gap-2 rounded-lg p-2 text-sm font-medium transition-opacity hover:opacity-80 ${action.color}`}>
                        <action.icon className="h-4 w-4" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
              <AlertTriangle className="mx-auto mb-2 h-12 w-12 text-gray-300" />
              <p>请选择疑点单查看详情</p>
            </div>
          )}

          {showHistory && selectedData && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h4 className="mb-3 font-semibold text-gray-800">处置轨迹</h4>
              <div className="space-y-2 text-sm">
                {selectedData.history.map((entry) => (
                  <div key={entry} className="flex items-start gap-2 text-gray-600">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                    <span>{entry}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
