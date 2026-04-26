import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search, ArrowLeft, Eye, Printer, Download, Filter,
  ChevronDown, CheckCircle, Clock, AlertCircle, X
} from 'lucide-react';

interface EnrollmentRecord {
  id: string;
  name: string;
  idCard: string;
  gender: string;
  phone: string;
  enrollmentType: string;
  status: 'active' | 'suspended' | 'expired';
  joinDate: string;
  expireDate: string;
  address: string;
  workUnit: string;
  // 扩展字段
  ethnicity: string;
  birthDate: string;
  householdAddress: string;
  residenceAddress: string;
  postalCode: string;
  insuranceType: string;
  insuranceBase: string;
  occupation: string;
  education: string;
  maritalStatus: string;
  emergencyContact: string;
  emergencyPhone: string;
  bankName: string;
  bankAccount: string;
  socialSecurityCard: string;
  photoUrl: string;
  idCardFront: string;
  idCardBack: string;
  householdRegister: string;
  operator: string;
  operateTime: string;
  remarks: string;
}

export default function EnrollmentQuery({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<EnrollmentRecord | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    enrollmentType: '',
    dateRange: ''
  });

  // 模拟参保记录数据 - 完整字段
  const enrollmentRecords: EnrollmentRecord[] = [
    {
      id: '1', name: '张三', idCard: '320101199001011234', gender: '男', phone: '13800138001', enrollmentType: '城镇职工', status: 'active', joinDate: '2024-01-15', expireDate: '2024-12-31', address: '南京市鼓楼区中山路1号', workUnit: '南京科技有限公司',
      ethnicity: '汉族', birthDate: '1990-01-01', householdAddress: '江苏省南京市鼓楼区中山路1号', residenceAddress: '南京市鼓楼区中山路1号', postalCode: '210000',
      insuranceType: '职工基本医疗保险', insuranceBase: '8000', occupation: '软件工程师', education: '本科', maritalStatus: '已婚',
      emergencyContact: '李四', emergencyPhone: '13900139001', bankName: '中国工商银行', bankAccount: '6222021234567890123', socialSecurityCard: '320101199001011234',
      photoUrl: '', idCardFront: '', idCardBack: '', householdRegister: '', operator: '王经办', operateTime: '2024-01-15 09:30:00', remarks: '正常参保'
    },
    {
      id: '2', name: '李四', idCard: '320101198505056789', gender: '女', phone: '13900139002', enrollmentType: '城乡居民', status: 'active', joinDate: '2024-01-14', expireDate: '2024-12-31', address: '南京市玄武区珠江路2号', workUnit: '无',
      ethnicity: '汉族', birthDate: '1985-05-05', householdAddress: '江苏省南京市玄武区珠江路2号', residenceAddress: '南京市玄武区珠江路2号', postalCode: '210000',
      insuranceType: '城乡居民基本医疗保险', insuranceBase: '5000', occupation: '家庭主妇', education: '大专', maritalStatus: '已婚',
      emergencyContact: '张三', emergencyPhone: '13800138001', bankName: '中国建设银行', bankAccount: '6227001234567890456', socialSecurityCard: '320101198505056789',
      photoUrl: '', idCardFront: '', idCardBack: '', householdRegister: '', operator: '王经办', operateTime: '2024-01-14 10:15:00', remarks: '正常参保'
    },
    {
      id: '3', name: '王五', idCard: '320101199212123456', gender: '男', phone: '13700137003', enrollmentType: '灵活就业', status: 'suspended', joinDate: '2023-01-15', expireDate: '2023-12-31', address: '南京市秦淮区中华路3号', workUnit: '个体经营',
      ethnicity: '汉族', birthDate: '1992-12-12', householdAddress: '江苏省南京市秦淮区中华路3号', residenceAddress: '南京市秦淮区中华路3号', postalCode: '210000',
      insuranceType: '灵活就业人员医疗保险', insuranceBase: '6000', occupation: '个体户', education: '高中', maritalStatus: '未婚',
      emergencyContact: '赵六', emergencyPhone: '13600136004', bankName: '中国农业银行', bankAccount: '6228481234567890789', socialSecurityCard: '320101199212123456',
      photoUrl: '', idCardFront: '', idCardBack: '', householdRegister: '', operator: '李经办', operateTime: '2023-01-15 14:20:00', remarks: '因欠费暂停'
    },
    {
      id: '4', name: '赵六', idCard: '320101198808084321', gender: '女', phone: '13600136004', enrollmentType: '城乡居民', status: 'expired', joinDate: '2022-01-15', expireDate: '2022-12-31', address: '南京市建邺区江东中路4号', workUnit: '无',
      ethnicity: '回族', birthDate: '1988-08-08', householdAddress: '江苏省南京市建邺区江东中路4号', residenceAddress: '南京市建邺区江东中路4号', postalCode: '210000',
      insuranceType: '城乡居民基本医疗保险', insuranceBase: '4000', occupation: '自由职业', education: '中专', maritalStatus: '离异',
      emergencyContact: '钱七', emergencyPhone: '13500135005', bankName: '中国银行', bankAccount: '6216611234567890321', socialSecurityCard: '320101198808084321',
      photoUrl: '', idCardFront: '', idCardBack: '', householdRegister: '', operator: '李经办', operateTime: '2022-01-15 11:00:00', remarks: '已过期未续保'
    },
    {
      id: '5', name: '钱七', idCard: '320101199505055678', gender: '男', phone: '13500135005', enrollmentType: '城镇职工', status: 'active', joinDate: '2024-01-10', expireDate: '2024-12-31', address: '南京市雨花台区软件大道5号', workUnit: '江苏软件股份有限公司',
      ethnicity: '汉族', birthDate: '1995-05-05', householdAddress: '江苏省南京市雨花台区软件大道5号', residenceAddress: '南京市雨花台区软件大道5号', postalCode: '210000',
      insuranceType: '职工基本医疗保险', insuranceBase: '10000', occupation: '产品经理', education: '硕士', maritalStatus: '未婚',
      emergencyContact: '孙八', emergencyPhone: '13400134006', bankName: '交通银行', bankAccount: '6222621234567890654', socialSecurityCard: '320101199505055678',
      photoUrl: '', idCardFront: '', idCardBack: '', householdRegister: '', operator: '王经办', operateTime: '2024-01-10 16:45:00', remarks: '正常参保'
    },
  ];

  const filteredRecords = enrollmentRecords.filter(record => {
    const matchesSearch = record.name.includes(searchTerm) || 
                         record.idCard.includes(searchTerm) || 
                         record.phone.includes(searchTerm);
    const matchesStatus = !filters.status || record.status === filters.status;
    const matchesType = !filters.enrollmentType || record.enrollmentType === filters.enrollmentType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: '正常' };
      case 'suspended':
        return { bg: 'bg-orange-100', text: 'text-orange-700', icon: Clock, label: '暂停' };
      case 'expired':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: '过期' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: '未知' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">参保信息查询</h1>
              <p className="text-sm text-gray-500">查询参保人员信息和状态</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              导出
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Printer className="w-4 h-4" />
              打印
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* 搜索和筛选 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="搜索姓名、身份证号或手机号"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-colors ${
                showFilters ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              筛选
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              查询
            </button>
          </div>

          {/* 筛选条件 */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">参保状态</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部状态</option>
                  <option value="active">正常</option>
                  <option value="suspended">暂停</option>
                  <option value="expired">过期</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">参保类型</label>
                <select
                  value={filters.enrollmentType}
                  onChange={(e) => setFilters({ ...filters, enrollmentType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部类型</option>
                  <option value="城乡居民">城乡居民</option>
                  <option value="城镇职工">城镇职工</option>
                  <option value="灵活就业">灵活就业</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">参保日期</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全部时间</option>
                  <option value="today">今天</option>
                  <option value="week">本周</option>
                  <option value="month">本月</option>
                  <option value="year">本年</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500">总参保人数</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">{enrollmentRecords.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500">正常参保</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {enrollmentRecords.filter(r => r.status === 'active').length}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500">暂停参保</div>
            <div className="text-2xl font-bold text-orange-600 mt-1">
              {enrollmentRecords.filter(r => r.status === 'suspended').length}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500">已过期</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {enrollmentRecords.filter(r => r.status === 'expired').length}
            </div>
          </div>
        </div>

        {/* 查询结果列表 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">查询结果</h3>
            <p className="text-sm text-gray-500 mt-1">共找到 {filteredRecords.length} 条记录</p>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">身份证号</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">性别</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">联系电话</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">参保类型</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">参保日期</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const status = getStatusBadge(record.status);
                return (
                  <tr key={record.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{record.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{record.idCard}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.gender}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.enrollmentType}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.joinDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        <status.icon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="flex items-center gap-1 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        查看
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 详情弹窗 */}
      {selectedRecord && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedRecord(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">参保详情</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* 基本信息 */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">基本信息</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">姓名</div>
                    <div className="font-medium text-gray-800">{selectedRecord.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">身份证号</div>
                    <div className="font-medium text-gray-800 font-mono">{selectedRecord.idCard}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">性别</div>
                    <div className="font-medium text-gray-800">{selectedRecord.gender}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">民族</div>
                    <div className="font-medium text-gray-800">{selectedRecord.ethnicity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">出生日期</div>
                    <div className="font-medium text-gray-800">{selectedRecord.birthDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">联系电话</div>
                    <div className="font-medium text-gray-800">{selectedRecord.phone}</div>
                  </div>
                </div>
              </div>

              {/* 参保信息 */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">参保信息</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">参保类型</div>
                    <div className="font-medium text-gray-800">{selectedRecord.enrollmentType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">险种名称</div>
                    <div className="font-medium text-gray-800">{selectedRecord.insuranceType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">缴费基数</div>
                    <div className="font-medium text-gray-800">{selectedRecord.insuranceBase} 元</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">参保状态</div>
                    <div className="font-medium text-gray-800">
                      {(() => {
                        const s = getStatusBadge(selectedRecord.status);
                        return (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
                            <s.icon className="w-3 h-3" />
                            {s.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">参保日期</div>
                    <div className="font-medium text-gray-800">{selectedRecord.joinDate}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">到期日期</div>
                    <div className="font-medium text-gray-800">{selectedRecord.expireDate}</div>
                  </div>
                </div>
              </div>

              {/* 地址信息 */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">地址信息</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">户籍地址</div>
                    <div className="font-medium text-gray-800">{selectedRecord.householdAddress}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">现居住地址</div>
                    <div className="font-medium text-gray-800">{selectedRecord.residenceAddress}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">邮政编码</div>
                    <div className="font-medium text-gray-800">{selectedRecord.postalCode}</div>
                  </div>
                </div>
              </div>

              {/* 工作信息 */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">工作信息</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">工作单位</div>
                    <div className="font-medium text-gray-800">{selectedRecord.workUnit}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">职业</div>
                    <div className="font-medium text-gray-800">{selectedRecord.occupation}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">学历</div>
                    <div className="font-medium text-gray-800">{selectedRecord.education}</div>
                  </div>
                </div>
              </div>

              {/* 家庭信息 */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">家庭信息</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">婚姻状况</div>
                    <div className="font-medium text-gray-800">{selectedRecord.maritalStatus}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">紧急联系人</div>
                    <div className="font-medium text-gray-800">{selectedRecord.emergencyContact}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">紧急联系电话</div>
                    <div className="font-medium text-gray-800">{selectedRecord.emergencyPhone}</div>
                  </div>
                </div>
              </div>

              {/* 银行信息 */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">银行信息</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">开户银行</div>
                    <div className="font-medium text-gray-800">{selectedRecord.bankName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">银行账号</div>
                    <div className="font-medium text-gray-800 font-mono">{selectedRecord.bankAccount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">社保卡号</div>
                    <div className="font-medium text-gray-800 font-mono">{selectedRecord.socialSecurityCard}</div>
                  </div>
                </div>
              </div>

              {/* 操作信息 */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">操作信息</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">经办人</div>
                    <div className="font-medium text-gray-800">{selectedRecord.operator}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">操作时间</div>
                    <div className="font-medium text-gray-800">{selectedRecord.operateTime}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">备注</div>
                    <div className="font-medium text-gray-800">{selectedRecord.remarks}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                关闭
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                打印参保证明
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
