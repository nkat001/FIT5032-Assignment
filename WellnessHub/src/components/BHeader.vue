<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm nav-styles">
        <div class="container">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav nav-ul">
                    <li class="nav-item" style="color: white;">
                        <router-link to="/" class="nav-link" active-class="active">Home</router-link>
                    </li>
                    <li class="nav-item" v-if="!isUserAuthenticated">
                        <router-link to="/firebase-signup" class="nav-link" active-class="active">Sign Up</router-link>
                    </li>
                    <li class="nav-item" v-if="!isUserAuthenticated">
                        <router-link to="/firebase-login" class="nav-link" active-class="active">Login</router-link>
                    </li>
                    <li class="nav-item" v-if="isUserAuthenticated">
                        <router-link to="/dashboard" class="nav-link" active-class="active">Dashboard</router-link>
                    </li>
                    <li class="nav-item" v-if="isUserAuthenticated && user?.userType === 'Patient'">
                        <router-link to="/review" class="nav-link" active-class="active">Submit A Review</router-link>
                    </li>
                    <li class="nav-item"
                        v-if="isUserAuthenticated && (user?.userType === 'Staff' || user?.userType === 'Admin')">
                        <router-link to="/send-email" class="nav-link" active-class="active">Email</router-link>
                    </li>
                    <li class="nav-item" v-if="isUserAuthenticated && user?.userType === 'Admin'">
                        <router-link to="/send-bulk-emails" class="nav-link" active-class="active">Bulk
                            Emails</router-link>
                    </li>
                    <li class="nav-item" v-if="isUserAuthenticated && user?.userType === 'Patient'">
                        <router-link to="/clinics" class="nav-link" active-class="active">Clinics</router-link>
                    </li>
                    <li class="nav-item" v-if="isUserAuthenticated && user?.userType === 'Admin'">
                        <router-link to="/users" class="nav-link" active-class="active">User Information</router-link>
                    </li>
                    <li class="nav-item ms-3" v-if="isUserAuthenticated">
                        <button class="btn btn-outline-light" @click="logout">Logout</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>


<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import db from '../../firebase/init';
import { doc, getDoc } from 'firebase/firestore';

export default {
    setup() {
        const user = ref(null);
        const isUserAuthenticated = ref(false);
        const router = useRouter();

        const logout = () => {
            const auth = getAuth();
            auth.signOut().then(() => {
                console.log("Logged out");
                router.push('/');
                // window.location.href = '/';
            }).catch((error) => {
                console.log("Error occurred while logging out: ", error);
            });
        };

        const fetchUser = async (userId) => {
            try {
                const userRef = doc(db, 'users', userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    user.value = { id: userSnap.id, ...userSnap.data() };
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error("Error occurred while fetching user data:", error);
            }
        };

        onMounted(() => {
            const auth = getAuth();
            onAuthStateChanged(auth, (firebaseUser) => {
                if (firebaseUser) {
                    isUserAuthenticated.value = true;
                    fetchUser(firebaseUser.uid);
                } else {
                    isUserAuthenticated.value = false;
                    console.log('No user logged in');
                }
            });
        });

        return {
            user,
            isUserAuthenticated,
            logout
        };
    }
};
</script>

<style scoped>
.nav-styles {
    background-color: #577399 !important;
}

.nav-ul li a {
    color: black;
    text-decoration: none;
}

.nav-ul li a.active {
    color: white;
}
</style>