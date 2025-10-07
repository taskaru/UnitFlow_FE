<template lang="pug">
div.h-screen.flex.bg-black.p-4.relative
  SidebarComponent
  // 右コンテンツバー
  .wrapper.dark.flex.flex-col(
    class="w-[87vw]"
  )
    HeaderComponent(
      title='日報'
    )
    main.w-full.flex-1.overflow-y-auto.min-h-0.px-3
      ReportComponent(
        :line-num="11"
        @bookmark="onBookmark"
        @edit="onEdit"
        @delete="onDelete"
        @detail="onDetail"
      )
  //- レポート詳細画面
  ReportDetailComponent
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// required compnents
import SidebarComponent from '../../components/SidebarComponent.vue';
import HeaderComponent from '../../components/HeaderComponent.vue';

// related report component
import ReportComponent from '../../components/reports/ReportComponent.vue';
import ReportDetailComponent from '@/pages/reports/detail/index.vue';

// logics
import { useReportDetailLogic } from '@/composables/reports/detail/logic';

export default defineComponent({
  name: 'ReportsPage',
  components: {
    SidebarComponent,
    HeaderComponent,
    ReportComponent,
    ReportDetailComponent,
  },
  setup() {
    const { state } = useReportDetailLogic();

    /**
     * ブックマークを押下した際の処理
     * ミドルTodo
     */
    function onBookmark() {
      // eslint-disable-next-line no-console
      console.log('click onBookmark');
    }

    /**
     * 編集ボタンを押下した際の処理
     * ミドルTodo
     */
    function onEdit() {
      // eslint-disable-next-line no-console
      console.log('click onEdit');
    }

    /**
     * 削除ボタンを押下した際の処理
     * ミドルTodo
     */
    function onDelete() {
      // eslint-disable-next-line no-console
      console.log('click onDelete');
    }

    /**
     * 詳細ボタンを押下した際の処理
     * ミドルTodo
     */
    function onDetail() {
      state.value.isVisible = true;
    }

    return {
      onBookmark,
      onEdit,
      onDelete,
      onDetail,
    };
  },
});
</script>
