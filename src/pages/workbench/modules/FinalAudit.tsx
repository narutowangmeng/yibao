import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  Shield,
  Edit3,
  RotateCcw,
  Eye,
  Search,
  Building2,
  WalletCards,
  Stethoscope,
} from 'lucide-react';

interface FinalAuditProps {
  onClose: () => void;
  onBack: () => void;
}

type RiskLevel = 'low' | 'medium' | 'high';

interface Application {
  id: string;
  applicant: string;
  city: string;
  insuranceType: string;
  type: string;
  hospital: string;
  diagnosis: string;
  applyAmount: number;
  auditAmount: number;
  suggestedPayAmount: number;
  risk: RiskLevel;
  firstAuditor: string;
  firstAuditTime: string;
  firstOpinion: string;
  secondAuditor: string;
  secondAuditTime: string;
  secondOpinion: string;
  riskSummary: string;
  settlementRule: string;
}

const seeds = [
  ['FA320101', '顾语彤', '南京', '城镇职工', '住院报销终审', '江苏省人民医院', '股骨颈骨折术后', 28600, 24120, 22914, 'high', '周岚', '2026-05-03 09:10', '住院资料齐全，建议复核人工关节耗材支付类别', '邱琳', '2026-05-03 13:20', '高值耗材需按省级支付口径下调部分比例', '高值耗材与诊断匹配，存在进口耗材支付比例争议', '按乙类先行自付后纳入基金支付'],
  ['FA320102', '沈嘉禾', '苏州', '城乡居民', '门诊慢特病终审', '苏州大学附属第一医院', '系统性红斑狼疮', 3260, 3020, 2869, 'medium', '唐玥', '2026-05-03 09:45', '慢特病备案有效，材料完整', '陆敏', '2026-05-03 13:55', '建议通过，个别检验项目不纳入统筹', '部分检验项目超门诊慢特病支付范围', '按慢特病门诊统筹支付比例执行'],
  ['FA320103', '韩益辰', '无锡', '灵活就业', '异地就医终审', '复旦大学附属中山医院', '冠状动脉粥样硬化性心脏病', 21480, 17820, 16929, 'high', '钱莉', '2026-05-03 10:05', '异地备案已核实', '赵静', '2026-05-03 14:20', '支架耗材价格偏高，建议部分支付', '异地介入耗材价格高于省内同类均价', '按异地住院支付政策和耗材限价执行'],
  ['FA320104', '许文卿', '常州', '城镇职工', '生育报销终审', '常州市妇幼保健院', '剖宫产分娩', 13820, 12600, 11970, 'low', '蒋雯', '2026-05-03 10:40', '住院与产检资料衔接完整', '高宁', '2026-05-03 14:50', '符合政策，可准予支付', '未见明显疑点', '按生育住院待遇标准结算'],
  ['FA320105', '孙明轩', '南通', '城乡居民', '住院报销终审', '南通大学附属医院', '脑梗死恢复期', 17540, 14680, 13946, 'medium', '韩雪', '2026-05-03 11:10', '康复项目次数较多，已核实医嘱', '曹颖', '2026-05-03 15:18', '同意通过，按规定扣除目录外项目', '康复项目频次接近上限但有病情支撑', '按居民住院比例和限额执行'],
  ['FA320106', '陶诗雨', '徐州', '城镇职工', '特殊药品终审', '徐州医科大学附属医院', '乳腺恶性肿瘤术后辅助治疗', 9820, 9280, 8816, 'low', '赵宁', '2026-05-03 11:40', '特药备案、处方流转完整', '严峰', '2026-05-03 15:42', '建议通过', '特药登记及双通道购药记录一致', '按双通道药品待遇标准执行'],
];

const mockApplications: Application[] = seeds.map((item) => ({
  id: item[0],
  applicant: item[1],
  city: item[2],
  insuranceType: item[3],
  type: item[4],
  hospital: item[5],
  diagnosis: item[6],
  applyAmount: item[7] as number,
  auditAmount: item[8] as number,
  suggestedPayAmount: item[9] as number,
  risk: item[10] as RiskLevel,
  firstAuditor: item[11],
  firstAuditTime: item[12],
  firstOpinion: item[13],
  secondAuditor: item[14],
  secondAuditTime: item[15],
  secondOpinion: item[16],
  riskSummary: item[17],
  settlementRule: item[18],
}));

