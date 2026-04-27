import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, FileText, Clock, User, DollarSign, Edit2, Trash2, Eye, X } from 'lucide-react';
import { getAgencyLevel } from '../../../config/managementPermissions';

interface LongTermCareProps {
  userAgency: string;
}

const provinceTabs = [{ id: 'institutions', label: '护理机构列表', icon: User }];

const cityTabs = [
  { id: 'assessment', label: '失能评估申请', icon: FileText },
  { id: 'service', label: '护理服务管理', icon: Clock },
  { id: 'payment', label: '待遇支付记录', icon: DollarSign },
  { id: 'query', label: '评估查询', icon: Search },
];

const assessmentData = [
  { id: 'A001', name: '王桂兰', age: 79, status: '待评估', date: '2026-04-18', idCard: '320102194703156428', address: '南京市鼓楼区凤凰西街86号', contact: '13813800101' },
  { id: 'A002', name: '陈国华', age: 82, status: '已通过', date: '2026-04-18', idCard: '320205194402085216', address: '无锡市梁溪区中山路88号', contact: '13813800102' },
  { id: 'A003', name: '李素琴', age: 76, status: '复评中', date: '2026-04-17', idCard: '320303195001124625', address: '徐州市泉山区矿大南路33号', contact: '13813800103' },
  { id: 'A004', name: '周秀兰', age: 81, status: '待评估', date: '2026-04-17', idCard: '320402194507186243', address: '常州市天宁区延陵中路118号', contact: '13813800104' },
  { id: 'A005', name: '吴德芳', age: 78, status: '已通过', date: '2026-04-16', idCard: '320508194811203817', address: '苏州市姑苏区人民路208号', contact: '13813800105' },
  { id: 'A006', name: '孙月琴', age: 84, status: '复评中', date: '2026-04-16', idCard: '320602194204118529', address: '南通市崇川区工农路166号', contact: '13813800106' },
  { id: 'A007', name: '朱爱华', age: 75, status: '待评估', date: '2026-04-15', idCard: '320706195102024611', address: '连云港市海州区通灌南路99号', contact: '13813800107' },
  { id: 'A008', name: '何金凤', age: 83, status: '已通过', date: '2026-04-15', idCard: '320803194310154266', address: '淮安市清江浦区北京北路56号', contact: '13813800108' },
  { id: 'A009', name: '马桂芝', age: 80, status: '待评估', date: '2026-04-14', idCard: '320902194602281934', address: '盐城市亭湖区解放南路68号', contact: '13813800109' },
  { id: 'A010', name: '顾美珍', age: 77, status: '已通过', date: '2026-04-14', idCard: '321002194901134528', address: '扬州市广陵区文昌中路188号', contact: '13813800110' },
  { id: 'A011', name: '蒋玉梅', age: 85, status: '复评中', date: '2026-04-13', idCard: '321102194108083412', address: '镇江市京口区解放路77号', contact: '13813800111' },
  { id: 'A012', name: '曹兰英', age: 74, status: '已通过', date: '2026-04-13', idCard: '321202195203173649', address: '泰州市海陵区青年南路101号', contact: '13813800112' },
  { id: 'A013', name: '谢秀英', age: 82, status: '待评估', date: '2026-04-12', idCard: '321302194404267820', address: '宿迁市宿城区洪泽湖路66号', contact: '13813800113' },
  { id: 'A014', name: '韩凤兰', age: 79, status: '已通过', date: '2026-04-12', idCard: '320104194702194425', address: '南京市秦淮区中山东路212号', contact: '13813800114' },
  { id: 'A015', name: '丁月华', age: 76, status: '复评中', date: '2026-04-11', idCard: '320213195001306517', address: '无锡市滨湖区梁清路55号', contact: '13813800115' },
  { id: 'A016', name: '吕秀珍', age: 88, status: '待评估', date: '2026-04-11', idCard: '320311193803157236', address: '徐州市云龙区和平大道90号', contact: '13813800116' },
  { id: 'A017', name: '彭淑华', age: 73, status: '已通过', date: '2026-04-10', idCard: '320404195305193628', address: '常州市钟楼区勤业路128号', contact: '13813800117' },
  { id: 'A018', name: '严桂芳', age: 81, status: '待评估', date: '2026-04-10', idCard: '320507194507253941', address: '苏州市吴中区东吴北路36号', contact: '13813800118' },
  { id: 'A019', name: '邵玉珍', age: 84, status: '复评中', date: '2026-04-09', idCard: '320611194206182354', address: '南通市通州区建设路98号', contact: '13813800119' },
  { id: 'A020', name: '陶爱琴', age: 78, status: '已通过', date: '2026-04-09', idCard: '320703194812047125', address: '连云港市赣榆区青口镇黄海路39号', contact: '13813800120' },
];

