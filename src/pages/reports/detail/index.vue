<template lang="pug">
.w-screen.h-screen.fixed.inset-0.z-50.pointer-events-none
  //- 背景を黒くする要素
  .absolute.inset-0.z-10(
    v-show="state.isVisible"
    class="bg-black/50 pointer-events-auto"
  )
  //- 日報の詳細
  transition(name="slide-overlay")
    .h-screen.bg-white.absolute.right-0.pointer-events-auto.z-20(
      v-if="state.isVisible"
      :class="['duration-300 ease-in-out transition-[width]', screenSize]"
    )
      //- header
      .w-full.h-12.cursor-pointer.px-4(
        @click="onClickScreensize"
      )
        | <<<
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useReportDetailLogic } from '@/composables/reports/detail/logic';

export default defineComponent({
  name: 'ReportDetailPage',
  components: {},
  setup() {
    const { state, screenSize, onClickScreensize } = useReportDetailLogic();

    return {
      state,
      screenSize,
      onClickScreensize,
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
