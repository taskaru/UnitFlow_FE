<template lang="pug">
  main.flex-1.overflow-hidden
    // 入力エリア
    .flex.mb-1.items-center.justify-between
      .flex.flex-col(
        class="w-[40vw] h-[4vw] p-[0.2vw]"
      )
        input.wrapper.dark(
          v-model.trim="newTask.category"
          placeholder="例）DEV012345"
          class="h-[4vw] focus:placeholder-[#ffffff] placeholder-[#a1a1a1] focus:outline-none"
          @keyup.enter="tryAddTask"
        )
      .flex.flex-col(
        class="w-[40vw] h-[4vw] p-[0.2vw]"
      )
        input.wrapper.dark(
          v-model.trim="newTask.name"
          placeholder="例）PRレビュー / テストケース作成 など"
          @keyup.enter="tryAddTask"
          class="h-[4vw] focus:placeholder-[#ffffff] placeholder-[#a1a1a1] focus:outline-none"
          )
      .glass-icon-btn(
        @click="tryAddTask"
        aria-label="追加"
      )
        img(
          src="https://img.icons8.com/?size=100&id=1OvPrBUWbMke&format=png&color=000000"
        )
    span.text-sm.text-red-500.mx-2(
      v-if="errors.input"
    ) 
      |  {{ errors.input }}

    // タスクボタン（全体用）
    .flex.justify-end.m-1
      .flex
        button.cta(
          class="w-[4vw] h-[2vw] text-stone-600"
          @click="toggleAll(false)"
          :disabled="!tasks.length"
        ) 未完了
        button.cta(
          class="w-[3vw] h-[2vw] text-stone-600"
          @click="toggleAll(true)"
          :disabled="!tasks.length"
        ) 完了

    // タスクリスト
    .flex-1.overflow-y-auto(class="h-[66vh]")
      template(v-if="grouped.length")
        // カテゴリごと
        .space-y-4
          .task-category-container(
            v-for="group in grouped"
            :key="group.category"
          )
            .flex.items-center.justify-between.mb-3
              h3.font-semibold.text-stone-400 {{ group.category || '未分類' }}
              span.text-sm.text-stone-600 {{ group.completed }}/{{ group.tasks.length }} 完了
            ul
              li.py-2.flex.items-start.justify-between.gap-3(
                v-for="task in group.tasks"
                :key="task.id"
              )
                label.flex.items-start.gap-3.cursor-pointer.select-none
                  input(
                    class="mt-[0.2vw]"
                    type="checkbox"
                    v-model="task.completed"
                    @change="onToggle(task)"
                    :disabled="task.completed"
                  )
                  .flex.flex-col
                    span.font-medium.text-white {{ task.name }}
                    span.text-xs.text-stone-400 作成: {{ formatDate(task.createdAt) }}
                    span.text-xs.mt-1(
                      v-if="task.completedAt"
                      class="text-[#c1ffe2]"
                      )
                      | 完了: {{ formatDate(task.completedAt) }}
                .flex.items-center.gap-2
                  button(
                    @click="editTask(task)"
                    :disabled="task.completed"
                    class="p-1 rounded transition-colors"
                    :class="task.completed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'"
                    title="編集"
                  )
                    img(
                      src="https://img.icons8.com/?size=100&id=7dEB2atIqO6T&format=png&color=000000"
                      class="w-5 h-5 object-contain"
                    )
                  button(
                    @click="removeTask(task.id)"
                    :disabled="task.completed"
                    class="p-1 rounded transition-colors"
                    :class="task.completed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'"
                    title="削除"
                  )
                    img(
                      src="https://img.icons8.com/?size=100&id=CzTISLkmHrKE&format=png&color=000000"
                      class="w-5 h-5 object-contain"
                    )
      template(v-else)
        .text-stone-800.text-sm まだタスクがありません。上のフォームから追加してください。

  // フッター操作
  .flex.items-center.justify-between.m-4
    // 進捗バー
    .flex.items-center
      .w-40.h-2.bg-stone-400.rounded
        .h-2.rounded(
          class="bg-[#c1ffe2]"
          :style="{ width: progressRate + '%' }"
        )
      .text-stone-400.font-semibold.ml-1 {{ progressRate }}%
    .flex.items-center.gap-3
      button.btn-apply.wrapper.dark(
        class="text-[#c1ffe2]"
        @click="goToReport"
        :disabled="!tasks.length"
      ) 
        img(
          src="https://img.icons8.com/?size=100&id=aZCcxa9TqPy7&format=png&color=000000"
          class="w-6 h-6 object-contain"
        )
  TaskModal(
    :visible="showModal"
    :tasks="tasks"
    :grouped="grouped"
    :completedCount="completedCount"
    :progressRate="progressRate"
    :formatDate="formatDate"
    :onToggle="onToggle"
    @close="closeModal"
    @confirm="confirmAndGo"
  )

</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import SidebarComponent from '../../components/SidebarComponent.vue';
import HeaderComponent from '../../components/HeaderComponent.vue';
import TaskModal from './TaskModal.vue';
// タスク型定義
export type Task = {
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
  components: { SidebarComponent, HeaderComponent, TaskModal },
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

    // モーダル表示状態
    const showModal = ref(false);

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
     * モーダルを開く
     */
    const openModal = () => {
      showModal.value = true;
    };

    /**
     * モーダルを閉じる
     */
    const closeModal = () => {
      showModal.value = false;
    };

    /**
     * モーダルで確認後、レポートページに遷移
     */
    const confirmAndGo = () => {
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

    /**
     * 完了済みタスクをセッションストレージに保存し、
     * DailyReport ページに遷移する
     */
    const goToReport = () => {
      openModal();
    };

    return {
      state,
      tasks,
      newTask,
      errors,
      showModal,
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
      closeModal,
      confirmAndGo,
    };
  },
});
</script>
