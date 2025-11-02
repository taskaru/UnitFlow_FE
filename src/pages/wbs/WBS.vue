<template lang="pug">
    main.text-white
      // ヘッダー＋タブ
      .mx-auto.px-2
        .flex.items-center.justify-end.mb-4
          .space-x-2
            button.px-3.py-1.rounded-md.border.border-white.border-opacity-10(
              :class="view==='calendar' ? 'bg-white bg-opacity-10' : ''"
              @click="setView('calendar')"
            ) Calendar
            button.px-3.py-1.rounded-md.border.border-white.border-opacity-10(
              :class="view==='list' ? 'bg-white bg-opacity-10' : ''"
              @click="setView('list')"
            ) List
    
      // ===== カレンダービュー =====
      section.px-2(v-show="view==='calendar'")
        .rounded-xl.border.border-white.border-opacity-10.p-4(class="h-[80vh]")
          // カレンダー見出し（月移動）
          .flex.items-center.justify-between.mb-3
            .flex.items-center.gap-3
              button.w-8.h-8.rounded-md.bg-white.bg-opacity-5.border.border-white.border-opacity-10(@click="prevMonth") ‹
              button.w-8.h-8.rounded-md.bg-white.bg-opacity-5.border.border-white.border-opacity-10(@click="nextMonth") ›
              button.ml-2.px-3.py-1.rounded-md.bg-white.bg-opacity-5.border.border-white.border-opacity-10(@click="goToday") 今日
            .text-lg.font-semibold {{ monthLabel }}
            .w-8
    
          // 曜日ヘッダー（月〜日）
          .grid.grid-cols-7.text-center.text-xs.text-gray-400.mb-2
            div(v-for="w in weekdays" :key="w") {{ w }}
    
          // 日付グリッド
          .grid.grid-cols-7.gap-2
            // セル
            .rounded-lg.p-2.border.border-white.border-opacity-5.cursor-pointer.relative.transition-colors(
              v-for="d in calendarDays" 
              class="h-[10vh]"
              :key="d.key"
              :class="{ 'opacity-40': !d.inMonth, 'border-emerald-200 bg-white bg-opacity-5 shadow-lg': d.isToday, 'bg-white bg-opacity-10': selected === d.key }"
              @click="selectDate(d.key)"
            )
              // 日付番号
              .text-xs.text-gray-300.flex.items-center.justify-between
                span {{ d.date }}
                // 完了数バッジ
                span.text-xs.px-1.rounded.bg-white.bg-opacity-10(v-if="d.doneCount") ✔ {{ d.doneCount }}
              // タスク存在ドット（完了=緑／未完=黄）
              .absolute.left-2.bottom-2.flex.gap-1
                span.w-2.h-2.rounded-full.bg-green(v-for="i in d.doneCount" :key="'g-'+i")
                span.w-2.h-2.rounded-full.bg-red(v-for="i in d.pendingCount" :key="'y-'+i")
    
      // ===== リストビュー =====
      section.mx-auto.px-2(v-show="view==='list'")
        .rounded-xl.border.border-white.border-opacity-10
          // 上部：フィルタ／検索
          .p-3.flex.items-center.justify-between
            .flex.items-center.gap-2
              input.bg-white.bg-opacity-10.border.border-white.border-opacity-10.rounded-md.px-2.py-1.text-sm(
                v-model.trim="q"
                placeholder="検索..."
              )
              select.bg-white.bg-opacity-10.border.border-white.border-opacity-10.rounded-md.px-2.py-1.text-sm(v-model="status")
                option(value="all") すべて
                option(value="open") 未完了
                option(value="done") 完了
            .text-xs.text-gray-400 {{ filtered.length }} 件
    
          // テーブルヘッダー
          .divide-y.divide-white.divide-opacity-5
            .grid.grid-cols-12.gap-2.px-4.py-2.text-xs.text-gray-400
              div.col-span-5 タスク
              div.col-span-2 カテゴリ
              div.col-span-2 期限
              div.col-span-1 状態
              div.col-span-2 作成
    
            // テーブル行
            .grid.grid-cols-12.gap-2.items-center.px-4.py-2(
              v-for="t in filtered" :key="t.id"
            )
              // タイトル
              .col-span-5.flex.items-center.gap-2
                span.w-2.h-2.rounded-full(
                  :class="t.completed ? 'bg-green' : isOverdue(t) ? 'bg-red' : 'bg-yellow'"
                )
                .truncate {{ t.name }}
              // カテゴリ
              .col-span-2.text-xs.text-gray-300 {{ t.category || '未分類' }}
              // 期限
              .col-span-2.text-xs(:class="isOverdue(t) && !t.completed ? 'text-red-400' : 'text-gray-300'")
                | {{ t.targetAt ? formatDate(t.targetAt, 'date') + ' ' + formatDate(t.targetAt, 'time') : '-' }}
              // 状態
              .col-span-1.text-xs {{ t.completed ? 'Done' : 'Open' }}
              // 作成日
              .col-span-2.text-xs.text-gray-400 {{ formatDate(t.createdAt, 'date') }}
    </template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from 'vue';

