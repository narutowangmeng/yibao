import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, DollarSign, Upload, Search, Plus, History, X, Eye, Edit, Trash2 } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  idCard: string;
  gender: '男' | '女';
  status: '正常参保' | '暂停参保';
  enrollDate: string;
  phone: string;
  department: string;
  jobType: string;
  insuranceType: string;
  baseAmount: string;
}

interface PaymentRecord {
  id: number;
  month: string;
  insuranceType: string;
  payableAmount: number;
  actualAmount: number;
  peopleCount: number;
  status: '已缴费' | '待缴费' | '部分到账';
  payDate: string;
  channel: string;
  voucherNo: string;
}

interface UploadRecord {
  id: string;
  fileName: string;
  type: string;
  result: string;
  operator: string;
  uploadTime: string;
}

const tabs = [
  { id: 'enrollment', label: '单位参保', icon: Building2 },
  { id: 'employees', label: '员工管理', icon: Users },
  { id: 'payment', label: '缴费申报', icon: DollarSign },
  { id: 'upload', label: '网报上传', icon: Upload },
  { id: 'query', label: '信息查询', icon: Search },
  { id: 'records', label: '缴费记录', icon: History },
];

const initialEmployees: Employee[] = [
  { id: 1, name: '陈思远', idCard: '320102198903152415', gender: '男', status: '正常参保', enrollDate: '2024-01-01', phone: '13851760011', department: '产品研发部', jobType: '正式职工', insuranceType: '职工基本医疗保险', baseAmount: '12,600.00元' },
  { id: 2, name: '周语彤', idCard: '320102199407263526', gender: '女', status: '正常参保', enrollDate: '2024-02-01', phone: '13915230027', department: '财务管理部', jobType: '正式职工', insuranceType: '职工基本医疗保险', baseAmount: '11,800.00元' },
  { id: 3, name: '许文博', idCard: '320102198805204517', gender: '男', status: '正常参保', enrollDate: '2024-03-15', phone: '13862750016', department: '运营支持部', jobType: '劳务派遣', insuranceType: '职工基本医疗保险', baseAmount: '8,600.00元' },
  { id: 4, name: '陆书意', idCard: '320102199912163214', gender: '女', status: '暂停参保', enrollDate: '2024-04-10', phone: '13584820042', department: '市场服务部', jobType: '实习生', insuranceType: '职工基本医疗保险', baseAmount: '6,800.00元' },
  { id: 5, name: '顾嘉言', idCard: '320302199101084633', gender: '男', status: '正常参保', enrollDate: '2024-04-18', phone: '13775880039', department: '数据治理部', jobType: '正式职工', insuranceType: '职工基本医疗保险', baseAmount: '10,200.00元' },
  { id: 6, name: '沈知夏', idCard: '320412201910215628', gender: '女', status: '正常参保', enrollDate: '2024-05-03', phone: '13685210018', department: '客户成功部', jobType: '实习生', insuranceType: '职工基本医疗保险', baseAmount: '6,500.00元' },
  { id: 7, name: '韩倩', idCard: '320802199511136247', gender: '女', status: '正常参保', enrollDate: '2024-05-20', phone: '13861350028', department: '产品运营部', jobType: '正式职工', insuranceType: '职工基本医疗保险', baseAmount: '9,800.00元' },
  { id: 8, name: '唐璐', idCard: '321102199209047523', gender: '女', status: '正常参保', enrollDate: '2024-06-11', phone: '13952970046', department: '行政人事部', jobType: '正式职工', insuranceType: '职工基本医疗保险', baseAmount: '8,900.00元' },
  { id: 9, name: '彭雪', idCard: '321302199611258944', gender: '女', status: '正常参保', enrollDate: '2024-06-19', phone: '13773990033', department: '运营支持部', jobType: '劳务派遣', insuranceType: '职工基本医疗保险', baseAmount: '7,400.00元' },
  { id: 10, name: '曹颖', idCard: '320583198810126489', gender: '女', status: '正常参保', enrollDate: '2024-07-08', phone: '13862580019', department: '财务管理部', jobType: '正式职工', insuranceType: '职工基本医疗保险', baseAmount: '11,200.00元' },
  { id: 11, name: '高宁', idCard: '320684198712204018', gender: '男', status: '正常参保', enrollDate: '2024-07-23', phone: '13962780052', department: '商务拓展部', jobType: '正式职工', insuranceType: '职工基本医疗保险', baseAmount: '10,800.00元' },
  { id: 12, name: '严峰', idCard: '320803198912154218', gender: '男', status: '正常参保', enrollDate: '2024-08-01', phone: '13852340088', department: '技术运维部', jobType: '正式职工', insuranceType: '职工基本医疗保险', baseAmount: '9,600.00元' },
  { id: 13, name: '孔洁', idCard: '321001199001063821', gender: '女', status: '正常参保', enrollDate: '2024-08-12', phone: '13952760061', department: '法务合规部', jobType: '正式职工', insuranceType: '职工基本医疗保险', baseAmount: '10,300.00元' },
  { id: 14, name: '陆敏', idCard: '320102198706224128', gender: '女', status: '正常参保', enrollDate: '2024-08-25', phone: '13851430077', department: '项目交付部', jobType: '正式职工', insuranceType: '职工基本医疗保险', baseAmount: '10,600.00元' },
  { id: 15, name: '钱莉', idCard: '320205199103142246', gender: '女', status: '暂停参保', enrollDate: '2024-09-06', phone: '13961720031', department: '市场服务部', jobType: '劳务派遣', insuranceType: '职工基本医疗保险', baseAmount: '7,200.00元' },
  { id: 16, name: '赵静', idCard: '320302199406185126', gender: '女', status: '正常参保', enrollDate: '2024-09-18', phone: '13775830024', department: '客户成功部', jobType: '正式职工', insuranceType: '职工基本医疗保险', baseAmount: '8,700.00元' },
  { id: 17, name: '邵琳', idCard: '321003198911273526', gender: '女', status: '正常参保', enrollDate: '2024-10-10', phone: '13952710084', department: '行政人事部', jobType: '正式职工', insuranceType: '职工基本医疗保险', baseAmount: '8,500.00元' },
  { id: 18, name: '许诺', idCard: '320412199608117841', gender: '女', status: '正常参保', enrollDate: '2024-10-28', phone: '13685260012', department: '产品研发部', jobType: '正式职工', insuranceType: '职工基本医疗保险', baseAmount: '9,900.00元' },
  { id: 19, name: '周岚', idCard: '320105198704213624', gender: '女', status: '正常参保', enrollDate: '2024-11-06', phone: '13851490016', department: '财务管理部', jobType: '正式职工', insuranceType: '职工基本医疗保险', baseAmount: '11,500.00元' },
  { id: 20, name: '吴桐', idCard: '320106199202141517', gender: '男', status: '正常参保', enrollDate: '2024-11-22', phone: '13851930062', department: '技术运维部', jobType: '正式职工', insuranceType: '职工基本医疗保险', baseAmount: '9,100.00元' },
];

