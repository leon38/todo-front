<script setup lang="ts">
import type Item from '@/models/Item'
import type User from '@/models/User'
import { ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const users = ref([] as User[])
fetch('http://localhost:5173/user')
  .then((response) => response.json())
  .then((data) => (users.value = data))
  .catch((_) => void 0)

declare type SubmitHandler = () => void

const props = defineProps<{
  modalId: string
  modalTitle: string
  submitMethod: SubmitHandler
  item: Item | undefined
}>()

const submitForm = (callback: SubmitHandler) => {
  callback()
}

const priorities = ref([
  { title: 'modaltodo.form.priorities.infinite', value: 10000 },
  { title: 'modaltodo.form.priorities.very_urgent', value: 5 },
  { title: 'modaltodo.form.priorities.urgent', value: 4 },
  { title: 'modaltodo.form.priorities.normal', value: 3 },
  { title: 'modaltodo.form.priorities.on_the_occasion', value: 2 },
  { title: 'modaltodo.form.priorities.regular', value: 1 },
])

const recurrences = ref([
  { title: 'modaltodo.form.recurrences.day', value: 1 },
  { title: 'modaltodo.form.recurrences.week', value: 7 },
  { title: 'modaltodo.form.recurrences.month', value: 30 },
  { title: 'modaltodo.form.recurrences.year', value: 365 },
])

const itemToUpdate = toRef(props, "item")
console.log(itemToUpdate.value, props.item)
</script>
<template>
  <div
    :id="props.modalId"
    tabindex="-1"
    aria-hidden="false"
    class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div v-if="itemToUpdate !== undefined" class="relative w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
        <!-- Modal header -->
        <div
          class="flex items-start justify-between p-5 border-b border-gray-200 rounded-t dark:border-gray-600"
        >
          <h3 class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-gray-200">
            {{ t(props.modalTitle) }}
          </h3>
          <button
            id="closeButton"
            type="button"
            :data-modal-toggle="props.modalId"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <form @submit.prevent="submitForm(props.submitMethod)">
          <!-- Modal body -->
          <div class="p-6 space-y-6">
            <div class="mb-5">
              <label for="name" class="label">{{ t('modaltodo.form.title') }}</label>
              <input
                type="text"
                v-model="itemToUpdate.name"
                id="name"
                name="name"
                autocomplete="task"
              />
            </div>
            <div class="mb-5">
              <label for="priority" class="label">{{ t('modaltodo.form.priority') }}</label>
              <select v-model="itemToUpdate.priority" id="priority" name="priority">
                <option v-for="option in priorities" :key="option.value" :value="option.value">
                  {{ t(option.title) }}
                </option>
              </select>
            </div>

            <label class="inline-flex mb-5 cursor-pointer">
              <input
                type="checkbox"
                v-model="itemToUpdate.recurrent"
                value=""
                class="sr-only peer"
              />
              <div
                class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-700 rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500 dark:peer-checked:bg-emerald-500"
              ></div>
              <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{
                t('modaltodo.form.recurrent')
              }}</span>
            </label>
            <div class="mb-5" v-if="itemToUpdate.recurrent">
              <label for="recurrenceFrequency" class="label">{{
                t('modaltodo.form.recurrenceFrequency')
              }}</label>
              <select v-model="itemToUpdate.recurrenceFrequency" id="recurrenceFrequency">
                <option
                  v-for="recurrence in recurrences"
                  :value="recurrence.value"
                  :key="recurrence.value"
                >
                  {{ t(recurrence.title) }}
                </option>
              </select>
            </div>

            <div class="mb-5" v-if="!itemToUpdate.recurrent">
              <label for="dueDate" class="label">{{ t('modaltodo.form.dueDate') }}</label>
              <input type="date" id="dueDate" v-model="itemToUpdate.dueDate" />
            </div>

            <div class="mb-5">
              <label for="assignedTo" class="label">{{ t('modaltodo.form.assignedTo') }}</label>
              <select v-model="itemToUpdate.assignedTo" id="assignedTo">
                <option value=""></option>
                <option v-for="user in users" :value="user" :key="user.id">
                  {{ user.name }}
                </option>
              </select>
            </div>
          </div>
          <!-- Modal footer -->
          <div
            class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
          >
            <button
              :data-modal-hide="props.modalId"
              type="submit"
              class="text-white bg-emerald-500 hover:bg-emrald-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-500 dark:hover:bg-emrald-600 dark:focus:ring-emerald-700"
            >
              {{ t('modaltodo.form.submit_label') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
