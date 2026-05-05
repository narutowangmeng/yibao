import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Eye, Search, AlertTriangle } from 'lucide-react';

interface AuditItem {
  id: string;
  applicant: string;
  type: string;
  amount: number;
  region: string;
  hospital: string;
  diagnosis: string;
  submitTime: string;
  status: 'pending';
  hasException: boolean;
  batchTag: string;
}

const seeds = [
  ['南京', '陈思远', '门诊慢特病审核', 1260, '江苏省人民医院', '高血压伴睡眠障碍', '2026-05-01 09:20', false, '门慢批次-01'],
  ['无锡', '顾雨晴', '住院报销审核', 14820, '无锡市人民医院', '胆囊结石伴急性胆囊炎', '2026-05-01 09:45', true, '住院批次-03'],
  ['徐州', '王子杭', '双通道购药审核', 3920, '徐州医科大学附属医院', '类风湿关节炎', '2026-05-01 10:10', false, '双通道批次-02'],
  ['常州', '沈佳宁', '门诊统筹审核', 540, '常州市第二人民医院', '上呼吸道感染', '2026-05-01 10:38', false, '门统批次-07'],
  ['苏州', '陆书宁', '异地就医审核', 18600, '上海瑞金医院', '腰椎间盘突出', '2026-05-01 11:05', true, '异地批次-04'],
  ['南通', '许文卿', '生育报销审核', 12840, '南通大学附属医院', '剖宫产分娩', '2026-05-01 11:36', false, '生育批次-01'],
  ['连云港', '孙明轩', '住院报销审核', 16450, '连云港市第一人民医院', '脑梗死恢复期', '2026-05-01 12:00', true, '住院批次-05'],
  ['淮安', '丁晓莹', '门诊慢特病审核', 2210, '淮安市第一人民医院', '糖尿病并周围神经病变', '2026-05-01 13:18', true, '门慢批次-02'],
  ['盐城', '何嘉悦', '特殊药品审核', 5680, '盐城市第三人民医院', '强直性脊柱炎', '2026-05-01 13:46', false, '特药批次-01'],
  ['扬州', '郭天宇', '双通道购药审核', 4580, '扬州大学附属医院', '银屑病', '2026-05-01 14:08', true, '双通道批次-05'],
  ['镇江', '宋知言', '住院报销审核', 12740, '镇江市第一人民医院', '膝关节半月板损伤', '2026-05-01 14:32', true, '住院批次-07'],
  ['泰州', '林若溪', '门诊统筹审核', 430, '泰州市人民医院', '慢性胃炎', '2026-05-01 15:02', false, '门统批次-09'],
  ['宿迁', '袁晨浩', '异地就医审核', 21460, '南京鼓楼医院', '恶性肿瘤术后化疗', '2026-05-01 15:28', true, '异地批次-08'],
  ['南京', '蒋安琪', '住院报销审核', 8360, '南京市第一医院', '泌尿系结石', '2026-05-01 15:52', false, '住院批次-10'],
  ['无锡', '郑博文', '门诊慢特病审核', 2480, '无锡市第二人民医院', '甲状腺功能减退', '2026-05-01 16:15', false, '门慢批次-06'],
  ['徐州', '陶诗雨', '特殊药品审核', 7820, '徐州市中心医院', '乳腺恶性肿瘤术后辅助治疗', '2026-05-01 16:34', true, '特药批次-04'],
  ['常州', '彭书远', '异地就医审核', 11860, '上海第六人民医院', '膝骨关节炎', '2026-05-01 16:56', false, '异地批次-09'],
  ['苏州', '周辰逸', '住院报销审核', 19640, '苏州市立医院', '冠心病支架植入术后', '2026-05-01 17:12', true, '住院批次-11'],
  ['南通', '孟知夏', '门诊统筹审核', 620, '南通市第一人民医院', '支气管炎', '2026-05-01 17:35', false, '门统批次-12'],
  ['宿迁', '贺嘉颖', '双通道购药审核', 6320, '宿迁市第一人民医院', '系统性红斑狼疮', '2026-05-01 17:52', true, '双通道批次-08'],
];

const mockData: AuditItem[] = seeds.map((item, index) => ({
  id: `BA320${(index + 1).toString().padStart(3, '0')}`,
  region: item[0],
  applicant: item[1],
  type: item[2],
  amount: item[3] as number,
  hospital: item[4],
  diagnosis: item[5],
  submitTime: item[6],
  hasException: item[7] as boolean,
  batchTag: item[8],
  status: 'pending',
}));

