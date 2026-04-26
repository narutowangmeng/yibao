import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, Plus, Search, Edit, Trash2, Eye, FileText, X, CheckCircle, Phone, MapPin, Calendar, User, Download, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Employer {
  id: string;
  name: string;
  code: string;
  type: string;
  scale: string;
  employees: number;
  status: '正常' | '欠费';
  contact: string;
  phone: string;
  address: string;
  registerDate: string;
  industry: string;
  legalPerson: string;
  email: string;
  paymentBase: number;
  lastPaymentDate: string;
}

const mockEmployers: Employer[] = [
  { id: 'E001', name: '某某科技有限公司', code: '91320000123456789A', type: '企业', scale: '中型', employees: 156, status: '正常', contact: '张三', phone: '13800138001', address: '南京市鼓楼区软件大道1号', registerDate: '2020-03-15', industry: '软件和信息技术服务业', legalPerson: '张总', email: 'zhangsan@company.com', paymentBase: 8500, lastPaymentDate: '2024-01-15' },
  { id: 'E002', name: '江苏省人民医院', code: '91320000987654321B', type: '事业单位', scale: '大型', employees: 3200, status: '正常', contact: '李四', phone: '13900139002', address: '南京市鼓楼区广州路300号', registerDate: '1950-01-01', industry: '医疗卫生', legalPerson: '李院长', email: 'lisi@hospital.com', paymentBase: 12000, lastPaymentDate: '2024-01-14' },
  { id: 'E003', name: '南京某某贸易公司', code: '91320000567890123C', type: '企业', scale: '小型', employees: 28, status: '欠费', contact: '王五', phone: '13700137003', address: '南京市秦淮区中山南路100号', registerDate: '2018-06-20', industry: '批发和零售业', legalPerson: '王总', email: 'wangwu@trade.com', paymentBase: 5000, lastPaymentDate: '2023-12-15' },
  { id: 'E004', name: '某某教育培训机构', code: '91320000345678901D', type: '民办非企业', scale: '小型', employees: 45, status: '正常', contact: '赵六', phone: '13600136004', address: '南京市建邺区江东中路200号', registerDate: '2019-09-10', industry: '教育', legalPerson: '赵校长', email: 'zhaoliu@edu.com', paymentBase: 6500, lastPaymentDate: '2024-01-13' },
];

const employerHeaders = [
  '单位编号', '单位名称', '统一社会信用代码', '单位类型', '单位规模', '参保人数', '状态', '联系人', '联系电话',
  '注册地址', '注册日期', '所属行业', '法定代表人', '电子邮箱', '缴费基数', '最后缴费日期',
];

