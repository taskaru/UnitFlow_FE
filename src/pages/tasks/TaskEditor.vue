<template lang="pug">
  main.flex-1.overflow-hidden
    // 入力エリア
    .bg-gray-50.rounded-xl.p-4.flex.flex-col.gap-4.mb-3
      div(class="grid grid-cols-1 md:grid-cols-3 gap-3")
        div(class="flex flex-col")
          label.text-sm.text-gray-600.mb-1.ml-1 カテゴリ
          input.form-input.border.rounded-lg.p-2(
            v-model.trim="newTask.category"
            placeholder="例）DEV012345"
            @keyup.enter="tryAddTask"
          )
        div(class="flex flex-col md:col-span-2")
          label.text-sm.text-gray-600.mb-1.ml-1 タスク名
          input.form-input.border.rounded-lg.p-2(
            v-model.trim="newTask.name"
            placeholder="例）PRレビュー / テストケース作成 など"
            @keyup.enter="tryAddTask"
          )
      .flex.flex-col
        button.btn-primary(@click="tryAddTask") 追加
        span.text-sm.text-red-500(v-if="errors.input") {{ errors.input }}
    //タスク一覧タイトル    
    .flex.flex-col
      .flex.items-center.justify-between.border-b.pb-1.mb-2
        h2.text-lg.font-semibold タスク一覧
        .flex.items-center.gap-2
          button.btn-secondary(
            @click="toggleAll(false)"
            :disabled="!tasks.length"
          ) 全て未完了に
          button.btn-secondary(
            @click="toggleAll(true)"
            :disabled="!tasks.length"
          ) 全て完了に

    // タスクリスト
    .flex-1.overflow-y-auto.max-h-80
      template(v-if="grouped.length")
        // カテゴリごと
        .space-y-4.p-2
          .border.rounded-xl.p-4.bg-white(
            v-for="group in grouped"
            :key="group.category"
          )
            .flex.items-center.justify-between.mb-3
              h3.font-semibold.text-gray-800 {{ group.category || '未分類' }}
              span.text-sm.text-gray-500 {{ group.completed }}/{{ group.tasks.length }} 完了
            ul.divide-y
              li.py-2.flex.items-start.justify-between.gap-3(
                v-for="task in group.tasks"
                :key="task.id"
              )
                label.flex.items-start.gap-3.cursor-pointer.select-none
                  input(
                    type="checkbox"
                    v-model="task.completed"
                    @change="onToggle(task)"
                    :disabled="task.completed"
                  )
                  .flex.flex-col
                    span.font-medium.text-gray-900 {{ task.name }}
                    span.text-xs.text-gray-400 作成: {{ formatDate(task.createdAt) }}
                    span.text-xs.text-emerald-600(v-if="task.completedAt")
                      | 完了: {{ formatDate(task.completedAt) }}
                .flex.items-center.gap-2
                  button.text-xs.text-blue-600.hover.underline(
                    @click="editTask(task)"
                    :disabled="task.completed"
                  ) 編集
                  button.text-xs.text-red-600.hover.underline(
                    @click="removeTask(task.id)"
                    :disabled="task.completed"
                  ) 削除
      template(v-else)
        .text-gray-500.text-sm まだタスクがありません。上のフォームから追加してください。

  // フッター操作
  .flex.items-center.justify-between
    // 進捗バー
    div.w-40.h-2.bg-gray-200.rounded
      div.h-2.bg-neutral-500.rounded(:style="{ width: progressRate + '%' }")

    .text-sm.text-gray-600.flex.items-center.gap-4
      span
        | 完了済み:
        span.font-semibold {{ completedCount }}
        |  / 合計:
        span.font-semibold {{ tasks.length }}
      span
        | 進捗率:
        span.font-semibold {{ progressRate }}%

    .flex.items-center.gap-3
      button.btn-apply(
        @click="goToReport"
        :disabled="!completedCount"
      ) 退勤 → 日報作成へ
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SidebarComponent from '../../components/SidebarComponent.vue';
import HeaderComponent from '../../components/HeaderComponent.vue';

// タスク型定義
type Task = {
  id: string; // 一意のID
  category: string; // カテゴリ
  name: string; // タスク名
  completed: boolean; // 完了フラグ
  createdAt: string; // 作成日時 (ISO)
  completedAt?: string; // 完了日時 (ISO、オプション)
};

const STORAGE_KEY = 'tasks_v1';

