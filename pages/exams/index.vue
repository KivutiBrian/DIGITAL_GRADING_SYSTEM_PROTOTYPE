<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-8">Examination Results</h1>

            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div v-for="exam in exams" :key="exam.id"
                    class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <NuxtLink :to="`/exams/${exam.id}`" class="block p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h2 class="text-xl font-semibold text-gray-900">{{ exam.examCode }}</h2>
                                <p class="text-gray-600 mt-1">{{ exam.description }}</p>
                            </div>
                            <span class="text-sm text-gray-500">
                                {{ new Date(exam.createdAt).toLocaleDateString() }}
                            </span>
                        </div>

                        <div class="mt-4 flex items-center text-sm text-gray-500">
                            <span
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                View Results
                            </span>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { data: exams } = await useFetch('/api/exams')
</script>