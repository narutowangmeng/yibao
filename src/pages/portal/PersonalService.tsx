import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CreditCard, Users, Globe, Calculator, MessageSquare, Clock, X, Plus, Trash2, Eye } from 'lucide-react';

const tabs = [
  { id: 'rights', label: '权益记录', icon: User },
  { id: 'card', label: '电子凭证', icon: CreditCard },
  { id: 'family', label: '家庭共济', icon: Users },
  { id: 'remote', label: '异地就医', icon: Globe },
  { id: 'progress', label: '报销进度', icon: Clock },
  { id: 'calc', label: '待遇测算', icon: Calculator },
  { id: 'feedback', label: '投诉建议', icon: MessageSquare },
];

interface FamilyMember {
  id: string;
  name: string;
  idCard: string;
  relation: string;
  phone: string;
  insuranceType: string;
  sharedLimit: string;
  status: string;
  bindingDate: string;
  area: string;
}

interface RemoteRecord {
  id: string;
  city: string;
  institution: string;
  type: string;
  startDate: string;
  endDate: string;
  filingChannel: string;
  contactPhone: string;
  status: '有效' | '审核中' | '已失效';
}

interface FeedbackItem {
  id: string;
  type: string;
  content: string;
  status: string;
  date: string;
  replyDept: string;
  reply?: string;
}

interface ProgressItem {
  id: string;
  type: string;
  billCount: number;
  totalAmount: number;
  reimbursementAmount: number;
  selfPayAmount: number;
  status: string;
  date: string;
  hospital: string;
  acceptAgency: string;
  submitChannel: string;
}

const benefitCards = [
  { label: '个人账户余额', value: '12,560.38元', tone: 'text-cyan-600' },
  { label: '本年门诊统筹已报', value: '4,286.50元', tone: 'text-blue-600' },
  { label: '年度住院待遇次数', value: '2次', tone: 'text-emerald-600' },
  { label: '大病保险累计支付', value: '18,420.00元', tone: 'text-violet-600' },
];

const rightsProfile = [
  { label: '姓名', value: '陈思远' },
  { label: '身份证号', value: '320102198903152415' },
  { label: '医保电子凭证号', value: '320100198903152415000128' },
  { label: '参保地', value: '南京市玄武区' },
  { label: '参保身份', value: '城镇职工' },
  { label: '参保险种', value: '职工基本医疗保险、大病医疗保险' },
  { label: '参保状态', value: '正常参保' },
  { label: '参保单位', value: '南京华宁科技有限公司' },
  { label: '单位统一社会信用代码', value: '91320102MA27HY8L4P' },
  { label: '连续缴费年限', value: '8年4个月' },
  { label: '个人账户年度划入', value: '5,280.00元' },
  { label: '门诊慢特病资格', value: '高血压、糖尿病门特在享' },
];

const rightsRecords = [
  { period: '2026年04月', category: '职工医保缴费', detail: '单位缴费 + 个人缴费到账', amount: '1,268.40元', status: '已到账' },
  { period: '2026年04月', category: '门诊统筹待遇', detail: '南京市第一医院普通门诊统筹', amount: '286.50元', status: '已结算' },
  { period: '2026年03月', category: '慢特病待遇', detail: '鼓楼医院高血压门特结算', amount: '1,126.00元', status: '已结算' },
  { period: '2026年03月', category: '个人账户划入', detail: '月度个人账户划入', amount: '440.00元', status: '已入账' },
  { period: '2026年02月', category: '住院报销', detail: '江苏省人民医院住院费用结算', amount: '12,860.00元', status: '已结算' },
  { period: '2026年01月', category: '大病保险支付', detail: '住院高额费用大病二次支付', amount: '5,560.00元', status: '已支付' },
];

