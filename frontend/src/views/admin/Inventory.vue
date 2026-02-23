<template>
  <div class="page">
    <div class="page-header">
      <div><h1 class="page-title">Inventory</h1><p class="page-sub">Wine Catalog — {{ items.length }} items</p></div>
      <AppButton variant="primary" @click="openCreate">+ Add Item</AppButton>
    </div>

    <!-- Low stock alert -->
    <div v-if="lowStock.length" class="low-stock-alert">
      ⚠️ <strong>{{ lowStock.length }}</strong> item(s) running low on stock
    </div>

    <!-- Items grid -->
    <div class="items-grid">
      <div v-for="item in items" :key="item.id" class="item-card card-3d">
        <div class="item-image-wrap">
          <img v-if="item.imageUrl" :src="`${baseUrl}/${item.imageUrl}`" :alt="item.name" class="item-image" />
          <div v-else class="item-placeholder">🍾</div>
          <AppBadge v-if="item.isPromoted" variant="dark" class="promo-badge">Featured</AppBadge>
        </div>
        <div class="item-body">
          <p class="item-name">{{ item.name }}</p>
          <p class="item-desc">{{ item.description || '' }}</p>
          <div class="item-meta">
            <span class="item-price" v-if="item.price">${{ Number(item.price).toFixed(2) }}</span>
            <span class="item-stock" :class="item.stockQuantity <= 5 ? 'stock-low' : ''">
              {{ item.stockQuantity }} in stock
            </span>
          </div>
          <div class="item-actions">
            <AppButton variant="ghost" size="sm" @click="openEdit(item)">Edit</AppButton>
            <AppButton variant="danger" size="sm" @click="deleteItem(item.id)">Delete</AppButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <AppModal v-model="showModal" :title="editing ? 'Edit Item' : 'Add Wine Item'">
      <form class="form" @submit.prevent="saveItem">
        <AppInput v-model="form.name"          label="Name"           placeholder="Château Margaux 2018" />
        <AppInput v-model="form.description"   label="Description"    placeholder="Tasting notes…" />
        <AppInput v-model="form.price"         label="Price ($)"      type="number" placeholder="59.99" />
        <AppInput v-model="form.stockQuantity" label="Stock Qty"      type="number" placeholder="12" />
        <!-- Image upload -->
        <div class="upload-field">
          <label class="upload-label">Bottle Image</label>
          <div class="upload-area" @click="fileInput?.click()">
            <img v-if="imagePreview" :src="imagePreview" class="upload-preview" />
            <div v-else class="upload-placeholder">🍾 Click to upload image</div>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="onFileChange" />
          <p class="upload-hint">{{ selectedFile ? selectedFile.name : (editing?.imageUrl ? 'Current image kept' : 'No image selected') }}</p>
        </div>
        <label class="checkbox-label">
          <input type="checkbox" v-model="form.isPromoted" />
          Feature in Ad Panel
        </label>
      </form>
      <template #footer>
        <AppButton variant="secondary" @click="showModal = false">Cancel</AppButton>
        <AppButton variant="primary" :loading="saving" @click="saveItem">{{ editing ? 'Update' : 'Add' }}</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { inventoryApi } from '@/api/inventory.api'
import { useNotificationStore } from '@/stores/notification.store'
import AppButton from '@/components/ui/AppButton.vue'
import AppBadge from '@/components/ui/AppBadge.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppInput from '@/components/ui/AppInput.vue'

const notify = useNotificationStore()
const baseUrl = (import.meta as any).env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000'
const items = ref<any[]>([]); const lowStock = ref<any[]>([])
const showModal = ref(false); const saving = ref(false); const editing = ref<any>(null)
const form = reactive({ name: '', description: '', price: '', stockQuantity: '', isPromoted: false })
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  selectedFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

