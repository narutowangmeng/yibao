import type { UserRole } from '../types/roles';

export type AgencyCode =
  | 'headquarters'
  | 'nanjing'
  | 'wuxi'
  | 'xuzhou'
  | 'changzhou'
  | 'suzhou'
  | 'nantong'
  | 'lianyungang'
  | 'huaian'
  | 'yancheng'
  | 'yangzhou'
  | 'zhenjiang'
  | 'taizhou'
  | 'suqian';

export type AgencyLevel = 'province' | 'city';

export type ManagementPageKey =
  | 'dashboard'
  | 'reports'
  | 'treatment'
  | 'fund-supervision'
  | 'medical-service'
  | 'dept-staff'
  | 'agency-management'
  | 'enterprise-management'
  | 'operation-admin'
  | 'settings';

export type ManagementAction = 'view' | 'create' | 'edit' | 'delete' | 'publish' | 'export';

interface PagePermission {
  province: {
    roles: UserRole[];
    actions: ManagementAction[];
  };
  city: {
    roles: UserRole[];
    actions: ManagementAction[];
  };
}

export const MANAGEMENT_PAGE_PERMISSIONS: Record<ManagementPageKey, PagePermission> = {
  dashboard: {
    province: {
      roles: ['system_admin', 'bureau_leader', 'treatment_director', 'fund_supervisor', 'medical_service_director'],
      actions: ['view', 'export'],
    },
    city: {
      roles: ['system_admin', 'bureau_leader', 'treatment_director', 'fund_supervisor', 'medical_service_director'],
      actions: ['view', 'export'],
    },
  },
  reports: {
    province: {
      roles: ['bureau_leader'],
      actions: ['view', 'export'],
    },
    city: {
      roles: [],
      actions: [],
    },
  },
  treatment: {
    province: {
      roles: ['system_admin', 'bureau_leader', 'treatment_director'],
      actions: ['view', 'create', 'edit', 'publish', 'export'],
    },
    city: {
      roles: ['bureau_leader', 'treatment_director'],
      actions: ['view', 'export'],
    },
  },
  'fund-supervision': {
    province: {
      roles: ['system_admin', 'bureau_leader', 'fund_supervisor'],
      actions: ['view', 'create', 'edit', 'publish', 'export'],
    },
    city: {
      roles: ['bureau_leader', 'fund_supervisor'],
      actions: ['view', 'export'],
    },
  },
  'medical-service': {
    province: {
      roles: ['system_admin', 'bureau_leader', 'medical_service_director'],
      actions: ['view', 'create', 'edit', 'publish', 'export'],
    },
    city: {
      roles: ['bureau_leader', 'medical_service_director'],
      actions: ['view', 'export'],
    },
  },
  'dept-staff': {
    province: {
      roles: ['treatment_director', 'fund_supervisor', 'medical_service_director'],
      actions: ['view', 'create', 'edit', 'delete', 'export'],
    },
    city: {
      roles: ['treatment_director', 'fund_supervisor', 'medical_service_director'],
      actions: ['view', 'export'],
    },
  },
  'agency-management': {
    province: {
      roles: ['system_admin', 'bureau_leader'],
      actions: ['view', 'create', 'edit', 'delete', 'publish', 'export'],
    },
    city: {
      roles: ['system_admin', 'bureau_leader'],
      actions: ['view', 'export'],
    },
  },
  'enterprise-management': {
    province: {
      roles: ['system_admin', 'bureau_leader'],
      actions: ['view', 'create', 'edit', 'export'],
    },
    city: {
      roles: ['bureau_leader'],
      actions: ['view', 'export'],
    },
  },
  'operation-admin': {
    province: {
      roles: ['system_admin'],
      actions: ['view', 'create', 'edit', 'delete', 'publish', 'export'],
    },
    city: {
      roles: ['system_admin'],
      actions: ['view', 'export'],
    },
  },
  settings: {
    province: {
      roles: ['system_admin'],
      actions: ['view', 'edit', 'publish'],
    },
    city: {
      roles: [],
      actions: [],
    },
  },
};

export function getAgencyLevel(agencyCode?: string): AgencyLevel {
  return agencyCode === 'headquarters' || !agencyCode ? 'province' : 'city';
}

export function canAccessManagementPage(role: UserRole, agencyCode: string | undefined, pageKey: ManagementPageKey): boolean {
  const level = getAgencyLevel(agencyCode);
  return MANAGEMENT_PAGE_PERMISSIONS[pageKey][level].roles.includes(role);
}

export function canDoManagementAction(
  role: UserRole,
  agencyCode: string | undefined,
  pageKey: ManagementPageKey,
  action: ManagementAction,
): boolean {
  if (!canAccessManagementPage(role, agencyCode, pageKey)) {
    return false;
  }
  const level = getAgencyLevel(agencyCode);
  return MANAGEMENT_PAGE_PERMISSIONS[pageKey][level].actions.includes(action);
}
