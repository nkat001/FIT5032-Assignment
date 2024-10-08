<template>
    <div class="container">
        <header class="d-flex justify-content-center py-3">
            <ul class="nav nav-pills">
                <li class="nav-item">
                    <router-link to="/" class="nav-link" active-class="active">Home</router-link>
                </li>

                <li class="nav-item">
                    <router-link to="/firebase-signup" v-if="!isUserAuthenticated" class="nav-link"
                        active-class="active">Sign
                        Up</router-link>
                </li>

                <li class="nav-item">
                    <router-link to="/dashboard" class="nav-link" active-class="active"
                        v-if="isUserAuthenticated">Dashboard</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/review" class="nav-link" active-class="active"
                        v-if="isUserAuthenticated && user?.userType === 'Patient'">Submit A Review</router-link>
                </li>
                <li class="nav-item ms-3">
                    <button class="btn btn-danger" v-if="isUserAuthenticated" @click="logout">Logout</button>
                    <router-link v-else to="/firebase-login" class="nav-link me" active-class="active">
                        Login</router-link>
                </li>
            </ul>
        </header>
    </div>
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
