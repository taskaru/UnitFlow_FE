<template lang="pug">
.relative.inline-block
  div(@mouseenter="show = true" @mouseleave="show = false")

  transition(name="fade")
    div(
      v-show="show"
      class="absolute top-full left-1/2 transform -translate-x-1/2 z-10 mt-2 w-36 bg-white rounded-lg shadow-lg p-1 ring-1 ring-black ring-opacity-5"
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
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MoreOptions',
  emits: ['edit', 'bookmark', 'delete'],
  setup() {
    const show = ref(false);

    return {
      show,
    };
  },
});
</script>
