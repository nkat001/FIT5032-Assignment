<template>
  <div class="container d-flex justify-content-center">
    <div v-if="user">
      <h6 class="mt-5 text-primary text-bold">Logged in as {{ user.email }} ({{ user.userType }})</h6>
      <h1 class="text-center border border-dark rounded p-3">
        Welcome Back, {{ user.username }}!
      </h1>
      <div class="text-center">
        <h2 class="font-weight-bold font-italic mt-5">Dashboard</h2>
        <h4>With Wellness Hub, get access to a range of resource!</h4>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, getDoc } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import db from '../../firebase/init';
import { getAuth } from 'firebase/auth';

export default {
  setup() {
    const user = ref(null)
    const fetchUser = async (userId) => {
      try {
        const userRef = doc(db, 'users', userId)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          user.value = { id: userSnap.id, ...userSnap.data() };
        } else {
          console.log('No such document!')
        }
      } catch (error) {
        console.error("Error occured while fetching: ", error)
      }
    }

    const auth = getAuth()
    onMounted(() => {
      const currentUser = auth.currentUser
      if (currentUser) {
        fetchUser(currentUser.uid)
      } else {
        console.log('No user logged in dashboard')
      }
    })

    return {
      user
    }
  }
}

</script>

<style scoped>
h1 {
  font-weight: bolder;
  font-size: xx-large;
}

p {
  font-size: large;
}

.logo {
  max-width: 100%;
  height: auto;
}
</style>