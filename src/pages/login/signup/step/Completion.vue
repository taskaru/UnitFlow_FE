<template lang="pug">
div.text-center
  // Progress Bar
  .mb-8
    .flex.items-center.justify-between.mb-2
      .text-sm.font-medium.text-gray-700 完了
      .text-sm.text-gray-500 100%
    .w-full.bg-gray-200.rounded-full.h-2
      .bg-green-600.h-2.rounded-full(style="width: 100%")
  
  // Completion Message
  div
    .mb-6
      .w-16.h-16.bg-green-100.rounded-full.flex.items-center.justify-center.mx-auto.mb-4
        svg.w-8.h-8.text-green-600(fill="none" stroke="currentColor" viewBox="0 0 24 24")
          path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7")
      
      h3.text-2xl.font-bold.text-gray-800.mb-2 おめでとうございます！
      p.text-gray-600.mb-6 アカウントの作成が完了しました。
    
    // Login Button
    button.w-full.text-white.py-3.px-4.rounded-lg.shadow-md.transition-transform.transform.bg-blue-600(
      type="button"
      class="hover:bg-blue-700 hover:scale-105"
      @click="goToLogin"
    )
      | ログイン画面に戻る
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CompletionComponent',
  setup() {
    const router = useRouter();

    const goToLogin = () => {
      router.push('/');
    };

    return {
      goToLogin,
    };
  },
});
</script>
