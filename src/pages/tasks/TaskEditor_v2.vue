<template lang="pug">
  main.flex-1.overflow-hidden
    // 入力エリア
    .flex.mb-1.items-center.justify-between.px-4
      // カテゴリ
      .flex.flex-col(class="w-[17vw] h-[3.6vw]")
        input.wrapper.dark(
          v-model.trim="newTask.category"
          placeholder="例）DEV012345"
          class="h-[4vw] focus:placeholder-[#ffffff] placeholder-[#a1a1a1] focus:outline-none"
        )
      // タスク名
      .flex.flex-col(class="w-[41vw] h-[3.6vw] px-[0.4vw]")
        input.wrapper.dark(
          v-model.trim="newTask.name"
          placeholder="例）PRレビュー / テストケース作成 など"
          class="h-[4vw] focus:placeholder-[#ffffff] placeholder-[#a1a1a1] focus:outline-none"
        )
      // 開始時刻
      .flex.flex-col(class="w-[8vw] h-[3.6vw]")
        input.wrapper.dark(
          type="time"
          v-model="newTask.startTime"
          class="h-[4vw] text-xs focus:outline-none"
          placeholder="開始時刻"
          @keyup.enter="tryAddTask"
        )
      // 終了時刻
      .flex.flex-col(class="w-[8vw] h-[3.6vw]")
        input.wrapper.dark(
          type="time"
          v-model="newTask.endTime"
          class="h-[4vw] text-xs focus:outline-none"
          placeholder="終了時刻"
          @keyup.enter="tryAddTask"
        )
      // 状態(任意)
      .flex.flex-col(class="w-[10vw] h-[3.6vw]")
        select.wrapper.dark(
          v-model="newTask.status"
          class="h-[4vw] text-xs focus:outline-none"
        )
          option(value="todo") 未着手
          option(value="inprogress") 対応中
          option(value="review") レビュー中
          option(value="done") 完了

      // 追加
      .glass-icon-btn(
        @click="tryAddTask" 
        aria-label="追加"
      )
        img(src="https://img.icons8.com/?size=100&id=1OvPrBUWbMke&format=png&color=000000")

    span.text-sm.text-red-500.mx-2(v-if="errors.input") {{ errors.input }}
    // タスクボタン（全体用）
    .flex.justify-between.items-center.mx-3.mt-4.py-1
      .div.flex.justify-end.items-center.gap-2.px-1.py-2
        button.px-3.py-1.rounded-md.border.border-white.border-opacity-10(
          @click="view = 'list'" 
          :class="view==='list' ? 'bg-white bg-opacity-10' : ''"
        ) List
        button.px-3.py-1.rounded-md.border.border-white.border-opacity-10(
          @click="view = 'board'" 
          :class="view==='board' ? 'bg-white bg-opacity-10' : ''"
        ) Board
      .border-yellow.mx-1
        | 現在: 
        span.font-mono {{ formatDate(nowIso, 'time') }}
        //- label.flex.items-center.gap-1.text-xs.text-stone-400.mx-3
        //-   input(type="checkbox" v-model="showTodayOnly")
        //-   | 今日のみ表示
      //- .flex
      //-   button.cta(
      //-     v-if="view === 'list'"
      //-     class="w-[4vw] h-[2vw] text-stone-600"
      //-     @click="toggleAll(false)"
      //-     :disabled="!tasks.length"
      //-   ) 未完了
      //-   button.cta(
      //-     v-if="view === 'list'"
      //-     class="w-[3vw] h-[2vw] text-stone-600"
      //-     @click="toggleAll(true)"
      //-     :disabled="!tasks.length"
      //-   ) 完了
    template(v-if="view === 'list'")  
      // タスクリスト
      .flex-1.overflow-y-auto(class="h-[63vh]")
        template(v-if="grouped.length")
          // カテゴリごと
          .space-y-4.px-4
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
                  .flex.items-start.gap-3
                    input(
                      class="mt-[0.2vw] accent-emerald-200"
                      type="checkbox"
                      v-model="task.completed"
                      @change="onToggle(task)"
                    )
                    .flex.flex-col
                      .flex
                        span.font-medium.text-white.mr-2 {{ task.name }}
                        .border-orange.text-xs.px-1.py-1.rounded(
                          v-if="isCarriedOver(task) && !task.completed"
                        ) 繰越
                        .border-blue.text-xs.px-1.py-1.rounded(
                          v-if="checkIfResetToToday(task) && !task.completed"
                        ) 再設定済
                        button.border-yellow.text-xs.px-2.py-1.rounded(
                          v-if="isCarriedOver(task) && !task.completed"
                          @click="resetTaskToToday(task)"
                          title="今日のタスクとして再設定"
                        ) 今日に設定
                        button.border-red(
                          v-if="needsExtension(task) && !isCarriedOver(task) && ui.extendFor !== task.id"
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
                      // 予定/作成
                      span.text-xs.mt-1(
                        :class="isOverdue(task) ? 'text-rose-400' : isCarriedOver(task) ? 'text-orange-400' : 'text-stone-400'"
                      )
                        | 予定: {{ getTimeRange(task) }}
                        span.ml-1.text-orange-400(v-if="isCarriedOver(task)") (繰越)
                      // 元の期限（繰越タスクまたは再設定タスクの場合）
                      span.text-xs.mt-1.text-orange-300(
                        v-if="isCarriedOver(task) || checkIfResetToToday(task)"
                      )
                        | 元期限: {{ getOriginalDeadline(task) }}
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
                      .w-80.py-1(v-if="ui.extendFor === task.id")
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
                  // 右側:延長UI + 編集・削除ボタン
                  .flex.flex-col.items-end.gap-2
                    .flex.items-center
                      button(
                        @click="editTask(task)"
                        :disabled="task.completed"
                        class="p-1 rounded transition-colors"
                        :class="task.completed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'"
                        title="編集"
                      )
                        img(
                          src="https://img.icons8.com/?size=100&id=7dEB2atIqO6T&format=png&color=000000"
                          class="w-4 h-4 object-contain"
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
                          class="w-4 h-4 object-contain"
                        )
        template(v-else)
          .text-white.opacity-50.text-sm.px-4 まだタスクがありません。上のフォームから追加してください。
    template(v-if="view === 'board'")
      task-board(
        :tasks="sourceTasks"
        :formatDate="formatDate"
        @advance="advanceStatus"
        @edit="editTask"
        @remove="removeTask"
      )

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
  //モーダル   
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
import TaskBoard from './TaskBoard.vue';

// タスク型定義
export type Task = {
  id: string; // 一意のID
  category: string; // カテゴリ
  name: string; // タスク名
  completed: boolean; // 完了フラグ
  createdAt: string; // 作成日時 (ISO)
  completedAt?: string; // 完了日時 (ISO、オプション)
  targetIso?: string;

  // 延長用
  targetAt?: string; // 目標完了時刻(ISO)

  // WBS互換フィールド
  expectedStartAt?: string; // 予定開始時刻(ISO)
  expectedEndAt?: string; // 予定終了時刻(ISO)

  // 再設定関連フィールド
  wasResetToToday?: boolean; // 今日に再設定されたかどうか
  originalDeadline?: string; // 元の期限(ISO)

  // NEW: カンバンのステータス
  status?: 'todo' | 'inprogress' | 'review' | 'done';

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
  components: { TaskModal, TaskBoard },
  setup() {
    const router = useRouter();

    // タスク一覧
    const tasks = reactive<Task[]>([]);

    // 入力状態（開始・終了時刻は time の文字列で扱う）
    const newTask = reactive({
      category: '',
      name: '',
      startTime: '',
      endTime: '',
      status: 'todo',
    });

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

    onMounted(() => {
      load();
      timer = window.setInterval(() => {
        now.value = new Date();
      }, 1000);
    });
    onUnmounted(() => {
      if (timer) clearInterval(timer);
    });

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

      // 時間を今日の日付と結合してISO文字列に変換
      const today = new Date();
      let expectedStartAt: string | undefined = undefined;
      let expectedEndAt: string | undefined = undefined;
      let targetAt: string | undefined = undefined;

      if (newTask.startTime) {
        const [hours, minutes] = newTask.startTime.split(':');
        const startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          parseInt(hours),
          parseInt(minutes)
        );
        expectedStartAt = startDate.toISOString();
      }

      if (newTask.endTime) {
        const [hours, minutes] = newTask.endTime.split(':');
        const endDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          parseInt(hours),
          parseInt(minutes)
        );
        expectedEndAt = endDate.toISOString();
        // 互換性のため targetAt にも設定
        targetAt = expectedEndAt;
      }

      const task: Task = {
        id: crypto.randomUUID(),
        category: newTask.category,
        name: newTask.name,
        completed: false,
        createdAt: new Date().toISOString(),
        targetAt: targetAt,
        notes: [],
        // WBS互換フィールド
        expectedStartAt: expectedStartAt,
        expectedEndAt: expectedEndAt,
        status: newTask.status as 'todo' | 'inprogress' | 'review' | 'done',
      };
      tasks.unshift(task);
      newTask.category = '';
      newTask.name = '';
      newTask.startTime = '';
      newTask.endTime = '';
      newTask.status = 'todo';
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

    /**
     * - done === true のとき: 未完了だけ完了にし、completedAt を「今」に設定（既に完了のものは触らない）
     * - done === false のとき: 完了だけ未完了にし、completedAt を削除（既に未完了のものは触らない）
     */
    const toggleAll = (done: boolean) => {
      const nowIsoStr = new Date().toISOString();
      if (done) {
        // 「全て完了に」→ 未完了のみ完了扱い＆完了時刻を新規記録
        tasks.forEach(t => {
          if (!t.completed) {
            t.completed = true;
            t.completedAt = nowIsoStr;
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
    const completedCount = computed(() => {
      const todayTasks = sourceTasks.value;
      return todayTasks.filter(t => t.completed).length;
    });

    /**
     * 全体に対する完了済みタスクの割合をパーセンテージで返す
     */
    const progressRate = computed(() => {
      const todayTasks = sourceTasks.value;
      const todayCompleted = todayTasks.filter(t => t.completed).length;
      return !todayTasks.length
        ? 0
        : Math.round((todayCompleted / todayTasks.length) * 100);
    });

    /**
     * 並び替えキー：目標→なければ作成時刻
     */
    const targetKey = (t: Task) => {
      const targetTime = getTargetTimeValue(t);
      return targetTime ? Date.parse(targetTime) : Date.parse(t.createdAt);
    };

    /**
     * 期限超過チェック
     */
    const isOverdue = (t: Task) => {
      const targetTime = getTargetTimeValue(t);
      if (!targetTime || t.completed) return false;
      return Date.parse(targetTime) < now.value.getTime();
    };

    /**
     * タスクの目標時刻を取得（WBSフィールドも考慮）
     */
    const getTargetTimeValue = (t: Task) => {
      return t.targetAt || t.expectedEndAt || t.expectedStartAt;
    };

    /**
     * タスクの目標時刻を表示用にフォーマット
     */
    const getTargetTime = (t: Task) => {
      const targetTime = getTargetTimeValue(t);
      return targetTime ? formatDate(targetTime, 'time') : '-';
    };

    /**
     * タスクの時間範囲を表示用にフォーマット（WBSフィールド対応）
     */
    const getTimeRange = (t: Task) => {
      const startTime = t.expectedStartAt;
      const endTime = t.expectedEndAt;
      const targetTime = t.targetAt;

      if (startTime && endTime) {
        // WBSで設定された開始・終了時間
        return `${formatDate(startTime, 'time')} - ${formatDate(endTime, 'time')}`;
      } else if (targetTime) {
        // 従来のtargetAt
        return formatDate(targetTime, 'time');
      } else {
        return '-';
      }
    };

    /**
     * 延長が必要なタスクかチェック
     */
    const needsExtension = (t: Task) => {
      return isOverdue(t) && !t.completed;
    };

    /**
     * 繰越されたタスクかチェック（昨日以前の未完了タスク）
     */
    const isCarriedOver = (t: Task) => {
      const iso =
        t.targetAt || t.expectedEndAt || t.expectedStartAt || t.createdAt;
      const taskDay = dayKeyFromIsoLocal(iso);
      return taskDay < todayKeyLocal && !t.completed;
    };

    /**
     * 今日に再設定されたタスクかチェック
     */
    const checkIfResetToToday = (t: Task) => {
      // タスクに再設定フラグがあるかチェック
      return !!t.wasResetToToday;
    };

    /**
     * 元の期限を表示用にフォーマット（繰越タスクの場合）
     */
    const getOriginalDeadline = (t: Task) => {
      let iso: string;

      // 再設定されたタスクの場合は保存された元の期限を使用
      if (t.wasResetToToday && t.originalDeadline) {
        iso = t.originalDeadline;
      } else {
        iso = t.targetAt || t.expectedEndAt || t.expectedStartAt || t.createdAt;
      }

      if (!iso) return '-';

      const originalDate = new Date(iso);
      const today = new Date();
      const diffDays = Math.floor(
        (today.getTime() - originalDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        return `昨日 ${formatDate(iso, 'time')}`;
      } else if (diffDays > 1) {
        return `${diffDays}日前 ${formatDate(iso, 'full')}`;
      } else {
        return formatDate(iso, 'full');
      }
    };

    /**
     * 繰越タスクを今日のタスクとして再設定
     */
    const resetTaskToToday = (task: Task) => {
      try {
        const today = new Date();

        // 元の期限を保存（再設定前の情報）
        const originalDeadline =
          task.targetAt ||
          task.expectedEndAt ||
          task.expectedStartAt ||
          task.createdAt;

        // 元の時間を保持して今日へ移動
        if (task.expectedStartAt) {
          const originalStart = new Date(task.expectedStartAt);
          const newStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            originalStart.getHours(),
            originalStart.getMinutes()
          );
          task.expectedStartAt = newStart.toISOString();
        }

        if (task.expectedEndAt) {
          const originalEnd = new Date(task.expectedEndAt);
          const newEnd = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            originalEnd.getHours(),
            originalEnd.getMinutes()
          );
          task.expectedEndAt = newEnd.toISOString();
          task.targetAt = newEnd.toISOString(); // 互換性のため
        } else if (task.targetAt) {
          const originalTarget = new Date(task.targetAt);
          const newTarget = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            originalTarget.getHours(),
            originalTarget.getMinutes()
          );
          task.targetAt = newTarget.toISOString();
        }
        // 再設定フラグと元の期限を保存
        task.wasResetToToday = true;
        task.originalDeadline = originalDeadline;

        // 再設定されたタスクは未完了の状態で維持（ユーザーが手動で完了させる）

        // 保存
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch {
        // エラーは無視（ユーザー操作に影響なし）
      }
    };

    /**
     * クリックトグル
     */
    const onToggle = (t: Task) => {
      if (t.completed) {
        t.completedAt = new Date().toISOString();
        // 完了時は status も 'done' に設定
        t.status = 'done';
      } else {
        t.completedAt = undefined;
        // 未完了に戻った場合は status を 'todo' に戻す
        t.status = 'todo';
      }
      save();
    };

    /**
     * グルーピング（予定順で tasksSorted を提供）
     */
    // const grouped = computed(() => {
    //   const map = new Map<string, Task[]>();
    //   for (const t of tasks) {
    //     const key = t.category || '未分類';
    //     if (!map.has(key)) map.set(key, []);
    //     map.get(key)!.push(t);
    //   }
    //   return Array.from(map.entries())
    //     .sort(([a], [b]) => a.localeCompare(b))
    //     .map(([category, ts]) => {
    //       const tasksSorted = [...ts].sort(
    //         (a, b) => targetKey(a) - targetKey(b)
    //       );
    //       return {
    //         category,
    //         tasks: ts,
    //         tasksSorted,
    //         completed: ts.filter(t => t.completed).length,
    //       };
    //     });
    // });

    const grouped = computed(() => {
      const map = new Map<string, Task[]>();
      for (const t of sourceTasks.value) {
        // ← ここだけ変更
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

    /**
     * 延長UI管理
     */
    const openExtend = (t: Task) => {
      ui.extendFor = t.id;
      ui.reason = '';
    };

    /**
     * 延長UIを解除
     */
    const cancelExtend = () => {
      ui.extendFor = null;
      ui.reason = '';
    };

    /**
     * 30分延長（遅延時間基準で後続タスクも連鎖延長）
     */
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

        // 基準タスク自体は必ず延長、 それ以外は現在時刻より後のタスクのみ延長
        const shouldExtend =
          i === baseIdx || Date.parse(cur.targetAt) > currentTime;

        if (shouldExtend) {
          if (i === baseIdx) {
            // 基準タスク：終了時刻のみ30分延長
            const oldTargetTime = cur.targetAt;
            const newTargetTime = Date.parse(cur.targetAt) + delta;
            cur.targetAt = new Date(newTargetTime).toISOString();

            // expectedEndAtも同様に延長
            if (cur.expectedEndAt) {
              const newExpectedEndTime = Date.parse(cur.expectedEndAt) + delta;
              cur.expectedEndAt = new Date(newExpectedEndTime).toISOString();
            }

            extendedCount++;

            // 延長記録を追加
            if (!cur.notes) cur.notes = [];
            cur.notes.push({
              at: stamp,
              type: 'delay',
              minutes,
              reason: reason,
              oldTargetTime: oldTargetTime,
              newTargetTime: cur.targetAt,
            });
          } else {
            // 後続タスク：開始・終了時刻を30分ずつ後ろにずらす
            // const oldStartTime = cur.expectedStartAt; // 未使用
            const oldEndTime = cur.expectedEndAt || cur.targetAt;

            if (cur.expectedStartAt) {
              const newStartTime = Date.parse(cur.expectedStartAt) + delta;
              cur.expectedStartAt = new Date(newStartTime).toISOString();
            }

            if (cur.expectedEndAt) {
              const newEndTime = Date.parse(cur.expectedEndAt) + delta;
              cur.expectedEndAt = new Date(newEndTime).toISOString();
            }

            if (cur.targetAt) {
              const newTargetTime = Date.parse(cur.targetAt) + delta;
              cur.targetAt = new Date(newTargetTime).toISOString();
            }

            extendedCount++;

            // 連鎖延長記録を追加
            if (!cur.notes) cur.notes = [];
            cur.notes.push({
              at: stamp,
              type: 'cascadeDelay',
              minutes,
              reason: '前のタスク遅延の影響',
              oldTargetTime: oldEndTime,
              newTargetTime: cur.expectedEndAt || cur.targetAt,
            });
          }
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

    // ローカル日付キー作成（YYYY-MM-DD）
    function toLocalDayKey(d: Date): string {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
    function dayKeyFromIsoLocal(iso: string): string {
      return toLocalDayKey(new Date(iso));
    }

    // 今日キー
    const todayKeyLocal = toLocalDayKey(new Date());

    // 今日のみフィルタされたソース（今日のタスクは全て表示、昨日以前の未完了タスクも表示）
    const sourceTasks = computed(() => {
      return tasks.filter(t => {
        const iso =
          t.targetAt || t.expectedEndAt || t.expectedStartAt || t.createdAt;
        const taskDay = dayKeyFromIsoLocal(iso);

        // 今日のタスク（完了・未完了全て表示）
        if (taskDay === todayKeyLocal) {
          return true;
        }

        // 昨日以前の未完了タスクは今日に表示
        if (!t.completed && taskDay < todayKeyLocal) {
          return true;
        }

        return false;
      });
    });

    const view = ref<'list' | 'board'>('list');

    const nextMap = {
      todo: 'inprogress',
      inprogress: 'review',
      review: 'done',
      done: 'done',
    } as const;

    function advanceStatus(t: Task, to?: Task['status']) {
      const next = to ?? nextMap[t.status ?? 'todo'];
      t.status = next;
      // ボードで Done に移動したらチェックも同時に
      if (next === 'done') {
        t.completed = true;
        t.completedAt = new Date().toISOString();
      }
      save();
    }

    return {
      // state
      tasks,
      newTask,
      errors,
      ui,
      nowIso,
      showModal,
      view,
      advanceStatus,
      // list/computed
      grouped,
      completedCount,
      progressRate,
      sourceTasks,
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
      isCarriedOver,
      checkIfResetToToday,
      resetTaskToToday,
      goToReport,
      openModal,
      closeModal,
      confirmAndGo,
      // utils
      formatDate,
      hasNotes,
      getTargetTime,
      getTargetTimeValue,
      getTimeRange,
      getOriginalDeadline,
      save,
    };
  },
});
</script>