const serviceData = [
  { id: 'S001', name: '王桂兰', service: '居家生活照护', date: '2026-04-18', status: '进行中', nurse: '周海燕', hours: 36 },
  { id: 'S002', name: '陈国华', service: '失能康复护理', date: '2026-04-18', status: '已完成', nurse: '许红梅', hours: 48 },
  { id: 'S003', name: '李素琴', service: '压疮护理', date: '2026-04-17', status: '进行中', nurse: '何晓梅', hours: 24 },
  { id: 'S004', name: '周秀兰', service: '居家助浴服务', date: '2026-04-17', status: '已完成', nurse: '秦玉兰', hours: 12 },
  { id: 'S005', name: '吴德芳', service: '鼻饲护理', date: '2026-04-16', status: '进行中', nurse: '蒋莉', hours: 28 },
  { id: 'S006', name: '孙月琴', service: '失能康复训练', date: '2026-04-16', status: '已完成', nurse: '冯晓琴', hours: 42 },
  { id: 'S007', name: '朱爱华', service: '翻身拍背护理', date: '2026-04-15', status: '进行中', nurse: '沈小梅', hours: 18 },
  { id: 'S008', name: '何金凤', service: '居家巡视照护', date: '2026-04-15', status: '已完成', nurse: '赵春燕', hours: 16 },
  { id: 'S009', name: '马桂芝', service: '导尿管护理', date: '2026-04-14', status: '进行中', nurse: '顾婷婷', hours: 20 },
  { id: 'S010', name: '顾美珍', service: '认知障碍照护', date: '2026-04-14', status: '已完成', nurse: '潘海燕', hours: 30 },
  { id: 'S011', name: '蒋玉梅', service: '失禁护理', date: '2026-04-13', status: '进行中', nurse: '周雪梅', hours: 22 },
  { id: 'S012', name: '曹兰英', service: '居家上门护理', date: '2026-04-13', status: '已完成', nurse: '陈丽娟', hours: 26 },
  { id: 'S013', name: '谢秀英', service: '压疮换药护理', date: '2026-04-12', status: '进行中', nurse: '刘巧云', hours: 19 },
  { id: 'S014', name: '韩凤兰', service: '康复步行训练', date: '2026-04-12', status: '已完成', nurse: '马小凤', hours: 34 },
  { id: 'S015', name: '丁月华', service: '生活照料服务', date: '2026-04-11', status: '进行中', nurse: '郑海燕', hours: 21 },
  { id: 'S016', name: '吕秀珍', service: '鼻胃管护理', date: '2026-04-11', status: '已完成', nurse: '谢晓琴', hours: 32 },
  { id: 'S017', name: '彭淑华', service: '肢体功能训练', date: '2026-04-10', status: '进行中', nurse: '韩艳', hours: 25 },
  { id: 'S018', name: '严桂芳', service: '夜间照护服务', date: '2026-04-10', status: '已完成', nurse: '吕慧芳', hours: 40 },
  { id: 'S019', name: '邵玉珍', service: '居家助餐服务', date: '2026-04-09', status: '进行中', nurse: '陶丽华', hours: 14 },
  { id: 'S020', name: '陶爱琴', service: '失能日常照护', date: '2026-04-09', status: '已完成', nurse: '吴海霞', hours: 36 },
];