export default function BatchAudit({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState<AuditItem[]>(mockData);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: '', region: '' });
  const [selectedDetail, setSelectedDetail] = useState<AuditItem | null>(null);
  const [toast, setToast] = useState('');

  const filteredData = useMemo(() => {
    return rows.filter((item) => {
      if (searchTerm && ![item.applicant, item.id, item.hospital, item.diagnosis].some((field) => field.includes(searchTerm))) return false;
      if (filters.type && item.type !== filters.type) return false;
      if (filters.region && item.region !== filters.region) return false;
      return true;
    });
  }, [rows, searchTerm, filters]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedItems(next);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredData.length) setSelectedItems(new Set());
    else setSelectedItems(new Set(filteredData.map((item) => item.id)));
  };

  const handleBatchAction = (action: 'approve' | 'reject') => {
    if (selectedItems.size === 0) {
      setToast('请先勾选批量处理数据');
      setTimeout(() => setToast(''), 1600);
      return;
    }
    setRows((prev) => prev.filter((item) => !selectedItems.has(item.id)));
    setToast(action === 'approve' ? `已批量通过 ${selectedItems.size} 条` : `已批量驳回 ${selectedItems.size} 条`);
    setSelectedItems(new Set());
    setTimeout(() => setToast(''), 1600);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100"><ArrowLeft className="h-5 w-5" /></button>
          <h3 className="text-xl font-bold">批量审核</h3>
        </div>
        <span className="text-sm text-gray-500">待审核 {filteredData.length} 笔</span>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 rounded-lg bg-green-100 p-3 text-center text-green-700">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-4 flex gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="搜索姓名、单号、医院、病种" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-lg border py-2 pl-10 pr-4" />
        </div>
        <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))} className="rounded-lg border px-3 py-2">
          <option value="">全部类型</option>
          <option>门诊慢特病审核</option>
          <option>住院报销审核</option>
          <option>异地就医审核</option>
          <option>双通道购药审核</option>
          <option>门诊统筹审核</option>
          <option>特殊药品审核</option>
          <option>生育报销审核</option>
        </select>
        <select value={filters.region} onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))} className="rounded-lg border px-3 py-2">
          <option value="">全部地市</option>
          {['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'].map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[980px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left"><input type="checkbox" checked={selectedItems.size === filteredData.length && filteredData.length > 0} onChange={toggleSelectAll} /></th>
              <th className="px-4 py-3 text-left text-sm">单号</th>
              <th className="px-4 py-3 text-left text-sm">申请人</th>
              <th className="px-4 py-3 text-left text-sm">地市</th>
              <th className="px-4 py-3 text-left text-sm">审核类型</th>
              <th className="px-4 py-3 text-left text-sm">申报金额</th>
              <th className="px-4 py-3 text-left text-sm">异常标记</th>
              <th className="px-4 py-3 text-right text-sm">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><input type="checkbox" checked={selectedItems.has(item.id)} onChange={() => toggleSelect(item.id)} /></td>
                <td className="px-4 py-3 font-medium text-cyan-700">{item.id}</td>
                <td className="px-4 py-3">{item.applicant}</td>
                <td className="px-4 py-3">{item.region}</td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3 font-medium">￥{item.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.hasException ? <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs text-red-600"><AlertTriangle className="h-3 w-3" />重点复核</span> : <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-600">常规</span>}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setSelectedDetail(item)} className="rounded-lg p-2 text-cyan-600 hover:bg-cyan-50"><Eye className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedItems.size > 0 && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <span className="text-sm">已选择 {selectedItems.size} 条记录</span>
          <div className="flex gap-2">
            <button onClick={() => handleBatchAction('reject')} className="rounded-lg border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50">批量驳回</button>
            <button onClick={() => handleBatchAction('approve')} className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">批量通过</button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedDetail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedDetail(null)}>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }} className="w-full max-w-2xl rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-bold">批量审核详情</h4>
                <button onClick={() => setSelectedDetail(null)} className="rounded p-2 hover:bg-gray-100"><XCircle className="h-5 w-5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-gray-50 p-3"><div className="text-gray-500">单号</div><div className="mt-1 font-medium">{selectedDetail.id}</div></div>
                <div className="rounded-lg bg-gray-50 p-3"><div className="text-gray-500">批次标签</div><div className="mt-1 font-medium">{selectedDetail.batchTag}</div></div>
                <div className="rounded-lg bg-gray-50 p-3"><div className="text-gray-500">申请人 / 地市</div><div className="mt-1 font-medium">{selectedDetail.applicant} / {selectedDetail.region}</div></div>
                <div className="rounded-lg bg-gray-50 p-3"><div className="text-gray-500">审核类型</div><div className="mt-1 font-medium">{selectedDetail.type}</div></div>
                <div className="rounded-lg bg-gray-50 p-3"><div className="text-gray-500">医疗机构</div><div className="mt-1 font-medium">{selectedDetail.hospital}</div></div>
                <div className="rounded-lg bg-gray-50 p-3"><div className="text-gray-500">申报金额</div><div className="mt-1 font-medium text-cyan-700">￥{selectedDetail.amount.toLocaleString()}</div></div>
                <div className="col-span-2 rounded-lg bg-red-50 p-3"><div className="text-gray-500">病种 / 疑点</div><div className="mt-1 font-medium">{selectedDetail.diagnosis}{selectedDetail.hasException ? '，存在规则命中，需人工复核' : '，未命中重点规则，可纳入批量处理'}</div></div>
                <div className="col-span-2 rounded-lg bg-blue-50 p-3"><div className="text-gray-500">提交时间</div><div className="mt-1 font-medium">{selectedDetail.submitTime}</div></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