async function load() {
  try {
    [items.value, lowStock.value] = await Promise.all([inventoryApi.getAll(), inventoryApi.getLowStock()])
  } catch {}
}
function openCreate() {
  editing.value = null
  Object.assign(form, { name: '', description: '', price: '', stockQuantity: '', isPromoted: false })
  selectedFile.value = null; imagePreview.value = null
  showModal.value = true
}
function openEdit(item: any) {
  editing.value = item
  Object.assign(form, { name: item.name, description: item.description || '', price: item.price || '', stockQuantity: item.stockQuantity, isPromoted: item.isPromoted })
  selectedFile.value = null; imagePreview.value = item.imageUrl ? `${baseUrl}/${item.imageUrl}` : null
  showModal.value = true
}
async function saveItem() {
  saving.value = true
  try {
    let imageUrl: string | undefined
    if (selectedFile.value) {
      const fd = new FormData(); fd.append('image', selectedFile.value)
      const res = await fetch(`${baseUrl}/api/inventory/upload`, { method: 'POST', body: fd })
      const json = await res.json()
      imageUrl = json.data?.imageUrl ?? json.imageUrl
    }
    const data: any = { ...form, price: form.price ? parseFloat(form.price as any) : undefined, stockQuantity: parseInt(form.stockQuantity as any) || 0 }
    if (imageUrl) data.imageUrl = imageUrl
    if (editing.value) { await inventoryApi.update(editing.value.id, data); notify.success('Updated') }
    else { await inventoryApi.create(data); notify.success('Item added') }
    showModal.value = false; await load()
  } catch (e: any) { notify.error(e.message) }
  finally { saving.value = false }
}
async function deleteItem(id: string) {
  if (!confirm('Delete this item?')) return
  try { await inventoryApi.delete(id); notify.success('Deleted'); await load() } catch (e: any) { notify.error(e.message) }
}
onMounted(load)
</script>

<style scoped>
.page { display: flex; flex-direction: column; gap: clamp(1rem, 2vh, 1.5rem); }
.page-header { display: flex; align-items: center; justify-content: space-between; }
.page-title { font-size: clamp(18px, 2.5vw, 26px); font-weight: 800; margin: 0; }
.page-sub { font-size: 13px; color: #525252; margin: 4px 0 0; }
.low-stock-alert { background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 10px 16px; font-size: 13px; color: #92400E; }
.items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(240px, 100%), 1fr)); gap: clamp(0.75rem, 1.5vw, 1.25rem); }
.item-card { background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 16px; overflow: hidden; }
.item-image-wrap { position: relative; aspect-ratio: 3/2; background: #F5F5F5; overflow: hidden; }
.item-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s ease; }
.item-card:hover .item-image { transform: scale(1.05); }
.item-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; }
.promo-badge { position: absolute; top: 8px; right: 8px; }
.item-body { padding: 12px; display: flex; flex-direction: column; gap: 6px; }
.item-name { font-size: clamp(12px, 1.3vw, 14px); font-weight: 700; margin: 0; color: #111111; }
.item-desc { font-size: 12px; color: #525252; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.item-meta { display: flex; justify-content: space-between; align-items: center; }
.item-price { font-size: 13px; font-weight: 700; color: #111111; }
.item-stock { font-size: 12px; color: #525252; }
.stock-low { color: #D97706; font-weight: 600; }
.item-actions { display: flex; gap: 6px; }
.form { display: flex; flex-direction: column; gap: 1rem; }
.checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer; }
.upload-field { display: flex; flex-direction: column; gap: 6px; }
.upload-label { font-size: 13px; font-weight: 600; color: #374151; }
.upload-area { border: 2px dashed #D4D4D4; border-radius: 12px; overflow: hidden; aspect-ratio: 4/3; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: border-color 0.15s; background: #FAFAFA; }
.upload-area:hover { border-color: #111111; }
.upload-preview { width: 100%; height: 100%; object-fit: cover; }
.upload-placeholder { font-size: 14px; color: #A3A3A3; text-align: center; }
.hidden-input { display: none; }
.upload-hint { font-size: 12px; color: #A3A3A3; margin: 0; }
</style>
