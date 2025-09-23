<template lang="pug">
div.h-screen.flex.bg-blue.p-4(
  v-if="state.isVisible"
)
  .wrapper
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useReportDetailLogic } from '@/composables/reports/detail/logic';

export default defineComponent({
  name: 'ReportDetailPage',
  components: {},
  setup() {
    const { state } = useReportDetailLogic();

    return {
      state,
    };
  },
});
</script>
