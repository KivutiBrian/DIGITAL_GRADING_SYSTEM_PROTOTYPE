<template>
    <div class="max-w-4xl mx-auto p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Exam Code Input -->
            <div>
                <label for="examCode" class="block text-sm font-medium text-gray-700">Exam Code</label>
                <div class="mt-1">
                    <input id="examCode" v-model="examCode" type="text" required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="e.g., SSCPE2024" :disabled="isLoading" />
                </div>
                <p v-if="errors.examCode" class="mt-1 text-sm text-red-600">{{ errors.examCode }}</p>
            </div>

            <!-- Description Input -->
            <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                <div class="mt-1">
                    <textarea id="description" v-model="description" required rows="3"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        :disabled="isLoading"></textarea>
                </div>
                <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
            </div>

            <!-- File Upload -->
            <div>
                <label for="file" class="block text-sm font-medium text-gray-700">Results File (CSV)</label>
                <div class="mt-1">
                    <input id="file" type="file" ref="fileInput" accept=".csv" @change="handleFileChange"
                        class="mt-1 block w-full" required :disabled="isLoading" />
                </div>
                <p class="mt-2 text-sm text-gray-500">
                    File must be CSV format with headers: SCHOOL_CODE, SCHOOL_NAME, STUDENT_INDEX, STUDENT_NAME,
                    ENGLISH, MATHEMATICS, SCIENCE, CRE, SOCIAL_STUDY
                </p>
                <p v-if="errors.file" class="mt-1 text-sm text-red-600">{{ errors.file }}</p>
            </div>

            <!-- Submit Button -->
            <div>
                <button type="submit" :disabled="isLoading"
                    class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
                    <span v-if="isLoading" class="inline-flex items-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        Uploading...
                    </span>
                    <span v-else>Upload Results</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
const examCode = ref('')
const description = ref('')
const selectedFile = ref(null)
const isLoading = ref(false)
const router = useRouter()
const errors = ref({})

const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0]
    errors.value.file = null
}

const clearErrors = () => {
    errors.value = {}
}

const validateForm = () => {
    clearErrors()
    let isValid = true

    if (!examCode.value.trim()) {
        errors.value.examCode = 'Exam code is required'
        isValid = false
    }

    if (!description.value.trim()) {
        errors.value.description = 'Description is required'
        isValid = false
    }

    if (!selectedFile.value) {
        errors.value.file = 'Please select a file'
        isValid = false
    }

    return isValid
}

const handleSubmit = async () => {
    if (!validateForm()) {
        return
    }

    isLoading.value = true
    clearErrors()

    try {
        // Create the exam
        const examResponse = await $fetch('/api/exams', {
            method: 'POST',
            body: {
                examCode: examCode.value.trim(),
                description: description.value.trim()
            }
        })

        // Upload the results
        const formData = new FormData()
        formData.append('file', selectedFile.value)

        await $fetch(`/api/exams/upload?examId=${examResponse.id}`, {
            method: 'POST',
            body: formData
        })

        // Redirect to exam results page
        router.push(`/exams/${examResponse.id}`)
    } catch (error) {
        const message = error.data?.message || error.message || 'An error occurred'
        if (error.statusCode === 400) {
            // Handle validation errors
            if (message.includes('code')) {
                errors.value.examCode = message
            } else if (message.includes('description')) {
                errors.value.description = message
            } else {
                errors.value.file = message
            }
        } else {
            // Handle other errors
            alert(message)
        }
    } finally {
        isLoading.value = false
    }
}
</script>