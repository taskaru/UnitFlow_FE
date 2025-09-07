<template lang="pug">
div.h-screen.flex.bg-black.p-4
  SidebarComponent
  // 右コンテンツバー
  .wrapper.dark.flex.flex-col(
    class="w-[87vw]"
  )
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
