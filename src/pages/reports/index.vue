<template lang="pug">
div.h-screen.flex.bg-black.p-4
  SidebarComponent
  // 右コンテンツバー
  .wrapper.dark.flex.flex-col(
    class="w-[87vw]"
  )
    HeaderComponent(
      title='日報'
    )
    main.flex-1.overflow-y-auto.min-h-0
      ReportComponent(
        :line-num="13"
      )
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SidebarComponent from '../../components/SidebarComponent.vue';
import HeaderComponent from '../../components/HeaderComponent.vue';

import ReportComponent from '../../components/reports/ReportComponent.vue';

export default defineComponent({
  name: 'ReportsPage',
  components: {
    SidebarComponent,
    HeaderComponent,
    ReportComponent,
  },
  setup() {
    const onBookmark = () => {
      return;
    };
    const onOpen = () => {
      return;
    };
    const onEdit = () => {
      return;
    };
    const onDelete = () => {
      return;
    };

    return {
      onBookmark,
      onOpen,
      onEdit,
      onDelete,
    };
  },
});
</script>
