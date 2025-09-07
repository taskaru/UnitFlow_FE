<template lang="pug">
div.h-screen.flex.bg-black.p-4
  SidebarComponent
  // 右コンテンツバー
  .wrapper.dark.flex.flex-col(
    class="w-[87vw]"
  )
    HeaderComponent(
      :title="state.title"
    )
    main.flex-1.overflow-y-auto(
      class="w-[85vw]"
    )
      TaskEditor_v2/
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import SidebarComponent from '../../components/SidebarComponent.vue';
import HeaderComponent from '../../components/HeaderComponent.vue';
import TaskEditor_v2 from './TaskEditor_v2.vue';

export default defineComponent({
  name: 'TasksPage',
  components: {
    SidebarComponent,
    HeaderComponent,
    TaskEditor_v2,
  },
  setup() {
    const state = reactive({
      title: 'タスク',
    });

    return {
      state,
    };
  },
});
</script>
