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
.table-wrap {
  overflow-x: auto;
  border-radius: 18px;
  background: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.06);
}
.app-table { width: 100%; border-collapse: collapse; font-size: clamp(12px, 1.1vw, 13px); }

thead th {
  padding: clamp(10px, 1.5vw, 13px) clamp(12px, 2vw, 16px);
  background: rgba(242,242,247,0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-weight: 600;
  color: #A3A3A3;
  text-align: left;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  white-space: nowrap;
}
thead th:first-child { border-top-left-radius: 18px; }
thead th:last-child  { border-top-right-radius: 18px; }

td {
  padding: clamp(10px, 1.5vw, 13px) clamp(12px, 2vw, 16px);
  color: #111111;
  border-bottom: 1px solid rgba(0,0,0,0.04);
  vertical-align: middle;
}
.table-row { transition: background 0.14s ease; }
.table-row:hover { background: rgba(0,0,0,0.02); }
.table-row:last-child td { border-bottom: none; }
.table-empty { text-align: center; color: #A3A3A3; padding: 3rem !important; font-size: 14px; }
</style>
