import { ref } from 'vue';

const state = ref({
  isVisible: false,
});

export function useReportDetailLogic() {
  return {
    state,
  };
}
