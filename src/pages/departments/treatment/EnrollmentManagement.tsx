import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Edit2, ArrowRightLeft, X, CheckCircle } from 'lucide-react';

type EnrollmentType = '个人' | '单位' | '新生儿';
type EnrollmentStatus = '正常' | '暂停';
type ModalType = 'add' | 'edit' | 'view' | 'transfer';

interface Enrollment {
  id: string;
  name: string;
  idCard: string;
  type: EnrollmentType;
  status: EnrollmentStatus;
  date: string;
  region: string;
  phone?: string;
  address?: string;
  motherName?: string;
  motherIdCard?: string;
  birthDate?: string;
  birthCertificateNo?: string;
  householdStatus?: string;
}

interface FormState {
  name: string;
  idCard: string;
  type: EnrollmentType;
  region: string;
  phone: string;
  address: string;
  motherName: string;
  motherIdCard: string;
  birthDate: string;
  birthCertificateNo: string;
  householdStatus: string;
}

const cityOptions = ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'];

const mockData: Enrollment[] = [
  {
    id: 'JS-JD-0001',
    name: '陈雨菲',
    idCard: '320102199203146528',
    type: '个人',
    status: '正常',
    date: '2026-03-10',
    region: '南京市',
    phone: '13805190021',
    address: '南京市玄武区后宰门街道富贵山社区',
  },
  {
    id: 'JS-DW-0002',
    name: '江苏宁瑞精密制造有限公司',
    idCard: '91320114765231892K',
    type: '单位',
    status: '正常',
    date: '2026-02-22',
    region: '苏州市',
    phone: '0512-68351207',
    address: '苏州市高新区浒关工业园创新路18号',
  },
  {
    id: 'JS-XSE-0003',
    name: '新生儿（母亲：周静）',
    idCard: '未赋码',
    type: '新生儿',
    status: '正常',
    date: '2026-04-26',
    region: '南通市',
    phone: '13962780016',
    address: '南通市崇川区学田街道紫荆花苑',
    motherName: '周静',
    motherIdCard: '320602199506083624',
    birthDate: '2026-04-18',
    birthCertificateNo: 'J320684202604180127',
    householdStatus: '未落户，随母参保',
  },
  {
    id: 'JS-JD-0004',
    name: '顾明轩',
    idCard: '320411198811203275',
    type: '个人',
    status: '暂停',
    date: '2025-12-18',
    region: '常州市',
    phone: '13775610288',
    address: '常州市天宁区兰陵街道劳动中路',
  },
];

const emptyForm: FormState = {
  name: '',
  idCard: '',
  type: '个人',
  region: '南京市',
  phone: '',
  address: '',
  motherName: '',
  motherIdCard: '',
  birthDate: '',
  birthCertificateNo: '',
  householdStatus: '未落户，随母参保',
};