const institutionData = [
  { id: 'I001', name: '南京市鼓楼区康宁护理院', type: '定点护理机构', beds: 180, rating: 4.8, address: '南京市鼓楼区中央路18号', contact: '025-86620001' },
  { id: 'I002', name: '苏州市姑苏区康复护理中心', type: '定点护理机构', beds: 210, rating: 4.9, address: '苏州市姑苏区人民路16号', contact: '0512-65880035' },
  { id: 'I003', name: '盐城市亭湖区德馨护理院', type: '定点护理机构', beds: 140, rating: 4.7, address: '盐城市亭湖区建军东路121号', contact: '0515-88360016' },
  { id: 'I004', name: '无锡市梁溪区颐康护理院', type: '定点护理机构', beds: 160, rating: 4.7, address: '无锡市梁溪区健康路55号', contact: '0510-82350018' },
  { id: 'I005', name: '徐州市泉山区安泰护理中心', type: '定点护理机构', beds: 188, rating: 4.6, address: '徐州市泉山区湖北路72号', contact: '0516-83860022' },
  { id: 'I006', name: '常州市天宁区福寿护理院', type: '定点护理机构', beds: 132, rating: 4.5, address: '常州市天宁区劳动中路98号', contact: '0519-86620019' },
  { id: 'I007', name: '南通市崇川区康悦护理中心', type: '定点护理机构', beds: 176, rating: 4.8, address: '南通市崇川区人民中路126号', contact: '0513-89070015' },
  { id: 'I008', name: '连云港市海州区仁和护理院', type: '定点护理机构', beds: 120, rating: 4.4, address: '连云港市海州区海连中路88号', contact: '0518-85630027' },
  { id: 'I009', name: '淮安市清江浦区安康护理院', type: '定点护理机构', beds: 148, rating: 4.6, address: '淮安市清江浦区北京南路36号', contact: '0517-83990031' },
  { id: 'I010', name: '扬州市广陵区颐养护理中心', type: '定点护理机构', beds: 154, rating: 4.7, address: '扬州市广陵区运河西路66号', contact: '0514-87880026' },
  { id: 'I011', name: '镇江市京口区康复护理院', type: '定点护理机构', beds: 168, rating: 4.8, address: '镇江市京口区学府路58号', contact: '0511-85270013' },
  { id: 'I012', name: '泰州市海陵区同心护理院', type: '定点护理机构', beds: 142, rating: 4.5, address: '泰州市海陵区青年北路80号', contact: '0523-86250017' },
  { id: 'I013', name: '宿迁市宿城区惠民护理中心', type: '定点护理机构', beds: 138, rating: 4.5, address: '宿迁市宿城区洪泽湖西路39号', contact: '0527-84360029' },
  { id: 'I014', name: '南京市建邺区怡宁护理院', type: '定点护理机构', beds: 190, rating: 4.9, address: '南京市建邺区江东中路88号', contact: '025-87770012' },
  { id: 'I015', name: '苏州市吴中区乐龄护理院', type: '定点护理机构', beds: 158, rating: 4.6, address: '苏州市吴中区东吴南路109号', contact: '0512-67010025' },
  { id: 'I016', name: '无锡市滨湖区仁爱护理中心', type: '定点护理机构', beds: 126, rating: 4.4, address: '无锡市滨湖区太湖大道101号', contact: '0510-85820033' },
  { id: 'I017', name: '徐州市鼓楼区福康护理院', type: '定点护理机构', beds: 150, rating: 4.6, address: '徐州市鼓楼区复兴北路45号', contact: '0516-87650041' },
  { id: 'I018', name: '南通市通州区安泰护理院', type: '定点护理机构', beds: 144, rating: 4.5, address: '南通市通州区建设路120号', contact: '0513-86590038' },
  { id: 'I019', name: '盐城市盐都区康乐护理院', type: '定点护理机构', beds: 136, rating: 4.4, address: '盐城市盐都区世纪大道128号', contact: '0515-88490021' },
  { id: 'I020', name: '扬州市邗江区安馨护理中心', type: '定点护理机构', beds: 162, rating: 4.7, address: '扬州市邗江区文汇西路59号', contact: '0514-87910018' },
];

