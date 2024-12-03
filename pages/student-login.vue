<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Student Results Portal
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Enter your school code and index number to view your results
                </p>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleStudentLogin">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="school-code" class="sr-only">School Code</label>
                        <input v-model="schoolCode" id="school-code" name="schoolCode" type="text" required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="School Code" />
                    </div>
                    <div>
                        <label for="index-number" class="sr-only">Index Number</label>
                        <input v-model="indexNumber" id="index-number" name="indexNumber" type="text" required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Index Number" />
                    </div>
                </div>

                <div>
                    <button type="submit" :disabled="isLoading"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {{ isLoading ? 'Loading...' : 'View Results' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
const router = useRouter()
const schoolCode = ref('')
const indexNumber = ref('')
const isLoading = ref(false)

const handleStudentLogin = async () => {
    isLoading.value = true
    try {
        const response = await $fetch('/api/student/results', {
            method: 'POST',
            body: {
                schoolCode: schoolCode.value,
                studentIndex: indexNumber.value
            }
        })

        if (response.results) {
            router.push({
                path: '/student/results',
                query: {
                    schoolCode: schoolCode.value,
                    studentIndex: indexNumber.value
                }
            })
        }
    } catch (error) {
        alert(error.message || 'Invalid school code or index number')
    } finally {
        isLoading.value = false
    }
}
</script>