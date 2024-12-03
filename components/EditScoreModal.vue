<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" class="relative z-10" @close="closeModal">
            <TransitionChild enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild enter="ease-out duration-300" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                Edit Student Scores
                            </DialogTitle>

                            <form @submit.prevent="handleSubmit" class="mt-4">
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">English</label>
                                        <input type="number" v-model="scores.english" min="0" max="100"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Mathematics</label>
                                        <input type="number" v-model="scores.mathematics" min="0" max="100"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Science</label>
                                        <input type="number" v-model="scores.science" min="0" max="100"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">CRE</label>
                                        <input type="number" v-model="scores.cre" min="0" max="100"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Social Study</label>
                                        <input type="number" v-model="scores.socialStudy" min="0" max="100"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                    </div>
                                </div>

                                <div class="mt-6 flex justify-end space-x-3">
                                    <button type="button"
                                        class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        @click="closeModal">
                                        Cancel
                                    </button>
                                    <button type="submit" :disabled="isLoading"
                                        class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                        {{ isLoading ? 'Saving...' : 'Save Changes' }}
                                    </button>
                                </div>
                            </form>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

const props = defineProps({
    isOpen: Boolean,
    resultId: Number,
    initialScores: Object
})

const emit = defineEmits(['close', 'update'])

const isLoading = ref(false)
const scores = ref({
    english: 0,
    mathematics: 0,
    science: 0,
    cre: 0,
    socialStudy: 0
})

// Initialize scores when modal opens
watch(() => props.initialScores, (newScores) => {
    if (newScores) {
        scores.value = { ...newScores }
    }
}, { immediate: true })

const closeModal = () => {
    emit('close')
}

const handleSubmit = async () => {
    isLoading.value = true
    try {
        const response = await $fetch(`/api/results/${props.resultId}`, {
            method: 'PATCH',
            body: scores.value
        })
        emit('update', response)
        closeModal()
    } catch (error) {
        alert(error.message || 'Error updating scores')
    } finally {
        isLoading.value = false
    }
}
</script>