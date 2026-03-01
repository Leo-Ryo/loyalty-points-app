<template>
  <div class="lookup-page">
    <div class="lookup-card card-3d">
      <div class="signup-header">
        <router-link to="/kiosk" class="back-link">← Back</router-link>
        <span class="brand-icon">🍷</span>
        <h2 class="form-title">Create Account</h2>
        <p class="form-desc">Join our rewards program and start earning points today.</p>
      </div>

      <form @submit.prevent="signup" class="signup-form" novalidate>
        <AppInput v-model="form.name"  label="Full Name"    placeholder="Jane Doe"           :error="errors.name" />
        <AppInput v-model="form.phone" label="Phone Number" placeholder="0801234567" />
        <AppInput v-model="form.email" label="Email"        type="email" placeholder="jane@email.com" />
        <p v-if="errors.general" class="form-error">{{ errors.general }}</p>
        <AppButton type="submit" variant="primary" :loading="loading" class="w-full">
          Create Account & Start Earning 🎉
        </AppButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/api/auth.api'
import { useCustomerStore } from '@/stores/customer.store'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const customer = useCustomerStore()
const loading = ref(false)
const form = reactive({ name: '', phone: '', email: '' })
const errors = reactive({ name: '', general: '' })

async function signup() {
  errors.name = ''; errors.general = ''
  if (!(form.name || '').trim()) { errors.name = 'Full name is required'; return }
  if (!(form.phone || '').trim() && !(form.email || '').trim()) { errors.general = 'Phone number or email is required'; return }

  loading.value = true
  try {
    const data = await authApi.customerRegister({ 
      name: (form.name || '').trim(), 
      phone: (form.phone || '').trim() || undefined, 
      email: (form.email || '').trim() || undefined 
    })
    customer.setCustomer(data)
    router.push('/kiosk/dashboard')
  } catch (e: any) {
    errors.general = e.message || 'Registration failed — please try again'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.lookup-page {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 60%),
    linear-gradient(160deg, #0a0a0a 0%, #141414 50%, #0f0f0f 100%);
  padding: clamp(1rem, 4vw, 3rem);
}
.lookup-card {
  background: #FFFFFF; border-radius: 28px;
  padding: clamp(2rem, 5vw, 3.5rem); width: 100%; max-width: 440px;
  box-shadow: 0 24px 72px rgba(0,0,0,0.40), 0 8px 24px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.9);
}
.signup-header { text-align: center; margin-bottom: 1.5rem; }
.back-link {
  font-size: 13px; color: #525252; text-decoration: none;
  display: inline-block; margin-bottom: 1rem; padding: 6px 12px;
  border: 1px solid rgba(0,0,0,0.10); border-radius: 10px;
  background: rgba(0,0,0,0.03);
  transition: all 0.18s ease;
}
.back-link:hover { background: rgba(0,0,0,0.07); }
.brand-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
.form-title { font-size: clamp(18px, 2.5vw, 22px); font-weight: 800; margin: 0 0 6px; letter-spacing: -0.02em; color: #111111; }
.form-desc { font-size: 13px; color: #A3A3A3; margin: 0; }
.signup-form { display: flex; flex-direction: column; gap: 1rem; }
.form-error { font-size: 13px; color: #DC2626; text-align: center; margin: 0; background: #FEF2F2; padding: 8px 12px; border-radius: 10px; border: 1px solid rgba(220,38,38,0.15); }
.w-full { width: 100%; }
</style>
