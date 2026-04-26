import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plane, ArrowLeft, Search, CheckCircle, Building2, MapPin, FileText
} from 'lucide-react';

interface PersonInfo {
  id: string;
  name: string;
  idCard: string;
  fromProvince: string;
  toProvince: string;
  status: string;
}

export default function CrossRegionTransfer({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<PersonInfo | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const mockPersons: PersonInfo[] = [
    { id: '1', name: '参保人A', idCard: '110101199001011234', fromProvince: '北京市', toProvince: '上海市', status: '待申请' },
    { id: '2', name: '参保人B', idCard: '110101198505056789', fromProvince: '北京市', toProvince: '广东省', status: '待申请' },
  ];

  const filteredPersons = mockPersons.filter(p =>
    p.name.includes(searchTerm) || p.idCard.includes(searchTerm)
  );

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedPerson(null);
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
            <h1 className="text-xl font-bold text-gray-800">跨省转移</h1>
            <p className="text-sm text-gray-500">跨省医保关系转移接续</p>
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
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">转出地</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">转入地</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPersons.map((person) => (
                    <tr key={person.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{person.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">{person.idCard}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{person.fromProvince}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{person.toProvince}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedPerson(person)}
                          className="px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700"
                        >
                          申请转移
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
              <h3 className="font-semibold text-gray-800 mb-6">转移信息</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">{selectedPerson.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">身份证号</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl font-mono">{selectedPerson.idCard}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">转出省份</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">{selectedPerson.fromProvince}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">转入省份</label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">{selectedPerson.toProvince}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-6">上传材料</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-rose-400 transition-colors cursor-pointer">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">上传身份证、参保凭证等材料</p>
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
                提交申请
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
            <p className="text-gray-500">审核通过后将办理转移手续</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
