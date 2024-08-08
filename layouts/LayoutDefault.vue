<template>
  <div>
    <div class="navbar bg-base-200 shadow">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl" href="/">
          <img :src="icon" class="aspect-square max-w-12" />
          Home
        </a>
      </div>
      <div class="flex-none">
        <a v-if="user" class="btn btn-ghost" href="/todos">Todos</a>
        <a class="btn btn-ghost" href="/login">Login</a>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { usePageContext } from "vike-vue/usePageContext";
import icon from "../assets/icon.svg";
const { user } = usePageContext();
</script>

<style>
@import "./tailwind.css";
</style>
