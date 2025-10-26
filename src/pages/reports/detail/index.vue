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
      .w-full.h-12.cursor-pointer.px-4.flex(
        @click="onClickScreensize"
      )
        | {{ state.isFullWidth ? "➡️" : "⬅️"}} 日報詳細ページ
      //- report content
      .w-full.p-6.space-y-6
        //- 業務内容
        .space-y-2
          .text-xl.font-semibold.text-gray-800 ◼︎業務内容
          .bg-gray-50.rounded-lg.p-4.min-h-20.cursor-text.border.border-gray-200.transition-colors(
             :class="['hover:border-gray-300']"
             @click="toggleEdit('businessContent')"
          )
            textarea.w-full.bg-transparent.resize-none.outline-none.min-h-16(
              v-if="state.isEditing.businessContent"
              :value="state.content.businessContent"
              @input="updateContent('businessContent', $event.target.value)"
              @blur="finishEdit('businessContent')"
              @keydown.enter.ctrl="finishEdit('businessContent')"
              placeholder="業務内容を入力してください..."
              ref="businessContentTextarea"
            )
            .text-gray-700.whitespace-pre-wrap(
              v-else
            ) {{ state.content.businessContent || 'クリックして編集...' }}
        
        //- 本日の感想
        .space-y-2
          .text-xl.font-semibold.text-gray-800 ◼︎本日の感想
          .bg-gray-50.rounded-lg.p-4.min-h-20.cursor-text.border.border-gray-200.transition-colors(
             :class="['hover:border-gray-300']"
             @click="toggleEdit('dailyThoughts')"
          )
            textarea.w-full.bg-transparent.resize-none.outline-none.min-h-16(
              v-if="state.isEditing.dailyThoughts"
              :value="state.content.dailyThoughts"
              @input="updateContent('dailyThoughts', $event.target.value)"
              @blur="finishEdit('dailyThoughts')"
              @keydown.enter.ctrl="finishEdit('dailyThoughts')"
              placeholder="本日の感想を入力してください..."
              ref="dailyThoughtsTextarea"
            )
            .text-gray-700.whitespace-pre-wrap(
              v-else
            ) {{ state.content.dailyThoughts || 'クリックして編集...' }}
        
        //- 本日の反省点・本日の一歩
        .space-y-2
          .text-xl.font-semibold.text-gray-800 ◼︎本日の反省点・本日の一歩
          .bg-gray-50.rounded-lg.p-4.min-h-20.cursor-text.border.border-gray-200.transition-colors(
             :class="['hover:border-gray-300']"
             @click="toggleEdit('reflection')"
          )
            textarea.w-full.bg-transparent.resize-none.outline-none.min-h-16(
              v-if="state.isEditing.reflection"
              :value="state.content.reflection"
              @input="updateContent('reflection', $event.target.value)"
              @blur="finishEdit('reflection')"
              @keydown.enter.ctrl="finishEdit('reflection')"
              placeholder="本日の反省点を入力してください..."
              ref="reflectionTextarea"
            )
            .text-gray-700.whitespace-pre-wrap(
              v-else
            ) {{ state.content.reflection || 'クリックして編集...' }}
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue';
import { useReportDetailLogic } from '@/composables/reports/detail/logic';

export default defineComponent({
  name: 'ReportDetailPage',
  components: {},
  setup() {
    const {
      state,
      screenSize,
      onClickScreensize,
      toggleEdit,
      updateContent,
      finishEdit,
    } = useReportDetailLogic();

    // Auto-focus textarea when entering edit mode
    const focusTextarea = async (field: string) => {
      await nextTick();
      const textarea = document.querySelector(
        `[ref="${field}Textarea"]`
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.select();
      }
    };

    const handleToggleEdit = (field: keyof typeof state.value.isEditing) => {
      toggleEdit(field);
      if (state.value.isEditing[field]) {
        focusTextarea(field);
      }
    };

    return {
      state,
      screenSize,
      onClickScreensize,
      toggleEdit: handleToggleEdit,
      updateContent,
      finishEdit,
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
