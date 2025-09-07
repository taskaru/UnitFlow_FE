<template lang="pug">
  main.flex-1.overflow-hidden
    // 入力エリア
    .flex.mb-1.items-center.justify-between
      // カテゴリ
      .flex.flex-col(class="w-[26vw] h-[4vw] p-[0.2vw]")
        input.wrapper.dark(
          v-model.trim="newTask.category"
          placeholder="例）DEV012345"
          class="h-[4vw] focus:placeholder-[#ffffff] placeholder-[#a1a1a1] focus:outline-none"
        )
      // タスク名
      .flex.flex-col(class="w-[32vw] h-[4vw] p-[0.2vw]")
        input.wrapper.dark(
          v-model.trim="newTask.name"
          placeholder="例）PRレビュー / テストケース作成 など"
          class="h-[4vw] focus:placeholder-[#ffffff] placeholder-[#a1a1a1] focus:outline-none"
        )
      // 目標完了時刻
      .flex.flex-col(class="w-[20vw] h-[4vw] p-[0.2vw]")
        input.wrapper.dark(
          type="time"
          v-model="newTask.targetLocal"
          class="h-[4vw] text-xs focus:outline-none"
          placeholder="目標時刻 (任意)"
          @keyup.enter="tryAddTask"
        )
      // 追加
      .glass-icon-btn(@click="tryAddTask" aria-label="追加")
        img(src="https://img.icons8.com/?size=100&id=1OvPrBUWbMke&format=png&color=000000")

    span.text-sm.text-red-500.mx-2(v-if="errors.input") {{ errors.input }}

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
            .flex.items-center.justify-between.mb-2
              h3.font-semibold.text-stone-400 {{ group.category || '未分類' }}
              span.text-xs.text-stone-500 {{ group.completed }}/{{ group.tasks.length }}
            ul
              li.py-2.flex.items-start.justify-between.gap-3(
                v-for="task in group.tasksSorted"
                :key="task.id"
              )
                // 左側：チェック + 情報
                label.flex.items-start.gap-3.cursor-pointer.select-none
                  input(
                    class="mt-[0.2vw] accent-emerald-200"
                    type="checkbox"
                    v-model="task.completed"
                    @change="onToggle(task)"
                  )
                  .flex.flex-col
                    span.font-medium.text-white {{ task.name }}
                    // 予定/作成
                    span.text-xs.mt-1(
                      :class="isOverdue(task) ? 'text-rose-400' : 'text-stone-400'"
                    )
                      | 予定: {{ task.targetAt ? formatDate(task.targetAt, 'time') : '-' }}
                    // 完了
                    span.text-xs.mt-1(
                      class="text-[#c1ffe2]" 
                      v-if="task.completedAt"
                    )
                      | 完了: {{ formatDate(task.completedAt, 'time') }}
                    // メモ（延長理由）
                    ul.mt-1.space-y-1(
                      v-if="task.notes && task.notes.length"
                    )
                      li.text-xs.text-stone-400(
                        v-for="(n, i) in task.notes"
                        :key="i"
                      ) 
                        | [{{ formatDate(n.at, 'time') }}] {{ n.type === 'delay' ? '延長' : '連鎖延長' }} +{{ n.minutes }}分
                        br
                        | 理由: {{ n.reason }}
                        br(v-if="n.oldTargetTime && n.newTargetTime")
                        | 予定変更: {{ formatDate(n.oldTargetTime, 'time') }} → {{ formatDate(n.newTargetTime, 'time') }}

                // 右側:延長UI
                .flex.flex-col.items-end.gap-2
                  button.w-full.border-yellow(
                    v-if="needsExtension(task) && ui.extendFor !== task.id"
                    @click="openExtend(task)"
                  ) 延長(30分)
                  .border-red(
                    class="w-[3.5vw]"
                    v-if="hasNotes(task) && !task.completedAt"
                  ) 遅延中
                  .border-green(
                    class="w-[3.5vw]"
                    v-if="task.completedAt"
                  ) 完了
                  .w-48.pr-2(v-if="ui.extendFor === task.id")
                    textarea.w-full.h-16.p-2.rounded.bg-white.bg-opacity-5.border.border-white.border-opacity-10.text-xs.text-white.placeholder-gray-400(
                      v-model.trim="ui.reason"
                      placeholder="なぜ遅延していますか？（必須）"
                    )
                    .flex.justify-end.gap-2.mt-1
                      //- button.text-xs.px-2.py-1.rounded.bg-stone-600.text-white(
                      //-   @click="cancelExtend"
                      //- ) キャンセル
                      button.w-full.border-red(
                        :disabled="!ui.reason"
                        @click="confirmExtend(task)"
                      ) 保存して延長
      template(v-else)
        .text-stone-800.text-sm まだタスクがありません。上のフォームから追加してください。

  // フッター操作
  .flex.items-center.justify-between.m-4
    // 進捗バー + 現在時刻
    .flex.items-center.gap-3
      .w-40.h-2.bg-stone-400.rounded
        .h-2.rounded(
          class="bg-[#c1ffe2]"
          :style="{ width: progressRate + '%' }"
        )
      .text-stone-400.font-semibold.ml-1 {{ progressRate }}%
      .text-xs.text-stone-500.ml-3 
        | 現在: 
        span.font-mono {{ formatDate(nowIso, 'time') }}
    // レポートへ（任意）
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
  task-modal(
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
import {
  defineComponent,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import { useRouter } from 'vue-router';
import TaskModal from './TaskModal.vue';

// タスク型定義
export type Task = {
  id: string;
  category: string;
  name: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  targetIso?: string;

  // 延長用
  targetAt?: string; // 目標完了時刻(ISO)
  notes?: Array<{
    at: string; // 記録時刻(ISO)
    type: 'delay' | 'cascadeDelay';
    minutes: number; // 延長分
    reason: string; // 理由
    oldTargetTime?: string; // 延長前の目標時刻
    newTargetTime?: string; // 延長後の目標時刻
  }>;
};

const STORAGE_KEY = 'tasks_v1';

export default defineComponent({
  name: 'TasksPage',
  components: { TaskModal },
  setup() {
    const router = useRouter();

    // タスク一覧
    const tasks = reactive<Task[]>([]);

    // 入力状態（目標時刻は datetime-local の文字列で扱う）
    const newTask = reactive({ category: '', name: '', targetLocal: '' });

    // 入力エラー
    const errors = reactive<{ input?: string }>({});

    // 現在時刻（リアルタイム更新）
    const now = ref(new Date());
    const nowIso = computed(() => now.value.toISOString());
    let timer: number | undefined;

    // UI状態：延長用
    const ui = reactive<{ extendFor: string | null; reason: string }>({
      extendFor: null,
      reason: '',
    });

    // モーダル表示状態
    const showModal = ref(false);

    // 保存/読込
    const save = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    };
    const load = () => {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Task[] = JSON.parse(raw);
        tasks.splice(0, tasks.length, ...parsed);
      }
    };

    onMounted(() => {
      load();
      timer = window.setInterval(() => {
        now.value = new Date();
      }, 1000);
    });
    onUnmounted(() => {
      if (timer) clearInterval(timer);
    });

    // 新規タスク追加
    const tryAddTask = () => {
      errors.input = '';
      if (!newTask.category || !newTask.name) {
        errors.input = 'カテゴリとタスク名の両方を入力してください。';
        return;
      }

      // 時間のみの入力を今日の日付と結合
      let targetIso: string | undefined = undefined;
      if (newTask.targetLocal) {
        const today = new Date();
        const [hours, minutes] = newTask.targetLocal.split(':');
        const targetDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          parseInt(hours),
          parseInt(minutes)
        );
        targetIso = targetDate.toISOString();
      }

      const task: Task = {
        id: crypto.randomUUID(),
        category: newTask.category,
        name: newTask.name,
        completed: false,
        createdAt: new Date().toISOString(),
        targetAt: targetIso,
        notes: [],
      };
      tasks.unshift(task);
      newTask.category = '';
      newTask.name = '';
      newTask.targetLocal = '';
      save();
    };

    // 削除
    const removeTask = (id: string) => {
      const idx = tasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        tasks.splice(idx, 1);
        save();
      }
    };

    // 編集（簡易）
    const editTask = (t: Task) => {
      const name = window.prompt('タスク名を編集', t.name) ?? t.name;
      const category =
        window.prompt('カテゴリを編集', t.category) ?? t.category;
      t.name = name.trim() || t.name;
      t.category = category.trim();
      save();
    };

    // 一括トグル
    const toggleAll = (done: boolean) => {
      const nowIsoStr = new Date().toISOString();
      if (done) {
        tasks.forEach(t => {
          if (!t.completed) {
            t.completed = true;
            t.completedAt = nowIsoStr;
          }
        });
      } else {
        tasks.forEach(t => {
          if (t.completed) {
            t.completed = false;
            t.completedAt = undefined;
          }
        });
      }
      save();
    };

    // 完了済みなど
    const completed = computed(() => tasks.filter(t => t.completed));
    const completedCount = computed(() => completed.value.length);
    const progressRate = computed(() =>
      !tasks.length
        ? 0
        : Math.round((completedCount.value / tasks.length) * 100)
    );

    // 並び替えキー：目標→なければ作成時刻
    const targetKey = (t: Task) =>
      t.targetAt ? Date.parse(t.targetAt) : Date.parse(t.createdAt);

    // 期限超過チェック
    const isOverdue = (t: Task) => {
      if (!t.targetAt || t.completed) return false;
      return Date.parse(t.targetAt) < now.value.getTime();
    };

    // 延長が必要なタスクかチェック
    const needsExtension = (t: Task) => {
      return isOverdue(t) && !t.completed;
    };

    // クリックトグル
    const onToggle = (t: Task) => {
      if (t.completed) {
        t.completedAt = new Date().toISOString();
      } else {
        t.completedAt = undefined;
      }
      save();
    };

    // グルーピング（予定順で tasksSorted を提供）
    const grouped = computed(() => {
      const map = new Map<string, Task[]>();
      for (const t of tasks) {
        const key = t.category || '未分類';
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(t);
      }
      return Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, ts]) => {
          const tasksSorted = [...ts].sort(
            (a, b) => targetKey(a) - targetKey(b)
          );
          return {
            category,
            tasks: ts,
            tasksSorted,
            completed: ts.filter(t => t.completed).length,
          };
        });
    });

    // 延長UI管理
    const openExtend = (t: Task) => {
      ui.extendFor = t.id;
      ui.reason = '';
    };

    const cancelExtend = () => {
      ui.extendFor = null;
      ui.reason = '';
    };

    // 30分延長（遅延時間基準で後続タスクも連鎖延長）
    const extendTaskAndFollowing = (
      base: Task,
      minutes: number,
      reason: string
    ) => {
      const delta = minutes * 60 * 1000;
      const currentTime = now.value.getTime();

      // 全タスクを目標時刻順でソート
      const allTasks = [...tasks].sort((a, b) => targetKey(a) - targetKey(b));

      // 基準タスクのインデックスを取得
      const baseIdx = allTasks.findIndex(x => x.id === base.id);
      if (baseIdx === -1) return;

      const stamp = new Date().toISOString();
      let extendedCount = 0;

      // 基準タスクから後続の全タスクを処理
      for (let i = baseIdx; i < allTasks.length; i++) {
        const cur = allTasks[i];
        if (!cur.targetAt) continue; // 目標時刻がない場合はスキップ

        // 基準タスク自体は必ず延長、 그 외는 현재時刻より後のタスクのみ延長
        const shouldExtend =
          i === baseIdx || Date.parse(cur.targetAt) > currentTime;

        if (shouldExtend) {
          // 目標時刻を延長
          const oldTargetTime = cur.targetAt;
          const newTargetTime = Date.parse(cur.targetAt) + delta;
          cur.targetAt = new Date(newTargetTime).toISOString();
          extendedCount++;

          // 延長記録を追加
          if (!cur.notes) cur.notes = [];
          cur.notes.push({
            at: stamp,
            type: i === baseIdx ? 'delay' : 'cascadeDelay',
            minutes,
            reason: i === baseIdx ? reason : '前のタスク遅延の影響',
            oldTargetTime: oldTargetTime,
            newTargetTime: cur.targetAt,
          });
        }
      }

      // 延長完了通知
      if (extendedCount > 0) {
        alert(`${extendedCount}個のタスクの予定時刻を30分延長しました。`);
      }

      save();
    };

    // 延長確認処理
    const confirmExtend = (t: Task) => {
      if (!ui.reason.trim()) {
        alert('延長理由を入力してください。');
        return;
      }
      extendTaskAndFollowing(t, 30, ui.reason.trim());
      ui.extendFor = null;
      ui.reason = '';
    };

    // モーダルを開く
    const openModal = () => {
      showModal.value = true;
    };

    // モーダルを閉じる
    const closeModal = () => {
      showModal.value = false;
    };

    // モーダルで確認後、レポートページに遷移
    const confirmAndGo = () => {
      const payload = completed.value.map(t => ({
        id: t.id,
        category: t.category,
        name: t.name,
        completed: t.completed,
        createdAt: t.createdAt,
        completedAt: t.completedAt,
        targetAt: t.targetAt,
        notes: t.notes || [],
      }));
      sessionStorage.setItem('report_tasks', JSON.stringify(payload));
      router.push({ name: 'ReportsPage' });
    };

    // レポートへ（必要な場合）
    const goToReport = () => {
      openModal();
    };

    // ユーティリティ
    const pad2 = (n: number) => String(n).padStart(2, '0');
    const formatDate = (
      iso: string | null | undefined,
      mode: 'full' | 'date' | 'time' = 'full'
    ) => {
      if (!iso) return '-';
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = pad2(d.getMonth() + 1);
      const day = pad2(d.getDate());
      const hh = pad2(d.getHours());
      const mm = pad2(d.getMinutes());
      if (mode === 'date') return `${y}/${m}/${day}`;
      if (mode === 'time') return `${hh}:${mm}`;
      return `${y}/${m}/${day} ${hh}:${mm}`;
    };

    const hasNotes = (t: Task) =>
      Array.isArray(t.notes)
        ? t.notes.length > 0
        : !!(t.notes && String(t.notes).trim());

    return {
      // state
      tasks,
      newTask,
      errors,
      ui,
      nowIso,
      showModal,
      // list/computed
      grouped,
      completedCount,
      progressRate,
      // actions
      tryAddTask,
      removeTask,
      editTask,
      toggleAll,
      onToggle,
      openExtend,
      cancelExtend,
      confirmExtend,
      isOverdue,
      needsExtension,
      goToReport,
      openModal,
      closeModal,
      confirmAndGo,
      // utils
      formatDate,
      hasNotes,
    };
  },
});
</script>
