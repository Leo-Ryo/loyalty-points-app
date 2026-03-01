<template>
  <div class="profile-page no-scrollbar">

    <!-- Header -->
    <header class="profile-header">
      <button class="back-btn" @click="router.back()">
        <img src="@/assets/Outline Icons/Arrow internal left.png" class="back-icon" alt="Back" />
      </button>
      <h1 class="header-title">My Profile</h1>
      <button class="logout-btn" @click="logout">
        <img src="@/assets/Outline Icons/Log out.png" class="logout-icon" alt="Log out" />
      </button>
    </header>

    <!-- Avatar + name card -->
    <div class="avatar-card">
      <div class="big-avatar">{{ c?.name?.[0]?.toUpperCase() ?? '?' }}</div>
      <h2 class="avatar-name">{{ c?.name }}</h2>
      <div class="points-pill">
        <span class="pts-num">{{ c?.points?.toLocaleString() }}</span>
        <span class="pts-label">pts ⭐</span>
      </div>
    </div>

    <!-- Editable info form -->
    <div class="info-card">
      <h3 class="card-title">Contact Information</h3>

      <label class="field-label">Full Name</label>
      <input v-model="form.name" class="field-input" type="text" placeholder="Your name" />

      <label class="field-label">Phone Number</label>
      <input v-model="form.phone" class="field-input" type="tel" placeholder="+1 000-000-0000" />

      <label class="field-label">Email Address</label>
      <input v-model="form.email" class="field-input" type="email" placeholder="you@email.com" />

      <p v-if="error" class="form-error">{{ error }}</p>
      <p v-if="saved" class="form-success">✓ Changes saved!</p>

      <button class="save-btn" :disabled="saving" @click="save">
        <span v-if="saving" class="spinner" />
        <span v-else>Save Changes</span>
      </button>
    </div>

    <!-- bottom nav padding -->
    <div style="height: 40px" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customer.store'
import { useNotificationStore } from '@/stores/notification.store'
import { customerApi } from '@/api/customer.api'

const router = useRouter()
const customer = useCustomerStore()
const notify = useNotificationStore()
const c = computed(() => customer.activeCustomer)

const form = ref({ name: '', phone: '', email: '' })
const saving = ref(false)
const saved = ref(false)
const error = ref('')

onMounted(() => {
  if (c.value) {
    form.value.name  = c.value.name  || ''
    form.value.phone = c.value.phone || ''
    form.value.email = c.value.email || ''
  }
})

async function save() {
  if (!c.value) return
  error.value = ''; saved.value = false
  if (!form.value.name.trim()) { error.value = 'Name is required'; return }
  saving.value = true
  try {
    const updated = await customerApi.update(c.value.id, form.value)
    customer.setCustomer(updated)
    saved.value = true
    notify.success('Profile updated!')
    setTimeout(() => { saved.value = false }, 3000)
  } catch (e: any) {
    error.value = e.message || 'Failed to save — please try again'
  } finally {
    saving.value = false
  }
}

function logout() {
  customer.clearCustomer()
  router.push('/kiosk')
}
</script>

<style scoped>
.profile-page {
  height: 100%;
  overflow-y: auto;
  background: #F8FAFF;
  padding: clamp(1rem, 2vw, 1.5rem) clamp(1rem, 3vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Header */
.profile-header {
  display: flex; align-items: center; justify-content: space-between;
}
.header-title { font-size: 18px; font-weight: 800; color: #19213D; margin: 0; }
.back-btn, .logout-btn {
  width: 40px; height: 40px; border-radius: 12px; border: 1px solid #EDEFF5;
  background: #FFFFFF; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.15s ease;
}
.back-btn:hover, .logout-btn:hover { background: #EDEFF5; }
.back-icon, .logout-icon {
  width: 18px; height: 18px; object-fit: contain;
  filter: brightness(0) saturate(100%) invert(10%) sepia(30%) saturate(800%) hue-rotate(195deg);
}
.logout-icon { filter: brightness(0) saturate(100%) invert(30%) sepia(80%) saturate(500%) hue-rotate(330deg); }

/* Avatar card */
.avatar-card {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  background: #FFFFFF; border-radius: 24px;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  border: 1px solid #EDEFF5;
  box-shadow: 0 2px 12px rgba(25,33,61,0.07);
}
.big-avatar {
  width: 80px; height: 80px; border-radius: 50%;
  background: #19213D; color: #FFFFFF;
  font-size: 32px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(25,33,61,0.25);
}
.avatar-name { font-size: 22px; font-weight: 800; color: #19213D; margin: 0; letter-spacing: -0.02em; }
.points-pill {
  display: flex; align-items: center; gap: 6px;
  background: #8DC1FF; color: #19213D;
  padding: 8px 20px; border-radius: 99px;
  box-shadow: 0 2px 8px rgba(141,193,255,0.40);
}
.pts-num { font-size: 18px; font-weight: 900; letter-spacing: -0.02em; }
.pts-label { font-size: 13px; opacity: 0.75; }

/* Info form card */
.info-card {
  background: #FFFFFF; border-radius: 20px;
  padding: clamp(1rem, 2vw, 1.5rem);
  border: 1px solid #EDEFF5;
  box-shadow: 0 2px 10px rgba(25,33,61,0.06);
  display: flex; flex-direction: column; gap: 4px;
}
.card-title { font-size: 15px; font-weight: 700; color: #19213D; margin: 0 0 12px; }
.field-label { font-size: 12px; font-weight: 600; color: #6D758F; margin: 8px 0 4px; }
.field-input {
  width: 100%; padding: 12px 14px;
  border: 1.5px solid #D7DBE7; border-radius: 12px;
  font-family: inherit; font-size: 15px;
  color: #19213D; background: #F8FAFF; outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
  box-sizing: border-box;
}
.field-input:focus { border-color: #8DC1FF; box-shadow: 0 0 0 4px rgba(195,221,255,0.40); }
.field-input::placeholder { color: #A1A7BB; }

.form-error   { font-size: 12px; color: #DC2626; background: #FEF2F2; padding: 8px 12px; border-radius: 10px; margin: 4px 0; }
.form-success { font-size: 12px; color: #16A34A; background: #F0FDF4; padding: 8px 12px; border-radius: 10px; margin: 4px 0; }

.save-btn {
  margin-top: 12px; width: 100%; padding: 14px;
  background: #8DC1FF; color: #19213D;
  border: none; border-radius: 14px; font-family: inherit;
  font-size: 15px; font-weight: 800; cursor: pointer;
  transition: background 0.18s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 4px 14px rgba(141,193,255,0.35);
}
.save-btn:hover:not(:disabled) { background: #4E9FFF; transform: translateY(-2px); }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.spinner {
  display: inline-block; width: 16px; height: 16px;
  border: 2px solid rgba(25,33,61,0.25); border-top-color: #19213D;
  border-radius: 50%; animation: spin 0.65s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
