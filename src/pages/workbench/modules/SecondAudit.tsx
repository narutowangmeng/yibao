import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  User,
  Clock,
  FileText,
  RotateCcw,
  Users,
  ShieldAlert,
  Building2,
  Stethoscope,
  Search,
} from 'lucide-react';

type RiskLevel = 'low' | 'medium' | 'high';

interface AuditItem {
  id: string;
  applicant: string;
  gender: string;
  insuranceType: string;
  city: string;
  type: string;
  amount: number;
  inCatalogAmount: number;
  selfPayAmount: number;
  suggestedPayAmount: number;
  firstAuditor: string;
  firstAuditTime: string;
  firstOpinion: string;
  status: 'pending';
  riskLevel: RiskLevel;
  flagged: boolean;
  hospital: string;
  department: string;
  doctor: string;
  diagnosis: string;
  ruleHit: string;
  reviewHint: string;
}

const seedData = [
  ['南京', '陈志远', '男', '城镇职工', '住院报销审核', '江苏省人民医院', '骨科', '王俊峰', '腰椎间盘突出伴神经根病', 18260, 14580, 3680, 13820, '周岚', '2026-05-02 09:10', '高值耗材授权单已上传，需复核置换材料支付比例', 'high', true, '高值耗材目录外比例预警', '核对脊柱内固定耗材支付口径'],
  ['苏州', '顾雨晴', '女', '城乡居民', '门诊慢特病审核', '苏州大学附属第一医院', '内分泌科', '陆明', '2型糖尿病并周围神经病变', 2680, 2240, 440, 2128, '唐玥', '2026-05-02 09:45', '慢特病备案有效，待核验本次血糖试纸数量', 'medium', true, '门诊慢特病耗材数量预警', '核查试纸与针头用量是否超过月度上限'],
  ['无锡', '沈嘉禾', '男', '灵活就业', '异地就医审核', '上海瑞金医院', '心内科', '李文博', '冠状动脉粥样硬化性心脏病', 23600, 18860, 4740, 17910, '钱莉', '2026-05-02 10:05', '异地备案齐全，需复核介入耗材与支付标准', 'high', true, '异地介入耗材价格偏高', '核对支架和球囊目录编码'],
  ['徐州', '韩益辰', '男', '城镇职工', '双通道购药审核', '徐州医科大学附属医院', '风湿免疫科', '赵宁', '类风湿关节炎', 4580, 4580, 0, 4122, '赵静', '2026-05-02 10:30', '双通道处方与购药记录一致，可复核支付比例', 'low', false, '双通道购药规则匹配', '确认药店上传处方流转编号'],
  ['常州', '朱语彤', '女', '城乡居民', '门诊统筹审核', '常州市第二人民医院', '呼吸内科', '周辰', '支气管哮喘急性发作', 980, 760, 220, 608, '蒋雯', '2026-05-02 10:55', '普通门诊费用结构正常，需确认雾化药品是否重复收费', 'medium', true, '重复收费疑点', '核查同日雾化治疗项目次数'],
  ['南通', '许文卿', '女', '城镇职工', '生育报销审核', '南通大学附属医院', '产科', '邵洁', '剖宫产分娩', 12840, 11020, 1820, 10469, '高宁', '2026-05-02 11:20', '住院病案首页完整，需复核产前检查费用归集', 'medium', false, '生育费用归集复核', '确认门诊产检是否已在住院包干内'],
  ['连云港', '孙明轩', '男', '城乡居民', '住院报销审核', '连云港市第一人民医院', '神经内科', '顾晨', '脑梗死恢复期', 16450, 13080, 3370, 12426, '韩雪', '2026-05-02 11:50', '康复治疗次数偏高，需复核支付天数', 'high', true, '康复治疗频次预警', '核对康复医嘱与治疗明细一致性'],
  ['淮安', '丁晓莹', '女', '灵活就业', '门诊慢特病审核', '淮安市第一人民医院', '肾内科', '严峰', '慢性肾功能不全', 3120, 2750, 370, 2613, '孔洁', '2026-05-02 12:15', '慢特病待遇资格有效，需确认EPO用量', 'medium', true, '特殊药品用量预警', '核对28天内购药记录'],
  ['盐城', '郑博文', '男', '城镇职工', '住院报销审核', '盐城市第一人民医院', '普外科', '曹越', '胆囊结石伴急性胆囊炎', 14860, 12040, 2820, 11438, '曹颖', '2026-05-02 13:05', '手术项目与诊断匹配，需复核一次性耗材明细', 'medium', false, '手术耗材明细复核', '核对止血夹与穿刺器数量'],
  ['扬州', '陶诗雨', '女', '城乡居民', '特殊药品审核', '扬州大学附属医院', '肿瘤科', '郭健', '乳腺恶性肿瘤术后化疗', 8260, 8260, 0, 7434, '邱琳', '2026-05-02 13:36', '特药备案齐全，需复核本周期购药间隔', 'low', false, '特药备案生效中', '确认上次领取日期与本次间隔'],
  ['镇江', '宋知远', '男', '城镇职工', '异地就医审核', '南京鼓楼医院', '心胸外科', '梁骁', '主动脉瓣狭窄', 28600, 22860, 5740, 21717, '唐璐', '2026-05-02 14:00', '转诊备案齐全，需确认人工瓣膜耗材支付类别', 'high', true, '高值耗材支付类别待判定', '确认国产/进口瓣膜支付标准'],
  ['泰州', '林若溪', '女', '学生', '门诊统筹审核', '泰州市人民医院', '皮肤科', '孟卓', '系统性红斑狼疮随访', 1420, 1180, 240, 944, '贺倩', '2026-05-02 14:25', '学生居民待遇正常，需核对免疫抑制剂目录归类', 'medium', false, '药品目录分类复核', '确认他克莫司门诊支付类别'],
  ['宿迁', '袁晨浩', '男', '灵活就业', '住院报销审核', '宿迁市第一人民医院', '消化内科', '潘磊', '消化道出血', 11980, 9620, 2360, 9139, '彭雪', '2026-05-02 14:55', '病例资料齐全，需复核输血相关项目', 'medium', true, '输血项目联动预警', '核对交叉配血与输血量'],
];

