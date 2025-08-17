<template lang="pug">
div.min-h-screen.flex.items-center.justify-center.bg-gradient-to-br.from-blue-50.to-blue-100.p-4
  .bg-white.shadow-xl.rounded-2xl.p-8.w-full.max-w-md.transition-all.duration-300
    h2.text-3xl.font-bold.text-center.text-gray-800.mb-6 サインアップ
    
    // Multi-step form
    Step1(
      v-if="currentStep === 1"
      :initial-data="formData"
      @next-step="nextStep"
      @update-data="updateFormData"
    )
    
    Step2(
      v-if="currentStep === 2"
      :initial-data="formData"
      @next-step="nextStep"
      @prev-step="prevStep"
      @update-data="updateFormData"
    )
    
    Step3(
      v-if="currentStep === 3"
      :initial-data="formData"
      @prev-step="prevStep"
      @complete-signup="completeSignup"
      @update-data="updateFormData"
    )
    
    Completion(
      v-if="currentStep === 4"
    )
    
    // Back to login link (only show in first step)
    div.flex.items-center.justify-center.gap-2.mt-5(v-if="currentStep === 1")
      p.text-center.text-gray-500.text-sm アカウントがすでにございますか？
      p.text-center.text-white.cursor-pointer.text-sm.bg-blue-600.px-3.py-2.rounded-2xl(
        class="hover:bg-blue-700 hover:scale-105"
        @click="handleLogin"
      )
        | ログイン画面に戻る
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Step1 from './step/Step1.vue';
import Step2 from './step/Step2.vue';
import Step3 from './step/Step3.vue';
import Completion from './step/Completion.vue';

interface SignupFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  nameKana: string;
  nameEnglish: string;
  name: string;
  unit: string;
  product: string;
}

export default defineComponent({
  name: 'SignupPage',
  components: {
    Step1,
    Step2,
    Step3,
    Completion,
  },
  setup() {
    const currentStep = ref(1);
    const router = useRouter();

    const formData = reactive<SignupFormData>({
      email: '',
      password: '',
      passwordConfirm: '',
      nameKana: '',
      nameEnglish: '',
      name: '',
      unit: '',
      product: '',
    });

    const nextStep = () => {
      if (currentStep.value < 4) {
        currentStep.value++;
      }
    };

    const prevStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--;
      }
    };

    const updateFormData = (data: Partial<SignupFormData>) => {
      Object.assign(formData, data);
    };

    const completeSignup = () => {
      // ミドルtodo
      // バックエンドとの通信コードサインアップに成功したら完了画面に移動
      currentStep.value = 4;
    };

    const handleLogin = () => {
      router.push('/');
    };

    return {
      currentStep,
      formData,
      nextStep,
      prevStep,
      updateFormData,
      completeSignup,
      handleLogin,
    };
  },
});
</script>
