// This file centralizes all dynamic import functions for pages.

// Page Components
export const loadHomePage = () => import('./HomePage');
export const loadLoginPage = () => import('./auth/LoginPage'); // Note the path correction to 'auth/LoginPage' from the routes file
export const loadDashboard = () => import('./Dashboard');
export const loadNotFoundPage = () => import('./status/NotFoundPage');

// Nested Dashboard Content Components
// Centralizing these here also makes the routes file cleaner.
export const loadInventoryContent = () => import('../components/inventory/InventoryContent');
export const loadDashboardContent = () => import('../components/dashboard/DashboardContent');
export const loadProfileContent = () => import('../components/profiles/ProfileContent');

export const loadAccountsContent = () => import('../components/contents/AccountsContent');
export const loadSellContent = () => import('../components/sells/SellContent');
export const loadRecordsContent = () => import('../components/contents/RecordsContent');
// export const loadReportsContent = () => import('../components/contents/ReportsContent');

export const loadForbiddenPage = () => import('../pages/status/ForbiddenPage')