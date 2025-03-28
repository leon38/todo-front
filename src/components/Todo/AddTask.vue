<script setup lang="ts">
import type Item from '@/models/Item'
import ModalTodo from './ModalTodo.vue'
import { Modal, type InstanceOptions, type ModalOptions } from 'flowbite'

// initialize components based on data attribute selectors
const item = <Item>{}

const $modalElement: HTMLElement | null = document.querySelector('#modal')

const modalOptions: ModalOptions = {
  backdrop: 'dynamic',
  backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
  closable: true,
}

// instance options object
const instanceOptions: InstanceOptions = {
  id: 'modal',
  override: true,
}

const modal = new Modal($modalElement, modalOptions, instanceOptions)

const submitTask = () => {
  item.done = false
  fetch('http://192.168.1.64:3000/item', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(item),
  })

  modal.hide()
}
</script>
<template>
  <div class="flex justify-center">
    <button
      type="button"
      data-modal-target="modal"
      data-modal-toggle="modal"
      class="duration-300 ease-in-out bg-emerald-500 text-white text-sm px-3 py-1.5 rounded-full -mt-4 hover:bg-emerald-600 focus:bg-emerald-700 hover:px-4 hover:py-2.5"
    >
      +
    </button>
  </div>
  <ModalTodo
    :modal-id="'modal'"
    :modal-title="'modaltodo.title.add_task'"
    :item="item"
    :submit-method="submitTask"
  ></ModalTodo>
</template>
