// This file centralizes all dynamic import functions for pages.

// Page Components
export const loadHomePage = () => import('./HomePage');
export const loadLoginPage = () => import('./auth/LoginPage'); // Note the path correction to 'auth/LoginPage' from the routes file
export const loadDashboard = () => import('./Dashboard');
export const loadNotFoundPage = () => import('./status/NotFoundPage');

// Nested Dashboard Content Components
// Centralizing these here also makes the routes file cleaner.
export const loadDashboardContent = () => import('../components/contents/DashboardContent');
export const loadAccountsContent = () => import('../components/contents/AccountsContent');
export const loadSellContent = () => import('../components/contents/SellContent');
export const loadInventoryContent = () => import('../components/contents/InventoryContent');
export const loadRecordsContent = () => import('../components/contents/RecordsContent');
export const loadReportsContent = () => import('../components/contents/ReportsContent');