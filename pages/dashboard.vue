<template>
    <div v-if="pending" class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else-if="!user" class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="text-center">
            <p class="text-gray-600 mb-4">Please log in to access the dashboard</p>
            <NuxtLink to="/login"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Go to Login
            </NuxtLink>
        </div>
    </div>

    <div v-else class="min-h-screen bg-gray-100">
        <nav class="bg-white shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex">
                        <div class="flex-shrink-0 flex items-center">
                            <h1 class="text-xl font-bold">Digital Grading System</h1>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <span class="text-gray-700">Welcome, {{ user.name }}</span>
                        <button @click="logout" class="px-4 py-2 text-sm text-red-600 hover:text-red-900">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <main class="py-10">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div v-if="user.role === 'CHIEF_EXAMINER'">
                    <ExamUpload />
                </div>
                <div v-else-if="user.role === 'SCHOOL_HEAD'">
                    <SchoolResults :schoolCode="user.schoolCode" />
                </div>
                <div v-else>
                    <StudentResults :studentId="user.id" />
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
const user = useUser()
const router = useRouter()
const pending = ref(true)

// Check authentication status on component mount
onMounted(() => {
    const token = useState('auth-token').value
    if (!token) {
        user.value = null
        router.push('/login')
    }
    pending.value = false
})

const logout = () => {
    // Clear auth state
    useState('auth-token').value = null
    user.value = null
    router.push('/login')
}

// Add route middleware
definePageMeta({
    middleware: 'auth'
})
</script>