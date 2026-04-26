import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, FileText, Clock, User, DollarSign, Edit2, Trash2, Eye, X } from 'lucide-react';

const tabs = [
  { id: 'assessment', label: '失能评估申请', icon: FileText },
  { id: 'service', label: '护理服务管理', icon: Clock },
  { id: 'institutions', label: '护理机构列表', icon: User },
  { id: 'payment', label: '待遇支付记录', icon: DollarSign },
  { id: 'query', label: '评估查询', icon: Search },
];

const assessmentData = [
  { id: 'A001', name: '王桂兰', age: 79, status: '待评估', date: '2026-04-18', idCard: '320102194703156428', address: '南京市鼓楼区凤凰西街86号', contact: '13813800101' },
  { id: 'A002', name: '陈国华', age: 82, status: '已通过', date: '2026-04-18', idCard: '320205194402085216', address: '无锡市梁溪区中山路188号', contact: '13813800102' },
  { id: 'A003', name: '李素珍', age: 76, status: '复评中', date: '2026-04-17', idCard: '320303195001124625', address: '徐州市泉山区矿大南路33号', contact: '13813800103' },
  { id: 'A004', name: '赵德明', age: 81, status: '待评估', date: '2026-04-17', idCard: '320402194504231917', address: '常州市天宁区和平中路109号', contact: '13813800104' },
  { id: 'A005', name: '周淑英', age: 84, status: '已通过', date: '2026-04-16', idCard: '320505194211078564', address: '苏州市姑苏区干将西路225号', contact: '13813800105' },
  { id: 'A006', name: '孙建平', age: 77, status: '待评估', date: '2026-04-16', idCard: '320602194904203310', address: '南通市崇川区工农路98号', contact: '13813800106' },
  { id: 'A007', name: '钱玉芳', age: 80, status: '已通过', date: '2026-04-15', idCard: '320703194609112248', address: '连云港市海州区苍梧路18号', contact: '13813800107' },
  { id: 'A008', name: '吴正林', age: 75, status: '复评中', date: '2026-04-15', idCard: '320804195103206635', address: '淮安市清江浦区淮海东路66号', contact: '13813800108' },
  { id: 'A009', name: '郑月英', age: 83, status: '待评估', date: '2026-04-14', idCard: '320903194309185827', address: '盐城市亭湖区迎宾北路188号', contact: '13813800109' },
  { id: 'A010', name: '谢荣华', age: 78, status: '已通过', date: '2026-04-14', idCard: '321002194802146957', address: '扬州市广陵区文昌中路267号', contact: '13813800110' },
  { id: 'A011', name: '蒋美华', age: 74, status: '待评估', date: '2026-04-13', idCard: '321102195207151249', address: '镇江市京口区解放路55号', contact: '13813800111' },
  { id: 'A012', name: '韩志强', age: 79, status: '已通过', date: '2026-04-13', idCard: '321203194703286114', address: '泰州市海陵区青年南路69号', contact: '13813800112' },
  { id: 'A013', name: '顾兰芳', age: 81, status: '待评估', date: '2026-04-12', idCard: '321302194502247920', address: '宿迁市宿城区洪泽湖路128号', contact: '13813800113' },
  { id: 'A014', name: '朱海波', age: 73, status: '复评中', date: '2026-04-12', idCard: '320104195305129931', address: '南京市秦淮区中华路102号', contact: '13813800114' },
  { id: 'A015', name: '褚桂芝', age: 86, status: '已通过', date: '2026-04-11', idCard: '320214194007253628', address: '无锡市滨湖区建筑西路90号', contact: '13813800115' },
  { id: 'A016', name: '严庆华', age: 78, status: '待评估', date: '2026-04-11', idCard: '320312194804168214', address: '徐州市云龙区和平大道160号', contact: '13813800116' },
  { id: 'A017', name: '陶素梅', age: 82, status: '已通过', date: '2026-04-10', idCard: '320404194403278845', address: '常州市钟楼区怀德中路88号', contact: '13813800117' },
  { id: 'A018', name: '彭永春', age: 76, status: '待评估', date: '2026-04-10', idCard: '320507195012077419', address: '苏州市吴中区宝带东路109号', contact: '13813800118' },
  { id: 'A019', name: '邵玉珍', age: 85, status: '已通过', date: '2026-04-09', idCard: '320611194105092130', address: '南通市通州区金沙街道建设路30号', contact: '13813800119' },
  { id: 'A020', name: '蔡建国', age: 80, status: '复评中', date: '2026-04-09', idCard: '320706194602064772', address: '连云港市赣榆区黄海东路56号', contact: '13813800120' },
];

