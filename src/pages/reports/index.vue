<template lang="pug">
div.h-screen.flex.bg-black.p-4
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
        :line-num="10"
        @bookmark="onBookmark"
        @edit="onEdit"
        @delete="onDelete"
        @detail="onDetail"
      )
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SidebarComponent from '../../components/SidebarComponent.vue';
import HeaderComponent from '../../components/HeaderComponent.vue';

import ReportComponent from '../../components/reports/ReportComponent.vue';

export default defineComponent({
  name: 'ReportsPage',
  components: {
    SidebarComponent,
    HeaderComponent,
    ReportComponent,
  },
  setup() {
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
      // eslint-disable-next-line no-console
      console.log('click onDetail');
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
