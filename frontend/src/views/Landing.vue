<template>
  <div class="landing-page">
    <!-- Subtle top brand -->
    <div class="landing-brand">
      <span class="brand-icon">🍷</span>
      <span class="brand-name">{{ businessName }}</span>
    </div>

    <!-- Mode selection -->
    <div class="mode-select">
      <div class="mode-welcome">
        <h1 class="welcome-title">Welcome</h1>
        <p class="welcome-sub">Please select how you'd like to continue</p>
      </div>

      <div class="mode-cards">
        <!-- Customer Kiosk -->
        <button class="mode-card mode-card--kiosk card-3d" @click="router.push('/kiosk')">
          <div class="mode-icon-wrap">
            <span class="mode-icon">👤</span>
          </div>
          <h2 class="mode-title">Check My Points</h2>
          <p class="mode-desc">View your points, browse rewards, and check your history</p>
          <div class="mode-arrow">→</div>
        </button>

        <!-- Employee Panel -->
        <button class="mode-card mode-card--employee card-3d" @click="router.push('/employee/login')">
          <div class="mode-icon-wrap emp-icon">
            <span class="mode-icon">👷</span>
          </div>
          <h2 class="mode-title">Staff Panel</h2>
          <p class="mode-desc">Look up customers, add points from bills, approve trades</p>
          <div class="mode-arrow">→</div>
        </button>

        <!-- Admin Panel — discrete, secondary style -->
        <button class="mode-card mode-card--admin" @click="router.push('/admin/login')">
          <div class="mode-icon-wrap admin">
            <span class="mode-icon">⚙️</span>
          </div>
          <h2 class="mode-title">Admin</h2>
          <p class="mode-desc">Manage employees, promotions, inventory and settings</p>
          <div class="mode-arrow">→</div>
        </button>
      </div>
    </div>

    <!-- Bottom branding -->
    <p class="powered-by">Loyalty & Rewards Program</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { settingsApi } from '@/api/settings.api'

const router = useRouter()
const businessName = ref('The Wine Cellar')

onMounted(async () => {
  try { const s = await settingsApi.get(); businessName.value = s.businessName || 'The Wine Cellar' } catch {}
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 50%, #111111 100%);
  padding: clamp(1.5rem, 4vw, 4rem);
  gap: clamp(2rem, 5vh, 4rem);
}

.landing-brand { display: flex; align-items: center; gap: 12px; }
.brand-icon   { font-size: clamp(2rem, 4vw, 3rem); }
.brand-name   { font-size: clamp(18px, 2.5vw, 28px); font-weight: 900; color: #FFFFFF; letter-spacing: -0.01em; }

.mode-select { display: flex; flex-direction: column; align-items: center; gap: clamp(1.5rem, 3vh, 2.5rem); width: 100%; max-width: 860px; }

.mode-welcome { text-align: center; }
.welcome-title { font-size: clamp(28px, 5vw, 52px); font-weight: 900; color: #FFFFFF; margin: 0 0 8px; letter-spacing: -0.02em; }
.welcome-sub   { font-size: clamp(13px, 1.5vw, 17px); color: rgba(255,255,255,0.45); margin: 0; }

.mode-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  width: 100%;
}

.mode-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(10px, 1.5vh, 16px);
  padding: clamp(1.5rem, 3vw, 2.5rem);
  border-radius: 24px;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  -webkit-tap-highlight-color: transparent;
}
.mode-card:active { transform: scale(0.97) !important; }

/* Kiosk — primary prominent card */
.mode-card--kiosk {
  background: #FFFFFF;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.mode-card--kiosk:hover {
  transform: translateY(-8px) perspective(700px) rotateX(2deg);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

/* Employee Panel — dark accent */
.mode-card--employee {
  background: #111827;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.mode-card--employee:hover {
  transform: translateY(-8px) perspective(700px) rotateX(2deg);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
.mode-card--employee .mode-title { color: #FFFFFF; }
.mode-card--employee .mode-desc  { color: rgba(255,255,255,0.6); }
.mode-card--employee .mode-arrow { color: rgba(255,255,255,0.5); }
.emp-icon { background: rgba(255,255,255,0.12); }

/* Admin — subtle secondary style */
.mode-card--admin {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
}
.mode-card--admin:hover {
  background: rgba(255,255,255,0.10);
  border-color: rgba(255,255,255,0.2);
  transform: translateY(-4px);
}

.mode-icon-wrap {
  width: clamp(52px, 6vw, 68px);
  height: clamp(52px, 6vw, 68px);
  border-radius: 18px;
  background: #111111;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mode-icon-wrap.admin { background: rgba(255,255,255,0.1); }
.mode-icon { font-size: clamp(22px, 3vw, 30px); }

.mode-title {
  font-size: clamp(18px, 2.2vw, 24px);
  font-weight: 800;
  margin: 0;
  color: #111111;
  line-height: 1.2;
}
.mode-card--admin .mode-title { color: #FFFFFF; }

.mode-desc {
  font-size: clamp(12px, 1.3vw, 14px);
  color: #525252;
  margin: 0;
  line-height: 1.5;
}
.mode-card--admin .mode-desc { color: rgba(255,255,255,0.5); }

.mode-arrow {
  font-size: clamp(18px, 2.5vw, 24px);
  color: #A3A3A3;
  margin-top: auto;
  transition: transform 0.2s ease;
}
.mode-card:hover .mode-arrow { transform: translateX(6px); }
.mode-card--admin .mode-arrow { color: rgba(255,255,255,0.35); }

.powered-by { font-size: 12px; color: rgba(255,255,255,0.2); letter-spacing: 0.06em; text-transform: uppercase; }
</style>
