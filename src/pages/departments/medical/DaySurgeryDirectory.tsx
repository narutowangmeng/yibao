import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Eye, X } from 'lucide-react';
import { getAgencyLevel } from '../../../config/managementPermissions';

interface Surgery {
  id: string;
  code: string;
  name: string;
  category: string;
  duration: string;
  recovery: string;
  price: number;
  status: 'active' | 'suspended';
}

interface DaySurgeryDirectoryProps {
  userAgency: string;
}

const initialData: Surgery[] = [
  { id: '1', code: 'SS001', name: '白内障超声乳化摘除术', category: '眼科', duration: '30分钟', recovery: '2小时', price: 3500, status: 'active' },
  { id: '2', code: 'SS002', name: '腹股沟疝修补术', category: '普外科', duration: '45分钟', recovery: '4小时', price: 6800, status: 'active' },
  { id: '3', code: 'SS003', name: '下肢静脉曲张高位结扎术', category: '血管外科', duration: '50分钟', recovery: '6小时', price: 7200, status: 'active' },
  { id: '4', code: 'SS004', name: '膝关节镜半月板成形术', category: '骨科', duration: '70分钟', recovery: '8小时', price: 9800, status: 'active' },
  { id: '5', code: 'SS005', name: '鼻中隔偏曲矫正术', category: '耳鼻喉科', duration: '55分钟', recovery: '6小时', price: 5600, status: 'active' },
  { id: '6', code: 'SS006', name: '体表肿物切除术', category: '普外科', duration: '25分钟', recovery: '2小时', price: 1800, status: 'active' },
  { id: '7', code: 'SS007', name: '乳腺良性肿物旋切术', category: '乳腺外科', duration: '40分钟', recovery: '4小时', price: 4600, status: 'active' },
  { id: '8', code: 'SS008', name: '输尿管镜碎石术', category: '泌尿外科', duration: '65分钟', recovery: '8小时', price: 8600, status: 'active' },
  { id: '9', code: 'SS009', name: '宫腔镜子宫内膜息肉切除术', category: '妇科', duration: '45分钟', recovery: '6小时', price: 6200, status: 'active' },
  { id: '10', code: 'SS010', name: '翼状胬肉切除术', category: '眼科', duration: '35分钟', recovery: '2小时', price: 2200, status: 'active' },
  { id: '11', code: 'SS011', name: '痔上黏膜环切术', category: '肛肠科', duration: '50分钟', recovery: '6小时', price: 5800, status: 'active' },
  { id: '12', code: 'SS012', name: '包皮环切术', category: '泌尿外科', duration: '20分钟', recovery: '2小时', price: 1500, status: 'active' },
  { id: '13', code: 'SS013', name: '腱鞘切开松解术', category: '骨科', duration: '30分钟', recovery: '3小时', price: 2400, status: 'active' },
  { id: '14', code: 'SS014', name: '声带息肉切除术', category: '耳鼻喉科', duration: '40分钟', recovery: '4小时', price: 3900, status: 'active' },
  { id: '15', code: 'SS015', name: '宫颈锥切术', category: '妇科', duration: '35分钟', recovery: '5小时', price: 4300, status: 'active' },
  { id: '16', code: 'SS016', name: '腋臭微创清除术', category: '整形外科', duration: '50分钟', recovery: '6小时', price: 5200, status: 'suspended' },
  { id: '17', code: 'SS017', name: '体表脂肪瘤切除术', category: '普外科', duration: '20分钟', recovery: '2小时', price: 1600, status: 'active' },
  { id: '18', code: 'SS018', name: '膀胱镜检查并活检术', category: '泌尿外科', duration: '35分钟', recovery: '4小时', price: 2600, status: 'active' },
  { id: '19', code: 'SS019', name: '泪道置管术', category: '眼科', duration: '25分钟', recovery: '2小时', price: 2800, status: 'active' },
  { id: '20', code: 'SS020', name: '踝关节镜清理术', category: '骨科', duration: '60分钟', recovery: '8小时', price: 7600, status: 'active' },
];

