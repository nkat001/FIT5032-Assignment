<template>
    <div class="container">
        <header class="d-flex justify-content-center py-3">
            <ul class="nav nav-pills">
                <li class="nav-item">
                    <router-link to="/" class="nav-link" active-class="active">Home</router-link>
                </li>

                <li class="nav-item">
                    <router-link to="/firebase-signup" class="nav-link" active-class="active">Firebase Sign
                        Up</router-link>
                </li>

                <li class="nav-item">
                    <router-link to="/dashboard" class="nav-link" active-class="active"
                        v-if="isUserAuthenticated">Dashboard</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/review" class="nav-link" active-class="active"
                        v-if="isUserAuthenticated && userType === 'Patient'">Submit A Review</router-link>
                </li>
                <li class="nav-item ms-3">
                    <button class="btn btn-danger" v-if="isUserAuthenticated" @click="logout">Logout</button>
                    <router-link v-else to="/firebase-login" class="nav-link me" active-class="active">Firebase
                        Login</router-link>

                </li>
            </ul>
        </header>
    </div>
</template>

<script setup>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const auth = getAuth()
const isUserAuthenticated = ref(false)
const router = useRouter()


onAuthStateChanged(auth, (user) => {
    if (user) {
        isUserAuthenticated.value = !!user;
    }
})

function logout() {
    auth.signOut().then(() => {
        console.log("Logged out");
        router.push('/')
        window.location.href = '/'
    }).catch((error) => {
        console.log("Error occured while logging out: ", error);
    })
}
</script>