const paymentData = [
  { id: 'P001', name: '王桂兰', amount: 2860, month: '2026-04', status: '已发放', bank: '中国工商银行', account: '6212****3481' },
  { id: 'P002', name: '陈国华', amount: 3200, month: '2026-04', status: '已发放', bank: '中国建设银行', account: '6227****5814' },
  { id: 'P003', name: '李素琴', amount: 2480, month: '2026-04', status: '已发放', bank: '中国银行', account: '6216****1920' },
  { id: 'P004', name: '周秀兰', amount: 2160, month: '2026-04', status: '已发放', bank: '中国农业银行', account: '6228****4416' },
  { id: 'P005', name: '吴德芳', amount: 3020, month: '2026-04', status: '已发放', bank: '交通银行', account: '6222****1508' },
  { id: 'P006', name: '孙月琴', amount: 3380, month: '2026-04', status: '已发放', bank: '中国邮政储蓄银行', account: '6210****6271' },
  { id: 'P007', name: '朱爱华', amount: 2250, month: '2026-04', status: '已发放', bank: '中国银行', account: '6216****3395' },
  { id: 'P008', name: '何金凤', amount: 2760, month: '2026-04', status: '已发放', bank: '中国建设银行', account: '6227****2604' },
  { id: 'P009', name: '马桂芝', amount: 2430, month: '2026-04', status: '已发放', bank: '江苏银行', account: '6229****1932' },
  { id: 'P010', name: '顾美珍', amount: 2940, month: '2026-04', status: '已发放', bank: '中国工商银行', account: '6212****5487' },
  { id: 'P011', name: '蒋玉梅', amount: 2680, month: '2026-04', status: '已发放', bank: '中国农业银行', account: '6228****3246' },
  { id: 'P012', name: '曹兰英', amount: 2580, month: '2026-04', status: '已发放', bank: '中国邮政储蓄银行', account: '6210****8412' },
  { id: 'P013', name: '谢秀英', amount: 2310, month: '2026-04', status: '已发放', bank: '交通银行', account: '6222****9517' },
  { id: 'P014', name: '韩凤兰', amount: 2870, month: '2026-04', status: '已发放', bank: '中国银行', account: '6216****4031' },
  { id: 'P015', name: '丁月华', amount: 2520, month: '2026-04', status: '已发放', bank: '江苏银行', account: '6229****6024' },
  { id: 'P016', name: '吕秀珍', amount: 3460, month: '2026-04', status: '已发放', bank: '中国建设银行', account: '6227****7320' },
  { id: 'P017', name: '彭淑华', amount: 2400, month: '2026-04', status: '已发放', bank: '中国工商银行', account: '6212****1746' },
  { id: 'P018', name: '严桂芳', amount: 3180, month: '2026-04', status: '已发放', bank: '中国农业银行', account: '6228****4950' },
  { id: 'P019', name: '邵玉珍', amount: 2650, month: '2026-04', status: '已发放', bank: '交通银行', account: '6222****2874' },
  { id: 'P020', name: '陶爱琴', amount: 2780, month: '2026-04', status: '已发放', bank: '中国邮政储蓄银行', account: '6210****5683' },
];

