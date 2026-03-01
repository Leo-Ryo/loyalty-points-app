<template>
  <div class="login-page">
    <div class="login-left">
      <div class="brand">
        <span class="brand-icon">🍷</span>
        <h1 class="brand-title">The Wine Cellar</h1>
        <p class="brand-sub">Loyalty & Rewards Management</p>
      </div>
    </div>

    <div class="login-right">
      <div class="login-card">
        <h2 class="login-title">Admin Login</h2>
        <p class="login-desc">Sign in to manage your loyalty system</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <AppInput v-model="email" label="Email" type="email" placeholder="admin@example.com" :error="errors.email" />
          <AppInput v-model="password" label="Password" type="password" placeholder="••••••••" :error="errors.password" />
          <p v-if="errors.general" class="form-error">{{ errors.general }}</p>
          <AppButton type="submit" variant="primary" :loading="loading" class="w-full">Sign In</AppButton>
        </form>

        <p class="login-hint">Customer kiosk? <router-link to="/kiosk" class="link">Go to Kiosk →</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useSettingsStore } from '@/stores/settings.store'
import { authApi } from '@/api/auth.api'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const auth = useAuthStore()
const settings = useSettingsStore()

const email = ref(''); const password = ref(''); const loading = ref(false)
const errors = reactive({ email: '', password: '', general: '' })

async function handleLogin() {
  errors.email = ''; errors.password = ''; errors.general = ''
  if (!email.value) { errors.email = 'Email is required'; return }
  if (!password.value) { errors.password = 'Password is required'; return }

  loading.value = true
  try {
    const data = await authApi.adminLogin(email.value.toLowerCase().trim(), password.value)
    auth.login(data)
    await settings.loadSettings()
    router.push('/admin/dashboard')
  } catch (e: any) {
    errors.general = e.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  width: 100vw;
}

/* Left — dark brand panel */
.login-left {
  background: #111111;
  background-image: radial-gradient(ellipse at 30% 60%, rgba(255,255,255,0.03) 0%, transparent 60%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 5vw, 5rem);
}
.brand { text-align: center; color: #FFFFFF; }
.brand-icon { font-size: clamp(3rem, 6vw, 5rem); display: block; margin-bottom: 1.25rem; }
.brand-title {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 900;
  margin: 0 0 0.5rem;
  letter-spacing: -0.03em;
}
.brand-sub { font-size: clamp(13px, 1.4vw, 16px); color: rgba(255,255,255,0.4); margin: 0; }

/* Right — form panel */
.login-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 5vw, 5rem);
  background: #F2F2F7;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 24px;
  padding: clamp(2rem, 4vw, 3rem);
  box-shadow:
    0 2px 8px rgba(0,0,0,0.06),
    0 1px 3px rgba(0,0,0,0.04),
    inset 0 1px 0 rgba(255,255,255,0.9);
}

.login-title { font-size: clamp(20px, 2.5vw, 26px); font-weight: 800; color: #111111; margin: 0 0 6px; letter-spacing: -0.02em; }
.login-desc  { font-size: 14px; color: #A3A3A3; margin: 0 0 2rem; }
.login-form  { display: flex; flex-direction: column; gap: 1rem; }
.form-error  { font-size: 13px; color: #DC2626; margin: 0; text-align: center; background: #FEF2F2; padding: 8px 12px; border-radius: 10px; }
.login-hint  { font-size: 13px; color: #A3A3A3; text-align: center; margin-top: 1.5rem; margin-bottom: 0; }
.link        { color: #111111; font-weight: 600; text-decoration: none; }
.link:hover  { text-decoration: underline; }
.w-full      { width: 100%; margin-top: 8px; }

@media (max-width: 700px) {
  .login-page { grid-template-columns: 1fr; }
  .login-left { display: none; }
  .login-right { background: #111111; }
  .login-card { border-color: rgba(255,255,255,0.1); }
}
</style>
