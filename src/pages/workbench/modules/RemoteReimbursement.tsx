import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Upload, FileText, Calculator, CheckCircle, X, Plane } from 'lucide-react';

export default function RemoteReimbursement({ onClose, onBack }: { onClose?: () => void; onBack?: () => void }) {
  const handleClose = onClose || onBack || (() => {});
  const [searchTerm, setSearchTerm] = useState('');
  const [record, setRecord] = useState<any>(null);
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');

  const handleSearch = () => {
    if (searchTerm) {
      setRecord({
        name: '张三',
        idCard: '320101199001011234',
        status: '已备案',
       备案日期: '2024-01-15',
        备案类型: '长期异地居住'
      });
    }
  };

  const provinces = ['江苏省', '浙江省', '上海市', '北京市', '广东省'];
  const cities: Record<string, string[]> = {
    '江苏省': ['南京市', '苏州市', '无锡市'],
    '浙江省': ['杭州市', '宁波市', '温州市'],
    '上海市': ['上海市'],
    '北京市': ['北京市'],
    '广东省': ['广州市', '深圳市', '珠海市']
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Plane className="w-5 h-5 text-orange-600" />异地报销</h3>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* 备案查询 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2"><Search className="w-4 h-4" />异地就医备案查询</h4>
            <div className="flex gap-2">
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" placeholder="输入姓名或身份证号" />
              <button onClick={handleSearch} className="px-4 py-2 bg-orange-600 text-white rounded-lg">查询</button>
            </div>
            {record && (
              <div className="mt-4 grid grid-cols-4 gap-4 text-sm bg-white p-3 rounded-lg">
                <div><span className="text-gray-500">姓名:</span> {record.name}</div>
                <div><span className="text-gray-500">备案状态:</span> <span className="text-green-600">{record.status}</span></div>
                <div><span className="text-gray-500">备案日期:</span> {record.备案日期}</div>
                <div><span className="text-gray-500">备案类型:</span> {record.备案类型}</div>
              </div>
            )}
          </div>

          {/* 就诊地选择 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" />就诊地选择</h4>
            <div className="grid grid-cols-2 gap-4">
              <select value={province} onChange={(e) => { setProvince(e.target.value); setCity(''); }} className="px-3 py-2 border rounded-lg">
                <option value="">选择省份</option>
                {provinces.map(p => <option key={p}>{p}</option>)}
              </select>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="px-3 py-2 border rounded-lg" disabled={!province}>
                <option value="">选择城市</option>
                {province && cities[province]?.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* 转诊证明上传 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2"><Upload className="w-4 h-4" />转诊证明上传</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">转诊证明</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">异地就诊发票</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">费用清单</p>
              </div>
            </div>
          </div>

          {/* 报销比例查询 */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <h4 className="font-medium text-orange-800 mb-3 flex items-center gap-2"><Calculator className="w-4 h-4" />异地报销比例</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-gray-500">省内异地</div>
                <div className="text-xl font-bold text-orange-600">75%</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-gray-500">跨省异地</div>
                <div className="text-xl font-bold text-orange-600">60%</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-gray-500">急诊抢救</div>
                <div className="text-xl font-bold text-orange-600">70%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={handleClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"><CheckCircle className="w-4 h-4" />提交报销</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
