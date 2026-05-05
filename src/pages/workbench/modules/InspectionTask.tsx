import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, X, Play, RotateCcw, Search, CheckCircle } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  institution: string;
  city: string;
  type: string;
  date: string;
  assignee: string;
  status: 'pending' | 'processing' | 'completed';
  description: string;
  focus: string;
}

const initialTasks: Task[] = [
  { id: 'IT320001', name: '南京市三级医院高值耗材专项稽核', institution: '江苏省人民医院', city: '南京', type: '专项稽核', date: '2026-05-08', assignee: '周岚', status: 'processing', description: '抽查骨科、心内科高值耗材采购、授权、收费和医保结算一致性。', focus: '高值耗材目录、授权单、收费明细' },
  { id: 'IT320002', name: '苏州双通道药店处方流转检查', institution: '苏州雷允上双通道药房', city: '苏州', type: '飞行检查', date: '2026-05-09', assignee: '陆敏', status: 'pending', description: '核验双通道处方流转、审方留痕和医保结算一致性。', focus: '处方流转编号、审方记录、购药周期' },
  { id: 'IT320003', name: '无锡门诊慢特病待遇执行核查', institution: '无锡市人民医院', city: '无锡', type: '日常巡查', date: '2026-05-10', assignee: '钱莉', status: 'pending', description: '抽核门诊慢特病备案、用药目录和统筹支付比例。', focus: '慢特病备案、目录内外费用、支付比例' },
  { id: 'IT320004', name: '徐州住院病案首页与结算清单比对', institution: '徐州市中心医院', city: '徐州', type: '专项稽核', date: '2026-05-11', assignee: '赵静', status: 'completed', description: '重点检查住院诊断、手术编码与医保结算清单匹配情况。', focus: '病案首页、手术编码、费用清单' },
  { id: 'IT320005', name: '常州医疗服务价格执行检查', institution: '常州市第二人民医院', city: '常州', type: '专项稽核', date: '2026-05-12', assignee: '蒋雯', status: 'processing', description: '核查价格项目执行、拆分收费和重复收费问题。', focus: '收费项目、价格标准、重复收费' },
  { id: 'IT320006', name: '南通生育待遇专项检查', institution: '南通大学附属医院', city: '南通', type: '专项稽核', date: '2026-05-12', assignee: '高宁', status: 'pending', description: '检查生育住院包干、产检归集和待遇支付口径。', focus: '产检费用、生育包干、住院结算' },
  { id: 'IT320007', name: '连云港异地就医结算抽查', institution: '连云港市第一人民医院', city: '连云港', type: '日常巡查', date: '2026-05-13', assignee: '韩雪', status: 'pending', description: '抽核异地备案、转诊手续和住院结算规则。', focus: '异地备案、转诊单、住院明细' },
  { id: 'IT320008', name: '淮安康复项目频次稽核', institution: '淮安市第一人民医院', city: '淮安', type: '专项稽核', date: '2026-05-13', assignee: '严峰', status: 'processing', description: '检查康复治疗频次、住院指征和支付上限执行。', focus: '康复项目频次、住院天数、支付规则' },
  { id: 'IT320009', name: '盐城门诊统筹药品目录核查', institution: '盐城市第三人民医院', city: '盐城', type: '日常巡查', date: '2026-05-14', assignee: '曹颖', status: 'pending', description: '抽核门诊统筹药品目录执行和目录外项目收费。', focus: '药品目录、目录外收费、统筹支付' },
  { id: 'IT320010', name: '扬州双通道特药登记专项核查', institution: '扬州大学附属医院', city: '扬州', type: '专项稽核', date: '2026-05-14', assignee: '邱琳', status: 'completed', description: '核查特药登记、购药周期和药店回传数据。', focus: '特药登记、双通道药店、回传台账' },
  { id: 'IT320011', name: '镇江骨科耗材专项复核', institution: '镇江市第一人民医院', city: '镇江', type: '飞行检查', date: '2026-05-15', assignee: '唐璐', status: 'pending', description: '对膝关节、脊柱类高值耗材授权和收费做突击抽查。', focus: '授权审批、耗材领用、收费凭证' },
  { id: 'IT320012', name: '泰州门诊统筹诊疗项目检查', institution: '泰州市人民医院', city: '泰州', type: '日常巡查', date: '2026-05-15', assignee: '贺倩', status: 'processing', description: '核查门诊统筹诊疗项目目录、频次和收费口径。', focus: '诊疗项目目录、频次、收费标准' },
];

const institutions = initialTasks.map((item) => item.institution);
const types = ['专项稽核', '飞行检查', '日常巡查'];

