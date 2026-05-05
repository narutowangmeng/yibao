import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Bell,
  Pill,
  Eye,
  X,
  Check,
  Trash2,
  Stethoscope,
  Syringe,
  ShieldCheck,
  Package,
  Receipt,
  Search,
} from 'lucide-react';
import type { UserRole } from '../../types/roles';

type PortalMode = 'hospital' | 'pharmacy';
type SettlementStatus = '待上传' | '已上传' | '已审核';
type ReviewStatus = '待审方' | '已通过' | '已退回';
type AlertLevel = '预警' | '严重';
type AlertStatus = '待处理' | '已处理';

interface InstitutionPortalProps {
  portalRole?: UserRole;
}

interface ActionFeedback {
  tone: 'success' | 'warning' | 'info';
  text: string;
}

type BusinessActionType = 'upload' | 'claim' | 'reconcile';

interface BusinessModalState {
  type: BusinessActionType;
  visible: boolean;
}

type PharmacyActionType = 'receive' | 'review' | 'dispense' | 'settle' | 'special' | 'reconcile' | 'stock';

interface PharmacyModalState {
  type: PharmacyActionType;
  visible: boolean;
  recordId: string | null;
}

interface SettlementItem {
  id: string;
  patient: string;
  idCard: string;
  visitType: string;
  department: string;
  diagnosis: string;
  insuranceType: string;
  totalAmount: number;
  fundAmount: number;
  personalAmount: number;
  status: SettlementStatus;
  operator: string;
  date: string;
}

interface ClaimBatchItem {
  id: string;
  institution: string;
  settlementCount: number;
  insuranceType: string;
  totalAmount: number;
  claimAmount: number;
  submitter: string;
  submitTime: string;
  status: string;
  returnReason: string;
}

interface ReconcileItem {
  id: string;
  period: string;
  institution: string;
  claimAmount: number;
  confirmedAmount: number;
  diffAmount: number;
  diffType: string;
  confirmer: string;
  confirmTime: string;
  status: string;
}

interface WorkItem {
  id: string;
  patient: string;
  department: string;
  diagnosis: string;
  doctor: string;
  task: string;
  status: string;
  time: string;
}

interface PrescriptionItem {
  id: string;
  patient: string;
  idCard: string;
  doctor: string;
  department: string;
  diagnosis: string;
  itemCount: number;
  amount: number;
  destination: string;
  status: ReviewStatus;
}

interface AlertItem {
  id: string;
  type: string;
  patient: string;
  department: string;
  message: string;
  ruleSource: string;
  level: AlertLevel;
  status: AlertStatus;
}

interface PharmacyOrder {
  id: string;
  prescriptionNo: string;
  patient: string;
  idCard: string;
  sourceHospital: string;
  category: string;
  drugName: string;
  amount: number;
  pharmacist: string;
  status: string;
  date: string;
}

interface PharmacyReviewItem {
  id: string;
  prescriptionNo: string;
  patient: string;
  idCard: string;
  drugName: string;
  reviewRule: string;
  pharmacist: string;
  reviewTime: string;
  status: string;
  reviewOpinion: string;
}

interface PharmacyDispenseItem {
  id: string;
  pickupNo: string;
  patient: string;
  idCard: string;
  drugName: string;
  quantity: string;
  dispenseWindow: string;
  dispenser: string;
  pickupMethod: string;
  status: string;
  dispenseTime: string;
}

interface PharmacySettlementItem {
  id: string;
  settlementNo: string;
  patient: string;
  insuranceType: string;
  category: string;
  totalAmount: number;
  fundAmount: number;
  personalAmount: number;
  cashier: string;
  status: string;
  settlementTime: string;
}

interface PharmacySpecialItem {
  id: string;
  registerNo: string;
  patient: string;
  specialDrug: string;
  treatmentType: string;
  hospital: string;
  approvalStatus: string;
  materialStatus: string;
  registrar: string;
  registerTime: string;
}

interface PharmacyReconcileItem {
  id: string;
  period: string;
  institution: string;
  settlementCount: number;
  settlementAmount: number;
  returnedAmount: number;
  diffAmount: number;
  bankStatus: string;
  operator: string;
  status: string;
}

interface DrugStock {
  id: string;
  drugName: string;
  spec: string;
  traceCode: string;
  batchNo: string;
  manufacturer: string;
  stock: number;
  expireDate: string;
  status: string;
}

const hospitalTabs = [
  { id: 'settlement', label: '结算清单', icon: FileText },
  { id: 'claim', label: '费用申报', icon: Upload },
  { id: 'reconcile', label: '对账确认', icon: CheckCircle },
  { id: 'prescription', label: '处方流转', icon: Pill },
  { id: 'alerts', label: '智能提醒', icon: Bell },
] as const;

const pharmacyTabs = [
  { id: 'receive', label: '处方接收', icon: FileText },
  { id: 'review', label: '药师审方', icon: ShieldCheck },
  { id: 'dispense', label: '调剂发药', icon: Pill },
  { id: 'settle', label: '医保结算', icon: Receipt },
  { id: 'special', label: '特药登记', icon: Bell },
  { id: 'stock', label: '库存追溯', icon: Package },
  { id: 'reconcile', label: '对账回盘', icon: CheckCircle },
] as const;

const patientNames = ['张雨晴', '李书涵', '王思远', '周语桐', '许文博', '陆书怡', '韩宁', '唐悦', '赵静宜', '高宁', '彭雪', '曹颖', '沈知夏', '顾晨曦', '苏子墨', '程若安', '梁嘉禾', '秦以宁', '邵景澄', '蒋安然'];
const idCards = ['320102198903152415', '320104199210083524', '320106198807214516', '320111199407263526', '320302198805204517', '320507200812163214', '320802199511136247', '321102199209047523', '321002198911305624', '320582198604126711', '320684199808217128', '321003197912202226', '320924198910162344', '320701198711234515', '320411199304286722', '320381198908187746', '320621199901054234', '321202198612116419', '321181199112087813', '320922200106145928'];
const departments = ['心内科', '内分泌科', '骨科', '儿科', '妇科', '肿瘤科', '神经内科', '肾内科', '风湿免疫科', '普外科'];
const diagnoses = ['高血压三级', '2型糖尿病', '膝关节损伤', '急性支气管炎', '子宫肌瘤', '乳腺恶性肿瘤门特', '脑卒中恢复期', '慢性肾功能不全', '类风湿关节炎', '胆囊结石术后'];
const insuranceTypes = ['职工医保', '城乡居民医保', '学生医保', '灵活就业医保', '大病保险'];
const doctors = ['王哲', '李慧', '张凯', '陈静', '许峰', '蒋晨', '周浩', '叶青', '郭然', '宋宇'];
const pharmacists = ['周琪', '蒋诚', '叶倩', '陈瑶', '顾川'];
const hospitals = ['江苏省人民医院', '南京鼓楼医院', '苏州大学附属第一医院', '无锡市人民医院', '徐州医科大学附属医院'];
const pharmacies = ['南京国大双通道药店', '苏州雷允上双通道药房', '无锡九州大药房', '常州百姓人家药房', '南通医保特药药房'];
const drugs = ['阿托伐他汀钙片', '门冬胰岛素注射液', '曲妥珠单抗注射液', '阿达木单抗注射液', '利拉鲁肽注射液', '瑞舒伐他汀钙片', '奥希替尼片', '甲磺酸伊马替尼片', '托珠单抗注射液', '依折麦布片'];
const manufacturers = ['江苏豪森药业', '正大天晴药业', '齐鲁制药', '恒瑞医药', '扬子江药业'];

const formatDate = (index: number) => `2026-04-${String(28 - (index % 10)).padStart(2, '0')}`;
const formatTime = (index: number) => `${formatDate(index)} ${String(8 + (index % 9)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}`;
const settlementStatuses: SettlementStatus[] = ['待上传', '已上传', '已审核'];
const reviewStatuses: ReviewStatus[] = ['待审方', '已通过', '已退回'];
const alertLevels: AlertLevel[] = ['预警', '严重'];
const alertStatuses: AlertStatus[] = ['待处理', '已处理'];

const hospitalSettlementsSeed: SettlementItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `ST${String(index + 1).padStart(3, '0')}`,
  patient: patientNames[index],
  idCard: idCards[index],
  visitType: index % 3 === 0 ? '住院' : index % 3 === 1 ? '门诊慢特病' : '普通门诊',
  department: departments[index % departments.length],
  diagnosis: diagnoses[index % diagnoses.length],
  insuranceType: insuranceTypes[index % insuranceTypes.length],
  totalAmount: 1800 + index * 430,
  fundAmount: 1200 + index * 310,
  personalAmount: 600 + index * 120,
  status: settlementStatuses[index % settlementStatuses.length],
  operator: doctors[index % doctors.length],
  date: formatDate(index),
}));

const claimBatchSeed: ClaimBatchItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `SB${String(index + 1).padStart(3, '0')}`,
  institution: index % 2 === 0 ? '南京市第一医院' : '江苏省人民医院',
  settlementCount: 18 + index,
  insuranceType: insuranceTypes[index % insuranceTypes.length],
  totalAmount: 86000 + index * 5200,
  claimAmount: 64200 + index * 4100,
  submitter: doctors[index % doctors.length],
  submitTime: formatTime(index),
  status: ['待提交', '已提交', '退回修改', '医保受理'][index % 4],
  returnReason: ['无', '缺少护理回传', '门特备案信息缺失', '特药审方说明待补充'][index % 4],
}));

const reconcileSeed: ReconcileItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `DZ${String(index + 1).padStart(3, '0')}`,
  period: `2026-${String((index % 4) + 1).padStart(2, '0')}月下旬`,
  institution: index % 2 === 0 ? '南京市第一医院' : '江苏省人民医院',
  claimAmount: 128000 + index * 6300,
  confirmedAmount: 126500 + index * 5980,
  diffAmount: 1500 + (index % 5) * 320,
  diffType: ['目录外费用剔除', '重复收费核减', '高值耗材限价差异', '门特待遇差异', '无差异'][index % 5],
  confirmer: doctors[(index + 2) % doctors.length],
  confirmTime: formatTime(index),
  status: ['待确认', '差异处理中', '已确认', '已回退'][index % 4],
}));

const physicianSeed: WorkItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `YS${String(index + 1).padStart(3, '0')}`,
  patient: patientNames[index],
  department: departments[index % departments.length],
  diagnosis: diagnoses[index % diagnoses.length],
  doctor: doctors[index % doctors.length],
  task: ['补录病程记录', '确认门特外配', '提交住院结算清单', '审核术前检查套餐', '完成双通道特药备案'][index % 5],
  status: ['待处理', '处理中', '待提交', '已完成'][index % 4],
  time: formatTime(index),
}));

