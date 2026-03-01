<template>
  <div class="landing-page">
    <!-- Top brand -->
    <div class="landing-brand">
      <span class="brand-icon">🍷</span>
      <span class="brand-name">{{ businessName }}</span>
    </div>

    <!-- Mode selection -->
    <div class="mode-select">
      <div class="mode-welcome">
        <h1 class="welcome-title">Welcome</h1>
        <p class="welcome-sub">Select how you'd like to continue</p>
      </div>

      <div class="mode-cards stagger">
        <!-- Customer Kiosk -->
        <button class="mode-card mode-card--kiosk" @click="router.push('/kiosk')">
          <div class="card-shine" />
          <div class="mode-icon-wrap">
            <span class="mode-icon">👤</span>
          </div>
          <div class="card-body">
            <h2 class="mode-title">Check My Points</h2>
            <p class="mode-desc">View your points, browse rewards, and check your history</p>
          </div>
          <div class="mode-arrow">→</div>
        </button>

        <!-- Employee Panel -->
        <button class="mode-card mode-card--employee" @click="router.push('/employee/login')">
          <div class="card-shine" />
          <div class="mode-icon-wrap emp-icon">
            <span class="mode-icon">👷</span>
          </div>
          <div class="card-body">
            <h2 class="mode-title">Staff Panel</h2>
            <p class="mode-desc">Look up customers, add points from bills, approve trades</p>
          </div>
          <div class="mode-arrow">→</div>
        </button>

        <!-- Admin — discrete -->
        <button class="mode-card mode-card--admin" @click="router.push('/admin/login')">
          <div class="mode-icon-wrap admin-icon">
            <span class="mode-icon">⚙️</span>
          </div>
          <div class="card-body">
            <h2 class="mode-title">Admin</h2>
            <p class="mode-desc">Manage employees, promotions, inventory and settings</p>
          </div>
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
  /* dark Apple TV‑like gradient */
  background:
    radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 60%),
    linear-gradient(160deg, #0a0a0a 0%, #141414 50%, #0f0f0f 100%);
  padding: clamp(1.5rem, 4vw, 4rem);
  gap: clamp(2rem, 5vh, 4rem);
}

/* Brand */
.landing-brand { display: flex; align-items: center; gap: 12px; }
.brand-icon { font-size: clamp(1.8rem, 4vw, 2.8rem); }
.brand-name {
  font-size: clamp(18px, 2.5vw, 26px);
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: -0.02em;
}

/* Welcome */
.mode-select { display: flex; flex-direction: column; align-items: center; gap: clamp(1.5rem, 3vh, 2.5rem); width: 100%; max-width: 880px; }
.mode-welcome { text-align: center; }
.welcome-title {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 900;
  color: #FFFFFF;
  margin: 0 0 8px;
  letter-spacing: -0.03em;
}
.welcome-sub { font-size: clamp(13px, 1.5vw, 17px); color: rgba(255,255,255,0.38); margin: 0; }

/* Cards grid */
.mode-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(260px,100%), 1fr));
  gap: clamp(1rem, 2vw, 1.25rem);
  width: 100%;
}

.mode-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(10px, 1.5vh, 16px);
  padding: clamp(1.5rem, 3vw, 2.25rem);
  border-radius: 28px;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  position: relative;
  overflow: hidden;
  transition: transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.32s ease;
  -webkit-tap-highlight-color: transparent;
}
.mode-card:active { transform: scale(0.96) !important; transition-duration: 0.08s; }

/* Top specular shine overlay */
.card-shine {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  pointer-events: none;
  z-index: 1;
}

/* Kiosk card — prominent white */
.mode-card--kiosk {
  background: #FFFFFF;
  box-shadow:
    0 8px 32px rgba(0,0,0,0.5),
    0 2px 8px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.9);
}
.mode-card--kiosk:hover {
  transform: translateY(-10px) perspective(800px) rotateX(2.5deg);
  box-shadow:
    0 24px 64px rgba(0,0,0,0.55),
    0 8px 20px rgba(0,0,0,0.30);
}

/* Employee card — dark surface */
.mode-card--employee {
  background: #1C1C1E;
  box-shadow:
    0 8px 32px rgba(0,0,0,0.5),
    0 2px 8px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.07);
}
.mode-card--employee:hover {
  transform: translateY(-10px) perspective(800px) rotateX(2.5deg);
  box-shadow:
    0 24px 64px rgba(0,0,0,0.55),
    0 8px 20px rgba(0,0,0,0.30);
}
.mode-card--employee .mode-title { color: #FFFFFF; }
.mode-card--employee .mode-desc  { color: rgba(255,255,255,0.5); }
.mode-card--employee .mode-arrow { color: rgba(255,255,255,0.35); }

/* Admin — glass */
.mode-card--admin {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.10);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}
.mode-card--admin:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.18);
  transform: translateY(-6px) perspective(800px) rotateX(1.5deg);
  box-shadow: 0 16px 48px rgba(0,0,0,0.4);
}
.mode-card--admin .mode-title { color: rgba(255,255,255,0.85); }
.mode-card--admin .mode-desc  { color: rgba(255,255,255,0.4); }
.mode-card--admin .mode-arrow { color: rgba(255,255,255,0.25); }

/* Icon wrap */
.mode-icon-wrap {
  width: clamp(50px, 6vw, 64px);
  height: clamp(50px, 6vw, 64px);
  border-radius: 18px;
  background: rgba(0,0,0,0.08);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.10);
}
.emp-icon   { background: rgba(255,255,255,0.10); }
.admin-icon { background: rgba(255,255,255,0.08); }
.mode-icon { font-size: clamp(22px, 3vw, 30px); }

.card-body { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.mode-title {
  font-size: clamp(17px, 2vw, 22px);
  font-weight: 800;
  margin: 0;
  color: #111111;
  line-height: 1.2;
  letter-spacing: -0.02em;
}
.mode-desc {
  font-size: clamp(12px, 1.2vw, 14px);
  color: #525252;
  margin: 0;
  line-height: 1.5;
}

.mode-arrow {
  font-size: clamp(18px, 2.2vw, 24px);
  color: #A3A3A3;
  margin-top: auto;
  transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
  align-self: flex-end;
}
.mode-card:hover .mode-arrow { transform: translateX(8px); }

.powered-by { font-size: 11px; color: rgba(255,255,255,0.15); letter-spacing: 0.08em; text-transform: uppercase; }
</style>