interface Task {
  id: string;
  category: string;
  name: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  targetAt?: string; // 期限（ISO）
}

type ViewMode = 'calendar' | 'list';
type StatusFilter = 'all' | 'open' | 'done';

const STORAGE_KEY = 'tasks_v1';

export default defineComponent({
  name: 'WbsPage',
  setup() {
    // ===== ステート
    const tasks = reactive<Task[]>([]);
    const view = ref<ViewMode>('calendar');
    const selected = ref<string>(''); // 'YYYY-MM-DD'
    const q = ref<string>('');
    const status = ref<StatusFilter>('all');

    // ===== 初期ロード
    onMounted(function onMountedLoad(): void {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Task[] = JSON.parse(raw);
        tasks.splice(0, tasks.length, ...parsed);
      }
      selected.value = toKey(new Date()); // 今日
    });

    // ===== 日付ユーティリティ
    function toKey(d: Date): string {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }

    function fromKey(key: string): Date {
      const [y, m, d] = key.split('-').map(Number);
      return new Date(y, m - 1, d);
    }

    const todayKey = toKey(new Date());

    // ===== 月状態
    const monthBase = ref<Date>(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );

    const monthLabel = computed<string>(function monthLabel(): string {
      const y = monthBase.value.getFullYear();
      const m = monthBase.value.getMonth() + 1;
      return `${y}年 ${m}月`;
    });

    // ===== ビュー切替
    function setView(v: ViewMode): void {
      view.value = v;
    }

    // ===== 月移動
    function prevMonth(): void {
      const d = new Date(monthBase.value);
      d.setMonth(d.getMonth() - 1);
      monthBase.value = d;
    }

    function nextMonth(): void {
      const d = new Date(monthBase.value);
      d.setMonth(d.getMonth() + 1);
      monthBase.value = d;
    }

    function goToday(): void {
      monthBase.value = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      selected.value = todayKey;
    }

    function selectDate(key: string): void {
      selected.value = key;
    }

    // ===== 曜日（月曜始まり表示用ラベル）
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // カレンダー開始日（その月の1日から、月曜始まりになるよう調整）
    const startOfCalendar = computed<Date>(function startOfCalendar(): Date {
      const first = new Date(
        monthBase.value.getFullYear(),
        monthBase.value.getMonth(),
        1
      );
      const dow = first.getDay() === 0 ? 7 : first.getDay(); // 0(日)→7
      const diff = dow - 1; // 月曜=1
      const start = new Date(first);
      start.setDate(first.getDate() - diff);
      return start;
    });

    // 指定日のタスク（期限があれば期限、無ければ作成日で紐付け）
    function tasksForKey(key: string): Task[] {
      return tasks.filter(t => {
        const iso = t.targetAt || t.createdAt;
        return toKey(new Date(iso)) === key;
      });
    }

    // 期限切れ（未完了のみ）
    function isOverdue(t: Task): boolean {
      if (!t.targetAt || t.completed) return false;
      const now = new Date();
      return new Date(t.targetAt) < now;
    }

    // 6×7 の日付セル＋件数集計
    const calendarDays = computed(function calendarDays() {
      const a: Array<{
        key: string;
        date: number;
        inMonth: boolean;
        isToday: boolean;
        doneCount: number;
        pendingCount: number;
      }> = [];
      const start = startOfCalendar.value;
      for (let i = 0; i < 42; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const key = toKey(d);
        const inMonth = d.getMonth() === monthBase.value.getMonth();
        const items = tasksForKey(key);
        const done = items.filter(t => t.completed).length;
        const pending = items.filter(t => !t.completed).length;
        a.push({
          key,
          date: d.getDate(),
          inMonth,
          isToday: key === todayKey,
          doneCount: done,
          pendingCount: pending,
        });
      }
      return a;
    });

    // リスト用フィルタ
    const filtered = computed<Task[]>(function filtered(): Task[] {
      const qq = q.value.toLowerCase();
      return tasks.filter(t => {
        const okStatus =
          status.value === 'all' ||
          (status.value === 'open' && !t.completed) ||
          (status.value === 'done' && t.completed);
        const okQuery =
          !qq ||
          t.name.toLowerCase().includes(qq) ||
          (t.category || '').toLowerCase().includes(qq);
        return okStatus && okQuery;
      });
    });

    // 日時フォーマッタ
    function formatDate(
      iso: string,
      mode: 'full' | 'date' | 'time' = 'full'
    ): string {
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      if (mode === 'date') return `${y}/${m}/${day}`;
      if (mode === 'time') return `${hh}:${mm}`;
      return `${y}/${m}/${day} ${hh}:${mm}`;
    }

    // ===== テンプレートへ公開
    return {
      // state
      tasks,
      view,
      selected,
      q,
      status,
      // labels & lists
      monthLabel,
      weekdays,
      calendarDays,
      filtered,
      // actions
      setView,
      prevMonth,
      nextMonth,
      goToday,
      selectDate,
      // utils
      isOverdue,
      formatDate,
      fromKey,
    };
  },
});
</script>
