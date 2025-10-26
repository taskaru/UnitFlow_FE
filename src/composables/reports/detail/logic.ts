import { computed, ref, watch } from 'vue';

const state = ref({
  isVisible: false,
  isFullWidth: false,
  content: {
    businessContent: '業務内容を作成します',
    dailyThoughts: '本日の感想を作成します',
    reflection: '本日の反省点を作成します',
  },
  isEditing: {
    businessContent: false,
    dailyThoughts: false,
    reflection: false,
  },
});

const screenSize = computed(() => {
  return state.value.isFullWidth ? 'w-3/4' : 'w-1/2';
});

// Auto-save with debouncing
let saveTimeout: number | null = null;

function autoSave() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    // Here you would typically save to backend
    // Auto-save functionality implemented
  }, 1000); // Save after 1 second of inactivity
}

/**
 * 全体サイズに画面のボタンを押下するか否か
 */
function onClickScreensize(): void {
  state.value.isFullWidth = !state.value.isFullWidth;
}

/**
 * 編集モードを切り替える
 */
function toggleEdit(field: keyof typeof state.value.isEditing): void {
  state.value.isEditing[field] = !state.value.isEditing[field];
}

/**
 * コンテンツを更新する
 */
function updateContent(
  field: keyof typeof state.value.content,
  value: string
): void {
  state.value.content[field] = value;
  autoSave();
}

/**
 * 編集を終了する
 */
function finishEdit(field: keyof typeof state.value.isEditing): void {
  state.value.isEditing[field] = false;
  autoSave();
}

// Watch for content changes to trigger auto-save
watch(
  () => state.value.content,
  () => {
    autoSave();
  },
  { deep: true }
);

export function useReportDetailLogic() {
  return {
    state,
    screenSize,
    onClickScreensize,
    toggleEdit,
    updateContent,
    finishEdit,
  };
}
