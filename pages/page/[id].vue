<template>
  <NuxtLayout name="default-layout">
    <div id="route-id">
      <div v-if="user">
        <div v-if="user.id === route.params.id">
          <div>
            Welcome!<br>
            You are logged in as {{ user.email }}.
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
                <option>Nature</option>
                <option>Food</option>
                <option>Culture</option>
                <option>Shopping</option>
                <option>Activities</option>
                <option>Nightlife</option>
                <option>Sports</option>
                <option>Local People</option>
              </select>
            </div>
            <div>
              <label for="score">Score:</label>
              <select id="score" v-model="score">
                <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <div>
              <button @click="submitTravel">Submit</button>
            </div>
          </div>

        </div>
        <div v-else>
          <div>Access Denied. Redirecting to your page...</div>
        </div>
      </div>
      <div v-else>
        <div>No user is logged in. Redirecting to login...</div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="js">

const route = useRoute();
const router = useRouter();
const user = useSupabaseUser();
const client = useSupabaseClient();

// Form data
const country = ref('');
const year = ref(new Date().getFullYear());
const highlight = ref('Nature');
const score = ref(10);

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

const submitTravel = async () => {
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
      user: user.value.id,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    alert('Submission failed: ' + error.message);
  } else {
    alert('Travel data submitted successfully!');
    // Optionally clear the form
    country.value = '';
    year.value = new Date().getFullYear();
    highlight.value = 'Nature';
    score.value = 1;
  }
};

</script>

<style scoped>
#route-id {
  padding: 8px;
  font-size: 20px;
  font-weight: bold;
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
  background-color: #800000;
}
</style>
