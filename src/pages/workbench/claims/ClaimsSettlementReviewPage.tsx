import React from 'react';
import ClaimsStageLayout from './ClaimsStageLayout';
import { claimsStages, type ClaimsRecord } from './claimsConfig';

const stage = claimsStages.find((item) => item.id === 'settlement-review')!;

const records: ClaimsRecord[] = [
  { id: 'JS202604-B021', applicant: '城南医院批次', institution: '城南医院', amount: '2460000', status: '待金额确认', risk: '回退补差', cycle: '2026-04', auditor: '沈航' },
  { id: 'JS202604-B023', applicant: '二院批次', institution: '第二人民医院', amount: '1120000', status: '待清单核对', risk: '拒付偏高', cycle: '2026-04', auditor: '黄欣' },
  { id: 'JS202604-B029', applicant: '中医院批次', institution: '中医院', amount: '680000', status: '复核中', risk: '普通', cycle: '2026-04', auditor: '王晨' },
  { id: 'JS202604-B031', applicant: '妇幼批次', institution: '妇幼保健院', amount: '930000', status: '待提交支付', risk: '跨月批次', cycle: '2026-04', auditor: '沈航' },
  { id: 'JS202604-B033', applicant: '肿瘤医院批次', institution: '肿瘤医院', amount: '1560000', status: '已确认', risk: '普通', cycle: '2026-04', auditor: '黄欣' },
];

export default function ClaimsSettlementReviewPage() {
  return (
    <ClaimsStageLayout
      stage={stage}
      subtitle="办理结算清单核对、批次复核和支付前结算确认。"
      fields={[
        { key: 'id', label: '批次编号' },
        { key: 'applicant', label: '批次名称' },
        { key: 'institution', label: '机构' },
        { key: 'amount', label: '结算金额', type: 'number' },
        { key: 'status', label: '结算状态', type: 'select', options: ['待金额确认', '待清单核对', '复核中', '待提交支付', '已确认'] },
        { key: 'risk', label: '差异标签', type: 'select', options: ['普通', '回退补差', '拒付偏高', '跨月批次'] },
        { key: 'cycle', label: '结算周期' },
        { key: 'auditor', label: '结算人' },
      ]}
      initialRecords={records}
      recordLabel="结算批次"
      createLabel="新增结算批次"
      processLabel="结算确认"
      processTitle="结算确认"
    />
  );
}
