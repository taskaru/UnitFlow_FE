<template lang="pug">
.w-screen.h-screen.fixed.inset-0.z-50.pointer-events-none
  .absolute.inset-0(
    v-show="state.isVisible"
    class="bg-black/50 pointer-events-auto"
  )

  // overlay content container
  .relative.z-20.flex.pointer-events-none
    .h-screen(
      class="w-1/2"
    )
    // sliding panel
    transition(name="slide-overlay")
      .h-screen.bg-white.pointer-events-auto(
        v-if="state.isVisible"
        class="w-1/2"
      )
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

<style scoped>
.slide-overlay-enter-active,
.slide-overlay-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}
.slide-overlay-enter-from,
.slide-overlay-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.slide-overlay-enter-to,
.slide-overlay-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
