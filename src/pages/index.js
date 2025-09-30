// This file centralizes all dynamic import functions for pages.

// Page Components
export const loadHomePage = () => import('./HomePage');
export const loadLoginPage = () => import('./auth/LoginPage'); // Note the path correction to 'auth/LoginPage' from the routes file
export const loadDashboard = () => import('./Dashboard');
export const loadNotFoundPage = () => import('./status/NotFoundPage');

// Nested Dashboard Content Components
// Centralizing these here also makes the routes file cleaner.
export const loadDashboardContent = () => import('../components/dashboard/DashboardContent');
export const loadAccountsContent = () => import('../components/dashboard/AccountsContent');
export const loadSellContent = () => import('../components/dashboard/SellContent');
export const loadInventoryContent = () => import('../components/dashboard/InventoryContent');
export const loadRecordsContent = () => import('../components/dashboard/RecordsContent');
export const loadReportsContent = () => import('../components/dashboard/ReportsContent');

// Benefit: If any file path changes (e.g., 'auth/LoginPage' moves), you only update it ONCE here.
export const loadTestDataPage = () => import('../pages/TestData')