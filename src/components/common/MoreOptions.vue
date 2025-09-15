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
      class="w-40 flex flex-col absolute bg-[#1a1a1a] text-white border border-gray-600 rounded-md top-11 -right-5 z-10"
    )
      //- Triangle
      .absolute.w-3.h-3.border-t.border-l.border-gray-600.overflow-hidden.z-0(
        class="top-[-0.4rem] right-[1.6rem] rotate-45 bg-[#1a1a1a]"
      )
      //- Menu items
      transition-group(
        name="staggered-fade"
        tag="div"
        appear
        class="overflow-hidden rounded-md relative z-10"
      )
        .w-full.flex.justify-center.items-center.cursor-pointer.py-3.px-2.border-b.border-gray-600(
          v-for="(menu, index) in menus"
          :key="menu"
          :style="{ '--i': index }"
          class="hover:bg-gray-700"
          @click="handleMenuClick(menu)"
        ) {{ menu }}
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
  emits: ['edit', 'bookmark', 'delete', 'detail'],
  setup(_, { emit }) {
    const show = ref(false);
    const menus = ref(['ブックマーク', '編集', '削除', '詳細']);
    const moreOptionsRef = ref<HTMLElement | null>(null);

    const eventMap: { [key: string]: string } = {
      ブックマーク: 'bookmark',
      編集: 'edit',
      削除: 'delete',
      詳細: 'detail',
    };

    /**
     * メニュー項目をクリックした際の処理
     * @param {string} menu - クリックされたメニューのテキスト
     */
    function handleMenuClick(menu: string) {
      const eventName = eventMap[menu];
      if (eventName) {
        emit(eventName as 'edit' | 'bookmark' | 'delete' | 'detail');
      }
      show.value = false;
    }

    /**
     * もっと見るボタンの表示・非表示を切り替える
     */
    function onClickToggle() {
      show.value = !show.value;
    }

    /**
     * コンポーネントの外側をクリックした際にメニューを閉じる
     * @param {MouseEvent} event - マウスイベント
     */
    function handleClickOutside(event: MouseEvent) {
      if (
        moreOptionsRef.value &&
        !moreOptionsRef.value.contains(event.target as Node)
      ) {
        show.value = false;
      }
    }

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
      menus,
      onClickToggle,
      moreOptionsRef,
      handleMenuClick,
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
