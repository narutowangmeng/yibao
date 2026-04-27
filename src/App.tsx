import React, { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import RoleBasedSidebar from './components/Layout/RoleBasedSidebar';
import { Header } from './components/Layout/Header';
import RoleBasedDashboard from './components/Dashboard/RoleBasedDashboard';
import Login from './pages/Login';
import Settings from './pages/Settings';
import StatisticalReports from './pages/report/StatisticalReports';
import ReportDetailPage from './pages/report/ReportDetailPage';
import TreatmentDepartment from './pages/departments/TreatmentDepartment';
import FundSupervision from './pages/departments/FundSupervision';
import MedicalService from './pages/departments/MedicalService';
import InstitutionPortal from './pages/institution/InstitutionPortal';
import EmployerPortal from './pages/portal/EmployerPortal';
import PersonalService from './pages/portal/PersonalService';
import DepartmentStaffManagement from './pages/admin/DepartmentStaffManagement';
import AgencyManagement from './pages/admin/AgencyManagement';
import RuleEngine from './pages/admin/RuleEngine';
import EnterpriseManagement from './pages/workbench/modules/EnterpriseManagement';
import OperationAdminManagement from './pages/admin/OperationAdminManagement';
import EnrollmentWorkbench from './pages/workbench/EnrollmentWorkbench';
import PaymentCollectionWorkbench from './pages/workbench/PaymentCollectionWorkbench';
import PaymentCalcWorkbench from './pages/workbench/PaymentCalcWorkbench';
import ReimbursementWorkbench from './pages/workbench/ReimbursementWorkbench';
import AuditWorkbench from './pages/workbench/AuditWorkbench';
import FundSettlementWorkbench from './pages/workbench/FundSettlementWorkbench';
import FinanceWorkbench from './pages/workbench/FinanceWorkbench';
import InspectionWorkbench from './pages/workbench/InspectionWorkbench';
import EmployerManagementWorkbench from './pages/workbench/EmployerManagementWorkbench';
import ClaimsManagementWorkbench from './pages/workbench/ClaimsManagementWorkbench';
import ClaimsIntakePage from './pages/workbench/claims/ClaimsIntakePage';
import ClaimsManualReviewPage from './pages/workbench/claims/ClaimsManualReviewPage';
import ClaimsSettlementReviewPage from './pages/workbench/claims/ClaimsSettlementReviewPage';
import ClaimsPaymentOrdersPage from './pages/workbench/claims/ClaimsPaymentOrdersPage';
import ClaimsReconciliationPage from './pages/workbench/claims/ClaimsReconciliationPage';
import ClaimsExceptionsPage from './pages/workbench/claims/ClaimsExceptionsPage';
import type { UserRole } from './types/roles';
import { canAccessManagementPage, type ManagementPageKey } from './config/managementPermissions';

type SystemType = 'management' | 'operation' | 'portal';

const DEFAULT_ROLE: UserRole = 'bureau_leader';

const pageTitles: Record<string, string> = {
  '/dashboard': '数据概览',
  '/reports': '报表中心',
  '/treatment': '待遇保障',
  '/fund-supervision': '基金监管',
  '/fund-supervision/rule-engine': '规则引擎',
  '/medical-service': '医药服务管理',
  '/workbench/enrollment': '参保登记',
  '/workbench/payment': '缴费',
  '/workbench/payment-calc': '缴费核定',
  '/workbench/claims': '理赔管理',
  '/workbench/claims/intake': '理赔管理 - 申报受理',
  '/workbench/claims/manual-review': '理赔管理 - 人工审核',
  '/workbench/claims/settlement-review': '理赔管理 - 结算审核',
  '/workbench/claims/payment-orders': '理赔管理 - 支付指令',
  '/workbench/claims/reconciliation': '理赔管理 - 机构对账',
  '/workbench/claims/exceptions': '理赔管理 - 异常处理',
  '/workbench/reimbursement': '费用报销',
  '/workbench/audit': '费用审核',
  '/workbench/fund-settlement': '基金结算',
  '/workbench/finance': '财务管理',
  '/workbench/inspection': '稽核检查',
  '/institutions': '医疗机构门户',
  '/employer': '参保单位门户',
  '/personal': '个人服务大厅',
  '/settings': '系统设置',
  '/dept-staff': '部门人员管理',
  '/agency-management': '机构管理',
  '/enterprise-management': '企业管理',
  '/operation-admin': '系统管理',
};

function AppContent() {
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(DEFAULT_ROLE);
  const [currentAgency, setCurrentAgency] = useState<string>('headquarters');
  const [currentOperatorIdentity, setCurrentOperatorIdentity] = useState<'经办' | '审核'>('经办');
  const currentPath = location.pathname;
  const title = currentPath.startsWith('/reports/')
    ? '报表详情'
    : (pageTitles[currentPath] || '数据概览');

  const canAccessPage = (pageKey: ManagementPageKey) => canAccessManagementPage(currentRole, currentAgency, pageKey);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const guardedRoutes: Array<{ prefix: string; pageKey: ManagementPageKey }> = [
      { prefix: '/reports', pageKey: 'reports' },
      { prefix: '/treatment', pageKey: 'treatment' },
      { prefix: '/fund-supervision', pageKey: 'fund-supervision' },
      { prefix: '/medical-service', pageKey: 'medical-service' },
      { prefix: '/dept-staff', pageKey: 'dept-staff' },
      { prefix: '/agency-management', pageKey: 'agency-management' },
      { prefix: '/enterprise-management', pageKey: 'enterprise-management' },
      { prefix: '/operation-admin', pageKey: 'operation-admin' },
      { prefix: '/settings', pageKey: 'settings' },
    ];

    const blockedRoute = guardedRoutes.find((route) => currentPath.startsWith(route.prefix) && !canAccessPage(route.pageKey));
    if (blockedRoute) {
      window.location.hash = '#/dashboard';
    }
  }, [canAccessPage, currentAgency, currentPath, currentRole, isLoggedIn]);

  const getActiveTab = () => {
    if (currentPath.startsWith('/reports')) {
      return 'reports';
    }
    if (currentPath.startsWith('/institutions')) {
      return currentRole === 'institution_pharmacy' ? 'pharmacy-portal' : 'institution-portal';
    }
    if (currentPath.startsWith('/employer')) {
      return 'employer-portal';
    }
    if (currentPath.startsWith('/personal')) {
      return 'personal-portal';
    }
    const path = currentPath.replace('/', '');
    return path || 'dashboard';
  };

  const handleLogin = (role: UserRole, agency?: string, operatorIdentity?: '经办' | '审核') => {
    const nextAgency = agency || currentAgency;
    setCurrentRole(role);
    setCurrentAgency(nextAgency);
    setCurrentOperatorIdentity(operatorIdentity || '经办');
    setIsLoggedIn(true);

    let defaultPath = '#/dashboard';
    if (role === 'bureau_leader' && nextAgency === 'headquarters') defaultPath = '#/reports';
    if (role === 'institution_admin' || role === 'institution_hospital') defaultPath = '#/institutions?mode=hospital';
    else if (role === 'institution_pharmacy') defaultPath = '#/institutions?mode=pharmacy';
    else if (role === 'employer_admin') defaultPath = '#/employer';
    else if (role === 'insured_person') defaultPath = '#/personal';
    else if (role === 'operator_enrollment') defaultPath = '#/workbench/enrollment';
    else if (role === 'operator_contribution') defaultPath = '#/workbench/payment';
    else if (role === 'operator_payment') defaultPath = '#/workbench/payment-calc';
    else if (role === 'operator_reimbursement') defaultPath = '#/workbench/reimbursement';
    else if (role === 'operator_claims') defaultPath = '#/workbench/claims';
    else if (role === 'auditor_audit') defaultPath = '#/workbench/audit';
    else if (role === 'auditor_settlement') defaultPath = '#/workbench/fund-settlement';
    else if (role === 'finance_manager') defaultPath = '#/workbench/finance';
    else if (role === 'auditor_inspection') defaultPath = '#/workbench/inspection';
    else if (role === 'employer_management') defaultPath = '#/workbench/employer-management';
    else if (role === 'operation_admin') defaultPath = '#/workbench/operation-admin';

    window.location.hash = defaultPath;
  };

  const handleLogout = () => {
    const roleSystemMap: Record<string, SystemType> = {
      bureau_leader: 'management',
      treatment_director: 'management',
      fund_supervisor: 'management',
      medical_service_director: 'management',
      system_admin: 'management',
      operator_enrollment: 'operation',
      operator_contribution: 'operation',
      operator_payment: 'operation',
      operator_reimbursement: 'operation',
      operator_claims: 'operation',
      auditor_audit: 'operation',
      auditor_settlement: 'operation',
      finance_manager: 'operation',
      auditor_inspection: 'operation',
      employer_management: 'operation',
      operation_admin: 'operation',
      institution_admin: 'portal',
      institution_hospital: 'portal',
      institution_pharmacy: 'portal',
      employer_admin: 'portal',
      insured_person: 'portal',
    };

    const systemType = roleSystemMap[currentRole] || 'management';
    setIsLoggedIn(false);
    setCurrentRole(DEFAULT_ROLE);
    setCurrentOperatorIdentity('经办');
    window.location.hash = `?system=${systemType}`;
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const isWorkbenchPage = currentPath.startsWith('/workbench/');

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {!isWorkbenchPage && <RoleBasedSidebar activeTab={getActiveTab()} userRole={currentRole} userAgency={currentAgency} />}
      <div className={isWorkbenchPage ? '' : 'ml-64'}>
        <Header
          title={title}
          theme={theme}
          userRole={currentRole}
          userAgency={currentAgency}
          userOperatorIdentity={currentOperatorIdentity}
          onLogout={handleLogout}
        />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<RoleBasedDashboard userRole={currentRole} />} />
            <Route path="/dashboard" element={<RoleBasedDashboard userRole={currentRole} />} />
            <Route
              path="/reports"
              element={canAccessPage('reports') ? <StatisticalReports /> : <Navigate to="/dashboard" replace />}
            />
            <Route
              path="/reports/:groupId/:reportId"
              element={canAccessPage('reports') ? <ReportDetailPage /> : <Navigate to="/dashboard" replace />}
            />

            <Route
              path="/treatment"
              element={canAccessPage('treatment') ? <TreatmentDepartment userRole={currentRole} userAgency={currentAgency} /> : <Navigate to="/dashboard" replace />}
            />
            <Route
              path="/fund-supervision"
              element={canAccessPage('fund-supervision') ? <FundSupervision userRole={currentRole} userAgency={currentAgency} /> : <Navigate to="/dashboard" replace />}
            />
            <Route path="/fund-supervision/rule-engine" element={canAccessPage('fund-supervision') ? <RuleEngine /> : <Navigate to="/dashboard" replace />} />
            <Route
              path="/medical-service"
              element={canAccessPage('medical-service') ? <MedicalService userRole={currentRole} userAgency={currentAgency} /> : <Navigate to="/dashboard" replace />}
            />

            <Route path="/workbench/enrollment" element={<EnrollmentWorkbench />} />
            <Route path="/workbench/payment" element={<PaymentCollectionWorkbench />} />
            <Route path="/workbench/payment-calc" element={<PaymentCalcWorkbench />} />
            <Route path="/workbench/claims" element={<ClaimsManagementWorkbench />} />
            <Route path="/workbench/claims/intake" element={<ClaimsIntakePage />} />
            <Route path="/workbench/claims/manual-review" element={<ClaimsManualReviewPage />} />
            <Route path="/workbench/claims/settlement-review" element={<ClaimsSettlementReviewPage />} />
            <Route path="/workbench/claims/payment-orders" element={<ClaimsPaymentOrdersPage />} />
            <Route path="/workbench/claims/reconciliation" element={<ClaimsReconciliationPage />} />
            <Route path="/workbench/claims/exceptions" element={<ClaimsExceptionsPage />} />
            <Route path="/workbench/reimbursement" element={<ReimbursementWorkbench />} />
            <Route path="/workbench/audit" element={<AuditWorkbench />} />
            <Route path="/workbench/fund-settlement" element={<FundSettlementWorkbench />} />
            <Route path="/workbench/finance" element={<FinanceWorkbench />} />
            <Route path="/workbench/inspection" element={<InspectionWorkbench />} />
            <Route path="/workbench/employer-management" element={<EmployerManagementWorkbench />} />
            <Route path="/workbench/operation-admin" element={<OperationAdminManagement />} />

            <Route path="/institutions" element={<InstitutionPortal portalRole={currentRole} />} />
            <Route path="/employer" element={<EmployerPortal />} />
            <Route path="/personal" element={<PersonalService />} />

            <Route
              path="/dept-staff"
              element={
                canAccessPage('dept-staff') ? (
                  <DepartmentStaffManagement
                    userRole={currentRole as 'treatment_director' | 'fund_supervisor' | 'medical_service_director'}
                  />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />
            <Route
              path="/agency-management"
              element={canAccessPage('agency-management') ? <AgencyManagement userRole={currentRole} userAgency={currentAgency} /> : <Navigate to="/dashboard" replace />}
            />
            <Route path="/enterprise-management" element={canAccessPage('enterprise-management') ? <EnterpriseManagement /> : <Navigate to="/dashboard" replace />} />
            <Route
              path="/operation-admin"
              element={canAccessPage('operation-admin') ? <OperationAdminManagement userRole={currentRole} userAgency={currentAgency} /> : <Navigate to="/dashboard" replace />}
            />
            <Route path="/settings" element={canAccessPage('settings') ? <Settings /> : <Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
