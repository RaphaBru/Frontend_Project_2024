<template>
  <NuxtLayout name="default-layout">
    <div id="route-id">
      <div v-if="user">
        <div v-if="user.id === route.params.id">
          <div class="global-css">
            Let's take a look at where you've been!
          </div>

          <!-- <div class="return-to-user-page">
            <UButton icon="i-heroicons-arrow-left-end-on-rectangle" @click="goToUserPage">Return to my Journal</UButton>
          </div> -->
          <Journal_Button></Journal_Button>

          <div class="svg-container">
            <div class="svg-wrapper" v-html="svgContent"></div>
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

<script setup>

//  Routing
const route = useRoute();
const router = useRouter();
const user = useSupabaseUser();

// Pinia Store für Datentabelle (Supabase)
const mapStore = useMapStore()
await callOnce(mapStore.fetchData)

// SVG
import svgRaw from '~/assets/world.svg?raw';
// Leerzeichen bei Ländernamen entfernen für spätere Abfrage
const svgContent = ref(svgRaw.replace(/name="([^"]+)"/g, (match, p1) => `name="${p1.replace(/\s+/g, '')}"`).replace(/class="([^"]+)"/g, (match, p1) => `class="${p1.replace(/\s+/g, '')}"`));

// Länder laden, nur 1x bei Mehrfacheinträgen
const uniqueCountries = computed(() => {
  const countries = new Set();
  mapStore.mapData.forEach(item => {
    countries.add(item.country.replace(/\s+/g, ''));
  });
  return Array.from(countries);
});

// Farbe ändern
const changeColor = () => {
  // Wait for the DOM to update
  nextTick(() => {
    const svgElement = document.querySelector('svg');
    if (svgElement) {
      uniqueCountries.value.forEach(country => {
        const countryPathsByName = svgElement.querySelectorAll(`[name="${country}"]`);
        const countryPathsByClass = svgElement.querySelectorAll(`.${country}`);
        const countryPaths = [...countryPathsByName, ...countryPathsByClass];
        
        countryPaths.forEach(path => {
          path.setAttribute('fill', '#800000');
        });
      });
    }
  });
};


onMounted(() => {
  // Umleiten auf Index falls nicht eingeloggt
  if (!user.value) {
    console.log('No user is logged in');
    router.push('/');

  // Immer auf eigene Seite umleiten (url = user id)
  } else if (user.value.id !== route.params.id) {
    console.log('User ID does not match route parameter');
    router.push(`/user-${user.value.id}/map`);

  // Standardfall: Nutzer ist auf eigener Seite und eingeloggt
  } else {
    console.log('User is logged in:', user.value);
    mapStore.fetchData();
    changeColor();
  }
});

// Navigate to User Page
const goToUserPage = () => {
  router.push(`/user-${user.value.id}`);
};

</script>

<style scoped>
.svg-container {
  margin-top: 12px;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-start; /* Aligns the container to the left */
}

.svg-wrapper {
  max-width: auto;
  border: 1.5px solid maroon; /* Adds a black border around the container */
}

.return-to-user-page button{
  margin-top: 12px;
  background-color: maroon;
  color: white;
}

.return-to-user-page button:hover{
  background-color: rgb(98, 0, 0);
}

</style>