const cardInfo = [
  { label: '姓名', value: '陈思远' },
  { label: '证件号码', value: '320102198903152415' },
  { label: '医保电子凭证状态', value: '已激活' },
  { label: '申领渠道', value: '江苏医保云' },
  { label: '签发机构', value: '南京市医疗保障局' },
  { label: '关联手机', value: '13851760011' },
  { label: '凭证使用地区', value: '江苏省通用' },
  { label: '最近使用时间', value: '2026-04-26 09:12' },
];

const initialFamilyMembers: FamilyMember[] = [
  {
    id: 'F001',
    name: '周语彤',
    idCard: '320102199407263526',
    relation: '配偶',
    phone: '13915230027',
    insuranceType: '城乡居民基本医疗保险',
    sharedLimit: '5,000.00元/年',
    status: '已绑定',
    bindingDate: '2026-03-08',
    area: '南京市建邺区',
  },
  {
    id: 'F002',
    name: '陈知远',
    idCard: '320102201510146218',
    relation: '子女',
    phone: '13851760011',
    insuranceType: '学生居民医保',
    sharedLimit: '3,000.00元/年',
    status: '已绑定',
    bindingDate: '2026-03-10',
    area: '南京市玄武区',
  },
];

const initialRemoteRecords: RemoteRecord[] = [
  {
    id: 'YD001',
    city: '上海市',
    institution: '复旦大学附属中山医院',
    type: '异地转诊备案',
    startDate: '2026-04-18',
    endDate: '2026-05-18',
    filingChannel: '江苏医保云',
    contactPhone: '13851760011',
    status: '有效',
  },
  {
    id: 'YD002',
    city: '北京市',
    institution: '北京协和医院',
    type: '长期异地居住备案',
    startDate: '2025-12-01',
    endDate: '2026-11-30',
    filingChannel: '个人服务大厅',
    contactPhone: '13851760011',
    status: '有效',
  },
];

const initialFeedbacks: FeedbackItem[] = [
  {
    id: 'TS001',
    type: '服务建议',
    content: '建议在门慢备案结果中增加定点医院变更记录展示。',
    status: '已回复',
    date: '2026-04-12',
    replyDept: '南京市医保中心经办服务科',
    reply: '已纳入个人服务大厅优化计划，后续版本将补充门慢备案历史记录展示。',
  },
  {
    id: 'TS002',
    type: '业务咨询',
    content: '咨询异地住院备案后是否还需要在医院端重复登记。',
    status: '处理中',
    date: '2026-04-22',
    replyDept: '江苏省医保异地就医服务专班',
  },
];

const initialProgressData: ProgressItem[] = [
  {
    id: 'BX001',
    type: '门诊报销',
    billCount: 3,
    totalAmount: 1286.5,
    reimbursementAmount: 786.2,
    selfPayAmount: 500.3,
    status: '审核中',
    date: '2026-04-20',
    hospital: '南京市第一医院',
    acceptAgency: '南京市医保中心玄武分中心',
    submitChannel: '个人服务大厅',
  },
  {
    id: 'BX002',
    type: '住院报销',
    billCount: 5,
    totalAmount: 36842.0,
    reimbursementAmount: 22116.8,
    selfPayAmount: 14725.2,
    status: '待拨付',
    date: '2026-04-11',
    hospital: '江苏省人民医院',
    acceptAgency: '南京市医保中心住院待遇科',
    submitChannel: '线下窗口',
  },
  {
    id: 'BX003',
    type: '异地报销',
    billCount: 2,
    totalAmount: 8420.0,
    reimbursementAmount: 5186.0,
    selfPayAmount: 3234.0,
    status: '已办结',
    date: '2026-03-28',
    hospital: '复旦大学附属中山医院',
    acceptAgency: '江苏省异地就医结算中心',
    submitChannel: '江苏医保云',
  },
];

