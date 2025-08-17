<template lang="pug">
div
  // Progress Bar
  .mb-8
    .flex.items-center.justify-between.mb-2
      .text-sm.font-medium.text-gray-700 Step 2 of 3
      .text-sm.text-gray-500 66%
    .w-full.bg-gray-200.rounded-full.h-2
      .bg-blue-600.h-2.rounded-full(style="width: 66%")
  
  // Step 2 Form
  div
    h3.text-xl.font-semibold.text-gray-800.mb-6 個人情報
    // Name (Kanji/Katakana)
    div.mb-4
      label(for="nameKana").block.text-sm.font-medium.text-gray-700 名前(漢字/カタカナ)
      input#nameKana.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300(
        v-model="formData.nameKana"
        type="text"
        required
        placeholder="名前(漢字/カタカナ)"
        class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
        @input="validateNameKana"
      )
      .text-red-500.text-xs.mt-1(v-if="errors.nameKana") {{ errors.nameKana }}
    
    // Name (English)
    div.mb-4
      label(for="nameEnglish").block.text-sm.font-medium.text-gray-700 名前(English)
      input#nameEnglish.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300(
        v-model="formData.nameEnglish"
        type="text"
        required
        placeholder="名前(English)"
        class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
        @input="validateNameEnglish"
      )
      .text-red-500.text-xs.mt-1(v-if="errors.nameEnglish") {{ errors.nameEnglish }}
    
    // Display Name
    div.mb-6
      label(for="name").block.text-sm.font-medium.text-gray-700 表示名
      input#name.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300(
        v-model="formData.name"
        type="text"
        required
        placeholder="表示名"
        class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
        @input="validateName"
      )
      .text-red-500.text-xs.mt-1(v-if="errors.name") {{ errors.name }}
    
    // Navigation Buttons
    .flex.gap-4
      button(
        type="button"
        @click="prevStep"
        class="w-1/2 text-gray-700 py-2 px-4 rounded-lg shadow-md transition-transform transform bg-gray-200 hover:bg-gray-300 hover:scale-105"
      )
        | 戻る
      button(
        type="button"
        class=" w-1/2 text-white py-2 px-4 rounded-lg shadow-md transition-transform transform bg-blue-600 hover:bg-blue-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="nextStep"
        :disabled="!isStepValid"
      )
        | 次へ
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';

interface Step2Data {
  nameKana: string;
  nameEnglish: string;
  name: string;
}

interface Step2Errors {
  nameKana: string;
  nameEnglish: string;
  name: string;
}

export default defineComponent({
  name: 'Step2Component',
  props: {
    initialData: {
      type: Object as () => Step2Data,
      default: () => ({
        nameKana: '',
        nameEnglish: '',
        name: '',
      }),
    },
  },
  emits: ['next-step', 'prev-step', 'update-data'],
  setup(props, { emit }) {
    const formData = reactive<Step2Data>({
      nameKana: props.initialData.nameKana,
      nameEnglish: props.initialData.nameEnglish,
      name: props.initialData.name,
    });

    const errors = reactive<Step2Errors>({
      nameKana: '',
      nameEnglish: '',
      name: '',
    });

    const validateNameKana = () => {
      if (!formData.nameKana) {
        errors.nameKana = '名前(漢字/カタカナ)を入力してください';
      } else if (formData.nameKana.length < 2) {
        errors.nameKana = '名前は2文字以上で入力してください';
      } else {
        errors.nameKana = '';
      }
    };

    const validateNameEnglish = () => {
      if (!formData.nameEnglish) {
        errors.nameEnglish = '名前(English)を入力してください';
      } else if (formData.nameEnglish.length < 2) {
        errors.nameEnglish = '名前は2文字以上で入力してください';
      } else {
        errors.nameEnglish = '';
      }
    };

    const validateName = () => {
      if (!formData.name) {
        errors.name = '表示名を入力してください';
      } else if (formData.name.length < 2) {
        errors.name = '表示名は2文字以上で入力してください';
      } else {
        errors.name = '';
      }
    };

    const isStepValid = computed(() => {
      return (
        formData.nameKana &&
        formData.nameEnglish &&
        formData.name &&
        !errors.nameKana &&
        !errors.nameEnglish &&
        !errors.name
      );
    });

    const nextStep = () => {
      if (isStepValid.value) {
        emit('update-data', formData);
        emit('next-step');
      }
    };

    const prevStep = () => {
      emit('update-data', formData);
      emit('prev-step');
    };

    return {
      formData,
      errors,
      isStepValid,
      validateNameKana,
      validateNameEnglish,
      validateName,
      nextStep,
      prevStep,
    };
  },
});
</script>
