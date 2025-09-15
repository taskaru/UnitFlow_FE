<template lang="pug">
  .px-4
    .flex.gap-4.overflow-x-auto
      section(
        v-for="col in columns"
        :key="col.key"
        class="w-[19.9vw] bg-[#1f1f1f] rounded-xl p-2 shrink-0"
      )
        header.flex.items-center.justify-between.mb-2
          h3.text-white.font-semibold {{ col.title }}
          span.text-xs.text-stone-400 {{ counts[col.key] || 0 }}

        .space-y-2
          article(
            v-for="t in byStatus[col.key]"
            :key="t.id"
            class="bg-[#2a2a2a] rounded-lg p-3"
          )
            .flex.items-start.justify-between.gap-3
              div
                .flex.items-center.gap-2
                  p.text-white.font-medium.text-s
                    | {{ t.name }}
                p.text-xs.text-stone-400.mt-1 {{ t.category || '未分類' }}
                p.text-xs.mt-1(
                  :class="overdue(t) ? 'text-rose-400' : 'text-stone-400'"
                ) 予定: {{ getTimeRange(t) }}

              .flex.flex-row.items-end.gap-1
                button(
                  title="編集"
                  :class="t.completed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'"
                  @click="handleEdit(t)"
                )
                  img(
                    src="https://img.icons8.com/?size=100&id=7dEB2atIqO6T&format=png&color=000000"
                    class="w-4 h-4 object-contain"
                  )
                button(
                  title="削除"
                  :class="t.completed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'"
                  @click="handleRemove(t.id)"
                )
                  img(
                    src="https://img.icons8.com/?size=100&id=CzTISLkmHrKE&format=png&color=000000"
                    class="w-4 h-4 object-contain"
                  )

            .mt-2.flex.items-center.gap-2
              button.w-full.px-2.py-1.text-xs.rounded.border.border-white.bg-white.text-black.opacity-70(
                v-if="t.status !== 'done'"
                @click="handleAdvance(t)"
              ) 次へ
              .w-full.px-2.py-1.text-xs.rounded.border.border-white.bg-white.text-black.opacity-30.text-center(
                v-if="t.completedAt"
              ) 完了 {{ formatDate(t.completedAt, 'time') }}
            //-   select.bg-transparent.border.border-stone-600.text-xs.rounded.px-2.py-1(
            //-     :value="t.status ?? 'todo'"
            //-     @change="handleStatusChange(t, $event)"
            //-   )
            //-     option(value="todo") 未着手
            //-     option(value="inprogress") 対応中
            //-     option(value="review") レビュー中
            //-     option(value="done") 完了
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { Task } from './TaskEditor_v2.vue';

export default defineComponent({
  name: 'TaskBoard',
  props: {
    tasks: { type: Array as () => Task[], required: true },
    formatDate: {
      type: Function as unknown as () => (
        iso?: string | null,
        mode?: 'full' | 'date' | 'time'
      ) => string,
      required: true,
    },
  },
  emits: {
    advance: (task: Task, to?: string) => {
      void task;
      void to;
      return true;
    },
    edit: (task: Task) => {
      void task;
      return true;
    },
    remove: (id: string) => {
      void id;
      return true;
    },
  },
  setup(props, { emit }) {
    const columns = [
      { key: 'todo', title: '未着手' },
      { key: 'inprogress', title: '対応中' },
      { key: 'review', title: 'レビュー中' },
      { key: 'done', title: '完了' },
    ] as const;

    const byStatus = computed(() => {
      const m: Record<string, Task[]> = {
        todo: [],
        inprogress: [],
        review: [],
        done: [],
      };
      for (const t of props.tasks) {
        const k = (t.status ?? 'todo') as keyof typeof m;
        m[k].push(t);
      }
      // カードの並び順: 目標時刻/作成時刻の早い順
      for (const key of Object.keys(m)) {
        m[key] = m[key].slice().sort((a, b) => {
          const ta =
            a.targetAt ?? a.expectedEndAt ?? a.expectedStartAt ?? a.createdAt;
          const tb =
            b.targetAt ?? b.expectedEndAt ?? b.expectedStartAt ?? b.createdAt;
          return Date.parse(ta) - Date.parse(tb);
        });
      }
      return m;
    });

    const counts = computed(() =>
      Object.fromEntries(
        Object.entries(byStatus.value).map(([k, v]) => [k, v.length])
      )
    );

    // 画面用ヘルパー（親のロジックと一致）
    function getTimeRange(t: Task) {
      if (t.expectedStartAt && t.expectedEndAt) {
        return `${props.formatDate(t.expectedStartAt, 'time')} - ${props.formatDate(t.expectedEndAt, 'time')}`;
      } else if (t.targetAt) {
        return props.formatDate(t.targetAt, 'time');
      }
      return '-';
    }

    function overdue(t: Task) {
      const iso = t.targetAt ?? t.expectedEndAt ?? t.expectedStartAt;
      if (!iso || t.completed) return false;
      return Date.parse(iso) < Date.now();
    }

    // ===== イベントハンドラ =====
    /** タスク編集を親へ通知 */
    function handleEdit(task: Task) {
      emit('edit', task);
    }

    /** タスク削除を親へ通知 */
    function handleRemove(taskId: string) {
      emit('remove', taskId);
    }

    /** ステータス進行（次へ）を親へ通知 */
    function handleAdvance(task: Task) {
      emit('advance', task);
    }

    /** セレクト変更でのステータス更新を親へ通知 */
    function handleStatusChange(task: Task, event: Event) {
      const target = event.target as HTMLSelectElement;
      emit('advance', task, target.value as Task['status']);
    }

    return {
      columns,
      byStatus,
      counts,
      getTimeRange,
      overdue,
      handleEdit,
      handleRemove,
      handleAdvance,
      handleStatusChange,
    };
  },
});
</script>