const serviceData = [
  { id: 'S001', name: '王桂兰', service: '居家生活照护', date: '2026-04-18', status: '进行中', nurse: '周海燕', hours: 36 },
  { id: 'S002', name: '陈国华', service: '失能康复护理', date: '2026-04-18', status: '已完成', nurse: '许红梅', hours: 48 },
  { id: 'S003', name: '李素珍', service: '压疮护理', date: '2026-04-17', status: '进行中', nurse: '何晓静', hours: 24 },
  { id: 'S004', name: '赵德明', service: '鼻饲照护', date: '2026-04-17', status: '已完成', nurse: '袁春丽', hours: 30 },
  { id: 'S005', name: '周淑英', service: '卧床翻身护理', date: '2026-04-16', status: '进行中', nurse: '陈玉兰', hours: 42 },
  { id: 'S006', name: '孙建平', service: '助浴服务', date: '2026-04-16', status: '已完成', nurse: '李海琴', hours: 20 },
  { id: 'S007', name: '钱玉芳', service: '康复训练', date: '2026-04-15', status: '进行中', nurse: '王婷婷', hours: 26 },
  { id: 'S008', name: '吴正林', service: '导尿护理', date: '2026-04-15', status: '已完成', nurse: '孙静', hours: 18 },
  { id: 'S009', name: '郑月英', service: '失智照护', date: '2026-04-14', status: '进行中', nurse: '刘丽娜', hours: 50 },
  { id: 'S010', name: '谢荣华', service: '夜间巡护', date: '2026-04-14', status: '已完成', nurse: '唐文静', hours: 16 },
  { id: 'S011', name: '蒋美华', service: '居家康复指导', date: '2026-04-13', status: '进行中', nurse: '邱淑芬', hours: 22 },
  { id: 'S012', name: '韩志强', service: '鼻胃管护理', date: '2026-04-13', status: '已完成', nurse: '周晓敏', hours: 28 },
  { id: 'S013', name: '顾兰芳', service: '压疮换药', date: '2026-04-12', status: '进行中', nurse: '顾小燕', hours: 18 },
  { id: 'S014', name: '朱海波', service: '助餐服务', date: '2026-04-12', status: '已完成', nurse: '王海婷', hours: 14 },
  { id: 'S015', name: '褚桂芝', service: '肢体康复训练', date: '2026-04-11', status: '进行中', nurse: '陈敏', hours: 32 },
  { id: 'S016', name: '严庆华', service: '长期卧床护理', date: '2026-04-11', status: '已完成', nurse: '吴海燕', hours: 40 },
  { id: 'S017', name: '陶素梅', service: '居家照护评估', date: '2026-04-10', status: '进行中', nurse: '蒋玉琴', hours: 12 },
  { id: 'S018', name: '彭永春', service: '吞咽功能训练', date: '2026-04-10', status: '已完成', nurse: '宋丽萍', hours: 20 },
  { id: 'S019', name: '邵玉珍', service: '助洁服务', date: '2026-04-09', status: '进行中', nurse: '赵静', hours: 10 },
  { id: 'S020', name: '蔡建国', service: '居家巡诊', date: '2026-04-09', status: '已完成', nurse: '高丽', hours: 8 },
];

