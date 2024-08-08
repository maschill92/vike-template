<template>
  <div class="container mx-auto">
    <h1 class="font-bold text-3xl pb-4">My Vike app</h1>
    <pre>{{ { user: pageContext.user } }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { usePageContext } from "vike-vue/usePageContext";

const pageContext = usePageContext();
</script>
