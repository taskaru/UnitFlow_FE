<template lang="pug">
div.h-screen.flex.bg-black.p-4
  SidebarComponent
  // 右コンテンツバー
  .wrapper.dark.flex.flex-col(
    class="w-[87vw]"
  )
    HeaderComponent(
      :title="state.title"
    )
    main.flex-1.overflow-y-auto(
      class="w-[83vw]"
    )
</template>

<script lang="ts">
import SidebarComponent from '../../components/SidebarComponent.vue';
import HeaderComponent from '../../components/HeaderComponent.vue';
import { defineComponent, reactive } from 'vue';

/* eslint-disable vue/multi-word-component-names */
export default defineComponent({
  name: 'WBSPage',

  components: {
    SidebarComponent,
    HeaderComponent,
  },

  setup() {
    const state = reactive({
      title: 'WBS',
    });

    return {
      state,
    };
  },
});
</script>
