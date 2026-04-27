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
  { id: 'E001', name: '南京江宁医药科技有限公司', code: '91320100123456789A', type: '企业', scale: '中型', employees: 156, status: '正常', contact: '周岚', phone: '13805140011', address: '南京市江宁区诚信大道88号', registerDate: '2020-03-15', industry: '医药制造业', legalPerson: '周明远', email: 'njyykj@jsmed.com', paymentBase: 8530, lastPaymentDate: '2026-04-15' },
  { id: 'E002', name: '江苏省人民医院', code: '12320000466000123B', type: '事业单位', scale: '大型', employees: 3200, status: '正常', contact: '顾婷', phone: '13905140022', address: '南京市鼓楼区广州路300号', registerDate: '1950-01-01', industry: '医疗卫生', legalPerson: '陈建国', email: 'ybgl@jsph.org.cn', paymentBase: 12680, lastPaymentDate: '2026-04-14' },
  { id: 'E003', name: '无锡市梁溪区惠民大药房连锁有限公司', code: '91320200784561234C', type: '企业', scale: '小型', employees: 82, status: '正常', contact: '沈悦', phone: '13706100031', address: '无锡市梁溪区健康路18号', registerDate: '2018-06-20', industry: '零售药店', legalPerson: '沈国平', email: 'hmstore@wxmed.cn', paymentBase: 6120, lastPaymentDate: '2026-04-13' },
  { id: 'E004', name: '徐州市云龙区第一实验小学', code: '12320300477890126D', type: '事业单位', scale: '中型', employees: 145, status: '正常', contact: '程莹', phone: '13605220041', address: '徐州市云龙区民祥路66号', registerDate: '2019-09-10', industry: '教育', legalPerson: '程立华', email: 'xzxxyb@edu.cn', paymentBase: 7020, lastPaymentDate: '2026-04-13' },
  { id: 'E005', name: '常州高新区精工装备股份有限公司', code: '91320400791234567E', type: '企业', scale: '大型', employees: 968, status: '正常', contact: '戴俊', phone: '13506110052', address: '常州市新北区黄河西路199号', registerDate: '2016-11-08', industry: '装备制造', legalPerson: '戴志强', email: 'hr@jinggongzb.com', paymentBase: 9110, lastPaymentDate: '2026-04-12' },
  { id: 'E006', name: '苏州工业园区星湖软件服务有限公司', code: '91320594765432109F', type: '企业', scale: '中型', employees: 436, status: '正常', contact: '袁菲', phone: '13812650063', address: '苏州市工业园区星湖街328号', registerDate: '2021-05-21', industry: '软件和信息技术服务业', legalPerson: '袁志诚', email: 'hr@xhsoft.cn', paymentBase: 10450, lastPaymentDate: '2026-04-15' },
  { id: 'E007', name: '南通市第一人民医院', code: '12320600488900117G', type: '事业单位', scale: '大型', employees: 2140, status: '正常', contact: '季薇', phone: '13906280074', address: '南通市崇川区孩儿巷北路6号', registerDate: '1947-04-01', industry: '医疗卫生', legalPerson: '季宏斌', email: 'ybzx@ntfhospital.cn', paymentBase: 11820, lastPaymentDate: '2026-04-14' },
  { id: 'E008', name: '连云港港口物流集团有限公司', code: '91320700111234567H', type: '国有企业', scale: '大型', employees: 1865, status: '正常', contact: '潘磊', phone: '13705180085', address: '连云港市连云区中华西路18号', registerDate: '2009-03-26', industry: '交通运输仓储', legalPerson: '潘建军', email: 'yb@lygport.com', paymentBase: 8750, lastPaymentDate: '2026-04-12' },
  { id: 'E009', name: '淮安市清江浦区民康社区卫生服务中心', code: '12320800455678129J', type: '事业单位', scale: '小型', employees: 96, status: '正常', contact: '丁雪', phone: '13605170096', address: '淮安市清江浦区北京北路99号', registerDate: '2017-08-14', industry: '基层医疗', legalPerson: '丁建梅', email: 'mkws@huaian.gov.cn', paymentBase: 6580, lastPaymentDate: '2026-04-11' },
  { id: 'E010', name: '盐城市大丰区康宁养老服务有限公司', code: '91320903789123450K', type: '企业', scale: '中型', employees: 214, status: '欠费', contact: '葛欣', phone: '13851090017', address: '盐城市大丰区幸福东路58号', registerDate: '2019-02-19', industry: '养老服务', legalPerson: '葛文涛', email: 'finance@knyl.com', paymentBase: 5740, lastPaymentDate: '2026-02-15' },
  { id: 'E011', name: '扬州市广陵区仁和堂双通道药店', code: '91321002765439876L', type: '企业', scale: '小型', employees: 34, status: '正常', contact: '谢蓉', phone: '13952780028', address: '扬州市广陵区文昌中路216号', registerDate: '2022-01-06', industry: '双通道药店', legalPerson: '谢德安', email: 'rhtpharmacy@163.com', paymentBase: 6230, lastPaymentDate: '2026-04-15' },
  { id: 'E012', name: '镇江市丹徒区润州建筑工程有限公司', code: '91321112784560098M', type: '企业', scale: '中型', employees: 302, status: '欠费', contact: '陆晨', phone: '13775360039', address: '镇江市丹徒区谷阳大道118号', registerDate: '2015-07-30', industry: '建筑业', legalPerson: '陆卫东', email: 'rzjg@construction.cn', paymentBase: 7310, lastPaymentDate: '2026-01-15' },
  { id: 'E013', name: '泰州市海陵区蓝海职业培训学校', code: '52321200765432101N', type: '民办非企业', scale: '小型', employees: 58, status: '正常', contact: '严璐', phone: '13641520040', address: '泰州市海陵区青年南路36号', registerDate: '2020-12-11', industry: '职业教育', legalPerson: '严志明', email: 'lanhai@edu.org.cn', paymentBase: 5480, lastPaymentDate: '2026-04-10' },
  { id: 'E014', name: '宿迁市宿豫区汇民农业发展有限公司', code: '91321311789123462P', type: '企业', scale: '中型', employees: 187, status: '正常', contact: '罗婷', phone: '13805270051', address: '宿迁市宿豫区江山大道77号', registerDate: '2018-04-09', industry: '农业产业化', legalPerson: '罗建华', email: 'hmny@agri.cn', paymentBase: 5210, lastPaymentDate: '2026-04-09' },
  { id: 'E015', name: '南京市玄武区博爱口腔门诊部', code: '91320102786543124Q', type: '企业', scale: '小型', employees: 43, status: '正常', contact: '韩露', phone: '13913910062', address: '南京市玄武区珠江路188号', registerDate: '2021-10-18', industry: '医疗服务', legalPerson: '韩志峰', email: 'boaiyk@126.com', paymentBase: 6890, lastPaymentDate: '2026-04-15' },
  { id: 'E016', name: '无锡滨湖文旅发展集团有限公司', code: '91320211654321987R', type: '国有企业', scale: '大型', employees: 1246, status: '正常', contact: '许婧', phone: '13771190073', address: '无锡市滨湖区金城西路99号', registerDate: '2014-06-16', industry: '文化旅游', legalPerson: '许国栋', email: 'hr@wxwtgroup.com', paymentBase: 8420, lastPaymentDate: '2026-04-14' },
  { id: 'E017', name: '徐州经济技术开发区华瑞汽车零部件有限公司', code: '91320301765439871S', type: '企业', scale: '大型', employees: 1378, status: '欠费', contact: '毛杰', phone: '13852110084', address: '徐州市经开区杨山路58号', registerDate: '2013-09-23', industry: '汽车零部件制造', legalPerson: '毛建新', email: 'finance@hrparts.cn', paymentBase: 7980, lastPaymentDate: '2026-02-10' },
  { id: 'E018', name: '常州市天宁区兰陵街道社区卫生服务中心', code: '12320400456789012T', type: '事业单位', scale: '小型', employees: 118, status: '正常', contact: '孔琳', phone: '13584320095', address: '常州市天宁区劳动中路126号', registerDate: '2016-03-08', industry: '基层医疗', legalPerson: '孔德华', email: 'lljdws@cz.gov.cn', paymentBase: 6410, lastPaymentDate: '2026-04-11' },
  { id: 'E019', name: '苏州市吴中区东山生态农业专业合作社', code: '93320506789124563U', type: '社会团体', scale: '小型', employees: 67, status: '正常', contact: '曹颖', phone: '13616250016', address: '苏州市吴中区东山镇启园路28号', registerDate: '2019-11-01', industry: '农业合作社', legalPerson: '曹德荣', email: 'dongshanhezuo@163.com', paymentBase: 4860, lastPaymentDate: '2026-04-10' },
  { id: 'E020', name: '南通崇川精诚纺织有限公司', code: '91320600789123674V', type: '企业', scale: '中型', employees: 524, status: '欠费', contact: '蒋倩', phone: '13862710027', address: '南通市崇川区永兴大道188号', registerDate: '2012-05-17', industry: '纺织服装', legalPerson: '蒋永诚', email: 'jcfinance@textile.cn', paymentBase: 6620, lastPaymentDate: '2026-01-20' },
  { id: 'E021', name: '连云港市赣榆区惠民超市有限公司', code: '91320707765432285W', type: '企业', scale: '中型', employees: 248, status: '正常', contact: '高宁', phone: '13961390038', address: '连云港市赣榆区黄海路66号', registerDate: '2017-01-12', industry: '商贸零售', legalPerson: '高文军', email: 'hr@hmchaoshi.cn', paymentBase: 5570, lastPaymentDate: '2026-04-09' },
  { id: 'E022', name: '淮安市第二人民医院', code: '12320800466789136X', type: '事业单位', scale: '大型', employees: 1886, status: '正常', contact: '顾然', phone: '13770400049', address: '淮安市清江浦区淮海南路62号', registerDate: '1952-09-01', industry: '医疗卫生', legalPerson: '顾建平', email: 'ybk@hasdyyy.cn', paymentBase: 11650, lastPaymentDate: '2026-04-15' },
  { id: 'E023', name: '盐城市亭湖区新城物业服务有限公司', code: '91320902784561247Y', type: '企业', scale: '中型', employees: 396, status: '正常', contact: '石蕾', phone: '13851050058', address: '盐城市亭湖区解放南路208号', registerDate: '2018-07-25', industry: '物业服务', legalPerson: '石国梁', email: 'xinchengwy@126.com', paymentBase: 5380, lastPaymentDate: '2026-04-08' },
  { id: 'E024', name: '扬州市邗江区文昌养老护理院', code: '52321011765439018Z', type: '民办非企业', scale: '中型', employees: 173, status: '欠费', contact: '陶敏', phone: '13665270069', address: '扬州市邗江区文汇西路188号', registerDate: '2020-08-05', industry: '养老护理', legalPerson: '陶建波', email: 'wcyly@care.cn', paymentBase: 5660, lastPaymentDate: '2026-02-18' },
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
