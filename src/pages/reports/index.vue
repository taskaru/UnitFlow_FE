<template lang="pug">
div.min-h-screen.flex.bg-gradient-to-br.from-blue-50.to-blue-100.p-4
  SidebarComponent
  // 上コンテンツバー
  .bg-white.shadow-xl.rounded-2xl.p-6.w-full.max-w-7xl.transition-all.duration-300.flex.flex-col
    HeaderComponent(
      :title='state.title'
    )
    main.flex-1.overflow-y-auto.mt-4
      .grid.grid-cols-1.gap-4(
        class="sm:grid-cols-2 md:grid-cols-3"
      )
        ReportComponent(
          v-for='card in allCards'
          :key='card.id'
          :avatar-url='card.avatarUrl'
          :name='card.name'
          :title='card.title'
          :description='card.description'
          :is-mine='card.isMine'
          @bookmark='onBookmark(card)'
          @open='onOpen(card)'
          @edit='onEdit(card)'
          @delete='onDelete(card)'
        )
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
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
    type Card = {
      id: number;
      avatarUrl: string;
      name: string;
      title: string;
      description: string;
      isMine: boolean;
    };

    const state = reactive<{
      title: string;
      columns: {
        todo: Card[];
        inProgress: Card[];
        done: Card[];
      };
    }>({
      title: '日報',
      columns: {
        todo: [
          {
            id: 1,
            avatarUrl: 'https://i.pravatar.cc/48?img=1',
            name: 'ジャンジェヨン',
            title: '日報作成',
            description: '今日の進捗をまとめる',
            isMine: true,
          },
          {
            id: 2,
            avatarUrl: 'https://i.pravatar.cc/48?img=2',
            name: 'アオイ',
            title: 'コードレビュー',
            description: 'PR #42 を確認',
            isMine: false,
          },
        ],
        inProgress: [
          {
            id: 3,
            avatarUrl: 'https://i.pravatar.cc/48?img=3',
            name: 'タロウ',
            title: 'テストケース追加',
            description: 'レポート機能の単体テスト',
            isMine: false,
          },
        ],
        done: [
          {
            id: 4,
            avatarUrl: 'https://i.pravatar.cc/48?img=4',
            name: 'ハナコ',
            title: 'UI 調整',
            description: 'カードのスタイルを微修正',
            isMine: true,
          },
        ],
      },
    });

    const onBookmark = () => {
      return;
    };
    const onOpen = () => {
      return;
    };
    const onEdit = () => {
      return;
    };
    const onDelete = () => {
      return;
    };

    return {
      state,
      allCards: computed(() => [
        ...state.columns.todo,
        ...state.columns.inProgress,
        ...state.columns.done,
      ]),
      onBookmark,
      onOpen,
      onEdit,
      onDelete,
    };
  },
});
</script>