const nurseSeed: WorkItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `HS${String(index + 1).padStart(3, '0')}`,
  patient: patientNames[index],
  department: departments[(index + 2) % departments.length],
  diagnosis: diagnoses[(index + 2) % diagnoses.length],
  doctor: doctors[(index + 3) % doctors.length],
  task: ['回传输液执行单', '上传护理记录单', '核对康复治疗次数', '确认耗材使用', '补录生命体征记录'][index % 5],
  status: ['待执行', '处理中', '待核对', '已完成'][index % 4],
  time: formatTime(index),
}));

const pharmacistSeed: WorkItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `YSH${String(index + 1).padStart(3, '0')}`,
  patient: patientNames[index],
  department: departments[(index + 4) % departments.length],
  diagnosis: diagnoses[(index + 4) % diagnoses.length],
  doctor: doctors[(index + 5) % doctors.length],
  task: ['双通道特药审核', '围术期抗菌药复核', '生物制剂审方', '门特外配确认', '目录外药品说明'][index % 5],
  status: ['待审方', '处理中', '已完成'][index % 3],
  time: formatTime(index),
}));

const prescriptionSeed: PrescriptionItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `RX${String(index + 1).padStart(3, '0')}`,
  patient: patientNames[index],
  idCard: idCards[index],
  doctor: doctors[index % doctors.length],
  department: departments[index % departments.length],
  diagnosis: diagnoses[index % diagnoses.length],
  itemCount: 2 + (index % 5),
  amount: 180 + index * 56,
  destination: pharmacies[index % pharmacies.length],
  status: reviewStatuses[index % reviewStatuses.length],
}));

const alertSeed: AlertItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `AL${String(index + 1).padStart(3, '0')}`,
  type: ['超量用药', '重复收费', '规则拦截', '目录外收费', '诊疗频次异常'][index % 5],
  patient: patientNames[index],
  department: departments[index % departments.length],
  message: ['7日用量超过常规标准', '同日重复开具检查项目', '高值耗材与术式不匹配', '诊疗项目超出目录范围', '慢特病复诊频次异常'][index % 5],
  ruleSource: ['药品规则库', '诊疗项目规则库', '耗材规则库', '门特规则库'][index % 4],
  level: alertLevels[index % alertLevels.length],
  status: alertStatuses[index % alertStatuses.length],
}));

const pharmacyReceiveSeed: PharmacyOrder[] = Array.from({ length: 20 }, (_, index) => ({
  id: `DD${String(index + 1).padStart(3, '0')}`,
  prescriptionNo: `CF202604${String(100 + index).padStart(3, '0')}`,
  patient: patientNames[index],
  idCard: idCards[index],
  sourceHospital: hospitals[index % hospitals.length],
  category: ['双通道特药', '外配处方', '门慢处方', '门特处方'][index % 4],
  drugName: drugs[index % drugs.length],
  amount: 220 + index * 148,
  pharmacist: pharmacists[index % pharmacists.length],
  status: ['待接收', '已接收', '待审方', '待发药'][index % 4],
  date: formatTime(index),
}));

const pharmacyReviewSeed: PharmacyOrder[] = Array.from({ length: 20 }, (_, index) => ({
  ...pharmacyReceiveSeed[index],
  id: `SF${String(index + 1).padStart(3, '0')}`,
  status: ['待审方', '已通过', '已退回'][index % 3],
}));

const pharmacyReviewDetailSeed: PharmacyReviewItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `SF${String(index + 1).padStart(3, '0')}`,
  prescriptionNo: `CF202604${String(100 + index).padStart(3, '0')}`,
  patient: patientNames[index],
  idCard: idCards[index],
  drugName: drugs[index % drugs.length],
  reviewRule: ['重复用药校验', '双通道资格校验', '门特诊断匹配', '超量给药预警'][index % 4],
  pharmacist: pharmacists[index % pharmacists.length],
  reviewTime: formatTime(index),
  status: ['待审方', '已通过', '已退回'][index % 3],
  reviewOpinion: ['待审方', '符合处方流转条件', '缺少门特备案', '处方剂量需复核'][index % 4],
}));

const pharmacyDispenseSeed: PharmacyDispenseItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `FY${String(index + 1).padStart(3, '0')}`,
  pickupNo: `QY${String(300 + index).padStart(4, '0')}`,
  patient: patientNames[index],
  idCard: idCards[index],
  drugName: drugs[index % drugs.length],
  quantity: `${1 + (index % 3)}盒 / ${1 + (index % 2)}支`,
  dispenseWindow: `发药${(index % 4) + 1}号窗`,
  dispenser: pharmacists[index % pharmacists.length],
  pickupMethod: ['窗口自取', '院内配送', '冷链配送'][index % 3],
  status: ['待发药', '已发药', '已取药', '配送中'][index % 4],
  dispenseTime: formatTime(index),
}));

const pharmacySpecialSeed: PharmacySpecialItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `TY${String(index + 1).padStart(3, '0')}`,
  registerNo: `ZY${String(500 + index).padStart(4, '0')}`,
  patient: patientNames[index],
  specialDrug: drugs[(index + 2) % drugs.length],
  treatmentType: ['双通道特药', '门特续方', '肿瘤靶向治疗', '罕见病用药'][index % 4],
  hospital: hospitals[index % hospitals.length],
  approvalStatus: ['待登记', '已登记', '审核退回'][index % 3],
  materialStatus: ['材料齐全', '缺少处方原件', '缺少备案凭证', '待补患者承诺书'][index % 4],
  registrar: pharmacists[index % pharmacists.length],
  registerTime: formatTime(index),
}));

const pharmacySettlementSeed: PharmacySettlementItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `JS${String(index + 1).padStart(3, '0')}`,
  settlementNo: `YBJS${String(800 + index).padStart(5, '0')}`,
  patient: patientNames[index],
  insuranceType: insuranceTypes[index % insuranceTypes.length],
  category: ['双通道特药结算', '外配处方结算', '门慢处方结算', '门特处方结算'][index % 4],
  totalAmount: 600 + index * 210,
  fundAmount: 420 + index * 168,
  personalAmount: 180 + index * 42,
  cashier: pharmacists[index % pharmacists.length],
  status: ['已结算', '待回盘', '已回盘', '结算退回'][index % 4],
  settlementTime: formatTime(index),
}));

const pharmacyReconcileSeed: PharmacyReconcileItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `HP${String(index + 1).padStart(3, '0')}`,
  period: `2026-${String((index % 4) + 1).padStart(2, '0')}月`,
  institution: '南京国大双通道药店',
  settlementCount: 22 + index,
  settlementAmount: 98000 + index * 4500,
  returnedAmount: 96500 + index * 4300,
  diffAmount: 1500 + (index % 5) * 260,
  bankStatus: ['银行已回盘', '待银行回盘', '回盘失败'][index % 3],
  operator: pharmacists[index % pharmacists.length],
  status: ['待核对', '差异处理中', '已确认', '已回退'][index % 4],
}));

const stockSeed: DrugStock[] = Array.from({ length: 20 }, (_, index) => ({
  id: `KC${String(index + 1).padStart(3, '0')}`,
  drugName: drugs[index % drugs.length],
  spec: ['10mg*28片', '40mg/支', '440mg/瓶', '3ml:300IU', '80mg*30片'][index % 5],
  traceCode: `69012345${String(1000 + index)}`,
  batchNo: `JP${202604 + index}`,
  manufacturer: manufacturers[index % manufacturers.length],
  stock: 5 + index * 3,
  expireDate: `2027-${String((index % 9) + 1).padStart(2, '0')}-28`,
  status: index % 5 === 0 ? '近效期预警' : index % 4 === 0 ? '低库存预警' : '库存正常',
}));

const StatCard = ({ title, value, subValue }: { title: string; value: string; subValue: string }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="mt-3 text-2xl font-bold text-gray-800">{value}</p>
    <p className="mt-2 text-xs text-gray-400">{subValue}</p>
  </div>
);

