<template lang="pug">
header.h-10.flex.items-center.justify-between.px-1.border-b.mb-4
  h1.text-base.font-semibold {{ title }}
  input.border.rounded.px-2.py-1(placeholder="Search…")
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';

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
