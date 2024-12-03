<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-2xl font-bold text-gray-900">Student Results</h2>
                </div>

                <div v-if="results.length" class="p-6">
                    <div v-for="result in results" :key="result.examId" class="mb-8">
                        <h3 class="text-xl font-semibold mb-4">{{ result.exam.examCode }}</h3>
                        <p class="text-gray-600 mb-4">{{ result.exam.description }}</p>

                        <div class="bg-gray-50 rounded-lg p-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <p class="text-sm text-gray-600">Student Name</p>
                                    <p class="font-medium">{{ result.studentName }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-600">School</p>
                                    <p class="font-medium">{{ result.schoolName }}</p>
                                </div>
                            </div>

                            <div class="mt-4">
                                <h4 class="text-lg font-medium mb-2">Subject Scores</h4>
                                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div class="bg-white p-3 rounded shadow">
                                        <p class="text-sm text-gray-600">English</p>
                                        <p class="text-lg font-semibold">{{ result.english }} <span class="text-sm">({{
                                            getGrade(result.english) }})</span></p>
                                    </div>
                                    <div class="bg-white p-3 rounded shadow">
                                        <p class="text-sm text-gray-600">Mathematics</p>
                                        <p class="text-lg font-semibold">{{ result.mathematics }} <span
                                                class="text-sm">({{ getGrade(result.mathematics) }})</span></p>
                                    </div>
                                    <div class="bg-white p-3 rounded shadow">
                                        <p class="text-sm text-gray-600">Science</p>
                                        <p class="text-lg font-semibold">{{ result.science }} <span class="text-sm">({{
                                            getGrade(result.science) }})</span></p>
                                    </div>
                                    <div class="bg-white p-3 rounded shadow">
                                        <p class="text-sm text-gray-600">CRE</p>
                                        <p class="text-lg font-semibold">{{ result.cre }} <span class="text-sm">({{
                                            getGrade(result.cre) }})</span></p>
                                    </div>
                                    <div class="bg-white p-3 rounded shadow">
                                        <p class="text-sm text-gray-600">Social Study</p>
                                        <p class="text-lg font-semibold">{{ result.socialStudy }} <span
                                                class="text-sm">({{ getGrade(result.socialStudy) }})</span></p>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4 p-4 bg-indigo-50 rounded-lg">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <p class="text-sm text-indigo-600">Mean Score</p>
                                        <p class="text-xl font-bold text-indigo-700">{{ result.meanScore.toFixed(2) }}
                                        </p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-indigo-600">Overall Grade</p>
                                        <p class="text-xl font-bold text-indigo-700">{{ getGrade(result.meanScore) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="p-6 text-center text-gray-500">
                    No results found
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { calculateGrade } from '~/utils/grading'

const route = useRoute()
const results = ref([])

const getGrade = calculateGrade

onMounted(async () => {
    try {
        const response = await $fetch('/api/student/results', {
            method: 'POST',
            body: {
                schoolCode: route.query.schoolCode,
                studentIndex: route.query.studentIndex
            }
        })
        results.value = response.results
    } catch (error) {
        console.error('Error fetching results:', error)
    }
})
</script>