<template>
  <div id="route-id">
    <div v-if="user">
      <div v-if="user.id === route.params.id">
        Herzlich Willkommen!
        Du bist eingeloggt mit {{ user.email }}
        <button @click="logout">Logout</button>
      </div>
      <div v-else>
        <div>Access Denied. Redirecting to your page...</div>
      </div>
    </div>
    <div v-else>
      <div>No user is logged in. Redirecting to login...</div>
    </div>
  </div>
</template>

<script setup lang="js">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Get the current route
const route = useRoute();
const router = useRouter();

// Get the current user (handled automatically by Nuxt)
const user = useSupabaseUser();

// Handle redirection if no user is logged in or if user ID doesn't match route parameter
onMounted(() => {
  if (!user.value) {
    console.log('No user is logged in');
    router.push('/');
  } else if (user.value.id !== route.params.id) {
    console.log('User ID does not match route parameter');
    router.push(`/page/${user.value.id}`);
  } else {
    console.log('User is logged in:', user.value);
  }
});

// Logout function
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

// Dynamically update the head for the page
useHead({
  title: 'My Page',
  meta: [
    { name: 'description', content: 'My amazing site.' }
  ],
  bodyAttrs: {
    class: 'test'
  }
});
</script>

<style scoped lang="css">
#route-id {
  padding: 8px;
  font-size: 20px;
  font-weight: bold;
}
</style>