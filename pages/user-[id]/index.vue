<template>
  <NuxtLayout name="default-layout">
    <div id="route-id">
      <div v-if="user">
        <div v-if="user.id === route.params.id">
          <div class = "global-css">
            Welcome!<br>
            You are logged in with {{ user.email }}.<br>
            On this page, you can create your personal Travel Journal.
          </div>

          <!-- Edit Entries Button -->
          <div class="maps-container">
            <UButton icon="i-heroicons-globe-europe-africa" @click="goToMapPage">Go to my Map</UButton>
          </div>
          
          <!-- Travel Input Form -->
          <div class="travel-form">
            <div>
              <label for="country">Country:</label>
              <input type="text" id="country" v-model="country" placeholder="Country" />
            </div>
            <div>
              <label for="year">Year:</label>
              <input type="number" id="year" v-model="year" />
            </div>
            <div>
              <label for="highlight">Highlight:</label>
              <select id="highlight" v-model="highlight">
                <option>Activities</option>
                <option>Culture</option>
                <option>Food</option>
                <option>Local People</option>
                <option>Nature</option>
                <option>Nightlife</option>
                <option>Shopping</option>
                <option>Sports</option>
              </select>
            </div>
            <div>
              <label for="score">Score:</label>
              <select id="score" v-model="score">
                <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <div>
              <UButton icon="i-heroicons-arrow-up-on-square" @click="submitTravel">Submit</UButton>
            </div>
          </div>

          <!-- Tabelle (Pinia Store, Supabase) -->  
          <!-- Nur anzeigen wenn Tabelle nicht leer ist -->
          <div v-if="tableStore.filteredData && tableStore.filteredData.length">

            <UCard id="data-table-container"> 
              <UTable id="data-table" :rows="tableStore.filteredData"/>
            </UCard>

            <!-- Edit Entries Button -->
            <div class="edit-entries-container">
              <UButton icon="i-heroicons-pencil-square" @click="goToEditPage">Edit Entries</UButton>
            </div>
    
          </div>

          <!-- Wenn die Tabelle leer ist: -->
          <div v-else id="data-table-container">
            Let's get started with your Travel Journal!
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

// Datenformular
const country = ref('');
const year = ref(new Date().getFullYear());
const highlight = ref('Activities');
const score = ref(10);

onMounted(() => {
  // Umleiten auf Index falls nicht eingeloggt
  if (!user.value) {
    console.log('No user is logged in');
    router.push('/');

  // Immer auf eigene Seite umleiten (url = user id)
  } else if (user.value.id !== route.params.id) {
    console.log('User ID does not match route parameter');
    router.push(`/user-${user.value.id}`);

  // Standardfall: Nutzer ist auf eigener Seite und eingeloggt
  } else {
    console.log('User is logged in:', user.value);
    tableStore.fetchData(); // Daten gleich beim mounten holen; Pinia Store für Datentabelle (Supabase)
  }
});

// Formular submitten - Button (an Supabase)
const submitTravel = async () => {
  // Pflichtfelder
  if (!country.value || !year.value || !highlight.value || !score.value) {
    alert('Please fill out all fields');
    return;
  }

  const { error } = await client.from('travel').insert([
    {
      country: country.value,
      year: parseInt(year.value, 10),
      highlight: highlight.value,
      score: parseInt(score.value, 10),
      user_id: user.value.id,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    alert('Submission failed: ' + error.message);
  } else {
    alert('Travel data submitted successfully!');
    tableStore.fetchData(); // Nach erfolgreicher submission Daten für Tabelle fetchen

    // Felder zurücksetzen
    country.value = '';
    year.value = new Date().getFullYear();
    highlight.value = 'Nature';
    score.value = 10;
  }
};

// Pinia Store für Datentabelle (Supabase)
const tableStore = useTableStore()
await callOnce(tableStore.fetchData)

// Navigate to Edit Page
const goToEditPage = () => {
  router.push(`/user-${user.value.id}/edit`);
};

// Navigate to Map Page
const goToMapPage = () => {
  router.push(`/user-${user.value.id}/map`);
};

</script>

<!-- END SCRIPT -->
<!-- START STYLE -->

<style scoped>

#data-table-container {
  margin-top: 12px;
}

.travel-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.travel-form div {
  display: flex;
  flex-direction: column;
}

.travel-form label {
  font-weight: bold;
}

.travel-form input, .travel-form select {
  padding: 5px;
  background-color: lightgray;
  font-size: 14px;
}

.travel-form button {
  background-color: maroon;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  align-self: flex-start;
}

.travel-form button:hover {
  background-color: rgb(98, 0, 0);
}

.edit-entries-container {
  margin-top: 12px;
}

.edit-entries-container button {
  background-color: maroon;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  align-self: flex-st art;
}

.edit-entries-container button:hover {
  background-color: rgb(98, 0, 0);
}

.maps-container {
  margin-top: 12px;
}

.maps-container button {
  background-color: maroon;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  align-self: flex-st art;
}

.maps-container button:hover {
  background-color: rgb(98, 0, 0);
}

</style>
