import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Edit2, ArrowLeft, Search, User, CheckCircle, AlertCircle,
  Phone, MapPin, Building2, CreditCard, FileText
} from 'lucide-react';

interface PersonInfo {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  address: string;
  workUnit: string;
  bankCard: string;
}

export default function InfoChange({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<PersonInfo | null>(null);
  const [changeType, setChangeType] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const mockPersons: PersonInfo[] = [
    { id: '1', name: '参保人A', idCard: '110101199001011234', phone: '13800138001', address: '北京市朝阳区建国路1号', workUnit: '科技有限公司', bankCard: '622202************1234' },
    { id: '2', name: '参保人B', idCard: '110101198505056789', phone: '13900139002', address: '北京市海淀区中关村大街2号', workUnit: '个体经营', bankCard: '622202************5678' },
  ];

  const changeTypes = [
    { id: 'phone', label: '电话变更', icon: Phone },
    { id: 'address', label: '地址变更', icon: MapPin },
    { id: 'unit', label: '单位变更', icon: Building2 },
    { id: 'bank', label: '银行卡变更', icon: CreditCard },
  ];

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedPerson(null);
      setChangeType('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">信息变更</h1>
            <p className="text-sm text-gray-500">参保信息变更维护</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {!selectedPerson ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl"
                  placeholder="搜索姓名或身份证号"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">身份证号</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">联系电话</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPersons.map((person) => (
                    <tr key={person.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{person.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">{person.idCard}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{person.phone}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedPerson(person)}
                          className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700"
                        >
                          变更信息
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800">选择变更类型</h3>
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  重新选择
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {changeTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setChangeType(type.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      changeType === type.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <type.icon className={`w-6 h-6 mb-2 ${changeType === type.id ? 'text-amber-600' : 'text-gray-400'}`} />
                    <div className={`font-medium ${changeType === type.id ? 'text-amber-700' : 'text-gray-700'}`}>{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {changeType && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <h3 className="font-semibold text-gray-800 mb-6">
                  {changeTypes.find(t => t.id === changeType)?.label}
                </h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">当前信息</label>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-600">
                    {changeType === 'phone' && selectedPerson.phone}
                    {changeType === 'address' && selectedPerson.address}
                    {changeType === 'unit' && selectedPerson.workUnit}
                    {changeType === 'bank' && selectedPerson.bankCard}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">变更后信息</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder={`请输入新的${changeTypes.find(t => t.id === changeType)?.label}信息`}
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">变更原因</label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none"
                    rows={3}
                    placeholder="请输入变更原因"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => setChangeType('')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    提交变更
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">变更成功</h3>
            <p className="text-gray-600">信息变更已提交，审核通过后将生效</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
