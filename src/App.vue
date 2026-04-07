<template>
  <Navbar v-if="!$route.meta.hideNavbar" />
  <main :class="{ 'content-padding': !isHeroPage }">
    <RouterView />
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/layout/NavBar.vue'

const route     = useRoute()
const authStore = useAuthStore()

const isHeroPage = computed(() => route.path === '/')

<<<<<<< HEAD
onMounted(async () => {
  await authStore.restoreSession()
})
=======
>>>>>>> fea440a824b84a4f2f2238add03213681d392707
</script>

<style>
.center-screen-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}
</style> 