const initialPayments: PaymentRecord[] = [
  { id: 1, month: '2026-04', insuranceType: '职工基本医疗保险', payableAmount: 26800, actualAmount: 26800, peopleCount: 18, status: '已缴费', payDate: '2026-04-15', channel: '对公网银', voucherNo: 'JSYB20260415001' },
  { id: 2, month: '2026-03', insuranceType: '职工基本医疗保险', payableAmount: 25600, actualAmount: 25600, peopleCount: 18, status: '已缴费', payDate: '2026-03-15', channel: '对公网银', voucherNo: 'JSYB20260315011' },
  { id: 3, month: '2026-02', insuranceType: '职工基本医疗保险', payableAmount: 24800, actualAmount: 24800, peopleCount: 17, status: '已缴费', payDate: '2026-02-17', channel: '税务批扣', voucherNo: 'JSYB20260217005' },
  { id: 4, month: '2026-05', insuranceType: '职工基本医疗保险', payableAmount: 27200, actualAmount: 12000, peopleCount: 18, status: '部分到账', payDate: '2026-05-16', channel: '税务批扣', voucherNo: 'JSYB20260516002' },
  { id: 5, month: '2026-01', insuranceType: '职工基本医疗保险', payableAmount: 24200, actualAmount: 24200, peopleCount: 17, status: '已缴费', payDate: '2026-01-15', channel: '对公网银', voucherNo: 'JSYB20260115009' },
  { id: 6, month: '2025-12', insuranceType: '职工基本医疗保险', payableAmount: 23900, actualAmount: 23900, peopleCount: 17, status: '已缴费', payDate: '2025-12-16', channel: '税务批扣', voucherNo: 'JSYB20251216003' },
];