export default function EmployerManagementWorkbench() {
  const [employers, setEmployers] = useState<Employer[]>(mockEmployers);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [toast, setToast] = useState('');
  const importRef = React.useRef<HTMLInputElement>(null);

  const filteredEmployers = employers.filter(e => {
    if (activeTab === 'normal') return e.status === '正常';
    if (activeTab === 'arrears') return e.status === '欠费';
    return e.name.includes(searchTerm) || e.code.includes(searchTerm);
  });

  const handleAdd = () => {
    setSelectedEmployer(null);
    setShowModal(true);
  };

  const handleEdit = (employer: Employer) => {
    setSelectedEmployer(employer);
    setShowModal(true);
  };

  const handleView = (employer: Employer) => {
    setSelectedEmployer(employer);
    setShowViewModal(true);
  };

  const handleDelete = (employer: Employer) => {
    setToast('删除功能已触发');
    setTimeout(() => setToast(''), 2000);
  };

  const toExportRow = (employer: Employer) => ({
    单位编号: employer.id,
    单位名称: employer.name,
    统一社会信用代码: employer.code,
    单位类型: employer.type,
    单位规模: employer.scale,
    参保人数: employer.employees,
    状态: employer.status,
    联系人: employer.contact,
    联系电话: employer.phone,
    注册地址: employer.address,
    注册日期: employer.registerDate,
    所属行业: employer.industry,
    法定代表人: employer.legalPerson,
    电子邮箱: employer.email,
    缴费基数: employer.paymentBase,
    最后缴费日期: employer.lastPaymentDate,
  });

  const writeWorkbook = (rows: Array<Record<string, string | number>>, fileName: string) => {
    const sheet = XLSX.utils.json_to_sheet(rows, { header: employerHeaders });
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, '参保单位台账');
    XLSX.writeFile(book, fileName);
  };

  const handleTemplateDownload = () => {
    writeWorkbook(employers.slice(0, 3).map(toExportRow), '参保单位导入模板.xlsx');
  };

  const handleExport = () => {
    writeWorkbook(filteredEmployers.map(toExportRow), `参保单位查询结果_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: '', raw: false });
      const imported = rows
        .filter((item) => String(item['单位名称'] || '').trim() && String(item['统一社会信用代码'] || '').trim())
        .map((item, index) => ({
          id: String(item['单位编号'] || `EIMP${String(index + 1).padStart(3, '0')}`),
          name: String(item['单位名称'] || ''),
          code: String(item['统一社会信用代码'] || ''),
          type: String(item['单位类型'] || '企业'),
          scale: String(item['单位规模'] || '中型'),
          employees: Number(item['参保人数'] || 0),
          status: String(item['状态'] || '正常') as Employer['status'],
          contact: String(item['联系人'] || ''),
          phone: String(item['联系电话'] || ''),
          address: String(item['注册地址'] || ''),
          registerDate: String(item['注册日期'] || ''),
          industry: String(item['所属行业'] || ''),
          legalPerson: String(item['法定代表人'] || ''),
          email: String(item['电子邮箱'] || ''),
          paymentBase: Number(item['缴费基数'] || 0),
          lastPaymentDate: String(item['最后缴费日期'] || ''),
        }));
      if (imported.length) setEmployers((prev) => [...imported, ...prev]);
    } finally {
      event.target.value = '';
    }
  };

  const getStatusBadge = (status: string) => {
    return status === '正常' 
      ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">正常</span>
      : <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">欠费</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">参保单位管理</h2>
          <p className="text-sm text-gray-500 mt-1">单位参保登记、信息维护、员工管理</p>
        </div>
        <div className="flex items-center gap-3">
          <input ref={importRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleImport} className="hidden" />
          <button onClick={handleTemplateDownload} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />下载模板
          </button>
          <button onClick={() => importRef.current?.click()} className="flex items-center gap-2 px-4 py-2 border border-cyan-300 text-cyan-700 rounded-lg hover:bg-cyan-50">
            <Upload className="w-4 h-4" />导入单位台账
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50">
            <Download className="w-4 h-4" />导出查询结果
          </button>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
            <Plus className="w-4 h-4" />新增单位
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '参保单位总数', value: '12,456', color: 'text-blue-600', icon: Building2 },
          { label: '正常参保', value: '11,892', color: 'text-green-600', icon: CheckCircle },
          { label: '欠费单位', value: '564', color: 'text-red-600', icon: FileText },
          { label: '本月新增', value: '128', color: 'text-cyan-600', icon: Plus },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-gray-500 text-sm">{stat.label}</span>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b flex items-center gap-4">
          <div className="flex gap-2">
            {[
              { id: 'all', label: '全部单位' },
              { id: 'normal', label: '正常参保' },
              { id: 'arrears', label: '欠费单位' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-cyan-100 text-cyan-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索单位名称、统一社会信用代码..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">单位名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium">统一社会信用代码</th>
              <th className="px-4 py-3 text-left text-sm font-medium">单位类型</th>
              <th className="px-4 py-3 text-left text-sm font-medium">参保人数</th>
              <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium">联系人</th>
              <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredEmployers.map((employer) => (
              <motion.tr key={employer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{employer.name}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">{employer.code}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">{employer.type}</span>
                </td>
                <td className="px-4 py-3">{employer.employees}人</td>
                <td className="px-4 py-3">{getStatusBadge(employer.status)}</td>
                <td className="px-4 py-3 text-gray-600">{employer.contact}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleView(employer)} className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleEdit(employer)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(employer)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showViewModal && selectedEmployer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">单位详情</h3>
                <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{selectedEmployer.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(selectedEmployer.status)}
                        <span className="text-sm text-gray-500">{selectedEmployer.code}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4" />基本信息
                    </h5>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">单位类型</span>
                        <span className="font-medium">{selectedEmployer.type}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">单位规模</span>
                        <span className="font-medium">{selectedEmployer.scale}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">所属行业</span>
                        <span className="font-medium">{selectedEmployer.industry}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">注册日期</span>
                        <span className="font-medium">{selectedEmployer.registerDate}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">法定代表人</span>
                        <span className="font-medium">{selectedEmployer.legalPerson}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />联系信息
                    </h5>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">联系人</span>
                        <span className="font-medium">{selectedEmployer.contact}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">联系电话</span>
                        <span className="font-medium">{selectedEmployer.phone}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">电子邮箱</span>
                        <span className="font-medium">{selectedEmployer.email}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">注册地址</span>
                        <span className="font-medium text-right max-w-[200px]">{selectedEmployer.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />参保信息
                  </h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-cyan-600">{selectedEmployer.employees}</div>
                      <div className="text-xs text-gray-500 mt-1">参保人数</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-cyan-600">¥{selectedEmployer.paymentBase.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-1">缴费基数</div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-cyan-600">{selectedEmployer.lastPaymentDate}</div>
                      <div className="text-xs text-gray-500 mt-1">最后缴费</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button onClick={() => setShowViewModal(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                  关闭
                </button>
                <button onClick={() => { setShowViewModal(false); handleEdit(selectedEmployer); }} className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
                  编辑
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedEmployer ? '编辑单位' : '新增参保单位'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">单位名称</label>
                    <input type="text" defaultValue={selectedEmployer?.name} className="w-full px-3 py-2 border rounded-lg" placeholder="请输入单位名称" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">统一社会信用代码</label>
                    <input type="text" defaultValue={selectedEmployer?.code} className="w-full px-3 py-2 border rounded-lg" placeholder="请输入统一社会信用代码" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">单位类型</label>
                    <select defaultValue={selectedEmployer?.type} className="w-full px-3 py-2 border rounded-lg">
                      <option>企业</option>
                      <option>事业单位</option>
                      <option>民办非企业</option>
                      <option>社会团体</option>
                      <option>个体工商户</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">单位规模</label>
                    <select defaultValue={selectedEmployer?.scale} className="w-full px-3 py-2 border rounded-lg">
                      <option>大型</option>
                      <option>中型</option>
                      <option>小型</option>
                      <option>微型</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">所属行业</label>
                    <input type="text" defaultValue={selectedEmployer?.industry} className="w-full px-3 py-2 border rounded-lg" placeholder="请输入所属行业" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">法定代表人</label>
                    <input type="text" defaultValue={selectedEmployer?.legalPerson} className="w-full px-3 py-2 border rounded-lg" placeholder="请输入法定代表人" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">联系人</label>
                    <input type="text" defaultValue={selectedEmployer?.contact} className="w-full px-3 py-2 border rounded-lg" placeholder="请输入联系人" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                    <input type="text" defaultValue={selectedEmployer?.phone} className="w-full px-3 py-2 border rounded-lg" placeholder="请输入联系电话" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
                    <input type="text" defaultValue={selectedEmployer?.email} className="w-full px-3 py-2 border rounded-lg" placeholder="请输入电子邮箱" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">参保人数</label>
                    <input type="number" defaultValue={selectedEmployer?.employees} className="w-full px-3 py-2 border rounded-lg" placeholder="请输入参保人数" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">注册地址</label>
                    <input type="text" defaultValue={selectedEmployer?.address} className="w-full px-3 py-2 border rounded-lg" placeholder="请输入注册地址" />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
                <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
                  {selectedEmployer ? '保存修改' : '确认新增'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
