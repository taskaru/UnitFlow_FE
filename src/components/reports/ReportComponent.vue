<template lang="pug">
.grid.gap-4.justify-start.w-full(
  class="grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]"
)
  // 日報カード
  div(
    class="h-[350px] relative"
    v-for="(data, i) in dataSource"
    :key="i"
    @mouseenter="showOptions = i"
    @mouseleave="showOptions = -1"
  )
    //- もっと見るオプション
    .absolute.top-2.right-2.z-10
      MoreOptions(
        v-show="showOptions === i"
        @edit="onEdit"
        @bookmark="onBookMark"
        @delete="onDelete"
      )
    // 日報カード
    .w-full.h-full.bg-white.rounded-2xl.shadow-xl.p-2.flex.flex-col
      // name + profile
      .flex.flex-row.justify-start.items-center.mb-2
        // profile
        .w-6.h-6.rounded-full
          img.w-full.h-full.object-contain(src="../../assets/i-google.svg")
        // name
        .text-lg.text-gray-500 {{ data.name }}
      // 日報の日付
      h3.text-lg.font-bold {{ data.title }}
      // 感想文
      p.text-sm.text-gray-700.mt-2.overflow-hidden(:style="clampStyle")
        | {{ data.description }}
 
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useReportLogic } from '../../composables/reports/logic';
import MoreOptions from '../common/MoreOptions.vue';

export default defineComponent({
  name: 'ReportComponent',
  components: {
    MoreOptions,
  },
  props: {
    lineNum: {
      type: Number,
      required: false,
    },
  },
  emits: ['bookmark', 'detail', 'edit', 'delete'],
  setup(props, ctx) {
    const { emit } = ctx;
    const showOptions = ref(-1);

    const { dataSource } = useReportLogic();

    const clampStyle = computed(() => ({
      display: '-webkit-box',
      WebkitLineClamp: String(props.lineNum),
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    }));

    function onEdit() {
      emit('edit');
    }

    function onBookMark() {
      emit('bookmark');
    }

    function onDelete() {
      emit('delete');
    }

    function onClickDetail() {
      emit('detail');
    }

    return {
      dataSource,
      // もっと見るのオッション
      onEdit,
      onBookMark,
      onDelete,
      onClickDetail,
      showOptions,
      clampStyle,
    };
  },
});
</script>

<style scoped></style>
