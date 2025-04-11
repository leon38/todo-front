<script setup lang="ts">
import ItemService from '@/services/item.service';
import { onBeforeMount, ref } from 'vue';

const emit = defineEmits(['filter'])
const itemService = new ItemService();
const statuses = ref([] as string[]);

onBeforeMount(async () => {
    itemService.getStatuses().then(response => {
        statuses.value = response; 
    });
});
</script>
<template>
    <div class="grid gap-4 justify-items-start" :class="`grid-cols-${statuses.length + 1}`">
        <span v-for="status in statuses" class="justify-self-center"><a @click="emit('filter', status)">{{ status.charAt(0).toUpperCase() + status.slice(1) }}</a></span>
        <img class="justify-self-end" src="../../assets/filters.svg" />
    </div>
</template>