const institutionData = [
  { id: 'I001', name: '南京市鼓楼区康宁护理院', type: '定点护理机构', beds: 180, rating: 4.8, address: '南京市鼓楼区中央路318号', contact: '025-86620001' },
  { id: 'I002', name: '无锡市梁溪区惠康护理中心', type: '定点护理机构', beds: 120, rating: 4.7, address: '无锡市梁溪区健康路98号', contact: '0510-82770012' },
  { id: 'I003', name: '徐州市泉山区仁爱护理院', type: '定点护理机构', beds: 150, rating: 4.6, address: '徐州市泉山区解放南路210号', contact: '0516-83650018' },
  { id: 'I004', name: '常州市天宁区颐养护理院', type: '定点护理机构', beds: 110, rating: 4.6, address: '常州市天宁区劳动中路66号', contact: '0519-86530022' },
  { id: 'I005', name: '苏州市姑苏区康复护理中心', type: '定点护理机构', beds: 210, rating: 4.9, address: '苏州市姑苏区人民路816号', contact: '0512-65880035' },
  { id: 'I006', name: '南通市崇川区安宁护理院', type: '定点护理机构', beds: 130, rating: 4.5, address: '南通市崇川区青年中路120号', contact: '0513-85230009' },
  { id: 'I007', name: '连云港市海州区颐和护理院', type: '定点护理机构', beds: 100, rating: 4.5, address: '连云港市海州区通灌南路76号', contact: '0518-85670021' },
  { id: 'I008', name: '淮安市清江浦区福寿护理中心', type: '定点护理机构', beds: 90, rating: 4.4, address: '淮安市清江浦区健康西路45号', contact: '0517-83990008' },
  { id: 'I009', name: '盐城市亭湖区德馨护理院', type: '定点护理机构', beds: 140, rating: 4.7, address: '盐城市亭湖区建军东路121号', contact: '0515-88360016' },
  { id: 'I010', name: '扬州市广陵区安康护理院', type: '定点护理机构', beds: 105, rating: 4.6, address: '扬州市广陵区文昌中路309号', contact: '0514-87890017' },
  { id: 'I011', name: '镇江市京口区怡和护理中心', type: '定点护理机构', beds: 125, rating: 4.5, address: '镇江市京口区中山东路255号', contact: '0511-85210019' },
  { id: 'I012', name: '泰州市海陵区康泰护理院', type: '定点护理机构', beds: 118, rating: 4.6, address: '泰州市海陵区青年南路188号', contact: '0523-86350028' },
  { id: 'I013', name: '宿迁市宿城区益寿护理院', type: '定点护理机构', beds: 96, rating: 4.4, address: '宿迁市宿城区洪泽湖路218号', contact: '0527-84220031' },
  { id: 'I014', name: '南京市秦淮区瑞和护理中心', type: '居家护理机构', beds: 80, rating: 4.7, address: '南京市秦淮区中华路266号', contact: '025-84450013' },
  { id: 'I015', name: '苏州市吴中区福瑞护理中心', type: '居家护理机构', beds: 88, rating: 4.6, address: '苏州市吴中区宝带东路160号', contact: '0512-66570011' },
  { id: 'I016', name: '南通市通州区仁和护理站', type: '居家护理机构', beds: 72, rating: 4.5, address: '南通市通州区建设路56号', contact: '0513-86580015' },
  { id: 'I017', name: '盐城市盐都区安馨护理站', type: '居家护理机构', beds: 64, rating: 4.5, address: '盐城市盐都区开创路89号', contact: '0515-88990027' },
  { id: 'I018', name: '扬州市邗江区仁寿护理站', type: '居家护理机构', beds: 58, rating: 4.4, address: '扬州市邗江区润扬中路58号', contact: '0514-87650021' },
  { id: 'I019', name: '泰州市医药高新区乐康护理站', type: '居家护理机构', beds: 60, rating: 4.5, address: '泰州市医药高新区凤凰东路22号', contact: '0523-86110012' },
  { id: 'I020', name: '宿迁市宿豫区长青护理站', type: '居家护理机构', beds: 54, rating: 4.3, address: '宿迁市宿豫区珠江路45号', contact: '0527-84860010' },
];

