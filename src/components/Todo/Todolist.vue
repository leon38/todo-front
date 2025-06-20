<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import TodoItem from './TodoItem.vue'
import AddTask from './AddTask.vue'
import type Item from '@/models/Item'
import {
  initFlowbite,
  type ModalInterface,
} from 'flowbite'
import ModalTodo from './ModalTodo.vue'
import { useI18n } from 'vue-i18n'
import ItemService from '@/services/item.service'
import Filters from './Filters.vue'
import ModalService from '@/services/modal.service'
import Alert from '../Alert/Alert.vue'

let modal: ModalInterface;
let alert: ModalInterface;
const itemService = new ItemService();
const modalService = new ModalService();
const items = ref([] as Item[])
const currentItem = ref<Item>()
let newItem = {} as Item;
const idToRemove = ref<number>(0);
const emit = defineEmits(['updateCurrentItem'])

const { t } = useI18n()

onBeforeMount(async () => {
  getItems()
  initFlowbite()
})

const getItems = (status: string = 'active') => {
  itemService.getItems(status).then(response => {
    items.value = response;
    currentItem.value = items.value[0]
  });
}

const openModal = (item: Item) => {
  currentItem.value = item;
  modal = modalService.getModalInstance('#modal-item');
  modal.show();
  emit('updateCurrentItem');
}

const openAlert = (id: number) => {
  alert = modalService.getModalInstance('#popup-modal');
  idToRemove.value = id;
  alert.show();
}

const editTask = () => {
  if (currentItem.value) {
    itemService.updateItem(currentItem.value).then(response => currentItem.value = response);
    modal.hide()
  }
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

const removeItemFromList = (id: number) => {
  setTimeout(() => {
    items.value = items.value.filter((item: Item) => item.id !== id);
  }, 500)
}

const submitTask = () => {
  newItem.recurrent = newItem.recurrent ?? false;
  newItem.done = false;
  newItem.updated = new Date().toLocaleDateString('fr-FR');
  itemService.saveItem(newItem).then(response => newItem = response);

  items.value.push(newItem);
  sortItems();
  const modalNewItem = modalService.getModalInstance('#modal');
  modalNewItem.hide()
  newItem = {} as Item;
}

const deleteItem = () => {
  console.log('idToRemove', idToRemove.value);
  itemService.deleteItem(idToRemove.value);
  removeItemFromList(idToRemove.value);
  alert.hide();
}
</script>

<template>
  <div v-if="items" class="px-4">
    <div
      class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="flex items-center justify-between mb-8">
        <h5 class="text-xl font-bold leading-none">{{ t('todolist.latest_tasks') }}</h5>
      </div>
      <div class="mb-4">
        <Filters @filter="(status) => getItems(status)"></Filters>
      </div>
      <div class="flow-root">
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
          <TodoItem
            v-for="item in items"
            :key="item.id"
            :item="item"
            :open-method="openModal"
            data-modal-target="modal-item"
            @update="sortItems"
            @updateStatusItem="removeItemFromList"
            @delete="(id) => openAlert(id)"
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
    <ModalTodo
      :modal-id="'modal'"
      :modal-title="'modaltodo.title.add_task'"
      :item="newItem"
      :submit-method="submitTask"
    ></ModalTodo>
  <Alert
    :popup-id="'modal-item'"
    title="This item will be definitively deleted! Are you sure?"
    validate-title="Yes, I'm sure"
    cancel-title="Oups! No"
    @validate="deleteItem()"
  >
  </Alert>
  </div>
  <div v-if="!items" class="text-center">
    <div class="spinner-border spinner-border-sm"></div>
  </div>
</template>
