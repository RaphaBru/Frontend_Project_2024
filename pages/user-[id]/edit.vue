<template>
  <NuxtLayout name="default-layout">
    <div id="route-id">
      <div v-if="user">
        <div v-if="user.id === route.params.id">
          <div class="global-css">
            Edit your Travel Journal here.
          </div>

          <Journal_Button></Journal_Button>

          <div class="edit-entries">
            <div v-for="entry in tableStore.tableData" :key="entry.id" class="edit-entry">
              <div class="edit-fields">
                <label :for="'country-' + entry.id">Country:</label>
                <input :id="'country-' + entry.id" type="text" v-model="entry.country" placeholder="Country" />

                <label :for="'year-' + entry.id">Year:</label>
                <input :id="'year-' + entry.id" type="number" v-model="entry.year" placeholder="Year" />

                <label :for="'highlight-' + entry.id">Highlight:</label>
                <select :id="'highlight-' + entry.id" v-model="entry.highlight">
                  <option>Activities</option>
                  <option>Culture</option>
                  <option>Food</option>
                  <option>Local People</option>
                  <option>Nature</option>
                  <option>Nightlife</option>
                  <option>Shopping</option>
                  <option>Sports</option>
                </select>

                <label :for="'score-' + entry.id">Score:</label>
                <select :id="'score-' + entry.id" v-model="entry.score">
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </div>
              <div class="edit-button-container">
                <UButton icon="i-heroicons-arrow-up-on-square" @click="() => validateAndUpdateEntry(entry)">Update</UButton>
                <UButton icon="i-heroicons-trash" @click="() => deleteEntry(entry.id)">Delete</UButton>
              </div>
            </div>
          </div>

          <!-- Wenn viele Einträge vorhanden sind: zusätzlicher Return Button unten. -->
          <Journal_Button v-if="hasFourOrMoreEntries"></Journal_Button>

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
const tableStore = useTableStore();
await callOnce(tableStore.fetchData);

const hasFourOrMoreEntries = computed(() => tableStore.tableData.length >= 4);

const validateAndUpdateEntry = async (entry) => {
  if (!entry.country || !entry.year || !entry.highlight || !entry.score) {
    alert('All fields must be filled out');
    return;
  }

  const { error } = await client.from('travel').update({
    country: entry.country,
    year: entry.year,
    highlight: entry.highlight,
    score: entry.score
  }).eq('id', entry.id);
  
  if (error) {
    console.error('Error when updating the data:', error);
  } else {
    tableStore.fetchData(); // Refresh data after update
  }
};

const deleteEntry = async (id) => {
  const { error } = await client.from('travel').delete().eq('id', id);
  if (error) {
    console.error('Error when deleting the data:', error);
  } else {
    tableStore.fetchData(); // Refresh data after delete
  }
};
</script>

<style scoped>
.edit-entries {
  margin-top: 20px;
}

.edit-entry {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.edit-fields {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.edit-fields label {
  font-weight: bold;
}

.edit-fields input, .edit-fields select {
  padding: 5px;
  background-color: lightgray;
  font-size: 14px;
}

.edit-button-container {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.edit-button-container button {
  background-color: maroon;
  color: white;
}

.edit-button-container button:hover {
  background-color: rgb(98, 0, 0);
}
</style>
