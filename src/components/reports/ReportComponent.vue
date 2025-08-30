<template lang="pug">
.group.relative.w-full.bg-white.rounded-xl.shadow-md.overflow-hidden
  div(class="relative pb-[100%]")
    .absolute.top-2.right-2.flex.gap-2.opacity-0(
      class="group-hover:opacity-100 transition-opacity duration-150 z-10"
    )
      button(
        @click="onBookmark" 
        class="px-2 py-1 text-xs bg-white/90 hover:bg-white rounded-md shadow.border border-gray-200"
      ) 🔖
      button(
        @click="onOpen" 
        class="px-2 py-1 text-xs bg-white/90 hover:bg-white rounded-md shadow border border-gray-200"
      ) 🔍
      template(v-if="isMine")
        button(
          @click="onEdit" 
          class="px-2 py-1 text-xs bg-white/90 hover:bg-white rounded-md shadow border border-gray-200"
        ) ✏️
        button(
          @click="onDelete" 
          class="px-2 py-1 text-xs bg-white/90 hover:bg-white rounded-md shadow border border-gray-200"
        ) 🗑️

    // Content layer filling the square
    .absolute.inset-0.p-4.flex.flex-col
      // profile + name
      .flex.items-center.gap-3
        img.w-10.h-10.rounded-full.object-cover(:src="avatarUrl" :alt="name")
        h3.text-sm.font-semibold.text-gray-900.line-clamp-1 {{ name }}

      // 日報日付
      p.text-base.font-semibold.text-gray-800.mt-3.line-clamp-1 {{ title }}

      // 感想文
      p.text-sm.text-gray-600.mt-2.whitespace-pre-line.line-clamp-3 {{ description }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ReportComponent',
  props: {
    avatarUrl: {
      type: String,
      default: 'https://via.placeholder.com/48x48.png?text=U',
    },
    name: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    isMine: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['bookmark', 'open', 'edit', 'delete'],
  setup(_, { emit }) {
    const onBookmark = () => emit('bookmark');
    const onOpen = () => emit('open');
    const onEdit = () => emit('edit');
    const onDelete = () => emit('delete');
    return { onBookmark, onOpen, onEdit, onDelete };
  },
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
