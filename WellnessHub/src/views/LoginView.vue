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
                        <div class="row">
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
                                <p class="m-3">Don't have an account yet? <a href="">Sign Up</a></p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
    username: '',
    email: '',
    userType: '',
    password: '',
    confirmPassword: '',
})

const submittedCards = ref([])
const errors = ref({
    username: null,
    email: null,
    userType: null,
    password: null,
    confirmPassword: null,
})

const validateName = (blur) => {
    if (formData.value.username.length < 3) {
        errors.value.username = blur ? 'Username must be at least 3 characters long' : null
    }
}

const validateEmail = (blur) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.value.email)) {
        errors.value.email = blur ? 'Email is invalid' : null;
    } else {
        errors.value.email = null;
    }
}

const validateUserType = (blur) => {
    if (formData.value.userType === '') {
        errors.value.userType = blur ? 'User type cannot be empty' : null
    } else {
        errors.value.userType = null
    }
}

const validatePassword = (blur) => {
    const password = formData.value.password
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasSpecChar = /[!@#$%&*(),.|:;]/.test(password)

    if (password.length < minLength) {
        errors.value.password = blur ? 'Password must be at least 8 characters long' : null
    } else if (!hasUpperCase) {
        errors.value.password = 'Password must have at least one uppercase letter'
    } else if (!hasLowerCase) {
        errors.value.password = 'Password must have at least one lowercase letter'
    } else if (!hasSpecChar) {
        errors.value.password = 'Password must have at least one special character'
    } else {
        errors.value.password = null
    }
}

const validateConfirmPassword = (blur) => {
    if (formData.value.confirmPassword !== formData.value.password) {
        if (blur) errors.value.confirmPassword = 'Passwords do not match'
    } else {
        errors.value.confirmPassword = null
    }
}

const submitForm = () => {
    validateName(true)
    validatePassword(true)
    validateUserType(true)
    validateUserType(true)
    validateConfirmPassword(true)
}
</script>

<style scoped></style>