<template>
  <div class="container d-flex justify-content-center">
    <div>
      <h6 class="mt-5 text-primary text-bold">Logged in as {{ userEmail }} ({{ currentUser.userType }})</h6>
      <h1 class="text-center border border-dark rounded p-3">
        Welcome Back, {{ currentUser.username }}!
      </h1>
      <div class="text-center">
        <h2 class="font-weight-bold font-italic mt-5">Dashboard</h2>
        <p class="text-bold mt-3">One in five Australians experience a mental health disorder in any given year. Early
          intervention and support can make a significant difference, so don't hesitate to reach out if you or someone
          you know needs help.</p>
        <h4>Join Wellness Hub today and get access to a range of resource!</h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
const users = JSON.parse(localStorage.getItem('users')) || []
const currentUserEmail = localStorage.getItem('currentUserEmail')
const currentUser = ref(users.find(user => user.email === currentUserEmail))
const userEmail = computed(() => currentUser.value.email)
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