export default function EnrollmentManagement() {
  const [activeTab, setActiveTab] = useState('register');
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockData);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('add');
  const [selectedItem, setSelectedItem] = useState<Enrollment | null>(null);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [showSuccess, setShowSuccess] = useState(false);

  const tabs = [
    { id: 'register', label: '参保登记', icon: Plus },
    { id: 'change', label: '信息变更', icon: Edit2 },
    { id: 'transfer', label: '关系转移', icon: ArrowRightLeft },
    { id: 'query', label: '参保查询', icon: Search },
  ];

  const isNewborn = formData.type === '新生儿';

  const filteredData = useMemo(
    () =>
      enrollments.filter((item) =>
        [
          item.id,
          item.name,
          item.idCard,
          item.region,
          item.phone || '',
          item.motherName || '',
          item.motherIdCard || '',
          item.birthCertificateNo || '',
        ].some((field) => field.includes(searchQuery)),
      ),
    [enrollments, searchQuery],
  );

  const resetForm = () => {
    setFormData(emptyForm);
  };

  const handleSubmit = () => {
    if (isNewborn) {
      if (!formData.motherName || !formData.motherIdCard) return;
    } else if (!formData.name || !formData.idCard) {
      return;
    }

    const payload: Enrollment = {
      id:
        modalType === 'edit' && selectedItem
          ? selectedItem.id
          : `JS-${formData.type === '单位' ? 'DW' : formData.type === '新生儿' ? 'XSE' : 'JD'}-${String(enrollments.length + 1).padStart(4, '0')}`,
      name: isNewborn ? `新生儿（母亲：${formData.motherName}）` : formData.name,
      idCard: isNewborn ? '未赋码' : formData.idCard,
      type: formData.type,
      status: '正常',
      date: modalType === 'edit' && selectedItem ? selectedItem.date : new Date().toISOString().split('T')[0],
      region: formData.region,
      phone: formData.phone,
      address: formData.address,
      motherName: isNewborn ? formData.motherName : undefined,
      motherIdCard: isNewborn ? formData.motherIdCard : undefined,
      birthDate: isNewborn ? formData.birthDate : undefined,
      birthCertificateNo: isNewborn ? formData.birthCertificateNo : undefined,
      householdStatus: isNewborn ? formData.householdStatus : undefined,
    };

    if (modalType === 'add') {
      setEnrollments((prev) => [payload, ...prev]);
    } else if (modalType === 'edit' && selectedItem) {
      setEnrollments((prev) => prev.map((item) => (item.id === selectedItem.id ? { ...item, ...payload } : item)));
    }

    setShowModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const openModal = (type: ModalType, item?: Enrollment) => {
    setModalType(type);
    setSelectedItem(item || null);
    setFormData(
      item
        ? {
            name: item.type === '新生儿' ? '' : item.name,
            idCard: item.type === '新生儿' ? '' : item.idCard,
            type: item.type,
            region: item.region,
            phone: item.phone || '',
            address: item.address || '',
            motherName: item.motherName || '',
            motherIdCard: item.motherIdCard || '',
            birthDate: item.birthDate || '',
            birthCertificateNo: item.birthCertificateNo || '',
            householdStatus: item.householdStatus || '未落户，随母参保',
          }
        : emptyForm,
    );
    setShowModal(true);
  };

  const renderForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">参保类型</label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                type: e.target.value as EnrollmentType,
                name: e.target.value === '新生儿' ? '' : prev.name,
                idCard: e.target.value === '新生儿' ? '' : prev.idCard,
              }))
            }
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="个人">个人</option>
            <option value="单位">单位</option>
            <option value="新生儿">新生儿</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">参保地区</label>
          <select value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} className="w-full rounded-lg border px-3 py-2">
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isNewborn ? (
        <>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            新生儿参保按出生后 28 天内口径办理，不采集新生儿姓名和身份证号，登记时填写母亲姓名和身份证号。
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">母亲姓名</label>
              <input
                type="text"
                value={formData.motherName}
                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">母亲身份证号</label>
              <input
                type="text"
                value={formData.motherIdCard}
                onChange={(e) => setFormData({ ...formData, motherIdCard: e.target.value })}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">出生日期</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">出生医学证明号</label>
              <input
                type="text"
                value={formData.birthCertificateNo}
                onChange={(e) => setFormData({ ...formData, birthCertificateNo: e.target.value })}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">落户状态</label>
            <select value={formData.householdStatus} onChange={(e) => setFormData({ ...formData, householdStatus: e.target.value })} className="w-full rounded-lg border px-3 py-2">
              <option value="未落户，随母参保">未落户，随母参保</option>
              <option value="未落户，随父参保">未落户，随父参保</option>
              <option value="已落户，居民参保">已落户，居民参保</option>
            </select>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">{formData.type === '单位' ? '单位名称' : '姓名'}</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{formData.type === '单位' ? '统一社会信用代码' : '身份证号'}</label>
            <input type="text" value={formData.idCard} onChange={(e) => setFormData({ ...formData, idCard: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">联系电话</label>
        <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">联系地址</label>
        <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">参保管理</h2>
        {activeTab === 'register' && (
          <button onClick={() => openModal('add')} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
            <Plus className="h-4 w-4" />
            新增登记
          </button>
        )}
      </div>

      <div className="flex gap-2 rounded-lg border border-gray-200 bg-white p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                activeTab === tab.id ? 'bg-cyan-100 text-cyan-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {(activeTab === 'query' || activeTab === 'change' || activeTab === 'transfer') && (
        <div className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4"
              placeholder="搜索参保编号、姓名、身份证号、母亲信息..."
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            筛选
          </button>
        </div>
      )}

      {activeTab === 'register' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-gray-600">当前支持类型</label>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">个人、单位、新生儿</div>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-600">新生儿办理口径</label>
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">28天内婴儿，无姓名身份证，登记母亲姓名和身份证</div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={resetForm} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">
              重置
            </button>
            <button onClick={() => openModal('add')} className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
              提交登记
            </button>
          </div>
        </motion.div>
      )}

      {(activeTab === 'query' || activeTab === 'change' || activeTab === 'transfer') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">参保编号</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">姓名/单位</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">身份证号/状态</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">类型</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">参保日期</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{item.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.type === '新生儿' ? `${item.idCard} / ${item.motherName}` : item.idCard}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        item.type === '个人'
                          ? 'bg-blue-100 text-blue-700'
                          : item.type === '单位'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.date}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      {activeTab === 'query' && (
                        <button onClick={() => openModal('view', item)} className="text-cyan-600 hover:text-cyan-700">
                          查看
                        </button>
                      )}
                      {activeTab === 'change' && (
                        <button onClick={() => openModal('edit', item)} className="text-amber-600 hover:text-amber-700">
                          变更
                        </button>
                      )}
                      {activeTab === 'transfer' && (
                        <button onClick={() => openModal('transfer', item)} className="text-blue-600 hover:text-blue-700">
                          转移
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-2xl rounded-xl bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">{modalType === 'add' ? '参保登记' : modalType === 'edit' ? '信息变更' : modalType === 'transfer' ? '关系转移' : '参保详情'}</h3>
                <button onClick={() => setShowModal(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              {modalType === 'view' && selectedItem ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">姓名/单位</label>
                      <p className="font-medium">{selectedItem.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">{selectedItem.type === '新生儿' ? '新生儿身份证号' : '身份证号'}</label>
                      <p className="font-medium">{selectedItem.idCard}</p>
                    </div>
                  </div>
                  {selectedItem.type === '新生儿' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">母亲姓名</label>
                        <p className="font-medium">{selectedItem.motherName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">母亲身份证号</label>
                        <p className="font-medium">{selectedItem.motherIdCard}</p>
                      </div>
                    </div>
                  )}
                  {selectedItem.type === '新生儿' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">出生日期</label>
                        <p className="font-medium">{selectedItem.birthDate}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">出生医学证明号</label>
                        <p className="font-medium">{selectedItem.birthCertificateNo}</p>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">参保类型</label>
                      <p className="font-medium">{selectedItem.type}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">参保状态</label>
                      <p className="font-medium">{selectedItem.status}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">联系电话</label>
                      <p className="font-medium">{selectedItem.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">参保地区</label>
                      <p className="font-medium">{selectedItem.region}</p>
                    </div>
                  </div>
                  {selectedItem.type === '新生儿' && (
                    <div>
                      <label className="text-sm text-gray-500">落户状态</label>
                      <p className="font-medium">{selectedItem.householdStatus}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-500">地址</label>
                    <p className="font-medium">{selectedItem.address}</p>
                  </div>
                </div>
              ) : modalType === 'transfer' && selectedItem ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">当前参保对象：{selectedItem.name}</p>
                    <p className="text-sm text-gray-600">当前参保地：{selectedItem.region}</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">转入地区</label>
                    <select className="w-full rounded-lg border px-3 py-2">
                      {cityOptions.map((city) => (
                        <option key={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">转移原因</label>
                    <textarea className="w-full rounded-lg border px-3 py-2" rows={3} placeholder="请输入转移原因" />
                  </div>
                </div>
              ) : (
                renderForm()
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2">
                  取消
                </button>
                {modalType !== 'view' && (
                  <button onClick={handleSubmit} className="rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
                    保存
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-2xl bg-white p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">操作成功</h3>
              <p className="text-gray-600">数据已保存</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
