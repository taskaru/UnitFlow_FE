<template lang="pug">
div.flex.bg-gradient-to-br.from-blue-50.to-blue-100.px-3
  aside.w-56.bg-white.shadow-xl.rounded-2xl.p-4.flex.flex-col.gap-2
    // ホーム
    RouterLink(to="/home" custom v-slot="{ href, navigate, isActive }")
      a(:href="href" @click="navigate"
        class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
        :class="isActive ? 'bg-gray-100 font-semibold' : ''")
        span 🏠
        span ホーム
  
    // 日報
    RouterLink(to="/reports" custom v-slot="{ href, navigate, isActive }")
      a(:href="href" @click="navigate"
        class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
        :class="isActive ? 'bg-gray-100 font-semibold' : ''")
        span 📓
        span 日報
  
    // タスク
    RouterLink(to="/tasks" custom v-slot="{ href, navigate, isActive }")
      a(:href="href" @click="navigate"
        class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
        :class="isActive ? 'bg-gray-100 font-semibold' : ''")
        span 📄
        span タスク
  
    // ブックマーク
    RouterLink(to="/book-marks" custom v-slot="{ href, navigate, isActive }")
      a(:href="href" @click="navigate"
        class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
        :class="isActive ? 'bg-gray-100 font-semibold' : ''")
        span 🔖
        span ブックマーク
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({ name: 'SidebarComponent' });
</script>
