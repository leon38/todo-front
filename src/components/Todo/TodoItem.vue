<script setup lang="ts">
import type Item from '@/models/Item'
import ItemService from '@/services/item.service';
import { useSwipe, type UseSwipeDirection } from '@vueuse/core';
import { computed, ref, shallowRef } from 'vue';
const emit = defineEmits(['update', 'updateStatusItem', 'delete'])

const itemService = new ItemService();
declare type OpenHandler = (item: Item) => void

const props = defineProps<{
  item: Item
  openMethod: OpenHandler
}>()

const recurrent = computed(() => {
  return props.item.recurrent ? '<img src="../../assets/delete.svg" />' : '';
})

const openModal = (callback: OpenHandler, item: Item) => {
  callback(item)
}

const taskIsDone = (id: number, done: boolean) => {
  props.item.updated = new Date().toLocaleDateString('fr-FR');
  itemService.taskIsDone(id, done);
  emit('update')
}

const updateStatusItem = (status: string) => {
  itemService.updateStatusItem(status, props.item.id);
  if (status === 'closed' && props.item.status === 'closed') {
    emit('delete', props.item.id);
    return ;
  }
  emit('updateStatusItem', props.item.id);
}

const target = shallowRef<HTMLElement | null>(null)
const container = shallowRef<HTMLElement | null>(null)
const containerWidth = computed(() => container.value?.offsetWidth)
const left = ref<string>('0')
const right = ref<string>('0')
const opacity = ref<number>(0)
const swipedLeft = ref<boolean>(false);
const swipedRight = ref<boolean>(false);
let length = 0;

const { direction, isSwiping, lengthX, lengthY } = useSwipe(
  target,
  {
    passive: false,
    onSwipe(e: TouchEvent) {
      if (containerWidth.value) {
        if (lengthX.value < 0) {
          length = Math.round(Math.abs(lengthX.value))
          left.value = length < 64 ? `${length}px` : '64px';
          opacity.value = length / 64
        }
        else {
          length = Math.round(Math.abs(lengthX.value))
          right.value = length > 64 ? `${length}px` : '64px';
          opacity.value = length / 64
        }
      }
    },
    onSwipeEnd(e: TouchEvent, direction: UseSwipeDirection) {
      if (direction === 'right') {
        swipedLeft.value = true;
        updateStatusItem('archived');
        
      } else if (direction === 'left') {
        swipedRight.value = true;
        updateStatusItem('closed');
      }
      if (lengthX.value <= -64) {
        right.value = '0';
        left.value = '64px'
        opacity.value = 1
      }
      else if (lengthX.value >= 64)  {
        left.value = '0'
        right.value = '64px'
        opacity.value = 1
      }
    },
  },
)
</script>

<template>
  <li class="task py-3 sm:py-4 relative" ref="container">
    <div
      class="glowing absolute top-0 left-1/4 transform origin-[-50%, -50%] w-1/2 h-1/3 opacity-0 -z-0 rounded-full bg-linear-to-tr from-[#00dc82] via-[#36e4da] to-[#0047e1] hover:opacity-6 blur-3xl"
    ></div>
    <div class="flex items-center " ref="target">
      <div class="h-12 bg-emerald-400 justify-items-center content-center mr-2" :class="{ hidden: !isSwiping && !swipedLeft }" :style="{ width: left, opacity }">
        <img src="../../assets/archive.svg" />
      </div>
      <div class="shrink-0">
        <input
          type="checkbox"
          name="done"
          v-model="props.item.done"
          @change="taskIsDone(props.item.id, props.item.done)"
        />
      </div>
      <div class="flex-1 min-w-0 ms-4" @click="openModal(props.openMethod, props.item)">
        <p class="text-sm font-medium" :class="{'text-dribbble': !props.item.recurrent}">
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
      <div class="h-12 bg-red-600 justify-items-center content-center ml-2" :class="{ hidden: !isSwiping && !swipedRight }" :style="{ width: right, opacity }">
        <img src="../../assets/delete.svg" />
      </div>
    </div>
  </li>
</template>
