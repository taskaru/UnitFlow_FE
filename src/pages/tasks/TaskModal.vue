<template lang="pug">
  // オーバーレイ
  .fixed.inset-0.z-50.flex.items-center.justify-center.bg-black.bg-opacity-60(
    v-if="visible"
    @click.self="$emit('close')"
  )
    // ダークカード
    .relative.rounded-2xl.shadow-2xl.border.border-white.border-opacity-10.overflow-hidden(
      class="w-[74vw] max-h-[86vh] bg-gradient-to-br from-black to-black"
      tabindex="0"
      @keydown.esc="$emit('close')"
    )
      // ヘッダー
      .flex.items-center.justify-between.px-6.py-4
        .flex.items-center.gap-3
          .w-8.h-8.rounded-full.bg-emerald-400.bg-opacity-20.grid.place-items-center.text-emerald-300.font-semibold T
          h2.text-white.font-semibold.text-lg タスク確認
          .px-2.py-1.rounded-full.text-xs.border.border-emerald-500.border-opacity-30.bg-emerald-400.bg-opacity-10.text-emerald-300
            | 進捗 {{ progressRate }}%
        .flex.items-center.gap-2
          button.w-8.h-8.grid.place-items-center.rounded-lg.bg-white.bg-opacity-5.border.border-white.border-opacity-10.text-white.text-opacity-70(
            @click="$emit('close')"
            aria-label="閉じる"
          ) ✕

      // 統計タイル
      .px-6.pb-2
        .grid.grid-cols-3.gap-3
          // 総件数
          .flex.items-center.gap-3.p-3.rounded-xl.bg-white.bg-opacity-5.border.border-white.border-opacity-10
            .w-8.h-8.rounded-lg.bg-white.bg-opacity-5.grid.place-items-center.text-white.text-opacity-70
              img(
                src="https://img.icons8.com/?size=100&id=pLEfaddrvpny&format=png&color=000000"
                alt="icon"
                class="w-5 h-5 object-contain"
              )
            .flex.flex-col
              span.text-xs.tracking-wide.text-gray-400.uppercase Total
              span.text-sm.text-white.font-semibold {{ tasks.length }}
          // 完了件数
          .flex.items-center.gap-3.p-3.rounded-xl.bg-white.bg-opacity-5.border.border-white.border-opacity-10
            .w-8.h-8.rounded-lg.bg-white.bg-opacity-5.grid.place-items-center.text-white.text-opacity-70
              img(
                src="https://img.icons8.com/?size=100&id=jTBefpe7oeWd&format=png&color=000000"
                alt="check"
                class="w-5 h-5 object-contain"
              )
            .flex.flex-col
              span.text-xs.tracking-wide.text-gray-400.uppercase Done
              span.text-sm.text-white.font-semibold {{ completedCount }}
          // 最終完了日
          .flex.items-center.gap-3.p-3.rounded-xl.bg-white.bg-opacity-5.border.border-white.border-opacity-10
            .w-8.h-8.rounded-lg.bg-white.bg-opacity-5.grid.place-items-center.text-white.text-opacity-70
              img(
                src="https://img.icons8.com/?size=100&id=4i5bTF9azXVR&format=png&color=000000"
                alt="last done"
                class="w-5 h-5 object-contain"
              )
            .flex.flex-col
              span.text-xs.tracking-wide.text-gray-400.uppercase Last Done
              span.text-sm.text-white.font-semibold {{ lastCompletedAt ? formatDate(lastCompletedAt, 'full') : '-' }}

      .h-px.bg-white.bg-opacity-10.mx-6.my-3

      // タイムラインセクション
      .px-6.pb-6.overflow-y-auto(class="max-h-[58vh]")
        .space-y-6
          // カテゴリ（グループ）ブロック
          .flex.gap-4(
            v-for="(group, idx) in sortedGroups"
            :key="group.category"
          )
            // タイムライン左側（点 + ライン）
            .w-4.flex.flex-col.items-center
              .w-3.h-3.bg-emerald-200.rounded-full.shadow
              // 最後のグループはラインを非表示
              .flex-1.w-px.bg-gray-700.bg-opacity-60(:class="{ 'opacity-0': idx === sortedGroups.length }")
            // コンテンツカード
            .flex-1.rounded-xl.p-3.bg-white.bg-opacity-5.border.border-white.border-opacity-10
              .flex.items-center.justify-between.mb-1
                .text-gray-200.font-semibold {{ group.category || '未分類' }}
                .text-xs.text-gray-400 {{ group.completed }}/{{ group.tasks.length }} 完了
              ul.space-y-2
                li.flex.items-start.justify-between.gap-4(
                  v-for="t in sortByCompletedAt(group.tasks)"
                  :key="t.id"
                )
                  .flex-1.min-w-0
                    .text-white.font-medium.truncate {{ t.name }}
                    .text-xs.text-gray-400.mt-1
                      span.text-emerald-200.ml-2(v-if="t.completedAt")
                        | 完了: {{ formatDate(t.completedAt) }}
                  label.flex.items-center.gap-2.shrink-0
                    input(
                      type="checkbox"
                      v-model="t.completed"
                      class="accent-emerald-200"
                      @change="onToggle(t)"
                    )

      // フッター
      .flex.justify-end.gap-3.px-6.py-4.bg-black.bg-opacity-20
        button.w-20.h-7.px-2.py-1.rounded-full.text-xs.border.border-emerald-500.border-opacity-30.bg-emerald-400.bg-opacity-10.text-emerald-300(
          :disabled="!tasks.length"
          @click="$emit('confirm')"
        ) 適用
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { Task } from './TaskEditor_v2.vue';

