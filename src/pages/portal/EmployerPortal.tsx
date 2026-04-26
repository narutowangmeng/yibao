import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, DollarSign, Upload, FileText, Search, Plus, Minus, History, CreditCard, X, Eye, Edit, Trash2, CheckCircle } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  idCard: string;
  status: '正常' | '停保';
  enrollDate: string;
  phone?: string;
}

interface Payment {
  id: number;
  month: string;
  amount: number;
  status: '已缴纳' | '待缴纳';
  date: string;
}

const tabs = [
  { id: 'enrollment', label: '单位参保', icon: Building2 },
  { id: 'employees', label: '员工管理', icon: Users },
  { id: 'payment', label: '缴费申报', icon: DollarSign },
  { id: 'upload', label: '网报上传', icon: Upload },
  { id: 'query', label: '信息查询', icon: Search },
  { id: 'records', label: '缴费记录', icon: History }
];

export default function EmployerPortal() {
  const [activeTab, setActiveTab] = useState('enrollment');
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: '员工A', idCard: '110101********1234', status: '正常', enrollDate: '2024-01-01', phone: '138****1234' },
    { id: 2, name: '员工B', idCard: '110101********2345', status: '正常', enrollDate: '2024-02-01', phone: '139****5678' }
  ]);
  const [payments, setPayments] = useState<Payment[]>([
    { id: 1, month: '2024-03', amount: 25600, status: '已缴纳', date: '2024-03-15' },
    { id: 2, month: '2024-02', amount: 24800, status: '已缴纳', date: '2024-02-15' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', idCard: '', phone: '', status: '正常' });
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleAddEmployee = () => {
    setModalType('add');
    setCurrentItem(null);
    setFormData({ name: '', idCard: '', phone: '', status: '正常' });
    setShowModal(true);
  };

  const handleEditEmployee = (emp: Employee) => {
    setModalType('edit');
    setCurrentItem(emp);
    setFormData({ name: emp.name, idCard: emp.idCard, phone: emp.phone || '', status: emp.status });
    setShowModal(true);
  };

  const handleViewEmployee = (emp: Employee) => {
    setModalType('view');
    setCurrentItem(emp);
    setShowModal(true);
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  const handleSubmitEmployee = () => {
    if (modalType === 'add') {
      const newEmp: Employee = {
        id: employees.length + 1,
        name: formData.name,
        idCard: formData.idCard,
        status: formData.status as '正常' | '停保',
        enrollDate: new Date().toISOString().split('T')[0],
        phone: formData.phone
      };
      setEmployees([...employees, newEmp]);
    } else {
      setEmployees(employees.map(e => e.id === currentItem.id ? { ...e, ...formData } : e));
    }
    setShowModal(false);
  };

  const handleDeclarePayment = () => {
    const newPayment: Payment = {
      id: payments.length + 1,
      month: new Date().toISOString().slice(0, 7),
      amount: 26800,
      status: '待缴纳',
      date: '-'
    };
    setPayments([newPayment, ...payments]);
    alert('缴费申报已提交');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleConfirmUpload = () => {
    if (uploadedFile) {
      alert(`文件 "${uploadedFile.name}" 上传成功`);
      setUploadedFile(null);
    }
  };

  const filteredEmployees = employees.filter(e =>
    e.name.includes(searchQuery) || e.idCard.includes(searchQuery)
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'enrollment':
        return (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-medium mb-4">单位基本信息</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">单位名称：</span>某某科技有限公司</div>
                <div><span className="text-gray-500">统一社会信用代码：</span>91110108MA0012345</div>
                <div><span className="text-gray-500">参保状态：</span><span className="text-green-600">正常参保</span></div>
                <div><span className="text-gray-500">参保人数：</span>{employees.length}人</div>
              </div>
            </div>
          </div>
        );
      case 'employees':
        return (
          <div className="space-y-4">
            <div className="flex gap-2 justify-between">
              <button onClick={handleAddEmployee} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                <Plus className="w-4 h-4" />新增员工
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索员工..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
            <table className="w-full bg-white rounded-xl border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">姓名</th>
                  <th className="px-4 py-3 text-left text-sm">身份证号</th>
                  <th className="px-4 py-3 text-left text-sm">状态</th>
                  <th className="px-4 py-3 text-left text-sm">参保日期</th>
                  <th className="px-4 py-3 text-left text-sm">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(e => (
                  <tr key={e.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{e.name}</td>
                    <td className="px-4 py-3 text-sm">{e.idCard}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${e.status === '正常' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{e.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">{e.enrollDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleViewEmployee(e)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleEditEmployee(e)} className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteEmployee(e.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
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
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-medium mb-4">本月应缴</h3>
              <div className="text-3xl font-bold text-cyan-600">¥26,800</div>
              <p className="text-sm text-gray-500 mt-2">缴费基数：¥8,500/人</p>
            </div>
            <button onClick={handleDeclarePayment} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">确认申报</button>
          </div>
        );
      case 'upload':
        return (
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-medium mb-4">网报数据上传</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <input type="file" accept=".xlsx,.csv" onChange={handleFileUpload} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer text-cyan-600 hover:underline">点击选择文件</label>
              <p className="text-xs text-gray-400 mt-2">支持 Excel、CSV 格式</p>
              {uploadedFile && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm">已选择: {uploadedFile.name}</p>
                  <button onClick={handleConfirmUpload} className="mt-2 px-4 py-1.5 bg-cyan-600 text-white rounded text-sm">确认上传</button>
                </div>
              )}
            </div>
          </div>
        );
      case 'query':
        return (
          <div className="bg-white p-6 rounded-xl border">
            <h3 className="font-medium mb-4">参保信息查询</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="输入员工姓名或身份证号" className="w-full pl-10 pr-4 py-2 border rounded-lg" />
            </div>
            <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg">查询</button>
          </div>
        );
      case 'records':
        return (
          <table className="w-full bg-white rounded-xl border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">月份</th>
                <th className="px-4 py-3 text-left text-sm">金额</th>
                <th className="px-4 py-3 text-left text-sm">状态</th>
                <th className="px-4 py-3 text-left text-sm">缴费日期</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{p.month}</td>
                  <td className="px-4 py-3 text-sm text-cyan-600">¥{p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded ${p.status === '已缴纳' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{p.date}</td>
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
        <span className="text-sm text-gray-500">某某科技有限公司</span>
      </div>
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600'}`}
          >
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{renderContent()}</motion.div>
      </AnimatePresence>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{modalType === 'add' ? '新增员工' : modalType === 'edit' ? '编辑员工' : '员工详情'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            {modalType === 'view' ? (
              <div className="space-y-3">
                <div><label className="text-sm text-gray-500">姓名</label><p className="font-medium">{currentItem?.name}</p></div>
                <div><label className="text-sm text-gray-500">身份证号</label><p>{currentItem?.idCard}</p></div>
                <div><label className="text-sm text-gray-500">联系电话</label><p>{currentItem?.phone || '-'}</p></div>
                <div><label className="text-sm text-gray-500">参保状态</label><span className={`px-2 py-1 text-xs rounded ${currentItem?.status === '正常' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{currentItem?.status}</span></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">姓名</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">身份证号</label>
                  <input type="text" value={formData.idCard} onChange={(e) => setFormData({ ...formData, idCard: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">联系电话</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">状态</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                    <option value="正常">正常</option>
                    <option value="停保">停保</option>
                  </select>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
              {modalType !== 'view' && (
                <button onClick={handleSubmitEmployee} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
