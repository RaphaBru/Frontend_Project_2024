<template>
  <div class="return-to-user-page">
    <UButton icon="i-heroicons-arrow-left-end-on-rectangle" @click="goToUserPage">Return to my Journal</UButton>
  </div>
</template>

<script lang="js" setup>

const router = useRouter();
const user = useSupabaseUser();

const goToUserPage = () => {
  router.push(`/user-${user.value.id}`);
};
</script>

<style>
.return-to-user-page button{
  margin-top: 12px;
  background-color: maroon;
  color: white;
}

.return-to-user-page button:hover{
  background-color: rgb(98, 0, 0);
}
</style>