export default function InspectionTask({ onBack }: { onBack: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [formData, setFormData] = useState({ name: '', institution: '', city: '', type: '', date: '', assignee: '', description: '', focus: '' });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [toast, setToast] = useState('');
  const [keyword, setKeyword] = useState('');

  const filteredTasks = useMemo(
    () => tasks.filter((item) => [item.id, item.name, item.institution, item.city, item.assignee].some((field) => field.includes(keyword))),
    [tasks, keyword],
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.institution || !formData.type || !formData.date || !formData.assignee) {
      showToast('请填写完整任务信息');
      return;
    }
    const newTask: Task = {
      id: `IT${String(tasks.length + 320001).slice(-6)}`,
      ...formData,
      status: 'pending',
    };
    setTasks([newTask, ...tasks]);
    setShowForm(false);
    setFormData({ name: '', institution: '', city: '', type: '', date: '', assignee: '', description: '', focus: '' });
    showToast('任务创建成功');
  };

  const updateStatus = (id: string, status: Task['status']) => {
    setTasks((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    showToast('任务状态已更新');
  };

  const getStatusBadge = (status: Task['status']) => {
    const styles = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' };
    const labels = { pending: '待处理', processing: '进行中', completed: '已完成' };
    return <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg p-2 hover:bg-gray-100"><ArrowLeft className="h-5 w-5" /></button>
          <h3 className="text-xl font-bold">稽核任务</h3>
        </div>
        <button onClick={() => setShowForm(true)} className="rounded-lg bg-cyan-600 px-4 py-2 text-white">创建任务</button>
      </div>

      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="fixed right-4 top-4 z-50 rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg">
          {toast}
        </motion.div>
      )}

      {showForm ? (
        <div className="space-y-4 rounded-xl bg-gray-50 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-sm font-medium">任务名称</label><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border px-3 py-2" placeholder="请输入任务名称" /></div>
            <div><label className="mb-1 block text-sm font-medium">稽核机构</label><select value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value, city: initialTasks.find((item) => item.institution === e.target.value)?.city || '' })} className="w-full rounded-lg border px-3 py-2"><option value="">选择机构</option>{institutions.map((item) => <option key={item}>{item}</option>)}</select></div>
            <div><label className="mb-1 block text-sm font-medium">稽核类型</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full rounded-lg border px-3 py-2"><option value="">选择类型</option>{types.map((item) => <option key={item}>{item}</option>)}</select></div>
            <div><label className="mb-1 block text-sm font-medium">计划日期</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full rounded-lg border px-3 py-2" /></div>
            <div><label className="mb-1 block text-sm font-medium">负责人</label><input value={formData.assignee} onChange={(e) => setFormData({ ...formData, assignee: e.target.value })} className="w-full rounded-lg border px-3 py-2" placeholder="请输入负责人" /></div>
            <div><label className="mb-1 block text-sm font-medium">核查重点</label><input value={formData.focus} onChange={(e) => setFormData({ ...formData, focus: e.target.value })} className="w-full rounded-lg border px-3 py-2" placeholder="请输入核查重点" /></div>
            <div className="col-span-2"><label className="mb-1 block text-sm font-medium">任务描述</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-lg border px-3 py-2" rows={3} placeholder="请输入任务描述" /></div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className="rounded-lg border px-4 py-2">取消</button>
            <button onClick={handleSubmit} className="rounded-lg bg-cyan-600 px-4 py-2 text-white">创建</button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-white">
          <div className="border-b p-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full rounded-lg border py-2 pl-10 pr-4" placeholder="搜索单号、任务名、机构、负责人" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm">任务名称</th><th className="px-4 py-3 text-left text-sm">机构</th><th className="px-4 py-3 text-left text-sm">地市</th><th className="px-4 py-3 text-left text-sm">类型</th><th className="px-4 py-3 text-left text-sm">日期</th><th className="px-4 py-3 text-left text-sm">负责人</th><th className="px-4 py-3 text-left text-sm">状态</th><th className="px-4 py-3 text-right text-sm">操作</th></tr></thead>
              <tbody className="divide-y">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{task.name}</td>
                    <td className="px-4 py-3">{task.institution}</td>
                    <td className="px-4 py-3">{task.city}</td>
                    <td className="px-4 py-3">{task.type}</td>
                    <td className="px-4 py-3">{task.date}</td>
                    <td className="px-4 py-3">{task.assignee}</td>
                    <td className="px-4 py-3">{getStatusBadge(task.status)}</td>
                    <td className="px-4 py-3 text-right"><button onClick={() => setSelectedTask(task)} className="rounded p-2 text-cyan-600 hover:bg-cyan-50"><Eye className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedTask && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-xl bg-white">
              <div className="flex items-center justify-between border-b p-6">
                <h4 className="text-lg font-bold">任务详情</h4>
                <button onClick={() => setSelectedTask(null)} className="rounded p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">任务编号：</span>{selectedTask.id}</div>
                  <div><span className="text-gray-500">任务名称：</span>{selectedTask.name}</div>
                  <div><span className="text-gray-500">稽核机构：</span>{selectedTask.institution}</div>
                  <div><span className="text-gray-500">参保地市：</span>{selectedTask.city}</div>
                  <div><span className="text-gray-500">稽核类型：</span>{selectedTask.type}</div>
                  <div><span className="text-gray-500">计划日期：</span>{selectedTask.date}</div>
                  <div><span className="text-gray-500">负责人：</span>{selectedTask.assignee}</div>
                  <div><span className="text-gray-500">当前状态：</span>{getStatusBadge(selectedTask.status)}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4 text-sm">
                  <div className="mb-1 font-medium">任务描述</div>
                  <div className="text-gray-700">{selectedTask.description}</div>
                </div>
                <div className="rounded-lg bg-blue-50 p-4 text-sm">
                  <div className="mb-1 font-medium">核查重点</div>
                  <div className="text-gray-700">{selectedTask.focus}</div>
                </div>
                <div className="flex gap-2 border-t pt-4">
                  {selectedTask.status === 'pending' && <button onClick={() => { updateStatus(selectedTask.id, 'processing'); setSelectedTask(null); }} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-600 py-2 text-white"><Play className="h-4 w-4" />开始处理</button>}
                  {selectedTask.status === 'processing' && <button onClick={() => { updateStatus(selectedTask.id, 'completed'); setSelectedTask(null); }} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-600 py-2 text-white"><CheckCircle className="h-4 w-4" />完成任务</button>}
                  {selectedTask.status === 'completed' && <button onClick={() => { updateStatus(selectedTask.id, 'pending'); setSelectedTask(null); }} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gray-600 py-2 text-white"><RotateCcw className="h-4 w-4" />重新打开</button>}
                  <button onClick={() => setSelectedTask(null)} className="rounded-lg border px-4 py-2">关闭</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
