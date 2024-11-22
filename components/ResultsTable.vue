<template>
    <div class="space-y-4">
        <!-- Search Box -->
        <div class="max-w-md mx-auto mb-8">
            <label for="search" class="block text-sm font-medium text-gray-700">Search by Index Number</label>
            <div class="mt-1 relative rounded-md shadow-sm">
                <input type="text" v-model="searchQuery"
                    class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter index number..." />
            </div>
        </div>

        <!-- Results Table -->
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            School</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            English</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mathematics</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Science</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRE
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Social Study</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mean
                            Score</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(result, index) in filteredResults" :key="result.id"
                        :class="{ 'bg-indigo-50': result.studentIndex === searchQuery }">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ index + 1 }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ result.studentName }}
                            <span class="text-xs text-gray-400">({{ result.studentIndex }})</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ result.schoolName }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ result.english }}
                            <span class="text-xs ml-1">({{ getGrade(result.english) }})</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ result.mathematics }}
                            <span class="text-xs ml-1">({{ getGrade(result.mathematics) }})</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ result.science }}
                            <span class="text-xs ml-1">({{ getGrade(result.science) }})</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ result.cre }}
                            <span class="text-xs ml-1">({{ getGrade(result.cre) }})</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ result.socialStudy }}
                            <span class="text-xs ml-1">({{ getGrade(result.socialStudy) }})</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ result.meanScore.toFixed(2) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <span :class="{
                                'px-2 py-1 rounded-full text-xs font-semibold': true,
                                'bg-green-100 text-green-800': getGrade(result.meanScore) === 'A',
                                'bg-blue-100 text-blue-800': getGrade(result.meanScore) === 'B',
                                'bg-yellow-100 text-yellow-800': getGrade(result.meanScore) === 'C',
                                'bg-orange-100 text-orange-800': getGrade(result.meanScore) === 'D',
                                'bg-red-100 text-red-800': getGrade(result.meanScore) === 'E' || getGrade(result.meanScore) === 'F'
                            }">
                                {{ getGrade(result.meanScore) }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { calculateGrade } from '~/utils/grading'

const props = defineProps({
    results: {
        type: Array,
        required: true
    }
})

const searchQuery = ref('')
const getGrade = calculateGrade

const filteredResults = computed(() => {
    if (!searchQuery.value) return props.results
    return props.results.filter(result =>
        result.studentIndex.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})
</script>