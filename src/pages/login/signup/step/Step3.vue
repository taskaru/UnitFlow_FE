<template lang="pug">
div
  // Progress Bar
  .mb-8
    .flex.items-center.justify-between.mb-2
      .text-sm.font-medium.text-gray-700 Step 3 of 3
      .text-sm.text-gray-500 100%
    .w-full.bg-gray-200.rounded-full.h-2
      .bg-blue-600.h-2.rounded-full(style="width: 100%")
  
  // Step 3 Form
  div
    h3.text-xl.font-semibold.text-gray-800.mb-6 所属情報
    // Unit Selection
    div.mb-4
      label(for="unit").block.text-sm.font-medium.text-gray-700 所属部署
      select#unit.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300.text-sm.text-gray-500(
        v-model="formData.unit"
        required
        class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
        @change="validateUnit"
      )
        option(value="" disabled) 部署
        option(value="CI") CI
        option(value="PDM") PDM
        option(value="実装") 実装
        option(value="HR") HR
        option(value="IS") IS
        option(value="CM") CM
        option(value="ITG") ITG
      .text-red-500.text-xs.mt-1(v-if="errors.unit") {{ errors.unit }}
    
    // Product Selection
    div.mb-6
      label(for="product").block.text-sm.font-medium.text-gray-700 開発プロダクト
      select#product.w-full.mt-1.px-4.py-2.rounded-lg.border.border-gray-300.text-sm.text-gray-500(
        v-model="formData.product"
        required
        class="focus:ring-2 focus:ring-blue-500 focus:outline-none"
        @change="validateProduct"
      )
        option(value="" disabled) プロダクト
        option(value="b-dash") b→dash
        option(value="Kpiee") Kpiee
        option(value="other") その他
      .text-red-500.text-xs.mt-1(v-if="errors.product") {{ errors.product }}
    
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
        @click="completeSignup"
        :disabled="!isStepValid"
      )
        | 完了
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';

interface Step3Data {
  unit: string;
  product: string;
}

interface Step3Errors {
  unit: string;
  product: string;
}

export default defineComponent({
  name: 'Step3Component',
  props: {
    initialData: {
      type: Object as () => Step3Data,
      default: () => ({
        unit: '',
        product: '',
      }),
    },
  },
  emits: ['prev-step', 'complete-signup', 'next-step', 'update-data'],
  setup(props, { emit }) {
    const formData = reactive<Step3Data>({
      unit: props.initialData.unit,
      product: props.initialData.product,
    });

    const errors = reactive<Step3Errors>({
      unit: '',
      product: '',
    });

    const validateUnit = () => {
      if (!formData.unit) {
        errors.unit = '部署を選択してください';
      } else {
        errors.unit = '';
      }
    };

    const validateProduct = () => {
      if (!formData.product) {
        errors.product = 'プロダクトを選択してください';
      } else {
        errors.product = '';
      }
    };

    const isStepValid = computed(() => {
      validateUnit();
      validateProduct();

      return (
        formData.unit && formData.product && !errors.unit && !errors.product
      );
    });

    const completeSignup = () => {
      if (isStepValid.value) {
        emit('update-data', formData);
        emit('complete-signup');
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
      validateUnit,
      validateProduct,
      completeSignup,
      prevStep,
    };
  },
});
</script>
