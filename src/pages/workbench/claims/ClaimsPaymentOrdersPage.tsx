import React from 'react';
import ClaimsStageLayout from './ClaimsStageLayout';
import { claimsStages, type ClaimsRecord } from './claimsConfig';

const stage = claimsStages.find((item) => item.id === 'payment-orders')!;

const records: ClaimsRecord[] = [
  { id: 'ZF20260426003', applicant: '市人民医院', institution: '市人民医院', amount: '1820000', status: '待生成指令', risk: '普通', paymentDate: '2026-04-27', account: '6222****0081' },
  { id: 'ZF20260426005', applicant: '中医院', institution: '中医院', amount: '920000', status: '待账户核验', risk: '账号变更', paymentDate: '2026-04-27', account: '6222****0198' },
  { id: 'ZF20260426008', applicant: '妇幼保健院', institution: '妇幼保健院', amount: '630000', status: '待回盘确认', risk: '普通', paymentDate: '2026-04-28', account: '6222****0272' },
  { id: 'ZF20260426009', applicant: '骨科医院', institution: '骨科医院', amount: '470000', status: '支付失败', risk: '开户名不符', paymentDate: '2026-04-28', account: '6222****0368' },
  { id: 'ZF20260426012', applicant: '肿瘤医院', institution: '肿瘤医院', amount: '1380000', status: '已下发', risk: '普通', paymentDate: '2026-04-28', account: '6222****0551' },
];

export default function ClaimsPaymentOrdersPage() {
  return (
    <ClaimsStageLayout
      stage={stage}
      subtitle="办理支付批次生成、账户核验、指令下发和回盘确认。"
      fields={[
        { key: 'id', label: '指令编号' },
        { key: 'applicant', label: '收款单位' },
        { key: 'institution', label: '机构' },
        { key: 'amount', label: '支付金额', type: 'number' },
        { key: 'status', label: '指令状态', type: 'select', options: ['待生成指令', '待账户核验', '待回盘确认', '支付失败', '已下发'] },
        { key: 'risk', label: '风险标签', type: 'select', options: ['普通', '账号变更', '开户名不符'] },
        { key: 'paymentDate', label: '支付日期', type: 'date' },
        { key: 'account', label: '收款账号' },
      ]}
      initialRecords={records}
      recordLabel="支付指令"
      createLabel="新增支付指令"
      processLabel="下发指令"
      processTitle="下发支付指令"
    />
  );
}
