<template lang="pug">
div.min-h-screen.flex.items-center.justify-center.bg-gradient-to-br.from-blue-50.to-blue-100.p-4
  .bg-white.shadow-xl.rounded-2xl.p-8.w-full.max-w-md.transition-all.duration-300
    h2.text-3xl.font-bold.text-center.text-gray-800.mb-6 サインアップ
    // sign up form
    form(@submit.prevent="handleSignup")
    // insert email
    div
      label(for="email").block.text-sm.font-medium.text-gray-700 メール
      input#email.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300.mb-3(
        v-model="state.email"
        type="email"
        required
        placeholder="you@example.com"
        class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
      )
      // name(kanji, english)
      .flex.gap-4
        div
          label(for="nameKana").block.text-sm.font-medium.text-gray-700 名前(漢字/カタカナ)
          input#nameKana.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300.mb-7(
            v-model="state.nameKana"
            type="text"
            required
            placeholder="名前(漢字/カタカナ)"
            class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
          )
        div 
          label(for="nameEnglish").block.text-sm.font-medium.text-gray-700 名前(english)
          input#nameEnglish.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300.mb-7(
            v-model="state.nameEnglish"
            type="text"
            required
            placeholder="名前(english)"
            class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
          )
      // password    
      div
        label(for="password").block.text-sm.font-medium.text-gray-700 パスワード
        input#password.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300.mb-7(
          v-model="state.password"
          type="password"
          required
          placeholder="パスワード"
          class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
        )
      // password confirm  
      div 
        label(for="passwordConfirm").block.text-sm.font-medium.text-gray-700 パスワード(確認用)
        input#passwordConfirm.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300.mb-7(
          v-model="state.passwordConfirm"
          type="password"
          required
          placeholder="パスワード(確認用)"
          class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
        )
      // Unit & product
      .flex.gap-4.mb-7
        div.flex-1
          label(for="unit").block.text-sm.font-medium.text-gray-700 所属部署
          select#unit.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300.text-sm.text-gray-500(
            v-model="state.unit"
            required
            class="focus:ring-2 focus:ring-blue-500 focus:outline-none" 
          )
            option(value="" disabled) 部署
            option(value="CI") CI
            option(value="PD") PD
            option(value="HR") HR
            option(value="IS") IS
            option(value="CM") CM
            option(value="ITG") ITG
        div.flex-1
          label(for="product").block.text-sm.font-medium.text-gray-700 開発プロダクト
          select#product.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300.text-sm.text-gray-500(
            v-model="state.product"
            required
            class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
          )
            option(value="" disabled) プロダクト
            option(value="b-dash") b→dash
            option(value="Kpiee") Kpiee
            option(value="other") その他
      // botton
      button.w-full.text-white.py-2.px-4.rounded-lg.shadow-md.transition-transform.transform.mb-5.bg-blue-600(
        type="submit"
        class="hover:bg-blue-700 hover:scale-105"
        @click="handleSignup"
      )
        | サインアップ
      div.flex.items-center.justify-between.gap-2.mb-5
        p.text-center.text-gray-500.text-sm アカウントがすでにございますか？
        p.text-center.text-gray-500.cursor-pointer.text-sm.bg-gray-300.px-3.py-2.rounded-2xl(
          class="hover:scale-105"
          @click="handleLogin"
        )
          | ログイン画面に戻る
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';

interface SignupState {
  email: string;
  nameKana: string;
  nameEnglish: string;
  password: string;
  passwordConfirm: string;
  unit: string;
  product: string;
}

export default defineComponent({
  name: 'SignupPage',
  setup() {
    // SignupState
    const state = reactive<SignupState>({
      email: '',
      nameKana: '',
      nameEnglish: '',
      password: '',
      passwordConfirm: '',
      unit: '',
      product: '',
    });
    // router
    const router = useRouter();

    function handleLogin(): void {
      router.push('/');
    }

    function handleSignup(): void {
      // ミドルtodo
      // バックエンドとの通信コードサインアップに成功したらホームページに履行
      router.push('/');
    }

    return {
      state,
      handleSignup,
      handleLogin,
    };
  },
});
</script>
