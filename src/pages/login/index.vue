<template lang="pug">
div.min-h-screen.flex.items-center.justify-center.bg-gradient-to-br.from-blue-50.to-blue-100.p-4
  .bg-white.shadow-xl.rounded-2xl.p-8.w-full.max-w-md.transition-all.duration-300
    h2.text-3xl.font-bold.text-center.text-gray-800.mb-6 ログイン
    form.space-y-5(@submit.prevent="handleLogin")
      div
        label(for="email").block.text-sm.font-medium.text-gray-700 メール
        input#email.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300(
          v-model="state.email"
          type="email"
          required
          placeholder="you@example.com"
          class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
        )
      div
        label(for="password").block.text-sm.font-medium.text-gray-700 パスワード
        input#password.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300(
          v-model="state.password"
          type="password"
          required
          placeholder="••••••••"
          class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
        )
      button.w-full.text-white.py-2.px-4.rounded-lg.shadow-md.transition-transform.transform(
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 hover:scale-105"
      )
        | ログイン
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

interface LoginState {
  email: string;
  password: string;
}

export default defineComponent({
  name: 'LoginForm',
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