// グループ化されたタスクの型定義
export type Grouped = { category: string; tasks: Task[]; completed: number };

export default defineComponent({
  name: 'TaskModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    tasks: {
      type: Array as () => Task[],
      required: true,
    },
    grouped: {
      type: Array as () => Grouped[],
      required: true,
    },
    completedCount: {
      type: Number,
      required: true,
    },
    progressRate: {
      type: Number,
      required: true,
    },
    formatDate: {
      type: Function as unknown as () => (
        iso: string,
        mode?: 'full' | 'date' | 'time'
      ) => string,
      required: true,
    },
    onToggle: {
      type: Function as unknown as () => (t: Task) => void,
      required: true,
    },
  },
  emits: ['close', 'confirm'],
  setup(props) {
    /**
     * 最終完了日を計算する
     * 完了したタスクの中で最も新しい完了日時を返す
     */
    const lastCompletedAt = computed(() => {
      const completedTasks = props.tasks.filter(t => t.completedAt);
      if (completedTasks.length === 0) return null;
      return completedTasks.sort(
        (a, b) => Date.parse(b.completedAt!) - Date.parse(a.completedAt!)
      )[0].completedAt;
    });

    /**
     * グループとタスクを完了時間基準でソートする
     * 各グループ内のタスクも完了時間でソートし、グループ自体もソートする
     */
    const sortedGroups = computed(
      (): Array<Grouped & { tasksSorted: Task[] }> => {
        // タスク配列を完了時間でソートする内部関数
        const sortTasks = (arr: Task[]) =>
          [...arr].sort((a, b) => {
            const av = a.completedAt
              ? Date.parse(a.completedAt)
              : Number.POSITIVE_INFINITY;
            const bv = b.completedAt
              ? Date.parse(b.completedAt)
              : Number.POSITIVE_INFINITY;
            return av - bv; // 最新を先に表示する場合は: return bv - av
          });

        // 各グループのタスクをソート
        const groups = props.grouped.map((g: Grouped) => ({
          ...g,
          tasksSorted: sortTasks(g.tasks),
        }));

        // グループ自体をソート（各グループの最初のタスクの完了時間で比較）
        groups.sort((ga, gb) => {
          const aMin = ga.tasksSorted.length
            ? ga.tasksSorted[0].completedAt
              ? Date.parse(ga.tasksSorted[0].completedAt as string)
              : Number.POSITIVE_INFINITY
            : Number.POSITIVE_INFINITY;
          const bMin = gb.tasksSorted.length
            ? gb.tasksSorted[0].completedAt
              ? Date.parse(gb.tasksSorted[0].completedAt as string)
              : Number.POSITIVE_INFINITY
            : Number.POSITIVE_INFINITY;
          return aMin - bMin; // 最新カテゴリを上に表示する場合は: return bMin - aMin
        });

        return groups;
      }
    );

    /**
     * タスク配列を完了時間基準でソートする関数
     * テンプレート内で使用される
     */
    const sortByCompletedAt = (tasks: Task[]) => {
      return [...tasks].sort((a, b) => {
        const av = a.completedAt
          ? Date.parse(a.completedAt)
          : Number.POSITIVE_INFINITY;
        const bv = b.completedAt
          ? Date.parse(b.completedAt)
          : Number.POSITIVE_INFINITY;
        return av - bv;
      });
    };

    return {
      lastCompletedAt,
      sortedGroups,
      sortByCompletedAt,
    };
  },
});
</script>
