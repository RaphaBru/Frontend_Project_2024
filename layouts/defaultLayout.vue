<template>
  <!-- https://nuxt.com/docs/guide/directory-structure/layouts -->
  <div class="banner">
    <NuxtLink to="/">
      <img :src="logo" alt="Logo" class="banner-logo">
    </NuxtLink>
    <span class="banner-title">Traveller</span>
    <div v-if="user" class="navigation">
      <select @change="handleAction($event)">
        <option disabled selected value>Navigation</option>
        <option value="journal">Travel Journal</option>
        <option value="map">My Map</option>
        <option value="edit">Edit Journal</option>
        <option value="logout">Logout</option>
      </select>
    </div>
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

const handleAction = (event) => {
  const action = event.target.value;
  const userId = user.value.id;

  if (action === 'journal') {
    router.push(`/user-${userId}`);
  } else if (action === 'map') {
    router.push(`/user-${userId}/map`);
  } else if (action === 'edit') {
    router.push(`/user-${userId}/edit`);
  } else if (action === 'logout') {
    logout();
  }
};
</script>

<style scoped>
.banner {
  background-color: maroon;
  color: white;
  padding: 15px;
  font-size: 28px;
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

.navigation {
  font-size: 20px;
}

.navigation select {
  background-color: grey;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 5px;
  cursor: pointer;
}

.navigation select:hover {
  background-color: #5e6063;
}

@media (max-width: 600px) {
  .banner {
    flex-direction: column;
  }

  .user-actions {
    margin-top: 10px;
  }
}
</style>
