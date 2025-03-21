<script setup lang="ts">
interface User {
    id: number
    name: string
    picture: string
}

const props = defineProps<{
    id: number,
    name: string,
    recurrent: boolean,
    assignedTo?: User,
    done: boolean,
    status: string,
    created: string,
    updated: string
}>()

const updateTask = (id: number, done: boolean) => {
    fetch('http://localhost:3000/item/' + id, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify( { done: !done, updated: new Date() } )
    })
    .catch(error => void 0);
}
</script>

<template>
    <li class="task py-3 sm:py-4 relative">
        <div class="glowing absolute top-0 left-1/4 transform origin-[-50%, -50%] w-1/2 h-1/3 opacity-0 -z-0 rounded-full bg-linear-to-tr from-[#00dc82] via-[#36e4da] to-[#0047e1] hover:opacity-6 blur-3xl"></div>
        <div class="flex items-center">
            <div class="shrink-0">
                <input type="checkbox" :name="done" v-model="props.done" @change="updateTask(props.id, props.done)" />
            </div>
            <div class="flex-1 min-w-0 ms-4">
                <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {{ props.name }}
                </p>
                <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                    Mis à jour le {{ (new Date(props.updated)).toLocaleString("fr-FR") }}
                </p>
            </div>
            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                <img class="w-8 h-8 rounded-full" :src="'http://localhost:3000' + props.assignedTo.picture" alt="props.assignedTo.name">
            </div>
        </div>
    </li>
</template>