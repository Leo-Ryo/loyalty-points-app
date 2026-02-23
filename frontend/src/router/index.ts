import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useCustomerStore } from '@/stores/customer.store'
import { useEmployeeStore } from '@/stores/employee.store'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        // ── Admin ────────────────────────────────────────────
        { path: '/admin/login', name: 'AdminLogin', component: () => import('@/views/auth/AdminLogin.vue') },
        {
            path: '/admin',
            component: () => import('@/layouts/AdminLayout.vue'),
            meta: { requiresAdmin: true },
            children: [
                { path: '', redirect: '/admin/dashboard' },
                { path: 'dashboard', name: 'AdminDashboard', component: () => import('@/views/admin/Dashboard.vue') },
                { path: 'customers', name: 'AdminCustomers', component: () => import('@/views/admin/Customers.vue') },
                { path: 'customers/:id', name: 'CustomerDetail', component: () => import('@/views/admin/CustomerDetail.vue') },
                { path: 'rewards', name: 'AdminRewards', component: () => import('@/views/admin/Rewards.vue') },
                { path: 'inventory', name: 'AdminInventory', component: () => import('@/views/admin/Inventory.vue') },
                { path: 'promotions', name: 'AdminPromotions', component: () => import('@/views/admin/Promotions.vue') },
                { path: 'transactions', name: 'AdminTransactions', component: () => import('@/views/admin/Transactions.vue') },
                { path: 'employees', name: 'AdminEmployees', component: () => import('@/views/admin/Employees.vue') },
                { path: 'settings', name: 'AdminSettings', component: () => import('@/views/admin/Settings.vue') },
            ],
        },

        // ── Employee Panel ────────────────────────────────────
        { path: '/employee/login', name: 'EmployeeLogin', component: () => import('@/views/employee/EmployeeLogin.vue') },
        {
            path: '/employee',
            component: () => import('@/layouts/EmployeeLayout.vue'),
            meta: { requiresEmployee: true },
            children: [
                { path: '', redirect: '/employee/lookup' },
                { path: 'lookup', name: 'EmployeeLookup', component: () => import('@/views/employee/EmployeeLookup.vue') },
                { path: 'approvals', name: 'EmployeeApprovals', component: () => import('@/views/employee/EmployeeApprovals.vue') },
                { path: 'settings', name: 'EmployeeSettings', component: () => import('@/views/employee/EmployeePinSettings.vue') },
            ],
        },

        // ── Customer Kiosk ────────────────────────────────────
        { path: '/kiosk', name: 'KioskLookup', component: () => import('@/views/customer/CustomerLookup.vue') },
        { path: '/kiosk/signup', name: 'KioskSignup', component: () => import('@/views/customer/CustomerSignup.vue') },
        {
            path: '/kiosk',
            component: () => import('@/layouts/CustomerLayout.vue'),
            meta: { requiresCustomer: true },
            children: [
                { path: 'dashboard', name: 'KioskDashboard', component: () => import('@/views/customer/CustomerDashboard.vue') },
                { path: 'rewards', name: 'KioskRewards', component: () => import('@/views/customer/CustomerRewards.vue') },
                { path: 'history', name: 'KioskHistory', component: () => import('@/views/customer/CustomerHistory.vue') },
            ],
        },

        // ── Landing ───────────────────────────────────────────
        { path: '/', name: 'Landing', component: () => import('@/views/Landing.vue') },
        { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
})

// Navigation guards
router.beforeEach((to) => {
    const auth = useAuthStore()
    const customer = useCustomerStore()
    const emp = useEmployeeStore()

    if (to.meta.requiresAdmin && !auth.isAuthenticated) return '/admin/login'
    if (to.meta.requiresEmployee && !emp.isAuthenticated) return '/employee/login'
    if (to.meta.requiresCustomer && !customer.activeCustomer) return '/kiosk'
})

export default router
