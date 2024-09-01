<template>
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-8 col-lg-6 offset-md-2 offset-lg-3">
                <h1 class="p-5 text-center">Sign Up</h1>
                <form @submit.prevent="submitForm">
                    <div class="row mb-3">
                        <div class="col-12 mb-3">
                            <label for="username" class="form-label">Username</label><br />
                            <input type="text" id="username" name="username" class="form-control" autocomplete="off"
                                @blur="() => validateName(true)" @input="() => validateName(false)"
                                v-model="formData.username" />
                            <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
                        </div>
                        <div class="col-12 mb-3">
                            <label for="email" class="form-label">E-mail</label><br />
                            <input type="email" id="email" name="email" class="form-control" autocomplete="off"
                                @blur="() => validateEmail(true)" @input="() => validateEmail(false)"
                                v-model="formData.email" />
                            <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
                        </div>
                        <div class="col-12">
                            <label for="userType" class="form-label">User Type</label><br />
                            <select id="userType" class="form-select" v-model="formData.userType"
                                @blur="() => validateUserType(true)" @input="() => validateUserType(false)">
                                <option value="" disabled>Select User Type</option>
                                <option value="Patient">Patient</option>
                                <option value="Staff">Staff</option>
                            </select>
                            <div v-if="errors.userType" class="text-danger">{{ errors.userType }}</div>
                        </div>
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
                            <label for="confirm-password" class="form-label">Confirm Password</label><br />
                            <input type="password" id="confirm-password" name="confirm-password" class="form-control"
                                v-model="formData.confirmPassword" @blur="() => validateConfirmPassword(true)" />
                            <div v-if="errors.confirmPassword" class="text-danger">
                                {{ errors.confirmPassword }}
                            </div>
                        </div>
                    </div>
                    <div class="col-12 text-center mt-3">
                        <button type="submit" class="btn btn-primary">Sign Up</button>
                        <p class="m-3">Already have an account? <a href="/login">Login</a></p>
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

    if (!errors.value.username && !errors.value.userType && !errors.value.email && !errors.value.password && !errors.value.confirmPassword) {
        let users=JSON.parse(localStorage.getItem('users')) || []
        users.push({
            username: formData.value.username,
            email: formData.value.email,
            userType: formData.value.userType,
            password: formData.value.password
        })
        localStorage.setItem('users', JSON.stringify(users))
        alert('Signup successful! You can now log in.')
        window.location.href = '/login'
    }
}
</script>

<style scoped></style>