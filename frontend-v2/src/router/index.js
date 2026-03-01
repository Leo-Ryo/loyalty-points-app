import { createRouter, createWebHistory } from 'vue-router';

// Kiosk Views
import KioskLayout from '../layouts/KioskLayout.vue';
import KioskMain from '../views/kiosk/KioskMain.vue';
import InventoryView from '../views/kiosk/InventoryView.vue';
import OffersView from '../views/kiosk/OffersView.vue';
import AccountView from '../views/kiosk/AccountView.vue';

// Staff Views
import StaffLayout from '../layouts/StaffLayout.vue';
import StaffDashboard from '../views/staff/StaffDashboard.vue';
import TradeRequests from '../views/staff/TradeRequests.vue';
import CustomerManagement from '../views/staff/CustomerManagement.vue';
import InventoryManagement from '../views/staff/InventoryManagement.vue';
import OfferManagement from '../views/staff/OfferManagement.vue';
import ReportsView from '../views/staff/ReportsView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // ── Kiosk Routes ──
        {
            path: '/',
            component: KioskLayout,
            children: [
                { path: '', component: KioskMain },
                { path: 'inventory', component: InventoryView },
                { path: 'offers', component: OffersView },
                { path: 'account', component: AccountView },
            ]
        },
        // ── Staff Routes ──
        {
            path: '/staff',
            component: StaffLayout,
            children: [
                { path: '', component: StaffDashboard },
                { path: 'trades', component: TradeRequests },
                { path: 'customers', component: CustomerManagement },
                { path: 'inventory', component: InventoryManagement },
                { path: 'offers', component: OfferManagement },
                { path: 'reports', component: ReportsView },
            ]
        }
    ]
});

export default router;
