<template lang="pug">
.relative.inline-block(ref="moreOptionsRef")
  div(@click="toggle")
    //- 3点リーダー
    .w-8.h-8.flex.items-center.justify-center.cursor-pointer
      .text-2xl.font-bold ...

  transition(name="fade")
    div(
      v-show="show"
      class="absolute top-full right-0 z-10 mt-2 w-36 bg-white rounded-lg shadow-lg p-1 ring-1 ring-black ring-opacity-5"
    )
      // メニュー項目：イベント発生
      div(class="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" @click="$emit('edit')")
        // アイコン + テキスト
        span 編集
      div(class="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" @click="$emit('bookmark')")
        // アイコン + テキスト
        span ブックマーク
      div(class="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" @click="$emit('delete')")
        // アイコン + テキスト
        span 削除
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';

export default defineComponent({
  name: 'MoreOptions',
  emits: ['edit', 'bookmark', 'delete'],
  setup() {
    const show = ref(false);
    const moreOptionsRef = ref<HTMLElement | null>(null);

    const toggle = () => {
      show.value = !show.value;
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreOptionsRef.value &&
        !moreOptionsRef.value.contains(event.target as Node)
      ) {
        show.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      show,
      toggle,
      moreOptionsRef,
    };
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    transform 0.2s ease-in-out,
    opacity 0.3s ease-in-out;
  transform-origin: top;
}
.fade-enter-from,
.fade-leave-to {
  transform: scaleY(0.9);
  opacity: 0;
}
</style>