export default function PersonalService() {
  const [activeTab, setActiveTab] = useState('rights');
  const [rating, setRating] = useState(5);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [remoteRecords, setRemoteRecords] = useState<RemoteRecord[]>(initialRemoteRecords);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(initialFeedbacks);
  const [progressData] = useState<ProgressItem[]>(initialProgressData);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentItem, setCurrentItem] = useState<FamilyMember | ProgressItem | null>(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    idCard: '',
    relation: '配偶',
    phone: '',
    location: '上海市',
    institution: '复旦大学附属中山医院',
    type: '异地转诊备案',
    content: '',
    date: '',
    endDate: '',
  });

  const totalSharedLimit = useMemo(
    () =>
      familyMembers
        .map((item) => Number(item.sharedLimit.replace(/[^\d.]/g, '')) || 0)
        .reduce((sum, value) => sum + value, 0)
        .toFixed(2),
    [familyMembers]
  );

  const handleAddFamily = () => {
    setModalType('addFamily');
    setFormData((current) => ({ ...current, name: '', idCard: '', relation: '配偶', phone: '' }));
    setShowModal(true);
  };

  const handleDeleteFamily = (id: string) => {
    setFamilyMembers(familyMembers.filter((member) => member.id !== id));
  };

  const handleSubmitFamily = () => {
    if (!formData.name.trim() || !formData.idCard.trim()) {
      setMessage('姓名和身份证号不能为空');
      return;
    }

    setFamilyMembers((current) => [
      ...current,
      {
        id: `F${String(current.length + 1).padStart(3, '0')}`,
        name: formData.name.trim(),
        idCard: formData.idCard.trim(),
        relation: formData.relation,
        phone: formData.phone.trim() || '未登记',
        insuranceType: formData.relation === '子女' ? '学生居民医保' : '城乡居民基本医疗保险',
        sharedLimit: formData.relation === '子女' ? '3,000.00元/年' : '5,000.00元/年',
        status: '已绑定',
        bindingDate: new Date().toISOString().slice(0, 10),
        area: '南京市玄武区',
      },
    ]);
    setShowModal(false);
  };

  const handleViewFamily = (member: FamilyMember) => {
    setCurrentItem(member);
    setModalType('viewFamily');
    setShowModal(true);
  };

  const handleSubmitRemote = () => {
    setRemoteRecords((current) => [
      {
        id: `YD${String(current.length + 1).padStart(3, '0')}`,
        city: formData.location,
        institution: formData.institution,
        type: formData.type,
        startDate: formData.date,
        endDate: formData.endDate,
        filingChannel: '个人服务大厅',
        contactPhone: '13851760011',
        status: '审核中',
      },
      ...current,
    ]);
  };

  const handleSubmitFeedback = () => {
    if (!formData.content.trim()) {
      setMessage('请输入投诉建议内容');
      return;
    }
    setFeedbacks((current) => [
      {
        id: `TS${String(current.length + 1).padStart(3, '0')}`,
        type: '服务建议',
        content: formData.content.trim(),
        status: '待受理',
        date: new Date().toISOString().slice(0, 10),
        replyDept: '南京市医保中心综合服务科',
      },
      ...current,
    ]);
    setFormData((current) => ({ ...current, content: '' }));
    setMessage('建议已提交');
  };

  const handleViewProgress = (item: ProgressItem) => {
    setCurrentItem(item);
    setModalType('viewProgress');
    setShowModal(true);
  };

  const estimatedResult = useMemo(() => {
    const baseAmount = 5000;
    const ratio = activeTab === 'calc' ? 0.72 : 0;
    return {
      total: baseAmount.toFixed(2),
      reimbursed: (baseAmount * ratio).toFixed(2),
      selfPay: (baseAmount * (1 - ratio)).toFixed(2),
    };
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'rights':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {benefitCards.map((card) => (
                <div key={card.label} className="rounded-xl border bg-white p-5">
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className={`mt-3 text-2xl font-bold ${card.tone}`}>{card.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border bg-white p-5">
              <h3 className="text-base font-semibold text-gray-800">个人参保权益信息</h3>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                {rightsProfile.map((item) => (
                  <div key={item.label} className="rounded-lg bg-gray-50 p-4">
                    <p className="text-gray-500">{item.label}</p>
                    <p className="mt-2 font-medium text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border bg-white">
              <div className="border-b px-5 py-4">
                <h3 className="text-base font-semibold text-gray-800">近期权益记录</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">期间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">业务类别</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">业务说明</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">金额</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {rightsRecords.map((record) => (
                    <tr key={`${record.period}-${record.category}`} className="border-t">
                      <td className="px-4 py-3 text-sm">{record.period}</td>
                      <td className="px-4 py-3 text-sm">{record.category}</td>
                      <td className="px-4 py-3 text-sm">{record.detail}</td>
                      <td className="px-4 py-3 text-sm font-medium text-cyan-600">{record.amount}</td>
                      <td className="px-4 py-3 text-sm">{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'card':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border bg-white p-6">
              <div className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">
                <p className="text-sm opacity-80">江苏省医保电子凭证</p>
                <p className="mt-2 text-2xl font-bold">陈思远</p>
                <p className="mt-1 text-sm">医保电子凭证号：320100198903152415000128</p>
                <p className="mt-1 text-sm">参保地：南京市玄武区</p>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs opacity-80">身份证号</p>
                    <p className="mt-1 text-base">320102198903152415</p>
                  </div>
                  <div className="rounded-lg bg-white/20 px-4 py-3 text-center text-xs">
                    <div className="h-16 w-16 rounded bg-white/80" />
                    <p className="mt-2">扫码就医购药</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-5">
              <h3 className="text-base font-semibold text-gray-800">凭证信息</h3>
              <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                {cardInfo.map((item) => (
                  <div key={item.label} className="rounded-lg bg-gray-50 p-4">
                    <p className="text-gray-500">{item.label}</p>
                    <p className="mt-2 font-medium text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'family':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border bg-white p-5">
                <p className="text-sm text-gray-500">已绑定家庭成员</p>
                <p className="mt-3 text-2xl font-bold text-gray-800">{familyMembers.length}人</p>
              </div>
              <div className="rounded-xl border bg-white p-5">
                <p className="text-sm text-gray-500">年度共济总额度</p>
                <p className="mt-3 text-2xl font-bold text-cyan-600">{totalSharedLimit}元</p>
              </div>
              <div className="rounded-xl border bg-white p-5">
                <p className="text-sm text-gray-500">当前可用共济余额</p>
                <p className="mt-3 text-2xl font-bold text-emerald-600">6,820.00元</p>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium text-gray-800">家庭共济成员</h3>
                <button onClick={handleAddFamily} className="flex items-center gap-1 rounded bg-cyan-600 px-3 py-1 text-sm text-white">
                  <Plus className="h-4 w-4" />
                  添加成员
                </button>
              </div>
              <div className="space-y-2">
                {familyMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded bg-gray-50 p-4">
                    <div className="grid flex-1 grid-cols-5 gap-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-800">{member.name}</p>
                        <p className="mt-1 text-gray-500">{member.relation}</p>
                      </div>
                      <div>{member.idCard}</div>
                      <div>{member.insuranceType}</div>
                      <div>{member.sharedLimit}</div>
                      <div>{member.status}</div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <button onClick={() => handleViewFamily(member)} className="rounded p-1 text-cyan-600 hover:bg-cyan-50">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteFamily(member.id)} className="rounded p-1 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'remote':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border bg-white p-4">
              <h3 className="font-medium text-gray-800">异地就医备案申请</h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">就医地</label>
                  <select className="mt-1 w-full rounded border p-2" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}>
                    <option>上海市</option>
                    <option>北京市</option>
                    <option>广州市</option>
                    <option>杭州市</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">备案类型</label>
                  <select className="mt-1 w-full rounded border p-2" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option>异地转诊备案</option>
                    <option>长期异地居住备案</option>
                    <option>临时外出就医备案</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">拟就医机构</label>
                  <input className="mt-1 w-full rounded border p-2" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600">开始日期</label>
                  <input type="date" className="mt-1 w-full rounded border p-2" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-600">结束日期</label>
                  <input type="date" className="mt-1 w-full rounded border p-2" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>
              <button onClick={handleSubmitRemote} className="mt-4 rounded bg-cyan-600 px-4 py-2 text-white">
                提交备案
              </button>
            </div>
            <div className="rounded-xl border bg-white">
              <div className="border-b px-4 py-4">
                <h3 className="font-medium text-gray-800">我的备案记录</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">备案编号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">就医地</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">就医机构</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">备案类型</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">备案时间</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {remoteRecords.map((record) => (
                    <tr key={record.id} className="border-t">
                      <td className="px-4 py-3 text-sm">{record.id}</td>
                      <td className="px-4 py-3 text-sm">{record.city}</td>
                      <td className="px-4 py-3 text-sm">{record.institution}</td>
                      <td className="px-4 py-3 text-sm">{record.type}</td>
                      <td className="px-4 py-3 text-sm">{record.startDate} 至 {record.endDate}</td>
                      <td className="px-4 py-3 text-sm">{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'progress':
        return (
          <div className="rounded-xl border bg-white">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">报销编号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">报销类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">票据数</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">费用总额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">拟报销金额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">受理机构</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody>
                {progressData.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3 text-sm">{item.id}</td>
                    <td className="px-4 py-3 text-sm">{item.type}</td>
                    <td className="px-4 py-3 text-sm">{item.billCount}张</td>
                    <td className="px-4 py-3 text-sm">{item.totalAmount.toLocaleString()}元</td>
                    <td className="px-4 py-3 text-sm text-cyan-600">{item.reimbursementAmount.toLocaleString()}元</td>
                    <td className="px-4 py-3 text-sm">{item.acceptAgency}</td>
                    <td className="px-4 py-3 text-sm">{item.status}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleViewProgress(item)} className="text-sm text-cyan-600">
                        查看
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'calc':
        return (
          <div className="rounded-xl border bg-white p-4">
            <h3 className="font-medium text-gray-800">待遇测算</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">就诊类型</label>
                <select className="mt-1 w-full rounded border p-2">
                  <option>住院报销</option>
                  <option>普通门诊</option>
                  <option>门诊慢特病</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">定点机构等级</label>
                <select className="mt-1 w-full rounded border p-2">
                  <option>三级医院</option>
                  <option>二级医院</option>
                  <option>社区医院</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">费用总额</label>
                <input type="number" defaultValue={5000} className="mt-1 w-full rounded border p-2" />
              </div>
              <div>
                <label className="text-sm text-gray-600">起付线情况</label>
                <select className="mt-1 w-full rounded border p-2">
                  <option>年度起付线已满足</option>
                  <option>需扣减本次起付线</option>
                </select>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">测算费用总额</p>
                <p className="mt-2 text-xl font-bold text-gray-800">{estimatedResult.total}元</p>
              </div>
              <div className="rounded-lg bg-cyan-50 p-4">
                <p className="text-sm text-cyan-700">预计基金支付</p>
                <p className="mt-2 text-xl font-bold text-cyan-600">{estimatedResult.reimbursed}元</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-sm text-amber-700">预计个人自付</p>
                <p className="mt-2 text-xl font-bold text-amber-600">{estimatedResult.selfPay}元</p>
              </div>
            </div>
          </div>
        );
      case 'feedback':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border bg-white p-4">
              <h3 className="font-medium text-gray-800">提交投诉建议</h3>
              <textarea
                className="mt-3 h-24 w-full rounded border p-2"
                placeholder="请输入您对个人服务大厅、异地备案、待遇结算或报销服务的建议"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
              <button onClick={handleSubmitFeedback} className="mt-3 rounded bg-cyan-600 px-4 py-2 text-white">
                提交
              </button>
            </div>
            <div className="rounded-xl border bg-white p-4">
              <h3 className="font-medium text-gray-800">服务满意度评价</h3>
              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map((item) => (
                  <button key={item} onClick={() => setRating(item)} className={`text-2xl ${rating >= item ? 'text-yellow-400' : 'text-gray-300'}`}>
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border bg-white">
              <div className="border-b p-4">
                <h3 className="font-medium text-gray-800">我的反馈记录</h3>
              </div>
              {feedbacks.map((item) => (
                <div key={item.id} className="border-t p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{item.type}</p>
                      <p className="mt-1 text-sm text-gray-600">{item.content}</p>
                    </div>
                    <span className="text-sm text-cyan-600">{item.status}</span>
                  </div>
                  <div className="mt-3 flex gap-6 text-xs text-gray-500">
                    <span>反馈时间：{item.date}</span>
                    <span>承办部门：{item.replyDept}</span>
                  </div>
                  {item.reply && <p className="mt-3 rounded bg-gray-50 p-3 text-sm text-gray-600">回复：{item.reply}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {message && <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-700">{message}</div>}
      <h2 className="text-xl font-bold text-gray-800">个人服务大厅</h2>
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-600'}`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {modalType === 'addFamily' ? '添加家庭成员' : modalType === 'viewFamily' ? '家庭成员详情' : '报销进度详情'}
              </h3>
              <button onClick={() => setShowModal(false)} className="rounded p-1 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalType === 'addFamily' ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">姓名</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">身份证号</label>
                  <input type="text" value={formData.idCard} onChange={(e) => setFormData({ ...formData, idCard: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">联系电话</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">关系</label>
                  <select value={formData.relation} onChange={(e) => setFormData({ ...formData, relation: e.target.value })} className="w-full rounded-lg border px-3 py-2">
                    <option>配偶</option>
                    <option>子女</option>
                    <option>父母</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2">
                    取消
                  </button>
                  <button onClick={handleSubmitFamily} className="rounded-lg bg-cyan-600 px-4 py-2 text-white">
                    添加
                  </button>
                </div>
              </div>
            ) : modalType === 'viewFamily' && currentItem ? (
              <div className="space-y-3 text-sm">
                {[
                  ['姓名', (currentItem as FamilyMember).name],
                  ['身份证号', (currentItem as FamilyMember).idCard],
                  ['关系', (currentItem as FamilyMember).relation],
                  ['联系电话', (currentItem as FamilyMember).phone],
                  ['参保险种', (currentItem as FamilyMember).insuranceType],
                  ['共济额度', (currentItem as FamilyMember).sharedLimit],
                  ['所属地区', (currentItem as FamilyMember).area],
                  ['绑定日期', (currentItem as FamilyMember).bindingDate],
                  ['绑定状态', (currentItem as FamilyMember).status],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            ) : modalType === 'viewProgress' && currentItem ? (
              <div className="space-y-3 text-sm">
                {[
                  ['报销编号', (currentItem as ProgressItem).id],
                  ['报销类型', (currentItem as ProgressItem).type],
                  ['票据数量', `${(currentItem as ProgressItem).billCount}张`],
                  ['费用总额', `${(currentItem as ProgressItem).totalAmount.toLocaleString()}元`],
                  ['拟报销金额', `${(currentItem as ProgressItem).reimbursementAmount.toLocaleString()}元`],
                  ['个人自付', `${(currentItem as ProgressItem).selfPayAmount.toLocaleString()}元`],
                  ['就诊机构', (currentItem as ProgressItem).hospital],
                  ['受理机构', (currentItem as ProgressItem).acceptAgency],
                  ['提交渠道', (currentItem as ProgressItem).submitChannel],
                  ['申请日期', (currentItem as ProgressItem).date],
                  ['当前状态', (currentItem as ProgressItem).status],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </motion.div>
        </div>
      )}
    </div>
  );
}
