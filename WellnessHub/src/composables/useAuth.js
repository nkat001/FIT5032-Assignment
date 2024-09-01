import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

export const useAuth = () => {
    const router = useRouter();
    const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUserEmail = ref(localStorage.getItem('currentUserEmail'));
    const currentUser = ref(users.find(user => user.email === currentUserEmail.value));
    const userType = computed(() => currentUser.value?.userType || '');

    const login = (email, password) => {
        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUserEmail', user.email);
            isAuthenticated.value = true;
            currentUserEmail.value = user.email;
            router.push('/dashboard');
            return ''
        } else {
            return 'Invalid Credentials. Please try again.'
        }
    };

    const logout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUserEmail');
        isAuthenticated.value = false;
        currentUserEmail.value = null;
        router.push('/');
    };

    return {
        isAuthenticated,
        currentUser,
        userType,
        login,
        logout
    };
}
