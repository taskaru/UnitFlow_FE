<template lang="pug">
div.min-h-screen.flex.bg-gradient-to-br.from-blue-50.to-blue-100.p-4
  SidebarComponent
  // 右コンテンツバー
  .bg-white.shadow-xl.rounded-2xl.p-6.w-full.max-w-7xl.transition-all.duration-300.flex.flex-col
    HeaderComponent(
      :title='state.title'
    )
    main.flex-1.overflow-y-auto
      RouterView/
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import SidebarComponent from '../../components/SidebarComponent.vue';
import HeaderComponent from '../../components/HeaderComponent.vue';

export default defineComponent({
  name: 'HomePage',
  components: {
    SidebarComponent,
    HeaderComponent,
  },
  setup() {
    const state = reactive({
      title: 'ホーム',
    });

    return {
      state,
    };
  },
});
</script>
