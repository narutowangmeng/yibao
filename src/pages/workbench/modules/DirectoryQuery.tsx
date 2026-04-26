import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, Pill, Stethoscope, Package, ChevronDown, CheckCircle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface DirectoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  reimbursement: string;
  status: '有效' | '停用';
  cityScope: string;
}

const drugData: DirectoryItem[] = [
  { id: 'D001', code: 'YP320100001', name: '阿莫西林胶囊', category: '抗感染药物', price: 25.5, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'D002', code: 'YP320100002', name: '布洛芬缓释胶囊', category: '解热镇痛药', price: 18.8, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'D003', code: 'YP320100003', name: '奥美拉唑肠溶胶囊', category: '消化系统用药', price: 32, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'D004', code: 'YP320100004', name: '二甲双胍片', category: '降糖药物', price: 15.6, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'D005', code: 'YP320100005', name: '缬沙坦胶囊', category: '心血管系统用药', price: 28.3, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'D006', code: 'YP320100006', name: '阿托伐他汀钙片', category: '调脂药物', price: 42, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'D007', code: 'YP320100007', name: '胰岛素注射液', category: '降糖药物', price: 68, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'D008', code: 'YP320100008', name: '氯吡格雷片', category: '抗血小板药物', price: 56, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'D009', code: 'YP320100009', name: '左氧氟沙星片', category: '抗感染药物', price: 21.4, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'D010', code: 'YP320100010', name: '厄贝沙坦片', category: '心血管系统用药', price: 34.6, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'D011', code: 'YP320100011', name: '达格列净片', category: '降糖药物', price: 98, reimbursement: '乙类', status: '有效', cityScope: '双通道' },
  { id: 'D012', code: 'YP320100012', name: '利妥昔单抗注射液', category: '抗肿瘤药物', price: 1680, reimbursement: '乙类', status: '有效', cityScope: '双通道' },
  { id: 'D013', code: 'YP320100013', name: '来那度胺胶囊', category: '抗肿瘤药物', price: 2890, reimbursement: '乙类', status: '有效', cityScope: '双通道' },
  { id: 'D014', code: 'YP320100014', name: '甲钴胺片', category: '神经系统用药', price: 26.4, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'D015', code: 'YP320100015', name: '硫酸氢氯吡格雷片', category: '抗血小板药物', price: 47.2, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'D016', code: 'YP320100016', name: '恩替卡韦分散片', category: '抗病毒药物', price: 73.5, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'D017', code: 'YP320100017', name: '替格瑞洛片', category: '抗血小板药物', price: 122, reimbursement: '乙类', status: '有效', cityScope: '双通道' },
  { id: 'D018', code: 'YP320100018', name: '门冬胰岛素注射液', category: '降糖药物', price: 86.8, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'D019', code: 'YP320100019', name: '瑞舒伐他汀钙片', category: '调脂药物', price: 38.9, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'D020', code: 'YP320100020', name: '依折麦布片', category: '调脂药物', price: 66.5, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
];

const serviceData: DirectoryItem[] = [
  { id: 'S001', code: 'YL320200001', name: '普通门诊诊查费', category: '诊查费', price: 15, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'S002', code: 'YL320200002', name: '主任医师门诊诊查费', category: '诊查费', price: 30, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'S003', code: 'YL320200003', name: '血常规检查', category: '检验费', price: 25, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'S004', code: 'YL320200004', name: '尿常规检查', category: '检验费', price: 18, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'S005', code: 'YL320200005', name: '肝功能检测', category: '检验费', price: 58, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'S006', code: 'YL320200006', name: '肾功能检测', category: '检验费', price: 49, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'S007', code: 'YL320200007', name: '心电图检查', category: '检查费', price: 35, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'S008', code: 'YL320200008', name: '胸部CT平扫', category: '影像检查', price: 280, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'S009', code: 'YL320200009', name: '头颅MRI平扫', category: '影像检查', price: 580, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'S010', code: 'YL320200010', name: '腹部彩超', category: '影像检查', price: 120, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'S011', code: 'YL320200011', name: '胃镜检查', category: '检查费', price: 260, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'S012', code: 'YL320200012', name: '肠镜检查', category: '检查费', price: 320, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'S013', code: 'YL320200013', name: '住院护理费', category: '护理费', price: 42, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'S014', code: 'YL320200014', name: '静脉输液治疗', category: '治疗费', price: 22, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'S015', code: 'YL320200015', name: '康复理疗', category: '治疗费', price: 68, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'S016', code: 'YL320200016', name: '白内障超声乳化术', category: '手术费', price: 2280, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'S017', code: 'YL320200017', name: '剖宫产手术', category: '手术费', price: 3560, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'S018', code: 'YL320200018', name: '冠脉造影', category: '检查费', price: 1860, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'S019', code: 'YL320200019', name: '血液透析', category: '治疗费', price: 420, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'S020', code: 'YL320200020', name: '恶性肿瘤化疗', category: '治疗费', price: 860, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
];

const materialData: DirectoryItem[] = [
  { id: 'M001', code: 'HC320300001', name: '一次性输液器', category: '低值耗材', price: 3.5, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'M002', code: 'HC320300002', name: '医用纱布', category: '低值耗材', price: 2, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'M003', code: 'HC320300003', name: '留置针', category: '低值耗材', price: 18, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'M004', code: 'HC320300004', name: '心脏支架', category: '高值耗材', price: 8500, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'M005', code: 'HC320300005', name: '人工晶体', category: '高值耗材', price: 3200, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'M006', code: 'HC320300006', name: '髋关节假体', category: '高值耗材', price: 12800, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'M007', code: 'HC320300007', name: '膝关节假体', category: '高值耗材', price: 13600, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'M008', code: 'HC320300008', name: '一次性活检钳', category: '中值耗材', price: 96, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'M009', code: 'HC320300009', name: '血液透析管路', category: '中值耗材', price: 88, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'M010', code: 'HC320300010', name: '人工硬脑膜补片', category: '高值耗材', price: 2580, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'M011', code: 'HC320300011', name: '球囊扩张导管', category: '高值耗材', price: 1860, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'M012', code: 'HC320300012', name: '可吸收止血材料', category: '中值耗材', price: 265, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'M013', code: 'HC320300013', name: '吻合器', category: '高值耗材', price: 2350, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'M014', code: 'HC320300014', name: '骨科锁定钢板', category: '高值耗材', price: 4680, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'M015', code: 'HC320300015', name: '椎间融合器', category: '高值耗材', price: 6920, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'M016', code: 'HC320300016', name: '胰岛素泵输注器', category: '中值耗材', price: 128, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
  { id: 'M017', code: 'HC320300017', name: '静脉留置导管', category: '中值耗材', price: 76, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'M018', code: 'HC320300018', name: '造口袋', category: '中值耗材', price: 42, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'M019', code: 'HC320300019', name: '负压引流装置', category: '中值耗材', price: 115, reimbursement: '甲类', status: '有效', cityScope: '全省统一' },
  { id: 'M020', code: 'HC320300020', name: '人工血管', category: '高值耗材', price: 7880, reimbursement: '乙类', status: '有效', cityScope: '全省统一' },
];

export default function DirectoryQuery({ onBack }: { onBack: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'drug' | 'service' | 'material'>('drug');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'drug':
        return drugData;
      case 'service':
        return serviceData;
      case 'material':
        return materialData;
      default:
        return drugData;
    }
  }, [activeTab]);

  const currentCategories = useMemo(() => ['all', ...new Set(currentData.map((item) => item.category))], [currentData]);

  const filteredData = useMemo(
    () =>
      currentData.filter(
        (item) =>
          [item.name, item.code, item.cityScope].some((value) => value.includes(searchTerm)) &&
          (selectedCategory === 'all' || item.category === selectedCategory),
      ),
    [currentData, searchTerm, selectedCategory],
  );

  const exportRows = () => {
    const rows = filteredData.map((item) => ({
      编码: item.code,
      名称: item.name,
      分类: item.category,
      价格: item.price,
      报销类别: item.reimbursement,
      状态: item.status,
      适用范围: item.cityScope,
    }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, '目录查询');
    XLSX.writeFile(workbook, `目录查询结果_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const getTabIcon = (tab: 'drug' | 'service' | 'material') => {
    if (tab === 'drug') return Pill;
    if (tab === 'service') return Stethoscope;
    return Package;
  };

  const getTabLabel = (tab: 'drug' | 'service' | 'material') => {
    if (tab === 'drug') return '药品目录';
    if (tab === 'service') return '诊疗服务目录';
    return '耗材目录';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="rounded-full p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">目录查询</h1>
            <p className="text-sm text-gray-500">药品、诊疗服务、医用耗材目录统一查询</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex gap-2">
            {(['drug', 'service', 'material'] as const).map((tab) => {
              const Icon = getTabIcon(tab);
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedCategory('all');
                  }}
                  className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-cyan-600 text-white shadow-lg'
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {getTabLabel(tab)}
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4"
                  placeholder="请输入目录名称、编码或适用范围查询"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-10"
                >
                  {currentCategories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? '全部分类' : category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              <button onClick={exportRows} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-white hover:bg-cyan-700">
                <Download className="h-4 w-4" />
                导出结果
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="text-sm text-gray-500">当前目录数</div>
              <div className="mt-2 text-3xl font-bold text-gray-800">{filteredData.length}</div>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-sm text-emerald-700">甲类项目</div>
              <div className="mt-2 text-3xl font-bold text-emerald-600">{filteredData.filter((item) => item.reimbursement === '甲类').length}</div>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="text-sm text-blue-700">乙类项目</div>
              <div className="mt-2 text-3xl font-bold text-blue-600">{filteredData.filter((item) => item.reimbursement === '乙类').length}</div>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="text-sm text-amber-700">高值项目</div>
              <div className="mt-2 text-3xl font-bold text-amber-600">{filteredData.filter((item) => item.category.includes('高值')).length}</div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">编码</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">名称</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">分类</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">价格</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">报销类别</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">适用范围</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">{item.code}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">¥{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${item.reimbursement === '甲类' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {item.reimbursement}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        <CheckCircle className="h-3 w-3" />
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.cityScope}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
