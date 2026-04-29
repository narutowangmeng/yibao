export interface SettlementStorageItem {
  id: string;
  institution: string;
  period: string;
  amount: number;
  status: string;
  createTime: string;
  paymentNo: string;
  reconcileResult: string;
  arrivalStatus: string;
  operatorName: string;
  remark: string;
}

const STORAGE_KEY = 'yb_fund_settlement_submissions';

export function getStoredSettlementSubmissions() {
  if (typeof window === 'undefined') {
    return [] as SettlementStorageItem[];
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SettlementStorageItem[]) : [];
  } catch {
    return [];
  }
}

export function appendSettlementSubmission(item: SettlementStorageItem) {
  const next = [item, ...getStoredSettlementSubmissions()];
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
