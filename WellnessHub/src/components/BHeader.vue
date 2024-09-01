<template>
    <div class="container">
        <header class="d-flex justify-content-center py-3">
            <ul class="nav nav-pills">
                <li class="nav-item">
                    <router-link to="/signup" class="nav-link" active-class="active">Sign Up</router-link>
                </li>
                <li class="nav-item" v-if="isAuthenticated">
                    <router-link to="/dashboard" class="nav-link" active-class="active">Dashboard</router-link>
                </li>
                <li class="nav-item" v-if="isAuthenticated && userType === 'Patient'">
                    <router-link to="/review" class="nav-link" active-class="active">Submit A Review</router-link>
                </li>
                <li class="nav-item ms-3">
                    <button class="btn btn-danger" v-if="isAuthenticated" @click="logout">Logout</button>
                    <router-link v-else to="/login" class="nav-link" active-class="active">Login</router-link>
                </li>
            </ul>
        </header>
    </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth';

const { isAuthenticated, userType, logout } = useAuth();
</script>
