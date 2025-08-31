<template lang="pug">
div.h-screen.flex.bg-gradient-to-br.from-blue-50.to-blue-100.p-4.overflow-hidden
  SidebarComponent
  // 右コンテンツバー
  .bg-white.shadow-xl.rounded-2xl.p-6.w-full.transition-all.duration-300.flex.flex-col.min-h-0
    HeaderComponent(
      :title='state.title'
    )
    main.flex-1.overflow-y-auto.min-h-0
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
