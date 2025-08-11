<template lang="pug">
div.flex.bg-gradient-to-br.from-blue-50.to-blue-100.px-3
  // 左サイドバー
  aside.w-56.bg-white.shadow-xl.rounded-2xl.p-4.flex.flex-col.gap-2
    // ホーム
    RouterLink(
      to="/home"
      v-slot="{ isActive }"
      class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
      :class="isActive ? 'bg-gray-100 font-semibold' : ''"
    )
      span 🏠
      span Home
    // 日報
    RouterLink(
      to="/diary"
      v-slot="{ isActive }"
      class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
      :class="isActive ? 'bg-gray-100 font-semibold' : ''"
    )
      span 📓
      span 日報
    // タスク
    RouterLink(
      to="/tasks"
      v-slot="{ isActive }"
      class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
      :class="isActive ? 'bg-gray-100 font-semibold' : ''"
    )
      span 📄
      span タスク
    // ボックマーク
    RouterLink(
      to="/bookmarks"
      v-slot="{ isActive }"
      class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
      :class="isActive ? 'bg-gray-100 font-semibold' : ''"
    )
      span 🔖
      span ブックマーク

</template>
