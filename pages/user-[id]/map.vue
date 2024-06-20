<template>
  <NuxtLayout name="default-layout">
    <div>
      <h1>Hello</h1>
      <div class="svg-container">
        <div class="svg-wrapper" v-html="svgContent"></div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue';
import svgRaw from '~/assets/world.svg?raw';

const svgContent = ref(svgRaw);
const countriesToColor = ref(['Argentina']); // Add more country names as needed

const changeColor = () => {
  // Wait for the DOM to update
  nextTick(() => {
    const svgElement = document.querySelector('svg');
    if (svgElement) {
      countriesToColor.value.forEach(country => {
        const countryPaths = svgElement.querySelectorAll(`.${country}`);
        countryPaths.forEach(path => {
          path.setAttribute('fill', '#00ff00'); // Set your desired color here
        });
      });
    }
  });
};

onMounted(() => {
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
  border: 2px solid black; /* Adds a black border around the container */
}
</style>
