import { ref } from 'vue';

export function useReportDetailLogic() {
  const state = ref({
    isVisible: false,
  });

  return {
    state,
  };
}
