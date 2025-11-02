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
    section.px-1(v-show="view==='calendar'")
      // カレンダー本体（右に入力パネルを載せるため relative）
      .rounded-xl.border.border-white.border-opacity-10.p-3.relative(class="h-[80vh]")
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
            @click="onClickDay(d.key)"
          )
            // 日付番号
            .text-xs.text-gray-300.flex.items-center.justify-between
              span {{ d.date }}
              // アクティブ件数バッジ（任意）
              span.text-xs.px-1.rounded.bg-white.bg-opacity-10(v-if="d.activeCount") ● {{ d.activeCount }}
            // タスク存在ドット（完了=緑／未完=赤）
            .absolute.left-2.bottom-2.flex.gap-1
              span.w-2.h-2.rounded-full.bg-green-300(v-for="i in d.doneCount" :key="'g-'+d.key+i")
              span.w-2.h-2.rounded-full.bg-red-400(v-for="i in d.pendingCount" :key="'p-'+d.key+i")
  
        // 右ペイン：選択日のタスク一覧＋入力（スプレッドシート風）
        .absolute.top-4.right-4.w-96.bg-black.border.border-white.border-opacity-10.rounded-xl.p-4(v-if="editorOpen")
          .flex.items-center.justify-between.mb-3
            h3.text-sm.font-semibold {{ selected }}
            button.text-xs.text-gray-300(@click="clearEditor")
              img(
                src="https://img.icons8.com/?size=100&id=pfF6HpODcjW0&format=png&color=000000"
                class="w-4 h-4 object-contain"
              )
          
          // 既存タスク一覧
          .border-t.border-white.border-opacity-10.pt-2
            .mb-4.max-h-60.overflow-y-auto(v-if="selectedDayTasks.length > 0")
              .text-xs.text-white.opacity-50.mb-2 既存タスク ({{ selectedDayTasks.length }}件)
              .space-y-2
                .flex.items-center.justify-between.p-2.bg-white.bg-opacity-5.rounded(
                  v-for="task in selectedDayTasks" :key="task.id"
                )
                  .flex.items-center.gap-2
                    span.w-2.h-2.rounded-full(
                      :class="task.completed ? 'bg-green-300' : isOverdue(task) ? 'bg-red-400' : 'bg-yellow-300'"
                    )
                    .text-xs
                      .font-medium {{ task.name }}
                      .text-white.opacity-50 {{ task.category || '未分類' }}
                      .text-white.opacity-30(v-if="task.expectedStartAt && task.expectedEndAt")
                        | {{ formatDate(task.expectedStartAt, 'time') }} - {{ formatDate(task.expectedEndAt, 'time') }}
                  .text-xs.text-white.opacity-50 {{ task.completed ? '完了' : '未完了' }}
          
          // 新規追加セクション
          .border-t.border-white.border-opacity-10.pt-2
            .text-xs.text-white.opacity-50.mb-2 新規追加
            // 入力フォーム
            .space-y-2
            // 名称
            label.block.text-xs.text-white.opacity-50 名称
            input.w-full.bg-white.bg-opacity-10.border.border-white.border-opacity-10.rounded-md.px-2.py-1.text-sm(
              v-model.trim="editor.form.name"
              placeholder="タスク名"
            )
            // カテゴリ
            label.block.text-xs.text-white.opacity-50.mt-2 カテゴリ
            input.w-full.bg-white.bg-opacity-10.border.border-white.border-opacity-10.rounded-md.px-2.py-1.text-sm(
              v-model.trim="editor.form.category"
              placeholder="カテゴリ"
            )
            // 予定（開始／終了）
            .grid.grid-cols-2.gap-2.mt-2
              .col-span-1
                label.block.text-xs.text-white.opacity-50 開始日
                input.w-full.bg-white.bg-opacity-10.border.border-white.border-opacity-10.rounded-md.px-2.py-1.text-sm(
                  type="date"
                  v-model="editor.form.startDate"
                )
              .col-span-1
                label.block.text-xs.text-white.opacity-50 終了日
                input.w-full.bg-white.bg-opacity-10.border.border-white.border-opacity-10.rounded-md.px-2.py-1.text-sm(
                  type="date"
                  v-model="editor.form.endDate"
                )
            .grid.grid-cols-2.gap-2
              .col-span-1
                label.block.text-xs.text-white.opacity-50 開始時刻
                input.w-full.bg-white.bg-opacity-10.border.border-white.border-opacity-10.rounded-md.px-2.py-1.text-sm(
                  type="time"
                  v-model="editor.form.startTime"
                )
              .col-span-1
                label.block.text-xs.text-white.opacity-50 終了時刻
                input.w-full.bg-white.bg-opacity-10.border.border-white.border-opacity-10.rounded-md.px-2.py-1.text-sm(
                  type="time"
                  v-model="editor.form.endTime"
                )
            // 操作
            .flex.items-center.justify-end.gap-2.mt-3
              button.px-3.py-1.rounded-md.bg-gray-700.text-white(@click="saveTask") 追加
              button.px-3.py-1.rounded-md.border.border-white.border-opacity-10.text-gray-200(@click="clearEditor") 取消
  
    // ===== リストビュー =====
    section.mx-auto.px-1(v-show="view==='list'")
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
          .grid.grid-cols-12.gap-2.px-4.py-2.text-xs.text-white.opacity-50
            div.col-span-4 タスク
            div.col-span-2 カテゴリ
            div.col-span-2 予定開始（日時）
            div.col-span-2 予定終了（日時）
            div.col-span-2 状態・作成
  
          // 追加行（スプレッドシート風）
          .grid.grid-cols-12.gap-2.items-center.px-4.py-2.bg-white.bg-opacity-5
            .col-span-4
              input.w-full.bg-transparent.border.border-white.border-opacity-10.rounded-md.px-2.py-1.text-sm.opacity-60(
                v-model.trim="adder.name"
                placeholder="タスク名"
              )
            .col-span-2
              input.w-full.bg-transparent.border.border-white.border-opacity-10.rounded-md.px-2.py-1.text-sm.opacity-60(
                v-model.trim="adder.category"
                placeholder="カテゴリ"
              )
            .col-span-2
              input.w-full.bg-transparent.border.border-white.border-opacity-10.rounded-md.px-2.py-1.text-sm(
                type="datetime-local"
                v-model="adder.startDateTime"
              )
            .col-span-2
              input.w-full.bg-transparent.border.border-white.border-opacity-10.rounded-md.px-2.py-1.text-sm(
                type="datetime-local"
                v-model="adder.endDateTime"
              )
            .col-span-2
              button.bg-transparent.border.border-white.border-opacity-10.rounded-md.px-2.py-1.text-sm.opacity-60(
                class="w-[4vw]"
                @click="addFromRow"
              ) 追加
  
          // テーブル行
          .grid.grid-cols-12.gap-2.items-center.px-4.py-2(
            v-for="t in filtered" :key="t.id"
          )
            // タイトル
            .col-span-4.flex.items-center.gap-2
              span.w-2.h-2.rounded-full(
                :class="t.completed ? 'bg-green-300' : isOverdue(t) ? 'bg-red-400' : 'bg-yellow-300'"
              )
              .truncate {{ t.name }}
            // カテゴリ
            .col-span-2.text-xs.text-gray-300 {{ t.category || '未分類' }}
            // 予定開始（日時）
            .col-span-2.text-xs.text-gray-300 {{ t.expectedStartAt ? formatDate(t.expectedStartAt, 'full') : '-' }}
            // 予定終了（日時）
            .col-span-2.text-xs.text-gray-300 {{ t.expectedEndAt ? formatDate(t.expectedEndAt, 'full') : '-' }}
            // 状態・作成
            .col-span-2.text-xs
              .text-gray-300 {{ t.completed ? 'Done' : 'Open' }}
              .text-gray-400 {{ formatDate(t.createdAt, 'date') }}
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
  targetAt?: string; // 互換用（旧フィールド）
  expectedStartAt?: string; // 予定開始（ISO）
  expectedEndAt?: string; // 予定終了（ISO）
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

    // 右パネル用
    const editor = reactive({
      form: {
        name: '',
        category: '',
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '20:00',
      },
    });

    // 追加行（リストビュー）
    const adder = reactive({
      name: '',
      category: '',
      startDateTime: '',
      endDateTime: '',
    });

    // ===== 初期ロード
    onMounted(function onMountedLoad(): void {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Task[] = JSON.parse(raw);
        tasks.splice(0, tasks.length, ...parsed);
      }
      selected.value = toKey(new Date()); // 今日
      // 初期選択日に合わせて右パネル初期化
      presetEditor(selected.value);
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

    // ローカル日付＋時刻 → ISO
    function toLocalISO(dateStr: string, timeStr?: string): string {
      const [y, m, d] = dateStr.split('-').map(Number);
      const [hh, mm] = (timeStr || '00:00').split(':').map(Number);
      return new Date(y, m - 1, d, hh, mm, 0, 0).toISOString();
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
      if (v === 'list') editorOpen.value = false;
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
      presetEditor(selected.value);
    }

    function selectDate(key: string): void {
      selected.value = key;
    }

    const editorOpen = ref<boolean>(false);
    // カレンダーからクリックされたとき右パネルを選択日に合わせてプリセット
    function onClickDay(key: string): void {
      selectDate(key);
      presetEditor(key);
      editorOpen.value = true;
    }

    // 右パネルのデフォルトを選択日にプリセット
    function presetEditor(key: string): void {
      editor.form.startDate = key;
      editor.form.endDate = key;
      // 名前/カテゴリは維持（連続入力しやすく）
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

    // 指定日がタスクの予定区間に含まれるか
    function isActiveOnKey(t: Task, key: string): boolean {
      // const d = fromKey(key) // 未使用
      const startIso = t.expectedStartAt || t.targetAt || t.createdAt;
      const endIso =
        t.expectedEndAt || t.expectedStartAt || t.targetAt || t.createdAt;
      const sKey = toKey(new Date(startIso));
      const eKey = toKey(new Date(endIso));
      return sKey <= key && key <= eKey;
    }

    // 6×7 の日付セル＋件数集計（予定区間ベース）
    const calendarDays = computed(function calendarDays() {
      const a: Array<{
        key: string;
        date: number;
        inMonth: boolean;
        isToday: boolean;
        doneCount: number;
        pendingCount: number;
        activeCount: number;
      }> = [];
      const start = startOfCalendar.value;
      for (let i = 0; i < 42; i++) {
        const cur = new Date(start);
        cur.setDate(start.getDate() + i);
        const key = toKey(cur);
        const inMonth = cur.getMonth() === monthBase.value.getMonth();
        const active = tasks.filter(t => isActiveOnKey(t, key));
        const done = active.filter(t => t.completed).length;
        const pending = active.filter(t => !t.completed).length;
        a.push({
          key,
          date: cur.getDate(),
          inMonth,
          isToday: key === todayKey,
          doneCount: done,
          pendingCount: pending,
          activeCount: active.length,
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

    // 選択日のタスク一覧
    const selectedDayTasks = computed<Task[]>(
      function selectedDayTasks(): Task[] {
        if (!selected.value) return [];
        return tasks.filter(t => isActiveOnKey(t, selected.value));
      }
    );

    // 右パネル：保存
    function saveTask(): void {
      if (!editor.form.name || !editor.form.startDate || !editor.form.endDate)
        return;
      const task: Task = {
        id: (globalThis.crypto as Crypto | undefined)?.randomUUID
          ? (globalThis.crypto as Crypto).randomUUID()
          : String(Date.now()),
        category: editor.form.category || '',
        name: editor.form.name,
        completed: false,
        createdAt: new Date().toISOString(),
        expectedStartAt: toLocalISO(
          editor.form.startDate,
          editor.form.startTime
        ),
        expectedEndAt: toLocalISO(editor.form.endDate, editor.form.endTime),
      };
      tasks.unshift(task);
      persist();
      // 次の入力をしやすいように名前だけクリア
      editor.form.name = '';
    }

    // リスト追加行：保存
    function addFromRow(): void {
      if (!adder.name || !adder.startDateTime || !adder.endDateTime) return;
      const task: Task = {
        id: (globalThis.crypto as Crypto | undefined)?.randomUUID
          ? (globalThis.crypto as Crypto).randomUUID()
          : String(Date.now()),
        category: adder.category || '',
        name: adder.name,
        completed: false,
        createdAt: new Date().toISOString(),
        expectedStartAt: new Date(adder.startDateTime).toISOString(),
        expectedEndAt: new Date(adder.endDateTime).toISOString(),
      };
      tasks.unshift(task);
      persist();
      adder.name = '';
      adder.category = '';
      adder.startDateTime = '';
      adder.endDateTime = '';
    }

    // 右パネル：クリア（hide=true ならパネルも隠す）
    function clearEditor(hide = false): void {
      editor.form.name = '';
      editor.form.category = '';
      presetEditor(selected.value);
      if (hide) editorOpen.value = false;
    }

    // 期限切れ（未完了のみ／予定終了で判定）
    function isOverdue(t: Task): boolean {
      if (t.completed) return false;
      const endIso = t.expectedEndAt || t.targetAt;
      if (!endIso) return false;
      return new Date(endIso) < new Date();
    }

    // ローカル保存
    function persist(): void {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

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
      editor,
      adder,
      editorOpen,
      // labels & lists
      monthLabel,
      weekdays,
      calendarDays,
      filtered,
      selectedDayTasks,
      // actions
      setView,
      prevMonth,
      nextMonth,
      goToday,
      selectDate,
      onClickDay,
      saveTask,
      addFromRow,
      clearEditor,
      // utils
      isOverdue,
      formatDate,
      fromKey,
    };
  },
});
</script>
