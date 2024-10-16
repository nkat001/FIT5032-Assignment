<template>
  <div class="container d-flex justify-content-center mt-5">
    <div v-if="user">
      <h6 class="mt-5 text-primary text-bold">Logged in as {{ user.email }} ({{ user.userType }})</h6>
      <h1 class="text-center border border-dark rounded p-3">
        Welcome Back, {{ user.username }}!
      </h1>
      <div class="text-center m-5">
        <div v-if="user.userType === 'Admin'">
          <h4>Number of Patients = {{ patients }}</h4>
          <h4>Number of Staff = {{ staff }}</h4>
        </div>
        <h4 v-else>With Wellness Hub, get access to a range of resource!</h4>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import db from '../../firebase/init';
import { getAuth } from 'firebase/auth';

export default {
  setup() {
    const patients = ref(0)
    const staff = ref(0)
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
    const fetchUserData = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const users = usersSnapshot.docs.map(doc => doc.data());

      users.forEach(user => {
        if (user.userType === 'Patient') patients.value++;
        if (user.userType === 'Staff') staff.value++;
      });
    };

    const auth = getAuth()
    onMounted(() => {
      const currentUser = auth.currentUser
      if (currentUser) {
        fetchUser(currentUser.uid)
        fetchUserData()
      } else {
        console.log('No user logged in dashboard')
      }
    })

    return {
      user,
      patients,
      staff
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