const uploadHistorySeed: UploadRecord[] = [
  { id: 'UP001', fileName: '2026年4月单位增减员申报.xlsx', type: '增减员申报', result: '导入成功，新增2人，减员1人', operator: '周语彤', uploadTime: '2026-04-12 09:18' },
  { id: 'UP002', fileName: '2026年4月缴费工资基数申报.xlsx', type: '缴费基数申报', result: '导入成功，校验通过42人', operator: '周语彤', uploadTime: '2026-04-12 09:32' },
  { id: 'UP003', fileName: '2026年3月参保名单变更.csv', type: '参保名单变更', result: '部分失败，2条身份证号格式异常', operator: '陈思远', uploadTime: '2026-03-10 16:06' },
];

export default function EmployerPortal() {
  const [activeTab, setActiveTab] = useState('enrollment');
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [uploadRecords, setUploadRecords] = useState<UploadRecord[]>(uploadHistorySeed);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [currentItem, setCurrentItem] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    idCard: '',
    gender: '男',
    phone: '',
    status: '正常参保',
    department: '',
    jobType: '正式职工',
    insuranceType: '职工基本医疗保险',
    baseAmount: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [queryKeyword, setQueryKeyword] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const filteredEmployees = useMemo(
    () =>
      employees.filter(
        (item) =>
          item.name.includes(searchQuery) ||
          item.idCard.includes(searchQuery) ||
          item.department.includes(searchQuery) ||
          item.phone.includes(searchQuery)
      ),
    [employees, searchQuery]
  );

  const queriedEmployees = useMemo(() => {
    if (!queryKeyword.trim()) return employees;
    return employees.filter(
      (item) =>
        item.name.includes(queryKeyword) ||
        item.idCard.includes(queryKeyword) ||
        item.phone.includes(queryKeyword) ||
        item.department.includes(queryKeyword)
    );
  }, [employees, queryKeyword]);

  const totalBase = useMemo(
    () => employees.reduce((sum, item) => sum + Number(item.baseAmount.replace(/[^\d.]/g, '')), 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    [employees]
  );

  const handleAddEmployee = () => {
    setModalType('add');
    setCurrentItem(null);
    setFormData({
      name: '',
      idCard: '',
      gender: '男',
      phone: '',
      status: '正常参保',
      department: '',
      jobType: '正式职工',
      insuranceType: '职工基本医疗保险',
      baseAmount: '',
    });
    setShowModal(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setModalType('edit');
    setCurrentItem(employee);
    setFormData({
      name: employee.name,
      idCard: employee.idCard,
      gender: employee.gender,
      phone: employee.phone,
      status: employee.status,
      department: employee.department,
      jobType: employee.jobType,
      insuranceType: employee.insuranceType,
      baseAmount: employee.baseAmount,
    });
    setShowModal(true);
  };

  const handleViewEmployee = (employee: Employee) => {
    setModalType('view');
    setCurrentItem(employee);
    setShowModal(true);
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees((current) => current.filter((item) => item.id !== id));
  };

  const handleSubmitEmployee = () => {
    if (!formData.name.trim() || !formData.idCard.trim()) {
      alert('姓名和身份证号不能为空');
      return;
    }

    if (modalType === 'add') {
      const nextEmployee: Employee = {
        id: employees.length + 1,
        name: formData.name.trim(),
        idCard: formData.idCard.trim(),
        gender: formData.gender as '男' | '女',
        status: formData.status as '正常参保' | '暂停参保',
        enrollDate: new Date().toISOString().slice(0, 10),
        phone: formData.phone.trim(),
        department: formData.department.trim() || '综合管理部',
        jobType: formData.jobType,
        insuranceType: formData.insuranceType,
        baseAmount: formData.baseAmount.trim() || '8,000.00元',
      };
      setEmployees((current) => [...current, nextEmployee]);
    } else if (currentItem) {
      setEmployees((current) =>
        current.map((item) =>
          item.id === currentItem.id
            ? {
                ...item,
                name: formData.name.trim(),
                idCard: formData.idCard.trim(),
                gender: formData.gender as '男' | '女',
                status: formData.status as '正常参保' | '暂停参保',
                phone: formData.phone.trim(),
                department: formData.department.trim(),
                jobType: formData.jobType,
                insuranceType: formData.insuranceType,
                baseAmount: formData.baseAmount.trim(),
              }
            : item
        )
      );
    }
    setShowModal(false);
  };

  const handleDeclarePayment = () => {
    const nextPayment: PaymentRecord = {
      id: payments.length + 1,
      month: '2026-06',
      insuranceType: '职工基本医疗保险',
      payableAmount: 27600,
      actualAmount: 0,
      peopleCount: employees.filter((item) => item.status === '正常参保').length,
      status: '待缴费',
      payDate: '-',
      channel: '待缴费',
      voucherNo: `JSYB202606${String(payments.length + 1).padStart(4, '0')}`,
    };
    setPayments((current) => [nextPayment, ...current]);
    alert('缴费申报已生成，可在缴费记录中查看');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const handleConfirmUpload = () => {
    if (!uploadedFile) return;
    const nextRecord: UploadRecord = {
      id: `UP${String(uploadRecords.length + 1).padStart(3, '0')}`,
      fileName: uploadedFile.name,
      type: uploadedFile.name.includes('基数') ? '缴费基数申报' : '参保名单变更',
      result: '已上传，待系统校验',
      operator: '周语彤',
      uploadTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setUploadRecords((current) => [nextRecord, ...current]);
    alert(`文件 "${uploadedFile.name}" 上传成功`);
    setUploadedFile(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'enrollment':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="rounded-xl border bg-white p-5">
                <p className="text-sm text-gray-500">参保状态</p>
                <p className="mt-3 text-2xl font-bold text-emerald-600">正常参保</p>
              </div>
              <div className="rounded-xl border bg-white p-5">
                <p className="text-sm text-gray-500">参保人数</p>
                <p className="mt-3 text-2xl font-bold text-cyan-600">{employees.filter((item) => item.status === '正常参保').length}人</p>
              </div>
              <div className="rounded-xl border bg-white p-5">
                <p className="text-sm text-gray-500">申报缴费基数总额</p>
                <p className="mt-3 text-2xl font-bold text-blue-600">{totalBase}元</p>
              </div>
              <div className="rounded-xl border bg-white p-5">
                <p className="text-sm text-gray-500">所属经办机构</p>
                <p className="mt-3 text-2xl font-bold text-violet-600">南京市医保中心</p>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-medium text-gray-800">单位基本信息</h3>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                {[
                  ['单位名称', '南京华宁科技有限公司'],
                  ['统一社会信用代码', '91320102MA27HY8L4P'],
                  ['单位编号', 'DW32010000128'],
                  ['所属地区', '南京市玄武区'],
                  ['单位类型', '企业单位'],
                  ['行业类别', '软件和信息技术服务业'],
                  ['开户银行', '中国建设银行南京玄武支行'],
                  ['银行账号', '32050188001200012876'],
                  ['医保专管员', '周语彤'],
                  ['联系电话', '025-86561288'],
                  ['申报方式', '单位网上经办'],
                  ['参保险种', '职工基本医疗保险、生育保险'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-gray-50 p-4">
                    <p className="text-gray-500">{label}</p>
                    <p className="mt-2 font-medium text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'employees':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={handleAddEmployee} className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white">
                <Plus className="h-4 w-4" />
                新增员工
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索姓名、身份证号、部门或电话"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-72 rounded-lg border py-2 pl-9 pr-4 text-sm"
                />
              </div>
            </div>
            <table className="w-full rounded-xl border bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">姓名</th>
                  <th className="px-4 py-3 text-left text-sm">身份证号</th>
                  <th className="px-4 py-3 text-left text-sm">部门</th>
                  <th className="px-4 py-3 text-left text-sm">用工形式</th>
                  <th className="px-4 py-3 text-left text-sm">参保险种</th>
                  <th className="px-4 py-3 text-left text-sm">缴费基数</th>
                  <th className="px-4 py-3 text-left text-sm">状态</th>
                  <th className="px-4 py-3 text-left text-sm">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{employee.name}</td>
                    <td className="px-4 py-3 text-sm">{employee.idCard}</td>
                    <td className="px-4 py-3 text-sm">{employee.department}</td>
                    <td className="px-4 py-3 text-sm">{employee.jobType}</td>
                    <td className="px-4 py-3 text-sm">{employee.insuranceType}</td>
                    <td className="px-4 py-3 text-sm text-cyan-600">{employee.baseAmount}</td>
                    <td className="px-4 py-3 text-sm">{employee.status}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleViewEmployee(employee)} className="rounded p-1 text-blue-600 hover:bg-blue-50"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleEditEmployee(employee)} className="rounded p-1 text-yellow-600 hover:bg-yellow-50"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleDeleteEmployee(employee.id)} className="rounded p-1 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'payment':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">本月应缴金额</p>
                <p className="mt-3 text-3xl font-bold text-cyan-600">27,600元</p>
                <p className="mt-2 text-sm text-gray-500">申报人数：{employees.filter((item) => item.status === '正常参保').length}人</p>
              </div>
              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">险种范围</p>
                <p className="mt-3 text-2xl font-bold text-blue-600">职工医保</p>
                <p className="mt-2 text-sm text-gray-500">含生育保险待遇</p>
              </div>
              <div className="rounded-xl border bg-white p-6">
                <p className="text-sm text-gray-500">申报周期</p>
                <p className="mt-3 text-2xl font-bold text-emerald-600">2026年06月</p>
                <p className="mt-2 text-sm text-gray-500">申报截止：2026-06-15</p>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-medium text-gray-800">缴费申报信息</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                {[
                  ['申报单位', '南京华宁科技有限公司'],
                  ['单位编号', 'DW32010000128'],
                  ['险种', '职工基本医疗保险'],
                  ['缴费人数', `${employees.filter((item) => item.status === '正常参保').length}人`],
                  ['工资基数总额', `${totalBase}元`],
                  ['申报渠道', '单位网上经办'],
                  ['税务征收方式', '税务批扣'],
                  ['扣款账户', '建设银行南京玄武支行尾号2876'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-gray-50 p-4">
                    <p className="text-gray-500">{label}</p>
                    <p className="mt-2 font-medium text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
              <button onClick={handleDeclarePayment} className="mt-5 rounded-lg bg-cyan-600 px-4 py-2 text-white">
                生成缴费申报
              </button>
            </div>
          </div>
        );
      case 'upload':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-medium text-gray-800">网报数据上传</h3>
              <div className="mt-4 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <Upload className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                <input type="file" accept=".xlsx,.csv" onChange={handleFileUpload} className="hidden" id="employer-file-upload" />
                <label htmlFor="employer-file-upload" className="cursor-pointer text-cyan-600 hover:underline">
                  点击选择申报文件
                </label>
                <p className="mt-2 text-xs text-gray-400">支持增减员申报、工资基数申报、参保名单变更等 Excel 或 CSV 文件</p>
                {uploadedFile && (
                  <div className="mt-4 rounded bg-gray-50 p-3">
                    <p className="text-sm">已选择：{uploadedFile.name}</p>
                    <button onClick={handleConfirmUpload} className="mt-2 rounded bg-cyan-600 px-4 py-1.5 text-sm text-white">
                      确认上传
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-xl border bg-white">
              <div className="border-b px-4 py-4">
                <h3 className="font-medium text-gray-800">上传记录</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm">记录号</th>
                    <th className="px-4 py-3 text-left text-sm">文件名称</th>
                    <th className="px-4 py-3 text-left text-sm">申报类型</th>
                    <th className="px-4 py-3 text-left text-sm">处理结果</th>
                    <th className="px-4 py-3 text-left text-sm">操作人</th>
                    <th className="px-4 py-3 text-left text-sm">上传时间</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadRecords.map((record) => (
                    <tr key={record.id} className="border-t">
                      <td className="px-4 py-3 text-sm">{record.id}</td>
                      <td className="px-4 py-3 text-sm">{record.fileName}</td>
                      <td className="px-4 py-3 text-sm">{record.type}</td>
                      <td className="px-4 py-3 text-sm">{record.result}</td>
                      <td className="px-4 py-3 text-sm">{record.operator}</td>
                      <td className="px-4 py-3 text-sm">{record.uploadTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'query':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-medium text-gray-800">参保信息查询</h3>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="输入姓名、身份证号、手机号或部门"
                  value={queryKeyword}
                  onChange={(e) => setQueryKeyword(e.target.value)}
                  className="w-full rounded-lg border py-2 pl-10 pr-4"
                />
              </div>
            </div>
            <div className="rounded-xl border bg-white">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm">姓名</th>
                    <th className="px-4 py-3 text-left text-sm">身份证号</th>
                    <th className="px-4 py-3 text-left text-sm">联系电话</th>
                    <th className="px-4 py-3 text-left text-sm">部门</th>
                    <th className="px-4 py-3 text-left text-sm">参保险种</th>
                    <th className="px-4 py-3 text-left text-sm">状态</th>
                    <th className="px-4 py-3 text-left text-sm">参保日期</th>
                  </tr>
                </thead>
                <tbody>
                  {queriedEmployees.map((employee) => (
                    <tr key={employee.id} className="border-t">
                      <td className="px-4 py-3 text-sm">{employee.name}</td>
                      <td className="px-4 py-3 text-sm">{employee.idCard}</td>
                      <td className="px-4 py-3 text-sm">{employee.phone}</td>
                      <td className="px-4 py-3 text-sm">{employee.department}</td>
                      <td className="px-4 py-3 text-sm">{employee.insuranceType}</td>
                      <td className="px-4 py-3 text-sm">{employee.status}</td>
                      <td className="px-4 py-3 text-sm">{employee.enrollDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'records':
        return (
          <table className="w-full rounded-xl border bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">缴费月份</th>
                <th className="px-4 py-3 text-left text-sm">险种</th>
                <th className="px-4 py-3 text-left text-sm">应缴金额</th>
                <th className="px-4 py-3 text-left text-sm">实缴金额</th>
                <th className="px-4 py-3 text-left text-sm">人数</th>
                <th className="px-4 py-3 text-left text-sm">缴费渠道</th>
                <th className="px-4 py-3 text-left text-sm">凭证号</th>
                <th className="px-4 py-3 text-left text-sm">状态</th>
                <th className="px-4 py-3 text-left text-sm">缴费日期</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{payment.month}</td>
                  <td className="px-4 py-3 text-sm">{payment.insuranceType}</td>
                  <td className="px-4 py-3 text-sm">{payment.payableAmount.toLocaleString()}元</td>
                  <td className="px-4 py-3 text-sm text-cyan-600">{payment.actualAmount.toLocaleString()}元</td>
                  <td className="px-4 py-3 text-sm">{payment.peopleCount}人</td>
                  <td className="px-4 py-3 text-sm">{payment.channel}</td>
                  <td className="px-4 py-3 text-sm">{payment.voucherNo}</td>
                  <td className="px-4 py-3 text-sm">{payment.status}</td>
                  <td className="px-4 py-3 text-sm">{payment.payDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">参保单位门户</h2>
        <span className="text-sm text-gray-500">南京华宁科技有限公司</span>
      </div>
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
              <h3 className="text-lg font-semibold">{modalType === 'add' ? '新增员工' : modalType === 'edit' ? '编辑员工' : '员工详情'}</h3>
              <button onClick={() => setShowModal(false)} className="rounded p-1 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            {modalType === 'view' && currentItem ? (
              <div className="space-y-3 text-sm">
                {[
                  ['姓名', currentItem.name],
                  ['身份证号', currentItem.idCard],
                  ['性别', currentItem.gender],
                  ['联系电话', currentItem.phone],
                  ['所属部门', currentItem.department],
                  ['用工形式', currentItem.jobType],
                  ['参保险种', currentItem.insuranceType],
                  ['缴费基数', currentItem.baseAmount],
                  ['参保日期', currentItem.enrollDate],
                  ['参保状态', currentItem.status],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">姓名</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">性别</label>
                    <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full rounded-lg border px-3 py-2">
                      <option value="男">男</option>
                      <option value="女">女</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">身份证号</label>
                  <input type="text" value={formData.idCard} onChange={(e) => setFormData({ ...formData, idCard: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">联系电话</label>
                    <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">所属部门</label>
                    <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">用工形式</label>
                    <select value={formData.jobType} onChange={(e) => setFormData({ ...formData, jobType: e.target.value })} className="w-full rounded-lg border px-3 py-2">
                      <option value="正式职工">正式职工</option>
                      <option value="劳务派遣">劳务派遣</option>
                      <option value="实习生">实习生</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">参保状态</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-lg border px-3 py-2">
                      <option value="正常参保">正常参保</option>
                      <option value="暂停参保">暂停参保</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">参保险种</label>
                    <select value={formData.insuranceType} onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })} className="w-full rounded-lg border px-3 py-2">
                      <option value="职工基本医疗保险">职工基本医疗保险</option>
                      <option value="生育保险">生育保险</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">缴费基数</label>
                    <input type="text" value={formData.baseAmount} onChange={(e) => setFormData({ ...formData, baseAmount: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
                  </div>
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2 hover:bg-gray-50">取消</button>
              {modalType !== 'view' && (
                <button onClick={handleSubmitEmployee} className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">保存</button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
