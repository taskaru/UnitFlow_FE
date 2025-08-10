<template lang="pug">
div.min-h-screen.flex.items-center.justify-center.bg-gradient-to-br.from-blue-50.to-blue-100.p-4
  .bg-white.shadow-xl.rounded-2xl.p-8.w-full.max-w-md.transition-all.duration-300
    h2.text-3xl.font-bold.text-center.text-gray-800.mb-6 ログイン
    form(@submit.prevent="handleLogin")
      div
        label(for="email").block.text-sm.font-medium.text-gray-700 メール
        input#email.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300.mb-3(
          v-model="state.email"
          type="email"
          required
          placeholder="you@example.com"
          class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
        )
      div
        label(for="password").block.text-sm.font-medium.text-gray-700 パスワード
        input#password.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300.mb-7(
          v-model="state.password"
          type="password"
          required
          placeholder="••••••••"
          class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
        )
      button.w-full.text-white.py-2.px-4.rounded-lg.shadow-md.transition-transform.transform.mb-5.bg-blue-600(
        type="submit"
        class="hover:bg-blue-700 hover:scale-105"
      )
        | ログイン
      div.w-full.text-gray-500.py-2.px-4.rounded-lg.shadow-md.transition-transform.transform.mb-5.flex.items-center.justify-center.space-x-2.cursor-pointer(
        class="hover:scale-105"
      )
        img(src="../../assets/i-google.svg" alt="Google" class="w-5 h-5 ")
        span Googleログイン
      button.w-full.text-white.py-2.px-4.rounded-lg.shadow-md.transition-transform.transform.mb-5.bg-gray-600(
        type="button"
        class="hover:bg-gray-700 hover:scale-105"
      )
        | サインアップ
      div.w-full.test-white.flex.items-center.justify-center.text-gray-400.underline.decoration-gray-400.cursor-pointer
        | パスワード再設定
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

interface LoginState {
  email: string;
  password: string;
}

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const state = reactive<LoginState>({
      email: '',
      password: '',
    });

    function handleLogin(): void {
      // ミドルtodo
      // バックエンドとの通信コードログインに成功したらホームページに履行
    }

    return {
      state,
      handleLogin,
    };
  },
});
</script>
