<template>
  <div class="container mx-auto">
    <form @submit.prevent="onSubmit">
      <label class="form-control">
        <div class="label"><span class="label-text">New Todo</span></div>
        <input v-model="todoText" type="text" class="input input-bordered" />
        <button type="submit" class="btn btn-primary btn-sm">Create</button>
      </label>
    </form>
    <hr class="my-4" />
    <ul>
      <div v-for="todo in data.todos" :key="todo.id" class="w-52 text-center">
        <label class="label cursor-pointer">
          <input
            type="checkbox"
            class="checkbox"
            :checked="todo.complete"
            @change="
              onUpdateTodoComplete({ id: todo.id, complete: !todo.complete })
            "
          />
          <span class="label-text">{{ todo.text }}</span>
        </label>
      </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useData } from "vike-vue/useData";
import { Data } from "./+data";
import { onCreateTodo, onUpdateTodoComplete } from "./Page.telefunc";

const data = useData<Data>();
const todoText = ref("");
async function onSubmit() {
  const todos = await onCreateTodo({ text: todoText.value });
  data.todos = todos;
}
</script>

<style scoped></style>
