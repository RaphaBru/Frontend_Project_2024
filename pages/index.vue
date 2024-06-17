<template>
  <!-- https://nuxt.com/docs/guide/directory-structure/pages -->
  <NuxtLayout name="default-layout">
    <!-- Komponente benötigt kein import in script. Wird automatisch von nuxt importiert -->
    <header-example></header-example>
    <div class="global-css">
      <div><NuxtLink to="/page/1">Page 1</NuxtLink></div>
      <div><NuxtLink to="/page/2">Page 2</NuxtLink></div>
    </div>
    <UCard id="data-table-container">
      <UTable id="data-table" :rows="store.tableData"/>
    </UCard>

    <!-- Login/Register Form -->
    <div class="auth-container">
      <form @submit.prevent="handleAuth">
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
      </form>
      <button @click="toggleAuthMode">
        {{ isLogin ? 'Need an account? Register' : 'Already have an account? Login' }}
      </button>
    </div>

  </NuxtLayout>
</template>

<script setup lang="js">

// Beispiel: Daten aus Supabase Tabelle holen und anzeigen
import {useWebsiteStore} from "~/stores/website.js";
const store = useWebsiteStore()
await callOnce(store.fetchData)

// Login
import { ref } from 'vue';
import { useSupabaseClient } from '@supabase/supabase-js';

const email = ref('');
const password = ref('');
const isLogin = ref(true);

const client = useSupabaseClient();

const handleAuth = async () => {
  if (isLogin.value) {
    const { error } = await client.auth.signInWithPassword({ email: email.value, password: password.value });
    if (error) {
      alert('Login failed: ' + error.message);
    } else {
      alert('Login successful!');
    }
  } else {
    const { error } = await client.auth.signUp({ email: email.value, password: password.value });
    if (error) {
      alert('Registration failed: ' + error.message);
    } else {
      alert('Registration successful! Please check your email for verification.');
    }
  }
};

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value;
};

</script>

<style lang="css" scoped>

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
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.auth-container button:hover {
  background-color: #0056b3;
}

/* Beispiel */
#data-table-container {
  margin-top: 32px;
}

#data-table {
  max-height: 500px;
}
</style>