const mockData: AuditItem[] = seedData.map((item, index) => ({
  id: `SA3200${(index + 1).toString().padStart(2, '0')}`,
  city: item[0],
  applicant: item[1],
  gender: item[2],
  insuranceType: item[3],
  type: item[4],
  hospital: item[5],
  department: item[6],
  doctor: item[7],
  diagnosis: item[8],
  amount: item[9] as number,
  inCatalogAmount: item[10] as number,
  selfPayAmount: item[11] as number,
  suggestedPayAmount: item[12] as number,
  firstAuditor: item[13],
  firstAuditTime: item[14],
  firstOpinion: item[15],
  riskLevel: item[16] as RiskLevel,
  flagged: item[17] as boolean,
  ruleHit: item[18],
  reviewHint: item[19],
  status: 'pending',
}));

export default function SecondAudit({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<AuditItem[]>(mockData);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reviewOpinion, setReviewOpinion] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [toast, setToast] = useState('');
  const [keyword, setKeyword] = useState('');

  const filteredData = useMemo(
    () =>
      data.filter((item) =>
        [item.id, item.applicant, item.city, item.hospital, item.type, item.diagnosis].some((field) =>
          field.includes(keyword),
        ),
      ),
    [data, keyword],
  );

  const selectedItem = filteredData.find((item) => item.id === selectedId) ?? data.find((item) => item.id === selectedId);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 1800);
  };

  const handleItemSelect = (id: string) => {
    if (batchMode) {
      setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
      return;
    }
    setSelectedId(id);
    setShowDetail(true);
  };

  const handleAudit = (action: 'pass' | 'return' | 'reject') => {
    if (!selectedId) return;
    if (!reviewOpinion.trim()) {
      showToast('请输入复审意见');
      return;
    }

    const actionText =
      action === 'pass' ? '已通过并转终审' : action === 'return' ? '已退回初审补正' : '已驳回申报';

    setData((prev) => prev.filter((item) => item.id !== selectedId));
    setReviewOpinion('');
    setShowDetail(false);
    setSelectedId(null);
    showToast(actionText);
  };

  const handleBatchAction = (action: 'pass' | 'return') => {
    if (selectedItems.length === 0) {
      showToast('请先勾选需要处理的单据');
      return;
    }

    setData((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
    showToast(action === 'pass' ? `已批量通过 ${selectedItems.length} 条` : `已批量退回 ${selectedItems.length} 条`);
    setSelectedItems([]);
  };

  const getRiskBadge = (level: RiskLevel) => {
    const styles = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700',
    };
    const labels = { low: '低风险', medium: '中风险', high: '高风险' };
    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${styles[level]}`}>
        {labels[level]}
      </span>
    );
  };

  if (showDetail && selectedItem) {
    return (
      <div className="p-6 space-y-4">
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed right-4 top-4 z-50 rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg"
          >
            {toast}
          </motion.div>
        )}

        <div className="flex items-center gap-4">
          <button onClick={() => setShowDetail(false)} className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-bold">复审审核 - {selectedItem.id}</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border bg-white p-4">
            <h4 className="mb-4 flex items-center gap-2 font-bold">
              <User className="h-5 w-5 text-cyan-600" />
              参保信息
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">申请人</span><span className="font-medium">{selectedItem.applicant}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">性别</span><span>{selectedItem.gender}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">参保地市</span><span>{selectedItem.city}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">险种</span><span>{selectedItem.insuranceType}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">审核类型</span><span>{selectedItem.type}</span></div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-4">
            <h4 className="mb-4 flex items-center gap-2 font-bold">
              <Building2 className="h-5 w-5 text-cyan-600" />
              就医信息
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">医疗机构</span><span className="font-medium text-right">{selectedItem.hospital}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">科室</span><span>{selectedItem.department}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">接诊医生</span><span>{selectedItem.doctor}</span></div>
              <div className="flex justify-between items-start"><span className="text-gray-500">诊断</span><span className="w-48 text-right">{selectedItem.diagnosis}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">风险等级</span>{getRiskBadge(selectedItem.riskLevel)}</div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-4">
            <h4 className="mb-4 flex items-center gap-2 font-bold">
              <FileText className="h-5 w-5 text-cyan-600" />
              费用构成
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">申报金额</span><span className="font-medium text-cyan-600">￥{selectedItem.amount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">目录内金额</span><span>￥{selectedItem.inCatalogAmount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">个人自付</span><span>￥{selectedItem.selfPayAmount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">建议支付</span><span className="font-medium text-emerald-600">￥{selectedItem.suggestedPayAmount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">初审标记</span><span>{selectedItem.flagged ? '需重点复核' : '常规复核'}</span></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-4 flex items-center gap-2 font-bold">
              <Clock className="h-5 w-5 text-blue-600" />
              初审结论
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">初审人员</span><span className="font-medium">{selectedItem.firstAuditor}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">初审时间</span><span>{selectedItem.firstAuditTime}</span></div>
              <div className="rounded-lg bg-white p-3 text-gray-700">{selectedItem.firstOpinion}</div>
            </div>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <h4 className="mb-4 flex items-center gap-2 font-bold">
              <ShieldAlert className="h-5 w-5 text-red-600" />
              规则命中与复审提示
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <div className="mb-1 text-gray-500">规则命中</div>
                <div className="rounded-lg bg-white p-3 text-gray-700">{selectedItem.ruleHit}</div>
              </div>
              <div>
                <div className="mb-1 text-gray-500">复审重点</div>
                <div className="rounded-lg bg-white p-3 text-gray-700">{selectedItem.reviewHint}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h4 className="mb-4 flex items-center gap-2 font-bold">
            <MessageSquare className="h-5 w-5 text-cyan-600" />
            复审处理意见
          </h4>
          <textarea
            value={reviewOpinion}
            onChange={(e) => setReviewOpinion(e.target.value)}
            placeholder="请输入复审意见，如复核结果、需补正材料、退回原因、建议支付口径等"
            className="h-24 w-full resize-none rounded-lg border p-3"
          />
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => handleAudit('pass')}
              className="flex-1 rounded-lg bg-emerald-500 py-2 text-white flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              通过并转终审
            </button>
            <button
              onClick={() => handleAudit('return')}
              className="flex-1 rounded-lg bg-orange-500 py-2 text-white flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              退回初审
            </button>
            <button
              onClick={() => handleAudit('reject')}
              className="flex-1 rounded-lg bg-red-500 py-2 text-white flex items-center justify-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              驳回申请
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed right-4 top-4 z-50 rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-bold">复审审核</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索单号、姓名、地市、医院、病种"
              className="w-72 rounded-lg border py-2 pl-9 pr-3"
            />
          </div>
          <button
            onClick={() => setBatchMode(!batchMode)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 ${batchMode ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100'}`}
          >
            <Users className="h-4 w-4" />
            {batchMode ? '退出批量' : '批量复审'}
          </button>
          <span className="text-sm text-gray-500">待复审 {filteredData.length} 条</span>
        </div>
      </div>

      {batchMode && selectedItems.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-cyan-200 bg-cyan-50 p-4">
          <span className="font-medium text-cyan-800">已勾选 {selectedItems.length} 条单据</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBatchAction('pass')}
              className="flex items-center gap-1 rounded-lg bg-emerald-500 px-4 py-2 text-white"
            >
              <CheckCircle className="h-4 w-4" />
              批量通过
            </button>
            <button
              onClick={() => handleBatchAction('return')}
              className="flex items-center gap-1 rounded-lg bg-orange-500 px-4 py-2 text-white"
            >
              <RotateCcw className="h-4 w-4" />
              批量退回
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[980px]">
          <thead className="bg-gray-50">
            <tr>
              {batchMode && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={filteredData.length > 0 && selectedItems.length === filteredData.length}
                    onChange={() =>
                      setSelectedItems(
                        selectedItems.length === filteredData.length ? [] : filteredData.map((item) => item.id),
                      )
                    }
                    className="rounded"
                  />
                </th>
              )}
              <th className="px-4 py-3 text-left text-sm font-medium">单号</th>
              <th className="px-4 py-3 text-left text-sm font-medium">申请人</th>
              <th className="px-4 py-3 text-left text-sm font-medium">地市</th>
              <th className="px-4 py-3 text-left text-sm font-medium">审核类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium">医疗机构</th>
              <th className="px-4 py-3 text-left text-sm font-medium">申报金额</th>
              <th className="px-4 py-3 text-left text-sm font-medium">风险等级</th>
              <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredData.map((item) => (
              <tr key={item.id} className={`hover:bg-gray-50 ${selectedItems.includes(item.id) ? 'bg-cyan-50' : ''}`}>
                {batchMode && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleItemSelect(item.id)}
                      className="rounded"
                    />
                  </td>
                )}
                <td className="px-4 py-3 font-medium text-cyan-700">{item.id}</td>
                <td className="px-4 py-3">{item.applicant}</td>
                <td className="px-4 py-3">{item.city}</td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3">{item.hospital}</td>
                <td className="px-4 py-3 font-medium text-cyan-600">￥{item.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{getRiskBadge(item.riskLevel)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleItemSelect(item.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-cyan-600 hover:bg-cyan-50"
                  >
                    <Eye className="h-4 w-4" />
                    查看
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
