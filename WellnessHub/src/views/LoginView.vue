<template>
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
                <h1 class="p-5 text-center">Login</h1>
                <form @submit.prevent="submitForm">
                    <div class="row mb-3">
                        <div class="col-12 mb-3">
                            <label for="email" class="form-label">E-mail</label><br />
                            <input type="email" id="email" name="email" class="form-control"
                                @blur="() => validateEmail(true)" @input="() => validateEmail(false)"
                                v-model="formData.email" />
                            <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
                        </div>
                        <div class="col-12 mb-3">
                            <label for="password" class="form-label">Password</label><br />
                            <input type="password" id="password" name="password" class="form-control"
                                @blur="() => validatePassword(true)" @input="() => validatePassword(false)"
                                v-model="formData.password" />
                            <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
                        </div>
                        <div class="col-12 mb-3">
                        </div>
                        <div class="col-12 text-center mt-3">
                            <button type="submit" class="btn btn-primary">Login</button>
                            <p class="m-3">Don't have an account yet? <a href="/signup">Sign Up</a></p>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const formData = ref({
    email: '',
    password: '',
})

const errors = ref({
    email: null,
    password: null,
})

const validateEmail = (blur) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.value.email)) {
        errors.value.email = blur ? 'Email is invalid' : null;
    } else {
        errors.value.email = null;
    }
}

const validatePassword = (blur) => {
    if (formData.value.password === '') {
        errors.value.password = blur ? 'Password cannot be empty' : null
    } else {
        errors.value.password = null;
    }
}

const submitForm = () => {
    validateEmail(true)
    validatePassword(true)

    if (!errors.value.email && !errors.value.password) {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user && user.email === formData.value.email && user.password === formData.value.password) {
            localStorage.setItem('isAuthenticated', 'true')
            alert('Login successfull!')
            router.push('/dashboard')
        } else {
            alert('Invalid username or password')
        }
    }
}
</script>

<style scoped></style>