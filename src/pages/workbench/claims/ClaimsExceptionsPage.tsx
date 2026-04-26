import React from 'react';
import ClaimsStageLayout from './ClaimsStageLayout';
import { claimsStages, type ClaimsRecord } from './claimsConfig';

const stage = claimsStages.find((item) => item.id === 'exceptions')!;

const records: ClaimsRecord[] = [
  { id: 'YC20260426007', applicant: '李敏', institution: '市人民医院', amount: '14280', status: '待补件复核', risk: '资料缺失', source: '申报受理', owner: '顾晨' },
  { id: 'YC20260426011', applicant: '二院批次', institution: '第二人民医院', amount: '320000', status: '待责任分派', risk: '结算差额', source: '结算审核', owner: '林菲' },
  { id: 'YC20260426013', applicant: '骨科医院支付', institution: '骨科医院', amount: '470000', status: '支付失败处理中', risk: '账户异常', source: '支付指令', owner: '顾晨' },
  { id: 'YC20260426018', applicant: '赵晨', institution: '中心医院', amount: '18230', status: '待申诉结论', risk: '规则冲突', source: '人工审核', owner: '林菲' },
  { id: 'YC20260426024', applicant: '中医院对账', institution: '中医院', amount: '86000', status: '已闭环', risk: '普通', source: '机构对账', owner: '王璐' },
];

export default function ClaimsExceptionsPage() {
  return (
    <ClaimsStageLayout
      stage={stage}
      subtitle="办理异常识别、责任分派、过程跟踪和闭环处置。"
      fields={[
        { key: 'id', label: '异常编号' },
        { key: 'applicant', label: '异常对象' },
        { key: 'institution', label: '关联机构' },
        { key: 'amount', label: '涉及金额', type: 'number' },
        { key: 'status', label: '处置状态', type: 'select', options: ['待补件复核', '待责任分派', '支付失败处理中', '待申诉结论', '已闭环'] },
        { key: 'risk', label: '异常类型', type: 'select', options: ['普通', '资料缺失', '结算差额', '账户异常', '规则冲突'] },
        { key: 'source', label: '来源环节', type: 'select', options: ['申报受理', '人工审核', '结算审核', '支付指令', '机构对账'] },
        { key: 'owner', label: '责任人' },
      ]}
      initialRecords={records}
      recordLabel="异常任务"
      createLabel="新增异常任务"
      processLabel="处置"
      processTitle="处置异常任务"
      processFields={[
        { key: 'disposeDecision', label: '处置决定', type: 'select', options: ['退回补件', '转人工审核', '转结算复核', '挂起待核', '闭环办结'] },
        { key: 'nextStatus', label: '处置后状态', type: 'select', options: ['待补件复核', '待责任分派', '处理中', '待申诉结论', '已闭环'] },
        { key: 'deadline', label: '办结时限', type: 'date' },
        { key: 'assistDept', label: '协同部门' },
        { key: 'feedbackTarget', label: '反馈对象' },
        { key: 'disposeNote', label: '处理意见', type: 'textarea' },
      ]}
      processActions={['退回补件', '转审核', '挂起', '升级', '闭环']}
    />
  );
}