const SectionBlock = ({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) => (
  <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{desc}</p>
      </div>
    </div>
    {children}
  </div>
);

export default function InstitutionPortal({ portalRole = 'institution_hospital' }: InstitutionPortalProps) {
  const [mode, setMode] = useState<PortalMode>('hospital');
  const [hospitalTab, setHospitalTab] = useState<(typeof hospitalTabs)[number]['id']>('settlement');
  const [pharmacyTab, setPharmacyTab] = useState<(typeof pharmacyTabs)[number]['id']>('receive');
  const [searchText, setSearchText] = useState('');
  const [settlements, setSettlements] = useState<SettlementItem[]>(hospitalSettlementsSeed);
  const [claimBatches, setClaimBatches] = useState<ClaimBatchItem[]>(claimBatchSeed);
  const [reconciles, setReconciles] = useState<ReconcileItem[]>(reconcileSeed);
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>(prescriptionSeed);
  const [alerts, setAlerts] = useState<AlertItem[]>(alertSeed);
  const [pharmacyOrders, setPharmacyOrders] = useState<PharmacyOrder[]>(pharmacyReceiveSeed);
  const [pharmacyReviews, setPharmacyReviews] = useState<PharmacyReviewItem[]>(pharmacyReviewDetailSeed);
  const [pharmacyDispenses, setPharmacyDispenses] = useState<PharmacyDispenseItem[]>(pharmacyDispenseSeed);
  const [pharmacySettlements, setPharmacySettlements] = useState<PharmacySettlementItem[]>(pharmacySettlementSeed);
  const [pharmacySpecials, setPharmacySpecials] = useState<PharmacySpecialItem[]>(pharmacySpecialSeed);
  const [pharmacyReconcileRows, setPharmacyReconcileRows] = useState<PharmacyReconcileItem[]>(pharmacyReconcileSeed);
  const [pharmacyStocks, setPharmacyStocks] = useState<DrugStock[]>(stockSeed);
  const [showModal, setShowModal] = useState(false);
  const [currentSettlement, setCurrentSettlement] = useState<SettlementItem | null>(null);
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(null);
  const [businessModal, setBusinessModal] = useState<BusinessModalState>({ type: 'upload', visible: false });
  const [pharmacyModal, setPharmacyModal] = useState<PharmacyModalState>({ type: 'receive', visible: false, recordId: null });
  const [businessForm, setBusinessForm] = useState({
    uploadSettlementNo: 'ST021',
    uploadPatient: '林知夏',
    uploadIdCard: '320106199211083248',
    uploadVisitType: '门诊慢特病',
    uploadDepartment: '内分泌科',
    uploadDiagnosis: '2型糖尿病',
    uploadInsuranceType: '职工医保',
    uploadTotalAmount: '2860',
    uploadFundAmount: '2140',
    uploadOperator: '赵欣',
    uploadRemark: '门诊慢特病结算清单，已完成院内费用复核。',
    claimMonth: '2026-05',
    claimInsuranceType: '职工医保',
    claimSubmitter: '王哲',
    claimContact: '025-83567218',
    claimRemark: '按月度申报规则汇总上传后的结算清单。',
    reconcileBatchId: 'DZ001',
    reconcileHandler: '周琛',
    reconcileResult: '一致',
    reconcileConfirmedAmount: '126500',
    reconcileDiffReason: '',
    reconcileRemark: '与医保中心清算结果核对一致。',
  });

  const [pharmacyForm, setPharmacyForm] = useState({
    receiveId: 'DD021',
    receivePrescriptionNo: 'CF202605201',
    receivePatient: '陈语安',
    receiveDrugName: '阿托伐他汀钙片',
    receiveHospital: '南京鼓楼医院',
    receiveCategory: '双通道特药',
    receivePharmacist: '周琪',
    receiveRemark: '已核验处方流转资格，待药师接收。',
    reviewDecision: '通过',
    reviewOpinion: '处方信息完整，符合调剂要求。',
    reviewPharmacist: '叶倩',
    dispenseStatus: '已发药',
    dispenseWindow: '发药2号窗口',
    dispenseMethod: '窗口自取',
    dispenseOperator: '陈玥',
    settleNo: 'YBJS00821',
    settlePatient: '宋知远',
    settleInsuranceType: '职工医保',
    settleCategory: '双通道特药结算',
    settleTotalAmount: '1680',
    settleFundAmount: '1260',
    settleCashier: '周琪',
    specialRegisterNo: 'ZY0821',
    specialPatient: '顾清和',
    specialDrug: '曲妥珠单抗注射液',
    specialType: '肿瘤靶向治疗',
    specialHospital: '江苏省人民医院',
    specialMaterialStatus: '材料齐全',
    specialRegistrar: '蒋诚',
    pharmacyReconcileId: 'DP001',
    pharmacyReconcileResult: '已确认',
    pharmacyReconcileOperator: '陈玥',
    pharmacyReconcileRemark: '回盘金额与结算清单一致。',
    stockId: 'KC021',
    stockDrugName: '阿达木单抗注射液',
    stockSpec: '40mg/0.8ml',
    stockTraceCode: '690123451021',
    stockBatchNo: 'JP202625',
    stockManufacturer: '恒瑞医药',
    stockQuantity: '36',
    stockExpireDate: '2027-12-31',
    stockStatus: '库存正常',
  });

  useEffect(() => {
    const search = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const hashMode = search.get('mode');
    if (hashMode === 'pharmacy') {
      setMode('pharmacy');
      return;
    }
    if (portalRole === 'institution_pharmacy') {
      setMode('pharmacy');
      return;
    }
    setMode('hospital');
  }, [portalRole]);

  useEffect(() => {
    if (!actionFeedback) return undefined;
    const timer = window.setTimeout(() => setActionFeedback(null), 2600);
    return () => window.clearTimeout(timer);
  }, [actionFeedback]);

  const headerTitle = mode === 'hospital' ? '医疗机构门户 / 医院端' : '医疗机构门户 / 药店端';

  const filteredSettlements = useMemo(() => {
    if (!searchText.trim()) return settlements;
    return settlements.filter((item) => [item.id, item.patient, item.idCard, item.department, item.diagnosis].some((field) => field.includes(searchText)));
  }, [searchText, settlements]);

  const filteredClaimBatches = useMemo(() => {
    if (!searchText.trim()) return claimBatches;
    return claimBatches.filter((item) =>
      [item.id, item.institution, item.insuranceType, item.status, item.submitter, item.returnReason].some((field) => field.includes(searchText)),
    );
  }, [claimBatches, searchText]);

  const filteredReconciles = useMemo(() => {
    if (!searchText.trim()) return reconciles;
    return reconciles.filter((item) =>
      [item.id, item.period, item.institution, item.diffType, item.status, item.confirmer].some((field) => field.includes(searchText)),
    );
  }, [reconciles, searchText]);

  const filteredPrescriptions = useMemo(() => {
    if (!searchText.trim()) return prescriptions;
    return prescriptions.filter((item) => [item.id, item.patient, item.idCard, item.department, item.diagnosis, item.destination].some((field) => field.includes(searchText)));
  }, [searchText, prescriptions]);

  const filteredAlerts = useMemo(() => {
    if (!searchText.trim()) return alerts;
    return alerts.filter((item) => [item.id, item.patient, item.department, item.type, item.message].some((field) => field.includes(searchText)));
  }, [searchText, alerts]);

  const filterOrders = (rows: PharmacyOrder[]) => {
    if (!searchText.trim()) return rows;
    return rows.filter((item) =>
      [item.id, item.prescriptionNo, item.patient, item.idCard, item.sourceHospital, item.drugName, item.category].some((field) => field.includes(searchText)),
    );
  };

  const filterReviews = (rows: PharmacyReviewItem[]) => {
    if (!searchText.trim()) return rows;
    return rows.filter((item) =>
      [item.id, item.prescriptionNo, item.patient, item.idCard, item.drugName, item.reviewRule, item.status, item.reviewOpinion].some((field) =>
        field.includes(searchText),
      ),
    );
  };

  const filterDispenses = (rows: PharmacyDispenseItem[]) => {
    if (!searchText.trim()) return rows;
    return rows.filter((item) =>
      [item.id, item.pickupNo, item.patient, item.idCard, item.drugName, item.dispenseWindow, item.pickupMethod, item.status].some((field) =>
        field.includes(searchText),
      ),
    );
  };

  const filterSettlements = (rows: PharmacySettlementItem[]) => {
    if (!searchText.trim()) return rows;
    return rows.filter((item) =>
      [item.id, item.settlementNo, item.patient, item.insuranceType, item.category, item.cashier, item.status].some((field) =>
        field.includes(searchText),
      ),
    );
  };

  const filterSpecials = (rows: PharmacySpecialItem[]) => {
    if (!searchText.trim()) return rows;
    return rows.filter((item) =>
      [item.id, item.registerNo, item.patient, item.specialDrug, item.treatmentType, item.hospital, item.approvalStatus, item.materialStatus].some(
        (field) => field.includes(searchText),
      ),
    );
  };

  const filterReconciles = (rows: PharmacyReconcileItem[]) => {
    if (!searchText.trim()) return rows;
    return rows.filter((item) =>
      [item.id, item.period, item.institution, item.bankStatus, item.operator, item.status].some((field) => field.includes(searchText)),
    );
  };

  const filterStocks = (rows: DrugStock[]) => {
    if (!searchText.trim()) return rows;
    return rows.filter((item) =>
      [item.id, item.drugName, item.spec, item.traceCode, item.batchNo, item.manufacturer, item.status].some((field) => field.includes(searchText)),
    );
  };

  const pushFeedback = (tone: ActionFeedback['tone'], text: string) => {
    setActionFeedback({ tone, text });
  };

  const syncReconcileForm = (item: ReconcileItem | null) => {
    if (!item) return;
    setBusinessForm((prev) => ({
      ...prev,
      reconcileBatchId: item.id,
      reconcileHandler: item.confirmer || '周琛',
      reconcileResult: item.diffType === '无差异' || item.diffAmount === 0 ? '一致' : '部分差异',
      reconcileConfirmedAmount: String(item.confirmedAmount),
      reconcileDiffReason: item.diffType === '无差异' ? '' : item.diffType,
      reconcileRemark: item.diffType === '无差异' ? '与医保中心清算结果核对一致。' : `已登记差异原因：${item.diffType}`,
    }));
  };

  const openBusinessModal = (type: BusinessActionType) => {
    if (type === 'reconcile') {
      const target = reconciles.find((item) => item.status === '待确认') || reconciles[0] || null;
      syncReconcileForm(target);
    }
    setBusinessModal({ type, visible: true });
  };

  const closeBusinessModal = () => {
    setBusinessModal((prev) => ({ ...prev, visible: false }));
  };

  const openPharmacyModal = (type: PharmacyActionType, recordId: string | null = null) => {
    if (type === 'receive') {
      const target = recordId ? pharmacyOrders.find((item) => item.id === recordId) : null;
      setPharmacyForm((prev) => ({
        ...prev,
        receiveId: target?.id || `DD${String(pharmacyOrders.length + 1).padStart(3, '0')}`,
        receivePrescriptionNo: target?.prescriptionNo || `CF202605${String(200 + pharmacyOrders.length + 1).padStart(3, '0')}`,
        receivePatient: target?.patient || '陈语安',
        receiveDrugName: target?.drugName || '阿托伐他汀钙片',
        receiveHospital: target?.sourceHospital || '南京鼓楼医院',
        receiveCategory: target?.category || '双通道特药',
        receivePharmacist: target?.pharmacist || '周琪',
      }));
    }
    if (type === 'review') {
      const target = recordId ? pharmacyReviews.find((item) => item.id === recordId) : pharmacyReviews.find((item) => item.status === '待审方');
      if (target) {
        setPharmacyForm((prev) => ({
          ...prev,
          reviewPharmacist: target.pharmacist || '叶倩',
          reviewOpinion: target.reviewOpinion || '处方信息完整，符合调剂要求。',
          reviewDecision: target.status === '已退回' ? '退回' : '通过',
        }));
        recordId = target.id;
      }
    }
    if (type === 'dispense') {
      const target = recordId ? pharmacyDispenses.find((item) => item.id === recordId) : pharmacyDispenses.find((item) => item.status !== '已取药');
      if (target) {
        setPharmacyForm((prev) => ({
          ...prev,
          dispenseWindow: target.dispenseWindow,
          dispenseMethod: target.pickupMethod,
          dispenseOperator: target.dispenser,
          dispenseStatus: target.status === '配送中' ? '配送中' : '已发药',
        }));
        recordId = target.id;
      }
    }
    if (type === 'special') {
      const target = recordId ? pharmacySpecials.find((item) => item.id === recordId) : null;
      setPharmacyForm((prev) => ({
        ...prev,
        specialRegisterNo: target?.registerNo || `ZY${String(500 + pharmacySpecials.length + 1).padStart(4, '0')}`,
        specialPatient: target?.patient || '顾清和',
        specialDrug: target?.specialDrug || '曲妥珠单抗注射液',
        specialType: target?.treatmentType || '肿瘤靶向治疗',
        specialHospital: target?.hospital || '江苏省人民医院',
        specialMaterialStatus: target?.materialStatus || '材料齐全',
        specialRegistrar: target?.registrar || '蒋诚',
      }));
    }
    if (type === 'reconcile') {
      const target = recordId ? pharmacyReconcileRows.find((item) => item.id === recordId) : pharmacyReconcileRows[0];
      if (target) {
        setPharmacyForm((prev) => ({
          ...prev,
          pharmacyReconcileId: target.id,
          pharmacyReconcileOperator: target.operator,
          pharmacyReconcileResult: target.diffAmount > 0 ? '差异处理中' : '已确认',
          pharmacyReconcileRemark: target.diffAmount > 0 ? `差异金额 ${target.diffAmount} 元，待进一步核对。` : '回盘金额与结算清单一致。',
        }));
        recordId = target.id;
      }
    }
    if (type === 'stock') {
      const target = recordId ? pharmacyStocks.find((item) => item.id === recordId) : null;
      setPharmacyForm((prev) => ({
        ...prev,
        stockId: target?.id || `KC${String(pharmacyStocks.length + 1).padStart(3, '0')}`,
        stockDrugName: target?.drugName || '阿达木单抗注射液',
        stockSpec: target?.spec || '40mg/0.8ml',
        stockTraceCode: target?.traceCode || `69012345${String(1020 + pharmacyStocks.length + 1)}`,
        stockBatchNo: target?.batchNo || `JP2026${String(pharmacyStocks.length + 20).padStart(2, '0')}`,
        stockManufacturer: target?.manufacturer || '恒瑞医药',
        stockQuantity: String(target?.stock ?? 36),
        stockExpireDate: target?.expireDate || '2027-12-31',
        stockStatus: target?.status || '库存正常',
      }));
    }
    setPharmacyModal({ type, visible: true, recordId });
  };

  const closePharmacyModal = () => {
    setPharmacyModal((prev) => ({ ...prev, visible: false, recordId: null }));
  };

  const handleUploadSettlement = () => {
    if (!businessForm.uploadPatient || !businessForm.uploadIdCard || !businessForm.uploadDiagnosis) {
      pushFeedback('warning', '请先补全清单基本信息');
      return false;
    }
    const totalAmount = Number(businessForm.uploadTotalAmount || 0);
    const fundAmount = Number(businessForm.uploadFundAmount || 0);
    const personalAmount = Math.max(totalAmount - fundAmount, 0);
    const newSettlement: SettlementItem = {
      id: businessForm.uploadSettlementNo || `ST${String(settlements.length + 1).padStart(3, '0')}`,
      patient: businessForm.uploadPatient,
      idCard: businessForm.uploadIdCard,
      visitType: businessForm.uploadVisitType,
      department: businessForm.uploadDepartment,
      diagnosis: businessForm.uploadDiagnosis,
      insuranceType: businessForm.uploadInsuranceType,
      totalAmount,
      fundAmount,
      personalAmount,
      status: '已上传',
      operator: businessForm.uploadOperator,
      date: new Date().toISOString().slice(0, 10),
    };
    setSettlements((prev) => [newSettlement, ...prev]);
    pushFeedback('success', `已新增并上传清单 ${newSettlement.id}`);
    return true;
  };

  const handleDeleteSettlement = (id: string) => {
    setSettlements((prev) => prev.filter((row) => row.id !== id));
    pushFeedback('info', `已移除清单 ${id}`);
  };

  const handleViewSettlement = (item: SettlementItem) => {
    setCurrentSettlement(item);
    setShowModal(true);
  };

  const handleAlert = (id: string) => {
    setAlerts((prev) => prev.map((item) => (item.id === id ? { ...item, status: '已处理' } : item)));
    pushFeedback('success', `预警 ${id} 已处理`);
  };

  const handlePrescriptionStatus = (id: string, status: ReviewStatus) => {
    setPrescriptions((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    pushFeedback('success', `处方 ${id} 状态已更新`);
  };

  const handleCreateClaimBatch = () => {
    const pendingSettlements = settlements.filter((item) => item.status !== '待上传');
    if (!pendingSettlements.length) {
      pushFeedback('warning', '请先上传结算清单，再发起费用申报');
      return false;
    }
    const submitTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const totalAmount = pendingSettlements.reduce((sum, item) => sum + item.totalAmount, 0);
    const claimAmount = pendingSettlements.reduce((sum, item) => sum + item.fundAmount, 0);
    const newBatch: ClaimBatchItem = {
      id: `SB${String(claimBatches.length + 1).padStart(3, '0')}`,
      institution: '南京市第一医院',
      settlementCount: pendingSettlements.length || settlements.length,
      insuranceType: '职工医保',
      totalAmount,
      claimAmount,
      submitter: '王哲',
      submitTime,
      status: '已提交',
      returnReason: '无',
    };
    setClaimBatches((prev) => [newBatch, ...prev]);
    pushFeedback('success', `已发起申报批次 ${newBatch.id}`);
    return true;
  };

  const handleConfirmReconcile = () => {
    const target = reconciles.find((item) => item.id === businessForm.reconcileBatchId);
    if (!target) {
      pushFeedback('warning', '请先选择要确认的对账批次');
      return false;
    }
    if (!businessForm.reconcileHandler.trim()) {
      pushFeedback('warning', '请填写对账经办人');
      return false;
    }
    if (businessForm.reconcileResult !== '一致' && !businessForm.reconcileDiffReason.trim()) {
      pushFeedback('warning', '部分差异时必须填写差异原因');
      return false;
    }
    const latestTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const confirmedAmount =
      businessForm.reconcileResult === '一致'
        ? target.claimAmount
        : Number(businessForm.reconcileConfirmedAmount || target.confirmedAmount);
    const diffAmount = Math.max(target.claimAmount - confirmedAmount, 0);
    setReconciles((prev) =>
      prev.map((item) =>
        item.id === target.id
          ? {
              ...item,
              confirmedAmount,
              diffAmount,
              diffType: businessForm.reconcileResult === '一致' ? '无差异' : businessForm.reconcileDiffReason.trim(),
              confirmer: businessForm.reconcileHandler.trim(),
              confirmTime: latestTime,
              status: businessForm.reconcileResult === '一致' ? '已确认' : '差异处理中',
            }
          : item,
      ),
    );
    pushFeedback(
      businessForm.reconcileResult === '一致' ? 'success' : 'info',
      businessForm.reconcileResult === '一致' ? `已确认对账批次 ${target.id}` : `对账批次 ${target.id} 已转入差异处理`,
    );
    return true;
  };

  const handleSubmitBusinessModal = () => {
    if (businessModal.type === 'upload') {
      if (handleUploadSettlement()) closeBusinessModal();
      return;
    }
    if (businessModal.type === 'claim') {
      if (handleCreateClaimBatch()) closeBusinessModal();
      return;
    }
    if (handleConfirmReconcile()) closeBusinessModal();
  };

  const handleSubmitPharmacyModal = () => {
    if (pharmacyModal.type === 'receive') {
      const exists = pharmacyOrders.some((item) => item.id === pharmacyForm.receiveId);
      const nextItem: PharmacyOrder = {
        id: pharmacyForm.receiveId,
        prescriptionNo: pharmacyForm.receivePrescriptionNo,
        patient: pharmacyForm.receivePatient,
        idCard: '320102199305143628',
        sourceHospital: pharmacyForm.receiveHospital,
        category: pharmacyForm.receiveCategory,
        drugName: pharmacyForm.receiveDrugName,
        amount: 860,
        pharmacist: pharmacyForm.receivePharmacist,
        status: '已接收',
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      setPharmacyOrders((prev) => (exists ? prev.map((item) => (item.id === nextItem.id ? nextItem : item)) : [nextItem, ...prev]));
      pushFeedback('success', `已完成处方接收 ${nextItem.id}`);
      closePharmacyModal();
      return;
    }

    if (pharmacyModal.type === 'review') {
      if (!pharmacyModal.recordId) {
        pushFeedback('warning', '请先选择审方记录');
        return;
      }
      const nextStatus = pharmacyForm.reviewDecision === '退回' ? '已退回' : '已通过';
      setPharmacyReviews((prev) =>
        prev.map((item) =>
          item.id === pharmacyModal.recordId
            ? { ...item, status: nextStatus, reviewOpinion: pharmacyForm.reviewOpinion, pharmacist: pharmacyForm.reviewPharmacist, reviewTime: new Date().toISOString().slice(0, 16).replace('T', ' ') }
            : item,
        ),
      );
      pushFeedback('success', `审方记录 ${pharmacyModal.recordId} 已${pharmacyForm.reviewDecision}`);
      closePharmacyModal();
      return;
    }

    if (pharmacyModal.type === 'dispense') {
      if (!pharmacyModal.recordId) {
        pushFeedback('warning', '请先选择发药记录');
        return;
      }
      setPharmacyDispenses((prev) =>
        prev.map((item) =>
          item.id === pharmacyModal.recordId
            ? {
                ...item,
                status: pharmacyForm.dispenseStatus,
                dispenseWindow: pharmacyForm.dispenseWindow,
                pickupMethod: pharmacyForm.dispenseMethod,
                dispenser: pharmacyForm.dispenseOperator,
                dispenseTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
              }
            : item,
        ),
      );
      pushFeedback('success', `发药记录 ${pharmacyModal.recordId} 已办理`);
      closePharmacyModal();
      return;
    }

    if (pharmacyModal.type === 'settle') {
      const totalAmount = Number(pharmacyForm.settleTotalAmount || 0);
      const fundAmount = Number(pharmacyForm.settleFundAmount || 0);
      const newItem: PharmacySettlementItem = {
        id: `JS${String(pharmacySettlements.length + 1).padStart(3, '0')}`,
        settlementNo: pharmacyForm.settleNo,
        patient: pharmacyForm.settlePatient,
        insuranceType: pharmacyForm.settleInsuranceType,
        category: pharmacyForm.settleCategory,
        totalAmount,
        fundAmount,
        personalAmount: Math.max(totalAmount - fundAmount, 0),
        cashier: pharmacyForm.settleCashier,
        status: '已结算',
        settlementTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      setPharmacySettlements((prev) => [newItem, ...prev]);
      pushFeedback('success', `已发起医保结算 ${newItem.settlementNo}`);
      closePharmacyModal();
      return;
    }

    if (pharmacyModal.type === 'special') {
      const exists = pharmacySpecials.some((item) => item.registerNo === pharmacyForm.specialRegisterNo);
      const newItem: PharmacySpecialItem = {
        id: exists ? pharmacyModal.recordId || `TY${String(pharmacySpecials.length + 1).padStart(3, '0')}` : `TY${String(pharmacySpecials.length + 1).padStart(3, '0')}`,
        registerNo: pharmacyForm.specialRegisterNo,
        patient: pharmacyForm.specialPatient,
        specialDrug: pharmacyForm.specialDrug,
        treatmentType: pharmacyForm.specialType,
        hospital: pharmacyForm.specialHospital,
        approvalStatus: '已登记',
        materialStatus: pharmacyForm.specialMaterialStatus,
        registrar: pharmacyForm.specialRegistrar,
        registerTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      setPharmacySpecials((prev) => (exists ? prev.map((item) => (item.registerNo === newItem.registerNo ? newItem : item)) : [newItem, ...prev]));
      pushFeedback('success', `特药登记 ${newItem.registerNo} 已保存`);
      closePharmacyModal();
      return;
    }

    if (pharmacyModal.type === 'reconcile') {
      const targetId = pharmacyForm.pharmacyReconcileId;
      setPharmacyReconcileRows((prev) =>
        prev.map((item) =>
          item.id === targetId
            ? { ...item, operator: pharmacyForm.pharmacyReconcileOperator, status: pharmacyForm.pharmacyReconcileResult, diffAmount: pharmacyForm.pharmacyReconcileResult === '已确认' ? 0 : item.diffAmount }
            : item,
        ),
      );
      pushFeedback('success', `回盘批次 ${targetId} 已更新`);
      closePharmacyModal();
      return;
    }

    const exists = pharmacyStocks.some((item) => item.id === pharmacyForm.stockId);
    const stockItem: DrugStock = {
      id: pharmacyForm.stockId,
      drugName: pharmacyForm.stockDrugName,
      spec: pharmacyForm.stockSpec,
      traceCode: pharmacyForm.stockTraceCode,
      batchNo: pharmacyForm.stockBatchNo,
      manufacturer: pharmacyForm.stockManufacturer,
      stock: Number(pharmacyForm.stockQuantity || 0),
      expireDate: pharmacyForm.stockExpireDate,
      status: pharmacyForm.stockStatus,
    };
    setPharmacyStocks((prev) => (exists ? prev.map((item) => (item.id === stockItem.id ? stockItem : item)) : [stockItem, ...prev]));
    pushFeedback('success', `库存记录 ${stockItem.id} 已保存`);
    closePharmacyModal();
  };

  const renderToolbar = (
    placeholder: string,
    primaryAction?: { label: string; onClick: () => void },
    exportLabel = '当前列表',
  ) => (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-cyan-500"
        />
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => pushFeedback('info', `${exportLabel}导出任务已生成`)} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
          导出
        </button>
        {primaryAction && (
          <button onClick={primaryAction.onClick} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm text-white hover:bg-cyan-700">
            {primaryAction.label}
          </button>
        )}
      </div>
    </div>
  );

  const renderSettlementTable = (title: string) => (
    <div className="space-y-4">
      {renderToolbar('搜索清单号、姓名、身份证号、诊断', {
        label: title === '费用申报' ? '批量申报' : '上传清单',
        onClick: () => openBusinessModal('upload'),
      }, '结算清单')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">清单号</th>
              <th className="px-4 py-3 text-left">参保人</th>
              <th className="px-4 py-3 text-left">身份证号</th>
              <th className="px-4 py-3 text-left">就诊类型</th>
              <th className="px-4 py-3 text-left">科室</th>
              <th className="px-4 py-3 text-left">诊断</th>
              <th className="px-4 py-3 text-left">总费用</th>
              <th className="px-4 py-3 text-left">基金支付</th>
              <th className="px-4 py-3 text-left">个人自付</th>
              <th className="px-4 py-3 text-left">状态</th>
              <th className="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredSettlements.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.idCard}</td>
                <td className="px-4 py-3">{item.visitType}</td>
                <td className="px-4 py-3">{item.department}</td>
                <td className="px-4 py-3">{item.diagnosis}</td>
                <td className="px-4 py-3">¥{item.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-green-700">¥{item.fundAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-orange-700">¥{item.personalAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleViewSettlement(item)} className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDeleteSettlement(item.id)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderClaimBatchTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索申报批次号、申报机构、险种、状态', {
        label: '发起申报',
        onClick: () => openBusinessModal('claim'),
      }, '费用申报')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">申报批次号</th>
              <th className="px-4 py-3 text-left">申报机构</th>
              <th className="px-4 py-3 text-left">清单数量</th>
              <th className="px-4 py-3 text-left">险种类型</th>
              <th className="px-4 py-3 text-left">清单总金额</th>
              <th className="px-4 py-3 text-left">申报金额</th>
              <th className="px-4 py-3 text-left">提交人</th>
              <th className="px-4 py-3 text-left">提交时间</th>
              <th className="px-4 py-3 text-left">申报状态</th>
              <th className="px-4 py-3 text-left">退回原因</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaimBatches.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3">{item.settlementCount}</td>
                <td className="px-4 py-3">{item.insuranceType}</td>
                <td className="px-4 py-3">¥{item.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-green-700">¥{item.claimAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.submitter}</td>
                <td className="px-4 py-3">{item.submitTime}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.returnReason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReconcileTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索对账批次号、结算周期、差异类型、状态', {
        label: '确认对账',
        onClick: () => openBusinessModal('reconcile'),
      }, '对账结果')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">对账批次号</th>
              <th className="px-4 py-3 text-left">结算周期</th>
              <th className="px-4 py-3 text-left">机构名称</th>
              <th className="px-4 py-3 text-left">申报金额</th>
              <th className="px-4 py-3 text-left">医保确认金额</th>
              <th className="px-4 py-3 text-left">差异金额</th>
              <th className="px-4 py-3 text-left">差异类型</th>
              <th className="px-4 py-3 text-left">确认人</th>
              <th className="px-4 py-3 text-left">确认时间</th>
              <th className="px-4 py-3 text-left">对账状态</th>
            </tr>
          </thead>
          <tbody>
            {filteredReconciles.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.period}</td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3">¥{item.claimAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-green-700">¥{item.confirmedAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-orange-700">¥{item.diffAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.diffType}</td>
                <td className="px-4 py-3">{item.confirmer}</td>
                <td className="px-4 py-3">{item.confirmTime}</td>
                <td className="px-4 py-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderWorkTable = (rows: WorkItem[], title: string) => (
    <div className="space-y-4">
      {renderToolbar(`搜索${title}任务号、姓名、诊断`)}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">任务号</th>
              <th className="px-4 py-3 text-left">患者姓名</th>
              <th className="px-4 py-3 text-left">科室</th>
              <th className="px-4 py-3 text-left">诊断</th>
              <th className="px-4 py-3 text-left">责任医生</th>
              <th className="px-4 py-3 text-left">当前任务</th>
              <th className="px-4 py-3 text-left">状态</th>
              <th className="px-4 py-3 text-left">更新时间</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.department}</td>
                <td className="px-4 py-3">{item.diagnosis}</td>
                <td className="px-4 py-3">{item.doctor}</td>
                <td className="px-4 py-3">{item.task}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAlertTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索预警编号、姓名、规则来源、预警类型')}
      <div className="space-y-3">
        {filteredAlerts.map((item) => (
          <div key={item.id} className={`rounded-2xl border p-4 ${item.level === '严重' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className={`h-5 w-5 ${item.level === '严重' ? 'text-red-600' : 'text-amber-600'}`} />
                <div>
                  <p className="font-semibold text-gray-800">{item.id} · {item.type}</p>
                  <p className="text-sm text-gray-600">{item.patient} / {item.department} / {item.ruleSource}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs text-gray-600">{item.status}</span>
                {item.status === '待处理' && (
                  <button onClick={() => handleAlert(item.id)} className="rounded-xl bg-cyan-600 px-3 py-1.5 text-sm text-white hover:bg-cyan-700">
                    处理
                  </button>
                )}
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-700">{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrescriptionTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索处方号、姓名、身份证号、流转药店')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">处方号</th>
              <th className="px-4 py-3 text-left">患者姓名</th>
              <th className="px-4 py-3 text-left">身份证号</th>
              <th className="px-4 py-3 text-left">开方医生</th>
              <th className="px-4 py-3 text-left">科室</th>
              <th className="px-4 py-3 text-left">诊断</th>
              <th className="px-4 py-3 text-left">药品数</th>
              <th className="px-4 py-3 text-left">处方金额</th>
              <th className="px-4 py-3 text-left">流转药店</th>
              <th className="px-4 py-3 text-left">状态</th>
              <th className="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.idCard}</td>
                <td className="px-4 py-3">{item.doctor}</td>
                <td className="px-4 py-3">{item.department}</td>
                <td className="px-4 py-3">{item.diagnosis}</td>
                <td className="px-4 py-3">{item.itemCount}</td>
                <td className="px-4 py-3">¥{item.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.destination}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handlePrescriptionStatus(item.id, '已通过')} className="rounded-lg p-1.5 text-green-600 hover:bg-green-50">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => handlePrescriptionStatus(item.id, '已退回')} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrderTable = (rows: PharmacyOrder[], primaryLabel?: string) => (
    <div className="space-y-4">
      {renderToolbar('搜索处方号、姓名、身份证号、来源医院、药品名称', { label: '登记接收', onClick: () => openPharmacyModal('receive') }, '处方接收')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">{primaryLabel || '业务编号'}</th>
              <th className="px-4 py-3 text-left">处方号</th>
              <th className="px-4 py-3 text-left">参保人</th>
              <th className="px-4 py-3 text-left">身份证号</th>
              <th className="px-4 py-3 text-left">来源医院</th>
              <th className="px-4 py-3 text-left">业务类别</th>
              <th className="px-4 py-3 text-left">药品名称</th>
              <th className="px-4 py-3 text-left">金额</th>
              <th className="px-4 py-3 text-left">药师</th>
              <th className="px-4 py-3 text-left">状态</th>
                <th className="px-4 py-3 text-left">时间</th>
                <th className="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {filterOrders(rows).map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.prescriptionNo}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.idCard}</td>
                <td className="px-4 py-3">{item.sourceHospital}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{item.drugName}</td>
                <td className="px-4 py-3">¥{item.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.pharmacist}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.date}</td>
                <td className="px-4 py-3">
                  <button onClick={() => openPharmacyModal('receive', item.id)} className="rounded-lg border border-cyan-200 px-3 py-1 text-xs text-cyan-700 hover:bg-cyan-50">
                    接收办理
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReviewTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索审方编号、处方号、药品名称、审方规则', { label: '审方办理', onClick: () => openPharmacyModal('review') }, '药师审方')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">审方编号</th>
              <th className="px-4 py-3 text-left">处方号</th>
              <th className="px-4 py-3 text-left">患者姓名</th>
              <th className="px-4 py-3 text-left">药品名称</th>
              <th className="px-4 py-3 text-left">审方规则</th>
              <th className="px-4 py-3 text-left">审方药师</th>
              <th className="px-4 py-3 text-left">审方时间</th>
              <th className="px-4 py-3 text-left">状态</th>
                <th className="px-4 py-3 text-left">审方意见</th>
                <th className="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {filterReviews(pharmacyReviews).map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.prescriptionNo}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.drugName}</td>
                <td className="px-4 py-3">{item.reviewRule}</td>
                <td className="px-4 py-3">{item.pharmacist}</td>
                <td className="px-4 py-3">{item.reviewTime}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.reviewOpinion}</td>
                <td className="px-4 py-3">
                  <button onClick={() => openPharmacyModal('review', item.id)} className="rounded-lg border border-cyan-200 px-3 py-1 text-xs text-cyan-700 hover:bg-cyan-50">
                    审方
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDispenseTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索发药编号、取药号、发药窗口、取药方式', { label: '发药办理', onClick: () => openPharmacyModal('dispense') }, '调剂发药')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">发药编号</th>
              <th className="px-4 py-3 text-left">取药号</th>
              <th className="px-4 py-3 text-left">患者姓名</th>
              <th className="px-4 py-3 text-left">药品名称</th>
              <th className="px-4 py-3 text-left">数量</th>
              <th className="px-4 py-3 text-left">发药窗口</th>
              <th className="px-4 py-3 text-left">发药员</th>
              <th className="px-4 py-3 text-left">取药方式</th>
              <th className="px-4 py-3 text-left">状态</th>
                <th className="px-4 py-3 text-left">发药时间</th>
                <th className="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {filterDispenses(pharmacyDispenses).map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.pickupNo}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.drugName}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">{item.dispenseWindow}</td>
                <td className="px-4 py-3">{item.dispenser}</td>
                <td className="px-4 py-3">{item.pickupMethod}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.dispenseTime}</td>
                <td className="px-4 py-3">
                  <button onClick={() => openPharmacyModal('dispense', item.id)} className="rounded-lg border border-cyan-200 px-3 py-1 text-xs text-cyan-700 hover:bg-cyan-50">
                    办理
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPharmacySettlementTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索结算编号、结算单号、险种、结算状态', { label: '发起结算', onClick: () => openPharmacyModal('settle') }, '医保结算')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">结算编号</th>
              <th className="px-4 py-3 text-left">结算单号</th>
              <th className="px-4 py-3 text-left">患者姓名</th>
              <th className="px-4 py-3 text-left">险种类型</th>
              <th className="px-4 py-3 text-left">结算类别</th>
              <th className="px-4 py-3 text-left">总金额</th>
              <th className="px-4 py-3 text-left">医保支付</th>
              <th className="px-4 py-3 text-left">个人自付</th>
              <th className="px-4 py-3 text-left">收费员</th>
              <th className="px-4 py-3 text-left">状态</th>
              <th className="px-4 py-3 text-left">结算时间</th>
            </tr>
          </thead>
          <tbody>
            {filterSettlements(pharmacySettlements).map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.settlementNo}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.insuranceType}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">¥{item.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-green-700">¥{item.fundAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-orange-700">¥{item.personalAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.cashier}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">{item.settlementTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSpecialTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索登记编号、特药名称、治疗类型、材料状态', { label: '新增登记', onClick: () => openPharmacyModal('special') }, '特药登记')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">登记编号</th>
              <th className="px-4 py-3 text-left">登记单号</th>
              <th className="px-4 py-3 text-left">患者姓名</th>
              <th className="px-4 py-3 text-left">特药名称</th>
              <th className="px-4 py-3 text-left">治疗类型</th>
              <th className="px-4 py-3 text-left">来源医院</th>
              <th className="px-4 py-3 text-left">审批状态</th>
              <th className="px-4 py-3 text-left">材料状态</th>
              <th className="px-4 py-3 text-left">登记人</th>
                <th className="px-4 py-3 text-left">登记时间</th>
                <th className="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {filterSpecials(pharmacySpecials).map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.registerNo}</td>
                <td className="px-4 py-3">{item.patient}</td>
                <td className="px-4 py-3">{item.specialDrug}</td>
                <td className="px-4 py-3">{item.treatmentType}</td>
                <td className="px-4 py-3">{item.hospital}</td>
                <td className="px-4 py-3">{item.approvalStatus}</td>
                <td className="px-4 py-3">{item.materialStatus}</td>
                <td className="px-4 py-3">{item.registrar}</td>
                <td className="px-4 py-3">{item.registerTime}</td>
                <td className="px-4 py-3">
                  <button onClick={() => openPharmacyModal('special', item.id)} className="rounded-lg border border-cyan-200 px-3 py-1 text-xs text-cyan-700 hover:bg-cyan-50">
                    补材料
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPharmacyReconcileTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索回盘批次、周期、银行状态、对账状态', { label: '回盘确认', onClick: () => openPharmacyModal('reconcile') }, '对账回盘')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">回盘批次号</th>
              <th className="px-4 py-3 text-left">对账周期</th>
              <th className="px-4 py-3 text-left">机构名称</th>
              <th className="px-4 py-3 text-left">结算笔数</th>
              <th className="px-4 py-3 text-left">结算金额</th>
              <th className="px-4 py-3 text-left">回盘金额</th>
              <th className="px-4 py-3 text-left">差异金额</th>
              <th className="px-4 py-3 text-left">银行状态</th>
              <th className="px-4 py-3 text-left">经办人</th>
                <th className="px-4 py-3 text-left">对账状态</th>
                <th className="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {filterReconciles(pharmacyReconcileRows).map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.period}</td>
                <td className="px-4 py-3">{item.institution}</td>
                <td className="px-4 py-3">{item.settlementCount}</td>
                <td className="px-4 py-3">¥{item.settlementAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-green-700">¥{item.returnedAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-orange-700">¥{item.diffAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{item.bankStatus}</td>
                <td className="px-4 py-3">{item.operator}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">
                  <button onClick={() => openPharmacyModal('reconcile', item.id)} className="rounded-lg border border-cyan-200 px-3 py-1 text-xs text-cyan-700 hover:bg-cyan-50">
                    确认
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStockTable = () => (
    <div className="space-y-4">
      {renderToolbar('搜索药品名称、追溯码、批号、生产企业', { label: '新增库存', onClick: () => openPharmacyModal('stock') }, '库存追溯')}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">库存编号</th>
              <th className="px-4 py-3 text-left">药品名称</th>
              <th className="px-4 py-3 text-left">规格</th>
              <th className="px-4 py-3 text-left">追溯码</th>
              <th className="px-4 py-3 text-left">批号</th>
              <th className="px-4 py-3 text-left">生产企业</th>
              <th className="px-4 py-3 text-left">库存量</th>
              <th className="px-4 py-3 text-left">有效期</th>
              <th className="px-4 py-3 text-left">状态</th>
              <th className="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {filterStocks(pharmacyStocks).map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                <td className="px-4 py-3">{item.drugName}</td>
                <td className="px-4 py-3">{item.spec}</td>
                <td className="px-4 py-3">{item.traceCode}</td>
                <td className="px-4 py-3">{item.batchNo}</td>
                <td className="px-4 py-3">{item.manufacturer}</td>
                <td className="px-4 py-3">{item.stock}</td>
                <td className="px-4 py-3">{item.expireDate}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">
                  <button onClick={() => openPharmacyModal('stock', item.id)} className="rounded-lg border border-cyan-200 px-3 py-1 text-xs text-cyan-700 hover:bg-cyan-50">
                    调整
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHospitalClaimPanel = () => (
    <div className="space-y-4">
      {renderClaimBatchTable()}
      <div className="grid gap-4 xl:grid-cols-2">
        <SectionBlock title="医师协同" desc="围绕病历补录、门特外配确认、清单提交等申报前置事项。">
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">任务号</th>
                  <th className="px-4 py-3 text-left">患者姓名</th>
                  <th className="px-4 py-3 text-left">当前任务</th>
                  <th className="px-4 py-3 text-left">状态</th>
                </tr>
              </thead>
              <tbody>
                {physicianSeed.slice(0, 8).map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                    <td className="px-4 py-3">{item.patient}</td>
                    <td className="px-4 py-3">{item.task}</td>
                    <td className="px-4 py-3">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionBlock>
        <SectionBlock title="护理补录" desc="围绕护理执行回传、耗材补录、执行单补传等申报支撑事项。">
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">任务号</th>
                  <th className="px-4 py-3 text-left">患者姓名</th>
                  <th className="px-4 py-3 text-left">当前任务</th>
                  <th className="px-4 py-3 text-left">状态</th>
                </tr>
              </thead>
              <tbody>
                {nurseSeed.slice(0, 8).map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                    <td className="px-4 py-3">{item.patient}</td>
                    <td className="px-4 py-3">{item.task}</td>
                    <td className="px-4 py-3">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionBlock>
      </div>
    </div>
  );

  const renderHospitalReconcilePanel = () => (
    <div className="space-y-4">
      {renderReconcileTable()}
      <SectionBlock title="药学复核" desc="对账前集中查看药学复核、特药审核和目录外用药说明。">
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">任务号</th>
                <th className="px-4 py-3 text-left">患者姓名</th>
                <th className="px-4 py-3 text-left">复核事项</th>
                <th className="px-4 py-3 text-left">状态</th>
                <th className="px-4 py-3 text-left">更新时间</th>
              </tr>
            </thead>
            <tbody>
              {pharmacistSeed.slice(0, 10).map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                  <td className="px-4 py-3">{item.patient}</td>
                  <td className="px-4 py-3">{item.task}</td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionBlock>
    </div>
  );

  const renderHospitalPrescriptionPanel = () => (
    <div className="space-y-4">
      {renderPrescriptionTable()}
      <div className="grid gap-4 xl:grid-cols-2">
        <SectionBlock title="医师开方协同" desc="查看待流转处方、门慢门特外配处方和双通道特药处方。">
          <div className="space-y-3">
            {prescriptions.slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-800">{item.id} · {item.patient}</p>
                    <p className="mt-1 text-sm text-gray-500">{item.department} / {item.diagnosis} / {item.destination}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-600">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>
        <SectionBlock title="药师审方协同" desc="将药师复核结果作为处方流转的协同反馈，不再单独作为一级入口。">
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">任务号</th>
                  <th className="px-4 py-3 text-left">患者姓名</th>
                  <th className="px-4 py-3 text-left">审方事项</th>
                  <th className="px-4 py-3 text-left">状态</th>
                </tr>
              </thead>
              <tbody>
                {pharmacistSeed.slice(0, 8).map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-800">{item.id}</td>
                    <td className="px-4 py-3">{item.patient}</td>
                    <td className="px-4 py-3">{item.task}</td>
                    <td className="px-4 py-3">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionBlock>
      </div>
    </div>
  );

  const renderHospitalAlertsPanel = () => (
    <div className="space-y-4">
      {renderAlertTable()}
      <div className="grid gap-4 xl:grid-cols-3">
        <SectionBlock title="医师提醒" desc="医生需处理的规则拦截、目录外收费、门特合规提醒。">
          <div className="space-y-2">
            {physicianSeed.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-xl bg-gray-50 px-3 py-3 text-sm">
                <p className="font-medium text-gray-800">{item.patient}</p>
                <p className="mt-1 text-gray-500">{item.task}</p>
              </div>
            ))}
          </div>
        </SectionBlock>
        <SectionBlock title="护理提醒" desc="护理执行回传、耗材登记异常、护理记录缺失等提醒。">
          <div className="space-y-2">
            {nurseSeed.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-xl bg-gray-50 px-3 py-3 text-sm">
                <p className="font-medium text-gray-800">{item.patient}</p>
                <p className="mt-1 text-gray-500">{item.task}</p>
              </div>
            ))}
          </div>
        </SectionBlock>
        <SectionBlock title="药学提醒" desc="合理用药、特药审核、审方退回等提醒。">
          <div className="space-y-2">
            {pharmacistSeed.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-xl bg-gray-50 px-3 py-3 text-sm">
                <p className="font-medium text-gray-800">{item.patient}</p>
                <p className="mt-1 text-gray-500">{item.task}</p>
              </div>
            ))}
          </div>
        </SectionBlock>
      </div>
    </div>
  );

  const hospitalStats = [
    { title: '结算清单', value: '20', subValue: '含住院、门诊慢特病、普通门诊' },
    { title: '待申报', value: '7', subValue: '待上传或待提交医保清单' },
    { title: '智能预警', value: '20', subValue: '药品、项目、耗材规则均已覆盖' },
    { title: '协同事项', value: '60', subValue: '医师、护理、药学协同任务已下沉到业务页' },
  ];

  const pharmacyStats = [
    { title: '处方接收', value: '20', subValue: '来源医院已覆盖省内主要三甲医院' },
    { title: '待审方', value: '7', subValue: '含双通道特药、门特、外配处方' },
    { title: '医保结算', value: '20', subValue: '含待回盘和已回盘结算记录' },
    { title: '库存追溯', value: '20', subValue: '特药追溯码、批号、效期完整展示' },
  ];

  const renderHospitalContent = () => {
    if (hospitalTab === 'settlement') return renderSettlementTable('结算清单');
    if (hospitalTab === 'claim') return renderHospitalClaimPanel();
    if (hospitalTab === 'reconcile') return renderHospitalReconcilePanel();
    if (hospitalTab === 'prescription') return renderHospitalPrescriptionPanel();
    return renderHospitalAlertsPanel();
  };

  const renderPharmacyContent = () => {
    if (pharmacyTab === 'receive') return renderOrderTable(pharmacyOrders, '接收编号');
    if (pharmacyTab === 'review') return renderReviewTable();
    if (pharmacyTab === 'dispense') return renderDispenseTable();
    if (pharmacyTab === 'settle') return renderPharmacySettlementTable();
    if (pharmacyTab === 'special') return renderSpecialTable();
    if (pharmacyTab === 'stock') return renderStockTable();
    return renderPharmacyReconcileTable();
  };

  const tabs = mode === 'hospital' ? hospitalTabs : pharmacyTabs;
  const activeTab = mode === 'hospital' ? hospitalTab : pharmacyTab;
  const pendingSettlementCount = settlements.filter((item) => item.status === '待上传').length;
  const uploadedSettlementCount = settlements.filter((item) => item.status !== '待上传').length;
  const pendingReconcileCount = reconciles.filter((item) => item.status === '待确认').length;
  const latestClaimAmount = settlements.filter((item) => item.status !== '待上传').reduce((sum, item) => sum + item.fundAmount, 0);
  const selectedReconcile = reconciles.find((item) => item.id === businessForm.reconcileBatchId) || null;
  const selectedPharmacyOrder = pharmacyOrders.find((item) => item.id === pharmacyModal.recordId) || null;
  const selectedPharmacyReview = pharmacyReviews.find((item) => item.id === pharmacyModal.recordId) || null;
  const selectedPharmacyDispense = pharmacyDispenses.find((item) => item.id === pharmacyModal.recordId) || null;
  const selectedPharmacyReconcile = pharmacyReconcileRows.find((item) => item.id === pharmacyForm.pharmacyReconcileId) || null;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-cyan-600 to-teal-600 p-6 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-100">{mode === 'hospital' ? '定点医院业务入口' : '零售药店 / 双通道药店业务入口'}</p>
            <h2 className="mt-2 text-3xl font-bold">{headerTitle}</h2>
            <p className="mt-3 text-sm text-cyan-50">
              {mode === 'hospital'
                ? '围绕结算清单、费用申报、对账确认、智能提醒和医护药协同处理。'
                : '围绕处方接收、药师审方、调剂发药、医保结算、特药登记和库存追溯。'}
            </p>
          </div>
          <div className="rounded-2xl bg-white/12 px-5 py-4 text-right">
            <p className="text-xs text-cyan-100">当前机构</p>
            <p className="mt-1 text-lg font-semibold">{mode === 'hospital' ? '南京市第一医院' : '南京国大双通道药店'}</p>
            <p className="mt-1 text-xs text-cyan-100">{mode === 'hospital' ? '三级甲等 / 定点医疗机构' : '双通道药店 / 医保定点零售药店'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {(mode === 'hospital' ? hospitalStats : pharmacyStats).map((item) => (
          <StatCard key={item.title} title={item.title} value={item.value} subValue={item.subValue} />
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => (mode === 'hospital' ? setHospitalTab(tab.id as (typeof hospitalTabs)[number]['id']) : setPharmacyTab(tab.id as (typeof pharmacyTabs)[number]['id']))}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-cyan-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {actionFeedback && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
            actionFeedback.tone === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : actionFeedback.tone === 'warning'
                ? 'border-amber-200 bg-amber-50 text-amber-700'
                : 'border-cyan-200 bg-cyan-50 text-cyan-700'
          }`}
        >
          {actionFeedback.text}
        </div>
      )}

      {mode === 'hospital' ? renderHospitalContent() : renderPharmacyContent()}

      {pharmacyModal.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-6">
          <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {pharmacyModal.type === 'receive' && '处方接收办理'}
                  {pharmacyModal.type === 'review' && '药师审方办理'}
                  {pharmacyModal.type === 'dispense' && '调剂发药办理'}
                  {pharmacyModal.type === 'settle' && '医保结算办理'}
                  {pharmacyModal.type === 'special' && '特药登记办理'}
                  {pharmacyModal.type === 'reconcile' && '回盘确认办理'}
                  {pharmacyModal.type === 'stock' && '库存调整办理'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">按当前药店端业务填写办理信息，提交后同步更新下方台账。</p>
              </div>
              <button onClick={closePharmacyModal} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {pharmacyModal.type === 'receive' && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">接收编号</span>
                    <input value={pharmacyForm.receiveId} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, receiveId: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">处方号</span>
                    <input value={pharmacyForm.receivePrescriptionNo} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, receivePrescriptionNo: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">参保人</span>
                    <input value={pharmacyForm.receivePatient} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, receivePatient: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">来源医院</span>
                    <input value={pharmacyForm.receiveHospital} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, receiveHospital: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">药品名称</span>
                    <input value={pharmacyForm.receiveDrugName} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, receiveDrugName: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">接收药师</span>
                    <input value={pharmacyForm.receivePharmacist} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, receivePharmacist: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                </div>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">接收说明</span>
                  <textarea rows={3} value={pharmacyForm.receiveRemark} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, receiveRemark: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-cyan-500" />
                </label>
              </div>
            )}

            {pharmacyModal.type === 'review' && (
              <div className="space-y-4">
                {selectedPharmacyReview && (
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">审方编号</p><p className="mt-2 text-sm font-semibold text-gray-800">{selectedPharmacyReview.id}</p></div>
                    <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">处方号</p><p className="mt-2 text-sm font-semibold text-gray-800">{selectedPharmacyReview.prescriptionNo}</p></div>
                    <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">药品</p><p className="mt-2 text-sm font-semibold text-gray-800">{selectedPharmacyReview.drugName}</p></div>
                    <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">当前状态</p><p className="mt-2 text-sm font-semibold text-gray-800">{selectedPharmacyReview.status}</p></div>
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">审方结果</span>
                    <select value={pharmacyForm.reviewDecision} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, reviewDecision: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500">
                      <option>通过</option>
                      <option>退回</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">审方药师</span>
                    <input value={pharmacyForm.reviewPharmacist} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, reviewPharmacist: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                </div>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">审方意见</span>
                  <textarea rows={3} value={pharmacyForm.reviewOpinion} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, reviewOpinion: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-cyan-500" />
                </label>
              </div>
            )}

            {pharmacyModal.type === 'dispense' && (
              <div className="space-y-4">
                {selectedPharmacyDispense && (
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">发药编号</p><p className="mt-2 text-sm font-semibold text-gray-800">{selectedPharmacyDispense.id}</p></div>
                    <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">患者姓名</p><p className="mt-2 text-sm font-semibold text-gray-800">{selectedPharmacyDispense.patient}</p></div>
                    <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">药品名称</p><p className="mt-2 text-sm font-semibold text-gray-800">{selectedPharmacyDispense.drugName}</p></div>
                    <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">当前状态</p><p className="mt-2 text-sm font-semibold text-gray-800">{selectedPharmacyDispense.status}</p></div>
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">办理结果</span>
                    <select value={pharmacyForm.dispenseStatus} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, dispenseStatus: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500">
                      <option>已发药</option>
                      <option>配送中</option>
                      <option>已取药</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">发药窗口</span>
                    <input value={pharmacyForm.dispenseWindow} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, dispenseWindow: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">取药方式</span>
                    <input value={pharmacyForm.dispenseMethod} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, dispenseMethod: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">发药人员</span>
                    <input value={pharmacyForm.dispenseOperator} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, dispenseOperator: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                </div>
              </div>
            )}

            {pharmacyModal.type === 'settle' && (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">结算单号</span><input value={pharmacyForm.settleNo} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, settleNo: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">患者姓名</span><input value={pharmacyForm.settlePatient} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, settlePatient: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">险种</span><input value={pharmacyForm.settleInsuranceType} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, settleInsuranceType: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">结算类别</span><input value={pharmacyForm.settleCategory} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, settleCategory: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">总金额</span><input value={pharmacyForm.settleTotalAmount} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, settleTotalAmount: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">基金支付</span><input value={pharmacyForm.settleFundAmount} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, settleFundAmount: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
              </div>
            )}

            {pharmacyModal.type === 'special' && (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">登记单号</span><input value={pharmacyForm.specialRegisterNo} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, specialRegisterNo: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">患者姓名</span><input value={pharmacyForm.specialPatient} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, specialPatient: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">特药名称</span><input value={pharmacyForm.specialDrug} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, specialDrug: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">治疗类型</span><input value={pharmacyForm.specialType} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, specialType: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">来源医院</span><input value={pharmacyForm.specialHospital} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, specialHospital: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">材料状态</span><input value={pharmacyForm.specialMaterialStatus} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, specialMaterialStatus: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
              </div>
            )}

            {pharmacyModal.type === 'reconcile' && (
              <div className="space-y-4">
                {selectedPharmacyReconcile && (
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">回盘批次</p><p className="mt-2 text-sm font-semibold text-gray-800">{selectedPharmacyReconcile.id}</p></div>
                    <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">机构名称</p><p className="mt-2 text-sm font-semibold text-gray-800">{selectedPharmacyReconcile.institution}</p></div>
                    <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">差异金额</p><p className="mt-2 text-sm font-semibold text-gray-800">¥{selectedPharmacyReconcile.diffAmount.toLocaleString()}</p></div>
                    <div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-500">银行状态</p><p className="mt-2 text-sm font-semibold text-gray-800">{selectedPharmacyReconcile.bankStatus}</p></div>
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2"><span className="text-sm font-medium text-gray-700">回盘批次</span><select value={pharmacyForm.pharmacyReconcileId} onChange={(e) => openPharmacyModal('reconcile', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500">{pharmacyReconcileRows.map((item) => <option key={item.id} value={item.id}>{item.id} / {item.period}</option>)}</select></label>
                  <label className="space-y-2"><span className="text-sm font-medium text-gray-700">经办人员</span><input value={pharmacyForm.pharmacyReconcileOperator} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, pharmacyReconcileOperator: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                  <label className="space-y-2"><span className="text-sm font-medium text-gray-700">回盘结果</span><select value={pharmacyForm.pharmacyReconcileResult} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, pharmacyReconcileResult: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500"><option>已确认</option><option>差异处理中</option></select></label>
                  <label className="space-y-2"><span className="text-sm font-medium text-gray-700">回盘备注</span><input value={pharmacyForm.pharmacyReconcileRemark} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, pharmacyReconcileRemark: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                </div>
              </div>
            )}

            {pharmacyModal.type === 'stock' && (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">库存编号</span><input value={pharmacyForm.stockId} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, stockId: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">药品名称</span><input value={pharmacyForm.stockDrugName} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, stockDrugName: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">规格</span><input value={pharmacyForm.stockSpec} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, stockSpec: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">追溯码</span><input value={pharmacyForm.stockTraceCode} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, stockTraceCode: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">批号</span><input value={pharmacyForm.stockBatchNo} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, stockBatchNo: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
                <label className="space-y-2"><span className="text-sm font-medium text-gray-700">库存数量</span><input value={pharmacyForm.stockQuantity} onChange={(e) => setPharmacyForm((prev) => ({ ...prev, stockQuantity: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" /></label>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={closePharmacyModal} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                取消
              </button>
              <button onClick={handleSubmitPharmacyModal} className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-700">
                确认办理
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {businessModal.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-6">
          <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {businessModal.type === 'upload' ? '上传清单办理' : businessModal.type === 'claim' ? '费用申报办理' : '对账确认办理'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {businessModal.type === 'upload'
                    ? '确认本次上传批次、上传渠道和经办信息后提交结算清单。'
                    : businessModal.type === 'claim'
                      ? '填写申报月份、险种和联系人信息后，生成本次费用申报批次。'
                      : '核对账务结果、差异原因和经办意见后，完成本次对账确认。'}
                </p>
              </div>
              <button onClick={closeBusinessModal} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {businessModal.type === 'upload' && (
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl bg-cyan-50 p-4">
                    <p className="text-xs text-cyan-600">当前清单总数</p>
                    <p className="mt-2 text-2xl font-bold text-cyan-700">{settlements.length}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs text-emerald-600">本次状态</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-700">新增上传</p>
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-4">
                    <p className="text-xs text-amber-600">基金支付金额</p>
                    <p className="mt-2 text-2xl font-bold text-amber-700">¥{Number(businessForm.uploadFundAmount || 0).toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">个人自付金额</p>
                    <p className="mt-2 text-base font-semibold text-slate-700">¥{Math.max(Number(businessForm.uploadTotalAmount || 0) - Number(businessForm.uploadFundAmount || 0), 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">清单号</span>
                    <input value={businessForm.uploadSettlementNo} onChange={(e) => setBusinessForm((prev) => ({ ...prev, uploadSettlementNo: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">参保人姓名</span>
                    <input value={businessForm.uploadPatient} onChange={(e) => setBusinessForm((prev) => ({ ...prev, uploadPatient: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">身份证号</span>
                    <input value={businessForm.uploadIdCard} onChange={(e) => setBusinessForm((prev) => ({ ...prev, uploadIdCard: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">就诊类型</span>
                    <select value={businessForm.uploadVisitType} onChange={(e) => setBusinessForm((prev) => ({ ...prev, uploadVisitType: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500">
                      <option>普通门诊</option>
                      <option>门诊慢特病</option>
                      <option>住院</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">就诊科室</span>
                    <input value={businessForm.uploadDepartment} onChange={(e) => setBusinessForm((prev) => ({ ...prev, uploadDepartment: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">主要诊断</span>
                    <input value={businessForm.uploadDiagnosis} onChange={(e) => setBusinessForm((prev) => ({ ...prev, uploadDiagnosis: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">险种类型</span>
                    <select value={businessForm.uploadInsuranceType} onChange={(e) => setBusinessForm((prev) => ({ ...prev, uploadInsuranceType: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500">
                      <option>职工医保</option>
                      <option>城乡居民医保</option>
                      <option>学生医保</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">总费用</span>
                    <input value={businessForm.uploadTotalAmount} onChange={(e) => setBusinessForm((prev) => ({ ...prev, uploadTotalAmount: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">基金支付</span>
                    <input value={businessForm.uploadFundAmount} onChange={(e) => setBusinessForm((prev) => ({ ...prev, uploadFundAmount: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">经办人员</span>
                    <input value={businessForm.uploadOperator} onChange={(e) => setBusinessForm((prev) => ({ ...prev, uploadOperator: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                </div>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">清单说明</span>
                  <textarea rows={3} value={businessForm.uploadRemark} onChange={(e) => setBusinessForm((prev) => ({ ...prev, uploadRemark: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-cyan-500" />
                </label>
              </div>
            )}

            {businessModal.type === 'claim' && (
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl bg-cyan-50 p-4">
                    <p className="text-xs text-cyan-600">可申报清单</p>
                    <p className="mt-2 text-2xl font-bold text-cyan-700">{uploadedSettlementCount}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs text-emerald-600">申报基金金额</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-700">¥{latestClaimAmount.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl bg-violet-50 p-4">
                    <p className="text-xs text-violet-600">申报机构</p>
                    <p className="mt-2 text-base font-semibold text-violet-700">南京市第一医院</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">申报口径</p>
                    <p className="mt-2 text-base font-semibold text-slate-700">月度汇总申报</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">申报月份</span>
                    <input type="month" value={businessForm.claimMonth} onChange={(e) => setBusinessForm((prev) => ({ ...prev, claimMonth: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">申报险种</span>
                    <select value={businessForm.claimInsuranceType} onChange={(e) => setBusinessForm((prev) => ({ ...prev, claimInsuranceType: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500">
                      <option>职工医保</option>
                      <option>城乡居民医保</option>
                      <option>门诊慢特病专项</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">提交人</span>
                    <input value={businessForm.claimSubmitter} onChange={(e) => setBusinessForm((prev) => ({ ...prev, claimSubmitter: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">联系电话</span>
                    <input value={businessForm.claimContact} onChange={(e) => setBusinessForm((prev) => ({ ...prev, claimContact: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                </div>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">申报说明</span>
                  <textarea rows={3} value={businessForm.claimRemark} onChange={(e) => setBusinessForm((prev) => ({ ...prev, claimRemark: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-cyan-500" />
                </label>
              </div>
            )}

            {businessModal.type === 'reconcile' && (
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl bg-cyan-50 p-4">
                    <p className="text-xs text-cyan-600">待确认批次</p>
                    <p className="mt-2 text-2xl font-bold text-cyan-700">{pendingReconcileCount}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-xs text-emerald-600">确认结果</p>
                    <p className="mt-2 text-base font-semibold text-emerald-700">{businessForm.reconcileResult}</p>
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-4">
                    <p className="text-xs text-amber-600">差异处理</p>
                    <p className="mt-2 text-base font-semibold text-amber-700">{businessForm.reconcileResult === '一致' ? '无需差异处理' : '需补充差异原因'}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">当前批次</p>
                    <p className="mt-2 text-base font-semibold text-slate-700">{businessForm.reconcileBatchId}</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">对账批次</span>
                    <select
                      value={businessForm.reconcileBatchId}
                      onChange={(e) => {
                        const next = reconciles.find((item) => item.id === e.target.value) || null;
                        syncReconcileForm(next);
                      }}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500"
                    >
                      {reconciles.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.id} / {item.period} / {item.status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">对账经办人</span>
                    <input value={businessForm.reconcileHandler} onChange={(e) => setBusinessForm((prev) => ({ ...prev, reconcileHandler: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" />
                  </label>
                </div>
                {selectedReconcile && (
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">结算周期</p>
                      <p className="mt-2 text-sm font-semibold text-gray-800">{selectedReconcile.period}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">结算机构</p>
                      <p className="mt-2 text-sm font-semibold text-gray-800">{selectedReconcile.institution}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">申报金额</p>
                      <p className="mt-2 text-sm font-semibold text-gray-800">¥{selectedReconcile.claimAmount.toLocaleString()}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <p className="text-xs text-gray-500">当前状态</p>
                      <p className="mt-2 text-sm font-semibold text-gray-800">{selectedReconcile.status}</p>
                    </div>
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">对账结果</span>
                    <select
                      value={businessForm.reconcileResult}
                      onChange={(e) =>
                        setBusinessForm((prev) => ({
                          ...prev,
                          reconcileResult: e.target.value,
                          reconcileConfirmedAmount: e.target.value === '一致' && selectedReconcile ? String(selectedReconcile.claimAmount) : prev.reconcileConfirmedAmount,
                        }))
                      }
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500"
                    >
                      <option>一致</option>
                      <option>部分差异</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">医保确认金额</span>
                    <input
                      value={businessForm.reconcileConfirmedAmount}
                      onChange={(e) => setBusinessForm((prev) => ({ ...prev, reconcileConfirmedAmount: e.target.value }))}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500"
                      disabled={businessForm.reconcileResult === '一致'}
                    />
                  </label>
                </div>
                {businessForm.reconcileResult !== '一致' && (
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">差异原因</span>
                    <input value={businessForm.reconcileDiffReason} onChange={(e) => setBusinessForm((prev) => ({ ...prev, reconcileDiffReason: e.target.value }))} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-cyan-500" placeholder="如目录外项目剔除、身份校验失败等" />
                  </label>
                )}
                <label className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">对账备注</span>
                  <textarea rows={3} value={businessForm.reconcileRemark} onChange={(e) => setBusinessForm((prev) => ({ ...prev, reconcileRemark: e.target.value }))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-cyan-500" />
                </label>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button onClick={closeBusinessModal} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                取消
              </button>
              <button onClick={handleSubmitBusinessModal} className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-700">
                {businessModal.type === 'upload' ? '确认上传' : businessModal.type === 'claim' ? '确认申报' : '确认对账'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showModal && currentSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">结算清单详情</h3>
                <p className="mt-1 text-sm text-gray-500">{currentSettlement.id} / {currentSettlement.patient}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['参保人姓名', currentSettlement.patient],
                ['身份证号', currentSettlement.idCard],
                ['就诊类型', currentSettlement.visitType],
                ['就诊科室', currentSettlement.department],
                ['主要诊断', currentSettlement.diagnosis],
                ['险种类型', currentSettlement.insuranceType],
                ['总费用', `¥${currentSettlement.totalAmount.toLocaleString()}`],
                ['基金支付', `¥${currentSettlement.fundAmount.toLocaleString()}`],
                ['个人自付', `¥${currentSettlement.personalAmount.toLocaleString()}`],
                ['经办人员', currentSettlement.operator],
                ['清单状态', currentSettlement.status],
                ['结算日期', currentSettlement.date],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="mt-2 text-sm font-medium text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

