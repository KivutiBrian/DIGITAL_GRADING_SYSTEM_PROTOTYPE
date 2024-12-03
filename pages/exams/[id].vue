<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
                <NuxtLink to="/exams" class="text-indigo-600 hover:text-indigo-800">
                    ← Back to Exams
                </NuxtLink>
            </div>

            <div v-if="examResults">
                <!-- School Rankings -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">School Rankings</h2>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th
                                        class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rank</th>
                                    <th
                                        class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        School</th>
                                    <th
                                        class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mean Score</th>
                                    <th
                                        class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Grade</th>
                                    <th
                                        class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Students</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="(school, index) in examResults.schoolRankings" :key="school.schoolCode">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ index +
                                        1 }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ school.schoolName }}
                                        <span class="text-xs text-gray-400">({{ school.schoolCode }})</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ school.meanScore.toFixed(2) }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                                        <span :class="{
                                            'px-2 py-1 rounded-full text-xs font-semibold': true,
                                            'bg-green-100 text-green-800': getGrade(school.meanScore) === 'A',
                                            'bg-blue-100 text-blue-800': getGrade(school.meanScore) === 'B',
                                            'bg-yellow-100 text-yellow-800': getGrade(school.meanScore) === 'C',
                                            'bg-orange-100 text-orange-800': getGrade(school.meanScore) === 'D',
                                            'bg-red-100 text-red-800': getGrade(school.meanScore) === 'E' || getGrade(school.meanScore) === 'F'
                                        }">
                                            {{ getGrade(school.meanScore) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ school.studentCount }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Individual Results -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Individual Rankings</h2>
                    <ResultsTable :results="examResults.individualResults" :is-chief-examiner="true" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { calculateGrade } from '~/utils/grading'

const route = useRoute()
const user = useUser()
const { data: examResults } = await useFetch(`/api/exams/${route.params.id}/results`)
const getGrade = calculateGrade
</script>