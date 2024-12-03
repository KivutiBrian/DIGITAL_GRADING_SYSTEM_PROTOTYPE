<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleSignup">
                <div class="rounded-md shadow-sm space-y-4">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                        <input v-model="formData.name" id="name" name="name" type="text" required
                            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Full name" />
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                        <input v-model="formData.email" id="email" name="email" type="email" required
                            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Email address" />
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <input v-model="formData.password" id="password" name="password" type="password" required
                            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Password" />
                    </div>

                    <div>
                        <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                        <select v-model="formData.role" id="role" name="role" required
                            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="STUDENT">Student</option>
                            <option value="SCHOOL_HEAD">School Head</option>
                            <option value="CHIEF_EXAMINER">Chief Examiner</option>
                        </select>
                    </div>

                    <div v-if="formData.role === 'SCHOOL_HEAD'">
                        <label for="schoolCode" class="block text-sm font-medium text-gray-700">School Code</label>
                        <input v-model="formData.schoolCode" id="schoolCode" name="schoolCode" type="text" required
                            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="School code" />
                    </div>
                </div>

                <div>
                    <button type="submit" :disabled="isLoading"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {{ isLoading ? 'Creating account...' : 'Sign up' }}
                    </button>
                </div>

                <div class="text-center">
                    <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
                        Already have an account? Sign in
                    </NuxtLink>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
const router = useRouter()
const isLoading = ref(false)
const formData = ref({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    schoolCode: ''
})

const handleSignup = async () => {
    isLoading.value = true
    try {
        const response = await $fetch('/api/auth/signup', {
            method: 'POST',
            body: formData.value
        })

        alert('Account created successfully! Please login.')
        router.push('/login')
    } catch (error) {
        alert(error.message || 'Error creating account')
    } finally {
        isLoading.value = false
    }
}
</script>