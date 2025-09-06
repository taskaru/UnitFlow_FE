<template lang="pug">
div.flex
  .wrapper
    .flex.flex-col.justify-start(
      class="w-[10vw] h-[94vh]"
    )
      // ホーム
      RouterLink(to="/home" custom v-slot="{ href, navigate, isActive }")
        a(:href="href" @click="navigate"
          class="flex items-center gap-2 px-1 py-2 rounded-md transition-colors"
          :class="isActive ? 'border border-gray-400 bg-gray-200/30 font-semibold' : 'hover:bg-gray-200/20' ")
          img(
            src="https://img.icons8.com/?size=100&id=8xhovyHdOQzF&format=png&color=000000"
            alt="home"
            class="w-5 h-5 object-contain"
          )
          .text-white ホーム
    
      // 日報
      RouterLink(to="/reports" custom v-slot="{ href, navigate, isActive }")
        a(:href="href" @click="navigate"
          class="flex items-center gap-2 px-1 py-2 rounded-md transition-colors"
          :class="isActive ? 'border border-gray-400 bg-gray-200/30 font-semibold' : 'hover:bg-gray-200/20' ")
          img(
            src="https://img.icons8.com/?size=100&id=BVOPSSK89IdK&format=png&color=000000"
            alt="report"
            class="w-5 h-5 object-contain"
          )
          .text-white 日報
    
      // タスク
      RouterLink(to="/tasks" custom v-slot="{ href, navigate, isActive }")
        a(:href="href" @click="navigate"
          class="flex items-center gap-2 px-1 py-2 rounded-md transition-colors"
          :class="isActive ? 'border border-gray-400 bg-gray-200/30 font-semibold' : 'hover:bg-gray-200/20' ")
          img(
            src="https://img.icons8.com/?size=100&id=SpXMMMVgt4nf&format=png&color=000000"
            alt="task"
            class="w-5 h-5 object-contain"
          )
          .text-white タスク
      
      //WBS
      RouterLink(to="/wbs" custom v-slot="{ href, navigate, isActive }")
        a(
          :href="href" @click="navigate"
          class="flex items-center gap-2 px-1 py-2 rounded-md transition-colors"
          :class="isActive ? 'border border-gray-400 bg-gray-200/30 font-semibold' : 'hover:bg-gray-200/20' ")
          img(
            src="https://img.icons8.com/?size=100&id=huqtMeHAG3RX&format=png&color=000000"
            alt="WBS"
            class="w-5 h-5 object-contain"
          )
          .text-white WBS
    
      // ブックマーク
      RouterLink(to="/book-marks" custom v-slot="{ href, navigate, isActive }")
        a(:href="href" @click="navigate"
          class="flex items-center gap-2 px-1 py-2 rounded-md transition-colors"
          :class="isActive ? 'border border-gray-400 bg-gray-200/30 font-semibold' : 'hover:bg-gray-200/20' ")
          img(
            src="https://img.icons8.com/?size=100&id=qRAimRvXDHqg&format=png&color=000000"
            alt="bookmark"
            class="w-5 h-5 object-contain"
          )
          .text-white ブックマーク

      // マイページ
      RouterLink(to="/my-page" custom v-slot="{ href, navigate, isActive }")
        a(:href="href" @click="navigate"
          class="flex items-center gap-2 px-1 py-2 rounded-md transition-colors"
          :class="isActive ? 'border border-gray-400 bg-gray-200/30 font-semibold' : 'hover:bg-gray-200/20' ")
          img(
            src="https://img.icons8.com/?size=100&id=p8UFrp2VUgHR&format=png&color=000000"
            alt="person"
            class="w-5 h-5 object-contain"
          )
          .text-white マイページ
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SidebarComponent',
});
</script>
