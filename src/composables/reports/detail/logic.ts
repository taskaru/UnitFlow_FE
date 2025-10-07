import { computed, ref } from 'vue';

const state = ref({
  isVisible: false,
  isFullWidth: false,
});

const screenSize = computed(() => {
  return state.value.isFullWidth ? 'w-3/4' : 'w-1/2';
});

/**
 * 全体サイズに画面のボタンを押下するか否か
 *
 * @returns { Boolean }
 */
function onClickScreensize(): void {
  state.value.isFullWidth = !state.value.isFullWidth;
}

export function useReportDetailLogic() {
  return {
    state,
    screenSize,
    onClickScreensize,
  };
}