export default function FinalAudit({ onBack }: FinalAuditProps) {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [decision, setDecision] = useState<'approve' | 'partial' | 'reject' | 'return' | null>(null);
  const [finalAmount, setFinalAmount] = useState(0);
  const [comment, setComment] = useState('');
  const [signed, setSigned] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [result, setResult] = useState('');
  const [keyword, setKeyword] = useState('');

  const filteredApplications = useMemo(
    () =>
      applications.filter((item) =>
        [item.id, item.applicant, item.city, item.hospital, item.type, item.diagnosis].some((field) =>
          field.includes(keyword),
        ),
      ),
    [applications, keyword],
  );

  const handleSelect = (app: Application) => {
    setSelectedApp(app);
    setFinalAmount(app.suggestedPayAmount);
    setDecision(null);
    setComment('');
    setSigned(false);
  };

  const handleSubmit = () => {
    if (!decision || !comment || !signed || !selectedApp) return;

    setApplications((prev) => prev.filter((item) => item.id !== selectedApp.id));
    setResult(
      decision === 'approve'
        ? '终审通过'
        : decision === 'reject'
          ? '已驳回支付'
          : decision === 'return'
            ? '已退回复审'
            : '已按部分支付办结',
    );
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedApp(null);
    }, 1400);
  };

  const getRiskBadge = (risk: RiskLevel) => {
    const styles = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700',
    };
    const labels = { low: '低风险', medium: '中风险', high: '高风险' };
    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[risk]}`}>{labels[risk]}</span>;
  };

  if (showDetail && selectedApp) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setShowDetail(false)} className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-bold">终审详情 - {selectedApp.id}</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border bg-white p-4">
            <h4 className="mb-4 flex items-center gap-2 font-bold">
              <Building2 className="h-5 w-5 text-cyan-600" />
              基本信息
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">申请人</span><span className="font-medium">{selectedApp.applicant}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">参保地</span><span>{selectedApp.city}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">险种</span><span>{selectedApp.insuranceType}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">审核类型</span><span>{selectedApp.type}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">风险等级</span>{getRiskBadge(selectedApp.risk)}</div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-4">
            <h4 className="mb-4 flex items-center gap-2 font-bold">
              <Stethoscope className="h-5 w-5 text-cyan-600" />
              就医摘要
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-start"><span className="text-gray-500">医疗机构</span><span className="w-44 text-right">{selectedApp.hospital}</span></div>
              <div className="flex justify-between items-start"><span className="text-gray-500">诊断</span><span className="w-44 text-right">{selectedApp.diagnosis}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">申报金额</span><span>￥{selectedApp.applyAmount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">复审建议</span><span className="font-medium text-cyan-600">￥{selectedApp.suggestedPayAmount.toLocaleString()}</span></div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-4">
            <h4 className="mb-4 flex items-center gap-2 font-bold">
              <WalletCards className="h-5 w-5 text-cyan-600" />
              支付口径
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <div className="mb-1 text-gray-500">基金支付规则</div>
                <div className="rounded-lg bg-gray-50 p-3 text-gray-700">{selectedApp.settlementRule}</div>
              </div>
              <div>
                <div className="mb-1 text-gray-500">风险提示</div>
                <div className="rounded-lg bg-red-50 p-3 text-gray-700">{selectedApp.riskSummary}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h4 className="mb-4 font-bold">审核链路</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-blue-50 p-4">
              <div className="mb-2 font-medium text-blue-700">初审意见</div>
              <div className="mb-1 text-sm text-gray-600">{selectedApp.firstAuditor} · {selectedApp.firstAuditTime}</div>
              <div className="text-sm text-gray-700">{selectedApp.firstOpinion}</div>
            </div>
            <div className="rounded-xl bg-cyan-50 p-4">
              <div className="mb-2 font-medium text-cyan-700">复审意见</div>
              <div className="mb-1 text-sm text-gray-600">{selectedApp.secondAuditor} · {selectedApp.secondAuditTime}</div>
              <div className="text-sm text-gray-700">{selectedApp.secondOpinion}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedApp) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedApp(null)} className="rounded-lg p-2 hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold">终审审核</h3>
          </div>
          <button
            onClick={() => setShowDetail(true)}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-cyan-600 hover:bg-cyan-50"
          >
            <Eye className="h-4 w-4" />
            查看详情
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-xl border bg-white p-4"><div className="mb-1 text-sm text-gray-500">申报金额</div><div className="text-xl font-bold">￥{selectedApp.applyAmount.toLocaleString()}</div></div>
          <div className="rounded-xl border bg-white p-4"><div className="mb-1 text-sm text-gray-500">复审确认</div><div className="text-xl font-bold">￥{selectedApp.auditAmount.toLocaleString()}</div></div>
          <div className="rounded-xl border bg-white p-4"><div className="mb-1 text-sm text-gray-500">拟拨付金额</div><div className="text-xl font-bold text-cyan-600">￥{finalAmount.toLocaleString()}</div></div>
          <div className="rounded-xl border bg-white p-4"><div className="mb-1 text-sm text-gray-500">风险等级</div><div>{getRiskBadge(selectedApp.risk)}</div></div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h4 className="mb-3 font-bold">终审决策</h4>
          <div className="mb-4 grid grid-cols-4 gap-3">
            {[
              { id: 'approve', label: '同意支付', icon: CheckCircle, selectedClass: 'border-green-500 bg-green-50 text-green-700' },
              { id: 'partial', label: '部分支付', icon: Edit3, selectedClass: 'border-blue-500 bg-blue-50 text-blue-700' },
              { id: 'reject', label: '拒绝支付', icon: XCircle, selectedClass: 'border-red-500 bg-red-50 text-red-700' },
              { id: 'return', label: '退回复审', icon: RotateCcw, selectedClass: 'border-amber-500 bg-amber-50 text-amber-700' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDecision(opt.id as typeof decision)}
                className={`rounded-xl border-2 p-4 transition-all ${decision === opt.id ? opt.selectedClass : 'border-gray-200 text-gray-600'}`}
              >
                <opt.icon className="mx-auto mb-2 h-6 w-6" />
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>

          {decision === 'partial' && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">调整拨付金额</label>
              <div className="flex items-center gap-2">
                <span>￥</span>
                <input
                  type="number"
                  value={finalAmount}
                  onChange={(e) => setFinalAmount(Number(e.target.value))}
                  className="flex-1 rounded-lg border px-4 py-2"
                />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">终审意见</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="请输入终审结论、支付依据、扣减原因或退回说明"
              rows={4}
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <input
              type="checkbox"
              id="sign"
              checked={signed}
              onChange={(e) => setSigned(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="sign" className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-cyan-600" />
              我已确认以上审核结论、基金支付口径和风险处理意见
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => setSelectedApp(null)} className="rounded-lg border px-6 py-2">取消</button>
            <button
              onClick={handleSubmit}
              disabled={!decision || !comment || !signed}
              className="rounded-lg bg-cyan-600 px-6 py-2 text-white disabled:opacity-50"
            >
              确认终审
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            >
              <div className="rounded-xl bg-white p-6 text-center">
                <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
                <p className="text-lg font-bold">{result}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-bold">终审审核</h3>
          <span className="text-sm text-gray-500">待终审 {filteredApplications.length} 笔</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索单号、姓名、地市、医院、病种"
            className="w-72 rounded-lg border py-2 pl-9 pr-3"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm">单号</th>
              <th className="px-4 py-3 text-left text-sm">申请人</th>
              <th className="px-4 py-3 text-left text-sm">地市</th>
              <th className="px-4 py-3 text-left text-sm">审核类型</th>
              <th className="px-4 py-3 text-left text-sm">复审确认金额</th>
              <th className="px-4 py-3 text-left text-sm">风险</th>
              <th className="px-4 py-3 text-right text-sm">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredApplications.map((app) => (
              <tr key={app.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleSelect(app)}>
                <td className="px-4 py-3 font-medium text-cyan-700">{app.id}</td>
                <td className="px-4 py-3">{app.applicant}</td>
                <td className="px-4 py-3">{app.city}</td>
                <td className="px-4 py-3">{app.type}</td>
                <td className="px-4 py-3">￥{app.auditAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{getRiskBadge(app.risk)}</td>
                <td className="px-4 py-3 text-right">
                  <button className="rounded-lg bg-cyan-600 px-3 py-1.5 text-sm text-white">审核</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
