<template>
  <NuxtLayout name="default-layout">
    <div>
      <h1>Hello {{uniqueCountries}}</h1>
      <div class="svg-container">
        <div class="svg-wrapper" v-html="svgContent"></div>
      </div>
      <UCard id="data-table-container"> 
        <UTable id="data-table" :rows="mapStore.mapData"/>
      </UCard>
    </div>
  </NuxtLayout>
</template>

<script setup>

import svgRaw from '~/assets/world.svg?raw';

const mapStore = useMapStore()
await callOnce(mapStore.fetchData)

const svgContent = ref(svgRaw.replace(/name="([^"]+)"/g, (match, p1) => `name="${p1.replace(/\s+/g, '')}"`).replace(/class="([^"]+)"/g, (match, p1) => `class="${p1.replace(/\s+/g, '')}"`));

const uniqueCountries = computed(() => {
  const countries = new Set();
  mapStore.mapData.forEach(item => {
    countries.add(item.country.replace(/\s+/g, ''));
  });
  return Array.from(countries);
});

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
          path.setAttribute('fill', '#800000'); // Set your desired color here (maroon)
        });
      });
    }
  });
};

onMounted(() => {
  mapStore.fetchData();
  changeColor();
});
</script>

<style scoped>
.svg-container {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: flex-start; /* Aligns the container to the left */
}

.svg-wrapper {
  max-width: auto;
  border: 1.5px solid maroon; /* Adds a black border around the container */
}
</style>
