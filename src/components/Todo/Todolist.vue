<script setup lang="ts">
import { ref } from 'vue';
import TodoItem from './TodoItem.vue'

const items = ref(null);
fetch('http://localhost:3000/item')
    .then(response => response.json())
    .then(data => items.value = data)
    .catch(error => void 0);
</script>

<template>
    <div v-if="items">
        <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex items-center justify-between mb-4">
                <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Latest Tasks</h5>
            </div>
            <div class="flow-root">
                <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
                    <TodoItem 
                        v-for="item in items" 
                        :key="item.id" 
                        :id="item.id" 
                        :name="item.name" 
                        :assignedTo="item.assignedTo"
                        :recurrent="item.recurrent"
                        :done="item.done"
                        :status="item.status"
                        :created="item.created"
                        :updated="item.updated">
                    </TodoItem>
                </ul>
            </div>
        </div>
    </div>
    <div v-if="!items" class="text-center">
        <div class="spinner-border spinner-border-sm"></div>
    </div>
</template>