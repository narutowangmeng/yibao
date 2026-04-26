import React from 'react';
import ClaimsStageLayout from './ClaimsStageLayout';
import { claimsStages, type ClaimsRecord } from './claimsConfig';

const stage = claimsStages.find((item) => item.id === 'reconciliation')!;

const records: ClaimsRecord[] = [
  { id: 'DZ202604-011', applicant: '市人民医院', institution: '市人民医院', amount: '3420000', status: '待三方核对', risk: '差额 12.6 万', cycle: '2026-04', owner: '刘捷' },
  { id: 'DZ202604-014', applicant: '中心医院', institution: '中心医院', amount: '2180000', status: '待机构确认', risk: '退费冲回', cycle: '2026-04', owner: '张颖' },
  { id: 'DZ202604-019', applicant: '中医院', institution: '中医院', amount: '1360000', status: '处理中', risk: '普通', cycle: '2026-04', owner: '王彬' },
  { id: 'DZ202604-021', applicant: '妇幼保健院', institution: '妇幼保健院', amount: '980000', status: '待销账', risk: '支付时点差', cycle: '2026-04', owner: '刘捷' },
  { id: 'DZ202604-025', applicant: '肿瘤医院', institution: '肿瘤医院', amount: '1850000', status: '已完成', risk: '普通', cycle: '2026-04', owner: '张颖' },
];

export default function ClaimsReconciliationPage() {
  return (
    <ClaimsStageLayout
      stage={stage}
      subtitle="办理账单核对、差异确认、机构反馈和销账处理。"
      fields={[
        { key: 'id', label: '对账编号' },
        { key: 'applicant', label: '机构名称' },
        { key: 'institution', label: '归属机构' },
        { key: 'amount', label: '对账金额', type: 'number' },
        { key: 'status', label: '对账状态', type: 'select', options: ['待三方核对', '待机构确认', '处理中', '待销账', '已完成'] },
        { key: 'risk', label: '差异标签', type: 'select', options: ['普通', '差额 12.6 万', '退费冲回', '支付时点差'] },
        { key: 'cycle', label: '账期' },
        { key: 'owner', label: '对账负责人' },
      ]}
      initialRecords={records}
      recordLabel="对账记录"
      createLabel="新增对账记录"
      processLabel="对账确认"
      processTitle="对账确认"
    />
  );
}
