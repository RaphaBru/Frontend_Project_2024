<template>
  <NuxtLayout name="default-layout">
    <div class="intro-box">
      Welcome to Traveller!<br>
      Here you can create and manage your own Travel Journal.<br>
      Make entries about the countries you have visited, and visualize your travels on a world map.
    </div>
    <div class="map-container">
      <UCard id="sample-map" v-html="svgContent"></UCard>
    </div>

    <!-- Display if user is logged in -->
    <div v-if="user" class="personal-page-container">
      <button @click="goToPersonalPage" class="personal-page-button">Open my Travel Journal</button>
    </div>

    <!-- Login/Register Form if user is not logged in -->
    <div v-else class="auth-container">
      <form @submit.prevent="handleAuth">
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
      </form>
      <button class="auth-mode-button" @click="toggleAuthMode">
        {{ isLogin ? 'Need an account? Register' : 'Already have an account? Login' }}
      </button>
      <div>Log in to make your own Travel Journal!</div>
    </div>
  </NuxtLayout>
</template>

<!-- END TEMPLATE -->
<!-- START SCRIPT -->

<script setup lang="js">
import { ref } from 'vue';
import svgRaw from '~/assets/sample_map.svg?raw';

// Login
const email = ref('');
const password = ref('');
const isLogin = ref(true);

const client = useSupabaseClient();
const router = useRouter();
const user = useSupabaseUser();

const handleAuth = async () => {
  if (isLogin.value) {
    const { data, error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });
    if (error) {
      alert('Login failed: ' + error.message);
    } else {
      alert('Login successful!');
      router.push(`/user-${data.user.id}`);
    }
  } else {
    const { data, error } = await client.auth.signUp({
      email: email.value,
      password: password.value
    });
    if (error) {
      alert('Registration failed: ' + error.message);
    } else {
      alert('Registration successful! Please check your email for verification.');
      router.push(`/user-${data.user.id}`);
    }
  }
};

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value;
};

const goToPersonalPage = () => {
  if (user.value) {
    router.push(`/user-${user.value.id}`);
  }
};

// SVG content
const svgContent = ref(svgRaw);
</script>

<!-- END SCRIPT -->
<!-- START STYLE -->

<style scoped>
/* Login */
.auth-container {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-container form {
  display: flex;
  flex-direction: column;
  width: 300px;
}

.auth-container input {
  margin-bottom: 12px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.auth-container button {
  padding: 10px;
  background-color: maroon;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.auth-container button:hover {
  background-color: rgb(98, 0, 0);
}

.auth-mode-button {
  margin-top: 12px;
  margin-bottom: 12px;
}

/* Personal Page Button */
.personal-page-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.personal-page-button {
  background-color: maroon;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.personal-page-button:hover {
  background-color: rgb(98, 0, 0); /* Darker maroon for hover effect */
}

.intro-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 80%;
  padding: 8px;
  font-size: 20px;
  font-weight: bold;
  margin: 12px auto;
  border: 1px solid;
  border-radius: 4px;
}

/* SVG Container */
.map-container {
  display: flex;
  justify-content: center; /* Center the UCard horizontally */
  align-items: center; /* Center the UCard vertically */
  margin-top: 20px;
}

#sample-map {
  margin-top: 24px;
  padding: 10px;
  max-width: 80%; /* Make sure the SVG is responsive */
  box-sizing: border-box; /* Ensure padding is included in the element's total width and height */
  display: flex;
  justify-content: center; /* Center the SVG horizontally */
  align-items: center; /* Center the SVG vertically */
}

</style>