export default function LongTermCare({ userAgency }: LongTermCareProps) {
  const isProvince = getAgencyLevel(userAgency) === 'province';
  const visibleTabs = isProvince ? provinceTabs : cityTabs;
  const [activeTab, setActiveTab] = useState(visibleTabs[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [assessments, setAssessments] = useState(assessmentData);
  const [services, setServices] = useState(serviceData);
  const [institutions, setInstitutions] = useState(institutionData);
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
    if (type === 'assessment') setAssessments((prev) => prev.filter((item) => item.id !== id));
    if (type === 'service') setServices((prev) => prev.filter((item) => item.id !== id));
    if (type === 'institution') setInstitutions((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuery = () => {
    const result = assessments.find((item) => item.name.includes(searchTerm) || item.id.includes(searchTerm) || item.idCard.includes(searchTerm));
    setQueryResult(result || { msg: '未找到相关记录' });
  };

  const renderModal = () => {
    if (!modalOpen) return null;
    const isView = modalType === 'view';
    const title = modalType === 'add' ? '新增' : modalType === 'edit' ? '编辑' : '查看';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">
              {title}
              {activeTab === 'assessment' ? '评估申请' : activeTab === 'service' ? '护理服务' : activeTab === 'institutions' ? '护理机构' : '支付记录'}
            </h3>
            <button onClick={closeModal} className="rounded p-1 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">名称</label>
              <input type="text" defaultValue={selectedItem?.name || ''} disabled={isView} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
            </div>
            {activeTab === 'assessment' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium">年龄</label>
                  <input type="number" defaultValue={selectedItem?.age || ''} disabled={isView} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">身份证号</label>
                  <input type="text" defaultValue={selectedItem?.idCard || ''} disabled={isView} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
                </div>
              </>
            )}
            {activeTab === 'service' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium">服务类型</label>
                  <input type="text" defaultValue={selectedItem?.service || ''} disabled={isView} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">护理人员</label>
                  <input type="text" defaultValue={selectedItem?.nurse || ''} disabled={isView} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
                </div>
              </>
            )}
            {activeTab === 'institutions' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium">机构类型</label>
                  <input type="text" defaultValue={selectedItem?.type || ''} disabled={isView} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">联系电话</label>
                  <input type="text" defaultValue={selectedItem?.contact || ''} disabled={isView} className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50" />
                </div>
              </>
            )}
            {activeTab === 'payment' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium">发放月份</label>
                  <input type="text" defaultValue={selectedItem?.month || ''} disabled className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">金额</label>
                  <input type="text" defaultValue={selectedItem?.amount || ''} disabled className="w-full rounded-lg border px-3 py-2 bg-gray-50" />
                </div>
              </>
            )}
          </div>
          {!isView && isProvince && (
            <div className="mt-6 flex gap-3">
              <button onClick={closeModal} className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50">取消</button>
              <button onClick={closeModal} className="flex-1 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">保存</button>
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <span>待遇保障司</span>
        <span>/</span>
        <span className="text-gray-800">长期护理保险</span>
      </div>
      <div className="flex gap-2 border-b border-gray-200">
        {visibleTabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-600 hover:text-gray-800'}`}>
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-h-[400px]">
        {activeTab === 'assessment' && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="搜索申请人姓名或编号" className="w-full rounded-lg border py-2 pl-10 pr-4" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              {isProvince ? (
                <button onClick={() => openModal('add')} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700">
                  <Plus className="h-4 w-4" />
                  新增申请
                </button>
              ) : (
                <div className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-700">地市账号仅可查看长期护理保险数据</div>
              )}
            </div>
            <div className="rounded-lg border bg-white">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">编号</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">姓名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">年龄</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">日期</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.filter((item) => item.name.includes(searchTerm) || item.id.includes(searchTerm)).map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-4 py-3 text-sm">{item.id}</td>
                      <td className="px-4 py-3 text-sm">{item.name}</td>
                      <td className="px-4 py-3 text-sm">{item.age}岁</td>
                      <td className="px-4 py-3 text-sm">{item.date}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs ${item.status === '已通过' ? 'bg-green-100 text-green-700' : item.status === '待评估' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{item.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openModal('view', item)} className="text-cyan-600 hover:underline"><Eye className="h-4 w-4" /></button>
                          {isProvince && <><button onClick={() => openModal('edit', item)} className="text-blue-600 hover:underline"><Edit2 className="h-4 w-4" /></button><button onClick={() => handleDelete(item.id, 'assessment')} className="text-red-600 hover:underline"><Trash2 className="h-4 w-4" /></button></>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'service' && (
          <div className="space-y-4">
            <div className="flex justify-end">{isProvince && <button onClick={() => openModal('add')} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"><Plus className="h-4 w-4" />新增服务</button>}</div>
            <div className="grid grid-cols-2 gap-4">
              {services.map((item) => (
                <div key={item.id} className="rounded-lg border bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium">{item.name}</h4>
                    <span className={`rounded-full px-2 py-1 text-xs ${item.status === '已完成' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{item.status}</span>
                  </div>
                  <p className="mb-2 text-sm text-gray-600">服务类型: {item.service}</p>
                  <p className="text-sm text-gray-500">护理人员: {item.nurse}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => openModal('view', item)} className="text-cyan-600"><Eye className="h-4 w-4" /></button>
                    {isProvince && <><button onClick={() => openModal('edit', item)} className="text-blue-600"><Edit2 className="h-4 w-4" /></button><button onClick={() => handleDelete(item.id, 'service')} className="text-red-600"><Trash2 className="h-4 w-4" /></button></>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'institutions' && (
          <div className="space-y-4">
            <div className="flex justify-end">{isProvince && <button onClick={() => openModal('add')} className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"><Plus className="h-4 w-4" />新增机构</button>}</div>
            <div className="grid grid-cols-2 gap-4">
              {institutions.map((item) => (
                <div key={item.id} className="rounded-lg border bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium">{item.name}</h4>
                    <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs text-cyan-700">{item.type}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>床位: {item.beds}张 | 评分: {item.rating}分</p>
                    <p>地址: {item.address}</p>
                    <p>电话: {item.contact}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => openModal('view', item)} className="text-cyan-600"><Eye className="h-4 w-4" /></button>
                    {isProvince && <><button onClick={() => openModal('edit', item)} className="text-blue-600"><Edit2 className="h-4 w-4" /></button><button onClick={() => handleDelete(item.id, 'institution')} className="text-red-600"><Trash2 className="h-4 w-4" /></button></>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="rounded-lg border bg-white">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">姓名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">月份</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">金额</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {paymentData.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-3 text-sm">{item.name}</td>
                    <td className="px-4 py-3 text-sm">{item.month}</td>
                    <td className="px-4 py-3 text-sm font-medium text-cyan-600">¥{item.amount}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">{item.status}</span></td>
                    <td className="px-4 py-3"><button onClick={() => openModal('view', item)} className="text-cyan-600 hover:underline">查看详情</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'query' && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <input type="text" placeholder="输入身份证号或评估编号" className="flex-1 rounded-lg border px-4 py-2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button onClick={handleQuery} className="rounded-lg bg-cyan-600 px-6 py-2 text-white hover:bg-cyan-700">查询</button>
            </div>
            {queryResult && (
              <div className="rounded-lg border bg-white p-6">
                {queryResult.msg ? (
                  <p className="text-center text-gray-500">{queryResult.msg}</p>
                ) : (
                  <div className="space-y-3">
                    <h4 className="text-lg font-bold">查询结果</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p><span className="text-gray-500">姓名:</span> {queryResult.name}</p>
                      <p><span className="text-gray-500">年龄:</span> {queryResult.age}岁</p>
                      <p><span className="text-gray-500">状态:</span> {queryResult.status}</p>
                      <p><span className="text-gray-500">申请日期:</span> {queryResult.date}</p>
                      <p><span className="text-gray-500">身份证号:</span> {queryResult.idCard}</p>
                      <p><span className="text-gray-500">联系电话:</span> {queryResult.contact}</p>
                    </div>
                    <p className="text-sm"><span className="text-gray-500">地址:</span> {queryResult.address}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
      {renderModal()}
    </div>
  );
}
