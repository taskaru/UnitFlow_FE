<template lang="pug">
div
  // Progress Bar
  .mb-8
    .flex.items-center.justify-between.mb-2
      .text-sm.font-medium.text-gray-700 Step 1 of 3
      .text-sm.text-gray-500 33%
    .w-full.bg-gray-200.rounded-full.h-2
      .bg-blue-600.h-2.rounded-full(style="width: 33%")
  
  // Step 1 Form
  div
    h3.text-xl.font-semibold.text-gray-800.mb-6 アカウント情報
    // Email
    div.mb-4
      label(for="email").block.text-sm.font-medium.text-gray-700 メール
      input#email.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300(
        v-model="formData.email"
        type="email"
        required
        placeholder="you@example.com"
        class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
        @input="validateEmail"
      )
      .text-red-500.text-xs.mt-1(v-if="errors.email") {{ errors.email }}
    
    // Password
    div.mb-4
      label(for="password").block.text-sm.font-medium.text-gray-700 パスワード
      input#password.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300(
        v-model="formData.password"
        type="password"
        required
        placeholder="パスワード"
        class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
        @input="validatePassword"
      )
      .text-red-500.text-xs.mt-1(v-if="errors.password") {{ errors.password }}
    
    // Password Confirm
    div.mb-6
      label(for="passwordConfirm").block.text-sm.font-medium.text-gray-700 パスワード(確認用)
      input#passwordConfirm.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300(
        v-model="formData.passwordConfirm"
        type="password"
        required
        placeholder="パスワード(確認用)"
        class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
        @input="validatePasswordConfirm"
      )
      .text-red-500.text-xs.mt-1(v-if="errors.passwordConfirm") {{ errors.passwordConfirm }}
    
    // Next Button
    button.w-full.text-white.py-2.px-4.rounded-lg.shadow-md.transition-transform.transform.bg-blue-600(
      type="button"
      class="hover:bg-blue-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="nextStep"
      :disabled="!isStepValid"
    )
      | 次へ
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';

interface Step1Data {
  email: string;
  password: string;
  passwordConfirm: string;
}

interface Step1Errors {
  email: string;
  password: string;
  passwordConfirm: string;
}

export default defineComponent({
  name: 'Step1Component',
  props: {
    initialData: {
      type: Object as () => Step1Data,
      default: () => ({
        email: '',
        password: '',
        passwordConfirm: '',
      }),
    },
  },
  emits: ['next-step', 'update-data'],
  setup(props, { emit }) {
    const formData = reactive<Step1Data>({
      email: props.initialData.email,
      password: props.initialData.password,
      passwordConfirm: props.initialData.passwordConfirm,
    });

    const errors = reactive<Step1Errors>({
      email: '',
      password: '',
      passwordConfirm: '',
    });

    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) {
        errors.email = 'メールアドレスを入力してください';
      } else if (!emailRegex.test(formData.email)) {
        errors.email = '有効なメールアドレスを入力してください';
      } else {
        errors.email = '';
      }
    };

    const validatePassword = () => {
      if (!formData.password) {
        errors.password = 'パスワードを入力してください';
      } else if (formData.password.length < 6) {
        errors.password = 'パスワードは6文字以上で入力してください';
      } else {
        errors.password = '';
      }
      validatePasswordConfirm();
    };

    const validatePasswordConfirm = () => {
      if (!formData.passwordConfirm) {
        errors.passwordConfirm = 'パスワード確認を入力してください';
      } else if (formData.password !== formData.passwordConfirm) {
        errors.passwordConfirm = 'パスワードが一致しません';
      } else {
        errors.passwordConfirm = '';
      }
    };

    const isStepValid = computed(() => {
      return (
        formData.email &&
        formData.password &&
        formData.passwordConfirm &&
        formData.password === formData.passwordConfirm &&
        !errors.email &&
        !errors.password &&
        !errors.passwordConfirm
      );
    });

    const nextStep = () => {
      if (isStepValid.value) {
        emit('update-data', formData);
        emit('next-step');
      }
    };

    return {
      formData,
      errors,
      isStepValid,
      validateEmail,
      validatePassword,
      validatePasswordConfirm,
      nextStep,
    };
  },
});
</script>
