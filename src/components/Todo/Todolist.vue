<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import TodoItem from './TodoItem.vue'
import AddTask from './AddTask.vue'
import type Item from '@/models/Item'
import {
  initFlowbite,
  Modal,
  type InstanceOptions,
  type ModalInterface,
  type ModalOptions,
} from 'flowbite'
import ModalTodo from './ModalTodo.vue'
import { useI18n } from 'vue-i18n'

let modal: ModalInterface
const items = ref([] as Item[])
let currentItem = ref<Item>()

const { t } = useI18n() 

onBeforeMount(async () => {
  getItems()
  initFlowbite()
})

const getItems = () => {
  fetch('http://192.168.1.64:3000/item?status=active')
    .then((response) => response.json())
    .then((data) => {
      items.value = data
      currentItem.value = data[0] as Item
    })
    .catch((error) => void 0)
}

const openModal = (item: Item) => {
  currentItem.value = item
  const $modalElement: HTMLElement | null = document.querySelector('#modal-item')

  const modalOptions: ModalOptions = {
    backdrop: 'dynamic',
    backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
    closable: true,
  }

  // instance options object
  const instanceOptions: InstanceOptions = {
    id: 'modal-item',
    override: true,
  }

  modal = new Modal($modalElement, modalOptions, instanceOptions)
  modal.show()
}

const editTask = () => {
  fetch('http://192.168.1.64:3000/item/' + currentItem.value.id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(currentItem.value),
  }).catch((error) => void 0)

  modal.hide()
}

const sortItems = () => {
  setTimeout(() => {
    items.value.sort((a: Item, b: Item) => Number(a.recurrent) - Number(b.recurrent))
    items.value.sort((a: Item, b: Item) =>
      a.priority === b.priority ? 0 : a.priority > b.priority ? -1 : 1,
    )
    items.value.sort((a: Item, b: Item) => Number(a.done) - Number(b.done))
  }, 500)
}
</script>

<template>
  <div v-if="items">
    <div
      class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="flex items-center justify-between mb-8">
        <h5 class="text-xl font-bold leading-none">{{ t('todolist.latest_tasks') }}</h5>
      </div>
      <div class="flow-root">
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
          <TodoItem
            v-for="item in items"
            :key="item.id"
            :item="item"
            :open-method="openModal"
            @update="sortItems"
          >
          </TodoItem>
        </ul>
        <ModalTodo
          :modal-title="'modaltodo.title.edit_task'"
          :modal-id="'modal-item'"
          v-model:item="currentItem"
          :submit-method="editTask"
        ></ModalTodo>
      </div>
    </div>
    <AddTask />
  </div>
  <div v-if="!items" class="text-center">
    <div class="spinner-border spinner-border-sm"></div>
  </div>
</template>
