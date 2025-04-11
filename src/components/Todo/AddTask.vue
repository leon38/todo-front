<script setup lang="ts">
import { initFlowbite, Modal, type InstanceOptions, type ModalOptions } from 'flowbite'
import { onBeforeMount } from 'vue'

onBeforeMount(async () => {
  initFlowbite()
})
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
</template>
