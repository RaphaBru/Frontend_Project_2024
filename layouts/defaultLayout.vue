<template>
  <!-- https://nuxt.com/docs/guide/directory-structure/layouts -->
  <div class="banner">
    <NuxtLink to="/">
      <img :src="logo" alt="Logo" class="banner-logo">
    </NuxtLink>
    <span class="banner-title">Traveller</span>
    <button v-if="user" @click="logout" class="logout-button">Logout</button>
  </div>
  <UContainer>
    <slot/>
  </UContainer>
</template>

<script setup lang="js">
import logo from '~/assets/globe.svg';

const user = useSupabaseUser();
const router = useRouter();

const logout = async () => {
  const client = useSupabaseClient();
  const { error } = await client.auth.signOut();
  if (error) {
    alert('Logout failed: ' + error.message);
  } else {
    alert('Logout successful!');
    router.push('/');
  }
};
</script>

<style scoped>
.banner {
  background-color: maroon;
  color: white;
  padding: 15px;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  position: relative;
}

.banner-logo {
  height: 45px; /* Adjust as needed */
  margin-right: 0px;
}

.banner-title {
  flex-grow: 1;
  text-align: center;
}

.logout-button {
  background-color: grey;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #0056b3;
}

@media (max-width: 600px) {
  .banner {
    flex-direction: column;
  }

  .logout-button {
    margin-top: 10px;
    position: static;
    transform: none;
  }
}
</style>