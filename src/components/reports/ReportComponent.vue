<template lang="pug">
.grid.gap-4.justify-start.w-full(
  class="grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]"
)
  //- 日報カード
  .rounded-2xl.shadow-xl.p-2.flex.flex-col.bg-space-gray(
    v-for="(data, i) in dataSource"
    class="h-[21rem] relative"
    :key="i"
  )
    //- Unit + MoreOptions
    .w-full.h-10.flex
      .w-80.bg-black
      //- Unit
      .w-20.flex.justify-center.items-center
        //- もっと見る
        MoreOptions(
          paddingClass="pb-5 pl-7"
        )
    
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
