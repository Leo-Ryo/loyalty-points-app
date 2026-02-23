<template>
  <div class="table-wrap">
    <table class="app-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
          <th v-if="$slots.actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!rows?.length">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="table-empty">No data</td>
        </tr>
        <tr v-for="(row, i) in rows" :key="i" class="table-row">
          <td v-for="col in columns" :key="col.key">
            <slot :name="col.key" :row="row">
              {{ row[col.key] ?? '—' }}
            </slot>
          </td>
          <td v-if="$slots.actions">
            <slot name="actions" :row="row" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{ columns: { key: string; label: string }[]; rows: any[] }>()
</script>

<style scoped>
.table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid #E5E5E5; background: #FFFFFF; }
.app-table  { width: 100%; border-collapse: collapse; font-size: clamp(12px, 1.1vw, 14px); }
thead th { padding: clamp(10px, 1.5vw, 14px) clamp(12px, 2vw, 16px); background: #F5F5F5; font-weight: 600; color: #525252; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #E5E5E5; white-space: nowrap; }
td { padding: clamp(10px, 1.5vw, 14px) clamp(12px, 2vw, 16px); color: #111111; border-bottom: 1px solid #F5F5F5; vertical-align: middle; }
.table-row { transition: background 0.12s ease; }
.table-row:hover { background: #FAFAFA; }
.table-row:last-child td { border-bottom: none; }
.table-empty { text-align: center; color: #A3A3A3; padding: 3rem !important; }
</style>
