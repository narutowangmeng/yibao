import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Search, CheckCircle, Building2, User
} from 'lucide-react';

interface PersonInfo {
  id: string;
  name: string;
  idCard: string;
  fromUnit: string;
  enrollmentType: string;
}

export default function LocalTransfer({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<PersonInfo | null>(null);
  const [toUnit, setToUnit] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const mockPersons: PersonInfo[] = [
    { id: '1', name: '参保人A', idCard: '110101199001011234', fromUnit: 'A科技有限公司', enrollmentType: '城镇职工' },
    { id: '2', name: '参保人B', idCard: '110101198505056789', fromUnit: 'B贸易公司', enrollmentType: '城镇职工' },
  ];

  const filteredPersons = mockPersons.filter(p =>
    p.name.includes(searchTerm) || p.idCard.includes(searchTerm)
  );

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedPerson(null);
      setToUnit('');
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
            <h1 className="text-xl font-bold text-gray-800">本地转移</h1>
            <p className="text-sm text-gray-500">市内医保关系转移</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
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
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">原单位</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPersons.map((person) => (
                    <tr key={person.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{person.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">{person.idCard}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{person.fromUnit}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedPerson(person)}
                          className="px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700"
                        >
                          办理转移
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
              <h3 className="font-semibold text-gray-800 mb-4">当前信息</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">姓名</div>
                  <div className="font-medium">{selectedPerson.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">原单位</div>
                  <div className="font-medium">{selectedPerson.fromUnit}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">参保类型</div>
                  <div className="font-medium">{selectedPerson.enrollmentType}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-6">转移信息</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">新单位</label>
                <input
                  type="text"
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  placeholder="请输入新单位名称"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedPerson(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                提交转移
              </button>
            </div>
          </motion.div>
        )}
      </div>

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
            <h3 className="text-xl font-bold text-gray-800 mb-2">转移申请已提交</h3>
            <p className="text-gray-500">审核通过后将完成转移</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
