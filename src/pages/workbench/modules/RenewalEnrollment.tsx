import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RotateCcw, ArrowLeft, Search, User, Calendar, CheckCircle,
  AlertCircle, CreditCard, FileText, Clock
} from 'lucide-react';

interface PersonInfo {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  lastEnrollDate: string;
  status: 'suspended' | 'expired';
  address: string;
}

export default function RenewalEnrollment({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<PersonInfo | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 模拟断缴人员数据
  const suspendedPersons: PersonInfo[] = [
    { id: '1', name: '参保人A', idCard: '110101199001011234', phone: '13800138001', lastEnrollDate: '2023-12-31', status: 'suspended', address: '北京市朝阳区建国路1号' },
    { id: '2', name: '参保人B', idCard: '110101198505056789', phone: '13900139002', lastEnrollDate: '2023-11-30', status: 'expired', address: '北京市海淀区中关村大街2号' },
    { id: '3', name: '参保人C', idCard: '110101199212123456', phone: '13700137003', lastEnrollDate: '2023-10-31', status: 'suspended', address: '北京市东城区王府井大街3号' },
    { id: '4', name: '参保人D', idCard: '110101198808084321', phone: '13600136004', lastEnrollDate: '2023-09-30', status: 'expired', address: '北京市西城区金融街4号' },
  ];

  const filteredPersons = suspendedPersons.filter(p =>
    p.name.includes(searchTerm) || p.idCard.includes(searchTerm) || p.phone.includes(searchTerm)
  );

  const handleRenewal = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowConfirm(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedPerson(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">续保登记</h1>
            <p className="text-sm text-gray-500">断缴后重新参保登记</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {!selectedPerson ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 搜索栏 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="搜索姓名、身份证号或手机号"
                  />
                </div>
                <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
                  查询
                </button>
              </div>
            </div>

            {/* 断缴人员列表 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">断缴人员列表</h3>
                <p className="text-sm text-gray-500 mt-1">共找到 {filteredPersons.length} 条记录</p>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">身份证号</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">联系电话</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">最后参保日期</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPersons.map((person) => (
                    <tr key={person.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="font-medium text-gray-800">{person.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">{person.idCard}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{person.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{person.lastEnrollDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          person.status === 'suspended'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {person.status === 'suspended' ? '暂停' : '过期'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedPerson(person)}
                          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          办理续保
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* 人员信息卡片 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800">参保人员信息</h3>
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  重新选择
                </button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">姓名</div>
                    <div className="font-medium text-gray-800">{selectedPerson.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">身份证号</div>
                    <div className="font-medium text-gray-800 font-mono">{selectedPerson.idCard}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">联系电话</div>
                    <div className="font-medium text-gray-800">{selectedPerson.phone}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 续保信息 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-6">续保信息</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">续保年度</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option>2024年度</option>
                    <option>2025年度</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">缴费档次</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    <option>一档（580元/年）</option>
                    <option>二档（880元/年）</option>
                    <option>三档（1280元/年）</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">生效日期</label>
                  <input
                    type="date"
                    defaultValue="2024-01-01"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">补缴月份</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    defaultValue="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">续保说明</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      断缴后重新参保，医保待遇将于缴费次月生效。如需补缴断缴期间费用，请在补缴月份中填写。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedPerson(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                确认续保
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* 确认弹窗 */}
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">确认续保</h3>
            <p className="text-gray-600 mb-6">
              确定为 <span className="font-medium text-gray-800">{selectedPerson?.name}</span> 办理续保登记吗？
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleRenewal}
                disabled={isSubmitting}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 transition-colors"
              >
                {isSubmitting ? '处理中...' : '确认'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 成功提示 */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">续保成功</h3>
            <p className="text-gray-600">参保登记已更新，医保待遇将于次月生效</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