const paymentData = [
  { id: 'P001', name: '王桂兰', amount: 2860, month: '2026-04', status: '已发放', bank: '中国工商银行', account: '6212****3481' },
  { id: 'P002', name: '陈国华', amount: 3200, month: '2026-04', status: '已发放', bank: '中国建设银行', account: '6227****5814' },
  { id: 'P003', name: '李素珍', amount: 2480, month: '2026-04', status: '已发放', bank: '中国银行', account: '6216****1920' },
  { id: 'P004', name: '赵德明', amount: 2750, month: '2026-04', status: '已发放', bank: '交通银行', account: '6222****6405' },
  { id: 'P005', name: '周淑英', amount: 3360, month: '2026-04', status: '已发放', bank: '江苏银行', account: '6229****4478' },
  { id: 'P006', name: '孙建平', amount: 2100, month: '2026-04', status: '已发放', bank: '中国农业银行', account: '6228****5382' },
  { id: 'P007', name: '钱玉芳', amount: 2940, month: '2026-04', status: '已发放', bank: '邮储银行', account: '6210****7371' },
  { id: 'P008', name: '吴正林', amount: 2560, month: '2026-04', status: '已发放', bank: '中国工商银行', account: '6212****1092' },
  { id: 'P009', name: '郑月英', amount: 3480, month: '2026-04', status: '已发放', bank: '中国建设银行', account: '6227****8876' },
  { id: 'P010', name: '谢荣华', amount: 2240, month: '2026-04', status: '已发放', bank: '江苏银行', account: '6229****3157' },
  { id: 'P011', name: '蒋美华', amount: 2380, month: '2026-04', status: '已发放', bank: '交通银行', account: '6222****2283' },
  { id: 'P012', name: '韩志强', amount: 3020, month: '2026-04', status: '已发放', bank: '中国农业银行', account: '6228****8714' },
  { id: 'P013', name: '顾兰芳', amount: 2680, month: '2026-04', status: '已发放', bank: '中国银行', account: '6216****4328' },
  { id: 'P014', name: '朱海波', amount: 1920, month: '2026-04', status: '已发放', bank: '邮储银行', account: '6210****2159' },
  { id: 'P015', name: '褚桂芝', amount: 3540, month: '2026-04', status: '已发放', bank: '中国工商银行', account: '6212****6043' },
  { id: 'P016', name: '严庆华', amount: 2800, month: '2026-04', status: '已发放', bank: '江苏银行', account: '6229****5461' },
  { id: 'P017', name: '陶素梅', amount: 1760, month: '2026-04', status: '已发放', bank: '中国建设银行', account: '6227****9916' },
  { id: 'P018', name: '彭永春', amount: 2140, month: '2026-04', status: '已发放', bank: '交通银行', account: '6222****7360' },
  { id: 'P019', name: '邵玉珍', amount: 1880, month: '2026-04', status: '已发放', bank: '中国农业银行', account: '6228****4412' },
  { id: 'P020', name: '蔡建国', amount: 1600, month: '2026-04', status: '已发放', bank: '中国银行', account: '6216****7158' },
];

