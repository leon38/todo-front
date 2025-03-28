<script setup lang="ts">
import type Item from '@/models/Item'
const emit = defineEmits(['update'])

declare type OpenHandler = (item: Item) => void

const props = defineProps<{
  item: Item
  openMethod: OpenHandler
}>()

const openModal = (callback: OpenHandler, item: Item) => {
  callback(item)
}

const taskIsDone = (id: number, done: boolean) => {
  fetch('http://192.168.1.64:3000/item/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ done: done, updated: new Date() }),
  }).catch((error) => void 0)
  emit('update')
}
</script>

<template>
  <li class="task py-3 sm:py-4 relative">
    <div
      class="glowing absolute top-0 left-1/4 transform origin-[-50%, -50%] w-1/2 h-1/3 opacity-0 -z-0 rounded-full bg-linear-to-tr from-[#00dc82] via-[#36e4da] to-[#0047e1] hover:opacity-6 blur-3xl"
    ></div>
    <div class="flex items-center">
      <div class="shrink-0">
        <input
          type="checkbox"
          name="done"
          v-model="props.item.done"
          @change="taskIsDone(props.item.id, props.item.done)"
        />
      </div>
      <div class="flex-1 min-w-0 ms-4" @click="openModal(props.openMethod, props.item)">
        <p class="text-sm font-medium">
          {{ props.item.name }}
        </p>
        <p class="text-xs text-gray-500 truncate dark:text-gray-300">
          Mis à jour le {{ new Date(props.item.updated).toLocaleDateString('fr-FR') }}
        </p>
      </div>
      <div class="inline-flex items-center text-base font-semibold">
        <img
          class="w-8 h-8 rounded-full p-1 dark:bg-gray-700"
          :src="'http://192.168.1.64:3000' + props.item.assignedTo.picture"
          alt="props.item.assignedTo.name"
        />
      </div>
    </div>
  </li>
</template>
