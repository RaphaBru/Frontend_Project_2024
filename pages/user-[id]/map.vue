<template>
  <NuxtLayout name="default-layout">
    <div>
      <h1>Hello</h1>
      <div class="svg-container" v-html="svgContent"></div>
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
h1 {
  text-align: center;
  margin-top: 20px;
}

.svg-container {
  display: flex;
  justify-content: center;
}

.svg-container svg {
  max-width: 80%; /* Adjust as needed */
  height: auto;
}
</style>
