<template>
  <NuxtLayout name="default-layout">
    <div id="route-id">
      <div v-if="user">
        <div v-if="user.id === route.params.id">
          <div>
            Welcome!<br>
            You are logged in as {{ user.email }}.
          </div>

        </div>
        <!-- Nutzer nicht auf eigener Seite -->
        <div v-else>
          <div>Access Denied. Redirecting to your page...</div>
        </div>
      </div>
      <!-- Nicht eingeloggt -->
      <div v-else>
        <div>No user is logged in. Redirecting to login...</div>
      </div>
    </div>
  </NuxtLayout>
</template>

<!-- END TEMPLATE -->
<!-- START SCRIPT -->

<script setup lang="js">

//  Routing
const route = useRoute();
const router = useRouter();
const user = useSupabaseUser();
const client = useSupabaseClient();

onMounted(() => {
  // Umleiten auf Index falls nicht eingeloggt
  if (!user.value) {
    console.log('No user is logged in');
    router.push('/');

  // Immer auf eigene Seite umleiten (url = user id)
  } else if (user.value.id !== route.params.id) {
    console.log('User ID does not match route parameter');
    router.push(`/user-${user.value.id}/edit`);

  // Standardfall: Nutzer ist auf eigener Seite und eingeloggt
  } else {
    console.log('User is logged in:', user.value);
    tableStore.fetchData(); // Daten gleich beim mounten holen; Pinia Store für Datentabelle (Supabase)
  }
});

// Pinia Store für Datentabelle (Supabase)
import {useTableStore} from "~/stores/datatable.js";
const tableStore = useTableStore()
await callOnce(tableStore.fetchData)

</script>

<!-- END SCRIPT -->
<!-- START STYLE -->

<style>

</style>