const categories = ['全部', '眼科', '普外科', '肛肠科', '骨科', '耳鼻喉科', '泌尿外科', '妇科', '血管外科', '乳腺外科', '整形外科'];

export default function DaySurgeryDirectory({ userAgency }: DaySurgeryDirectoryProps) {
  const [surgeries, setSurgeries] = useState<Surgery[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Surgery | null>(null);
  const [showDetail, setShowDetail] = useState<Surgery | null>(null);
  const isProvince = getAgencyLevel(userAgency) === 'province';

  const filtered = surgeries.filter((s) => {
    const matchesSearch = s.name.includes(searchTerm) || s.code.includes(searchTerm);
    const matchesCategory = selectedCategory === '全部' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (s: Surgery) => {
    setEditing(s);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setSurgeries(surgeries.filter((s) => s.id !== id));
  };

  const handleSave = (data: Partial<Surgery>) => {
    if (editing) {
      setSurgeries(surgeries.map((s) => (s.id === editing.id ? { ...s, ...data } : s)));
    } else {
      setSurgeries([...surgeries, { ...data, id: String(surgeries.length + 1) } as Surgery]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">日间手术治疗目录</h2>
        {isProvince ? (
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
            <Plus className="w-4 h-4" />
            新增
          </button>
        ) : (
          <div className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700">地市账号仅可查询和查看日间手术目录，不可新增、编辑或删除</div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 border rounded-lg">
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">编码</th>
              <th className="px-4 py-3 text-left text-sm font-medium">名称</th>
              <th className="px-4 py-3 text-left text-sm font-medium">分类</th>
              <th className="px-4 py-3 text-left text-sm font-medium">价格</th>
              <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
              <th className="px-4 py-3 text-right text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((s) => (
              <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{s.code}</td>
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-sm">{s.category}</td>
                <td className="px-4 py-3 text-sm">￥{s.price}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {s.status === 'active' ? '启用' : '停用'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setShowDetail(s)} className="p-2 text-gray-500 hover:bg-gray-100 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    {isProvince && (
                      <>
                        <button onClick={() => handleEdit(s)} className="p-2 text-blue-500 hover:bg-blue-50 rounded">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isProvince && showModal && <SurgeryModal editing={editing} onClose={() => setShowModal(false)} onSave={handleSave} />}
      </AnimatePresence>

      <AnimatePresence>
        {showDetail && <DetailModal surgery={showDetail} onClose={() => setShowDetail(null)} />}
      </AnimatePresence>
    </div>
  );
}

function SurgeryModal({ editing, onClose, onSave }: { editing: Surgery | null; onClose: () => void; onSave: (d: Partial<Surgery>) => void }) {
  const [form, setForm] = useState({
    code: editing?.code || '',
    name: editing?.name || '',
    category: editing?.category || '眼科',
    duration: editing?.duration || '',
    recovery: editing?.recovery || '',
    price: editing?.price || 0,
    status: editing?.status || 'active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">{editing ? '编辑' : '新增'}日间手术</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="编码" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          <input type="text" placeholder="名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" required />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
            {categories.slice(1).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input type="text" placeholder="手术时长" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          <input type="text" placeholder="恢复时间" value={form.recovery} onChange={(e) => setForm({ ...form, recovery: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          <input type="number" placeholder="价格" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">取消</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">保存</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function DetailModal({ surgery, onClose }: { surgery: Surgery; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">手术详情</h3>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">编码</span><span>{surgery.code}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">名称</span><span>{surgery.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">分类</span><span>{surgery.category}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">手术时长</span><span>{surgery.duration}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">恢复时间</span><span>{surgery.recovery}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">价格</span><span>￥{surgery.price}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">状态</span><span>{surgery.status === 'active' ? '启用' : '停用'}</span></div>
        </div>
      </motion.div>
    </motion.div>
  );
}