export default defineComponent({
  name: 'TasksPage',
  components: { SidebarComponent, HeaderComponent },
  setup() {
    const router = useRouter();

    // ページタイトル
    const state = reactive({ title: 'タスク' });

    // タスク一覧
    const tasks = reactive<Task[]>([]);

    // 新規タスク入力用の状態
    const newTask = reactive({ category: '', name: '' });

    // 入力エラーメッセージ
    const errors = reactive<{ input?: string }>({});

    /**
     * 現在のタスク配列を localStorage に保存する
     */
    const save = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    };

    /**
     * localStorage からタスクを読み込み、tasks に展開する
     */
    const load = () => {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Task[] = JSON.parse(raw);
        tasks.splice(0, tasks.length, ...parsed);
      }
    };
    onMounted(load);

    /**
     * 入力されたカテゴリとタスク名から新しいタスクを作成して追加する
     * 両方の入力が空の場合はエラーを表示
     */
    const tryAddTask = () => {
      errors.input = '';
      if (!newTask.category || !newTask.name) {
        errors.input = 'カテゴリとタスク名の両方を入力してください。';
        return;
      }
      const task: Task = {
        id: crypto.randomUUID(),
        category: newTask.category,
        name: newTask.name,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      tasks.unshift(task);
      newTask.category = '';
      newTask.name = '';
      save();
    };

    /**
     * 指定したIDのタスクを削除する
     */
    const removeTask = (id: string) => {
      const idx = tasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        tasks.splice(idx, 1);
        save();
      }
    };

    /**
     * window.prompt を用いてタスク名・カテゴリを編集する（簡易的な編集）
     */
    const editTask = (t: Task) => {
      const name = window.prompt('タスク名を編集', t.name) ?? t.name;
      const category =
        window.prompt('カテゴリを編集', t.category) ?? t.category;
      t.name = name.trim() || t.name;
      t.category = category.trim();
      save();
    };

    /**
     * - done === true のとき: 未完了だけ完了にし、completedAt を「今」に設定（既に完了のものは触らない）
     * - done === false のとき: 完了だけ未完了にし、completedAt を削除（既に未完了のものは触らない）
     */
    const toggleAll = (done: boolean) => {
      const now = new Date().toISOString();

      if (done) {
        // 「全て完了に」→ 未完了のみ完了扱い＆完了時刻を新規記録
        tasks.forEach(t => {
          if (!t.completed) {
            t.completed = true;
            t.completedAt = now;
          }
        });
      } else {
        // 「全て未完了に」→ 完了のみ未完了に戻し＆完了時刻は消す
        tasks.forEach(t => {
          if (t.completed) {
            t.completed = false;
            t.completedAt = undefined;
          }
        });
      }

      save();
    };

    /**
     * 完了済みのタスクだけを返す computed プロパティ
     */
    const completed = computed(() => tasks.filter(t => t.completed));

    /**
     * 完了済みタスクの件数を返す computed プロパティ
     */
    const completedCount = computed(() => completed.value.length);

    /**
     * 全体に対する完了済みタスクの割合をパーセンテージで返す
     */
    const progressRate = computed(() => {
      if (!tasks.length) return 0;
      return Math.round((completedCount.value / tasks.length) * 100);
    });

    /**
     * カテゴリごとにタスクをまとめて返す computed プロパティ
     */
    const grouped = computed(() => {
      const map = new Map<string, Task[]>();
      for (const t of tasks) {
        const key = t.category || '未分類';
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(t);
      }
      return Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, ts]) => ({
          category,
          tasks: ts,
          completed: ts.filter(t => t.completed).length,
        }));
    });

    /**
     * チェックボックスがクリックされた時に呼ばれる
     * 完了の場合は完了日時を記録、未完了の場合は削除
     */
    const onToggle = (t: Task) => {
      if (t.completed) {
        t.completedAt = new Date().toISOString();
      } else {
        t.completedAt = undefined;
      }
      save();
    };

    /**
     * ISO 形式の文字列を整形して返す
     * mode により full（日付+時間）、date（日付のみ）、time（時間のみ）を切り替え可能
     */
    const formatDate = (
      iso: string,
      mode: 'full' | 'date' | 'time' = 'full'
    ) => {
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');

      if (mode === 'date') return `${y}/${m}/${day}`;
      if (mode === 'time') return `${hh}:${mm}`;
      return `${y}/${m}/${day} ${hh}:${mm}`;
    };

    /**
     * 完了済みタスクをセッションストレージに保存し、
     * DailyReport ページに遷移する
     */
    const goToReport = () => {
      const payload = completed.value.map(t => ({
        id: t.id,
        category: t.category,
        name: t.name,
        completed: t.completed,
        createdAt: t.createdAt,
        completedAt: t.completedAt,
      }));
      sessionStorage.setItem('report_tasks', JSON.stringify(payload));
      router.push({ name: 'ReportsPage' });
    };

    return {
      state,
      tasks,
      newTask,
      errors,
      tryAddTask,
      removeTask,
      editTask,
      toggleAll,
      grouped,
      completedCount,
      progressRate,
      onToggle,
      formatDate,
      goToReport,
    };
  },
});
</script>
