<script setup lang="ts">
import Todolist from '../components/Todo/Todolist.vue'
import DarkModeSwitcher from '../components/DarkModeSwitcher.vue'
</script>

<template>
  <div class="float-right">
    <DarkModeSwitcher></DarkModeSwitcher>
  </div>
  <div class="clear-both"></div>
  <main>
    <Todolist></Todolist>
  </main>
</template>
