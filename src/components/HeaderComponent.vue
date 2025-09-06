<template lang="pug">
header.h-10.flex.items-center.justify-between.my-2(
  class="w-[83vw]"
)
  .text-2xl.font-semibold.text-neutral-500 {{ title }}
  .wrapper.dark
    input(
      class="bg-[#1a1a1a] placeholder-[#a6a6a6] focus:outline-none"
      placeholder="Search…"
    )
    img(
      src="https://img.icons8.com/?size=100&id=WwWusvLMTFd7&format=png&color=000000"
      class="w-5 h-5 object-contain ml-2 cursor-pointer"
    )
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HeaderComponent',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {},
});
</script>
