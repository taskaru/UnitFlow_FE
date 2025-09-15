<template lang="pug">
.relative(ref="moreOptionsRef")
  //- もっと見るボタン
  span.block.text-4xl.flex.justify-center.items-center.cursor-pointer(
    :class='paddingClass'
    @click="onClickToggle"
  ) ...

  //- MoreOptions
  transition(name="fade")
    div(
      v-if="show"
      class="w-40 flex flex-col absolute bg-[#1a1a1a] text-white border border-gray-600 rounded-md top-9 -right-5 z-10 overflow-hidden"
    )
      transition-group(
        name="staggered-fade"
        tag="div"
        appear
      )
        .w-full.flex.justify-center.items-center.cursor-pointer.py-3.px-2(
          v-for="(item, index) in menuItems"
          :key="item"
          :style="{ '--i': index }"
          class="hover:bg-gray-700"
        ) {{ item }}
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeUnmount } from 'vue';

export default defineComponent({
  name: 'MoreOptions',
  props: {
    paddingClass: {
      type: String,
      required: true,
    },
  },
  emits: ['edit', 'bookmark', 'delete'],
  setup() {
    const show = ref(false);
    const menuItems = ref(['ブックマーク', '編集', '削除', 'コピー']);
    const moreOptionsRef = ref<HTMLElement | null>(null);

    const onClickToggle = () => {
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

    watch(show, value => {
      if (value) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    });

    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', handleClickOutside);
    });

    return {
      show,
      menuItems,
      onClickToggle,
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

.staggered-fade-enter-active,
.staggered-fade-leave-active {
  transition: all 0.4s ease;
}
.staggered-fade-enter-active {
  transition-delay: calc(0.07s * var(--i));
}
.staggered-fade-enter-from,
.staggered-fade-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>