export default function LongTermCare() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [assessments, setAssessments] = useState(assessmentData);
  const [services, setServices] = useState(serviceData);
  const [institutions, setInstitutions] = useState(institutionData);
  const [payments] = useState(paymentData);
  const [queryResult, setQueryResult] = useState<any>(null);

  const openModal = (type: 'add' | 'edit' | 'view', item?: any) => {
    setModalType(type);
    setSelectedItem(item || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = (id: string, type: string) => {
    if (type === 'assessment') setAssessments((prev) => prev.filter((i) => i.id !== id));
    if (type === 'service') setServices((prev) => prev.filter((i) => i.id !== id));
    if (type === 'institution') setInstitutions((prev) => prev.filter((i) => i.id !== id));
  };

  const handleQuery = () => {
    const result = assessments.find((a) => a.name.includes(searchTerm) || a.id.includes(searchTerm) || a.idCard.includes(searchTerm));
    setQueryResult(result || { msg: '未找到相关记录' });
  };

  const renderModal = () => {
    if (!modalOpen) return null;
    const isView = modalType === 'view';
    const title = modalType === 'add' ? '新增' : modalType === 'edit' ? '编辑' : '查看';

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{title}{activeTab === 'assessment' ? '评估申请' : activeTab === 'service' ? '护理服务' : activeTab === 'institutions' ? '护理机构' : '支付记录'}</h3>
            <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            {activeTab === 'assessment' && (
              <>
                <div><label className="block text-sm font-medium mb-1">姓名</label><input type="text" defaultValue={selectedItem?.name || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">年龄</label><input type="number" defaultValue={selectedItem?.age || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">身份证号</label><input type="text" defaultValue={selectedItem?.idCard || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">联系电话</label><input type="text" defaultValue={selectedItem?.contact || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">地址</label><input type="text" defaultValue={selectedItem?.address || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
              </>
            )}
            {activeTab === 'service' && (
              <>
                <div><label className="block text-sm font-medium mb-1">服务对象</label><input type="text" defaultValue={selectedItem?.name || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">服务类型</label><input type="text" defaultValue={selectedItem?.service || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">护理人员</label><input type="text" defaultValue={selectedItem?.nurse || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">服务时长(小时)</label><input type="number" defaultValue={selectedItem?.hours || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
              </>
            )}
            {activeTab === 'institutions' && (
              <>
                <div><label className="block text-sm font-medium mb-1">机构名称</label><input type="text" defaultValue={selectedItem?.name || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">机构类型</label><input type="text" defaultValue={selectedItem?.type || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">床位数</label><input type="number" defaultValue={selectedItem?.beds || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">地址</label><input type="text" defaultValue={selectedItem?.address || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-1">联系电话</label><input type="text" defaultValue={selectedItem?.contact || ''} disabled={isView} className="w-full px-3 py-2 border rounded-lg" /></div>
              </>
            )}
            {activeTab === 'payment' && (
              <>
                <div><label className="block text-sm font-medium mb-1">姓名</label><input type="text" defaultValue={selectedItem?.name || ''} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" /></div>
                <div><label className="block text-sm font-medium mb-1">发放月份</label><input type="text" defaultValue={selectedItem?.month || ''} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" /></div>
                <div><label className="block text-sm font-medium mb-1">金额</label><input type="text" defaultValue={selectedItem?.amount || ''} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" /></div>
                <div><label className="block text-sm font-medium mb-1">开户银行</label><input type="text" defaultValue={selectedItem?.bank || ''} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" /></div>
                <div><label className="block text-sm font-medium mb-1">银行账号</label><input type="text" defaultValue={selectedItem?.account || ''} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" /></div>
              </>
            )}
          </div>
          {!isView && (
            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">取消</button>
              <button onClick={closeModal} className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">保存</button>
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'assessment':
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="搜索申请人姓名或编号" className="w-full pl-10 pr-4 py-2 border rounded-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"><Plus className="w-4 h-4" />新增申请</button>
            </div>
            <div className="bg-white rounded-lg border">
              <table className="w-full">
                <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium">编号</th><th className="px-4 py-3 text-left text-sm font-medium">姓名</th><th className="px-4 py-3 text-left text-sm font-medium">年龄</th><th className="px-4 py-3 text-left text-sm font-medium">日期</th><th className="px-4 py-3 text-left text-sm font-medium">状态</th><th className="px-4 py-3 text-left text-sm font-medium">操作</th></tr></thead>
                <tbody>{assessments.filter((item) => item.name.includes(searchTerm) || item.id.includes(searchTerm)).map((item) => (<tr key={item.id} className="border-t"><td className="px-4 py-3 text-sm">{item.id}</td><td className="px-4 py-3 text-sm">{item.name}</td><td className="px-4 py-3 text-sm">{item.age}岁</td><td className="px-4 py-3 text-sm">{item.date}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full ${item.status === '已通过' ? 'bg-green-100 text-green-700' : item.status === '待评估' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{item.status}</span></td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => openModal('view', item)} className="text-cyan-600 hover:underline"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-blue-600 hover:underline"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'assessment')} className="text-red-600 hover:underline"><Trash2 className="w-4 h-4" /></button></div></td></tr>))}</tbody>
              </table>
            </div>
          </div>
        );
      case 'service':
        return (
          <div className="space-y-4">
            <div className="flex justify-end"><button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"><Plus className="w-4 h-4" />新增服务</button></div>
            <div className="grid grid-cols-2 gap-4">{services.map((item) => (<div key={item.id} className="bg-white p-4 rounded-lg border"><div className="flex items-center justify-between mb-3"><h4 className="font-medium">{item.name}</h4><span className={`px-2 py-1 text-xs rounded-full ${item.status === '已完成' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.status}</span></div><p className="text-sm text-gray-600 mb-2">服务类型: {item.service}</p><p className="text-sm text-gray-500">护理人员: {item.nurse}</p><div className="flex gap-2 mt-3"><button onClick={() => openModal('view', item)} className="text-cyan-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-blue-600"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'service')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></div></div>))}</div>
          </div>
        );
      case 'institutions':
        return (
          <div className="space-y-4">
            <div className="flex justify-end"><button onClick={() => openModal('add')} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"><Plus className="w-4 h-4" />新增机构</button></div>
            <div className="grid grid-cols-2 gap-4">{institutions.map((item) => (<div key={item.id} className="bg-white p-4 rounded-lg border"><div className="flex items-center justify-between mb-3"><h4 className="font-medium">{item.name}</h4><span className="px-2 py-1 text-xs bg-cyan-100 text-cyan-700 rounded-full">{item.type}</span></div><div className="text-sm text-gray-600 space-y-1"><p>床位: {item.beds}张 | 评分: {item.rating}分</p><p>地址: {item.address}</p><p>电话: {item.contact}</p></div><div className="flex gap-2 mt-3"><button onClick={() => openModal('view', item)} className="text-cyan-600"><Eye className="w-4 h-4" /></button><button onClick={() => openModal('edit', item)} className="text-blue-600"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(item.id, 'institution')} className="text-red-600"><Trash2 className="w-4 h-4" /></button></div></div>))}</div>
          </div>
        );
      case 'payment':
        return (
          <div className="bg-white rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium">姓名</th><th className="px-4 py-3 text-left text-sm font-medium">月份</th><th className="px-4 py-3 text-left text-sm font-medium">金额</th><th className="px-4 py-3 text-left text-sm font-medium">状态</th><th className="px-4 py-3 text-left text-sm font-medium">操作</th></tr></thead>
              <tbody>{payments.map((item) => (<tr key={item.id} className="border-t"><td className="px-4 py-3 text-sm">{item.name}</td><td className="px-4 py-3 text-sm">{item.month}</td><td className="px-4 py-3 text-sm text-cyan-600 font-medium">¥{item.amount}</td><td className="px-4 py-3"><span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">{item.status}</span></td><td className="px-4 py-3"><button onClick={() => openModal('view', item)} className="text-cyan-600 hover:underline">查看详情</button></td></tr>))}</tbody>
            </table>
          </div>
        );
      case 'query':
        return (
          <div className="space-y-4">
            <div className="flex gap-4">
              <input type="text" placeholder="输入身份证号或评估编号" className="flex-1 px-4 py-2 border rounded-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button onClick={handleQuery} className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">查询</button>
            </div>
            {queryResult && (
              <div className="bg-white p-6 rounded-lg border">
                {queryResult.msg ? <p className="text-gray-500 text-center">{queryResult.msg}</p> : (
                  <div className="space-y-3">
                    <h4 className="font-bold text-lg">查询结果</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm"><p><span className="text-gray-500">姓名:</span> {queryResult.name}</p><p><span className="text-gray-500">年龄:</span> {queryResult.age}岁</p><p><span className="text-gray-500">状态:</span> {queryResult.status}</p><p><span className="text-gray-500">申请日期:</span> {queryResult.date}</p><p><span className="text-gray-500">身份证号:</span> {queryResult.idCard}</p><p><span className="text-gray-500">联系电话:</span> {queryResult.contact}</p></div>
                    <p className="text-sm"><span className="text-gray-500">地址:</span> {queryResult.address}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4"><span>待遇保障司</span><span>/</span><span className="text-gray-800">长期护理保险</span></div>
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-cyan-600 border-b-2 border-cyan-600' : 'text-gray-600 hover:text-gray-800'}`}>
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-h-[400px]">{renderContent()}</motion.div>
      {renderModal()}
    </div>
  );
}
