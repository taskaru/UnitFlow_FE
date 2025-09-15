<template lang="pug">
.grid.gap-4.justify-start.w-full(
  class="grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]"
)
  //- 日報カード
  .rounded-2xl.shadow-xl.p-2.flex.flex-col.backdrop-blur-lg.border(
    v-for="(data, i) in dataSource"
    class="h-[22.8rem] relative bg-gray-400/20 border-white/30"
    :key="i"
  )
    //- Unit + MoreOptions
    .w-full.h-10.flex
      .w-80.pl-1.flex.items-center
        .w-auto.bg-gray-100.color-yellow.flex.items-center.py-1.px-6.rounded-2xl
          | {{ data.unit }}
      //- Unit
      .w-20.flex.justify-center.items-center
        //- もっと見る
        MoreOptions(
          paddingClass="pb-5 pl-7"
          @bookmark="onBookMark"
          @edit="onEdit"
          @delete="onDelete"
          @detail="onClickDetail"
        )
    //- name
    .w-full.h-10.flex.items-center.pl-2.font-bold.text-lg
      | {{data.name}}
    //- description
    .w-full.h-full.px-2.opacity-75(
      class="h-[15rem]"
      :style="clampStyle"
    )
      | {{data.description}}
    //- profile / repliy counts / date
    .w-full.h-11.flex.items-center.justify-between.px-2
      //- profile
      .flex.items-center.gap-2
        .w-6.h-6.rounded-full
          img.w-full.h-full.object-cover.rounded-full(:src="data.profileIcon")
      //- icons & date
      .flex.items-center.gap-4
        .flex.items-center.gap-1
          img.w-5.h-5.object-contain.cursor-pointer(:src="data.likeData.src")
          .text-sm {{ data.likeData.likeCount }}
        .flex.items-center.gap-1
          img.w-5.h-5.object-contain.cursor-pointer(:src="data.replyData.src")
          .text-sm {{ data.replyData.replyCount }}
        .text-s.text-gray-400 {{ data.createdAt }}
      
    
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

    /**
     * 文字を'...'にする処理
     * ex) 'hogehoge_hoge_....'
     * */
    const clampStyle = computed(() => ({
      display: '-webkit-box',
      WebkitLineClamp: String(props.lineNum),
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    }));

    /**
     * 編集イベントをemitする
     */
    function onEdit() {
      emit('edit');
    }
    /**
     * ブックマークイベントをemitする
     */
    function onBookMark() {
      emit('bookmark');
    }

    /**
     * 削除イベントをemitする
     */
    function onDelete() {
      emit('delete');
    }

    /**
     * 詳細イベントをemitする
     */
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
